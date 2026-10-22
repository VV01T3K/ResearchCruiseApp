#!/usr/bin/env bash
# Usage: check-ci.sh <sha>. Waits for the commit's CI and fails unless every required job passed on it.
set -euo pipefail
sha=$1
workflows='["deploy-staging.yaml", "playwright.yaml", "format-and-lint.yaml"]'
required=("Frontend checks" "Backend checks" "JavaScript dependency audit" "Build frontend" "Build backend" "test")
fail() { echo "::error::$*"; exit 1; }

# The newest run of each CI workflow, so a superseded run neither counts nor blocks.
latest_runs() {
  gh api "repos/$GITHUB_REPOSITORY/actions/runs?head_sha=$sha&per_page=100" | jq -r --argjson workflows "$workflows" '
    [.workflow_runs[] | select((.event == "push" or .event == "pull_request")
      and (.path | ltrimstr(".github/workflows/") | IN($workflows[])))]
    | group_by(.workflow_id)[] | max_by(.id) | [.id, .status, .conclusion // "", .name, .html_url] | @tsv'
}

while runs=$(latest_runs); [[ -n $runs ]] && awk -F '\t' '$2 != "completed" { pending = 1 } END { exit !pending }' <<< "$runs"; do
  echo "Waiting for CI on $sha..."
  sleep 30
done
[[ -n $runs ]] || fail "No CI runs found for $sha."
echo "$runs"
if awk -F '\t' '$3 != "success" { bad = 1 } END { exit !bad }' <<< "$runs"; then
  fail "CI did not pass for $sha."
fi

passed=$(cut -f1 <<< "$runs" | while read -r id; do
  gh api "repos/$GITHUB_REPOSITORY/actions/runs/$id/jobs?per_page=100" \
    --jq '.jobs[] | select(.conclusion == "success") | .name | split(" / ") | last'
done)
for job in "${required[@]}"; do
  grep -qxF "$job" <<< "$passed" || fail "Required job \"$job\" did not pass on $sha."
done
