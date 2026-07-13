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

export type AuthResponse = {
  accessToken: string;
  accessTokenExpirationDate: string;
  refreshToken: string;
  refreshTokenExpirationDate: string;
};
