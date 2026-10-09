import type { AnyFieldMeta, AnyFormApi } from '@tanstack/react-form';
import { ApiError, getProblemDetail } from '@/api/errors';

export const INVALID_FORM_MESSAGE = 'Formularz zawiera błędy. Popraw zaznaczone pola.';

// Errors are Zod issues from client validation or messages from the server.
function getMessage(error: unknown): string {
  return typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : String(error);
}

export function getErrors(meta: AnyFieldMeta, submissionAttempts = 0): string[] | undefined {
  if ((!meta.isBlurred && submissionAttempts === 0) || meta.errors.length === 0) return undefined;
  return meta.errors.map(getMessage);
}

/** Errors that no mounted field shows: root-level or unmounted-path issues and server form errors. */
export function getFormLevelErrors(form: AnyFormApi, errorMap = form.state.errorMap): string[] {
  return Object.values(errorMap).flatMap((error): string[] => {
    if (!error) return [];
    // Server form errors are message lists.
    if (Array.isArray(error)) return error.map(getMessage);
    if (typeof error !== 'object') return [getMessage(error)];
    // Schema validators key issue lists by field path; mounted fields show their own.
    return Object.entries(error).flatMap(([path, issues]) =>
      Array.isArray(issues) && !(path && form.getFieldInfo(path).instance) ? issues.map(getMessage) : []
    );
  });
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

/** Shows a failed save's reasons: field errors under mounted fields, everything else at form level. */
export function setServerFormErrors(form: AnyFormApi, error: unknown): void {
  if (!(error instanceof ApiError) || !error.problem?.errors) {
    // `fields` makes TanStack treat this as a form validation error and store only the form messages.
    form.setErrorMap({
      onServer: { fields: {}, form: [getProblemDetail(error, 'Nieznany błąd. Spróbuj ponownie.')] },
    });
    return;
  }
  const fields: Record<string, string[]> = {};
  const formErrors = error.problem.detail ? [error.problem.detail] : [];
  // The backend keys errors by request JSON path; application saves wrap form values in `form`.
  for (const [path, messages] of Object.entries(error.problem.errors)) {
    const name = path.replace(/^form(?:\.|$)/, '');
    if (name && form.getFieldInfo(name).instance) fields[name] = messages;
    else formErrors.push(...messages);
  }
  form.setErrorMap({ onServer: { fields, form: formErrors.length ? formErrors : undefined } });
}
