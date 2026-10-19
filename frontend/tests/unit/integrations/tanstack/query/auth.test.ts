import { QueryClient } from '@tanstack/react-query';
import { beforeEach, expect, it, vi } from 'vite-plus/test';
import { admin, outsider, session } from '@tests/data/accounts';

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

it('ignores a profile response that arrives after the session ends', async () => {
  const queryClient = new QueryClient();
  const profile = Promise.withResolvers<typeof admin>();
  const fetchProfile = () => profile.promise;
  const pending = queryClient.query({ queryKey: ['v2', 'users', 'me'], queryFn: fetchProfile });
  auth.clearAccountQueries(queryClient);
  profile.resolve(admin);
  await expect(pending).resolves.toBeNull();
  expect(queryClient.getQueryData(['v2', 'users', 'me'])).toBeNull();
});

it('drops the previous account data when the profile belongs to another user', async () => {
  const queryClient = new QueryClient();
  queryClient.setQueryData(['v2', 'users', 'me'], admin);
  queryClient.setQueryData(['v2', 'applications', 'cached'], 'private draft');
  fetchMock.mockImplementation(async (url) => Response.json(String(url).endsWith('/session') ? session() : outsider));
  await expect(queryClient.query({ ...auth.currentUserQueryOptions(), staleTime: 0 })).resolves.toEqual(outsider);
  const cache = queryClient.getQueryCache().getAll();
  expect(cache.map((query) => [query.queryKey, query.state.data])).toEqual([[['v2', 'users', 'me'], outsider]]);
});
