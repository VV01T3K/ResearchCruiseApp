type DateFormat = 'date' | 'dateTime' | 'monthYear';

export function formatDate(value: string | Date, format: DateFormat): string {
  const date = value instanceof Date ? value : new Date(value);
  const options: Intl.DateTimeFormatOptions =
    format === 'monthYear'
      ? { month: '2-digit', year: 'numeric' }
      : format === 'dateTime'
        ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }
        : { day: '2-digit', month: '2-digit', year: 'numeric' };

  return new Intl.DateTimeFormat('pl-PL', options).format(date).replace(', ', ' ');
}
