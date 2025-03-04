import config from '@config';
import axios from 'axios';

import { AuthDetails } from '@/user/models/AuthDetails';

export const client = axios.create({
  baseURL: config.apiUrl,
});

export function setAuthToken(authDetails: AuthDetails | undefined) {
  if (authDetails && authDetails.accessToken) {
    client.defaults.headers.Authorization = `Bearer ${authDetails.accessToken}`;
  } else {
    delete client.defaults.headers.Authorization;
  }
}
