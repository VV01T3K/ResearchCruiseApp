import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { CruiseApplicationDto } from '@/api/dto/applications/CruiseApplicationDto';
import { CruisePeriodType } from '@/api/dto/applications/FormADto';

export const MAX_PERIOD_EDGE_VALUE = 24;

export function getPeriodEdgeDatePoint(year: number, edge: number): Date {
  if (edge === MAX_PERIOD_EDGE_VALUE) {
    return new Date(year + 1, 0, 1);
  }

  const month = Math.floor(edge / 2);
  const day = edge % 2 === 0 ? 1 : 15;
  return new Date(year, month, day);
}

export function getPeriodEdgeDateString(year: number, edge: number): string {
  if (edge === MAX_PERIOD_EDGE_VALUE) {
    return `${year + 1}-01-01`;
  }

  const month = Math.floor(edge / 2) + 1;
  const day = edge % 2 === 0 ? 1 : 15;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function parsePeriodRangeInput(
  year: string,
  period: CruisePeriodType | '',
  isValidPeriod: (period: unknown) => period is CruisePeriodType
): { parsedYear: number; startEdge: number; endEdge: number } | null {
  if (!isValidPeriod(period)) {
    return null;
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
    endEdge > MAX_PERIOD_EDGE_VALUE
  ) {
    return null;
  }

  return { parsedYear, startEdge, endEdge };
}

export function convertPeriodNumberToDate(periodNumber: string, year: number): Date {
  const num = parseInt(periodNumber);
  const startDay = num % 2 === 0 ? 1 : 15;
  const startMonth = Math.floor(num / 2) + 1;
  return new Date(year, startMonth - 1, startDay, 8, 0, 0);
}

function parseBackendDateTimeType(value: string): Date {
  const normalized = value.endsWith('Z') ? value : `${value}Z`;
  return dayjs.utc(normalized).toDate();
}

export function getDisplayPeriod(row: CruiseApplicationDto) {
  let start, end;
  if (row.precisePeriodStart && row.precisePeriodEnd) {
    start = parseBackendDateTimeType(row.precisePeriodStart); // we receive date in UTC from backend but without Z on end
    end = parseBackendDateTimeType(row.precisePeriodEnd);
  } else if (row.optimalPeriodBeg && row.optimalPeriodEnd) {
    start = convertPeriodNumberToDate(row.optimalPeriodBeg, row.year);
    end = convertPeriodNumberToDate(row.optimalPeriodEnd, row.year);
  } else if (row.acceptablePeriodBeg && row.acceptablePeriodEnd) {
    start = convertPeriodNumberToDate(row.acceptablePeriodBeg, row.year);
    end = convertPeriodNumberToDate(row.acceptablePeriodEnd, row.year);
  }
  return { start, end };
}
