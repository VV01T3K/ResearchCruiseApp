import type { Page } from '@playwright/test';
import type { NetworkFixture } from '@msw/playwright';
import {
  getGetApplicationFormAMockHandler,
  getGetApplicationFormBMockHandler,
  getUpdateApplicationFormAMockHandler,
} from '@/api/generated/mocks/applications/applications.msw.gen';
import { getLoginMockHandler, getLogoutMockHandler } from '@/api/generated/mocks/auth/auth.msw.gen';
import { HttpResponse } from 'msw';
import { test, expect, applicationForms, dropFile } from './fixtures';
import { admin, session } from '../data/accounts';
import { applicationId, formA as formAFields, formB as formBFields } from '../data/forms';

const UNSAVED = 'Notatka, której nie zapisano';
const formA = `/applications/${applicationId}/formA?mode=edit`;

test.use({ account: admin });
test.beforeEach(({ network }) => network.use(...applicationForms()));

const dialog = (page: Page) => page.getByRole('dialog', { name: 'Niezapisane zmiany' });
const notes = (page: Page) => page.getByLabel('Uwagi dotyczące terminu');
const goHome = (page: Page) => page.getByRole('link', { name: 'Portal rejsów badawczych R/V Oceanograf' }).click();

async function expectLeftWithoutPrompt(page: Page) {
  await expect(page).toHaveURL('/');
  await expect(dialog(page)).toHaveCount(0);
}

/** Closing the tab asks the browser's own leave-page question; dismissing it keeps the page. */
async function expectBrowserLeavePrompt(page: Page) {
  const prompt = page.waitForEvent('dialog');
  await page.close({ runBeforeUnload: true });
  const dialog = await prompt;
  expect(dialog.type()).toBe('beforeunload');
  await dialog.dismiss();
}

/** Holds the next form A save until the returned function releases it. */
async function holdFormASave(page: Page, network: NetworkFixture, outcome: 'saved' | 'failed') {
  const { promise: released, resolve: release } = Promise.withResolvers<void>();
  network.use(
    getUpdateApplicationFormAMockHandler(async () => {
      await released;
      if (outcome === 'failed') throw HttpResponse.json({ detail: 'Serwer niedostępny' }, { status: 503 });
    })
  );
  const request = page.waitForRequest((request) => request.method() === 'PUT');
  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await request;
  return release;
}

test.describe('an unchanged form leaves without asking', () => {
  for (const [name, url] of [
    ['an editable application', formA],
    ['a read-only application', `/applications/${applicationId}/formA?mode=view`],
  ]) {
    test(name, async ({ page }) => {
      await page.goto(url);
      await expect(notes(page)).toBeVisible();
      await goHome(page);
      await expectLeftWithoutPrompt(page);
    });
  }

  test('a new application, although its periods normalise on load', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Nowe zgłoszenie/ }).click();
    await expect(page.getByRole('slider').first()).toBeVisible();
    await goHome(page);
    await expectLeftWithoutPrompt(page);
  });

  for (const form of ['B', 'C']) {
    test(`a loaded form ${form}, until it is edited`, async ({ page }) => {
      await page.goto(`/applications/${applicationId}/form${form}?mode=edit`);
      const field =
        form === 'B' ? page.locator('input[name="ugTeams[0].noOfEmployees"]') : page.getByLabel('Dodatkowy opis');
      await expect(field).toBeEditable();
      await goHome(page);
      await expectLeftWithoutPrompt(page);
      await page.goBack();
      await field.fill('7');
      await goHome(page);
      await expect(dialog(page)).toBeVisible();
    });
  }
});

test('an in-app link asks before discarding edits, and staying keeps them', async ({ page }) => {
  await page.goto(formA);
  await notes(page).fill(UNSAVED);
  await goHome(page);
  await dialog(page).getByRole('button', { name: 'Zostań na stronie' }).click();
  await expect(dialog(page)).toBeHidden();
  await expect(page).toHaveURL(formA);
  await expect(notes(page)).toHaveValue(UNSAVED);
  await goHome(page);
  await dialog(page).getByRole('button', { name: 'Opuść bez zapisywania' }).click();
  await expect(page).toHaveURL('/');
});

test('edits left without saving come back on return', async ({ page }) => {
  await page.goto(formA);
  await notes(page).fill(UNSAVED);
  await goHome(page);
  await dialog(page).getByRole('button', { name: 'Opuść bez zapisywania' }).click();
  await page.goBack();
  await expect(notes(page)).toHaveValue(UNSAVED);
  await goHome(page);
  await expect(dialog(page)).toBeVisible();
});

test('restored edits keep newer server values in other fields', async ({ page, network, requests }) => {
  await page.clock.install({ time: new Date('2026-10-15T12:00:00') });
  // Loaded with a future period; the server later moves it into the past.
  const future: [string, string] = ['22', '24'];
  network.use(getGetApplicationFormAMockHandler({ ...formAFields(), acceptablePeriod: future, optimalPeriod: future }));
  await page.goto(formA);
  await notes(page).fill(UNSAVED);
  await goHome(page);
  await dialog(page).getByRole('button', { name: 'Opuść bez zapisywania' }).click();
  network.use(
    getGetApplicationFormAMockHandler({ ...formAFields(), cruiseHours: '99' }),
    getUpdateApplicationFormAMockHandler()
  );
  // Suspense queries stay fresh for a second; returning later refetches the form.
  await page.clock.fastForward(2000);
  await page.goBack();
  await expect(page.getByLabel('Liczba planowanych godzin rejsowych')).toHaveValue('99');
  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expect
    .poll(() => requests.bodies(`PUT /v2/applications/${applicationId}/form-a`))
    .toMatchObject([{ form: { cruiseHours: '99', acceptablePeriod: ['0', '24'], periodNotes: UNSAVED } }]);
});

test('a restored table cell keeps newer server values in its row', async ({ page, network }) => {
  await page.clock.install();
  await page.goto(`/applications/${applicationId}/formB?mode=edit`);
  const cell = (name: string) => page.locator(`input[name="ugTeams[0].${name}"]`);
  await cell('noOfEmployees').fill('7');
  await goHome(page);
  await dialog(page).getByRole('button', { name: 'Opuść bez zapisywania' }).click();
  const ugTeams = (formBFields().ugTeams ?? []).map((team) => ({ ...team, noOfStudents: '5' }));
  network.use(getGetApplicationFormBMockHandler({ ...formBFields(), ugTeams }));
  await page.clock.fastForward(2000);
  await page.goBack();
  await expect(cell('noOfStudents')).toHaveValue('5');
  await expect(cell('noOfEmployees')).toHaveValue('7');
});

test('a restored past period keeps its dates', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-15T12:00:00'));
  await page.goto('/applications/new');
  await page.getByText('Zezwól na wybór dat z przeszłości').click();
  await page.getByRole('slider').first().press('Home');
  const period = page.getByText(/Wybrano okres:/).first();
  const chosen = (await period.textContent()) ?? '';
  await goHome(page);
  await dialog(page).getByRole('button', { name: 'Opuść bez zapisywania' }).click();
  await page.goBack();
  await expect(period).toHaveText(chosen);
});

test('signing out forgets unsaved edits', async ({ page, network, requests }) => {
  network.use(
    getLogoutMockHandler(),
    getLoginMockHandler(() => session())
  );
  await page.goto(formA);
  const saved = await notes(page).inputValue();
  await notes(page).fill(UNSAVED);
  await page.getByTestId('sign-out-btn').click();
  await expect.poll(() => requests.bodies('POST /v2/auth/logout')).toHaveLength(1);
  // The login page re-renders once logout settles, which can clear the fields.
  await expect(async () => {
    await page.getByLabel('E-mail').fill(admin.email);
    await page.getByLabel('Hasło', { exact: true }).fill('Password1!');
    await page.getByRole('button', { name: 'Zaloguj', exact: true }).click({ timeout: 1000 });
    await expect(page).toHaveURL(formA, { timeout: 2000 });
  }).toPass();
  await expect(notes(page)).toHaveValue(saved);
});

test('edits survive confirming a reload', async ({ page }) => {
  await page.goto(formA);
  await notes(page).fill(UNSAVED);
  page.once('dialog', (dialog) => dialog.accept());
  await page.reload();
  await expect(notes(page)).toHaveValue(UNSAVED);
});

test('browser Back asks before discarding edits on a new application', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Nowe zgłoszenie/ }).click();
  await expect(page).toHaveURL('/applications/new');
  await notes(page).fill(UNSAVED);
  await page.goBack();
  await dialog(page).getByRole('button', { name: 'Zostań na stronie' }).click();
  await expect(page).toHaveURL('/applications/new');
  await expect(notes(page)).toHaveValue(UNSAVED);
});

test('closing the tab with edits shows the browser leave-page prompt', async ({ page }) => {
  await page.goto(formA);
  await notes(page).fill(UNSAVED);
  await expectBrowserLeavePrompt(page);
  await expect(notes(page)).toHaveValue(UNSAVED);
});

test('a successful save leaves the form without asking', async ({ page, network }) => {
  network.use(getUpdateApplicationFormAMockHandler());
  await page.goto(formA);
  await notes(page).fill(UNSAVED);
  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expectLeftWithoutPrompt(page);
});

test('a file dropped as the first edit is protected', async ({ page }) => {
  await page.goto(`/applications/${applicationId}/formC?mode=edit`);
  await dropFile(page.getByTestId('form-c-attachment-input-button'), {
    name: 'zdjecie.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from([0xff, 0xd8, 0xff, 0xd9]),
  });
  await expect(page.getByRole('button', { name: 'zdjecie.jpg', exact: true })).toBeVisible();
  await goHome(page);
  await expect(dialog(page)).toBeVisible();
});

test.describe('pending saves', () => {
  test('edits stay protected while a save is pending and after it fails', async ({ page, network }) => {
    await page.goto(formA);
    await notes(page).fill(UNSAVED);
    const release = await holdFormASave(page, network, 'failed');
    await expectBrowserLeavePrompt(page);
    await goHome(page);
    await dialog(page).getByRole('button', { name: 'Zostań na stronie' }).click();
    release();
    await expect(page.getByText(/Serwer niedostępny/).first()).toBeVisible();
    await expect(notes(page)).toHaveValue(UNSAVED);
    await goHome(page);
    await expect(dialog(page)).toBeVisible();
  });

  test('edits made while a save is pending still ask after it succeeds', async ({ page, network }) => {
    await page.goto(formA);
    await notes(page).fill(UNSAVED);
    const release = await holdFormASave(page, network, 'saved');
    await notes(page).fill(`${UNSAVED} i dopisek`);
    release();
    await expect(dialog(page)).toBeVisible();
    await expect(page).toHaveURL(formA);
  });

  test('a save that finishes after the user left does not navigate away from the next page', async ({
    page,
    network,
  }) => {
    await page.goto(formA);
    await notes(page).fill(UNSAVED);
    const release = await holdFormASave(page, network, 'saved');
    await goHome(page);
    await dialog(page).getByRole('button', { name: 'Opuść bez zapisywania' }).click();
    await page.getByRole('link', { name: /Nowe zgłoszenie/ }).click();
    await notes(page).fill(UNSAVED);
    release();
    await expect(page.getByTestId('toast-success')).toBeVisible();
    await expect(page).toHaveURL('/applications/new');
    await expect(notes(page)).toHaveValue(UNSAVED);
  });
});

test('disallowing past dates, which clamps a saved period, asks before leaving', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-15T12:00:00'));
  await page.goto(formA);
  await expect(page.getByText('Wybrano okres: Cały rok').first()).toBeVisible();
  await page.getByText('Zezwól na wybór dat z przeszłości').click();
  await expect(page.getByText('Wybrano okres: Cały rok')).toHaveCount(0);
  await goHome(page);
  await expect(dialog(page)).toBeVisible();
});
