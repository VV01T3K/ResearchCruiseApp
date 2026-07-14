import { z } from 'zod';

import { CreateRequest } from '@/api/generated/schemas';

const CruiseDatesValidationSchema = z
  .object({
    startDate: z.iso.datetime('Wymagane jest wskazanie daty rozpoczęcia rejsu'),
    endDate: z.iso.datetime('Wymagane jest wskazanie daty zakończenia rejsu'),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Data rozpoczęcia rejsu nie może być późniejsza niż data zakończenia rejsu',
      });
    }
  });

const emptyGuid = '00000000-0000-0000-0000-000000000000';
const ManagerAndDeputyValidationSchema = z.object({
  managersTeam: z
    .object({
      mainCruiseManagerId: z.string(),
      mainDeputyManagerId: z.string(),
    })
    .superRefine(({ mainCruiseManagerId, mainDeputyManagerId }, ctx) => {
      if (!mainCruiseManagerId || !mainDeputyManagerId || mainCruiseManagerId === emptyGuid) {
        return z.NEVER;
      }

      if (mainCruiseManagerId == mainDeputyManagerId) {
        ctx.addIssue({
          code: 'custom',
          path: ['mainDeputyManagerId'],
          message: 'Kierownik rejsu nie może być jednocześnie zastępcą kierownika rejsu',
        });
      }
    }),
});

const CruiseApplicationsValidationSchema = z.object({
  cruiseApplicationsIds: z.array(z.guid()),
});

const CustomCruiseValidationSchema = z
  .object({
    title: z.string().optional(),
    shipUnavailable: z.boolean(),
  })
  .superRefine(({ shipUnavailable, title }, ctx) => {
    if (shipUnavailable && (!title || title.trim() === '')) {
      ctx.addIssue({
        code: 'custom',
        path: ['title'],
        message: 'Tytuł jest wymagany dla blokad statku',
      });
    }
  });

export function getCruiseFormSchema() {
  return CruiseDatesValidationSchema.and(ManagerAndDeputyValidationSchema)
    .and(CruiseApplicationsValidationSchema)
    .and(CustomCruiseValidationSchema)
    .transform(
      (cruise): z.input<typeof CreateRequest> => ({
        startDate: cruise.startDate,
        endDate: cruise.endDate,
        mainManagerId: cruise.managersTeam.mainCruiseManagerId,
        deputyManagerId: cruise.managersTeam.mainDeputyManagerId,
        cruiseApplicationIds: cruise.cruiseApplicationsIds,
        title: cruise.title || null,
        shipUnavailable: cruise.shipUnavailable,
      })
    )
    .pipe(CreateRequest);
}

export type CruiseFormValues = z.input<ReturnType<typeof getCruiseFormSchema>>;
