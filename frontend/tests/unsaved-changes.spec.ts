import { expect, type Locator, type Page } from '@playwright/test';

import fs from 'fs';

import { API_URL, formTest as test } from './fixtures/fixtures';
import { MOCK_IMAGE_FILEPATH, TESTED_FORM_ID } from './fixtures/consts';

const UNSAVED_TEXT = 'Notatka, której nie zapisano';
const homeLinkName = 'Portal rejsów badawczych R/V Oceanograf';

function unsavedChangesDialog(page: Page) {
  return page.getByRole('dialog', { name: 'Niezapisane zmiany' });
}

function periodNotes(page: Page) {
  return page.getByTestId('form-a-period-notes-input');
}

test.describe('unsaved application edits', () => {
  test('leaving an untouched form does not ask for confirmation', async ({ formAPage: { page } }) => {
    await expect(periodNotes(page)).toBeVisible();

    await page.getByRole('link', { name: homeLinkName }).click();

    await expect(page).toHaveURL('/');
    await expect(unsavedChangesDialog(page)).toHaveCount(0);
  });

  test('leaving an untouched new application does not ask, although its periods normalise on load', async ({
    formAPage: { page },
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Nowe zgłoszenie/ }).click();
    await expect(periodNotes(page)).toBeVisible();
    await expect(page.getByRole('slider').first()).toBeVisible();

    await page.getByRole('link', { name: homeLinkName }).click();

    await expect(page).toHaveURL('/');
    await expect(unsavedChangesDialog(page)).toHaveCount(0);
  });

  test('an in-app link asks before discarding edits, and staying keeps them', async ({ formAPage: { page } }) => {
    const formUrl = page.url();
    await periodNotes(page).fill(UNSAVED_TEXT);

    await page.getByRole('link', { name: homeLinkName }).click();

    const dialog = unsavedChangesDialog(page);
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Zostań na stronie' }).click();
    await expect(dialog).toBeHidden();
    expect(page.url()).toBe(formUrl);
    await expect(periodNotes(page)).toHaveValue(UNSAVED_TEXT);

    await page.getByRole('link', { name: homeLinkName }).click();
    await unsavedChangesDialog(page).getByRole('button', { name: 'Opuść bez zapisywania' }).click();
    await expect(page).toHaveURL('/');
  });

  test('browser Back asks before discarding edits on a new application', async ({ formAPage: { page } }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Nowe zgłoszenie/ }).click();
    await expect(page).toHaveURL('/applications/new');
    await periodNotes(page).fill(UNSAVED_TEXT);

    await page.goBack();

    const dialog = unsavedChangesDialog(page);
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Zostań na stronie' }).click();
    await expect(page).toHaveURL('/applications/new');
    await expect(periodNotes(page)).toHaveValue(UNSAVED_TEXT);
  });

  test('reloading with edits triggers the native leave-page prompt', async ({ formAPage: { page } }) => {
    await periodNotes(page).fill(UNSAVED_TEXT);
    await periodNotes(page).click();

    const prompt = page.waitForEvent('dialog');
    const reload = page.evaluate(() => window.location.reload());
    const dialog = await prompt;
    expect(dialog.type()).toBe('beforeunload');
    await dialog.dismiss();
    await reload;

    await expect(periodNotes(page)).toHaveValue(UNSAVED_TEXT);
  });

  test('a successful save leaves the form without asking', async ({ formAPage }) => {
    const { page } = formAPage;
    await formAPage.fillForm();
    await periodNotes(page).fill(UNSAVED_TEXT);

    await formAPage.submitForm({ expectedResult: 'valid' });

    await expect(page).toHaveURL('/');
    await expect(unsavedChangesDialog(page)).toHaveCount(0);
  });

  test('a read-only form never asks', async ({ formAPage }) => {
    const { page } = formAPage;
    await formAPage.goto('view');
    await expect(periodNotes(page)).toBeVisible();

    await page.getByRole('link', { name: homeLinkName }).click();

    await expect(page).toHaveURL('/');
    await expect(unsavedChangesDialog(page)).toHaveCount(0);
  });
});

test.describe('edits made without pointer or keyboard events', () => {
  test('a trusted input event alone, as from autofill or dictation, is protected', async ({ formAPage: { page } }) => {
    await expect(periodNotes(page)).toBeVisible();
    await page.evaluate(() => {
      for (const type of ['beforeinput', 'pointerdown', 'keydown', 'keyup']) {
        window.addEventListener(type, (event) => event.stopImmediatePropagation(), { capture: true });
      }
    });
    await periodNotes(page).evaluate((element: HTMLElement) => element.focus());
    await page.keyboard.insertText(UNSAVED_TEXT);
    await expect(periodNotes(page)).toHaveValue(UNSAVED_TEXT);

    await page.getByRole('link', { name: homeLinkName }).click();

    await expect(unsavedChangesDialog(page)).toBeVisible();
  });

  test('a file dropped as the first edit is protected', async ({ formCPage }) => {
    const { page } = formCPage;
    await formCPage.fillForm();
    const dropZone = page.getByTestId('form-c-attachment-input-button');
    await expect(dropZone).toBeVisible();

    const image = fs.readFileSync(MOCK_IMAGE_FILEPATH).toString('base64');
    const dataTransfer = await page.evaluateHandle((base64) => {
      const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
      const transfer = new DataTransfer();
      transfer.items.add(new File([bytes], 'zdjecie.jpg', { type: 'image/jpeg' }));
      return transfer;
    }, image);
    await dropZone.dispatchEvent('drop', { dataTransfer });
    await expect(page.getByRole('button', { name: 'zdjecie.jpg', exact: true })).toBeVisible();

    await page.getByRole('link', { name: homeLinkName }).click();

    await expect(unsavedChangesDialog(page)).toBeVisible();
  });
});

async function submitHeldFormASave(page: Page, status: number) {
  let releaseSave!: () => void;
  const saveReleased = new Promise<void>((resolve) => (releaseSave = resolve));
  await page.route(`${API_URL}/v2/applications/${TESTED_FORM_ID}/form-a`, async (route) => {
    if (route.request().method() !== 'PUT') return route.fallback();
    await saveReleased;
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ status }) });
  });
  const saveRequest = page.waitForRequest((request) => request.method() === 'PUT' && request.url().endsWith('/form-a'));
  await page.getByTestId('form-submit-btn').click();
  await saveRequest;
  return releaseSave;
}

test.describe('pending saves', () => {
  test('edits stay protected while a save is pending and after it fails', async ({ formAPage }) => {
    const { page } = formAPage;
    await formAPage.fillForm();
    await periodNotes(page).fill(UNSAVED_TEXT);

    const releaseSave = await submitHeldFormASave(page, 500);

    const prompt = page.waitForEvent('dialog');
    const reload = page.evaluate(() => window.location.reload());
    const nativeDialog = await prompt;
    expect(nativeDialog.type()).toBe('beforeunload');
    await nativeDialog.dismiss();
    await reload;

    await page.getByRole('link', { name: homeLinkName }).click();
    const dialog = unsavedChangesDialog(page);
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Zostań na stronie' }).click();

    releaseSave();
    await expect(page.getByTestId('toast-error').first()).toBeVisible();
    await expect(periodNotes(page)).toHaveValue(UNSAVED_TEXT);

    await page.getByRole('link', { name: homeLinkName }).click();
    await expect(unsavedChangesDialog(page)).toBeVisible();
  });

  test('edits made while a save is pending still ask after it succeeds', async ({ formAPage }) => {
    const { page } = formAPage;
    await formAPage.fillForm();
    const formUrl = page.url();
    await periodNotes(page).fill(UNSAVED_TEXT);

    const releaseSave = await submitHeldFormASave(page, 200);
    await periodNotes(page).fill(`${UNSAVED_TEXT} i dopisek`);
    releaseSave();

    await expect(page.getByTestId('toast-success')).toBeVisible();
    await expect(unsavedChangesDialog(page)).toBeVisible();
    expect(page.url()).toBe(formUrl);
  });

  test('a save that finishes after the user left does not navigate away from the next page', async ({ formAPage }) => {
    const { page } = formAPage;
    await formAPage.fillForm();
    await periodNotes(page).fill(UNSAVED_TEXT);

    const releaseSave = await submitHeldFormASave(page, 200);
    await page.getByRole('link', { name: homeLinkName }).click();
    await unsavedChangesDialog(page).getByRole('button', { name: 'Opuść bez zapisywania' }).click();
    await page.getByRole('link', { name: /Nowe zgłoszenie/ }).click();
    await periodNotes(page).fill(UNSAVED_TEXT);
    releaseSave();

    await expect(page.getByTestId('toast-success')).toBeVisible();
    await expect(page).toHaveURL('/applications/new');
    await expect(periodNotes(page)).toHaveValue(UNSAVED_TEXT);
  });
});

test('disallowing past dates, which clamps a saved period, asks before leaving', async ({ formAPage }) => {
  const { page } = formAPage;
  await page.clock.setFixedTime(new Date('2026-10-15T12:00:00'));
  await formAPage.fillForm();
  await expect(page.getByText('Wybrano okres: Cały rok').first()).toBeVisible();

  await page.getByText('Zezwól na wybór dat z przeszłości').click();
  await expect(page.getByText('Wybrano okres: Cały rok')).toHaveCount(0);
  await page.getByRole('link', { name: homeLinkName }).click();

  await expect(unsavedChangesDialog(page)).toBeVisible();
});

async function leaveLoadedForm(page: Page, field: Locator, edit: boolean) {
  await expect(field).toBeEditable();
  if (edit) await field.fill('7');

  await page.getByRole('link', { name: homeLinkName }).click();
}

test.describe('unsaved Form B and C edits', () => {
  test('a loaded Form B is not treated as edited', async ({ formBPage }) => {
    await formBPage.fillForm();
    await leaveLoadedForm(
      formBPage.page,
      formBPage.sections.membersSection.ugUnitRow('first').noOfEmployeesInput,
      false
    );
    await expect(formBPage.page).toHaveURL('/');
    await expect(unsavedChangesDialog(formBPage.page)).toHaveCount(0);
  });

  test('an edited Form B asks before leaving', async ({ formBPage }) => {
    await formBPage.fillForm();
    await leaveLoadedForm(
      formBPage.page,
      formBPage.sections.membersSection.ugUnitRow('first').noOfEmployeesInput,
      true
    );
    await expect(unsavedChangesDialog(formBPage.page)).toBeVisible();
  });

  test('a loaded Form C is not treated as edited', async ({ formCPage }) => {
    await formCPage.fillForm();
    await leaveLoadedForm(formCPage.page, formCPage.page.getByTestId('form-c-description-input'), false);
    await expect(formCPage.page).toHaveURL('/');
    await expect(unsavedChangesDialog(formCPage.page)).toHaveCount(0);
  });

  test('an edited Form C asks before leaving', async ({ formCPage }) => {
    await formCPage.fillForm();
    await leaveLoadedForm(formCPage.page, formCPage.page.getByTestId('form-c-description-input'), true);
    await expect(unsavedChangesDialog(formCPage.page)).toBeVisible();
  });
});
