import { z as zod } from 'zod';

export const shortResearchEquipmentDtoNameMin = 0;
export const shortResearchEquipmentDtoNameMax = 1024;

export const shortResearchEquipmentDtoStartDateMin = 0;
export const shortResearchEquipmentDtoStartDateMax = 1024;

export const shortResearchEquipmentDtoEndDateMin = 0;
export const shortResearchEquipmentDtoEndDateMax = 1024;



export const ShortResearchEquipmentDto = zod.object({
  "name": zod.string().min(shortResearchEquipmentDtoNameMin).max(shortResearchEquipmentDtoNameMax).optional(),
  "startDate": zod.string().min(shortResearchEquipmentDtoStartDateMin).max(shortResearchEquipmentDtoStartDateMax).optional(),
  "endDate": zod.string().min(shortResearchEquipmentDtoEndDateMin).max(shortResearchEquipmentDtoEndDateMax).optional()
});

export type ShortResearchEquipmentDto = zod.input<typeof ShortResearchEquipmentDto>;
export type ShortResearchEquipmentDtoOutput = zod.output<typeof ShortResearchEquipmentDto>;
