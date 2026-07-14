import { z as zod } from 'zod';
import { PublicationFields } from './publicationFields.gen.ts';

export const scoredPublicationIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const ScoredPublication = zod.object({
  "id": zod.string().regex(scoredPublicationIdRegExp).optional(),
  "publication": PublicationFields.optional(),
  "points": zod.string().optional()
});

export type ScoredPublication = zod.input<typeof ScoredPublication>;
export type ScoredPublicationOutput = zod.output<typeof ScoredPublication>;
