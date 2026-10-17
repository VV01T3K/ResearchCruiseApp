import {
  getGetApplicationEvaluationMockHandler,
  getGetApplicationManagersMockHandler,
  getGetApplicationMockHandler,
  getGetApplicationsMockHandler,
  getGetApplicationSupervisorReviewMockHandler,
  getUpdateApplicationDecisionMockHandler,
  getUpdateApplicationSupervisorReviewDecisionMockHandler,
} from '@/api/generated/mocks/applications/applications.msw.gen';
import type { Page } from '@playwright/test';
import type { ApplicationResponse, ResearchTaskFields } from '@/api/generated/schemas';
import { test, expect } from './fixtures';
import { admin, managerAccount, publication } from '../data/accounts';
import { application, evaluation } from '../data/cruises';
import { applicationId, formA, formOptions } from '../data/forms';

const listPage = (items: ApplicationResponse[], nextCursor: string | null = null) => ({ items, nextCursor });
const listRequests = 'GET /v2/applications';

test.describe('application table', () => {
  test.use({ account: admin });
  test.beforeEach(({ network }) => network.use(getGetApplicationManagersMockHandler([application().mainManager])));

  const changes = {
    sorted: async (page: Page) => {
      await page.getByRole('button', { name: 'Nr', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Sortuj rosnąco' }).click();
    },
    'filtered by year': async (page: Page) => {
      await page.getByRole('button', { name: 'Rok rejsu', exact: true }).click();
      await page.getByRole('menuitem', { name: '2026', exact: true }).click();
    },
  };

  for (const [change, apply] of Object.entries(changes)) {
    test(`continues through an empty cursor page and restarts from the first page when ${change}`, async ({
      page,
      network,
      requests,
    }) => {
      const pages: Record<string, ReturnType<typeof listPage>> = {
        first: listPage([], 'empty'),
        empty: listPage([], 'last'),
        last: listPage([{ ...application(), number: 'Last page' }]),
      };
      network.use(
        getGetApplicationsMockHandler(({ request }) => {
          const query = new URL(request.url).searchParams;
          if (query.get('descending') === 'false' || query.has('year')) return listPage([application()]);
          return pages[query.get('cursor') ?? 'first'];
        })
      );
      await page.goto('/applications');
      await expect(page.getByRole('cell', { name: 'Last page', exact: true })).toBeVisible();
      expect(requests.queries(listRequests).map((query) => query.cursor ?? null)).toEqual([null, 'empty', 'last']);

      await apply(page);
      await expect(page.getByRole('cell', { name: '2026/17', exact: true })).toBeVisible();
      expect(requests.queries(listRequests).at(-1)).not.toHaveProperty('cursor');
      expect(requests.queries(listRequests).at(-1)).toMatchObject(
        change === 'sorted' ? { descending: 'false' } : { year: '2026' }
      );
    });
  }

  test('filters send exact values, tell same-named managers apart, and clear together', async ({
    page,
    network,
    requests,
  }) => {
    const other = {
      ...application().mainManager,
      id: '55555555-5555-4555-8555-555555555555',
      email: 'other@example.com',
    };
    network.use(
      getGetApplicationManagersMockHandler([application().mainManager, other]),
      getGetApplicationsMockHandler(({ request }) =>
        listPage(new URL(request.url).searchParams.has('number') ? [] : [application()])
      )
    );
    await page.goto('/applications');
    await expect(page.getByRole('cell', { name: '2026/17', exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Nr', exact: true }).click();
    await page.getByLabel('Numer zgłoszenia').fill('999');
    await expect(page.getByRole('cell', { name: '2026/17', exact: true })).toHaveCount(0);
    expect(requests.queries(listRequests).at(-1)).toMatchObject({ number: '999' });
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Kierownik', exact: true }).click();
    await page.getByLabel('Szukaj').fill('other@example.com');
    await page.getByRole('menuitem', { name: `${other.firstName} ${other.lastName} (other@example.com)` }).click();
    await expect.poll(() => requests.queries(listRequests).at(-1)).toMatchObject({ cruiseManager: other.id });
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Wyczyść filtry', exact: true }).click();
    await expect(page.getByRole('cell', { name: '2026/17', exact: true })).toBeVisible();
    expect(requests.queries(listRequests).at(-1)).not.toHaveProperty('number');
    expect(requests.queries(listRequests).at(-1)).not.toHaveProperty('cruiseManager');
  });

  for (const width of [1440, 390]) {
    test(`large lists remain bounded and reachable at ${width}px`, async ({ page, network }) => {
      await page.setViewportSize({ width, height: 900 });
      const note = 'Pomiary na Bałtyku. '.repeat(12).trim();
      const items = Array.from({ length: 500 }, (_, i) => ({
        ...application(),
        id: `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`,
        number: `Application ${i}`,
        status: 'draft' as const,
        note: i % 2 ? note : null,
      }));
      network.use(getGetApplicationsMockHandler(listPage(items)));
      await page.goto('/applications');
      const first = page.getByText('Application 0', { exact: true });
      const last = page.getByText('Application 499', { exact: true });
      const rows = page.getByRole('row');
      await expect(first).toBeVisible();
      await expect(page.getByRole('cell').filter({ hasText: note }).first()).toBeVisible();
      await expect(page.getByRole('table')).toHaveAttribute('aria-rowcount', String(500 + (width >= 768 ? 2 : 0)));
      expect(await rows.count()).toBeLessThan(35);

      await expect(async () => {
        await page.mouse.wheel(0, 100_000);
        await expect(last).toBeInViewport({ timeout: 250 });
      }).toPass({ timeout: 5_000 });
      expect(await rows.count()).toBeLessThan(35);
      await expect(first).toHaveCount(0);

      // A jump into unmeasured rows of mixed height must still leave the viewport covered.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await expect
        .poll(() =>
          rows.evaluateAll((all) =>
            all.some((row) => {
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

  test('a laptop-width table needs no horizontal scrolling and keeps row actions visible', async ({
    page,
    network,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const items = (['draft', 'formBRequired', 'undertaken'] as const).map((status, i) => ({
      ...application(),
      id: `00000000-0000-4000-8000-00000000000${i}`,
      mainManager: { ...admin, firstName: 'Małgorzata', lastName: 'Wiśniewska-Kowalczyk' },
      hasFormB: true,
      points: 100,
      status,
      startDate: '2026-06-20T08:00:00Z',
      endDate: '2026-06-30T16:00:00Z',
    }));
    network.use(getGetApplicationsMockHandler(listPage(items)));
    await page.goto('/applications');
    const actions = ['Kontynuuj wypełnianie', 'Wypełnij', 'Wypełnij formularz C'].map((name) =>
      page.getByRole('link', { name, exact: true })
    );
    for (const action of [...actions, page.getByRole('link', { name: /Szczegóły/ }).first()]) {
      // Scrolling it into view vertically leaves only horizontal clipping to hide part of it.
      await action.scrollIntoViewIfNeeded();
      await expect(action).toBeInViewport({ ratio: 1 });
    }
    const overflow = await page.getByRole('table').evaluate((table) => {
      const container = table.parentElement!;
      return container.scrollWidth - container.clientWidth;
    });
    expect(overflow, 'horizontal scrolling inside the table container').toBeLessThanOrEqual(0);
  });
});

test.describe('application review', () => {
  test.use({ account: admin });

  test('the details label a deleted deputy as unknown, without an empty email', async ({ page, network }) => {
    const deleted = { id: application().deputyManager.id, email: '', firstName: '', lastName: '' };
    network.use(
      getGetApplicationEvaluationMockHandler(evaluation()),
      getGetApplicationMockHandler({ ...application(), deputyManager: deleted })
    );
    await page.goto(`/applications/${applicationId}/details`);

    await expect(page.locator('input[name="cruiseLeader"]')).toHaveValue('Ada Lovelace (ada@example.com)');
    await expect(page.locator('input[name="deputyManager"]')).toHaveValue('Nieznany użytkownik');
  });

  test('the details leave the deputy empty when none is assigned', async ({ page, network }) => {
    // The API sends an application without a deputy as a person with the all-zero id and no name.
    const unassigned = { id: '00000000-0000-0000-0000-000000000000', email: '', firstName: '', lastName: '' };
    network.use(
      getGetApplicationEvaluationMockHandler(evaluation()),
      getGetApplicationMockHandler({ ...application(), deputyManager: unassigned })
    );
    await page.goto(`/applications/${applicationId}/details`);

    await expect(page.locator('input[name="cruiseLeader"]')).toHaveValue('Ada Lovelace (ada@example.com)');
    await expect(page.locator('input[name="deputyManager"]')).toHaveValue('');
  });

  test('the office accepts or rejects an application after confirming the rejection', async ({
    page,
    network,
    requests,
  }) => {
    network.use(
      getGetApplicationEvaluationMockHandler(evaluation()),
      getGetApplicationMockHandler(application()),
      getUpdateApplicationDecisionMockHandler()
    );
    const decisions = () => requests.bodies(`PUT /v2/applications/${applicationId}/decision`);
    await page.goto(`/applications/${applicationId}/details`);
    await page.getByRole('button', { name: 'Zaakceptuj zgłoszenie' }).click();
    await expect.poll(decisions).toEqual([{ accept: true }]);

    await page.getByRole('button', { name: 'Odrzuć zgłoszenie' }).click();
    expect(decisions()).toHaveLength(1);
    await page.getByRole('button', { name: 'Potwierdź odrzucenie' }).click();
    await expect.poll(decisions).toEqual([{ accept: true }, { accept: false }]);
    await expect(page.getByRole('button', { name: 'Potwierdź odrzucenie' })).toHaveCount(0);
  });

  test('the evaluation shows every scored item with its details and points', async ({ page, network }) => {
    const task = (points: string, researchTask: ResearchTaskFields) => ({ id: `t${points}`, points, researchTask });
    network.use(
      getGetApplicationMockHandler(application()),
      getGetApplicationEvaluationMockHandler({
        ...evaluation(),
        formAResearchTasks: [
          task('11', { type: '0', author: 'Anna Nowak', title: 'Praca o fokach' }),
          task('12', { type: '3', title: 'Wniosek NCN', date: '2026-03-01', financingApproved: 'true' }),
          task('13', {
            type: '4',
            title: 'Projekt krajowy',
            startDate: '2026-01',
            endDate: '2026-12',
            financingAmount: '1500',
            securedAmount: '200',
          }),
          task('14', { type: '9', description: 'Zajęcia terenowe' }),
          task('15', {
            type: '10',
            title: 'Własne badania',
            date: '2026-05-01',
            magazine: 'Oceanologia',
            ministerialPoints: '70',
          }),
          task('16', { type: '11', description: 'Inne badania' }),
        ],
        formAContracts: [
          {
            id: 'c1',
            points: '21',
            contract: {
              category: 'international',
              institutionName: 'Instytut Morski',
              institutionUnit: 'Zakład Biologii',
              institutionLocalization: 'Gdynia',
              description: 'Umowa ramowa',
              scans: [],
            },
          },
        ],
        formAPublications: [
          {
            id: 'p1',
            points: '31',
            publication: {
              ...publication(),
              doi: '10.1000/abc',
              authors: 'Kowalski J.',
              title: 'Bałtyk',
              year: '2024',
            },
          },
        ],
        formASpubTasks: [
          { id: 's1', points: '41', spubTask: { name: 'Monitoring', yearFrom: '2020', yearTo: '2025' } },
        ],
      })
    );
    // What each row shows, by the points awarded in it.
    const rows = {
      '11': ['Praca licencjacka', 'Anna Nowak', 'Praca o fokach'],
      '12': ['Przygotowanie projektu naukowego', 'Wniosek NCN', 'Tak'],
      '13': ['Realizacja projektu krajowego (NCN, NCBiR, itp.)', 'Projekt krajowy', '1500', '200'],
      '14': ['Dydaktyka', 'Zajęcia terenowe'],
      '15': ['Realizacja własnego zadania badawczego', 'Własne badania', 'Oceanologia', '70'],
      '16': ['Inne zadanie', 'Inne badania'],
      '21': ['Międzynarodowa', 'Instytut Morski', 'Zakład Biologii', 'Gdynia', 'Umowa ramowa'],
      '31': ['10.1000/abc', 'Kowalski J.', 'Bałtyk', '2024', '100'],
      '41': ['Monitoring', '2020', '2025'],
    };
    await page.goto(`/applications/${applicationId}/details`);

    for (const [points, texts] of Object.entries(rows)) {
      const row = page.getByRole('row').filter({ has: page.getByRole('cell', { name: points, exact: true }) });
      await expect(row).toHaveCount(1);
      for (const text of texts) {
        const shown = row
          .getByText(text, { exact: true })
          .or(row.getByRole('button', { name: text, exact: true }))
          // Dropdowns keep their value in a hidden input as well; only the visible control counts.
          .or(row.locator(`[value="${text}"]:not([type="hidden"])`));
        await expect(shown.first()).toBeVisible();
      }
    }
  });

  test.describe(() => {
    test.use({ account: managerAccount });

    test('the cruise manager sees the application but cannot decide on it', async ({ page, network }) => {
      network.use(getGetApplicationEvaluationMockHandler(evaluation()), getGetApplicationMockHandler(application()));
      await page.goto(`/applications/${applicationId}/details`);
      await expect(page.getByLabel('Numer zgłoszenia:')).toHaveValue('2026/17');
      await expect(page.getByRole('button', { name: /zgłoszenie$/ })).toHaveCount(0);
    });
  });
});

test.describe('supervisor review link', () => {
  const reviewLink = `/cruise-approval?cruiseApplicationId=${applicationId}&supervisorCode=review-token`;

  for (const accept of [true, false]) {
    test(`the supervisor ${accept ? 'accepts' : 'rejects'} an application`, async ({ page, network, requests }) => {
      network.use(
        getGetApplicationSupervisorReviewMockHandler({ form: formA(), initValues: formOptions() }),
        getUpdateApplicationSupervisorReviewDecisionMockHandler()
      );
      await page.goto(reviewLink);
      await page.getByRole('button', { name: accept ? 'Zaakceptuj' : 'Odrzuć', exact: true }).click();
      await expect(page).toHaveURL('/login?redirect=%2F');
      expect(requests.queries(`GET /v2/applications/${applicationId}/supervisor-review`)[0]).toEqual({
        code: 'review-token',
      });
      expect(requests.bodies(`PUT /v2/applications/${applicationId}/supervisor-review/decision`)).toEqual([
        { accept, code: 'review-token' },
      ]);
    });
  }

  test('the supervisor sees precise cruise dates on the days the manager chose', async ({ page, network }) => {
    const form = {
      ...formA(),
      periodSelectionType: 'precise',
      acceptablePeriod: null,
      optimalPeriod: null,
      precisePeriodStart: '2026-06-01T00:00:00',
      precisePeriodEnd: '2026-06-03T00:00:00',
    };
    network.use(getGetApplicationSupervisorReviewMockHandler({ form, initValues: formOptions() }));
    await page.goto(reviewLink);
    await expect(page.getByRole('button', { name: 'Dokładny termin rozpoczęcia rejsu' })).toContainText('01.06.2026');
    await expect(page.getByRole('button', { name: 'Dokładny termin zakończenia rejsu' })).toContainText('03.06.2026');
  });
});
