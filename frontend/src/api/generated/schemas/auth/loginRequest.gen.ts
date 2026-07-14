import { z as zod } from 'zod';

export const LoginRequest = zod.object({
  "email": zod.string(),
  "password": zod.string()
});

export type LoginRequest = zod.input<typeof LoginRequest>;
export type LoginRequestOutput = zod.output<typeof LoginRequest>;
