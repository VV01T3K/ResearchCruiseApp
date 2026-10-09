import * as zod from 'zod';
import { FileContent } from './fileContent.gen.ts';

export const contractFieldsCategoryMin = 0;
export const contractFieldsCategoryMax = 1024;

export const contractFieldsInstitutionNameMin = 0;
export const contractFieldsInstitutionNameMax = 1024;

export const contractFieldsInstitutionUnitMin = 0;
export const contractFieldsInstitutionUnitMax = 1024;

export const contractFieldsInstitutionLocalizationMin = 0;
export const contractFieldsInstitutionLocalizationMax = 1024;

export const contractFieldsDescriptionMin = 0;
export const contractFieldsDescriptionMax = 10240;



export const ContractFields = zod.object({
  "category": zod.string().min(contractFieldsCategoryMin).max(contractFieldsCategoryMax).optional(),
  "institutionName": zod.string().min(contractFieldsInstitutionNameMin).max(contractFieldsInstitutionNameMax).nullish(),
  "institutionUnit": zod.string().min(contractFieldsInstitutionUnitMin).max(contractFieldsInstitutionUnitMax).nullish(),
  "institutionLocalization": zod.string().min(contractFieldsInstitutionLocalizationMin).max(contractFieldsInstitutionLocalizationMax).nullish(),
  "description": zod.string().min(contractFieldsDescriptionMin).max(contractFieldsDescriptionMax).nullish(),
  "scans": zod.array(FileContent).optional()
});

export type ContractFields = zod.input<typeof ContractFields>;
export type ContractFieldsOutput = zod.output<typeof ContractFields>;
