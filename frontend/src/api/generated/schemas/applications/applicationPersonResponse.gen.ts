import { z as zod } from 'zod';

export const applicationPersonResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const ApplicationPersonResponse = zod.object({
  "id": zod.string().regex(applicationPersonResponseIdRegExp),
  "email": zod.string(),
  "firstName": zod.string(),
  "lastName": zod.string()
});

export type ApplicationPersonResponse = zod.input<typeof ApplicationPersonResponse>;
export type ApplicationPersonResponseOutput = zod.output<typeof ApplicationPersonResponse>;
