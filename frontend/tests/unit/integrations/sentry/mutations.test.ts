import * as Sentry from '@sentry/react';
import { expect, it, vi } from 'vite-plus/test';
import { ApiError } from '@/api/errors';
import { captureHandledRefusal, isUnexplainedFailure } from '@/integrations/sentry/mutations';

vi.mock('@sentry/react', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}));

it.each([
  ['network rejection', new TypeError('Failed to fetch'), true],
  [
    'wrapped network rejection',
    new Error('Session refresh failed', {
      cause: new TypeError('Failed to fetch'),
    }),
    true,
  ],
  ['proxy 502', new ApiError('Błąd serwera (502)', 502), true],
  ['proxy 503', new ApiError('Błąd serwera (503)', 503, {}), true],
  ['proxy 504', new ApiError('Błąd serwera (504)', 504), true],
  ['unexplained 500', new ApiError('Błąd serwera (500)', 500, { detail: ' ' }), true],
  ['unexpected exception', new Error('boom'), true],
  [
    '500 with generic fallback detail',
    new ApiError('Wystąpił błąd serwera.', 500, {
      detail: 'Wystąpił błąd serwera.',
    }),
    true,
  ],
  [
    '500 with support code',
    new ApiError('Kod błędu: 0HN1', 500, {
      detail: 'Kod błędu: 0HN1',
      errorCode: '0HN1',
    } as never),
    false,
  ],
  ['500 with field errors', new ApiError('Zły plik', 500, { errors: { file: ['Zły plik'] } }), false],
  ['unexplained 4xx', new ApiError('Żądanie nie powiodło się (HTTP 404)', 404), false],
  [
    'wrapped 401',
    new Error('Session refresh failed', {
      cause: new ApiError('Sesja wygasła', 401),
    }),
    false,
  ],
  ['abort', new DOMException('The user aborted a request.', 'AbortError'), false],
] as const)('classifies %s', (_, error, expected) => {
  expect(isUnexplainedFailure(error)).toBe(expected);
});

it('reports each handled refusal once per operation and status in a session', () => {
  const storage = new Map<string, string>();
  vi.stubGlobal('sessionStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
  captureHandledRefusal('form-b.submit', new ApiError('Obecnie nie można przesłać formularza B.', 403));
  captureHandledRefusal('form-b.submit', new ApiError('Inny komunikat', 403));
  captureHandledRefusal('form-b.submit', new ApiError('Błąd walidacji', 400));
  captureHandledRefusal('form-b.draft', new ApiError('Obecnie nie można przesłać formularza B.', 403));
  captureHandledRefusal('form-b.submit', new ApiError('Błąd serwera (502)', 502));
  expect(
    vi.mocked(Sentry.captureMessage).mock.calls.map(([, hint]) => (hint as { fingerprint?: string[] }).fingerprint)
  ).toEqual([
    ['handled-refusal', 'form-b.submit', '403'],
    ['handled-refusal', 'form-b.submit', '400'],
    ['handled-refusal', 'form-b.draft', '403'],
  ]);
  vi.unstubAllGlobals();
});

it('keeps the refusal limit when session storage throws', () => {
  vi.mocked(Sentry.captureMessage).mockClear();
  vi.stubGlobal('sessionStorage', {
    getItem: () => {
      throw new DOMException('Blocked', 'SecurityError');
    },
    setItem: () => {
      throw new DOMException('Full', 'QuotaExceededError');
    },
  });
  captureHandledRefusal('form-b.blocked', new ApiError('Odmowa', 403));
  captureHandledRefusal('form-b.blocked', new ApiError('Odmowa', 403));
  vi.stubGlobal('sessionStorage', {
    getItem: () => null,
    setItem: () => {
      throw new DOMException('Full', 'QuotaExceededError');
    },
  });
  captureHandledRefusal('form-b.quota', new ApiError('Odmowa', 403));
  captureHandledRefusal('form-b.quota', new ApiError('Odmowa', 403));
  expect(vi.mocked(Sentry.captureMessage)).toHaveBeenCalledTimes(2);
  vi.unstubAllGlobals();
});
