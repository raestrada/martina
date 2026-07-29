// js/cursos-principios-apertura.js — Datos para "Los Mandamientos de la Apertura" (10 Módulos - Método Miguel Illescas)
(function() {
  'use strict';

  const OPENING_PRINCIPLES_COURSE = {
    id: 'principios-de-apertura',
    title: 'Los Mandamientos de la Apertura',
    subtitle: 'Los Principios Fundamentales del Ajedrez con Martina (Método Illescas)',
    perspective: 'w', // Perspectiva de Blancas
    modules: [
      {
        id: 'mod-0',
        title: '1. La Posición Ideal Aspiracional',
        kicker: 'Módulo 1: El Modelo Teórico Ideal',
        heading: 'La Posición Aspiracional de la Apertura',
        speech: '<p>¡Bienvenido a la puerta de entrada del ajedrez! El Gran Maestro Miguel Illescas nos enseña la <strong>Posición Ideal de Apertura</strong> a la que todo jugador aspira.</p><p>Observa el tablero: <strong>dos peones en el centro (e4 y d4)</strong>, <strong>dos caballos desarrollados (f3 y c3)</strong>, <strong>dos alfiles activos (c4 y f4)</strong>, <strong>el rey enrocado (O-O)</strong> y las <strong>torres conectadas en el centro (e1 y d1)</strong>. Aunque el rival intentará evitarlo, ¡este es nuestro modelo estratégico ideal!</p>',
        pgn: '1. e4 e5 2. d4 exd4 3. Nf3 Nc6 4. Bc4 Nf6 5. Nc3 Bb4 6. Bf4 d6 7. O-O O-O 8. Qe2 Re8 9. Rad1 Bg4 10. Rfe1',
        highlightMove: 'Rfe1',
        martinaQuote: '«Esta es la Posición Ideal Aspiracional: 2 peones centrales, 2 caballos, 2 alfiles activos, rey enrocado y torres conectadas».',
        points: [
          '<strong>Centro Perfecto:</strong> Peones e4 y d4 dominan las casillas clave.',
          '<strong>Piezas Menores Desarrolladas:</strong> Caballos en f3/c3 y alfiles en c4/f4.',
          '<strong>Seguridad y Conexión:</strong> Rey enrocado y torres coordinadas en e1 y d1.'
        ]
      },
      {
        id: 'mod-1',
        title: '2. Dominar el Centro con Peones',
        kicker: 'Módulo 2: Mandamiento #1',
        heading: 'Ocupar el Gran Río Central (e4 y d4)',
        speech: '<p>Quien domina el centro, domina la partida. Avanzar los peones a <span class="move-pill">1. e4</span> y <span class="move-pill">2. d4</span> toma el control de las casillas e4, d4, e5 y d5.</p><p>Además, estos dos peones abren las diagonales para que tus alfiles de casillas blancas y negras salgan a la batalla sin estorbarse.</p>',
        pgn: '1. e4 e5 2. d4 exd4 3. Qxd4 Nc6 4. Qe3 Nf6',
        highlightMove: 'Nf6',
        martinaQuote: '«Colocar tus peones en e4 y d4 es tomar el mando del tablero desde la jugada 1».',
        points: [
          '<strong>Control Central:</strong> Peones e4 y d4 controlan el espacio principal.',
          '<strong>Apertura de Diagonales:</strong> Liberan las líneas de ataque de ambos alfiles.',
          '<strong>Restricción Rival:</strong> Impiden que el oponente avance sus propias piezas cómodamente.'
        ]
      },
      {
        id: 'mod-2',
        title: '3. Desarrollar Caballos Primero',
        kicker: 'Módulo 3: Mandamiento #2',
        heading: 'Sacar Caballos antes que Alfiles',
        speech: '<p>En la apertura, la norma de Illescas es clara: <strong>desarrolla primero los Caballos hacia el centro y luego los Alfiles</strong>.</p><p>Los caballos en <span class="move-pill">f3</span> y <span class="move-pill">c3</span> controlan las casillas centrales de inmediato sin bloquear las diagonales por donde saldrán los alfiles.</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. Nc3 Nf6',
        highlightMove: 'Nf6',
        martinaQuote: '«Primero los Caballos por f3 y c3, luego los Alfiles por c4 y f4. ¡Esa es la secuencia correcta!».',
        points: [
          '<strong>Caballos a f3 y c3:</strong> Controlan el centro sin estorbar la salida de los peones o alfiles.',
          '<strong>Alfiles a c4 y f4:</strong> Se desarrollan después apuntando a las casillas débiles.',
          '<strong>Flexibilidad:</strong> Mantiene abierta la elección estratégica.'
        ]
      },
      {
        id: 'mod-3',
        title: '4. No Repetir Piezas',
        kicker: 'Módulo 4: Mandamiento #3',
        heading: 'No Mover la Misma Pieza Dos Veces',
        speech: '<p>Mover la misma pieza dos veces en las primeras jugadas regala turnos (tiempos) al rival. Si mueves un alfil a c4 y al turno siguiente a b5 sin que te obliguen, pierdes un tiempo valioso.</p><p>¡Cada movimiento de la apertura debe poner una pieza NUEVA a trabajar!</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d3 Bc5 5. Nc3 d6 6. Bg5 h6 7. Bh4 g5 8. Bg3',
        highlightMove: 'Bg3',
        martinaQuote: '«Mover la misma pieza dos veces es regalarle turnos al rival. ¡Saca una pieza nueva en cada jugada!».',
        points: [
          '<strong>Economía del Tiempo:</strong> Los primeros 10 movimientos valen oro.',
          '<strong>Evitar Pérdida de Tiempos:</strong> No muevas piezas ya desarrolladas sin justificación táctica.',
          '<strong>Desarrollo Completo:</strong> Pón a todo tu ejército en marcha.'
        ]
      },
      {
        id: 'mod-4',
        title: '5. El Enroque Temprano',
        kicker: 'Módulo 5: Mandamiento #4',
        heading: 'Enrocar Antes de la Jugada 10',
        speech: '<p>Un Rey atrapado en el centro e1/e8 corre peligro mortal. Miguel Illescas enfatiza: <strong>pon a tu Rey a salvo con el Enroque Corto antes de la jugada 10</strong>.</p><p>El enroque es un dos por uno: proteges al rey tras su muro de peones y activas la torre en la columna central.</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. O-O Nf6 5. d3 d6 6. c3 O-O',
        highlightMove: 'O-O',
        martinaQuote: '«El enroque protege al rey en una fortaleza y conecta tu torre a la columna central».',
        points: [
          '<strong>Regla de la Jugada 10:</strong> Enroca a tu rey antes del décimo movimiento.',
          '<strong>Muro de Peones:</strong> Mantén la cobertura f2-g2-h2 intacta.',
          '<strong>Activación de Torres:</strong> Conecta las torres para el medio juego.'
        ]
      },
      {
        id: 'mod-5',
        title: '6. La Dama en Reserva',
        kicker: 'Módulo 6: Mandamiento #5',
        heading: 'No Sacar la Dama Prematuramente',
        speech: '<p>Sacar la Dama en la jugada 2 (<span class="move-pill">2. Qh5?</span>) buscando mates fáciles es un error de principiantes. El rival atacará a tu Dama con sus caballos y alfiles menores, ganando tiempos mientras tu Dama huye.</p><p>La Dama es tu pieza más valiosa: ¡consérvala protegida hasta que tu ejército esté desarrollado!</p>',
        pgn: '1. e4 e5 2. Qh5? Nc6 3. Bc4 g6 4. Qf3 Nf6 5. Ne2 Bg7 6. d3 O-O',
        highlightMove: 'O-O',
        martinaQuote: '«Sacar la Dama temprano la convierte en el blanco de las piezas enemigas. ¡Déjala en reserva!».',
        points: [
          '<strong>Dama Prematura:</strong> Atraída a emboscadas por piezas menores.',
          '<strong>Pérdida de Tiempo:</strong> Huye mientras el rival desarrolla a su ejército.',
          '<strong>Uso Correcto:</strong> Entra en acción cuando las piezas menores y enroque estén listos.'
        ]
      },
      {
        id: 'mod-6',
        title: '7. Conectar las Torres',
        kicker: 'Módulo 7: Mandamiento #6',
        heading: 'Conectar las Torres en el Centro',
        speech: '<p>Una vez que has desarrollado caballos y alfiles y te has enrocado, las dos Torres deben quedar <strong>conectadas en la primera fila</strong> (e1 y d1).</p><p>Las torres pertenecen a las columnas abiertas y semiabiertas del centro para presionar la posición enemiga.</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Bd2 Bxd2+ 8. Nbxd2 d5 9. exd5 Nxd5 10. O-O O-O 11. Re1',
        highlightMove: 'Re1',
        martinaQuote: '«Conectar las torres en e1 y d1 es la prueba de que tu apertura fue perfecta».',
        points: [
          '<strong>Columnas Abiertas:</strong> Ubica tus torres en e1 y d1.',
          '<strong>Comunicación de Torres:</strong> Sin piezas menores estorbando en la primera fila.',
          '<strong>Presión Central:</strong> Dominio de las vías principales del tablero.'
        ]
      },
      {
        id: 'mod-7',
        title: '8. No Mover Peones de Flanco',
        kicker: 'Módulo 8: Mandamiento #7',
        heading: 'Evitar Avances Inútiles de Peones A o H',
        speech: '<p>Avanzar peones de los bordes como <span class="move-pill">a3</span> o <span class="move-pill">h3</span> en la apertura sin motivo táctico es una pérdida de tiempo grave.</p><p>Los peones de flanco no ayudan a controlar el centro ni a desarrollar piezas. ¡Guarda esos turnos para tus caballos y alfiles!</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. a3? a6 5. h3? h6 6. Nc3 Nf6',
        highlightMove: 'Nf6',
        martinaQuote: '«Perder tiempos moviendo a3 o h3 le regala el centro al rival. ¡Desarrolla piezas!».',
        points: [
          '<strong>Peones de Flanco:</strong> No aportan al control del centro ni al desarrollo.',
          '<strong>Pérdida de Iniciativa:</strong> Regala el control del tablero al oponente.',
          '<strong>Prioridad:</strong> Enfócate 100% en e4, d4, caballos y alfiles.'
        ]
      },
      {
        id: 'mod-8',
        title: '9. No Encerrar a tus Alfiles',
        kicker: 'Módulo 9: Mandamiento #8',
        heading: 'Desarrollar Alfiles Fuera de la Cadena de Peones',
        speech: '<p>Si juegas <span class="move-pill">3. d3?</span> antes de sacar tu alfil de casillas blancas, lo dejas atrapado detrás de su propia cadena de peones.</p><p>Miguel Illescas recomienda sacar primero el alfil a <span class="move-pill">Bc4</span> o <span class="move-pill">Bb5</span> fuera de la cadena de peones antes de consolidar el centro con d3 o e3.</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. d3? Bc5 4. Be2 Nf6 5. O-O d6',
        highlightMove: 'd6',
        martinaQuote: '«Desarrolla tu alfil fuera de la cadena de peones antes de cerrarla con d3 o e3».',
        points: [
          '<strong>Alfiles Libres:</strong> Sacar el alfil a c4/b5 antes de jugar d3 o e3.',
          '<strong>Alfil Malo:</strong> Evita encerrar a tus propias piezas detrás de peones.',
          '<strong>Actividad Diagional:</strong> Apunta a casillas activas del rival.'
        ]
      },
      {
        id: 'mod-9',
        title: '10. Aplicación en Partida Real',
        kicker: 'Módulo 10: Síntesis Magistral',
        heading: 'La Síntesis del Método Illescas en Acción',
        speech: '<p>¡Ponemos todos los mandamientos a trabajar juntos en una partida real!</p><p>Observa la posición final tras <span class="move-pill">1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Bd2 Bxd2+ 8. Nbxd2 d5 9. exd5 Nxd5 10. Qb3! Nce7 11. O-O O-O</span>: ¡centro conquistado, piezas activas, rey seguro y la Dama dominando desde b3!</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Bd2 Bxd2+ 8. Nbxd2 d5 9. exd5 Nxd5 10. Qb3 Nce7 11. O-O O-O',
        highlightMove: 'O-O',
        martinaQuote: '«¡Felicidades! Has completado Los 10 Mandamientos de la Apertura. ¡Ahora estás listo para cualquier batalla!».',
        points: [
          '<strong>Síntesis Total:</strong> Todos los 10 principios aplicados en sincronía.',
          '<strong>10. Qb3!:</strong> Presión directa sobre d5 y b7 con desarrollo completo.',
          '<strong>11. O-O O-O:</strong> Transición perfecta al medio juego con ventaja de Blancas.'
        ]
      }
    ]
  };

  window.CURRENT_COURSE_DATA = OPENING_PRINCIPLES_COURSE;
})();
