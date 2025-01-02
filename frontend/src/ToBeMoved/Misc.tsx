import {AxiosResponse} from 'axios';

export function CopyResponseToSessionStorage(response: AxiosResponse<any>) {
    Object.entries(response?.data).forEach(([key, value]) => {
        sessionStorage.setItem(key, value as string);
    });
}