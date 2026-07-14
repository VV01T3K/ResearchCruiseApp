import { z as zod } from 'zod';

export const ImportPublicationRequest = zod.object({
  "category": zod.string(),
  "doi": zod.string().nullable(),
  "authors": zod.string().nullable(),
  "title": zod.string().nullable(),
  "magazine": zod.string().nullable(),
  "year": zod.string().nullable(),
  "ministerialPoints": zod.string()
});

export type ImportPublicationRequest = zod.input<typeof ImportPublicationRequest>;
export type ImportPublicationRequestOutput = zod.output<typeof ImportPublicationRequest>;
