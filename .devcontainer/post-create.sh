#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cat > "$ROOT/api/.env" <<'EOF'
NODE_ENV=development
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=jira_development
JWT_SECRET=development12345
EOF

cd "$ROOT"
npm run install-dependencies
