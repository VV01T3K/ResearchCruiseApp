import { client, setAuthToken, clearAuthToken } from '@core/api';
import { SignInResult } from '@core/auth';
import { AppLoader } from '@core/components/AppLoader';
import { UserContext, UserContextType } from '@core/contexts/UserContext';
import { Role, User } from '@core/models/User';
import { useMutation, useQuery } from '@tanstack/react-query';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import React from 'react';

type UserContextProviderProps = {
  children: React.ReactNode;
};
type AuthDetails = {
  accessToken: string;
  refreshToken: string;
  expirationDate: Date;
};

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [userProfile, setUserProfile] = React.useState<User | undefined>(
    undefined
  );
  const [authDetails, setAuthDetails] = React.useState<AuthDetails | undefined>(
    getStoredAuthDetails()
  );

  const profileQuery = useQuery({
    queryKey: ['userProfile', authDetails?.accessToken],
    enabled: () => !!authDetails?.accessToken,
    queryFn: () => {
      return client.get('/account', {
        headers: {
          Authorization: `Bearer ${authDetails?.accessToken}`,
        },
      });
    },
  });
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return client.post('/account/login', { email, password });
    },
    onSuccess: ({ data }) => {
      if (data) {
        setAuthDetails(data as AuthDetails);
        setStoredAuthDetails(data as AuthDetails);
      }
    },
    onError: () => {
      setAuthDetails(undefined);
    },
  });
  const refreshTokenMutation = useMutation({
    mutationFn: ({ accessToken, refreshToken }: AuthDetails) => {
      return client.post(
        '/account/refresh',
        {
          accessToken,
          refreshToken,
        },
        {
          headers: {
            Authorization: '',
          },
        }
      );
    },
    onSuccess: ({ data }) => {
      if (data) {
        setAuthDetails(data as AuthDetails);
        setStoredAuthDetails(data as AuthDetails);
        setAuthToken(data.accessToken);
      }
    },
    onError: () => {
      setAuthDetails(undefined);
    },
  });

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
      signIn: async (
        email: string,
        password: string
      ): Promise<SignInResult> => {
        const res = await loginMutation.mutateAsync({ email, password });

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
      },
      refreshUser: async () => {
        if (authDetails) {
          await refreshTokenMutation.mutateAsync(authDetails);
          return;
        }

        setAuthDetails(undefined);
        setStoredAuthDetails(undefined);
        setUserProfile(undefined);
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
    [authDetails, loginMutation, refreshTokenMutation, userProfile]
  );

  React.useEffect(() => {
    // TODO: Make interceptor try to refresh token (it wasn't working during first implementation tests)
    const interceptorId = createAuthRefreshInterceptor(
      client,
      context.signOut,
      {
        statusCodes: [401],
        pauseInstanceWhileRefreshing: true,
      }
    );

    return () => {
      client.interceptors.response.eject(interceptorId);
    };
  }, [context.signOut]);
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

  if (profileQuery.isFetching || loginMutation.isPending) {
    return <AppLoader />;
  }

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
}

function getStoredAuthDetails(): AuthDetails | undefined {
  const authDetails = localStorage.getItem('authDetails');

  if (!authDetails) {
    return undefined;
  }

  return JSON.parse(authDetails) as AuthDetails;
}

function setStoredAuthDetails(authDetails?: AuthDetails) {
  if (!authDetails) {
    localStorage.removeItem('authDetails');
    return;
  }

  localStorage.setItem('authDetails', JSON.stringify(authDetails));
}
