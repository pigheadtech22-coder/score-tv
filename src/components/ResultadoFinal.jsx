import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import './ResultadoFinal.css';

const ResultadoFinal = ({ resultadoFinal, onCerrar, onNuevoPartido, onCompartirMarcador, onDescargarMarcador, onCapturarMarcadorLive, jugadores }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const resultadoRef = useRef(null);

  useEffect(() => {
    if (!resultadoFinal) return;

    // Esperar un poco para que el modal se renderice completamente
    const timer = setTimeout(async () => {
      await generarImagenYQR();
    }, 500);

    return () => clearTimeout(timer);
  }, [resultadoFinal]);

  const generarImagenYQR = async () => {
    try {
      // En lugar de capturar el modal, capturar el marcador en vivo
      console.log('📸 Generando imagen del marcador en vivo...');
      
      // Llamar a la función de captura del marcador del componente padre
      if (onCapturarMarcadorLive) {
        const imagenDataUrl = await onCapturarMarcadorLive();
        
        if (imagenDataUrl) {
          // Guardar imagen en el servidor
          try {
            const response = await fetch('/api/guardar-resultado', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imagen: imagenDataUrl,
                nombre: 'marcador-live.png'
              })
            });
            
            if (response.ok) {
              console.log('✅ Imagen del marcador en vivo guardada en servidor');
            }
          } catch (error) {
            console.error('❌ Error guardando imagen en servidor:', error);
          }

          // Generar QR con URL a la imagen guardada (servidor Express en puerto 3000)
          const baseUrl = window.location.protocol + '//' + window.location.hostname + ':3000';
          const urlImagen = `${baseUrl}/marcador-live.png?t=${Date.now()}`; // timestamp para evitar cache
          
          const qrDataUrl = await QRCode.toDataURL(urlImagen, {
            width: 200,
            margin: 2,
            color: {
              dark: '#1a2a4a',
              light: '#ffffff'
            }
          });

          setQrCodeUrl(qrDataUrl);
        }
      }
    } catch (error) {
      console.error('Error generando imagen y QR:', error);
    }
  };

  const descargarImagenResultado = async () => {
    try {
      if (!resultadoRef.current) return;

      // Generar imagen del resultado
      const canvas = await html2canvas(resultadoRef.current, {
        backgroundColor: '#1a2a4a',
        scale: 2, // Alta calidad
        useCORS: true,
        allowTaint: false,
        width: 800,
        height: 600
      });

      // Convertir a imagen y descargar
      const link = document.createElement('a');
      link.download = `resultado_${resultadoFinal.torneo}_${resultadoFinal.fecha.replace(/\//g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (error) {
      console.error('Error generando imagen:', error);
      alert('Error al generar la imagen. Inténtalo de nuevo.');
    }
  };

  const compartirResultado = async () => {
    try {
      if (!resultadoRef.current) return;

      // Generar imagen del modal completo con fotos de jugadores
      const canvas = await html2canvas(resultadoRef.current, {
        backgroundColor: '#1a2a4a',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        width: 800,
        height: 600
      });

      // Convertir a blob
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `resultado_${resultadoFinal.torneo}_${resultadoFinal.fecha.replace(/\//g, '-')}.png`, { type: 'image/png' });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          // API Web Share (móviles)
          await navigator.share({
            title: `Resultado ${resultadoFinal.torneo}`,
            text: `🏆 Resultado del partido - ${resultadoFinal.torneo}`,
            files: [file]
          });
        } else {
          // Fallback: descargar imagen
          const link = document.createElement('a');
          link.download = `resultado_${resultadoFinal.torneo}_${resultadoFinal.fecha.replace(/\//g, '-')}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
        }
      }, 'image/png');

    } catch (error) {
      console.error('Error compartiendo resultado:', error);
      alert('Error al compartir. La imagen se descargará automáticamente.');
      descargarImagenResultado();
    }
  };

  if (!resultadoFinal) return null;

  return (
    <div className="resultado-final-overlay">
      <div className="resultado-final-modal">
        <div className="resultado-header">
          <h1>🏆 ¡PARTIDO FINALIZADO!</h1>
          <button className="btn-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <div className="resultado-content" ref={resultadoRef}>
          <div className="resultado-info">
            <div className="torneo-info">
              <h2>{resultadoFinal.torneo}</h2>
              <h3>{resultadoFinal.fase}</h3>
              <p className="fecha">{resultadoFinal.fecha} • {resultadoFinal.duracion}</p>
            </div>

            <div className="equipos-resultado">
              <div className={`equipo ${resultadoFinal.ganador === 1 ? 'ganador' : 'perdedor'}`}>
                <div className="fotos-equipo">
                  {resultadoFinal.jugadores.equipo1.map((jugador, idx) => {
                    // Buscar el jugador en los datos para obtener su foto
                    const jugadorData = jugadores?.find(j => j.nombre === jugador);
                    let fotoSrc = jugadorData?.foto || '/jugadores/default.jpg';
                    
                    // Si la foto tiene .jpeg, cambiarla a la extensión real
                    if (fotoSrc.includes('.jpeg')) {
                      const nombreBase = fotoSrc.replace('.jpeg', '');
                      fotoSrc = nombreBase + '.png'; // La mayoría son .png
                    }
                    
                    return (
                      <div key={idx} className="foto-jugador">
                        <img 
                          src={fotoSrc}
                          alt={jugador}
                          onError={(e) => {
                            // Intentar con diferentes extensiones
                            const base = e.target.src.split('.').slice(0, -1).join('.');
                            if (e.target.src.includes('.png')) {
                              e.target.src = base + '.jpeg';
                            } else if (e.target.src.includes('.jpeg')) {
                              e.target.src = base + '.jpg';
                            } else {
                              e.target.src = '/jugadores/default.jpg';
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
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
                <div className="fotos-equipo">
                  {resultadoFinal.jugadores.equipo2.map((jugador, idx) => {
                    // Buscar el jugador en los datos para obtener su foto
                    const jugadorData = jugadores?.find(j => j.nombre === jugador);
                    let fotoSrc = jugadorData?.foto || '/jugadores/default.jpg';
                    
                    // Si la foto tiene .jpeg, cambiarla a la extensión real
                    if (fotoSrc.includes('.jpeg')) {
                      const nombreBase = fotoSrc.replace('.jpeg', '');
                      fotoSrc = nombreBase + '.png'; // La mayoría son .png
                    }
                    
                    return (
                      <div key={idx} className="foto-jugador">
                        <img 
                          src={fotoSrc}
                          alt={jugador}
                          onError={(e) => {
                            // Intentar con diferentes extensiones
                            const base = e.target.src.split('.').slice(0, -1).join('.');
                            if (e.target.src.includes('.png')) {
                              e.target.src = base + '.jpeg';
                            } else if (e.target.src.includes('.jpeg')) {
                              e.target.src = base + '.jpg';
                            } else {
                              e.target.src = '/jugadores/default.jpg';
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="jugadores">
                  {resultadoFinal.jugadores.equipo2.map((jugador, idx) => (
                    <span key={idx} className="jugador">{jugador}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="sets-y-qr">
            <div className="sets-detalle">
              <h4>📊 Detalle por Sets</h4>
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

            <div className="qr-section">
              <h4>📱 Marcador en Vivo</h4>
              <div className="qr-container">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="QR Code del marcador en vivo" className="qr-code" />
                )}
              </div>
              <p className="qr-instructions">
                Escanea para ver el marcador en vivo
              </p>
            </div>
          </div>
        </div>

        <div className="resultado-actions">
          <div className="actions-row">
            <h4 style={{color: '#ffd700'}}>📊 Imagen con Fotos</h4>
            <button className="btn-compartir" onClick={compartirResultado}>
              📤 Compartir
            </button>
            <button className="btn-descargar" onClick={descargarImagenResultado}>
              📷 Descargar
            </button>
          </div>
          
          <div className="actions-row">
            <h4 style={{color: '#4fc3f7'}}>🎾 Marcador Live</h4>
            <button className="btn-marcador-compartir" onClick={onCompartirMarcador}>
              🏆 Compartir
            </button>
            <button className="btn-marcador-descargar" onClick={onDescargarMarcador}>
              🖼️ Descargar
            </button>
          </div>

          <div className="actions-row">
            <h4 style={{color: '#90a4ae'}}>🆕 Opciones</h4>
            <button className="btn-nuevo-partido" onClick={onNuevoPartido}>
              Nuevo Partido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadoFinal;