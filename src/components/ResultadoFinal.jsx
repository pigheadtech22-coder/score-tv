import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import './ResultadoFinal.css';

const ResultadoFinal = ({ resultadoFinal, onCerrar, onNuevoPartido }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (!resultadoFinal) return;

    const generarQRCode = async () => {
      try {
        // Crear datos estructurados y generar URL apropiada
        const generarURLResultado = () => {
          const hostname = window.location.hostname;
          const protocol = window.location.protocol;
          const port = window.location.port;
          
          // Si estamos en localhost (desarrollo), usar IP local si es posible
          if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // En desarrollo, intentar detectar IP local
            return `${protocol}//${hostname}${port ? ':' + port : ''}/resultado/${Date.now()}`;
          } else {
            // En Pi (producción), usar la IP real de la Pi
            return `${protocol}//${hostname}${port ? ':' + port : ''}/resultado/${Date.now()}`;
          }
        };

        const urlResultado = generarURLResultado();

        // Generar texto resumido para el QR
        const textoQR = `🏆 RESULTADO PÁDEL
📅 ${resultadoFinal.fecha}
🏟️ ${resultadoFinal.torneo}
🥇 ${resultadoFinal.fase}

👥 EQUIPO 1: ${resultadoFinal.jugadores.equipo1.join(' / ')}
👥 EQUIPO 2: ${resultadoFinal.jugadores.equipo2.join(' / ')}

🏆 GANADOR: EQUIPO ${resultadoFinal.ganador}
📊 RESULTADO: ${resultadoFinal.resultado}

📍 Sets detallados:
SET 1: ${resultadoFinal.sets[0][0]} - ${resultadoFinal.sets[1][0]}
SET 2: ${resultadoFinal.sets[0][1]} - ${resultadoFinal.sets[1][1]}
SET 3: ${resultadoFinal.sets[0][2]} - ${resultadoFinal.sets[1][2]}

⏱️ Duración: ${resultadoFinal.duracion}

🌐 Red Local: ${window.location.hostname}
🔗 Ver completo: ${urlResultado}`;

        // Generar QR Code
        const qrDataUrl = await QRCode.toDataURL(textoQR, {
          width: 256,
          margin: 2,
          color: {
            dark: '#1a2a4a',
            light: '#ffffff'
          }
        });

        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generando QR:', error);
      }
    };

    generarQRCode();
  }, [resultadoFinal]);

  const getEquipoGanador = () => {
    return resultadoFinal.ganador === 1 
      ? resultadoFinal.jugadores.equipo1 
      : resultadoFinal.jugadores.equipo2;
  };

  const getEquipoPerdedor = () => {
    return resultadoFinal.ganador === 1 
      ? resultadoFinal.jugadores.equipo2 
      : resultadoFinal.jugadores.equipo1;
  };

  const compartirResultado = async () => {
    const texto = `🏆 ¡Partido finalizado!
${resultadoFinal.torneo} - ${resultadoFinal.fase}

🥇 GANADORES: ${getEquipoGanador().join(' / ')}
🥈 Equipo rival: ${getEquipoPerdedor().join(' / ')}

📊 Resultado: ${resultadoFinal.resultado}
⏱️ Duración: ${resultadoFinal.duracion}
📅 ${resultadoFinal.fecha}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Resultado del Partido de Pádel',
          text: texto
        });
      } catch (error) {
        console.log('Error compartiendo:', error);
        copiarAlPortapapeles(texto);
      }
    } else {
      copiarAlPortapapeles(texto);
    }
  };

  const copiarAlPortapapeles = (texto) => {
    navigator.clipboard.writeText(texto).then(() => {
      alert('¡Resultado copiado al portapapeles!');
    }).catch(() => {
      alert('Error al copiar. Selecciona y copia manualmente.');
    });
  };

  if (!resultadoFinal) return null;

  return (
    <div className="resultado-final-overlay">
      <div className="resultado-final-modal">
        <div className="resultado-header">
          <h1>🏆 ¡PARTIDO FINALIZADO!</h1>
          <button className="btn-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <div className="resultado-content">
          <div className="resultado-info">
            <div className="torneo-info">
              <h2>{resultadoFinal.torneo}</h2>
              <h3>{resultadoFinal.fase}</h3>
              <p className="fecha">{resultadoFinal.fecha} • {resultadoFinal.duracion}</p>
            </div>

            <div className="equipos-resultado">
              <div className={`equipo ${resultadoFinal.ganador === 1 ? 'ganador' : 'perdedor'}`}>
                <h4>EQUIPO 1 {resultadoFinal.ganador === 1 ? '🏆' : ''}</h4>
                <div className="jugadores">
                  {resultadoFinal.jugadores.equipo1.map((jugador, idx) => (
                    <span key={idx} className="jugador">{jugador}</span>
                  ))}
                </div>
              </div>

              <div className="vs-resultado">
                <span className="resultado-final-score">{resultadoFinal.resultado}</span>
              </div>

              <div className={`equipo ${resultadoFinal.ganador === 2 ? 'ganador' : 'perdedor'}`}>
                <h4>EQUIPO 2 {resultadoFinal.ganador === 2 ? '🏆' : ''}</h4>
                <div className="jugadores">
                  {resultadoFinal.jugadores.equipo2.map((jugador, idx) => (
                    <span key={idx} className="jugador">{jugador}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="sets-detalle">
              <h4>Detalle por Sets</h4>
              <div className="sets-grid">
                {[0, 1, 2].map(setIdx => (
                  <div key={setIdx} className="set-score">
                    <span className="set-label">Set {setIdx + 1}</span>
                    <span className="set-result">
                      {resultadoFinal.sets[0][setIdx]} - {resultadoFinal.sets[1][setIdx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="qr-section">
            <h4>📱 Compartir Resultado</h4>
            <div className="qr-container">
              {qrCodeUrl && (
                <img src={qrCodeUrl} alt="QR Code del resultado" className="qr-code" />
              )}
            </div>
            <p className="qr-instructions">
              Escanea el QR para ver y compartir el resultado completo
            </p>
            {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
              <div className="network-notice">
                <p className="dev-info">
                  ℹ️ <strong>Acceso local:</strong> Para compartir con otros dispositivos, 
                  deben estar en la misma red WiFi
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="resultado-actions">
          <button className="btn-compartir" onClick={compartirResultado}>
            📤 Compartir Resultado
          </button>
          <button className="btn-nuevo-partido" onClick={onNuevoPartido}>
            🆕 Nuevo Partido
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultadoFinal;