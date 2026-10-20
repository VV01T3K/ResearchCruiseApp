#!/bin/sh
# Exposes container-level Sentry settings to the static frontend.
set -eu

sanitize() { printf '%s' "${1:-}" | tr -d '\\"\r\n'; }

runtime_conf=/etc/nginx/runtime.conf
: > "$runtime_conf"

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

sentry_proxy=""
dsn=$(sanitize "${SENTRY_DSN:-}")
if [ -n "$dsn" ]; then
  scheme=${dsn%%://*}
  host_and_path=${dsn#*://}
  public_key=${host_and_path%%[:@]*}
  host_and_path=${host_and_path#*@}
  project_id=${host_and_path##*/}
  base=${host_and_path%/*}
  resolvers=$(awk '$1 == "nameserver" { printf "%s ", ($2 ~ /:/) ? "[" $2 "]" : $2 }' /etc/resolv.conf 2>/dev/null || true)

  case "$scheme:$project_id:$base" in
    http:* | https:*) valid=true ;;
    *) valid=false ;;
  esac
  case "$dsn" in *://*@*) ;; *) valid=false ;; esac
  case "$public_key" in '' | *[!A-Za-z0-9]*) valid=false ;; esac
  case "$project_id" in '' | *[!0-9]*) valid=false ;; esac
  case "$base" in '' | *[!A-Za-z0-9.:/_-]*) valid=false ;; esac
  [ -n "$resolvers" ] || valid=false

  if [ "$valid" = true ]; then
    sentry_proxy=/monitoring
    cat >> "$runtime_conf" <<EOF
location = $sentry_proxy {
    limit_except POST { deny all; }
    limit_req zone=sentry_proxy burst=50 nodelay;
    limit_req_status 429;
    client_max_body_size 20m;
    client_body_buffer_size 1m;
    resolver $resolvers valid=300s;
    set \$sentry_envelope_url "$scheme://$base/api/$project_id/envelope/";
    proxy_pass \$sentry_envelope_url;
    proxy_ssl_server_name on;
    proxy_ssl_verify on;
    proxy_ssl_verify_depth 3;
    proxy_ssl_trusted_certificate /etc/nginx/sentry-ca.crt;
    proxy_set_header Cookie "";
    proxy_set_header Authorization "";
    proxy_set_header X-Sentry-Auth "Sentry sentry_key=$public_key, sentry_version=7";
    proxy_set_header X-Forwarded-For "";
}
EOF
  else
    echo "90-runtime-config.sh: could not derive the Sentry proxy from SENTRY_DSN; browsers will send to the DSN host directly" >&2
  fi
fi

cat > /app/runtime-config.js <<EOF
window.__SENTRY_DSN__ = "$dsn";
window.__SENTRY_TRACES_SAMPLE_RATE__ = "$(sanitize "${SENTRY_TRACES_SAMPLE_RATE:-}")";
window.__SENTRY_REPLAYS_SESSION_SAMPLE_RATE__ = "$(sanitize "${SENTRY_REPLAYS_SESSION_SAMPLE_RATE:-}")";
window.__SENTRY_PROXY__ = "$sentry_proxy";
EOF
