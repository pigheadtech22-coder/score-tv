#!/bin/bash
# Script para lanzar Chromium optimizado en Raspberry Pi
# Soluciona errores "Aw Snap" con configuración específica

echo "🚀 Iniciando Chromium optimizado para Raspberry Pi..."

# Matar procesos Chromium existentes
echo "🧹 Cerrando instancias anteriores de Chromium..."
pkill -f chromium 2>/dev/null || true
sleep 2

# Liberar memoria antes de iniciar
echo "💾 Liberando memoria del sistema..."
sudo sync
sudo sysctl vm.drop_caches=3 >/dev/null 2>&1 || true

# Verificar que el servicio esté corriendo
echo "🔍 Verificando servicio marcador-tv..."
if ! systemctl is-active --quiet marcador-tv; then
    echo "⚠️ Servicio no está activo, intentando iniciar..."
    sudo systemctl start marcador-tv
    sleep 3
fi

# Obtener IP local
IP=$(hostname -I | cut -d' ' -f1)
URL="http://${IP}:5173"

echo "🌐 Conectando a: $URL"

# Lanzar Chromium con configuración optimizada para Pi
echo "🚀 Iniciando Chromium optimizado..."

# Configuración específica para evitar "Aw Snap"
chromium-browser \
    --no-sandbox \
    --disable-web-security \
    --disable-features=VizDisplayCompositor \
    --disable-background-timer-throttling \
    --disable-backgrounding-occluded-windows \
    --disable-renderer-backgrounding \
    --disable-field-trial-config \
    --disable-ipc-flooding-protection \
    --max-old-space-size=512 \
    --disable-dev-shm-usage \
    --disable-gpu \
    --disable-software-rasterizer \
    --disable-background-networking \
    --disable-default-apps \
    --disable-extensions \
    --disable-sync \
    --disable-translate \
    --hide-scrollbars \
    --disable-plugins \
    --disable-images \
    --aggressive-cache-discard \
    --memory-pressure-off \
    --disable-hang-monitor \
    --disable-prompt-on-repost \
    --disable-domain-reliability \
    --disable-component-extensions-with-background-pages \
    --start-fullscreen \
    --kiosk \
    "$URL" &

# Guardar PID para poder matar el proceso después
CHROMIUM_PID=$!
echo "🔢 Chromium iniciado con PID: $CHROMIUM_PID"

# Crear archivo con PID para control
echo $CHROMIUM_PID > /tmp/chromium_marcador.pid

echo ""
echo "✅ Chromium optimizado iniciado exitosamente!"
echo "📱 URL: $URL"
echo "🔧 Para cerrar: pkill -f chromium"
echo "📊 Para ver memoria: htop"
echo ""
echo "💡 Si sigue crasheando, ejecuta: bash diagnose-pi.sh"