import { z } from 'zod';

export const ResearchEquipmentDtoValidationSchema = z.object({
  name: z.string().nonempty('Nazwa jest wymagana'),
  insuranceStartDate: z.string().nullable(),
  insuranceEndDate: z.string().nullable(),
  permission: z.enum(['true', 'false'], {
    error: 'Pozwolenie jest wymagane',
  }),
});

export type ResearchEquipmentDto = z.infer<typeof ResearchEquipmentDtoValidationSchema>;
