import { SignInResult } from '@core/models/Auth';
import { Role, User } from '@core/models/User';
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
