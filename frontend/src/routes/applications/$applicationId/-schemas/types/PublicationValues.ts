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

export const PublicationValuesInputSchema = z.object({
  id: z.string(),
  category: z.enum(PublicationCategory),
  doi: z.string(),
  authors: z.string(),
  title: z.string(),
  magazine: z.string(),
  year: z.number(),
  ministerialPoints: z.number(),
});

export const PublicationValuesSchema = PublicationValuesInputSchema.extend({
  id: z.guid().or(z.literal('')),
  category: z.enum(PublicationCategory),
  doi: z.string().nonempty('DOI jest wymagane'),
  authors: z.string().nonempty('Autorzy są wymagani'),
  title: z.string().nonempty('Tytuł jest wymagany'),
  magazine: z.string().nonempty('Czasopismo jest wymagane'),
  year: z.number().int().positive('Rok jest wymagany'),
  ministerialPoints: z.number().nonnegative('Punkty muszą być liczbą nieujemną'),
});

export type PublicationValues = z.input<typeof PublicationValuesInputSchema>;
