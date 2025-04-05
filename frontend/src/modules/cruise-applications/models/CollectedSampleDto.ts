import { z } from 'zod';

export type CollectedSampleDto = {
  type: string; // Max length 1024
  amount: string; // Max length 1024
  analysis: string; // Max length 1024
  publishing: string; // Max length 1024
};

export const CollectedSampleDtoValidationSchema = z.object({
  type: z
    .string()
    .nonempty('Typ próbki nie może być pusty')
    .max(1024, 'Typ próbki nie może być dłuższy niż 1024 znaki'),
  amount: z.string().refine((val) => {
    const parsed = parseInt(val, 10);
    return !isNaN(parsed) && parsed > 0;
  }, 'Ilość musi być liczbą dodatnią'),
  analysis: z
    .string()
    .nonempty('Analiza próbki nie może być pusta')
    .max(1024, 'Analiza próbki nie może być dłuższa niż 1024 znaki'),
  publishing: z
    .string()
    .nonempty('Publikacja próbki nie może być pusta')
    .max(1024, 'Publikacja próbki nie może być dłuższa niż 1024 znaki'),
});
