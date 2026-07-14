import { z as zod } from 'zod';

export const researchAreaSelectionAreaIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const researchAreaSelectionDifferentNameMin = 0;
export const researchAreaSelectionDifferentNameMax = 1024;

export const researchAreaSelectionInfoMin = 0;
export const researchAreaSelectionInfoMax = 10240;



export const ResearchAreaSelection = zod.object({
  "areaId": zod.string().regex(researchAreaSelectionAreaIdRegExp).nullable(),
  "differentName": zod.string().min(researchAreaSelectionDifferentNameMin).max(researchAreaSelectionDifferentNameMax).nullable(),
  "info": zod.string().min(researchAreaSelectionInfoMin).max(researchAreaSelectionInfoMax)
});

export type ResearchAreaSelection = zod.input<typeof ResearchAreaSelection>;
export type ResearchAreaSelectionOutput = zod.output<typeof ResearchAreaSelection>;
