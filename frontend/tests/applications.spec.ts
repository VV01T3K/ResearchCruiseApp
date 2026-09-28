import { expect, Page } from '@playwright/test';

import { API_URL, test } from './fixtures/fixtures';
import { getAdminAccountPayload, mockAuthenticatedSession } from './fixtures/mockPayloads';

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
  await mockAuthenticatedSession(page);
  await page.route(`${API_URL}/v2/users/me`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(getAdminAccountPayload()),
      contentType: 'application/json',
    });
  });
}

test('application list loads from the v2 route', async ({ page }) => {
  await seedAuthenticatedAdmin(page);
  await page.route(`${API_URL}/v2/applications/managers`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      contentType: 'application/json',
    });
  });
  let requested = false;
  await page.route(`${API_URL}/v2/applications?*`, async (route) => {
    requested = true;
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ items: [application], nextCursor: null }),
      contentType: 'application/json',
    });
  });

  await page.goto('/applications');

  await expect(page.getByText('Ada Lovelace')).toBeVisible();
  expect(requested).toBe(true);
});

test('pagination continues through empty pages and resets for sorting and filters', async ({ page }) => {
  await seedAuthenticatedAdmin(page);
  await page.route(`${API_URL}/v2/applications/managers`, (route) => route.fulfill({ json: [] }));
  const requests: URLSearchParams[] = [];
  const items = Array.from({ length: 20 }, (_, index) => ({
    ...application,
    id: `application-${index}`,
    number: String(100 - index),
  }));
  await page.route(`${API_URL}/v2/applications?*`, (route) => {
    const params = new URL(route.request().url()).searchParams;
    requests.push(params);
    if (params.has('year') || params.get('descending') === 'false') {
      return route.fulfill({ json: { items: [application], nextCursor: null } });
    }
    if (params.get('cursor') === 'empty') {
      return route.fulfill({ json: { items: [], nextCursor: 'last' } });
    }
    if (params.get('cursor') === 'last') {
      return route.fulfill({ json: { items: [{ ...application, number: '77' }], nextCursor: null } });
    }
    return route.fulfill({ json: { items, nextCursor: 'empty' } });
  });

  await page.goto('/applications');
  await expect(page.getByRole('cell', { name: '100', exact: true })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByRole('cell', { name: '77', exact: true })).toBeVisible();
  expect(requests.map((params) => params.get('cursor'))).toEqual([null, 'empty', 'last']);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.getByRole('cell', { name: '100', exact: true })).toHaveCount(1);

  await page.getByRole('button', { name: 'Nr', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Sortuj rosnąco' }).click();
  await expect.poll(() => requests.at(-1)?.get('descending')).toBe('false');
  expect(requests.at(-1)?.has('cursor')).toBe(false);
  await expect(page.getByRole('cell', { name: '100', exact: true })).toHaveCount(0);
  const requestsBeforeClear = requests.length;
  await page.getByRole('menuitem', { name: 'Usuń sortowanie' }).click();
  await expect.poll(() => requests[requestsBeforeClear]?.get('descending')).toBe('true');
  expect(requests[requestsBeforeClear]?.get('sortBy')).toBe('number');
  expect(requests[requestsBeforeClear]?.has('cursor')).toBe(false);
  await expect(page.getByRole('menuitem', { name: 'Sortuj malejąco' })).toBeDisabled();
  await page.getByRole('menuitem', { name: 'Sortuj rosnąco' }).click();
  await expect.poll(() => requests.at(-1)?.get('descending')).toBe('false');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Rok rejsu', exact: true }).click();
  await page.getByRole('menuitem', { name: '2026', exact: true }).click();
  await expect.poll(() => requests.at(-1)?.get('year')).toBe('2026');
  expect(requests.at(-1)?.has('cursor')).toBe(false);
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`application rows are virtualized with page scrolling at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await seedAuthenticatedAdmin(page);
    await page.route(`${API_URL}/v2/applications/managers`, (route) => route.fulfill({ json: [] }));
    const items = Array.from({ length: 500 }, (_, index) => ({
      ...application,
      id: `application-${index}`,
      number: String(1000 - index),
      status: index % 2 ? 'draft' : application.status,
      note: index % 2 ? 'A longer application note that wraps across several lines. '.repeat(4) : null,
    }));
    const cursors: (string | null)[] = [];
    await page.route(`${API_URL}/v2/applications?*`, (route) => {
      const cursor = new URL(route.request().url()).searchParams.get('cursor');
      cursors.push(cursor);
      return route.fulfill({
        json: cursor
          ? { items: [{ ...application, id: 'last-application', number: '500' }], nextCursor: null }
          : { items, nextCursor: 'last' },
      });
    });

    await page.goto('/applications');
    const firstRow = page.locator('tbody tr[data-index="0"]');
    const mountedRows = page.locator('tbody tr[data-index]');
    await expect(firstRow).toContainText('1000');
    await expect(page.getByRole('table')).toHaveAttribute('aria-rowcount', '-1');
    expect(await mountedRows.count()).toBeLessThan(30);
    expect(cursors).toEqual([null]);

    await expect(async () => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(page.locator('tbody tr[data-index="500"]')).toBeInViewport();
    }).toPass({ timeout: 15_000 });
    expect(cursors).toEqual([null, 'last']);
    const headerRowCount = viewport.width >= 768 ? 2 : 0;
    await expect(page.getByRole('table')).toHaveAttribute('aria-rowcount', String(501 + headerRowCount));
    await expect(page.getByRole('row')).toHaveCount((await mountedRows.count()) + headerRowCount);
    expect(await mountedRows.count()).toBeLessThan(30);
    await expect(firstRow).toHaveCount(0);

    // A jump into unmeasured, mixed-height rows must leave the viewport covered.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await expect
      .poll(() =>
        mountedRows.evaluateAll((rows) =>
          rows.some((row) => {
            const rect = row.getBoundingClientRect();
            return rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
          })
        )
      )
      .toBe(true);
    expect(await mountedRows.count()).toBeLessThan(30);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(firstRow).toContainText('1000');
    await expect(firstRow).toBeInViewport();
    expect(await mountedRows.count()).toBeLessThan(30);
  });
}

test('number, date and same-named manager filters send exact values', async ({ page }) => {
  await seedAuthenticatedAdmin(page);
  const otherManager = {
    ...application.mainManager,
    id: '33333333-3333-3333-3333-333333333333',
    email: 'other@example.com',
  };
  await page.route(`${API_URL}/v2/applications/managers`, (route) =>
    route.fulfill({ json: [application.mainManager, otherManager] })
  );
  let params = new URLSearchParams();
  await page.route(`${API_URL}/v2/applications?*`, (route) => {
    params = new URL(route.request().url()).searchParams;
    return route.fulfill({ json: { items: [application], nextCursor: null } });
  });
  await page.goto('/applications');
  await page.getByRole('button', { name: 'Nr', exact: true }).click();
  await page.getByLabel('Numer zgłoszenia').fill('17');
  await expect.poll(() => params.get('number')).toBe('17');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Data', exact: true }).click();
  await page.getByLabel('Data zgłoszenia').fill('2026-05-16');
  await expect.poll(() => params.get('date')).toBe('2026-05-16');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Kierownik', exact: true }).click();
  await page.getByLabel('Szukaj').fill('other@example.com');
  await page.getByRole('menuitem', { name: 'Ada Lovelace (other@example.com)' }).click();
  await expect.poll(() => params.getAll('cruiseManager')).toEqual([otherManager.id]);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Wyczyść filtry', exact: true }).click();
  await expect.poll(() => params.has('cruiseManager') || params.has('number') || params.has('date')).toBe(false);
  await page.getByRole('button', { name: 'Kierownik', exact: true }).click();
  await expect(
    page.getByRole('menuitem', { name: 'Ada Lovelace (other@example.com)' }).getByRole('checkbox')
  ).not.toBeChecked();
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
