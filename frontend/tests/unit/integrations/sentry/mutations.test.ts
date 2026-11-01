import * as Sentry from '@sentry/react';
import { CancelledError } from '@tanstack/react-query';
import { notFound, redirect } from '@tanstack/react-router';
import { expect, it, vi } from 'vite-plus/test';
import { ApiError } from '@/api/errors';
import { captureHandledRefusal, classifyError, isUnexplainedFailure } from '@/integrations/sentry/mutations';

vi.mock('@sentry/browser', () => ({ captureException: vi.fn() }));
vi.mock('@sentry/react', async (importOriginal) => ({
  ...(await importOriginal<typeof Sentry>()),
  captureException: vi.fn(),
}));

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
  ['unexplained 404', new ApiError('Żądanie nie powiodło się (HTTP 404)', 404), false],
  ['unexplained 400', new ApiError('Żądanie nie powiodło się (HTTP 400)', 400), true],
  ['proxy 429', new ApiError('Żądanie nie powiodło się (HTTP 429)', 429), true],
  ['422 with field errors', new ApiError('Zła data', 422, { errors: { date: ['Zła data'] } }), false],
  ['wrapped 401', new Error('Session refresh failed', { cause: new ApiError('Sesja wygasła', 401) }), false],
  ['abort', new DOMException('The user aborted a request.', 'AbortError'), false],
] as const)('classifies %s', (_, error, expected) => {
  expect(isUnexplainedFailure(error)).toBe(expected);
});

it.each([
  ['401', new ApiError('Sesja wygasła', 401), 'session'],
  ['403', new ApiError('Brak dostępu', 403), 'no-access'],
  ['404', new ApiError('Nie znaleziono', 404), 'no-access'],
  ['409', new ApiError('Konflikt', 409), 'refused'],
  ['400', new ApiError('Błąd', 400), 'client'],
  ['422', new ApiError('Błąd', 422), 'client'],
  ['429', new ApiError('Za dużo żądań', 429), 'client'],
  ['500', new ApiError('Błąd serwera', 500), 'server'],
  ['router notFound', notFound(), 'control-flow'],
  ['router redirect', redirect({ to: '/' }), 'control-flow'],
  ['abort', new DOMException('Aborted', 'AbortError'), 'aborted'],
  ['query cancel', new CancelledError(), 'aborted'],
  ['network failure', new TypeError('Failed to fetch'), 'network'],
  ['coding error', new TypeError('x is not a function'), 'unknown'],
] as const)('classifies %s as an error kind', (_, error, kind) => {
  expect(classifyError(error)).toBe(kind);
});

it.each([
  ['abort', () => new DOMException('Aborted', 'AbortError'), 'aborted'],
  ['network failure', () => new TypeError('Failed to fetch'), 'network'],
  ['404', () => new ApiError('Nie znaleziono', 404), 'no-access'],
] as const)('classifies a React-reported %s by its original error', (_, makeError, kind) => {
  const error = makeError();
  Sentry.captureReactException(error, { componentStack: '\n    at RouteError' });
  expect((error as Error).cause).toBeInstanceOf(Error);
  expect(classifyError(error)).toBe(kind);
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
  captureHandledRefusal('form-b.draft', new ApiError('Sesja wygasła', 401));
  const calls = vi.mocked(Sentry.captureException).mock.calls;
  expect(calls.map(([error]) => (error as Error).name)).toContain('Handled form-b.submit refusal (HTTP 403)');
  expect(calls.map(([, hint]) => (hint as { fingerprint?: string[] }).fingerprint)).toEqual([
    ['handled-refusal', 'form-b.submit', '403'],
    ['handled-refusal', 'form-b.submit', '400'],
    ['handled-refusal', 'form-b.draft', '403'],
  ]);
  vi.unstubAllGlobals();
});
