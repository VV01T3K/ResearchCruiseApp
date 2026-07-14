import { z } from 'zod';

export const SpubTaskDtoValidationSchema = z.object({
  name: z.string().nonempty('Nazwa jest wymagana'),
  yearFrom: z.string().nonempty('Rok rozpoczęcia jest wymagany'),
  yearTo: z.string().nonempty('Rok zakończenia jest wymagany'),
});

export type SpubTaskDto = z.infer<typeof SpubTaskDtoValidationSchema>;
