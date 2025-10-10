import React, { useState, useEffect } from "react";

export default function PanelControl() {
  const [tab, setTab] = useState('generales'); // Tabs: generales, jugadores, publicidad
  // General config states
  const configInicial = JSON.parse(localStorage.getItem('configMarcador')) || {};
  const [torneo, setTorneo] = useState(configInicial.torneo || '');
  const [fase, setFase] = useState(configInicial.fase || '');
  const [puntoOro, setPuntoOro] = useState(!!configInicial.puntoOro);
  const [superMuerteSubita, setSuperMuerteSubita] = useState(!!configInicial.superMuerteSubita);

  // Persist config and emit event
  useEffect(() => {
    const config = { torneo, fase, puntoOro, superMuerteSubita };
    localStorage.setItem('configMarcador', JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('configMarcadorChanged', { detail: config }));
  }, [torneo, fase, puntoOro, superMuerteSubita]);
  const [showSugerencias, setShowSugerencias] = useState([false, false, false, false]);
  const seleccionInicial = JSON.parse(localStorage.getItem('jugadoresMarcador')) || ["", "", "", ""];
  const [slot1, setSlot1] = useState(seleccionInicial[0] || '');
  const [slot2, setSlot2] = useState(seleccionInicial[1] || '');
  const [slot3, setSlot3] = useState(seleccionInicial[2] || '');
  const [slot4, setSlot4] = useState(seleccionInicial[3] || '');
  // Guardar selección en localStorage y emitir evento
  useEffect(() => {
    const seleccion = [slot1, slot2, slot3, slot4];
    localStorage.setItem('jugadoresMarcador', JSON.stringify(seleccion));
    window.dispatchEvent(new CustomEvent('jugadoresMarcadorChanged', { detail: seleccion }));
  }, [slot1, slot2, slot3, slot4]);
  // Helper para autocompletar
  function getSugerencias(valor, idx) {
    const v = valor.trim().toLowerCase();
    if (!v) return [];
    // Excluir jugadores ya seleccionados en otros slots
    const seleccionados = [slot1, slot2, slot3, slot4].filter((s, i) => i !== idx);
    return jugadores.filter(j =>
      j.nombre.toLowerCase().includes(v) && !seleccionados.includes(j.nombre)
    );
  }
  const [videos, setVideos] = useState([]);
  const [jugadores, setJugadores] = useState([]);

  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(() => setVideos([]));
  }, []);

  useEffect(() => {
    fetch('/api/jugadores')
      .then(res => res.json())
      .then(data => setJugadores(Array.isArray(data) ? data : []))
      .catch(() => setJugadores([]));
  }, []);

    const handleAddJugador = async (e) => {
      e.preventDefault();
      const nombre = e.target.elements.nombre.value.trim();
      const fotoFile = e.target.elements.foto.files[0];
      if (!nombre || !fotoFile) return;
      // Subir foto al backend y procesar fondo
      const formData = new FormData();
      formData.append('foto', fotoFile);
      const res = await fetch('/api/upload-jugador-foto', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        alert('Error al procesar la foto');
        return;
      }
      const data = await res.json();
      const nuevo = { id: Date.now(), nombre, foto: data.foto };
      const nuevosJugadores = [...jugadores, nuevo];
      setJugadores(nuevosJugadores);
      // Persistir en el backend
      await fetch('/api/update-jugadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jugadores: nuevosJugadores })
      });
      e.target.reset();
    };
  const handleUpload = async (e) => {
    e.preventDefault();
    const fileInput = e.target.elements.videoFile;
    if (!fileInput.files.length) return;
    const formData = new FormData();
    formData.append('video', fileInput.files[0]);
    try {
      const res = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        alert('Video subido correctamente');
        // Agregar el nuevo video a la lista y persistir
        const filename = fileInput.files[0].name.replace(/\.[^.]+$/, '.mp4');
        const newVideos = [...videos, filename];
        setVideos(newVideos);
        await fetch('/api/update-videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videos: newVideos })
        });
      } else {
        alert('Error al subir el video');
      }
  } catch {
      alert('Error de red al subir el video');
    }
  };

  // Eliminar video
  const handleDelete = async (video) => {
    if (!window.confirm(`¿Eliminar ${video}?`)) return;
    try {
      const res = await fetch(`/api/delete-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video })
      });
      if (res.ok) {
        const newVideos = videos.filter(v => v !== video);
        setVideos(newVideos);
        await fetch('/api/update-videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videos: newVideos })
        });
      } else {
        alert('Error al eliminar el video');
      }
    } catch {
      alert('Error de red al eliminar el video');
    }
  };

  // Cambiar orden de videos
  const handleMove = async (idx, dir) => {
    const newVideos = [...videos];
    const swapIdx = idx + dir;
    [newVideos[idx], newVideos[swapIdx]] = [newVideos[swapIdx], newVideos[idx]];
    setVideos(newVideos);
    await fetch('/api/update-videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videos: newVideos })
    });
  };

  function handleDeleteJugador(id) {
    if (!window.confirm('¿Eliminar este jugador?')) return;
    const nuevosJugadores = jugadores.filter(j => j.id !== id);
    setJugadores(nuevosJugadores);
    // Persistir en el backend
    fetch('/api/update-jugadores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jugadores: nuevosJugadores })
    });
  }

  return (
    <div className="panel-control-layout" style={{padding:'0 32px', marginTop:'104px'}}>
      <div style={{
        display:'flex',
        gap:16,
        marginBottom:24,
        position:'sticky',
        top:0,
        zIndex:1500,
        background:'#fff',
        borderBottom:'1px solid #ddd',
        padding:'8px 0'
      }}>
        <button onClick={()=>setTab('generales')} style={{padding:'8px 24px',fontWeight:'bold',background:tab==='generales'?'#1e90ff':'#eee',color:tab==='generales'?'#fff':'#222',borderRadius:8,border:'none'}}>Generales</button>
        <button onClick={()=>setTab('jugadores')} style={{padding:'8px 24px',fontWeight:'bold',background:tab==='jugadores'?'#1e90ff':'#eee',color:tab==='jugadores'?'#fff':'#222',borderRadius:8,border:'none'}}>Jugadores</button>
        <button onClick={()=>setTab('publicidad')} style={{padding:'8px 24px',fontWeight:'bold',background:tab==='publicidad'?'#1e90ff':'#eee',color:tab==='publicidad'?'#fff':'#222',borderRadius:8,border:'none'}}>Publicidad</button>
      </div>
      {tab === 'generales' && (
        <div style={{paddingTop:0, marginTop:0}}>
          <h3>Configuraciones Generales</h3>
          <div style={{marginBottom:24}}>
            <label style={{fontWeight:'bold',marginRight:12}}>Nombre del torneo:</label>
            <input type="text" style={{width:260,padding:'6px',fontSize:'1.1rem'}} placeholder="Ej: CIRCUITO APJ ETAPA 17"
              value={torneo} onChange={e => setTorneo(e.target.value)} />
          </div>
          <div style={{marginBottom:24}}>
            <label style={{fontWeight:'bold',marginRight:12}}>Fase:</label>
            <input type="text" style={{width:180,padding:'6px',fontSize:'1.1rem'}} placeholder="Ej: FINAL 1ERA"
              value={fase} onChange={e => setFase(e.target.value)} />
          </div>
          <div style={{marginBottom:24}}>
            <label style={{fontWeight:'bold',marginRight:12}}>
              <input type="checkbox" style={{marginRight:8}} checked={puntoOro} onChange={e => setPuntoOro(e.target.checked)} /> Punto de oro
            </label>
            <label style={{fontWeight:'bold',marginLeft:32}}>
              <input type="checkbox" style={{marginRight:8}} checked={superMuerteSubita} onChange={e => setSuperMuerteSubita(e.target.checked)} /> Super muerte súbita
            </label>
          </div>
          <h3>Jugadores en cancha</h3>
          {[slot1, slot2, slot3, slot4].map((slot, idx) => {
            const setSlot = [setSlot1, setSlot2, setSlot3, setSlot4][idx];
            const sugerencias = getSugerencias(slot, idx);
            const seleccionado = jugadores.find(j => j.nombre === slot);
            return (
              <div key={idx} style={{marginBottom:16, display:'flex', alignItems:'center', position:'relative'}}>
                <span style={{marginRight:12, fontWeight:'bold'}}>Jugador {idx+1}:</span>
                <input
                  type="text"
                  value={slot}
                  onChange={e => {
                    const nuevoValor = e.target.value;
                    if ([slot1, slot2, slot3, slot4].filter((s, i) => i !== idx).includes(nuevoValor)) {
                      setSlot('');
                    } else {
                      setSlot(nuevoValor);
                    }
                    setShowSugerencias(arr => arr.map((v, i) => i === idx ? true : v));
                  }}
                  onBlur={() => setTimeout(() => setShowSugerencias(arr => arr.map((v, i) => i === idx ? false : v)), 100)}
                  placeholder="Escribe nombre..."
                  style={{marginRight:12, width:180}}
                  autoComplete="off"
                />
                {slot && sugerencias.length > 0 && showSugerencias[idx] && (
                  <ul style={{
                    position: 'absolute',
                    background: '#f5f5f5',
                    color: '#222',
                    border: '1px solid #888',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    listStyle: 'none',
                    margin: 0,
                    padding: 4,
                    zIndex: 10,
                    top: 32,
                    left: 120
                  }}>
                    {sugerencias.slice(0,5).map(j => (
                      <li key={j.id} style={{
                        cursor: 'pointer',
                        padding: '4px 12px',
                        borderRadius: 4,
                        marginBottom: 2,
                        background: '#fff',
                        color: '#222'
                      }} onMouseDown={e => {
                        e.preventDefault();
                        setSlot(j.nombre);
                        setShowSugerencias(arr => arr.map((v, i) => i === idx ? false : v));
                      }}>
                        <span>{j.nombre}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {seleccionado && (
                  <span style={{display:'flex',alignItems:'center',marginLeft:12}}>
                    <JugadorFoto nombre={seleccionado.nombre} foto={seleccionado.foto} />
                    <span style={{fontWeight:'bold'}}>{seleccionado.nombre}</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
      {tab === 'jugadores' && (
        <div style={{paddingTop:0, marginTop:0}}>
          <h3>Jugadores</h3>
          <ul>
            {jugadores.length === 0 && <li>No hay jugadores disponibles</li>}
            {jugadores.map(j => (
              <li key={j.id} style={{display:'flex',alignItems:'center',marginBottom:8}}>
                <JugadorFoto nombre={j.nombre} foto={j.foto} />
                <span style={{fontWeight:'bold',fontSize:'1.2rem',flex:1}}>{j.nombre}</span>
                <button style={{marginLeft:8}} onClick={() => handleDeleteJugador(j.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddJugador} style={{marginTop:32, marginBottom:16}} encType="multipart/form-data">
            <label>
              Nombre:
              <input type="text" name="nombre" required style={{marginLeft:12}} />
            </label>
            <label style={{marginLeft:12}}>
              Foto:
              <input type="file" name="foto" accept="image/png,image/jpeg,image/jpg" required style={{marginLeft:12}} />
            </label>
            <button type="submit" style={{marginLeft:12}}>Agregar jugador</button>
          </form>
        </div>
      )}
      {tab === 'publicidad' && (
        <div style={{paddingTop:0, marginTop:0}}>
          <h3>Videos de Publicidad</h3>
          <ul>
            {videos.length === 0 && <li>No hay videos disponibles</li>}
            {videos.map((video, idx) => (
              <li key={video} style={{display:'flex',alignItems:'center',marginBottom:8}}>
                <video src={`/videos/${video}`} width={180} controls style={{verticalAlign:'middle'}} />
                <span style={{marginLeft:12,flex:1}}>{video}</span>
                <button onClick={() => handleDelete(video)} style={{marginLeft:8}}>Eliminar</button>
                <button onClick={() => handleMove(idx, -1)} disabled={idx===0} style={{marginLeft:8}}>↑</button>
                <button onClick={() => handleMove(idx, 1)} disabled={idx===videos.length-1} style={{marginLeft:4}}>↓</button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleUpload} style={{marginTop:32, marginBottom:16}}>
            <label>
              Subir nuevo video:
              <input type="file" name="videoFile" accept="video/mp4,video/webm,video/ogg" style={{marginLeft:12}} />
            </label>
            <button type="submit" style={{marginLeft:12}}>Subir</button>
          </form>
        </div>
      )}
    </div>
  );

  function JugadorFoto({ nombre, foto }) {
    const formatos = ['png', 'jpg', 'jpeg'];
    const base = foto.replace(/\.(jpeg|jpg|png)$/i, '');
    const [src, setSrc] = React.useState(foto);
    const intentos = React.useRef(0);
    const defaultFoto = '/jugadores/default.jpeg';
    const handleError = () => {
      if (intentos.current < formatos.length) {
        setSrc(base + '.' + formatos[intentos.current]);
        intentos.current++;
      } else {
        setSrc(defaultFoto);
      }
    };
    return (
      <img src={src} alt={nombre} style={{width:64,height:64,borderRadius:'50%',objectFit:'cover',marginRight:12}} onError={handleError} />
      );
    }
  }