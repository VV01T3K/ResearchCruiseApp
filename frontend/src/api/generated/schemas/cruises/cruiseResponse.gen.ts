import { z as zod } from 'zod';
import { ApplicationSummaryResponse } from './applicationSummaryResponse.gen.ts';
import { CruiseStatus } from '../cruiseStatus.gen.ts';
import { PersonResponse } from './personResponse.gen.ts';

export const cruiseResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const CruiseResponse = zod.object({
  "id": zod.string().regex(cruiseResponseIdRegExp),
  "number": zod.string(),
  "startDate": zod.string(),
  "endDate": zod.string(),
  "mainManager": PersonResponse,
  "deputyManager": PersonResponse,
  "applications": zod.array(ApplicationSummaryResponse),
  "status": CruiseStatus,
  "title": zod.string().nullable(),
  "shipUnavailable": zod.boolean()
});

export type CruiseResponse = zod.input<typeof CruiseResponse>;
export type CruiseResponseOutput = zod.output<typeof CruiseResponse>;
