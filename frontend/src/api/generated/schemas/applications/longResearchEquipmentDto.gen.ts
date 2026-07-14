import { z as zod } from 'zod';

export const longResearchEquipmentDtoNameMin = 0;
export const longResearchEquipmentDtoNameMax = 1024;

export const longResearchEquipmentDtoActionMin = 0;
export const longResearchEquipmentDtoActionMax = 1024;

export const longResearchEquipmentDtoDurationMin = 0;
export const longResearchEquipmentDtoDurationMax = 1024;



export const LongResearchEquipmentDto = zod.object({
  "name": zod.string().min(longResearchEquipmentDtoNameMin).max(longResearchEquipmentDtoNameMax).optional(),
  "action": zod.string().min(longResearchEquipmentDtoActionMin).max(longResearchEquipmentDtoActionMax).optional(),
  "duration": zod.string().min(longResearchEquipmentDtoDurationMin).max(longResearchEquipmentDtoDurationMax).optional()
});

export type LongResearchEquipmentDto = zod.input<typeof LongResearchEquipmentDto>;
export type LongResearchEquipmentDtoOutput = zod.output<typeof LongResearchEquipmentDto>;
