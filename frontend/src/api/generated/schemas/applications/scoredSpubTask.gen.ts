import { z as zod } from 'zod';
import { SpubTaskFields } from './spubTaskFields.gen.ts';

export const scoredSpubTaskIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const ScoredSpubTask = zod.object({
  "id": zod.string().regex(scoredSpubTaskIdRegExp).optional(),
  "spubTask": SpubTaskFields.optional(),
  "points": zod.string().optional()
});

export type ScoredSpubTask = zod.input<typeof ScoredSpubTask>;
export type ScoredSpubTaskOutput = zod.output<typeof ScoredSpubTask>;
