import { z } from 'zod';

export const GuestTeamValuesInputSchema = z.object({
  name: z.string(),
  noOfPersons: z.number(),
});

export const GuestTeamValuesSchema = GuestTeamValuesInputSchema.extend({
  name: z.string().nonempty('Instytucja jest wymagana'),
  noOfPersons: z.number().positive('Liczba osób musi być liczbą większą od 0'),
});

export type GuestTeamValues = z.input<typeof GuestTeamValuesInputSchema>;
