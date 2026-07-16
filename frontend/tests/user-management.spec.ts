import { expect, Page } from '@playwright/test';

import { API_URL, test } from './fixtures/fixtures';
import { getAdminAccountPayload, mockAuthenticatedSession } from './fixtures/mockPayloads';

const user = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'managed@example.com',
  firstName: 'Managed',
  lastName: 'User',
  roles: ['CruiseManager'],
  emailConfirmed: true,
  accepted: false,
};

async function seedAuthenticatedAdmin(page: Page) {
  await mockAuthenticatedSession(page);
  await page.route(`${API_URL}/v2/users/me`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(getAdminAccountPayload()),
      contentType: 'application/json',
    });
  });
}

test('user management list loads from the v2 users route', async ({ page }) => {
  await seedAuthenticatedAdmin(page);
  let requested = false;
  await page.route(`${API_URL}/v2/users`, async (route) => {
    requested = true;
    await route.fulfill({
      status: 200,
      body: JSON.stringify([user]),
      contentType: 'application/json',
    });
  });

  await page.goto('/user-management');

  await expect(page.getByText('Managed User')).toBeVisible();
  expect(requested).toBe(true);
});

test('role guard refreshes stale account data before allowing navigation', async ({ page }) => {
  await mockAuthenticatedSession(page);
  let profileRequests = 0;
  let account = getAdminAccountPayload();
  await page.route(`${API_URL}/v2/users/me`, (route) => {
    profileRequests += 1;
    return route.fulfill({
      status: 200,
      body: JSON.stringify(account),
      contentType: 'application/json',
    });
  });

  await page.goto('/');
  await expect(page.getByText('Zarządzanie użytkownikami')).toBeVisible();

  account = { ...account, roles: ['Guest'] };
  await page.evaluate(() => {
    const staleTime = Date.now() + 60_001;
    Date.now = () => staleTime;
  });
  await page.getByText('Zarządzanie użytkownikami').click();

  await expect.poll(() => profileRequests).toBeGreaterThan(1);
  await expect(page).toHaveURL('/');
});

test('user management create, update, delete, accept, and deactivate use v2 routes', async ({ page }) => {
  await seedAuthenticatedAdmin(page);
  const requests: string[] = [];
  let currentUser = { ...user };
  await page.route(`${API_URL}/v2/users`, async (route) => {
    if (route.request().method() === 'POST') {
      requests.push('create');
      return route.fulfill({ status: 201 });
    }

    return route.fulfill({
      status: 200,
      body: JSON.stringify([currentUser]),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/users/${user.id}`, async (route) => {
    requests.push(route.request().method() === 'PATCH' ? 'update' : 'delete');
    if (route.request().method() === 'PATCH') {
      const request = route.request().postDataJSON() as {
        firstName: string;
      };
      currentUser = { ...currentUser, firstName: request.firstName };
    }
    await route.fulfill({ status: 204 });
  });
  await page.route(`${API_URL}/v2/users/${user.id}/roles/*`, async (route) => {
    await route.fulfill({ status: 204 });
  });
  await page.route(`${API_URL}/v2/users/${user.id}/acceptance`, async (route) => {
    const accepted = route.request().method() === 'PUT';
    requests.push(accepted ? 'accept' : 'deactivate');
    currentUser = { ...currentUser, accepted };
    await route.fulfill({ status: 204 });
  });

  await page.goto('/user-management');
  await page.getByRole('button', { name: 'Dodaj użytkownika' }).click();
  await page.locator('input[name="firstName"]').fill('New');
  await page.locator('input[name="lastName"]').fill('User');
  await page.locator('input[name="email"]').fill('new@example.com');
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Kierownik' }).click();
  await page.getByRole('button', { name: 'Dodaj' }).click();
  await expect.poll(() => requests).toContain('create');

  await page.getByRole('button', { name: 'Edytuj' }).click();
  await page.locator('input[name="firstName"]').fill('Updated');
  await page.getByRole('button', { name: 'Zapisz' }).click();
  await expect.poll(() => requests).toContain('update');

  await page.getByRole('button', { name: 'Edytuj' }).click();
  await page.getByRole('button', { name: 'Zaakceptuj konto użytkownika' }).click();
  await expect.poll(() => requests).toContain('accept');

  await page.getByRole('button', { name: 'Edytuj' }).click();
  await page.getByRole('button', { name: 'Cofnij akceptację konta' }).click();
  await expect.poll(() => requests).toContain('deactivate');

  await page.getByRole('button', { name: 'Edytuj' }).click();
  await page.getByRole('button', { name: 'Usuń', exact: true }).click();
  await page.getByRole('button', { name: 'Czy na pewno?' }).click();
  await expect.poll(() => requests).toContain('delete');
});

test('cruise manager options load from the v2 users route', async ({ page }) => {
  await seedAuthenticatedAdmin(page);
  let requested = false;
  await page.route(`${API_URL}/v2/applications/for-cruise-planning`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([]),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/users/available-cruise-managers`, async (route) => {
    requested = true;
    await route.fulfill({
      status: 200,
      body: JSON.stringify([user]),
      contentType: 'application/json',
    });
  });

  await page.goto('/cruises/new');

  await expect(page.getByText('3. Kierownik główny i zastępca kierownika głównego')).toBeVisible();
  expect(requested).toBe(true);
});
