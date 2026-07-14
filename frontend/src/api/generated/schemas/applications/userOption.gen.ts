import { z as zod } from 'zod';

export const userOptionIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const UserOption = zod.object({
  "id": zod.string().regex(userOptionIdRegExp).optional(),
  "email": zod.string().optional(),
  "firstName": zod.string().optional(),
  "lastName": zod.string().optional()
});

export type UserOption = zod.input<typeof UserOption>;
export type UserOptionOutput = zod.output<typeof UserOption>;
