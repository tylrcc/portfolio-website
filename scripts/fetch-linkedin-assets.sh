#!/usr/bin/env bash
# Refresh LinkedIn viewer assets (profile photo + company logos) into public/linkedin/
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/linkedin"
mkdir -p "$OUT"

curl -fsSL "https://unavatar.io/linkedin/tylerriccardi" -o "$OUT/profile.jpg"

# Fourseat — official LinkedIn company logo
curl -fsSL "https://media.licdn.com/dms/image/v2/D560BAQETlf-w4GnhCw/company-logo_200_200/B56Z3VrSbzIkAQ-/0/1777406388473/fourseat_logo?e=2147483647&v=beta&t=0QW9vPpn-wqzAJHDL6PHLZ31iad3XsS1z7rxYPUvFho" \
  -o "$OUT/fourseat.png"

# Taxzone — site logo (LinkedIn company page has no public logo URL)
curl -fsSL "https://taxzoneus.com/wp-content/uploads/2025/11/cropped-New-Tax-Firm-Logo-270x270.png" \
  -o "$OUT/taxzone.png"

fetch_logo() {
  local name="$1"
  local domain="$2"
  if curl -fsSL "https://www.google.com/s2/favicons?domain=${domain}&sz=128" -o "$OUT/${name}.png"; then
    echo "ok favicon $name ($domain)"
  else
    echo "skip $name"
  fi
}

fetch_logo ucf ucf.edu
fetch_logo anthropic anthropic.com
fetch_logo bloomberg bloomberg.com
fetch_logo autodesk autodesk.com

echo "Done. Files in public/linkedin/"
