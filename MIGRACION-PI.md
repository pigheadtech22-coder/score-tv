# 🥧 Guía de Migración a Raspberry Pi

## Preparación previa (en PC)

1. **Verificar funcionamiento completo**
   - ✅ Marcador funciona correctamente
   - ✅ Videos se reproducen en ciclo
   - ✅ Panel de control responde
   - ✅ Sistema detecta plataforma automáticamente

## Hardware necesario

- **Raspberry Pi 4** (4GB RAM recomendado)
- **MicroSD** (32GB mínimo, Clase 10)
- **Pantalla/TV** con HDMI
- **Teclado/Mouse** (para configuración inicial)
- **TP-Link EAP110** (Access Point profesional) - OPCIONAL

## Instalación en Raspberry Pi

### Método RECOMENDADO: Git Clone

```bash
# 1. Flashear Raspberry Pi OS en SD
# 2. Conectar Pi a internet (ethernet o WiFi temporal)
# 3. Descargar script de instalación
wget https://raw.githubusercontent.com/pigheadtech22-coder/score-tv/main/install-pi.sh

# 4. Ejecutar instalación (descarga automáticamente desde GitHub)
chmod +x install-pi.sh
./install-pi.sh

# 5A. Configurar red (crea su propio WiFi)
npm run setup:pi-network

# 5B. O conectar a TP-Link EAP110 (recomendado profesional)
```

### Método alternativo: Copia manual
Solo si no tienes acceso a internet en la Pi:
```bash
# En PC: copiar toda la carpeta a USB/SD
# En Pi: copiar desde USB a /opt/marcador-tv
```

## Configuración de red

### Opción A: Pi como Access Point
- **SSID**: MarcadorTV-AP
- **Password**: marcadortv2024
- **IP Pi**: 192.168.4.1
- **Acceso**: http://192.168.4.1:5173

### Opción B: Con TP-Link EAP110 (RECOMENDADO)
- **SSID**: MarcadorTV (configurable en EAP110)
- **IP Pi**: 192.168.0.100 (ejemplo)
- **Acceso**: http://192.168.0.100:5173
- **Ventajas**: 
  - Mayor alcance y estabilidad
  - Mejor gestión de dispositivos
  - Configuración web del EAP110
  - PoE (Power over Ethernet)

## Control híbrido ESP32/Web

### ESP32 como botonera inalámbrica
- Se conecta al WiFi del sistema
- IP fija: 192.168.0.101 (configurable)
- Endpoints: /punto1, /punto2, /cambioSaque, etc.

### Panel web de control
- Accesible desde cualquier dispositivo en la red
- http://[IP-PI]:3000/control-remoto.html
- Funciona en tablets, smartphones, laptops

## Comandos útiles en Pi

```bash
# Iniciar servicio
sudo systemctl start marcador-tv

# Ver logs
sudo journalctl -u marcador-tv -f

# Reiniciar servicio
sudo systemctl restart marcador-tv

# Estado del servicio
sudo systemctl status marcador-tv

# Modo desarrollo (manual)
cd /opt/marcador-tv
npm run start:pi

# Construir para producción
npm run build:pi
```

## Troubleshooting

### Si no arranca el servicio
```bash
# Verificar logs
sudo journalctl -u marcador-tv -f

# Verificar Node.js
node --version
npm --version

# Reinstalar dependencias
cd /opt/marcador-tv
npm install
```

### Si no se conecta al WiFi
```bash
# Verificar estado de red
sudo systemctl status hostapd
sudo systemctl status dnsmasq

# Reiniciar servicios de red
sudo systemctl restart hostapd
sudo systemctl restart dnsmasq
```

### Si la pantalla no muestra nada
```bash
# Verificar que el navegador autostart esté configurado
ls /home/pi/.config/autostart/

# Iniciar manualmente
chromium-browser --start-fullscreen http://localhost:5173
```

## Migración de datos

Los siguientes archivos se mantienen:
- `public/jugadores/` - Fotos de jugadores
- `public/videos/` - Videos de publicidad
- `public/videos.json` - Configuración de videos
- `public/canchas-padel.json` - Configuración de canchas

## Backup y restauración

```bash
# Crear backup
sudo tar -czf marcador-tv-backup.tar.gz /opt/marcador-tv

# Restaurar backup
sudo tar -xzf marcador-tv-backup.tar.gz -C /
```