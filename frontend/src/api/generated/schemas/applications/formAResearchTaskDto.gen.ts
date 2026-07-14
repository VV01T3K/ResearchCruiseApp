import { z as zod } from 'zod';
import { ResearchTaskDto } from './researchTaskDto.gen.ts';

export const formAResearchTaskDtoIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const FormAResearchTaskDto = zod.object({
  "id": zod.string().regex(formAResearchTaskDtoIdRegExp).optional(),
  "researchTask": ResearchTaskDto.optional(),
  "points": zod.string().optional()
});

export type FormAResearchTaskDto = zod.input<typeof FormAResearchTaskDto>;
export type FormAResearchTaskDtoOutput = zod.output<typeof FormAResearchTaskDto>;
