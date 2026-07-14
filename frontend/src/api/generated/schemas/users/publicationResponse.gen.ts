import { z as zod } from 'zod';

export const publicationResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const PublicationResponse = zod.object({
  "id": zod.string().regex(publicationResponseIdRegExp),
  "category": zod.string(),
  "doi": zod.string().nullable(),
  "authors": zod.string().nullable(),
  "title": zod.string().nullable(),
  "magazine": zod.string().nullable(),
  "year": zod.string().nullable(),
  "ministerialPoints": zod.string()
});

export type PublicationResponse = zod.input<typeof PublicationResponse>;
export type PublicationResponseOutput = zod.output<typeof PublicationResponse>;
