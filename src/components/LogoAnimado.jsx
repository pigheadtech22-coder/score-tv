import React, { useEffect } from 'react';

export default function LogoAnimado({ onAnimationStart, onAnimationEnd }) {
  useEffect(() => {
    if (onAnimationStart) onAnimationStart();
    const timer = setTimeout(() => {
      if (onAnimationEnd) onAnimationEnd();
    }, 3000); // 3 seconds animation
    return () => clearTimeout(timer);
  }, [onAnimationStart, onAnimationEnd]);

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100vw', height: '100vh', background: 'rgba(34,34,34,0.95)', zIndex: 2000,
      position: 'fixed', top: 0, left: 0
    }}>
      <img
        src={'/jugadores/logo.png'}
        alt="Logo animado"
        style={{
          width: '30vw', height: '30vw',
          animation: 'spin 3s linear',
          filter: 'drop-shadow(0 0 40px #fff)',
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg) scale(1); opacity: 0.5; }
          50% { transform: rotate(180deg) scale(1.2); opacity: 1; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
