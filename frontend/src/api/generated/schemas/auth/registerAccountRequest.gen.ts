import { z as zod } from 'zod';

export const RegisterAccountRequest = zod.object({
  "email": zod.string(),
  "password": zod.string(),
  "firstName": zod.string(),
  "lastName": zod.string()
});

export type RegisterAccountRequest = zod.input<typeof RegisterAccountRequest>;
export type RegisterAccountRequestOutput = zod.output<typeof RegisterAccountRequest>;
