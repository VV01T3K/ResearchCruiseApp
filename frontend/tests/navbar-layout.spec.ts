import { expect } from '@playwright/test';

import { API_URL, test } from './fixtures/fixtures';
import { getAdminAccountPayload, mockAuthenticatedSession } from './fixtures/mockPayloads';

for (const width of [320, 375, 390, 768, 1024]) {
  test(`header fits a ${width}px viewport with sign-out reachable`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await mockAuthenticatedSession(page);
    await page.route(`${API_URL}/v2/users/me`, (route) =>
      route.fulfill({ status: 200, body: JSON.stringify(getAdminAccountPayload()), contentType: 'application/json' })
    );
    await page.goto('/');

    const signOut = page.getByTestId('sign-out-btn');
    await expect(signOut).toBeVisible();
    await expect(page.getByTestId('session-status-badge')).toBeVisible();
    // Wait for the header's entry animations to settle before measuring.
    await expect
      .poll(() => page.locator('#header').evaluate((el) => getComputedStyle(el).transform))
      .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
    await expect.poll(async () => (await signOut.boundingBox())?.width ?? 0).toBeGreaterThan(0);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth, 'page must not scroll horizontally').toBeLessThanOrEqual(width);

    const header = await page.locator('#header').evaluate((el) => ({
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
    }));
    expect(header.scrollHeight, 'header content must not overflow vertically').toBeLessThanOrEqual(header.clientHeight);

    const box = (await signOut.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(box.width).toBeGreaterThanOrEqual(24);
    expect(box.height).toBeGreaterThanOrEqual(24);
  });
}
