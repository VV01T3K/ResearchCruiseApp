import { UserContext, UserContextType } from '@contexts/UserContext';
import { client } from '@core/api';
import { hasAccessToken,signIn, signOut } from '@core/auth';
import { AppLoader } from '@core/components/AppLoader';
import { User } from "@models/User";
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const userProfileQuery = useQuery({
    queryKey: ['userProfile'],
    enabled: hasAccessToken(),
    queryFn: async () => {
      return await client.get('/account');
    }
  });

  const context: UserContextType = {
    currentUser: userProfileQuery.data?.data as User,
    signIn,
    signOut,
    refreshUser: async () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    }
  }

  if (userProfileQuery.isPending) {
    return <AppLoader />
  }

  return (
    <UserContext.Provider value={context}>
      {children}
    </UserContext.Provider>
  );
}
