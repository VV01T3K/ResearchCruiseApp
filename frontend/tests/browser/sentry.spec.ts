import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { admin } from '../data/accounts';

async function captureEnvelopes(page: Page) {
  await page.route('/runtime-config.js', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `window.__SENTRY_DSN__ = 'https://key@sentry.invalid/1';
        window.__SENTRY_PROXY__ = '/monitoring';
        window.__SENTRY_TRACES_SAMPLE_RATE__ = '1';`,
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
});
