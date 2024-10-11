import Api from '../Api';
import { AxiosRequestConfig } from 'axios';

const patch = (url: string, data: any, raw?: boolean) => Api.patch(url, data, { raw: raw } as AxiosRequestConfig);

export const changePassword = (data: ChangePasswordData) =>
    patch('/account/password', data, true);
