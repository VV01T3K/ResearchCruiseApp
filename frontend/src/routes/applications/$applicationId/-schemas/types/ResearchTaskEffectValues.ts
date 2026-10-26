import { z } from 'zod';

import { isMinisterialPoints, MINISTERIAL_POINTS_MESSAGE } from '@/lib/applications/scoreLimits';

import {
  ResearchTaskValuesInputSchema,
  ResearchTaskValuesSchema,
} from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

const effectFields = {
  done: z.boolean(),
  managerConditionMet: z.boolean(),
  deputyConditionMet: z.boolean(),
  publicationMinisterialPoints: z
    .string()
    .refine((value) => value === '' || isMinisterialPoints(value), MINISTERIAL_POINTS_MESSAGE)
    .nullable()
    .optional(),
};

const withEffectFields = (
  schemas: typeof ResearchTaskValuesInputSchema.options | typeof ResearchTaskValuesSchema.options
) => z.union(schemas.map((schema) => schema.extend(effectFields)));

export const ResearchTaskEffectValuesInputSchema = withEffectFields(ResearchTaskValuesInputSchema.options);
export const ResearchTaskEffectValuesSchema = withEffectFields(ResearchTaskValuesSchema.options);

export type ResearchTaskEffectValues = z.input<typeof ResearchTaskEffectValuesInputSchema>;
