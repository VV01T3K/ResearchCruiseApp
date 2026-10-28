import {
  getDeleteAllCurrentUserPublicationsMockHandler,
  getDeleteCurrentUserPublicationMockHandler,
  getGetCurrentUserPublicationsMockHandler,
  getImportCurrentUserPublicationsMockHandler,
} from '@/api/generated/mocks/users/users.msw.gen';
import { test, expect, fail } from './fixtures';
import { admin, publication } from '../data/accounts';

test.use({ account: admin });

test('a Windows-1250 CSV upload submits the parsed publications and refreshes the table', async ({
  page,
  network,
  requests,
}) => {
  network.use(
    getGetCurrentUserPublicationsMockHandler([]),
    getImportCurrentUserPublicationsMockHandler(() =>
      network.use(getGetCurrentUserPublicationsMockHandler([publication()]))
    )
  );
  await page.goto('/my-publications');
  // The native file input is visually hidden behind the upload button. 0xb3 is "ł" in Windows-1250.
  await page.locator('input[type="file"]').setInputFiles({
    name: 'publications.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from(
      'Numer DOI;Autorzy;Tytu\xb3 publikacji;Nazwa czasopisma;Rok;Punkty\n10.1000/example;Ada Lovelace;Salinity;Journal;2026;100',
      'binary'
    ),
  });
  await expect(page.getByRole('cell', { name: 'Salinity', exact: true })).toBeVisible();
  const { id: _, ...imported } = publication();
  expect(requests.bodies('POST /v2/users/me/publications/import')).toEqual([[imported]]);
});

test('publications can be deleted one at a time or all at once after confirmation', async ({
  page,
  network,
  requests,
}) => {
  const first = publication();
  const second = { ...publication(), id: '88888888-8888-4888-8888-888888888888', title: 'Temperature' };
  network.use(
    getGetCurrentUserPublicationsMockHandler([first, second]),
    getDeleteCurrentUserPublicationMockHandler(() => network.use(getGetCurrentUserPublicationsMockHandler([second]))),
    getDeleteAllCurrentUserPublicationsMockHandler(() => network.use(getGetCurrentUserPublicationsMockHandler([])))
  );
  await page.goto('/my-publications');
  await page
    .getByRole('row')
    .filter({ hasText: first.title! })
    .getByRole('button', { name: 'Usuń', exact: true })
    .click();
  await expect(page.getByRole('cell', { name: first.title!, exact: true })).toHaveCount(0);
  await expect(page.getByRole('cell', { name: second.title, exact: true })).toBeVisible();
  expect(requests.bodies(`DELETE /v2/users/me/publications/${first.id}`)).toHaveLength(1);

  await page.getByRole('button', { name: 'Usuń wszystkie publikacje' }).click();
  const confirmation = page.getByRole('dialog', { name: 'Czy na pewno chcesz usunąć wszystkie publikacje?' });
  await expect(confirmation).toBeVisible();
  expect(requests.bodies('DELETE /v2/users/me/publications')).toHaveLength(0);
  await confirmation.getByRole('button', { name: 'Usuń wszystkie publikacje' }).click();
  await expect(page.getByRole('cell', { name: second.title, exact: true })).toHaveCount(0);
  expect(requests.bodies('DELETE /v2/users/me/publications')).toHaveLength(1);
});

test('a partly failed bulk delete reports one error and keeps the failed row selected', async ({ page, network }) => {
  const first = publication();
  const second = { ...publication(), id: '88888888-8888-4888-8888-888888888888', title: 'Temperature' };
  let releaseFirst!: () => void;
  const firstHeld = new Promise<void>((resolve) => (releaseFirst = resolve));
  network.use(
    getGetCurrentUserPublicationsMockHandler([first, second]),
    getDeleteCurrentUserPublicationMockHandler(async ({ params }) => {
      if (params.publicationId === first.id) {
        await firstHeld;
        fail(500)();
      }
      network.use(getGetCurrentUserPublicationsMockHandler([first]));
    })
  );
  await page.goto('/my-publications');
  for (const title of [first.title!, second.title]) {
    await page.getByRole('row').filter({ hasText: title }).getByRole('checkbox').check();
  }
  const deleteSelected = page.getByRole('button', { name: 'Usuń zaznaczone publikacje' });
  await deleteSelected.click();

  await expect(page.getByRole('cell', { name: second.title, exact: true })).toHaveCount(0);
  await expect(deleteSelected).toBeDisabled();
  releaseFirst();
  await expect(page.getByTestId('toast-error')).toHaveText('Nie udało się usunąć 1 z 2 zaznaczonych publikacji');
  await expect(page.getByRole('row').filter({ hasText: first.title! }).getByRole('checkbox')).toBeChecked();
});
