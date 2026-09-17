import { z as zod } from 'zod';

export const getApplicationsParamsNumberItemRegExpTwo = new RegExp('^-?(?:0|[1-9]\\d*)$');
export const getApplicationsParamsYearItemRegExpTwo = new RegExp('^-?(?:0|[1-9]\\d*)$');
export const getApplicationsParamsCruiseManagerItemRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const getApplicationsParamsPageSizeRegExpTwo = new RegExp('^-?(?:0|[1-9]\\d*)$');
export const getApplicationsParamsSortByDefault = `number`;
export const getApplicationsParamsDescendingDefault = true;
export const GetApplicationsParams = zod.object({
  "cursor": zod.string().optional(),
  "number": zod.array(zod.union([zod.number(),zod.stringFormat('int32', getApplicationsParamsNumberItemRegExpTwo)])).optional(),
  "date": zod.array(zod.iso.date()).optional(),
  "status": zod.array(zod.string()).optional(),
  "year": zod.array(zod.union([zod.number(),zod.stringFormat('int32', getApplicationsParamsYearItemRegExpTwo)])).optional(),
  "cruiseManager": zod.array(zod.string().regex(getApplicationsParamsCruiseManagerItemRegExp)).optional(),
  "pageSize": zod.union([zod.number(),zod.stringFormat('int32', getApplicationsParamsPageSizeRegExpTwo)]).optional(),
  "sortBy": zod.string().default(getApplicationsParamsSortByDefault),
  "descending": zod.boolean().default(getApplicationsParamsDescendingDefault)
})

export type GetApplicationsParams = zod.input<typeof GetApplicationsParams>;
export type GetApplicationsParamsOutput = zod.output<typeof GetApplicationsParams>;
