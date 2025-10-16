const express = require('express');
const app = express();

console.log('🚀 Iniciando servidor de debug...');

app.use(express.json());
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

let flags = {
  punto1: false,
  punto2: false,
  restarPunto1: false,
  restarPunto2: false,
  cambioSaque: false,
  cambioCancha: false
};

app.get('/api/flags', (req, res) => {
  console.log('📡 GET /api/flags ->', flags);
  res.json(flags);
});

app.post('/api/punto1', (req, res) => {
  flags.punto1 = true;
  console.log('🏓 POST /api/punto1 - flag activada');
  res.json({ success: true });
});

app.post('/api/punto2', (req, res) => {
  flags.punto2 = true;
  console.log('🏓 POST /api/punto2 - flag activada');
  res.json({ success: true });
});

app.post('/resetFlags', (req, res) => {
  Object.keys(flags).forEach(key => {
    flags[key] = false;
  });
  console.log('🔄 POST /resetFlags - flags reseteadas');
  res.send('OK');
});

app.use(express.static('public'));

const PORT = 3001; // Puerto diferente para no conflicto
app.listen(PORT, () => {
  console.log(`✅ Servidor debug funcionando en puerto ${PORT}`);
  console.log(`🔗 Flags: http://localhost:${PORT}/api/flags`);
  console.log(`🎮 Panel: http://localhost:${PORT}/control-remoto.html`);
  
  // Mantener el servidor vivo
  setInterval(() => {
    console.log(`⏰ Servidor vivo en puerto ${PORT}...`);
  }, 30000); // cada 30 segundos
});