import { z } from 'zod';

export type ShortResearchEquipmentDto = {
  name: string;
  startDate: string;
  endDate: string;
};

export const ShortResearchEquipmentDtoValidationSchema = z.object({
  name: z.string().nonempty('Nazwa sprzętu jest wymagana'),
  startDate: z.string().nonempty('Data rozpoczęcia jest wymagana'),
  endDate: z.string().nonempty('Data zakończenia jest wymagana'),
});
