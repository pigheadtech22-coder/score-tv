# Guía de Uso - Rol de Canchas de Padel

## Descripción
Este componente React muestra el rol de hasta 10 canchas de padel con información detallada de cada partido, incluyendo **múltiples horarios**, fases del torneo, categorías y jugadores. Permite navegar entre diferentes horarios manteniendo siempre las 10 canchas visibles en pantalla.

## Características

### 🏸 Información por Cancha
- **Número de cancha** (Cancha 1, Cancha 2, etc.)
- **Horario** del partido (seleccionable)
- **Fase del torneo** (Grupo A/B/C, Cuartos de Final, Semifinal, Final)
- **Categoría** (4ta, 5ta, 6ta)
- **Jugadores** de ambos equipos (Equipo A vs Equipo B)
- **Estado** del partido (Programado, En Juego, Finalizado)

### 🕐 **NUEVO: Selector de Horarios**
- **Navegación por horarios**: Selecciona entre diferentes horarios disponibles
- **Resumen visual**: Botones de horario con indicadores de estado
- **Selector desplegable**: En la barra de filtros para cambio rápido
- **10 canchas siempre visibles**: El layout se mantiene independiente del horario

### 🎯 Funcionalidades
- **Filtros por categoría** (4ta, 5ta, 6ta, todas)
- **Filtros por fase** (Grupos, Cuartos, Semifinales, Final, todas)
- **Selector de horario** con indicadores visuales de estado
- **Diseño responsive** que se adapta a diferentes tamaños de pantalla
- **Códigos de colores** para fácil identificación:
  - **Categorías**: Colores distintivos para cada categoría
  - **Fases**: Colores específicos para finales, semifinales, etc.
  - **Estados**: Fondo diferente según el estado del partido
  - **Horarios**: Indicadores de color para estados de partidos

### 🗂️ Nueva Estructura del JSON

El archivo `public/canchas-padel.json` ahora maneja múltiples horarios:

```json
{
  "fecha": "2025-10-11",
  "torneo": "Nombre del Torneo",
  "horarios": [
    {
      "horario": "09:00",
      "canchas": [
        {
          "id": 1,
          "numero": "Cancha 1",
          "fase": "Grupo A",
          "categoria": "6ta",
          "jugadores": {
            "equipoA": {
              "jugador1": "Nombre Jugador 1",
              "jugador2": "Nombre Jugador 2"
            },
            "equipoB": {
              "jugador1": "Nombre Jugador 3",
              "jugador2": "Nombre Jugador 4"
            }
          },
          "estado": "programado"
        }
        // ... 9 canchas más
      ]
    },
    {
      "horario": "10:30",
      "canchas": [
        // ... 10 canchas para este horario
      ]
    }
    // ... más horarios
  ]
}
```

### 📝 Cómo Actualizar los Datos

1. **Edita el archivo** `public/canchas-padel.json`
2. **Mantén la nueva estructura** con el array de `horarios`
3. **Cada horario debe tener exactamente 10 canchas** (numeradas del 1 al 10)
4. **Estados válidos**: "programado", "en_juego", "finalizado"
5. **Categorías válidas**: "4ta", "5ta", "6ta"
6. **Formatos de hora**: "HH:MM" (ej: "09:00", "15:30")

### 🎨 Nuevas Características de Diseño

#### Resumen de Horarios
- **Botones interactivos** para cada horario disponible
- **Indicadores de estado** con colores:
  - 🔵 Azul: Todos los partidos programados
  - 🟢 Verde: Hay partidos en juego
  - 🟣 Púrpura: Hay partidos finalizados
- **Horario activo** destacado con gradiente

#### Selector de Horario Integrado
- **Desplegable estilizado** en la barra de filtros
- **Fondo degradado** para destacar la importancia
- **Sincronización** con el resumen de horarios

### 🚀 Cómo Usar las Nuevas Funciones

1. **Cambiar horario**: 
   - Usa los botones en "Horarios Disponibles"
   - O selecciona desde el desplegable "Horario"
2. **Ver estado de horarios**: 
   - Los indicadores de color muestran el estado general
3. **Filtrar dentro de un horario**: 
   - Los filtros de categoría y fase funcionan por horario
4. **Navegación rápida**: 
   - Click en cualquier botón de horario para cambio instantáneo

### 💡 Consejos de Uso

- **Planificación**: Ve todos los horarios disponibles de un vistazo
- **Seguimiento**: Los indicadores te muestran qué horarios tienen actividad
- **Organización**: Cada horario mantiene las 10 canchas organizadas
- **Filtros combinados**: Usa horario + categoría + fase para búsquedas específicas
- **Responsive**: Todos los controles se adaptan a móviles

### 🔧 Ventajas del Nuevo Sistema

1. **🏆 Mismo layout**: Siempre 10 canchas visibles, sin importar el horario
2. **⚡ Navegación rápida**: Cambio instantáneo entre horarios
3. **📊 Vista general**: Resumen visual de todos los horarios
4. **🎯 Filtros potentes**: Combina horario con otros filtros
5. **📱 Móvil optimizado**: Funciona perfectamente en dispositivos pequeños

### 📱 Compatibilidad

- ✅ Todos los navegadores modernos
- ✅ Dispositivos móviles y tablets
- ✅ Pantallas grandes y pequeñas
- ✅ Navegación táctil optimizada

## Archivos del Componente

- `src/components/RolCanchas.jsx` - Componente principal con selector de horarios
- `src/components/RolCanchas.css` - Estilos optimizados para múltiples horarios
- `public/canchas-padel.json` - Datos estructurados por horarios