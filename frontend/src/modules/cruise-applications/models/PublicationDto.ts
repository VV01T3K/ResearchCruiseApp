import { z } from 'zod';

export type PublicationDto = {
  id: string;
  category: 'subject' | 'postscript';
  doi: string;
  authors: string;
  title: string;
  magazine: string;
  year: string;
  ministerialPoints: string;
};

export const PublicationDtoValidationSchema = z.object({
  id: z.string().uuid(),
  category: z.enum(['subject', 'postscript']),
  doi: z.string().nonempty('DOI jest wymagane'),
  authors: z.string().nonempty('Autorzy są wymagani'),
  title: z.string().nonempty('Tytuł jest wymagany'),
  magazine: z.string().nonempty('Czasopismo jest wymagane'),
  year: z.string().nonempty('Rok jest wymagany'),
  ministerialPoints: z.string().refine((val) => {
    const parsed = parseInt(val, 10);
    return !isNaN(parsed) && parsed >= 0;
  }, 'Punkty muszą być liczbą nieujemną'),
});
