import { z as zod } from 'zod';

export const researchAreaOptionIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const ResearchAreaOption = zod.object({
  "id": zod.string().regex(researchAreaOptionIdRegExp),
  "name": zod.string()
});

export type ResearchAreaOption = zod.input<typeof ResearchAreaOption>;
export type ResearchAreaOptionOutput = zod.output<typeof ResearchAreaOption>;
