import React, { useState, useEffect } from 'react';
  // Lógica unificada para sumar punto/set equipo 1
  function procesarPuntoEquipo1(m) {
    const pointOrder = [0, 15, 30, 40];
    let score1 = m.score1;
    let score2 = m.score2;
    let sets = Array.isArray(m.sets) ? m.sets.map(arr => [...arr]) : [[0,0,0],[0,0,0]];
    let set = m.set || 1;
    let tieBreakMode = m.tieBreakMode;
    let tieBreakScore1 = m.tieBreakScore1;
    let tieBreakScore2 = m.tieBreakScore2;
    if (!tieBreakMode && sets[0][set-1] === 6 && sets[1][set-1] === 6) {
      tieBreakMode = true;
      tieBreakScore1 = 0;
      tieBreakScore2 = 0;
      score1 = 0;
      score2 = 0;
    }
    if (tieBreakMode) {
      tieBreakScore1 += 1;
      if (tieBreakScore1 >= 7 && tieBreakScore1 - tieBreakScore2 >= 2) {
        sets[0][set-1] += 1;
        tieBreakMode = false;
        tieBreakScore1 = 0;
        tieBreakScore2 = 0;
        score1 = 0;
        score2 = 0;
        if (set < 3) {
          set += 1;
          sets[0][set-1] = 0;
          sets[1][set-1] = 0;
        }
      }
    } else {
      if (score1 < 40) {
        const idx = pointOrder.indexOf(score1);
        if (idx !== -1 && idx < pointOrder.length - 1) {
          score1 = pointOrder[idx + 1];
        } else {
          // Solo cambiar si hay un score válido actual, sino mantener el estado
          console.warn('⚠️ Score inválido para jugador 1:', score1, 'manteniendo estado actual');
        }
      } else {
        sets[0][set-1] += 1;
        score1 = 0;
        score2 = 0;
        let limiteSet = (sets[0][set-1] === 6 && sets[1][set-1] === 5) || (sets[0][set-1] === 5 && sets[1][set-1] === 6) ? 7 : 6;
        if (sets[0][set-1] >= limiteSet && !(sets[0][set-1] === 6 && sets[1][set-1] === 6)) {
          if (set < 3) {
            set += 1;
            sets[0][set-1] = 0;
            sets[1][set-1] = 0;
          }
        }
      }
    }
    if (set < 1) set = 1;
    return { ...m, score1, score2, sets, set, tieBreakMode, tieBreakScore1, tieBreakScore2 };
  }

  // Lógica unificada para sumar punto/set equipo 2
  // ...existing code...

  // ...existing code...

// ...existing code...
  // Lógica unificada para sumar punto/set equipo 2
  function procesarPuntoEquipo2(m) {
    const pointOrder = [0, 15, 30, 40];
    let score1 = m.score1;
    let score2 = m.score2;
    let sets = Array.isArray(m.sets) ? m.sets.map(arr => [...arr]) : [[0,0,0],[0,0,0]];
    let set = m.set || 1;
    let tieBreakMode = m.tieBreakMode;
    let tieBreakScore1 = m.tieBreakScore1;
    let tieBreakScore2 = m.tieBreakScore2;
    if (!tieBreakMode && sets[0][set-1] === 6 && sets[1][set-1] === 6) {
      tieBreakMode = true;
      tieBreakScore1 = 0;
      tieBreakScore2 = 0;
      score1 = 0;
      score2 = 0;
    }
    if (tieBreakMode) {
      tieBreakScore2 += 1;
      if (tieBreakScore2 >= 7 && tieBreakScore2 - tieBreakScore1 >= 2) {
        sets[1][set-1] += 1;
        tieBreakMode = false;
        tieBreakScore1 = 0;
        tieBreakScore2 = 0;
        score1 = 0;
        score2 = 0;
        if (set < 3) {
          set += 1;
          sets[0][set-1] = 0;
          sets[1][set-1] = 0;
        }
      }
    } else {
      if (score2 < 40) {
        const idx = pointOrder.indexOf(score2);
        if (idx !== -1 && idx < pointOrder.length - 1) {
          score2 = pointOrder[idx + 1];
        } else {
          // Solo cambiar si hay un score válido actual, sino mantener el estado
          console.warn('⚠️ Score inválido para jugador 2:', score2, 'manteniendo estado actual');
        }
      } else {
        sets[1][set-1] += 1;
        score1 = 0;
        score2 = 0;
        let limiteSet = (sets[0][set-1] === 6 && sets[1][set-1] === 5) || (sets[0][set-1] === 5 && sets[1][set-1] === 6) ? 7 : 6;
        if (sets[1][set-1] >= limiteSet && !(sets[0][set-1] === 6 && sets[1][set-1] === 6)) {
          if (set < 3) {
            set += 1;
            sets[0][set-1] = 0;
            sets[1][set-1] = 0;
          }
        }
      }
    }
    if (set < 1) set = 1;
    return { ...m, score1, score2, sets, set, tieBreakMode, tieBreakScore1, tieBreakScore2 };
  }

  // Lógica unificada para restar punto equipo 1
  function restarPuntoEquipo1(m) {
    const pointOrder = [0, 15, 30, 40];
    let score1 = m.score1;
    let score2 = m.score2;
    let sets = Array.isArray(m.sets) ? m.sets.map(arr => [...arr]) : [[0,0,0],[0,0,0]];
    let set = m.set || 1;
    let tieBreakMode = m.tieBreakMode;
    let tieBreakScore1 = m.tieBreakScore1;
    let tieBreakScore2 = m.tieBreakScore2;
    
    if (tieBreakMode) {
      if (tieBreakScore1 > 0) {
        tieBreakScore1 -= 1;
      }
    } else {
      if (score1 > 0) {
        const idx = pointOrder.indexOf(score1);
        if (idx > 0) {
          score1 = pointOrder[idx - 1];
        }
      } else if (sets[0][set-1] > 0) {
        // Si el score es 0 pero hay games ganados, retroceder un game
        sets[0][set-1] -= 1;
        score1 = 40;
        score2 = 30; // Asumir que era 40-30 antes del game
      }
    }
    
    if (set < 1) set = 1;
    return { ...m, score1, score2, sets, set, tieBreakMode, tieBreakScore1, tieBreakScore2 };
  }

  // Lógica unificada para restar punto equipo 2
  function restarPuntoEquipo2(m) {
    const pointOrder = [0, 15, 30, 40];
    let score1 = m.score1;
    let score2 = m.score2;
    let sets = Array.isArray(m.sets) ? m.sets.map(arr => [...arr]) : [[0,0,0],[0,0,0]];
    let set = m.set || 1;
    let tieBreakMode = m.tieBreakMode;
    let tieBreakScore1 = m.tieBreakScore1;
    let tieBreakScore2 = m.tieBreakScore2;
    
    if (tieBreakMode) {
      if (tieBreakScore2 > 0) {
        tieBreakScore2 -= 1;
      }
    } else {
      if (score2 > 0) {
        const idx = pointOrder.indexOf(score2);
        if (idx > 0) {
          score2 = pointOrder[idx - 1];
        }
      } else if (sets[1][set-1] > 0) {
        // Si el score es 0 pero hay games ganados, retroceder un game
        sets[1][set-1] -= 1;
        score2 = 40;
        score1 = 30; // Asumir que era 40-30 antes del game
      }
    }
    
    if (set < 1) set = 1;
    return { ...m, score1, score2, sets, set, tieBreakMode, tieBreakScore1, tieBreakScore2 };
  }
import ReactDOM from 'react-dom';


import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Marcador from './components/Marcador';
import LogoAnimado from './components/LogoAnimado';
console.log('Importando resetFlags desde esp32service');
import { getFlags, resetFlags } from './services/esp32service';
import Publicidad from './components/Publicidad';
import PanelControl from './components/PanelControl';
import RolCanchas from './components/RolCanchas';
import jugadoresData from './data/jugadores.json';
import './Marcador.css';

function App() {
  const [modo, setModo] = useState('marcador');
  // Scroll vertical siempre visible
  // Estado para mostrar/ocultar el banner superior
  const [navVisible, setNavVisible] = useState(false);
  useEffect(() => {
    setNavVisible(true);
    const timer = setTimeout(() => setNavVisible(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Aplicar clase para ocultar scroll vertical
  useEffect(() => {
    document.body.classList.add('marcador-sin-scroll');
    document.documentElement.classList.add('marcador-sin-scroll');
    
    // Cleanup al desmontar
    return () => {
      document.body.classList.remove('marcador-sin-scroll');
      document.documentElement.classList.remove('marcador-sin-scroll');
    };
  }, []);
  // Estados para los jugadores seleccionados
  const [player1, setPlayer1] = useState(["", ""]);
  const [player2, setPlayer2] = useState(["", ""]);
  // General config for marcador
  const [configMarcador, setConfigMarcador] = useState(() => {
    return JSON.parse(localStorage.getItem('configMarcador')) || { torneo: '', fase: '', puntoOro: false, superMuerteSubita: false };
  });
  useEffect(() => {
    function updateConfig() {
      const config = JSON.parse(localStorage.getItem('configMarcador')) || { torneo: '', fase: '', puntoOro: false, superMuerteSubita: false };
      setConfigMarcador(config);
    }
    window.addEventListener('configMarcadorChanged', updateConfig);
    return () => window.removeEventListener('configMarcadorChanged', updateConfig);
  }, []);

  // Efecto para cargar jugadores seleccionados desde localStorage y actualizar en tiempo real
  useEffect(() => {
    function updatePlayers() {
      const seleccion = JSON.parse(localStorage.getItem('jugadoresMarcador')) || ["", "", "", ""];
      setPlayer1(seleccion.slice(0, 2));
      setPlayer2(seleccion.slice(2, 4));
    }
    updatePlayers();
    window.addEventListener('jugadoresMarcadorChanged', updatePlayers);
    return () => window.removeEventListener('jugadoresMarcadorChanged', updatePlayers);
  }, []);

  const [videosPublicidad, setVideosPublicidad] = useState([]);

  // Cargar videos.json en videosPublicidad al montar y cuando cambie
  useEffect(() => {
    async function fetchVideosPublicidad() {
      try {
        const res = await fetch('/videos.json');
        if (res.ok) {
          const data = await res.json();
          setVideosPublicidad(Array.isArray(data) ? data : []);
          window.videosPublicidadOriginal = Array.isArray(data) ? data : [];
        } else {
          setVideosPublicidad([]);
          window.videosPublicidadOriginal = [];
        }
      } catch {
        setVideosPublicidad([]);
        window.videosPublicidadOriginal = [];
      }
    }
    fetchVideosPublicidad();
  }, []);

  // Reiniciar videoIndex cuando videosPublicidad cambie
  useEffect(() => {
    setVideoIndex(0);
  }, [videosPublicidad]);
  const [transicionEnCurso, setTransicionEnCurso] = useState(false);
  // ...existing code...
  const [videoIndex, setVideoIndex] = useState(0);
  const [marcador, setMarcador] = useState({
    player1: ['Luciano Mansilla', 'Ignacio Caceres'],
    player2: ['Daniel Oximea', 'Luis Pineda'],
    score1: 0,
    score2: 0,
    set: 1,
    server: 1,
    action: 'update',
    switch: false,
    cambioCancha: false,
    tieBreakMode: false,
    tieBreakScore1: 0,
    tieBreakScore2: 0
  });
  const [jugadores, setJugadores] = useState([]);
  // Cronómetro de match time
  const [matchTimeActive, setMatchTimeActive] = useState(false);
  const [matchStartTime, setMatchStartTime] = useState(null);
  const [matchPausedTime, setMatchPausedTime] = useState(0);
  const [matchSeconds, setMatchSeconds] = useState(0);

  useEffect(() => {
    let timer;
    if (matchTimeActive) {
      if (!matchStartTime) {
        setMatchStartTime(Date.now() - (matchPausedTime * 1000));
      }
      timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - matchStartTime) / 1000);
        setMatchSeconds(elapsed);
      }, 1000);
    } else {
      if (matchStartTime) {
        setMatchPausedTime(matchSeconds);
        setMatchStartTime(null);
      }
    }
    return () => clearInterval(timer);
  }, [matchTimeActive, matchStartTime, matchSeconds, matchPausedTime]);

  // Formatear segundos a HH:MM:SS
    function formatMatchTime(secs) {
      const h = Math.floor(secs / 3600).toString().padStart(2, '0');
      const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
      const s = (secs % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    }
    // Modo debug y logs
    const [debug, setDebug] = useState(false);
    const [debugInput, setDebugInput] = useState('');
    const [logs, setLogs] = useState([]);
    const DEBUG_PASSWORD = 'padel2025'; // Cambia la contraseña aquí

    // Polling para banderas de control remoto ESP32 (frontend aplica la lógica)
    const flagEnProceso = React.useRef(false);
      const resetTimeoutRef = React.useRef(null);
    useEffect(() => {
      const intervalo = setInterval(async () => {
        // Si estamos esperando que la bandera se limpie, no procesar
        if (flagEnProceso.current) {
            const flags = await getFlags();
            // Verifica que flags no sea null antes de acceder a sus propiedades
            if (flags && !flags.punto1 && !flags.punto2 && !flags.restarPunto1 && !flags.restarPunto2 && !flags.cambioSaque && !flags.cambioCancha) {
              flagEnProceso.current = false;
              if (resetTimeoutRef.current) {
                clearTimeout(resetTimeoutRef.current);
                resetTimeoutRef.current = null;
              }
            }
            // Si las banderas siguen en true por más de 2 segundos, forzar reset
            else if (!resetTimeoutRef.current) {
              resetTimeoutRef.current = setTimeout(async () => {
                const f = await getFlags();
                if (f.punto1 || f.punto2 || f.restarPunto1 || f.restarPunto2 || f.cambioSaque || f.cambioCancha) {
                  await resetFlags();
                }
                resetTimeoutRef.current = null;
              }, 2000); // 2 segundos
            }
          return;
        }
        try {
          const flags = await getFlags();
          console.log('🔍 Flags obtenidas:', flags);
          if (!flags) {
            setMarcador(m => ({ ...m, connectionStatus: 'Conectando a ESP32...' }));
            return;
          }
          let banderaProcesada = false;
          let nuevoMarcador = null;
          if (flags.punto1) {
            banderaProcesada = true;
            nuevoMarcador = m => procesarPuntoEquipo1({ ...m, connectionStatus: undefined });
          }
          if (flags.punto2) {
            banderaProcesada = true;
            nuevoMarcador = m => procesarPuntoEquipo2({ ...m, connectionStatus: undefined });
          }
          if (flags.restarPunto1) {
            banderaProcesada = true;
            nuevoMarcador = m => restarPuntoEquipo1({ ...m, connectionStatus: undefined });
          }
          if (flags.restarPunto2) {
            banderaProcesada = true;
            nuevoMarcador = m => restarPuntoEquipo2({ ...m, connectionStatus: undefined });
          }
          if (flags.cambioSaque) {
            banderaProcesada = true;
            nuevoMarcador = m => ({ ...m, server: m.server === 1 ? 2 : 1, connectionStatus: undefined });
          }
          if (flags.cambioCancha) {
            banderaProcesada = true;
            setModo('cambioCancha');
          }
          if (banderaProcesada) {
            if (nuevoMarcador) setMarcador(nuevoMarcador);
            if (debug) setLogs(l => [...l, '[FRONT] Llamando a resetFlags']);
            console.log('[FRONT] Antes de llamar a resetFlags');
            flagEnProceso.current = true;
            await resetFlags();
              // Inicia timeout para forzar reset si no se limpia
              if (!resetTimeoutRef.current) {
                resetTimeoutRef.current = setTimeout(async () => {
                  const f = await getFlags();
                  if (f.punto1 || f.punto2 || f.restarPunto1 || f.restarPunto2 || f.cambioSaque || f.cambioCancha) {
                    await resetFlags();
                  }
                  resetTimeoutRef.current = null;
                }, 2000); // 2 segundos
              }
            console.log('[FRONT] Después de llamar a resetFlags');
            // Espera a que la bandera se limpie antes de procesar otro pulso
          }
        } catch (e) {
          if (debug) setLogs(l => [...l, `[ERROR] Fallo al obtener flags: ${e}`]);
        }
      }, 1000);
      return () => clearInterval(intervalo);
    }, [debug, modo, videosPublicidad.length, transicionEnCurso]);
// ...existing code...
// ...existing code...




  // Conexión WebSocket para control remoto

    useEffect(() => {
      let ws;
      let reconnectTimeout;
      let shouldReconnect = true;

      function connectWS() {
        try {
          ws = new window.WebSocket('ws://' + window.location.hostname + ':8080');
          ws.onopen = () => {
            if (debug) setLogs(l => [...l, '[WS] Conectado a WebSocket']);
          };
          ws.onmessage = (event) => {
            const cmd = event.data;
            if (debug) setLogs(l => [...l, `[WS] Comando recibido: ${cmd}`]);
            if (cmd === 'cambioCancha') {
              setModo('cambioCancha');
            } else if (cmd === 'cambiarSaque') {
              setMarcador(m => ({ ...m, server: m.server === 1 ? 2 : 1 }));
            } else if (cmd === 'puntoEquipo1') {
              setMarcador(m => procesarPuntoEquipo1(m));
            } else if (cmd === 'puntoEquipo2') {
              setMarcador(m => procesarPuntoEquipo2(m));
            } else if (cmd === 'restarPuntoEquipo1') {
              setMarcador(m => restarPuntoEquipo1(m));
            } else if (cmd === 'restarPuntoEquipo2') {
              setMarcador(m => restarPuntoEquipo2(m));
            }
          };
          ws.onerror = () => {
            if (debug) setLogs(l => [...l, '[WS] Error de conexión WebSocket']);
          };
          ws.onclose = () => {
            if (debug) setLogs(l => [...l, '[WS] WebSocket cerrado, intentando reconectar...']);
            if (shouldReconnect) {
              reconnectTimeout = setTimeout(connectWS, 3000); // Reintenta en 3 segundos
            }
          };
        } catch (e) {
          if (debug) setLogs(l => [...l, `[WS] Error al crear WebSocket: ${e}`]);
        }
      }
      connectWS();
      return () => {
        shouldReconnect = false;
        if (ws) ws.close();
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
      };
    }, [debug]);

  useEffect(() => {
    setJugadores(jugadoresData);
  }, []);

  // ...existing code...

  // UI para activar modo debug
  const handleDebugLogin = (e) => {
    e.preventDefault();
    if (debugInput === DEBUG_PASSWORD) {
      setDebug(true);
      setLogs(l => [...l, '[DEBUG] Modo debug activado']);
    } else {
      setLogs(l => [...l, '[DEBUG] Contraseña incorrecta']);
    }
    setDebugInput('');
  };

  // Forzar render de tie break al llegar a 6-6 aunque no se sumen puntos
  useEffect(() => {
    // Only update marcador if tieBreakMode should be activated and is not already active
    setMarcador(m => {
      let sets = Array.isArray(m.sets) ? m.sets.map(arr => [...arr]) : [[0,0,0],[0,0,0]];
      let set = m.set || 1;
      let tieBreakMode = m.tieBreakMode;
      // Si ambos tienen 6 y tieBreakMode no está activo, activarlo y resetear scores
      if (!tieBreakMode && sets[0][set-1] === 6 && sets[1][set-1] === 6) {
        return {
          ...m,
          tieBreakMode: true,
          tieBreakScore1: 0,
          tieBreakScore2: 0
        };
      }
      return m;
    });
  }, [modo, debug]);

  // Log datos enviados (acciones de usuario)
  const logAccion = (msg) => {
    if (debug) setLogs(l => [...l, `[ACTION] ${msg}`]);
  };

  // Handlers de animación
  const handleLogoAnimStart = () => {
    setTransicionEnCurso(true);
  };
  const handleLogoAnimEnd = () => {
    setTransicionEnCurso(false);
    setTimeout(() => {
      if (videosPublicidad.length > 0) {
        setModo('publicidad');
        // No avanzar el índice aquí, solo en onEnd del video
      } else {
        setModo('marcador');
      }
    }, 10);
  };

  return (
    <>
      <Router>
        {/* Banner superior ocultable con hover */}
        <nav
          onMouseEnter={() => setNavVisible(true)}
          onMouseLeave={() => setNavVisible(false)}
          style={{
            padding:8,
            background:'#eee',
            display:'flex',
            gap:16,
            position:'fixed',
            top:0,
            left:0,
            width:'100%',
            zIndex:2000,
            boxShadow:'0 2px 8px #0002',
            height:navVisible ? 48 : 8,
            opacity:navVisible ? 1 : 0.1,
            transition:'height 0.3s, opacity 0.3s',
            overflow:'hidden',
            cursor:'pointer'
          }}
        >
          <Link to="/" style={{padding:'8px 24px',fontWeight:'bold',color:'#222',textDecoration:'none'}}>Marcador</Link>
          <Link to="/panel-control" style={{padding:'8px 24px',fontWeight:'bold',color:'#222',textDecoration:'none'}}>Configuración</Link>
          <Link to="/rol-canchas" style={{padding:'8px 24px',fontWeight:'bold',color:'#222',textDecoration:'none'}}>Rol de Canchas</Link>
        </nav>
          <Routes>
            <Route path="/panel-control" element={<PanelControl />} />
            <Route path="/rol-canchas" element={<RolCanchas />} />
            <Route path="/" element={
              <div className="app">
                {/* ...existing code... */}
                {/* Acceso a modo debug */}
                {!debug && (
                  <form onSubmit={handleDebugLogin} style={{position:'fixed',top:10,right:10,zIndex:3000}}>
                    <input
                      type="password"
                      value={debugInput}
                      onChange={e => setDebugInput(e.target.value)}
                      placeholder="Debug password"
                      style={{padding:'4px'}}
                    />
                    <button type="submit" style={{padding:'4px'}}>Entrar debug</button>
                  </form>
                )}
                {/* Panel de logs solo visible en modo debug */}
                {debug && (
                  <div style={{position:'fixed',top:40,right:10,zIndex:3000,background:'#222',color:'#fff',padding:'8px',maxHeight:'40vh',overflowY:'auto',fontSize:'12px',borderRadius:'6px',boxShadow:'0 2px 8px #000'}}>
                    <b>Logs debug</b>
                    <button style={{float:'right',fontSize:'10px'}} onClick={()=>setDebug(false)}>Cerrar</button>
                    <ul style={{marginTop:'8px',paddingLeft:'16px'}}>
                      {logs.map((log,i)=>(<li key={i}>{log}</li>))}
                    </ul>
                  </div>
                )}
                {(modo === 'marcador' || modo === 'cambioCancha') && (
                  <>
                    {debug && (
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'center',
                        position: 'fixed',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        background: '#222',
                        padding: '12px 0',
                        zIndex: 3000,
                        boxShadow: '0 -2px 8px #0002',
                      }}>
                        <button onClick={() => setMatchTimeActive(true)} style={{background:'#2ecc40',color:'#fff',padding:'8px',borderRadius:'6px'}}>Start Match Time</button>
                        <button onClick={() => { 
                          setMatchTimeActive(false); 
                          setMatchSeconds(0); 
                          setMatchStartTime(null);
                          setMatchPausedTime(0);
                        }} style={{background:'#ff4136',color:'#fff',padding:'8px',borderRadius:'6px'}}>Reset Match Time</button>
                        <button onClick={() => {
                          logAccion('Botón cambio de cancha presionado');
                          setTransicionEnCurso(false); // Asegura que el logo se renderice
                          setMatchTimeActive(false); // Pausa el match time
                          setModo('cambioCancha');
                        }}>
                          Cambio de cancha
                        </button>
                        <button onClick={() => {
                          logAccion('Botón cambiar saque presionado');
                          setMarcador(m => ({...m, server: m.server === 1 ? 2 : 1}));
                        }}>Cambiar saque</button>
                        {/* Botón + Punto Equipo 1 */}
                        <button onClick={() => {
                          logAccion('Botón + Punto Equipo 1 presionado');
                          setMarcador(m => procesarPuntoEquipo1(m));
                        }}>+ Punto Equipo 1</button>
                        {/* Botón + Punto Equipo 2 */}
                        <button onClick={() => {
                          logAccion('Botón + Punto Equipo 2 presionado');
                          setMarcador(m => procesarPuntoEquipo2(m));
                        }}>+ Punto Equipo 2</button>
                        {/* Botón - Punto Equipo 1 */}
                        <button onClick={() => {
                          logAccion('Botón - Punto Equipo 1 presionado');
                          setMarcador(m => restarPuntoEquipo1(m));
                        }} style={{background:'#ff851b',color:'#fff',padding:'8px',borderRadius:'6px'}}>- Punto Equipo 1</button>
                        {/* Botón - Punto Equipo 2 */}
                        <button onClick={() => {
                          logAccion('Botón - Punto Equipo 2 presionado');
                          setMarcador(m => restarPuntoEquipo2(m));
                        }} style={{background:'#ff851b',color:'#fff',padding:'8px',borderRadius:'6px'}}>- Punto Equipo 2</button>
                      </div>
                    )}
                    <Marcador
                      {...marcador}
                      jugadores={jugadores}
                      player1={player1}
                      player2={player2}
                      goldenPoint={configMarcador.puntoOro}
                      superMuerteSubita={configMarcador.superMuerteSubita}
                      torneo={configMarcador.torneo || "TORNEO DE PRUEBA"}
                      fase={configMarcador.fase || "FINAL"}
                      setMax={6}
                      matchTime={formatMatchTime(matchSeconds)}
                    />
                    {/* Logo animado sobre el marcador durante cambio de cancha */}
                    {modo === 'cambioCancha' && (
                      <LogoAnimado onAnimationStart={handleLogoAnimStart} onAnimationEnd={handleLogoAnimEnd} />
                    )}
                  </>
                )}
                {modo === 'publicidad' && (
                  videosPublicidad.length > 0 ? (
                    <Publicidad
                      videos={[`/videos/${videosPublicidad[videoIndex]}`]}
                      duracion={40}
                      onEnd={() => {
                        setVideoIndex(idx => (idx + 1) % videosPublicidad.length);
                        setModo('marcador');
                        setTransicionEnCurso(false);
                        // Si el match time estaba activo, ajustar el tiempo de inicio para incluir la duración del video
                        if (matchTimeActive && matchStartTime) {
                          setMatchStartTime(prev => prev - (40 * 1000)); // Resta 40 segundos al tiempo de inicio
                        } else {
                          setMatchPausedTime(prev => prev + 40); // Si estaba pausado, suma al tiempo pausado
                        }
                        setMatchTimeActive(true); // Reactiva el match time
                      }}
                    />
                  ) : (
                    <div style={{color:'yellow',fontSize:'2rem',padding:'40px',textAlign:'center',background:'#222'}}>
                      No hay videos de publicidad disponibles<br/>
                      <pre>{JSON.stringify({modo, videoIndex, videosPublicidad}, null, 2)}</pre>
                    </div>
                  )
                )}
                {/* Fallback: si modo no es reconocido, mostrar mensaje y log */}
                {!(modo === 'marcador' || modo === 'cambioCancha' || modo === 'publicidad') && (
                  <div style={{color:'red',fontSize:'2rem',padding:'40px',textAlign:'center'}}>
                    Error: modo desconocido ({modo})<br/>
                    <pre>{JSON.stringify({modo, videoIndex, videosPublicidad}, null, 2)}</pre>
                  </div>
                )}
              </div>
            } />
          </Routes>
        </Router>

    </>
  );
}

export default App;
