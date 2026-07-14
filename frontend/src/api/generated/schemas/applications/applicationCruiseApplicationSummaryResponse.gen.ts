import { z as zod } from 'zod';

export const applicationCruiseApplicationSummaryResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const applicationCruiseApplicationSummaryResponseCruiseManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const applicationCruiseApplicationSummaryResponseDeputyManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const ApplicationCruiseApplicationSummaryResponse = zod.object({
  "id": zod.string().regex(applicationCruiseApplicationSummaryResponseIdRegExp),
  "cruiseManagerId": zod.string().regex(applicationCruiseApplicationSummaryResponseCruiseManagerIdRegExp),
  "deputyManagerId": zod.string().regex(applicationCruiseApplicationSummaryResponseDeputyManagerIdRegExp),
  "number": zod.string(),
  "points": zod.string()
});

export type ApplicationCruiseApplicationSummaryResponse = zod.input<typeof ApplicationCruiseApplicationSummaryResponse>;
export type ApplicationCruiseApplicationSummaryResponseOutput = zod.output<typeof ApplicationCruiseApplicationSummaryResponse>;
