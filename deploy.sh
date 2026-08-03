#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="/home/adminpaco/elanavigator-guide"
APP_NAME="ela-navigator"
LOG_DIR="$APP_DIR/logs"

mkdir -p "$LOG_DIR"

LOG_FILE="$LOG_DIR/deploy-$(date +%F_%H-%M-%S).log"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "================================================="
echo "        ELA Navigator Deploy"
echo "================================================="
echo "Fecha: $(date)"
echo

cd "$APP_DIR"

echo "➜ Restaurando archivos autogenerados..."
git restore src/routeTree.gen.ts 2>/dev/null || true
git restore package-lock.json 2>/dev/null || true

echo
echo "➜ Comprobando repositorio..."
git fetch origin

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "✓ No hay cambios nuevos."
    exit 0
fi

echo
echo "➜ Actualizando código..."
git pull --ff-only

echo
echo "➜ Instalando dependencias..."
npm install

echo
echo "➜ Compilando..."
npm run build

if [ ! -f ".output/server/index.mjs" ]; then
    echo "❌ ERROR: no existe .output/server/index.mjs"
    exit 1
fi

echo "✓ Build generado correctamente"

echo
echo "➜ Reiniciando PM2..."
pm2 restart "$APP_NAME" --update-env
pm2 save

sleep 3

if ! pm2 show "$APP_NAME" | grep -q "status.*online"; then
    echo "❌ ERROR: PM2 no está ONLINE"
    exit 1
fi

echo
echo "Versión desplegada:"
git log -1 --oneline

echo
echo "Fecha del build:"
stat -c "%y %n" .output/server/index.mjs

echo
echo "================================================="
echo " DESPLIEGUE COMPLETADO"
echo "================================================="
