#!/bin/bash

# 🎾 Marcador TV - Launcher Principal
# Auto-actualiza desde git y ejecuta la aplicación

echo "🎾 Marcador TV - Iniciando..."
echo "=================================="

# Directorio del proyecto
PROJECT_DIR="/opt/marcador-tv"
cd "$PROJECT_DIR"

# Función para mostrar notificaciones
notify() {
    echo "$1"
    if command -v zenity &> /dev/null; then
        zenity --info --text="$1" --timeout=3
    fi
}

# 1. Verificar conexión a internet
echo "🌐 Verificando conexión..."
if ping -c 1 google.com &> /dev/null; then
    echo "✅ Conexión OK - Verificando actualizaciones..."
    
    # 2. Hacer git pull para actualizaciones
    git fetch origin main
    
    # Verificar si hay cambios
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ "$LOCAL" != "$REMOTE" ]; then
        notify "🔄 Actualizando aplicación..."
        echo "📦 Descargando actualizaciones..."
        
        # Hacer pull
        if git pull origin main; then
            echo "✅ Actualización exitosa"
            
            # Instalar dependencias si hay cambios en package.json
            if git diff --name-only HEAD~1 HEAD | grep -q "package.json"; then
                echo "📦 Instalando nuevas dependencias..."
                npm install
            fi
            
            # Rebuild si hay cambios en src/
            if git diff --name-only HEAD~1 HEAD | grep -q "src/"; then
                echo "🔨 Reconstruyendo aplicación..."
                npm run build
            fi
            
            notify "✅ Aplicación actualizada correctamente"
        else
            echo "❌ Error en actualización"
            notify "⚠️ Error al actualizar. Continuando con versión actual..."
        fi
    else
        echo "✅ Aplicación ya está actualizada"
    fi
else
    echo "⚠️ Sin conexión - Usando versión local"
    notify "📱 Modo offline - Sin actualizaciones"
fi

# 3. Verificar que los servidores no estén corriendo
echo "🔍 Verificando procesos existentes..."
pkill -f "node server.cjs" 2>/dev/null
pkill -f "npm run preview" 2>/dev/null
pkill -f "vite preview" 2>/dev/null
sleep 2

# 4. Iniciar servidor Express
echo "🌐 Iniciando servidor backend..."
node server.cjs &
SERVER_PID=$!
sleep 3

# 5. Verificar que el servidor esté funcionando
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Servidor backend iniciado (PID: $SERVER_PID)"
else
    echo "❌ Error iniciando servidor backend"
    notify "❌ Error crítico: No se pudo iniciar el servidor"
    exit 1
fi

# 6. Iniciar servidor frontend
echo "⚡ Iniciando servidor frontend..."
npm run preview &
FRONTEND_PID=$!
sleep 5

# 7. Verificar que el frontend esté funcionando
if ps -p $FRONTEND_PID > /dev/null; then
    echo "✅ Servidor frontend iniciado (PID: $FRONTEND_PID)"
else
    echo "❌ Error iniciando servidor frontend"
    notify "❌ Error crítico: No se pudo iniciar el frontend"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# 8. Esperar a que los servicios estén listos
echo "⏳ Esperando servicios..."
sleep 3

# 9. Verificar que los servicios respondan
if curl -s http://localhost:3000 > /dev/null && curl -s http://localhost:5174 > /dev/null; then
    echo "✅ Servicios funcionando correctamente"
    notify "🎾 Marcador TV listo!"
else
    echo "⚠️ Servicios iniciando... (puede tomar unos segundos)"
fi

# 10. Abrir navegador
echo "🌐 Abriendo aplicación..."
DISPLAY=:0 chromium-browser \
    --start-fullscreen \
    --disable-restore-session-state \
    --disable-session-crashed-bubble \
    --disable-infobars \
    --disable-translate \
    --disable-dev-shm-usage \
    --no-sandbox \
    http://localhost:5174 &

BROWSER_PID=$!

echo ""
echo "🎯 Marcador TV iniciado exitosamente!"
echo "=================================="
echo "📊 Servidor Backend PID: $SERVER_PID"
echo "⚡ Servidor Frontend PID: $FRONTEND_PID" 
echo "🌐 Navegador PID: $BROWSER_PID"
echo ""
echo "💡 Para cerrar: Ctrl+C o cierra esta terminal"
echo ""

# Mantener script corriendo y monitorear procesos
while true; do
    sleep 10
    
    # Verificar que los procesos sigan corriendo
    if ! ps -p $SERVER_PID > /dev/null; then
        echo "❌ Servidor backend se cerró inesperadamente"
        break
    fi
    
    if ! ps -p $FRONTEND_PID > /dev/null; then
        echo "❌ Servidor frontend se cerró inesperadamente" 
        break
    fi
done

echo "🛑 Marcador TV finalizado"