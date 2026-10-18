import { QueryClient } from '@tanstack/react-query';
import { beforeEach, expect, it, vi } from 'vite-plus/test';
import { admin, session } from '@tests/data/accounts';

vi.mock('@/config', () => ({ default: { apiUrl: 'https://api.test' } }));
const fetchMock = vi.fn<typeof fetch>();
let auth: typeof import('@/integrations/tanstack/query/auth');

beforeEach(async () => {
  vi.resetModules();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  auth = await import('@/integrations/tanstack/query/auth');
  return () => vi.unstubAllGlobals();
});

const loadCurrentUser = () => new QueryClient().query({ ...auth.currentUserQueryOptions(), retry: false });
const requestedUrls = () => fetchMock.mock.calls.map(([url]) => url);

it('resolves a signed-out startup to no user with only a successful refresh probe', async () => {
  fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
  await expect(loadCurrentUser()).resolves.toBeNull();
  await expect(loadCurrentUser()).resolves.toBeNull();
  expect(requestedUrls()).toEqual(['https://api.test/v2/auth/refresh']);
});

it('restores a session from the refresh cookie after a reload', async () => {
  fetchMock.mockResolvedValueOnce(Response.json(session())).mockResolvedValueOnce(Response.json(admin));
  await expect(loadCurrentUser()).resolves.toEqual(admin);
  expect(requestedUrls()).toEqual(['https://api.test/v2/auth/refresh', 'https://api.test/v2/users/me']);
  expect(new Headers(fetchMock.mock.calls[1][1]?.headers).get('Authorization')).toBe('Bearer test-access-token');
});

it('treats a rejected refresh cookie as signed out without retrying it', async () => {
  fetchMock.mockResolvedValue(new Response(null, { status: 401 }));
  await expect(loadCurrentUser()).resolves.toBeNull();
  await expect(loadCurrentUser()).resolves.toBeNull();
  expect(requestedUrls()).toEqual(['https://api.test/v2/auth/refresh']);
});
