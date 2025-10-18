import './Jugador.css';

const defaultFoto = '/jugadores/default.jpg';

export default function Jugador({ nombre, foto, lado, server }) {
	const handleImgError = (e) => {
		// Si ya intentó con la imagen original, usar default
		if (e.target.src.includes('default.jpg')) {
			return;
		}
		
		const actualSrc = e.target.src;
		const base = actualSrc.replace(/\.(jpeg|jpg|png)$/i, '');
		
		// Intentar con diferentes extensiones
		if (actualSrc.includes('.png')) {
			e.target.src = base + '.jpeg';
		} else if (actualSrc.includes('.jpeg')) {
			e.target.src = base + '.jpg';
		} else {
			e.target.src = defaultFoto;
		}
	};

	// Función para formatear nombres con apellidos
	const formatearNombre = (nombreCompleto) => {
		// Validar que nombreCompleto no sea undefined, null o vacío
		if (!nombreCompleto || typeof nombreCompleto !== 'string') {
			return <span className="nombre-simple">JUGADOR</span>;
		}
		
		const partes = nombreCompleto.trim().split(' ');
		
		if (partes.length === 1) {
			// Solo un nombre: tamaño normal
			return <span className="nombre-simple">{nombreCompleto}</span>;
		} else {
			// Nombre + Apellido(s): primer parte más pequeña, resto más grande
			const primerNombre = partes[0];
			const apellidos = partes.slice(1).join(' ');
			
			return (
				<div className="nombre-compuesto">
					<span className="primer-nombre">{primerNombre}</span>
					<span className="apellidos">{apellidos}</span>
				</div>
			);
		}
	};

	return (
		<div className={`jugador ${lado}` + (server ? ' server' : '')}>
			<img src={foto} alt={nombre} className="foto-jugador" onError={handleImgError} />
			<div className="nombre-jugador">
				{formatearNombre(nombre)}
			</div>
		</div>
	);
}
