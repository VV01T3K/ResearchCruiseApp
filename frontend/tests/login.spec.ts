import { expect } from '@playwright/test';

import { loginTest as test } from './fixtures/fixtures';

test('login page is accessible', async ({ loginPage }) => {
  await expect(loginPage.page.getByText('Logowanie')).toBeVisible();
});

test('login with valid credentials', async ({ loginPage }) => {
  const userEmail = 'test.email@gmail.com';
  const userPassword = 'someP@ssword';

  await loginPage.login(userEmail, userPassword);

  // Check if the user is redirected to the home page
  await expect(loginPage.page).toHaveURL('/');
});

test('login with invalid credentials', async ({ loginPage }) => {
  const userEmail = 'test.email@gmail.com';
  const userPassword = 'someP@ssword';
  loginPage.mockLoginResult('failure');

  await loginPage.login(userEmail, userPassword);
  await expect(loginPage.incorrectEmailOrPasswordMessage).toBeVisible();
});

test.describe('login form validation', () => {
  [
    { email: 'only-text' },
    { email: 'invalid@domain' },
    { email: 'invalid@domain.' },
    { email: 'invalid@domain..com' },
  ].forEach(({ email }) => {
    test(`enter invalid email [${email}]`, async ({ loginPage }) => {
      await loginPage.emailInput.fill(email);
      await expect(loginPage.invalidEmailMessage).toBeVisible();
      await expect(loginPage.submitButton).toBeDisabled();

      // Message should disappear after correcting the email
      await loginPage.emailInput.fill('valid-email@gmail.com');
      await expect(loginPage.invalidEmailMessage).toBeHidden();
      await expect(loginPage.submitButton).toBeEnabled();
    });
  });
});
