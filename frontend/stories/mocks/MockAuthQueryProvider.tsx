import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { Role } from '@/api/client/user';
import { getGetCurrentUserQueryKey } from '@/api/generated/endpoints/users.gen';

type Props = {
  loggedIn?: boolean;
  children: React.ReactNode;
};

export function MockAuthQueryProvider({ loggedIn, children }: Props) {
  const [queryClient] = useState(() => new QueryClient());
  queryClient.setQueryData(
    getGetCurrentUserQueryKey(),
    loggedIn
      ? {
          id: '1',
          email: 'example@example.com',
          firstName: 'John',
          lastName: 'Doe',
          emailConfirmed: true,
          accepted: true,
          roles: [Role.Administrator],
        }
      : null
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
