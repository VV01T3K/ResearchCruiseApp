type FieldMeta = { errors: Array<unknown> };

// A bad runtime environment value must not disable telemetry by producing NaN.
export function parseSampleRate(value: string, fallback: number): number {
  const parsed = Number(value);
  return value !== '' && Number.isFinite(parsed) ? parsed : fallback;
}

export function createFormBreadcrumb(
  formName: string,
  outcome: 'valid' | 'invalid',
  formState: { fieldMeta: Partial<Record<string, FieldMeta>> }
) {
  const errorFields = Object.entries(formState.fieldMeta)
    .filter(([, meta]) => meta?.errors.some(Boolean))
    .map(([field]) => field);

  return {
    category: 'form',
    message: `form.submit.${outcome}`,
    level: outcome === 'invalid' ? ('warning' as const) : ('info' as const),
    data: {
      form_name: formName,
      form_outcome: outcome,
      ...(outcome === 'invalid' && {
        form_error_fields: errorFields.join(', '),
        form_error_count: errorFields.length,
      }),
    },
  };
}
