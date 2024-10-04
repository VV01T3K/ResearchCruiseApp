import axios, {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {Path as Path} from "./Path";
import userDataManager from "../CommonComponents/UserDataManager";
import {useNavigate} from "react-router-dom";
import {Simulate} from "react-dom/test-utils";


const defaultServerAddress = 'http://localhost:8080';

declare module 'axios' {
    export interface AxiosRequestConfig {
        raw?: boolean;
    }
}
declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        _retry?: boolean;
    }
}

const setAccessToken = (config: InternalAxiosRequestConfig) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken)
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
};


async function refreshToken () {

    const refreshResponse = await axios.post('/account/refresh', {
        accessToken: sessionStorage.getItem('accessToken'),
        refreshToken:  sessionStorage.getItem('refreshToken')})
    const newAccessToken = refreshResponse?.data.accessToken;
    sessionStorage.setItem('accessToken', newAccessToken);
}

export const Interceptors = () => {
    const {ForceLogout} = userDataManager()
    const navigate = useNavigate()
    async function HandleErrNetwork(config: InternalAxiosRequestConfig<any>) {
        if(config && !config._retry) {
            config._retry = true;
            try {
                // if(sessionStorage.getItem('accessToken'))
                    await refreshToken()
                // return axios(config);
            } catch (refreshError) {
                ForceLogout()
            }
        }
        ForceLogout()
    }

    function HandleErrCanceled() {
        console.log('connection canceled..')
    }
    function HandleErrWithResponse(response: AxiosResponse<any>){
        const {ForceLogout} = userDataManager()

        const statusCode = response?.status
        if( statusCode == 400 || statusCode == 401){
            // ForceLogout()
        }
        if (statusCode === 404){

        }
        else if (statusCode === 500)
            navigate(Path.ServerError)
    }
    function HandleErrWithoutResponse(){
        // ForceLogout()
    }
    async function httpErrorHandler(error: AxiosError) {
        const response = error?.response
        const request = error?.request
        const config = error?.config

        if (error.code === 'ERR_NETWORK' && config)
            return HandleErrNetwork(config)
        else if (error.code === 'ERR_CANCELED')
            HandleErrCanceled()
        else if (response)
            HandleErrWithResponse(response)
        else if (request)
            HandleErrWithoutResponse()
        else {

        }

        return Promise.resolve(null)
    }

    const responseHandler = (response: AxiosResponse<any>) => response

    const responseErrorHandler = (error: AxiosError) =>
        error.config?.raw ? Promise.reject(error) : httpErrorHandler(error)

    function requestHandler(config: InternalAxiosRequestConfig) {
        if (config.url && !config.url.startsWith('http'))
            config.url = defaultServerAddress + config.url;
        return setAccessToken(config);
    }

    function SetInterceptors() {
        axios.interceptors.request.use(
            requestHandler,
            (error) => Promise.reject(error)
        );
        axios.interceptors.response.use(responseHandler, responseErrorHandler)
    }
    return {SetInterceptors}
}

export default axios