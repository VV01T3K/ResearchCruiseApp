import type { AnyFieldMeta, AnyFormApi } from '@tanstack/react-form';

interface FormError {
  fieldName: string;
  errorMessage: string;
  sectionNumber?: number;
}

export function extractErrorMessage(error: unknown): string {
  if (error == null) return 'Błąd walidacji';
  if (typeof error === 'string') return error;
  if (Array.isArray(error) && error.length > 0) return extractErrorMessage(error[0]);
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message;
  const stringified = String(error);
  return stringified === '[object Object]' ? 'Błąd walidacji' : stringified;
}

export function getErrors(meta: AnyFieldMeta, submissionAttempts = 0): string[] | undefined {
  if ((!meta.isTouched && submissionAttempts === 0) || meta.errors.length === 0) return undefined;
  return meta.errors.map(extractErrorMessage);
}

function getSectionNumber(fieldName: string, sections: Record<string, number>): number | undefined {
  return sections[fieldName] ?? sections[fieldName.split(/[.[]/)[0]];
}

function getFirstFormError(form: AnyFormApi, sections: Record<string, number>): FormError | null {
  const allErrors = Object.entries(form.getAllErrors().fields)
    .map(([fieldName, meta]) => ({
      fieldName,
      errorMessage: extractErrorMessage(meta.errors[0]),
      sectionNumber: getSectionNumber(fieldName, sections),
    }))
    .sort((a, b) => (a.sectionNumber ?? Infinity) - (b.sectionNumber ?? Infinity));

  return allErrors[0] ?? null;
}

export function getFormErrorMessage(form: AnyFormApi, sections: Record<string, number>): string {
  const firstError = getFirstFormError(form, sections);
  if (!firstError) return 'Formularz zawiera błędy. Sprawdź, czy wszystkie pola są wypełnione poprawnie.';
  return firstError.sectionNumber
    ? `Formularz błędny w sekcji nr ${firstError.sectionNumber}:\n${firstError.errorMessage}`
    : `Formularz zawiera błędy:\n ${firstError.errorMessage}`;
}

export function navigateToFirstError(): void {
  requestAnimationFrame(() => {
    const target = document.querySelector<HTMLElement>('[aria-invalid="true"], [data-error="true"]');
    if (!target) return;

    const closedPanel = target.closest<HTMLElement>('[data-closed]');
    closedPanel?.parentElement?.querySelector<HTMLButtonElement>('button[aria-expanded="false"]')?.click();

    requestAnimationFrame(() => {
      if (target.matches('[data-error="true"]')) target.tabIndex = -1;
      target.focus();
    });
  });
}

function normalizeBackendFormPath(path: string): string {
  return path
    .replace(/^Form\.?/i, '')
    .split('.')
    .filter(Boolean)
    .map((part) => part.replace(/^[A-Z]/, (letter) => letter.toLowerCase()))
    .join('.');
}

function getServerFormErrors(error: unknown): Record<string, string[]> | null {
  if (typeof error !== 'object' || error === null || !('problem' in error)) return null;
  const problem = error.problem;
  if (typeof problem !== 'object' || problem === null || !('errors' in problem)) return null;
  const errors = problem.errors;
  if (typeof errors !== 'object' || errors === null) return null;
  return Object.fromEntries(
    Object.entries(errors).flatMap(([path, messages]) =>
      Array.isArray(messages) && messages.every((message) => typeof message === 'string')
        ? [[normalizeBackendFormPath(path), messages]]
        : []
    )
  );
}

export function setServerFormErrors(form: AnyFormApi, error: unknown): boolean {
  const fields = getServerFormErrors(error);
  if (!fields || Object.keys(fields).length === 0) return false;
  form.setErrorMap({ onServer: { fields } });
  return true;
}

export function setSchemaErrors(form: AnyFormApi, schema: Parameters<AnyFormApi['parseValuesWithSchema']>[0]): boolean {
  const errors = form.parseValuesWithSchema(schema);
  if (!errors) return false;
  form.setErrorMap({ onSubmit: errors });
  return true;
}
