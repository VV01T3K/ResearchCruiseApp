import axios from 'axios';
import {useNavigate} from "react-router-dom";

const defaultServerAddress = 'http://localhost:8080';


// Funkcja do ustawiania nagłówków z tokenem dostępu
const setAccessToken = (config: { url?: string; headers?: any; }) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
};

const handleResponseError = async (error: { response: { status: number; }, config: any }) => {
    // Tutaj możesz dostosować obsługę błędów w zależności od potrzeb
    if (error.response) {
        const originalRequest = error.config;

        // Sprawdź, czy błąd wynika z nieważnego tokenu
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = sessionStorage.getItem('refreshToken');

                // Wywołaj endpoint do odświeżania tokenu
                const refreshResponse = await axios.post('/refresh-token', {
                    refreshToken: refreshToken,
                });

                const newAccessToken = refreshResponse.data.accessToken;

                // Zapisz nowy token dostępowy
                sessionStorage.setItem('accessToken', newAccessToken);

                // Ponów pierwotne żądanie z nowym tokenem dostępowym
                return axios(originalRequest);
            } catch (refreshError) {
                sessionStorage.clear()
                const navigate = useNavigate()
                navigate("/forcedLogout")
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
        return handleResponseError(error);
    }
);

export default axios