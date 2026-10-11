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

/**
 * Tabs through the page and returns every focus stop without a visible indicator
 * (a non-zero outline or a focus box-shadow).
 */
async function focusStopsWithoutIndicator(page: Page, maxStops = 250) {
  const missing: string[] = [];
  const seen = new Set<number>();
  for (let stop = 0; stop < maxStops; stop++) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      const hasOutline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 1;
      const hasShadow = style.boxShadow !== 'none';
      const registry = ((window as { focusStops?: Element[] }).focusStops ??= []);
      if (!registry.includes(el)) registry.push(el);
      const name = el.getAttribute('aria-label') ?? el.getAttribute('title') ?? el.textContent?.trim();
      const path = [el.tagName.toLowerCase(), el.id && `#${el.id}`, name].filter(Boolean).join(' ').slice(0, 120);
      return { path, key: registry.indexOf(el), visible: hasOutline || hasShadow };
    });
    if (!focused) continue;
    if (seen.has(focused.key)) break; // wrapped around
    seen.add(focused.key);
    // The TanStack Query devtools toggle exists only in development builds.
    if (!focused.visible && !/tanstack query devtools/i.test(focused.path)) missing.push(focused.path);
  }
  return { missing, stops: seen.size };
}

test.describe('keyboard focus', () => {
  test('header controls show a focus indicator', async ({ page }) => {
    await signInAsAdmin(page);
    await page.goto('/');
    const signOut = page.getByRole('button', { name: 'Wyloguj' });
    await expect(signOut).toBeVisible();

    for (let stop = 0; stop < 20 && !(await signOut.evaluate((el) => el === document.activeElement)); stop++) {
      await page.keyboard.press('Tab');
    }
    await expect(signOut).toBeFocused();
    const outline = await signOut.evaluate((el) => {
      const style = getComputedStyle(el);
      return { matches: el.matches(':focus-visible'), style: style.outlineStyle, width: style.outlineWidth };
    });
    expect(outline).toEqual({ matches: true, style: 'solid', width: '2px' });
  });

  test('every focus stop on the dashboard is visible', async ({ page }) => {
    await signInAsAdmin(page);
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Wyloguj' })).toBeVisible();

    const { missing, stops } = await focusStopsWithoutIndicator(page);
    expect(stops).toBeGreaterThan(5);
    expect(missing).toEqual([]);
  });

  test('every focus stop on an editable Form A is visible', async ({ formAPage }) => {
    const { page } = formAPage;
    await formAPage.fillForm();
    await expect(page.getByTestId('form-a-period-notes-input')).toBeVisible();

    const { missing, stops } = await focusStopsWithoutIndicator(page, 400);
    expect(stops).toBeGreaterThan(30);
    expect(missing).toEqual([]);
  });
});
