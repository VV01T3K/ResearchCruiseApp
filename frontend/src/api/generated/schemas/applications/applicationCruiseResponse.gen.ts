import { z as zod } from 'zod';
import { ApplicationCruiseApplicationSummaryResponse } from './applicationCruiseApplicationSummaryResponse.gen.ts';
import { ApplicationCruisePersonResponse } from './applicationCruisePersonResponse.gen.ts';

export const applicationCruiseResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const ApplicationCruiseResponse = zod.object({
  "id": zod.string().regex(applicationCruiseResponseIdRegExp),
  "number": zod.string(),
  "startDate": zod.string(),
  "endDate": zod.string(),
  "mainManager": ApplicationCruisePersonResponse,
  "deputyManager": ApplicationCruisePersonResponse,
  "applications": zod.array(ApplicationCruiseApplicationSummaryResponse),
  "status": zod.string(),
  "title": zod.string().nullable(),
  "shipUnavailable": zod.boolean()
});

export type ApplicationCruiseResponse = zod.input<typeof ApplicationCruiseResponse>;
export type ApplicationCruiseResponseOutput = zod.output<typeof ApplicationCruiseResponse>;
