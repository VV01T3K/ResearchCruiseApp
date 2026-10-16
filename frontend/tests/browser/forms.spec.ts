import {
  getCreateApplicationMockHandler,
  getUpdateApplicationFormAMockHandler,
  getUpdateApplicationFormBMockHandler,
  getUpdateApplicationFormCMockHandler,
} from '@/api/generated/mocks/applications/applications.msw.gen';
import { test, expect, applicationForms, dropFile, fail } from './fixtures';
import { admin } from '../data/accounts';
import { applicationId, formB } from '../data/forms';

const formA = `/applications/${applicationId}/formA?mode=edit`;
const savedForm = (form: string) => `PUT /v2/applications/${applicationId}/${form}`;

test.use({ account: admin });
test.beforeEach(({ network }) => network.use(...applicationForms()));

test('form A edits, validates and saves the entered value', async ({ page, network, requests }) => {
  network.use(getUpdateApplicationFormAMockHandler());
  await page.goto(formA);
  const email = page.getByLabel('Adres e-mail przełożonego');
  const send = page.getByRole('button', { name: 'Wyślij', exact: true });

  await email.fill('invalid');
  await send.click();
  await expect(email).toBeFocused();
  await expect(email).toBeInViewport();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  expect(requests.bodies(savedForm('form-a'))).toEqual([]);

  await email.fill('new-supervisor@example.com');
  await send.click();
  await expect(page).toHaveURL('/');
  expect(requests.bodies(savedForm('form-a'))).toEqual([
    expect.objectContaining({
      draft: false,
      form: expect.objectContaining({ id: applicationId, supervisorEmail: 'new-supervisor@example.com' }),
    }),
  ]);
});

test('form A displays server field errors without discarding edits', async ({ page, network }) => {
  network.use(
    getUpdateApplicationFormAMockHandler(
      fail(400, { errors: { 'form.supervisorEmail': ['Przełożony nie jest dostępny'] } })
    )
  );
  await page.goto(formA);
  const email = page.getByLabel('Adres e-mail przełożonego');
  await email.fill('new-supervisor@example.com');
  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expect(email).toHaveValue('new-supervisor@example.com');
  await expect(email).toBeFocused();
  await expect(page.getByText('Przełożony nie jest dostępny', { exact: true })).toBeVisible();
});

test('a failed save preserves edits and allows a successful retry', async ({ page, network, requests }) => {
  network.use(
    getUpdateApplicationFormAMockHandler(fail(503, { detail: 'Kod błędu: ABC123' }), { once: true }),
    getUpdateApplicationFormAMockHandler()
  );
  await page.goto(formA);
  const email = page.getByLabel('Adres e-mail przełożonego');
  await email.fill('retry@example.com');
  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expect(page.getByText(/Nie udało się wysłać formularza: Kod błędu: ABC123/)).toBeVisible();
  await expect(email).toHaveValue('retry@example.com');

  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expect(page).toHaveURL('/');
  expect(requests.bodies(savedForm('form-a'))).toHaveLength(2);
  expect(requests.bodies(savedForm('form-a')).at(-1)).toMatchObject({
    draft: false,
    form: { supervisorEmail: 'retry@example.com' },
  });
});

test('form A research tasks can be removed, added and saved, with errors that follow their rows', async ({
  page,
  network,
  requests,
}) => {
  network.use(getUpdateApplicationFormAMockHandler());
  await page.goto(formA);
  const send = page.getByRole('button', { name: 'Wyślij', exact: true });
  const task = (name: string) => page.getByRole('row').filter({ hasText: name });
  // The icon-only delete button has no accessible name yet (#491); it is the row's only button.
  const removeTask = (name: string) => task(name).getByRole('button').click();
  const addTask = async (name: string) => {
    await page.getByRole('button', { name: 'Dodaj nowe efekty rejsu' }).click();
    await page.getByRole('button', { name, exact: true }).click();
  };
  const required = page.getByText('Co najmniej jedno zadanie badawcze jest wymagane');
  const emptyDescription = page.getByText('Opis nie może być pusty', { exact: true });

  await removeTask('Praca licencjacka');
  await send.click();
  await expect(required.first()).toBeVisible();

  await addTask('Inne zadanie');
  await addTask('Dydaktyka');
  await expect(required).toHaveCount(0);
  await send.click();
  await expect(emptyDescription).toHaveCount(2);

  await removeTask('Dydaktyka');
  await expect(emptyDescription).toHaveCount(1);
  await task('Inne zadanie').getByLabel('Opis zadania').fill('Pomiary zasolenia');
  await expect(emptyDescription).toHaveCount(0);
  await send.click();
  await expect(page).toHaveURL('/');
  expect(requests.bodies(savedForm('form-a'))).toEqual([
    expect.objectContaining({
      form: expect.objectContaining({
        researchTasks: [expect.objectContaining({ type: '11', description: 'Pomiary zasolenia' })],
      }),
    }),
  ]);
});

test('a new application can be created as an incomplete draft with a note', async ({ page, network, requests }) => {
  network.use(getCreateApplicationMockHandler());
  await page.goto('/applications/new');
  await page.getByLabel('Adres e-mail przełożonego').fill('');
  await page.getByRole('button', { name: 'Zapisz wersję roboczą', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Notatka aktualnej wersji roboczej').fill('Czekam na przełożonego');
  await dialog.getByRole('button', { name: 'Zapisz wersję roboczą', exact: true }).click();
  await expect(page).toHaveURL('/');
  expect(requests.bodies('POST /v2/applications')).toEqual([
    expect.objectContaining({
      draft: true,
      form: expect.objectContaining({ supervisorEmail: '', note: 'Czekam na przełożonego' }),
    }),
  ]);
});

test('form B adds a permission, accepts only a PDF scan and submits the new row', async ({
  page,
  network,
  requests,
}) => {
  network.use(getUpdateApplicationFormBMockHandler());
  await page.goto(`/applications/${applicationId}/formB?mode=edit`);
  const permissions = page.getByTestId('form-b-additional-permissions-section');
  await permissions.getByRole('button', { name: 'Dodaj pozwolenie' }).click();
  await permissions.getByTestId('permission-description-input').fill('Pobór próbek');
  await permissions.getByTestId('permission-executive-input').fill('Urząd Morski');

  const upload = permissions.getByTestId('permission-scan-button');
  await dropFile(upload, { name: 'skan.txt', mimeType: 'text/plain', buffer: Buffer.from('tekst') });
  await expect(permissions.getByText('Plik musi być w formacie PDF')).toBeVisible();

  const pdf = Buffer.from('%PDF-1.4\n%%EOF');
  await permissions
    .locator('input[type="file"]')
    .setInputFiles({ name: 'permission.pdf', mimeType: 'application/pdf', buffer: pdf });
  await expect(permissions.getByText('permission.pdf', { exact: true })).toBeVisible();
  await expect(permissions.getByText('Plik musi być w formacie PDF')).toHaveCount(0);
  // File actions sit next to the upload button, not nested inside it.
  await expect(permissions.getByRole('button', { name: /^Usuń plik/ })).toBeVisible();
  await expect(upload.locator('button, a, [role="button"]')).toHaveCount(0);

  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expect(page).toHaveURL('/applications');
  expect(requests.bodies(savedForm('form-b'))).toEqual([
    {
      draft: false,
      form: {
        ...formB(),
        permissions: [
          {
            description: 'Pobór próbek',
            executive: 'Urząd Morski',
            scan: { name: 'permission.pdf', content: `data:application/pdf;base64,${pdf.toString('base64')}` },
          },
        ],
      },
    },
  ]);
});

test('form C clears point awards for an unfinished task and saves attached photos', async ({
  page,
  network,
  requests,
}) => {
  network.use(getUpdateApplicationFormCMockHandler());
  await page.goto(`/applications/${applicationId}/formC?mode=edit`);
  const done = page.getByRole('checkbox', { name: 'Zrealizowane', exact: true });
  const awards = [
    page.getByRole('checkbox', { name: 'Czy naliczyć punkty kierownikowi?' }),
    page.getByRole('checkbox', { name: 'Czy naliczyć punkty zastępcy?' }),
  ];
  for (const award of awards) await expect(award).toBeDisabled();
  await done.check();
  for (const award of awards) await award.check();
  await done.uncheck();
  for (const award of awards) {
    await expect(award).toBeDisabled();
    await expect(award).not.toBeChecked();
  }

  const photo = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);
  await page
    .getByTestId('form-c-additional-description-section')
    .locator('input[type="file"]')
    .setInputFiles({ name: 'zdjecie.jpg', mimeType: 'image/jpeg', buffer: photo });
  await expect(page.getByRole('button', { name: 'zdjecie.jpg', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expect(page).toHaveURL('/applications');
  expect(requests.bodies(savedForm('form-c'))).toEqual([
    expect.objectContaining({
      draft: false,
      form: expect.objectContaining({
        researchTasksEffects: [
          expect.objectContaining({ done: 'false', managerConditionMet: 'false', deputyConditionMet: 'false' }),
        ],
        photos: [{ name: 'zdjecie.jpg', content: `data:image/jpeg;base64,${photo.toString('base64')}` }],
      }),
    }),
  ]);
});
