import { ParsedLocation, redirect } from '@tanstack/react-router';

import { Role } from '@/core/models/Role';
import { UserContextType } from '@/user/contexts/UserContext';

type GuardContextType = {
  context: {
    userContext?: UserContextType | undefined;
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
      if (!context.userContext?.currentUser) {
        throw redirect({
          to: '/login',
          search: {
            redirect: location.href,
          },
        });
      }

      if (!roles.some((r) => context.userContext!.currentUser!.roles.includes(r))) {
        throw redirect({
          to: '/',
        });
      }
    };
  },
  authenticated: (): ((context: GuardContextType) => Promise<void>) => {
    return async ({ context, location }) => {
      if (!context.userContext?.currentUser) {
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
      if (context.userContext?.currentUser) {
        throw redirect({
          to: '/',
        });
      }
    };
  },
};
