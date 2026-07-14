import { z } from 'zod';

export const CruiseDayValuesInputSchema = z.object({
  number: z.number(),
  hours: z.number(),
  taskName: z.string(),
  region: z.string(),
  position: z.string(),
  comment: z.string(),
});

export const CruiseDayValuesSchema = CruiseDayValuesInputSchema.extend({
  number: z.number().nonnegative('Numer dnia rejsu jest wymagany'),
  hours: z.number().nonnegative('Godziny są wymagane'),
  taskName: z.string().nonempty('Nazwa zadania jest wymagana'),
  region: z.string().nonempty('Region jest wymagany'),
  position: z.string().nonempty('Pozycja jest wymagana'),
  comment: z.string().max(1024, 'Komentarz nie może być dłuższy niż 1024 znaków'),
});

export type CruiseDayValues = z.input<typeof CruiseDayValuesInputSchema>;
