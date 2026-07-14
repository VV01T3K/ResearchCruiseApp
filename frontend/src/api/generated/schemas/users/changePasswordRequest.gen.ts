import { z as zod } from 'zod';

export const ChangePasswordRequest = zod.object({
  "password": zod.string(),
  "newPassword": zod.string()
});

export type ChangePasswordRequest = zod.input<typeof ChangePasswordRequest>;
export type ChangePasswordRequestOutput = zod.output<typeof ChangePasswordRequest>;
