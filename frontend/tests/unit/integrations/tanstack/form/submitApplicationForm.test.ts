import { FormApi } from '@tanstack/react-form';
import { expect, it } from 'vitest';
import { submitApplicationForm } from '@/integrations/tanstack/form/submitApplicationForm';

function createForm(onSubmit: () => Promise<void>) {
  const form = new FormApi({ defaultValues: { draft: false }, onSubmit, onSubmitMeta: undefined });
  form.mount();
  return form;
}

it('records a rejected save as unsuccessful without rejecting the caller', async () => {
  const form = createForm(() => Promise.reject(new Error('Usługa jest chwilowo niedostępna')));

  await expect(submitApplicationForm(form, true)).resolves.toBeUndefined();

  expect(form.state.values.draft).toBe(true);
  expect(form.state.submissionAttempts).toBe(1);
  expect(form.state.isSubmitSuccessful).toBe(false);
});

it('records a completed save as successful', async () => {
  const form = createForm(() => Promise.resolve());

  await submitApplicationForm(form, false);

  expect(form.state.isSubmitSuccessful).toBe(true);
});
