import config from '@/config';
import type { HttpValidationProblemDetails } from '@/api/generated/schemas';
import { connectionStatus } from '@/features/connection/status';
import { getValidAccessToken, refreshSession } from '@/integrations/auth/session';
import { classifyError } from '@/integrations/sentry/mutations';
import { ApiError, responseErrorMessage } from './errors';

export type ErrorType<_Error> = ApiError;

async function parseResponse(response: Response) {
  if (response.status === 204 || response.status === 205) return null;
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function send(url: string, init: RequestInit) {
  const outageAtStart = connectionStatus.get().outage;
  try {
    const response = await fetch(url, init);
    if ([502, 503, 504].includes(response.status)) connectionStatus.suspect();
    const body = await parseResponse(response);
    if (response.ok) connectionStatus.recover(outageAtStart);
    return { response, body };
  } catch (error) {
    if (classifyError(error) === 'network') connectionStatus.suspect();
    throw error;
  }
}

export async function customFetch<T>(url: string, options: RequestInit): Promise<T> {
  const isSessionBootstrapRequest = ['/auth/login', '/auth/refresh', '/auth/session'].includes(url);
  const token = isSessionBootstrapRequest ? undefined : await getValidAccessToken();
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let { response, body } = await send(config.apiUrl + url, { ...options, credentials: 'include', headers });
  if (response.status === 401 && token) {
    const refreshed = await refreshSession();
    if (refreshed) {
      headers.set('Authorization', `Bearer ${refreshed.accessToken}`);
      ({ response, body } = await send(config.apiUrl + url, { ...options, credentials: 'include', headers }));
    }
  }

  if (!response.ok) {
    const problem = typeof body === 'object' && body !== null ? (body as HttpValidationProblemDetails) : undefined;
    throw new ApiError(responseErrorMessage(response.status, problem), response.status, problem);
  }

  return body as T;
}
