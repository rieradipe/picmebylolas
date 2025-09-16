#!/usr/bin/env bash
set -euo pipefail

# === Base de datos (por si no las tienes en el entorno) ===
export SPRING_DATASOURCE_URL="${SPRING_DATASOURCE_URL:-jdbc:postgresql://localhost:5432/picmebylolas}"
export SPRING_DATASOURCE_USERNAME="${SPRING_DATASOURCE_USERNAME:-postgres}"
export SPRING_DATASOURCE_PASSWORD="${SPRING_DATASOURCE_PASSWORD:-alba}"

# === Claves ===
# Coinciden con application.properties:
#   security.jwt.secret=${APP_JWT_SECRET}
#   app.crypto.key=${APP_CRYPTO_KEY}
# === JWT ===
if [[ -z "${APP_JWT_SECRET:-}" ]]; then
  echo "[info] Generando APP_JWT_SECRET (Base64 32 bytes, solo DEV)"
  APP_JWT_SECRET="$(openssl rand -base64 32 | tr -d '[:space:]')"
fi
export APP_JWT_SECRET

if [[ -z "${APP_CRYPTO_KEY:-}" ]]; then
  echo "[info] Generando APP_CRYPTO_KEY (Base64 32 bytes, solo DEV)"
  APP_CRYPTO_KEY="$(openssl rand -base64 32 | tr -d '[:space:]')"
fi
export APP_CRYPTO_KEY


# --- Comprobación rápida de Base64 ---
is_base64(){ [[ "$1" =~ ^[A-Za-z0-9+/=]+$ ]]; }
is_base64 "$APP_JWT_SECRET"  || { echo "[error] APP_JWT_SECRET no es Base64"; exit 1; }
is_base64 "$APP_CRYPTO_KEY"  || { echo "[error] APP_CRYPTO_KEY no es Base64"; exit 1; }

# Resumen (sin exponer secretos)
echo "[run] SPRING_DATASOURCE_URL=$SPRING_DATASOURCE_URL"
echo "[run] SPRING_DATASOURCE_USERNAME=$SPRING_DATASOURCE_USERNAME"
echo "[run] APP_JWT_SECRET: set"
echo "[run] APP_CRYPTO_KEY: set"

# === Arranque ===
test -f pom.xml || { echo "[error] Aquí no hay pom.xml: $(pwd)"; exit 1; }

if [[ -f ./mvnw ]]; then
  chmod +x mvnw
  ./mvnw clean compile -DskipTests
  exec ./mvnw spring-boot:run
else
  mvn clean compile -DskipTests
  exec mvn spring-boot:run
fi
