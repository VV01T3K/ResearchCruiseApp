#!/bin/sh
# Materializes runtime configuration for the SPA from container env vars.
# Runs via the nginx image's /docker-entrypoint.d hook on every container start,
# so Sentry can be (dis)connected from compose config without rebuilding the image.
set -eu

esc() {
  printf '%s' "${1:-}" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

cat > /app/runtime-config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  sentryDsn: "$(esc "${SENTRY_DSN:-}")",
  sentryEnvironment: "$(esc "${SENTRY_ENVIRONMENT:-}")",
  sentryRelease: "$(esc "${SENTRY_RELEASE:-}")",
  sentryTracesSampleRate: "$(esc "${SENTRY_TRACES_SAMPLE_RATE:-}")"
};
EOF
