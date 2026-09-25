import { expect, type Page } from '@playwright/test';
import { formTest as test } from '../tests/fixtures/fixtures';
import { API_URL } from '../tests/fixtures/consts';
import { FormBWriteRequest, type FormBFields } from '../src/api/generated/schemas';

// Deliberate pauses make this recording usable for manual review. This is outside
// the normal test suite and reuses its API fixtures without changing application state directly.
async function caption(page: Page, text: string) {
  await page.evaluate((text) => {
    document.getElementById('review-caption')?.remove();
    const caption = document.createElement('aside');
    caption.id = 'review-caption';
    caption.textContent = text;
    Object.assign(caption.style, {
      position: 'fixed',
      bottom: '110px',
      left: '18px',
      zIndex: '2147483647',
      padding: '12px 18px',
      color: 'white',
      background: '#162334',
      borderRadius: '8px',
      font: '16px sans-serif',
      pointerEvents: 'none',
    });
    document.body.appendChild(caption);
  }, text);
  await page.waitForTimeout(1600);
}

test('Form B: validation, correction, clamping, failed save, draft reload and final submission', async ({
  formBPage,
  page,
}) => {
  await formBPage.fillForm();
  let saved: FormBFields | undefined;
  let failNextSave = true;
  const requests: FormBWriteRequest[] = [];
  await page.route(`${API_URL}/v2/applications/${formBPage.formId}/form-b`, async (route) => {
    if (route.request().method() !== 'PUT') {
      if (saved) return route.fulfill({ json: saved });
      return route.fallback();
    }
    const request = FormBWriteRequest.parse(route.request().postDataJSON());
    requests.push(request);
    if (failNextSave) {
      failNextSave = false;
      return route.fulfill({ status: 500, json: { detail: 'Test: zapis chwilowo niedostępny' } });
    }
    saved = request.form;
    return route.fulfill({ status: 200 });
  });

  await caption(page, 'Form B review — existing appearance, fixture API. Editing uses real UI controls.');
  await formBPage.sections.cruiseDayDetailsSection.addTaskButton.click();
  await page.getByTestId('cruise-day-region-input').first().fill('Zatoka Gdańska');
  await page.getByTestId('cruise-day-position-input').first().fill('54.5 N, 18.8 E');
  const task = page.getByTestId('cruise-day-task-name-input').first();
  const hours = page.getByTestId('cruise-day-hours-input').first();
  await task.scrollIntoViewIfNeeded();
  await caption(page, 'Required field: show a Polish error on blur; clear it while typing.');
  await task.fill('');
  await hours.click();
  await expect(task).toHaveAttribute('aria-invalid', 'true');
  await page.waitForTimeout(1600);
  await task.pressSequentially('Pobieranie próbek wody', { delay: 75 });
  await expect(task).not.toHaveAttribute('aria-invalid', 'true');

  await caption(page, 'Numeric input still clamps immediately to the allowed range.');
  await hours.fill('-5');
  await expect(hours).toHaveValue('0');
  await page.waitForTimeout(1200);
  await hours.fill('4');

  await caption(page, 'Leave a required field unfinished: final submission is blocked.');
  await task.fill('');
  await formBPage.submitButton.click();
  await expect(task).toHaveAttribute('aria-invalid', 'true');
  expect(requests).toHaveLength(0);
  await page.waitForTimeout(1800);

  const saveDraft = page.getByRole('button', { name: 'Zapisz wersję roboczą' });
  await caption(page, 'Draft save: a failed request keeps all entered values available for retry.');
  await saveDraft.click();
  await expect(page.getByTestId('toast-error').first()).toBeVisible();
  await expect(hours).toHaveValue('4');
  await page.waitForTimeout(1800);

  await caption(page, 'Retry succeeds with incomplete fields under the separate draft rules.');
  await saveDraft.click();
  await expect(page).toHaveURL(/\/applications\/?$/);
  expect(saved?.cruiseDaysDetails?.[0].taskName).toBe('');
  expect(requests.at(-1)?.draft).toBe(true);
  await caption(page, 'Reopen the saved draft: incomplete text and edited hours were preserved.');
  await formBPage.goto();
  await expect(task).toHaveValue('');
  await expect(hours).toHaveValue('4');
  await task.scrollIntoViewIfNeeded();
  await caption(page, 'Complete the draft, then submit using the full validation rules.');
  await task.pressSequentially('Pobieranie próbek wody', { delay: 75 });
  await formBPage.submitButton.click();
  await expect(page).toHaveURL(/\/applications\/?$/);
  expect(requests.at(-1)?.draft).toBe(false);
  expect(saved?.cruiseDaysDetails?.[0].taskName).toBe('Pobieranie próbek wody');
  await caption(page, 'Final submission succeeded. Draft and final requests passed the generated API schema.');
  await page.waitForTimeout(2500);
});
