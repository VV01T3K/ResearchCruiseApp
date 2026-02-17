import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

import { client } from '@/core/lib/api';
import { User } from '@/core/models/User';
import { AuthDetails } from '@/user/models/AuthDetails';

type MutationProps = {
  updateAuthDetails: (newAuthDetails: AuthDetails | undefined) => Promise<void>;
};

/* Returns NULL when no access token has been set or profile couldn't be fetched  */
export function useProfileQuery() {
  return useSuspenseQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      if (!client.defaults.headers.Authorization) {
        return null;
      }

      try {
        const response = await client.get('/account');
        return response;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null;
        }
        return null;
      }
    },
    select: (res) => res?.data as User | undefined,
    refetchOnWindowFocus: false,
  });
}

export function useLoginMutation({ updateAuthDetails }: MutationProps) {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return client.post('/account/login', { email, password });
    },
    onSuccess: async ({ data }) => {
      const authDetails: AuthDetails = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpirationDate: new Date(data.accessTokenExpiration),
        refreshTokenExpirationDate: new Date(data.refreshTokenExpiration),
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
    mutationFn: ({ accessToken, refreshToken }: AuthDetails) => {
      // We create a new client here since the main one is paused while refreshing
      // Don't copy client.defaults to avoid sending expired Authorization header
      const refreshClient = axios.create({
        baseURL: client.defaults.baseURL,
      });
      return refreshClient.post('/account/refresh', {
        accessToken,
        refreshToken,
      });
    },
    onSuccess: async ({ data }) => {
      const authDetails: AuthDetails = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpirationDate: new Date(data.accessTokenExpiration),
        refreshTokenExpirationDate: new Date(data.refreshTokenExpiration),
      };
      updateAuthDetails(authDetails);
    },
    onError: () => {
      updateAuthDetails(undefined);
    },
  });
}
