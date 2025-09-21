import { expect } from '@playwright/test';

import { API_URL, test } from './fixtures/fixtures';

test('connection error when server is not available', async ({ page }) => {
  // Mock the server health check to simulate a connection error
  page.route('http://localhost:3000/health', (route) => {
    route.abort();
  });

  await page.goto('/');
  await expect(page.getByText('Brak połączenia z serwerem')).toBeVisible();
});

test('no error when server is available', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Brak połączenia z serwerem')).toBeHidden();
});

test('error appears and disappears depending on server availability', async ({ page }) => {
  await page.goto('/');

  page.route('http://localhost:3000/health', (route) => {
    route.abort();
  });
  await expect(page.getByText('Brak połączenia z serwerem')).toBeVisible();

  // Restore the server health check to simulate a successful connection
  page.route(`${API_URL}/health`, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ status: 'ok' }),
      contentType: 'application/json',
    });
  });
  await expect(page.getByText('Brak połączenia z serwerem')).toBeHidden();

  // Again simulate a connection error
  page.route('http://localhost:3000/health', (route) => {
    route.abort();
  });
  await expect(page.getByText('Brak połączenia z serwerem')).toBeVisible();
});
