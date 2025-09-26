import './Jugador.css';

const defaultFoto = '/jugadores/default.jpeg';
const formatos = ['jpeg', 'jpg', 'png'];

export default function Jugador({ nombre, foto, lado, server }) {
	let intentos = 0;
	const handleImgError = (e) => {
		const actualSrc = e.target.src;
		const base = actualSrc.replace(/\.(jpeg|jpg|png)$/i, '');
		if (intentos < formatos.length) {
			e.target.src = base + '.' + formatos[intentos];
			intentos++;
		} else {
			e.target.src = defaultFoto;
		}
	};
	return (
		<div className={`jugador ${lado}` + (server ? ' server' : '')}>
			<img src={foto} alt={nombre} className="foto-jugador" onError={handleImgError} />
			<div className="nombre-jugador">{nombre}</div>
		</div>
	);
}
