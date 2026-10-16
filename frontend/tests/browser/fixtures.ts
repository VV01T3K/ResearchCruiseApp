import { test as base, expect, type Locator, type Request as PlaywrightRequest } from '@playwright/test';
import { defineNetworkFixture, type NetworkFixture } from '@msw/playwright';
import { http, HttpResponse } from 'msw';
import { HttpNetworkFrame } from 'msw/experimental';
import type { CurrentUserResponse } from '@/api/generated/schemas';
import { getRefreshTokensMockHandler } from '@/api/generated/mocks/auth/auth.msw.gen';
import { getGetCurrentUserMockHandler } from '@/api/generated/mocks/users/users.msw.gen';
import {
  getGetApplicationCruiseMockHandler,
  getGetApplicationFormAContextMockHandler,
  getGetApplicationFormAMockHandler,
  getGetApplicationFormBContextMockHandler,
  getGetApplicationFormBMockHandler,
  getGetApplicationFormCMockHandler,
  getGetApplicationManagersMockHandler,
  getGetApplicationsMockHandler,
} from '@/api/generated/mocks/applications/applications.msw.gen';
import { getGetCruiseBlockadesMockHandler } from '@/api/generated/mocks/cruises/cruises.msw.gen';
import { session } from '../data/accounts';
import { application, cruise } from '../data/cruises';
import { formA, formB, formC, formOptions } from '../data/forms';

/** Responds with an HTTP error from inside a generated handler, e.g. `getXMockHandler(fail(503))`. */
export function fail(status: number, problem?: object): () => never {
  return () => {
    throw problem ? HttpResponse.json(problem, { status }) : new HttpResponse(null, { status });
  };
}

type SentRequest = { route: string; body: unknown; query: Record<string, string> };

/** The API requests a test's pages sent, by route such as `'POST /v2/auth/login'`. */
class Requests {
  readonly #sent: SentRequest[] = [];

  record(request: PlaywrightRequest) {
    const { pathname, searchParams } = new URL(request.url());
    if (!pathname.startsWith('/api/')) return;
    const body = request.postData();
    this.#sent.push({
      route: `${request.method()} ${pathname.slice('/api'.length)}`,
      body: body ? JSON.parse(body) : undefined,
      query: Object.fromEntries(searchParams),
    });
  }

  /** Request bodies sent to the route, oldest first. */
  bodies(route: string) {
    return this.#sent.filter((request) => request.route === route).map((request) => request.body);
  }

  /** Query parameters sent to the route, oldest first. */
  queries(route: string) {
    return this.#sent.filter((request) => request.route === route).map((request) => request.query);
  }
}

export const test = base.extend<{
  account: CurrentUserResponse | null;
  network: NetworkFixture;
  requests: Requests;
}>({
  requests: async ({ context }, use) => {
    const requests = new Requests();
    context.on('request', (request) => requests.record(request));
    await use(requests);
  },
  // The signed-in user. Without one, the session refresh is rejected as for a guest.
  account: [null, { option: true }],
  network: [
    async ({ context, baseURL, account }, use) => {
      const unhandled: string[] = [];
      const errors: string[] = [];
      context.on('weberror', (error) => errors.push(error.error().message));
      const network = defineNetworkFixture({
        context,
        handlers: [
          http.get('*/api/health', () => HttpResponse.json({ status: 'ok' })),
          http.get('*/api/version', () => HttpResponse.json('2.5.1')),
          getRefreshTokensMockHandler(account ? session() : fail(401)),
          getGetCurrentUserMockHandler(account ?? fail(401)),
        ],
        // The app's own pages and assets load normally; every API request needs a handler.
        onUnhandledFrame: ({ frame, defaults }) => {
          if (!(frame instanceof HttpNetworkFrame)) return defaults.error();
          const { method, url } = frame.data.request;
          const { origin, pathname, search } = new URL(url);
          if (origin === baseURL && !pathname.startsWith('/api/')) return;
          unhandled.push(`${method} ${pathname}${search}`);
          defaults.error();
        },
      });
      await network.enable();
      await use(network);
      await network.disable();
      expect(unhandled, 'Requests without a handler').toEqual([]);
      expect(errors, 'Uncaught browser errors').toEqual([]);
    },
    { auto: true },
  ],
});

/** Drops a file onto a drop zone. Playwright can set file inputs but has no file drag-and-drop. */
export async function dropFile(target: Locator, file: { name: string; mimeType: string; buffer: Buffer }) {
  const dataTransfer = await target.page().evaluateHandle(
    ({ name, mimeType, bytes }) => {
      const transfer = new DataTransfer();
      transfer.items.add(new File([new Uint8Array(bytes)], name, { type: mimeType }));
      return transfer;
    },
    { name: file.name, mimeType: file.mimeType, bytes: [...file.buffer] }
  );
  await target.dispatchEvent('drop', { dataTransfer });
}

/** One application with forms A, B and C, and everything the form pages load with them. */
export function applicationForms() {
  return [
    getGetApplicationManagersMockHandler([]),
    getGetApplicationsMockHandler({ items: [application()], nextCursor: null }),
    getGetApplicationFormAContextMockHandler(formOptions()),
    getGetApplicationFormBContextMockHandler({ shipEquipments: [] }),
    getGetCruiseBlockadesMockHandler([]),
    getGetApplicationCruiseMockHandler(cruise()),
    getGetApplicationFormAMockHandler(formA()),
    getGetApplicationFormBMockHandler(formB()),
    getGetApplicationFormCMockHandler(formC()),
  ];
}

export { expect };
