import { Role, SignInResult, User } from '@core/models';
import { createContext } from 'react';

export type UserContextType = {
  currentUser?: User | undefined;

  isInRole: (allowedRoles: Role[] | Role) => boolean;

  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
