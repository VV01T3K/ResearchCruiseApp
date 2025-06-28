import { useQueryClient } from '@tanstack/react-query';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import React from 'react';

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
  setAuthToken(authDetails);
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
    setAuthDetails(getStoredAuthDetails()); // Sync state with storage in case it changed in another tab
    if (authDetails) {
      await refreshTokenMutateAsync(authDetails);
      return;
    }

    await signOut();
  }, [authDetails, signOut, refreshTokenMutateAsync]);

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
      signIn,
      signOut,
      refreshUser,
      isInRole,
    }),
    [isInRole, profileQuery.data, refreshUser, signIn, signOut]
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

  return <UserContext value={context}>{children}</UserContext>;
}
