// js/games/puzzles.js — Chess Puzzles (Táctica) module
// Implements interactive puzzles with points, streaks, character commentary, and speech/sounds.

(function() {
  class PuzzlesGame {
    constructor() {
      // 1. Puzzle Database (44 Puzzles: 6x M1, 12x M2, 14x M3, 12x M4)
      // Fuentes de partidas reales: ver scripts/puzzles_db/mates_verificados.json
      // REGLA: ningún puzzle se publica sin pasar `node test_puzzle.js`
      this.puzzles = [
        {
          id: 'p1',
          difficulty: 1,
          title: 'El Mate Escolar',
          desc: 'Martina y Peoncito están estudiando la apertura. ¡El oponente se descuidó y puedes ganar al instante!',
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
          fen: '7k/8/5K2/8/8/8/8/6Q1 w - - 0 1',
          solution: ['g1g7'],
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
          fen: 'k7/P1P5/1K6/8/8/3B4/8/8 w - - 0 1',
          solution: ['d3e4'],
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
          fen: '6k1/5ppp/1q6/8/8/8/3R1PPP/3Q2K1 w - - 0 1',
          solution: ['d2d8', 'b6d8', 'd1d8'],
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
          fen: '5r1k/6pp/7N/8/2Q5/8/8/6K1 w - - 0 1',
          solution: ['c4g8', 'f8g8', 'h6f7'],
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
          fen: 'r5k1/5ppp/8/8/8/8/PP2RPPP/4R1K1 w - - 0 1',
          solution: ['e2e8', 'a8e8', 'e1e8'],
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
          fen: 'r2r2k1/ppp2ppp/8/8/8/8/PP1R1PPP/3R2K1 w - - 0 1',
          solution: ['d2d8', 'a8d8', 'd1d8'],
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
          fen: '6k1/5ppp/8/1q6/8/8/5PPP/3R1BK1 w - - 0 1',
          solution: ['d1d8', 'b5e8', 'd8e8'],
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
          fen: 'r3r1k1/5ppp/8/8/Q7/8/PP3PPP/4R1K1 w - - 0 1',
          solution: ['e1e8', 'a8e8', 'a4e8'],
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
          fen: '6k1/5ppp/4q3/8/8/8/PP3PPP/3R2K1 w - - 0 1',
          solution: ['d1d8', 'e6e8', 'd8e8'],
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
          fen: '6k1/pp1N1ppp/6n1/8/8/8/PP3PPP/4R1K1 w - - 0 1',
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
          solution: ['d2d8', 'a8d8', 'd1d8'],
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
          fen: 'r4rk1/1p3Npp/8/8/2Q5/8/5PPP/R5RK w - - 0 1',
          solution: ['f7h6', 'g8h8', 'c4g8', 'f8g8', 'h6f7'],
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
          title: 'El Mate de Anastasia',
          desc: 'El caballo encierra al rey en la esquina, la dama se sacrifica en h7 y la torre remata por la columna h. ¡Un clásico!',
          fen: '5rk1/5ppp/8/5N2/8/8/2Q5/1K1R4 w - - 0 1',
          solution: ['f5e7', 'g8h8', 'c2h7', 'h8h7', 'd1h1'],
          character: 'martina',
          quotes: {
            greeting: '¡Hola, soy Martina! Este es el famoso Mate de Anastasia. A Judith Polgar le encantaba: caballo, sacrificio de dama y torre final.',
            success: '¡Buen camino! El rey quedó encerrado. Ahora el sacrificio de dama en h7.',
            fail: 'Esa jugada no encierra al rey. ¡Busca el salto de caballo que le quita el aire!',
            solved: '¡Mate de Anastasia completado! Caballo, dama y torre en perfecta armonía. Judith estaría orgullosa.'
          }
        },
        {
          id: 'p17',
          difficulty: 3,
          title: 'La Escalera de Torres',
          desc: 'Las dos torres bajan al rey enemigo escalón por escalón hasta el borde del tablero. ¡El mate de la escalera!',
          fen: '8/8/8/8/R7/6k1/1R6/K7 w - - 0 1',
          solution: ['b2b3', 'g3f2', 'a4a2', 'f2f1', 'b3b1'],
          character: 'reinangra',
          quotes: {
            greeting: '¡El mate de la escalera! Dos torres, un rey, y un viaje sin retorno hasta el borde.',
            success: '¡Excelente! El rey bajó un escalón. Ahora la otra torre sigue la cadena.',
            fail: 'Las torres deben alternarse cubriendo la fila anterior. ¡Prueba otra vez!',
            solved: '¡Extraordinario! Escalón por escalón, el rey llegó al final de la escalera.'
          }
        },
        {
          id: 'p18',
          difficulty: 3,
          title: 'La Sobrecarga de la Columna',
          desc: 'Tres piezas pesadas contra dos: sacrifica tus dos torres para desviar a los defensores y que tu dama remate en d8.',
          fen: '2r3k1/5ppp/1q6/Q7/8/8/PP1R1PPP/3R2K1 w - - 0 1',
          solution: ['d2d8', 'b6d8', 'd1d8', 'c8d8', 'a5d8'],
          character: 'reinangra',
          quotes: {
            greeting: '¡La columna d es un campo de batalla! Ellos son tres contra dos... pero el que ataca último, gana.',
            success: '¡Bien! Su dama mordió el anzuelo. Ahora la segunda torre.',
            fail: 'Debes lanzar las torres a d8 en orden, desviando a sus defensores. ¡Prueba otra vez!',
            solved: '¡Sobrecarga perfecta! La dama entró en d8 como una reina... mejor que yo, solo por hoy.'
          }
        },
        {
          id: 'p20',
          difficulty: 3,
          title: 'La Inmortal de Anderssen',
          desc: 'El final de la Partida Inmortal (Londres, 1851): jaque de caballo, sacrificio de dama y mate de alfil. Adolf Anderssen lo hizo legendario.',
          fen: 'r1b1k1nr/p2p1ppp/n2B4/1p1NPN1P/6P1/3P1Q2/P1P1K3/q5b1 w kq - 1 21',
          solution: ['f5g7', 'e8d8', 'f3f6', 'g8f6', 'd6e7'],
          character: 'alfil',
          quotes: {
            greeting: 'La Partida Inmortal. El caballo entra en g7 arrastrando al rey a su destino. Observa y aprende.',
            success: '¡Bien! El rey cayó en la red. Ahora el sacrificio de dama que cerró la historia.',
            fail: 'El primer paso de la Inmortal es un jaque de caballo en g7. ¡Recalcula tu geometría!',
            solved: '¡Mate de alfil en e7! La Inmortal termina como debe terminar: con geometría pura.'
          }
        },
        {
          id: 'p29',
          difficulty: 3,
          title: 'La Trampa de la Dama Valiente',
          desc: 'De la partida Evans vs MacDonnell (Londres, 1826): el alfil abre el camino y la dama se sacrifica en e6 para el mate final.',
          fen: 'r3k2r/ppp2Npp/1b5n/4p2b/2B1P2q/BQP2P2/P5PP/RN5K w kq - 1 0',
          solution: ['c4b5', 'c7c6', 'b3e6', 'h4e7', 'e6e7'],
          character: 'reinangra',
          quotes: {
            greeting: '¡El rey negro pasea por el centro! Primero el alfil a b5, luego la dama vuela a e6.',
            success: '¡Bien! El peón bloqueó. Ahora el jaque de dama en e6 que no se puede capturar.',
            fail: 'Empieza con el jaque del alfil en b5. ¡La dama vendrá después!',
            solved: '¡Mate de dama en e7! La valentía de la dama fue recompensada.'
          }
        },
        {
          id: 'p30',
          difficulty: 3,
          title: 'El Sacrificio de la Torre en h7',
          desc: 'De la partida Harrwitz vs Horwitz (Londres, 1846): sacrifica la torre en h7, trae la segunda y remata con la dama.',
          fen: '3q1r1k/2p4p/1p1pBrp1/p2Pp3/2PnP3/5PP1/PP1Q2K1/5R1R w - - 1 0',
          solution: ['h1h7', 'h8h7', 'f1h1', 'h7g7', 'd2h6'],
          character: 'caballo',
          quotes: {
            greeting: '¡La torre se lanza a h7! Si el rey la acepta, la columna h será su tumba.',
            success: '¡Perfecto! El rey aceptó el regalo envenenado. Entra la segunda torre con jaque.',
            fail: 'El primer paso es el sacrificio de torre en h7. ¡Valentía!',
            solved: '¡Mate de dama en h6! Las torres gemelas abrieron la autopista del mate.'
          }
        },
        {
          id: 'p31',
          difficulty: 3,
          title: 'La Caza del Rey de Morphy',
          desc: 'De la partida Morphy vs NN (Nueva Orleans, 1858): la torre y la dama persiguen al rey por el borde del tablero hasta el mate.',
          fen: '3r4/pp5Q/B7/k7/3q4/2b5/P4PPP/1R4K1 w - - 1 0',
          solution: ['b1b5', 'a5a4', 'h7c2', 'a4a3', 'c2b3'],
          character: 'reinangra',
          quotes: {
            greeting: '¡El rey negro pasea por la banda! La torre lo empuja y la dama lo acorrala.',
            success: '¡Bien! El rey retrocedió. Ahora la dama entra en c2 con jaque.',
            fail: 'Empieza con el jaque de torre en b5. ¡El rey no debe escapar!',
            solved: '¡Mate de dama en b3! Morphy cazó al rey como en un safari.'
          }
        },
        {
          id: 'p32',
          difficulty: 3,
          title: 'El Rey Atrapado en la Esquina',
          desc: 'De la partida Anderssen vs Falkbeer (Berlín, 1851): el rey enemigo corre hacia la esquina, pero la torre y el alfil le cierran la salida.',
          fen: '8/2p3N1/6p1/5PB1/pp2Rn2/7k/P1p2K1P/3r4 w - - 1 0',
          solution: ['e4e3', 'h3h2', 'g5f4', 'h2h1', 'e3h3'],
          character: 'martina',
          quotes: {
            greeting: '¡El rey rival intenta esconderse en la esquina! Empuja con el jaque de torre en e3.',
            success: '¡Bien! El rey tomó el peón. Ahora el alfil entra en f4 con jaque.',
            fail: 'Empieza con el jaque de torre en e3. ¡No dejes escapar al rey!',
            solved: '¡Mate de torre en h3! Anderssen era un cazador de reyes implacable.'
          }
        },
        {
          id: 'p7',
          difficulty: 4,
          title: 'La Tormenta de la Columna H',
          desc: 'De la partida Pitschel vs Anderssen (Leipzig, 1851): el peón abre la columna h, las torres se sacrifican y la dama remata. Mate en cuatro.',
          fen: 'r5rk/2p1Nppp/3p3P/pp2p1P1/4P3/2qnPQK1/8/R6R w - - 1 0',
          solution: ['h6g7', 'g8g7', 'h1h7', 'g7h7', 'f3f6', 'h7g7', 'a1h1'],
          character: 'sombra',
          quotes: {
            greeting: 'Sombra del Ring aquí. La tormenta empieza con el peón tomando g7. Cuatro golpes hasta el mate.',
            success: 'La columna h se abrió. Las torres caen una tras otra. Sigue así.',
            fail: 'Te perdiste en la tormenta. El peón toma g7 con jaque: ese es el primer paso.',
            solved: 'La tormenta pasó y el rey cayó. Anderssen habría aplaudido esta red de mate.'
          }
        },
        {
          id: 'p8',
          difficulty: 4,
          title: 'La Red de la Dama y los Peones',
          desc: 'De la partida Morphy vs Forde (Nueva Orleans, 1858): la dama empuja al rey hacia la red, los peones avanzan y el alfil cierra la trampa.',
          fen: 'r1bqr3/ppp1B1kp/1b4p1/n2B4/3PQ1P1/2P5/P4P2/RN4K1 w - - 1 0',
          solution: ['e4e5', 'g7h6', 'g4g5', 'h6h5', 'd5f3', 'c8g4', 'e5h2'],
          character: 'reinangra',
          quotes: {
            greeting: 'La Reina Negra te desafía: la dama empieza la caza en e5 y el rey no escapará de la red.',
            success: '¡Eso es! El rey corre hacia la esquina. Los peones y el alfil completan la red.',
            fail: 'La caza empieza con la dama en e5 dando jaque. ¡Inténtalo de nuevo!',
            solved: '¡Red perfecta! Dama, peones y alfil tejieron juntos el mate en cuatro.'
          }
        },
        {
          id: 'p21',
          difficulty: 4,
          title: 'El Sempreverde de Anderssen',
          desc: 'El final de la partida Sempreverde (Berlín, 1852): Anderssen sacrificó su dama y ganó con los dos alfiles. ¡Mate en cuatro legendario!',
          fen: '1r2k1r1/pbppnp1p/1b3P2/8/Q7/B1PB1q2/P4PPP/3R2K1 w - - 0 21',
          solution: ['a4d7', 'e8d7', 'd3f5', 'd7e8', 'f5d7', 'e8f8', 'a3e7'],
          character: 'martina',
          quotes: {
            greeting: '¡La partida Sempreverde de Anderssen! La dama se sacrifica en d7 y los alfiles hacen el resto.',
            success: '¡Increíble! El rey capturó la dama. Ahora los alfiles empiezan su danza mortal.',
            fail: 'Anderssen sacrificó la dama primero. ¡Busca ese jaque valiente en d7!',
            solved: '¡El Sempreverde completo! Dama sacrificada y mate de alfiles. Así se escribe la historia.'
          }
        },
        {
          id: 'p22',
          difficulty: 4,
          title: 'El Legado de Philidor',
          desc: 'El mate de la coz completo, igual que lo enseñó Philidor hace 250 años: caballo al ataque, rey a la esquina, sacrificio de dama y coz final.',
          fen: '5r1k/5ppp/8/6N1/2Q5/8/8/6K1 w - - 0 1',
          solution: ['g5f7', 'h8g8', 'f7h6', 'g8h8', 'c4g8', 'f8g8', 'h6f7'],
          character: 'caballo',
          quotes: {
            greeting: '¡El legado de Philidor! Primero el jaque del caballo comiendo f7. ¡Que empiece el torbellino!',
            success: '¡Perfecto! El rey salió y volvió a la esquina. Ahora la dama se sacrifica en g8.',
            fail: 'El camino de Philidor empieza con el caballo tomando f7 con jaque. ¡Intenta de nuevo!',
            solved: '¡El legado completo! El rey quedó asfixiado por sus propias piezas. ¡Coz perfecta!'
          }
        },
        {
          id: 'p33',
          difficulty: 4,
          title: 'La Escalera Larga',
          desc: 'Dos torres persiguen al rey enemigo por todo el tablero, escalón por escalón, hasta el último rincón.',
          fen: '8/8/8/8/R7/4k3/1R6/6K1 w - - 0 1',
          solution: ['b2b3', 'e3d2', 'a4a2', 'd2c1', 'b3b5', 'c1d1', 'b5b1'],
          character: 'martina',
          quotes: {
            greeting: '¡La escalera más larga! El rey intentará escabullirse, pero las torres no le darán ni un respiro.',
            success: '¡Bien! El rey corre hacia la esquina. Las torres se turnan: una jaquea, la otra corta.',
            fail: 'Las torres deben alternarse: una da jaque y la otra cubre la fila anterior. ¡Prueba otra vez!',
            solved: '¡La escalera completa! El rey llegó al final del pasillo sin escapatoria.'
          }
        },
        {
          id: 'p34',
          difficulty: 4,
          title: 'La Persecución del Rey Descubierto',
          desc: 'De la partida Chigorin vs Shumov (San Petersburgo, 1876): las torres y el peón persiguen al rey por todo el centro hasta el mate.',
          fen: 'r2r4/p1p2p1p/n5k1/1p5N/2p2R2/5N2/P1K3PP/5R2 w - - 1 0',
          solution: ['f4f6', 'g6h5', 'g2g4', 'h5g4', 'f1g1', 'g4h5', 'g1g5'],
          character: 'reinangra',
          quotes: {
            greeting: 'El rey negro pasea desnudo por el centro. La torre en f6 empieza la persecución.',
            success: '¡Bien! El rey comió el caballo. Ahora el peón en g4 lo sigue empujando.',
            fail: 'La persecución empieza con la torre a f6 con jaque. ¡No lo dejes respirar!',
            solved: '¡Mate de torre en g5! Chigorin cazó al rey por todo el tablero.'
          }
        },
        {
          id: 'p35',
          difficulty: 4,
          title: 'La Jaula de la Torre y el Alfil',
          desc: 'De la partida Grundy vs Delmar (Nueva York, 1880): torre y alfil encierran al rey solitario en la banda. Mate en cuatro.',
          fen: 'k1K5/7r/8/4B3/1RP5/8/8/8 w - - 1 0',
          solution: ['b4b8', 'a8a7', 'e5d4', 'a7a6', 'b8a8', 'h7a7', 'a8a7'],
          character: 'martina',
          quotes: {
            greeting: '¡El rey rival está casi solo! La torre y el alfil construyen la jaula, barrote por barrote.',
            success: '¡Bien! El rey retrocedió. Ahora el alfil en d4 pone otro barrote.',
            fail: 'Empieza con el jaque de torre en b8. ¡La jaula se construye con jaques!',
            solved: '¡Jaula completada! Torre y alfil encerraron al rey. ¡Mate en cuatro perfecto!'
          }
        },
        {
          id: 'p36',
          difficulty: 3,
          title: 'El Caballo Fantasma de Paulsen',
          desc: 'De la partida Paulsen vs NN (1857): la dama entra en f7, el alfil la reemplaza y el caballo cierra el mate.',
          fen: 'r1bqr1k1/ppp2pp1/3p4/4n1NQ/2B1PN2/8/P4PPP/b4RK1 w - - 1 0',
          solution: ['h5f7', 'e5f7', 'c4f7', 'g8f8', 'f4g6'],
          character: 'caballo',
          quotes: {
            greeting: '¡La dama entra en f7 con jaque! El caballo espera su turno para el golpe final.',
            success: '¡Bien! El caballo enemigo comió la dama. Ahora el alfil entra en f7.',
            fail: 'Empieza con la dama en f7. ¡El caballo saltará al final!',
            solved: '¡Mate con caballo en g6! El fantasma de Paulsen galopa de nuevo.'
          }
        },
        {
          id: 'p37',
          difficulty: 3,
          title: 'El Sacrificio de la Dama en e8',
          desc: 'De la partida Saalbach vs Pollmaecher (Leipzig, 1861): sacrificio de dama y los caballos rematan al rey.',
          fen: 'rnbk1b1r/ppqpnQ1p/4p1p1/2p1N1B1/4N3/8/PPP2PPP/R3KB1R w - - 1 0',
          solution: ['f7e8', 'd8e8', 'e4f6', 'e8d8', 'e5f7'],
          character: 'caballo',
          quotes: {
            greeting: '¡La dama se sacrifica en e8! Los caballos preparan la emboscada.',
            success: '¡Bien! El rey aceptó la dama. Ahora el doble de caballo en f6.',
            fail: 'El primer paso es la dama en e8. ¡Los caballos harán el resto!',
            solved: '¡Mate de caballo en f7! Los dos caballos cazaron al rey juntos.'
          }
        },
        {
          id: 'p38',
          difficulty: 3,
          title: 'La Columna H de Chigorin',
          desc: 'De la partida Chigorin vs Yakubovich (por correspondencia, 1879): sacrificio de dama en h7 y mate de torre por la columna h.',
          fen: '5qrk/p3b1rp/4P2Q/5P2/1pp5/5PR1/P6P/B6K w - - 1 0',
          solution: ['h6h7', 'h8h7', 'g3h3', 'e7h4', 'h3h4'],
          character: 'martina',
          quotes: {
            greeting: '¡Chigorin sacrificó la dama en h7! Si el rey la toma, la torre baja con todo.',
            success: '¡Bien! El rey aceptó. Ahora la torre en h3 con jaque.',
            fail: 'La dama en h7 es la llave. ¡El rey no podrá resistirse!',
            solved: '¡Mate de torre en h4! Chigorin era un volcán: siempre en erupción.'
          }
        },
        {
          id: 'p39',
          difficulty: 3,
          title: 'El Mate del Peoncito',
          desc: 'De la partida Zukertort vs Potter (Londres, 1875): alfil, torre y... ¡un peón humilde da el jaque mate final!',
          fen: '3r4/pR2N3/2pkb3/5p2/8/2B5/qP3PPP/4R1K1 w - - 1 0',
          solution: ['c3e5', 'd6c5', 'e1c1', 'e6c4', 'b2b4'],
          character: 'peoncito',
          quotes: {
            greeting: '¡Este es mi favorito! El alfil y la torre acorralan al rey, y un peoncito como yo da el mate.',
            success: '¡Bien! El rey corrió a c5. Ahora la torre en c1 con jaque.',
            fail: 'Empieza con el alfil en e5. ¡El peoncito espera su gran momento!',
            solved: '¡MATE CON PEÓN EN b4! ¡Los peones también damos mate! ¡Mi bigote está de fiesta!'
          }
        },
        {
          id: 'p40',
          difficulty: 3,
          title: 'La Trampa de Henry Bird',
          desc: 'De la partida Bird vs NN (Londres, 1886): el caballo empuja al rey, la dama se sacrifica y el caballo da la coz final.',
          fen: 'rnb1k2r/ppppbN1p/5n2/7Q/4P3/2N5/PPPP3P/R1B1KB1q w - - 1 0',
          solution: ['f7d6', 'e8d8', 'h5e8', 'f6e8', 'd6f7'],
          character: 'caballo',
          quotes: {
            greeting: '¡El caballo en d6 empieza la danza! La dama se sacrificará en e8 para la coz final.',
            success: '¡Bien! El rey se movió a d8. Ahora la dama entra en e8 con todo.',
            fail: 'Empieza con el caballo en d6. ¡La trampa de Bird es famosa!',
            solved: '¡Coz final en f7! El rey quedó asfixiado entre sus propios guardias.'
          }
        },
        {
          id: 'p41',
          difficulty: 4,
          title: 'La Simultánea Ciega de Morphy',
          desc: 'De una simultánea a ciegas de Morphy (Nueva Orleans, 1858): la torre entra en g7 y la dama persigue al rey. Mate en cuatro.',
          fen: 'r1b3kr/3pR1p1/ppq4p/5P2/4Q3/B7/P5PP/5RK1 w - - 1 0',
          solution: ['e7g7', 'g8g7', 'e4e7', 'g7g8', 'e7f8', 'g8h7', 'f8f7'],
          character: 'martina',
          quotes: {
            greeting: '¡Morphy jugó esto SIN VER EL TABLERO! La torre toma g7 y la dama empieza la cacería.',
            success: '¡Bien! El rey aceptó la torre. Ahora la dama en e7 con jaque.',
            fail: 'La torre toma g7 con jaque. ¡Como Morphy en su simultánea ciega!',
            solved: '¡Mate de dama en f7! Morphy lo vio todo sin mirar. Increíble.'
          }
        },
        {
          id: 'p42',
          difficulty: 4,
          title: 'Los Dos Caballos de Riviere',
          desc: 'De la partida De Riviere vs Journoud (París, 1860): dos caballos saltan a f7, el alfil en b5 y la torre cierra el mate.',
          fen: 'r1bk3r/pppq1ppp/5n2/4N1N1/2Bp4/Bn6/P4PPP/4R1K1 w - - 1 0',
          solution: ['e5f7', 'd7f7', 'g5f7', 'd8d7', 'c4b5', 'c7c6', 'e1e7'],
          character: 'caballo',
          quotes: {
            greeting: '¡Dos caballos se turnan en f7! El rey negro no sabrá cuál lo golpeó primero.',
            success: '¡Bien! La dama comió el primer caballo. Ahora el segundo salta a f7.',
            fail: 'El primer caballo salta a f7 con jaque. ¡El segundo viene detrás!',
            solved: '¡Mate de torre en e7! Los dos caballos hicieron el trabajo en equipo.'
          }
        },
        {
          id: 'p43',
          difficulty: 4,
          title: 'El Despeje de Steinitz',
          desc: 'De la partida Steinitz vs Mongredien (Londres, 1862): el alfil despeja g6, la dama entra y la torre corta la retirada.',
          fen: 'r3k3/pbpqb1r1/1p2Q1p1/3pP1B1/3P4/3B4/PPP4P/5RK1 w - - 1 0',
          solution: ['d3g6', 'g7g6', 'e6g6', 'e8d8', 'f1f8', 'd7e8', 'g6e8'],
          character: 'alfil',
          quotes: {
            greeting: 'El alfil toma g6 y abre la autopista de la dama. Geometría de precisión quirúrgica.',
            success: '¡Bien! La torre comió el alfil. Ahora la dama entra en g6.',
            fail: 'El alfil en g6 es la llave. ¡La dama seguirá su camino!',
            solved: '¡Mate de dama en e8! Steinitz calculó cada diagonal como un reloj.'
          }
        },
        {
          id: 'p44',
          difficulty: 4,
          title: 'El Peón Ahorcador de Anderssen',
          desc: 'De la partida Anderssen vs NN (Berlín, 1866): la dama se sacrifica en h7, el peón avanza y la torre remata por la columna h.',
          fen: '2r2b2/p2q1P1p/3p2k1/4pNP1/4P1RQ/7K/2pr4/5R2 w - - 1 0',
          solution: ['h4h7', 'g6h7', 'g5g6', 'h7h8', 'g4h4', 'f8h6', 'h4h6'],
          character: 'peoncito',
          quotes: {
            greeting: '¡La dama se sacrifica en h7 y luego un peón como yo avanza para la victoria!',
            success: '¡Bien! El rey aceptó la dama. Ahora el peón en g6 con jaque.',
            fail: 'Primero la dama en h7. ¡Luego el peoncito tendrá su momento de gloria!',
            solved: '¡Mate de torre en h6! Dama sacrificada, peón victorioso. ¡Qué día!'
          }
        },
        {
          id: 'p45',
          difficulty: 4,
          title: 'La Coz Doble de Paulsen',
          desc: 'De la partida Paulsen vs Hammacher (Fráncfort, 1878): caballo a f7, dama sacrificada en g8 y la coz más famosa del siglo XIX.',
          fen: 'r1qbr2k/1p2n1pp/3B1n2/2P1Np2/p4N2/PQ4P1/1P3P1P/3RR1K1 w - - 1 0',
          solution: ['e5f7', 'h8g8', 'f7h6', 'g8h8', 'b3g8', 'e7g8', 'h6f7'],
          character: 'caballo',
          quotes: {
            greeting: '¡El caballo entra en f7 con jaque! La dama se sacrificará en g8 para la gran coz final.',
            success: '¡Bien! El rey salió y volvió. Ahora la dama en g8 con todo.',
            fail: 'El caballo en f7 es el primer paso. ¡La coz de Paulsen es legendaria!',
            solved: '¡Mate de caballo en f7! ¡La coz doble! ¡Relincho histórico!'
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
