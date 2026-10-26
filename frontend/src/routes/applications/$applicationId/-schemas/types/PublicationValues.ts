import { z } from 'zod';

import { MAX_MINISTERIAL_POINTS, MINISTERIAL_POINTS_MESSAGE } from '@/lib/applications/scoreLimits';

export enum PublicationCategory {
  Subject = 'subject',
  Postscript = 'postscript',
}

export function getPublicationCategoryLabel(category: string | undefined) {
  switch (category) {
    case PublicationCategory.Subject:
      return 'Temat';
    case PublicationCategory.Postscript:
      return 'Dopisek';
    default:
      return 'Nieznany typ';
  }
}

export const PublicationValuesInputSchema = z.object({
  id: z.string(),
  category: z.enum(PublicationCategory),
  doi: z.string(),
  authors: z.string(),
  title: z.string(),
  magazine: z.string(),
  year: z.number().nullable(),
  ministerialPoints: z
    .number()
    .int(MINISTERIAL_POINTS_MESSAGE)
    .min(0, MINISTERIAL_POINTS_MESSAGE)
    .max(MAX_MINISTERIAL_POINTS, MINISTERIAL_POINTS_MESSAGE),
});

export const PublicationValuesSchema = PublicationValuesInputSchema.extend({
  id: z.guid().or(z.literal('')),
  category: z.enum(PublicationCategory),
  doi: z.string().nonempty('DOI jest wymagane'),
  authors: z.string().nonempty('Autorzy są wymagani'),
  title: z.string().nonempty('Tytuł jest wymagany'),
  magazine: z.string().nonempty('Czasopismo jest wymagane'),
  year: z.number({ error: 'Rok jest wymagany' }).int().positive('Rok jest wymagany'),
});

export type PublicationValues = z.input<typeof PublicationValuesInputSchema>;
