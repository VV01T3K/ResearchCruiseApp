import { z as zod } from 'zod';

export const ResearchTaskEffectFields = zod.object({
  "type": zod.string(),
  "title": zod.string().nullable(),
  "magazine": zod.string().nullable(),
  "author": zod.string().nullable(),
  "institution": zod.string().nullable(),
  "date": zod.string().nullable(),
  "startDate": zod.string().nullable(),
  "endDate": zod.string().nullable(),
  "financingAmount": zod.string().nullable(),
  "financingApproved": zod.string().nullable(),
  "description": zod.string().nullable(),
  "securedAmount": zod.string().nullable(),
  "ministerialPoints": zod.string().nullable(),
  "done": zod.string(),
  "publicationMinisterialPoints": zod.string().nullable(),
  "managerConditionMet": zod.string(),
  "deputyConditionMet": zod.string()
});

export type ResearchTaskEffectFields = zod.input<typeof ResearchTaskEffectFields>;
export type ResearchTaskEffectFieldsOutput = zod.output<typeof ResearchTaskEffectFields>;
