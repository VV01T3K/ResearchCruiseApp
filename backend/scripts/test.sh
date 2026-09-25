#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
export DOTNET_CLI_TELEMETRY_OPTOUT=1
export TESTINGPLATFORM_TELEMETRY_OPTOUT=1
mkdir -p artifacts/tests
results="$(mktemp -d "$PWD/artifacts/tests/run-XXXXXX")"
status=0
coverage=()
if [[ "${1:-}" == "--coverage" ]]; then
    coverage=(--coverage --coverage-output-format cobertura --coverage-settings coverage.settings.xml)
elif [[ $# -ne 0 ]]; then
    echo "Usage: bash scripts/test.sh [--coverage]" >&2
    exit 2
fi

# Each suite is a separate process with independent providers and report directories.
# Start all suites after the successful build, then wait for every exit status.
dotnet test ResearchCruiseApp.Tests/ResearchCruiseApp.Tests.csproj \
    -c Release --no-build --no-restore --logger trx \
    --results-directory "$results/legacy-unreviewed" &
legacy_pid=$!
dotnet run --project ResearchCruiseApp.UnitTests -c Release --no-build --no-restore -- \
    --report-trx --results-directory "$results/Unit" --fail-skips on "${coverage[@]}" &
unit_pid=$!
dotnet run --project ResearchCruiseApp.IntegrationTests -c Release --no-build --no-restore -- \
    --report-trx --results-directory "$results/Integration" --fail-skips on "${coverage[@]}" || status=1
wait "$legacy_pid" || status=1
wait "$unit_pid" || status=1
python3 scripts/verify-test-reports.py "$results/legacy-unreviewed" "$results/Unit" "$results/Integration" || status=1
echo "Backend reports: $results"
exit "$status"
