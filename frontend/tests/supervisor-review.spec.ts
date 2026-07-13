import { expect } from '@playwright/test';

import { API_URL, test } from './fixtures/fixtures';
import { getFormAPayload, getInitValuesAPayload } from './fixtures/mockPayloads';

const applicationId = '98ffcaf1-ae8c-4d0f-b647-08ddbc7c9753';
const supervisorCode = 'review-code';

function getSupervisorReviewPayload() {
  return {
    form: getFormAPayload(),
    initValues: getInitValuesAPayload(),
  };
}

test('supervisor review loads from one bundled v2 route', async ({ page }) => {
  let requests = 0;
  await page.route(`${API_URL}/v2/applications/${applicationId}/supervisor-review?*`, async (route) => {
    requests += 1;
    await route.fulfill({
      status: 200,
      body: JSON.stringify(getSupervisorReviewPayload()),
      contentType: 'application/json',
    });
  });

  await page.goto(`/cruise-approval?cruiseApplicationId=${applicationId}&supervisorCode=${supervisorCode}`);

  await expect(page.getByText('Formularz A')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Zaakceptuj' })).toBeVisible();
  expect(requests).toBe(1);
});

test('supervisor review decisions use the v2 decision route', async ({ page }) => {
  const requests: unknown[] = [];
  await page.route(`${API_URL}/v2/applications/${applicationId}/supervisor-review?*`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(getSupervisorReviewPayload()),
      contentType: 'application/json',
    });
  });
  await page.route(`${API_URL}/v2/applications/${applicationId}/supervisor-review/decision`, async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ status: 204 });
  });

  await page.goto(`/cruise-approval?cruiseApplicationId=${applicationId}&supervisorCode=${supervisorCode}`);
  await page.getByRole('button', { name: 'Zaakceptuj' }).click();
  await page.goto(`/cruise-approval?cruiseApplicationId=${applicationId}&supervisorCode=${supervisorCode}`);
  await page.getByRole('button', { name: 'Odrzuć' }).click();

  await expect
    .poll(() => requests)
    .toEqual([
      { accept: true, code: supervisorCode },
      { accept: false, code: supervisorCode },
    ]);
});
