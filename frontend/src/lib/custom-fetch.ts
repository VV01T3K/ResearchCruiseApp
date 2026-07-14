import config from '@/config';
import type { ProblemDetails } from '@/api/generated/schemas';
import { getValidAccessToken, refreshSession } from '@/lib/auth-session';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly problem?: ProblemDetails
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getProblemDetail(error: unknown, fallback: string) {
  return error instanceof ApiError ? (error.problem?.detail ?? fallback) : fallback;
}

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

export async function customFetch<T>(url: string, options: RequestInit): Promise<T> {
  const isAuthRequest = url.startsWith('/v2/auth/');
  const token = isAuthRequest ? undefined : await getValidAccessToken();
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response = await fetch(config.apiUrl + url, { ...options, headers });
  if (response.status === 401 && token) {
    const refreshed = await refreshSession();
    if (refreshed) {
      headers.set('Authorization', `Bearer ${refreshed.accessToken}`);
      response = await fetch(config.apiUrl + url, { ...options, headers });
    }
  }

  const body = await parseResponse(response);
  if (!response.ok) {
    const problem = typeof body === 'object' && body !== null ? (body as ProblemDetails) : undefined;
    throw new ApiError(problem?.detail ?? `Request failed with status ${response.status}`, response.status, problem);
  }

  return body as T;
}
