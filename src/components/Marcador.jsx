import Jugador from './Jugador';
import './Marcador.css';

// Icono de pelota de padel SVG
const PadelBall = () => (
	<svg className="padel-ball-efecto" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="12" cy="12" r="10" fill="#ffd700" stroke="#fff" strokeWidth="2" />
		<path d="M7 7 Q12 12 17 17" stroke="#fff" strokeWidth="2" fill="none" />
	</svg>
);

export default function Marcador({ 
  player1, 
  player2, 
  score1, 
  score2, 
  set, 
  server, 
  jugadores, 
  sets = [ [0,0,0], [0,0,0] ], 
  matchTime = '00:32:25', 
  goldenPoint = true, 
  tieBreakMode = false, 
  tieBreakScore1 = 0, 
  tieBreakScore2 = 0,
  torneo = "TORNEO PÁDEL",
  fase = "SEMIFINAL"
}) {
		const pareja1 = Array.isArray(player1) ? player1 : [player1];
		const pareja2 = Array.isArray(player2) ? player2 : [player2];
		const jugadores1 = pareja1.map(nombre => jugadores.find(j => j.nombre === nombre));
		const jugadores2 = pareja2.map(nombre => jugadores.find(j => j.nombre === nombre));
	// Highlight amarillo solo si ambos scores son 40 y goldenPoint está activo
	const isGoldenPoint = score1 === 40 && score2 === 40 && goldenPoint;

			return (
				<div className="marcador-layout">
					<div className="marcador-header">
						<div className="marcador-title">{torneo}</div>
						<div className="marcador-subtitle">{fase}</div>
					</div>
			<table className="marcador-table">
				<thead>
					<tr>
						<th colSpan={2}> </th>
						<th className={set === 1 ? "set-header-activo" : ""}>SET 1</th>
						<th className={set === 2 ? "set-header-activo" : ""}>SET 2</th>
						<th className={set === 3 ? "set-header-activo" : ""}>SET 3</th>
																		{tieBreakMode ? (
																			<th style={{color:'#fff',background:'#d32f2f',minWidth:'60px',fontWeight:'bold',fontSize:'1.5rem',padding:'4px 8px'}}>TIE BREAK</th>
																		) : (
																			<th style={{minWidth:'90px',fontSize:'2.5rem',padding:'8px 12px'}}>GAME</th>
																		)}
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="marcador-jugadores-equipo">
							<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
								<div style={{width: 48, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
									{server === 1 && <PadelBall />}
								</div>
								<div className="marcador-nombre">
									<Jugador nombre={jugadores1[0]?.nombre} foto={jugadores1[0]?.foto} lado="izq" server={server === 1} />
								</div>
								<div className="marcador-nombre">
									<Jugador nombre={jugadores1[1]?.nombre} foto={jugadores1[1]?.foto} lado="izq" server={false} />
								</div>
							</div>
						</td>
						<td></td>
						<td className={set === 1 ? "set-activo" : ""} data-block={set === 1 ? "true" : undefined}>{sets[0][0]}</td>
						<td className={set === 2 ? "set-activo" : ""} data-block={set === 2 ? "true" : undefined}>{sets[0][1]}</td>
						<td className={set === 3 ? "set-activo" : ""} data-block={set === 3 ? "true" : undefined}>{sets[0][2]}</td>
																					{tieBreakMode ? (
																						<td className="marcador-game" style={{background:'#d32f2f',color:'#fff',fontWeight:'bold',fontSize:'2rem',minWidth:'60px',padding:'4px 8px'}}>{tieBreakScore1}</td>
																					) : (
																						<td className={isGoldenPoint ? "marcador-game golden-point" : "marcador-game"} style={{minWidth:'90px',fontSize:'3rem',padding:'8px 12px'}}>{score1}</td>
																					)}
					</tr>
					<tr>
						<td className="marcador-jugadores-equipo">
							<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
								<div style={{width: 48, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
									{server === 2 && <PadelBall />}
								</div>
								<div className="marcador-nombre">
									<Jugador nombre={jugadores2[0]?.nombre} foto={jugadores2[0]?.foto} lado="der" server={server === 2} />
								</div>
								<div className="marcador-nombre">
									<Jugador nombre={jugadores2[1]?.nombre} foto={jugadores2[1]?.foto} lado="der" server={false} />
								</div>
							</div>
						</td>
						<td></td>
						<td className={set === 1 ? "set-activo" : ""} data-block={set === 1 ? "true" : undefined}>{sets[1][0]}</td>
						<td className={set === 2 ? "set-activo" : ""} data-block={set === 2 ? "true" : undefined}>{sets[1][1]}</td>
						<td className={set === 3 ? "set-activo" : ""} data-block={set === 3 ? "true" : undefined}>{sets[1][2]}</td>
																					{tieBreakMode ? (
																						<td className="marcador-game" style={{background:'#d32f2f',color:'#fff',fontWeight:'bold',fontSize:'2rem',minWidth:'60px',padding:'4px 8px'}}>{tieBreakScore2}</td>
																					) : (
																						<td className={isGoldenPoint ? "marcador-game golden-point" : "marcador-game"} style={{minWidth:'90px',fontSize:'3rem',padding:'8px 12px'}}>{score2}</td>
																					)}
					</tr>
				</tbody>
			</table>
				<div className="marcador-footer">
					<div className="marcador-matchtime">
						MATCH TIME<br />
						<span>{matchTime}</span>
					</div>
				</div>
			</div>
		);
}
