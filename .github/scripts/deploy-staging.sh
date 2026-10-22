#!/usr/bin/env bash
{ set +x; } 2>/dev/null
set -euo pipefail

: "${STAGING_SYNC_URL:?Set the staging Git sync URL}"
: "${STAGING_DEPLOY_URL:?Set the staging project up URL}"
: "${STAGING_DEPLOY_API_KEY:?Set the deployment API key}"
: "${CLOUDFLARE_WEBHOOK_SECRET:?Set the Cloudflare webhook secret}"

[[ $STAGING_DEPLOY_URL == */projects/*/up ]] || { echo "::error::Invalid staging deploy URL"; exit 1; }

request() {
  curl --fail --silent --proto '=https' --connect-timeout 15 \
    --header "X-Api-Key: $STAGING_DEPLOY_API_KEY" \
    --header "X-Cloudflare-Secret: $CLOUDFLARE_WEBHOOK_SECRET" \
    "$@"
}

post() {
  request --max-time 1100 --header 'Content-Type: application/json' --data "$2" "$1"
}

fail() {
  echo "::error::$1"
  exit 1
}

post "$STAGING_SYNC_URL" '{}' | jq --exit-status '.success == true and .data.success == true' >/dev/null 2>&1 \
  || fail "Staging configuration sync failed"
echo "Staging configuration synced"

deadline=$((SECONDS + 1100))
activity_id=$(
  { post "$STAGING_DEPLOY_URL" '{"pullPolicy":"always","forceRecreate":false,"recreateVolumes":false}' || true; } \
    | jq --null-input --raw-input --raw-output \
      '[inputs | fromjson? | objects | select(.type == "activity") | .activityId | strings] | first // empty'
)
[[ $activity_id =~ ^[A-Za-z0-9-]+$ ]] || fail "Staging deployment did not start"
echo "Staging deployment $activity_id started"

budget() {
  left=$((deadline - SECONDS))
  ((left > 0)) || fail "Timed out waiting for staging deployment"
  ((left < $1)) || left=$1
}

misses=0
while :; do
  budget 30
  status=$(
    request --max-time "$left" "${STAGING_DEPLOY_URL%/projects/*}/activities/$activity_id?limit=1" \
      | jq --raw-output --arg id "$activity_id" \
        'select(.success == true and .data.activity.id == $id) | .data.activity.status' 2>/dev/null
  ) || status=
  budget 1
  case $status in
    success) echo "Staging deployment succeeded"; exit 0 ;;
    failed | cancelled) fail "Staging deployment $status" ;;
    queued | running) misses=0 ;;
    *) ((++misses < 4)) || fail "Staging deployment status unavailable" ;;
  esac
  budget 5
  sleep "$left"
done
