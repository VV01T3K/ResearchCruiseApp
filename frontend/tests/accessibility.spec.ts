import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

import { API_URL, formTest as test } from './fixtures/fixtures';
import { getAdminAccountPayload, mockAuthenticatedSession } from './fixtures/mockPayloads';

/** axe rules for controls that assistive technology cannot name. */
const CONTROL_NAME_RULES = [
  'aria-command-name',
  'aria-input-field-name',
  'aria-toggle-field-name',
  'button-name',
  'input-button-name',
  'label',
  'link-name',
  'select-name',
];

async function expectNamedControls(page: Page) {
  const results = await new AxeBuilder({ page }).withRules(CONTROL_NAME_RULES).analyze();
  const violations = results.violations.flatMap((violation) =>
    violation.nodes.map((node) => `${violation.id}: ${node.target.join(' ')} ${node.html}`)
  );
  expect(violations).toEqual([]);
}

async function signInAsAdmin(page: Page) {
  await mockAuthenticatedSession(page);
  await page.route(`${API_URL}/v2/users/me`, (route) =>
    route.fulfill({ status: 200, body: JSON.stringify(getAdminAccountPayload()), contentType: 'application/json' })
  );
}

test.describe('control names', () => {
  test('header icon controls are named', async ({ page }) => {
    await signInAsAdmin(page);
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Wyloguj' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Radio MORS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Uniwersytet Gdański' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Poczta Uniwersytecka' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Odśwież sesję' })).toBeVisible();
    await expectNamedControls(page);
  });

  test('login page controls are named', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Radio MORS' })).toBeVisible();
    await expectNamedControls(page);
  });

  test('editable Form A controls are named', async ({ formAPage }) => {
    const { page } = formAPage;
    await formAPage.fillForm();
    await expect(page.getByRole('slider', { name: /początek/ }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Zwiększ' }).first()).toBeVisible();
    await expectNamedControls(page);
  });

  test('read-only Form A controls are named', async ({ formAPage }) => {
    await formAPage.fillForm();
    await formAPage.goto('view');
    await expect(formAPage.page.getByTestId('form-a-period-notes-input')).toBeVisible();
    await expectNamedControls(formAPage.page);
  });

  test('new application controls are named', async ({ formAPage }) => {
    const { page } = formAPage;
    await page.goto('/applications/new');
    await expect(page.getByTestId('form-a-period-notes-input')).toBeVisible();
    await expectNamedControls(page);
  });

  test('editable Form B controls are named', async ({ formBPage }) => {
    await formBPage.fillForm();
    await expect(formBPage.page.getByRole('checkbox').first()).toBeVisible();
    await expectNamedControls(formBPage.page);
  });

  test('editable Form C controls are named', async ({ formCPage }) => {
    await formCPage.fillForm();
    await expect(formCPage.page.getByRole('checkbox').first()).toBeVisible();
    await expectNamedControls(formCPage.page);
  });
});
