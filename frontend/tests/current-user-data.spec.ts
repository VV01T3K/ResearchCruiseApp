import { expect, Page } from '@playwright/test';

import { API_URL, test } from './fixtures/fixtures';
import { getAdminAccountPayload, getAuthDetailsPayload } from './fixtures/mockPayloads';

async function seedAuthenticatedUser(page: Page) {
  await page.goto('/');
  await page.evaluate(
    (authDetails) => window.localStorage.setItem('authDetails', authDetails),
    JSON.stringify(getAuthDetailsPayload())
  );
  await page.route(`${API_URL}/v2/account/me`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(getAdminAccountPayload()),
      contentType: 'application/json',
    });
  });
}

const publication = {
  id: '11111111-1111-1111-1111-111111111111',
  category: 'subject',
  doi: '10.1000/example',
  authors: 'Ada Lovelace',
  title: 'Analytical Engines',
  magazine: 'Journal',
  year: '1843',
  ministerialPoints: '100',
};

test('current publications load from the v2 route', async ({ page }) => {
  await seedAuthenticatedUser(page);
  let requested = false;
  await page.route(`${API_URL}/v2/account/publications`, async (route) => {
    requested = true;
    await route.fulfill({
      status: 200,
      body: JSON.stringify([publication]),
      contentType: 'application/json',
    });
  });

  await page.goto('/my-publications');

  await expect(page.getByText('Analytical Engines')).toBeVisible();
  expect(requested).toBe(true);
});

test('current publication import uses the v2 route', async ({ page }) => {
  await seedAuthenticatedUser(page);
  let requestBody: unknown;
  await page.route(`${API_URL}/v2/account/publications`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/account/publications/import`, async (route) => {
    requestBody = route.request().postDataJSON();
    await route.fulfill({ status: 204 });
  });

  await page.goto('/my-publications');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'publications.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from(
      'Numer DOI;Autorzy;Tytu\xb3 publikacji;Nazwa czasopisma;Rok;Punkty\n10.1000/example;Ada Lovelace;Analytical Engines;Journal;1843;100',
      'binary'
    ),
  });

  await expect
    .poll(() => requestBody)
    .toEqual([
      {
        category: 'subject',
        doi: '10.1000/example',
        authors: 'Ada Lovelace',
        title: 'Analytical Engines',
        magazine: 'Journal',
        year: '1843',
        ministerialPoints: '100',
      },
    ]);
});

test('current publications delete one and all through v2 routes', async ({ page }) => {
  await seedAuthenticatedUser(page);
  let deletedOne = false;
  let deletedAll = false;
  await page.route(`${API_URL}/v2/account/publications`, (route) => {
    if (route.request().method() === 'DELETE') {
      deletedAll = true;
      return route.fulfill({ status: 204 });
    }

    return route.fulfill({
      status: 200,
      body: JSON.stringify([publication]),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/account/publications/${publication.id}`, async (route) => {
    deletedOne = true;
    await route.fulfill({ status: 204 });
  });

  await page.goto('/my-publications');
  await page.getByRole('button', { name: 'Usuń', exact: true }).click();
  await expect.poll(() => deletedOne).toBe(true);

  await page.getByRole('button', { name: 'Usuń wszystkie publikacje' }).click();
  await page.getByRole('button', { name: 'Usuń wszystkie publikacje' }).last().click();
  await expect.poll(() => deletedAll).toBe(true);
});

test('current cruise effects load from the v2 route', async ({ page }) => {
  await seedAuthenticatedUser(page);
  let requested = false;
  await page.route(`${API_URL}/v2/account/cruise-effects`, async (route) => {
    requested = true;
    await route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      contentType: 'application/json',
    });
  });

  await page.goto('/cruise-effects');

  await expect(page.getByText('Nie znaleziono żadnego efektu rejsu')).toBeVisible();
  expect(requested).toBe(true);
});
