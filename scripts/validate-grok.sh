#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

node scripts/validate.mjs

if ! command -v grok >/dev/null 2>&1; then
  echo "SKIP: grok CLI is not installed; official plugin runtime validation was not executed."
  exit 0
fi

grok plugin validate plugins/oh-my-grok-build
echo "PASS: grok plugin validate"
