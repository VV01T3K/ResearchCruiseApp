import { type BrowserContext } from '@playwright/test';
import { API_URL } from '@tests/fixtures/consts';

export const getBasePage = async (context: BrowserContext) => {
  const page = await context.newPage();

  // By default raise an error if the API is not mocked
  page.route(`${API_URL}/**`, (route) => {
    throw new Error(`API call not mocked: ${route.request().url()}`);
  });

  page.route(`${API_URL}/health`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ status: 'ok' }),
      contentType: 'application/json',
    });
  });

  return page;
};
