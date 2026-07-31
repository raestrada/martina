// js/cursos-finales-torres.js — Lecciones interactivas para "Finales de Torres: Lucena y Philidor"
(function() {
  'use strict';

  const ROOK_ENDGAME_COURSE = {
    id: 'finales-de-torres',
    title: 'Finales de Torres: Lucena y Philidor',
    subtitle: 'El Dominio de las Torres con Torreta, La Reina Negra y Martina',
    perspective: 'w',
    modules: [
      {
        id: 'mod-0',
        title: '1. Cortar al Rey Enemigo',
        kicker: 'Módulo 1: La Muralla Incombustible',
        heading: 'Cortar el Paso del Rey con la Torre',
        speech: '<p>¡Bienvenido al curso de torres! Soy <strong>Torreta</strong> 🏰. La primera regla sagrada de los finales de torres es <strong>cortar el paso al Rey enemigo</strong> a lo largo de una columna o fila.</p><p>Colocar tu torre en la columna e o fila 7 impide que el Rey enemigo se acerque a defender o fregar a tus peones pasados.</p>',
        fen: '7r/R7/2k5/4P3/4K3/8/8/8 w - - 0 1',
        pgn: '1. e6 Kd6 2. Ra6+ Ke7 3. Ke5 Rh5+ 4. Kd4 Rh6 5. Kd5',
        highlightMove: 'Kd5',
        martinaQuote: '«Cortar al Rey rival con la torre es como poner un candado en la puerta: ¡no puede intervenir en la batalla!».',
        points: [
          '<strong>Cortar la Columna:</strong> Tu torre bloquea el avance del rey hacia el centro.',
          '<strong>Aislación Posicional:</strong> El rey enemigo queda fuera de la zona crítica.',
          '<strong>5. Kd5:</strong> Avance victorioso del rey propio.'
        ]
      },
      {
        id: 'mod-1',
        title: '2. La Posición de Lucena (1697)',
        kicker: 'Módulo 2: El Rey de los Finales de Torre',
        heading: 'Construir el Puente de Lucena para Ganar',
        speech: '<p>La <strong>Posición de Lucena (1697)</strong> es la técnica ganadora más importante de toda la historia del ajedrez. Cuando tenemos un peón en 7ª fila y nuestro rey está atrapado frente a él, <strong>Construimos el Puente</strong> con la Torre.</p><p>Ubicamos la torre en la 4ª fila (<span class="move-pill">1. Ra4!</span>). Tras apartar nuestro rey, la torre se interposes como un escudo contra los jaques enemigos permitiendo coronar.</p>',
        fen: '3K4/3P1k2/8/8/8/8/7r/R7 w - - 0 1',
        pgn: '1. Ra4 Rh1 2. Kc7 Rc1+ 3. Kd6 Rd1+ 4. Kc6 Rc1+ 5. Kd5 Ke7 6. Re4+ Kxd7',
        highlightMove: 'Kxd7',
        martinaQuote: '«El Puente de Lucena (1697): Colocas la Torre en 4ª fila y la usas como un escudo para bloquear los jaques del rival y coronar».',
        points: [
          '<strong>Posición de Lucena:</strong> Peón en 7ª fila con Rey al frente.',
          '<strong>Torre en 4ª Fila (Ra4):</strong> Preparar la barrera de protección.',
          '<strong>Construir el Puente:</strong> Interponer la torre frente a los jaques continuos para ganar.'
        ]
      },
      {
        id: 'mod-2',
        title: '3. La Posición de Philidor (1777)',
        kicker: 'Módulo 3: La Defensa Inexpugnable',
        heading: 'La Muralla de la 3ª Fila con La Reina Negra',
        speech: '<p>Soy <strong>La Reina Negra</strong> 👑 y te enseño la técnica defensiva suprema: <strong>La Posición de Philidor (1777)</strong>.</p><p>Cuando el rival ataca con Torre y Peón, ubicamos nuestra Torre en la <strong>3ª fila</strong> (<span class="move-pill">1... Rb8!</span>) impidiendo que su rey avance. ¡En cuanto el peón enemigo avanza a 6ª fila, llevamos nuestra Torre a la 1ª fila y lanzamos jaques infinitos por la espalda!</p>',
        fen: '4k3/R7/1r2K3/4P3/8/8/8/8 b - - 0 1',
        pgn: '1... Rb8 2. Kd6 Rb6+ 3. Kc5 Re6 4. Kd5 Rb6 5. e6 Rb1',
        highlightMove: 'Rb1',
        martinaQuote: '«Defensa Philidor: Torre en 3ª fila impidiendo el avance del rey. Si el peón avanza a e6, bajas a 1ª fila y das jaques infinitos por detrás».',
        points: [
          '<strong>Defensa Philidor (1777):</strong> Mantiene tablas garantizadas contra Torre y Peón.',
          '<strong>Barrera en 3ª Fila:</strong> La torre impide que el rey enemigo gane espacio.',
          '<strong>5... Rb1:</strong> Paso crucial a la 1ª fila para jaques infinitos.'
        ]
      },
      {
        id: 'mod-3',
        title: '4. Mate de Torre y Rey',
        kicker: 'Módulo 4: El Baile de la Pared',
        heading: 'Acorralar al Rey en la Orilla del Tablero',
        speech: '<p>Soy <strong>Caballo de Ŋ</strong> 🐴. El mate de Rey y Torre contra Rey solo es posible <strong>empujando al Rey enemigo hacia una de las 4 orillas del tablero</strong>.</p><p>Usamos a nuestro Rey para cerrar el paso frontal y a la Torre para cortar las filas hasta dar el mate del pasillo.</p>',
        fen: '4k3/R7/4K3/8/8/8/8/8 w - - 0 1',
        pgn: '1. Ra8#',
        highlightMove: 'Ra8#',
        martinaQuote: '«1. Ra8#: Mate directo de la Torre en la octava fila aprovechando el bloqueo frontal del Rey».',
        points: [
          '<strong>Achicar la Caja:</strong> Reducir el espacio de movimiento del rey rival.',
          '<strong>Oposición de Reyes:</strong> Colocar a tu rey enfrente para bloquear salidas.',
          '<strong>1. Ra8#:</strong> Jaque Mate limpio en la orilla.'
        ]
      },
      {
        id: 'mod-4',
        title: '5. La Regla de Tarrasch',
        kicker: 'Módulo 5: Colocar la Torre Detrás',
        heading: 'Torres Detrás de Peones Pasados',
        speech: '<p>El Gran Maestro Siegbert Tarrasch formuló una regla dorada: <strong>«Las torres deben colocarse siempre DETRÁS de los peones pasados, ya sean propios o del rival»</strong>.</p><p>Si la torre está detrás de tu peón pasado, gana espacio a medida que el peón avanza. Si está detrás del peón rival, lo frena sin perder alcance.</p>',
        fen: '8/r7/P4k2/8/8/5K2/8/R7 w - - 0 1',
        pgn: '1. Ke4 Ke6 2. Kd4 Kd6 3. Kc4 Kc6 4. Kb4 Kb6 5. Ra5',
        highlightMove: 'Ra5',
        martinaQuote: '«Regla de Tarrasch: Torre detrás del peón pasado SIEMPRE. Ganas poder a cada paso que da».',
        points: [
          '<strong>Regla de Tarrasch:</strong> Ubicar la torre detrás del peón en movimiento.',
          '<strong>Aumento del Radio de Acción:</strong> La torre gana libertad a medida que el peón avanza.',
          '<strong>Frenar Peones Rivales:</strong> Si el peón es enemigo, la torre lo vigila por la espalda.'
        ]
      },
      {
        id: 'mod-5',
        title: '6. Fischer vs Spassky (1972)',
        kicker: 'Módulo 6: El Final del Siglo',
        heading: 'Bobby Fischer (Reikiavik 1972 - Partida 21)',
        speech: '<p>Cerramos con la partida histórica que le dio a <strong>Bobby Fischer el Campeonato Mundial</strong> en Reikiavik 1972 frente a Boris Spassky.</p><p>Fischer activó su Torre en la 7ª fila desatando el avance aplastante de su peón pasado hasta forzar la coronación.</p>',
        fen: '8/5k2/p1n1p2p/1p3k1p/1P1p1P1P/3K4/8/8 b - - 0 1',
        pgn: '1... Kxf4 2. Ke2 e5 3. Kd3 e4+ 4. Ke2 d3+ 5. Kd2',
        highlightMove: 'Kd2',
        martinaQuote: '«Bobby Fischer demuestra el triunfo definitivo del avance de peones pasados en finales de torres».',
        points: [
          '<strong>Fischer vs Spassky (1972):</strong> Partida 21 del Mach del Siglo.',
          '<strong>Activación de Torre y Peones Pasados:</strong> Avance coordinado imparable.',
          '<strong>5. Kd2:</strong> Dominio absoluto del centro.'
        ]
      }
    ]
  };

  window.CURRENT_COURSE_DATA = ROOK_ENDGAME_COURSE;
})();
