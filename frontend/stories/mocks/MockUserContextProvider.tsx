import { fn } from 'storybook/test';

import { Role } from '@/models/shared/Role';
import { UserContext, UserContextType } from '@/providers/UserContext';

type Props = {
  loggedIn?: boolean;
  children: React.ReactNode;
};

export function MockUserContextProvider({ loggedIn, children }: Props) {
  const context: UserContextType = {
    currentUser: loggedIn
      ? {
          id: '1',
          email: 'example@example.com',
          firstName: 'John',
          lastName: 'Doe',
          emailConfirmed: true,
          accepted: true,
          roles: [Role.Administrator],
        }
      : undefined,
    isReady: true,
    signIn: fn(),
    signOut: fn(),
    isInRole: (roles: Role | Role[]) =>
      loggedIn && Array.isArray(roles)
        ? roles.some((role) => context.currentUser?.roles.includes(role))
        : roles === context.currentUser?.roles,
    refreshUser: fn(),
  };

  return <UserContext value={context}>{children}</UserContext>;
}
