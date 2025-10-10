import { useEffect, useRef } from 'react';
import './Publicidad.css';

export default function Publicidad({ videos, onEnd, duracion = 30 }) {
  const videoRef = useRef();

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
            console.log('Publicidad video ended');
            if (onEnd) onEnd();
          }}
        />
      {/* Puedes alternar videos si hay más de uno */}
    </div>
  );
}
