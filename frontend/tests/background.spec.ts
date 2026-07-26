import { expect, test } from '@playwright/test';

test('the initial background survives React mounting', async ({ page }) => {
  await page.goto('/');

  const placeholder = page.locator('body > #background-placeholder');
  await expect(placeholder).toHaveCSS('position', 'fixed');
  await expect(placeholder).toHaveCSS('background-image', /background-placeholder/);
});
