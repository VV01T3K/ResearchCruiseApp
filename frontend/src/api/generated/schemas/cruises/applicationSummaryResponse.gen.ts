import { z as zod } from 'zod';

export const applicationSummaryResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const applicationSummaryResponseCruiseManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const applicationSummaryResponseDeputyManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const ApplicationSummaryResponse = zod.object({
  "id": zod.string().regex(applicationSummaryResponseIdRegExp),
  "cruiseManagerId": zod.string().regex(applicationSummaryResponseCruiseManagerIdRegExp),
  "deputyManagerId": zod.string().regex(applicationSummaryResponseDeputyManagerIdRegExp),
  "number": zod.string(),
  "points": zod.string()
});

export type ApplicationSummaryResponse = zod.input<typeof ApplicationSummaryResponse>;
export type ApplicationSummaryResponseOutput = zod.output<typeof ApplicationSummaryResponse>;
