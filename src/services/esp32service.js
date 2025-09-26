// src/services/esp32Service.js
// Dirección IP del ESP32
const ESP32_IP = 'http://192.168.1.233'; // Cambia por la IP real

export async function getMarcador() {
  const res = await fetch("http://esp32.local/marcador"); // o IP de tu ESP32
  return res.json();
}

// Polling para leer banderas del ESP32
export async function getFlags() {
  const res = await fetch(`${ESP32_IP}/flags`);
  return await res.json();
}

// Resetear banderas en el ESP32
export async function resetFlags() {
  await fetch(`${ESP32_IP}/resetFlags`, { method: 'POST' });
}

// Si quieres activar banderas desde React (no necesario si solo usas la web del ESP32)
export async function setFlag(flagName) {
  await fetch(`${ESP32_IP}/setFlag?${flagName}=true`, { method: 'POST' });
}