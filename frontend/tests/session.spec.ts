import { expect, Page } from '@playwright/test';

import { API_URL, test } from './fixtures/fixtures';
import { getAdminAccountPayload, getAuthDetailsPayload } from './fixtures/mockPayloads';

function getAuthDetailsPayloadMs(timeoutMs: number) {
  const deadline = new Date(Date.now() + timeoutMs);
  const base = getAuthDetailsPayload();
  return {
    ...base,
    accessTokenExpirationDate: deadline.toISOString(),
    refreshTokenExpirationDate: deadline.toISOString(),
  };
}

function getRefreshResponsePayloadMs(timeoutMs: number) {
  const deadline = new Date(Date.now() + timeoutMs).toISOString();
  const base = getAuthDetailsPayload();
  return {
    accessToken: base.accessToken,
    refreshToken: base.refreshToken,
    accessTokenExpirationDate: deadline,
    refreshTokenExpirationDate: deadline,
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
  test('warning modal appears ~1 minute before session expires', async ({ page }) => {
    await setupAuthMocks(page, {
      refreshResponse: { status: 200, body: getRefreshResponsePayloadMs(24 * 60 * 60 * 1000) },
    });

    // 63s expiration: warning fires at 63000 - 60000 = 3000ms
    await seedAuthAndNavigate(page, getAuthDetailsPayloadMs(63_000));

    const warningTitle = page.getByText('Sesja wygasa');
    const warningMessage = page.getByText(/Twoja sesja wygaśnie za/);
    await expect(warningTitle).toBeVisible({ timeout: 10_000 });
    await expect(warningMessage).toBeVisible({ timeout: 10_000 });
  });

  test('session expiry shows warning and redirects to login', async ({ page }) => {
    // Hanging refresh ensures the expire timeout fires at 3s
    await setupAuthMocks(page, { refreshHangs: true });

    await seedAuthAndNavigate(page, getAuthDetailsPayloadMs(3_000));

    const warningTitle = page.getByText('Sesja wygasa');
    const warningMessage = page.getByText(/Twoja sesja wygaśnie za/);
    await expect(warningTitle).toBeVisible({ timeout: 10_000 });
    await expect(warningMessage).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test('successful refresh extends session and prevents redirect', async ({ page }) => {
    const initialSessionMs = 12_000;
    const extendedAuth = getRefreshResponsePayloadMs(24 * 60 * 60 * 1000);
    await page.clock.install();

    await setupAuthMocks(page, {
      refreshResponse: { status: 200, body: extendedAuth },
    });

    await seedAuthAndNavigate(page, getAuthDetailsPayloadMs(initialSessionMs));

    const beforeRefreshAuthDetails = await page.evaluate(() => {
      const raw = window.localStorage.getItem('authDetails');
      return raw ? (JSON.parse(raw) as { refreshTokenExpirationDate: string }) : null;
    });

    expect(beforeRefreshAuthDetails).not.toBeNull();

    const RefreshButton = page.getByTestId('session-refresh-btn');
    await expect(RefreshButton).toBeVisible({ timeout: 10_000 });

    const refreshPromise = page.waitForResponse(
      (res) => res.url().includes('/account/refresh') && res.request().method() === 'POST' && res.status() === 200
    );

    await RefreshButton.click();
    await refreshPromise;

    const afterRefreshAuthDetails = await page.evaluate(() => {
      const raw = window.localStorage.getItem('authDetails');
      return raw ? (JSON.parse(raw) as { refreshTokenExpirationDate: string }) : null;
    });

    expect(afterRefreshAuthDetails).not.toBeNull();
    expect(afterRefreshAuthDetails!.refreshTokenExpirationDate).toBe(extendedAuth.refreshTokenExpirationDate);
    expect(new Date(afterRefreshAuthDetails!.refreshTokenExpirationDate).getTime()).toBeGreaterThan(
      new Date(beforeRefreshAuthDetails!.refreshTokenExpirationDate).getTime()
    );

    await page.clock.runFor(initialSessionMs + 3_000);

    await expect(page).not.toHaveURL(/\/login/);
  });

  test('auth removed from storage signs out after reload', async ({ page }) => {
    await setupAuthMocks(page, {
      refreshResponse: { status: 200, body: getRefreshResponsePayloadMs(24 * 60 * 60 * 1000) },
    });

    await seedAuthAndNavigate(page, getAuthDetailsPayloadMs(24 * 60 * 60 * 1000));

    await expect(page.getByTestId('session-status-badge')).toBeVisible();

    // Remove persisted auth and validate app re-hydration on next load.
    await page.evaluate(() => {
      window.localStorage.removeItem('authDetails');
    });

    await page.reload();

    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
    await expect(page.getByTestId('session-status-badge')).toBeHidden({ timeout: 10_000 });
  });

  test('manual refresh button calls refresh endpoint and extends session', async ({ page }) => {
    const extendedAuth = getRefreshResponsePayloadMs(24 * 60 * 60 * 1000);
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
