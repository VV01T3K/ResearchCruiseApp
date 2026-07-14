import { z as zod } from 'zod';

export const portCallFieldsNameMin = 0;
export const portCallFieldsNameMax = 1024;

export const portCallFieldsStartTimeMin = 0;
export const portCallFieldsStartTimeMax = 1024;

export const portCallFieldsEndTimeMin = 0;
export const portCallFieldsEndTimeMax = 1024;



export const PortCallFields = zod.object({
  "name": zod.string().min(portCallFieldsNameMin).max(portCallFieldsNameMax).optional(),
  "startTime": zod.string().min(portCallFieldsStartTimeMin).max(portCallFieldsStartTimeMax).optional(),
  "endTime": zod.string().min(portCallFieldsEndTimeMin).max(portCallFieldsEndTimeMax).optional()
});

export type PortCallFields = zod.input<typeof PortCallFields>;
export type PortCallFieldsOutput = zod.output<typeof PortCallFields>;
