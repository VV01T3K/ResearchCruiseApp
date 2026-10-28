import * as zod from 'zod';

export const ConfirmCruiseParams = zod.object({
  "revision": zod.string().optional()
})

export type ConfirmCruiseParams = zod.input<typeof ConfirmCruiseParams>;
export type ConfirmCruiseParamsOutput = zod.output<typeof ConfirmCruiseParams>;
