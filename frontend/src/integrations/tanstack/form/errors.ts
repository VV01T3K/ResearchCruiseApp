import type { AnyFieldMeta, AnyFormApi } from '@tanstack/react-form';
import { ApiError, getProblemDetail } from '@/api/errors';

const INVALID_FORM_MESSAGE = 'Formularz zawiera błędy. Popraw zaznaczone pola.';

export function saveFailedMessage(draft: boolean | undefined): string {
  return draft ? 'Nie udało się zapisać wersji roboczej formularza' : 'Nie udało się wysłać formularza';
}

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

/** Section number of each top-level field, listed in the order the form displays them. */
export type FormSections = Record<string, number>;

function getDisplayOrder(path: string, sections: FormSections): number[] {
  const field = path.split(/[.[]/)[0];
  const order = Object.keys(sections).indexOf(field);
  if (order === -1) return [Infinity];
  return [sections[field], order, ...Array.from(path.matchAll(/\[(\d+)]/g), (match) => Number(match[1]))];
}

function compareDisplayOrder(a: number[], b: number[]): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return a.length - b.length;
}

/** Names the section and reason of the first client validation error in display order. */
export function getInvalidFormMessage(form: AnyFormApi, sections: FormSections): string {
  const errors = Object.values(form.state.errorMap).flatMap((error) =>
    error && typeof error === 'object' && !Array.isArray(error)
      ? Object.entries(error).flatMap(([path, issues]) =>
          Array.isArray(issues) && issues.length ? [{ path, message: getMessage(issues[0]) }] : []
        )
      : []
  );
  const inputs = Array.from(document.querySelectorAll('[name]'), (input) => input.getAttribute('name'));
  const inputOrder = (path: string) => (inputs.includes(path) ? inputs.indexOf(path) : Infinity);
  const first = errors
    .map((error) => ({ ...error, order: getDisplayOrder(error.path, sections), input: inputOrder(error.path) }))
    .sort((a, b) => compareDisplayOrder(a.order, b.order) || a.input - b.input || 0)
    .find((error) => error.message);
  if (!first) return INVALID_FORM_MESSAGE;
  const section = first.order[0];
  return Number.isFinite(section)
    ? `Formularz błędny w sekcji nr ${section}:\n${first.message}`
    : `Formularz zawiera błędy:\n${first.message}`;
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
