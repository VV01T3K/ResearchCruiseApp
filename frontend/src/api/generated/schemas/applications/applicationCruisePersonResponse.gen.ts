import { z as zod } from 'zod';

export const applicationCruisePersonResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const ApplicationCruisePersonResponse = zod.object({
  "id": zod.string().regex(applicationCruisePersonResponseIdRegExp),
  "firstName": zod.string(),
  "lastName": zod.string()
});

export type ApplicationCruisePersonResponse = zod.input<typeof ApplicationCruisePersonResponse>;
export type ApplicationCruisePersonResponseOutput = zod.output<typeof ApplicationCruisePersonResponse>;
