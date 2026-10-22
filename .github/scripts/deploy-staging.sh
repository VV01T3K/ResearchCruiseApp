#!/usr/bin/env bash
{ set +x; } 2>/dev/null
set -euo pipefail

: "${STAGING_SYNC_URL:?Set the staging Git sync URL}"
: "${STAGING_DEPLOY_URL:?Set the staging project up URL}"
: "${STAGING_DEPLOY_API_KEY:?Set the deployment API key}"
: "${CLOUDFLARE_WEBHOOK_SECRET:?Set the Cloudflare webhook secret}"
: "${STAGING_APP_URL:?Set the public staging app URL}"
: "${GITHUB_SHA:?Set the deployed commit SHA}"

fail() {
  echo "::error::$1"
  exit 1
}

body=$(mktemp)
trap 'rm -f "$body"' EXIT

# Saves the response to $body and curl's exit code to $rc; on an unusable response sets $why and returns 1.
fetch() {
  local want="^$1[[:space:]]*(;.*)?$" meta code type
  shift
  rc=0
  meta=$(curl --silent --proto '=https' --connect-timeout 15 --output "$body" \
    --write-out '%{http_code} %{content_type}' "$@" 2>/dev/null) || rc=$?
  code=${meta%% *} type=${meta#* }
  case $code in
    200) [[ ${type,,} =~ $want ]] && return 0; why="unexpected content type" ;;
    000 | '') why="no response" ;;
    3??) why="redirected" ;;
    *) why="HTTP $code" ;;
  esac
  return 1
}

post() {
  fetch "$3" --max-time 1100 \
    --header "X-Api-Key: $STAGING_DEPLOY_API_KEY" \
    --header "X-Cloudflare-Secret: $CLOUDFLARE_WEBHOOK_SECRET" \
    --header 'Content-Type: application/json' --data "$2" "$1"
}

get() {
  fetch "$1" --max-time 10 "${STAGING_APP_URL%/}$2" && ((rc == 0))
}

serves_this_build() {
  problem="app check failed"
  get text/plain /api/health && [[ $(<"$body") == Healthy ]] || return 1
  get application/json /api/version || return 1
  version=$(jq --exit-status --raw-output 'strings | select(test("^[0-9A-Za-z.+-]+$"))' "$body" 2>/dev/null) || return 1
  sha=${version##*+}
  [[ $version == *+* && ${#sha} -ge 7 && $GITHUB_SHA == "$sha"* ]] || { problem="still serves an older build"; return 1; }
  get text/html / && grep -q 'id="root"' "$body"
}

post "$STAGING_SYNC_URL" '{}' application/json || fail "Staging configuration sync failed ($why)"
((rc == 0)) || fail "Staging configuration sync failed (incomplete response)"
jq --exit-status '.success == true and .data.success == true' "$body" >/dev/null 2>&1 \
  || fail "Staging configuration sync failed"
echo "Staging configuration synced"

post "$STAGING_DEPLOY_URL" '{"pullPolicy":"always","forceRecreate":false,"recreateVolumes":false}' application/x-json-stream \
  || fail "Staging deployment request failed ($why)"
result=$(jq --null-input --raw-input --raw-output '
  [inputs | select(length > 0) | fromjson? // "invalid"] as $frames
  | ($frames[0] | if type == "object" and .type == "activity" and (.activityId | type == "string" and test("^[A-Za-z0-9-]+$"))
      then .activityId else "" end) as $id
  | if any($frames[]; type == "object" and has("error")) then "failed"
    elif $id != "" and all($frames[]; type == "object") and $frames[-1] == {done: true} then "succeeded"
    else "unknown" end
  | "\(.) \($id)"' "$body" 2>/dev/null) || result=unknown
read -r outcome activity_id <<<"$result"
[[ -z $activity_id ]] || echo "Staging deployment $activity_id started"
[[ $outcome != failed ]] || fail "Staging deployment failed"
[[ $outcome == succeeded && $rc == 0 ]] || fail "Staging deployment outcome unknown"
echo "Staging deployment finished"

deadline=$((SECONDS + 120))
until serves_this_build; do
  ((SECONDS + 5 < deadline)) || fail "Staging $problem"
  sleep 5
done
echo "Staging serves $version"
