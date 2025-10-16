#!/bin/bash
# Script de instalación para Raspberry Pi OS
# Marcador TV - Sistema de puntuación para pádel/tenis

echo "🥧 Iniciando instalación en Raspberry Pi..."

# Actualizar sistema
echo "📦 Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Node.js (versión LTS)
echo "📦 Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar Git si no está instalado
echo "📦 Instalando Git..."
sudo apt-get install -y git

# Verificar instalaciones
echo "✅ Verificando instalaciones..."
node --version
npm --version
git --version

# Clonar proyecto desde GitHub
echo "� Clonando proyecto desde GitHub..."
cd /opt
sudo git clone https://github.com/pigheadtech22-coder/score-tv.git marcador-tv
sudo chown -R pi:pi marcador-tv
cd marcador-tv

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Construir aplicación para producción
echo "🔨 Construyendo aplicación..."
npm run build

# Crear servicio systemd
echo "⚙️ Configurando servicio systemd..."
sudo tee /etc/systemd/system/marcador-tv.service > /dev/null <<EOF
[Unit]
Description=Marcador TV - Sistema de puntuación
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/opt/marcador-tv
Environment=NODE_ENV=production
Environment=PLATFORM=pi
ExecStart=/usr/bin/npm run start:pi
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Habilitar servicio
sudo systemctl daemon-reload
sudo systemctl enable marcador-tv.service

# Configurar autostart del navegador (opcional)
echo "🖥️ Configurando autostart del navegador..."
mkdir -p /home/pi/.config/autostart
tee /home/pi/.config/autostart/marcador-tv-browser.desktop > /dev/null <<EOF
[Desktop Entry]
Type=Application
Name=Marcador TV Browser
Exec=chromium-browser --start-fullscreen --disable-infobars --noerrdialogs --incognito http://localhost:5173
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF

echo "✅ Instalación completada!"
echo "🚀 Para iniciar el servicio: sudo systemctl start marcador-tv"
echo "📊 Para ver logs: sudo journalctl -u marcador-tv -f"
echo "🌐 La aplicación estará disponible en: http://[IP-DE-TU-PI]:5173"