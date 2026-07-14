import { z as zod } from 'zod';

export const cruiseManagerResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const CruiseManagerResponse = zod.object({
  "id": zod.string().regex(cruiseManagerResponseIdRegExp),
  "email": zod.string(),
  "firstName": zod.string(),
  "lastName": zod.string()
});

export type CruiseManagerResponse = zod.input<typeof CruiseManagerResponse>;
export type CruiseManagerResponseOutput = zod.output<typeof CruiseManagerResponse>;
