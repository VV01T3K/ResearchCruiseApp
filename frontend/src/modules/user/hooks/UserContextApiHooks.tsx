import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { client, setAuthToken } from '@/core/lib/api';
import { AuthDetails } from '@/user/models/AuthDetails';

type UseProfileQueryProps = {
  authDetails?: AuthDetails;
};
export function useProfileQuery({ authDetails }: UseProfileQueryProps) {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['userProfile'],
    enabled: () => !!authDetails?.accessToken,
    queryFn: () => {
      return client.get('/account', {
        headers: {
          Authorization: `Bearer ${authDetails?.accessToken}`,
        },
      });
    },
    refetchOnWindowFocus: false,
  });
}

type UseLoginMutationProps = {
  setAuthDetails: (authDetails: AuthDetails | undefined) => void;
  setStoredAuthDetails: (authDetails: AuthDetails | undefined) => void;
};
export function useLoginMutation({ setAuthDetails, setStoredAuthDetails }: UseLoginMutationProps) {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return client.post('/account/login', { email, password });
    },
    onSuccess: ({ data }) => {
      if (data) {
        setAuthDetails(data as AuthDetails);
        setStoredAuthDetails(data as AuthDetails);
      }
    },
    onError: () => {
      setAuthDetails(undefined);
    },
  });
}

type UseRefreshTokenMutationProps = {
  setAuthDetails: (authDetails: AuthDetails | undefined) => void;
  setStoredAuthDetails: (authDetails: AuthDetails | undefined) => void;
};
export function useRefreshTokenMutation({ setAuthDetails, setStoredAuthDetails }: UseRefreshTokenMutationProps) {
  return useMutation({
    mutationFn: ({ accessToken, refreshToken }: AuthDetails) => {
      // We create a new client here since the main one is paused while refreshing
      const refreshClient = axios.create(client.defaults);
      return refreshClient.post('/account/refresh', {
        accessToken,
        refreshToken,
      });
    },
    onSuccess: ({ data }) => {
      if (data) {
        setAuthDetails(data as AuthDetails);
        setStoredAuthDetails(data as AuthDetails);
        setAuthToken(data.accessToken);
      }
    },
    onError: () => {
      setAuthDetails(undefined);
    },
  });
}
