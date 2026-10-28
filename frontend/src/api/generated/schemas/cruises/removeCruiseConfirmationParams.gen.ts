import * as zod from 'zod';

export const RemoveCruiseConfirmationParams = zod.object({
  "revision": zod.string().optional()
})

export type RemoveCruiseConfirmationParams = zod.input<typeof RemoveCruiseConfirmationParams>;
export type RemoveCruiseConfirmationParamsOutput = zod.output<typeof RemoveCruiseConfirmationParams>;
