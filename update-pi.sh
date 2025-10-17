#!/bin/bash
# Script de actualización para Raspberry Pi
# Actualiza el código y dependencias del Marcador TV

echo "🔄 Actualizando Marcador TV en Raspberry Pi..."

# Ir al directorio del proyecto
cd /opt/marcador-tv || {
    echo "❌ Error: No se encontró el directorio /opt/marcador-tv"
    echo "💡 Ejecuta primero install-pi.sh"
    exit 1
}

# Detener servicio si está corriendo
echo "⏹️ Deteniendo servicio..."
sudo systemctl stop marcador-tv 2>/dev/null || echo "ℹ️ Servicio no estaba corriendo"

# Hacer backup de configuraciones locales si existen
echo "💾 Respaldando configuraciones..."
if [ -f "server-config.js" ]; then
    cp server-config.js server-config.js.backup
fi

# Actualizar código desde GitHub
echo "📥 Actualizando código desde GitHub..."
git stash 2>/dev/null || true
git pull origin main

# Instalar/actualizar dependencias
echo "📦 Actualizando dependencias..."
npm install

# Instalar dependencias específicas QR si no están
echo "🔧 Verificando dependencias QR..."
npm install qrcode @types/qrcode html2canvas

# Verificar que las dependencias críticas estén instaladas
echo "✅ Verificando instalación de dependencias críticas..."
if npm list qrcode > /dev/null 2>&1; then
    echo "✅ qrcode instalado correctamente"
else
    echo "❌ Error: qrcode no se instaló. Intentando instalación manual..."
    npm install --save qrcode
fi

if npm list @types/qrcode > /dev/null 2>&1; then
    echo "✅ @types/qrcode instalado correctamente"
else
    echo "❌ Error: @types/qrcode no se instaló. Intentando instalación manual..."
    npm install --save-dev @types/qrcode
fi

# Reconstruir aplicación
echo "🔨 Reconstruyendo aplicación..."
npm run build

# Restaurar configuraciones si existen
if [ -f "server-config.js.backup" ]; then
    echo "🔄 Restaurando configuraciones..."
    cp server-config.js.backup server-config.js
    rm server-config.js.backup
fi

# Reiniciar servicio
echo "🚀 Reiniciando servicio..."
sudo systemctl daemon-reload
sudo systemctl start marcador-tv

# Verificar estado
sleep 3
if sudo systemctl is-active --quiet marcador-tv; then
    echo "✅ Servicio reiniciado correctamente"
    echo "🌐 Aplicación disponible en: http://$(hostname -I | cut -d' ' -f1):5173"
else
    echo "❌ Error al reiniciar servicio. Verificando logs..."
    sudo journalctl -u marcador-tv --no-pager -n 20
fi

echo ""
echo "📋 Comandos útiles:"
echo "   Ver logs: sudo journalctl -u marcador-tv -f"
echo "   Reiniciar: sudo systemctl restart marcador-tv"
echo "   Estado: sudo systemctl status marcador-tv"
echo ""
echo "🎯 Actualización completada!"