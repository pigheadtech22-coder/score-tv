
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const upload = multer({ dest: path.join(__dirname, 'public/videos/tmp') });

// Detectar si estamos en Raspberry Pi
const isRaspberryPi = () => {
  try {
    return fs.existsSync('/proc/device-tree/model') && 
           fs.readFileSync('/proc/device-tree/model', 'utf8').includes('Raspberry Pi');
  } catch {
    return false;
  }
};

const platform = isRaspberryPi() ? 'pi' : 'pc';
console.log(`🚀 Servidor iniciando en modo: ${platform.toUpperCase()}`);

// Sistema de flags para Pi (solo en modo Pi)
let internalFlags = {
  punto1: false,
  punto2: false,
  restarPunto1: false,
  restarPunto2: false,
  cambioSaque: false,
  cambioCancha: false
};

// Middleware para parsear JSON
app.use(express.json());

// ===============================
// ENDPOINTS PARA ESP32 HARDWARE
// ===============================

// Endpoint para que ESP32s lean las flags (compatible con ESP32 original)
app.get('/flags', (req, res) => {
  if (platform === 'pi') {
    res.json(internalFlags);
  } else {
    // En PC, devolver flags vacías (no hay ESP32 interno)
    res.json({
      punto1: false,
      punto2: false,
      restarPunto1: false,
      restarPunto2: false,
      cambioSaque: false,
      cambioCancha: false
    });
  }
});

// Endpoint para que ESP32s reseteén las flags
app.post('/resetFlags', (req, res) => {
  if (platform === 'pi') {
    Object.keys(internalFlags).forEach(key => {
      internalFlags[key] = false;
    });
    console.log('🔄 Flags internas reseteadas');
  }
  res.send('OK');
});

// ====== RUTAS API PARA CONTROL REMOTO WEB Y ESP32 ======

// Punto para jugador 1 (compatible con ESP32 externo y panel web)
app.post('/api/punto1', (req, res) => {
  if (platform === 'pi') {
    internalFlags.punto1 = true;
    console.log('🏓 API: Punto para jugador 1');
  }
  res.json({ success: true, action: 'punto1', platform });
});

// Punto para jugador 2 (compatible con ESP32 externo y panel web)
app.post('/api/punto2', (req, res) => {
  if (platform === 'pi') {
    internalFlags.punto2 = true;
    console.log('🏓 API: Punto para jugador 2');
  }
  res.json({ success: true, action: 'punto2', platform });
});

// Restar punto jugador 1
app.post('/api/restarPunto1', (req, res) => {
  if (platform === 'pi') {
    internalFlags.restarPunto1 = true;
    console.log('🏓 API: Restar punto jugador 1');
  }
  res.json({ success: true, action: 'restarPunto1', platform });
});

// Alias para panel web
app.post('/api/restar1', (req, res) => {
  if (platform === 'pi') {
    internalFlags.restarPunto1 = true;
    console.log('🏓 API: Restar punto jugador 1');
  }
  res.json({ success: true, action: 'restar1', platform });
});

// Restar punto jugador 2
app.post('/api/restarPunto2', (req, res) => {
  if (platform === 'pi') {
    internalFlags.restarPunto2 = true;
    console.log('🏓 API: Restar punto jugador 2');
  }
  res.json({ success: true, action: 'restarPunto2', platform });
});

// Alias para panel web
app.post('/api/restar2', (req, res) => {
  if (platform === 'pi') {
    internalFlags.restarPunto2 = true;
    console.log('🏓 API: Restar punto jugador 2');
  }
  res.json({ success: true, action: 'restar2', platform });
});

// Cambio de saque
app.post('/api/cambioSaque', (req, res) => {
  if (platform === 'pi') {
    internalFlags.cambioSaque = true;
    console.log('🏓 API: Cambio de saque');
  }
  res.json({ success: true, action: 'cambioSaque', platform });
});

// Cambio de cancha
app.post('/api/cambioCancha', (req, res) => {
  if (platform === 'pi') {
    internalFlags.cambioCancha = true;
    console.log('🏓 API: Cambio de cancha');
  }
  res.json({ success: true, action: 'cambioCancha', platform });
});

// ===============================
// ENDPOINTS PARA JUGADORES Y VIDEOS
// ===============================

// Endpoint para obtener la lista de jugadores
app.get('/api/jugadores', (req, res) => {
  const jsonPath = path.join(__dirname, 'src/data/jugadores.json');
  fs.readFile(jsonPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer jugadores.json');
    try {
      const jugadores = JSON.parse(data);
      res.json(jugadores);
    } catch {
      res.status(500).send('Error al parsear jugadores.json');
    }
  });
});
// Endpoint para actualizar la lista de jugadores
app.post('/api/update-jugadores', express.json(), (req, res) => {
  const { jugadores } = req.body;
  if (!Array.isArray(jugadores)) return res.status(400).send('Lista inválida');
  const jsonPath = path.join(__dirname, 'src/data/jugadores.json');
  fs.writeFile(jsonPath, JSON.stringify(jugadores, null, 2), (err) => {
    if (err) return res.status(500).send('No se pudo guardar jugadores.json');
    res.send('OK');
  });
});

// Endpoint para actualizar la lista y el orden de videos
app.post('/api/update-videos', express.json(), (req, res) => {
  const { videos } = req.body;
  if (!Array.isArray(videos)) return res.status(400).send('Lista inválida');
  const jsonPath = path.join(__dirname, 'public/videos.json');
  fs.writeFile(jsonPath, JSON.stringify(videos, null, 2), (err) => {
    if (err) return res.status(500).send('No se pudo guardar videos.json');
    // Sincronizar videos.json con los archivos reales
    const videosDir = path.join(__dirname, 'public/videos');
    try {
      const files = fs.readdirSync(videosDir).filter(f => f.endsWith('.mp4'));
      fs.writeFileSync(jsonPath, JSON.stringify(files, null, 2), 'utf8');
      console.log('videos.json sincronizado tras update:', files);
    } catch (err) {
      console.error('Error sincronizando videos.json:', err);
    }
    res.send('OK');
  });
});

app.post('/api/upload-video', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).send('No se recibió archivo');
  // Procesar el video con FFmpeg
  const ext = path.extname(req.file.originalname).toLowerCase();
  const baseName = path.basename(req.file.originalname, ext);
  const tmpPath = req.file.path;
  const outputPath = path.join(__dirname, 'public/videos', baseName + '.mp4');
  // Comando FFmpeg: convertir a MP4, 1280x720, bitrate 1500k
  const ffmpegCmd = `ffmpeg -y -i "${tmpPath}" -vf scale=1280:720 -b:v 1500k -c:v libx264 -c:a aac "${outputPath}"`;
  exec(ffmpegCmd, (error, stdout, stderr) => {
      // Eliminar archivo temporal
      fs.unlinkSync(tmpPath);
      if (error) {
        console.error('Error al procesar video con FFmpeg:', error);
        return res.status(500).send('Error al procesar el video');
      }
      // Sincronizar videos.json con los archivos reales
      const videosDir = path.join(__dirname, 'public/videos');
      const jsonPath = path.join(__dirname, 'public/videos.json');
      try {
        const files = fs.readdirSync(videosDir).filter(f => f.endsWith('.mp4'));
        fs.writeFileSync(jsonPath, JSON.stringify(files, null, 2), 'utf8');
        console.log('videos.json sincronizado tras upload:', files);
      } catch (err) {
        console.error('Error sincronizando videos.json:', err);
      }
      res.send('OK');
    });
  });
    
// Endpoint para subir foto de jugador y quitar fondo
app.post('/api/upload-jugador-foto', upload.single('foto'), (req, res) => {
  if (!req.file) return res.status(400).send('No se recibió archivo');
  const ext = path.extname(req.file.originalname).toLowerCase();
  const baseName = path.basename(req.file.originalname, ext);
  const tmpPath = req.file.path;
  const outputPath = path.join(__dirname, 'public/jugadores', baseName + '.png');
  // Procesar imagen con rembg usando python -m rembg.cli
  exec(`python -m rembg.cli i "${tmpPath}" "${outputPath}"`, (error, stdout, stderr) => {
    fs.unlinkSync(tmpPath);
    if (error) {
      console.error('Error al quitar fondo:', error);
      return res.status(500).send('Error al procesar la imagen');
    }
    res.send({ foto: '/jugadores/' + baseName + '.png' });
  });
});

// ...existing code...

// Servir archivos estáticos (React y videos)

// Endpoint para obtener la lista de videos
app.get('/api/videos', (req, res) => {
  const jsonPath = path.join(__dirname, 'public/videos.json');
  fs.readFile(jsonPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer videos.json');
    try {
      const videos = JSON.parse(data);
      res.json(videos);
    } catch {
      res.status(500).send('Error al parsear videos.json');
    }
  });
});


// Endpoint para eliminar un video
app.post('/api/delete-video', express.json(), (req, res) => {
  const { video } = req.body;
  if (!video) return res.status(400).send('Falta el nombre del video');
  const videoPath = path.join(__dirname, 'public/videos', video);
  fs.unlink(videoPath, (err) => {
    if (err) return res.status(500).send('No se pudo eliminar el video');
    // Sincronizar videos.json con los archivos reales
    const videosDir = path.join(__dirname, 'public/videos');
    const jsonPath = path.join(__dirname, 'public/videos.json');
    try {
      const files = fs.readdirSync(videosDir).filter(f => f.endsWith('.mp4'));
      fs.writeFileSync(jsonPath, JSON.stringify(files, null, 2), 'utf8');
      console.log('videos.json sincronizado tras delete:', files);
    } catch (err) {
      console.error('Error sincronizando videos.json:', err);
    }
    res.send('OK');
  });
});


// Servir archivos estáticos (React y videos)
// Servir archivos estáticos (React)
// Servir archivos estáticos (solo React, no videos)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Ruta directa para control remoto (sin /static)
app.get('/control-remoto.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/control-remoto.html'));
});

// Endpoint para servir videos MP4 con el header correcto
app.get('/videos/:videoName', (req, res) => {
  const videoName = req.params.videoName;
  const videoPath = path.join(__dirname, 'public/videos', videoName);
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video no encontrado');
  }
  res.setHeader('Content-Type', 'video/mp4');
  res.sendFile(videoPath);
});

// Reset juego
app.post('/api/reset', (req, res) => {
  if (platform === 'pi') {
    // Resetear todas las flags
    Object.keys(internalFlags).forEach(key => {
      internalFlags[key] = false;
    });
    console.log('🏓 API: Reset del juego');
  }
  res.json({ success: true, action: 'reset', platform });
});

// Obtener estado actual de las flags (para Pi)
app.get('/api/flags', (req, res) => {
  if (platform === 'pi') {
    res.json(internalFlags);
  } else {
    res.json({ message: 'Solo disponible en modo Pi', platform });
  }
});

// Limpiar flags (para Pi)
app.post('/api/clear-flags', (req, res) => {
  if (platform === 'pi') {
    Object.keys(internalFlags).forEach(key => {
      internalFlags[key] = false;
    });
    console.log('🧹 API: Flags limpiadas');
  }
  res.json({ success: true, action: 'clear-flags', platform });
});

// Obtener marcador actual (placeholder - aquí se conectaría con el estado real)
app.get('/api/marcador', (req, res) => {
  // TODO: Conectar con el estado real del marcador
  res.json({
    score1: 0,
    score2: 0,
    set: 1,
    sets: [[0,0,0],[0,0,0]],
    server: 1,
    platform: platform
  });
});

// Información del sistema
app.get('/api/info', (req, res) => {
  res.json({
    platform: platform,
    mode: platform === 'pi' ? 'internal' : 'external',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor HTTP iniciado en puerto ${PORT}`);
});
