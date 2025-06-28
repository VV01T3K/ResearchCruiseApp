import { z } from 'zod';

const CruiseDatesValidationSchema = z
  .object({
    startDate: z.string().datetime('Wymagane jest wskazanie daty rozpoczęcia rejsu'),
    endDate: z.string().datetime('Wymagane jest wskazanie daty zakończenia rejsu'),
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
  cruiseApplicationsIds: z.array(z.string().uuid()),
});

export function getCruiseFormValidationSchema() {
  return CruiseDatesValidationSchema.and(ManagerAndDeputyValidationSchema).and(CruiseApplicationsValidationSchema);
}
