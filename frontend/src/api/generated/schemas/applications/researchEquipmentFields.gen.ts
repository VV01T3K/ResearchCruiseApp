import { z as zod } from 'zod';

export const researchEquipmentFieldsNameMin = 0;
export const researchEquipmentFieldsNameMax = 1024;

export const researchEquipmentFieldsInsuranceStartDateMin = 0;
export const researchEquipmentFieldsInsuranceStartDateMax = 1024;

export const researchEquipmentFieldsInsuranceEndDateMin = 0;
export const researchEquipmentFieldsInsuranceEndDateMax = 1024;

export const researchEquipmentFieldsPermissionMin = 0;
export const researchEquipmentFieldsPermissionMax = 1024;



export const ResearchEquipmentFields = zod.object({
  "name": zod.string().min(researchEquipmentFieldsNameMin).max(researchEquipmentFieldsNameMax).optional(),
  "insuranceStartDate": zod.string().min(researchEquipmentFieldsInsuranceStartDateMin).max(researchEquipmentFieldsInsuranceStartDateMax).nullish(),
  "insuranceEndDate": zod.string().min(researchEquipmentFieldsInsuranceEndDateMin).max(researchEquipmentFieldsInsuranceEndDateMax).nullish(),
  "permission": zod.string().min(researchEquipmentFieldsPermissionMin).max(researchEquipmentFieldsPermissionMax).optional()
});

export type ResearchEquipmentFields = zod.input<typeof ResearchEquipmentFields>;
export type ResearchEquipmentFieldsOutput = zod.output<typeof ResearchEquipmentFields>;
