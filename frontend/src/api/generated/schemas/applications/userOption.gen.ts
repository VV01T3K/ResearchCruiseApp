import { z as zod } from 'zod';

export const userOptionIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const UserOption = zod.object({
  "id": zod.string().regex(userOptionIdRegExp),
  "email": zod.string(),
  "firstName": zod.string(),
  "lastName": zod.string()
});

export type UserOption = zod.input<typeof UserOption>;
export type UserOptionOutput = zod.output<typeof UserOption>;
