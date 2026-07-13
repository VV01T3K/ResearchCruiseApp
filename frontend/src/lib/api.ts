import config from '@/config';
import axios from 'axios';

import { AuthDetails } from '@/models/user/AuthDetails';

export const client = axios.create({
  baseURL: config.apiUrl,
});

export type ProblemDetails = {
  detail?: string;
};

export function setAuthToken(authDetails: AuthDetails | undefined) {
  if (authDetails && authDetails.accessToken) {
    client.defaults.headers.Authorization = `Bearer ${authDetails.accessToken}`;
  } else {
    delete client.defaults.headers.Authorization;
  }
}
