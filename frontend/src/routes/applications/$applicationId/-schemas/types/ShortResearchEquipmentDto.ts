import { z } from 'zod';

export const ShortResearchEquipmentDtoValidationSchema = z.object({
  name: z.string().nonempty('Nazwa sprzętu jest wymagana'),
  startDate: z.string().nonempty('Data rozpoczęcia jest wymagana'),
  endDate: z.string().nonempty('Data zakończenia jest wymagana'),
});

export type ShortResearchEquipmentDto = z.infer<typeof ShortResearchEquipmentDtoValidationSchema>;
