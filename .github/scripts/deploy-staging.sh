#!/usr/bin/env bash
{ set +x; } 2>/dev/null
set -euo pipefail

: "${STAGING_SYNC_URL:?Set the staging Git sync URL}"
: "${STAGING_DEPLOY_URL:?Set the staging project up URL}"
: "${STAGING_APP_URL:?Set the staging app URL}"
: "${STAGING_DEPLOY_API_KEY:?Set the deployment API key}"
: "${CLOUDFLARE_WEBHOOK_SECRET:?Set the Cloudflare webhook secret}"

fail() {
  echo "::error::$1"
  exit 1
}

[[ $STAGING_DEPLOY_URL == */projects/*/up ]] || fail "Invalid staging deploy URL"

body=$(mktemp)
trap 'rm -f "$body"' EXIT

# Saves the response to $body; on an unusable response sets $why and returns 1.
fetch() {
  local want=$1 meta code type
  shift
  meta=$(curl --silent --proto '=https' --connect-timeout 15 --output "$body" \
    --write-out '%{http_code} %{content_type}' "$@" 2>/dev/null) || true
  code=${meta%% *} type=${meta#* }
  case $code in
    200) [[ ${type,,} =~ $want ]] && return 0; why="unexpected content type" ;;
    000 | '') why="no response" ;;
    3??) why="redirected" ;;
    *) why="HTTP $code" ;;
  esac
  return 1
}

arcane() {
  fetch '^application/.*json' \
    --header "X-Api-Key: $STAGING_DEPLOY_API_KEY" \
    --header "X-Cloudflare-Secret: $CLOUDFLARE_WEBHOOK_SECRET" \
    "$@"
}

post() {
  arcane --max-time 1100 --header 'Content-Type: application/json' --data "$2" "$1"
}

budget() {
  left=$((deadline - SECONDS))
  ((left > 0)) || fail "$1"
  ((left < $2)) || left=$2
}

post "$STAGING_SYNC_URL" '{}' || fail "Staging configuration sync failed ($why)"
jq --exit-status '.success == true and .data.success == true' "$body" >/dev/null 2>&1 \
  || fail "Staging configuration sync failed"
echo "Staging configuration synced"

deadline=$((SECONDS + 1100))
post "$STAGING_DEPLOY_URL" '{"pullPolicy":"always","forceRecreate":false,"recreateVolumes":false}' \
  || fail "Staging deployment start not confirmed ($why)"
activity_id=$(jq --null-input --raw-input --raw-output \
  '[inputs | fromjson? | objects | select(.type == "activity") | .activityId | strings] | first // empty' "$body")
[[ $activity_id =~ ^[A-Za-z0-9-]+$ ]] || fail "Staging deployment start not confirmed"
echo "Staging deployment $activity_id started"

misses=0
while :; do
  budget "Timed out waiting for staging deployment" 30
  status=
  if arcane --max-time "$left" "${STAGING_DEPLOY_URL%/projects/*}/activities/$activity_id?limit=1"; then
    status=$(jq --raw-output --arg id "$activity_id" \
      'select(.success == true and .data.activity.id == $id) | .data.activity.status' "$body" 2>/dev/null) || status=
  fi
  budget "Timed out waiting for staging deployment" 1
  case $status in
    success) echo "Staging deployment succeeded"; break ;;
    failed | cancelled) fail "Staging deployment $status" ;;
    queued | running) misses=0 ;;
    *) ((++misses < 4)) || fail "Staging deployment status unavailable" ;;
  esac
  budget "Timed out waiting for staging deployment" 5
  sleep "$left"
done

deadline=$((SECONDS + 120))
while :; do
  budget "Staging smoke check failed" 15
  if fetch '^text/plain' --max-time "$left" "${STAGING_APP_URL%/}/api/health" && [[ $(<"$body") == Healthy ]]; then
    budget "Staging smoke check failed" 15
    if fetch '^text/html' --max-time "$left" "${STAGING_APP_URL%/}/" && grep -q 'id="root"' "$body"; then
      echo "Staging smoke check passed"
      exit 0
    fi
  fi
  budget "Staging smoke check failed" 5
  sleep "$left"
done
