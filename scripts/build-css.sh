#!/bin/bash
# Compile the Tailwind utilities used by every page into assets/tw.css.
# Needs Node. Uses the official CLI (tailwindcss@3.4.17) via npx; nothing is added to the repo.
set -e
cd "$(dirname "$0")/.."
npx --yes tailwindcss@3.4.17 -c tailwind.config.js -i scripts/tailwind.input.css -o assets/tw.css --minify
