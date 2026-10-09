import * as zod from 'zod';

export const spubTaskFieldsNameMin = 0;
export const spubTaskFieldsNameMax = 1024;

export const spubTaskFieldsYearFromMin = 0;
export const spubTaskFieldsYearFromMax = 1024;

export const spubTaskFieldsYearToMin = 0;
export const spubTaskFieldsYearToMax = 1024;



export const SpubTaskFields = zod.object({
  "name": zod.string().min(spubTaskFieldsNameMin).max(spubTaskFieldsNameMax).nullish(),
  "yearFrom": zod.string().min(spubTaskFieldsYearFromMin).max(spubTaskFieldsYearFromMax).nullish(),
  "yearTo": zod.string().min(spubTaskFieldsYearToMin).max(spubTaskFieldsYearToMax).nullish()
});

export type SpubTaskFields = zod.input<typeof SpubTaskFields>;
export type SpubTaskFieldsOutput = zod.output<typeof SpubTaskFields>;
