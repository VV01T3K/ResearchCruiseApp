import { z } from 'zod';

import {
  DidacticsResearchTaskInputSchema,
  DidacticsResearchTaskValuesSchema,
  OtherResearchTaskInputSchema,
  OtherResearchTaskValuesSchema,
  OwnResearchTaskInputSchema,
  OwnResearchTaskValuesSchema,
  ProjectPreparationResearchTaskInputSchema,
  ProjectPreparationResearchTaskValuesSchema,
  ProjectResearchTaskInputSchema,
  ProjectResearchTaskValuesSchema,
  ThesisResearchTaskInputSchema,
  ThesisResearchTaskValuesSchema,
} from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

const effectFields = {
  done: z.boolean(),
  managerConditionMet: z.boolean(),
  deputyConditionMet: z.boolean(),
};

export const ResearchTaskEffectValuesInputSchema = z.union([
  ThesisResearchTaskInputSchema.extend(effectFields),
  ProjectPreparationResearchTaskInputSchema.extend(effectFields),
  ProjectResearchTaskInputSchema.extend(effectFields),
  DidacticsResearchTaskInputSchema.extend(effectFields),
  OwnResearchTaskInputSchema.extend(effectFields),
  OtherResearchTaskInputSchema.extend(effectFields),
]);

export const ResearchTaskEffectValuesSchema = z.union([
  ThesisResearchTaskValuesSchema.extend(effectFields),
  ProjectPreparationResearchTaskValuesSchema.extend(effectFields),
  ProjectResearchTaskValuesSchema.extend(effectFields),
  DidacticsResearchTaskValuesSchema.extend(effectFields),
  OwnResearchTaskValuesSchema.extend(effectFields),
  OtherResearchTaskValuesSchema.extend(effectFields),
]);

export type ResearchTaskEffectValues = z.input<typeof ResearchTaskEffectValuesInputSchema>;
