import { z as zod } from 'zod';

export const researchEquipmentDtoNameMin = 0;
export const researchEquipmentDtoNameMax = 1024;

export const researchEquipmentDtoInsuranceStartDateMin = 0;
export const researchEquipmentDtoInsuranceStartDateMax = 1024;

export const researchEquipmentDtoInsuranceEndDateMin = 0;
export const researchEquipmentDtoInsuranceEndDateMax = 1024;

export const researchEquipmentDtoPermissionMin = 0;
export const researchEquipmentDtoPermissionMax = 1024;



export const ResearchEquipmentDto = zod.object({
  "name": zod.string().min(researchEquipmentDtoNameMin).max(researchEquipmentDtoNameMax).optional(),
  "insuranceStartDate": zod.string().min(researchEquipmentDtoInsuranceStartDateMin).max(researchEquipmentDtoInsuranceStartDateMax).nullish(),
  "insuranceEndDate": zod.string().min(researchEquipmentDtoInsuranceEndDateMin).max(researchEquipmentDtoInsuranceEndDateMax).nullish(),
  "permission": zod.string().min(researchEquipmentDtoPermissionMin).max(researchEquipmentDtoPermissionMax).optional()
});

export type ResearchEquipmentDto = zod.input<typeof ResearchEquipmentDto>;
export type ResearchEquipmentDtoOutput = zod.output<typeof ResearchEquipmentDto>;
