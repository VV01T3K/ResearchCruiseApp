import { consoleLoggingIntegration, replayIntegration, tanstackRouterBrowserTracingIntegration } from '@sentry/react';
import * as Sentry from '@sentry/react';

import config from '@/config';
import { router } from '@/routerInstance';

function parseSampleRate(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : fallback;
}

function defaultTracesSampleRate(): number {
  if (config.environment === 'production') return 0.1;
  if (config.environment === 'staging') return 0.2;
  return 1;
}

function defaultReplaySessionSampleRate(): number {
  return config.environment === 'production' ? 0.1 : 0.5;
}

function resolveTracePropagationTargets(): (string | RegExp)[] {
  const targets: (string | RegExp)[] = [/^https?:\/\/localhost(?::\d+)?(?:\/|$)/];

  if (typeof window !== 'undefined') {
    const escapedOrigin = window.location.origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    targets.push(new RegExp(`^${escapedOrigin}`));
  }

  if (/^https?:\/\//i.test(config.apiUrl)) {
    try {
      const apiOrigin = new URL(config.apiUrl).origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      targets.push(new RegExp(`^${apiOrigin}`));
    } catch {
      // Relative apiUrl (e.g. /api) is covered by window.location.origin.
    }
  }

  return targets;
}

if (config.sentryDsn) {
  const tracesSampleRate = parseSampleRate(config.sentryTracesSampleRate, defaultTracesSampleRate());

  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.sentryEnvironment,
    release: config.sentryRelease || `research-cruise-app-frontend@${config.version}`,
    enabled: true,
    sendDefaultPii: false,
    attachStacktrace: true,
    maxBreadcrumbs: 100,
    enableLogs: true,
    integrations: [
      tanstackRouterBrowserTracingIntegration(router, {
        enableInp: true,
        enableLongTask: true,
      }),
      replayIntegration({
        maskAllText: true,
        maskAllInputs: true,
        blockAllMedia: true,
      }),
      consoleLoggingIntegration({
        levels: ['warn', 'error'],
      }),
    ],
    tracesSampleRate,
    tracePropagationTargets: resolveTracePropagationTargets(),
    replaysSessionSampleRate: defaultReplaySessionSampleRate(),
    replaysOnErrorSampleRate: 1,
    initialScope: {
      tags: {
        app: 'research-cruise-app',
        component: 'frontend',
        app_version: config.version,
      },
    },
  });
}
