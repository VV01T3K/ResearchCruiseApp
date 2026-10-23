#!/usr/bin/env bash
{ set +x; } 2>/dev/null
set -euo pipefail

fail() { echo "::error::$1"; exit 1; }

for name in STAGING_SYNC_URL STAGING_DEPLOY_URL STAGING_DEPLOY_API_KEY CLOUDFLARE_WEBHOOK_SECRET STAGING_APP_URL GITHUB_SHA; do
  [[ -n ${!name:-} ]] || fail "Set $name"
done

body=$(mktemp)
trap 'rm -f "$body"' EXIT

request() {
  local expected=$1 url=$2 timeout=$3 meta code type regex
  shift 3

  meta=$(curl -s --proto '=https' --connect-timeout 15 --max-time "$timeout" \
    -o "$body" -w '%{http_code} %{content_type}' "$@" "$url" 2>/dev/null) \
    || { why="network error"; return 1; }

  read -r code type <<< "$meta"
  [[ $code == 200 ]] || { why="HTTP $code"; return 1; }

  regex="^${expected}[[:space:]]*(;.*)?$"
  [[ ${type,,} =~ $regex ]] || { why="unexpected content type"; return 1; }
}

post() {
  request "$3" "$1" 1100 \
    -H "X-Api-Key: $STAGING_DEPLOY_API_KEY" \
    -H "X-Cloudflare-Secret: $CLOUDFLARE_WEBHOOK_SECRET" \
    -H 'Content-Type: application/json' --data "$2"
}

get() { request "$1" "${STAGING_APP_URL%/}$2" 10 || { problem+=" ($why on $2)"; return 1; }; }

# 1. Synchronize staging configuration
post "$STAGING_SYNC_URL" '{}' application/json \
  || fail "Staging sync failed ($why)"

jq -e '.success == true and .data.success == true' "$body" >/dev/null 2>&1 \
  || fail "Staging sync failed"
echo "Staging configuration synced"

# 2. Deploy and validate the JSON stream
post "$STAGING_DEPLOY_URL" \
  '{"pullPolicy":"always","forceRecreate":false,"recreateVolumes":false}' \
  application/x-json-stream || fail "Staging deployment failed ($why)"

activity_id=$(jq -Rsre 'rtrimstr("\n") | split("\n") | map(fromjson) |
  if length >= 2
    and (.[0].type == "activity")
    and (.[0].activityId | type == "string" and test("^[A-Za-z0-9-]+$"))
    and (.[1:-1] | all(.[]; type == "object" and keys == ["log"]))
    and (.[-1] == {done:true})
    and all(.[]; type == "object" and (has("error") | not))
  then .[0].activityId else empty end
' "$body" 2>/dev/null) || fail "Staging deployment incomplete or failed"

echo "Staging deployment $activity_id finished"

# 3. Verify the live staging application
serves_this_build() {
  problem="app check failed"

  get text/plain /api/health && [[ $(<"$body") == Healthy ]] || return 1
  get application/json /api/version || return 1

  version=$(jq -er 'strings | select(test("^[0-9A-Za-z.+-]+$"))' "$body" 2>/dev/null) || return 1
  local sha=${version##*+}

  [[ $version == *+* && ${#sha} -ge 7 && $GITHUB_SHA == "$sha"* ]] \
    || { problem="still serves an older build"; return 1; }

  get text/html / && grep -q 'id="root"' "$body"
}

deadline=$((SECONDS + 120))
until serves_this_build; do
  ((SECONDS + 5 < deadline)) || fail "Staging $problem"
  sleep 5
done

echo "Staging serves $version"
