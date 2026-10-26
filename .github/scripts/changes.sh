#!/usr/bin/env bash
# Usage: changes.sh frontend|backend|browser. Sets skip=true when nothing the area depends on changed since the PR base,
# or on push since the last successful push run of the top-level workflow on the branch.
set -u
if [[ $GITHUB_EVENT_NAME == pull_request ]]; then
  base=$(git rev-parse HEAD^1) || base=
else
  workflow=${GITHUB_WORKFLOW_REF%@*}
  base=$(gh api -X GET "repos/$GITHUB_REPOSITORY/actions/workflows/${workflow##*/}/runs" -f branch="$GITHUB_REF_NAME" \
    -f event=push -f status=success -f per_page=1 --jq '.workflow_runs[0].head_sha // empty') || base=
  [[ -n $base ]] && git fetch -q --depth=1 origin "$base" || base=
fi
[[ -n $base ]] && files=$(git diff --no-renames --name-only "$base" HEAD) || exit 0
code=$(grep -vE '^docs/|\.md$|^\.gitignore$' <<< "$files")
deleted=$(git diff --no-renames --diff-filter=D --name-only "$base" HEAD | grep -vE '^docs/|\.md$|^\.gitignore$')
# frontend/package.json and .node-version also set up the backend checks.
if [[ -z $files || -n $deleted ]] || grep -qvE '^$|^(frontend|backend)/' <<< "$code" ||
  grep -qxE 'frontend/(package\.json|\.node-version)' <<< "$code"; then
  exit 0
fi
case $1 in
  frontend) pattern='^(frontend|backend/ResearchCruiseApp/openapi)/' ;;
  backend) pattern='^backend/' ;;
  browser) pattern='^frontend/' ;;
esac
grep -qE "$pattern" <<< "$code" && exit 0
echo "skip=true" >> "$GITHUB_OUTPUT"
echo "Skipped the $1 steps: no $1 changes since \`$base\`." >> "$GITHUB_STEP_SUMMARY"
