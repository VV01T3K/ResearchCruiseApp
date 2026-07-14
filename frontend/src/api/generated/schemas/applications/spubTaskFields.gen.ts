import { z as zod } from 'zod';

export const SpubTaskFields = zod.object({
  "name": zod.string().nullable(),
  "yearFrom": zod.string().nullable(),
  "yearTo": zod.string().nullable()
});

export type SpubTaskFields = zod.input<typeof SpubTaskFields>;
export type SpubTaskFieldsOutput = zod.output<typeof SpubTaskFields>;
