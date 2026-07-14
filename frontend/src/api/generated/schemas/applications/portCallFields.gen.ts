import { z as zod } from 'zod';

export const portCallFieldsNameMin = 0;
export const portCallFieldsNameMax = 1024;

export const portCallFieldsStartTimeMin = 0;
export const portCallFieldsStartTimeMax = 1024;

export const portCallFieldsEndTimeMin = 0;
export const portCallFieldsEndTimeMax = 1024;



export const PortCallFields = zod.object({
  "name": zod.string().min(portCallFieldsNameMin).max(portCallFieldsNameMax),
  "startTime": zod.string().min(portCallFieldsStartTimeMin).max(portCallFieldsStartTimeMax),
  "endTime": zod.string().min(portCallFieldsEndTimeMin).max(portCallFieldsEndTimeMax)
});

export type PortCallFields = zod.input<typeof PortCallFields>;
export type PortCallFieldsOutput = zod.output<typeof PortCallFields>;
