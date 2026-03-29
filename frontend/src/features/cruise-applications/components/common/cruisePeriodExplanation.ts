function getPointAtTime(position: number): string {
  const pointAtTimeMonths = [
    'stycznia',
    'lutego',
    'marca',
    'kwietnia',
    'maja',
    'czerwca',
    'lipca',
    'sierpnia',
    'września',
    'października',
    'listopada',
    'grudnia',
  ];

  const week = position % 2 == 0 ? '1. połowy' : '2. połowy';
  const month = pointAtTimeMonths[Math.floor(position / 2)];
  return `${week} ${month}`;
}

export function getExplanationForPeriod(start: number, end: number): string {
  if (start === 0 && end === 24) {
    return 'Cały rok';
  }

  return `od początku ${getPointAtTime(start)} do końca ${getPointAtTime(end - 1)}`;
}

export function formatLocalDateStringFromUtcString(utcString?: string): string {
  if (!utcString) {
    return '-';
  }
  const normalized = utcString.endsWith('Z') ? utcString : `${utcString}Z`;
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return '-';

  return date.toLocaleString('pl-PL', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
