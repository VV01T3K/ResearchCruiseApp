import type { TokenResponse } from '@/api/generated/schemas';
import { refreshTokens } from '@/api/generated/endpoints/auth.gen';
import type { AuthDetails } from '@/api/client/user';

const subscribers = new Set<(details: AuthDetails | undefined) => void>();
const concurrentRefreshWaiters = new Set<(details: AuthDetails) => void>();
let refreshPromise: Promise<AuthDetails | undefined> | undefined;
let session: AuthDetails | undefined;
let sessionState: 'unknown' | 'authenticated' | 'anonymous' = 'unknown';
let sessionRevision = 0;

const authChannel =
  typeof window === 'undefined' || typeof window.BroadcastChannel === 'undefined'
    ? undefined
    : new window.BroadcastChannel('rca-auth-session');

authChannel?.addEventListener('message', (event: MessageEvent<TokenResponse>) => {
  updateSession(toAuthDetails(event.data), false);
});

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

function updateSession(details: AuthDetails | undefined, broadcast: boolean) {
  session = details;
  sessionState = details ? 'authenticated' : 'anonymous';
  sessionRevision += 1;
  subscribers.forEach((subscriber) => subscriber(details));
  if (details) concurrentRefreshWaiters.forEach((waiter) => waiter(details));
  if (details && broadcast) {
    authChannel?.postMessage({
      accessToken: details.accessToken,
      accessTokenExpirationDate: details.accessTokenExpirationDate.toISOString(),
      refreshTokenExpirationDate: details.refreshTokenExpirationDate.toISOString(),
    } satisfies TokenResponse);
  }
}

export function setSession(details: AuthDetails | undefined) {
  updateSession(details, true);
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
  const revisionBeforeRefresh = sessionRevision;
  try {
    let details: AuthDetails;
    try {
      details = toAuthDetails(await refreshTokens());
    } catch (error) {
      const status = typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined;
      if (status !== 409) throw error;

      const concurrentSession = await waitForConcurrentRefresh(revisionBeforeRefresh);
      if (!concurrentSession) throw error;
      return concurrentSession;
    }

    setSession(details);
    return details;
  } catch (error) {
    const unauthorized =
      typeof error === 'object' && error !== null && 'status' in error && error.status === 401;
    if (unauthorized) setSession(undefined);
    throw new SessionRefreshError(error, unauthorized);
  }
}

function waitForConcurrentRefresh(revisionBeforeRefresh: number) {
  if (sessionRevision !== revisionBeforeRefresh && session) return Promise.resolve(session);

  return new Promise<AuthDetails | undefined>((resolve) => {
    const timeout = setTimeout(() => {
      concurrentRefreshWaiters.delete(onSession);
      resolve(undefined);
    }, 5_000);
    const onSession = (details: AuthDetails) => {
      clearTimeout(timeout);
      concurrentRefreshWaiters.delete(onSession);
      resolve(details);
    };
    concurrentRefreshWaiters.add(onSession);
  });
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
