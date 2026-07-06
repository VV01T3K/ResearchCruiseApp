// Values injected at container startup (docker-entrypoint.d/90-runtime-config.sh)
// take precedence over build-time defines, so one image serves every environment.
const runtime = (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) || {};

function nonEmpty(value: string | undefined): string | undefined {
  return value && value.trim() !== '' ? value : undefined;
}

export default {
  dev: import.meta.env.DEV,

  apiUrl: API_URL ?? 'http://localhost:3000',
  version: APP_VERSION,
  environment: APP_ENVIRONMENT ?? 'local',

  sentryDsn: nonEmpty(runtime.sentryDsn) ?? SENTRY_DSN ?? '',
  sentryEnvironment: nonEmpty(runtime.sentryEnvironment) ?? SENTRY_ENVIRONMENT ?? APP_ENVIRONMENT ?? 'local',
  sentryRelease: nonEmpty(runtime.sentryRelease) ?? SENTRY_RELEASE ?? '',
  sentryTracesSampleRate: nonEmpty(runtime.sentryTracesSampleRate) ?? SENTRY_TRACES_SAMPLE_RATE ?? '',
};
