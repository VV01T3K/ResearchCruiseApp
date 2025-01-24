import config from '@config';
import axios from 'axios';

export const client = axios.create({
  baseURL: config.apiUrl,
});

export function setAuthToken(token: string) {
  client.defaults.headers.Authorization = `Bearer ${token}`;
}

export function clearAuthToken() {
  delete client.defaults.headers.Authorization;
}
