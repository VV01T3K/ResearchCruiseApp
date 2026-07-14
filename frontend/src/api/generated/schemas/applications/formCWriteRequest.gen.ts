import { z as zod } from 'zod';
import { FormCFields } from './formCFields.gen.ts';

export const FormCWriteRequest = zod.object({
  "form": FormCFields,
  "draft": zod.boolean()
});

export type FormCWriteRequest = zod.input<typeof FormCWriteRequest>;
export type FormCWriteRequestOutput = zod.output<typeof FormCWriteRequest>;
