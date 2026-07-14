import { z as zod } from 'zod';

export const RequestPasswordResetRequest = zod.object({
  "email": zod.string()
});

export type RequestPasswordResetRequest = zod.input<typeof RequestPasswordResetRequest>;
export type RequestPasswordResetRequestOutput = zod.output<typeof RequestPasswordResetRequest>;
