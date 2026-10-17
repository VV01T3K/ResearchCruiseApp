import { readFile } from 'node:fs/promises';
import { http, HttpResponse } from 'msw';
import { test, expect } from './fixtures';
import { managerAccount } from '../data/accounts';

test.use({ account: managerAccount });

test('the help page and navbar show the built frontend version', async ({ page, network }) => {
  const { version } = JSON.parse(await readFile('package.json', 'utf8'));
  // A backend version unlike the frontend one, so each row is checked against its own source.
  network.use(http.get('*/api/version', () => HttpResponse.json('9.9.9')));
  await page.goto('/help');

  await expect(page.getByText('Wersja frontendu:').locator('+ div')).toHaveText(version);
  await expect(page.getByText('Wersja backendu:').locator('+ div')).toHaveText('9.9.9');
  await expect(page.getByRole('link', { name: version, exact: true })).toBeVisible();
});
