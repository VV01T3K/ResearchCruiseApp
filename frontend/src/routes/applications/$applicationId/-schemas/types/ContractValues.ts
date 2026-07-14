import { z } from 'zod';

import { FormFileValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/FormFileValues';

export function getContractCategoryName(category: ContractValues['category']): string {
  return category === 'domestic' ? 'Krajowa' : 'Międzynarodowa';
}

export const ContractValuesSchema = z.object({
  category: z.enum(['domestic', 'international']),
  institutionName: z.string().nonempty('Nazwa instytucji jest wymagana'),
  institutionUnit: z.string().nonempty('Jednostka jest wymagana'),
  institutionLocalization: z.string().nonempty('Lokalizacja instytucji jest wymagana'),
  description: z.string().nonempty('Opis jest wymagany').max(10240, 'Maksymalna długość to 10240 znaków'),
  scans: FormFileValuesSchema.array(),
});

export type ContractValues = z.infer<typeof ContractValuesSchema>;
