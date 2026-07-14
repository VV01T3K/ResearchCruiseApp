import { z as zod } from 'zod';

export const UpdateUserRequest = zod.object({
  "email": zod.string().nullish(),
  "firstName": zod.string().nullish(),
  "lastName": zod.string().nullish()
});

export type UpdateUserRequest = zod.input<typeof UpdateUserRequest>;
export type UpdateUserRequestOutput = zod.output<typeof UpdateUserRequest>;
