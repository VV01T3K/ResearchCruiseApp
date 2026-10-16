import { test, expect } from './fixtures';

for (const failure of ['network', '503'] as const) {
  test(`the connection warning recovers after a ${failure} health failure`, async ({ page, api }) => {
    await page.clock.install();
    let healthy = false;
    await api('GET', '/health', (route) => {
      if (healthy) return route.fulfill({ status: 200 });
      return failure === 'network' ? route.abort() : route.fulfill({ status: 503 });
    });
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
}
