// js/cursos-gambito-rey.js — Datos de lecciones para "El Gambito de Rey" con Martina
(function() {
  'use strict';

  const KINGS_GAMBIT_COURSE = {
    id: 'gambito-de-rey',
    title: 'El Gambito de Rey',
    subtitle: 'El Fuego Romántico del Ataque Directo con Martina',
    perspective: 'w', // Perspectiva de Blancas
    modules: [
      {
        id: 'mod-0',
        title: '1. El Fuego de la Jugada 2',
        kicker: 'Módulo 1: El Fuego de la Jugada 2',
        heading: '¡Bienvenido al Gambito de Rey con Martina!',
        speech: '<p>¡Prefiero incendiar el tablero antes que jugar unas tablas cobardes! Soy <strong>Martina</strong> y te presento la apertura más atrevida del ajedrez: el <strong>Gambito de Rey</strong> (<span class="move-pill">1. e4 e5</span> <span class="move-pill">2. f4!</span>).</p><p>Entregamos nuestro peón f en el segundo movimiento. ¿Por qué? Porque queremos eliminar el peón e5 de las negras, adueñarnos del centro con d4 y abrir la columna f para nuestras torres. ¡Es el ajedrez romántico puro!</p>',
        pgn: '1. e4 e5 2. f4 exf4 3. Nf3',
        highlightMove: 'Nf3',
        martinaQuote: '«Entregas el peón f4 para abrir la autopista de tu torre e incendiar el enroque rival».',
        points: [
          '<strong>2. f4!:</strong> Desafío violento al centro negro en el segundo movimiento.',
          '<strong>3. Nf3:</strong> Desarrollo clave que evita la molesta entrada Qh4+ de las negras.',
          '<strong>Ataque de Campeones:</strong> Utilizado por Boris Spassky, Bobby Fischer y Mikhail Tal.'
        ]
      },
      {
        id: 'mod-1',
        title: '2. Gambito Aceptado (2...exf4)',
        kicker: 'Módulo 2: Ataque a la Casilla f7',
        heading: 'Embiste a la Casilla f7 con 4. Bc4',
        speech: '<p>Si las negras aceptan el peón con <span class="move-pill">2...exf4 3. Nf3</span> y buscan defenderlo con <span class="move-pill">3...g5</span>, atacamos con <span class="move-pill">4. Bc4 Bg7 5. O-O</span>.</p><p>Nuestra torre de f1 y alfil de c4 forman una mirilla telescópica apuntando directamente al peón f7 del rey negro. Mantenemos la iniciativa a cambio de un peón.</p>',
        pgn: '1. e4 e5 2. f4 exf4 3. Nf3 g5 4. Bc4 Bg7 5. O-O d6 6. d4 h6',
        highlightMove: 'h6',
        martinaQuote: '«4. Bc4 y 5. O-O colocan a la torre f1 lista para volar en pedazos la defensa enemiga».',
        points: [
          '<strong>3...g5:</strong> Intento negro de aferrarse al peón de ventaja.',
          '<strong>4. Bc4!:</strong> Apunta al punto más débil de las negras (f7).',
          '<strong>5. O-O y 6. d4:</strong> Dominio completo del centro con ataque por la columna f.'
        ]
      },
      {
        id: 'mod-2',
        title: '3. El Gambito Muzio (5. O-O g4!)',
        kicker: 'Módulo 3: El Sacrificio de Pieza Entera',
        heading: 'El Legendario Gambito Muzio',
        speech: '<p>¡El sacrificio más salvaje de la historia! Si las negras siguen avanzando peones con <span class="move-pill">4. Bc4 g4</span> amenazando nuestro caballo f3, ¡enrocamos <span class="move-pill">5. O-O!!</span> regalando el caballo entero!</p><p>Tras <span class="move-pill">5...gxf3 6. Qxf3</span>, sacrificamos una pieza completa a cambio de que todas nuestras piezas mayores queden apuntando al rey negro desprotegido. ¡Un ataque demoledor!</p>',
        pgn: '1. e4 e5 2. f4 exf4 3. Nf3 g5 4. Bc4 g4 5. O-O gxf3 6. Qxf3 Qf6 7. e5 Qxe5 8. Bxf7+!',
        highlightMove: 'Bxf7+',
        martinaQuote: '«En el Gambito Muzio regalas un caballo entero para lograr el mate en menos de 20 jugadas».',
        points: [
          '<strong>5. O-O!!:</strong> El Gambito Muzio sacrifica el caballo f3 completo.',
          '<strong>6. Qxf3:</strong> Cuatro piezas blancas apuntan directamente a la casilla f7.',
          '<strong>Ataque Total:</strong> Las negras no pueden desarrollar sus piezas a tiempo para salvar su rey.'
        ]
      },
      {
        id: 'mod-3',
        title: '4. Gambito Rehusado (2...Bc5)',
        kicker: 'Módulo 4: Bloqueando la Diagonal',
        heading: 'Superando el Gambito Rehusado con 2...Bc5',
        speech: '<p>Si las negras rehúsan el peón mediante <span class="move-pill">2...Bc5</span> para bloquear nuestro enroque, jugamos con serenidad: <span class="move-pill">3. Nf3 d6 4. c3 Nf6 5. fxe5 dxe5 6. Nxe5</span>.</p><p>Aprovechamos que el alfil negro está en c5 para construir el centro con c3 y d4, ganando un peón limpio en e5.</p>',
        pgn: '1. e4 e5 2. f4 Bc5 3. Nf3 d6 4. c3 Nf6 5. fxe5 dxe5 6. Nxe5 O-O 7. d4',
        highlightMove: 'd4',
        martinaQuote: '«Si rehúsan el gambito con 2...Bc5, preparamos c3 y d4 para adueñarnos del centro con ventaja».',
        points: [
          '<strong>2...Bc5:</strong> La respuesta sólida de las negras para evitar los ataques de la columna f.',
          '<strong>4. c3!:</strong> Prepara la ocupación central d4 expulsando al alfil negro.',
          '<strong>6. Nxe5 y 7. d4:</strong> Ganancia de peón y control espacial absoluto.'
        ]
      },
      {
        id: 'mod-4',
        title: '5. Contragambito Falkbeer (2...d5!)',
        kicker: 'Módulo 5: El Golpe Central de Negras',
        heading: 'Desactivando el Contragambito Falkbeer',
        speech: '<p>Si las negras responden violentamente en el centro con el Contragambito Falkbeer <span class="move-pill">2...d5! 3. exd5 e4!</span>, clavan un peón cuña molesto en e4.</p><p>Mantenemos la compostura con <span class="move-pill">4. d3 Nf6 5. dxe4 Nxe4 6. Nf3 Bc5 7. Qe2!</span>. Clavamos su caballo de e4 a su rey y desarticulamos su plan de ataque.</p>',
        pgn: '1. e4 e5 2. f4 d5 3. exd5 e4 4. d3 Nf6 5. dxe4 Nxe4 6. Nf3 Bc5 7. Qe2 Bf5 8. Nc3',
        highlightMove: 'Nc3',
        martinaQuote: '«7. Qe2! y 8. Nc3 paraliza la cuña de e4 y restablece la ventaja de peón para el blanco».',
        points: [
          '<strong>2...d5! 3. exd5 e4!:</strong> Intento negro de robar la iniciativa con una cuña central.',
          '<strong>4. d3!:</strong> Desarma la cuña de e4 obligando al cambio de peones.',
          '<strong>7. Qe2! y 8. Nc3:</strong> Presión directa sobre el caballo e4 recuperando el dominio.'
        ]
      }
    ]
  };

  window.CURRENT_COURSE_DATA = KINGS_GAMBIT_COURSE;
})();
