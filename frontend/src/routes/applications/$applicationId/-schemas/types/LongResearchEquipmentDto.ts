import { z } from 'zod';

export const LongResearchEquipmentDtoValidationSchema = z.object({
  name: z.string().nonempty('Nazwa jest wymagana'),
  action: z.enum(['Put', 'Collect'], {
    error: 'Akcja jest wymagana',
  }),
  duration: z.string().nonempty('Czas trwania jest wymagany'),
});

export type LongResearchEquipmentDto = z.infer<typeof LongResearchEquipmentDtoValidationSchema>;
