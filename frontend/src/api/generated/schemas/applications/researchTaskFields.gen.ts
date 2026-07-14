import { z as zod } from 'zod';

export const ResearchTaskFields = zod.object({
  "type": zod.string().optional(),
  "title": zod.string().nullish(),
  "magazine": zod.string().nullish(),
  "author": zod.string().nullish(),
  "institution": zod.string().nullish(),
  "date": zod.string().nullish(),
  "startDate": zod.string().nullish(),
  "endDate": zod.string().nullish(),
  "financingAmount": zod.string().nullish(),
  "financingApproved": zod.string().nullish(),
  "description": zod.string().nullish(),
  "securedAmount": zod.string().nullish(),
  "ministerialPoints": zod.string().nullish()
});

export type ResearchTaskFields = zod.input<typeof ResearchTaskFields>;
export type ResearchTaskFieldsOutput = zod.output<typeof ResearchTaskFields>;
