import { z as zod } from 'zod';

export const portDtoNameMin = 0;
export const portDtoNameMax = 1024;

export const portDtoStartTimeMin = 0;
export const portDtoStartTimeMax = 1024;

export const portDtoEndTimeMin = 0;
export const portDtoEndTimeMax = 1024;



export const PortDto = zod.object({
  "name": zod.string().min(portDtoNameMin).max(portDtoNameMax).optional(),
  "startTime": zod.string().min(portDtoStartTimeMin).max(portDtoStartTimeMax).optional(),
  "endTime": zod.string().min(portDtoEndTimeMin).max(portDtoEndTimeMax).optional()
});

export type PortDto = zod.input<typeof PortDto>;
export type PortDtoOutput = zod.output<typeof PortDto>;
