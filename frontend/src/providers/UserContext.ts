import { createContext } from 'react';

import { Role } from '@/models/shared/Role';
import { User } from '@/models/shared/User';
import { SignInResult } from '@/models/user/Results';

export type UserContextType = {
  currentUser?: User | undefined;
  accessTokenExpirationDate?: Date | undefined;
  refreshTokenExpirationDate?: Date | undefined;
  isReady: boolean;

  isInRole: (allowedRoles: Role[] | Role) => boolean;

  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);
