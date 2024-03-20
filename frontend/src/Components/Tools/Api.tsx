import axios from 'axios';

const defaultServerAddress = 'http://localhost:8080';

const setAccessToken = (config: { url?: string; headers?: any; }) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
};


async function refreshToken () {
    const refreshResponse = await axios.post('/token/refresh', {
        refreshToken:  sessionStorage.getItem('refreshToken'),
    })
    const newAccessToken = refreshResponse.data.accessToken;
    sessionStorage.setItem('accessToken', newAccessToken);
}

const handleResponseError = async (error: {

    code: string;
    response: { status: number; }, config: any })=> {

    if(error.code == "ERR_NETWORK") {
        console.log(error)
        sessionStorage.clear()
        window.location.href = '/forcedLogout'
        return Promise.reject(error)
    }

    if (error.response) {
        console.log(error)
        const originalRequest = error.config;

        // Check if the error is a result of a not valid token
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await refreshToken()
                // Try the original request with th new access token
                return axios(originalRequest);
            }
            catch (refreshError) {
                sessionStorage.clear()
                window.location.href = '/forcedLogout'
            }
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
        return  handleResponseError(error);
    }
);


export default axios