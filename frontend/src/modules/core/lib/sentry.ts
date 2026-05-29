import * as Sentry from '@sentry/react';
import {
  captureConsoleIntegration,
  extraErrorDataIntegration,
  httpClientIntegration,
  replayIntegration,
  tanstackRouterBrowserTracingIntegration,
} from '@sentry/react';

import config from '@config';

import { appRouter } from '@/core/lib/appRouter';
import type { User } from '@/core/models/User';

type FieldMeta = { errors: Array<unknown> };

function parseSampleRate(value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : fallback;
}

function buildTracePropagationTargets(): Array<string | RegExp> {
  const targets: Array<string | RegExp> = ['localhost', /^\/api/];

  try {
    const apiOrigin = new URL(config.apiUrl, window.location.origin).origin;
    targets.push(apiOrigin);
  } catch {
    // Relative API URLs are covered by /^\/api/
  }

  return targets;
}

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

export function initSentry(): void {
  if (!isSentryEnabled()) {
    return;
  }

  const isProduction = config.environment === 'production';
  const tracesSampleRate = parseSampleRate(
    config.sentryTracesSampleRate,
    isProduction ? 0.1 : 1
  );
  const replaysSessionSampleRate = parseSampleRate(
    config.sentryReplaysSessionSampleRate,
    isProduction ? 0.1 : 0.2
  );

  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.sentryEnvironment,
    release: config.sentryRelease || `research-cruise-app-frontend@${config.version}`,
    enabled: true,
    sendDefaultPii: false,
    attachStacktrace: true,
    maxBreadcrumbs: 100,
    debug: config.dev && config.sentryDebug,
    tunnel: config.sentryTunnel || undefined,
    tracePropagationTargets: buildTracePropagationTargets(),
    tracesSampleRate,
    replaysSessionSampleRate,
    replaysOnErrorSampleRate: 1,
    enableLogs: true,
    integrations: [
      tanstackRouterBrowserTracingIntegration(appRouter),
      replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
        maskAllInputs: true,
      }),
      captureConsoleIntegration({ levels: ['error', 'warn'] }),
      httpClientIntegration({
        failedRequestStatusCodes: [[400, 599]],
        failedRequestTargets: [/^\/api/, config.apiUrl],
      }),
      extraErrorDataIntegration({ depth: 4 }),
    ],
    ignoreErrors: [/ResizeObserver loop/i, /Non-Error promise rejection/],
    denyUrls: [/extensions\//i, /^chrome:\/\//i],
    beforeSend(event) {
      if (event.request?.headers?.Authorization) {
        delete event.request.headers.Authorization;
      }
      return event;
    },
  });

  Sentry.setTag('app.version', config.version);
  Sentry.setTag('service', config.otelServiceName);
}

export function setSentryUser(user: User | null | undefined): void {
  if (!isSentryEnabled()) {
    return;
  }

  if (!user) {
    Sentry.setUser(null);
    return;
  }

  Sentry.setUser({
    id: String(user.id),
    email: user.email,
    username: `${user.firstName} ${user.lastName}`.trim(),
  });
  Sentry.setContext('user', {
    roles: user.roles,
    emailConfirmed: user.emailConfirmed,
    accepted: user.accepted,
  });
}

export function trackFormSubmit(
  formName: string,
  outcome: 'valid' | 'invalid',
  formState: { fieldMeta: Partial<Record<string, FieldMeta>> }
): void {
  if (!isSentryEnabled()) {
    return;
  }

  const errors = extractFormErrors(formState.fieldMeta);
  const data: Record<string, string | number> = {
    form: formName,
    outcome,
  };

  if (outcome === 'invalid') {
    data.errorFieldCount = Object.keys(errors).length;
    data.errorCount = Object.values(errors).flat().length;
  }

  Sentry.addBreadcrumb({
    category: 'form',
    message: `form.submit.${outcome}`,
    level: outcome === 'invalid' ? 'warning' : 'info',
    data,
  });
}

export { Sentry };
