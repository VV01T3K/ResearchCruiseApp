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
import { ApiError, getProblemDetail } from '@/api/errors';
import type { UserResponse } from '@/api/generated/schemas';
import type { Role, SignInResult } from '@/integrations/auth/types';
import { logout as logoutSession, useLogin, useLogout } from '@/api/generated/endpoints/auth.gen';
import { getCurrentUser, getGetCurrentUserQueryKey } from '@/api/generated/endpoints/users.gen';

async function fetchCurrentUser(): Promise<UserResponse | null> {
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
}

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: getGetCurrentUserQueryKey(),
    queryFn: fetchCurrentUser,
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
  const { mutateAsync: login } = useLogin({ mutation: { meta: { handlesError: true } } });

  return async (email: string, password: string): Promise<SignInResult> => {
    let response;
    try {
      response = await login({ data: { email, password } });
    } catch (error) {
      clearSession(queryClient);
      return { error: getProblemDetail(error, 'Wystąpił błąd podczas logowania. Spróbuj ponownie.') };
    }

    setSession(response);
    try {
      // Fetched outside the query cache: sign-in reports this failure itself.
      const user = await fetchCurrentUser();
      if (!user) throw new Error('Nie udało się wczytać profilu konta.');
      queryClient.setQueryData(getGetCurrentUserQueryKey(), user);
      return 'success';
    } catch (error) {
      await prepareForLogout();
      await logoutSession().catch(() => undefined);
      clearSessionEverywhere(queryClient);
      return { error: getProblemDetail(error, 'Nie udało się wczytać profilu. Spróbuj ponownie.') };
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
