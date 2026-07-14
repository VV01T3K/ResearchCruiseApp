import { z as zod } from 'zod';
import { ContractDto } from './contractDto.gen.ts';

export const formAContractDtoIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const FormAContractDto = zod.object({
  "id": zod.string().regex(formAContractDtoIdRegExp).optional(),
  "contract": ContractDto.optional(),
  "points": zod.string().optional()
});

export type FormAContractDto = zod.input<typeof FormAContractDto>;
export type FormAContractDtoOutput = zod.output<typeof FormAContractDto>;
