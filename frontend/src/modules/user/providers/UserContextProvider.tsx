import { useQueryClient } from '@tanstack/react-query';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import React from 'react';

import { AppLoader } from '@/core/components/AppLoader';
import { clearAuthToken, client, setAuthToken } from '@/core/lib/api';
import { Role } from '@/core/models/Role';
import { User } from '@/core/models/User';
import { UserContext, UserContextType } from '@/user/contexts/UserContext';
import { useLoginMutation, useProfileQuery, useRefreshTokenMutation } from '@/user/hooks/UserContextApiHooks';
import { AuthDetails } from '@/user/models/AuthDetails';
import { SignInResult } from '@/user/models/Results';
import { getStoredAuthDetails, setStoredAuthDetails } from '@/user/services/StoredAuthDetails';

type Props = {
  children: React.ReactNode;
};

export function UserContextProvider({ children }: Props) {
  const [userProfile, setUserProfile] = React.useState<User | undefined>(undefined);
  const [authDetails, setAuthDetails] = React.useState<AuthDetails | undefined>(() => getStoredAuthDetails());

  const queryClient = useQueryClient();
  const profileQuery = useProfileQuery({ authDetails });
  const { mutateAsync: loginMutateAsync } = useLoginMutation({ setAuthDetails, setStoredAuthDetails });
  const { mutateAsync: refreshTokenMutateAsync } = useRefreshTokenMutation({ setAuthDetails, setStoredAuthDetails });

  React.useMemo(() => {
    if (authDetails) {
      setAuthToken(authDetails.accessToken);
    } else {
      clearAuthToken();
    }
  }, [authDetails]);

  React.useMemo(() => {
    setUserProfile(profileQuery.data?.data);
  }, [profileQuery.data?.data]);

  const context: UserContextType = React.useMemo(
    () => ({
      currentUser: userProfile,
      signIn: async (email: string, password: string): Promise<SignInResult> => {
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
      signOut: async () => {
        setAuthDetails(undefined);
        setStoredAuthDetails(undefined);
        setUserProfile(undefined);
        queryClient.removeQueries();
      },
      refreshUser: async () => {
        if (authDetails) {
          await refreshTokenMutateAsync(authDetails);
          return;
        }

        setAuthDetails(undefined);
        setStoredAuthDetails(undefined);
        setUserProfile(undefined);
        queryClient.removeQueries();
      },
      isInRole: (allowedRoles: Role | Role[]) => {
        if (!userProfile) {
          return false;
        }

        if (!Array.isArray(allowedRoles)) {
          return userProfile.roles.includes(allowedRoles);
        }

        return allowedRoles.some((role) => userProfile.roles.includes(role));
      },
    }),
    [authDetails, loginMutateAsync, queryClient, refreshTokenMutateAsync, userProfile]
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

  const expirationDate = authDetails?.expirationDate;
  if (expirationDate && expirationDate < new Date()) {
    context.signOut();
  }

  if (profileQuery.isFetching) {
    return <AppLoader />;
  }

  return <UserContext value={context}>{children}</UserContext>;
}
