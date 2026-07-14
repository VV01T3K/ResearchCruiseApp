import { z } from 'zod';

import { ResearchTaskDtoValidationSchema } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskDto';

export const ResearchTaskEffectDtoValidationSchema = z.intersection(
  ResearchTaskDtoValidationSchema,
  z.object({
    done: z.enum(['true', 'false']),
    managerConditionMet: z.enum(['true', 'false']),
    deputyConditionMet: z.enum(['true', 'false']),
  })
);

export type ResearchTaskEffectDto = z.infer<typeof ResearchTaskEffectDtoValidationSchema>;
