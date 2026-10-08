#!/usr/bin/env bash
set -euo pipefail

: "${STAGING_SYNC_URL:?Set the staging Git sync URL}"
: "${STAGING_DEPLOY_URL:?Set the staging project up URL}"
: "${STAGING_DEPLOY_API_KEY:?Set the deployment API key}"
: "${CLOUDFLARE_WEBHOOK_SECRET:?Set the Cloudflare webhook secret}"

post() {
  curl --fail --silent --show-error --proto '=https' \
    --connect-timeout 15 --max-time 1100 \
    --header "X-Api-Key: $STAGING_DEPLOY_API_KEY" \
    --header "X-Cloudflare-Secret: $CLOUDFLARE_WEBHOOK_SECRET" \
    --header 'Content-Type: application/json' \
    --data "$2" "$1"
}

post "$STAGING_SYNC_URL" '{}' | jq --exit-status '.success == true and .data.success == true'
post "$STAGING_DEPLOY_URL" '{"pullPolicy":"always","forceRecreate":false,"recreateVolumes":false}' \
  | jq --raw-input --slurp --exit-status 'split("\n") | map(fromjson?) | last.done == true'
