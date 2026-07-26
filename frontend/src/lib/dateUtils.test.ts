import { describe, expect, it } from 'vite-plus/test';
import { formatDate, parseBackendDateTime } from './dateUtils';

describe('dateUtils', () => {
  it('preserves dayjs formatting behavior for incomplete form dates', () => {
    expect(formatDate('', 'dateTime')).toBe('Invalid Date');
  });

  it('preserves explicit offsets and treats missing offsets as UTC', () => {
    expect(parseBackendDateTime('2026-07-20T00:00:00+02:00').toISOString()).toBe('2026-07-19T22:00:00.000Z');
    expect(parseBackendDateTime('2026-07-20T00:00:00').toISOString()).toBe('2026-07-20T00:00:00.000Z');
  });
});
