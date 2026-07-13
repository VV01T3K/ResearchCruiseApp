import { AuthDetails } from '@/models/user/AuthDetails';

export const AUTH_DETAILS_CHANGED_EVENT = 'auth-details-changed';

function notifyAuthDetailsChanged(authDetails?: AuthDetails) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_DETAILS_CHANGED_EVENT, { detail: authDetails }));
  }
}

export function getStoredAuthDetails(): AuthDetails | undefined {
  const data = localStorage.getItem('authDetails');

  if (!data) {
    return undefined;
  }

  const authDetails = JSON.parse(data, (key: string, value: unknown) => {
    if (key === 'accessTokenExpirationDate' || key === 'refreshTokenExpirationDate') {
      return new Date(value as string);
    }

    return value;
  }) as AuthDetails;

  if (authDetails.refreshTokenExpirationDate < new Date()) {
    setStoredAuthDetails(undefined);
    return undefined;
  }

  return authDetails;
}

export function setStoredAuthDetails(authDetails?: AuthDetails) {
  if (!authDetails) {
    localStorage.removeItem('authDetails');
    notifyAuthDetailsChanged();
    return;
  }

  localStorage.setItem('authDetails', JSON.stringify(authDetails));
  notifyAuthDetailsChanged(authDetails);
}
