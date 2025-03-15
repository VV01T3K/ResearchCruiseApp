import { z } from 'zod';

import { CruiseApplicationDto } from '@/cruise-applications/models/CruiseApplicationDto';

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

const ManagerAndDeputyValidationSchema = (cruiseApplications: CruiseApplicationDto[]) => {
  const emptyGuid = '00000000-0000-0000-0000-000000000000';

  function validateManagerId(val: string) {
    return (
      val === '' ||
      val === emptyGuid ||
      cruiseApplications
        .reduce((acc, x) => {
          acc.push(x.cruiseManagerId);
          acc.push(x.deputyManagerId);
          return acc;
        }, [] as string[])
        .includes(val)
    );
  }

  return z.object({
    managersTeam: z
      .object({
        mainCruiseManagerId: z
          .string()
          .refine(validateManagerId, 'Kierownik rejsu musi być jednym z dostępnych kierowników rejsu'),

        mainDeputyManagerId: z
          .string()
          .refine(
            validateManagerId,
            'Zastępca kierownika rejsu musi być jednym z dostępnych zastępców kierownika rejsu'
          ),
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
};

const CruiseApplicationsValidationSchema = z.object({
  cruiseApplicationsIds: z.array(z.string().uuid()),
});

export function getCruiseFormValidationSchema(cruiseApplications: CruiseApplicationDto[]) {
  return CruiseDatesValidationSchema.and(ManagerAndDeputyValidationSchema(cruiseApplications)).and(
    CruiseApplicationsValidationSchema
  );
}
