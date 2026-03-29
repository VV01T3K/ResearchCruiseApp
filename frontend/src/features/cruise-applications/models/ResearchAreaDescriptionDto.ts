import { z } from 'zod';

import { FormAInitValuesDto } from './FormAInitValuesDto';

export type ResearchAreaDescriptionDto = {
  areaId: string | null;
  differentName: string | null;
  info: string;
};

export function getResearchAreaDescriptionDtoValidationSchema(formAInitValues: FormAInitValuesDto) {
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
