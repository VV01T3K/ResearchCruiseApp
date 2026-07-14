import { z } from 'zod';

import {
  ResearchTaskValuesInputSchema,
  ResearchTaskValuesSchema,
} from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

const EffectFieldsSchema = z.object({
  done: z.enum(['true', 'false']),
  managerConditionMet: z.enum(['true', 'false']),
  deputyConditionMet: z.enum(['true', 'false']),
});

export const ResearchTaskEffectValuesInputSchema = z.intersection(ResearchTaskValuesInputSchema, EffectFieldsSchema);

export const ResearchTaskEffectValuesSchema = z.intersection(ResearchTaskValuesSchema, EffectFieldsSchema);

export type ResearchTaskEffectValues = z.input<typeof ResearchTaskEffectValuesInputSchema>;
