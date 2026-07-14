import { z } from 'zod';

export const ShortResearchEquipmentValuesSchema = z.object({
  name: z.string().nonempty('Nazwa sprzętu jest wymagana'),
  startDate: z.string().nonempty('Data rozpoczęcia jest wymagana'),
  endDate: z.string().nonempty('Data zakończenia jest wymagana'),
});

export type ShortResearchEquipmentValues = z.infer<typeof ShortResearchEquipmentValuesSchema>;
