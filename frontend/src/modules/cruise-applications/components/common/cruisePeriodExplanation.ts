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
