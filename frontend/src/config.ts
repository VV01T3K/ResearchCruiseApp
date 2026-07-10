export default {
  dev: import.meta.env.DEV,

  apiUrl: API_URL || 'http://localhost:3000',
  version: APP_VERSION,
  environment: APP_ENVIRONMENT || 'local',

  sentryDsn: window.__SENTRY_DSN__ || SENTRY_DSN || '',
  sentryRelease: SENTRY_RELEASE || '',
  sentryTracesSampleRate: window.__SENTRY_TRACES_SAMPLE_RATE__ || SENTRY_TRACES_SAMPLE_RATE || '',
  sentryReplaysSessionSampleRate:
    window.__SENTRY_REPLAYS_SESSION_SAMPLE_RATE__ || SENTRY_REPLAYS_SESSION_SAMPLE_RATE || '',
};
