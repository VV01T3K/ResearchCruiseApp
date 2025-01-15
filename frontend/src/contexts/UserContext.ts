import { SignInResult } from "@core/auth";
import { User } from "@models/User";
import { createContext } from "react";

export type UserContextType = {
  currentUser?: User | undefined;

  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
