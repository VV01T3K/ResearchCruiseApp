import { z as zod } from 'zod';

export const personResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const PersonResponse = zod.object({
  "id": zod.string().regex(personResponseIdRegExp),
  "firstName": zod.string(),
  "lastName": zod.string()
});

export type PersonResponse = zod.input<typeof PersonResponse>;
export type PersonResponseOutput = zod.output<typeof PersonResponse>;
