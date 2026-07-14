import { z } from 'zod';

export const GuestTeamValuesSchema = z.object({
  name: z.string().nonempty('Instytucja jest wymagana'),
  noOfPersons: z.number().positive('Liczba osób musi być liczbą większą od 0'),
});

export type GuestTeamValues = z.infer<typeof GuestTeamValuesSchema>;
