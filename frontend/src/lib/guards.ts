import { ParsedLocation, redirect } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { Role } from '@/integrations/auth/types';
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

export const redirectSearchSchema = z.object({
  redirect: z
    .string()
    .regex(/^\/(?![/\\])\S+$/)
    .refine((href) => {
      const path = href.split(/[?#]/)[0];
      try {
        return !/%2f|%5c/i.test(path) && !/\/\/|\\|\/\.{1,2}(\/|$)/.test(decodeURIComponent(path));
      } catch {
        return false;
      }
    })
    .optional()
    .catch(undefined),
});

export const allowOnly: GlobalGuardType = {
  withRoles: (...roles: Role[]): ((context: GuardContextType) => Promise<void>) => {
    return async ({ context, location }) => {
      const currentUser = await context.queryClient.query(currentUserQueryOptions());

      if (!currentUser) {
        throw redirect({
          to: '/login',
          search: location.href === '/' ? {} : { redirect: location.href },
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
      const currentUser = await context.queryClient.query(currentUserQueryOptions());

      if (!currentUser) {
        throw redirect({
          to: '/login',
          search: location.href === '/' ? {} : { redirect: location.href },
        });
      }
    };
  },
  unauthenticated: (): ((context: GuardContextType) => Promise<void>) => {
    return async ({ context }) => {
      const currentUser = await context.queryClient.query(currentUserQueryOptions());

      if (currentUser) {
        throw redirect({
          to: '/',
        });
      }
    };
  },
};
