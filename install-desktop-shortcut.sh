#!/bin/bash

# Script para instalar el acceso directo en el escritorio

echo "🖥️ Instalando acceso directo Marcador TV..."
echo "============================================"

PROJECT_DIR="/opt/marcador-tv"
DESKTOP_DIR="/home/pighead/Desktop"

# Verificar que existe el directorio del proyecto
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Error: Directorio $PROJECT_DIR no existe"
    echo "💡 Primero clona el proyecto en /opt/marcador-tv"
    exit 1
fi

# Crear directorio Desktop si no existe
mkdir -p "$DESKTOP_DIR"

# Hacer executable el launcher
chmod +x "$PROJECT_DIR/marcador-tv-launcher.sh"

# Copiar archivo .desktop al escritorio
cp "$PROJECT_DIR/Marcador-TV.desktop" "$DESKTOP_DIR/"

# Hacer executable el archivo .desktop
chmod +x "$DESKTOP_DIR/Marcador-TV.desktop"

# También copiar a aplicaciones del sistema (opcional)
mkdir -p "/home/pighead/.local/share/applications"
cp "$PROJECT_DIR/Marcador-TV.desktop" "/home/pighead/.local/share/applications/"

# Corregir permisos
chown pighead:pighead "$DESKTOP_DIR/Marcador-TV.desktop"
chown pighead:pighead "/home/pighead/.local/share/applications/Marcador-TV.desktop"

echo "✅ Acceso directo instalado correctamente!"
echo ""
echo "🎯 Ya puedes usar el acceso directo desde:"
echo "   📍 Escritorio: Doble clic en 'Marcador TV'"
echo "   📍 Menú de aplicaciones: Buscar 'Marcador TV'"
echo ""
echo "🔄 El acceso directo se auto-actualiza desde git cada vez que lo ejecutas"
echo ""