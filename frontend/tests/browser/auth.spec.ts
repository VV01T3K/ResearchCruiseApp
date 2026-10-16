import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { admin, session } from '../data/accounts';

// The icon-only sign-out button has no accessible name yet.
const signOut = (page: Page) => page.getByTestId('sign-out-btn').click();

async function logIn(page: Page, password = 'Password1!') {
  await page.getByLabel('E-mail').fill(admin.email);
  await page.getByLabel('Hasło', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Zaloguj', exact: true }).click();
}

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
  await logIn(page);
  await expect(page).toHaveURL('/help');
  await signOut(page);
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
  await logIn(page, 'wrong-password');
  await expect(page.getByText('Nieprawidłowe dane logowania')).toBeVisible();
  await expect(page.getByTestId('toast-error')).toHaveCount(0);
  await expect(page).toHaveURL('/login');
  await logIn(page);
  await expect(page).toHaveURL('/');
  expect(attempts).toBe(2);
});

test('a login whose profile cannot load is revoked and can be retried', async ({ page, api }) => {
  let profileAvailable = false;
  let revocations = 0;
  await api('POST', '/v2/auth/login', (route) => route.fulfill({ json: session() }));
  await api('GET', '/v2/users/me', (route) =>
    route.fulfill(profileAvailable ? { json: admin } : { status: 503, json: { detail: 'Profil chwilowo niedostępny' } })
  );
  await api('POST', '/v2/auth/logout', async (route) => {
    revocations++;
    await route.fulfill({ status: 204 });
  });
  await page.goto('/login');
  await logIn(page);
  await expect(page.getByText('Profil chwilowo niedostępny', { exact: true })).toBeVisible();
  await expect.poll(() => revocations).toBe(1);
  profileAvailable = true;
  await logIn(page);
  await expect(page).toHaveURL('/');
});

for (const failing of ['/v2/users/me', '/v2/auth/refresh']) {
  test(`a server error from ${failing} does not log the user out`, async ({ page, api }) => {
    await api('POST', '/v2/auth/refresh', (route) =>
      route.fulfill(failing === '/v2/auth/refresh' ? { status: 500 } : { json: session() })
    );
    await api('GET', '/v2/users/me', (route) =>
      route.fulfill(failing === '/v2/users/me' ? { status: 500 } : { json: admin })
    );
    await page.goto('/user-management');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).not.toHaveURL(/\/login/);
  });
}

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

  test('logout propagates between tabs', async ({ page, context, api }) => {
    await api('GET', '/v2/users', (route) => route.fulfill({ json: [] }));
    await api('POST', '/v2/auth/logout', (route) => route.fulfill({ status: 204 }));
    await page.goto('/user-management');
    const other = await context.newPage();
    await other.goto('/user-management');
    await expect(other.getByRole('button', { name: 'Dodaj użytkownika' })).toBeVisible();
    await signOut(page);
    await expect(other).toHaveURL(/\/login/);
    await expect(other.getByRole('button', { name: 'Dodaj użytkownika' })).toHaveCount(0);
  });

  test('the administrator screen rechecks a role that changed since it was loaded', async ({ page, api }) => {
    await page.clock.install();
    let roles = admin.roles;
    await api('GET', '/v2/users/me', (route) => route.fulfill({ json: { ...admin, roles } }));
    await page.goto('/');
    const link = page.getByRole('link', { name: /Zarządzanie użytkownikami/ });
    await expect(link).toBeVisible();
    roles = ['Guest'];
    await page.clock.fastForward(60_001);
    await link.click();
    await expect(page).toHaveURL('/');
    await page.goto('/user-management');
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Dodaj użytkownika' })).toHaveCount(0);
  });

  for (const outcome of ['extended', 'rejected'] as const) {
    test(`an expiring session warning, when refreshed, is ${outcome}`, async ({ page, api }) => {
      let refreshes = 0;
      await api('POST', '/v2/auth/refresh', (route) => {
        refreshes++;
        if (refreshes === 1) return route.fulfill({ json: session(60_000) });
        return route.fulfill(outcome === 'extended' ? { json: session() } : { status: 401 });
      });
      await api('GET', '/v2/users', (route) => route.fulfill({ json: [] }));
      await page.goto('/user-management');
      await expect(page.getByText('Sesja wygasa', { exact: true })).toBeVisible();
      await page.getByRole('button', { name: 'Odśwież sesję', exact: true }).click();
      await expect(page.getByText('Sesja wygasa', { exact: true })).toBeHidden();
      expect(refreshes).toBe(2);
      await expect(page.getByRole('button', { name: 'Dodaj użytkownika' })).toHaveCount(outcome === 'extended' ? 1 : 0);
    });
  }

  test('a password change sends the current and the new password', async ({ page, api }) => {
    await api('PATCH', '/v2/users/me/password', async (route) => {
      expect(route.request().postDataJSON()).toEqual({ password: 'CurrentPass1', newPassword: 'NewStrongPass1' });
      await route.fulfill({ status: 204 });
    });
    await page.goto('/account-settings');
    await page.locator('input[name="password"]').fill('CurrentPass1');
    await page.locator('input[name="newPassword"]').fill('NewStrongPass1');
    await page.locator('input[name="repeatedNewPassword"]').fill('NewStrongPass1');
    await page.getByRole('button', { name: 'Zmień hasło' }).click();
    await expect(page.getByText('Hasło zostało zmienione')).toBeVisible();
  });
});

test('a rejected registration explains why and can be resubmitted', async ({ page, api }) => {
  let attempts = 0;
  await api('POST', '/v2/auth/register', async (route) => {
    attempts++;
    expect(route.request().postDataJSON()).toEqual({
      email: 'person@example.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
      password: 'Password1',
    });
    await route.fulfill(
      attempts === 1
        ? { status: 400, json: { detail: "Adres e-mail 'person@example.com' jest już zajęty." } }
        : { status: 204 }
    );
  });
  await page.goto('/register');
  await page.getByLabel('E-mail').fill('person@example.com');
  await page.getByLabel('Imię').fill('Ada');
  await page.getByLabel('Nazwisko').fill('Lovelace');
  await page.getByLabel('Hasło', { exact: true }).fill('Password1');
  await page.getByLabel('Potwierdź hasło').fill('Password1');
  const register = page.getByRole('button', { name: 'Zarejestruj się' });
  await register.click();
  await expect(page.getByText("Adres e-mail 'person@example.com' jest już zajęty.")).toBeVisible();
  await expect(page.getByTestId('toast-error')).toHaveCount(0);
  await register.click();
  await expect(page).toHaveURL(/\/login$/);
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

test('email confirmation sends the link parameters', async ({ page, api }) => {
  await api('GET', '/v2/auth/confirm-email?*', (route) => {
    const params = new URL(route.request().url()).searchParams;
    expect(params.get('userId')).toBe(admin.id);
    expect(params.get('code')).toBe('confirmation-token');
    return route.fulfill({ status: 204 });
  });
  await page.goto(`/confirm-email?userId=${admin.id}&code=confirmation-token`);
  await expect(page.getByText('Email został potwierdzony', { exact: true })).toBeVisible();
});
