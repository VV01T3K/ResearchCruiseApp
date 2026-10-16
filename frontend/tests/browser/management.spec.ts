import type { CruiseResponse } from '@/api/generated/schemas';
import { test, expect, type Api } from './fixtures';
import { admin, deputy, manager } from '../data/accounts';
import { cruise } from '../data/cruises';

test.use({ account: admin });

async function mockCruiseEditor(api: Api, item?: CruiseResponse) {
  if (item) await api('GET', `/v2/cruises/${item.id}`, (route) => route.fulfill({ json: item }));
  await api('GET', '/v2/applications/for-cruise-planning', (route) => route.fulfill({ json: [] }));
  await api('GET', '/v2/applications/for-cruise-planning?*', (route) => route.fulfill({ json: [] }));
  await api('GET', '/v2/users/available-cruise-managers', (route) => route.fulfill({ json: [admin, deputy] }));
}

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

test('an administrator creates a user, then edits them and sees the refreshed record', async ({ page, api }) => {
  let users: object[] = [];
  await api('GET', '/v2/users', (route) => route.fulfill({ json: users }));
  await api('POST', '/v2/users', async (route) => {
    expect(route.request().postDataJSON()).toEqual({
      email: deputy.email,
      firstName: deputy.firstName,
      lastName: deputy.lastName,
      roles: ['CruiseManager'],
    });
    users = [{ ...deputy, roles: ['CruiseManager'], accepted: true, emailConfirmed: true }];
    await route.fulfill({ status: 201 });
  });
  await api('PATCH', `/v2/users/${deputy.id}`, async (route) => {
    const body = route.request().postDataJSON();
    expect(body).toEqual({ email: deputy.email, firstName: 'Updated', lastName: deputy.lastName });
    users = [{ ...users[0], ...body }];
    await route.fulfill({ status: 204 });
  });
  await page.goto('/user-management');
  await page.getByRole('button', { name: 'Dodaj użytkownika' }).click();
  await page.getByLabel('Imię', { exact: true }).fill(deputy.firstName);
  await page.getByLabel('Nazwisko', { exact: true }).fill(deputy.lastName);
  await page.getByLabel('Email', { exact: true }).fill(deputy.email);
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Kierownik' }).click();
  await page.getByRole('button', { name: 'Dodaj', exact: true }).click();
  const row = page.getByRole('row').filter({ hasText: deputy.email });
  await row.getByRole('button', { name: 'Edytuj' }).click();
  await page.getByLabel('Imię', { exact: true }).fill('Updated');
  await page.getByRole('button', { name: 'Zapisz', exact: true }).click();
  await expect(row).toContainText('Updated Hopper');
});

test('a failed account acceptance is explained and can be retried', async ({ page, api }) => {
  let attempts = 0;
  await api('GET', '/v2/users', (route) =>
    route.fulfill({ json: [{ ...deputy, roles: ['CruiseManager'], accepted: false, emailConfirmed: true }] })
  );
  await api('PUT', `/v2/users/${deputy.id}/acceptance`, (route) =>
    route.fulfill(++attempts === 1 ? { status: 503, json: { detail: 'Spróbuj ponownie później' } } : { status: 204 })
  );
  await page.goto('/user-management');
  await page.getByRole('button', { name: 'Edytuj', exact: true }).click();
  const accept = page.getByRole('button', { name: 'Zaakceptuj konto użytkownika', exact: true });
  await accept.click();
  await expect(page.getByRole('alert')).toContainText('Spróbuj ponownie później');
  await expect(accept).toBeDisabled();
  await page.getByRole('alert').getByRole('button', { name: 'Close' }).click();
  await accept.click();
  await expect(accept).toHaveCount(0);
  expect(attempts).toBe(2);
});

for (const mobile of [false, true]) {
  test(`table sorting, filtering and selection work on ${mobile ? 'mobile' : 'desktop'}`, async ({ page, api }) => {
    if (mobile) await page.setViewportSize({ width: 390, height: 844 });
    await api('GET', '/v2/users', (route) =>
      route.fulfill({
        json: [
          { ...admin, email: 'zebra@example.com' },
          { ...admin, ...deputy, email: 'alpha@example.com' },
        ],
      })
    );
    await page.goto('/user-management');
    const rows = page.locator('tbody tr');
    const actions = page.getByRole('button', { name: 'Akcje Grupowe' });
    await expect(actions).toBeDisabled();
    // The selection checkbox is the row's last editable checkbox.
    const selection = rows.first().getByRole('checkbox', { disabled: false }).last();
    await selection.check();
    await expect(actions).toBeEnabled();
    await selection.uncheck();
    await expect(actions).toBeDisabled();
    if (mobile) {
      await page.getByRole('button', { name: 'Filtrowanie i sortowanie' }).click();
      const email = page.getByRole('dialog').getByText('Email', { exact: true }).locator('..');
      await email.getByText('Rosnąco', { exact: true }).click();
      await expect(rows.first()).toContainText('alpha@example.com');
      await email.getByText('Pokaż filtry', { exact: true }).click();
      await email.getByText('zebra@example.com', { exact: true }).click();
    } else {
      await page.getByRole('button', { name: 'Email', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Sortuj rosnąco' }).click();
      await expect(rows.first()).toContainText('alpha@example.com');
      await page.getByRole('menuitem', { name: 'zebra@example.com', exact: true }).click();
      await page.keyboard.press('Escape');
    }
    await expect(rows).toHaveCount(1);
    await expect(rows).toContainText('zebra@example.com');
    await page.getByRole('button', { name: 'Wyczyść filtry', exact: true }).click();
    await expect(rows).toHaveCount(2);
  });
}

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
  const item: CruiseResponse = { ...cruise(), status: 'confirmed' };
  await mockCruiseEditor(api, item);
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

test('a new cruise is saved with Warsaw-midnight dates and the chosen managers', async ({ page, api }) => {
  // Fix only the date; faked timers would also stall the comboboxes' transitions.
  await page.clock.setFixedTime(new Date('2026-05-16T12:00:00Z'));
  await mockCruiseEditor(api);
  await api('GET', '/v2/cruises', (route) => route.fulfill({ json: [] }));
  let created: unknown;
  await api('POST', '/v2/cruises', async (route) => {
    created = route.request().postDataJSON();
    await route.fulfill({ status: 201 });
  });
  await page.goto('/cruises/new');
  await page.getByText('Wybierz datę rozpoczęcia rejsu').click();
  await page.getByText('17', { exact: true }).click();
  await page.getByText('Wybierz datę zakończenia rejsu').click();
  await page.getByText('18', { exact: true }).last().click();
  await page.getByRole('combobox', { name: 'Kierownik główny' }).click();
  await page.getByRole('option', { name: `${manager.firstName} ${manager.lastName}` }).click();
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await page.getByRole('combobox', { name: 'Zastępca kierownika głównego' }).click();
  await page.getByRole('option', { name: `${deputy.firstName} ${deputy.lastName}` }).click();
  await page.getByRole('button', { name: 'Zapisz' }).click();
  await expect
    .poll(() => created)
    .toEqual({
      startDate: '2026-05-16T22:00:00.000Z',
      endDate: '2026-05-17T22:00:00.000Z',
      mainManagerId: manager.id,
      deputyManagerId: deputy.id,
      cruiseApplicationIds: [],
      title: null,
      shipUnavailable: false,
    });
});

test('rejected cruise edits show field and general errors, keep the edits and can be resaved', async ({
  page,
  api,
}) => {
  const item: CruiseResponse = { ...cruise(), status: 'confirmed' };
  await mockCruiseEditor(api, item);
  let attempts = 0;
  let saved: unknown;
  await api('PATCH', `/v2/cruises/${item.id}`, async (route) => {
    saved = route.request().postDataJSON();
    if (++attempts > 1) return route.fulfill({ status: 204 });
    await route.fulfill({
      status: 400,
      json: {
        errors: {
          deputyManagerId: ['Zastępca jest niedostępny w tym terminie'],
          '': ['Stan rejsu zmienił się. Spróbuj ponownie.'],
        },
      },
    });
  });
  await page.goto(`/cruises/${item.id}`);
  await page.getByRole('button', { name: 'Edytuj', exact: true }).click();
  await page.locator('input[name="title"]').fill('Nowy tytuł');
  await page.getByRole('button', { name: 'Zapisz rejs' }).click();
  await expect(page.getByRole('combobox', { name: 'Zastępca kierownika głównego' })).toHaveAccessibleDescription(
    'Zastępca jest niedostępny w tym terminie'
  );
  await expect(page.getByText('Stan rejsu zmienił się. Spróbuj ponownie.').first()).toBeVisible();
  await expect(page.locator('input[name="title"]')).toHaveValue('Nowy tytuł');
  await page.getByRole('button', { name: 'Zapisz rejs' }).click();
  await expect(page.getByRole('button', { name: 'Edytuj', exact: true })).toBeVisible();
  expect(saved).toEqual({
    startDate: item.startDate,
    endDate: item.endDate,
    mainManagerId: manager.id,
    deputyManagerId: deputy.id,
    cruiseApplicationIds: [],
    title: 'Nowy tytuł',
    shipUnavailable: false,
  });
});

test('publications can be deleted one at a time or all at once after confirmation', async ({ page, api }) => {
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
  const deleted: string[] = [];
  await api('GET', '/v2/users/me/publications', (route) => route.fulfill({ json: [publication] }));
  await api('DELETE', `/v2/users/me/publications/${publication.id}`, async (route) => {
    deleted.push('one');
    await route.fulfill({ status: 204 });
  });
  await api('DELETE', '/v2/users/me/publications', async (route) => {
    deleted.push('all');
    await route.fulfill({ status: 204 });
  });
  await page.goto('/my-publications');
  await page.getByRole('button', { name: 'Usuń', exact: true }).click();
  await expect.poll(() => deleted).toEqual(['one']);
  await page.getByRole('button', { name: 'Usuń wszystkie publikacje' }).click();
  expect(deleted).toEqual(['one']);
  await page.getByRole('button', { name: 'Usuń wszystkie publikacje' }).last().click();
  await expect.poll(() => deleted).toEqual(['one', 'all']);
});
