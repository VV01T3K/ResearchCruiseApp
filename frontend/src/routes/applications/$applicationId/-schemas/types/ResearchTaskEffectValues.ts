import { z } from 'zod';

import { ResearchTaskValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

export const ResearchTaskEffectValuesSchema = z.intersection(
  ResearchTaskValuesSchema,
  z.object({
    done: z.enum(['true', 'false']),
    managerConditionMet: z.enum(['true', 'false']),
    deputyConditionMet: z.enum(['true', 'false']),
  })
);

export type ResearchTaskEffectValues = z.infer<typeof ResearchTaskEffectValuesSchema>;
