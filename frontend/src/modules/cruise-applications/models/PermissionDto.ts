import { z } from 'zod';

import { FileDto, FileDtoValidationSchema } from '@/cruise-applications/models/FileDto';

export type PermissionDto = {
  description: string;
  executive: string;
  scan?: FileDto | undefined;
};

export const PermissionDtoValidationSchema = z.object({
  description: z.string().nonempty('Treść pozwolenia jest wymagany'),
  executive: z.string().nonempty('Organ wydający jest wymagany'),
  scan: FileDtoValidationSchema.optional(),
});
