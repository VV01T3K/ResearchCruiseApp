import axios from 'axios';
const defaultServerAddress = 'http://localhost:8080';
export const setUpInterceptors = (navigate, setUserData) => {

const setAccessToken = (config: { url?: string; headers?: any; }) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
};


async function refreshToken () {
    const refreshResponse = await axios.post('/account/refresh', {
        refreshToken:  sessionStorage.getItem('refreshToken'),
    })
    const newAccessToken = refreshResponse.data.accessToken;
    sessionStorage.setItem('accessToken', newAccessToken);
}

const handleResponseError = async (error: {

    code: string;
    response: { status: number; }, config: any })=> {
    const originalRequest = error.config;

    if(error.code == "ERR_NETWORK" && !originalRequest._retry && error.response.status != null) {

        originalRequest._retry = true;

        try {
            await refreshToken()
            // Try the original request with th new access token
            return axios(originalRequest);
        }
        catch (refreshError) {
            sessionStorage.clear()
            setUserData(null)
            navigate('/forcedLogout')
        }
    }

    if (error.response) {
        if (error.response.status === 500) {
            navigate('/serverError')
        }
    }

    return Promise.reject(error);
};


    axios.interceptors.request.use(
        function (config): { url?: string; headers?: any } {
            if (config.url && !config.url.startsWith('http')) {
                config.url = defaultServerAddress + config.url;
            }
            return setAccessToken(config);
        },
        function (error: any) {
            console.log("błąd")
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        function (response: any) {
            // Wykonuje się po otrzymaniu poprawnej odpowiedzi
            return response;
        },
        function (error: { response: { status: number }, config: any }) {
            // Wykonuje się w przypadku błędu odpowiedzi
            return handleResponseError(error);
        }
    );
}


export default axios