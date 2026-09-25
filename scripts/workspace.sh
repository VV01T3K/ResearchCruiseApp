#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mode="${1:-check}"
case "$mode" in check|fix|lint|quick|coverage) ;; *) echo "Unknown workspace task: $mode" >&2; exit 2 ;; esac
export DOTNET_CLI_TELEMETRY_OPTOUT=1
export TESTINGPLATFORM_TELEMETRY_OPTOUT=1

vp run -F backend restore
if [[ "$mode" == fix ]]; then
    vp run -F backend fix
    vp run -F frontend fix
else
    vp run -F backend format:check
fi

if [[ "$mode" == check || "$mode" == fix ]]; then
    mkdir -p backend/artifacts/contracts
    scratch="$(mktemp -d "$PWD/backend/artifacts/contracts/run-XXXXXX")"
    trap 'rm -rf -- "$scratch"' EXIT
    export RCA_CONTRACT_ROOT="$scratch"
    mkdir -p "$scratch/frontend/src/api/client"
    cp frontend/src/api/client/custom-fetch.ts "$scratch/frontend/src/api/client/"
    vp run -F backend build --no-restore --warnaserror -p:GenerateApiContract=true "-p:OpenApiDocumentsDirectory=$scratch/openapi"
    vp run -F frontend gen
    python3 scripts/compare-contracts.py "$mode" "$scratch"
else
    vp run -F backend build --no-restore --warnaserror
fi

# Both sides run after the single build. Preserve either failure.
status=0
if [[ "$mode" == lint ]]; then
    vp run -F frontend lint
    exit 0
fi
(
    frontend_status=0
    vp run -F frontend lint || frontend_status=1
    vp run -F frontend test:unit --reporter=default --reporter=junit "--outputFile=$PWD/backend/artifacts/frontend-unit.xml" || frontend_status=1
    exit "$frontend_status"
) &
frontend_pid=$!
if [[ "$mode" == quick ]]; then
    echo "PARTIAL CHECK: no generated-contract verification or SQL integration tests."
    vp run -F backend test:unit:built || status=1
elif [[ "$mode" == coverage ]]; then
    vp run -F backend test --coverage || status=1
else
    vp run -F backend test || status=1
fi
wait "$frontend_pid" || status=1
exit "$status"
