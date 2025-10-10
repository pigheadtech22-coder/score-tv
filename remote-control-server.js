// Servidor WebSocket para control remoto
const fs = require('fs');
const path = require('path');

// Sincronizar videos.json con los archivos reales al iniciar el servidor
const videosDir = path.join(__dirname, 'public', 'videos');
const jsonPath = path.join(__dirname, 'public', 'videos.json');
try {
  const files = fs.readdirSync(videosDir).filter(f => f.endsWith('.mp4'));
  fs.writeFileSync(jsonPath, JSON.stringify(files, null, 2), 'utf8');
  console.log('videos.json sincronizado con los archivos reales:', files);
} catch (err) {
  console.error('Error sincronizando videos.json:', err);
}
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

wss.on('connection', function connection(ws) {
  clients.push(ws);
  ws.on('message', function incoming(message) {
    // Reenvía el comando a todos los clientes conectados
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
  });
});

console.log('Servidor WebSocket de control remoto iniciado en puerto 8080');
