import { z as zod } from 'zod';
import { FormCDto } from './formCDto.gen.ts';

export const FormCWriteRequest = zod.object({
  "form": FormCDto,
  "draft": zod.boolean()
});

export type FormCWriteRequest = zod.input<typeof FormCWriteRequest>;
export type FormCWriteRequestOutput = zod.output<typeof FormCWriteRequest>;
