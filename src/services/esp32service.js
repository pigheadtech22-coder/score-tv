// src/services/esp32Service.js
// Dirección IP del ESP32
const ESP32_IP = 'http://192.168.0.101'; // Cambia por la IP real

export async function getMarcador() {
  const res = await fetch("http://192.168.0.101/marcador"); // o IP de tu ESP32
  return res.json();
}

// Polling para leer banderas del ESP32
export async function getFlags() {
  try {
    const response = await fetch(`${ESP32_IP}/flags`, {
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

// Resetear banderas en el ESP32
export async function resetFlags() {
  console.log('[FRONT] Ejecutando fetch a /resetFlags');
  await fetch(`${ESP32_IP}/resetFlags`, { method: 'POST' });
}

// Si quieres activar banderas desde React (no necesario si solo usas la web del ESP32)
export async function setFlag(flagName) {
  await fetch(`${ESP32_IP}/setFlag?${flagName}=true`, { method: 'POST' });
}