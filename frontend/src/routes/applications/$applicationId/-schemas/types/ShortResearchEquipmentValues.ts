import { z } from 'zod';

export const ShortResearchEquipmentValuesInputSchema = z.object({
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const ShortResearchEquipmentValuesSchema = ShortResearchEquipmentValuesInputSchema.extend({
  name: z.string().nonempty('Nazwa sprzętu jest wymagana'),
  startDate: z.string().nonempty('Data rozpoczęcia jest wymagana'),
  endDate: z.string().nonempty('Data zakończenia jest wymagana'),
});

export type ShortResearchEquipmentValues = z.input<typeof ShortResearchEquipmentValuesInputSchema>;
