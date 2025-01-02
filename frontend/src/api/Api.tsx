import axios, {AxiosError, AxiosResponse, InternalAxiosError, InternalAxiosRequestConfig,} from 'axios';
import {Path as Path} from '../ToBeMoved/Tools/Path';
import userDataManager from '../ToBeMoved/CommonComponents/UserDataManager';
import {useNavigate} from 'react-router-dom';
import {defaultServerAddress} from '@config/defaultServerAddress';
import BusyEvent from '../ToBeMoved/CommonComponents/BusyEvent';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    raw?: boolean;
  }

  export interface InternalAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
    raw?: boolean;
  }

  export interface InternalAxiosError extends AxiosError {
    config: InternalAxiosRequestConfig;
  }
}

const setAccessToken = (config: InternalAxiosRequestConfig) => {
  const accessToken = sessionStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
};

export const Interceptors = () => {
  const { ForceLogout } = userDataManager();
  const navigate = useNavigate();
  const { SetBusyWithMessage, ResetBusyState } = BusyEvent();

  async function refreshToken() {
    const refreshResponse = await axios.post(
      '/account/refresh',
      {
        accessToken: sessionStorage.getItem('accessToken'),
        refreshToken: sessionStorage.getItem('refreshToken'),
      },
      { _retry: true }
    );
    const newAccessToken = refreshResponse?.data.accessToken;
    const newRefreshToken = refreshResponse?.data.refreshToken;
    if (!newAccessToken) {
      ForceLogout();
    } else {
      sessionStorage.setItem('accessToken', newAccessToken);
      sessionStorage.setItem('refreshToken', newRefreshToken);
    }
  }

  async function HandleErrNetwork(config: InternalAxiosRequestConfig<any>) {
    if (config && !config._retry) {
      try {
        if (sessionStorage.getItem('accessToken')) {
          await refreshToken();
          if (sessionStorage.getItem('accessToken')) return axios(config);
        }
      } catch (refreshError) {
        ForceLogout();
      }
    } else {
      ForceLogout();
    }
    return Promise.resolve(null);
  }

  function HandleErrCanceled() {
    console.log('connection canceled..');
    return Promise.resolve(null);
  }

  function HandleErrWithResponse(
    response: AxiosResponse<any>,
    config: InternalAxiosRequestConfig<any>
  ) {
    const statusCode = response?.status;
    if (statusCode === 401) {
      return HandleErrNetwork(config);
    }
    if (statusCode === 404) {
    } else if (statusCode === 500) {
      navigate(Path.ServerError);
    }
  }

  async function httpErrorHandler(error: InternalAxiosError) {
    const response = error?.response;
    const config = error?.config;

    if (error.code == 'ERR_NETWORK' && config) {
      return HandleErrNetwork(config);
    }
    if (error.code == 'ERR_CANCELED') {
      return HandleErrCanceled();
    }
    if (response) {
      return HandleErrWithResponse(response, config);
    }

    return Promise.resolve(null);
  }

  const responseHandler = (response: AxiosResponse<any>) => {
    ResetBusyState();
    return response;
  };

  const responseErrorHandler = (error: InternalAxiosError) => {
    ResetBusyState();
    return error.config?.raw ? Promise.reject(error) : httpErrorHandler(error);
  };

  function requestHandler(config: InternalAxiosRequestConfig) {
    SetBusyWithMessage('Trwa wczytywanie danych');
    if (config.url && !config.url.startsWith(defaultServerAddress!)) {
      config.url = defaultServerAddress + config.url;
    }
    return setAccessToken(config);
  }

  function requestErrorHandler(error: AxiosError) {
    ResetBusyState();
    return Promise.reject(error);
  }

  function SetInterceptors() {
    axios.interceptors.request.use(requestHandler, requestErrorHandler);
    axios.interceptors.response.use(responseHandler, responseErrorHandler);
  }

  return { SetInterceptors };
};

export default axios;
