import type { AnyFieldMeta, AnyFormApi } from '@tanstack/react-form';

export interface FormError {
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

export function getErrors(meta: AnyFieldMeta, submissionAttempts: number | boolean = 0): string[] | undefined {
  const attempts = typeof submissionAttempts === 'boolean' ? Number(submissionAttempts) : submissionAttempts;
  if ((!meta.isTouched && attempts === 0) || meta.errors.length === 0) return undefined;
  return meta.errors.map(extractErrorMessage);
}

function getSectionNumber(fieldName: string, sections: Record<string, number>): number | undefined {
  return sections[fieldName] ?? sections[fieldName.split('[')[0]];
}

export function getFirstFormError(form: AnyFormApi, sections: Record<string, number>): FormError | null {
  const errors = (form.state as { fieldMeta: Record<string, { errors: unknown[] }> }).fieldMeta;
  const allErrors = Object.entries(errors)
    .filter(([, meta]) => meta.errors.length > 0)
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

export function navigateToFirstError(form: AnyFormApi, sections: Record<string, number>): void {
  const firstError = getFirstFormError(form, sections);
  if (!firstError) return;

  const field = document.getElementsByName(firstError.fieldName).item(0) as HTMLElement | null;
  const section = firstError.sectionNumber
    ? document.querySelector<HTMLElement>(`[data-form-section="${firstError.sectionNumber}"]`)
    : null;
  const target = field ?? section;
  if (!target) return;

  const accordion = field?.closest<HTMLElement>('[data-form-section]') ?? section;
  accordion?.querySelector<HTMLButtonElement>('button[aria-expanded="false"]')?.click();

  requestAnimationFrame(() => {
    if (field) {
      field.focus();
      return;
    }
    const error = accordion?.querySelector<HTMLElement>('[data-error="true"]');
    if (error) {
      error.tabIndex = -1;
      error.focus();
      return;
    }
    const trigger = accordion?.querySelector<HTMLElement>('button');
    trigger?.focus();
  });
}

export function normalizeBackendFormPath(path: string): string {
  return path
    .replace(/^Form\.?/i, '')
    .split('.')
    .filter(Boolean)
    .map((part) => part.replace(/^[A-Z]/, (letter) => letter.toLowerCase()))
    .join('.');
}

export function getServerFormErrors(error: unknown): Record<string, string[]> | null {
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

export function installServerFormErrors(form: AnyFormApi, error: unknown): boolean {
  const fields = getServerFormErrors(error);
  if (!fields || Object.keys(fields).length === 0) return false;
  const fieldMeta = (form.state as { fieldMeta: Record<string, unknown> }).fieldMeta;
  const mappedFields = Object.fromEntries(
    Object.entries(fields).filter(
      ([path]) => path in fieldMeta || (typeof document !== 'undefined' && document.getElementsByName(path).length > 0)
    )
  );
  if (Object.keys(mappedFields).length === 0) return false;
  form.setErrorMap({ onServer: { fields: mappedFields } });
  return Object.keys(mappedFields).length === Object.keys(fields).length;
}
