import type { Page } from '@playwright/test';
import type { NetworkFixture } from '@msw/playwright';
import {
  getGetApplicationFormBMockHandler,
  getUpdateApplicationFormAMockHandler,
  getUpdateApplicationFormBMockHandler,
} from '@/api/generated/mocks/applications/applications.msw.gen';
import {
  getGetCurrentSessionMockHandler,
  getLoginMockHandler,
  getRefreshTokensMockHandler,
} from '@/api/generated/mocks/auth/auth.msw.gen';
import { getGetCurrentUserMockHandler } from '@/api/generated/mocks/users/users.msw.gen';
import type { CurrentUserResponse } from '@/api/generated/schemas';
import { HttpResponse } from 'msw';
import { test, expect, applicationForms, dropFile, fail } from './fixtures';
import { admin, outsider, session } from '../data/accounts';
import { applicationId, formB } from '../data/forms';

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
      return { revision: 'AAAAAAAAB9I=' };
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

test('browser Back asks before discarding edits on a new application', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Nowe zgłoszenie/ }).click();
  await expect(page).toHaveURL(/\/applications\/new\?draft=/);
  await notes(page).fill(UNSAVED);
  await page.goBack();
  await dialog(page).getByRole('button', { name: 'Zostań na stronie' }).click();
  await expect(page).toHaveURL(/\/applications\/new\?draft=/);
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
    await expect(page).toHaveURL(/\/applications\/new\?draft=/);
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

test.describe('edits lost when the session ends', () => {
  const formBUrl = `/applications/${applicationId}/formB?mode=edit`;
  const employees = (page: Page) => page.locator('input[name="ugTeams[0].noOfEmployees"]');
  const recovery = (page: Page) => page.getByRole('dialog', { name: 'Odzyskane zmiany' });
  const claim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
  const tokens = (id: string) => ({
    ...session(),
    accessToken: `header.${Buffer.from(JSON.stringify({ [claim]: id })).toString('base64url')}.signature`,
  });

  async function expireAndSignInAs(page: Page, network: NetworkFixture, account: CurrentUserResponse) {
    network.use(getGetCurrentSessionMockHandler(tokens(admin.id)));
    await page.clock.install();
    await page.goto(formBUrl);
    await employees(page).fill('7');
    network.use(getRefreshTokensMockHandler(fail(401)), getGetCurrentUserMockHandler(fail(401)));
    await page.clock.fastForward(30 * 60_000);
    await expect(page).toHaveURL(/\/login/);
    network.use(
      getLoginMockHandler(tokens(account.id)),
      getGetCurrentUserMockHandler(account),
      getGetApplicationFormBMockHandler({ ...formB(), revision: 'AAAAAAAAB9M=' })
    );
    await page.getByLabel('E-mail').fill(account.email);
    await page.getByLabel('Hasło', { exact: true }).fill('Password1!');
    await page.getByRole('button', { name: 'Zaloguj', exact: true }).click();
    await expect(page).toHaveURL(formBUrl);
  }

  test('are offered to the same account and keep the revision they were read with', async ({
    page,
    network,
    requests,
  }) => {
    network.use(getUpdateApplicationFormBMockHandler(fail(409, { detail: 'Dane zostały w międzyczasie zmienione.' })));
    await expireAndSignInAs(page, network, admin);
    await recovery(page).getByRole('button', { name: 'Przywróć zmiany' }).click();
    await expect(employees(page)).toHaveValue('7');
    await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
    await expect(page.getByTestId('form-errors').getByText(/Dane zostały w międzyczasie zmienione/)).toBeVisible();
    await expect(employees(page)).toHaveValue('7');
    expect(requests.bodies(`PUT /v2/applications/${applicationId}/form-b`)).toEqual([
      expect.objectContaining({ form: expect.objectContaining({ revision: 'AAAAAAAAB9E=' }) }),
    ]);
  });

  test('are not shown to another account', async ({ page, network }) => {
    await expireAndSignInAs(page, network, outsider);
    await expect(employees(page)).toHaveValue('2');
    await expect(recovery(page)).toHaveCount(0);
  });
});
