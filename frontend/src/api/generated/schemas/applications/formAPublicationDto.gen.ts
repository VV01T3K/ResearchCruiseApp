import { z as zod } from 'zod';
import { PublicationDto } from './publicationDto.gen.ts';

export const formAPublicationDtoIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const FormAPublicationDto = zod.object({
  "id": zod.string().regex(formAPublicationDtoIdRegExp).optional(),
  "publication": PublicationDto.optional(),
  "points": zod.string().optional()
});

export type FormAPublicationDto = zod.input<typeof FormAPublicationDto>;
export type FormAPublicationDtoOutput = zod.output<typeof FormAPublicationDto>;
