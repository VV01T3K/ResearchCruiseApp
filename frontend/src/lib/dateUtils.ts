import { useSyncExternalStore } from 'react';

type DateFormat = 'date' | 'dateTime' | 'monthYear';

const formatters: Record<DateFormat, Intl.DateTimeFormat> = {
  date: new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }),
  dateTime: new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }),
  monthYear: new Intl.DateTimeFormat('pl-PL', { month: '2-digit', year: 'numeric' }),
};

export function formatDate(value: string | Date, format: DateFormat): string {
  const date =
    value instanceof Date ? value : new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return formatters[format].format(date).replace(', ', ' ');
}

export function parseBackendDateTime(value: string): Date {
  return new Date(/(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? value : `${value}Z`);
}

function subscribeToMinutes(onChange: () => void) {
  const intervalId = setInterval(onChange, 60_000);
  return () => clearInterval(intervalId);
}

export function useNow(select: (now: Date) => number): number {
  const getSnapshot = () => select(new Date());
  return useSyncExternalStore(subscribeToMinutes, getSnapshot, getSnapshot);
}
