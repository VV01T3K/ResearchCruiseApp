import { http, HttpResponse } from 'msw';
import { getLoginMockHandler } from '@/api/generated/mocks/auth/auth.msw.gen';
import { getGetCurrentUserMockHandler } from '@/api/generated/mocks/users/users.msw.gen';
import { test, expect, fail } from './fixtures';
import { admin, session } from '../data/accounts';

test('the health banner checks the server only after a request fails', async ({ page, network, requests }) => {
  await page.clock.install();
  let health = () => new HttpResponse(null, { status: 503 });
  network.use(
    http.get('*/api/health', () => health()),
    getLoginMockHandler(fail(503), { once: true })
  );
  await page.goto('/login');
  const serverProblem = page.getByText(/Serwis ma chwilowo problemy/);
  const noConnection = page.getByText(/Brak połączenia z serwerem/);
  await page.clock.fastForward(30_000);
  await expect(serverProblem).toBeHidden();
  expect(requests.queries('GET /health')).toHaveLength(0);

  await page.getByLabel('E-mail').fill(admin.email);
  await page.getByLabel('Hasło', { exact: true }).fill('Password1!');
  await page.getByRole('button', { name: 'Zaloguj', exact: true }).click();
  await expect(serverProblem).toBeVisible();
  await expect(noConnection).toBeHidden();

  health = () => HttpResponse.error();
  await page.clock.fastForward(5_000);
  await expect(noConnection).toBeVisible();
  await expect(serverProblem).toBeHidden();

  network.use(
    getLoginMockHandler(() => {
      network.use(getGetCurrentUserMockHandler(admin));
      return session();
    })
  );
  await page.getByRole('button', { name: 'Zaloguj', exact: true }).click();
  await expect(noConnection).toBeHidden();
  const checks = requests.queries('GET /health').length;
  await page.clock.fastForward(30_000);
  expect(requests.queries('GET /health')).toHaveLength(checks);
});
