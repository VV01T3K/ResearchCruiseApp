import * as zod from 'zod';

export const CompleteCruiseParams = zod.object({
  "revision": zod.string().optional()
})

export type CompleteCruiseParams = zod.input<typeof CompleteCruiseParams>;
export type CompleteCruiseParamsOutput = zod.output<typeof CompleteCruiseParams>;
