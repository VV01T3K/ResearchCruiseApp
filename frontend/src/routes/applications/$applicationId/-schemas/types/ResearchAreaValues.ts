import { z } from 'zod';

import { FormAOptions } from './FormAOptions';

export function getResearchAreaValuesSchema(formAInitValues: FormAOptions) {
  return z
    .object({
      areaId: z
        .string()
        .nullable()
        .refine(
          (val) => !val || formAInitValues.researchAreas.map((x) => x.id).includes(val),
          'Niepoprawne ID rejonu badań'
        ),
      differentName: z.string().nullable(),
      info: z.string(),
    })
    .superRefine(({ areaId, differentName }, ctx) => {
      if (!areaId && !differentName) {
        ctx.addIssue({
          code: 'custom',
          message: 'Nazwa rejonu badań nie może być pusta',
          path: ['differentName'],
        });
      }
    });
}

export type ResearchAreaValues = z.infer<ReturnType<typeof getResearchAreaValuesSchema>>;
