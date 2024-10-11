import Api from '../Api';
import { RegisterData } from 'RegisterData';
import { ResetData } from 'ResetData';

const post = (url: string, data: any, raw?: boolean) =>
    Api.post(url, data, { raw: raw });

export const registerUser = (data: RegisterData) =>
    post('/account/register', data, true).then(
        (response: { status: number; data: any }) => response.data,
    );

export const resetPassword = (data: ResetData) =>
    post('/account/resetPassword', data, true);
