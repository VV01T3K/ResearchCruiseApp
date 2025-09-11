import { z } from 'zod';

export type CruiseDayDetailsDto = {
  number: string;
  hours: string;
  taskName: string;
  region: string;
  position: string;
  comment: string;
};

export const CruiseDayDetailsDtoValidationSchema = z.object({
  number: z.string().nonempty('Numer dnia rejsu jest wymagany'),
  hours: z.string().nonempty('Godziny są wymagane'),
  taskName: z.string().nonempty('Nazwa zadania jest wymagana'),
  region: z.string().nonempty('Region jest wymagany'),
  position: z.string().nonempty('Pozycja jest wymagana'),
  comment: z.string().nonempty('Komentarz jest wymagany').max(10240, 'Komentarz nie może być dłuższy niż 10240 znaków'),
});
