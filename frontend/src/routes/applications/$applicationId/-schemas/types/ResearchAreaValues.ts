import { z } from 'zod';

import { FormAOptions } from '@/api/client/applications/types/FormAOptions';

export const ResearchAreaValuesInputSchema = z.object({
  areaId: z.string().nullable(),
  differentName: z.string().nullable(),
  info: z.string(),
});

export function getResearchAreaValuesSchema(formAInitValues: FormAOptions) {
  return ResearchAreaValuesInputSchema.extend({
    areaId: z
      .string()
      .nullable()
      .refine(
        (val) => !val || formAInitValues.researchAreas.map((x) => x.id).includes(val),
        'Niepoprawne ID rejonu badań'
      ),
    differentName: z.string().nullable(),
  }).superRefine(({ areaId, differentName }, ctx) => {
    if (!areaId && !differentName) {
      ctx.addIssue({
        code: 'custom',
        message: 'Nazwa rejonu badań nie może być pusta',
        path: ['differentName'],
      });
    }
  });
}

export type ResearchAreaValues = z.input<typeof ResearchAreaValuesInputSchema>;
