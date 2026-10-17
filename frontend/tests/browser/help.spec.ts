import { readFileSync } from 'node:fs';
import { http, HttpResponse } from 'msw';
import { test, expect } from './fixtures';
import { admin } from '../data/accounts';

test.use({ account: admin });

// Runs against a production build, so a blank build-time version fails here.
const { version, repository } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
  version: string;
  repository: string;
};

test('help shows the built frontend version, the same as the header', async ({ page, network }) => {
  network.use(http.get('*/api/version', () => HttpResponse.json('9.8.7')));
  await page.goto('/help');

  const versions = page.getByText('Wersja frontendu:').locator('..');
  await expect(versions).toHaveText(`Wersja frontendu:${version}Wersja backendu:9.8.7`);
  await expect(page.locator('header').getByRole('link', { name: version, exact: true })).toHaveAttribute(
    'href',
    `${repository}/releases/latest`
  );
});
