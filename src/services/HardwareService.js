// src/services/HardwareService.js
// Simplificado para browser

// Servicio para ESP32 (predeterminado en browser)
class ESP32Service {
  constructor() {
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
    try {
      const response = await fetch(`${this.esp32IP}/flags`, {
        cache: "no-store",
        mode: "cors",
        credentials: "same-origin"
      });
      if (!response.ok) throw new Error("Error en la respuesta del ESP32");
      return await response.json();
    } catch (error) {
      console.warn("No se pudo conectar al ESP32, pero seguimos en LAN", error);
      return null;
    }
  }

  async resetFlags() {
    try {
      await fetch(`${this.esp32IP}/resetFlags`, { method: 'POST' });
    } catch (error) {
      console.warn("Error al resetear flags del ESP32:", error);
    }
  }
}

// Factory simple para browser
export const createHardwareService = () => {
  return new ESP32Service();
};

export { ESP32Service };