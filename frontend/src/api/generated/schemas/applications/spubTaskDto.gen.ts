import { z as zod } from 'zod';

export const SpubTaskDto = zod.object({
  "name": zod.string().nullish(),
  "yearFrom": zod.string().nullish(),
  "yearTo": zod.string().nullish()
});

export type SpubTaskDto = zod.input<typeof SpubTaskDto>;
export type SpubTaskDtoOutput = zod.output<typeof SpubTaskDto>;
