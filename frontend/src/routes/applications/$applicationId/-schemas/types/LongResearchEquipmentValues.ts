import { z } from 'zod';

export const LongResearchEquipmentValuesInputSchema = z.object({
  name: z.string(),
  action: z.enum(['Put', 'Collect']),
  duration: z.string(),
});

export const LongResearchEquipmentValuesSchema = LongResearchEquipmentValuesInputSchema.extend({
  name: z.string().nonempty('Nazwa jest wymagana'),
  action: z.enum(['Put', 'Collect'], {
    error: 'Akcja jest wymagana',
  }),
  duration: z.string().nonempty('Czas trwania jest wymagany'),
});

export type LongResearchEquipmentValues = z.input<typeof LongResearchEquipmentValuesInputSchema>;
