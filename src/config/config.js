// src/config/config.js

// Configuración simple para browser (client-side)
const browserConfig = {
  platform: 'browser',
  isRaspberryPi: false,
  isPC: false,
  isBrowser: true,
  
  // Configuración ESP32
  esp32: {
    mode: 'external',
    ip: 'http://192.168.0.101',
    internalPort: 3000
  },
  
  // Configuración de red
  network: {
    port: 3000,
    wsPort: 8080
  },
  
  // Configuración de paths
  paths: {
    videos: 'public/videos',
    jugadores: 'public/jugadores',
    data: 'public'
  }
};

// Exportar configuración del browser
export const config = browserConfig;