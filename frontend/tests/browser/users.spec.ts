import type { Page } from '@playwright/test';
import {
  getAcceptUserMockHandler,
  getCreateUserMockHandler,
  getDeactivateUserMockHandler,
  getDeleteUserMockHandler,
  getGetUsersMockHandler,
  getUpdateUserMockHandler,
} from '@/api/generated/mocks/users/users.msw.gen';
import type { UserResponse } from '@/api/generated/schemas';
import { test, expect, fail } from './fixtures';
import { admin, deputy, outsider } from '../data/accounts';

test.use({ account: admin });

// The select-all checkbox is the header row's only editable checkbox.
const selectAll = (page: Page) => page.locator('thead').getByRole('checkbox', { disabled: false }).check();

const cruiseManager = (changes: Partial<UserResponse> = {}): UserResponse => ({
  ...deputy,
  roles: ['CruiseManager'],
  accepted: true,
  emailConfirmed: true,
  ...changes,
});

test('an administrator creates a user, then edits them and sees the refreshed record', async ({
  page,
  network,
  requests,
}) => {
  network.use(
    getGetUsersMockHandler([]),
    getCreateUserMockHandler(() => network.use(getGetUsersMockHandler([cruiseManager()]))),
    getUpdateUserMockHandler(() => network.use(getGetUsersMockHandler([cruiseManager({ firstName: 'Updated' })])))
  );
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

  expect(requests.bodies('POST /v2/users')).toEqual([
    { email: deputy.email, firstName: deputy.firstName, lastName: deputy.lastName, roles: ['CruiseManager'] },
  ]);
  expect(requests.bodies(`PATCH /v2/users/${deputy.id}`)).toEqual([
    { email: deputy.email, firstName: 'Updated', lastName: deputy.lastName },
  ]);
});

for (const { action, accepted, button, route, handler } of [
  {
    action: 'acceptance',
    accepted: false,
    button: 'Zaakceptuj konto użytkownika',
    route: `PUT /v2/users/${deputy.id}/acceptance`,
    handler: getAcceptUserMockHandler,
  },
  {
    action: 'deactivation',
    accepted: true,
    button: 'Cofnij akceptację konta',
    route: `DELETE /v2/users/${deputy.id}/acceptance`,
    handler: getDeactivateUserMockHandler,
  },
]) {
  test(`a failed account ${action} is explained and can be retried`, async ({ page, network, requests }) => {
    network.use(
      getGetUsersMockHandler([cruiseManager({ accepted })]),
      handler(fail(503, { detail: 'Spróbuj ponownie później' }), { once: true }),
      handler()
    );
    await page.goto('/user-management');
    await page.getByRole('button', { name: 'Edytuj', exact: true }).click();
    const toggle = page.getByRole('button', { name: button, exact: true });
    await toggle.click();
    await expect(page.getByRole('alert')).toContainText('Spróbuj ponownie później');
    // A failed action stays blocked until its error is dismissed.
    await expect(toggle).toBeDisabled();
    await page.getByRole('alert').getByRole('button', { name: 'Close' }).click();

    await toggle.click();
    await expect(toggle).toHaveCount(0);
    expect(requests.bodies(route)).toHaveLength(2);
  });
}

test('a user is deactivated, then deleted only after the deletion is confirmed', async ({
  page,
  network,
  requests,
}) => {
  network.use(
    getGetUsersMockHandler([cruiseManager()]),
    getDeactivateUserMockHandler(() => network.use(getGetUsersMockHandler([cruiseManager({ accepted: false })]))),
    getDeleteUserMockHandler(() => network.use(getGetUsersMockHandler([])))
  );
  await page.goto('/user-management');
  const row = page.getByRole('row').filter({ hasText: deputy.email });
  const dialog = page.getByRole('dialog', { name: 'Edytuj użytkownika' });
  await row.getByRole('button', { name: 'Edytuj' }).click();
  await dialog.getByRole('button', { name: 'Cofnij akceptację konta' }).click();
  await expect(dialog).toBeHidden();
  expect(requests.bodies(`DELETE /v2/users/${deputy.id}/acceptance`)).toHaveLength(1);

  await row.getByRole('button', { name: 'Edytuj' }).click();
  await expect(dialog.getByText('Niezaakceptowane', { exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: 'Usuń', exact: true }).click();
  expect(requests.bodies(`DELETE /v2/users/${deputy.id}`)).toHaveLength(0);
  await dialog.getByRole('button', { name: 'Czy na pewno?' }).click();
  await expect(row).toHaveCount(0);
  expect(requests.bodies(`DELETE /v2/users/${deputy.id}`)).toHaveLength(1);
});

test('the last administrator cannot be deleted alone or in a group', async ({ page, network, requests }) => {
  const onlyAdmin = cruiseManager({ ...outsider });
  network.use(getGetUsersMockHandler([onlyAdmin, cruiseManager()]));
  await page.goto('/user-management');
  const dialog = page.getByRole('dialog');
  await page.getByRole('row').filter({ hasText: onlyAdmin.email }).getByRole('button', { name: 'Edytuj' }).click();
  await dialog.getByRole('button', { name: 'Usuń', exact: true }).click();
  await dialog.getByRole('button', { name: 'Czy na pewno?' }).click();
  await expect(page.getByText('Musi istnieć co najmniej jeden admin', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');

  await selectAll(page);
  await page.getByRole('button', { name: 'Akcje Grupowe' }).click();
  await dialog.getByRole('button', { name: 'Usuń zaznaczonych użytkowników' }).click();
  await dialog.getByRole('button', { name: 'Na pewno?' }).click();
  await expect(
    page.getByText('Po usunięciu zaznaczonych użytkowników musi istnieć co najmniej jeden admin', { exact: true })
  ).toBeVisible();
  expect(requests.bodies(`DELETE /v2/users/${onlyAdmin.id}`)).toHaveLength(0);
  expect(requests.bodies(`DELETE /v2/users/${deputy.id}`)).toHaveLength(0);
});

test('a group deletion deletes every selected user and reports the ones that failed', async ({
  page,
  network,
  requests,
}) => {
  const users = [cruiseManager(), cruiseManager({ ...outsider, roles: ['Guest'] })];
  network.use(
    getGetUsersMockHandler(users),
    getDeleteUserMockHandler(({ params }) => {
      if (params.userId === outsider.id) fail(503)();
      network.use(getGetUsersMockHandler([users[1]]));
    })
  );
  await page.goto('/user-management');
  await selectAll(page);
  await page.getByRole('button', { name: 'Akcje Grupowe' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Usuń zaznaczonych użytkowników' }).click();
  expect(requests.bodies(`DELETE /v2/users/${deputy.id}`)).toHaveLength(0);
  await dialog.getByRole('button', { name: 'Na pewno?' }).click();
  await expect(page.getByText('Usunięto część osób. Błąd przy 1 użytkownikach', { exact: true })).toBeVisible();
  await expect(page.getByRole('row').filter({ hasText: deputy.email })).toHaveCount(0);
  await expect(page.getByRole('row').filter({ hasText: outsider.email })).toBeVisible();
  expect(requests.bodies(`DELETE /v2/users/${deputy.id}`)).toHaveLength(1);
  expect(requests.bodies(`DELETE /v2/users/${outsider.id}`)).toHaveLength(1);
});

test('a group deactivation sends requests only for accepted users', async ({ page, network, requests }) => {
  network.use(
    getGetUsersMockHandler([cruiseManager(), cruiseManager({ ...outsider, roles: ['Guest'], accepted: false })]),
    getDeactivateUserMockHandler()
  );
  await page.goto('/user-management');
  await selectAll(page);
  await page.getByRole('button', { name: 'Akcje Grupowe' }).click();
  await page.getByRole('button', { name: 'Usuń akceptację zaznaczonych użytkowników' }).click();
  await expect(page.getByText('Pomyślnie usunięto akceptację wszystkich wybranych użytkowników')).toBeVisible();
  expect(requests.bodies(`DELETE /v2/users/${deputy.id}/acceptance`)).toHaveLength(1);
  expect(requests.bodies(`DELETE /v2/users/${outsider.id}/acceptance`)).toHaveLength(0);
});

for (const mobile of [false, true]) {
  test(`table sorting, filtering and selection work on ${mobile ? 'mobile' : 'desktop'}`, async ({ page, network }) => {
    if (mobile) await page.setViewportSize({ width: 390, height: 844 });
    network.use(
      getGetUsersMockHandler([
        cruiseManager({ id: admin.id, email: 'zebra@example.com' }),
        cruiseManager({ email: 'alpha@example.com' }),
      ])
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
