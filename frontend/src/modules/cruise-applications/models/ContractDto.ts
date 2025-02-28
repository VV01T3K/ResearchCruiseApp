import { z } from 'zod';

import { FileDto, FileDtoValidationSchema } from '@/cruise-applications/models/FileDto';

export type ContractDto = {
  category: 'domestic' | 'international';
  institutionName: string;
  institutionUnit: string;
  institutionLocalization: string;
  description: string;
  scan: FileDto | undefined;
};

export function getContractCategoryName(category: ContractDto['category']): string {
  return category === 'domestic' ? 'Krajowa' : 'Międzynarodowa';
}

export const ContractDtoValidationSchema = z.object({
  category: z.enum(['domestic', 'international']),
  institutionName: z.string().nonempty('Nazwa instytucji jest wymagana'),
  institutionUnit: z.string().nonempty('Jednostka jest wymagana'),
  institutionLocalization: z.string().nonempty('Lokalizacja instytucji jest wymagana'),
  description: z.string().nonempty('Opis jest wymagany'),
  scan: FileDtoValidationSchema,
});
