import * as zod from 'zod';

export const guestTeamFieldsNameMin = 0;
export const guestTeamFieldsNameMax = 1024;

export const guestTeamFieldsNoOfPersonsMin = 0;
export const guestTeamFieldsNoOfPersonsMax = 1024;



export const GuestTeamFields = zod.object({
  "name": zod.string().min(guestTeamFieldsNameMin).max(guestTeamFieldsNameMax).nullish(),
  "noOfPersons": zod.string().min(guestTeamFieldsNoOfPersonsMin).max(guestTeamFieldsNoOfPersonsMax).optional()
});

export type GuestTeamFields = zod.input<typeof GuestTeamFields>;
export type GuestTeamFieldsOutput = zod.output<typeof GuestTeamFields>;
