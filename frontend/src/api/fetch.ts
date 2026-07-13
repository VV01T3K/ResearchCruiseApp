import config from '@/config';
import { AuthDetails } from '@/models/user/AuthDetails';
import { getStoredAuthDetails, setStoredAuthDetails } from '@/providers/StoredAuthDetails';

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpirationDate: string;
  refreshTokenExpirationDate: string;
};

let refreshPromise: Promise<AuthDetails | undefined> | undefined;

export class ApiError<T = unknown> extends Error {
  constructor(
    public readonly status: number,
    public readonly data: T
  ) {
    super(`API request failed with status ${status}`);
  }
}

export type ErrorType<T = unknown> = ApiError<T>;
export type BodyType<T> = T;

export function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  return send<T>(url, options, false);
}

async function send<T>(url: string, options: RequestInit, retried: boolean): Promise<T> {
  const headers = new Headers(options.headers);
  const auth = getStoredAuthDetails();
  if (auth?.accessToken && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${auth.accessToken}`);

  const response = await fetch(new URL(url, `${config.apiUrl.replace(/\/$/, '')}/`), { ...options, headers });
  if (response.status === 401 && !retried && !url.endsWith('/v2/auth/refresh')) {
    const refreshed = await refreshAuth();
    if (refreshed) {
      headers.set('Authorization', `Bearer ${refreshed.accessToken}`);
      return send<T>(url, { ...options, headers }, true);
    }
  }

  const data = await responseBody(response);
  if (!response.ok) throw new ApiError(response.status, data);
  return data as T;
}

export function refreshAuth() {
  if (!refreshPromise) refreshPromise = doRefresh().finally(() => (refreshPromise = undefined));
  return refreshPromise;
}

async function doRefresh() {
  const auth = getStoredAuthDetails();
  if (!auth) return undefined;

  const response = await fetch(new URL('v2/auth/refresh', `${config.apiUrl.replace(/\/$/, '')}/`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessToken: auth.accessToken, refreshToken: auth.refreshToken }),
  });
  if (!response.ok) {
    setStoredAuthDetails(undefined);
    throw new ApiError(response.status, await responseBody(response));
  }

  const data = (await response.json()) as RefreshResponse;
  const refreshed: AuthDetails = {
    ...data,
    accessTokenExpirationDate: new Date(data.accessTokenExpirationDate),
    refreshTokenExpirationDate: new Date(data.refreshTokenExpirationDate),
  };
  setStoredAuthDetails(refreshed);
  return refreshed;
}

async function responseBody(response: Response): Promise<unknown> {
  if ([204, 205, 304].includes(response.status) || response.headers.get('content-length') === '0') return undefined;

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
  if (contentType.includes('json')) {
    const text = await response.text();
    return text ? JSON.parse(text) : undefined;
  }
  if (contentType.includes('application/pdf') || contentType.includes('application/octet-stream'))
    return response.blob();
  const text = await response.text();
  if (text.startsWith('{') || text.startsWith('[')) {
    try {
      return JSON.parse(text);
    } catch {
      // Keep non-JSON text responses as text.
    }
  }
  return text;
}
