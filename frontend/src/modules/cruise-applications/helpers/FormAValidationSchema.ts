import { literal, z } from 'zod';

import { groupBy } from '@/core/lib/utils';
import { getPeriodEdgeDatePoint, MAX_PERIOD_EDGE_VALUE } from '@/cruise-applications/helpers/periodUtils';
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

import { getResearchAreaDescriptionDtoValidationSchema } from '../models/ResearchAreaDescriptionDto';

export const FORM_A_FIELD_TO_SECTION: Record<string, number> = {
  cruiseManagerId: 1,
  deputyManagerId: 1,
  year: 2,
  acceptablePeriod: 2,
  optimalPeriod: 2,
  precisePeriodStart: 2,
  precisePeriodEnd: 2,
  cruiseHours: 2,
  periodNotes: 2,
  shipUsage: 2,
  differentUsage: 2,
  permissions: 3,
  researchAreaDescriptions: 4,
  cruiseGoal: 5,
  cruiseGoalDescription: 5,
  researchTasks: 6,
  contracts: 7,
  ugTeams: 8,
  guestTeams: 8,
  publications: 9,
  spubTasks: 10,
  supervisorEmail: 11,
  note: 11,
};

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

function hasEnoughDaysInPeriod(period: [string, string], year: number, cruiseDurationDays: number): boolean {
  const startEdge = parseInt(period[0], 10);
  const endEdge = parseInt(period[1], 10);

  if (
    Number.isNaN(startEdge) ||
    Number.isNaN(endEdge) ||
    startEdge < 0 ||
    endEdge < 0 ||
    startEdge > MAX_PERIOD_EDGE_VALUE ||
    endEdge > MAX_PERIOD_EDGE_VALUE
  ) {
    return false;
  }

  const periodStart = getPeriodEdgeDatePoint(year, startEdge);
  const periodEnd = getPeriodEdgeDatePoint(year, endEdge);
  const periodDays = (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);

  return periodDays >= cruiseDurationDays;
}

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
        error: 'Wymagane jest wskazanie sposobu korzystania z statku',
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
      error: 'Cel rejsu musi być jednym z dostępnych celów rejsu',
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
  type OverlappingBlockade = {
    title: string;
    start: Date;
    end: Date;
  };

  function getOverlappingBlockades(rangeStart: Date, rangeEnd: Date): OverlappingBlockade[] {
    if (!blockades || blockades.length === 0) return [];

    const overlappingBlockades = blockades
      .map((b) => ({
        title: b.title,
        start: new Date(b.startDate),
        end: new Date(b.endDate),
      }))
      .filter((b) => !Number.isNaN(b.start.getTime()) && !Number.isNaN(b.end.getTime()))
      .filter((b) => b.end > rangeStart && b.start < rangeEnd)
      .map((b) => ({
        title: b.title,
        start: b.start < rangeStart ? rangeStart : b.start,
        end: b.end > rangeEnd ? rangeEnd : b.end,
      }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    return overlappingBlockades;
  }

  function getMergedOverlappingBlockades(
    overlappingBlockades: OverlappingBlockade[]
  ): Array<{ start: Date; end: Date }> {
    if (overlappingBlockades.length === 0) return [];

    const merged: Array<{ start: Date; end: Date }> = [];
    for (const blockade of overlappingBlockades) {
      if (merged.length === 0) {
        merged.push(blockade);
        continue;
      }

      const last = merged[merged.length - 1];
      if (blockade.start <= last.end) {
        if (blockade.end > last.end) {
          last.end = blockade.end;
        }
      } else {
        merged.push(blockade);
      }
    }

    return merged;
  }

  function analyzeCruiseSlot(
    rangeStart: Date,
    rangeEnd: Date,
    cruiseDurationDays: number
  ): { canFitCruise: boolean; overlappingBlockades: OverlappingBlockade[] } {
    if (Number.isNaN(rangeStart.getTime()) || Number.isNaN(rangeEnd.getTime()) || rangeEnd <= rangeStart) {
      return { canFitCruise: true, overlappingBlockades: [] };
    }
    if (cruiseDurationDays <= 0) {
      return { canFitCruise: true, overlappingBlockades: [] };
    }
    if ((rangeEnd.getTime() - rangeStart.getTime()) / DAY_IN_MILLISECONDS < cruiseDurationDays) {
      return { canFitCruise: false, overlappingBlockades: [] };
    }
    if (!blockades || blockades.length === 0) {
      return { canFitCruise: true, overlappingBlockades: [] };
    }
    const overlappingBlockades = getOverlappingBlockades(rangeStart, rangeEnd);
    const merged = getMergedOverlappingBlockades(overlappingBlockades);
    if (merged.length === 0) {
      return { canFitCruise: true, overlappingBlockades: [] };
    }

    let freeSlotStart = rangeStart;
    for (const blockade of merged) {
      const freeDays = (blockade.start.getTime() - freeSlotStart.getTime()) / DAY_IN_MILLISECONDS;
      if (freeDays >= cruiseDurationDays) {
        return { canFitCruise: true, overlappingBlockades };
      }
      if (blockade.end > freeSlotStart) freeSlotStart = blockade.end;
    }

    const remainingFreeDays = (rangeEnd.getTime() - freeSlotStart.getTime()) / DAY_IN_MILLISECONDS;
    return { canFitCruise: remainingFreeDays >= cruiseDurationDays, overlappingBlockades };
  }

  function hasEnoughFreeSlotInPrecisePeriod(
    precisePeriodStart: string,
    precisePeriodEnd: string,
    cruiseHours: string
  ): { canFitCruise: boolean; overlappingBlockades: OverlappingBlockade[] } {
    if (!precisePeriodStart || !precisePeriodEnd) return { canFitCruise: true, overlappingBlockades: [] };

    const parsedHours = parseInt(cruiseHours, 10);
    if (Number.isNaN(parsedHours) || parsedHours <= 0) return { canFitCruise: true, overlappingBlockades: [] };

    const start = new Date(precisePeriodStart);
    const end = new Date(precisePeriodEnd);
    const cruiseDurationDays = parsedHours / 24;

    return analyzeCruiseSlot(start, end, cruiseDurationDays);
  }

  return z
    .object({
      year: z.string(),
      periodSelectionType: z.enum(['precise', 'period']).optional(),
      acceptablePeriod: CruisePeriodValidationSchema.or(literal('')),
      optimalPeriod: CruisePeriodValidationSchema.or(literal('')),
      precisePeriodStart: z.string().or(literal('')),
      precisePeriodEnd: z.string().or(literal('')),
      cruiseHours: z.string(),
    })
    .superRefine(({ periodSelectionType, precisePeriodStart, precisePeriodEnd, cruiseHours }, ctx) => {
      if (periodSelectionType === 'period') {
        return;
      }
      if (!precisePeriodStart || !precisePeriodEnd) {
        return;
      }

      const slotAnalysis = hasEnoughFreeSlotInPrecisePeriod(precisePeriodStart, precisePeriodEnd, cruiseHours);

      if (!slotAnalysis.canFitCruise) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Rejs nie może się odbyć w podanym terminie czas pomiędzy blokadami jest krótszy niż wybrany czas trwania rejsu.',
          path: ['precisePeriodEnd'],
        });
      }
    });
};

const OtherValidationSchema = (initValues: FormAInitValuesDto) =>
  z
    .object({
      id: z.guid().optional(),
      year: z
        .string()
        .refine(
          (val) => initValues.years.includes(val),
          'Rok musi być jednym z dostępnych lat: ' + initValues.years.join(', ')
        ),
      periodSelectionType: z.enum(['precise', 'period']).optional(),
      acceptablePeriod: CruisePeriodValidationSchema.or(literal('')),
      optimalPeriod: CruisePeriodValidationSchema.or(literal('')),
      precisePeriodStart: z.string().or(literal('')),
      precisePeriodEnd: z.string().or(literal('')),
      cruiseHours: z.string().refine((val) => {
        const parsed = parseInt(val, 10);
        return !isNaN(parsed) && parsed > 0 && parsed <= 1440;
      }, 'Rejs musi trwać co najmniej godzinę i nie dłużej niż 60 dni (1440 godzin)'),
      periodNotes: z.string(),
      permissions: PermissionDtoValidationSchema.array().refine(
        (val) => val.every((x) => !x.scan),
        'Skan nie może być dostarczony na tym etapie'
      ),
      researchAreaDescriptions: getResearchAreaDescriptionDtoValidationSchema(initValues)
        .array()
        .min(1, 'Co najmniej jeden rejon badań jest wymagany'),
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
      supervisorEmail: z.email('Niepoprawny adres email'),
      note: z.string().optional(),
    })
    .refine((val) => {
      const acceptablePeriod = val.acceptablePeriod;
      const optimalPeriod = val.optimalPeriod;

      return (
        acceptablePeriod === '' ||
        optimalPeriod === '' ||
        (parseInt(optimalPeriod[0], 10) >= parseInt(acceptablePeriod[0], 10) &&
          parseInt(optimalPeriod[1], 10) <= parseInt(acceptablePeriod[1], 10))
      );
    }, 'Okres optymalny musi zawierać się w okresie akceptowalnym')
    .superRefine((val, ctx) => {
      const precisePeriodStart = val.precisePeriodStart;
      const precisePeriodEnd = val.precisePeriodEnd;
      const acceptablePeriod = val.acceptablePeriod;
      const optimalPeriod = val.optimalPeriod;
      const periodSelectionType = val.periodSelectionType;

      const hasPrecise = precisePeriodStart !== '' || precisePeriodEnd !== '';
      const hasPeriods = acceptablePeriod !== '' || optimalPeriod !== '';

      let effectiveMode = periodSelectionType;
      if (!effectiveMode) {
        if (hasPrecise && !hasPeriods) {
          effectiveMode = 'precise';
        } else if (hasPeriods && !hasPrecise) {
          effectiveMode = 'period';
        }
      }

      if (effectiveMode === 'precise') {
        if (!precisePeriodStart) {
          ctx.addIssue({
            code: 'custom',
            path: ['precisePeriodStart'],
            message: 'Dokładny termin rozpoczęcia rejsu jest wymagany',
          });
        }
        if (!precisePeriodEnd) {
          ctx.addIssue({
            code: 'custom',
            path: ['precisePeriodEnd'],
            message: 'Dokładny termin zakończenia rejsu jest wymagany',
          });
        }
        if (precisePeriodStart && precisePeriodEnd && precisePeriodStart > precisePeriodEnd) {
          ctx.addIssue({
            code: 'custom',
            path: ['precisePeriodEnd'],
            message: 'Data zakończenia musi być późniejsza niż data rozpoczęcia',
          });
        }
      } else if (effectiveMode === 'period') {
        if (acceptablePeriod === '') {
          ctx.addIssue({
            code: 'custom',
            path: ['acceptablePeriod'],
            message: 'Dopuszczalny okres jest wymagany',
          });
        }
        if (optimalPeriod === '') {
          ctx.addIssue({
            code: 'custom',
            path: ['optimalPeriod'],
            message: 'Optymalny okres jest wymagany',
          });
        }

        if (acceptablePeriod !== '' && optimalPeriod !== '') {
          const parsedHours = parseInt(val.cruiseHours, 10);
          const year = parseInt(val.year, 10);

          if (!Number.isNaN(parsedHours) && parsedHours > 0 && !Number.isNaN(year)) {
            const cruiseDurationDays = parsedHours / 24;

            if (!hasEnoughDaysInPeriod(acceptablePeriod, year, cruiseDurationDays)) {
              ctx.addIssue({
                code: 'custom',
                path: ['acceptablePeriod'],
                message: 'Wybrany okres czasu jest zbyt krótki dla planowanego czasu rejsu',
              });
            }

            if (!hasEnoughDaysInPeriod(optimalPeriod, year, cruiseDurationDays)) {
              ctx.addIssue({
                code: 'custom',
                path: ['optimalPeriod'],
                message: 'Wybrany okres czasu jest zbyt krótki dla planowanego czasu rejsu',
              });
            }
          }
        }
      } else if (hasPrecise && hasPeriods) {
        // Mixed mode - user has values in both sections
        ctx.addIssue({
          code: 'custom',
          path: ['precisePeriodStart'],
          message: 'Musisz podać albo dokładny okres albo okres akceptowalny i optymalny',
        });
      }
    });

export function getFormAValidationSchema(initValues: FormAInitValuesDto, blockades?: BlockadePeriodDto[]) {
  return ManagerAndDeputyManagerValidationSchema(initValues)
    .and(ShipUsageValidationSchema)
    .and(CruiseGoalValidationSchema)
    .and(BlockadeCollisionValidationSchema(blockades))
    .and(OtherValidationSchema(initValues));
}
