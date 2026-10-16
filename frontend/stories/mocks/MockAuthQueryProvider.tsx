import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { Role } from '@/integrations/auth/types';
import { getGetCurrentUserQueryKey } from '@/api/generated/endpoints/users.gen';

type Props = {
  loggedIn?: boolean;
  children: React.ReactNode;
};

function createSeededQueryClient(loggedIn?: boolean) {
  const client = new QueryClient({ defaultOptions: { queries: { enabled: false } } });
  client.setQueryData(
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
  return client;
}

export function MockAuthQueryProvider({ loggedIn, children }: Props) {
  const [queryClient] = useState(() => createSeededQueryClient(loggedIn));

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
