import { z } from 'zod';

import { FileDto, FileDtoValidationSchema } from '@/cruise-applications/models/FileDto';

export type PermissionDto = {
  description: string;
  executive: string;
  scan?: FileDto | undefined;
};

export const PermissionDtoValidationSchema = z.object({
  description: z.string().nonempty('Treść pozwolenia jest wymagany').max(10240, 'Maksymalna długość to 10240 znaków'),
  executive: z.string().nonempty('Organ wydający jest wymagany'),
  scan: FileDtoValidationSchema.optional(),
});

export const PermissionDtoWithFileValidationSchema = PermissionDtoValidationSchema.extend({
  scan: FileDtoValidationSchema.extend({
    name: z.string().endsWith('.pdf', 'Plik musi być w formacie PDF'),
  }),
});
