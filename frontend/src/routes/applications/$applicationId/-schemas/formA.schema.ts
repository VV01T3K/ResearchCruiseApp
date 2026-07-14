import { literal, z } from 'zod';

import { groupBy } from '@/lib/utils';
import { getPeriodEdgeDatePoint, MAX_PERIOD_EDGE_VALUE } from '@/lib/applications/periodUtils';
import { ContractValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/ContractValues';
import {
  CruiseGoal,
  CruisePeriodValidationSchema,
  type FormAValues,
} from '@/routes/applications/$applicationId/-schemas/types/FormAValues';
import { FormAOptions } from '@/routes/applications/$applicationId/-schemas/types/FormAOptions';
import { GuestTeamValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/GuestTeamValues';
import { PermissionValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/PermissionValues';
import { PublicationValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/PublicationValues';
import { ResearchTaskValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';
import { SpubTaskValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/SpubTaskValues';
import { UgTeamValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/UgTeamValues';
import {
  FormAWriteRequest,
  type BlockadeResponse as BlockadePeriod,
  type FormAFields,
  type FormAOptions as GeneratedFormAOptions,
  type ResearchTaskFields,
} from '@/api/generated/schemas';
import { getResearchAreaValuesSchema } from '@/routes/applications/$applicationId/-schemas/types/ResearchAreaValues';
import { ResearchTaskType } from '@/routes/applications/$applicationId/-schemas/types/ResearchTaskValues';
import { PublicationCategory } from '@/routes/applications/$applicationId/-schemas/types/PublicationValues';

export const FORM_A_FIELD_TO_SECTION: Record<string, number> = {
  cruiseManagerId: 1,
  deputyManagerId: 1,
  year: 2,
  acceptablePeriod: 2,
  optimalPeriod: 2,
  precisePeriodStart: 2,
  precisePeriodEnd: 2,
  cruiseHours: 2,
  cruiseDays: 2,
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

export const formADefaultValues: FormAValues = {
  id: undefined,
  cruiseManagerId: '',
  deputyManagerId: '',
  year: '',
  acceptablePeriod: '',
  optimalPeriod: '',
  precisePeriodStart: '',
  precisePeriodEnd: '',
  periodSelectionType: 'period',
  cruiseDays: 0,
  cruiseHours: 0,
  periodNotes: '',
  shipUsage: '',
  differentUsage: '',
  permissions: [],
  researchAreaDescriptions: [],
  cruiseGoal: '',
  cruiseGoalDescription: '',
  researchTasks: [],
  contracts: [],
  ugTeams: [],
  guestTeams: [],
  publications: [],
  spubTasks: [],
  supervisorEmail: '',
  note: '',
} satisfies FormAValues;

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

const ManagerAndDeputyManagerValidationSchema = (initValues: FormAOptions) =>
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

const BlockadeCollisionValidationSchema = (blockades?: BlockadePeriod[]) => {
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
    cruiseHours: number
  ): { canFitCruise: boolean; overlappingBlockades: OverlappingBlockade[] } {
    if (!precisePeriodStart || !precisePeriodEnd) return { canFitCruise: true, overlappingBlockades: [] };

    if (cruiseHours <= 0) return { canFitCruise: true, overlappingBlockades: [] };

    const start = new Date(precisePeriodStart);
    const end = new Date(precisePeriodEnd);
    const cruiseDurationDays = cruiseHours / 24;

    return analyzeCruiseSlot(start, end, cruiseDurationDays);
  }

  function hasEnoughFreeSlotInPeriod(
    year: string,
    period: [string, string],
    cruiseHours: number
  ): { canFitCruise: boolean; overlappingBlockades: OverlappingBlockade[] } {
    if (!period || period.length !== 2) {
      return { canFitCruise: true, overlappingBlockades: [] };
    }

    const parsedYear = parseInt(year, 10);
    const startEdge = parseInt(period[0], 10);
    const endEdge = parseInt(period[1], 10);

    if (
      Number.isNaN(parsedYear) ||
      Number.isNaN(startEdge) ||
      Number.isNaN(endEdge) ||
      startEdge < 0 ||
      endEdge < 0 ||
      startEdge > MAX_PERIOD_EDGE_VALUE ||
      endEdge > MAX_PERIOD_EDGE_VALUE ||
      cruiseHours <= 0
    ) {
      return { canFitCruise: true, overlappingBlockades: [] };
    }

    const start = getPeriodEdgeDatePoint(parsedYear, startEdge);
    const end = getPeriodEdgeDatePoint(parsedYear, endEdge);
    const cruiseDurationDays = cruiseHours / 24;

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
      cruiseDays: z.number().min(0).max(60),
      cruiseHours: z.number().min(0).max(1440),
    })
    .superRefine(
      (
        {
          periodSelectionType,
          year,
          acceptablePeriod,
          optimalPeriod,
          precisePeriodStart,
          precisePeriodEnd,
          cruiseDays,
          cruiseHours,
        },
        ctx
      ) => {
        if (cruiseHours !== cruiseDays * 24) {
          ctx.addIssue({ code: 'custom', message: 'Liczba dni i godzin rejsu musi być zgodna', path: ['cruiseHours'] });
        }
        if (periodSelectionType === 'period') {
          if (acceptablePeriod !== '') {
            const acceptableAnalysis = hasEnoughFreeSlotInPeriod(year, acceptablePeriod, cruiseHours);
            if (!acceptableAnalysis.canFitCruise) {
              ctx.addIssue({
                code: 'custom',
                message:
                  'Rejs nie może się odbyć w podanym okresie. Czas pomiędzy blokadami jest krótszy niż wybrany czas trwania rejsu.',
                path: ['acceptablePeriod'],
              });
            }
          }

          if (optimalPeriod !== '') {
            const optimalAnalysis = hasEnoughFreeSlotInPeriod(year, optimalPeriod, cruiseHours);
            if (!optimalAnalysis.canFitCruise) {
              ctx.addIssue({
                code: 'custom',
                message:
                  'Rejs nie może się odbyć w podanym okresie. Czas pomiędzy blokadami jest krótszy niż wybrany czas trwania rejsu.',
                path: ['optimalPeriod'],
              });
            }
          }

          return;
        }
        if (!precisePeriodStart || !precisePeriodEnd) {
          return;
        }

        const start = new Date(precisePeriodStart);
        const end = new Date(precisePeriodEnd);
        const cruiseDurationDays = cruiseHours / 24;

        if ((end.getTime() - start.getTime()) / DAY_IN_MILLISECONDS < cruiseDurationDays) {
          ctx.addIssue({
            code: 'custom',
            message: 'Wybrany czas trwania rejsu jest dłuższy niż okres pomiędzy wybranymi datami.',
            path: ['precisePeriodEnd'],
          });
          return;
        }

        const slotAnalysis = hasEnoughFreeSlotInPrecisePeriod(precisePeriodStart, precisePeriodEnd, cruiseHours);

        if (!slotAnalysis.canFitCruise) {
          ctx.addIssue({
            code: 'custom',
            message:
              'Rejs nie może się odbyć w podanym terminie. Czas pomiędzy blokadami jest krótszy niż wybrany czas trwania rejsu.',
            path: ['precisePeriodEnd'],
          });
        }
      }
    );
};

const OtherValidationSchema = (initValues: FormAOptions) =>
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
      cruiseDays: z.number().min(0).max(60),
      cruiseHours: z
        .number()
        .positive('Rejs musi trwać co najmniej godzinę i nie dłużej niż 60 dni (1440 godzin)')
        .max(1440, 'Rejs musi trwać co najmniej godzinę i nie dłużej niż 60 dni (1440 godzin)'),
      periodNotes: z.string(),
      permissions: PermissionValuesSchema.array().refine(
        (val) => val.every((x) => !x.scan),
        'Skan nie może być dostarczony na tym etapie'
      ),
      researchAreaDescriptions: getResearchAreaValuesSchema(initValues)
        .array()
        .min(1, 'Co najmniej jeden rejon badań jest wymagany'),
      researchTasks: ResearchTaskValuesSchema.array().min(1, 'Co najmniej jedno zadanie badawcze jest wymagane'),
      contracts: ContractValuesSchema.array(),
      ugTeams: UgTeamValuesSchema.array()
        .min(1, 'Co najmniej jeden zespół UG jest wymagany')
        .refine(
          (val) => val.every((x) => x.noOfEmployees + x.noOfStudents > 0),
          'Zespół UG musi składać się z co najmniej jednej osoby'
        )
        .refine(
          (val) => groupBy(val, (x) => x.ugUnitId).filter((x) => x[1].length > 1).length === 0,
          'Nie można dodać dwóch zespołów UG z tego samego wydziału'
        ),
      guestTeams: GuestTeamValuesSchema.array(),
      publications: PublicationValuesSchema.array(),
      spubTasks: SpubTaskValuesSchema.array(),
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
          const year = parseInt(val.year, 10);

          if (val.cruiseHours > 0 && !Number.isNaN(year)) {
            const cruiseDurationDays = val.cruiseHours / 24;

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

export function getFormAValidationSchema(initValues: FormAOptions, blockades?: BlockadePeriod[]) {
  return ManagerAndDeputyManagerValidationSchema(initValues)
    .and(ShipUsageValidationSchema)
    .and(CruiseGoalValidationSchema)
    .and(BlockadeCollisionValidationSchema(blockades))
    .and(OtherValidationSchema(initValues));
}

export function getFormAWriteSchema(
  initValues: FormAOptions,
  draft: boolean,
  blockades?: BlockadePeriod[],
  applicationId?: string
) {
  return getFormAValidationSchema(initValues, blockades)
    .transform((form): z.input<typeof FormAWriteRequest> => mapFormAWriteRequest(form, draft, applicationId))
    .pipe(FormAWriteRequest);
}

export function parseFormADraft(form: FormAValues, applicationId?: string) {
  return FormAWriteRequest.parse(mapFormAWriteRequest(form, true, applicationId));
}

function mapFormAWriteRequest(form: FormAValues, draft: boolean, applicationId?: string) {
  return {
    form: {
      id: applicationId ?? form.id ?? null,
      cruiseManagerId: form.cruiseManagerId,
      deputyManagerId: form.deputyManagerId || null,
      year: form.year,
      acceptablePeriod: form.acceptablePeriod || null,
      optimalPeriod: form.optimalPeriod || null,
      periodSelectionType: form.periodSelectionType ?? null,
      precisePeriodStart: toApiDateTime(form.precisePeriodStart),
      precisePeriodEnd: toApiDateTime(form.precisePeriodEnd),
      cruiseHours: String(form.cruiseHours),
      periodNotes: form.periodNotes,
      shipUsage: form.shipUsage || null,
      differentUsage: form.differentUsage,
      permissions: form.permissions.map((permission) => ({
        description: permission.description || null,
        executive: permission.executive || null,
        scan: permission.scan ?? null,
      })),
      researchAreaDescriptions: form.researchAreaDescriptions,
      cruiseGoal: form.cruiseGoal || null,
      cruiseGoalDescription: form.cruiseGoalDescription,
      researchTasks: form.researchTasks.map((task) => ({
        type: task.type,
        title: 'title' in task ? task.title : null,
        magazine: 'magazine' in task ? task.magazine : null,
        author: 'author' in task ? task.author : null,
        institution: null,
        date: 'date' in task ? task.date : null,
        startDate: 'startDate' in task ? task.startDate : null,
        endDate: 'endDate' in task ? task.endDate : null,
        financingAmount: 'financingAmount' in task ? String(task.financingAmount) : null,
        financingApproved: 'financingApproved' in task ? task.financingApproved : null,
        description: 'description' in task ? task.description : null,
        securedAmount: 'securedAmount' in task ? String(task.securedAmount) : null,
        ministerialPoints: 'ministerialPoints' in task ? String(task.ministerialPoints) : null,
      })),
      contracts: form.contracts,
      ugTeams: form.ugTeams.map((team) => ({
        ...team,
        noOfEmployees: String(team.noOfEmployees),
        noOfStudents: String(team.noOfStudents),
      })),
      guestTeams: form.guestTeams.map((team) => ({ name: team.name || null, noOfPersons: String(team.noOfPersons) })),
      publications: form.publications.map((publication) => ({
        ...publication,
        id: publication.id || '00000000-0000-0000-0000-000000000000',
        doi: publication.doi || null,
        authors: publication.authors || null,
        title: publication.title || null,
        magazine: publication.magazine || null,
        year: String(publication.year),
        ministerialPoints: String(publication.ministerialPoints),
      })),
      spubTasks: form.spubTasks.map((task) => ({
        name: task.name || null,
        yearFrom: task.yearFrom || null,
        yearTo: task.yearTo || null,
      })),
      supervisorEmail: form.supervisorEmail,
      note: form.note || null,
    },
    draft,
  } satisfies z.input<typeof FormAWriteRequest>;
}

function toApiDateTime(value: string): string | null {
  if (!value) return null;
  if (/(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return value;
  return value.includes('T') ? `${value}Z` : `${value}T00:00:00Z`;
}

export function mapFormAToValues(form: FormAFields): FormAValues {
  const acceptablePeriod = CruisePeriodValidationSchema.safeParse(form.acceptablePeriod ?? '').data ?? '';
  const optimalPeriod = CruisePeriodValidationSchema.safeParse(form.optimalPeriod ?? '').data ?? '';

  return {
    id: form.id ?? undefined,
    cruiseManagerId: form.cruiseManagerId,
    deputyManagerId: form.deputyManagerId ?? '',
    year: form.year,
    acceptablePeriod,
    optimalPeriod,
    periodSelectionType:
      form.periodSelectionType === 'precise' || form.periodSelectionType === 'period'
        ? form.periodSelectionType
        : form.precisePeriodStart || form.precisePeriodEnd
          ? 'precise'
          : 'period',
    precisePeriodStart: form.precisePeriodStart ?? '',
    precisePeriodEnd: form.precisePeriodEnd ?? '',
    cruiseDays: toNumber(form.cruiseHours) / 24,
    cruiseHours: toNumber(form.cruiseHours),
    periodNotes: form.periodNotes,
    shipUsage: form.shipUsage ?? '',
    differentUsage: form.differentUsage,
    permissions: form.permissions.map((permission) => ({
      description: permission.description ?? '',
      executive: permission.executive ?? '',
      scan: permission.scan ?? undefined,
    })),
    researchAreaDescriptions: form.researchAreaDescriptions,
    cruiseGoal:
      form.cruiseGoal === CruiseGoal.Research ||
      form.cruiseGoal === CruiseGoal.Commercial ||
      form.cruiseGoal === CruiseGoal.Educational
        ? form.cruiseGoal
        : '',
    cruiseGoalDescription: form.cruiseGoalDescription,
    researchTasks: form.researchTasks.map(mapResearchTaskToValues),
    contracts: form.contracts.map((contract) => ({
      category: contract.category === 'international' ? 'international' : 'domestic',
      institutionName: contract.institutionName ?? '',
      institutionUnit: contract.institutionUnit ?? '',
      institutionLocalization: contract.institutionLocalization ?? '',
      description: contract.description ?? '',
      scans: contract.scans,
    })),
    ugTeams: form.ugTeams.map((team) => ({
      ...team,
      noOfEmployees: toNumber(team.noOfEmployees),
      noOfStudents: toNumber(team.noOfStudents),
    })),
    guestTeams: form.guestTeams.map((team) => ({ name: team.name ?? '', noOfPersons: toNumber(team.noOfPersons) })),
    publications: form.publications.map((publication) => ({
      id: publication.id,
      category:
        publication.category === PublicationCategory.Postscript
          ? PublicationCategory.Postscript
          : PublicationCategory.Subject,
      doi: publication.doi ?? '',
      authors: publication.authors ?? '',
      title: publication.title ?? '',
      magazine: publication.magazine ?? '',
      year: toNumber(publication.year),
      ministerialPoints: toNumber(publication.ministerialPoints),
    })),
    spubTasks: form.spubTasks.map((task) => ({
      name: task.name ?? '',
      yearFrom: task.yearFrom ?? '',
      yearTo: task.yearTo ?? '',
    })),
    supervisorEmail: form.supervisorEmail,
    note: form.note ?? '',
  };
}

export function mapResearchTaskToValues(task: ResearchTaskFields): FormAValues['researchTasks'][number] {
  switch (task.type) {
    case ResearchTaskType.BachelorThesis:
    case ResearchTaskType.MasterThesis:
    case ResearchTaskType.DoctoralThesis:
      return { type: task.type, author: task.author ?? '', title: task.title ?? '' };
    case ResearchTaskType.ProjectPreparation:
      return {
        type: task.type,
        title: task.title ?? '',
        date: task.date ?? '',
        financingApproved: task.financingApproved === 'true' ? 'true' : 'false',
      };
    case ResearchTaskType.DomesticProject:
    case ResearchTaskType.ForeignProject:
    case ResearchTaskType.InternalUgProject:
    case ResearchTaskType.OtherProject:
    case ResearchTaskType.CommercialProject:
      return {
        type: task.type,
        title: task.title ?? '',
        financingAmount: toNumber(task.financingAmount),
        startDate: task.startDate ?? '',
        endDate: task.endDate ?? '',
        securedAmount: toNumber(task.securedAmount),
      };
    case ResearchTaskType.Didactics:
      return { type: task.type, description: task.description ?? '' };
    case ResearchTaskType.OwnResearchTask:
      return {
        type: task.type,
        title: task.title ?? '',
        date: task.date ?? '',
        magazine: task.magazine ?? '',
        ministerialPoints: toNumber(task.ministerialPoints),
      };
    default:
      return { type: ResearchTaskType.OtherResearchTask, description: task.description ?? '' };
  }
}

export function mapFormAOptions(options: GeneratedFormAOptions): FormAOptions {
  return {
    cruiseManagers: (options.cruiseManagers ?? []).map((user) => ({
      id: user.id ?? '',
      email: user.email ?? '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
    })),
    deputyManagers: (options.deputyManagers ?? []).map((user) => ({
      id: user.id ?? '',
      email: user.email ?? '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
    })),
    years: options.years ?? [],
    shipUsages: options.shipUsages ?? [],
    standardSpubTasks: options.standardSpubTasks ?? [],
    researchAreas: (options.researchAreas ?? []).map((area) => ({ id: area.id ?? '', name: area.name ?? '' })),
    cruiseGoals: options.cruiseGoals ?? [],
    historicalResearchTasks: (options.historicalResearchTasks ?? []).map(mapResearchTaskToValues),
    historicalContracts: (options.historicalContracts ?? []).map((contract) => ({
      category: contract.category === 'international' ? 'international' : 'domestic',
      institutionName: contract.institutionName ?? '',
      institutionUnit: contract.institutionUnit ?? '',
      institutionLocalization: contract.institutionLocalization ?? '',
      description: contract.description ?? '',
      scans: contract.scans,
    })),
    ugUnits: (options.ugUnits ?? []).map((unit) => ({ id: unit.id ?? '', name: unit.name ?? '' })),
    historicalGuestInstitutions: options.historicalGuestInstitutions ?? [],
    historicalSpubTasks: (options.historicalSpubTasks ?? []).map((task) => ({
      name: task.name ?? '',
      yearFrom: task.yearFrom ?? '',
      yearTo: task.yearTo ?? '',
    })),
    historicalPublications: (options.historicalPublications ?? []).map((publication) => ({
      id: publication.id,
      category:
        publication.category === PublicationCategory.Postscript
          ? PublicationCategory.Postscript
          : PublicationCategory.Subject,
      doi: publication.doi ?? '',
      authors: publication.authors ?? '',
      title: publication.title ?? '',
      magazine: publication.magazine ?? '',
      year: toNumber(publication.year),
      ministerialPoints: toNumber(publication.ministerialPoints),
    })),
  };
}

function toNumber(value: string | null | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
