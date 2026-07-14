import { z as zod } from 'zod';

export const userResponseIdRegExp = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


export const UserResponse = zod.object({
  "id": zod.string().regex(userResponseIdRegExp),
  "email": zod.string(),
  "firstName": zod.string(),
  "lastName": zod.string(),
  "roles": zod.array(zod.string()),
  "emailConfirmed": zod.boolean(),
  "accepted": zod.boolean()
});

export type UserResponse = zod.input<typeof UserResponse>;
export type UserResponseOutput = zod.output<typeof UserResponse>;
