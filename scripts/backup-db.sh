#!/usr/bin/env bash
# BraveVest — Postgres backup (works against Supabase)
# Usage: bash scripts/backup-db.sh
# Needs:  DATABASE_URL or DIRECT_URL exported, pg_dump installed

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"

URL="${DIRECT_URL:-${DATABASE_URL:-}}"
if [[ -z "$URL" ]]; then
  echo "❌ Set DATABASE_URL or DIRECT_URL first"
  exit 1
fi

TS=$(date +%Y%m%d-%H%M%S)
OUT="$BACKUP_DIR/bravevest-$TS.sql.gz"

echo "→ Dumping database"
pg_dump --no-owner --no-privileges "$URL" | gzip > "$OUT"

SIZE=$(du -h "$OUT" | cut -f1)
echo "✅ Backup saved: $OUT ($SIZE)"

# Keep last 14
ls -1t "$BACKUP_DIR"/bravevest-*.sql.gz 2>/dev/null | tail -n +15 | xargs -r rm -f
