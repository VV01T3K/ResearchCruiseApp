import { z as zod } from 'zod';

export const confirmEmailParamsUserIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');

export const ConfirmEmailParams = zod.object({
  "userId": zod.string().regex(confirmEmailParamsUserIdRegExp),
  "code": zod.string()
})

export type ConfirmEmailParams = zod.input<typeof ConfirmEmailParams>;
export type ConfirmEmailParamsOutput = zod.output<typeof ConfirmEmailParams>;
