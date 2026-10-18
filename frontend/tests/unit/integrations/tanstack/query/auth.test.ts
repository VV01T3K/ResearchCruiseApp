import { QueryClient } from '@tanstack/react-query';
import { beforeEach, expect, it, vi } from 'vite-plus/test';

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
