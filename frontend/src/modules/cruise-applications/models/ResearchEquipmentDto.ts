import { z } from 'zod';

export type ResearchEquipmentDto = {
  name: string;
  insuranceStartDate: string | null;
  insuranceEndDate: string | null;
  permission: 'true' | 'false';
};

export const ResearchEquipmentDtoValidationSchema = z.object({
  name: z.string().nonempty('Nazwa jest wymagana'),
  insuranceStartDate: z.string().nullable(),
  insuranceEndDate: z.string().nullable(),
  permission: z.enum(['true', 'false'], { message: 'Pozwolenie jest wymagane' }),
});
