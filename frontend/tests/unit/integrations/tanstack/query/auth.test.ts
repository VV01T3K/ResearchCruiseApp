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

it('resolves a signed-out startup to no user with only the session request', async () => {
  fetchMock.mockResolvedValue(Response.json(null));
  await expect(loadCurrentUser()).resolves.toBeNull();
  await expect(loadCurrentUser()).resolves.toBeNull();
  expect(requestedUrls()).toEqual(['https://api.test/v2/auth/session']);
});

it('drops cached and in-flight account data when the session ends', async () => {
  const queryClient = new QueryClient();
  const response = Promise.withResolvers<string>();
  const fetchDraft = () => response.promise;
  queryClient.setQueryData(['v2', 'applications', 'cached'], 'private draft');
  const pending = queryClient.query({ queryKey: ['v2', 'applications', 'pending'], queryFn: fetchDraft });
  auth.clearAccountQueries(queryClient);
  response.resolve('previous account draft');
  await pending.catch(() => {});
  const cache = queryClient.getQueryCache().getAll();
  expect(cache.map((query) => [query.queryKey, query.state.data])).toEqual([[['v2', 'users', 'me'], null]]);
});
