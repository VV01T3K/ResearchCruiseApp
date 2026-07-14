import { z } from 'zod';

export const LongResearchEquipmentValuesSchema = z.object({
  name: z.string().nonempty('Nazwa jest wymagana'),
  action: z.enum(['Put', 'Collect'], {
    error: 'Akcja jest wymagana',
  }),
  duration: z.string().nonempty('Czas trwania jest wymagany'),
});

export type LongResearchEquipmentValues = z.infer<typeof LongResearchEquipmentValuesSchema>;
