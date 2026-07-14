import { z } from 'zod';

import { FormFileValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/FormFileValues';

export const PermissionValuesSchema = z.object({
  description: z.string().nonempty('Treść pozwolenia jest wymagana').max(10240, 'Maksymalna długość to 10240 znaków'),
  executive: z.string().nonempty('Organ wydający jest wymagany'),
  scan: FormFileValuesSchema.optional(),
});

export const PermissionWithFileValuesSchema = PermissionValuesSchema.extend({
  scan: FormFileValuesSchema.extend({
    name: z.string().endsWith('.pdf', 'Plik musi być w formacie PDF'),
  }),
});

export type PermissionValues = z.input<typeof PermissionValuesSchema>;
