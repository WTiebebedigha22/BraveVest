#!/usr/bin/env bash
# BraveVest — Postgres restore (works against Supabase)
# Usage: bash scripts/restore-db.sh backups/bravevest-YYYYMMDD.sql.gz

set -euo pipefail

FILE="${1:-}"
URL="${DIRECT_URL:-${DATABASE_URL:-}}"

if [[ -z "$FILE" || ! -f "$FILE" ]]; then
  echo "❌ Usage: bash scripts/restore-db.sh <backup.sql.gz>"
  exit 1
fi
if [[ -z "$URL" ]]; then
  echo "❌ Set DATABASE_URL or DIRECT_URL first"
  exit 1
fi

echo "⚠️  This will overwrite the current database. Type yes to continue:"
read CONFIRM
[[ "$CONFIRM" != "yes" ]] && echo "Aborted." && exit 1

echo "→ Restoring from $FILE"
gunzip -c "$FILE" | psql "$URL"

echo "✅ Restore complete."
