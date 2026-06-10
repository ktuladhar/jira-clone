#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

for _ in $(seq 1 30); do
  if node -e "require('net').connect(5432,'db').on('connect',()=>process.exit(0)).on('error',()=>process.exit(1))" 2>/dev/null; then
    break
  fi
  sleep 1
done

if ! pgrep -f "ts-node --files src/index.ts" >/dev/null 2>&1; then
  (cd "$ROOT/api" && npm start > /tmp/jira-api.log 2>&1 &)
fi

if ! pgrep -f "webpack-dev-server" >/dev/null 2>&1; then
  (cd "$ROOT/client" && npm start > /tmp/jira-client.log 2>&1 &)
fi
