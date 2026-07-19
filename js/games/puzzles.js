// js/games/puzzles.js — Chess Puzzles (Táctica) module
// Implements interactive puzzles with points, streaks, character commentary, and speech/sounds.

(function() {
  class PuzzlesGame {
    constructor() {
      // 1. Puzzle Database (34 Puzzles: 6x M1, 12x M2, 9x M3, 7x M4)
      this.puzzles = [
        {
          id: 'p1',
          difficulty: 1,
          title: 'El Mate Escolar',
          desc: 'Martina y Peoncito están estudiando la apertura. El oponente se descuidó... ¡gana de inmediato!',
          fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
          solution: ['h5f7'],
          character: 'peoncito',
          quotes: {
            greeting: '¡Mira esto! El rey oponente no se abrochó bien el cinturón. ¡Mate en uno!',
            success: '¡Eso es! ¡El pasillo quedó completamente sellado!',
            fail: '¡No! Mi bigote falso se despegó del susto con esa jugada. ¡Prueba otra vez!',
            solved: '¡Excelente! Has encontrado el mate escolar perfecto.'
          }
        },
        {
          id: 'p2',
          difficulty: 1,
          title: 'El Pasillo de la Torre',
          desc: 'El rey negro se ha quedado sin salida detrás de sus propios peones. ¡Aprovecha la columna abierta!',
          fen: '3r2k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1',
          solution: ['d1d8'],
          character: 'peoncito',
          quotes: {
            greeting: '¡Mira, mira! El rey enemigo se olvidó de abrir la ventana. ¡Mate en uno!',
            success: '¡Eso es! ¡El pasillo quedó completamente sellado!',
            fail: '¡No! Le diste aire para escapar. ¡Prueba otra vez!',
            solved: '¡Gran trabajo! Los peones del oponente lo atraparon.'
          }
        },
        {
          id: 'p9',
          difficulty: 1,
          title: 'El Pasillo Lateral',
          desc: 'El rey oponente está atrapado en la banda por tu peón de a7. ¡Remata la partida con tu torre!',
          fen: 'k7/P1R5/1K6/8/8/8/8/8 w - - 0 1',
          solution: ['c7c8'],
          character: 'peoncito',
          quotes: {
            greeting: '¡Cuidado con la retaguardia! El rey negro está atrapado contra la banda. ¡Atrápalo!',
            success: '¡Sí! ¡Directo al calabozo de la octava fila!',
            fail: '¡Ups! Eso le dio una casilla de escape. ¡Intenta de nuevo!',
            solved: '¡Mate del pasillo lateral! Simple y demoledor.'
          }
        },
        {
          id: 'p10',
          difficulty: 1,
          title: 'Dama al Acecho',
          desc: 'El rey negro está arrinconado. Tu rey le quita las casillas de escape. ¡La dama da el golpe final!',
          fen: '7k/8/5K2/8/8/8/8/7Q w - - 0 1',
          solution: ['h1g7'],
          character: 'reinangra',
          quotes: {
            greeting: '¡Qué rey tan solitario! Terminemos con su miseria en una sola jugada.',
            success: '¡Eso es! El rey negro ya no puede correr.',
            fail: '¡Ay! Le diste espacio para respirar. ¡Prueba otra vez!',
            solved: '¡Excelente! El beso de la dama apoyado por nuestro rey.'
          }
        },
        {
          id: 'p11',
          difficulty: 1,
          title: 'El Beso del Peón',
          desc: 'La torre blanca aprovecha la última fila descubierta mientras el rey oponente está bloqueado.',
          fen: 'k7/P7/1K6/6P1/8/8/8/7R w - - 0 1',
          solution: ['h1h8'],
          character: 'peoncito',
          quotes: {
            greeting: '¡Hola! Mi primo me dijo que las torres en columnas abiertas son devastadoras. ¡Pruébalo!',
            success: '¡Pum! La torre entra con todo.',
            fail: 'Eso no fue mate. ¡Vuelve a apuntar!',
            solved: '¡Genial! La torre en la octava fila no perdona.'
          }
        },
        {
          id: 'p12',
          difficulty: 1,
          title: 'El Alfil Silencioso',
          desc: 'El rey oponente está encerrado por tu rey y tu peón. ¡Despliega el alfil para dar el golpe final!',
          fen: 'k7/P7/2K5/8/8/8/8/2B5 w - - 0 1',
          solution: ['c1b2'],
          character: 'alfil',
          quotes: {
            greeting: 'Una diagonal, un objetivo. Encuentra el ángulo perfecto.',
            success: '¡Geometría pura! El rey no tiene a dónde ir.',
            fail: 'Ese ángulo no apunta al rey. ¡Prueba otra vez!',
            solved: '¡Precioso mate! El alfil exiliado demuestra que una diagonal basta.'
          }
        },
        {
          id: 'p3',
          difficulty: 2,
          title: 'Atracción al Pasillo',
          desc: 'El oponente piensa que su dama defiende la última fila, pero puedes forzarla a deambular.',
          fen: '6k1/5ppp/q7/8/8/8/3R4/3Q2K1 w - - 0 1',
          solution: ['d2d8', 'a6d8', 'd1d8'],
          character: 'reinangra',
          quotes: {
            greeting: '¡Alergia al mate! Pero hoy te perdonaré si resuelves este mate en dos pasos.',
            success: '¡Buen movimiento! Ahora remata la última fila.',
            fail: '¡Achu! Esa jugada me da alergia de lo mala que es. ¡Prueba otra vez!',
            solved: '¡Salud! Digo, ¡gran mate en dos! La dama enemiga cayó en la trampa.'
          }
        },
        {
          id: 'p4',
          difficulty: 2,
          title: 'El Mate de la Coz',
          desc: 'Un mate espectacular donde el rey enemigo es asfixiado por sus propias piezas defensoras.',
          fen: '5r1k/5ppp/7N/8/8/2Q5/8/6K1 w - - 0 1',
          solution: ['c3g8', 'f8g8', 'h6f7'],
          character: 'caballo',
          quotes: {
            greeting: '¡Caballo de Ŋ listo! Aquí hay un salto en L genial para asfixiar al rey.',
            success: '¡Excelente! Ahora el rey no tiene escapatoria.',
            fail: 'Mmm, ese salto no fue muy L ni muy Ŋ. ¡A pensar de nuevo!',
            solved: '¡Perfecto! ¡El rey oponente quedó atrapado por sus propios guardias!'
          }
        },
        {
          id: 'p13',
          difficulty: 2,
          title: 'La Doble Torre en Fila',
          desc: 'Dos torres coordinadas presionando la columna abierta. Penetra en la octava fila.',
          fen: 'r5k1/pp3ppp/2n5/3q2N1/8/2B5/PP3PPP/R3R1K1 w - - 0 1',
          solution: ['e1e8', 'r8e8', 'a1e8'],
          character: 'reinangra',
          quotes: {
            greeting: '¿Dos torres son mejor que una? Demuéstramelo entrando en la octava fila.',
            success: '¡Bien! El rival tuvo que capturar, ahora entra con la segunda.',
            fail: 'No, no. Así perderás la iniciativa. ¡Prueba otra vez!',
            solved: '¡Jaque mate! Las torres dobladas en la octava fila son letales.'
          }
        },
        {
          id: 'p14',
          difficulty: 2,
          title: 'El Sacrificio de Morphy',
          desc: 'Inspirado en la famosa partida de Paul Morphy en la Ópera de París. Sacrifica tu dama para desviar al caballo.',
          fen: '4kb1r/p2n1ppp/4q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 1',
          solution: ['b3b8', 'd7b8', 'd1d8'],
          character: 'martina',
          quotes: {
            greeting: '¡Esta posición es clásica! Paul Morphy la jugó en la Ópera de París. ¿Puedes ver el sacrificio?',
            success: '¡Increíble! Sacrificaste la dama para desviar al caballo protector.',
            fail: 'Morphy nunca habría jugado eso. ¡Busca una jugada más enérgica!',
            solved: '¡Sí! Un mate de ópera legendario. ¡Gran visión!'
          }
        },
        {
          id: 'p15',
          difficulty: 2,
          title: 'La Infiltración de la Octava',
          desc: 'El oponente protege la octava fila con su torre. Sacrifica tu primera torre para sobrecargar su defensa.',
          fen: 'r2r2k1/ppp2ppp/8/8/8/8/PP3PPP/3RR1K1 w - - 0 1',
          solution: ['d1d8', 'd8d8', 'e1e8'],
          character: 'peoncito',
          quotes: {
            greeting: '¡Fuerza doblada! Entra en d8 y prepárate para el golpe final.',
            success: '¡Exacto! El oponente mordió el anzuelo. ¡Ahora remata!',
            fail: 'No, no. Mantén las torres en la columna. ¡Intenta otra vez!',
            solved: '¡Espectacular! La sobrecarga de la octava fila funcionó a la perfección.'
          }
        },
        {
          id: 'p16',
          difficulty: 2,
          title: 'El Bloqueo de la Dama',
          desc: 'La dama oponente intenta defender a su rey desde el centro. Fuérzala a bloquear a su propio rey.',
          fen: '6k1/5ppp/8/4q3/8/8/5PPP/3R2K1 w - - 0 1',
          solution: ['d1d8', 'e5e8', 'd8e8'],
          character: 'caballo',
          quotes: {
            greeting: '¡Un salto directo a la yugular! Presiona el pasillo.',
            success: '¡Eso es! La dama tuvo que interponerse. ¡Acaba con ella!',
            fail: 'Ese movimiento no obliga a la dama a retroceder. ¡Prueba otra vez!',
            solved: '¡Excelente! La dama enemiga se convirtió en el escudo de su propia perdición.'
          }
        },
        {
          id: 'p23',
          difficulty: 2,
          title: 'La Cortina del Alfil',
          desc: 'El rey contrario está expuesto. Penetra su línea defensiva forzando el bloqueo de su dama.',
          fen: '6k1/5ppp/8/8/8/8/1q3PPP/3R1BK1 w - - 0 1',
          solution: ['d1d8', 'b2e8', 'd8e8'],
          character: 'alfil',
          quotes: {
            greeting: '¡Atrás del muro! El rey contrario está expuesto. Penetra su línea defensiva.',
            success: '¡Bien! El escudo de su dama se interpone. Captúrala para dar el mate.',
            fail: 'Eso no es un jaque directo. ¡Intenta de nuevo!',
            solved: '¡Mate de pasillo con la cortina del alfil protegiendo nuestro enroque!'
          }
        },
        {
          id: 'p24',
          difficulty: 2,
          title: 'El Relevo de Torres',
          desc: 'El oponente defiende la octava fila con su torre. Sacrifica la tuya para desviar su defensa y rematar.',
          fen: '4r1k1/5ppp/8/8/8/8/1Q3PPP/4R1K1 w - - 0 1',
          solution: ['e1xe8', 'e8xe8', 'b2e8'],
          character: 'reinangra',
          quotes: {
            greeting: '¡Hora de la táctica del relevo! Ataca en e8.',
            success: '¡Perfecto! Capturó con su torre. Ahora tu dama entra al relevo.',
            fail: 'No pierdas tu torre de esa manera. ¡Intenta de nuevo!',
            solved: '¡Jaque mate! El relevo dama-torre ha sido impecable.'
          }
        },
        {
          id: 'p25',
          difficulty: 2,
          title: 'La Clavada del Defensor',
          desc: 'El alfil negro protege la octava fila. Oblígalo a bloquear su propio rey y dale jaque mate.',
          fen: '6k1/5ppp/2b5/8/8/8/PP3PPP/3R2K1 w - - 0 1',
          solution: ['d1d8', 'c6e8', 'd8e8'],
          character: 'alfil',
          quotes: {
            greeting: '¡Alfil contra alfil! Ataca en d8.',
            success: '¡Excelente! El alfil tuvo que retroceder. ¡Remátalo!',
            fail: 'No, no. Mantén la presión en d8. ¡Intenta otra vez!',
            solved: '¡Brillante! El alfil enemigo no pudo resistir la presión.'
          }
        },
        {
          id: 'p26',
          difficulty: 2,
          title: 'El Escudo de la Dama',
          desc: 'La dama oponente está lejos, pero puede volar a e8 para defender. Fuérzala a bloquear.',
          fen: '6k1/5ppp/q7/8/8/8/PP3PPP/3R2K1 w - - 0 1',
          solution: ['d1d8', 'q6e8', 'd8e8'],
          character: 'martina',
          quotes: {
            greeting: '¡La octava fila está débil! Ataca con tu torre.',
            success: '¡Eso es! La dama enemiga voló a defender. ¡Captúrala!',
            fail: 'Esa jugada no pone en peligro la octava fila. ¡Prueba otra vez!',
            solved: '¡Precioso mate! La dama oponente bloqueó el escape de su propio rey.'
          }
        },
        {
          id: 'p27',
          difficulty: 2,
          title: 'El Bloqueo del Caballo',
          desc: 'El caballo negro intenta defender desde g6. Oblígalo a bloquear su propio rey.',
          fen: 'r5k1/pp3ppp/6n1/3N4/8/8/PP3PPP/4R1K1 w - - 0 1',
          solution: ['e1e8', 'g6f8', 'e8f8'],
          character: 'caballo',
          quotes: {
            greeting: '¡Salto rápido! Lanza tu torre a la octava fila.',
            success: '¡Perfecto! El caballo tuvo que retroceder a f8. ¡Captúralo!',
            fail: 'Eso no obliga al caballo a bloquear. ¡Intenta de nuevo!',
            solved: '¡Espectacular! El caballo oponente sirvió de obstáculo para su propio rey.'
          }
        },
        {
          id: 'p28',
          difficulty: 2,
          title: 'El Doblado en la Columna D',
          desc: 'Tus dos torres dominan la columna D. Sacrifica la primera para abrir paso a la segunda.',
          fen: 'r5k1/5ppp/8/8/8/8/PP1R1PPP/3R2K1 w - - 0 1',
          solution: ['d1d8', 'a8d8', 'd2d8'],
          character: 'peoncito',
          quotes: {
            greeting: '¡Torres alineadas y listas! Lanza el primer golpe en d8.',
            success: '¡Excelente! Capturó con su torre. Ahora entra con la segunda.',
            fail: 'Ese movimiento rompe la batería de torres. ¡Intenta de nuevo!',
            solved: '¡Jaque mate! Las torres dobles en la columna D barrieron la octava fila.'
          }
        },
        {
          id: 'p5',
          difficulty: 3,
          title: 'La Coz Completa',
          desc: 'El mate de la coz completo. Atraes al rey al rincón, sacrificas la dama y dejas al rey sin aire.',
          fen: 'r4r1k/1p3Npp/8/8/8/8/1Q3PPP/R5RK w - - 0 1',
          solution: ['f7h6', 'g8h8', 'b2g8', 'f8g8', 'h6f7'],
          character: 'alfil',
          quotes: {
            greeting: 'Alfil Exiliado reportándose. Este es un mate en tres muy geométrico. Piensa bien.',
            success: '¡Bien! El rey se esconde en la esquina. Sigue el ataque.',
            fail: 'Te desviaste de la diagonal correcta. Intenta recalcular tu posición.',
            solved: '¡Maravilloso! Diagonales, saltos y sacrificios. Una obra de arte matemática.'
          }
        },
        {
          id: 'p6',
          difficulty: 3,
          title: 'La Desviación de la Torre',
          desc: 'Desvía la pieza defensora de la octava fila sacrificando tu dama para penetrar con las torres.',
          fen: '5r1k/5ppp/8/8/8/8/4R3/Q3R2K w - - 0 1',
          solution: ['a1a8', 'f8a8', 'e1e8', 'a8e8', 'e2e8'],
          character: 'martina',
          quotes: {
            greeting: '¡Hola, soy Martina! Este es un problema muy bonito. A Judith Polgar le encantaba desviar las piezas defensoras.',
            success: '¡Buen camino! La torre enemiga fue desviada, entra con tu primera torre.',
            fail: 'Esa jugada no desvía a la torre protectora. ¡Busca una jugada que la obligue a moverse!',
            solved: '¡Mate del pasillo ejecutado con éxito! Judith estaría orgullosa de tu visión táctica.'
          }
        },
        {
          id: 'p17',
          difficulty: 3,
          title: 'La Sobrecarga de la Columna',
          desc: 'El rey oponente está encerrado. Usa tu dama y torre coordinadas para presionar d8 y romper la defensa.',
          fen: '2r1r1k1/5ppp/8/8/8/8/PP3PPP/Q2R2K1 w - - 0 1',
          solution: ['q1d4', 'e8d8', 'd1d8', 'c8d8', 'd4d8'],
          character: 'reinangra',
          quotes: {
            greeting: '¡La coordinación de piezas pesadas es un arte! Ataca d8.',
            success: '¡Excelente! El oponente bloqueó con su torre. Ahora inicia el cambio.',
            fail: 'Ese movimiento no crea la presión necesaria en d8. ¡Prueba otra vez!',
            solved: '¡Extraordinario! Has penetrado la línea defensiva con elegancia.'
          }
        },
        {
          id: 'p18',
          difficulty: 3,
          title: 'El Gancho del Caballo',
          desc: 'Usa tu caballo para dar un doble, desviar las defensas y despejar el pasillo.',
          fen: '6k1/5ppp/6q1/3N4/8/8/PP3PPP/4R1K1 w - - 0 1',
          solution: ['d5e7', 'g8h8', 'e7g6', 'h7g6', 'e1e8'],
          character: 'caballo',
          quotes: {
            greeting: '¡Un salto al corazón de su defensa! Busca el doble de caballo.',
            success: '¡Perfecto! El rey tuvo que moverse. Ahora captura la dama con jaque.',
            fail: 'Ese salto no crea el peligro inmediato necesario. ¡Prueba otra vez!',
            solved: '¡Sublime! Eliminaste a la dama defensora y diste mate en el pasillo.'
          }
        },
        {
          id: 'p20',
          difficulty: 3,
          title: 'La Batería de la Fila F',
          desc: 'Tu dama y tu torre están alineadas en la columna F. Sacrifica tu dama para abrir la columna.',
          fen: '6k1/5ppp/8/8/8/8/PP3QPP/5R1K w - - 0 1',
          solution: ['f2f7', 'f8f7', 'f1f7', 'g8h8', 'f7f8'],
          character: 'alfil',
          quotes: {
            greeting: '¡La columna F es tu autopista! Lanza el ataque con la dama.',
            success: '¡Muy bien! Capturó con su torre. Ahora entra con la tuya con jaque.',
            fail: 'No, no. Tienes que forzar la columna. ¡Intenta de nuevo!',
            solved: '¡Extraordinario! Has completado la batería F con total precisión.'
          }
        },
        {
          id: 'p29',
          difficulty: 3,
          title: 'La Infiltración de la Torre F',
          desc: 'Sacrifica tu dama en f7 para forzar a la torre contraria a colocarse en una posición vulnerable.',
          fen: '5r1k/5ppp/8/8/8/8/PP3QPP/4R2K w - - 0 1',
          solution: ['f2xf7', 'f8xf7', 'e1e8', 'f7f8', 'e8xf8'],
          character: 'reinangra',
          quotes: {
            greeting: '¡La columna F es la clave! Sacrifica tu dama sin piedad.',
            success: '¡Perfecto! Capturó con la torre. Ahora entra con jaque en e8.',
            fail: 'Ese movimiento no abre la octava fila. ¡Prueba otra vez!',
            solved: '¡Sublime! Has despejado el camino para el mate de torre perfecto.'
          }
        },
        {
          id: 'p30',
          difficulty: 3,
          title: 'La Maniobra de la Torre Ascendente',
          desc: 'Eleva tu torre por la tercera fila para dar un hermoso mate coordinado con tu caballo en f6.',
          fen: 'r4r1k/1p3p1p/2n2N2/8/8/8/PP4PP/4R1K1 w - - 0 1',
          solution: ['e1e3', 'f8d8', 'e3h3', 'h8g7', 'h3h7'],
          character: 'caballo',
          quotes: {
            greeting: '¡Eleva el juego! Sube la torre a la tercera fila.',
            success: '¡Perfecto! El rival intentó abrir escape con su torre. Ahora amenaza h7.',
            fail: 'Ese movimiento no eleva la torre para el ataque lateral. ¡Intenta de nuevo!',
            solved: '¡Jaque mate lateral! La torre y el caballo en f6 coordinaron a la perfección.'
          }
        },
        {
          id: 'p31',
          difficulty: 3,
          title: 'El Sacrificio de la Dama y Torre en C8',
          desc: 'Usa tus torres dobladas y dama para desviar todas las defensas del rival de la octava fila.',
          fen: 'r1b1r1k1/pp3ppp/8/8/8/8/PP3PPP/Q1RR2K1 w - - 0 1',
          solution: ['c1c8', 'e8xc8', 'a1xc8', 'a8xc8', 'd1d8'],
          character: 'reinangra',
          quotes: {
            greeting: '¡Un asalto masivo en c8! Sacrifica la torre primero.',
            success: '¡Excelente! Capturó con su primera torre. Ahora sacrifica tu dama en c8.',
            fail: 'Eso no vacía la octava fila. ¡Prueba otra vez!',
            solved: '¡Sublime! La octava fila quedó completamente desprotegida para el mate final.'
          }
        },
        {
          id: 'p32',
          difficulty: 3,
          title: 'La Deflexión del Alfil',
          desc: 'El rival defiende d8 con su torre y alfil. Sacrifica ambas torres para desviar a sus defensores.',
          fen: 'r1b1r1k1/pp3ppp/8/8/8/8/PP1R1PPP/Q2R2K1 w - - 0 1',
          solution: ['d1d8', 'e8xd8', 'd2xd8', 'c8xd8', 'a1xd8'],
          character: 'martina',
          quotes: {
            greeting: '¡A Judith Polgar le encantaba desviar defensores! Ataca d8.',
            success: '¡Muy bien! Desviaste la torre. Ahora desvía al alfil.',
            fail: 'Ese movimiento no mantiene la red de jaques. ¡Prueba otra vez!',
            solved: '¡Impresionante! Has limpiado la octava fila para el jaque mate de la dama.'
          }
        },
        {
          id: 'p7',
          difficulty: 4,
          title: 'El Dilema del Rey',
          desc: 'Un ataque feroz de caballo y dama. El oponente debe elegir su destino... pero ambos caminos llevan al mate.',
          fen: 'r1bq1r1k/pp4pp/2n5/2p1Np2/2B5/8/PP3PPP/R2QR1K1 w - - 0 1',
          solution: ['e5f7', 'f8f7', 'd1d8', 'c6d8', 'e1e8', 'f7f8', 'e1f8'],
          character: 'sombra',
          quotes: {
            greeting: 'Sombra del Ring aquí. La oscuridad cubre el tablero. Encuentra el mate en cuatro... si te atreves.',
            success: 'Vas por el camino correcto de la sombra. Mantén la presión.',
            fail: 'Te perdiste en la oscuridad. Vuelve a encender la luz y piensa de nuevo.',
            solved: 'Impresionante. Viste todas las variantes de la sombra. Has ganado mis respetos.'
          }
        },
        {
          id: 'p8',
          difficulty: 4,
          title: 'El Sacrificio Celestial',
          desc: 'Usa la fuerza de tu dama y torre para acorralar al rey enemigo en el borde del tablero mediante un hermoso desvío.',
          fen: 'r1b2r1k/pp3ppp/8/3N1b2/8/3B1R2/PPQ3PP/7K w - - 0 1',
          solution: ['c2h7', 'h8h7', 'f3h3', 'f5h3', 'd3h3', 'h7g8', 'd5e7'],
          character: 'reinangra',
          quotes: {
            greeting: 'La Reina Negra te desafía a un mate en cuatro. Sacrifica con elegancia celestial.',
            success: '¡Eso es! El sacrificio celestial abrió la columna. Entra con la torre.',
            fail: 'Esa jugada no tiene la fuerza celestial necesaria. ¡Vuelve a intentarlo!',
            solved: '¡Increíble! Has resuelto el mate en cuatro celestial con total maestría.'
          }
        },
        {
          id: 'p21',
          difficulty: 4,
          title: 'El Sacrificio de la Octava Fila',
          desc: 'Una combinación táctica de nivel maestro. Sacrifica tu caballo y dama para desviar a los defensores.',
          fen: 'r1b2r1k/pp4pp/2n5/2p1Np2/2B5/8/PP3PPP/3RR1K1 w - - 0 1',
          solution: ['e5f7', 'f8f7', 'd1d8', 'c6d8', 'e1e8', 'f7f8', 'e1f8'],
          character: 'martina',
          quotes: {
            greeting: '¡Esta combinación es de nivel de Gran Maestro! Empieza con el salto de caballo.',
            success: '¡Perfecto! Capturó con la torre. Ahora desvía al caballo con la dama.',
            fail: 'Esa jugada no fuerza el desvío. ¡Busca el jaque continuo!',
            solved: '¡Sublime! Un mate de desviación magistral en cuatro jugadas.'
          }
        },
        {
          id: 'p22',
          difficulty: 4,
          title: 'El Torbellino del Caballo',
          desc: 'Tu caballo y tu alfil dominan el flanco de rey. Lanza una ofensiva coordinada para desmantelar la defensa oponente.',
          fen: 'r1bq1r1k/pp4pp/2n5/2p1N3/2B5/8/PP3PPP/3RR1K1 w - - 0 1',
          solution: ['e5f7', 'f8f7', 'd1d8', 'c6d8', 'e1e8', 'f7f8', 'e1f8'],
          character: 'sombra',
          quotes: {
            greeting: 'El caballo inicia el torbellino. Ataca f7.',
            success: '¡Excelente! Capturó con torre. Ahora desvía a sus piezas con la dama.',
            fail: 'Ese no es el camino del torbellino. ¡Intenta de nuevo!',
            solved: '¡Asombroso! Has completado el torbellino en cuatro movimientos magistrales.'
          }
        },
        {
          id: 'p33',
          difficulty: 4,
          title: 'El Sacrificio de Desviación Triple',
          desc: 'Una combinación de campeonato. Sacrifica tu dama y desvía al defensor de c8 con tus torres dobles.',
          fen: '2r2rk1/pp3ppp/8/8/8/8/PP1R1QPP/3R2K1 w - - 0 1',
          solution: ['f2xf7', 'f8xf7', 'd1d8', 'c8d8', 'd2d8', 'f7f8', 'd8xf8'],
          character: 'martina',
          quotes: {
            greeting: '¡Esta es una combinación de nivel de campeonato! Sacrifica tu dama en f7 primero.',
            success: '¡Sí! Ahora desvía a la torre de c8 con tu torre de d1.',
            fail: 'Eso no mantiene la red de jaques. ¡Prueba otra vez!',
            solved: '¡Soberbio! Has calculado todas las defensas del oponente y has dado mate en cuatro.'
          }
        },
        {
          id: 'p34',
          difficulty: 4,
          title: 'El Sacrificio de la Ópera en Cuatro',
          desc: 'La Reina Negra te desafía a un mate en cuatro. Sacrifica la dama y abre la columna H con el alfil.',
          fen: 'r1b2r1k/pp3ppp/8/3N1b2/8/3B1R2/PPQ3PP/6K1 w - - 0 1',
          solution: ['c2h7', 'h8h7', 'f3h3', 'f5h3', 'd3h3', 'h7g8', 'd5e7'],
          character: 'reinangra',
          quotes: {
            greeting: 'La Reina Negra te desafía a un mate en cuatro. Sacrifica con elegancia celestial.',
            success: '¡Eso es! El sacrificio abrió la columna H. Eleva la torre.',
            fail: 'Esa jugada no mantiene la red de jaques. ¡Vuelve a intentarlo!',
            solved: '¡Increíble! Has resuelto el mate celestial en cuatro con total maestría.'
          }
        },
        {
          id: 'p35',
          difficulty: 4,
          title: 'La Invasión de la Octava Fila',
          desc: 'Tres piezas mayores apuntan a la octava fila. Sacrifica tu dama y torre para desmantelar la defensa triple.',
          fen: '2r2rk1/pp3ppp/8/8/8/8/PP3QPP/Q2RR1K1 w - - 0 1',
          solution: ['f2xf7', 'f8xf7', 'd1d8', 'c8d8', 'e1e8', 'd8xe8', 'a1e8'],
          character: 'martina',
          quotes: {
            greeting: '¡Alineación pesada! Comienza sacrificando tu dama en f7.',
            success: '¡Bien! Ahora desvía a la primera torre con tu torre de d1.',
            fail: 'Eso no mantiene la red de jaques. ¡Intenta de nuevo!',
            solved: '¡Sublime! Tres sacrificios coordinados para un jaque mate impecable.'
          }
        }
      ];

      // 2. Character configuration mapping
      this.characters = {
        peoncito: { name: 'Peoncito', emoji: '♟️', gender: 'male', pitch: 'high', light: '#dbeafe', dark: '#1e4d8c' },
        reinangra: { name: 'Reina Negra', emoji: '👑', gender: 'female', pitch: 'high', light: '#f3e8ff', dark: '#581c87' },
        caballo: { name: 'Caballo de Ŋ', emoji: '🐴', gender: 'male', pitch: 'fast', light: '#dcfce7', dark: '#1a6b3c' },
        alfil: { name: 'Alfil Exiliado', emoji: '📐', gender: 'male', pitch: 'low', light: '#fef9c3', dark: '#8b6914' },
        sombra: { name: 'Sombra del Ring', emoji: '👥', gender: 'male', pitch: 'slow', light: '#f1f5f9', dark: '#334155' },
        martina: { name: 'Martina', emoji: '👧', gender: 'female', pitch: 'female', light: '#ffe4e6', dark: '#be123c' }
      };

      // State variables
      this.currentPuzzle = null;
      this.currentMoveIndex = 0;
      this.selectedSquare = null;
      this.puzzleStateFen = '';
      this.score = parseInt(localStorage.getItem('martina_puzzle_score')) || 0;
      this.streak = parseInt(localStorage.getItem('martina_puzzle_streak')) || 0;
      this.solvedList = JSON.parse(localStorage.getItem('martina_puzzle_solved')) || [];

      // Audio & Speech
      this.audioCtx = null;
      this.soundEnabled = localStorage.getItem('martina_sound_enabled') !== 'false';
      this.voiceEnabled = localStorage.getItem('martina_voice_enabled') !== 'false';
      this._speakQueue = [];
      this._speaking = false;
      this._lastSpokenText = '';

      // Initialize
      this.initDOM();
      this.initAudio();
      this.loadProgress();
      this.renderPuzzlesList();

      // Load first unsolved puzzle, or default to first
      const firstUnsolved = this.puzzles.find(p => !this.solvedList.includes(p.id)) || this.puzzles[0];
      this.loadPuzzle(firstUnsolved);
    }

    // ========== AUDIO & SOUND SYNTHESIS ==========
    initAudio() {
      try {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) {
        this.audioCtx = null;
      }
    }

    _resumeAudio() {
      if (!this.audioCtx || !this.soundEnabled) return null;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      return this.audioCtx;
    }

    playMoveSound() {
      const ctx = this._resumeAudio();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } catch(e) {}
    }

    playCaptureSound() {
      const ctx = this._resumeAudio();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } catch(e) {}
    }

    playCheckSound() {
      const ctx = this._resumeAudio();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        [800, 1000].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.06, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.2);
        });
      } catch(e) {}
    }

    playVictorySound() {
      const ctx = this._resumeAudio();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);
          gain.gain.setValueAtTime(0.08, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.35);
        });
      } catch(e) {}
    }

    playDefeatSound() {
      const ctx = this._resumeAudio();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const notes = [400, 350, 300, 200];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.15);
          gain.gain.setValueAtTime(0.07, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.3);
        });
      } catch(e) {}
    }

    // ========== SPEECH SYNTHESIS (Web Speech API) ==========
    speak(text, gender, profile) {
      if (!this.voiceEnabled || !text || !window.speechSynthesis) return;
      if (text === this._lastSpokenText) return;
      this._lastSpokenText = text;

      if (!this._speakQueue) this._speakQueue = [];
      this._speakQueue.push({ text, gender, profile, timestamp: Date.now() });
      if (!this._speaking) this._dequeueSpeak();
    }

    _dequeueSpeak() {
      if (!this._speakQueue || this._speakQueue.length === 0 || !this.voiceEnabled) {
        this._speaking = false;
        return;
      }
      this._speaking = true;
      const { text, gender, profile, timestamp } = this._speakQueue.shift();

      const age = Date.now() - (timestamp || Date.now());
      if (age > 5000) {
        this._dequeueSpeak();
        return;
      }

      const utter = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      const wantFemale = gender === 'female';
      let voice = voices.find(v => v.lang.startsWith('es') && (wantFemale ? /ónica|Paulina|female/i.test(v.name) : /Jorge|Diego|male/i.test(v.name)));
      if (!voice) voice = voices.find(v => v.lang.startsWith('es'));
      if (voice) utter.voice = voice;

      const pm = {
        high: { p: 1.8, r: 1.25 },
        fast: { p: 1.0, r: 1.6 },
        low: { p: 0.5, r: 0.8 },
        dry: { p: 0.7, r: 0.9 },
        slow: { p: 0.6, r: 0.7 },
        female: { p: 1.2, r: 1.0 },
        male: { p: 0.85, r: 0.95 }
      };
      const pp = pm[profile] || pm[gender === 'female' ? 'female' : 'male'];
      utter.pitch = pp.p;
      utter.rate = pp.r;
      utter.volume = 0.85;

      const safetyTimeout = setTimeout(() => {
        this._speaking = false;
        this._dequeueSpeak();
      }, 7000);

      utter.onend = () => {
        clearTimeout(safetyTimeout);
        this._speaking = false;
        this._dequeueSpeak();
      };
      utter.onerror = () => {
        clearTimeout(safetyTimeout);
        this._speaking = false;
        this._dequeueSpeak();
      };
      speechSynthesis.speak(utter);
    }

    stopSpeaking() {
      if (window.speechSynthesis) {
        speechSynthesis.cancel();
      }
      this._speakQueue = [];
      this._speaking = false;
    }

    // ========== STATE & DOM ==========
    initDOM() {
      // Bind controls
      document.getElementById('btn-reset').addEventListener('click', () => this.resetPuzzle());
      document.getElementById('btn-hint').addEventListener('click', () => this.showHint());
      document.getElementById('btn-next').addEventListener('click', () => this.loadNextPuzzle());
      document.getElementById('btn-play-voice').addEventListener('click', () => {
        this.stopSpeaking();
        if (this.currentPuzzle) {
          const char = this.characters[this.currentPuzzle.character];
          const text = document.getElementById('char-bubble').textContent.trim();
          this.speak(text, char.gender, char.pitch);
        }
      });

      const soundBtn = document.getElementById('btn-toggle-sound');
      soundBtn.textContent = `🎵 Sonido: ${this.soundEnabled ? 'Sí' : 'No'}`;
      soundBtn.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('martina_sound_enabled', this.soundEnabled);
        soundBtn.textContent = `🎵 Sonido: ${this.soundEnabled ? 'Sí' : 'No'}`;
      });

      // Chess Board
      this.board = new ChessBoard({
        containerId: 'puzzles-board',
        squareClass: 'bots-chess-sq',
        pieceClass: 'bots-chess-pc',
        playerColor: 'w',
        lightColor: '#e8d5b7',
        darkColor: '#7c5c3e',
        onSquareClick: (r, c, coord, piece) => this.handleSquareClick(r, c, coord, piece)
      });
    }

    loadProgress() {
      document.getElementById('puzzle-score').textContent = `${this.score} pts`;
      document.getElementById('puzzle-streak').textContent = this.streak;
      document.getElementById('puzzle-solved-count').textContent = `${this.solvedList.length} / ${this.puzzles.length}`;
    }

    saveProgress(earnedPoints) {
      if (earnedPoints > 0) {
        this.score += earnedPoints;
        localStorage.setItem('martina_puzzle_score', this.score);
      }
      localStorage.setItem('martina_puzzle_streak', this.streak);
      localStorage.setItem('martina_puzzle_solved', JSON.stringify(this.solvedList));
      this.loadProgress();

      // Dispatch global storage event to sync dashboard stats
      window.dispatchEvent(new Event('storage'));
    }

    renderPuzzlesList() {
      const lists = {
        1: document.getElementById('list-mate-1'),
        2: document.getElementById('list-mate-2'),
        3: document.getElementById('list-mate-3'),
        4: document.getElementById('list-mate-4')
      };

      // Clear lists
      Object.values(lists).forEach(el => { if (el) el.innerHTML = ''; });

      this.puzzles.forEach((p, idx) => {
        const item = document.createElement('div');
        const isSolved = this.solvedList.includes(p.id);
        item.className = `puzzle-select-item ${isSolved ? 'solved' : ''}`;
        item.id = `select-item-${p.id}`;
        
        item.innerHTML = `
          <span>#${idx + 1} - ${p.title}</span>
          <span class="puzzle-status-icon">${isSolved ? '✅' : '🎯'}</span>
        `;
        item.addEventListener('click', () => this.loadPuzzle(p));

        const listEl = lists[p.difficulty];
        if (listEl) listEl.appendChild(item);
      });
    }

    // ========== GAMEPLAY LOOP ==========
    loadPuzzle(puzzle) {
      this.stopSpeaking();
      this.currentPuzzle = puzzle;
      this.currentMoveIndex = 0;
      this.selectedSquare = null;
      this.puzzleStateFen = puzzle.fen;

      // Update sidebar selector active classes
      document.querySelectorAll('.puzzle-select-item').forEach(el => el.classList.remove('active'));
      const activeItem = document.getElementById(`select-item-${puzzle.id}`);
      if (activeItem) activeItem.classList.add('active');

      // Update character styling
      const char = this.characters[puzzle.character];
      document.getElementById('char-emoji').textContent = char.emoji;
      document.getElementById('char-name').textContent = char.name;
      
      // Bubble greeting
      document.getElementById('char-bubble').textContent = puzzle.quotes.greeting;
      this.speak(puzzle.quotes.greeting, char.gender, char.pitch);

      // Description & title
      document.getElementById('puzzle-title').textContent = puzzle.title;
      document.getElementById('puzzle-desc').textContent = puzzle.desc;

      // Board configuration
      this.board.setColors(char.light, char.dark);
      this.board.setLastMove(null, null);
      this.board.render(this.puzzleStateFen);
      this.board.clearHighlights();

      // Reset UI elements
      document.getElementById('btn-next').disabled = true;
      document.getElementById('puzzles-board').classList.remove('success-glow');
      const indicator = document.getElementById('turn-indicator');
      indicator.textContent = 'Blancas Juegan y Dan Mate';
      indicator.className = 'turn-indicator';
      indicator.style.borderColor = '';
      indicator.style.color = '';
      indicator.style.backgroundColor = '';
    }

    resetPuzzle() {
      if (this.currentPuzzle) {
        this.loadPuzzle(this.currentPuzzle);
      }
    }

    showHint() {
      if (!this.currentPuzzle) return;
      const expectedMove = this.currentPuzzle.solution[this.currentMoveIndex];
      if (!expectedMove) return;

      const fromCoord = expectedMove.substring(0, 2);
      
      // Clear prev highlight and set outline to show the starting piece of the puzzle
      this.board.clearHighlights();
      const sq = document.querySelector(`#puzzles-board .bots-chess-sq[data-coord="${fromCoord}"]`);
      if (sq) {
        sq.style.outline = '4px solid var(--gold)';
        sq.style.boxShadow = '0 0 15px var(--gold)';
      }
    }

    handleSquareClick(r, c, coord, piece) {
      if (!this.currentPuzzle) return;
      
      // If puzzle is already completed, do nothing
      if (this.currentMoveIndex >= this.currentPuzzle.solution.length) return;

      // 1. Piece Selection
      if (!this.selectedSquare) {
        if (piece && piece === piece.toUpperCase()) { // White pieces are uppercase
          this.selectedSquare = coord;
          this.board.setSelected(coord);
        }
      } else {
        // 2. Clicked same square -> deselect
        if (coord === this.selectedSquare) {
          this.selectedSquare = null;
          this.board.clearHighlights();
          return;
        }

        // 3. Clicked another white piece -> switch selection
        if (piece && piece === piece.toUpperCase()) {
          this.selectedSquare = coord;
          this.board.setSelected(coord);
          return;
        }

        // 4. Play move
        const moveUci = `${this.selectedSquare}${coord}`;
        this.selectedSquare = null;
        this.board.clearHighlights();
        this.attemptPlayerMove(moveUci);
      }
    }

    attemptPlayerMove(moveUci) {
      const expectedMove = this.currentPuzzle.solution[this.currentMoveIndex];
      
      if (moveUci === expectedMove) {
        // Correct Move!
        const boardMapBefore = window.ChessEngine.parseFEN(this.puzzleStateFen);
        const fromC = expectedMove.charCodeAt(0) - 97;
        const fromR = 8 - parseInt(expectedMove[1]);
        const toC = expectedMove.charCodeAt(2) - 97;
        const toR = 8 - parseInt(expectedMove[3]);
        const isCapture = !!boardMapBefore[toR][toC];

        // Execute Move in the Engine
        const nextFen = window.ChessEngine.executeMoveRaw(this.puzzleStateFen, moveUci);
        this.puzzleStateFen = nextFen;
        
        // Update board visualization
        const char = this.characters[this.currentPuzzle.character];
        this.board.setLastMove(expectedMove.substring(0, 2), expectedMove.substring(2, 4), '#22c55e');
        this.board.render(this.puzzleStateFen);

        if (isCapture) this.playCaptureSound();
        else this.playMoveSound();

        this.currentMoveIndex++;

        // Check if there are opponent responses
        if (this.currentMoveIndex < this.currentPuzzle.solution.length) {
          // Play opponent response with a small delay
          const indicator = document.getElementById('turn-indicator');
          indicator.textContent = 'Oponente responde...';
          indicator.className = 'turn-indicator opponent';
          indicator.style.borderColor = '';
          indicator.style.color = '';
          indicator.style.backgroundColor = '';

          setTimeout(() => {
            const oppMove = this.currentPuzzle.solution[this.currentMoveIndex];
            const boardMapBeforeOpp = window.ChessEngine.parseFEN(this.puzzleStateFen);
            const oppFromC = oppMove.charCodeAt(0) - 97;
            const oppFromR = 8 - parseInt(oppMove[1]);
            const oppToC = oppMove.charCodeAt(2) - 97;
            const oppToR = 8 - parseInt(oppMove[3]);
            const oppIsCapture = !!boardMapBeforeOpp[oppToR][oppToC];

            const oppFen = window.ChessEngine.executeMoveRaw(this.puzzleStateFen, oppMove);
            this.puzzleStateFen = oppFen;

            this.board.setLastMove(oppMove.substring(0, 2), oppMove.substring(2, 4), '#ef4444');
            this.board.render(this.puzzleStateFen);

            if (oppIsCapture) this.playCaptureSound();
            else this.playMoveSound();

            this.currentMoveIndex++;
            const indicator = document.getElementById('turn-indicator');
            indicator.textContent = 'Blancas Juegan y Dan Mate';
            indicator.className = 'turn-indicator';
            indicator.style.borderColor = '';
            indicator.style.color = '';
            indicator.style.backgroundColor = '';

            // Speak progress comment
            const successQuote = this.currentPuzzle.quotes.success;
            document.getElementById('char-bubble').textContent = successQuote;
            this.speak(successQuote, char.gender, char.pitch);
          }, 700); // 700ms delay
        } else {
          // Solved completely!
          this.handleSolved();
        }
      } else {
        // Wrong Move!
        this.handleFailure();
      }
    }

    handleSolved() {
      const puzzle = this.currentPuzzle;
      const char = this.characters[puzzle.character];
      
      this.playVictorySound();
      this.stopSpeaking();

      // UI enhancements for success
      document.getElementById('puzzles-board').classList.add('success-glow');
      document.getElementById('char-bubble').textContent = puzzle.quotes.solved;
      this.speak(puzzle.quotes.solved, char.gender, char.pitch);

      const indicator = document.getElementById('turn-indicator');
      indicator.textContent = '🏆 ¡¡JAQUE MATE!! 🏆';
      indicator.className = 'turn-indicator success';
      indicator.style.borderColor = '';
      indicator.style.color = '';
      indicator.style.backgroundColor = '';

      // Calculate score points (10 per difficulty level)
      let earnedPoints = 0;
      if (!this.solvedList.includes(puzzle.id)) {
        earnedPoints = puzzle.difficulty * 10;
        this.solvedList.push(puzzle.id);
      }

      this.streak++;
      this.saveProgress(earnedPoints);
      this.renderPuzzlesList();

      document.getElementById('btn-next').disabled = false;
    }

    handleFailure() {
      const puzzle = this.currentPuzzle;
      const char = this.characters[puzzle.character];
      
      this.playDefeatSound();
      this.stopSpeaking();

      // Shake effect
      const boardDOM = document.getElementById('puzzles-board');
      boardDOM.classList.add('shake-element');
      setTimeout(() => boardDOM.classList.remove('shake-element'), 400);

      // Bubble text & voice
      document.getElementById('char-bubble').textContent = puzzle.quotes.fail;
      this.speak(puzzle.quotes.fail, char.gender, char.pitch);

      // Reset streak
      this.streak = 0;
      this.saveProgress(0);

      // Auto-restart puzzle after a short dialog reading delay
      setTimeout(() => {
        this.loadPuzzle(puzzle);
      }, 2500);
    }

    loadNextPuzzle() {
      const currentIdx = this.puzzles.findIndex(p => p.id === this.currentPuzzle.id);
      const nextIdx = (currentIdx + 1) % this.puzzles.length;
      this.loadPuzzle(this.puzzles[nextIdx]);
    }
  }

  // Self initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    window.Puzzles = new PuzzlesGame();
  });
})();
