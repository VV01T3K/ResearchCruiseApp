import { expect } from '@playwright/test';

import { API_URL, loginTest as test } from './fixtures/fixtures';

test('rate-limited login shows retry guidance without a toast and allows retry', async ({ loginPage }) => {
  await loginPage.page.route(`${API_URL}/v2/auth/login`, (route) =>
    route.fulfill({
      status: 429,
      json: { title: 'Too Many Requests', detail: 'Wysłano zbyt wiele żądań. Odczekaj chwilę i spróbuj ponownie.' },
    })
  );

  await loginPage.login('test.email@gmail.com', 'someP@ssword');
  await expect(
    loginPage.page.getByText('Wysłano zbyt wiele żądań. Odczekaj chwilę i spróbuj ponownie.', { exact: true })
  ).toBeVisible();
  await expect(loginPage.page.getByTestId('toast-error')).toHaveCount(0, { timeout: 1000 });
  await expect(
    loginPage.page.getByText('Wystąpił błąd podczas logowania. Sprawdź połączenie z internetem.')
  ).toHaveCount(0);

  await loginPage.mockLoginResult('success');
  await loginPage.login('test.email@gmail.com', 'someP@ssword');
  await expect(loginPage.page.getByRole('link', { name: /Nowe zgłoszenie/ })).toBeVisible();
});

test('failed profile loading shows the server reason and allows login retry', async ({ loginPage, page }) => {
  let profileUnavailable = true;
  await page.route(`${API_URL}/v2/users/me`, (route) =>
    profileUnavailable
      ? route.fulfill({ status: 503, json: { detail: 'Profil chwilowo niedostępny' } })
      : route.fallback()
  );
  await page.route(`${API_URL}/v2/auth/logout`, (route) => route.fulfill({ status: 204 }));
  await loginPage.login('test.email@gmail.com', 'someP@ssword');
  await expect(page.getByText('Profil chwilowo niedostępny', { exact: true })).toBeVisible();
  await expect(page.getByTestId('toast-error')).toHaveCount(0);

  profileUnavailable = false;
  await loginPage.login('test.email@gmail.com', 'someP@ssword');
  await expect(page).toHaveURL('/');
});
