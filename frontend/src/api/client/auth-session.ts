import type { TokenResponse } from '@/api/generated/schemas';
import { refreshTokens } from '@/api/generated/endpoints/auth.gen';
import type { AuthDetails } from '@/api/client/user';

const subscribers = new Set<(details: AuthDetails | undefined) => void>();
let refreshPromise: Promise<AuthDetails | undefined> | undefined;
let session: AuthDetails | undefined;
let sessionState: 'unknown' | 'authenticated' | 'anonymous' = 'unknown';

export class SessionRefreshError extends Error {
  constructor(
    cause: unknown,
    readonly unauthorized: boolean
  ) {
    super('Session refresh failed', { cause });
    this.name = 'SessionRefreshError';
  }
}

export function toAuthDetails(response: TokenResponse): AuthDetails {
  return {
    accessToken: response.accessToken,
    accessTokenExpirationDate: new Date(response.accessTokenExpirationDate),
    refreshTokenExpirationDate: new Date(response.refreshTokenExpirationDate),
  };
}

export function setSession(details: AuthDetails | undefined) {
  session = details;
  sessionState = details ? 'authenticated' : 'anonymous';
  subscribers.forEach((subscriber) => subscriber(details));
}

export function getSession() {
  return session;
}

export function subscribeAuthDetails(subscriber: (details: AuthDetails | undefined) => void) {
  subscribers.add(subscriber);
  return () => {
    subscribers.delete(subscriber);
  };
}

async function refresh(): Promise<AuthDetails | undefined> {
  try {
    let response: TokenResponse;
    try {
      response = await refreshTokens();
    } catch (error) {
      const status = typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined;
      if (status !== 409) throw error;

      // Another tab can win refresh-token rotation. Give the shared cookie time to settle, then retry once.
      await new Promise((resolve) => setTimeout(resolve, 100));
      response = await refreshTokens();
    }

    const details = toAuthDetails(response);
    setSession(details);
    return details;
  } catch (error) {
    const unauthorized =
      typeof error === 'object' && error !== null && 'status' in error && error.status === 401;
    if (unauthorized) setSession(undefined);
    throw new SessionRefreshError(error, unauthorized);
  }
}

export function refreshSession() {
  refreshPromise ??= refresh().finally(() => {
    refreshPromise = undefined;
  });
  return refreshPromise;
}

export async function getValidAccessToken() {
  if (sessionState === 'anonymous') return undefined;
  if (session && session.accessTokenExpirationDate.getTime() - Date.now() > 30_000) return session.accessToken;
  return (await refreshSession())?.accessToken;
}
