import { test, expect } from './fixtures';
import { admin } from '../data/accounts';
import { application } from '../data/cruises';
import { applicationId, formA, formOptions } from '../data/forms';

test.describe('application table', () => {
  test.use({ account: admin });
  test.beforeEach(async ({ api }) => {
    await api('GET', '/v2/applications/managers', (route) => route.fulfill({ json: [application().mainManager] }));
  });

  test('continues through an empty cursor page and resets pagination when sorted', async ({ page, api }) => {
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
  });

  test('filters by number and clears both the filter and its displayed results', async ({ page, api }) => {
    let params = new URLSearchParams();
    await api('GET', '/v2/applications?*', (route) => {
      params = new URL(route.request().url()).searchParams;
      return route.fulfill({
        json: { items: params.has('number') ? [] : [application()], nextCursor: null },
      });
    });
    await page.goto('/applications');
    await expect(page.getByRole('cell', { name: '2026/17', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Nr', exact: true }).click();
    await page.getByLabel('Numer zgłoszenia').fill('999');
    await expect(page.getByRole('cell', { name: '2026/17', exact: true })).toHaveCount(0);
    expect(params.get('number')).toBe('999');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Wyczyść filtry', exact: true }).click();
    await expect(page.getByRole('cell', { name: '2026/17', exact: true })).toBeVisible();
    expect(params.has('number')).toBe(false);
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
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(first).toBeInViewport();
    });
  }
});

for (const accept of [true, false]) {
  test(`supervisor ${accept ? 'accepts' : 'rejects'} an application using the review link`, async ({ page, api }) => {
    let loads = 0;
    await api('GET', `/v2/applications/${applicationId}/supervisor-review?*`, (route) => {
      loads++;
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
    expect(loads).toBe(1);
    await page.getByRole('button', { name: accept ? 'Zaakceptuj' : 'Odrzuć', exact: true }).click();
    await expect.poll(() => decision).toEqual({ accept, code: 'review-token' });
    await expect(page).toHaveURL('/login?redirect=%2F');
  });
}
