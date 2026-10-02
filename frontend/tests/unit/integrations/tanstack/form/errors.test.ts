import { FieldApi, FormApi } from '@tanstack/react-form';
import { z } from 'zod';
import { expect, it } from 'vitest';
import { getFormLevelErrors, setServerFormErrors } from '@/integrations/tanstack/form/errors';
import { ApiError, getErrorMessage, responseErrorMessage } from '@/api/errors';

function apiError(status: number, problem: ConstructorParameters<typeof ApiError>[2]) {
  return new ApiError(responseErrorMessage(status, problem), status, problem);
}

it('places server errors on mounted fields and keeps the rest at form level', () => {
  const form = new FormApi({ defaultValues: { permissions: [{ description: '' }] }, onSubmitMeta: undefined });
  const unmount = form.mount();
  const field = new FieldApi({ form, name: 'permissions[0].description' });
  const unmountField = field.mount();
  const error = apiError(400, {
    errors: {
      'form.permissions[0].description': ['Opis jest za długi'],
      form: ['Nieprawidłowy stan wersji roboczej'],
      'form.missing': ['Nieprawidłowe powiązanie'],
    },
  });
  try {
    setServerFormErrors(form, error);
    expect(field.state.meta.errors).toEqual(['Opis jest za długi']);
    expect(getFormLevelErrors(form)).toEqual(['Nieprawidłowy stan wersji roboczej', 'Nieprawidłowe powiązanie']);
    expect(getErrorMessage(error, 'Nie zapisano')).toBe(
      'Nie zapisano: Opis jest za długi\nNieprawidłowy stan wersji roboczej\nNieprawidłowe powiązanie'
    );
  } finally {
    unmountField();
    unmount();
  }
});

it('keeps the reason of failures without field errors at form level', () => {
  const form = new FormApi({ defaultValues: { name: '' }, onSubmitMeta: undefined });
  const unmount = form.mount();
  try {
    setServerFormErrors(form, apiError(403, { detail: 'Obecnie nie można przesłać formularza.' }));
    expect(form.state.errorMap.onServer).toEqual(['Obecnie nie można przesłać formularza.']);
    expect(getFormLevelErrors(form)).toEqual(['Obecnie nie można przesłać formularza.']);
    setServerFormErrors(form, new TypeError('Failed to fetch'));
    expect(getFormLevelErrors(form)).toEqual([
      'Nie udało się połączyć z serwerem. Sprawdź połączenie i spróbuj ponownie.',
    ]);
  } finally {
    unmount();
  }
});

it('reports root-level and unmounted client issues, but not issues shown by mounted fields', async () => {
  const form = new FormApi({
    defaultValues: { name: '', hidden: '' },
    validators: {
      onSubmit: z
        .object({ name: z.string().min(1, 'Nazwa jest wymagana'), hidden: z.string().min(1, 'Ukryte pole') })
        .refine(() => false, 'Formularz jest niekompletny'),
    },
    onSubmitMeta: undefined,
  });
  const unmount = form.mount();
  const unmountField = new FieldApi({ form, name: 'name' }).mount();
  try {
    await form.handleSubmit();
    expect(getFormLevelErrors(form)).toEqual(['Ukryte pole', 'Formularz jest niekompletny']);
  } finally {
    unmountField();
    unmount();
  }
});

it('ignores form-level values that are not issue lists', () => {
  const form = new FormApi({ defaultValues: { name: '' }, onSubmitMeta: undefined });
  expect(
    getFormLevelErrors(form, { onServer: ['Serwer'], onDynamic: { name: 'nie lista', '': [{ message: 'Formularz' }] } })
  ).toEqual(['Serwer', 'Formularz']);
});
