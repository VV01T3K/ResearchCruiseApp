import { z as zod } from 'zod';
import { ResearchTaskFields } from './researchTaskFields.gen.ts';

export const scoredResearchTaskIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const ScoredResearchTask = zod.object({
  "id": zod.string().regex(scoredResearchTaskIdRegExp).optional(),
  "researchTask": ResearchTaskFields.optional(),
  "points": zod.string().optional()
});

export type ScoredResearchTask = zod.input<typeof ScoredResearchTask>;
export type ScoredResearchTaskOutput = zod.output<typeof ScoredResearchTask>;
