import { useSyncExternalStore } from 'react';

type DateFormat = 'date' | 'dateTime' | 'monthYear';

const timeZone = 'Europe/Warsaw';

const formatters: Record<DateFormat, Intl.DateTimeFormat> = {
  date: new Intl.DateTimeFormat('pl-PL', { timeZone, day: '2-digit', month: '2-digit', year: 'numeric' }),
  dateTime: new Intl.DateTimeFormat('pl-PL', {
    timeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }),
  monthYear: new Intl.DateTimeFormat('pl-PL', { timeZone, month: '2-digit', year: 'numeric' }),
};

const calendarDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatDate(value: string | Date, format: DateFormat): string {
  const date = value instanceof Date ? value : parseBackendDateTime(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return formatters[format].format(date).replace(', ', ' ');
}

export function parseBackendDateTime(value: string): Date {
  return new Date(/(?:Z|[+-]\d{2}:\d{2}|^\d{4}-\d{2}-\d{2})$/i.test(value) ? value : `${value}Z`);
}

export function parsePolishDay(value: string): Date {
  const date = parseBackendDateTime(value);
  return Number.isNaN(date.getTime()) ? date : new Date(calendarDateFormatter.format(date));
}

export function parseCalendarDate(value: string): Date {
  const day = parsePolishDay(value);
  return Number.isNaN(day.getTime()) ? day : new Date(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate());
}

export function toCalendarDateValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function subscribeToMinutes(onChange: () => void) {
  const intervalId = setInterval(onChange, 60_000);
  return () => clearInterval(intervalId);
}

export function useNow(select: (now: Date) => number): number {
  const getSnapshot = () => select(new Date());
  return useSyncExternalStore(subscribeToMinutes, getSnapshot, getSnapshot);
}
