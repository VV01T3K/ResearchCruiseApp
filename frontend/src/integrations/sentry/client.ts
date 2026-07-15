import * as Sentry from '@sentry/react';

import config from '@/config';
import { createFormBreadcrumb, parseSampleRate } from '@/integrations/sentry/utils';
import { User } from '@/types/user';

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
    tracesSampleRate: parseSampleRate(config.sentryTracesSampleRate, 0.1),
    tracePropagationTargets: [config.apiUrl],
    replaysSessionSampleRate: parseSampleRate(config.sentryReplaysSessionSampleRate, 0.1),
    replaysOnErrorSampleRate: 1,
  });
}

export function setSentryUser(user: User | undefined): void {
  if (!user) {
    Sentry.setUser(null);
    Sentry.setTag('user.roles', undefined);
    Sentry.setTag('user.multiple_roles', undefined);
    return;
  }

  const roles = user.roles ?? [];
  Sentry.setUser({ id: String(user.id), roles });
  Sentry.setTag('user.roles', roles.join(','));
  // Flags the anomaly where a user unexpectedly holds more than one role.
  Sentry.setTag('user.multiple_roles', roles.length > 1);
}

export function trackFormSubmit(
  formName: string,
  outcome: 'valid' | 'invalid',
  formState: { fieldMeta: Partial<Record<string, FieldMeta>> }
): void {
  Sentry.addBreadcrumb(createFormBreadcrumb(formName, outcome, formState));
}
