#!/bin/bash
WEBHOOK_URL="${KOMODO_WEBHOOK_URL:?KOMODO_WEBHOOK_URL is required}"
SECRET="${KOMODO_WEBHOOK_SECRET:?KOMODO_WEBHOOK_SECRET is required}"
CLOUDFLARE_WEBHOOK_SECRET="${CLOUDFLARE_WEBHOOK_SECRET:?CLOUDFLARE_WEBHOOK_SECRET is required}"
BRANCH="${1:-main}"

PAYLOAD="{\"ref\":\"refs/heads/$BRANCH\"}"
SIGNATURE="sha256=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')"

HTTP_CODE=$(curl -sS -o /dev/null -w "%{http_code}" \
  "$WEBHOOK_URL" \
  -H "X-Hub-Signature-256: $SIGNATURE" \
  -H "X-Cloudflare-Secret: $CLOUDFLARE_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD") || {
  echo "Webhook call failed (curl error)" >&2
  exit 1
}

if [[ "$HTTP_CODE" != "200" ]]; then
  echo "Webhook call failed (HTTP ${HTTP_CODE})" >&2
  exit 1
fi
