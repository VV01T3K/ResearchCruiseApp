import { expect, Page } from '@playwright/test';

import { API_URL, test } from './fixtures/fixtures';
import { getAdminAccountPayload, getAuthDetailsPayload } from './fixtures/mockPayloads';

const application = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  number: '2026/17',
  year: 2026,
  date: '2026-05-16',
  mainManager: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'manager@example.com',
    firstName: 'Ada',
    lastName: 'Lovelace',
  },
  deputyManager: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'deputy@example.com',
    firstName: 'Grace',
    lastName: 'Hopper',
  },
  hasFormA: true,
  hasFormB: false,
  hasFormC: false,
  points: 7,
  status: 'acceptedBySupervisor',
  effectsDoneRate: '0',
  note: null,
  cruiseHours: '24',
  cruiseDays: 1,
  acceptablePeriodBeg: '2026-06-01',
  acceptablePeriodEnd: '2026-06-10',
  optimalPeriodBeg: '2026-06-02',
  optimalPeriodEnd: '2026-06-08',
  precisePeriodStart: null,
  precisePeriodEnd: null,
  startDate: null,
  endDate: null,
};

const evaluation = {
  formAResearchTasks: [],
  formAContracts: [],
  ugTeams: [],
  guestTeams: [],
  ugUnitsPoints: '0',
  formAPublications: [],
  formASpubTasks: [],
  effectsPoints: '0',
};

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

test('application list loads from the v2 route', async ({ page }) => {
  await seedAuthenticatedAdmin(page);
  let requested = false;
  await page.route(`${API_URL}/v2/applications`, async (route) => {
    requested = true;
    await route.fulfill({
      status: 200,
      body: JSON.stringify([application]),
      contentType: 'application/json',
    });
  });

  await page.goto('/applications');

  await expect(page.getByText('Ada Lovelace')).toBeVisible();
  expect(requested).toBe(true);
});

test('application detail and evaluation load from v2 routes', async ({ page }) => {
  await seedAuthenticatedAdmin(page);
  const requests: string[] = [];
  await page.route(`${API_URL}/v2/applications/${application.id}`, async (route) => {
    requests.push('detail');
    await route.fulfill({
      status: 200,
      body: JSON.stringify(application),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/applications/${application.id}/evaluation`, async (route) => {
    requests.push('evaluation');
    await route.fulfill({
      status: 200,
      body: JSON.stringify(evaluation),
      contentType: 'application/json',
    });
  });

  await page.goto(`/applications/${application.id}/details`);

  await expect(page.getByText('1. Informacje o zgłoszeniu')).toBeVisible();
  await expect.poll(() => requests).toEqual(expect.arrayContaining(['detail', 'evaluation']));
});

test('application decisions use the v2 decision route', async ({ page }) => {
  await seedAuthenticatedAdmin(page);
  const requests: string[] = [];
  await page.route(`${API_URL}/v2/applications/${application.id}`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(application),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/applications/${application.id}/evaluation`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(evaluation),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/applications/${application.id}/decision`, async (route) => {
    requests.push(String((route.request().postDataJSON() as { accept: boolean }).accept));
    await route.fulfill({ status: 204 });
  });

  await page.goto(`/applications/${application.id}/details`);
  await page.getByRole('button', { name: 'Zaakceptuj zgłoszenie' }).click();
  await page.getByRole('button', { name: 'Odrzuć zgłoszenie' }).click();
  await page.getByRole('button', { name: 'Potwierdź odrzucenie' }).click();

  await expect.poll(() => requests).toEqual(['true', 'false']);
});
