import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';

import { client } from '@/lib/api';
import { AuthDetails } from '@/models/user/AuthDetails';
import { Result } from '@/models/user/Results';
import { getStoredAuthDetails } from '@/providers/StoredAuthDetails';

import {
  AuthResponse,
  CurrentUserResponse,
  LoginRequest,
  ProblemDetails,
  RegisterRequest,
  RefreshRequest,
} from './contracts';

type MutationProps = {
  updateAuthDetails: (newAuthDetails: AuthDetails | undefined) => Promise<void>;
};

type RegisterProps = {
  setResult: (result: Result | 'username-taken') => void;
};

/* Returns NULL when no access token has been set or the session is unauthorized. */
export function useProfileQuery() {
  return useSuspenseQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const accessToken = getStoredAuthDetails()?.accessToken;
      if (!accessToken) {
        return null;
      }

      try {
        const response = await client.get<CurrentUserResponse>('/v2/account/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });
}

export function useLoginMutation({ updateAuthDetails }: MutationProps) {
  return useMutation({
    mutationFn: (request: LoginRequest) => {
      return client.post<AuthResponse>('/v2/auth/login', request);
    },
    onSuccess: async ({ data }) => {
      const authDetails: AuthDetails = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpirationDate: new Date(data.accessTokenExpirationDate),
        refreshTokenExpirationDate: new Date(data.refreshTokenExpirationDate),
      };
      updateAuthDetails(authDetails);
    },
    onError: () => {
      updateAuthDetails(undefined);
    },
  });
}

export function useRefreshTokenMutation({ updateAuthDetails }: MutationProps) {
  return useMutation({
    mutationFn: ({ accessToken, refreshToken }: RefreshRequest) => {
      // We create a new client here since the main one is paused while refreshing.
      // Don't copy client.defaults to avoid sending an expired Authorization header.
      const refreshClient = axios.create({
        baseURL: client.defaults.baseURL,
      });
      return refreshClient.post<AuthResponse>('/v2/auth/refresh', {
        accessToken,
        refreshToken,
      });
    },
    onSuccess: async ({ data }) => {
      const authDetails: AuthDetails = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpirationDate: new Date(data.accessTokenExpirationDate),
        refreshTokenExpirationDate: new Date(data.refreshTokenExpirationDate),
      };
      updateAuthDetails(authDetails);
    },
    onError: () => {
      updateAuthDetails(undefined);
    },
  });
}

export function useRegisterMutation({ setResult }: RegisterProps) {
  return useMutation({
    mutationFn: async (request: RegisterRequest) => {
      return await client.post('/v2/auth/register', request);
    },
    onSuccess: async () => {
      setResult('success');
    },
    onError: async (error) => {
      if (isAxiosError<ProblemDetails>(error) && error.response?.data.detail?.includes('taken')) {
        setResult('username-taken');
        return;
      }

      setResult('error');
    },
  });
}
