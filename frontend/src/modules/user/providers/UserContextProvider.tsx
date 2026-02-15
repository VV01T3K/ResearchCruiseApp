import { useQueryClient } from '@tanstack/react-query';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import React from 'react';

import { toast } from '@/core/components/layout/toast';
import { client, setAuthToken } from '@/core/lib/api';
import { Role } from '@/core/models/Role';
import { UserContext, UserContextType } from '@/user/contexts/UserContext';
import { useLoginMutation, useProfileQuery, useRefreshTokenMutation } from '@/user/hooks/UserContextApiHooks';
import { AuthDetails } from '@/user/models/AuthDetails';
import { SignInResult } from '@/user/models/Results';
import { getStoredAuthDetails, setStoredAuthDetails } from '@/user/services/StoredAuthDetails';

type Props = {
  children: React.ReactNode;
};

function getRefreshLeadTimeMs(remainingMs: number): number {
  return Math.min(1000 * 60 * 2, Math.max(15000, Math.floor(remainingMs * 0.2)));
}

export function UserContextProvider({ children }: Props) {
  const queryClient = useQueryClient();

  const [authDetails, setAuthDetails] = React.useState<AuthDetails | undefined>(() => getStoredAuthDetails());
  setAuthToken(authDetails);
  const profileQuery = useProfileQuery();

  const refreshInFlightRef = React.useRef<Promise<unknown> | null>(null);

  const updateAuthDetails = React.useCallback(
    async (newAuthDetails: AuthDetails | undefined) => {
      if (newAuthDetails) {
        setAuthDetails(newAuthDetails);
        setStoredAuthDetails(newAuthDetails);
        setAuthToken(newAuthDetails);
        await queryClient.fetchQuery({ queryKey: ['userProfile'] });
      } else {
        setAuthDetails(undefined);
        setStoredAuthDetails(undefined);
        setAuthToken(undefined);
        queryClient.removeQueries({ queryKey: ['userProfile'] });
      }
    },
    [queryClient]
  );

  const { mutateAsync: loginMutateAsync } = useLoginMutation({ updateAuthDetails });
  const { mutateAsync: refreshTokenMutateAsync } = useRefreshTokenMutation({ updateAuthDetails });

  const signIn = React.useCallback(
    async (email: string, password: string): Promise<SignInResult> => {
      const res = await loginMutateAsync({ email, password }).catch((error) => {
        return error.response;
      });

      if (!res) {
        return 'error';
      }

      if (res.status === 200) {
        return 'success';
      }

      if (res.status === 401) {
        return 'invalid_credentials';
      }

      return 'error';
    },
    [loginMutateAsync]
  );

  const signOut = React.useCallback(async () => {
    await updateAuthDetails(undefined);
  }, [updateAuthDetails]);

  const refreshUser = React.useCallback(async () => {
    if (refreshInFlightRef.current) {
      await refreshInFlightRef.current;
      return;
    }

    const currentAuthDetails = getStoredAuthDetails();
    if (!currentAuthDetails) {
      await signOut();
      return;
    }

    const refreshPromise = refreshTokenMutateAsync(currentAuthDetails).finally(() => {
      refreshInFlightRef.current = null;
    });

    refreshInFlightRef.current = refreshPromise;
    await refreshPromise;
  }, [refreshTokenMutateAsync, signOut]);

  const isInRole = React.useCallback(
    (allowedRoles: Role | Role[]) => {
      if (!profileQuery.data) {
        return false;
      }

      if (!Array.isArray(allowedRoles)) {
        return profileQuery.data.roles.includes(allowedRoles);
      }

      return allowedRoles.some((role) => profileQuery.data!.roles.includes(role));
    },
    [profileQuery.data]
  );

  const context = React.useMemo<UserContextType>(
    () => ({
      currentUser: profileQuery.data,
      sessionExpirationDate: authDetails?.expirationDate,
      signIn,
      signOut,
      refreshUser,
      isInRole,
    }),
    [authDetails?.expirationDate, isInRole, profileQuery.data, refreshUser, signIn, signOut]
  );

  React.useEffect(() => {
    const interceptorId = createAuthRefreshInterceptor(
      client,
      async (failedRequest) => {
        await context.refreshUser();

        failedRequest.response.config.headers['Authorization'] = `Bearer ${getStoredAuthDetails()?.accessToken}`;
        return failedRequest;
      },
      {
        statusCodes: [401],
        pauseInstanceWhileRefreshing: true,
      }
    );

    return () => {
      client.interceptors.response.eject(interceptorId);
    };
  }, [context]);

  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'authDetails') {
        return;
      }

      setAuthDetails(getStoredAuthDetails());
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  React.useEffect(() => {
    if (!authDetails?.expirationDate) {
      return;
    }

    const remainingMs = authDetails.expirationDate.getTime() - Date.now();

    if (remainingMs <= 0) {
      toast.error('Sesja wygasła. Zaloguj się ponownie.');
      void signOut();
      return;
    }

    const refreshLeadMs = getRefreshLeadTimeMs(remainingMs);
    const refreshDelayMs = Math.max(0, remainingMs - refreshLeadMs);
    const warningDelayMs = Math.max(0, remainingMs - 1000 * 60);

    const refreshTimeoutId = setTimeout(() => {
      void refreshUser().catch(() => undefined);
    }, refreshDelayMs);

    const warningTimeoutId = setTimeout(() => {
      toast.error('Sesja wygaśnie za mniej niż 1 minutę.');
    }, warningDelayMs);

    const expireTimeoutId = setTimeout(() => {
      toast.error('Sesja wygasła. Zaloguj się ponownie.');
      void signOut();
    }, remainingMs);

    return () => {
      clearTimeout(refreshTimeoutId);
      clearTimeout(warningTimeoutId);
      clearTimeout(expireTimeoutId);
    };
  }, [authDetails?.expirationDate, refreshUser, signOut]);

  return <UserContext value={context}>{children}</UserContext>;
}
