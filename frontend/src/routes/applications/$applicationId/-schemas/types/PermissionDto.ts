import { z } from 'zod';

import { FileDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/FileDto';

export const PermissionDtoValidationSchema = z.object({
  description: z.string().nonempty('Treść pozwolenia jest wymagana').max(10240, 'Maksymalna długość to 10240 znaków'),
  executive: z.string().nonempty('Organ wydający jest wymagany'),
  scan: FileDtoValidationSchema.optional(),
});

export const PermissionDtoWithFileValidationSchema = PermissionDtoValidationSchema.extend({
  scan: FileDtoValidationSchema.extend({
    name: z.string().endsWith('.pdf', 'Plik musi być w formacie PDF'),
  }),
});

export type PermissionDto = z.infer<typeof PermissionDtoValidationSchema>;
