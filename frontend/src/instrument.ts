import { consoleLoggingIntegration, replayIntegration, tanstackRouterBrowserTracingIntegration } from '@sentry/react';
import * as Sentry from '@sentry/react';

import config from '@/config';
import { router } from '@/routerInstance';

function configuredTracesSampleRate(): number {
  const configured = Number(config.sentryTracesSampleRate);
  if (config.sentryTracesSampleRate && Number.isFinite(configured)) return Math.min(1, Math.max(0, configured));

  return defaultTracesSampleRate();
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
  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.environment,
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
      // Full privacy scrubbing only in production: maskAllText redacts every text
      // node and blockAllMedia hides all <svg>/<img> (this UI is mostly SVG icons),
      // which makes replays unreadable — acceptable for prod, useless for staging
      // testing. Password inputs stay masked in every environment by rrweb's
      // built-in maskInputOptions defaults.
      replayIntegration({
        maskAllText: config.environment === 'production',
        maskAllInputs: config.environment === 'production',
        blockAllMedia: config.environment === 'production',
      }),
      consoleLoggingIntegration({
        levels: ['warn', 'error'],
      }),
    ],
    tracesSampleRate: configuredTracesSampleRate(),
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
