#!/bin/bash
# Script de diagnóstico para Raspberry Pi
# Verifica el estado del sistema Marcador TV

echo "🔍 Diagnóstico del Sistema Marcador TV"
echo "======================================"

# Verificar directorio del proyecto
echo ""
echo "📁 Verificando directorio del proyecto..."
if [ -d "/opt/marcador-tv" ]; then
    echo "✅ Directorio /opt/marcador-tv existe"
    cd /opt/marcador-tv
else
    echo "❌ Directorio /opt/marcador-tv NO existe"
    echo "💡 Ejecuta install-pi.sh para instalar el sistema"
    exit 1
fi

# Verificar Node.js y npm
echo ""
echo "🚀 Verificando Node.js y npm..."
echo "Node.js: $(node --version 2>/dev/null || echo 'NO INSTALADO')"
echo "npm: $(npm --version 2>/dev/null || echo 'NO INSTALADO')"

# Verificar Git
echo ""
echo "📚 Verificando Git..."
echo "Git: $(git --version 2>/dev/null || echo 'NO INSTALADO')"

# Verificar estado del repositorio
echo ""
echo "📥 Estado del repositorio..."
echo "Rama actual: $(git branch --show-current 2>/dev/null || echo 'ERROR')"
echo "Último commit: $(git log -1 --oneline 2>/dev/null || echo 'ERROR')"

# Verificar dependencias críticas
echo ""
echo "📦 Verificando dependencias críticas..."
if [ -f "package.json" ]; then
    echo "✅ package.json existe"
    
    # Verificar qrcode
    if npm list qrcode > /dev/null 2>&1; then
        echo "✅ qrcode: $(npm list qrcode --depth=0 2>/dev/null | grep qrcode || echo 'INSTALADO')"
    else
        echo "❌ qrcode: NO INSTALADO"
    fi
    
    # Verificar @types/qrcode
    if npm list @types/qrcode > /dev/null 2>&1; then
        echo "✅ @types/qrcode: $(npm list @types/qrcode --depth=0 2>/dev/null | grep @types/qrcode || echo 'INSTALADO')"
    else
        echo "❌ @types/qrcode: NO INSTALADO"
    fi
    
    # Verificar otras dependencias críticas
    for dep in "react" "vite" "express"; do
        if npm list $dep > /dev/null 2>&1; then
            echo "✅ $dep: INSTALADO"
        else
            echo "❌ $dep: NO INSTALADO"
        fi
    done
else
    echo "❌ package.json NO existe"
fi

# Verificar archivos críticos
echo ""
echo "📄 Verificando archivos críticos..."
critical_files=(
    "src/components/ResultadoFinal.jsx"
    "src/components/ResultadoFinal.css"
    "src/App.jsx"
    "package.json"
    "vite.config.js"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file NO existe"
    fi
done

# Verificar servicio systemd
echo ""
echo "⚙️ Verificando servicio systemd..."
if sudo systemctl list-unit-files | grep -q marcador-tv; then
    echo "✅ Servicio marcador-tv configurado"
    echo "Estado: $(sudo systemctl is-active marcador-tv 2>/dev/null || echo 'INACTIVO')"
    echo "Habilitado: $(sudo systemctl is-enabled marcador-tv 2>/dev/null || echo 'NO')"
else
    echo "❌ Servicio marcador-tv NO configurado"
fi

# Verificar puertos
echo ""
echo "🌐 Verificando puertos..."
if command -v netstat > /dev/null; then
    if netstat -ln | grep -q ":5173"; then
        echo "✅ Puerto 5173 en uso (aplicación corriendo)"
    else
        echo "❌ Puerto 5173 libre (aplicación NO corriendo)"
    fi
else
    echo "ℹ️ netstat no disponible, no se puede verificar puertos"
fi

# Verificar logs recientes
echo ""
echo "📋 Últimos logs del servicio..."
if sudo systemctl list-unit-files | grep -q marcador-tv; then
    echo "--- Últimas 10 líneas de logs ---"
    sudo journalctl -u marcador-tv --no-pager -n 10 2>/dev/null || echo "No hay logs disponibles"
fi

# Información de red
echo ""
echo "🌐 Información de red..."
echo "IP local: $(hostname -I | cut -d' ' -f1)"
echo "Hostname: $(hostname)"

echo ""
echo "🎯 Diagnóstico completado!"
echo ""
echo "💡 Soluciones comunes:"
echo "   - Si faltan dependencias: bash update-pi.sh"
echo "   - Si el servicio no está activo: sudo systemctl restart marcador-tv"
echo "   - Ver logs detallados: sudo journalctl -u marcador-tv -f"