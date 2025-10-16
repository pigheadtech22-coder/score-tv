// src/services/HardwareService.js
// Servicio de hardware simplificado para browser

// Servicio para ESP32/Servidor local (detecta automáticamente)
class ESP32Service {
  constructor() {
    // Primero intentar servidor local (para Pi), luego ESP32 externo
    this.localServerURL = `http://${window.location.hostname}:3000`; // Puerto original
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
    // Detectar plataforma basándose en la URL del navegador
    // Solo considerar Pi si estamos accediendo desde la IP específica de Pi
    const isPi = window.location.hostname.includes('192.168.0.237');
    
    if (isPi) {
      // En Pi: primero intentar servidor local (Pi interna)
      try {
        const response = await fetch(`${this.localServerURL}/api/flags`, {
          cache: "no-store",
          mode: "cors"
        });
        if (response.ok) {
          const flags = await response.json();
          console.log('📡 [PI] Flags obtenidas del servidor local:', flags);
          return flags;
        }
      } catch {
        console.log('⚠️ [PI] Servidor local no disponible, intentando ESP32 externo...');
      }
    } else {
      // En PC (localhost o cualquier otra IP): SOLO intentar ESP32 externo
      console.log('🖥️ [PC] Modo PC detectado, intentando ESP32 externo...');
      try {
        const response = await fetch(`${this.esp32IP}/flags`, {
          cache: "no-store",
          mode: "cors",
          credentials: "same-origin"
        });
        if (response.ok) {
          const flags = await response.json();
          console.log('📡 [PC] Flags obtenidas del ESP32 externo:', flags);
          return flags;
        }
      } catch {
        console.log('⚠️ [PC] ESP32 externo no disponible, esperando reconexión...');
        return null; // En PC, no hacer fallback, solo esperar
      }
    }

    // Fallback: solo para Pi (intentar ESP32 externo si servidor local falla)
    if (isPi) {
      try {
        const response = await fetch(`${this.esp32IP}/flags`, {
          cache: "no-store",
          mode: "cors"
        });
        if (response.ok) {
          const flags = await response.json();
          console.log('📡 [PI-FALLBACK] Flags obtenidas del ESP32 externo:', flags);
          return flags;
        }
      } catch {
        console.warn("❌ [PI] No se pudo conectar a ningún servicio de flags");
      }
    }

    return null;
  }

  async resetFlags() {
    console.log('🔄 HardwareService: Iniciando reset de flags...');
    
    // Detectar plataforma basándose en la URL del navegador
    // Solo considerar Pi si estamos accediendo desde la IP específica de Pi
    const isPi = window.location.hostname.includes('192.168.0.237');
    
    if (isPi) {
      // En Pi: resetear en servidor local
      try {
        console.log('🔄 [PI] Intentando reset en servidor local:', `${this.localServerURL}/resetFlags`);
        const response = await fetch(`${this.localServerURL}/resetFlags`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          console.log('✅ [PI] Flags reseteadas en servidor local');
          return;
        }
      } catch (error) {
        console.log('⚠️ [PI] Error reseteando en servidor local:', error.message);
      }
    } else {
      // En PC (localhost o cualquier otra IP): SOLO resetear en ESP32 externo
      try {
        console.log('🔄 [PC] Modo PC detectado, intentando reset en ESP32 externo...');
        await fetch(`${this.esp32IP}/resetFlags`, { method: 'POST' });
        console.log('✅ [PC] Flags reseteadas en ESP32 externo');
        return;
      } catch {
        console.log('⚠️ [PC] ESP32 externo no disponible, esperando reconexión...');
        return; // En PC, no hacer fallback, solo esperar
      }
    }

    // Fallback: solo para Pi (intentar ESP32 externo si servidor local falla)
    if (isPi) {
      try {
        console.log('🔄 [PI-FALLBACK] Intentando reset en ESP32 externo...');
        await fetch(`${this.esp32IP}/resetFlags`, { method: 'POST' });
        console.log('✅ [PI-FALLBACK] Flags reseteadas en ESP32 externo');
      } catch {
        console.warn("❌ [PI] No se pudo resetear flags en ningún servicio");
      }
    }
  }
}

// Factory simple para browser
export const createHardwareService = () => {
  return new ESP32Service();
};

export { ESP32Service };