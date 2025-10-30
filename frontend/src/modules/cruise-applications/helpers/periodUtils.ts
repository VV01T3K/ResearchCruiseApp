import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { CruiseApplicationDto } from '../models/CruiseApplicationDto';

export function convertPeriodNumberToDate(periodNumber: string, year: number): Date {
  const num = parseInt(periodNumber);
  const startDay = num % 2 === 0 ? 1 : 15;
  const startMonth = Math.floor(num / 2) + 1;
  return new Date(year, startMonth - 1, startDay, 8, 0, 0);
}

function parseBackendDateTimeType(value: string): Date{
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
