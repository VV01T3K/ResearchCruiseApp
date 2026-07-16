import { expect, Page } from '@playwright/test';

import { API_URL, test } from './fixtures/fixtures';
import { getAdminAccountPayload, getAuthDetailsPayload } from './fixtures/mockPayloads';

function sessionPayload(accessTokenOffsetMs: number, refreshTokenOffsetMs: number) {
  return {
    ...getAuthDetailsPayload(),
    accessTokenExpirationDate: new Date(Date.now() + accessTokenOffsetMs).toISOString(),
    refreshTokenExpirationDate: new Date(Date.now() + refreshTokenOffsetMs).toISOString(),
  };
}

async function mockAuthenticatedPage(page: Page) {
  await page.route(`${API_URL}/v2/users/me`, (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify(getAdminAccountPayload()),
      contentType: 'application/json',
    })
  );
  await page.route(`${API_URL}/v2/users`, (route) =>
    route.fulfill({ status: 200, body: JSON.stringify([]), contentType: 'application/json' })
  );
  await page.route(`${API_URL}/v2/auth/logout`, (route) => route.fulfill({ status: 204 }));
}

async function mockRefreshSequence(page: Page, responses: Array<{ status: number; body?: object }>) {
  let calls = 0;
  await page.route(`${API_URL}/v2/auth/refresh`, (route) => {
    const response = responses[Math.min(calls, responses.length - 1)];
    calls += 1;
    return route.fulfill({
      status: response.status,
      body: response.body ? JSON.stringify(response.body) : undefined,
      contentType: 'application/json',
    });
  });
  return () => calls;
}

test.describe('session expiration and refresh', () => {
  test('profile server error is not treated as a logged-out session', async ({ page }) => {
    await mockRefreshSequence(page, [{ status: 200, body: sessionPayload(86_400_000, 86_400_000) }]);
    let profileRequests = 0;
    await page.route(`${API_URL}/v2/users/me`, (route) => {
      profileRequests += 1;
      return route.fulfill({ status: 500 });
    });

    await page.goto('/');

    await expect.poll(() => profileRequests).toBeGreaterThan(1);
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('warning modal appears before the cookie-backed session expires', async ({ page }) => {
    await mockAuthenticatedPage(page);
    await mockRefreshSequence(page, [{ status: 200, body: sessionPayload(63_000, 63_000) }]);

    await page.goto('/user-management');

    await expect(page.getByText('Sesja wygasa')).toBeVisible();
  });

  test('a reload bootstraps from the refresh cookie without persisting JWTs', async ({ page }) => {
    await mockAuthenticatedPage(page);
    const refreshCalls = await mockRefreshSequence(page, [
      { status: 200, body: sessionPayload(86_400_000, 86_400_000) },
    ]);

    await page.goto('/user-management');
    await expect(page.getByTestId('session-status-badge')).toBeVisible();
    expect(await page.evaluate(() => window.localStorage.getItem('authDetails'))).toBeNull();

    await page.reload();

    await expect(page).toHaveURL('/user-management');
    await expect.poll(refreshCalls).toBeGreaterThan(1);
    expect(await page.evaluate(() => window.localStorage.getItem('authDetails'))).toBeNull();
  });

  test('failed initial refresh redirects a protected route to login', async ({ page }) => {
    await mockRefreshSequence(page, [{ status: 401 }]);

    await page.goto('/user-management');

    await expect(page).toHaveURL(/\/login/);
  });

  test('transient initial refresh failure is not treated as logout', async ({ page }) => {
    await mockRefreshSequence(page, [{ status: 500 }]);

    await page.goto('/user-management');

    await expect(page).not.toHaveURL(/\/login/);
  });

  test('manual refresh uses the generated bodyless API contract', async ({ page }) => {
    await mockAuthenticatedPage(page);
    const initial = sessionPayload(60_000, 60_000);
    const extended = sessionPayload(86_400_000, 86_400_000);
    const refreshCalls = await mockRefreshSequence(page, [
      { status: 200, body: initial },
      { status: 200, body: extended },
    ]);

    await page.goto('/user-management');
    const refreshRequest = page.waitForRequest(
      (request) => request.url().endsWith('/v2/auth/refresh') && request.method() === 'POST'
    );
    await page.getByTestId('session-refresh-btn').click();

    expect((await refreshRequest).postData()).toBeNull();
    await expect.poll(refreshCalls).toBe(2);
    await expect(page.getByText('Sesja wygasa')).toBeHidden();
  });

  test('failed manual refresh clears the cached current user', async ({ page }) => {
    await mockAuthenticatedPage(page);
    await mockRefreshSequence(page, [{ status: 200, body: sessionPayload(86_400_000, 86_400_000) }, { status: 401 }]);

    await page.goto('/user-management');
    await expect(page.getByText('Zarządzanie użytkownikami')).toBeVisible();
    await page.getByTestId('session-refresh-btn').click();

    await expect(page.getByText('Zarządzanie użytkownikami')).toBeHidden();
  });

  test('sign out calls the generated logout endpoint before clearing the session', async ({ page }) => {
    await mockAuthenticatedPage(page);
    await mockRefreshSequence(page, [{ status: 200, body: sessionPayload(86_400_000, 86_400_000) }]);
    const logoutRequest = page.waitForRequest(`${API_URL}/v2/auth/logout`);

    await page.goto('/user-management');
    await page.getByTestId('sign-out-btn').click();

    expect((await logoutRequest).method()).toBe('POST');
    await expect(page).toHaveURL(/\/login/);
  });
});
