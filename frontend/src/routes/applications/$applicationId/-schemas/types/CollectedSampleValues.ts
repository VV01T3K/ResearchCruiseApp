import { z } from 'zod';

export const CollectedSampleValuesSchema = z.object({
  type: z
    .string()
    .nonempty('Typ próbki nie może być pusty')
    .max(10240, 'Typ próbki nie może być dłuższy niż 10240 znaków'),
  amount: z.number().positive('Ilość musi być liczbą dodatnią'),
  analysis: z
    .string()
    .nonempty('Analiza próbki nie może być pusta')
    .max(10240, 'Analiza próbki nie może być dłuższa niż 10240 znaków'),
  publishing: z
    .string()
    .nonempty('Publikacja próbki nie może być pusta')
    .max(10240, 'Publikacja próbki nie może być dłuższa niż 10240 znaków'),
});

export type CollectedSampleValues = z.infer<typeof CollectedSampleValuesSchema>;
