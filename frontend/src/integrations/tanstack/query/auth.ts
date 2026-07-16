import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import {
  refreshSession,
  SessionRefreshError,
  setSession,
  subscribeAuthDetails,
  toAuthDetails,
} from '@/api/client/auth-session';
import { getStoredAuthDetails } from '@/api/client/auth-storage';
import { ApiError } from '@/api/client/custom-fetch';
import type { Role, SignInResult, User } from '@/api/client/user';
import { useLogin } from '@/api/generated/endpoints/auth.gen';
import { getCurrentUser, getGetCurrentUserQueryKey } from '@/api/generated/endpoints/users.gen';

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: getGetCurrentUserQueryKey(),
    queryFn: async (): Promise<User | null> => {
      try {
        const user = await getCurrentUser();
        return { ...user, roles: user.roles as Role[] };
      } catch (error) {
        if ((error instanceof ApiError && error.status === 401) || error instanceof SessionRefreshError) return null;
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}

function clearSession(queryClient: QueryClient) {
  setSession(undefined);
  queryClient.setQueryData(getGetCurrentUserQueryKey(), null);
}

export function useCurrentUser() {
  return useQuery(currentUserQueryOptions()).data ?? null;
}

export function useAuthDetails() {
  const [authDetails, setAuthDetails] = useState(() => getStoredAuthDetails());
  useEffect(() => subscribeAuthDetails(setAuthDetails), []);
  return authDetails;
}

export function isInRole(user: User | null, allowedRoles: Role | Role[]) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return !!user && roles.some((role) => user.roles.includes(role));
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const login = useLogin();

  return async (email: string, password: string): Promise<SignInResult> => {
    try {
      const response = await login.mutateAsync({ data: { email, password } });
      setSession(toAuthDetails(response));
      await queryClient.fetchQuery({ ...currentUserQueryOptions(), staleTime: 0 });
      return 'success';
    } catch (error) {
      clearSession(queryClient);
      return error instanceof ApiError && error.status === 401 ? 'invalid_credentials' : 'error';
    }
  };
}

export function useSessionActions() {
  const queryClient = useQueryClient();
  const refresh = useCallback(async () => {
    await refreshSession();
  }, []);
  const signOut = useCallback(async () => {
    clearSession(queryClient);
  }, [queryClient]);

  return {
    refresh,
    signOut,
  };
}
