import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

import { getCurrentUserV2, loginV2, refreshTokensV2, registerAccountV2 } from '@/api/generated/endpoints';
import { LoginV2Body, RefreshTokensV2Body, RegisterAccountV2Body } from '@/api/generated/model';
import { ApiError } from '@/api/fetch';
import { validateRequest } from '@/api/validateRequest';
import { AuthDetails } from '@/models/user/AuthDetails';
import { User } from '@/models/shared/User';
import { Result } from '@/models/user/Results';
import { getStoredAuthDetails } from '@/providers/StoredAuthDetails';

import { LoginRequest, ProblemDetails, RegisterRequest, RefreshRequest } from './contracts';

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
        return await getCurrentUserV2({
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }
    },
    select: (user) => (user ? (user as User) : undefined),
    refetchOnWindowFocus: false,
  });
}

export function useLoginMutation({ updateAuthDetails }: MutationProps) {
  return useMutation({
    mutationFn: (request: LoginRequest) => {
      return loginV2(validateRequest('login', LoginV2Body, request));
    },
    onSuccess: async (data) => {
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
      return refreshTokensV2(validateRequest('refresh-tokens', RefreshTokensV2Body, { accessToken, refreshToken }));
    },
    onSuccess: async (data) => {
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
      return registerAccountV2(validateRequest('register-account', RegisterAccountV2Body, request));
    },
    onSuccess: async () => {
      setResult('success');
    },
    onError: async (error) => {
      if (error instanceof ApiError && (error.data as ProblemDetails)?.detail?.includes('taken')) {
        setResult('username-taken');
        return;
      }

      setResult('error');
    },
  });
}
