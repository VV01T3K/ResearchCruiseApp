import { z } from 'zod';

export const ResearchEquipmentValuesInputSchema = z.object({
  name: z.string(),
  insuranceStartDate: z.string().nullable(),
  insuranceEndDate: z.string().nullable(),
  permission: z.boolean(),
});

export const ResearchEquipmentValuesSchema = ResearchEquipmentValuesInputSchema.extend({
  name: z.string().nonempty('Nazwa jest wymagana'),
  insuranceStartDate: z.string().nullable(),
  insuranceEndDate: z.string().nullable(),
  permission: z.boolean(),
});

export type ResearchEquipmentValues = z.input<typeof ResearchEquipmentValuesInputSchema>;
