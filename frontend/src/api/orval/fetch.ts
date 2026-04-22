import config from '@config';

import type { AuthDetails } from '@/user/models/AuthDetails';
import { getStoredAuthDetails, setStoredAuthDetails } from '@/user/services/StoredAuthDetails';

type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpirationDate: string;
  refreshTokenExpirationDate: string;
};

const emptyBodyStatuses = new Set([204, 205, 304]);

let refreshPromise: Promise<AuthDetails | undefined> | undefined;

export class ApiError<TData = unknown> extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: TData,
    public readonly headers: Headers
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ErrorType<TData = unknown> = ApiError<TData>;
export type BodyType<TBody> = TBody;

export async function orvalFetch<TResponse>(url: string, options: RequestInit = {}): Promise<TResponse> {
  return sendRequest<TResponse>(url, options, false);
}

function getRequestUrl(url: string) {
  const baseUrl = config.apiUrl.endsWith('/') ? config.apiUrl : `${config.apiUrl}/`;

  if (url.startsWith('http://') || url.startsWith('https://')) {
    const parsedUrl = new URL(url);
    return new URL(`${parsedUrl.pathname}${parsedUrl.search}`, baseUrl).toString();
  }

  return new URL(url, baseUrl).toString();
}

function isRefreshRequest(url: string) {
  return new URL(getRequestUrl(url)).pathname.toLowerCase().endsWith('/account/refresh');
}

function getAuthorizedHeaders(options: RequestInit, authDetails: AuthDetails | undefined) {
  const headers = new Headers(options.headers);

  if (authDetails?.accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${authDetails.accessToken}`);
  }

  return headers;
}

async function sendRequest<TResponse>(url: string, options: RequestInit, retried: boolean): Promise<TResponse> {
  const authDetails = getStoredAuthDetails();
  const requestUrl = getRequestUrl(url);
  const response = await fetch(requestUrl, {
    ...options,
    headers: getAuthorizedHeaders(options, authDetails),
  });

  if (response.status === 401 && !retried && !isRefreshRequest(url)) {
    const refreshedAuthDetails = await getRefreshedAuthDetails();

    if (refreshedAuthDetails) {
      const retryHeaders = new Headers(options.headers);
      retryHeaders.set('Authorization', `Bearer ${refreshedAuthDetails.accessToken}`);

      return sendRequest<TResponse>(
        url,
        {
          ...options,
          headers: retryHeaders,
        },
        true
      );
    }
  }

  const data = await getResponseBody(response);

  if (!response.ok) {
    throw new ApiError(response.statusText || 'Request failed', response.status, data, response.headers);
  }

  return data as TResponse;
}

async function getRefreshedAuthDetails() {
  if (!refreshPromise) {
    refreshPromise = refreshAuthDetails().finally(() => {
      refreshPromise = undefined;
    });
  }

  return refreshPromise;
}

async function refreshAuthDetails() {
  const currentAuthDetails = getStoredAuthDetails();

  if (!currentAuthDetails) {
    return undefined;
  }

  const response = await fetch(getRequestUrl('/account/refresh'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken: currentAuthDetails.accessToken,
      refreshToken: currentAuthDetails.refreshToken,
    }),
  });

  const data = await getResponseBody(response);

  if (!response.ok) {
    setStoredAuthDetails(undefined);
    throw new ApiError(response.statusText || 'Session refresh failed', response.status, data, response.headers);
  }

  const refreshTokenResponse = data as RefreshTokenResponse;
  const refreshedAuthDetails: AuthDetails = {
    accessToken: refreshTokenResponse.accessToken,
    refreshToken: refreshTokenResponse.refreshToken,
    accessTokenExpirationDate: new Date(refreshTokenResponse.accessTokenExpirationDate),
    refreshTokenExpirationDate: new Date(refreshTokenResponse.refreshTokenExpirationDate),
  };

  setStoredAuthDetails(refreshedAuthDetails);
  return refreshedAuthDetails;
}

async function getResponseBody(response: Response): Promise<unknown> {
  if (emptyBodyStatuses.has(response.status) || response.headers.get('content-length') === '0') {
    return undefined;
  }

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';

  if (contentType.includes('json')) {
    const text = await response.text();
    return text ? JSON.parse(text) : undefined;
  }

  if (contentType.includes('application/pdf') || contentType.includes('application/octet-stream')) {
    return response.blob();
  }

  return response.text();
}
