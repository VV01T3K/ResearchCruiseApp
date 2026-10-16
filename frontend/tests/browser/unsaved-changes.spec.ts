import type { Page } from '@playwright/test';
import { test, expect, mockApplicationForms, type Api } from './fixtures';
import { admin } from '../data/accounts';
import { applicationId } from '../data/forms';

const UNSAVED = 'Notatka, której nie zapisano';
const formA = `/applications/${applicationId}/formA?mode=edit`;

test.use({ account: admin });
test.beforeEach(({ api }) => mockApplicationForms(api));

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
async function holdFormASave(page: Page, api: Api, status: number) {
  const { promise: released, resolve: release } = Promise.withResolvers<void>();
  await api('PUT', `/v2/applications/${applicationId}/form-a`, async (route) => {
    await released;
    await route.fulfill({ status, json: status >= 400 ? { detail: 'Serwer niedostępny' } : undefined });
  });
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

test('a successful save leaves the form without asking', async ({ page, api }) => {
  await api('PUT', `/v2/applications/${applicationId}/form-a`, (route) => route.fulfill({ status: 204 }));
  await page.goto(formA);
  await notes(page).fill(UNSAVED);
  await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
  await expectLeftWithoutPrompt(page);
});

test('a file dropped as the first edit is protected', async ({ page }) => {
  await page.goto(`/applications/${applicationId}/formC?mode=edit`);
  const photo = await page.evaluateHandle(() => {
    const transfer = new DataTransfer();
    transfer.items.add(new File([new Uint8Array([0xff, 0xd8, 0xff, 0xd9])], 'zdjecie.jpg', { type: 'image/jpeg' }));
    return transfer;
  });
  await page.getByTestId('form-c-attachment-input-button').dispatchEvent('drop', { dataTransfer: photo });
  await expect(page.getByRole('button', { name: 'zdjecie.jpg', exact: true })).toBeVisible();
  await goHome(page);
  await expect(dialog(page)).toBeVisible();
});

test.describe('pending saves', () => {
  test('edits stay protected while a save is pending and after it fails', async ({ page, api }) => {
    await page.goto(formA);
    await notes(page).fill(UNSAVED);
    const release = await holdFormASave(page, api, 503);
    await expectBrowserLeavePrompt(page);
    await goHome(page);
    await dialog(page).getByRole('button', { name: 'Zostań na stronie' }).click();
    release();
    await expect(page.getByText(/Serwer niedostępny/).first()).toBeVisible();
    await expect(notes(page)).toHaveValue(UNSAVED);
    await goHome(page);
    await expect(dialog(page)).toBeVisible();
  });

  test('edits made while a save is pending still ask after it succeeds', async ({ page, api }) => {
    await page.goto(formA);
    await notes(page).fill(UNSAVED);
    const release = await holdFormASave(page, api, 204);
    await notes(page).fill(`${UNSAVED} i dopisek`);
    release();
    await expect(dialog(page)).toBeVisible();
    await expect(page).toHaveURL(formA);
  });

  test('a save that finishes after the user left does not navigate away from the next page', async ({ page, api }) => {
    await page.goto(formA);
    await notes(page).fill(UNSAVED);
    const release = await holdFormASave(page, api, 204);
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
