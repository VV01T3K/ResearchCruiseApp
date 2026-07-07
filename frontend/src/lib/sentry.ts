import * as Sentry from '@sentry/react';

import config from '@/config';
import { User } from '@/models/shared/User';

type FieldMeta = { errors: Array<unknown> };

export function initializeSentry(router: unknown): void {
  if (!config.sentryDsn) return;

  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.environment,
    release: config.sentryRelease || `research-cruise-app-frontend@${config.version}`,
    integrations: [
      Sentry.tanstackRouterBrowserTracingIntegration(router),
      Sentry.replayIntegration({
        maskAllText: false,
        maskAllInputs: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: Number(config.sentryTracesSampleRate || 0.1),
    tracePropagationTargets: [config.apiUrl],
    replaysSessionSampleRate: Number(config.sentryReplaysSessionSampleRate || 0.1),
    replaysOnErrorSampleRate: 1,
  });
}

export function setSentryUser(user: User | undefined): void {
  Sentry.setUser(user ? { id: String(user.id) } : null);
  Sentry.setContext('user_roles', user ? { roles: user.roles } : null);
}

export function trackFormSubmit(
  formName: string,
  outcome: 'valid' | 'invalid',
  formState: { fieldMeta: Partial<Record<string, FieldMeta>> }
): void {
  const errorFields = Object.entries(formState.fieldMeta)
    .filter(([, meta]) => meta?.errors.some(Boolean))
    .map(([field]) => field);

  Sentry.addBreadcrumb({
    category: 'form',
    message: `form.submit.${outcome}`,
    level: outcome === 'invalid' ? 'warning' : 'info',
    data: {
      form_name: formName,
      form_outcome: outcome,
      ...(outcome === 'invalid' && {
        form_error_fields: errorFields.join(', '),
        form_error_count: errorFields.length,
      }),
    },
  });
}
