import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import {
  refreshSession,
  prepareForLogout,
  completeLogout,
  getSession,
  SessionRefreshError,
  setSession,
  subscribeAuthDetails,
} from '@/integrations/auth/session';
import { ApiError, getErrorMessage } from '@/api/fetch';
import { toast } from '@/components/shared/layout/toast';
import type { UserResponse } from '@/api/generated/schemas';
import type { Role, SignInResult } from '@/integrations/auth/types';
import { logout as logoutSession, useLogin, useLogout } from '@/api/generated/endpoints/auth.gen';
import { getCurrentUser, getGetCurrentUserQueryKey } from '@/api/generated/endpoints/users.gen';

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: getGetCurrentUserQueryKey(),
    queryFn: async (): Promise<UserResponse | null> => {
      try {
        return await getCurrentUser();
      } catch (error) {
        if (
          (error instanceof ApiError && error.status === 401) ||
          (error instanceof SessionRefreshError && error.unauthorized)
        )
          return null;
        throw error;
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });
}

function clearSession(queryClient: QueryClient) {
  setSession(undefined);
  queryClient.setQueryData(getGetCurrentUserQueryKey(), null);
}

function clearSessionEverywhere(queryClient: QueryClient) {
  completeLogout();
  queryClient.setQueryData(getGetCurrentUserQueryKey(), null);
}

export function useCurrentUser() {
  return useQuery(currentUserQueryOptions()).data ?? null;
}

export function useAuthDetails() {
  const [authDetails, setAuthDetails] = useState(() => getSession());
  useEffect(() => subscribeAuthDetails(setAuthDetails), []);
  return authDetails;
}

export function isInRole(user: UserResponse | null, allowedRoles: Role | Role[]) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return !!user && roles.some((role) => user.roles.includes(role));
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const { mutateAsync: login } = useLogin();

  return async (email: string, password: string): Promise<SignInResult> => {
    let response;
    try {
      response = await login({ data: { email, password } });
    } catch (error) {
      clearSession(queryClient);
      return error instanceof ApiError && error.status === 401 ? 'invalid_credentials' : 'error';
    }

    setSession(response);
    try {
      const user = await queryClient.fetchQuery({ ...currentUserQueryOptions(), staleTime: 0 });
      if (!user) throw new Error('The authenticated account profile is unavailable');
      return 'success';
    } catch (error) {
      toast.error(getErrorMessage(error, 'Nie udało się wczytać konta po zalogowaniu'));
      await prepareForLogout();
      await logoutSession().catch(() => undefined);
      clearSessionEverywhere(queryClient);
      return 'error';
    }
  };
}

export function useSessionActions() {
  const queryClient = useQueryClient();
  const { mutateAsync: logout } = useLogout();
  const refresh = useCallback(async () => {
    await refreshSession();
  }, []);
  const signOut = useCallback(async () => {
    await prepareForLogout();
    try {
      await logout();
    } finally {
      clearSessionEverywhere(queryClient);
    }
  }, [logout, queryClient]);

  return {
    refresh,
    signOut,
  };
}
