// setup-pi-network.js
// Script para configurar la red en Raspberry Pi

const fs = require('fs');
const { exec } = require('child_process');

console.log('🌐 Configurando red para Raspberry Pi...');

// Configuración de hostapd (Access Point)
const hostapdConfig = `
# Configuración del Access Point
interface=wlan0
driver=nl80211
ssid=MarcadorTV-AP
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=marcadortv2024
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
`;

// Configuración de dnsmasq (DHCP)
const dnsmasqConfig = `
# Configuración DHCP para Access Point
interface=wlan0
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
domain=marcadortv.local
address=/marcadortv.local/192.168.4.1
`;

// Configuración de dhcpcd
const dhcpcdConfig = `
# Configuración de interfaz estática para AP
interface wlan0
static ip_address=192.168.4.1/24
nohook wpa_supplicant
`;

async function setupNetwork() {
  try {
    console.log('📝 Creando archivos de configuración...');
    
    // Crear archivos de configuración
    fs.writeFileSync('/tmp/hostapd.conf', hostapdConfig);
    fs.writeFileSync('/tmp/dnsmasq.conf', dnsmasqConfig);
    fs.writeFileSync('/tmp/dhcpcd.conf.append', dhcpcdConfig);
    
    console.log('🔧 Aplicando configuración...');
    console.log('⚠️  IMPORTANTE: Ejecutar como sudo para aplicar cambios');
    
    // Instrucciones para el usuario
    console.log(`
📋 INSTRUCCIONES PARA CONFIGURAR LA RED:

1. Copiar configuraciones:
   sudo cp /tmp/hostapd.conf /etc/hostapd/hostapd.conf
   sudo cp /tmp/dnsmasq.conf /etc/dnsmasq.conf
   sudo cat /tmp/dhcpcd.conf.append >> /etc/dhcpcd.conf

2. Habilitar servicios:
   sudo systemctl enable hostapd
   sudo systemctl enable dnsmasq

3. Configurar hostapd:
   sudo sed -i 's/#DAEMON_CONF=""/DAEMON_CONF="\/etc\/hostapd\/hostapd.conf"/' /etc/default/hostapd

4. Reiniciar servicios:
   sudo systemctl restart dhcpcd
   sudo systemctl restart hostapd
   sudo systemctl restart dnsmasq

5. Reiniciar Pi:
   sudo reboot

CONFIGURACIÓN RESULTANTE:
- SSID: MarcadorTV-AP
- Password: marcadortv2024
- IP Pi: 192.168.4.1
- Rango DHCP: 192.168.4.2-20
- Acceso web: http://192.168.4.1:5173
`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Solo ejecutar si es Raspberry Pi
if (fs.existsSync('/proc/device-tree/model')) {
  setupNetwork();
} else {
  console.log('⚠️  Este script debe ejecutarse en Raspberry Pi');
}