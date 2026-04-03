import { z } from 'zod';

import { CruiseGoal, type CruisePeriodType } from '@/api/dto/applications/FormADto';
import type { FormUserDto } from '@/api/dto/applications/FormUserDto';
import type { BlockadePeriodDto } from '@/api/dto/cruises/CruiseDto';
import { mapPersonToText } from '@/lib/applications/PersonMappers';

export type PeriodSelectionType = 'precise' | 'period';

export type ExperimentCruisePeriod = {
  start: number;
  end: number;
};

export type OverlappingBlockade = {
  title: string;
  start: Date;
  end: Date;
};

const currentYear = new Date().getFullYear();
const MIN_PERIOD_EDGE = 0;
const MAX_PERIOD_EDGE = 24;

const people: FormUserDto[] = [
  {
    id: 'ea7ad7ca-1c5d-4bc9-859c-ee98321f5949',
    email: 'kierownik@o2.com',
    firstName: 'Kierownik',
    lastName: 'Kierowniczy',
  },
  {
    id: 'f77ae78e-420f-4e62-911a-728422718767',
    email: 'admin@gmail.com',
    firstName: 'Admin',
    lastName: 'Adminowy',
  },
];

export const managerOptions = people.map((person) => ({
  value: person.id,
  label: mapPersonToText(person),
}));

export const yearOptions = ['2025', '2026'] as const;

export const periodSelectionOptions: Array<{ value: PeriodSelectionType; label: string }> = [
  { value: 'precise', label: 'Dokładny termin' },
  { value: 'period', label: 'Okres dopuszczalny/optymalny' },
];

export const shipUsageOptions = [
  { value: '0', label: 'całą dobę' },
  { value: '1', label: 'jedynie w ciągu dnia (maks. 8-12 h)' },
  { value: '2', label: 'jedynie w nocy (maks. 8-12 h)' },
  { value: '3', label: '8-12 h w ciągu doby rejsowej, ale bez znaczenia o jakiej porze' },
  { value: '4', label: 'w inny sposób' },
] as const;

export const cruiseGoalOptions = [
  { value: CruiseGoal.Research, label: 'Naukowy' },
  { value: CruiseGoal.Commercial, label: 'Komercyjny' },
  { value: CruiseGoal.Educational, label: 'Dydaktyczny' },
] as const;

export const blockadesByYear: Record<string, BlockadePeriodDto[]> = {
  '2025': [
    {
      title: 'Przegląd techniczny',
      startDate: '2025-03-03',
      endDate: '2025-03-20',
    },
    {
      title: 'Rejs komercyjny',
      startDate: '2025-07-01',
      endDate: '2025-07-15',
    },
  ],
  '2026': [
    {
      title: 'Rozbudowany serwis stoczniowy',
      startDate: '2026-01-01',
      endDate: '2026-04-01',
    },
    {
      title: 'Kampania pomiarowa',
      startDate: '2026-04-01',
      endDate: '2026-07-01',
    },
  ],
};

const validManagerIds = new Set(managerOptions.map((option) => option.value));

function createCruisePeriodSchema() {
  return z
    .object({
      start: z.int().min(MIN_PERIOD_EDGE).max(MAX_PERIOD_EDGE),
      end: z.int().min(MIN_PERIOD_EDGE).max(MAX_PERIOD_EDGE),
    })
    .refine(({ start, end }) => start < end, {
      message: 'Data zakończenia musi być późniejsza niż data rozpoczęcia',
      path: ['end'],
    });
}

function getPeriodEdgeDatePoint(year: number, edge: number) {
  if (edge === MAX_PERIOD_EDGE) {
    return new Date(year + 1, 0, 1);
  }

  return new Date(year, Math.floor(edge / 2), edge % 2 === 0 ? 1 : 15);
}

function getOverlappingBlockadesInRange(
  blockades: BlockadePeriodDto[] | undefined,
  rangeStart: Date,
  rangeEnd: Date
): OverlappingBlockade[] {
  if (!blockades || blockades.length === 0) {
    return [];
  }

  if (Number.isNaN(rangeStart.getTime()) || Number.isNaN(rangeEnd.getTime()) || rangeEnd <= rangeStart) {
    return [];
  }

  return blockades
    .map((blockade) => ({
      title: blockade.title?.trim() ? blockade.title : 'Bez tytułu',
      start: new Date(blockade.startDate),
      end: new Date(blockade.endDate),
    }))
    .filter((blockade) => !Number.isNaN(blockade.start.getTime()) && !Number.isNaN(blockade.end.getTime()))
    .filter((blockade) => blockade.end > rangeStart && blockade.start < rangeEnd)
    .map((blockade) => ({
      title: blockade.title,
      start: blockade.start < rangeStart ? rangeStart : blockade.start,
      end: blockade.end > rangeEnd ? rangeEnd : blockade.end,
    }))
    .sort((left, right) => left.start.getTime() - right.start.getTime());
}

function getMergedBlockades(overlappingBlockades: Array<{ start: Date; end: Date }>) {
  if (overlappingBlockades.length === 0) {
    return [];
  }

  const merged: Array<{ start: Date; end: Date }> = [];

  for (const blockade of overlappingBlockades) {
    const lastMerged = merged.at(-1);

    if (!lastMerged) {
      merged.push({ start: blockade.start, end: blockade.end });
      continue;
    }

    if (blockade.start <= lastMerged.end) {
      if (blockade.end > lastMerged.end) {
        lastMerged.end = blockade.end;
      }
      continue;
    }

    merged.push({ start: blockade.start, end: blockade.end });
  }

  return merged;
}

function canFitCruiseInRange(
  rangeStart: Date,
  rangeEnd: Date,
  cruiseDurationHours: number,
  blockades: BlockadePeriodDto[] | undefined
) {
  const cruiseDurationDays = cruiseDurationHours / 24;

  if (cruiseDurationDays <= 0) {
    return true;
  }

  if (Number.isNaN(rangeStart.getTime()) || Number.isNaN(rangeEnd.getTime()) || rangeEnd <= rangeStart) {
    return true;
  }

  const rangeDurationDays = (rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24);
  if (rangeDurationDays < cruiseDurationDays) {
    return false;
  }

  const overlappingBlockades = getOverlappingBlockadesInRange(blockades, rangeStart, rangeEnd);
  const mergedBlockades = getMergedBlockades(overlappingBlockades);

  if (mergedBlockades.length === 0) {
    return true;
  }

  let freeSlotStart = rangeStart;

  for (const blockade of mergedBlockades) {
    const freeDays = (blockade.start.getTime() - freeSlotStart.getTime()) / (1000 * 60 * 60 * 24);

    if (freeDays >= cruiseDurationDays) {
      return true;
    }

    if (blockade.end > freeSlotStart) {
      freeSlotStart = blockade.end;
    }
  }

  const remainingFreeDays = (rangeEnd.getTime() - freeSlotStart.getTime()) / (1000 * 60 * 60 * 24);
  return remainingFreeDays >= cruiseDurationDays;
}

function canFitCruiseIntoPeriod(period: ExperimentCruisePeriod, year: number, cruiseDurationHours: number) {
  const periodStart = getPeriodEdgeDatePoint(year, period.start);
  const periodEnd = getPeriodEdgeDatePoint(year, period.end);
  const periodDurationDays = (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);

  return periodDurationDays >= cruiseDurationHours / 24;
}

function canFitCruiseBetweenBlockades(period: ExperimentCruisePeriod, year: number, cruiseDurationHours: number) {
  return canFitCruiseInRange(
    getPeriodEdgeDatePoint(year, period.start),
    getPeriodEdgeDatePoint(year, period.end),
    cruiseDurationHours,
    getCurrentBlockades(String(year))
  );
}

function canFitCruiseInPreciseRange(start: Date, end: Date, year: number, cruiseDurationHours: number) {
  return canFitCruiseInRange(start, end, cruiseDurationHours, getCurrentBlockades(String(year)));
}

export const experimentFormASchema = z.object({
  section1: z
    .object({
      cruiseManagerId: z.string().refine((value) => validManagerIds.has(value), {
        message: 'Kierownik rejsu musi zostać wybrany z listy',
      }),
      deputyManagerId: z.string().refine((value) => validManagerIds.has(value), {
        message: 'Zastępca kierownika rejsu musi zostać wybrany z listy',
      }),
    })
    .refine(({ cruiseManagerId, deputyManagerId }) => cruiseManagerId !== deputyManagerId, {
      message: 'Kierownik rejsu nie może być jednocześnie zastępcą kierownika rejsu',
      path: ['deputyManagerId'],
    }),
  section2: z
    .object({
      year: z.codec(
        z.string(),
        z
          .int()
          .min(currentYear - 1, `Rok nie może być wcześniejszy niż ${currentYear - 1}`)
          .max(currentYear + 1, `Rok nie może być późniejszy niż ${currentYear + 1}`),
        {
          decode: (string) => Number(string),
          encode: (int) => String(int),
        }
      ),
      period: z.discriminatedUnion('exact', [
        z
          .object({
            exact: z.literal(false),
            acceptable: createCruisePeriodSchema(),
            optimal: createCruisePeriodSchema(),
            precise: z.any(),
          })
          .refine(({ acceptable, optimal }) => optimal.start >= acceptable.start && optimal.end <= acceptable.end, {
            message: 'Okres optymalny musi zawierać się w okresie akceptowalnym',
            path: ['optimal'],
          })
          .transform(({ precise: _precise, ...period }) => period),
        z
          .object({
            exact: z.literal(true),
            optimal: z.any(),
            acceptable: z.any(),
            precise: z
              .object({
                start: z
                  .string()
                  .nonempty('Dokładny termin rozpoczęcia rejsu jest wymagany')
                  .check(z.iso.date())
                  .transform((value) => new Date(value)),
                end: z
                  .string()
                  .nonempty('Dokładny termin zakończenia rejsu jest wymagany')
                  .check(z.iso.date())
                  .transform((value) => new Date(value)),
              })
              .refine(({ start, end }) => start < end, {
                message: 'Data zakończenia musi być późniejsza niż data rozpoczęcia',
                path: ['end'],
              }),
          })
          .transform(({ optimal: _optimal, acceptable: _acceptable, ...period }) => period),
      ]),
      notes: z.string(),
      cruiseDurationHours: z.codec(
        z.string(),
        z.int().min(1, 'Rejs musi trwać co najmniej godzinę').max(1440, 'Rejs nie może trwać dłużej niż 1440 minut'),
        {
          decode: (string) => Number(string),
          encode: (int) => String(int),
        }
      ),
      shipUsage: z
        .discriminatedUnion('type', [
          z.object({
            type: z.enum(['0', '1', '2', '3', '']),
            description: z.string(),
          }),
          z.object({
            type: z.literal('4'),
            description: z
              .string()
              .trim()
              .min(1, 'W przypadku wyboru "inne" należy podać informacje o sposobie korzystania ze statku'),
          }),
        ])
        .refine(({ type }) => type !== '', {
          path: ['type'],
          message: 'Wymagane jest wskazanie sposobu korzystania ze statku',
        }),
    })
    .superRefine(({ period, year, cruiseDurationHours }, ctx) => {
      if (period.exact) {
        if (!canFitCruiseInPreciseRange(period.precise.start, period.precise.end, year, cruiseDurationHours)) {
          ctx.addIssue({
            code: 'custom',
            path: ['period', 'precise', 'end'],
            message:
              'Rejs nie może się odbyć w podanym terminie. Czas pomiędzy blokadami jest krótszy niż wybrany czas trwania rejsu.',
          });
        }

        return;
      }

      for (const periodKey of ['acceptable', 'optimal'] as const) {
        if (!canFitCruiseIntoPeriod(period[periodKey], year, cruiseDurationHours)) {
          ctx.addIssue({
            code: 'custom',
            path: ['period', periodKey],
            message: 'Wybrany okres czasu jest zbyt krótki dla planowanego czasu rejsu',
          });
        }

        if (!canFitCruiseBetweenBlockades(period[periodKey], year, cruiseDurationHours)) {
          ctx.addIssue({
            code: 'custom',
            path: ['period', periodKey],
            message:
              'Rejs nie może się odbyć w podanym okresie. Czas pomiędzy blokadami jest krótszy niż wybrany czas trwania rejsu.',
          });
        }
      }
    }),
  section3: z.object({
    permissions: z
      .object({
        description: z.string().min(1, 'Treść pozwolenia jest wymagana').max(1024, 'Maksymalna długość to 1024 znaków'),
        executive: z.string().min(1, 'Organ wydający jest wymagany').max(128, 'Maksymalna długość to 128 znaków'),
        scan: z.undefined().optional(),
      })
      .array(),
  }),
  section5: z.object({
    cruiseGoal: z.object({
      type: z.string().pipe(z.enum(CruiseGoal, 'Cel rejsu musi zostać wybrany z listy')),
      description: z
        .string()
        .trim()
        .min(1, 'Opis celu rejsu jest wymagany')
        .max(1024, 'Opis celu rejsu nie może być dłuższy niż 1024 znaków'),
    }),
  }),
});

export type ExperimentFormAInput = z.input<typeof experimentFormASchema>;
export type ExperimentFormAOutput = z.output<typeof experimentFormASchema>;
export type ExperimentPeriodInput = ExperimentFormAInput['section2']['period'];
export type ExperimentPeriodModeInput = Extract<ExperimentPeriodInput, { exact: false }>;
export type ExperimentFormASection2Values = ExperimentFormAInput['section2'];

export function getCurrentBlockades(year: string) {
  return blockadesByYear[year] ?? [];
}

export function getOverlappingBlockades(
  values: Pick<ExperimentFormASection2Values, 'period' | 'year'>,
  blockades?: BlockadePeriodDto[]
): OverlappingBlockade[] {
  if (values.period.exact) {
    const { start, end } = values.period.precise;

    if (!start || !end) {
      return [];
    }

    return getOverlappingBlockadesInRange(blockades, new Date(start), new Date(end));
  }

  const parsedYear = Number(values.year);
  if (Number.isNaN(parsedYear)) {
    return [];
  }

  return getOverlappingBlockadesInRange(
    blockades,
    getPeriodEdgeDatePoint(parsedYear, values.period.acceptable.start),
    getPeriodEdgeDatePoint(parsedYear, values.period.acceptable.end)
  );
}

export function formatBlockadeDate(date: Date) {
  return date.toLocaleDateString('pl-PL');
}

export const defaultValues: ExperimentFormAInput = {
  section1: {
    cruiseManagerId: '',
    deputyManagerId: '',
  },
  section2: {
    year: String(currentYear),
    period: {
      exact: false,
      acceptable: {
        start: 0,
        end: 24,
      },
      optimal: {
        start: 4,
        end: 10,
      },
      precise: {
        start: '',
        end: '',
      },
    },
    notes: '',
    cruiseDurationHours: '',
    shipUsage: {
      type: '',
      description: '',
    },
  },
  section3: {
    permissions: [],
  },
  section5: {
    cruiseGoal: {
      type: '',
      description: '',
    },
  },
};

export function toCruisePeriod(period?: ExperimentCruisePeriod): CruisePeriodType | undefined {
  if (!period) {
    return undefined;
  }

  return [String(period.start), String(period.end)] as CruisePeriodType;
}

export function fromCruisePeriod(period: CruisePeriodType): ExperimentCruisePeriod {
  return {
    start: Number(period[0]),
    end: Number(period[1]),
  };
}
