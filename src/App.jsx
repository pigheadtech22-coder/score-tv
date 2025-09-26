// ...existing code...
  // ...existing useState declarations...




import React, { useState, useEffect } from 'react';
import Marcador from './components/Marcador';
import { getFlags, resetFlags, getMarcador } from './services/esp32service';
import Publicidad from './components/Publicidad';
import jugadoresData from './data/jugadores.json';
import './Marcador.css';

const videosPublicidad = [
  '/videos/publicidada2.mp4',
  '/videos/publicidada1.mp4',
  '/videos/publicidada3.mp4',
  '/videos/publicidada4.mp4',
  '/videos/publicidada5.mp4'
]; // Agrega aquí tus videos

function App() {
  const prevFlagsRef = React.useRef({ punto1: false, punto2: false, cambioSaque: false, cambioCancha: false });
  // ...existing useState declarations...
    // ...existing useState declarations...
    // Conexión WebSocket para control remoto
    // ...existing useState declarations...

    const [modo, setModo] = useState('marcador');
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
    const [matchSeconds, setMatchSeconds] = useState(0);

    useEffect(() => {
      let timer;
      if (matchTimeActive) {
        timer = setInterval(() => {
          setMatchSeconds(s => s + 1);
        }, 1000);
      }
      return () => clearInterval(timer);
    }, [matchTimeActive]);

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

    // Polling para banderas de control remoto ESP32
    useEffect(() => {
      const intervalo = setInterval(async () => {
        try {
          const flags = await getFlags();
          if (flags.punto1) {
            setMarcador(m => {
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
                  score1 = pointOrder[pointOrder.indexOf(score1) + 1];
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
            });
          }
          if (flags.punto2) {
            setMarcador(m => {
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
                  score2 = pointOrder[pointOrder.indexOf(score2) + 1];
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
            });
          }
          if (flags.cambioSaque) {
            setMarcador(m => ({ ...m, server: m.server === 1 ? 2 : 1 }));
          }
          if (flags.cambioCancha) {
            setModo('cambioCancha');
          }
          if (flags.punto1 || flags.punto2 || flags.cambioSaque || flags.cambioCancha) {
            await resetFlags();
          }
          if (debug) setLogs(l => [...l, `[ESP32] Flags: ${JSON.stringify(flags)}`]);
        } catch (e) {
          if (debug) setLogs(l => [...l, `[ERROR] Polling ESP32: ${e}`]);
        }
      }, 1000);
      return () => clearInterval(intervalo);
    }, [debug, modo]);


  // Polling para banderas de control remoto ESP32
  useEffect(() => {
    const intervalo = setInterval(async () => {
      try {
        const flags = await getFlags();
        const prevFlags = prevFlagsRef.current;
        // Solo procesar si el flag cambió de false a true
        if (flags.punto1 && !prevFlags.punto1) {
          setMarcador(m => {
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
                score1 = pointOrder[pointOrder.indexOf(score1) + 1];
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
          });
        }
        if (flags.punto2 && !prevFlags.punto2) {
          setMarcador(m => {
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
                score2 = pointOrder[pointOrder.indexOf(score2) + 1];
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
          });
        }
        if (flags.cambioSaque && !prevFlags.cambioSaque) {
          setMarcador(m => ({ ...m, server: m.server === 1 ? 2 : 1 }));
        }
        if (flags.cambioCancha && !prevFlags.cambioCancha) {
          setModo('cambioCancha');
        }
        if ((flags.punto1 && !prevFlags.punto1) || (flags.punto2 && !prevFlags.punto2) || (flags.cambioSaque && !prevFlags.cambioSaque) || (flags.cambioCancha && !prevFlags.cambioCancha)) {
          await resetFlags();
        }
        prevFlagsRef.current = flags;
        if (debug) setLogs(l => [...l, `[ESP32] Flags: ${JSON.stringify(flags)}`]);
      } catch (e) {
        if (debug) setLogs(l => [...l, `[ERROR] Polling ESP32: ${e}`]);
      }
    }, 1000);
    return () => clearInterval(intervalo);
  }, [debug, modo]);


  // Conexión WebSocket para control remoto
  useEffect(() => {
    const ws = new window.WebSocket('ws://' + window.location.hostname + ':8080');
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
        setMarcador(m => {
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
              score1 = pointOrder[pointOrder.indexOf(score1) + 1];
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
        });
      } else if (cmd === 'puntoEquipo2') {
        setMarcador(m => {
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
              score2 = pointOrder[pointOrder.indexOf(score2) + 1];
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
        });
      }
    };
    return () => ws.close();
  }, [debug]);

  useEffect(() => {
    setJugadores(jugadoresData);
  }, []);

  useEffect(() => {
    if (modo !== 'publicidad') {
      const intervalo = setInterval(async () => {
        try {
          const data = await getMarcador();
          // Si cambia a publicidad, avanza el video
          if (data.switch && modo !== 'publicidad') {
            setVideoIndex(idx => (idx + 1) % videosPublicidad.length);
          }
          setModo(data.switch ? 'publicidad' : 'marcador');
          setMarcador(data);
          if (debug) setLogs(l => [...l, `[API] Marcador actualizado: ${JSON.stringify(data)}`]);
        } catch (e) {
          if (debug) setLogs(l => [...l, `[ERROR] Fallo al obtener marcador: ${e}`]);
          // Si falla, mantener datos locales
        }
      }, 1000);
      return () => clearInterval(intervalo);
    }
  }, [debug, modo]);

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
    setMarcador(m => {
      let sets = Array.isArray(m.sets) ? m.sets.map(arr => [...arr]) : [[0,0,0],[0,0,0]];
      let set = m.set || 1;
      let tieBreakMode = m.tieBreakMode;
      let tieBreakScore1 = m.tieBreakScore1;
      let tieBreakScore2 = m.tieBreakScore2;
      // Si ambos tienen 6 y tieBreakMode no está activo, activarlo y resetear scores
      if (!tieBreakMode && sets[0][set-1] === 6 && sets[1][set-1] === 6) {
        tieBreakMode = true;
        tieBreakScore1 = 0;
        tieBreakScore2 = 0;
      }
      return { ...m, tieBreakMode, tieBreakScore1, tieBreakScore2 };
    });
    if (debug) setLogs(l => [...l, `[STATE] Modo cambiado a: ${modo}`]);
  }, [modo, debug, marcador.sets, marcador.set]);

  // Log datos enviados (acciones de usuario)
  const logAccion = (msg) => {
    if (debug) setLogs(l => [...l, `[ACTION] ${msg}`]);
  };

  // Log tiempos de animación y duración de transiciones
  const handleLogoAnimStart = () => {
    if (debug) setLogs(l => [...l, `[ANIMATION] Logo animación iniciada: ${Date.now()}`]);
  };
  const handleLogoAnimEnd = () => {
    if (debug) setLogs(l => [...l, `[ANIMATION] Logo animación finalizada: ${Date.now()}`]);
    setVideoIndex(idx => (idx + 1) % videosPublicidad.length);
    setModo('publicidad');
  };

  return (
    <div className="app">
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
            <div style={{display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px'}}>
              <button onClick={() => setMatchTimeActive(true)} style={{background:'#2ecc40',color:'#fff',padding:'8px',borderRadius:'6px'}}>Start Match Time</button>
              <button onClick={() => { setMatchTimeActive(false); setMatchSeconds(0); }} style={{background:'#ff4136',color:'#fff',padding:'8px',borderRadius:'6px'}}>Reset Match Time</button>
              <button onClick={() => {
                logAccion('Botón cambio de cancha presionado');
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
                setMarcador(m => {
                  const pointOrder = [0, 15, 30, 40];
                  let score1 = m.score1;
                  let score2 = m.score2;
                  let sets = Array.isArray(m.sets) ? m.sets.map(arr => [...arr]) : [[0,0,0],[0,0,0]];
                  let set = m.set || 1;
                  let tieBreakMode = m.tieBreakMode;
                  let tieBreakScore1 = m.tieBreakScore1;
                  let tieBreakScore2 = m.tieBreakScore2;
                  // Activar tie break inmediatamente al llegar a 6-6
                  if (!tieBreakMode && sets[0][set-1] === 6 && sets[1][set-1] === 6) {
                    tieBreakMode = true;
                    tieBreakScore1 = 0;
                    tieBreakScore2 = 0;
                    score1 = 0;
                    score2 = 0;
                  }
                  if (tieBreakMode) {
                    // Sumar punto tie break
                    tieBreakScore1 += 1;
                    // Gana el set si llega a 7 con diferencia de 2
                    if (tieBreakScore1 >= 7 && tieBreakScore1 - tieBreakScore2 >= 2) {
                      sets[0][set-1] += 1; // Suma el set al equipo 1
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
                    // Sumar punto normal
                    if (score1 < 40) {
                      score1 = pointOrder[pointOrder.indexOf(score1) + 1];
                    } else {
                      // Gana el game
                      sets[0][set-1] += 1;
                      score1 = 0;
                      score2 = 0;
                      // Solo cambiar de set si NO es 6-6
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
                });
              }}>+ Punto Equipo 1</button>
              {/* Botón + Punto Equipo 2 */}
              <button onClick={() => {
                logAccion('Botón + Punto Equipo 2 presionado');
                setMarcador(m => {
                  const pointOrder = [0, 15, 30, 40];
                  let score1 = m.score1;
                  let score2 = m.score2;
                  let sets = Array.isArray(m.sets) ? m.sets.map(arr => [...arr]) : [[0,0,0],[0,0,0]];
                  let set = m.set || 1;
                  let tieBreakMode = m.tieBreakMode;
                  let tieBreakScore1 = m.tieBreakScore1;
                  let tieBreakScore2 = m.tieBreakScore2;
                  // Activar tie break inmediatamente al llegar a 6-6
                  if (!tieBreakMode && sets[0][set-1] === 6 && sets[1][set-1] === 6) {
                    tieBreakMode = true;
                    tieBreakScore1 = 0;
                    tieBreakScore2 = 0;
                    score1 = 0;
                    score2 = 0;
                  }
                  if (tieBreakMode) {
                    // Sumar punto tie break
                    tieBreakScore2 += 1;
                    // Gana el set si llega a 7 con diferencia de 2
                    if (tieBreakScore2 >= 7 && tieBreakScore2 - tieBreakScore1 >= 2) {
                      sets[1][set-1] += 1; // Suma el set al equipo 2
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
                    // Sumar punto normal
                    if (score2 < 40) {
                      score2 = pointOrder[pointOrder.indexOf(score2) + 1];
                    } else {
                      // Gana el game
                      sets[1][set-1] += 1;
                      score1 = 0;
                      score2 = 0;
                      // Solo cambiar de set si NO es 6-6
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
                });
              }}>+ Punto Equipo 2</button>
            </div>
            <Marcador {...marcador} jugadores={jugadores} goldenPoint={true} setMax={6} matchTime={formatMatchTime(matchSeconds)} />
            {/* Logo animado sobre el marcador durante cambio de cancha */}
            {modo === 'cambioCancha' && (
              <LogoAnimado onAnimationStart={handleLogoAnimStart} onAnimationEnd={handleLogoAnimEnd} />
            )}
          </>
        )}
        {modo === 'publicidad' && (
          <Publicidad videos={[videosPublicidad[videoIndex]]} duracion={40} onEnd={() => setModo('marcador')} />
        )}
    </div>
  );
}


function LogoAnimado({ onAnimationStart, onAnimationEnd }) {
  const exts = ['gif', 'png', 'jpg', 'jpeg'];
  const base = '/jugadores/logo.';
  const [logoSrc, setLogoSrc] = useState(base + exts[0]);
  const [errorIndex, setErrorIndex] = useState(0);

  const handleError = () => {
    if (errorIndex < exts.length - 1) {
      setErrorIndex(errorIndex + 1);
      setLogoSrc(base + exts[errorIndex + 1]);
    } else {
      setLogoSrc(null);
    }
  };

  if (!logoSrc) return null;
  return (
    <img
      src={logoSrc}
      alt="Logo"
      className="logo-cambio-cancha"
      onAnimationStart={onAnimationStart}
      onAnimationEnd={onAnimationEnd}
      onError={handleError}
    />
  );
}

export default App;
