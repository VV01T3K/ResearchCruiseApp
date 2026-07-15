import { z as zod } from 'zod';

export const SpubTaskFields = zod.object({
  "name": zod.string().nullish(),
  "yearFrom": zod.string().nullish(),
  "yearTo": zod.string().nullish()
});

export type SpubTaskFields = zod.input<typeof SpubTaskFields>;
export type SpubTaskFieldsOutput = zod.output<typeof SpubTaskFields>;
