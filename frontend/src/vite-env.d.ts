/// <reference types="vite-plus/client" />
/// <reference types="vite-plugin-svgr/client" />

declare const APP_VERSION: string;
declare const API_URL: string;
declare const APP_ENVIRONMENT: string;
declare const SENTRY_DSN: string;
declare const SENTRY_RELEASE: string;
declare const SENTRY_TRACES_SAMPLE_RATE: string;
declare const SENTRY_REPLAYS_SESSION_SAMPLE_RATE: string;

interface Window {
  __SENTRY_DSN__?: string;
  __SENTRY_TRACES_SAMPLE_RATE__?: string;
  __SENTRY_REPLAYS_SESSION_SAMPLE_RATE__?: string;
}
