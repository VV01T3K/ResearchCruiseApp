import { expect } from '@playwright/test';

import { API_URL, test } from './fixtures/fixtures';

const userId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const code = 'confirmation-code';

test('confirm email uses the v2 route and renders success', async ({ page }) => {
  let requestUrl = '';
  await page.route(`${API_URL}/v2/account/confirm-email?*`, async (route) => {
    requestUrl = route.request().url();
    await route.fulfill({ status: 204 });
  });

  await page.goto(`/confirm-email?userId=${userId}&code=${code}`);

  await expect(page.getByText('Email został potwierdzony')).toBeVisible();
  expect(requestUrl).toContain('/v2/account/confirm-email?');
  expect(requestUrl).toContain(`userId=${userId}`);
  expect(requestUrl).toContain(`code=${code}`);
});

test('confirm email keeps the existing error state on failure', async ({ page }) => {
  await page.route(`${API_URL}/v2/account/confirm-email?*`, (route) => {
    route.fulfill({
      status: 401,
      body: JSON.stringify({
        title: 'Authentication failed.',
        status: 401,
      }),
      contentType: 'application/problem+json',
    });
  });

  await page.goto(`/confirm-email?userId=${userId}&code=${code}`);

  await expect(page.getByRole('heading', { name: 'Błąd podczas potwierdzania emaila' })).toBeVisible();
});
