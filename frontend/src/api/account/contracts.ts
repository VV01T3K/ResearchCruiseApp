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

export type PasswordResetRequest = {
  email: string;
};

export type ConfirmEmailRequest = {
  userId: string;
  code: string;
};

export type ResendConfirmationEmailRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  emailBase64: string;
  resetCode: string;
  password: string;
  passwordConfirm: string;
};

export type ChangePasswordRequest = {
  password: string;
  newPassword: string;
};

export type CurrentPublicationResponse = {
  id: string;
  category: string;
  doi: string | null;
  authors: string | null;
  title: string | null;
  magazine: string | null;
  year: string | null;
  ministerialPoints: string;
};

export type CurrentPublicationImportRequest = Omit<CurrentPublicationResponse, 'id'>;

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
