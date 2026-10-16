import { test, expect } from './fixtures';
import { admin, session } from '../data/accounts';

test('login returns to the requested page and logout removes access', async ({ page, api }) => {
  let loggedIn = false;
  await api('GET', '/v2/users/me', (route) => route.fulfill(loggedIn ? { json: admin } : { status: 401 }));
  await api('POST', '/v2/auth/login', async (route) => {
    expect(route.request().postDataJSON()).toEqual({ email: admin.email, password: 'Password1!' });
    loggedIn = true;
    await route.fulfill({ json: session() });
  });
  await api('POST', '/v2/auth/logout', async (route) => {
    loggedIn = false;
    await route.fulfill({ status: 204 });
  });
  await page.goto('/login?redirect=%2Fhelp');
  await page.getByLabel('E-mail').fill(admin.email);
  await page.getByLabel('Hasło', { exact: true }).fill('Password1!');
  await page.getByRole('button', { name: 'Zaloguj', exact: true }).click();
  await expect(page).toHaveURL('/help');
  await page.getByTestId('sign-out-btn').click();
  await expect.poll(() => loggedIn).toBe(false);
  await page.goto('/user-management');
  await expect(page).toHaveURL(/\/login/);
  expect(await page.evaluate(() => localStorage.getItem('authDetails'))).toBeNull();
});

test('rejected login explains the error and permits another attempt', async ({ page, api }) => {
  let attempts = 0;
  await api('GET', '/v2/users/me', (route) => route.fulfill(attempts > 1 ? { json: admin } : { status: 401 }));
  await api('POST', '/v2/auth/login', (route) => {
    attempts++;
    return route.fulfill(
      attempts === 1 ? { status: 401, json: { detail: 'Nieprawidłowe dane logowania' } } : { json: session() }
    );
  });
  await page.goto('/login');
  await page.getByLabel('E-mail').fill(admin.email);
  await page.getByLabel('Hasło', { exact: true }).fill('wrong-password');
  await page.getByRole('button', { name: 'Zaloguj', exact: true }).click();
  await expect(page.getByText('Nieprawidłowe dane logowania')).toBeVisible();
  await expect(page.getByTestId('toast-error')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Zaloguj', exact: true })).toBeEnabled();
  await expect(page).toHaveURL('/login');
  await page.getByLabel('Hasło', { exact: true }).fill('Password1!');
  await page.getByRole('button', { name: 'Zaloguj', exact: true }).click();
  await expect(page).toHaveURL('/');
  expect(attempts).toBe(2);
});

test('a successful login with an unavailable profile revokes the session', async ({ page, api }) => {
  let revoked = false;
  await api('POST', '/v2/auth/login', (route) => route.fulfill({ json: session() }));
  await api('POST', '/v2/auth/logout', async (route) => {
    revoked = true;
    await route.fulfill({ status: 204 });
  });
  await page.goto('/login');
  await page.getByLabel('E-mail').fill(admin.email);
  await page.getByLabel('Hasło', { exact: true }).fill('Password1!');
  await page.getByRole('button', { name: 'Zaloguj', exact: true }).click();
  await expect(page.getByText('Nie udało się wczytać profilu konta.')).toBeVisible();
  expect(revoked).toBe(true);
});

test.describe('authenticated session', () => {
  test.use({ account: admin });

  test('reload restores access through refresh without persisting the token in localStorage', async ({ page, api }) => {
    let refreshes = 0;
    await api('POST', '/v2/auth/refresh', async (route) => {
      refreshes++;
      expect(route.request().postData()).toBeNull();
      await route.fulfill({ json: session() });
    });
    await api('GET', '/v2/users', (route) => route.fulfill({ json: [] }));
    await page.goto('/user-management');
    await expect(page.getByRole('button', { name: 'Dodaj użytkownika' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('button', { name: 'Dodaj użytkownika' })).toBeVisible();
    expect(refreshes).toBe(2);
    expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('test-access-token');
  });

  test('logout propagates between real tabs', async ({ page, context, api }) => {
    await api('GET', '/v2/users', (route) => route.fulfill({ json: [] }));
    await api('POST', '/v2/auth/logout', (route) => route.fulfill({ status: 204 }));
    await page.goto('/user-management');
    const other = await context.newPage();
    await other.goto('/user-management');
    await expect(other.getByRole('button', { name: 'Dodaj użytkownika' })).toBeVisible();
    await page.getByTestId('sign-out-btn').click();
    await expect(other).toHaveURL(/\/login/);
    await expect(other.getByRole('button', { name: 'Dodaj użytkownika' })).toHaveCount(0);
  });
});

test('a guest cannot open the administrator screen', async ({ page, api }) => {
  await api('POST', '/v2/auth/refresh', (route) => route.fulfill({ json: session() }));
  await api('GET', '/v2/users/me', (route) => route.fulfill({ json: { ...admin, roles: ['Guest'] } }));
  await page.goto('/user-management');
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('button', { name: 'Dodaj użytkownika' })).toHaveCount(0);
});

test('password recovery submits the entered address and shows confirmation', async ({ page, api }) => {
  await api('POST', '/v2/auth/password-reset-request', async (route) => {
    expect(route.request().postDataJSON()).toEqual({ email: admin.email });
    await route.fulfill({ status: 204 });
  });
  await page.goto('/forgot-password');
  await page.getByLabel('E-mail').fill(admin.email);
  await page.getByRole('button', { name: 'Przypomnij hasło' }).click();
  await expect(page.getByText(/Link do resetowania hasła został wysłany/)).toBeVisible();
});

test('password reset carries the emailed token and the new password', async ({ page, api }) => {
  await api('POST', '/v2/auth/password-reset', async (route) => {
    expect(route.request().postDataJSON()).toEqual({
      emailBase64: 'email-token',
      resetCode: 'reset-token',
      password: 'StrongPass1!',
      passwordConfirm: 'StrongPass1!',
    });
    await route.fulfill({ status: 204 });
  });
  await page.goto('/reset-password?emailBase64=email-token&resetCode=reset-token');
  await page.getByLabel('Hasło', { exact: true }).fill('StrongPass1!');
  await page.getByLabel('Potwierdź hasło').fill('StrongPass1!');
  await page.getByRole('button', { name: 'Zmień hasło' }).click();
  await expect(page.getByText('Hasło zostało zmienione')).toBeVisible();
});

test('an expiring session can be extended from its warning', async ({ page, api }) => {
  let refreshes = 0;
  await api('POST', '/v2/auth/refresh', (route) => {
    refreshes++;
    return route.fulfill({ json: session(refreshes === 1 ? 60_000 : 86_400_000) });
  });
  await api('GET', '/v2/users/me', (route) => route.fulfill({ json: admin }));
  await page.goto('/help');
  await expect(page.getByText('Sesja wygasa', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Odśwież sesję', exact: true }).click();
  await expect(page.getByText('Sesja wygasa', { exact: true })).toBeHidden();
  expect(refreshes).toBe(2);
});

for (const status of [204, 401]) {
  test(`email confirmation shows ${status === 204 ? 'success' : 'an invalid-link error'}`, async ({ page, api }) => {
    await api('GET', '/v2/auth/confirm-email?*', (route) => {
      const params = new URL(route.request().url()).searchParams;
      expect(params.get('userId')).toBe(admin.id);
      expect(params.get('code')).toBe('confirmation-token');
      return route.fulfill({ status });
    });
    await page.goto(`/confirm-email?userId=${admin.id}&code=confirmation-token`);
    await expect(
      page.getByText(status === 204 ? 'Email został potwierdzony' : 'Błąd podczas potwierdzania emaila', {
        exact: true,
      })
    ).toBeVisible();
  });
}
