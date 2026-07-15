import { ParsedLocation, redirect } from '@tanstack/react-router';

import { getCurrentUser } from '@/api/generated/endpoints/users.gen';
import { Role } from '@/api/client/user';
import { User } from '@/api/client/user';
import { UserContextType } from '@/providers/UserContext';
import { getStoredAuthDetails } from '@/api/client/auth-storage';

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

async function resolveCurrentUser(userContext?: UserContextType): Promise<User | undefined> {
  if (userContext?.currentUser) {
    return userContext.currentUser;
  }

  const storedAuthDetails = getStoredAuthDetails();
  if (!storedAuthDetails) {
    return undefined;
  }

  try {
    return (await getCurrentUser()) as User;
  } catch {
    return undefined;
  }
}

export const allowOnly: GlobalGuardType = {
  withRoles: (...roles: Role[]): ((context: GuardContextType) => Promise<void>) => {
    return async ({ context, location }) => {
      const currentUser = await resolveCurrentUser(context.userContext);

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
      const currentUser = await resolveCurrentUser(context.userContext);

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
      const currentUser = await resolveCurrentUser(context.userContext);

      if (currentUser) {
        throw redirect({
          to: '/',
        });
      }
    };
  },
};
