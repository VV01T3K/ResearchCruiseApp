import type { AnyFieldMeta, AnyFormApi } from '@tanstack/react-form';
import type { MapFormPath } from './schema';

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
  if ((!meta.isBlurred && submissionAttempts === 0) || meta.errors.length === 0) return undefined;
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

  return (
    allErrors[0] ??
    (form.state.errors.length
      ? {
          fieldName: '',
          errorMessage: extractErrorMessage(form.state.errors[0]),
        }
      : null)
  );
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
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

function normalizeBackendFormPath(path: string, mapPath: MapFormPath): string {
  const parts = path
    .replace(/^\$\.?/, '')
    .replace(/^Form(?:\.|$)/i, '')
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)
    .map((part) => (/^\d+$/.test(part) ? Number(part) : part.replace(/^[A-Z]/, (letter) => letter.toLowerCase())));
  return mapPath(parts).reduce<string>(
    (name, part) => (typeof part === 'number' ? `${name}[${part}]` : `${name ? `${name}.` : ''}${String(part)}`),
    ''
  );
}

function getServerFormErrors(error: unknown, mapPath: MapFormPath): Record<string, string[]> | null {
  if (typeof error !== 'object' || error === null || !('problem' in error)) return null;
  const problem = error.problem;
  if (typeof problem !== 'object' || problem === null || !('errors' in problem)) return null;
  const errors = problem.errors;
  if (typeof errors !== 'object' || errors === null) return null;
  return Object.fromEntries(
    Object.entries(errors).flatMap(([path, messages]) =>
      Array.isArray(messages) &&
      messages.length > 0 &&
      messages.every((message) => typeof message === 'string' && !!message.trim())
        ? [[normalizeBackendFormPath(path, mapPath), messages]]
        : []
    )
  );
}

export function setServerFormErrors(form: AnyFormApi, error: unknown, mapPath: MapFormPath = (path) => path): boolean {
  const fields = getServerFormErrors(error, mapPath);
  if (!fields || Object.keys(fields).length === 0) return false;
  const knownFields: Record<string, string[]> = {};
  const formErrors: string[] = [];
  for (const [path, messages] of Object.entries(fields)) {
    if (path && form.getFieldInfo(path).instance) knownFields[path] = messages;
    else formErrors.push(...messages);
  }
  form.setErrorMap({ onServer: { fields: knownFields, form: formErrors.join('\n') || undefined } });
  return true;
}
