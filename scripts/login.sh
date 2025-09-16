#!/usr/bin/env bash
set -Eeuo pipefail
set +H

EMAIL="${1:-test@example.com}"
PASS="${2:-Passw0rd!}"

DATA=$(jq -n \
  --arg e "$EMAIL" \
  --arg p "$PASS" \
  '{email:$e,password:$p}')

RESP=$(curl -sS -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  --data "$DATA")

echo "$RESP" | jq .

TOKEN=$(echo "$RESP" | jq -r '.token // empty')
if [[ -n "$TOKEN" ]]; then
  echo -e "\nTOKEN:\n$TOKEN\n"
  echo "# /api/me"
  curl -sS http://localhost:8080/api/me \
    -H "Authorization: Bearer $TOKEN" | jq .
fi
