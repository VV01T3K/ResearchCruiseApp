import { z } from 'zod';

export type LongResearchEquipmentDto = {
  name: string;
  action: 'Put' | 'Collect';
  duration: string;
};

export const LongResearchEquipmentDtoValidationSchema = z.object({
  name: z.string().nonempty('Nazwa jest wymagana'),
  action: z.enum(['Put', 'Collect'], { message: 'Akcja jest wymagana' }),
  duration: z.string().nonempty('Czas trwania jest wymagany'),
});
