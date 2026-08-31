import { useSelector, type AnyFormApi } from '@tanstack/react-form';

import config from '@/config';

type Props = {
  form: AnyFormApi;
};

function toMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: unknown }).message ?? '');
  }
  return String(error);
}

/**
 * Exposes TanStack Form's validation state on the DOM so end-to-end tests can read it
 * directly instead of scraping error messages out of the UI.
 *
 * After a submit triggers `form.validate('change')`, `data-valid` reflects `state.isValid`
 * and `data-errors` holds a JSON map of `fieldPath -> messages`. Array rows are keyed by
 * their full path, e.g. `permissions[0].description`.
 *
 * Both `fieldMeta` and the form-level `errorMap` are merged, because errors whose path has
 * no mounted field — array-level refinements such as `ugTeams.refine(...)` — only ever reach
 * the latter.
 */
function FormStateProbeInternal({ form }: Props) {
  const isValid = useSelector(form.store, (state) => state.isValid);

  const errors = useSelector(form.store, (state) => {
    const collected: Record<string, string[]> = {};

    const add = (key: string, rawErrors: unknown[]) => {
      const messages = rawErrors.map(toMessage).filter(Boolean);
      if (messages.length === 0) return;
      collected[key] = [...new Set([...(collected[key] ?? []), ...messages])];
    };

    // Errors attached to mounted fields
    const fieldMeta = state.fieldMeta as Record<string, { errors?: unknown[] } | undefined>;
    for (const [key, meta] of Object.entries(fieldMeta)) {
      add(key, meta?.errors ?? []);
    }

    // Errors from each validation event, keyed by field path
    const errorMap = (state.errorMap ?? {}) as Record<string, unknown>;
    for (const source of Object.values(errorMap)) {
      if (!source || typeof source !== 'object' || Array.isArray(source)) continue;

      for (const [key, rawErrors] of Object.entries(source as Record<string, unknown>)) {
        if (Array.isArray(rawErrors)) add(key, rawErrors);
      }
    }

    return JSON.stringify(collected);
  });

  return (
    <span
      data-testid="form-state"
      data-valid={String(isValid)}
      data-errors={errors}
      className="sr-only"
      aria-hidden="true"
    />
  );
}

export function FormStateProbe({ form }: Props) {
  if (!config.dev) return null;

  return <FormStateProbeInternal form={form} />;
}
