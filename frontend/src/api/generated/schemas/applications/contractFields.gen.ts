import { z as zod } from 'zod';
import { FileContent } from './fileContent.gen.ts';

export const ContractFields = zod.object({
  "category": zod.string(),
  "institutionName": zod.string().nullable(),
  "institutionUnit": zod.string().nullable(),
  "institutionLocalization": zod.string().nullable(),
  "description": zod.string().nullable(),
  "scans": zod.array(FileContent)
});

export type ContractFields = zod.input<typeof ContractFields>;
export type ContractFieldsOutput = zod.output<typeof ContractFields>;
