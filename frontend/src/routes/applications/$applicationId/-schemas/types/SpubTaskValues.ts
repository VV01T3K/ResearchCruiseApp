import { z } from 'zod';

export const SpubTaskValuesInputSchema = z.object({
  name: z.string(),
  yearFrom: z.string(),
  yearTo: z.string(),
});

export const SpubTaskValuesSchema = SpubTaskValuesInputSchema.extend({
  name: z.string().nonempty('Nazwa jest wymagana'),
  yearFrom: z.string().nonempty('Rok rozpoczęcia jest wymagany'),
  yearTo: z.string().nonempty('Rok zakończenia jest wymagany'),
});

export type SpubTaskValues = z.input<typeof SpubTaskValuesInputSchema>;
