import { FormApi, FieldApi } from '@tanstack/react-form';
import { z } from 'zod';
import { expect, it } from 'vitest';
import { getErrors, getFormErrorMessage, setServerFormErrors } from '@/integrations/tanstack/form/errors';
import { ApiError, getErrorMessage, responseErrorMessage } from '@/api/errors';

it('shows root and unmounted server errors instead of losing their reason', () => {
  const form = new FormApi({ defaultValues: { name: '' }, onSubmitMeta: undefined });
  const unmount = form.mount();
  try {
    expect(setServerFormErrors(form, { problem: { errors: { Form: ['Nie można zapisać wersji roboczej'] } } })).toBe(
      true
    );
    expect(getFormErrorMessage(form, {})).toContain('Nie można zapisać wersji roboczej');
    setServerFormErrors(form, { problem: { errors: { 'Form.MissingProperty': ['Nieprawidłowy stan zgłoszenia'] } } });
    expect(getFormErrorMessage(form, {})).toContain('Nieprawidłowy stan zgłoszenia');
  } finally {
    unmount();
  }
});

it('keeps mounted field errors next to the input', () => {
  const form = new FormApi({ defaultValues: { name: '' }, onSubmitMeta: undefined });
  const unmount = form.mount();
  const field = new FieldApi({ form, name: 'name' });
  const unmountField = field.mount();
  try {
    setServerFormErrors(form, { problem: { errors: { 'Form.Name': ['Ta nazwa jest zajęta'] } } });
    expect(field.state.meta.errors.flat()).toContain('Ta nazwa jest zajęta');
    expect(getFormErrorMessage(form, {})).toContain('Ta nazwa jest zajęta');
  } finally {
    unmountField();
    unmount();
  }
});

it('keeps every reason from a mixed response while annotating mounted fields', () => {
  const form = new FormApi({ defaultValues: { permissions: [{ description: '' }] }, onSubmitMeta: undefined });
  const unmount = form.mount();
  const field = new FieldApi({ form, name: 'permissions[0].description' });
  const unmountField = field.mount();
  const problem = {
    detail: 'Zgłoszenie jest zablokowane',
    errors: {
      'Form.Permissions[0].Description': ['Opis jest za długi'],
      Form: ['Nieprawidłowy stan wersji roboczej'],
      'Form.Missing': ['Nieprawidłowe powiązanie'],
    },
  };
  const error = new ApiError(responseErrorMessage(400, problem), 400, problem);
  try {
    setServerFormErrors(form, error);
    expect(field.state.meta.errors.flat()).toContain('Opis jest za długi');
    expect(getErrorMessage(error, 'Nie zapisano')).toBe(
      'Nie zapisano: Zgłoszenie jest zablokowane\nOpis jest za długi\nNieprawidłowy stan wersji roboczej\nNieprawidłowe powiązanie'
    );
  } finally {
    unmountField();
    unmount();
  }
});

it('lists a message once when server and client validation both report it', async () => {
  const form = new FormApi({
    defaultValues: { email: '' },
    validators: { onSubmit: z.object({ email: z.string().min(1, 'Adres jest wymagany') }) },
    onSubmitMeta: undefined,
  });
  const unmount = form.mount();
  const field = new FieldApi({ form, name: 'email' });
  const unmountField = field.mount();
  try {
    await form.handleSubmit();
    setServerFormErrors(form, { problem: { errors: { Email: ['Adres jest wymagany', 'Adres jest zajęty'] } } });
    expect(getErrors(field.state.meta, 1)).toEqual(['Adres jest wymagany', 'Adres jest zajęty']);
  } finally {
    unmountField();
    unmount();
  }
});
