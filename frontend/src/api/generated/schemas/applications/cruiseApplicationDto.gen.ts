import { z as zod } from 'zod';
import { CruiseApplicationStatus } from './cruiseApplicationStatus.gen.ts';

export const cruiseApplicationDtoIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const cruiseApplicationDtoCruiseManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const cruiseApplicationDtoDeputyManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const cruiseApplicationDtoCruiseDaysRegExpTwo = new RegExp('^-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[eE][+-]?\\d+)?$');


export const CruiseApplicationDto = zod.object({
  "id": zod.string().regex(cruiseApplicationDtoIdRegExp).optional(),
  "number": zod.string().optional(),
  "date": zod.iso.date().optional(),
  "year": zod.number().optional(),
  "cruiseManagerId": zod.string().regex(cruiseApplicationDtoCruiseManagerIdRegExp).optional(),
  "cruiseManagerEmail": zod.string().optional(),
  "cruiseManagerFirstName": zod.string().optional(),
  "cruiseManagerLastName": zod.string().optional(),
  "deputyManagerId": zod.string().regex(cruiseApplicationDtoDeputyManagerIdRegExp).optional(),
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
  "cruiseDays": zod.union([zod.number(),zod.stringFormat('float', cruiseApplicationDtoCruiseDaysRegExpTwo)]).nullish(),
  "acceptablePeriodBeg": zod.string().nullish(),
  "acceptablePeriodEnd": zod.string().nullish(),
  "optimalPeriodBeg": zod.string().nullish(),
  "optimalPeriodEnd": zod.string().nullish(),
  "precisePeriodStart": zod.iso.datetime({"offset":true}).nullish(),
  "precisePeriodEnd": zod.iso.datetime({"offset":true}).nullish(),
  "startDate": zod.iso.datetime({"offset":true}).nullish(),
  "endDate": zod.iso.datetime({"offset":true}).nullish()
});

export type CruiseApplicationDto = zod.input<typeof CruiseApplicationDto>;
export type CruiseApplicationDtoOutput = zod.output<typeof CruiseApplicationDto>;
