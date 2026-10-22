#!/usr/bin/env bash
# Usage: check-ci.sh <sha>. Waits for the commit's staging CI and fails unless every required job passed.
set -euo pipefail
sha=$1
required=("checks / Frontend checks" "checks / Backend checks" "checks / JavaScript dependency audit"
  "Build frontend" "Build backend" "test")

fail() { echo "::error::$1"; exit 1; }

# deploy-staging.yaml skips commits that only touch docs/, *.md or .gitignore, so its run may come from
# the parents back to the last other commit. Playwright must pass on the commit itself.
docs_only() {
  local files
  files=$(git diff-tree --no-commit-id --name-only -r "$1")
  [[ -n $files ]] && ! grep -qvE '^docs/|\.md$|^\.gitignore$' <<< "$files"
}
commits=("$sha")
while docs_only "${commits[-1]}"; do commits+=("$(git rev-parse "${commits[-1]}^")"); done

# The newest staging push run of each workflow, as "id status conclusion url".
runs() {
  for commit in "${commits[@]}"; do
    gh api "repos/$GITHUB_REPOSITORY/actions/runs?head_sha=$commit&per_page=100" || return
  done | jq -rs --arg sha "$sha" '
    [.[].workflow_runs[] | select(.event == "push" and .head_branch == "staging")
      | select(.path == ".github/workflows/deploy-staging.yaml"
        or (.path == ".github/workflows/playwright.yaml" and .head_sha == $sha))]
    | group_by(.path)[] | max_by(.id) | [.id, .status, .conclusion // "", .html_url] | @tsv'
}

while runs=$(runs) && awk -F '\t' '$2 && $2 != "completed" { found = 1 } END { exit !found }' <<< "$runs"; do
  echo "Waiting for CI on $sha..."
  sleep 30
done
echo "$runs"
awk -F '\t' '$3 != "success" { exit 1 }' <<< "$runs" || fail "CI did not pass for $sha."

passed=$(cut -f1 <<< "$runs" | while read -r id; do
  gh api "repos/$GITHUB_REPOSITORY/actions/runs/$id/jobs?per_page=100" --jq '.jobs[] | select(.conclusion == "success") | .name'
done)
for job in "${required[@]}"; do
  grep -qxF "$job" <<< "$passed" || fail "Required job \"$job\" did not pass on $sha."
done
