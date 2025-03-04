import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

import { client } from '@/core/lib/api';
import { User } from '@/core/models/User';
import { AuthDetails } from '@/user/models/AuthDetails';

type Props = {
  updateAuthDetails: (newAuthDetails: AuthDetails | undefined) => Promise<void>;
};

/* Returns NULL when no access token has been set or profile couldn't be fetched  */
export function useProfileQuery() {
  return useSuspenseQuery({
    queryKey: ['userProfile'],
    queryFn: () => {
      if (!client.defaults.headers.Authorization) {
        return null;
      }

      return client.get('/account').catch(() => null);
    },
    select: (res) => res?.data as User | undefined,
    refetchOnWindowFocus: false,
  });
}

export function useLoginMutation({ updateAuthDetails }: Props) {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return client.post('/account/login', { email, password });
    },
    onSuccess: async ({ data }) => {
      updateAuthDetails(data as AuthDetails);
    },
    onError: () => {
      updateAuthDetails(undefined);
    },
  });
}

export function useRefreshTokenMutation({ updateAuthDetails }: Props) {
  return useMutation({
    mutationFn: ({ accessToken, refreshToken }: AuthDetails) => {
      // We create a new client here since the main one is paused while refreshing
      const refreshClient = axios.create(client.defaults);
      return refreshClient.post('/account/refresh', {
        accessToken,
        refreshToken,
      });
    },
    onSuccess: async ({ data }) => {
      updateAuthDetails(data as AuthDetails);
    },
    onError: () => {
      updateAuthDetails(undefined);
    },
  });
}
