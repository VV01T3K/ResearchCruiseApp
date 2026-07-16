import { ParsedLocation, redirect } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';

import { Role } from '@/api/client/user';
import { currentUserQueryOptions } from '@/integrations/tanstack/query/auth';

type GuardContextType = {
  context: {
    queryClient: QueryClient;
  };
  location: ParsedLocation<object>;
};

type GlobalGuardType = {
  withRoles: (...roles: Role[]) => (context: GuardContextType) => Promise<void>;
  authenticated: () => (context: GuardContextType) => Promise<void>;
  unauthenticated: () => (context: GuardContextType) => Promise<void>;
};

export const allowOnly: GlobalGuardType = {
  withRoles: (...roles: Role[]): ((context: GuardContextType) => Promise<void>) => {
    return async ({ context, location }) => {
      const currentUser = await context.queryClient.fetchQuery(currentUserQueryOptions());

      if (!currentUser) {
        throw redirect({
          to: '/login',
          search: {
            redirect: location.href,
          },
        });
      }

      if (!roles.some((r) => currentUser.roles.includes(r))) {
        throw redirect({
          to: '/',
        });
      }
    };
  },
  authenticated: (): ((context: GuardContextType) => Promise<void>) => {
    return async ({ context, location }) => {
      const currentUser = await context.queryClient.fetchQuery(currentUserQueryOptions());

      if (!currentUser) {
        throw redirect({
          to: '/login',
          search: {
            redirect: location.href,
          },
        });
      }
    };
  },
  unauthenticated: (): ((context: GuardContextType) => Promise<void>) => {
    return async ({ context }) => {
      const currentUser = await context.queryClient.fetchQuery(currentUserQueryOptions());

      if (currentUser) {
        throw redirect({
          to: '/',
        });
      }
    };
  },
};
