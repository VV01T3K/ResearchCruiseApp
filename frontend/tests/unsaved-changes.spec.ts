import { expect, type Locator, type Page } from '@playwright/test';

import { formTest as test } from './fixtures/fixtures';

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
    // Chromium only shows beforeunload prompts after a real user gesture on the page.
    await periodNotes(page).click();

    const prompt = page.waitForEvent('dialog');
    const reload = page.reload().catch(() => undefined);
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
