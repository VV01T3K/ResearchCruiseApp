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

const queryParam = /(^|[?&])([^?&=#\s"']+)=[^?&#\s"']*/g;
const sensitiveParams = new Set(['code', 'resetcode', 'supervisorcode', 'emailbase64']);

function isSensitiveParam(name: string): boolean {
  const [decoded = ''] = new URLSearchParams(`${name}=`).keys();
  return sensitiveParams.has(decoded.toLowerCase());
}

export function scrubSensitiveUrls<T>(value: T): T {
  if (typeof value === 'string') {
    return value.replace(queryParam, (param, separator: string, name: string) =>
      isSensitiveParam(name) ? `${separator}${name}=[Filtered]` : param
    ) as T;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => (value[index] = scrubSensitiveUrls(item)));
  } else if (value && Object.getPrototypeOf(value) === Object.prototype) {
    const record = value as Record<string, unknown>;
    for (const key of Object.keys(record)) record[key] = scrubSensitiveUrls(record[key]);
  }
  return value;
}
