// src/services/esp32Service.js
import { createHardwareService } from './HardwareService.js';

// Crear el servicio de hardware apropiado
const hardwareService = createHardwareService();

export async function getMarcador() {
  // Esta función puede mantenerse para compatibilidad, pero probablemente no se use
  const res = await fetch("http://192.168.0.101/marcador");
  return res.json();
}

// Polling para leer banderas del hardware
export async function getFlags() {
  return await hardwareService.getFlags();
}

// Resetear banderas en el hardware
export async function resetFlags() {
  console.log('[FRONT] Ejecutando resetFlags');
  await hardwareService.resetFlags();
}

// Exponer el servicio para uso directo si es necesario
export { hardwareService };

// Función para activar flags (usará el servicio interno en Pi)
export async function setFlag(flagName) {
  if (hardwareService.activateFlag) {
    // Pi interna - activar flag directamente
    hardwareService.activateFlag(flagName);
  } else {
    // ESP32 externo - enviar HTTP request (para compatibilidad futura)
    console.warn('setFlag no implementado para ESP32 externo');
  }
}