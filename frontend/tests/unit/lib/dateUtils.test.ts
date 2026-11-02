import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { parseBackendDateTime, useNow } from '@/lib/dateUtils';

it.each([
  ['2026-07-20T00:00:00', '2026-07-20T00:00:00.000Z'],
  ['2026-07-20T00:00:00Z', '2026-07-20T00:00:00.000Z'],
  ['2026-07-20T00:00:00+02:00', '2026-07-19T22:00:00.000Z'],
  ['2026-07-20', '2026-07-20T00:00:00.000Z'],
])('interprets backend timestamp %s without losing its offset', (input, expected) => {
  expect(parseBackendDateTime(input).toISOString()).toBe(expected);
});
// Date-only values shift a day in only one direction per offset, so check both sides of UTC.
describe.each(['Europe/Warsaw', 'America/Los_Angeles', 'Pacific/Kiritimati'])('in %s', (timeZone) => {
  const original = process.env.TZ;
  let formatDate: typeof import('@/lib/dateUtils').formatDate;
  let parseCalendarDate: typeof import('@/lib/dateUtils').parseCalendarDate;
  let parsePolishDay: typeof import('@/lib/dateUtils').parsePolishDay;
  let toCalendarDateValue: typeof import('@/lib/dateUtils').toCalendarDateValue;
  beforeEach(async () => {
    process.env.TZ = timeZone;
    // The formatters keep the time zone they were created in.
    vi.resetModules();
    ({ formatDate, parseCalendarDate, parsePolishDay, toCalendarDateValue } = await import('@/lib/dateUtils'));
  });
  afterEach(() => {
    process.env.TZ = original;
  });

  it('formats date-only fields without shifting the calendar day', () => {
    expect(formatDate('2026-07-20', 'date')).toBe('20.07.2026');
    expect(formatDate('2026-07-20', 'monthYear')).toBe('07.2026');
  });

  it.each([
    ['2026-03-08', '13:30'],
    ['2026-03-29', '14:30'],
    ['2026-10-25', '13:30'],
    ['2026-11-01', '13:30'],
  ])('shows %s on a DST change day in Polish time', (day, time) => {
    const [year, month, date] = day.split('-');
    expect(formatDate(day, 'date')).toBe(`${date}.${month}.${year}`);
    expect(formatDate(`${day}T12:30:00Z`, 'dateTime')).toBe(`${date}.${month}.${year} ${time}`);
  });

  it.each([
    ['1990-05-05', '1990-05-05'],
    ['1990-05-04T22:00:00.000Z', '1990-05-05'],
    ['2026-01-14T23:00:00.000Z', '2026-01-15'],
    ['2026-07-14T22:00:00', '2026-07-15'],
    ['2026-07-14T21:59:59Z', '2026-07-14'],
    ['2026-01-14T22:59:59Z', '2026-01-14'],
    ['2026-12-31T23:30:00Z', '2027-01-01'],
    ['2026-07-15T00:00:00', '2026-07-15'],
  ])('reads %s as %s', (stored, calendarDate) => {
    expect(toCalendarDateValue(parseCalendarDate(stored))).toBe(calendarDate);
    expect(parsePolishDay(stored).toISOString()).toBe(`${calendarDate}T00:00:00.000Z`);
  });

  it('shows the same time as Poland', () => {
    expect(formatDate('2026-11-02T23:30:00Z', 'dateTime')).toBe('03.11.2026 00:30');
  });
});

it('reads the current time when rendering on the server', () => {
  vi.useFakeTimers({ now: new Date(2026, 11, 31, 23, 59) });
  const html = renderToString(createElement(() => useNow((now) => now.getFullYear())));
  vi.useRealTimers();
  expect(html).toBe('2026');
});
