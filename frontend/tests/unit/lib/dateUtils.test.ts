import { expect, it } from 'vite-plus/test';
import { formatDate, parseBackendDateTime } from '@/lib/dateUtils';

it.each([
  ['2026-07-20T00:00:00', '2026-07-20T00:00:00.000Z'],
  ['2026-07-20T00:00:00Z', '2026-07-20T00:00:00.000Z'],
  ['2026-07-20T00:00:00+02:00', '2026-07-19T22:00:00.000Z'],
])('interprets backend timestamp %s without losing its offset', (input, expected) => {
  expect(parseBackendDateTime(input).toISOString()).toBe(expected);
});
it('formats date-only fields without shifting the calendar day', () => {
  expect(formatDate('2026-07-20', 'date')).toBe('20.07.2026');
  expect(formatDate('2026-07-20', 'monthYear')).toBe('07.2026');
  expect(formatDate('', 'dateTime')).toBe('Invalid Date');
});
