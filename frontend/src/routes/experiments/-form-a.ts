import { z } from 'zod';

import type { FormUserDto } from '@/api/dto/applications/FormUserDto';
import { CruiseGoal, type CruisePeriodType, CruisePeriodValidationSchema } from '@/api/dto/applications/FormADto';
import type { BlockadePeriodDto } from '@/api/dto/cruises/CruiseDto';
import { getPeriodEdgeDatePoint, MAX_PERIOD_EDGE_VALUE } from '@/lib/applications/periodUtils';
import { mapPersonToText } from '@/lib/applications/PersonMappers';

export type PeriodSelectionType = 'precise' | 'period';

export type OverlappingBlockade = {
  title: string;
  start: Date;
  end: Date;
};

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
const validYears = new Set(yearOptions);
const validShipUsageIds = new Set<string>(shipUsageOptions.map((option) => option.value));
const validCruiseGoalIds = new Set<CruiseGoal>(cruiseGoalOptions.map((option) => option.value));

export const experimentFormASchema = z
  .object({
    cruiseManagerId: z.string(),
    deputyManagerId: z.string(),
    year: z.string(),
    periodSelectionType: z.enum(['precise', 'period']),
    acceptablePeriod: CruisePeriodValidationSchema,
    optimalPeriod: CruisePeriodValidationSchema,
    precisePeriodStart: z.string(),
    precisePeriodEnd: z.string(),
    cruiseHours: z.string(),
    periodNotes: z.string(),
    shipUsage: z.string(),
    differentUsage: z.string(),
    cruiseGoal: z.union([z.enum(CruiseGoal), z.literal('')]),
    cruiseGoalDescription: z.string(),
  })
  .superRefine((values, ctx) => {
    if (!validManagerIds.has(values.cruiseManagerId)) {
      ctx.addIssue({
        code: 'custom',
        path: ['cruiseManagerId'],
        message: 'Kierownik rejsu musi zostać wybrany z listy',
      });
    }

    if (!validManagerIds.has(values.deputyManagerId)) {
      ctx.addIssue({
        code: 'custom',
        path: ['deputyManagerId'],
        message: 'Zastępca kierownika rejsu musi zostać wybrany z listy',
      });
    }

    if (values.cruiseManagerId && values.cruiseManagerId === values.deputyManagerId) {
      ctx.addIssue({
        code: 'custom',
        path: ['deputyManagerId'],
        message: 'Kierownik rejsu nie może być jednocześnie zastępcą kierownika rejsu',
      });
    }

    if (!validYears.has(values.year as (typeof yearOptions)[number])) {
      ctx.addIssue({
        code: 'custom',
        path: ['year'],
        message: `Rok musi należeć do dostępnych opcji: ${yearOptions.join(', ')}`,
      });
    }

    const parsedHours = Number.parseInt(values.cruiseHours, 10);
    if (Number.isNaN(parsedHours) || parsedHours < 1 || parsedHours > 1440) {
      ctx.addIssue({
        code: 'custom',
        path: ['cruiseHours'],
        message: 'Rejs musi trwać co najmniej godzinę i nie dłużej niż 60 dni (1440 godzin)',
      });
    }

    if (!validShipUsageIds.has(values.shipUsage)) {
      ctx.addIssue({
        code: 'custom',
        path: ['shipUsage'],
        message: 'Wymagane jest wskazanie sposobu korzystania ze statku',
      });
    }

    if (values.shipUsage === '4' && values.differentUsage.trim().length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['differentUsage'],
        message: 'W przypadku wyboru "inne" należy podać informacje o sposobie korzystania ze statku',
      });
    }

    if (!validCruiseGoalIds.has(values.cruiseGoal as CruiseGoal)) {
      ctx.addIssue({
        code: 'custom',
        path: ['cruiseGoal'],
        message: 'Cel rejsu musi zostać wybrany z listy',
      });
    }

    if (values.cruiseGoal !== '' && values.cruiseGoalDescription.trim().length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['cruiseGoalDescription'],
        message: 'Opis celu rejsu jest wymagany',
      });
    }

    if (values.periodSelectionType === 'precise') {
      validatePrecisePeriod(values, parsedHours, ctx);
      return;
    }

    validatePeriodSelection(values, parsedHours, ctx);
  });

export type ExperimentFormAValues = z.infer<typeof experimentFormASchema>;

export function getCurrentBlockades(year: string) {
  return blockadesByYear[year] ?? [];
}

export function getOverlappingBlockades(
  values: Pick<
    ExperimentFormAValues,
    'acceptablePeriod' | 'periodSelectionType' | 'precisePeriodEnd' | 'precisePeriodStart' | 'year'
  >,
  blockades?: BlockadePeriodDto[]
) {
  if (values.periodSelectionType === 'precise') {
    return getOverlappingBlockadesForRange(blockades, values.precisePeriodStart, values.precisePeriodEnd);
  }

  return getOverlappingBlockadesForPeriod(blockades, values.year, values.acceptablePeriod);
}

export function normalizeExperimentFormAValues(values: ExperimentFormAValues): ExperimentFormAValues {
  const normalized = {
    ...values,
    periodNotes: values.periodNotes.trim(),
    differentUsage: values.differentUsage.trim(),
    cruiseGoalDescription: values.cruiseGoalDescription.trim(),
  };

  if (normalized.periodSelectionType === 'period') {
    normalized.precisePeriodStart = '';
    normalized.precisePeriodEnd = '';
  } else {
    normalized.acceptablePeriod = '';
    normalized.optimalPeriod = '';
  }

  if (normalized.shipUsage !== '4') {
    normalized.differentUsage = '';
  }

  if (normalized.cruiseGoal === '') {
    normalized.cruiseGoalDescription = '';
  }

  return normalized;
}

export function formatBlockadeDate(date: Date) {
  return date.toLocaleDateString('pl-PL');
}

type SelectedCruisePeriod = Exclude<CruisePeriodType, ''>;

function validatePrecisePeriod(values: ExperimentFormAValues, parsedHours: number, ctx: z.RefinementCtx) {
  if (!values.precisePeriodStart) {
    ctx.addIssue({
      code: 'custom',
      path: ['precisePeriodStart'],
      message: 'Dokładny termin rozpoczęcia rejsu jest wymagany',
    });
  }

  if (!values.precisePeriodEnd) {
    ctx.addIssue({
      code: 'custom',
      path: ['precisePeriodEnd'],
      message: 'Dokładny termin zakończenia rejsu jest wymagany',
    });
  }

  if (values.precisePeriodStart && values.precisePeriodEnd && values.precisePeriodStart > values.precisePeriodEnd) {
    ctx.addIssue({
      code: 'custom',
      path: ['precisePeriodEnd'],
      message: 'Data zakończenia musi być późniejsza niż data rozpoczęcia',
    });
  }

  if (values.precisePeriodStart && values.precisePeriodEnd && parsedHours > 0) {
    const slotAnalysis = hasEnoughFreeSlotInPrecisePeriod(
      blockadesByYear[values.year],
      values.precisePeriodStart,
      values.precisePeriodEnd,
      parsedHours
    );

    if (!slotAnalysis.canFitCruise) {
      ctx.addIssue({
        code: 'custom',
        path: ['precisePeriodEnd'],
        message:
          'Rejs nie może się odbyć w podanym terminie. Czas pomiędzy blokadami jest krótszy niż wybrany czas trwania rejsu.',
      });
    }
  }
}

function validatePeriodSelection(values: ExperimentFormAValues, parsedHours: number, ctx: z.RefinementCtx) {
  if (!isValidPeriod(values.acceptablePeriod)) {
    ctx.addIssue({
      code: 'custom',
      path: ['acceptablePeriod'],
      message: 'Dopuszczalny okres jest wymagany',
    });
  }

  if (!isValidPeriod(values.optimalPeriod)) {
    ctx.addIssue({
      code: 'custom',
      path: ['optimalPeriod'],
      message: 'Optymalny okres jest wymagany',
    });
  }

  if (!isValidPeriod(values.acceptablePeriod) || !isValidPeriod(values.optimalPeriod)) {
    return;
  }

  const acceptableStart = Number.parseInt(values.acceptablePeriod[0], 10);
  const acceptableEnd = Number.parseInt(values.acceptablePeriod[1], 10);
  const optimalStart = Number.parseInt(values.optimalPeriod[0], 10);
  const optimalEnd = Number.parseInt(values.optimalPeriod[1], 10);

  if (optimalStart < acceptableStart || optimalEnd > acceptableEnd) {
    ctx.addIssue({
      code: 'custom',
      path: ['optimalPeriod'],
      message: 'Okres optymalny musi zawierać się w okresie akceptowalnym',
    });
  }

  if (Number.isNaN(parsedHours) || parsedHours <= 0) {
    return;
  }

  const cruiseDurationDays = parsedHours / 24;
  const parsedYear = Number.parseInt(values.year, 10);

  if (!Number.isNaN(parsedYear)) {
    if (!hasEnoughDaysInPeriod(values.acceptablePeriod, parsedYear, cruiseDurationDays)) {
      ctx.addIssue({
        code: 'custom',
        path: ['acceptablePeriod'],
        message: 'Wybrany okres czasu jest zbyt krótki dla planowanego czasu rejsu',
      });
    }

    if (!hasEnoughDaysInPeriod(values.optimalPeriod, parsedYear, cruiseDurationDays)) {
      ctx.addIssue({
        code: 'custom',
        path: ['optimalPeriod'],
        message: 'Wybrany okres czasu jest zbyt krótki dla planowanego czasu rejsu',
      });
    }
  }

  const acceptableSlotAnalysis = hasEnoughFreeSlotInPeriod(
    blockadesByYear[values.year],
    values.year,
    values.acceptablePeriod,
    parsedHours
  );
  if (!acceptableSlotAnalysis.canFitCruise) {
    ctx.addIssue({
      code: 'custom',
      path: ['acceptablePeriod'],
      message:
        'Rejs nie może się odbyć w podanym okresie. Czas pomiędzy blokadami jest krótszy niż wybrany czas trwania rejsu.',
    });
  }

  const optimalSlotAnalysis = hasEnoughFreeSlotInPeriod(
    blockadesByYear[values.year],
    values.year,
    values.optimalPeriod,
    parsedHours
  );
  if (!optimalSlotAnalysis.canFitCruise) {
    ctx.addIssue({
      code: 'custom',
      path: ['optimalPeriod'],
      message:
        'Rejs nie może się odbyć w podanym okresie. Czas pomiędzy blokadami jest krótszy niż wybrany czas trwania rejsu.',
    });
  }
}

function isValidPeriod(period: CruisePeriodType): period is SelectedCruisePeriod {
  return Array.isArray(period) && period.length === 2;
}

function hasEnoughDaysInPeriod(period: [string, string], year: number, cruiseDurationDays: number): boolean {
  const startEdge = Number.parseInt(period[0], 10);
  const endEdge = Number.parseInt(period[1], 10);

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

function getOverlappingBlockadesForRange(
  blockades: BlockadePeriodDto[] | undefined,
  rangeStart: string,
  rangeEnd: string
): OverlappingBlockade[] {
  if (!blockades || blockades.length === 0 || !rangeStart || !rangeEnd) {
    return [];
  }

  const start = new Date(rangeStart);
  const end = new Date(rangeEnd);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return [];
  }

  return blockades
    .map((blockade) => ({
      title: blockade.title?.trim() ? blockade.title : 'Bez tytułu',
      start: new Date(blockade.startDate),
      end: new Date(blockade.endDate),
    }))
    .filter((blockade) => !Number.isNaN(blockade.start.getTime()) && !Number.isNaN(blockade.end.getTime()))
    .filter((blockade) => blockade.end > start && blockade.start < end)
    .map((blockade) => ({
      title: blockade.title,
      start: blockade.start < start ? start : blockade.start,
      end: blockade.end > end ? end : blockade.end,
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

function getOverlappingBlockadesForPeriod(
  blockades: BlockadePeriodDto[] | undefined,
  year: string,
  period: CruisePeriodType
): OverlappingBlockade[] {
  if (!isValidPeriod(period)) {
    return [];
  }

  const parsedYear = Number.parseInt(year, 10);
  const startEdge = Number.parseInt(period[0], 10);
  const endEdge = Number.parseInt(period[1], 10);

  if (
    Number.isNaN(parsedYear) ||
    Number.isNaN(startEdge) ||
    Number.isNaN(endEdge) ||
    startEdge < 0 ||
    endEdge < 0 ||
    startEdge > MAX_PERIOD_EDGE_VALUE ||
    endEdge > MAX_PERIOD_EDGE_VALUE
  ) {
    return [];
  }

  return getOverlappingBlockadesForRange(
    blockades,
    formatDateInput(getPeriodEdgeDatePoint(parsedYear, startEdge)),
    formatDateInput(getPeriodEdgeDatePoint(parsedYear, endEdge))
  );
}

function getMergedOverlappingBlockades(overlappingBlockades: OverlappingBlockade[]): Array<{ start: Date; end: Date }> {
  if (overlappingBlockades.length === 0) {
    return [];
  }

  const merged: Array<{ start: Date; end: Date }> = [];
  for (const blockade of overlappingBlockades) {
    const last = merged.at(-1);
    if (!last) {
      merged.push({ start: blockade.start, end: blockade.end });
      continue;
    }

    if (blockade.start <= last.end) {
      if (blockade.end > last.end) {
        last.end = blockade.end;
      }
      continue;
    }

    merged.push({ start: blockade.start, end: blockade.end });
  }

  return merged;
}

function analyzeCruiseSlot(
  blockades: BlockadePeriodDto[] | undefined,
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

  if ((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24) < cruiseDurationDays) {
    return { canFitCruise: false, overlappingBlockades: [] };
  }

  const overlappingBlockades = getOverlappingBlockadesForRange(
    blockades,
    formatDateInput(rangeStart),
    formatDateInput(rangeEnd)
  );
  const merged = getMergedOverlappingBlockades(overlappingBlockades);

  if (merged.length === 0) {
    return { canFitCruise: true, overlappingBlockades: [] };
  }

  let freeSlotStart = rangeStart;
  for (const blockade of merged) {
    const freeDays = (blockade.start.getTime() - freeSlotStart.getTime()) / (1000 * 60 * 60 * 24);
    if (freeDays >= cruiseDurationDays) {
      return { canFitCruise: true, overlappingBlockades };
    }

    if (blockade.end > freeSlotStart) {
      freeSlotStart = blockade.end;
    }
  }

  const remainingFreeDays = (rangeEnd.getTime() - freeSlotStart.getTime()) / (1000 * 60 * 60 * 24);
  return { canFitCruise: remainingFreeDays >= cruiseDurationDays, overlappingBlockades };
}

function hasEnoughFreeSlotInPrecisePeriod(
  blockades: BlockadePeriodDto[] | undefined,
  precisePeriodStart: string,
  precisePeriodEnd: string,
  cruiseHours: number
): { canFitCruise: boolean; overlappingBlockades: OverlappingBlockade[] } {
  if (!precisePeriodStart || !precisePeriodEnd || cruiseHours <= 0) {
    return { canFitCruise: true, overlappingBlockades: [] };
  }

  return analyzeCruiseSlot(blockades, new Date(precisePeriodStart), new Date(precisePeriodEnd), cruiseHours / 24);
}

function hasEnoughFreeSlotInPeriod(
  blockades: BlockadePeriodDto[] | undefined,
  year: string,
  period: CruisePeriodType,
  cruiseHours: number
): { canFitCruise: boolean; overlappingBlockades: OverlappingBlockade[] } {
  if (!isValidPeriod(period) || cruiseHours <= 0) {
    return { canFitCruise: true, overlappingBlockades: [] };
  }

  const parsedYear = Number.parseInt(year, 10);
  const startEdge = Number.parseInt(period[0], 10);
  const endEdge = Number.parseInt(period[1], 10);

  if (
    Number.isNaN(parsedYear) ||
    Number.isNaN(startEdge) ||
    Number.isNaN(endEdge) ||
    startEdge < 0 ||
    endEdge < 0 ||
    startEdge > MAX_PERIOD_EDGE_VALUE ||
    endEdge > MAX_PERIOD_EDGE_VALUE
  ) {
    return { canFitCruise: true, overlappingBlockades: [] };
  }

  return analyzeCruiseSlot(
    blockades,
    getPeriodEdgeDatePoint(parsedYear, startEdge),
    getPeriodEdgeDatePoint(parsedYear, endEdge),
    cruiseHours / 24
  );
}

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
