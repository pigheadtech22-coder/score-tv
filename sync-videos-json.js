// Script para sincronizar videos.json con los archivos reales en public/videos/
const fs = require('fs');
const path = require('path');

const videosDir = path.join(__dirname, 'public', 'videos');
const jsonPath = path.join(__dirname, 'public', 'videos.json');

// Leer archivos reales
const files = fs.readdirSync(videosDir)
  .filter(f => f.endsWith('.mp4'));

// Escribir el nuevo JSON
fs.writeFileSync(jsonPath, JSON.stringify(files, null, 2), 'utf8');

console.log('videos.json sincronizado con los archivos reales:', files);
