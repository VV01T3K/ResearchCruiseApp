import { z as zod } from 'zod';

export const publicationFieldsIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const PublicationFields = zod.object({
  "id": zod.string().regex(publicationFieldsIdRegExp).optional(),
  "category": zod.string().optional(),
  "doi": zod.string().nullish(),
  "authors": zod.string().nullish(),
  "title": zod.string().nullish(),
  "magazine": zod.string().nullish(),
  "year": zod.string().nullish(),
  "ministerialPoints": zod.string().optional()
});

export type PublicationFields = zod.input<typeof PublicationFields>;
export type PublicationFieldsOutput = zod.output<typeof PublicationFields>;
