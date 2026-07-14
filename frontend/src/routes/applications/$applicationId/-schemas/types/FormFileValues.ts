import { z } from 'zod';

export const FormFileValuesSchema = z.object(
  {
    name: z.string().nonempty('Nazwa pliku nie może być pusta'),
    content: z.string().nonempty('Zawartość pliku nie może być pusta'),
  },
  {
    error: 'Plik jest wymagany',
  }
);

export type FormFileValues = z.infer<typeof FormFileValuesSchema>;
