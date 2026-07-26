import { expect, test } from '@playwright/test';

test('the placeholder survives React mounting while the full background is unavailable', async ({ page }) => {
  await page.route(/background\.(?:avif|webp)/, (route) => route.abort());
  await page.goto('/');

  const placeholder = page.locator('body > #background-placeholder');
  await expect(placeholder).toHaveCSS('position', 'fixed');
  await expect(placeholder).toHaveCSS('background-image', /background-placeholder/);
});

test('the placeholder is removed after the full background loads', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('body > #background-placeholder')).toHaveCount(0);
});
