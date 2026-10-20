import { http, HttpResponse } from 'msw';
import { test, expect, applicationForms } from './fixtures';
import { admin } from '../data/accounts';

test.use({ account: admin });

type EnvelopeItem = { type?: string; tags?: Record<string, unknown>; user?: object; contexts?: { feedback?: object } };

test.beforeEach(async ({ page, network, baseURL }) => {
  const dsn = baseURL!.replace('//', '//key@') + '/1';
  await page.route('**/runtime-config.js', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `window.__SENTRY_DSN__ = ${JSON.stringify(dsn)}; window.__SENTRY_REPLAYS_SESSION_SAMPLE_RATE__ = '0';`,
    })
  );
  network.use(
    ...applicationForms(),
    http.post('*/api/1/envelope/', () => HttpResponse.json({}))
  );
});

test('the side tab sends one Polish feedback report with the account email', async ({ page }) => {
  const items: EnvelopeItem[] = [];
  page.on('request', (request) => {
    if (!request.url().includes('/api/1/envelope/')) return;
    for (const line of (request.postData() ?? '').split('\n')) {
      try {
        items.push(JSON.parse(line));
      } catch {}
    }
  });
  await page.goto('/applications');
  await page.getByRole('button', { name: 'Zgłoś problem' }).click();

  const form = page.locator('#sentry-feedback');
  await expect(form.getByLabel('Adres e-mail do kontaktu')).toHaveValue(admin.email);
  await form.getByRole('textbox', { name: /Opis problemu/ }).fill('Nie działa zapis');
  await form.getByRole('button', { name: 'Wyślij zgłoszenie' }).click();
  await expect(form.getByText('Dziękujemy za zgłoszenie!')).toBeVisible();

  const feedback = items.filter((item) => item.contexts?.feedback);
  expect(feedback).toHaveLength(1);
  expect(feedback[0].contexts!.feedback).toMatchObject({ contact_email: admin.email, message: 'Nie działa zapis' });
  expect(feedback[0].tags).toMatchObject({ 'feedback.origin': 'layout' });
  expect(feedback[0].user).not.toHaveProperty('email');
  expect(items.filter((item) => item.type === 'event')).toEqual([]);
});
