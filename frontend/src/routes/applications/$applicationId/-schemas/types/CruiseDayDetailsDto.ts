import { z } from 'zod';

export const CruiseDayDetailsDtoValidationSchema = z.object({
  number: z.string().nonempty('Numer dnia rejsu jest wymagany'),
  hours: z.string().nonempty('Godziny są wymagane'),
  taskName: z.string().nonempty('Nazwa zadania jest wymagana'),
  region: z.string().nonempty('Region jest wymagany'),
  position: z.string().nonempty('Pozycja jest wymagana'),
  comment: z.string().max(1024, 'Komentarz nie może być dłuższy niż 1024 znaków'),
});

export type CruiseDayDetailsDto = z.infer<typeof CruiseDayDetailsDtoValidationSchema>;
