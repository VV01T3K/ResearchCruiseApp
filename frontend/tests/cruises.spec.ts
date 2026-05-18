import { expect, Page } from '@playwright/test';

import { API_URL, test } from './fixtures/fixtures';
import { getAdminAccountPayload, getAuthDetailsPayload, getInitValuesAPayload } from './fixtures/mockPayloads';

const manager = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'manager@example.com',
  firstName: 'Ada',
  lastName: 'Lovelace',
};
const deputy = {
  id: '22222222-2222-2222-2222-222222222222',
  email: 'deputy@example.com',
  firstName: 'Grace',
  lastName: 'Hopper',
};

function getCruise(status: 'new' | 'confirmed' | 'ended' = 'new') {
  return {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    number: '2026/1',
    startDate: '2026-06-01T08:00:00.000Z',
    endDate: '2026-06-02T08:00:00.000Z',
    mainManager: manager,
    deputyManager: deputy,
    applications: [],
    status,
    title: 'North Sea',
    shipUnavailable: false,
  };
}

async function seedAuthenticatedAdmin(page: Page) {
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

async function mockCruiseDetailDependencies(page: Page, cruise = getCruise()) {
  await page.route(`${API_URL}/v2/cruises/${cruise.id}`, (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 200,
        body: JSON.stringify(cruise),
        contentType: 'application/json',
      });
    }
    return route.fulfill({ status: 204 });
  });
  await page.route(`${API_URL}/v2/applications`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/users/available-cruise-managers`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([manager, deputy]),
      contentType: 'application/json',
    });
  });
}

test('cruise list loads from the v2 route', async ({ page }) => {
  await seedAuthenticatedAdmin(page);
  let requested = false;
  await page.route(`${API_URL}/v2/cruises`, async (route) => {
    requested = true;
    await route.fulfill({
      status: 200,
      body: JSON.stringify([getCruise()]),
      contentType: 'application/json',
    });
  });

  await page.goto('/cruises');

  await expect(page.getByText('North Sea')).toBeVisible();
  expect(requested).toBe(true);
});

test('cruise create flow uses v2 planning candidates and create route', async ({ page }) => {
  await seedAuthenticatedAdmin(page);
  let planningRequested = false;
  let createBody: unknown;
  await page.route(`${API_URL}/v2/applications/for-cruise-planning`, async (route) => {
    planningRequested = true;
    await route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/users/available-cruise-managers`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([manager, deputy]),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/cruises`, async (route) => {
    if (route.request().method() === 'POST') {
      createBody = route.request().postDataJSON();
      return route.fulfill({ status: 201 });
    }

    return route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      contentType: 'application/json',
    });
  });

  await page.goto('/cruises/new');
  await page.getByText('Wybierz datę rozpoczęcia rejsu').click();
  await page.getByText('17', { exact: true }).click();
  await page.getByText('Wybierz datę zakończenia rejsu').click();
  await page.getByText('18', { exact: true }).last().click();
  await page.getByRole('combobox').nth(0).click();
  await page.getByRole('option', { name: 'Ada Lovelace' }).click();
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: 'Grace Hopper' }).click();
  await page.getByRole('button', { name: 'Zapisz' }).click();

  expect(planningRequested).toBe(true);
  await expect
    .poll(() => createBody)
    .toMatchObject({
      endDate: '2026-05-18T00:00:00.000Z',
      mainManagerId: manager.id,
      deputyManagerId: deputy.id,
      cruiseApplicationIds: [],
      shipUnavailable: false,
    });
  expect((createBody as { startDate: string }).startDate).toMatch(/^2026-05-17T/);
});

test('cruise detail update and lifecycle actions use v2 routes', async ({ page }) => {
  await seedAuthenticatedAdmin(page);
  const cruise = getCruise('confirmed');
  const requests: string[] = [];
  let updateBody: unknown;
  await mockCruiseDetailDependencies(page, cruise);
  await page.route(`${API_URL}/v2/cruises/${cruise.id}`, async (route) => {
    if (route.request().method() === 'PATCH') {
      updateBody = route.request().postDataJSON();
      requests.push('update');
      return route.fulfill({ status: 204 });
    }
    if (route.request().method() === 'DELETE') {
      requests.push('delete');
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({
      status: 200,
      body: JSON.stringify(cruise),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/cruises/${cruise.id}/completion`, async (route) => {
    requests.push('complete');
    await route.fulfill({ status: 204 });
  });
  await page.route(`${API_URL}/v2/cruises/${cruise.id}/confirmation`, async (route) => {
    requests.push('remove-confirmation');
    await route.fulfill({ status: 204 });
  });
  await page.route(`${API_URL}/v2/cruises`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/applications`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      contentType: 'application/json',
    });
  });

  await page.goto(`/cruises/${cruise.id}`);
  await page.getByRole('button', { name: 'Edytuj' }).click();
  await page.getByRole('button', { name: 'Zapisz rejs' }).click();
  await expect.poll(() => requests).toContain('update');
  expect(updateBody).toMatchObject({
    mainManagerId: manager.id,
    deputyManagerId: cruise.deputyManager.id,
    cruiseApplicationIds: [],
  });

  await page.getByRole('button', { name: 'Zakończ rejs' }).click();
  await page.getByRole('button', { name: /Oznacz rejs nr\./ }).click();
  await expect.poll(() => requests).toContain('complete');

  await page.getByRole('button', { name: 'Cofnij status' }).click();
  await page.getByRole('button', { name: /Cofnij status rejsu nr\./ }).click();
  await expect.poll(() => requests).toContain('remove-confirmation');

  await page.getByRole('button', { name: 'Usuń rejs' }).click();
  await page.getByRole('button', { name: /Potwierdź usunięcie rejsu nr\./ }).click();
  await expect.poll(() => requests).toContain('delete');
});

test('cruise list actions use v2 auto-plan, export, and blockade routes', async ({ page }) => {
  await seedAuthenticatedAdmin(page);
  const requests: string[] = [];
  await page.route(`${API_URL}/v2/cruises`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([getCruise()]),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/cruises/auto-plan`, async (route) => {
    requests.push('auto-plan');
    await route.fulfill({ status: 204 });
  });
  await page.route(`${API_URL}/v2/cruises/export?year=2026`, async (route) => {
    requests.push('export');
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ name: 'cruises.csv', content: 'data:text/csv;base64,YQ==' }),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/cruises/blockades?*`, async (route) => {
    requests.push('blockades');
    await route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/applications/form-a/init-values`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(getInitValuesAPayload()),
      contentType: 'application/json',
    });
  });

  await page.goto('/cruises');
  await page.getByRole('button', { name: 'Dodaj rejsy automatycznie' }).click();
  await expect.poll(() => requests).toContain('auto-plan');

  await page.getByRole('button', { name: /Eksport/ }).click();
  await page.getByRole('button', { name: /Eksportuj rejsy z roku 2026/ }).click();
  await expect.poll(() => requests).toContain('export');

  await page.goto('/applications/new');
  await expect.poll(() => requests).toContain('blockades');
});
