import { z as zod } from 'zod';

export const researchAreaDescriptionDtoAreaIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const researchAreaDescriptionDtoDifferentNameMin = 0;
export const researchAreaDescriptionDtoDifferentNameMax = 1024;

export const researchAreaDescriptionDtoInfoMin = 0;
export const researchAreaDescriptionDtoInfoMax = 10240;



export const ResearchAreaDescriptionDto = zod.object({
  "areaId": zod.string().regex(researchAreaDescriptionDtoAreaIdRegExp).nullish(),
  "differentName": zod.string().min(researchAreaDescriptionDtoDifferentNameMin).max(researchAreaDescriptionDtoDifferentNameMax).nullish(),
  "info": zod.string().min(researchAreaDescriptionDtoInfoMin).max(researchAreaDescriptionDtoInfoMax).optional()
});

export type ResearchAreaDescriptionDto = zod.input<typeof ResearchAreaDescriptionDto>;
export type ResearchAreaDescriptionDtoOutput = zod.output<typeof ResearchAreaDescriptionDto>;
