import { z as zod } from 'zod';

export const CreateUserRequest = zod.object({
  "email": zod.string(),
  "firstName": zod.string(),
  "lastName": zod.string(),
  "roles": zod.array(zod.string())
});

export type CreateUserRequest = zod.input<typeof CreateUserRequest>;
export type CreateUserRequestOutput = zod.output<typeof CreateUserRequest>;
