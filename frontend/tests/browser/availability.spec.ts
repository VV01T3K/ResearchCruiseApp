import { test, expect } from './fixtures';

test('the connection warning follows the server health check', async ({ page, api }) => {
  await page.clock.install();
  let healthy = false;
  await api('GET', '/health', (route) => route.fulfill({ status: healthy ? 200 : 503 }));
  await page.goto('/login');
  const warning = page.getByText(/Brak połączenia z serwerem/);
  await expect(warning).toBeVisible();
  healthy = true;
  await page.clock.fastForward(3_000);
  await expect(warning).toBeHidden();
  healthy = false;
  await page.clock.fastForward(3_000);
  await expect(warning).toBeVisible();
});
