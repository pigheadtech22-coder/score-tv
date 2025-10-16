import React, { useState, useEffect } from 'react';
import './RolCanchas.css';

const RolCanchas = () => {
  const [datosCompletos, setDatosCompletos] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroFase, setFiltroFase] = useState('todas');

  useEffect(() => {
    // Cargar datos desde el JSON
    const cargarDatos = async () => {
      try {
        const response = await fetch('/canchas-padel.json');
        const data = await response.json();
        setDatosCompletos(data);
        
        // Seleccionar el primer horario por defecto
        if (data.horarios && data.horarios.length > 0) {
          const primerHorario = data.horarios[0].horario;
          setHorarioSeleccionado(primerHorario);
          setCanchas(data.horarios[0].canchas);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Actualizar canchas cuando cambia el horario seleccionado
  useEffect(() => {
    if (datosCompletos && horarioSeleccionado) {
      const horarioData = datosCompletos.horarios.find(h => h.horario === horarioSeleccionado);
      if (horarioData) {
        setCanchas(horarioData.canchas);
      }
    }
  }, [horarioSeleccionado, datosCompletos]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'programado':
        return '#e3f2fd'; // Azul claro
      case 'en_juego':
        return '#e8f5e8'; // Verde claro
      case 'finalizado':
        return '#f3e5f5'; // Púrpura claro
      default:
        return '#f5f5f5';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'programado':
        return 'Programado';
      case 'en_juego':
        return 'En Juego';
      case 'finalizado':
        return 'Finalizado';
      default:
        return 'Sin Estado';
    }
  };

  const getCategoriaColor = (categoria) => {
    switch (categoria) {
      case '4ta':
        return '#ff6b6b';
      case '5ta':
        return '#4ecdc4';
      case '6ta':
        return '#45b7d1';
      default:
        return '#95a5a6';
    }
  };

  const getFaseColor = (fase) => {
    if (fase.includes('Final')) return '#e74c3c';
    if (fase.includes('Semifinal')) return '#f39c12';
    if (fase.includes('Cuartos')) return '#e67e22';
    return '#3498db'; // Para grupos
  };

  const canchasFiltradas = canchas.filter(cancha => {
    const pasaFiltroCategoria = filtroCategoria === 'todas' || cancha.categoria === filtroCategoria;
    const pasaFiltroFase = filtroFase === 'todas' || cancha.fase.toLowerCase().includes(filtroFase.toLowerCase());
    return pasaFiltroCategoria && pasaFiltroFase;
  });

  if (loading) {
    return <div className="loading">Cargando rol de canchas...</div>;
  }

  if (!datosCompletos || !datosCompletos.horarios || datosCompletos.horarios.length === 0) {
    return <div className="loading">No hay datos disponibles</div>;
  }

  return (
    <div className="rol-canchas-container">
      <div className="header">
        <h1>Rol de Canchas de Padel</h1>
        <p className="fecha">{datosCompletos.torneo} - {new Date().toLocaleDateString('es-ES')}</p>
      </div>

      {/* Filtros */}
      <div className="filtros">
        <div className="filtro-grupo">
          <label>Horario:</label>
          <select 
            value={horarioSeleccionado} 
            onChange={(e) => setHorarioSeleccionado(e.target.value)}
            className="selector-horario"
          >
            {datosCompletos.horarios.map(horario => (
              <option key={horario.horario} value={horario.horario}>
                {horario.horario}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filtro-grupo">
          <label>Categoría:</label>
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="4ta">4ta</option>
            <option value="5ta">5ta</option>
            <option value="6ta">6ta</option>
          </select>
        </div>
        
        <div className="filtro-grupo">
          <label>Fase:</label>
          <select value={filtroFase} onChange={(e) => setFiltroFase(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="grupo">Grupos</option>
            <option value="cuartos">Cuartos</option>
            <option value="semifinal">Semifinales</option>
            <option value="final">Final</option>
          </select>
        </div>
      </div>

      {/* Resumen de Horarios */}
      <div className="resumen-horarios">
        <h3>Horarios Disponibles:</h3>
        <div className="horarios-disponibles">
          {datosCompletos.horarios.map(horario => (
            <button
              key={horario.horario}
              className={`boton-horario ${horarioSeleccionado === horario.horario ? 'activo' : ''}`}
              onClick={() => setHorarioSeleccionado(horario.horario)}
            >
              <span className="hora">{horario.horario}</span>
              <span className="info-horario">
                {horario.canchas.filter(c => c.estado === 'en_juego').length > 0 && (
                  <span className="estado-indicador en-juego">●</span>
                )}
                {horario.canchas.filter(c => c.estado === 'finalizado').length > 0 && (
                  <span className="estado-indicador finalizado">●</span>
                )}
                {horario.canchas.filter(c => c.estado === 'programado').length === horario.canchas.length && (
                  <span className="estado-indicador programado">●</span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Canchas */}
      <div className="canchas-grid">
        {canchasFiltradas.map(cancha => (
          <div 
            key={cancha.id} 
            className="cancha-card"
            style={{ backgroundColor: getEstadoColor(cancha.estado) }}
          >
            <div className="cancha-header">
              <h3 className="cancha-numero">{cancha.numero}</h3>
              <div className="horario">{horarioSeleccionado}</div>
            </div>

            <div className="cancha-info">
              <div className="info-row">
                <span 
                  className="categoria-badge"
                  style={{ backgroundColor: getCategoriaColor(cancha.categoria) }}
                >
                  {cancha.categoria} Categoría
                </span>
                <span 
                  className="fase-badge"
                  style={{ backgroundColor: getFaseColor(cancha.fase) }}
                >
                  {cancha.fase}
                </span>
              </div>

              <div className="jugadores-section">
                <div className="equipo">
                  <h4>Equipo A</h4>
                  <p>{cancha.jugadores.equipoA.jugador1}</p>
                  <p>{cancha.jugadores.equipoA.jugador2}</p>
                </div>
                
                <div className="vs-divider">VS</div>
                
                <div className="equipo">
                  <h4>Equipo B</h4>
                  <p>{cancha.jugadores.equipoB.jugador1}</p>
                  <p>{cancha.jugadores.equipoB.jugador2}</p>
                </div>
              </div>

              <div className="estado-badge">
                {getEstadoTexto(cancha.estado)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {canchasFiltradas.length === 0 && (
        <div className="no-resultados">
          No se encontraron canchas con los filtros seleccionados.
        </div>
      )}
    </div>
  );
};

export default RolCanchas;