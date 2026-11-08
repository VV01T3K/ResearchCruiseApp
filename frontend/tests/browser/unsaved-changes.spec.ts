import type { Page } from '@playwright/test';
import type { NetworkFixture } from '@msw/playwright';
import {
  getGetApplicationFormAMockHandler,
  getGetApplicationFormBMockHandler,
  getGetApplicationFormCMockHandler,
  getUpdateApplicationFormAMockHandler,
  getUpdateApplicationFormBMockHandler,
  getUpdateApplicationFormCMockHandler,
} from '@/api/generated/mocks/applications/applications.msw.gen';
import { getGetCruiseBlockadesMockHandler } from '@/api/generated/mocks/cruises/cruises.msw.gen';
import {
  getGetCurrentSessionMockHandler,
  getLoginMockHandler,
  getLogoutMockHandler,
  getRefreshTokensMockHandler,
} from '@/api/generated/mocks/auth/auth.msw.gen';
import { getGetCurrentUserMockHandler } from '@/api/generated/mocks/users/users.msw.gen';
import type { CurrentUserResponse } from '@/api/generated/schemas';
import { HttpResponse } from 'msw';
import { test, expect, applicationForms, dropFile, fail } from './fixtures';
import { admin, outsider, session } from '../data/accounts';
import { applicationId, formA as formAFields, formB, formC } from '../data/forms';

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
  await dropFile(page.getByRole('button', { name: 'Załączniki' }), {
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

  test('edits made while a save is pending still ask after it succeeds, and staying can save them', async ({
    page,
    network,
    requests,
  }) => {
    await page.goto(formA);
    await notes(page).fill(UNSAVED);
    const release = await holdFormASave(page, network, 'saved');
    await notes(page).fill(`${UNSAVED} i dopisek`);
    release();
    await dialog(page).getByRole('button', { name: 'Zostań na stronie' }).click();
    await expect(page).toHaveURL(formA);
    await page.getByRole('button', { name: 'Wyślij', exact: true }).click();
    await expect(page).toHaveURL('/');
    expect(requests.bodies(`PUT /v2/applications/${applicationId}/form-a`)).toHaveLength(2);
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
    await expect(
      page.getByRole('region', { name: 'Notifications' }).getByText('Formularz został zapisany')
    ).toBeVisible();
    await expect(page).toHaveURL(/\/applications\/new\?draft=/);
    await expect(notes(page)).toHaveValue(UNSAVED);
  });
});

test.describe('returning to view mode', () => {
  const employees = (page: Page) => page.locator('input[name="ugTeams[0].noOfEmployees"]');
  const description = (page: Page) => page.getByLabel('Dodatkowy opis');
  const draft = 'Zapisz wersję roboczą';
  const forms = [
    {
      name: 'A',
      route: 'form-a',
      field: notes,
      save: 'Wyślij',
      stored: (revision: string) => getGetApplicationFormAMockHandler({ ...formAFields(), revision }),
      update: getUpdateApplicationFormAMockHandler,
    },
    {
      name: 'B',
      route: 'form-b',
      field: employees,
      save: draft,
      stored: (revision: string) => getGetApplicationFormBMockHandler({ ...formB(), revision }),
      update: getUpdateApplicationFormBMockHandler,
    },
    {
      name: 'C',
      route: 'form-c',
      field: description,
      save: draft,
      stored: (revision: string) => getGetApplicationFormCMockHandler({ ...formC(), revision }),
      update: getUpdateApplicationFormCMockHandler,
    },
  ];

  /** No app link switches a mounted form's mode except form B's revert, so this enters edit mode as it does. */
  async function switchToEdit(page: Page, form: string) {
    await page.evaluate(
      (href) => window.history.pushState({ __TSR_index: window.history.state.__TSR_index + 1 }, '', href),
      `/applications/${applicationId}/form${form}?mode=edit`
    );
    await expect(page).toHaveURL(/mode=edit/);
  }

  async function discardToView(page: Page) {
    await page.goBack();
    await dialog(page).getByRole('button', { name: 'Opuść bez zapisywania' }).click();
    await expect(page).toHaveURL(/mode=view/);
  }

  for (const { name, route, field, save, stored, update } of forms) {
    test(`form ${name} shows the saved version after a discard`, async ({ page, network, requests }) => {
      const puts = () => requests.bodies(`PUT /v2/applications/${applicationId}/${route}`);
      const { promise: released, resolve: release } = Promise.withResolvers<void>();
      await page.goto(`/applications/${applicationId}/form${name}?mode=view`);
      const original = await field(page).inputValue();

      await switchToEdit(page, name);
      await field(page).fill('3');
      await discardToView(page);
      await expect(field(page)).toHaveValue(original);

      network.use(
        update(async () => {
          await released;
          return { revision: 'AAAAAAAAB9I=' };
        })
      );
      await switchToEdit(page, name);
      await field(page).fill('4');
      await page.getByRole('button', { name: save, exact: true }).click();
      await expect.poll(() => puts().length).toBe(1);
      await field(page).fill('5');
      release();
      await dialog(page).getByRole('button', { name: 'Zostań na stronie' }).click();
      await discardToView(page);
      await expect(field(page)).toHaveValue('4');

      network.use(
        update(() => {
          network.use(stored('AAAAAAAAB9M='));
          throw HttpResponse.json({ detail: 'Dane zostały w międzyczasie zmienione.' }, { status: 409 });
        })
      );
      await switchToEdit(page, name);
      await page.getByRole('button', { name: save, exact: true }).click();
      await expect(page.getByRole('alert').getByText(/Dane zostały w międzyczasie zmienione/)).toBeVisible();
      expect(puts()[1]).toEqual(
        expect.objectContaining({ form: expect.objectContaining({ revision: 'AAAAAAAAB9I=' }) })
      );
      await discardToView(page);
      await expect(field(page)).toHaveValue(original);

      network.use(update({ revision: 'AAAAAAAAB9U=' }));
      await switchToEdit(page, name);
      await page.getByRole('button', { name: save, exact: true }).click();
      await expect.poll(() => puts().length).toBe(3);
      expect(puts()[2]).toEqual(
        expect.objectContaining({ form: expect.objectContaining({ revision: 'AAAAAAAAB9M=' }) })
      );
    });
  }

  test('form C drops a discarded attachment and form A follows the restored year', async ({ page, network }) => {
    await page.goto(`/applications/${applicationId}/formC?mode=view`);
    await expect(description(page)).toBeVisible();
    await switchToEdit(page, 'C');
    await dropFile(page.getByRole('button', { name: 'Załączniki' }), {
      name: 'niezapisane.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0xd9]),
    });
    await expect(page.getByRole('button', { name: 'niezapisane.jpg', exact: true })).toBeVisible();
    await discardToView(page);
    await expect(page.getByRole('button', { name: 'niezapisane.jpg', exact: true })).toHaveCount(0);

    network.use(
      getGetCruiseBlockadesMockHandler(({ request }) =>
        new URL(request.url).searchParams.get('year') === '2027'
          ? [{ title: 'Blokada 2027', startDate: '2027-06-01T00:00:00Z', endDate: '2027-06-03T00:00:00Z' }]
          : []
      )
    );
    await page.goto(`/applications/${applicationId}/formA?mode=view`);
    await expect(notes(page)).toBeVisible();
    await switchToEdit(page, 'A');
    await page.getByRole('combobox', { name: 'Rok' }).click();
    await page.getByRole('option', { name: '2027' }).click();
    await expect(page.getByText('Blokady statku w roku 2027')).toBeVisible();
    await discardToView(page);
    await expect(page.getByRole('combobox', { name: 'Rok' })).toHaveText(/2026/);
    await expect(page.getByText('Blokady statku w roku')).toHaveCount(0);
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
    await expect(page.getByRole('alert').getByText(/Dane zostały w międzyczasie zmienione/)).toBeVisible();
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

  async function signOutInAnotherTabAndBackIn(page: Page, network: NetworkFixture, account: CurrentUserResponse) {
    network.use(
      getGetCurrentSessionMockHandler(tokens(admin.id)),
      getLogoutMockHandler(() =>
        network.use(getGetCurrentSessionMockHandler(null), getGetCurrentUserMockHandler(fail(401)))
      )
    );
    await page.goto(formA);
    await notes(page).fill(UNSAVED);
    const other = await page.context().newPage();
    await other.goto('/');
    await other.getByRole('button', { name: 'Wyloguj', exact: true }).click();
    await expect(page).toHaveURL(/\/login/);
    await expect(dialog(page)).toHaveCount(0);

    network.use(getLoginMockHandler(tokens(account.id)), getGetCurrentUserMockHandler(account));
    for (const tab of [other, page]) {
      await tab.getByLabel('E-mail').fill(account.email);
      await tab.getByLabel('Hasło', { exact: true }).fill('Password1!');
      await tab.getByRole('button', { name: 'Zaloguj', exact: true }).click();
      await expect(tab).not.toHaveURL(/\/login/);
      if (tab === other) await expect(page).toHaveURL(/\/login/);
    }
    await expect(page).toHaveURL(formA);
  }

  test('a sign-out in another tab keeps them, and a sign-in there leaves this tab signed out', async ({
    page,
    network,
  }) => {
    await signOutInAnotherTabAndBackIn(page, network, admin);
    await recovery(page).getByRole('button', { name: 'Przywróć zmiany' }).click();
    await expect(notes(page)).toHaveValue(UNSAVED);
  });

  test('another account signing in does not get them', async ({ page, network }) => {
    await signOutInAnotherTabAndBackIn(page, network, outsider);
    await expect(notes(page)).toBeVisible();
    await expect(notes(page)).not.toHaveValue(UNSAVED);
    await expect(recovery(page)).toHaveCount(0);
  });
});
