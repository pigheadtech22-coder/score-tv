# 🏆 Score TV - Marcador de Pádel

Sistema completo de marcador televisivo para partidos de pádel con control remoto y cronómetro en tiempo real.

## ✨ Características

- 📺 **Marcador televisivo** - Interfaz profesional para transmisiones
- ⏱️ **Cronómetro en tiempo real** - Tiempo preciso del partido
- 🎮 **Control remoto** - Web y ESP32 compatible
- ➕➖ **Sumar/Restar puntos** - Corrección de errores fácil
- 🎥 **Videos de publicidad** - Sistema automático entre cambios de cancha
- 👥 **Gestión de jugadores** - Base de datos con fotos
- 🏓 **Tie Break** - Soporte completo para tie breaks
- 🥇 **Punto de oro** - Modo punto de oro configurable

## 🚀 Instalación Rápida

### 1. Descargar el proyecto
```bash
git clone https://github.com/pigheadtech22-coder/score-tv.git
cd score-tv
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
npm run start:all
```

### 4. Ejecutar en modo producción
```bash
npm run build
npm run start:production
```

O usar el script automático:
```bash
./start-production.sh
```

## 🌐 Acceso a la aplicación

Una vez iniciado, podrás acceder a:

- **📱 Marcador principal**: http://localhost:5173 (desarrollo) / http://localhost:3000 (producción)
- **⚙️ Panel de control**: http://localhost:5173/panel-control 
- **🎮 Control remoto**: http://localhost:3000/control-remoto.html

## 🎮 Comandos disponibles

### WebSocket (puerto 8080)
- `puntoEquipo1` - Sumar punto al equipo 1
- `puntoEquipo2` - Sumar punto al equipo 2
- `restarPuntoEquipo1` - Restar punto al equipo 1
- `restarPuntoEquipo2` - Restar punto al equipo 2
- `cambiarSaque` - Cambiar el saque
- `cambioCancha` - Activar cambio de cancha

### Para ESP32
Configurar las siguientes banderas en tu ESP32:
```cpp
bool punto1 = false;
bool punto2 = false;
bool restarPunto1 = false;
bool restarPunto2 = false;
bool cambioSaque = false;
bool cambioCancha = false;
```

## 📁 Estructura del proyecto

```
score-tv/
├── src/                    # Código fuente React
├── public/                 # Archivos estáticos
│   ├── jugadores/         # Fotos de jugadores
│   ├── videos/            # Videos de publicidad
│   └── control-remoto.html # Control remoto web
├── dist/                  # Build de producción
├── server-production.cjs  # Servidor de producción
└── start-production.sh    # Script de inicio automático
```

## 🔧 Modo Debug

1. En el marcador, ingresa la contraseña: `padel2025`
2. Aparecerán controles adicionales:
   - Start/Reset Match Time
   - Botones para sumar/restar puntos
   - Cambio de cancha manual
   - Logs de depuración

## 📱 Uso básico

1. **Configurar torneo**: Ve al panel de control y configura nombre del torneo, fase, etc.
2. **Seleccionar jugadores**: Elige los 4 jugadores que participarán
3. **Iniciar partido**: El cronómetro comenzará automáticamente
4. **Controlar puntos**: Usa el control remoto web o ESP32
5. **Videos automáticos**: Se reproducen automáticamente en cambios de cancha

## 🛠️ Tecnologías utilizadas

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **WebSocket**: Para control remoto en tiempo real
- **FFmpeg**: Procesamiento de videos
- **Git**: Control de versiones

## 📞 Soporte

Si tienes problemas o sugerencias, crea un issue en GitHub:
https://github.com/pigheadtech22-coder/score-tv/issues

---

**Desarrollado por pigheadtech22-coder** 🚀
