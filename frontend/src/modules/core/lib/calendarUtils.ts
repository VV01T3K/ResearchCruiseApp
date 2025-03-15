export const weekDays = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

export const shortWeekDays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

export const months = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

export function dateToUtcDay(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDaysInMonth({ month, year }: { month: number; year: number }): Date[] {
  const date = findClosestMondayBefore(new Date(year, month, 1));
  const days = [];
  while (
    month > 0
      ? date.getFullYear() <= year && date.getMonth() <= month
      : date.getFullYear() < year || date.getMonth() < 1
  ) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  while (date.getDay() > 1 || date.getDay() < 1) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function findClosestMondayBefore(date: Date): Date {
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - diff);
}
