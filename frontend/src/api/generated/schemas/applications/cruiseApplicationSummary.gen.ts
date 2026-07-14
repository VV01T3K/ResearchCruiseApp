import { z as zod } from 'zod';
import { CruiseApplicationStatus } from './cruiseApplicationStatus.gen.ts';

export const cruiseApplicationSummaryIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const cruiseApplicationSummaryCruiseManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const cruiseApplicationSummaryDeputyManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const CruiseApplicationSummary = zod.object({
  "id": zod.string().regex(cruiseApplicationSummaryIdRegExp).optional(),
  "number": zod.string().optional(),
  "date": zod.iso.date().optional(),
  "year": zod.number().optional(),
  "cruiseManagerId": zod.string().regex(cruiseApplicationSummaryCruiseManagerIdRegExp).optional(),
  "cruiseManagerEmail": zod.string().optional(),
  "cruiseManagerFirstName": zod.string().optional(),
  "cruiseManagerLastName": zod.string().optional(),
  "deputyManagerId": zod.string().regex(cruiseApplicationSummaryDeputyManagerIdRegExp).optional(),
  "deputyManagerEmail": zod.string().optional(),
  "deputyManagerFirstName": zod.string().optional(),
  "deputyManagerLastName": zod.string().optional(),
  "hasFormA": zod.boolean().optional(),
  "hasFormB": zod.boolean().optional(),
  "hasFormC": zod.boolean().optional(),
  "points": zod.number().optional(),
  "status": CruiseApplicationStatus.optional(),
  "effectsDoneRate": zod.string().optional(),
  "note": zod.string().nullish(),
  "cruiseHours": zod.string().nullish(),
  "cruiseDays": zod.number().nullish(),
  "acceptablePeriodBeg": zod.string().nullish(),
  "acceptablePeriodEnd": zod.string().nullish(),
  "optimalPeriodBeg": zod.string().nullish(),
  "optimalPeriodEnd": zod.string().nullish(),
  "precisePeriodStart": zod.iso.datetime({"offset":true}).nullish(),
  "precisePeriodEnd": zod.iso.datetime({"offset":true}).nullish(),
  "startDate": zod.iso.datetime({"offset":true}).nullish(),
  "endDate": zod.iso.datetime({"offset":true}).nullish()
});

export type CruiseApplicationSummary = zod.input<typeof CruiseApplicationSummary>;
export type CruiseApplicationSummaryOutput = zod.output<typeof CruiseApplicationSummary>;
