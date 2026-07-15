import config from '@/config';
import type { TokenResponse } from '@/api/generated/schemas';
import { getStoredAuthDetails, setStoredAuthDetails } from '@/api/auth-storage';
import type { AuthDetails } from '@/api/user';

const subscribers = new Set<(details: AuthDetails | undefined) => void>();
let refreshPromise: Promise<AuthDetails | undefined> | undefined;

export function toAuthDetails(response: TokenResponse): AuthDetails {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    accessTokenExpirationDate: new Date(response.accessTokenExpirationDate),
    refreshTokenExpirationDate: new Date(response.refreshTokenExpirationDate),
  };
}

export function setSession(details: AuthDetails | undefined) {
  setStoredAuthDetails(details);
  subscribers.forEach((subscriber) => subscriber(details));
}

export function subscribeAuthDetails(subscriber: (details: AuthDetails | undefined) => void) {
  subscribers.add(subscriber);
  return () => {
    subscribers.delete(subscriber);
  };
}

async function refresh(): Promise<AuthDetails | undefined> {
  const current = getStoredAuthDetails();
  if (!current) {
    setSession(undefined);
    return undefined;
  }

  try {
    const response = await fetch(`${config.apiUrl}/v2/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: current.accessToken,
        refreshToken: current.refreshToken,
      }),
    });
    if (!response.ok) {
      throw new Error(`Session refresh failed with status ${response.status}`);
    }

    const details = toAuthDetails((await response.json()) as TokenResponse);
    setSession(details);
    return details;
  } catch (error) {
    setSession(undefined);
    throw error;
  }
}

export function refreshSession() {
  refreshPromise ??= refresh().finally(() => {
    refreshPromise = undefined;
  });
  return refreshPromise;
}

export async function getValidAccessToken() {
  const current = getStoredAuthDetails();
  if (!current) return undefined;
  if (current.accessTokenExpirationDate > new Date()) return current.accessToken;
  return (await refreshSession())?.accessToken;
}
