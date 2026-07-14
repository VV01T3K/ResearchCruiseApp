import { z as zod } from 'zod';

export const GuestTeamDto = zod.object({
  "name": zod.string().nullish(),
  "noOfPersons": zod.string().optional()
});

export type GuestTeamDto = zod.input<typeof GuestTeamDto>;
export type GuestTeamDtoOutput = zod.output<typeof GuestTeamDto>;
