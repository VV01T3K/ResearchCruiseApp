import { test, expect } from './fixtures';
import { admin } from '../data/accounts';
import { applicationId, formA, formB, formC, formOptions } from '../data/forms';
import { application, cruise } from '../data/cruises';

test.use({ account: admin });

test.beforeEach(async ({ api }) => {
  await api('GET', '/v2/applications/managers', (route) => route.fulfill({ json: [] }));
  await api('GET', '/v2/applications?*', (route) =>
    route.fulfill({ json: { items: [application()], nextCursor: null } })
  );
  await api('GET', '/v2/applications/form-a/context', (route) => route.fulfill({ json: formOptions() }));
  await api('GET', '/v2/applications/form-b/context', (route) => route.fulfill({ json: { shipEquipments: [] } }));
  await api('GET', '/v2/cruises/blockades?*', (route) => route.fulfill({ json: [] }));
  await api('GET', `/v2/applications/${applicationId}/cruise`, (route) => route.fulfill({ json: cruise() }));
  await api('GET', `/v2/applications/${applicationId}/form-a`, (route) => route.fulfill({ json: formA() }));
  await api('GET', `/v2/applications/${applicationId}/form-b`, (route) => route.fulfill({ json: formB() }));
  await api('GET', `/v2/applications/${applicationId}/form-c`, (route) => route.fulfill({ json: formC() }));
});

test('form A edits, validates and saves the entered value', async ({ page, api }) => {
  let saved: unknown;
  await api('PUT', `/v2/applications/${applicationId}/form-a`, async (route) => {
    saved = route.request().postDataJSON();
    await route.fulfill({ status: 204 });
  });
  await page.goto(`/applications/${applicationId}/formA?mode=edit`);
  const email = page.getByLabel('Adres e-mail przełożonego');
  await email.fill('invalid');
  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  expect(saved).toBeUndefined();
  await email.fill('new-supervisor@example.com');
  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expect(page).toHaveURL('/');
  expect(saved).toMatchObject({
    draft: false,
    form: { id: applicationId, supervisorEmail: 'new-supervisor@example.com', cruiseHours: '27' },
  });
});

test('form A displays server field errors without discarding edits', async ({ page, api }) => {
  await api('PUT', `/v2/applications/${applicationId}/form-a`, (route) =>
    route.fulfill({
      status: 400,
      json: { errors: { 'form.supervisorEmail': ['Przełożony nie jest dostępny'] } },
    })
  );
  await page.goto(`/applications/${applicationId}/formA?mode=edit`);
  const email = page.getByLabel('Adres e-mail przełożonego');
  await email.fill('new-supervisor@example.com');
  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expect(email).toHaveValue('new-supervisor@example.com');
  await expect(email).toBeFocused();
  await expect(page.getByText('Przełożony nie jest dostępny', { exact: true })).toBeVisible();
});

test('a new application can be created as an incomplete draft with a note', async ({ page, api }) => {
  let saved: unknown;
  await api('POST', '/v2/applications', async (route) => {
    saved = route.request().postDataJSON();
    await route.fulfill({ status: 204 });
  });
  await page.goto('/applications/new');
  await page.getByLabel('Adres e-mail przełożonego').fill('');
  await page.getByRole('button', { name: 'Zapisz wersję roboczą', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Notatka aktualnej wersji roboczej').fill('Czekam na przełożonego');
  await dialog.getByRole('button', { name: 'Zapisz wersję roboczą', exact: true }).click();
  await expect(page).toHaveURL('/');
  expect(saved).toMatchObject({
    draft: true,
    form: { supervisorEmail: '', note: 'Czekam na przełożonego' },
  });
});

test('form C clears both point awards for an unfinished task and saves the result', async ({ page, api }) => {
  let saved: unknown;
  await api('PUT', `/v2/applications/${applicationId}/form-c`, async (route) => {
    saved = route.request().postDataJSON();
    await route.fulfill({ status: 204 });
  });
  await page.goto(`/applications/${applicationId}/formC?mode=edit`);
  const done = page.getByRole('checkbox', { name: 'Zrealizowane', exact: true });
  const managerPoints = page.getByRole('checkbox', { name: 'Czy naliczyć punkty kierownikowi?' });
  const deputyPoints = page.getByRole('checkbox', { name: 'Czy naliczyć punkty zastępcy?' });
  await expect(managerPoints).toBeDisabled();
  await expect(deputyPoints).toBeDisabled();
  await done.check();
  await managerPoints.check();
  await deputyPoints.check();
  await expect(managerPoints).toBeChecked();
  await expect(deputyPoints).toBeChecked();
  await done.uncheck();
  await expect(managerPoints).toBeDisabled();
  await expect(managerPoints).not.toBeChecked();
  await expect(deputyPoints).toBeDisabled();
  await expect(deputyPoints).not.toBeChecked();
  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expect(page).toHaveURL('/applications');
  await expect(page.getByRole('cell', { name: '2026/17', exact: true })).toBeVisible();
  expect(saved).toMatchObject({
    draft: false,
    form: {
      researchTasksEffects: [{ done: 'false', managerConditionMet: 'false', deputyConditionMet: 'false' }],
    },
  });
});

test('form B adds a permission, uploads its PDF and submits the new row', async ({ page, api }) => {
  let saved: unknown;
  await api('PUT', `/v2/applications/${applicationId}/form-b`, async (route) => {
    saved = route.request().postDataJSON();
    await route.fulfill({ status: 204 });
  });
  await page.goto(`/applications/${applicationId}/formB?mode=edit`);
  const permissions = page.getByTestId('form-b-additional-permissions-section');
  await permissions.getByRole('button', { name: 'Dodaj pozwolenie' }).click();
  await permissions.getByTestId('permission-description-input').fill('Pobór próbek');
  await permissions.getByTestId('permission-executive-input').fill('Urząd Morski');
  const content = Buffer.from('%PDF-1.4\n%%EOF');
  await permissions
    .locator('input[type="file"]')
    .setInputFiles({ name: 'permission.pdf', mimeType: 'application/pdf', buffer: content });
  await expect(permissions.getByText('permission.pdf', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expect(page).toHaveURL('/applications');
  await expect(page.getByRole('cell', { name: '2026/17', exact: true })).toBeVisible();
  expect(saved).toMatchObject({
    draft: false,
    form: {
      isCruiseManagerPresent: 'true',
      ugTeams: formB().ugTeams,
      permissions: [
        {
          description: 'Pobór próbek',
          executive: 'Urząd Morski',
          scan: {
            name: 'permission.pdf',
            content: `data:application/pdf;base64,${content.toString('base64')}`,
          },
        },
      ],
    },
  });
});

test('a failed save preserves edits and allows a successful retry', async ({ page, api }) => {
  let saved: unknown;
  let attempts = 0;
  await api('PUT', `/v2/applications/${applicationId}/form-a`, async (route) => {
    attempts++;
    if (attempts === 1) return route.fulfill({ status: 503, json: { detail: 'Kod błędu: ABC123' } });
    saved = route.request().postDataJSON();
    await route.fulfill({ status: 204 });
  });
  await page.goto(`/applications/${applicationId}/formA?mode=edit`);
  const email = page.getByLabel('Adres e-mail przełożonego');
  await email.fill('retry@example.com');
  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expect(page.getByText(/Nie udało się wysłać formularza: Kod błędu: ABC123/)).toBeVisible();
  await expect(email).toHaveValue('retry@example.com');
  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expect(page).toHaveURL('/');
  expect(attempts).toBe(2);
  expect(saved).toMatchObject({ draft: false, form: { supervisorEmail: 'retry@example.com' } });
});
