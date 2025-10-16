// Script de prueba para la API
const express = require('express');
const app = express();

app.use(express.json());

// Flags simples para prueba
let flags = {
  punto1: false,
  punto2: false,
  restarPunto1: false,
  restarPunto2: false,
  cambioSaque: false,
  cambioCancha: false
};

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Endpoints
app.get('/api/flags', (req, res) => {
  console.log('📡 Enviando flags:', flags);
  res.json(flags);
});

app.post('/api/punto1', (req, res) => {
  flags.punto1 = true;
  console.log('🏓 Punto 1 activado');
  res.json({ success: true });
});

app.post('/api/punto2', (req, res) => {
  flags.punto2 = true;
  console.log('🏓 Punto 2 activado');
  res.json({ success: true });
});

app.post('/resetFlags', (req, res) => {
  Object.keys(flags).forEach(key => {
    flags[key] = false;
  });
  console.log('🔄 Flags reseteadas');
  res.send('OK');
});

// Servir archivos estáticos
app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de prueba en puerto ${PORT}`);
  console.log(`Panel: http://localhost:${PORT}/control-remoto.html`);
  console.log(`Flags: http://localhost:${PORT}/api/flags`);
});