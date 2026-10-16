import type { Page } from '@playwright/test';
import {
  getConfirmEmailMockHandler,
  getLoginMockHandler,
  getLogoutMockHandler,
  getRefreshTokensMockHandler,
  getRegisterAccountMockHandler,
  getRequestPasswordResetMockHandler,
  getResetPasswordMockHandler,
} from '@/api/generated/mocks/auth/auth.msw.gen';
import {
  getChangeCurrentUserPasswordMockHandler,
  getGetCurrentUserMockHandler,
  getGetUsersMockHandler,
} from '@/api/generated/mocks/users/users.msw.gen';
import { test, expect, fail } from './fixtures';
import { admin, session } from '../data/accounts';

// The icon-only sign-out button has no accessible name yet (#491).
const signOut = (page: Page) => page.getByTestId('sign-out-btn').click();

async function logIn(page: Page, password = 'Password1!') {
  await page.getByLabel('E-mail').fill(admin.email);
  await page.getByLabel('Hasło', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Zaloguj', exact: true }).click();
}

test('login returns to the requested page and logout removes access', async ({ page, network, requests }) => {
  network.use(
    getLoginMockHandler(() => {
      network.use(getGetCurrentUserMockHandler(admin));
      return session();
    }),
    getLogoutMockHandler(() => network.resetHandlers())
  );
  await page.goto('/login?redirect=%2Fhelp');
  await logIn(page);
  await expect(page).toHaveURL('/help');
  expect(requests.bodies('POST /v2/auth/login')).toEqual([{ email: admin.email, password: 'Password1!' }]);

  await signOut(page);
  await expect.poll(() => requests.bodies('POST /v2/auth/logout')).toHaveLength(1);
  await page.goto('/user-management');
  await expect(page).toHaveURL(/\/login/);
  expect(await page.evaluate(() => localStorage.getItem('authDetails'))).toBeNull();
});

test('rejected login explains the error and permits another attempt', async ({ page, network }) => {
  network.use(
    getLoginMockHandler(fail(401, { detail: 'Nieprawidłowe dane logowania' }), { once: true }),
    getLoginMockHandler(() => {
      network.use(getGetCurrentUserMockHandler(admin));
      return session();
    })
  );
  await page.goto('/login');
  await logIn(page, 'wrong-password');
  await expect(page.getByText('Nieprawidłowe dane logowania')).toBeVisible();
  await expect(page.getByTestId('toast-error')).toHaveCount(0);
  await expect(page).toHaveURL('/login');

  await logIn(page);
  await expect(page).toHaveURL('/');
});

test('a login whose profile cannot load is revoked and can be retried', async ({ page, network, requests }) => {
  network.use(
    getLoginMockHandler(session()),
    getGetCurrentUserMockHandler(fail(503, { detail: 'Profil chwilowo niedostępny' }), { once: true }),
    getLogoutMockHandler(() => network.use(getGetCurrentUserMockHandler(admin)))
  );
  await page.goto('/login');
  await logIn(page);
  await expect(page.getByText('Profil chwilowo niedostępny', { exact: true })).toBeVisible();
  await expect.poll(() => requests.bodies('POST /v2/auth/logout')).toHaveLength(1);

  await logIn(page);
  await expect(page).toHaveURL('/');
});

test.describe('authenticated session', () => {
  test.use({ account: admin });
  test.beforeEach(({ network }) => network.use(getGetUsersMockHandler([])));

  for (const failing of ['profile', 'refresh'] as const) {
    test(`a server error from the ${failing} request does not log the user out`, async ({ page, network }) => {
      network.use(
        failing === 'profile' ? getGetCurrentUserMockHandler(fail(500)) : getRefreshTokensMockHandler(fail(500))
      );
      await page.goto('/user-management');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page).not.toHaveURL(/\/login/);
    });
  }

  test('reload restores access through refresh without persisting the token in localStorage', async ({
    page,
    requests,
  }) => {
    await page.goto('/user-management');
    await expect(page.getByRole('button', { name: 'Dodaj użytkownika' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('button', { name: 'Dodaj użytkownika' })).toBeVisible();
    // The refresh token travels as a cookie, never in the body.
    expect(requests.bodies('POST /v2/auth/refresh')).toEqual([undefined, undefined]);
    expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain(session().accessToken);
  });

  test('logout propagates between tabs', async ({ page, context, network }) => {
    network.use(getLogoutMockHandler());
    await page.goto('/user-management');
    const other = await context.newPage();
    await other.goto('/user-management');
    await expect(other.getByRole('button', { name: 'Dodaj użytkownika' })).toBeVisible();

    await signOut(page);
    await expect(other).toHaveURL(/\/login/);
    await expect(other.getByRole('button', { name: 'Dodaj użytkownika' })).toHaveCount(0);
  });

  test('the administrator screen rechecks a role that changed since it was loaded', async ({ page, network }) => {
    await page.clock.install();
    await page.goto('/');
    const link = page.getByRole('link', { name: /Zarządzanie użytkownikami/ });
    await expect(link).toBeVisible();

    network.use(getGetCurrentUserMockHandler({ ...admin, roles: ['Guest'] }));
    await page.clock.fastForward(60_001);
    await link.click();
    await expect(page).toHaveURL('/');
    await page.goto('/user-management');
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Dodaj użytkownika' })).toHaveCount(0);
  });

  for (const outcome of ['extended', 'rejected'] as const) {
    test(`an expiring session warning, when refreshed, is ${outcome}`, async ({ page, network }) => {
      network.use(
        getRefreshTokensMockHandler(session(60_000), { once: true }),
        getRefreshTokensMockHandler(outcome === 'extended' ? session() : fail(401))
      );
      await page.goto('/user-management');
      await expect(page.getByText('Sesja wygasa', { exact: true })).toBeVisible();

      await page.getByRole('button', { name: 'Odśwież sesję', exact: true }).click();
      await expect(page.getByText('Sesja wygasa', { exact: true })).toBeHidden();
      await expect(page.getByRole('button', { name: 'Dodaj użytkownika' })).toHaveCount(outcome === 'extended' ? 1 : 0);
    });
  }

  test('a password change sends the current and the new password', async ({ page, network, requests }) => {
    network.use(getChangeCurrentUserPasswordMockHandler());
    await page.goto('/account-settings');
    await page.locator('input[name="password"]').fill('CurrentPass1');
    await page.locator('input[name="newPassword"]').fill('NewStrongPass1');
    await page.locator('input[name="repeatedNewPassword"]').fill('NewStrongPass1');
    await page.getByRole('button', { name: 'Zmień hasło' }).click();
    await expect(page.getByText('Hasło zostało zmienione')).toBeVisible();
    expect(requests.bodies('PATCH /v2/users/me/password')).toEqual([
      { password: 'CurrentPass1', newPassword: 'NewStrongPass1' },
    ]);
  });
});

test('a rejected registration explains why and can be resubmitted', async ({ page, network, requests }) => {
  network.use(
    getRegisterAccountMockHandler(fail(400, { detail: "Adres e-mail 'person@example.com' jest już zajęty." }), {
      once: true,
    }),
    getRegisterAccountMockHandler()
  );
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
  const account = { email: 'person@example.com', firstName: 'Ada', lastName: 'Lovelace', password: 'Password1' };
  expect(requests.bodies('POST /v2/auth/register')).toEqual([account, account]);
});

test('a failed password reset request can be retried and confirms where the link went', async ({
  page,
  network,
  requests,
}) => {
  network.use(
    getRequestPasswordResetMockHandler(fail(503, { detail: 'Wysyłka wiadomości chwilowo niedostępna' }), {
      once: true,
    }),
    getRequestPasswordResetMockHandler()
  );
  await page.goto('/forgot-password');
  await page.getByLabel('E-mail').fill(admin.email);
  const send = page.getByRole('button', { name: 'Przypomnij hasło' });
  await send.click();
  await expect(page.getByText('Wysyłka wiadomości chwilowo niedostępna')).toBeVisible();

  await send.click();
  await expect(page.getByText(`Link do resetowania hasła został wysłany na adres: ${admin.email}`)).toBeVisible();
  expect(requests.bodies('POST /v2/auth/password-reset-request')).toEqual([
    { email: admin.email },
    { email: admin.email },
  ]);
});

test('password reset carries the emailed token and the new password', async ({ page, network, requests }) => {
  network.use(getResetPasswordMockHandler());
  await page.goto('/reset-password?emailBase64=email-token&resetCode=reset-token');
  await page.getByLabel('Hasło', { exact: true }).fill('StrongPass1!');
  await page.getByLabel('Potwierdź hasło').fill('StrongPass1!');
  await page.getByRole('button', { name: 'Zmień hasło' }).click();
  await expect(page.getByText('Hasło zostało zmienione')).toBeVisible();
  expect(requests.bodies('POST /v2/auth/password-reset')).toEqual([
    { emailBase64: 'email-token', resetCode: 'reset-token', password: 'StrongPass1!', passwordConfirm: 'StrongPass1!' },
  ]);
});

test('email confirmation sends the link parameters', async ({ page, network, requests }) => {
  network.use(getConfirmEmailMockHandler());
  await page.goto(`/confirm-email?userId=${admin.id}&code=confirmation-token`);
  await expect(page.getByText('Email został potwierdzony', { exact: true })).toBeVisible();
  expect(requests.queries('GET /v2/auth/confirm-email')).toEqual([{ userId: admin.id, code: 'confirmation-token' }]);
});
