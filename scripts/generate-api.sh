#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
port=5099

cleanup() {
  kill "$server_pid" 2>/dev/null || true
}
trap cleanup EXIT

cd "$root/backend"
ASPNETCORE_ENVIRONMENT=Testing dotnet run --project ResearchCruiseApp --no-launch-profile -- --urls "http://127.0.0.1:$port" >/dev/null &
server_pid=$!

downloaded=false
for _ in $(seq 1 60); do
  if curl --fail --silent --show-error "http://127.0.0.1:$port/openapi/v2.json" --output "$root/backend/openapi/v2.json"; then
    downloaded=true
    break
  fi
  sleep 1
done
$downloaded

kill "$server_pid" 2>/dev/null || true
wait "$server_pid" 2>/dev/null || true

cd "$root/frontend"
vp exec orval --config ./orval.config.ts
vp fmt src/api/generated
