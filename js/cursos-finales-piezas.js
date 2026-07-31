// js/cursos-finales-piezas.js — Lecciones interactivas para "Finales de Piezas Menores y Mates Técnicos"
(function() {
  'use strict';

  const PIECES_ENDGAME_COURSE = {
    id: 'finales-de-piezas',
    title: 'Finales de Piezas Menores y Mates Técnicos',
    subtitle: 'Alfil, Caballo, Dama y Mates Especiales con Alfil Exiliado, La Reina Negra y Martina',
    perspective: 'w',
    modules: [
      {
        id: 'mod-0',
        title: '1. El Mate de Alfil y Caballo',
        kicker: 'Módulo 1: La Prueba Táctica Suprema',
        heading: 'El Triángulo de Deletang y la Esquina Correcta',
        speech: '<p>¡El examen técnico más famoso del ajedrez! Soy <strong>Alfil Exiliado</strong> ♗. El mate de Alfil y Caballo solo se puede dar <strong>en la esquina del color de tu Alfil</strong>.</p><p>Usamos el <strong>Triángulo de Deletang</strong> para acorralar al Rey rival y obligarlo a viajar hacia la casilla del mismo color que nuestro alfil.</p>',
        fen: '7k/7p/2B1NK2/8/8/8/8/8 w - - 0 1',
        pgn: '1. Be8 Kg8 2. Bf7+ Kh8 3. Ng5 h6 4. Ne6 Kh7 5. Bg6+ Kh8 6. Kf7 h5 7. Bxh5 Kh7 8. Bg6+ Kh8 9. Nf8 h4 10. Ne6 h3 11. Ng5 h2 12. Be4 h1=Q 13. Bxh1',
        highlightMove: 'Bxh1',
        martinaQuote: '«Regla de Alfil y Caballo: El Rey enemigo solo puede ser acorralado en la esquina del mismo color de tu Alfil».',
        points: [
          '<strong>Esquina Correcta:</strong> El mate exige la casilla del color de tu alfil.',
          '<strong>Triángulo de Deletang:</strong> Red de contención coordinada entre Caballo y Alfil.',
          '<strong>13. Bxh1:</strong> Eliminación del peón y acorralamiento final.'
        ]
      },
      {
        id: 'mod-1',
        title: '2. El Mate de Dos Alfiles',
        kicker: 'Módulo 2: Las Diagonales Paralelas',
        heading: 'Barrer el Tablero con La Reina Negra',
        speech: '<p>Soy <strong>La Reina Negra</strong> 👑. Dos Alfiles juntos son una excavadora imbatible: colocados uno al lado del otro en diagonales paralelas, crean una barrera insuperable.</p><p>Empujamos al Rey enemigo hacia la orilla y ejecutamos el mate en la esquina en menos de 15 jugadas.</p>',
        fen: '5k2/8/5K2/3BB3/8/8/8/8 w - - 0 1',
        pgn: '1. Bc6 Kg8 2. Kg6 Kf8 3. Bd6+ Kg8 4. Bd5+ Kh8 5. Be5#',
        highlightMove: 'Be5#',
        martinaQuote: '«5. Be5#: Dos alfiles paralelos son como dos rayos láser: cierran todas las salidas y empujan al rey rival al mate final».',
        points: [
          '<strong>Diagonales Paralelas:</strong> Los alfiles contiguos impiden que el rey cruce.',
          '<strong>Empuje Coordinado:</strong> Avance del rey atacante para estrechar el cerco.',
          '<strong>5. Be5#:</strong> Mate de esquina perfecto con ambos alfiles.'
        ]
      },
      {
        id: 'mod-2',
        title: '3. Alfiles de Distinto Color',
        kicker: 'Módulo 3: La Fortaleza Impregnable',
        heading: 'Por Qué los Alfiles de Distinto Color Tienden a Tablas',
        speech: '<p>Soy <strong>Peon-Rueda</strong> 🛞. Cuando en el final un jugador tiene alfil de casillas blancas y el otro de casillas negras, la partida tiende fuertemente a <strong>Tablas</strong>, ¡incluso con 2 peones de desventaja!</p><p>El bando defensor coloca sus peones en el color de su propio alfil y crea una fortaleza imposible de romper.</p>',
        fen: '4b3/4k3/8/3KP3/2B2P2/8/8/8 w - - 0 1',
        pgn: '1. f5 Bf7+ 2. e6 Bh5 3. Ke5 Bd1 4. f6+ Kf8 5. Kd6 Ba4 6. Bd5 Be8 7. e7#',
        highlightMove: 'e7#',
        martinaQuote: '«Alfiles de distinto color: El atacante no puede expulsar al defensor de las casillas que su alfil no controla».',
        points: [
          '<strong>Inmunidad de Casillas:</strong> El alfil rival no puede tocar las casillas del tuyo.',
          '<strong>Tendencia de Tablas:</strong> Altísimo porcentaje de empate en finales limpios.',
          '<strong>7. e7#:</strong> Ruptura de mate cuando el rey defensor queda sin casillas.'
        ]
      },
      {
        id: 'mod-3',
        title: '4. El Mate de Dama (Achicamiento)',
        kicker: 'Módulo 4: El Paso de Caballo de la Dama',
        heading: 'La Sombra Achicadora de la Dama con Martina',
        speech: '<p>Soy <strong>Martina</strong> ♕. El mate de Dama y Rey es el más rápido de aprender: la Dama imita los saltos de un caballo colocándose a distancia en L del Rey enemigo, cerrándole la caja automáticamente en cada paso.</p><p>Una vez acorralado en la orilla, tu Rey se acerca y la Dama da el <strong>Beso de la Muerte</strong> pegada al rey rival.</p>',
        fen: '8/8/4k3/8/3Q4/2K5/8/8 w - - 0 1',
        pgn: '1. Qe4+ Kf6 2. Kd4 Kg5 3. Ke5 Kh6 4. Qg2 Kh7 5. Kf6 Kh8 6. Qg7#',
        highlightMove: 'Qg7#',
        martinaQuote: '«6. Qg7#: Sombra Achicadora. La Dama sigue al Rey a salto de caballo y culmina con el Beso de la Muerte».',
        points: [
          '<strong>Distancia de Caballo:</strong> Mantener la Dama a paso de caballo para achicar la caja.',
          '<strong>Cuidado con el Ahogado:</strong> Dejar siempre al menos una casilla libre para el rey rival.',
          '<strong>6. Qg7#:</strong> Beso de la Muerte en el borde.'
        ]
      },
      {
        id: 'mod-4',
        title: '5. Mate de la Escalera (Dos Torres)',
        kicker: 'Módulo 5: Barrer el Tablero',
        heading: 'La Escalera Implacable con Torreta',
        speech: '<p>Soy <strong>Torreta</strong> 🏰. Con <strong>Dos Torres</strong> (o Dama y Torre), no necesitas ayuda de tu Rey: las dos torres barren el tablero paso a paso como si subieran una escalera.</p><p>Una torre controla la fila de escape mientras la otra da jaque en la fila siguiente, empujando al rey a la orilla final.</p>',
        fen: '8/8/8/4k3/8/8/1R6/R6K w - - 0 1',
        pgn: '1. Ra4 Kd5 2. Rb5+ Kc6 3. Rh5 Kb6 4. Rg4 Kc6 5. Rg6+ Kd7 6. Rh7+ Ke8 7. Rg8#',
        highlightMove: 'Rg8#',
        martinaQuote: '«7. Rg8#: Mate de la Escalera. Una torre corta el paso y la otra da el jaque hasta el remate final».',
        points: [
          '<strong>Mecánica de Escalera:</strong> Una torre fija la barrera, la otra empuja.',
          '<strong>Independencia del Rey:</strong> No hace falta mover al rey propio.',
          '<strong>7. Rg8#:</strong> Jaque mate implacable en la octava fila.'
        ]
      }
    ]
  };

  window.CURRENT_COURSE_DATA = PIECES_ENDGAME_COURSE;
})();
