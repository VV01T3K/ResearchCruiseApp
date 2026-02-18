import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import { SessionExpirationWarning } from '@/core/components/SessionExpirationWarning';
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

  const accessTokenValid = authDetails ? authDetails.accessTokenExpirationDate > new Date() : false;
  if (accessTokenValid) {
    setAuthToken(authDetails);
  } else {
    setAuthToken(undefined);
  }
  const profileQuery = useProfileQuery();

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
    const currentAuthDetails = getStoredAuthDetails();

    if (currentAuthDetails) {
      await refreshTokenMutateAsync(currentAuthDetails);
      return;
    }

    await signOut();
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
      sessionExpirationDate: authDetails?.refreshTokenExpirationDate,
      isReady,
      signIn,
      signOut,
      refreshUser,
      isInRole,
    }),
    [isReady, isInRole, profileQuery.data, authDetails?.refreshTokenExpirationDate, refreshUser, signIn, signOut]
  );

  // Refs keep the interceptor stable while accessing latest functions
  const refreshUserRef = React.useRef(refreshUser);
  React.useEffect(() => {
    refreshUserRef.current = refreshUser;
  }, [refreshUser]);
  const refreshPromiseRef = React.useRef<Promise<void> | null>(null);

  React.useEffect(() => {
    const interceptorId = client.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Rule 1: Never intercept refresh requests
        if (error.config?.url?.includes('/account/refresh')) {
          return Promise.reject(error);
        }

        // Rule 2: Only retry once per failed request
        if (error.response?.status === 401 && !error.config?._retry) {
          error.config._retry = true;

          try {
            if (!refreshPromiseRef.current) {
              refreshPromiseRef.current = refreshUserRef
                .current()
                .then(() => {
                  refreshPromiseRef.current = null;
                })
                .catch((err) => {
                  refreshPromiseRef.current = null;
                  throw err;
                });
            }
            await refreshPromiseRef.current;

            const updatedToken = getStoredAuthDetails()?.accessToken;
            if (updatedToken) {
              error.config.headers['Authorization'] = `Bearer ${updatedToken}`;
              return client(error.config);
            }
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      client.interceptors.response.eject(interceptorId);
    };
  }, []);

  const initRefreshRef = React.useRef(false);
  React.useEffect(() => {
    if (initRefreshRef.current) return;
    initRefreshRef.current = true;

    const stored = getStoredAuthDetails();
    if (stored && stored.accessTokenExpirationDate <= new Date()) {
      if (!refreshPromiseRef.current) {
        refreshPromiseRef.current = refreshUserRef
          .current()
          .then(() => {
            refreshPromiseRef.current = null;
          })
          .catch((err) => {
            refreshPromiseRef.current = null;
            throw err;
          });
      }
      refreshPromiseRef.current
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
