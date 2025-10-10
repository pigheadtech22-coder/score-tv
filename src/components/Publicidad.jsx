import { useEffect, useRef } from 'react';
import './Publicidad.css';

export default function Publicidad({ videos, onEnd, duracion = 30 }) {
  const videoRef = useRef();
  useEffect(() => {
    if (videos && videos[0]) {
      // Buscar el índice del video en el array original si es posible
      let idx = -1;
      if (window.videosPublicidadOriginal && Array.isArray(window.videosPublicidadOriginal)) {
        idx = window.videosPublicidadOriginal.indexOf(videos[0].replace('/videos/', ''));
      }
      console.log(`[Publicidad] Intentando reproducir [${idx !== -1 ? idx : '?'}]:`, videos[0]);
    }
  }, [videos]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onEnd) onEnd();
    }, duracion * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [duracion, onEnd]);

  if (!videos || !videos[0]) {
    return (
      <div className="publicidad" style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100vw',height:'100vh',background:'#222',color:'#fff',fontSize:'2rem'}}>
        No hay video de publicidad disponible
      </div>
    );
  }
  return (
    <div className="publicidad" style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100vw',height:'100vh',background:'#222'}}>
        <video
          ref={videoRef}
          src={videos[0]}
          autoPlay
          muted
          style={{width:'100vw',height:'100vh',objectFit:'contain',background:'#222'}}
          onEnded={() => {
            console.log('[Publicidad] Video ended:', videos[0]);
            if (onEnd) onEnd();
          }}
          onError={e => {
            console.error('[Publicidad] Error al reproducir:', videos[0], e);
          }}
        />
      {/* Puedes alternar videos si hay más de uno */}
    </div>
  );
}
