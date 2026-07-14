import { z as zod } from 'zod';

export const publicationDtoIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const PublicationDto = zod.object({
  "id": zod.string().regex(publicationDtoIdRegExp).optional(),
  "category": zod.string().optional(),
  "doi": zod.string().nullish(),
  "authors": zod.string().nullish(),
  "title": zod.string().nullish(),
  "magazine": zod.string().nullish(),
  "year": zod.string().nullish(),
  "ministerialPoints": zod.string().optional()
});

export type PublicationDto = zod.input<typeof PublicationDto>;
export type PublicationDtoOutput = zod.output<typeof PublicationDto>;
