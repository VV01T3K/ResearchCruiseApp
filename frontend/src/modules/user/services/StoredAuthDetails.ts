import { AuthDetails } from '@/user/models/AuthDetails';

export function getStoredAuthDetails(): AuthDetails | undefined {
  const data = localStorage.getItem('authDetails');

  if (!data) {
    return undefined;
  }

  const authDetails = JSON.parse(data, (key: string, value: unknown) => {
    if (key === 'expirationDate') {
      return new Date(value as string);
    }

    return value;
  }) as AuthDetails;

  if (authDetails.expirationDate < new Date()) {
    setStoredAuthDetails(undefined);
    return undefined;
  }

  return authDetails;
}

export function setStoredAuthDetails(authDetails?: AuthDetails) {
  if (!authDetails) {
    localStorage.removeItem('authDetails');
    return;
  }

  localStorage.setItem('authDetails', JSON.stringify(authDetails));
}
