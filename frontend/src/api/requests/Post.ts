import Api from '../Api';
import { RegisterData } from 'RegisterData';
import { ForgotPasswordData } from 'ForgotPasswordData';
import { ResetPasswordData } from 'ResetPasswordData';
import { UserData } from 'User/UserData';

const post = (url: string, data: any, raw?: boolean) =>
  Api.post(url, data, { raw: raw });

export const registerUser = (data: RegisterData) =>
  post('/account/register', data, true).then(
    (response: { status: number; data: any }) => response?.data
  );

export const forgotPassword = (data: ForgotPasswordData) =>
  post('/account/forgotPassword', data, true);

export const resetPassword = (data: ResetPasswordData) =>
  post('/account/passwordReset', data, true);

export const addCruise = (data: any) => post(`/api/Cruises`, data);

export const loginUser = (credentials: any) =>
  post('/account/login', credentials, true);

export const addUser = (userData: any) => post('/users', userData, true);

export const addCruiseApplication = (data: any) =>
  post('/api/CruiseApplications/', data);

export const requestEmail = (user: UserData) =>
  Api.post('/Account/emailConfirmationRequest', { email: user.email });
