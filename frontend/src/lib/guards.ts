import { ParsedLocation, redirect } from '@tanstack/react-router';

import { getCurrentUserV2 } from '@/api/generated/endpoints';
import { Role } from '@/models/shared/Role';
import { User } from '@/models/shared/User';
import { UserContextType } from '@/providers/UserContext';
import { getStoredAuthDetails } from '@/providers/StoredAuthDetails';

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

  if (storedAuthDetails.refreshTokenExpirationDate <= new Date()) {
    return undefined;
  }

  let accessToken = storedAuthDetails.accessToken;

  if (storedAuthDetails.accessTokenExpirationDate <= new Date() && userContext) {
    try {
      await userContext.refreshUser();
      accessToken = getStoredAuthDetails()?.accessToken ?? '';
    } catch {
      return undefined;
    }
  }

  if (!accessToken) {
    return undefined;
  }

  try {
    return (await getCurrentUserV2({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })) as User;
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
