import { getGetApplicationsForCruisePlanningMockHandler } from '@/api/generated/mocks/applications/applications.msw.gen';
import {
  getCompleteCruiseMockHandler,
  getCreateCruiseMockHandler,
  getDeleteCruiseMockHandler,
  getGetCruiseMockHandler,
  getGetCruisesMockHandler,
  getUpdateCruiseMockHandler,
} from '@/api/generated/mocks/cruises/cruises.msw.gen';
import { getGetAvailableCruiseManagersMockHandler } from '@/api/generated/mocks/users/users.msw.gen';
import type { CruiseResponse } from '@/api/generated/schemas';
import { test, expect, fail } from './fixtures';
import { admin, deputy, manager } from '../data/accounts';
import { cruise } from '../data/cruises';

test.use({ account: admin });
test.beforeEach(({ network }) =>
  network.use(
    getGetApplicationsForCruisePlanningMockHandler([]),
    getGetAvailableCruiseManagersMockHandler([admin, deputy])
  )
);

const confirmed = (): CruiseResponse => ({ ...cruise(), status: 'confirmed' });

test('cruise deletion requires confirmation and removes the row after saving', async ({ page, network, requests }) => {
  const item = cruise();
  network.use(
    getGetCruisesMockHandler([item]),
    getDeleteCruiseMockHandler(() => network.use(getGetCruisesMockHandler([])))
  );
  await page.goto('/cruises');
  const row = page.getByRole('row').filter({ hasText: item.title! });
  const dialog = page.getByRole('dialog');

  await row.getByRole('button', { name: 'Usuń', exact: true }).click();
  await expect(dialog).toContainText(item.number);
  await dialog.getByRole('button', { name: 'Anuluj' }).click();
  await expect(dialog).toBeHidden();
  await expect(row).toBeVisible();
  expect(requests.bodies(`DELETE /v2/cruises/${item.id}`)).toEqual([]);

  await row.getByRole('button', { name: 'Usuń', exact: true }).click();
  await dialog.getByRole('button', { name: `Usuń rejs nr. ${item.number}` }).click();
  await expect(row).toHaveCount(0);
  expect(requests.bodies(`DELETE /v2/cruises/${item.id}`)).toHaveLength(1);
});

test('a new cruise is saved with Warsaw-midnight dates and the chosen managers', async ({
  page,
  network,
  requests,
}) => {
  // Fix only the date; faked timers would also stall the comboboxes' transitions.
  await page.clock.setFixedTime(new Date('2026-05-16T12:00:00Z'));
  network.use(getGetCruisesMockHandler([]), getCreateCruiseMockHandler());
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
    .poll(() => requests.bodies('POST /v2/cruises'))
    .toEqual([
      {
        startDate: '2026-05-16T22:00:00.000Z',
        endDate: '2026-05-17T22:00:00.000Z',
        mainManagerId: manager.id,
        deputyManagerId: deputy.id,
        cruiseApplicationIds: [],
        title: null,
        shipUnavailable: false,
      },
    ]);
});

test('rejected cruise edits show field and general errors, keep the edits and can be resaved', async ({
  page,
  network,
  requests,
}) => {
  const item = confirmed();
  const problem = {
    errors: {
      deputyManagerId: ['Zastępca jest niedostępny w tym terminie'],
      '': ['Stan rejsu zmienił się. Spróbuj ponownie.'],
    },
  };
  network.use(
    getGetCruiseMockHandler(item),
    getUpdateCruiseMockHandler(fail(400, problem), { once: true }),
    getUpdateCruiseMockHandler()
  );
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
  expect(requests.bodies(`PATCH /v2/cruises/${item.id}`).at(-1)).toEqual({
    startDate: item.startDate,
    endDate: item.endDate,
    mainManagerId: manager.id,
    deputyManagerId: deputy.id,
    cruiseApplicationIds: [],
    title: 'Nowy tytuł',
    shipUnavailable: false,
  });
});

test('completing a confirmed cruise updates its visible status', async ({ page, network }) => {
  const item = confirmed();
  network.use(
    getGetCruiseMockHandler(item),
    getCompleteCruiseMockHandler(() => network.use(getGetCruiseMockHandler({ ...item, status: 'ended' })))
  );
  await page.goto(`/cruises/${item.id}`);
  await page.getByRole('button', { name: 'Zakończ rejs', exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /Oznacz rejs nr\./ })
    .click();
  await expect(page.getByText('Zakończony', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Zakończ rejs', exact: true })).toHaveCount(0);
});
