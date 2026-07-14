import { z } from 'zod';

export const FormFileValuesInputSchema = z.object({ name: z.string(), content: z.string() });

export const FormFileValuesSchema = FormFileValuesInputSchema.extend({
  name: z.string().nonempty('Nazwa pliku nie może być pusta'),
  content: z.string().nonempty('Zawartość pliku nie może być pusta'),
});

export type FormFileValues = z.input<typeof FormFileValuesInputSchema>;
