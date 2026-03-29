import { z } from 'zod';

export type CollectedSampleDto = {
  type: string; // Max length 10240
  amount: string; // Max length 10240
  analysis: string; // Max length 10240
  publishing: string; // Max length 10240
};

export const CollectedSampleDtoValidationSchema = z.object({
  type: z
    .string()
    .nonempty('Typ próbki nie może być pusty')
    .max(10240, 'Typ próbki nie może być dłuższy niż 10240 znaków'),
  amount: z
    .string()
    .refine((val) => {
      const parsed = parseInt(val, 10);
      return !isNaN(parsed) && parsed > 0;
    }, 'Ilość musi być liczbą dodatnią')
    .refine((val) => val.length <= 10240, 'Ilość nie może być dłuższa niż 10240 znaków'),
  analysis: z
    .string()
    .nonempty('Analiza próbki nie może być pusta')
    .max(10240, 'Analiza próbki nie może być dłuższa niż 10240 znaków'),
  publishing: z
    .string()
    .nonempty('Publikacja próbki nie może być pusta')
    .max(10240, 'Publikacja próbki nie może być dłuższa niż 10240 znaków'),
});
