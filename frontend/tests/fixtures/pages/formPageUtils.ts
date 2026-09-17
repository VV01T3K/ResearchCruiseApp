import { expect, type Locator, type Page } from '@playwright/test';

export function clonePayload<T>(payload: T): T {
  return JSON.parse(JSON.stringify(payload)) as T;
}

export async function getInvalidFormState(page: Page): Promise<Record<string, string[]>> {
  const probe = page.locator('[data-testid="form-state"]');
  await expect(probe).toHaveAttribute('data-valid', 'false', { timeout: 10000 });
  return JSON.parse((await probe.getAttribute('data-errors')) ?? '{}');
}

export async function submitForm({
  page,
  submitButton,
  toastMessage,
  submissionApprovedMessage,
  validationErrorMessage,
  expectedResult,
  message,
}: {
  page: Page;
  submitButton: Locator;
  toastMessage: Locator;
  submissionApprovedMessage: Locator;
  validationErrorMessage: Locator;
  expectedResult?: 'valid' | 'invalid';
  message?: string;
}) {
  const initialUrl = page.url();
  await submitButton.click();

  if (expectedResult === 'valid') {
    await Promise.any([
      page.waitForURL((url) => url.toString() !== initialUrl, { timeout: 10000 }),
      submissionApprovedMessage.waitFor({ state: 'visible', timeout: 10000 }),
    ]);
    return;
  }

  if (expectedResult === 'invalid') {
    const outcome = await Promise.race([
      validationErrorMessage.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'error'),
      page.waitForURL((url) => url.toString() !== initialUrl, { timeout: 10000 }).then(() => 'navigated'),
    ]);

    if (outcome === 'navigated') {
      throw new Error('Form submitted successfully but expected invalid results.');
    }

    await expect(validationErrorMessage, { message }).toBeVisible();
    await toastMessage.getByLabel('Close').first().click();
  }
}
