import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { session } from '@tests/data/accounts';

// The boundary is HTTP. Keep the generated client and session implementation real.
vi.mock('@/config', () => ({ default: { apiUrl: 'https://api.test' } }));
const fetchMock = vi.fn<typeof fetch>();
let auth: typeof import('@/integrations/auth/session');
let client: typeof import('@/api/fetch');

beforeEach(async () => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-06-01T12:00:00Z'));
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  auth = await import('@/integrations/auth/session');
  client = await import('@/api/fetch');
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it('coalesces concurrent bootstrap requests into one cookie-backed refresh', async () => {
  const response = Promise.withResolvers<Response>();
  fetchMock.mockReturnValue(response.promise);
  const first = auth.getValidAccessToken();
  const second = auth.getValidAccessToken();
  response.resolve(Response.json(session()));
  await expect(Promise.all([first, second])).resolves.toEqual(['test-access-token', 'test-access-token']);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const [url, options] = fetchMock.mock.calls[0];
  expect(url).toBe('https://api.test/v2/auth/refresh');
  expect(options).toMatchObject({ method: 'POST', credentials: 'include' });
  expect(options?.body).toBeUndefined();
  expect(new Headers(options?.headers).has('Authorization')).toBe(false);
});

it('reuses a valid token and refreshes within the thirty-second expiry margin', async () => {
  auth.setSession(session(60_000));
  await expect(auth.getValidAccessToken()).resolves.toBe('test-access-token');
  expect(fetchMock).not.toHaveBeenCalled();
  vi.advanceTimersByTime(30_000);
  fetchMock.mockResolvedValue(Response.json({ ...session(), accessToken: 'rotated' }));
  await expect(auth.getValidAccessToken()).resolves.toBe('rotated');
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it.each([401, 500])('refresh failure %s clears the session only for unauthorized responses', async (status) => {
  auth.setSession(session());
  fetchMock.mockResolvedValue(new Response(null, { status }));
  await expect(auth.refreshSession()).rejects.toMatchObject({ unauthorized: status === 401 });
  expect(auth.getSession()?.accessToken).toBe(status === 401 ? undefined : 'test-access-token');
});

it.each([401, 204])('keeps a newer session when a pending refresh gets %s for the old cookie', async (status) => {
  auth.setSession(session());
  const response = Promise.withResolvers<Response>();
  fetchMock.mockReturnValue(response.promise);
  const refresh = auth.refreshSession();
  auth.setSession({ ...session(), accessToken: 'other-tab' });
  response.resolve(new Response(null, { status }));
  await expect(refresh).resolves.toMatchObject({ accessToken: 'other-tab' });
  await expect(auth.getValidAccessToken()).resolves.toBe('other-tab');
});

it('waits for an in-flight refresh before completing logout without restoring the session', async () => {
  auth.setSession(session());
  const response = Promise.withResolvers<Response>();
  fetchMock.mockReturnValue(response.promise);
  const refresh = auth.refreshSession();
  let completed = false;
  const logout = auth.prepareForLogout().then(() => {
    completed = true;
  });
  await vi.advanceTimersByTimeAsync(0);
  expect(completed).toBe(false);
  response.resolve(Response.json({ ...session(), accessToken: 'stale' }));
  await logout;
  await expect(refresh).resolves.toBeUndefined();
  auth.completeLogout();
  await expect(auth.getValidAccessToken()).resolves.toBeUndefined();
  expect(auth.getSession()).toBeUndefined();
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it('accepts a concurrent rotation and times out a conflict without losing a valid session', async () => {
  auth.setSession(session());
  fetchMock.mockResolvedValue(new Response(null, { status: 409 }));
  const refresh = auth.refreshSession();
  await vi.advanceTimersByTimeAsync(0);
  auth.setSession({ ...session(), accessToken: 'other-tab' });
  await expect(refresh).resolves.toMatchObject({ accessToken: 'other-tab' });
  fetchMock.mockResolvedValue(new Response(null, { status: 409 }));
  const failed = expect(auth.refreshSession()).rejects.toMatchObject({ unauthorized: false });
  await vi.advanceTimersByTimeAsync(5_000);
  await failed;
  expect(auth.getSession()?.accessToken).toBe('other-tab');
});

it('retries a protected request once with a rotated token and preserves its body', async () => {
  auth.setSession(session());
  const requests: { token: string | null; body: BodyInit | null | undefined }[] = [];
  const responses = [
    new Response(null, { status: 401 }),
    Response.json({ ...session(), accessToken: 'rotated' }),
    Response.json({ saved: true }),
  ];
  fetchMock.mockImplementation(async (_, options) => {
    requests.push({ token: new Headers(options?.headers).get('Authorization'), body: options?.body });
    return responses[requests.length - 1];
  });
  await expect(client.customFetch('/v2/example', { method: 'PUT', body: '{"name":"Ada"}' })).resolves.toEqual({
    saved: true,
  });
  expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
    'https://api.test/v2/example',
    'https://api.test/v2/auth/refresh',
    'https://api.test/v2/example',
  ]);
  expect(requests).toEqual([
    { token: 'Bearer test-access-token', body: '{"name":"Ada"}' },
    { token: null, body: undefined },
    { token: 'Bearer rotated', body: '{"name":"Ada"}' },
  ]);
  const options = fetchMock.mock.calls[2][1];
  expect(options).toMatchObject({ method: 'PUT', body: '{"name":"Ada"}', credentials: 'include' });
  expect(new Headers(options?.headers).get('Authorization')).toBe('Bearer rotated');
});

it('does not loop when the retried request is also unauthorized', async () => {
  auth.setSession(session());
  fetchMock
    .mockResolvedValueOnce(new Response(null, { status: 401 }))
    .mockResolvedValueOnce(Response.json(session()))
    .mockResolvedValueOnce(new Response(null, { status: 401 }));
  await expect(client.customFetch('/v2/example', {})).rejects.toMatchObject({ status: 401 });
  expect(fetchMock).toHaveBeenCalledTimes(3);
});

it('preserves problem details and supports empty success responses', async () => {
  auth.setSession(undefined);
  const problem = {
    detail: 'Support code ABC123',
    errors: { 'Form.SupervisorEmail': ['Rejected'] },
  };
  fetchMock
    .mockResolvedValueOnce(Response.json(problem, { status: 400 }))
    .mockResolvedValueOnce(new Response(null, { status: 204 }));
  await expect(client.customFetch('/v2/example', {})).rejects.toMatchObject({
    status: 400,
    message: 'Support code ABC123\nRejected',
    problem,
  });
  await expect(client.customFetch('/v2/example', {})).resolves.toBeNull();
});

describe('another tab', () => {
  // Node provides BroadcastChannel; the module opens its channel only when it finds one on `window`.
  const channels: BroadcastChannel[] = [];
  class Channel extends BroadcastChannel {
    constructor(name: string) {
      super(name);
      channels.push(this);
    }
  }
  let otherTab: BroadcastChannel;
  const tokensSeen: (string | undefined)[] = [];

  beforeEach(async () => {
    vi.stubGlobal('window', { BroadcastChannel: Channel });
    vi.resetModules();
    auth = await import('@/integrations/auth/session');
    otherTab = new Channel('rca-auth-session');
    tokensSeen.length = 0;
    auth.subscribeAuthDetails((details) => tokensSeen.push(details?.accessToken));
  });
  afterEach(() => {
    channels.splice(0).forEach((channel) => channel.close());
  });

  it('adopts a session it broadcasts', async () => {
    auth.setSession(session());
    otherTab.postMessage({ type: 'session', session: { ...session(), accessToken: 'other-tab' } });
    await vi.waitFor(() => expect(auth.getSession()?.accessToken).toBe('other-tab'));
  });

  it('ignores a session it broadcasts after this tab logged out', async () => {
    auth.setSession(session());
    await auth.prepareForLogout();
    auth.completeLogout();
    tokensSeen.length = 0;
    // Messages from one channel arrive in order, so the logout marks when the late session was handled.
    otherTab.postMessage({ type: 'session', session: { ...session(), accessToken: 'late' } });
    otherTab.postMessage({ type: 'logout' });
    await vi.waitFor(() => expect(tokensSeen).toHaveLength(1));
    expect(tokensSeen).toEqual([undefined]);
    await expect(auth.getValidAccessToken()).resolves.toBeUndefined();
  });
});
