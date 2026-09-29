#!/bin/sh
# Exposes container-level Sentry settings to the static frontend.
set -eu

sanitize() { printf '%s' "${1:-}" | tr -d '\\"\r\n'; }

# Server-level nginx config generated at startup; included by nginx.conf.
runtime_conf=/etc/nginx/runtime.conf
: > "$runtime_conf"

# Behind a reverse proxy, take the client address from X-Forwarded-For so the
# per-client rate limit below does not treat every user as the proxy.
trusted_proxies=$(sanitize "${TRUSTED_PROXIES:-}")
case "$trusted_proxies" in
  *[!0-9A-Fa-f.:/\ ]*)
    echo "90-runtime-config.sh: ignoring invalid TRUSTED_PROXIES" >&2
    trusted_proxies=""
    ;;
esac
if [ -n "$trusted_proxies" ]; then
  for cidr in $trusted_proxies; do
    echo "set_real_ip_from $cidr;" >> "$runtime_conf"
  done
  cat >> "$runtime_conf" <<EOF
real_ip_header X-Forwarded-For;
real_ip_recursive on;
EOF
fi

# Browsers may not reach the Sentry instance (e.g. self-hosted on an internal
# network), so the frontend sends envelopes to this container, which forwards
# them to the DSN's project only.
sentry_tunnel=""
dsn=$(sanitize "${SENTRY_DSN:-}")
if [ -n "$dsn" ]; then
  scheme=${dsn%%://*}
  host_and_path=${dsn#*://}
  host_and_path=${host_and_path#*@}
  project_id=${host_and_path##*/}
  base=${host_and_path%/*}
  resolvers=$(awk '$1 == "nameserver" { printf "%s ", ($2 ~ /:/) ? "[" $2 "]" : $2 }' /etc/resolv.conf 2>/dev/null || true)

  case "$scheme:$project_id:$base" in
    http:* | https:*) valid=true ;;
    *) valid=false ;;
  esac
  case "$project_id" in '' | *[!0-9]*) valid=false ;; esac
  case "$base" in '' | *[!A-Za-z0-9.:/_-]*) valid=false ;; esac
  [ -n "$resolvers" ] || valid=false

  if [ "$valid" = true ]; then
    sentry_tunnel=/monitoring
    cat >> "$runtime_conf" <<EOF
location = $sentry_tunnel {
    limit_except POST { deny all; }
    # 429 makes the Sentry SDK back off instead of retrying immediately.
    limit_req zone=sentry_tunnel burst=50 nodelay;
    limit_req_status 429;
    client_max_body_size 20m;
    # Resolve at request time so an unreachable Sentry never stops nginx from starting.
    resolver $resolvers valid=300s;
    set \$sentry_envelope_url "$scheme://$base/api/$project_id/envelope/";
    proxy_pass \$sentry_envelope_url;
    proxy_ssl_server_name on;
    proxy_ssl_verify on;
    proxy_ssl_verify_depth 3;
    proxy_ssl_trusted_certificate /etc/ssl/certs/ca-certificates.crt;
    proxy_set_header Cookie "";
    proxy_set_header Authorization "";
    proxy_set_header X-Forwarded-For "";
}
EOF
  else
    echo "90-runtime-config.sh: could not derive a Sentry tunnel from SENTRY_DSN; browsers will send to the DSN host directly" >&2
  fi
fi

cat > /app/runtime-config.js <<EOF
window.__SENTRY_DSN__ = "$dsn";
window.__SENTRY_TRACES_SAMPLE_RATE__ = "$(sanitize "${SENTRY_TRACES_SAMPLE_RATE:-}")";
window.__SENTRY_REPLAYS_SESSION_SAMPLE_RATE__ = "$(sanitize "${SENTRY_REPLAYS_SESSION_SAMPLE_RATE:-}")";
window.__SENTRY_TUNNEL__ = "$sentry_tunnel";
EOF
