import axios, {
    AxiosError, AxiosRequestConfig,
    AxiosResponse, InternalAxiosError,
    InternalAxiosRequestConfig,
} from 'axios';
import { Path as Path } from '../ToBeMoved/Tools/Path';
import userDataManager, { IsUserLoggedIn } from '../ToBeMoved/CommonComponents/UserDataManager';
import { useNavigate } from 'react-router-dom';
import { defaultServerAddress } from '@config/defaultServerAddress';
import BusyEvent from '../ToBeMoved/CommonComponents/BusyEvent';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;


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
    const { ForceLogout, UserLoggedIn } = userDataManager();
    const navigate = useNavigate();
    const { SetBusyWithMessage, ResetBusyState } = BusyEvent();


    async function refreshToken() {
        const refreshResponse = await axios.post('/account/refresh', {
            accessToken: sessionStorage.getItem('accessToken'),
            refreshToken: sessionStorage.getItem('refreshToken'),
        }, { _retry: true });
        const newAccessToken = refreshResponse?.data.accessToken;
        if (!newAccessToken)
            ForceLogout();
        else
            sessionStorage.setItem('accessToken', newAccessToken);
    }

    async function HandleErrNetwork(config: InternalAxiosRequestConfig<any>) {
        if (config && !config._retry) {
            try {
                if (sessionStorage.getItem('accessToken')) {
                    await refreshToken();
                    return Promise.resolve(null);
                }
            } catch (refreshError) {
                ForceLogout();
            }
        } else
            ForceLogout();
        return Promise.resolve(null);
    }

    function HandleErrCanceled() {
        console.log('connection canceled..');
    }

    function HandleErrWithResponse(response: AxiosResponse<any>) {
        const { ForceLogout } = userDataManager();

        const statusCode = response?.status;
        if (statusCode == 401) {
            ForceLogout();
        }
        if (statusCode === 404) {
        } else if (statusCode === 500) {
            navigate(Path.ServerError);
        }
    }

    function HandleErrWithoutResponse() {
        // ForceLogout()
    }

    async function httpErrorHandler(error: InternalAxiosError) {
        const response = error?.response;
        const request = error?.request;
        const config = error?.config;

        if (error.code == 'ERR_NETWORK' && config) {
            return HandleErrNetwork(config);
        } else {
            if (error.code == 'ERR_CANCELED') {
                HandleErrCanceled();
            } else {
                if (response) {
                    HandleErrWithResponse(response);
                } else {
                    if (request) {
                        HandleErrWithoutResponse();
                    } else {
                    }
                }
            }
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
        SetBusyWithMessage('waiting');
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
