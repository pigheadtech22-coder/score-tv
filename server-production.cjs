const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const upload = multer({ dest: path.join(__dirname, 'dist/videos/tmp') });

// Middleware para parsear JSON
app.use(express.json());

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
app.post('/api/update-jugadores', (req, res) => {
  const { jugadores } = req.body;
  if (!Array.isArray(jugadores)) return res.status(400).send('Lista inválida');
  const jsonPath = path.join(__dirname, 'src/data/jugadores.json');
  fs.writeFile(jsonPath, JSON.stringify(jugadores, null, 2), (err) => {
    if (err) return res.status(500).send('No se pudo guardar jugadores.json');
    res.send('OK');
  });
});

// Endpoint para actualizar la lista y el orden de videos
app.post('/api/update-videos', (req, res) => {
  const { videos } = req.body;
  if (!Array.isArray(videos)) return res.status(400).send('Lista inválida');
  const jsonPath = path.join(__dirname, 'dist/videos.json');
  fs.writeFile(jsonPath, JSON.stringify(videos, null, 2), (err) => {
    if (err) return res.status(500).send('No se pudo guardar videos.json');
    res.send('OK');
  });
});

// Endpoint para subir videos
app.post('/api/upload-video', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).send('No se recibió archivo');
  const ext = path.extname(req.file.originalname).toLowerCase();
  const baseName = path.basename(req.file.originalname, ext);
  const tmpPath = req.file.path;
  const outputPath = path.join(__dirname, 'dist/videos', baseName + '.mp4');
  
  const ffmpegCmd = `ffmpeg -y -i "${tmpPath}" -vf scale=1280:720 -b:v 1500k -c:v libx264 -c:a aac "${outputPath}"`;
  exec(ffmpegCmd, (error, stdout, stderr) => {
    fs.unlinkSync(tmpPath);
    if (error) {
      console.error('Error al procesar video con FFmpeg:', error);
      return res.status(500).send('Error al procesar el video');
    }
    res.send('OK');
  });
});

// Endpoint para subir foto de jugador
app.post('/api/upload-jugador-foto', upload.single('foto'), (req, res) => {
  if (!req.file) return res.status(400).send('No se recibió archivo');
  const ext = path.extname(req.file.originalname).toLowerCase();
  const baseName = path.basename(req.file.originalname, ext);
  const tmpPath = req.file.path;
  const outputPath = path.join(__dirname, 'dist/jugadores', baseName + '.png');
  
  exec(`python -m rembg.cli i "${tmpPath}" "${outputPath}"`, (error, stdout, stderr) => {
    fs.unlinkSync(tmpPath);
    if (error) {
      console.error('Error al quitar fondo:', error);
      return res.status(500).send('Error al procesar la imagen');
    }
    res.send({ foto: '/jugadores/' + baseName + '.png' });
  });
});

// Endpoint para obtener la lista de videos
app.get('/api/videos', (req, res) => {
  const jsonPath = path.join(__dirname, 'dist/videos.json');
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
app.post('/api/delete-video', (req, res) => {
  const { video } = req.body;
  if (!video) return res.status(400).send('Falta el nombre del video');
  const videoPath = path.join(__dirname, 'dist/videos', video);
  fs.unlink(videoPath, (err) => {
    if (err) return res.status(500).send('No se pudo eliminar el video');
    res.send('OK');
  });
});

// Servir archivos estáticos del build de producción
app.use(express.static(path.join(__dirname, 'dist')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de PRODUCCIÓN iniciado en puerto ${PORT}`);
  console.log(`📱 Marcador: http://localhost:${PORT}`);
  console.log(`🎮 Control remoto: http://localhost:${PORT}/control-remoto.html`);
});