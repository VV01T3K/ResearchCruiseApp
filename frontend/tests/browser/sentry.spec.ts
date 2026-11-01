import type { Page } from '@playwright/test';
import {
  getGetApplicationManagersMockHandler,
  getGetApplicationsForCruisePlanningMockHandler,
  getGetApplicationsMockHandler,
} from '@/api/generated/mocks/applications/applications.msw.gen';
import { getGetCruisesMockHandler } from '@/api/generated/mocks/cruises/cruises.msw.gen';
import { getGetAvailableCruiseManagersMockHandler } from '@/api/generated/mocks/users/users.msw.gen';
import { test, expect, fail } from './fixtures';
import { admin } from '../data/accounts';

async function captureEnvelopes(page: Page, replayRate = '') {
  await page.route('/runtime-config.js', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `window.__SENTRY_DSN__ = 'https://key@sentry.invalid/1';
        window.__SENTRY_PROXY__ = '/monitoring';
        window.__SENTRY_TRACES_SAMPLE_RATE__ = '1';
        window.__SENTRY_REPLAYS_SESSION_SAMPLE_RATE__ = '${replayRate}';`,
    })
  );
  const envelopes: string[] = [];
  await page.route('/monitoring', (route) => {
    envelopes.push(route.request().postData() ?? '');
    return route.fulfill({ status: 200 });
  });
  return () => envelopes.join('\n');
}

test('reset tokens in the page URL never reach Sentry', async ({ page }) => {
  const sent = await captureEnvelopes(page);

  await page.goto('/reset-password?emailBase64=YUBi&resetCode=SECRET');

  await expect.poll(sent).toContain('"type":"span"');
  expect(sent()).toContain('resetCode=[Filtered]');
  expect(sent()).not.toContain('SECRET');
});

test.describe('signed in', () => {
  test.use({ account: admin });

  test('spans carry the user roles', async ({ page }) => {
    const sent = await captureEnvelopes(page);

    await page.goto('/help');

    await expect.poll(sent).toContain('"user.multiple_roles":{"value":true,"type":"boolean"}');
  });

  test('one click closes the feedback form while its description is empty', async ({ page }) => {
    await captureEnvelopes(page);
    await page.goto('/help');
    await page.getByRole('main').getByRole('button', { name: 'Zgłoś problem' }).click();
    const dialog = page.getByRole('dialog', { name: 'Zgłoś problem' });
    await expect(dialog.getByRole('textbox')).toBeFocused();

    await dialog.getByRole('button', { name: 'Zamknij' }).click();

    await expect(dialog).toBeHidden();
  });

  for (const [replayRate, replayed] of [
    ['', false],
    ['garbage', false],
    ['0', false],
    ['1.5', false],
    ['1', true],
  ] as const) {
    test(`replay sample rate '${replayRate}' ${replayed ? 'sends' : 'never sends'} replays`, async ({ page }) => {
      const sent = await captureEnvelopes(page, replayRate);
      await page.goto('/help');
      await page.getByRole('main').getByRole('button', { name: 'Zgłoś problem' }).click();
      const dialog = page.getByRole('dialog', { name: 'Zgłoś problem' });
      await dialog.getByRole('textbox').fill('Replay check');
      await dialog.getByRole('button', { name: 'Wyślij zgłoszenie' }).click();

      await expect.poll(sent).toContain('Replay check');
      if (replayed) await expect.poll(sent).toContain('"type":"replay_event"');
      else expect(sent()).not.toContain('replay_');
    });
  }

  for (const [name, path, handler] of [
    ['a coded 500', '/cruises/new', getGetAvailableCruiseManagersMockHandler(fail(500, { errorCode: '0HN1' }))],
    [
      'a 422 with field errors',
      '/cruises/new',
      getGetAvailableCruiseManagersMockHandler(fail(422, { errors: { role: ['Zła rola'] } })),
    ],
    ['a list load that throws to the error page', '/applications', getGetApplicationsMockHandler(fail(500))],
  ] as const) {
    test(`${name} from a query is reported once`, async ({ page, network }) => {
      const sent = await captureEnvelopes(page);
      network.use(
        getGetCruisesMockHandler([]),
        getGetApplicationsForCruisePlanningMockHandler([]),
        getGetApplicationManagersMockHandler([]),
        handler
      );
      await page.goto(path);

      await expect.poll(() => sent().split('"type":"event"').length - 1).toBe(1);
      await page.waitForTimeout(1000);
      expect(sent().split('"type":"event"').length - 1).toBe(1);
    });
  }

  test('the error page mentions the automatic report only for a reported failure', async ({ page, network }) => {
    await captureEnvelopes(page);
    const notice = page.getByText(/automatycznie zgłoszony.*Zgłoś problem/);
    network.use(getGetApplicationManagersMockHandler([]), getGetApplicationsMockHandler(fail(500)));
    await page.goto('/applications');
    await expect(notice).toBeVisible();

    network.use(getGetApplicationsMockHandler(fail(404)));
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Nie znaleziono lub brak dostępu' })).toBeVisible();
    await expect(page.getByText(/automatycznie zgłoszony/)).toBeHidden();
  });
});
