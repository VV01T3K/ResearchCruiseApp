import Api from '../Api';
import { RegisterData } from 'RegisterData';
import { ForgotPasswordData } from 'ForgotPasswordData';
import {ResetPasswordData} from "ResetPasswordData";

const post = (url: string, data: any, raw?: boolean) =>
    Api.post(url, data, { raw: raw });

export const registerUser = (data: RegisterData) =>
    post('/account/register', data, true).then(
        (response: { status: number; data: any }) => response?.data,
    );

export const forgotPassword = (data: ForgotPasswordData) =>
    post('/account/forgotPassword', data, true);

export const resetPassword = (data: ResetPasswordData) =>
    post('/account/passwordReset', data, true);
