// Servidor WebSocket para control remoto (CommonJS)

const WebSocket = require('ws');
const http = require('http');
const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

// Dirección IP del ESP32 (ajusta si es necesario)
const ESP32_IP = '192.168.0.101';

function activarBanderaESP32(flag) {
  // Realiza petición HTTP al ESP32 para activar la bandera
  const options = {
    hostname: ESP32_IP,
    port: 80,
    path: `/setFlag?${flag}=true`,
    method: 'POST'
  };
  const req = http.request(options, res => {
    // Opcional: loguear respuesta
  });
  req.on('error', error => {
    console.error('Error al activar bandera en ESP32:', error);
  });
  req.end();
}

wss.on('connection', function connection(ws) {
  clients.push(ws);
  ws.on('message', function incoming(message) {
    // Reenvía el comando a todos los clientes conectados, incluido el que lo envió
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    // Activar bandera en ESP32 según comando recibido
    if (['puntoEquipo1','puntoEquipo2','cambiarSaque','cambioCancha'].includes(message)) {
      activarBanderaESP32(message);
    }
  });
  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
  });
});

console.log('Servidor WebSocket de control remoto iniciado en puerto 8080');
