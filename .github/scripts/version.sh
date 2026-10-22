#!/usr/bin/env bash
# Usage: version.sh [latest | next major|minor|patch] (see docs/releasing.md)
set -euo pipefail

release_tags() {
  git tag --list "$@" 'v*' | { grep -E '^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$' || true; } | sort -V
}

case ${1:-} in
  '')
    tag=$(release_tags --points-at HEAD | tail -n 1)
    if [[ -n $tag ]]; then
      echo "${tag#v}"
    else
      last=$(release_tags --merged HEAD | tail -n 1)
      base=${last:-v0.0.0}
      echo "${base#v}-staging.$(git rev-list --count "${last:+$last..}HEAD")+$(git rev-parse --short HEAD)"
    fi
    ;;
  latest)
    release_tags | tail -n 1
    ;;
  next)
    last=$(release_tags | tail -n 1)
    IFS=. read -r major minor patch <<<"${last:-v0.0.0}"
    major=${major#v}
    case ${2:-} in
      major) echo "$((major + 1)).0.0" ;;
      minor) echo "$major.$((minor + 1)).0" ;;
      patch) echo "$major.$minor.$((patch + 1))" ;;
      *) echo "usage: $0 next major|minor|patch" >&2; exit 2 ;;
    esac
    ;;
  *)
    echo "usage: $0 [latest | next major|minor|patch]" >&2
    exit 2
    ;;
esac
