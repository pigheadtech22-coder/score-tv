#!/bin/bash
# Script para preparar el repositorio para migración a Pi

echo "🚀 Preparando repositorio para migración a Raspberry Pi..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecutar desde el directorio del proyecto"
    exit 1
fi

# Agregar todos los archivos
echo "📝 Agregando archivos..."
git add .

# Commit con mensaje descriptivo
echo "💾 Creando commit..."
git commit -m "🥧 Sistema listo para migración a Raspberry Pi

- ✅ Configuración cross-platform (PC/Pi)
- ✅ Script de instalación automática (install-pi.sh)
- ✅ Configuración de red para Pi (setup-pi-network.js)
- ✅ Documentación completa de migración
- ✅ Servicios systemd configurados
- ✅ Detección automática de plataforma
- ✅ Sistema de control híbrido ESP32/Web

Comandos nuevos:
- npm run start:pi
- npm run build:pi
- npm run setup:pi-network"

# Pushear a GitHub
echo "☁️ Subiendo a GitHub..."
git push origin main

echo "✅ ¡Listo! El proyecto está disponible en GitHub"
echo "🔗 Para clonar en Pi: git clone https://github.com/pigheadtech22-coder/score-tv.git"
echo "📋 O usar el script: wget https://raw.githubusercontent.com/pigheadtech22-coder/score-tv/main/install-pi.sh"