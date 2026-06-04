#!/usr/bin/env bash
# Refresh LinkedIn viewer assets (profile photo + logos) into public/linkedin/
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/linkedin"
mkdir -p "$OUT"

curl -fsSL "https://unavatar.io/linkedin/tylerriccardi" -o "$OUT/profile.jpg"

fetch_logo() {
  local name="$1"
  local domain="$2"
  if curl -fsSL "https://logo.clearbit.com/${domain}" -o "$OUT/${name}.png"; then
    echo "ok clearbit $name"
  elif curl -fsSL "https://www.google.com/s2/favicons?domain=${domain}&sz=128" -o "$OUT/${name}.png"; then
    echo "ok favicon $name"
  else
    echo "skip $name"
  fi
}

fetch_logo fourseat fourseat.dev
fetch_logo taxzone taxzone.com
fetch_logo ucf ucf.edu
fetch_logo anthropic anthropic.com
fetch_logo bloomberg bloomberg.com
fetch_logo autodesk autodesk.com

echo "Done. Files in public/linkedin/"
