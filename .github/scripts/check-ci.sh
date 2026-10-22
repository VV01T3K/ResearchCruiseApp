#!/usr/bin/env bash
# Usage: check-ci.sh <sha>. Waits for the commit's CI and fails unless every required job passed on it.
set -euo pipefail
sha=$1
workflows='["deploy-staging.yaml", "playwright.yaml"]'
required=("checks / Frontend checks" "checks / Backend checks" "checks / JavaScript dependency audit"
  "Build frontend" "Build backend" "test")
fail() { echo "::error::$*"; exit 1; }

# A commit that only changes paths deploy-staging.yaml ignores gets no image builds, so its parents back
# to the last commit that changed anything else count as well.
commits=("$sha")
while files=$(git diff-tree --no-commit-id --name-only -r "${commits[-1]}") && [[ -n $files ]] \
  && ! grep -qvE '^docs/|\.md$|^\.gitignore$' <<< "$files"; do
  commits+=("$(git rev-parse "${commits[-1]}^")")
done
(( ${#commits[@]} == 1 )) || echo "Using the CI of ${commits[*]}"

# The newest staging push run of each CI workflow, so a superseded run neither counts nor blocks.
latest_runs() {
  local commit json=
  for commit in "${commits[@]}"; do
    json+=$(gh api "repos/$GITHUB_REPOSITORY/actions/runs?head_sha=$commit&per_page=100") || return
  done
  jq -rs --argjson workflows "$workflows" '
    [.[].workflow_runs[] | select(.event == "push" and .head_branch == "staging"
      and (.path | ltrimstr(".github/workflows/") | IN($workflows[])))]
    | group_by(.workflow_id)[] | max_by(.id) | [.id, .status, .conclusion // "", .name, .html_url] | @tsv' <<< "$json"
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
    --jq '.jobs[] | select(.conclusion == "success") | .name'
done)
for job in "${required[@]}"; do
  grep -qxF "$job" <<< "$passed" || fail "Required job \"$job\" did not pass on $sha."
done
