import { AuthDetails } from '@/user/models/AuthDetails';

export function getStoredAuthDetails(): AuthDetails | undefined {
  const authDetails = localStorage.getItem('authDetails');

  if (!authDetails) {
    return undefined;
  }

  return JSON.parse(authDetails, (key: string, value: unknown) => {
    if (key === 'expirationDate') {
      return new Date(value as string);
    }

    return value;
  }) as AuthDetails;
}

export function setStoredAuthDetails(authDetails?: AuthDetails) {
  if (!authDetails) {
    localStorage.removeItem('authDetails');
    return;
  }

  localStorage.setItem('authDetails', JSON.stringify(authDetails));
}
