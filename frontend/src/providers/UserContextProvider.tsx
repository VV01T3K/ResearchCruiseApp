import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import { SessionExpirationWarning } from '@/components/shared/SessionExpirationWarning';
import { ApiError, refreshAuth } from '@/api/fetch';
import { setSentryUser } from '@/lib/sentry';
import { Role } from '@/models/shared/Role';
import { UserContext, UserContextType } from '@/providers/UserContext';
import { useLoginMutation, useProfileQuery } from '@/api/account/AccountAuthApiHooks';
import { AuthDetails } from '@/models/user/AuthDetails';
import { SignInResult } from '@/models/user/Results';
import { AUTH_DETAILS_CHANGED_EVENT, getStoredAuthDetails, setStoredAuthDetails } from '@/providers/StoredAuthDetails';

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

  const profileQuery = useProfileQuery();

  React.useEffect(() => {
    const syncAuthDetails = (event: Event) => {
      const details = (event as CustomEvent<AuthDetails | undefined>).detail;
      setAuthDetails(details);
      if (!details) queryClient.removeQueries({ queryKey: ['userProfile'] });
    };
    window.addEventListener(AUTH_DETAILS_CHANGED_EVENT, syncAuthDetails);
    return () => window.removeEventListener(AUTH_DETAILS_CHANGED_EVENT, syncAuthDetails);
  }, [queryClient]);

  const updateAuthDetails = React.useCallback(
    async (newAuthDetails: AuthDetails | undefined) => {
      if (newAuthDetails) {
        setAuthDetails(newAuthDetails);
        setStoredAuthDetails(newAuthDetails);
        await queryClient.fetchQuery({ queryKey: ['userProfile'] });
      } else {
        setAuthDetails(undefined);
        setStoredAuthDetails(undefined);
        queryClient.removeQueries({ queryKey: ['userProfile'] });
      }
    },
    [queryClient]
  );

  const { mutateAsync: loginMutateAsync } = useLoginMutation({ updateAuthDetails });

  const signIn = React.useCallback(
    async (email: string, password: string): Promise<SignInResult> => {
      try {
        await loginMutateAsync({ email, password });
        return 'success';
      } catch (error) {
        return error instanceof ApiError && error.status === 401 ? 'invalid_credentials' : 'error';
      }
    },
    [loginMutateAsync]
  );

  const signOut = React.useCallback(async () => {
    await updateAuthDetails(undefined);
  }, [updateAuthDetails]);

  const refreshUser = React.useCallback(async () => {
    const currentAuthDetails = getStoredAuthDetails();

    if (currentAuthDetails) {
      await refreshAuth();
      await queryClient.fetchQuery({ queryKey: ['userProfile'] });
      return;
    }

    await signOut();
  }, [queryClient, signOut]);

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
      refreshUser()
        .then(
          () => queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
          () => {} // refresh failure is handled inside refreshUser (signs out)
        )
        .finally(() => {
          setInitialRefreshPending(false);
        });
    } else {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    }
  }, [queryClient, refreshUser]);

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
    setSentryUser(profileQuery.data);
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
