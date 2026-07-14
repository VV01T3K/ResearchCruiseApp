import { z as zod } from 'zod';
import { FormAFields } from './formAFields.gen.ts';

export const FormAWriteRequest = zod.object({
  "form": FormAFields,
  "draft": zod.boolean()
});

export type FormAWriteRequest = zod.input<typeof FormAWriteRequest>;
export type FormAWriteRequestOutput = zod.output<typeof FormAWriteRequest>;
