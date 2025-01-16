import { UserContext, UserContextType } from '@core/contexts/UserContext';
import { client } from '@core/api';
import { hasAccessToken, signIn, SignInResult, signOut } from '@core/auth';
import { AppLoader } from '@core/components/AppLoader';
import { User } from '@core/models/User';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const userProfileQuery = useQuery({
    queryKey: ['userProfile'],
    enabled: hasAccessToken,
    queryFn: async () => {
      return await client.get('/account');
    },
  });

  function removeUserProfile() {
    queryClient
      .getQueryCache()
      .findAll({ queryKey: ['userProfile'] })
      .forEach((query) => {
        query.setData(undefined);
      });
  }

  const context: UserContextType = {
    currentUser: userProfileQuery.data?.data as User,
    signIn: async (email: string, password: string): Promise<SignInResult> => {
      const result = await signIn(email, password);

      if (result === 'success') {
        await userProfileQuery.refetch();
        return result;
      }

      removeUserProfile();
      return result;
    },
    signOut: async () => {
      await signOut();
      removeUserProfile();
    },
    refreshUser: async () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  };

  if (userProfileQuery.isFetching) {
    return <AppLoader />;
  }

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
}
