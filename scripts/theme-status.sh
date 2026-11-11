#!/usr/bin/env bash
# rab: Where this site stands against upstream Pilcrow Pro. Read-only: fetches tags, never merges.
# Usage: ./scripts/theme-status.sh            (add --no-fetch to skip contacting GitHub)
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

[ "${1:-}" = "--no-fetch" ] || git fetch --quiet --tags upstream

base=$(git merge-base HEAD upstream/main || true)
if [ -z "$base" ]; then
  echo "This repo does not yet share history with upstream Pilcrow, so releases can't be merged."
  echo "Run the one-time step in CUSTOMIZATIONS.md, \"One-time step: connect the history to Pilcrow\"."
  exit 1
fi
current=$(git describe --tags --abbrev=0 --match 'v*' "$base")
latest=$(git describe --tags --abbrev=0 --match 'v*' upstream/main)

echo "Pilcrow in this site:     $current"
echo "Latest Pilcrow release:   $latest"

mine() {
  # Theme files I have changed since $current (working tree included), leaving out my own layers
  git diff --name-only "$current" -- . \
    ':(exclude)src/content' ':(exclude)src/custom' \
    ':(exclude)CUSTOMIZATIONS.md' ':(exclude)CLAUDE.md' ':(exclude)scripts/theme-status.sh'
}

if [ "$current" != "$latest" ]; then
  echo
  echo "Releases since $current:"
  git log --oneline "$current..$latest"
  echo
  echo "Seams the update also touches (expect conflicts here):"
  comm -12 <(git diff --name-only "$current" "$latest" | sort) <(mine | sort) | sed 's/^/  /'
else
  echo "Up to date."
fi

echo
echo "Theme files I have changed since $current (the seams):"
mine | sed 's/^/  /'

# Demo posts in the latest release that src/custom/theme-demo.ts doesn't list would publish.
# blog/ko/ is skipped: those posts were deleted with Korean support (see CUSTOMIZATIONS.md).
echo
echo "Upstream demo content not listed in src/custom/theme-demo.ts (it would publish):"
missing=0
while read -r f; do
  name=${f#src/content/*/}
  case "$name" in ko/*) continue ;; esac
  grep -q "'$name'" src/custom/theme-demo.ts || { echo "  $f"; missing=1; }
done < <(git ls-tree -r --name-only "$latest" src/content/blog src/content/work)
[ "$missing" = 0 ] && echo "  None."

