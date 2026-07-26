import { z } from 'zod';

export const FormFileValuesInputSchema = z.object({ name: z.string(), content: z.string() });

export const FormFileValuesSchema = z.object(
  {
    name: z.string().nonempty('Nazwa pliku nie może być pusta'),
    content: z.string().nonempty('Zawartość pliku nie może być pusta'),
  },
  { error: 'Plik jest wymagany' }
);

export type FormFileValues = z.input<typeof FormFileValuesInputSchema>;
