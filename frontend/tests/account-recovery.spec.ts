import { expect, Page } from '@playwright/test';

import { API_URL, test } from './fixtures/fixtures';
import { getAdminAccountPayload, mockAuthenticatedSession } from './fixtures/mockPayloads';

async function seedAuthenticatedUser(page: Page, emailConfirmed = true) {
  await mockAuthenticatedSession(page);
  await page.route(`${API_URL}/v2/users/me`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ ...getAdminAccountPayload(), emailConfirmed }),
      contentType: 'application/json',
    });
  });
}

test('resend confirmation uses the v2 auth route', async ({ page }) => {
  let requestBody: unknown;
  await seedAuthenticatedUser(page, false);
  await page.route(`${API_URL}/v2/auth/resend-confirmation-email`, async (route) => {
    requestBody = route.request().postDataJSON();
    await route.fulfill({ status: 204 });
  });

  await page.goto('/account-settings');
  await page.getByRole('button', { name: 'Wyślij ponownie' }).click();

  await expect(page.getByText('Wiadomość potwierdzająca została wysłana ponownie')).toBeVisible();
  expect(requestBody).toEqual({ email: getAdminAccountPayload().email });
});

async function fillRegistration(page: Page) {
  await page.goto('/register');
  await page.getByLabel('E-mail').fill('person@example.com');
  await page.getByLabel('Imię').fill('Ada');
  await page.getByLabel('Nazwisko').fill('Lovelace');
  await page.getByLabel('Hasło', { exact: true }).fill('Password1');
  await page.getByLabel('Potwierdź hasło').fill('Password1');
}

test('registration sends only the account fields', async ({ page }) => {
  let requestBody: unknown;
  await page.route(`${API_URL}/v2/auth/register`, async (route) => {
    requestBody = route.request().postDataJSON();
    await route.fulfill({ status: 204 });
  });

  await fillRegistration(page);
  await page.getByRole('button', { name: 'Zarejestruj się' }).click();

  await expect(page).toHaveURL(/\/login$/);
  expect(requestBody).toEqual({
    email: 'person@example.com',
    firstName: 'Ada',
    lastName: 'Lovelace',
    password: 'Password1',
  });
});

test('failed registration reports the reason once and allows retry', async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on('pageerror', (error) => pageErrors.push(error));
  await page.route(`${API_URL}/v2/auth/register`, (route) =>
    route.fulfill({ status: 409, json: { detail: 'Username is already taken.' } })
  );

  await fillRegistration(page);
  await page.getByRole('button', { name: 'Zarejestruj się' }).click();

  await expect(page.getByTestId('toast-error')).toHaveCount(1);
  await expect(page.getByTestId('toast-error')).toContainText('Username is already taken.');
  await expect(page.getByText('Podany adres e-mail jest już zajęty.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Zarejestruj się' })).toBeEnabled();
  expect(pageErrors).toEqual([]);
});

test('forgot password uses the v2 reset-request route', async ({ page }) => {
  let requestBody: unknown;
  await page.route(`${API_URL}/v2/auth/password-reset-request`, async (route) => {
    requestBody = route.request().postDataJSON();
    await route.fulfill({ status: 204 });
  });

  await page.goto('/forgot-password');
  await page.getByLabel('E-mail').fill('person@example.com');
  await page.getByRole('button', { name: 'Przypomnij hasło' }).click();

  await expect(page.getByText(/Link do resetowania hasła został wysłany/)).toBeVisible();
  expect(requestBody).toEqual({ email: 'person@example.com' });
});

test('reset password uses the v2 reset route', async ({ page }) => {
  let requestBody: unknown;
  await page.route(`${API_URL}/v2/auth/password-reset`, async (route) => {
    requestBody = route.request().postDataJSON();
    await route.fulfill({ status: 204 });
  });

  await page.goto('/reset-password?emailBase64=email-token&resetCode=reset-token');
  await page.getByRole('textbox', { name: 'Hasło', exact: true }).fill('StrongPass1');
  await page.getByRole('textbox', { name: 'Potwierdź hasło' }).fill('StrongPass1');
  await page.getByRole('button', { name: 'Zmień hasło' }).click();

  await expect(page.getByText('Hasło zostało zmienione')).toBeVisible();
  expect(requestBody).toEqual({
    emailBase64: 'email-token',
    resetCode: 'reset-token',
    password: 'StrongPass1',
    passwordConfirm: 'StrongPass1',
  });
});

test('change password uses the v2 current-user route', async ({ page }) => {
  let requestBody: unknown;
  await seedAuthenticatedUser(page);
  await page.route(`${API_URL}/v2/users/me/password`, async (route) => {
    requestBody = route.request().postDataJSON();
    await route.fulfill({ status: 204 });
  });

  await page.goto('/account-settings');
  await page.locator('input[name="password"]').fill('CurrentPass1');
  await page.locator('input[name="newPassword"]').fill('NewStrongPass1');
  await page.locator('input[name="repeatedNewPassword"]').fill('NewStrongPass1');
  await page.getByRole('button', { name: 'Zmień hasło' }).click();

  await expect(page.getByText('Hasło zostało zmienione')).toBeVisible();
  expect(requestBody).toEqual({
    password: 'CurrentPass1',
    newPassword: 'NewStrongPass1',
  });
});
