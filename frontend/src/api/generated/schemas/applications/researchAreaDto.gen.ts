import { z as zod } from 'zod';

export const researchAreaDtoIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const ResearchAreaDto = zod.object({
  "id": zod.string().regex(researchAreaDtoIdRegExp),
  "name": zod.string()
});

export type ResearchAreaDto = zod.input<typeof ResearchAreaDto>;
export type ResearchAreaDtoOutput = zod.output<typeof ResearchAreaDto>;
