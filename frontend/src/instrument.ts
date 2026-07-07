import * as Sentry from '@sentry/react';

import config from '@/config';
import { router } from '@/router';

const productionLike = config.environment === 'production' || config.environment === 'staging';
const tracesSampleRate = Number(config.sentryTracesSampleRate || (productionLike ? 0.1 : 1));

if (config.sentryDsn) {
  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.environment,
    release: config.sentryRelease || `research-cruise-app-frontend@${config.version}`,
    integrations: [
      Sentry.tanstackRouterBrowserTracingIntegration(router),
      Sentry.replayIntegration({
        maskAllText: true,
        maskAllInputs: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate,
    tracePropagationTargets: [config.apiUrl],
    replaysSessionSampleRate: productionLike ? 0.1 : 0.5,
    replaysOnErrorSampleRate: 1,
  });
}
