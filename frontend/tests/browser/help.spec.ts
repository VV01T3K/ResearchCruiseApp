import { readFileSync } from 'node:fs';
import { http, HttpResponse } from 'msw';
import { test, expect } from './fixtures';
import { admin } from '../data/accounts';

test.use({ account: admin });

// The suite runs against a production build made without `bun run`, as in the Docker image, so
// this fails if the version comes from an environment variable only a package manager sets.
const { version } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
  version: string;
};

test('help shows the built frontend version, the same as the header', async ({ page, network }) => {
  network.use(http.get('*/api/version', () => HttpResponse.json('9.8.7')));
  await page.goto('/help');

  const versions = page.getByText('Wersja frontendu:').locator('..');
  await expect(versions).toHaveText(`Wersja frontendu:${version}Wersja backendu:9.8.7`);
  await expect(page.locator('header').getByRole('link', { name: version, exact: true })).toHaveAttribute(
    'href',
    'https://github.com/VV01T3K/ResearchCruiseApp/releases/latest'
  );
});

test('help contact emails open the mail client', async ({ page }) => {
  await page.goto('/help');

  // Assert the hrefs only; following them would try to send an email.
  await expect(page.getByRole('link', { name: 'office.oceanograf@ug.edu.pl' })).toHaveAttribute(
    'href',
    'mailto:office.oceanograf@ug.edu.pl'
  );
  await expect(page.getByRole('link', { name: 'rejsy.help@ug.edu.pl' })).toHaveAttribute(
    'href',
    'mailto:rejsy.help@ug.edu.pl'
  );
});
