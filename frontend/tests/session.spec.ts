import { expect, Page } from '@playwright/test';

import { API_URL, test } from './fixtures/fixtures';
import { getAdminAccountPayload, getAuthDetailsPayload } from './fixtures/mockPayloads';

function getAuthDetailsPayloadMs(timeoutMs: number) {
  const deadline = new Date(Date.now() + timeoutMs);
  const base = getAuthDetailsPayload();
  return {
    ...base,
    expiresIn: deadline.toISOString(),
    expirationDate: deadline.toISOString(),
  };
}

async function setupAuthMocks(
  page: Page,
  options: { refreshResponse?: { status: number; body?: object }; refreshHangs?: boolean } = {}
) {
  await page.route(`${API_URL}/account`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(getAdminAccountPayload()),
      contentType: 'application/json',
    });
  });

  if (options.refreshHangs) {
    await page.route(`${API_URL}/account/refresh`, () => {
      // Intentionally never respond — simulates a hanging request
    });
  } else if (options.refreshResponse) {
    await page.route(`${API_URL}/account/refresh`, (route) => {
      route.fulfill({
        status: options.refreshResponse!.status,
        body: options.refreshResponse!.body ? JSON.stringify(options.refreshResponse!.body) : undefined,
        contentType: 'application/json',
      });
    });
  }
}

async function seedAuthAndNavigate(page: Page, authPayload: ReturnType<typeof getAuthDetailsPayloadMs>) {
  await page.goto('/');
  await page.evaluate(
    (authDetails) => window.localStorage.setItem('authDetails', authDetails),
    JSON.stringify(authPayload)
  );
  await page.goto('/');
}

test.describe('session expiration and refresh', () => {
  test('auto-refresh endpoint is called before session expires', async ({ page }) => {
    await setupAuthMocks(page, {
      refreshResponse: { status: 200, body: getAuthDetailsPayloadMs(24 * 60 * 60 * 1000) },
    });

    const refreshPromise = page.waitForRequest(
      (req) => req.url().includes('/account/refresh') && req.method() === 'POST'
    );

    await seedAuthAndNavigate(page, getAuthDetailsPayloadMs(5_000));

    const refreshRequest = await refreshPromise;
    const body = refreshRequest.postDataJSON();
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
  });

  test('warning toast appears ~1 minute before session expires', async ({ page }) => {
    await setupAuthMocks(page, {
      refreshResponse: { status: 200, body: getAuthDetailsPayloadMs(24 * 60 * 60 * 1000) },
    });

    // 63s expiration: warning fires at 63000 - 60000 = 3000ms
    await seedAuthAndNavigate(page, getAuthDetailsPayloadMs(63_000));

    const warningToast = page.getByText('Sesja wygaśnie za mniej niż 1 minutę.');
    await expect(warningToast).toBeVisible({ timeout: 10_000 });
  });

  test('session expiry shows toast and redirects to login', async ({ page }) => {
    // Hanging refresh ensures the expire timeout fires at 3s
    await setupAuthMocks(page, { refreshHangs: true });

    await seedAuthAndNavigate(page, getAuthDetailsPayloadMs(3_000));

    const expiredToast = page.getByText('Sesja wygasła. Zaloguj się ponownie.');
    await expect(expiredToast).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test('successful refresh extends session and prevents redirect', async ({ page }) => {
    await setupAuthMocks(page, {
      refreshResponse: { status: 200, body: getAuthDetailsPayloadMs(24 * 60 * 60 * 1000) },
    });

    const refreshPromise = page.waitForRequest(
      (req) => req.url().includes('/account/refresh') && req.method() === 'POST'
    );

    await seedAuthAndNavigate(page, getAuthDetailsPayloadMs(5_000));
    await refreshPromise;

    // Wait past the original 5s expiration
    await page.waitForTimeout(7_000);

    await expect(page).not.toHaveURL(/\/login/);
  });

  test('cross-tab storage sync clears session when auth is removed', async ({ page }) => {
    await setupAuthMocks(page, {
      refreshResponse: { status: 200, body: getAuthDetailsPayloadMs(24 * 60 * 60 * 1000) },
    });

    await seedAuthAndNavigate(page, getAuthDetailsPayloadMs(24 * 60 * 60 * 1000));

    const badge = page.getByTestId('session-status-badge');
    await expect(badge).toBeVisible();

    // Simulate another tab clearing authDetails
    await page.evaluate(() => {
      window.localStorage.removeItem('authDetails');
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'authDetails',
          newValue: null,
          storageArea: window.localStorage,
        })
      );
    });

    // Session badge should disappear as sessionExpirationDate becomes undefined
    await expect(badge).toBeHidden({ timeout: 10_000 });
  });

  test('manual refresh button calls refresh endpoint and extends session', async ({ page }) => {
    const extendedAuth = getAuthDetailsPayloadMs(24 * 60 * 60 * 1000);
    await setupAuthMocks(page, {
      refreshResponse: { status: 200, body: extendedAuth },
    });

    await seedAuthAndNavigate(page, getAuthDetailsPayloadMs(24 * 60 * 60 * 1000));

    const refreshBtn = page.getByTestId('session-refresh-btn');
    await expect(refreshBtn).toBeVisible();

    const refreshPromise = page.waitForRequest(
      (req) => req.url().includes('/account/refresh') && req.method() === 'POST'
    );

    await refreshBtn.click();
    const refreshRequest = await refreshPromise;
    const body = refreshRequest.postDataJSON();
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
  });
});
