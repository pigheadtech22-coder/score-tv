#!/bin/bash

echo "🏆 SCORE TV - INSTALADOR AUTOMÁTICO"
echo "====================================="

# Función para verificar comandos
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ Error: $1 no está instalado"
        return 1
    else
        echo "✅ $1 está disponible"
        return 0
    fi
}

echo ""
echo "🔍 Verificando dependencias..."

# Verificar Node.js
if ! check_command node; then
    echo "   Descarga e instala Node.js desde: https://nodejs.org/"
    exit 1
fi

# Verificar npm
if ! check_command npm; then
    echo "   npm debería venir con Node.js"
    exit 1
fi

# Verificar git
if ! check_command git; then
    echo "   Instala git desde: https://git-scm.com/"
    exit 1
fi

echo ""
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo ""
echo "🔨 Creando build de producción..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error al crear build"
    exit 1
fi

echo ""
echo "✅ ¡Instalación completada exitosamente!"
echo ""
echo "🚀 Para ejecutar Score TV, usa:"
echo "   ./start-production.sh"
echo ""
echo "   O manualmente:"
echo "   npm run start:production"
echo ""
echo "🌐 Una vez iniciado, accede a:"
echo "   📱 Marcador: http://localhost:3000"
echo "   ⚙️ Configuración: http://localhost:3000/panel-control"
echo "   🎮 Control remoto: http://localhost:3000/control-remoto.html"