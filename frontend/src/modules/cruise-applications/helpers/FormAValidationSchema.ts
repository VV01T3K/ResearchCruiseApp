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

export function getFormAValidationSchema(initValues: FormAInitValuesDto) {
  return ManagerAndDeputyManagerValidationSchema(initValues)
    .and(ShipUsageValidationSchema)
    .and(CruiseGoalValidationSchema)
    .and(OtherValidationSchema(initValues));
}
