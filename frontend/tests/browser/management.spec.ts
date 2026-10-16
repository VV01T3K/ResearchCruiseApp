import { test, expect } from './fixtures';
import { admin, deputy } from '../data/accounts';
import { cruise } from '../data/cruises';

test.use({ account: admin });

test('cruise deletion requires confirmation and removes the row after saving', async ({ page, api }) => {
  const item = cruise();
  let deleted = false;
  await api('GET', '/v2/cruises', (route) => route.fulfill({ json: deleted ? [] : [item] }));
  await api('DELETE', `/v2/cruises/${item.id}`, async (route) => {
    deleted = true;
    await route.fulfill({ status: 204 });
  });
  await page.goto('/cruises');
  const row = page.getByRole('row').filter({ hasText: 'Bałtyk' });
  await row.getByRole('button', { name: 'Usuń', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText(item.number);
  await dialog.getByRole('button', { name: 'Anuluj' }).click();
  await expect(dialog).toBeHidden();
  expect(deleted).toBe(false);
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: 'Usuń', exact: true }).click();
  await dialog.getByRole('button', { name: `Usuń rejs nr. ${item.number}` }).click();
  await expect(row).toHaveCount(0);
  expect(deleted).toBe(true);
});

test('an administrator edits a user and sees the refreshed record', async ({ page, api }) => {
  let user = { ...deputy, roles: ['CruiseManager'], accepted: true, emailConfirmed: true };
  await api('GET', '/v2/users', (route) => route.fulfill({ json: [user] }));
  await api('PATCH', `/v2/users/${deputy.id}`, async (route) => {
    const body = route.request().postDataJSON();
    expect(body).toEqual({ email: deputy.email, firstName: 'Updated', lastName: deputy.lastName });
    user = { ...user, ...body };
    await route.fulfill({ status: 204 });
  });
  await page.goto('/user-management');
  await page.getByRole('row').filter({ hasText: deputy.email }).getByRole('button', { name: 'Edytuj' }).click();
  await page.getByLabel('Imię', { exact: true }).fill('Updated');
  await page.getByRole('button', { name: 'Zapisz', exact: true }).click();
  await expect(page.getByRole('row').filter({ hasText: deputy.email })).toContainText('Updated Hopper');
});

test('table filtering and selection operate on the visible users', async ({ page, api }) => {
  await api('GET', '/v2/users', (route) =>
    route.fulfill({
      json: [
        { ...admin, email: 'zebra@example.com' },
        { ...admin, ...deputy, email: 'alpha@example.com' },
      ],
    })
  );
  await page.goto('/user-management');
  await page.getByRole('button', { name: 'Email', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Sortuj rosnąco' }).click();
  await page.getByRole('menuitem', { name: 'alpha@example.com', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('row').filter({ hasText: 'zebra@example.com' })).toHaveCount(0);
  const row = page.getByRole('row').filter({ hasText: 'alpha@example.com' });
  const actions = page.getByRole('button', { name: 'Akcje Grupowe' });
  await expect(actions).toBeDisabled();
  // The selection checkbox is the only editable checkbox in a user row.
  await row.getByRole('checkbox', { disabled: false }).check();
  await expect(actions).toBeEnabled();
  await row.getByRole('checkbox', { disabled: false }).uncheck();
  await expect(actions).toBeDisabled();
  await page.getByRole('button', { name: 'Wyczyść filtry', exact: true }).click();
  await expect(page.getByRole('row').filter({ hasText: 'zebra@example.com' })).toBeVisible();
});

test('publication CSV upload submits parsed records and refreshes the table', async ({ page, api }) => {
  const publication = {
    id: deputy.id,
    category: 'subject',
    doi: '10.1000/example',
    authors: 'Ada Lovelace',
    title: 'Salinity',
    magazine: 'Journal',
    year: '2026',
    ministerialPoints: '100',
  };
  let imported = false;
  await api('GET', '/v2/users/me/publications', (route) => route.fulfill({ json: imported ? [publication] : [] }));
  await api('POST', '/v2/users/me/publications/import', async (route) => {
    expect(route.request().postDataJSON()).toEqual([
      {
        category: 'subject',
        doi: '10.1000/example',
        authors: 'Ada Lovelace',
        title: 'Salinity',
        magazine: 'Journal',
        year: '2026',
        ministerialPoints: '100',
      },
    ]);
    imported = true;
    await route.fulfill({ status: 204 });
  });
  await page.goto('/my-publications');
  // The native file input is visually hidden behind the upload button.
  await page.locator('input[type="file"]').setInputFiles({
    name: 'publications.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from(
      'Numer DOI;Autorzy;Tytu\xb3 publikacji;Nazwa czasopisma;Rok;Punkty\n10.1000/example;Ada Lovelace;Salinity;Journal;2026;100',
      'binary'
    ),
  });
  await expect(page.getByRole('cell', { name: 'Salinity', exact: true })).toBeVisible();
  expect(imported).toBe(true);
});

test('completing a confirmed cruise updates its visible status', async ({ page, api }) => {
  const item = { ...cruise(), status: 'confirmed' };
  await api('GET', `/v2/cruises/${item.id}`, (route) => route.fulfill({ json: item }));
  await api('GET', '/v2/applications/for-cruise-planning?*', (route) => route.fulfill({ json: [] }));
  await api('GET', '/v2/users/available-cruise-managers', (route) => route.fulfill({ json: [admin, deputy] }));
  await api('PUT', `/v2/cruises/${item.id}/completion`, async (route) => {
    item.status = 'ended';
    await route.fulfill({ status: 204 });
  });
  await page.goto(`/cruises/${item.id}`);
  await page.getByRole('button', { name: 'Zakończ rejs', exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /Oznacz rejs nr\./ })
    .click();
  await expect(page.getByText('Zakończony', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Zakończ rejs', exact: true })).toHaveCount(0);
});
