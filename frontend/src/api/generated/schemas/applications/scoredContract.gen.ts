import { z as zod } from 'zod';
import { ContractFields } from './contractFields.gen.ts';

export const scoredContractIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const ScoredContract = zod.object({
  "id": zod.string().regex(scoredContractIdRegExp).optional(),
  "contract": ContractFields.optional(),
  "points": zod.string().optional()
});

export type ScoredContract = zod.input<typeof ScoredContract>;
export type ScoredContractOutput = zod.output<typeof ScoredContract>;
