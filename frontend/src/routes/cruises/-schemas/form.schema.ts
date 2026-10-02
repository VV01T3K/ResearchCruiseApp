import { z } from 'zod';

import { CreateRequest, type CruiseResponse } from '@/api/generated/schemas';

const emptyGuid = '00000000-0000-0000-0000-000000000000';
export const CruiseFormInputSchema = z
  .object({
    startDate: z.iso.datetime('Wymagane jest wskazanie daty rozpoczęcia rejsu'),
    endDate: z.iso.datetime('Wymagane jest wskazanie daty zakończenia rejsu'),
    mainManagerId: z.guid('Wymagane jest wskazanie kierownika rejsu'),
    deputyManagerId: z.guid('Wymagane jest wskazanie zastępcy kierownika rejsu'),
    cruiseApplicationIds: z.array(z.guid()),
    title: z.string().optional(),
    shipUnavailable: z.boolean(),
  })
  .superRefine(({ startDate, endDate, mainManagerId, deputyManagerId, shipUnavailable, title }, ctx) => {
    if (new Date(startDate) > new Date(endDate)) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Data rozpoczęcia rejsu nie może być późniejsza niż data zakończenia rejsu',
      });
    }

    if (mainManagerId !== emptyGuid && mainManagerId === deputyManagerId) {
      ctx.addIssue({
        code: 'custom',
        path: ['deputyManagerId'],
        message: 'Kierownik rejsu nie może być jednocześnie zastępcą kierownika rejsu',
      });
    }

    if (shipUnavailable && (!title || title.trim() === '')) {
      ctx.addIssue({
        code: 'custom',
        path: ['title'],
        message: 'Tytuł jest wymagany dla blokad statku',
      });
    }
  });

/** Create and update requests share one shape. */
export const CruiseFormSchema = CruiseFormInputSchema.transform(
  (cruise): z.input<typeof CreateRequest> => ({ ...cruise, title: cruise.title || null })
).pipe(CreateRequest);

export type CruiseFormValues = z.input<typeof CruiseFormInputSchema>;

export const cruiseFormDefaultValues: CruiseFormValues = {
  startDate: '',
  endDate: '',
  mainManagerId: '',
  deputyManagerId: '',
  cruiseApplicationIds: [],
  title: '',
  shipUnavailable: false,
} satisfies CruiseFormValues;

export function mapCruiseToValues(cruise: CruiseResponse): CruiseFormValues {
  return {
    startDate: cruise.startDate,
    endDate: cruise.endDate,
    mainManagerId: cruise.mainManager.id,
    deputyManagerId: cruise.deputyManager.id,
    cruiseApplicationIds: cruise.applications.map((application) => application.id),
    title: cruise.title ?? '',
    shipUnavailable: cruise.shipUnavailable,
  };
}
