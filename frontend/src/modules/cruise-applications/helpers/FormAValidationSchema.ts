import { literal, z } from 'zod';

import { groupBy } from '@/core/lib/utils';
import { ContractDtoValidationSchema } from '@/cruise-applications/models/ContractDto';
import { CruiseGoal, CruisePeriodValidationSchema } from '@/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/cruise-applications/models/FormAInitValuesDto';
import { GuestTeamDtoValidationSchema } from '@/cruise-applications/models/GuestTeamDto';
import { PermissionDtoValidationSchema } from '@/cruise-applications/models/PermissionDto';
import { PublicationDtoValidationSchema } from '@/cruise-applications/models/PublicationDto';
import { ResearchTaskDtoValidationSchema } from '@/cruise-applications/models/ResearchTaskDto';
import { SpubTaskDtoValidationSchema } from '@/cruise-applications/models/SpubTaskDto';
import { UGTeamDtoValidationSchema } from '@/cruise-applications/models/UGTeamDto';
import { BlockadePeriodDto } from '@/cruise-schedule/models/CruiseDto';

const ManagerAndDeputyManagerValidationSchema = (initValues: FormAInitValuesDto) =>
  z
    .object({
      cruiseManagerId: z
        .string()
        .refine(
          (val) => initValues.cruiseManagers.map((x) => x.id).includes(val),
          'Kierownik rejsu musi być jednym z dostępnych kierowników rejsu'
        ),
      deputyManagerId: z
        .string()
        .refine(
          (val) => initValues.deputyManagers.map((x) => x.id).includes(val),
          'Zastępca kierownika rejsu musi być jednym z dostępnych zastępców kierownika rejsu'
        ),
    })
    .superRefine(({ cruiseManagerId, deputyManagerId }, ctx) => {
      if (!cruiseManagerId || !deputyManagerId) {
        return z.NEVER;
      }

      if (cruiseManagerId == deputyManagerId) {
        ctx.addIssue({
          code: 'custom',
          path: ['deputyManagerId'],
          message: 'Kierownik rejsu nie może być jednocześnie zastępcą kierownika rejsu',
        });
      }
    });

const ShipUsageValidationSchema = z
  .object({
    shipUsage: z
      .enum(['0', '1', '2', '3', '4'], {
        message: 'Wymagane jest wskazanie sposobu korzystania z statku',
      })
      .optional(),
    differentUsage: z.string(),
  })
  .superRefine(({ shipUsage, differentUsage }, ctx) => {
    if (shipUsage === '4' && !differentUsage) {
      ctx.addIssue({
        code: 'custom',
        message: 'w przypadku wyboru "inne" należy podać informacje o sposobie korzystania z statku',
        path: ['differentUsage'],
      });
    }
  });

const CruiseGoalValidationSchema = z
  .object({
    cruiseGoal: z.enum([CruiseGoal.Research, CruiseGoal.Commercial, CruiseGoal.Educational], {
      message: 'Cel rejsu musi być jednym z dostępnych celów rejsu',
    }),
    cruiseGoalDescription: z.string().max(10240, 'Opis celu rejsu nie może być dłuższy niż 10240 znaków'),
  })
  .superRefine(({ cruiseGoal, cruiseGoalDescription }, ctx) => {
    if (!!cruiseGoal && cruiseGoalDescription?.length <= 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Opis celu rejsu jest wymagany',
        path: ['cruiseGoalDescription'],
      });
    }
  });

const BlockadeCollisionValidationSchema = (blockades?: BlockadePeriodDto[]) => {
  function checkDateForBlockadeCollision(field: string) {
    if (!blockades) return true;
    if (isNaN(Date.parse(field))) return false;

    const date = new Date(field);
    return !blockades.some((b) => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      return date >= start && date <= end;
    });
  }

  function convertFortnightToDate(fortnight: number, year: number) {
    const month = Math.floor(fortnight / 2);
    const day = fortnight % 2 === 0 ? 1 : 15;
    return new Date(year, month, day);
  }

  return z
    .object({
      year: z.string(),
      acceptablePeriod: CruisePeriodValidationSchema.or(literal('')),
      optimalPeriod: CruisePeriodValidationSchema.or(literal('')),
      precisePeriodStart: z
        .string()
        .refine((val) => checkDateForBlockadeCollision(val), 'Data rozpoczęcia koliduje z istniejącą blokadą')
        .or(literal('')),
      precisePeriodEnd: z
        .string()
        .refine((val) => checkDateForBlockadeCollision(val), 'Data zakończenia koliduje z istniejącą blokadą')
        .or(literal('')),
    })
    .superRefine(({ precisePeriodStart, precisePeriodEnd }, ctx) => {
      const precisePeriodStartDate = precisePeriodStart ? new Date(precisePeriodStart) : null,
        precisePeriodEndDate = precisePeriodEnd ? new Date(precisePeriodEnd) : null;
      for (const blockade of blockades || []) {
        const blockadeStart = new Date(blockade.startDate),
          blockadeEnd = new Date(blockade.endDate);
        if (
          precisePeriodStartDate &&
          precisePeriodEndDate &&
          precisePeriodStartDate <= blockadeStart &&
          precisePeriodEndDate >= blockadeEnd
        ) {
          ['precisePeriodStart', 'precisePeriodEnd'].forEach((field) => {
            ctx.addIssue({
              code: 'custom',
              message: `Okres rejsu koliduje z istniejącą blokadą`,
              path: [field],
            });
          });
          break;
        }
      }
    })
    .superRefine(({ acceptablePeriod, year }, ctx) => {
      const acceptableStart = convertFortnightToDate(+acceptablePeriod[0], +year),
        acceptableEnd = convertFortnightToDate(+acceptablePeriod[1], +year);
      for (const blockade of blockades || []) {
        const blockadeStart = new Date(blockade.startDate),
          blockadeEnd = new Date(blockade.endDate);
        if (
          (acceptableStart <= blockadeStart && acceptableEnd >= blockadeEnd) ||
          (acceptableStart >= blockadeStart && acceptableStart <= blockadeEnd) ||
          (acceptableEnd >= blockadeStart && acceptableEnd <= blockadeEnd)
        ) {
          ctx.addIssue({
            code: 'custom',
            message: `Okres akceptowalny rejsu koliduje z istniejącą blokadą`,
            path: ['acceptablePeriod'],
          });
          break;
        }
      }
    })
    .superRefine(({ optimalPeriod, year }, ctx) => {
      const optimalStart = convertFortnightToDate(+optimalPeriod[0], +year),
        optimalEnd = convertFortnightToDate(+optimalPeriod[1], +year);
      for (const blockade of blockades || []) {
        const blockadeStart = new Date(blockade.startDate),
          blockadeEnd = new Date(blockade.endDate);
        if (
          (optimalStart <= blockadeStart && optimalEnd >= blockadeEnd) ||
          (optimalStart >= blockadeStart && optimalStart <= blockadeEnd) ||
          (optimalEnd >= blockadeStart && optimalEnd <= blockadeEnd)
        ) {
          ctx.addIssue({
            code: 'custom',
            message: `Okres optymalny rejsu koliduje z istniejącą blokadą`,
            path: ['optimalPeriod'],
          });
          break;
        }
      }
    });
};

const OtherValidationSchema = (initValues: FormAInitValuesDto) =>
  z
    .object({
      id: z.string().uuid().optional(),
      year: z
        .string()
        .refine(
          (val) => initValues.years.includes(val),
          'Rok musi być jednym z dostępnych lat: ' + initValues.years.join(', ')
        ),
      acceptablePeriod: CruisePeriodValidationSchema.or(literal('')),
      optimalPeriod: CruisePeriodValidationSchema.or(literal('')),
      precisePeriodStart: z.string().or(literal('')),
      precisePeriodEnd: z.string().or(literal('')),
      cruiseHours: z.string().refine((val) => {
        const parsed = parseInt(val, 10);
        return !isNaN(parsed) && parsed > 0 && parsed < 1440;
      }, 'Rejs musi trwać co najmniej godzinę i nie dłużej niż 60 dni (1440 godzin)'),
      periodNotes: z.string(),
      permissions: PermissionDtoValidationSchema.array().refine(
        (val) => val.every((x) => !x.scan),
        'Skan nie może być dostarczony na tym etapie'
      ),
      researchAreaId: z
        .string()
        .refine(
          (val) => !!val && initValues.researchAreas.map((x) => x.id).includes(val),
          'Obszar badań musi być jednym z dostępnych obszarów badań'
        ),
      researchAreaInfo: z.string().max(10240, 'Informacje o obszarze badań nie mogą być dłuższe niż 10240 znaków'),
      researchTasks: ResearchTaskDtoValidationSchema.array().min(1, 'Co najmniej jedno zadanie badawcze jest wymagane'),
      contracts: ContractDtoValidationSchema.array(),
      ugTeams: UGTeamDtoValidationSchema.array()
        .min(1, 'Co najmniej jeden zespół UG jest wymagany')
        .refine(
          (val) => val.every((x) => parseInt(x.noOfEmployees, 10) + parseInt(x.noOfStudents, 10) > 0),
          'Zespół UG musi składać się z co najmniej jednej osoby'
        )
        .refine(
          (val) => groupBy(val, (x) => x.ugUnitId).filter((x) => x[1].length > 1).length === 0,
          'Nie można dodać dwóch zespołów UG z tego samego wydziału'
        ),
      guestTeams: GuestTeamDtoValidationSchema.array(),
      publications: PublicationDtoValidationSchema.array(),
      spubTasks: SpubTaskDtoValidationSchema.array(),
      supervisorEmail: z.string().email('Niepoprawny adres email'),
      note: z.string().optional(),
    })
    .refine((val) => {
      const acceptablePeriod = val.acceptablePeriod;
      const optimalPeriod = val.optimalPeriod;

      return (
        !acceptablePeriod ||
        !optimalPeriod ||
        (optimalPeriod[0] >= acceptablePeriod[0] && optimalPeriod[1] <= acceptablePeriod[1])
      );
    }, 'Okres optymalny musi zawierać się w okresie akceptowalnym')
    .refine((val) => {
      const precisePeriodStart = val.precisePeriodStart;
      const precisePeriodEnd = val.precisePeriodEnd;

      return !precisePeriodStart || !precisePeriodEnd || precisePeriodStart <= precisePeriodEnd;
    }, 'Dokładny okres musi być zgodny z okresem akceptowalnym i musi mieć poprawne daty')
    .refine((val) => {
      const precisePeriodStart = val.precisePeriodStart;
      const precisePeriodEnd = val.precisePeriodEnd;
      const acceptablePeriod = val.acceptablePeriod;
      const optimalPeriod = val.optimalPeriod;
      return (
        (!!precisePeriodStart && !!precisePeriodEnd) ||
        (!!acceptablePeriod && !!optimalPeriod) ||
        (!acceptablePeriod && !optimalPeriod && !precisePeriodStart && !precisePeriodEnd)
      );
    }, 'Musisz podać albo dokładny okres albo okres akceptowalny i optymalny');

export function getFormAValidationSchema(initValues: FormAInitValuesDto, blockades?: BlockadePeriodDto[]) {
  return ManagerAndDeputyManagerValidationSchema(initValues)
    .and(ShipUsageValidationSchema)
    .and(CruiseGoalValidationSchema)
    .and(BlockadeCollisionValidationSchema(blockades))
    .and(OtherValidationSchema(initValues));
}
