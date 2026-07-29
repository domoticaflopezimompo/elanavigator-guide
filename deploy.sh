#!/bin/bash
set -e

echo "======================================"
echo " Actualizando ELA Navigator"
echo "======================================"

cd ~/elanavigator-guide

echo
echo ">> Actualizando código..."
git pull

echo
echo ">> Instalando dependencias..."
npm install

echo
echo ">> Compilando..."
npm run build

echo
echo ">> Reiniciando PM2..."
pm2 restart ela-navigator --update-env
pm2 save

echo
echo "======================================"
echo " Despliegue completado"
echo "======================================"

pm2 status
