import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import React from 'react';

import { SessionExpirationWarning } from '@/components/shared/SessionExpirationWarning';
import { useLogin } from '@/api/generated/endpoints/auth.gen';
import { getCurrentUser, getGetCurrentUserQueryKey } from '@/api/generated/endpoints/users.gen';
import { ApiError } from '@/lib/custom-fetch';
import { refreshSession, setSession, subscribeAuthDetails, toAuthDetails } from '@/lib/auth-session';
import { setSentryUser } from '@/integrations/sentry/client';
import { Role } from '@/types/user';
import { UserContext, UserContextType } from '@/providers/UserContext';
import { AuthDetails } from '@/types/user';
import { SignInResult } from '@/types/user';
import { getStoredAuthDetails } from '@/providers/StoredAuthDetails';

type Props = {
  children: React.ReactNode;
};
export function UserContextProvider({ children }: Props) {
  const queryClient = useQueryClient();

  const [authDetails, setAuthDetails] = React.useState<AuthDetails | undefined>(() => getStoredAuthDetails());
  const [isReady, setIsReady] = React.useState(false);

  const [initialRefreshPending, setInitialRefreshPending] = React.useState(() => {
    const stored = getStoredAuthDetails();
    const needsRefresh =
      !!stored && stored.accessTokenExpirationDate <= new Date() && stored.refreshTokenExpirationDate > new Date();
    return needsRefresh;
  });
  const setReadyOnceRef = React.useRef<(value: boolean) => void>(() => {});

  React.useLayoutEffect(() => {
    setReadyOnceRef.current = (ready: boolean) => {
      setIsReady(ready);
    };
  }, []);

  React.useEffect(
    () =>
      subscribeAuthDetails((details) => {
        setAuthDetails(details);
        if (!details) queryClient.removeQueries({ queryKey: getGetCurrentUserQueryKey() });
      }),
    [queryClient]
  );

  const profileQuery = useSuspenseQuery({
    queryKey: getGetCurrentUserQueryKey(),
    queryFn: async () => {
      if (!getStoredAuthDetails()?.accessToken) return null;

      try {
        const user = await getCurrentUser();
        return { ...user, roles: user.roles as Role[] };
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: loginMutateAsync } = useLogin({
    mutation: {
      onSuccess: async (response) => {
        setSession(toAuthDetails(response));
        await queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
      },
      onError: () => setSession(undefined),
    },
  });

  const signIn = React.useCallback(
    async (email: string, password: string): Promise<SignInResult> => {
      try {
        await loginMutateAsync({ data: { email, password } });
        return 'success';
      } catch (error) {
        return error instanceof ApiError && error.status === 401 ? 'invalid_credentials' : 'error';
      }
    },
    [loginMutateAsync]
  );

  const signOut = React.useCallback(async () => setSession(undefined), []);

  const refreshUser = React.useCallback(async () => {
    await refreshSession();
  }, []);

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
      currentUser: profileQuery.data ?? undefined,
      accessTokenExpirationDate: authDetails?.accessTokenExpirationDate,
      refreshTokenExpirationDate: authDetails?.refreshTokenExpirationDate,
      isReady,
      signIn,
      signOut,
      refreshUser,
      isInRole,
    }),
    [
      isReady,
      isInRole,
      profileQuery.data,
      authDetails?.accessTokenExpirationDate,
      authDetails?.refreshTokenExpirationDate,
      refreshUser,
      signIn,
      signOut,
    ]
  );

  const initRefreshRef = React.useRef(false);
  React.useEffect(() => {
    if (initRefreshRef.current) return;
    initRefreshRef.current = true;

    const stored = getStoredAuthDetails();
    if (stored && stored.accessTokenExpirationDate <= new Date()) {
      refreshSession()
        .then(
          () => queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() }),
          () => {}
        )
        .finally(() => {
          setInitialRefreshPending(false);
        });
    }
  }, [queryClient]);

  const readyRef = React.useRef(false);
  React.useEffect(() => {
    if (!readyRef.current && !profileQuery.isLoading && !profileQuery.isPending && !initialRefreshPending) {
      readyRef.current = true;
      setReadyOnceRef.current(true);
    }
  }, [profileQuery.isLoading, profileQuery.isPending, initialRefreshPending]);

  React.useEffect(() => {
    const timeoutId = setInterval(
      async () => {
        if (!authDetails) {
          return;
        }

        await context.refreshUser();
      },
      1000 * 60 * 30
    );

    return () => clearInterval(timeoutId);
  }, [context, authDetails]);

  React.useEffect(() => {
    setSentryUser(profileQuery.data ?? undefined);
  }, [profileQuery.data]);

  React.useEffect(() => {
    if (!authDetails?.refreshTokenExpirationDate) {
      return;
    }

    const checkExpiration = () => {
      if (new Date() >= authDetails.refreshTokenExpirationDate) {
        signOut();
      }
    };

    checkExpiration();

    // Check every 5 seconds
    const interval = setInterval(checkExpiration, 5000);

    return () => clearInterval(interval);
  }, [authDetails?.refreshTokenExpirationDate, signOut]);

  return (
    <UserContext value={context}>
      {children}
      {authDetails?.refreshTokenExpirationDate && (
        <SessionExpirationWarning
          expirationDate={authDetails.refreshTokenExpirationDate}
          onRefreshSession={refreshUser}
          onSignOut={signOut}
        />
      )}
    </UserContext>
  );
}
