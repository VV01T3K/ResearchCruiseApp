export default {
  dev: import.meta.env.DEV,

  apiUrl: API_URL ?? 'http://localhost:3000',
  version: APP_VERSION,
  environment: APP_ENVIRONMENT ?? 'local',
  otelServiceName: OTEL_SERVICE_NAME ?? 'research-cruise-app-frontend',

  sentryDsn: SENTRY_DSN ?? '',
  sentryEnvironment: SENTRY_ENVIRONMENT ?? APP_ENVIRONMENT ?? 'local',
  sentryRelease: SENTRY_RELEASE ?? '',
  sentryTracesSampleRate: SENTRY_TRACES_SAMPLE_RATE ?? '',
  sentryReplaysSessionSampleRate: SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? '',
  sentryTunnel: SENTRY_TUNNEL ?? '',
  sentryDebug: SENTRY_DEBUG === 'true',
};
