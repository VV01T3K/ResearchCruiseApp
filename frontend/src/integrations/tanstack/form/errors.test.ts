import { FormApi, FieldApi } from '@tanstack/react-form';
import { expect, it } from 'vitest';
import { getFormErrorMessage, setServerFormErrors } from './errors';

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
