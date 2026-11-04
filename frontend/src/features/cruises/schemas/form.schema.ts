import { z } from 'zod';

import { CreateRequest, type CruiseResponse } from '@/api/generated/schemas';
import { emptyGuid } from '@/lib/applications/person';

function managerIdSchema(message: string) {
  return z.union([z.literal(''), z.guid(message)]).transform((id) => id || emptyGuid);
}

export const CruiseFormInputSchema = z
  .object({
    startDate: z.iso.datetime('Wymagane jest wskazanie daty rozpoczęcia rejsu'),
    endDate: z.iso.datetime('Wymagane jest wskazanie daty zakończenia rejsu'),
    mainManagerId: managerIdSchema('Nieprawidłowy identyfikator kierownika rejsu'),
    deputyManagerId: managerIdSchema('Nieprawidłowy identyfikator zastępcy kierownika rejsu'),
    cruiseApplicationIds: z.array(z.guid()),
    title: z.string().optional(),
    shipUnavailable: z.boolean(),
    revision: z.string().optional(),
  })
  .superRefine(({ startDate, endDate, mainManagerId, deputyManagerId, shipUnavailable, title }, ctx) => {
    if (new Date(startDate) >= new Date(endDate)) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Data zakończenia rejsu musi być późniejsza niż data rozpoczęcia rejsu',
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

export const CruiseFormSchema = CruiseFormInputSchema.transform((cruise): z.input<typeof CreateRequest> => ({
  ...cruise,
  title: cruise.title || null,
})).pipe(CreateRequest);

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
    revision: cruise.revision,
  };
}

export function findOverlappingCruises(cruises: CruiseResponse[], startDate: string, endDate: string, ownId?: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return cruises.filter(
    (cruise) =>
      cruise.id !== ownId &&
      cruise.startDate !== cruise.endDate &&
      (!cruise.shipUnavailable || cruise.status !== 'ended') &&
      new Date(cruise.startDate) < end &&
      start < new Date(cruise.endDate)
  );
}
