#!/usr/bin/env bash
set -Eeuo pipefail
set +H  # desactiva la expansión de '!' en bash

EMAIL="demo$(date +%s)@example.com"
PASS='Passw0rd!'       # ¡con exclamación!
NOMBRE='Demo'
APELLIDOS='User'

DATA=$(jq -n \
  --arg e "$EMAIL" \
  --arg p "$PASS" \
  --arg n "$NOMBRE" \
  --arg a "$APELLIDOS" \
  '{email:$e,password:$p,nombre:$n,apellidos:$a}')

RESP=$(curl -sS -X POST http://localhost:8080/api/auth/register \
  -H 'Content-Type: application/json' \
  --data "$DATA")

echo "$RESP" | jq .

TOKEN=$(echo "$RESP" | jq -r '.token // empty')
if [[ -n "$TOKEN" ]]; then
  echo -e "\nTOKEN:\n$TOKEN\n"
  echo "# /api/me"
  curl -sS http://localhost:8080/api/me \
    -H "Authorization: Bearer $TOKEN" | jq .
else
  echo "No se recibió token (¿409 por email duplicado?)." >&2
fi
