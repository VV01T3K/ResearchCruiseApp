import { test as base, expect, type Route } from '@playwright/test';
import type { CurrentUserResponse } from '@/api/generated/schemas';
import { session } from '../data/accounts';

type Api = (method: string, path: string, handler: (route: Route) => Promise<void>) => Promise<void>;

export const test = base.extend<{
  account: CurrentUserResponse | null;
  api: Api;
  network: void;
}>({
  account: [null, { option: true }],
  api: async ({ context, baseURL }, use) => {
    await use(async (method, path, handler) => {
      await context.route(`${baseURL}/api${path}`, (route) =>
        route.request().method() === method ? handler(route) : route.fallback()
      );
    });
  },
  network: [
    async ({ context, baseURL, api, account }, use) => {
      const unexpected: string[] = [];
      const errors: string[] = [];
      context.on('weberror', (error) => errors.push(error.error().message));
      await context.route('**/*', async (route) => {
        const url = new URL(route.request().url());
        if (url.origin === baseURL && !url.pathname.startsWith('/api/')) return route.continue();
        unexpected.push(`${route.request().method()} ${url.pathname}${url.search}`);
        await route.abort('blockedbyclient');
      });
      await api('GET', '/health', (route) => route.fulfill({ json: { status: 'ok' } }));
      await api('GET', '/version', (route) => route.fulfill({ json: '2.5.1' }));
      await api('POST', '/v2/auth/refresh', (route) => route.fulfill(account ? { json: session() } : { status: 401 }));
      await api('GET', '/v2/users/me', (route) => route.fulfill(account ? { json: account } : { status: 401 }));
      await use();
      expect(unexpected, 'Every API request needs an explicit method and response').toEqual([]);
      expect(errors, 'Uncaught browser errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
