#!/bin/sh
# Exposes container-level Sentry settings to the static frontend.
set -eu

cat > /app/runtime-config.js <<EOF
window.__SENTRY_DSN__ = "${SENTRY_DSN:-}";
window.__SENTRY_TRACES_SAMPLE_RATE__ = "${SENTRY_TRACES_SAMPLE_RATE:-}";
EOF
