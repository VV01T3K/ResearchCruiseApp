import { test as base } from '@playwright/test';
import { API_URL, TESTED_FORM_ID } from '@tests/fixtures/consts';

import { FormAPage } from './pages/formA/formAPage';
import { FormBPage } from './pages/formB/formBPage';
import { FormCPage } from './pages/formC/formCPage';
import { LoginPage } from './pages/loginPage';
export { API_URL, ASSETS_DIR } from '@tests/fixtures/consts';

export const test = base.extend<{ forEachTest: void }>({
  forEachTest: [
    async ({ page }, use) => {
      // By default raise an error if the API is not mocked
      page.route(`${API_URL}/**`, (route) => {
        throw new Error(`API call not mocked: ${route.request().url()}`);
      });

      // Health check api mock
      page.route(`${API_URL}/health`, (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ status: 'ok' }),
          contentType: 'application/json',
        });
      });

      await use();
    },
    { auto: true },
  ],
});

export const loginTest = test.extend<{ loginPage: LoginPage }>({
  loginPage: [
    async ({ page }, use) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await use(loginPage);
    },
    { auto: false },
  ],
});

export const formTest = test.extend<{ formAPage: FormAPage; formBPage: FormBPage; formCPage: FormCPage }>({
  formAPage: [
    async ({ page }, use) => {
      const formAPage = await FormAPage.create(page);
      await use(formAPage);
    },
    { auto: false },
  ],
  formBPage: [
    async ({ page }, use) => {
      const formBPage = await FormBPage.create(page, TESTED_FORM_ID);
      await use(formBPage);
    },
    { auto: false },
  ],
  formCPage: [
    async ({ page }, use) => {
      const formCPage = await FormCPage.create(page, TESTED_FORM_ID);
      await use(formCPage);
    },
    { auto: false },
  ],
});
