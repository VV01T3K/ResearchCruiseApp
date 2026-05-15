export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RefreshRequest = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  accessToken: string;
  accessTokenExpirationDate: string;
  refreshToken: string;
  refreshTokenExpirationDate: string;
};

export type CurrentUserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  emailConfirmed: boolean;
  accepted: boolean;
};

export type ProblemDetails = {
  detail?: string;
};
import { Role } from '@/models/shared/Role';
