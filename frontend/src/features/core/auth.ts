import { clearAuthToken, client, setAuthToken } from '@core/api';

export type SignInResult = 'error' | 'invalid_credentials' | 'success';

export type AuthDetails = {
  accessToken: string;
  refreshToken: string;
  expirationDate: Date;
};

export async function signIn(
  email: string,
  password: string
): Promise<SignInResult> {
  return (await client
    .post('/account/login', {
      email,
      password,
    })
    .then((loginResponse) => {
      const authDetails: AuthDetails = {
        accessToken: loginResponse.data.accessToken,
        refreshToken: loginResponse.data.refreshToken,
        expirationDate: new Date(loginResponse.data.expiresIn),
      };
      storeAuthDetails(authDetails);
      return 'success';
    })
    .catch((loginResponse) => {
      if (!loginResponse) {
        return 'error';
      }

      if (loginResponse.status === 401) {
        return 'invalid_credentials';
      }

      return 'error';
    })) as SignInResult;
}

export async function signOut(): Promise<void> {
  storeAuthDetails(undefined);
}

export async function refreshToken(): Promise<void> {
  let authDetails = getAuthDetails();

  if (!authDetails || authDetails.expirationDate < new Date()) {
    return;
  }

  await client
    .post('/account/refresh', {
      refreshToken: authDetails.refreshToken,
      accessToken: authDetails.accessToken,
    })
    .then((refreshTokenResponse) => {
      if (!refreshTokenResponse || refreshTokenResponse.status !== 200) {
        storeAuthDetails(undefined);
        return;
      }

      authDetails = {
        accessToken: refreshTokenResponse.data.accessToken,
        refreshToken: refreshTokenResponse.data.refreshToken,
        expirationDate: new Date(refreshTokenResponse.data.expiresIn),
      };
      storeAuthDetails(refreshTokenResponse.data);
    })
    .catch(() => {
      storeAuthDetails(undefined);
      return;
    });
}

function storeAuthDetails(authDetails?: AuthDetails | undefined) {
  if (!authDetails) {
    sessionStorage.removeItem('authDetails');
    clearAuthToken();
    return;
  }

  sessionStorage.setItem('authDetails', JSON.stringify(authDetails));
  setAuthToken(authDetails.accessToken);
}

function getAuthDetails(): AuthDetails | undefined {
  const authDetails = sessionStorage.getItem('authDetails');

  if (!authDetails) {
    return;
  }

  return JSON.parse(authDetails);
}

export function hasAccessToken(): boolean {
  return getAuthDetails()?.accessToken !== undefined;
}
