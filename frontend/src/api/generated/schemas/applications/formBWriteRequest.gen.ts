import { z as zod } from 'zod';
import { FormBDto } from './formBDto.gen.ts';

export const FormBWriteRequest = zod.object({
  "form": FormBDto,
  "draft": zod.boolean()
});

export type FormBWriteRequest = zod.input<typeof FormBWriteRequest>;
export type FormBWriteRequestOutput = zod.output<typeof FormBWriteRequest>;
