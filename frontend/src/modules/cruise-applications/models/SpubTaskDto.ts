import { z } from 'zod';

export type SpubTaskDto = {
  name: string;
  yearFrom: string;
  yearTo: string;
};

export const SpubTaskDtoValidationSchema = z.object({
  name: z.string().nonempty('Nazwa jest wymagana'),
  yearFrom: z.string().nonempty('Rok rozpoczęcia jest wymagany'),
  yearTo: z.string().nonempty('Rok zakończenia jest wymagany'),
});
