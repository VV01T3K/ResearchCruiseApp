#!/usr/bin/env bash
# Usage: version.sh [latest | next major|minor|patch] (see docs/releasing.md)
set -euo pipefail

usage() { echo "usage: $0 [latest | next major|minor|patch]" >&2; exit 2; }
# The highest vX.Y.Z tag, optionally limited by git tag filters such as --merged HEAD.
latest() { git tag --list "$@" 'v*' | { grep -E '^v(0|[1-9][0-9]*)(\.(0|[1-9][0-9]*)){2}$' || true; } | sort -V | tail -n 1; }

case ${1:-} in
  '')
    tag=$(latest --points-at HEAD)
    [[ -z $tag ]] || { echo "${tag#v}"; exit; }
    last=$(latest --merged HEAD)
    base=${last:-v0.0.0}
    echo "${base#v}-staging.$(git rev-list --count "${last:+$last..}HEAD")+$(git rev-parse --short HEAD)"
    ;;
  latest) latest ;;
  next)
    last=$(latest)
    IFS=. read -r major minor patch <<< "${last:-v0.0.0}"
    major=${major#v}
    case ${2:-} in
      major) echo "$((major + 1)).0.0" ;;
      minor) echo "$major.$((minor + 1)).0" ;;
      patch) echo "$major.$minor.$((patch + 1))" ;;
      *) usage ;;
    esac
    ;;
  *) usage ;;
esac
