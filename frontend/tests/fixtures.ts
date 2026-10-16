import { test as base } from '@playwright/test';

export const apiUrl = 'http://127.0.0.1:5174/api';

export const test = base.extend<{ forEachTest: void }>({
  forEachTest: [
    async ({ page }, use) => {
      // Health check api mock
      page.route(`${apiUrl}/health`, (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ status: 'ok' }),
          contentType: 'application/json',
        });
      });

      await use();

      // Cleanup code after each test
    },
    { auto: true },
  ],
});
