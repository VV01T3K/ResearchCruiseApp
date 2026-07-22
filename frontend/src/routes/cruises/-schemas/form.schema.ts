import { z } from 'zod';

import { CreateRequest, UpdateRequest, type CruiseResponse } from '@/api/generated/schemas';

const emptyGuid = '00000000-0000-0000-0000-000000000000';
export const CruiseFormInputSchema = z
  .object({
    startDate: z.iso.datetime('Wymagane jest wskazanie daty rozpoczęcia rejsu'),
    endDate: z.iso.datetime('Wymagane jest wskazanie daty zakończenia rejsu'),
    managersTeam: z.object({
      mainCruiseManagerId: z.guid('Wymagane jest wskazanie kierownika rejsu'),
      mainDeputyManagerId: z.guid('Wymagane jest wskazanie zastępcy kierownika rejsu'),
    }),
    cruiseApplicationsIds: z.array(z.guid()),
    title: z.string().optional(),
    shipUnavailable: z.boolean(),
  })
  .superRefine(({ startDate, endDate, managersTeam, shipUnavailable, title }, ctx) => {
    if (new Date(startDate) > new Date(endDate)) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Data rozpoczęcia rejsu nie może być późniejsza niż data zakończenia rejsu',
      });
    }

    if (
      managersTeam.mainCruiseManagerId !== emptyGuid &&
      managersTeam.mainCruiseManagerId === managersTeam.mainDeputyManagerId
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['managersTeam', 'mainDeputyManagerId'],
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

const mapCruiseRequest = (cruise: CruiseFormValues) => ({
  startDate: cruise.startDate,
  endDate: cruise.endDate,
  mainManagerId: cruise.managersTeam.mainCruiseManagerId,
  deputyManagerId: cruise.managersTeam.mainDeputyManagerId,
  cruiseApplicationIds: cruise.cruiseApplicationsIds,
  title: cruise.title || null,
  shipUnavailable: cruise.shipUnavailable,
});

export const CreateCruiseFormSchema = CruiseFormInputSchema.transform(
  (cruise): z.input<typeof CreateRequest> => mapCruiseRequest(cruise)
).pipe(CreateRequest);
export const UpdateCruiseFormSchema = CruiseFormInputSchema.transform(
  (cruise): z.input<typeof UpdateRequest> => mapCruiseRequest(cruise)
).pipe(UpdateRequest);

export type CruiseFormValues = z.input<typeof CruiseFormInputSchema>;
export type CreateCruiseRequest = z.output<typeof CreateCruiseFormSchema>;
export type UpdateCruiseRequest = z.output<typeof UpdateCruiseFormSchema>;

export const cruiseFormDefaultValues: CruiseFormValues = {
  startDate: '',
  endDate: '',
  managersTeam: { mainCruiseManagerId: '', mainDeputyManagerId: '' },
  cruiseApplicationsIds: [],
  title: '',
  shipUnavailable: false,
} satisfies CruiseFormValues;

export function mapCruiseToValues(cruise: CruiseResponse): CruiseFormValues {
  return {
    startDate: cruise.startDate,
    endDate: cruise.endDate,
    managersTeam: {
      mainCruiseManagerId: cruise.mainManager.id,
      mainDeputyManagerId: cruise.deputyManager.id,
    },
    cruiseApplicationsIds: cruise.applications.map((application) => application.id),
    title: cruise.title ?? '',
    shipUnavailable: cruise.shipUnavailable,
  };
}
