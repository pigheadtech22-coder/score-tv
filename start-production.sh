#!/bin/bash

# Script para ejecutar Score TV en modo producción
echo "🏆 Iniciando Score TV - Versión de Producción"
echo "=============================================="

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "   Instala Node.js desde: https://nodejs.org/"
    exit 1
fi

# Verificar que las dependencias estén instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar que el build exista
if [ ! -d "dist" ]; then
    echo "🔨 Creando build de producción..."
    npm run build
fi

echo ""
echo "🚀 Iniciando servidores..."
echo "=========================="

# Ejecutar todos los servidores en producción
concurrently \
  --names "HTTP,WebSocket" \
  --prefix-colors "green,blue" \
  "node server-production.cjs" \
  "node remote-control-server.cjs"