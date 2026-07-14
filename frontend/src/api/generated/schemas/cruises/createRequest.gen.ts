import { z as zod } from 'zod';

export const createRequestMainManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const createRequestDeputyManagerIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
export const createRequestCruiseApplicationIdsItemRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const CreateRequest = zod.object({
  "startDate": zod.string(),
  "endDate": zod.string(),
  "mainManagerId": zod.string().regex(createRequestMainManagerIdRegExp),
  "deputyManagerId": zod.string().regex(createRequestDeputyManagerIdRegExp),
  "cruiseApplicationIds": zod.array(zod.string().regex(createRequestCruiseApplicationIdsItemRegExp)),
  "title": zod.string().nullable(),
  "shipUnavailable": zod.boolean()
});

export type CreateRequest = zod.input<typeof CreateRequest>;
export type CreateRequestOutput = zod.output<typeof CreateRequest>;
