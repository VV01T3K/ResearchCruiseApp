import { z as zod } from 'zod';

export const longTermResearchEquipmentFieldsNameMin = 0;
export const longTermResearchEquipmentFieldsNameMax = 1024;

export const longTermResearchEquipmentFieldsActionMin = 0;
export const longTermResearchEquipmentFieldsActionMax = 1024;

export const longTermResearchEquipmentFieldsDurationMin = 0;
export const longTermResearchEquipmentFieldsDurationMax = 1024;



export const LongTermResearchEquipmentFields = zod.object({
  "name": zod.string().min(longTermResearchEquipmentFieldsNameMin).max(longTermResearchEquipmentFieldsNameMax).optional(),
  "action": zod.string().min(longTermResearchEquipmentFieldsActionMin).max(longTermResearchEquipmentFieldsActionMax).optional(),
  "duration": zod.string().min(longTermResearchEquipmentFieldsDurationMin).max(longTermResearchEquipmentFieldsDurationMax).optional()
});

export type LongTermResearchEquipmentFields = zod.input<typeof LongTermResearchEquipmentFields>;
export type LongTermResearchEquipmentFieldsOutput = zod.output<typeof LongTermResearchEquipmentFields>;
