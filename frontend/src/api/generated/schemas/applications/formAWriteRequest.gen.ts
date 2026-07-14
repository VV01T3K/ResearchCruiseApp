import { z as zod } from 'zod';
import { FormADto } from './formADto.gen.ts';

export const FormAWriteRequest = zod.object({
  "form": FormADto,
  "draft": zod.boolean()
});

export type FormAWriteRequest = zod.input<typeof FormAWriteRequest>;
export type FormAWriteRequestOutput = zod.output<typeof FormAWriteRequest>;
