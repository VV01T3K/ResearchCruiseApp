import { z as zod } from 'zod';

export const shortTermResearchEquipmentFieldsNameMin = 0;
export const shortTermResearchEquipmentFieldsNameMax = 1024;

export const shortTermResearchEquipmentFieldsStartDateMin = 0;
export const shortTermResearchEquipmentFieldsStartDateMax = 1024;

export const shortTermResearchEquipmentFieldsEndDateMin = 0;
export const shortTermResearchEquipmentFieldsEndDateMax = 1024;



export const ShortTermResearchEquipmentFields = zod.object({
  "name": zod.string().min(shortTermResearchEquipmentFieldsNameMin).max(shortTermResearchEquipmentFieldsNameMax).optional(),
  "startDate": zod.string().min(shortTermResearchEquipmentFieldsStartDateMin).max(shortTermResearchEquipmentFieldsStartDateMax).optional(),
  "endDate": zod.string().min(shortTermResearchEquipmentFieldsEndDateMin).max(shortTermResearchEquipmentFieldsEndDateMax).optional()
});

export type ShortTermResearchEquipmentFields = zod.input<typeof ShortTermResearchEquipmentFields>;
export type ShortTermResearchEquipmentFieldsOutput = zod.output<typeof ShortTermResearchEquipmentFields>;
