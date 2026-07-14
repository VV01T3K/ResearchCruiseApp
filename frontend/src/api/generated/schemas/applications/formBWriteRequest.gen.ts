import { z as zod } from 'zod';
import { FormBFields } from './formBFields.gen.ts';

export const FormBWriteRequest = zod.object({
  "form": FormBFields,
  "draft": zod.boolean()
});

export type FormBWriteRequest = zod.input<typeof FormBWriteRequest>;
export type FormBWriteRequestOutput = zod.output<typeof FormBWriteRequest>;
