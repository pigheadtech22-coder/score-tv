#!/bin/bash
# Script de diagnóstico para Raspberry Pi
# Verifica el estado del sistema Marcador TV y soluciona errores "Aw Snap"

echo "🔍 Diagnóstico del Sistema Marcador TV - Solución 'Aw Snap'"
echo "=========================================================="

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

# Información crítica del sistema para errores "Aw Snap"
echo ""
echo "📊 Información crítica del sistema:"
echo "Memoria total: $(free -h | grep Mem | awk '{print $2}')"
echo "Memoria disponible: $(free -h | grep Mem | awk '{print $7}')"
echo "Memoria libre: $(free -h | grep Mem | awk '{print $4}')"
echo "Swap total: $(free -h | grep Swap | awk '{print $2}')"
echo "Swap usado: $(free -h | grep Swap | awk '{print $3}')"
echo "Temperatura: $(vcgencmd measure_temp 2>/dev/null || echo 'No disponible')"

# Verificar memoria GPU (crítico para Pi)
echo ""
echo "🎮 División de memoria ARM/GPU:"
vcgencmd get_mem arm 2>/dev/null || echo "Comando vcgencmd no disponible"
vcgencmd get_mem gpu 2>/dev/null || echo "Comando vcgencmd no disponible"

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
    for dep in "react" "vite" "express" "qrcode" "html2canvas"; do
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
echo "� SOLUCIONES PARA ERROR 'AW SNAP' EN CHROMIUM:"
echo "=============================================="
echo ""
echo "1. 🧹 Liberar memoria inmediatamente:"
echo "   sudo sync && sudo sysctl vm.drop_caches=3"
echo ""
echo "2. 🔄 Reiniciar Chromium con configuración optimizada:"
echo "   pkill chromium"
echo "   chromium-browser --no-sandbox --disable-web-security \\"
echo "                   --disable-features=VizDisplayCompositor \\"
echo "                   --max_old_space_size=512 \\"
echo "                   --disable-dev-shm-usage \\"
echo "                   --disable-gpu \\"
echo "                   --disable-software-rasterizer \\"
echo "                   http://localhost:5173"
echo ""
echo "3. 💾 Aumentar swap si tienes menos de 1GB:"
echo "   sudo dphys-swapfile swapoff"
echo "   sudo sed -i 's/CONF_SWAPSIZE=.*/CONF_SWAPSIZE=1024/' /etc/dphys-swapfile"
echo "   sudo dphys-swapfile setup"
echo "   sudo dphys-swapfile swapon"
echo ""
echo "4. ⚡ Configurar límites de memoria para el servicio:"
echo "   sudo systemctl edit marcador-tv"
echo "   # Agregar:"
echo "   # [Service]"
echo "   # Environment=NODE_OPTIONS='--max-old-space-size=512'"
echo ""
echo "5. 🔧 Verificar configuración GPU (en /boot/config.txt):"
echo "   gpu_mem=64  # Para Pi con 1GB RAM"
echo "   gpu_mem=128 # Para Pi con 2GB+ RAM"
echo ""
echo "💡 Soluciones rápidas adicionales:"
echo "   - Cerrar aplicaciones innecesarias: sudo killall -9 chromium-browser"
echo "   - Reiniciar servicio: sudo systemctl restart marcador-tv"
echo "   - Ver logs en tiempo real: sudo journalctl -u marcador-tv -f"
echo "   - Reiniciar Pi si persiste: sudo reboot"