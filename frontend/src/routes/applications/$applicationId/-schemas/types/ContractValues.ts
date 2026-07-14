import { z } from 'zod';

import { FormFileValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/FormFileValues';

export function getContractCategoryName(category: ContractValues['category']): string {
  return category === 'domestic' ? 'Krajowa' : 'Międzynarodowa';
}

export const ContractValuesInputSchema = z.object({
  category: z.enum(['domestic', 'international']),
  institutionName: z.string(),
  institutionUnit: z.string(),
  institutionLocalization: z.string(),
  description: z.string(),
  scans: FormFileValuesSchema.array(),
});

export const ContractValuesSchema = ContractValuesInputSchema.extend({
  institutionName: z.string().nonempty('Nazwa instytucji jest wymagana'),
  institutionUnit: z.string().nonempty('Jednostka jest wymagana'),
  institutionLocalization: z.string().nonempty('Lokalizacja instytucji jest wymagana'),
  description: z.string().nonempty('Opis jest wymagany').max(10240, 'Maksymalna długość to 10240 znaków'),
  scans: FormFileValuesSchema.array(),
});

export type ContractValues = z.input<typeof ContractValuesInputSchema>;
