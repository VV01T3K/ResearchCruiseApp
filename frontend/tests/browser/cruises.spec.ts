import { getGetApplicationsForCruisePlanningMockHandler } from '@/api/generated/mocks/applications/applications.msw.gen';
import { readFile } from 'node:fs/promises';
import {
  getAutoPlanCruisesMockHandler,
  getCompleteCruiseMockHandler,
  getConfirmCruiseMockHandler,
  getCreateCruiseMockHandler,
  getDeleteCruiseMockHandler,
  getExportCruisesMockHandler,
  getGetCruiseMockHandler,
  getGetCruisesMockHandler,
  getRemoveCruiseConfirmationMockHandler,
  getUpdateCruiseMockHandler,
} from '@/api/generated/mocks/cruises/cruises.msw.gen';
import { getGetAvailableCruiseManagersMockHandler } from '@/api/generated/mocks/users/users.msw.gen';
import type { CruiseResponse } from '@/api/generated/schemas';
import { test, expect, fail } from './fixtures';
import { admin, deputy, manager, managerAccount, outsider } from '../data/accounts';
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
  expect(requests.bodies(`DELETE /v2/cruises/${item.id}`)).toHaveLength(0);

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

test('a cruise manager who is no longer available keeps their name, without an empty email', async ({
  page,
  network,
}) => {
  const item = cruise();
  network.use(getGetCruiseMockHandler(item), getGetAvailableCruiseManagersMockHandler([admin]));
  await page.goto(`/cruises/${item.id}`);
  const deputyManager = page.getByRole('combobox', { name: 'Zastępca kierownika głównego' });

  await expect(deputyManager).toHaveText('Grace Hopper');
  await page.getByRole('button', { name: 'Edytuj', exact: true }).click();
  await expect(deputyManager).toHaveText('Grace Hopper');
});

test('a cruise without assigned managers offers no blank manager choice', async ({ page, network }) => {
  const unassigned = { id: '00000000-0000-0000-0000-000000000000', firstName: '', lastName: '' };
  const item = { ...cruise(), mainManager: unassigned, deputyManager: unassigned };
  network.use(getGetCruiseMockHandler(item));
  await page.goto(`/cruises/${item.id}`);
  const main = page.getByRole('combobox', { name: 'Kierownik główny' });

  await page.getByRole('button', { name: 'Edytuj', exact: true }).click();
  await expect(main).toHaveText('Wybierz kierownika głównego');
  await main.click();
  await expect(page.getByRole('option')).toHaveCount(2);
  await expect(page.getByRole('option', { name: 'Nieznany użytkownik' })).toHaveCount(0);
});

test('a saved manager change is labelled by the new id before the cruise is refetched', async ({
  page,
  network,
  requests,
}) => {
  const item = cruise();
  // The cruise response stays stale after the save, still naming the old deputy.
  network.use(
    getGetCruiseMockHandler(item),
    getUpdateCruiseMockHandler(),
    getGetAvailableCruiseManagersMockHandler([admin, deputy, outsider])
  );
  await page.goto(`/cruises/${item.id}`);
  const deputyManager = page.getByRole('combobox', { name: 'Zastępca kierownika głównego' });
  await page.getByRole('button', { name: 'Edytuj', exact: true }).click();
  await deputyManager.click();
  await page.getByRole('option', { name: `${outsider.firstName} ${outsider.lastName}` }).click();
  await page.getByRole('button', { name: 'Zapisz rejs' }).click();

  await expect(page.getByRole('button', { name: 'Edytuj', exact: true })).toBeVisible();
  expect(requests.bodies(`PATCH /v2/cruises/${item.id}`)).toEqual([
    expect.objectContaining({ mainManagerId: manager.id, deputyManagerId: outsider.id }),
  ]);
  await expect(deputyManager).toHaveText('Alan Turing (alan@example.com)');
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
    revision: item.revision,
  });
});

test('cruise edits ask before leaving until they are saved', async ({ page, network }) => {
  const item = cruise();
  network.use(getGetCruiseMockHandler(item), getUpdateCruiseMockHandler());
  await page.goto(`/cruises/${item.id}`);
  const title = page.locator('input[name="title"]');
  const dialog = page.getByRole('dialog', { name: 'Niezapisane zmiany' });
  const goHome = () => page.getByRole('link', { name: 'Portal rejsów badawczych R/V Oceanograf' }).click();

  await page.getByRole('button', { name: 'Edytuj', exact: true }).click();
  await title.fill('Nowy tytuł');
  await goHome();
  await dialog.getByRole('button', { name: 'Zostań na stronie' }).click();
  await expect(title).toHaveValue('Nowy tytuł');

  await page.getByRole('button', { name: 'Zapisz rejs' }).click();
  await page.getByRole('button', { name: 'Edytuj', exact: true }).click();
  await title.fill('Inny tytuł');
  await page.getByRole('button', { name: 'Anuluj', exact: true }).click();
  await page.getByRole('dialog', { name: 'Odrzucić zmiany?' }).getByRole('button', { name: 'Odrzuć zmiany' }).click();
  await page.getByRole('button', { name: 'Edytuj', exact: true }).click();
  await expect(title).toHaveValue('Nowy tytuł');
  await goHome();
  await expect(page).toHaveURL('/');
  await expect(dialog).toHaveCount(0);
});

test('discarding cruise edits asks only when the form has changes and lands on the server version after a conflict', async ({
  page,
  network,
  requests,
}) => {
  const item = cruise();
  let server = item;
  network.use(
    getGetCruiseMockHandler(() => server),
    getUpdateCruiseMockHandler(
      () => {
        server = { ...item, title: 'Cudzy', revision: 'AAAAAAAAB+A=' };
        return fail(409, { detail: 'Dane zostały w międzyczasie zmienione.' })();
      },
      { once: true }
    ),
    getUpdateCruiseMockHandler()
  );
  await page.goto(`/cruises/${item.id}`);
  const title = page.locator('input[name="title"]');
  const dialog = page.getByRole('dialog', { name: 'Odrzucić zmiany?' });

  await page.getByRole('button', { name: 'Edytuj', exact: true }).click();
  await page.getByRole('button', { name: 'Cofnij zmiany' }).click();
  await expect(dialog).toHaveCount(0);
  await title.fill('Nowy tytuł');
  await page.getByRole('button', { name: 'Anuluj', exact: true }).click();
  await dialog.getByRole('button', { name: 'Wróć do edycji' }).click();
  await expect(title).toHaveValue('Nowy tytuł');
  await page.getByRole('button', { name: 'Cofnij zmiany' }).click();
  await dialog.getByRole('button', { name: 'Odrzuć zmiany' }).click();
  await expect(title).toHaveValue(item.title ?? '');
  await expect(page.getByRole('button', { name: 'Zapisz rejs' })).toBeVisible();

  await title.fill('Mój');
  await page.getByRole('button', { name: 'Zapisz rejs' }).click();
  await expect(page.getByTestId('form-errors')).toContainText('Dane zostały w międzyczasie zmienione.');
  await expect(title).toHaveValue('Mój');
  await page.getByRole('button', { name: 'Cofnij zmiany' }).click();
  await dialog.getByRole('button', { name: 'Odrzuć zmiany' }).click();
  await expect(title).toHaveValue('Cudzy');
  await page.getByRole('button', { name: 'Zapisz rejs' }).click();
  await expect(page.getByRole('button', { name: 'Edytuj', exact: true })).toBeVisible();
  expect(requests.bodies(`PATCH /v2/cruises/${item.id}`).at(-1)).toMatchObject({ revision: 'AAAAAAAAB+A=' });

  await page.goto('/cruises/new');
  await page.locator('input[name="title"]').fill('Szkic');
  await page.getByRole('button', { name: 'Wyczyść formularz' }).click();
  await dialog.getByRole('button', { name: 'Odrzuć zmiany' }).click();
  await expect(page.locator('input[name="title"]')).toHaveValue('');
});

test('a cruise save waits for the previous one and starts from its accepted revision, also after a remount', async ({
  page,
  network,
  requests,
}) => {
  const item = cruise();
  const olderResponse = Promise.withResolvers<void>();
  const refetch = Promise.withResolvers<void>();
  let server = item;
  let gets = 0;
  network.use(
    getGetAvailableCruiseManagersMockHandler([admin, deputy, outsider]),
    getGetCruiseMockHandler(async () => {
      if (++gets > 1) await refetch.promise;
      return server;
    }),
    getUpdateCruiseMockHandler(async ({ request }) => {
      const { title } = (await request.json()) as CruiseResponse;
      if (title === 'Starszy') await olderResponse.promise;
      server = { ...server, title, revision: `after-${title}` };
      return { revision: server.revision };
    })
  );
  await page.goto(`/cruises/${item.id}`);
  const title = page.locator('input[name="title"]');
  const edit = page.getByRole('button', { name: 'Edytuj', exact: true });
  const save = page.getByRole('button', { name: 'Zapisz rejs' });
  const patches = () => requests.bodies(`PATCH /v2/cruises/${item.id}`);

  try {
    await edit.click();
    await title.fill('Starszy');
    await save.click();
    await expect.poll(() => patches().length).toBe(1);
    await page.getByRole('button', { name: 'Cofnij zmiany' }).click();
    await page.getByRole('dialog', { name: 'Odrzucić zmiany?' }).getByRole('button', { name: 'Odrzuć zmiany' }).click();
    await title.fill('Nowszy');
    await save.click();
    expect(patches()).toHaveLength(1);
    olderResponse.resolve();
    await expect(edit).toBeVisible();
    expect(patches()[1]).toEqual(expect.objectContaining({ title: 'Nowszy', revision: 'after-Starszy' }));
    await expect.poll(() => gets).toBe(3);

    await edit.click();
    await page.getByRole('combobox', { name: 'Zastępca kierownika głównego' }).click();
    await page.getByRole('option', { name: `${outsider.firstName} ${outsider.lastName}` }).click();
    await save.click();
    await expect(edit).toBeVisible();
    expect(patches().at(-1)).toEqual(
      expect.objectContaining({ title: 'Nowszy', deputyManagerId: outsider.id, revision: 'after-Nowszy' })
    );

    await page.getByRole('link', { name: 'Portal rejsów badawczych R/V Oceanograf' }).click();
    await expect(page).toHaveURL('/');
    await page.goBack();
    // The cached cruise predates the saves, so editing waits for the refetch.
    await expect(edit).toBeDisabled();
    refetch.resolve();
    await edit.click();
    await expect(title).toHaveValue('Nowszy');
  } finally {
    olderResponse.resolve();
    refetch.resolve();
  }
});

test('a cruise is confirmed, completed and reverted step by step, offering the actions of each status', async ({
  page,
  network,
  requests,
}) => {
  const item = cruise();
  const showStatus = (status: CruiseResponse['status']) => network.use(getGetCruiseMockHandler({ ...item, status }));
  let status: CruiseResponse['status'] = 'new';
  network.use(
    getGetCruiseMockHandler(item),
    getConfirmCruiseMockHandler(() => showStatus((status = 'confirmed'))),
    getCompleteCruiseMockHandler(() => showStatus((status = 'ended'))),
    getRemoveCruiseConfirmationMockHandler(() => showStatus((status = status === 'ended' ? 'confirmed' : 'new')))
  );
  await page.goto(`/cruises/${item.id}`);
  const dialog = page.getByRole('dialog');
  const button = (name: string) => page.getByRole('button', { name, exact: true });
  const expectStatus = async (label: string, actions: string[], absent: string[]) => {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
    for (const action of actions) await expect(button(action)).toBeVisible();
    for (const action of absent) await expect(button(action)).toHaveCount(0);
  };

  await expectStatus('Nowy', ['Edytuj', 'Zatwierdź rejs'], ['Zakończ rejs', 'Cofnij status']);
  await button('Zatwierdź rejs').click();
  await dialog.getByRole('button', { name: `Potwierdź rejs nr. ${item.number}` }).click();
  await expectStatus('Potwierdzony', ['Edytuj', 'Zakończ rejs', 'Cofnij status', 'Usuń rejs'], ['Zatwierdź rejs']);

  await button('Zakończ rejs').click();
  await dialog.getByRole('button', { name: `Oznacz rejs nr. ${item.number} jako zakończony` }).click();
  await expectStatus('Zakończony', ['Cofnij status'], ['Edytuj', 'Zakończ rejs', 'Usuń rejs']);

  await button('Cofnij status').click();
  await expect(dialog).toContainText('z "Zakończony" na "Potwierdzony"');
  await dialog.getByRole('button', { name: `Cofnij status rejsu nr. ${item.number}` }).click();
  await expectStatus('Potwierdzony', ['Zakończ rejs'], []);

  await button('Cofnij status').click();
  await expect(dialog).toContainText('z "Potwierdzony" na "Nowy"');
  await dialog.getByRole('button', { name: `Cofnij status rejsu nr. ${item.number}` }).click();
  await expectStatus('Nowy', ['Zatwierdź rejs'], ['Cofnij status']);

  const sent = (route: string) => requests.bodies(route.replace('{id}', item.id)).length;
  expect([
    sent('PUT /v2/cruises/{id}/confirmation'),
    sent('PUT /v2/cruises/{id}/completion'),
    sent('DELETE /v2/cruises/{id}/confirmation'),
  ]).toEqual([1, 1, 2]);
});

test('a rejected status undo shows the server reason and keeps the cruise status', async ({ page, network }) => {
  const item: CruiseResponse = { ...cruise(), status: 'ended' };
  const reason = 'Nie można cofnąć statusu rejsu, ponieważ co najmniej jedno zgłoszenie ma już złożony Formularz C.';
  network.use(
    getGetCruiseMockHandler(item),
    getRemoveCruiseConfirmationMockHandler(fail(400, { status: 400, detail: reason }))
  );
  await page.goto(`/cruises/${item.id}`);
  // The error toast is a dialog too, so find the modal by its title.
  const dialog = page.getByRole('dialog', { name: `Czy na pewno chcesz cofnąć status rejsu nr. ${item.number}?` });

  await page.getByRole('button', { name: 'Cofnij status', exact: true }).click();
  await dialog.getByRole('button', { name: `Cofnij status rejsu nr. ${item.number}` }).click();

  await expect(page.getByText(reason)).toBeVisible();
  await expect(dialog).toBeHidden();
  await expect(page.getByText('Zakończony', { exact: true })).toBeVisible();
});

test('auto-planning adds the planned cruises to the list', async ({ page, network, requests }) => {
  const planned = { ...cruise(), id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', number: '2026/2', title: 'Zaplanowany' };
  network.use(
    getGetCruisesMockHandler([cruise()]),
    getAutoPlanCruisesMockHandler(() => network.use(getGetCruisesMockHandler([cruise(), planned])))
  );
  await page.goto('/cruises');
  await page.getByRole('button', { name: 'Dodaj rejsy automatycznie' }).click();
  await expect(page.getByText('Rejsy zostały dodane automatycznie')).toBeVisible();
  await expect(page.getByRole('row').filter({ hasText: planned.title })).toBeVisible();
  expect(requests.bodies('POST /v2/cruises/auto-plan')).toHaveLength(1);
});

test('the export downloads the CSV file of the chosen year', async ({ page, network, requests }) => {
  const csv = 'Numer;Tytuł\n2025/4;Zatoka';
  network.use(
    getGetCruisesMockHandler([
      cruise(),
      { ...cruise(), id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', startDate: '2025-06-01T08:00:00Z' },
    ]),
    getExportCruisesMockHandler({
      name: 'rejsy-2025.csv',
      content: `data:text/csv;base64,${Buffer.from(csv).toString('base64')}`,
    })
  );
  await page.goto('/cruises');
  await page.getByRole('button', { name: 'Eksport' }).click();
  await page.getByRole('dialog').getByText('2026', { exact: true }).click();
  await page.getByRole('option', { name: '2025' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Eksportuj rejsy z roku 2025 do pliku CSV' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('rejsy-2025.csv');
  expect((await readFile(await file.path())).toString()).toBe(csv);
  expect(requests.queries('GET /v2/cruises/export')).toEqual([{ year: '2025' }]);
});

test.describe(() => {
  test.use({ account: managerAccount });

  test('a cruise manager sees the cruises without the planning actions', async ({ page, network }) => {
    network.use(getGetCruisesMockHandler([cruise()]));
    await page.goto('/cruises');
    await expect(page.getByRole('row').filter({ hasText: cruise().title! })).toBeVisible();
    for (const action of ['Dodaj rejsy automatycznie', 'Nowy rejs', 'Nowa blokada', 'Eksport']) {
      await expect(page.getByRole('button', { name: action }).or(page.getByRole('link', { name: action }))).toHaveCount(
        0
      );
    }
  });
});
