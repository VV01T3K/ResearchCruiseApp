import { http, HttpResponse } from 'msw';
import { test, expect } from './fixtures';

test('the health banner checks the server only after a request fails', async ({ page, network, requests }) => {
  await page.clock.install();
  let health = () => new HttpResponse(null, { status: 503 });
  network.use(http.get('*/api/health', () => health()));
  await page.goto('/login');
  const serverProblem = page.getByText(/Serwis ma chwilowo problemy/);
  const noConnection = page.getByText(/Brak połączenia z serwerem/);
  await page.clock.fastForward(30_000);
  await expect(serverProblem).toBeHidden();
  expect(requests.queries('GET /health')).toHaveLength(0);

  network.use(http.get('*/api/auth/session', () => new HttpResponse(null, { status: 503 })));
  await page.reload();
  await expect(serverProblem).toBeVisible();
  await expect(noConnection).toBeHidden();

  health = () => HttpResponse.error();
  await page.clock.fastForward(5_000);
  await expect(noConnection).toBeVisible();
  await expect(serverProblem).toBeHidden();

  health = () => new HttpResponse(null, { status: 200 });
  await page.clock.fastForward(5_000);
  await expect(noConnection).toBeHidden();
  const checks = requests.queries('GET /health').length;
  await page.clock.fastForward(30_000);
  expect(requests.queries('GET /health')).toHaveLength(checks);
});
