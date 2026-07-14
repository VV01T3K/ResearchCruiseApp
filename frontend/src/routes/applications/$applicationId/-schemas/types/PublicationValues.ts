import { z } from 'zod';

export enum PublicationCategory {
  Subject = 'subject',
  Postscript = 'postscript',
}

export function getPublicationCategoryLabel(category: PublicationCategory) {
  switch (category) {
    case PublicationCategory.Subject:
      return 'Temat';
    case PublicationCategory.Postscript:
      return 'Dopisek';
  }
}

export const PublicationValuesSchema = z.object({
  id: z.guid().or(z.literal('')),
  category: z.enum(PublicationCategory),
  doi: z.string().nonempty('DOI jest wymagane'),
  authors: z.string().nonempty('Autorzy są wymagani'),
  title: z.string().nonempty('Tytuł jest wymagany'),
  magazine: z.string().nonempty('Czasopismo jest wymagane'),
  year: z.number().int().positive('Rok jest wymagany'),
  ministerialPoints: z.number().nonnegative('Punkty muszą być liczbą nieujemną'),
});

export type PublicationValues = z.infer<typeof PublicationValuesSchema>;
