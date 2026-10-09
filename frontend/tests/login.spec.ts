import { expect } from '@playwright/test';

import { API_URL, loginTest as test } from './fixtures/fixtures';

test('login page is accessible', async ({ loginPage }) => {
  await expect(loginPage.page.getByTestId('login-page-title')).toBeVisible();
});

test('login with valid credentials', async ({ loginPage }) => {
  const userEmail = 'test.email@gmail.com';
  const userPassword = 'someP@ssword';

  await loginPage.login(userEmail, userPassword);

  // Check if the user is redirected to the home page
  await expect(loginPage.page).toHaveURL('/');
});

test('login redirects to the requested route', async ({ loginPage }) => {
  await loginPage.page.goto('/login?redirect=%2Fhelp');
  await loginPage.login('test.email@gmail.com', 'someP@ssword');

  await expect(loginPage.page).toHaveURL('/help');
});

test('login with invalid credentials shows one error and allows retry', async ({ loginPage }) => {
  const userEmail = 'test.email@gmail.com';
  const userPassword = 'someP@ssword';
  await loginPage.mockLoginResult('failure');

  await loginPage.login(userEmail, userPassword);
  await expect(loginPage.incorrectEmailOrPasswordMessage).toBeVisible();
  await expect(loginPage.page.getByTestId('toast-error')).toHaveCount(0, { timeout: 1000 });

  await loginPage.mockLoginResult('success');
  await loginPage.login(userEmail, userPassword);
  await expect(loginPage.page).toHaveURL('/');
  await expect(loginPage.page.getByRole('link', { name: /Nowe zgłoszenie/ })).toBeVisible();
});

test('successful login revokes the cookie if profile hydration fails', async ({ loginPage }) => {
  await loginPage.page.route(`${API_URL}/v2/users/me`, (route) => route.fulfill({ status: 401 }));
  await loginPage.page.route(`${API_URL}/v2/auth/logout`, (route) => route.fulfill({ status: 204 }));
  const logoutRequest = loginPage.page.waitForRequest(`${API_URL}/v2/auth/logout`);

  await loginPage.login('test.email@gmail.com', 'someP@ssword');

  expect((await logoutRequest).method()).toBe('POST');
  await expect(loginPage.page.getByText('Nie udało się wczytać profilu konta.')).toBeVisible();
});

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
