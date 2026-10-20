import type { Page } from '@playwright/test';
import { http, HttpResponse } from 'msw';
import {
  getGetApplicationEvaluationMockHandler,
  getGetApplicationMockHandler,
  getUpdateApplicationDecisionMockHandler,
} from '@/api/generated/mocks/applications/applications.msw.gen';
import { test, expect, applicationForms, fail } from './fixtures';
import { admin } from '../data/accounts';
import { application, evaluation } from '../data/cruises';
import { applicationId } from '../data/forms';

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

function sentItems(page: Page): EnvelopeItem[] {
  const items: EnvelopeItem[] = [];
  page.on('request', (request) => {
    if (!request.url().includes('/api/1/envelope/')) return;
    for (const line of (request.postData() ?? '').split('\n')) {
      try {
        items.push(JSON.parse(line));
      } catch {}
    }
  });
  return items;
}

test('the side tab sends one Polish feedback report with the account email', async ({ page }) => {
  const items = sentItems(page);
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

test('an error toast reports the failed operation without capturing an error itself', async ({ page, network }) => {
  network.use(
    getGetApplicationEvaluationMockHandler(evaluation()),
    getGetApplicationMockHandler(application()),
    getUpdateApplicationDecisionMockHandler(fail(500))
  );
  const items = sentItems(page);
  await page.goto(`/applications/${applicationId}/details`);
  await page.getByRole('button', { name: 'Zaakceptuj zgłoszenie' }).click();
  await page.getByTestId('toast-container').getByRole('button', { name: 'Zgłoś problem' }).click();

  const form = page.locator('#sentry-feedback');
  await form.getByRole('textbox', { name: /Opis problemu/ }).fill('Akceptacja nie działa');
  await form.getByRole('button', { name: 'Wyślij zgłoszenie' }).click();
  await expect(form.getByText('Dziękujemy za zgłoszenie!')).toBeVisible();

  const feedback = items.filter((item) => item.contexts?.feedback);
  expect(feedback).toHaveLength(1);
  expect(feedback[0].tags).toMatchObject({
    'feedback.origin': 'toast',
    'feedback.operation': 'updateApplicationDecision',
  });
  expect(items.filter((item) => item.type === 'event')).toEqual([]);
});
