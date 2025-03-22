import { z } from 'zod';

export type FileDto = {
  name: string;
  content: string;
};

export const FileDtoValidationSchema = z.object(
  {
    name: z.string().nonempty('Nazwa pliku nie może być pusta'),
    content: z.string().nonempty('Zawartość pliku nie może być pusta'),
  },
  {
    message: 'Plik jest wymagany',
  }
);
