import { z as zod } from 'zod';
import { ApplicationPersonResponse } from './applicationPersonResponse.gen.ts';
import { CruiseApplicationStatus } from './cruiseApplicationStatus.gen.ts';

export const applicationResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const applicationResponseCruiseDaysRegExpTwo = new RegExp('^-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[eE][+-]?\\d+)?$');


export const ApplicationResponse = zod.object({
  "id": zod.string().regex(applicationResponseIdRegExp),
  "number": zod.string(),
  "date": zod.iso.date(),
  "year": zod.number(),
  "mainManager": ApplicationPersonResponse,
  "deputyManager": ApplicationPersonResponse,
  "hasFormA": zod.boolean(),
  "hasFormB": zod.boolean(),
  "hasFormC": zod.boolean(),
  "points": zod.number(),
  "status": CruiseApplicationStatus,
  "effectsDoneRate": zod.string(),
  "note": zod.string().nullable(),
  "cruiseHours": zod.string().nullable(),
  "cruiseDays": zod.union([zod.number(),zod.stringFormat('float', applicationResponseCruiseDaysRegExpTwo)]).nullable(),
  "acceptablePeriodBeg": zod.string().nullable(),
  "acceptablePeriodEnd": zod.string().nullable(),
  "optimalPeriodBeg": zod.string().nullable(),
  "optimalPeriodEnd": zod.string().nullable(),
  "precisePeriodStart": zod.iso.datetime({"offset":true}).nullable(),
  "precisePeriodEnd": zod.iso.datetime({"offset":true}).nullable(),
  "startDate": zod.iso.datetime({"offset":true}).nullable(),
  "endDate": zod.iso.datetime({"offset":true}).nullable()
});

export type ApplicationResponse = zod.input<typeof ApplicationResponse>;
export type ApplicationResponseOutput = zod.output<typeof ApplicationResponse>;
