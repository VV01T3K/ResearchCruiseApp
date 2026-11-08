import { describe, expect, it } from 'vite-plus/test';

import { formatTime, parseTime } from '@/components/shared/inputs/dates/TimePickerInput';

describe('parseTime', () => {
  it.each([
    ['8', '08:00'],
    ['08', '08:00'],
    ['830', '08:30'],
    ['0830', '08:30'],
    ['8:30', '08:30'],
    ['8.30', '08:30'],
    [' 23:59 ', '23:59'],
  ])('reads %j as %s', (text, expected) => {
    expect(formatTime(parseTime(text)!)).toBe(expected);
  });

  it.each(['', '24', '12:60', '8:3', '12345', 'ab'])('rejects %j', (text) => {
    expect(parseTime(text)).toBeUndefined();
  });
});
