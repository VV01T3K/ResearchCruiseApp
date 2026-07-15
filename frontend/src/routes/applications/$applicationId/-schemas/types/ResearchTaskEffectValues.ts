import { z } from 'zod';

import {
  ResearchTaskValuesInputSchema,
  ResearchTaskValuesSchema,
} from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

const effectFields = {
  done: z.boolean(),
  managerConditionMet: z.boolean(),
  deputyConditionMet: z.boolean(),
};

const withEffectFields = (schemas: typeof ResearchTaskValuesInputSchema.options) =>
  z.union(schemas.map((schema) => schema.extend(effectFields)));

export const ResearchTaskEffectValuesInputSchema = withEffectFields(ResearchTaskValuesInputSchema.options);
export const ResearchTaskEffectValuesSchema = withEffectFields(ResearchTaskValuesSchema.options);

export type ResearchTaskEffectValues = z.input<typeof ResearchTaskEffectValuesInputSchema>;
