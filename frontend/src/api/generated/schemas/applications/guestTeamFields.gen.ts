import { z as zod } from 'zod';

export const GuestTeamFields = zod.object({
  "name": zod.string().nullable(),
  "noOfPersons": zod.string()
});

export type GuestTeamFields = zod.input<typeof GuestTeamFields>;
export type GuestTeamFieldsOutput = zod.output<typeof GuestTeamFields>;
