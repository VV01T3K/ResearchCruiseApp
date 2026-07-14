import { z as zod } from 'zod';

export const ResetPasswordRequest = zod.object({
  "emailBase64": zod.string(),
  "resetCode": zod.string(),
  "password": zod.string(),
  "passwordConfirm": zod.string()
});

export type ResetPasswordRequest = zod.input<typeof ResetPasswordRequest>;
export type ResetPasswordRequestOutput = zod.output<typeof ResetPasswordRequest>;
