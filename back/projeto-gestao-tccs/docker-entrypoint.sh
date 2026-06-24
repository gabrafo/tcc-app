#!/bin/sh
set -eu

DB_DIR="${SQLITE_DIR:-/data}"
DB_FILE="${SQLITE_FILE:-$DB_DIR/db.sqlite3}"
APP_DB_FILE="/app/db.sqlite3"
FIRST_RUN=0

mkdir -p "$DB_DIR" /app/media

if [ ! -e "$DB_FILE" ]; then
  FIRST_RUN=1
fi

if [ -e "$APP_DB_FILE" ] || [ -L "$APP_DB_FILE" ]; then
  rm -f "$APP_DB_FILE"
fi

ln -s "$DB_FILE" "$APP_DB_FILE"

python manage.py migrate --noinput

if [ "$FIRST_RUN" = "1" ] && [ "${LOAD_INITIAL_DATA:-1}" = "1" ]; then
  python load.py
fi

exec python manage.py runserver "0.0.0.0:${BACKEND_PORT:-8001}"
