import config from '@config';
import { refreshToken } from '@core/auth';
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

export const client = axios.create({
  baseURL: config.apiUrl,
});

export function setAuthToken(token: string) {
  client.defaults.headers.Authorization = `Bearer ${token}`;
}

export function clearAuthToken() {
  delete client.defaults.headers.Authorization;
}

createAuthRefreshInterceptor(client, refreshToken, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
});
