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

test('login with invalid credentials', async ({ loginPage }) => {
  const userEmail = 'test.email@gmail.com';
  const userPassword = 'someP@ssword';
  loginPage.mockLoginResult('failure');

  await loginPage.login(userEmail, userPassword);
  await expect(loginPage.incorrectEmailOrPasswordMessage).toBeVisible();
});

test('successful login revokes the cookie if profile hydration fails', async ({ loginPage }) => {
  await loginPage.page.route(`${API_URL}/v2/users/me`, (route) => route.fulfill({ status: 401 }));
  await loginPage.page.route(`${API_URL}/v2/auth/logout`, (route) => route.fulfill({ status: 204 }));
  const logoutRequest = loginPage.page.waitForRequest(`${API_URL}/v2/auth/logout`);

  await loginPage.login('test.email@gmail.com', 'someP@ssword');

  expect((await logoutRequest).method()).toBe('POST');
  await expect(
    loginPage.page.getByText('Wystąpił błąd podczas logowania. Sprawdź połączenie z internetem.')
  ).toBeVisible();
});
