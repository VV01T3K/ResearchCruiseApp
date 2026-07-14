import { z } from 'zod';

export const SpubTaskValuesSchema = z.object({
  name: z.string().nonempty('Nazwa jest wymagana'),
  yearFrom: z.string().nonempty('Rok rozpoczęcia jest wymagany'),
  yearTo: z.string().nonempty('Rok zakończenia jest wymagany'),
});

export type SpubTaskValues = z.infer<typeof SpubTaskValuesSchema>;
