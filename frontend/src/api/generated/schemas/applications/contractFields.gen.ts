import { z as zod } from 'zod';
import { EncodedFile } from './encodedFile.gen.ts';

export const ContractFields = zod.object({
  "category": zod.string().optional(),
  "institutionName": zod.string().nullish(),
  "institutionUnit": zod.string().nullish(),
  "institutionLocalization": zod.string().nullish(),
  "description": zod.string().nullish(),
  "scans": zod.array(EncodedFile).optional()
});

export type ContractFields = zod.input<typeof ContractFields>;
export type ContractFieldsOutput = zod.output<typeof ContractFields>;
