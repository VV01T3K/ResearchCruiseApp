#!/bin/sh
# Exposes container-level Sentry settings to the static frontend.
set -eu

# Drop characters that would break the JS string literals below; none of them
# can appear in a valid DSN or sample rate.
sanitize() { printf '%s' "${1:-}" | tr -d '\\"\r\n'; }

cat > /app/runtime-config.js <<EOF
window.__SENTRY_DSN__ = "$(sanitize "${SENTRY_DSN:-}")";
window.__SENTRY_TRACES_SAMPLE_RATE__ = "$(sanitize "${SENTRY_TRACES_SAMPLE_RATE:-}")";
EOF
