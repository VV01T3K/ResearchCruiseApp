import {
  getAcceptUserMockHandler,
  getCreateUserMockHandler,
  getGetUsersMockHandler,
  getUpdateUserMockHandler,
} from '@/api/generated/mocks/users/users.msw.gen';
import type { UserResponse } from '@/api/generated/schemas';
import { test, expect, fail } from './fixtures';
import { admin, deputy } from '../data/accounts';

test.use({ account: admin });

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

test('a failed account acceptance is explained and can be retried', async ({ page, network, requests }) => {
  network.use(
    getGetUsersMockHandler([cruiseManager({ accepted: false })]),
    getAcceptUserMockHandler(fail(503, { detail: 'Spróbuj ponownie później' }), { once: true }),
    getAcceptUserMockHandler()
  );
  await page.goto('/user-management');
  await page.getByRole('button', { name: 'Edytuj', exact: true }).click();
  const accept = page.getByRole('button', { name: 'Zaakceptuj konto użytkownika', exact: true });
  await accept.click();
  await expect(page.getByRole('alert')).toContainText('Spróbuj ponownie później');
  // A failed action stays blocked until its error is dismissed.
  await expect(accept).toBeDisabled();
  await page.getByRole('alert').getByRole('button', { name: 'Close' }).click();

  await accept.click();
  await expect(accept).toHaveCount(0);
  expect(requests.bodies(`PUT /v2/users/${deputy.id}/acceptance`)).toHaveLength(2);
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
