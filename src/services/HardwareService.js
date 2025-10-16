// src/services/HardwareService.js
// Servicio de hardware simplificado para browser

// Servicio para ESP32/Servidor local (detecta automáticamente)
class ESP32Service {
  constructor() {
    // Primero intentar servidor local (para Pi), luego ESP32 externo
    this.localServerURL = `http://${window.location.hostname}:3000`;
    this.esp32IP = 'http://192.168.0.101';
    this.flags = {
      punto1: false,
      punto2: false,
      restarPunto1: false,
      restarPunto2: false,
      cambioSaque: false,
      cambioCancha: false
    };
  }

  async getFlags() {
    // Primero intentar servidor local (Pi interna)
    try {
      const response = await fetch(`${this.localServerURL}/api/flags`, {
        cache: "no-store",
        mode: "cors"
      });
      if (response.ok) {
        const flags = await response.json();
        console.log('📡 Flags obtenidas del servidor local:', flags);
        return flags;
      }
    } catch {
      console.log('⚠️ Servidor local no disponible, intentando ESP32 externo...');
    }

    // Si falla, intentar ESP32 externo
    try {
      const response = await fetch(`${this.esp32IP}/flags`, {
        cache: "no-store",
        mode: "cors",
        credentials: "same-origin"
      });
      if (response.ok) {
        const flags = await response.json();
        console.log('📡 Flags obtenidas del ESP32 externo:', flags);
        return flags;
      }
    } catch (error) {
      console.warn("No se pudo conectar ni al servidor local ni al ESP32 externo");
    }

    return null;
  }

  async resetFlags() {
    // Primero intentar servidor local
    try {
      const response = await fetch(`${this.localServerURL}/api/clear-flags`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        console.log('🧹 Flags reseteadas en servidor local');
        return;
      }
    } catch {
      console.log('⚠️ Error reseteando en servidor local, intentando ESP32...');
    }

    // Si falla, intentar ESP32 externo
    try {
      await fetch(`${this.esp32IP}/resetFlags`, { method: 'POST' });
      console.log('🧹 Flags reseteadas en ESP32 externo');
    } catch (error) {
      console.warn("Error al resetear flags en ESP32 externo:", error);
    }
  }
}

// Factory simple para browser
export const createHardwareService = () => {
  return new ESP32Service();
};

export { ESP32Service };