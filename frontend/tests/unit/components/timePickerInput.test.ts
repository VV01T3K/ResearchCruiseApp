import { describe, expect, it } from 'vite-plus/test';

import { typeDigit } from '@/components/shared/inputs/dates/TimePickerInput';

describe('typeDigit', () => {
  it.each([
    ['', '0', 23, 0, false],
    ['0', '8', 23, 8, true],
    ['', '9', 23, 9, true],
    ['', '2', 23, 2, false],
    ['2', '3', 23, 23, true],
    ['2', '5', 23, 5, true],
    ['', '5', 59, 5, false],
    ['5', '9', 59, 59, true],
    ['', '7', 59, 7, true],
  ])('typed %j then %s (max %i) gives %i, done %s', (typed, digit, limit, value, done) => {
    expect(typeDigit(typed, digit, limit)).toEqual({ value, done });
  });
});
