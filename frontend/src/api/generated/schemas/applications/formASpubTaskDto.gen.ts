import { z as zod } from 'zod';
import { SpubTaskDto } from './spubTaskDto.gen.ts';

export const formASpubTaskDtoIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const FormASpubTaskDto = zod.object({
  "id": zod.string().regex(formASpubTaskDtoIdRegExp).optional(),
  "spubTask": SpubTaskDto.optional(),
  "points": zod.string().optional()
});

export type FormASpubTaskDto = zod.input<typeof FormASpubTaskDto>;
export type FormASpubTaskDtoOutput = zod.output<typeof FormASpubTaskDto>;
