import { beforeEach, expect, test, vi } from 'vitest';

import { apiFetch, refreshAuth } from './fetch';
import { ImportPublicationRequest } from './generated/model';
import { ApiContractError, validateRequest } from './validateRequest';
import { AUTH_DETAILS_CHANGED_EVENT } from '@/providers/StoredAuthDetails';

vi.mock('@/config', () => ({ default: { apiUrl: 'http://api.test/' } }));
const captureException = vi.hoisted(() => vi.fn());
vi.mock('@sentry/react', () => ({ captureException }));

beforeEach(() => {
  vi.clearAllMocks();
  const values = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  });
  localStorage.setItem(
    'authDetails',
    JSON.stringify({
      accessToken: 'old',
      refreshToken: 'refresh',
      accessTokenExpirationDate: new Date(Date.now() + 60_000),
      refreshTokenExpirationDate: new Date(Date.now() + 60_000),
    })
  );
  vi.stubGlobal('window', { dispatchEvent: vi.fn() });
});

test('explicit refresh and concurrent 401 responses share one refresh', async () => {
  let refreshes = 0;
  let initialRequests = 0;
  let retriedRequests = 0;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: URL | RequestInfo, init?: RequestInit) => {
      if (input.toString().endsWith('/v2/auth/refresh')) {
        refreshes += 1;
        return Response.json({
          accessToken: 'new',
          refreshToken: 'new-refresh',
          accessTokenExpirationDate: new Date(Date.now() + 60_000).toISOString(),
          refreshTokenExpirationDate: new Date(Date.now() + 60_000).toISOString(),
        });
      }

      if (new Headers(init?.headers).get('Authorization') === 'Bearer new') {
        retriedRequests += 1;
        return Response.json({ ok: true });
      }

      initialRequests += 1;
      return Response.json({}, { status: 401 });
    })
  );

  await Promise.all([refreshAuth(), apiFetch('/v2/account/publications'), apiFetch('/v2/account/publications')]);

  expect(refreshes).toBe(1);
  expect(initialRequests).toBe(2);
  expect(retriedRequests).toBe(2);
});

test('generated request schema blocks malformed publication imports', () => {
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);

  expect(() =>
    validateRequest('import-publications', ImportPublicationRequest.array(), [{ title: 'secret value' }])
  ).toThrow(ApiContractError);
  expect(fetchMock).not.toHaveBeenCalled();
  expect(captureException).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Generated API request validation failed: import-publications' })
  );
  expect(JSON.stringify(captureException.mock.calls)).not.toContain('secret value');
});

test('failed refresh clears the session', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: URL | RequestInfo) =>
      input.toString().endsWith('/v2/auth/refresh')
        ? Response.json({}, { status: 401 })
        : Response.json({}, { status: 401 })
    )
  );

  await expect(apiFetch('/v2/account/me')).rejects.toMatchObject({ status: 401 });
  expect(localStorage.getItem('authDetails')).toBeNull();
  expect(window.dispatchEvent).toHaveBeenCalledWith(
    expect.objectContaining({ type: AUTH_DETAILS_CHANGED_EVENT, detail: null })
  );
});
