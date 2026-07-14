import type { AnyFieldMeta, AnyFormApi } from '@tanstack/react-form';

import { ApiError } from '@/lib/custom-fetch';

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

export function getErrors(meta: AnyFieldMeta, hasFormBeenSubmitted = true): string[] | undefined {
  return getFieldErrors(meta, hasFormBeenSubmitted ? 1 : 0);
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
  if (!(error instanceof ApiError)) return null;
  const errors = (error.problem as (typeof error.problem & { errors?: Record<string, string[]> }) | undefined)?.errors;
  if (!errors) return null;
  return Object.fromEntries(
    Object.entries(errors).map(([path, messages]) => [normalizeBackendFormPath(path), messages])
  );
}
