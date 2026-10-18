import { test, expect } from './fixtures';
import { admin } from '../data/accounts';

test.use({ account: admin, viewport: { width: 320, height: 800 } });

test('priority information table scrolls inside its own region at 320px', async ({ page }) => {
  await page.goto('/priority-information');
  await expect(page.getByRole('region', { name: 'Tabela punktacji priorytetyzacji' }).getByRole('table')).toBeVisible();
  // The page header still overflows separately (#455), so measure the main content.
  expect(await page.getByTestId('main-content').evaluate((main) => main.scrollWidth)).toBeLessThanOrEqual(320);
});
