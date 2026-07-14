import { z } from 'zod';

export const GuestTeamDtoValidationSchema = z.object({
  name: z.string().nonempty('Instytucja jest wymagana'),
  noOfPersons: z.string().refine((val) => {
    const parsed = parseInt(val, 10);
    return !isNaN(parsed) && parsed > 0;
  }, 'Liczba osób musi być liczbą większą od 0'),
});

export type GuestTeamDto = z.infer<typeof GuestTeamDtoValidationSchema>;
