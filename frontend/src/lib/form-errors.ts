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

export function getFieldErrors(meta: AnyFieldMeta, submissionAttempts: number): string[] | undefined {
  if ((!meta.isTouched && submissionAttempts === 0) || meta.errors.length === 0) return undefined;
  return meta.errors.map(extractErrorMessage);
}

export function getErrors(meta: AnyFieldMeta, submissionAttempts: number | boolean = 1): string[] | undefined {
  return getFieldErrors(
    meta,
    typeof submissionAttempts === 'boolean' ? Number(submissionAttempts) : submissionAttempts
  );
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

function scrollToError(delay: number, fallbackElement?: Element | null): void {
  const scroll = () =>
    (document.querySelector('[data-error="true"]') ?? fallbackElement)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  if (delay > 0) setTimeout(scroll, delay);
  else scroll();
}

export function navigateToFirstError(form: AnyFormApi | undefined, sections: Record<string, number>): void {
  const firstError = form ? getFirstFormError(form, sections) : null;
  const fieldElement = firstError ? document.getElementsByName(firstError.fieldName).item(0) : null;
  const targetButton = Array.from(document.querySelectorAll<HTMLButtonElement>('h2 button')).find((button) =>
    button.querySelector('span')?.textContent?.includes(`${firstError?.sectionNumber}.`)
  );

  if (targetButton && !targetButton.hasAttribute('data-panel-open')) {
    targetButton.click();
    scrollToError(150, fieldElement ?? targetButton);
  } else {
    fieldElement?.focus();
    scrollToError(0, fieldElement ?? targetButton);
  }
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
