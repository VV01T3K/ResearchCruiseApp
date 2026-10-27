import * as zod from 'zod';

export const DeleteCruiseParams = zod.object({
  "revision": zod.string().optional()
})

export type DeleteCruiseParams = zod.input<typeof DeleteCruiseParams>;
export type DeleteCruiseParamsOutput = zod.output<typeof DeleteCruiseParams>;
