import { z } from 'zod';

import {
  ResearchTaskValuesInputSchema,
  ResearchTaskValuesSchema,
} from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';

const effectFields = {
  done: z.boolean(),
  managerConditionMet: z.boolean(),
  deputyConditionMet: z.boolean(),
  publicationMinisterialPoints: z.string().nullable().optional(),
};

const readOnlyDetails = { financingApproved: false, financingAmount: 0, securedAmount: 0, ministerialPoints: 0 };

// Form C only displays task details, so an unreadable one is saved back as stored instead of blocking the form.
const withEffectFields = (
  schemas: typeof ResearchTaskValuesInputSchema.options | typeof ResearchTaskValuesSchema.options
) => {
  const [first, ...rest] = schemas.map((option) => option.extend(effectFields));
  const schema = z.discriminatedUnion('type', [first, ...rest]);
  return z.custom<z.input<typeof schema>>().superRefine((task, ctx) => {
    const readable = Object.fromEntries(
      Object.entries(task).map(([key, value]) => [
        key,
        key in readOnlyDetails && typeof value === 'string'
          ? readOnlyDetails[key as keyof typeof readOnlyDetails]
          : value,
      ])
    );
    ctx.issues.push(
      ...(schema.safeParse(readable).error?.issues ?? []).map((issue) => ({ ...issue, input: undefined }))
    );
  });
};

export const ResearchTaskEffectValuesInputSchema = withEffectFields(ResearchTaskValuesInputSchema.options);
export const ResearchTaskEffectValuesSchema = withEffectFields(ResearchTaskValuesSchema.options);

export type ResearchTaskEffectValues = z.input<typeof ResearchTaskEffectValuesInputSchema>;
