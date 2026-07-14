import { z as zod } from 'zod';

export const publicationFieldsIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const PublicationFields = zod.object({
  "id": zod.string().regex(publicationFieldsIdRegExp),
  "category": zod.string(),
  "doi": zod.string().nullable(),
  "authors": zod.string().nullable(),
  "title": zod.string().nullable(),
  "magazine": zod.string().nullable(),
  "year": zod.string().nullable(),
  "ministerialPoints": zod.string()
});

export type PublicationFields = zod.input<typeof PublicationFields>;
export type PublicationFieldsOutput = zod.output<typeof PublicationFields>;
