import { z as zod } from 'zod';

export const cruiseDayFieldsNumberMin = 0;
export const cruiseDayFieldsNumberMax = 1024;

export const cruiseDayFieldsHoursMin = 0;
export const cruiseDayFieldsHoursMax = 1024;

export const cruiseDayFieldsTaskNameMin = 0;
export const cruiseDayFieldsTaskNameMax = 1024;

export const cruiseDayFieldsRegionMin = 0;
export const cruiseDayFieldsRegionMax = 1024;

export const cruiseDayFieldsPositionMin = 0;
export const cruiseDayFieldsPositionMax = 1024;

export const cruiseDayFieldsCommentMin = 0;
export const cruiseDayFieldsCommentMax = 1024;



export const CruiseDayFields = zod.object({
  "number": zod.string().min(cruiseDayFieldsNumberMin).max(cruiseDayFieldsNumberMax).optional(),
  "hours": zod.string().min(cruiseDayFieldsHoursMin).max(cruiseDayFieldsHoursMax).optional(),
  "taskName": zod.string().min(cruiseDayFieldsTaskNameMin).max(cruiseDayFieldsTaskNameMax).optional(),
  "region": zod.string().min(cruiseDayFieldsRegionMin).max(cruiseDayFieldsRegionMax).optional(),
  "position": zod.string().min(cruiseDayFieldsPositionMin).max(cruiseDayFieldsPositionMax).optional(),
  "comment": zod.string().min(cruiseDayFieldsCommentMin).max(cruiseDayFieldsCommentMax).optional()
});

export type CruiseDayFields = zod.input<typeof CruiseDayFields>;
export type CruiseDayFieldsOutput = zod.output<typeof CruiseDayFields>;
