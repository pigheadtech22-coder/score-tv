// src/config/server-config.js
// Solo para uso en servidor Node.js

import { existsSync, readFileSync } from 'fs';

// Detectar si estamos en Raspberry Pi
const isRaspberryPi = () => {
  try {
    if (existsSync('/proc/device-tree/model')) {
      const model = readFileSync('/proc/device-tree/model', 'utf8');
      return model.includes('Raspberry Pi');
    }
    return false;
  } catch {
    return false;
  }
};

// Detectar plataforma desde variables de entorno o auto-detección
const getPlatform = () => {
  if (process.env.PLATFORM) {
    return process.env.PLATFORM;
  }
  return isRaspberryPi() ? 'pi' : 'pc';
};

const platform = getPlatform();

export const serverConfig = {
  platform,
  isRaspberryPi: platform === 'pi',
  isPC: platform === 'pc',
  
  // Configuración ESP32
  esp32: {
    mode: platform === 'pi' ? 'internal' : 'external',
    ip: process.env.ESP32_IP || 'http://192.168.0.101',
    internalPort: 3000
  },
  
  // Configuración de red
  network: {
    port: process.env.PORT || 3000,
    wsPort: process.env.WS_PORT || 8080
  },
  
  // Configuración de paths
  paths: {
    videos: 'public/videos',
    jugadores: 'public/jugadores',
    data: platform === 'pi' ? '/opt/marcador-tv/data' : 'public'
  }
};

// Logs del servidor
console.log(`🚀 Iniciando servidor en modo: ${platform.toUpperCase()}`);
console.log(`📡 ESP32 modo: ${serverConfig.esp32.mode}`);