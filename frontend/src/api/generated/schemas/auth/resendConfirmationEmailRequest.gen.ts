import { z as zod } from 'zod';

export const ResendConfirmationEmailRequest = zod.object({
  "email": zod.string()
});

export type ResendConfirmationEmailRequest = zod.input<typeof ResendConfirmationEmailRequest>;
export type ResendConfirmationEmailRequestOutput = zod.output<typeof ResendConfirmationEmailRequest>;
