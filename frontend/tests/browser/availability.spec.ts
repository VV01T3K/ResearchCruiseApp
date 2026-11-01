import { http, HttpResponse } from 'msw';
import { test, expect } from './fixtures';

test('the health banner tells a server problem from no connection', async ({ page, network }) => {
  await page.clock.install();
  let health = () => new HttpResponse(null, { status: 503 });
  network.use(http.get('*/api/health', () => health()));
  await page.goto('/login');
  const serverProblem = page.getByText(/Serwis ma chwilowo problemy/);
  const noConnection = page.getByText(/Brak połączenia z serwerem/);
  await expect(serverProblem).toBeVisible();
  await expect(noConnection).toBeHidden();

  health = () => HttpResponse.error();
  await page.clock.fastForward(3_000);
  await expect(noConnection).toBeVisible();
  await expect(serverProblem).toBeHidden();

  health = () => new HttpResponse(null, { status: 200 });
  await page.clock.fastForward(3_000);
  await expect(noConnection).toBeHidden();
});
