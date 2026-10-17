import { readFile } from 'node:fs/promises';
import { http, HttpResponse } from 'msw';
import { test, expect } from './fixtures';
import { managerAccount } from '../data/accounts';

test.use({ account: managerAccount });

test('the help page links the office address and shows both built versions', async ({ page, network }) => {
  const { version } = JSON.parse(await readFile('package.json', 'utf8'));
  // A backend version unlike the frontend one, so each row is checked against its own source.
  network.use(http.get('*/api/version', () => HttpResponse.json('9.9.9')));
  await page.goto('/help');

  await expect(page.getByRole('link', { name: 'office.oceanograf@ug.edu.pl' })).toHaveAttribute(
    'href',
    'mailto:office.oceanograf@ug.edu.pl'
  );
  await expect(page.getByRole('link', { name: 'rejsy.help@ug.edu.pl' })).toHaveAttribute(
    'href',
    'mailto:rejsy.help@ug.edu.pl'
  );
  await expect(page.getByText('Wersja frontendu:').locator('+ div')).toHaveText(version);
  await expect(page.getByText('Wersja backendu:').locator('+ div')).toHaveText('9.9.9');
  await expect(page.getByRole('link', { name: version, exact: true })).toBeVisible();
});
