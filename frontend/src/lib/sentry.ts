import * as Sentry from '@sentry/react';

import config from '@/config';
import { User } from '@/models/shared/User';

type FieldMeta = { errors: Array<unknown> };

function extractFormErrors(fieldMeta: Partial<Record<string, FieldMeta>>): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(fieldMeta)
      .map(([key, meta]) => [key, (meta?.errors ?? []).filter(Boolean).map(String)])
      .filter(([, errors]) => (errors as string[]).length > 0)
  );
}

export function isSentryEnabled(): boolean {
  return Boolean(config.sentryDsn);
}

export function setSentryUser(user: User | undefined): void {
  if (!isSentryEnabled()) return;

  if (!user) {
    Sentry.setUser(null);
    return;
  }

  // Data minimization (GDPR): only an opaque id is sent, never names or emails.
  Sentry.setUser({
    id: String(user.id),
  });

  Sentry.setContext('user_roles', { roles: user.roles });
}

export function trackFormSubmit(
  formName: string,
  outcome: 'valid' | 'invalid',
  formState: { fieldMeta: Partial<Record<string, FieldMeta>> }
): void {
  if (!isSentryEnabled()) return;

  const errors = extractFormErrors(formState.fieldMeta);
  const data: Record<string, string> = {
    form_name: formName,
    form_outcome: outcome,
  };

  if (outcome === 'invalid') {
    data.form_error_fields = Object.keys(errors).join(', ');
    data.form_error_count = String(Object.values(errors).flat().length);
    data.form_errors = JSON.stringify(errors);
  }

  Sentry.addBreadcrumb({
    category: 'form',
    message: `form.submit.${outcome}`,
    level: outcome === 'invalid' ? 'warning' : 'info',
    data,
  });
}
