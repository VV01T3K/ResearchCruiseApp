#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mode="${1:-check}"
case "$mode" in check|fix|lint|quick) ;; *) echo "Unknown workspace task: $mode" >&2; exit 2 ;; esac
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
    # Regenerate the API contract and client in place; check fails if they were out of date.
    vp run -F backend build --no-restore --warnaserror -p:GenerateApiContract=true
    vp run -F frontend gen
    if [[ "$mode" == check ]]; then
        generated=(backend/ResearchCruiseApp/openapi frontend/src/api/generated)
        if ! git diff --quiet -- "${generated[@]}" \
            || [[ -n "$(git ls-files --others --exclude-standard -- "${generated[@]}")" ]]; then
            git status --short -- "${generated[@]}"
            echo "Generated API contract is out of date. Run vp run fix and commit the result." >&2
            exit 1
        fi
    fi
else
    vp run -F backend build --no-restore --warnaserror
fi

if [[ "$mode" == lint ]]; then
    vp run -F frontend lint
    exit 0
fi

# Frontend checks run alongside the backend tests; either failure fails the command.
status=0
(vp run -F frontend lint && vp run -F frontend test:unit) &
frontend_pid=$!
if [[ "$mode" == quick ]]; then
    vp run -F backend test:unit:built || status=1
else
    vp run -F backend test || status=1
fi
wait "$frontend_pid" || status=1
exit "$status"
