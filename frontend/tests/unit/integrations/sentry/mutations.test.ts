import { expect, it } from 'vite-plus/test';
import { ApiError } from '@/api/errors';
import { isUnexplainedFailure } from '@/integrations/sentry/mutations';

it.each([
  ['network rejection', new TypeError('Failed to fetch'), true],
  ['wrapped network rejection', new Error('Session refresh failed', { cause: new TypeError('Failed to fetch') }), true],
  ['proxy 502', new ApiError('Błąd serwera (502)', 502), true],
  ['proxy 503', new ApiError('Błąd serwera (503)', 503, {}), true],
  ['proxy 504', new ApiError('Błąd serwera (504)', 504), true],
  ['unexplained 500', new ApiError('Błąd serwera (500)', 500, { detail: ' ' }), true],
  ['unexpected exception', new Error('boom'), true],
  [
    '500 with generic fallback detail',
    new ApiError('Wystąpił błąd serwera.', 500, { detail: 'Wystąpił błąd serwera.' }),
    true,
  ],
  [
    '500 with support code',
    new ApiError('Kod błędu: 0HN1', 500, { detail: 'Kod błędu: 0HN1', errorCode: '0HN1' } as never),
    false,
  ],
  ['500 with field errors', new ApiError('Zły plik', 500, { errors: { file: ['Zły plik'] } }), false],
  ['unexplained 4xx', new ApiError('Żądanie nie powiodło się (HTTP 404)', 404), false],
  ['wrapped 401', new Error('Session refresh failed', { cause: new ApiError('Sesja wygasła', 401) }), false],
  ['abort', new DOMException('The user aborted a request.', 'AbortError'), false],
] as const)('classifies %s', (_, error, expected) => {
  expect(isUnexplainedFailure(error)).toBe(expected);
});
