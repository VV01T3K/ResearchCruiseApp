import { z as zod } from 'zod';

export const ExportCruisesParams = zod.object({
  "year": zod.string()
})

export type ExportCruisesParams = zod.input<typeof ExportCruisesParams>;
export type ExportCruisesParamsOutput = zod.output<typeof ExportCruisesParams>;
