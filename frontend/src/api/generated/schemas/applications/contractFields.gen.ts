import { z as zod } from 'zod';
import { FileContent } from './fileContent.gen.ts';

export const ContractFields = zod.object({
  "category": zod.string().optional(),
  "institutionName": zod.string().nullish(),
  "institutionUnit": zod.string().nullish(),
  "institutionLocalization": zod.string().nullish(),
  "description": zod.string().nullish(),
  "scans": zod.array(FileContent).optional()
});

export type ContractFields = zod.input<typeof ContractFields>;
export type ContractFieldsOutput = zod.output<typeof ContractFields>;
