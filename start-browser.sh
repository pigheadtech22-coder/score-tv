#!/bin/bash

# Detectar modo basado en argumento
MODE=${1:-development}

echo "🚀 Iniciando navegador en modo: $MODE"

if [ "$MODE" = "production" ] || [ "$MODE" = "kiosk" ]; then
    echo "🎯 Modo KIOSK - Producción"
    chromium-browser \
        --kiosk \
        --disable-restore-session-state \
        --disable-session-crashed-bubble \
        --disable-infobars \
        --disable-translate \
        --check-for-update-interval=31536000 \
        --disable-dev-shm-usage \
        --no-sandbox \
        http://localhost:5174
else
    echo "🛠️ Modo DESARROLLO - Con controles"
    chromium-browser \
        --start-fullscreen \
        --disable-restore-session-state \
        --disable-session-crashed-bubble \
        --disable-infobars \
        --disable-translate \
        --disable-dev-shm-usage \
        --no-sandbox \
        http://localhost:5174
fi