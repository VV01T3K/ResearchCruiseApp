import { test, expect } from './fixtures';
import { admin } from '../data/accounts';
import { application, evaluation } from '../data/cruises';
import { applicationId, formA, formOptions } from '../data/forms';

test.describe('application table', () => {
  test.use({ account: admin });
  test.beforeEach(async ({ api }) => {
    await api('GET', '/v2/applications/managers', (route) => route.fulfill({ json: [application().mainManager] }));
  });

  test('continues through an empty cursor page and resets pagination when sorted or filtered by year', async ({
    page,
    api,
  }) => {
    const requests: URLSearchParams[] = [];
    await api('GET', '/v2/applications?*', (route) => {
      const params = new URL(route.request().url()).searchParams;
      requests.push(params);
      if (params.get('descending') === 'false')
        return route.fulfill({ json: { items: [application()], nextCursor: null } });
      if (params.get('cursor') === 'empty') return route.fulfill({ json: { items: [], nextCursor: 'last' } });
      if (params.get('cursor') === 'last')
        return route.fulfill({
          json: { items: [{ ...application(), number: 'Last page' }], nextCursor: null },
        });
      return route.fulfill({ json: { items: [], nextCursor: 'empty' } });
    });
    await page.goto('/applications');
    await expect(page.getByRole('cell', { name: 'Last page', exact: true })).toBeVisible();
    expect(requests.map((params) => params.get('cursor'))).toEqual([null, 'empty', 'last']);
    await page.getByRole('button', { name: 'Nr', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Sortuj rosnąco' }).click();
    await expect(page.getByRole('cell', { name: '2026/17', exact: true })).toBeVisible();
    expect(requests.at(-1)?.get('descending')).toBe('false');
    expect(requests.at(-1)?.has('cursor')).toBe(false);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Rok rejsu', exact: true }).click();
    await page.getByRole('menuitem', { name: '2026', exact: true }).click();
    await expect.poll(() => requests.at(-1)?.get('year')).toBe('2026');
    expect(requests.at(-1)?.has('cursor')).toBe(false);
    await expect(page.getByRole('cell', { name: '2026/17', exact: true })).toBeVisible();
  });

  test('filters send exact values, tell same-named managers apart, and clear together', async ({ page, api }) => {
    const other = {
      ...application().mainManager,
      id: '55555555-5555-4555-8555-555555555555',
      email: 'other@example.com',
    };
    await api('GET', '/v2/applications/managers', (route) =>
      route.fulfill({ json: [application().mainManager, other] })
    );
    let params = new URLSearchParams();
    await api('GET', '/v2/applications?*', (route) => {
      params = new URL(route.request().url()).searchParams;
      return route.fulfill({ json: { items: params.has('number') ? [] : [application()], nextCursor: null } });
    });
    await page.goto('/applications');
    await expect(page.getByRole('cell', { name: '2026/17', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Nr', exact: true }).click();
    await page.getByLabel('Numer zgłoszenia').fill('999');
    await expect(page.getByRole('cell', { name: '2026/17', exact: true })).toHaveCount(0);
    expect(params.get('number')).toBe('999');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Kierownik', exact: true }).click();
    await page.getByLabel('Szukaj').fill('other@example.com');
    await page.getByRole('menuitem', { name: `${other.firstName} ${other.lastName} (other@example.com)` }).click();
    await expect.poll(() => params.getAll('cruiseManager')).toEqual([other.id]);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Wyczyść filtry', exact: true }).click();
    await expect(page.getByRole('cell', { name: '2026/17', exact: true })).toBeVisible();
    expect(params.has('number') || params.has('cruiseManager')).toBe(false);
  });

  for (const width of [1440, 390]) {
    test(`large lists remain bounded and reachable at ${width}px`, async ({ page, api }) => {
      await page.setViewportSize({ width, height: 900 });
      const items = Array.from({ length: 500 }, (_, i) => ({
        ...application(),
        id: `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`,
        number: `Application ${i}`,
        status: 'draft',
        note: i % 2 ? 'Pomiary na Bałtyku. '.repeat(12) : null,
      }));
      await api('GET', '/v2/applications?*', (route) => route.fulfill({ json: { items, nextCursor: null } }));
      await page.goto('/applications');
      const first = page.getByText('Application 0', { exact: true });
      const last = page.getByText('Application 499', { exact: true });
      await expect(first).toBeVisible();
      await expect(
        page
          .getByRole('cell')
          .filter({ hasText: 'Pomiary na Bałtyku. '.repeat(12).trim() })
          .first()
      ).toBeVisible();
      await expect(page.getByRole('table')).toHaveAttribute('aria-rowcount', String(500 + (width >= 768 ? 2 : 0)));
      expect(await page.getByRole('row').count()).toBeLessThan(35);
      await expect(async () => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(last).toBeInViewport({ timeout: 250 });
      }).toPass({ timeout: 5_000 });
      expect(await page.getByRole('row').count()).toBeLessThan(35);
      await expect(first).toHaveCount(0);
      // A jump into unmeasured rows of mixed height must still leave the viewport covered.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await expect
        .poll(() =>
          page.getByRole('row').evaluateAll((rows) =>
            rows.some((row) => {
              const { top, bottom } = row.getBoundingClientRect();
              return top < innerHeight / 2 && bottom > innerHeight / 2;
            })
          )
        )
        .toBe(true);
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(first).toBeInViewport();
    });
  }

  test('a laptop-width table needs no horizontal scrolling and keeps row actions visible', async ({ page, api }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const statuses = ['draft', 'formBRequired', 'undertaken'] as const;
    const items = statuses.map((status, i) => ({
      ...application(),
      id: `00000000-0000-4000-8000-00000000000${i}`,
      mainManager: { ...admin, firstName: 'Małgorzata', lastName: 'Wiśniewska-Kowalczyk' },
      hasFormB: true,
      points: 100,
      status,
      startDate: '2026-06-20T08:00:00Z',
      endDate: '2026-06-30T16:00:00Z',
    }));
    await api('GET', '/v2/applications?*', (route) => route.fulfill({ json: { items, nextCursor: null } }));
    await page.goto('/applications');
    const actions = ['Kontynuuj wypełnianie', 'Wypełnij', 'Wypełnij formularz C'].map((name) =>
      page.getByRole('link', { name, exact: true })
    );
    for (const action of [...actions, page.getByRole('link', { name: /Szczegóły/ }).first()]) {
      // Scrolling vertically leaves only horizontal clipping to reduce the visible ratio.
      await action.scrollIntoViewIfNeeded();
      await expect(action).toBeInViewport({ ratio: 1 });
    }
    const overflow = await page.getByRole('table').evaluate((table) => {
      const container = table.parentElement!;
      return container.scrollWidth - container.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('application review', () => {
  test.use({ account: admin });

  test('the office accepts or rejects an application after confirming the rejection', async ({ page, api }) => {
    await api('GET', `/v2/applications/${applicationId}`, (route) => route.fulfill({ json: application() }));
    await api('GET', `/v2/applications/${applicationId}/evaluation`, (route) => route.fulfill({ json: evaluation() }));
    const decisions: unknown[] = [];
    await api('PUT', `/v2/applications/${applicationId}/decision`, async (route) => {
      decisions.push(route.request().postDataJSON());
      await route.fulfill({ status: 204 });
    });
    await page.goto(`/applications/${applicationId}/details`);
    await page.getByRole('button', { name: 'Zaakceptuj zgłoszenie' }).click();
    await expect.poll(() => decisions).toEqual([{ accept: true }]);
    await page.getByRole('button', { name: 'Odrzuć zgłoszenie' }).click();
    expect(decisions).toHaveLength(1);
    await page.getByRole('button', { name: 'Potwierdź odrzucenie' }).click();
    await expect.poll(() => decisions).toEqual([{ accept: true }, { accept: false }]);
    await expect(page.getByRole('button', { name: 'Potwierdź odrzucenie' })).toHaveCount(0);
  });
});

for (const accept of [true, false]) {
  test(`supervisor ${accept ? 'accepts' : 'rejects'} an application using the review link`, async ({ page, api }) => {
    await api('GET', `/v2/applications/${applicationId}/supervisor-review?*`, (route) => {
      expect(new URL(route.request().url()).searchParams.get('code')).toBe('review-token');
      return route.fulfill({ json: { form: formA(), initValues: formOptions() } });
    });
    let decision: unknown;
    await api('PUT', `/v2/applications/${applicationId}/supervisor-review/decision`, async (route) => {
      decision = route.request().postDataJSON();
      await route.fulfill({ status: 204 });
    });
    await page.goto(`/cruise-approval?cruiseApplicationId=${applicationId}&supervisorCode=review-token`);
    await expect(page.getByRole('button', { name: 'Zaakceptuj', exact: true })).toBeVisible();
    await page.getByRole('button', { name: accept ? 'Zaakceptuj' : 'Odrzuć', exact: true }).click();
    await expect.poll(() => decision).toEqual({ accept, code: 'review-token' });
    await expect(page).toHaveURL('/login?redirect=%2F');
  });
}

test('the supervisor sees precise cruise dates on the days the manager chose', async ({ page, api }) => {
  await api('GET', `/v2/applications/${applicationId}/supervisor-review?*`, (route) =>
    route.fulfill({
      json: {
        form: {
          ...formA(),
          periodSelectionType: 'precise',
          acceptablePeriod: null,
          optimalPeriod: null,
          precisePeriodStart: '2026-06-01T00:00:00',
          precisePeriodEnd: '2026-06-03T00:00:00',
        },
        initValues: formOptions(),
      },
    })
  );
  await page.goto(`/cruise-approval?cruiseApplicationId=${applicationId}&supervisorCode=review-token`);
  await expect(page.getByRole('button', { name: 'Dokładny termin rozpoczęcia rejsu' })).toContainText('01.06.2026');
  await expect(page.getByRole('button', { name: 'Dokładny termin zakończenia rejsu' })).toContainText('03.06.2026');
});
