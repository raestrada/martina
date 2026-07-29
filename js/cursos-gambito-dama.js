// js/cursos-gambito-dama.js — Datos de lecciones para "El Gambito de Dama" con La Reina Negra
(function() {
  'use strict';

  const QUEENS_GAMBIT_COURSE = {
    id: 'gambito-de-dama',
    title: 'El Gambito de Dama',
    subtitle: 'El Arte del Dominio Central con la Reina Negra',
    perspective: 'w', // Perspectiva de Blancas
    modules: [
      {
        id: 'mod-0',
        title: '1. Filosofía del Gambito',
        kicker: 'Módulo 1: La Filosofía Real',
        heading: '¡Bienvenido al Gambito de Dama con la Reina Negra!',
        speech: '<p>¡En mi reino no se juega con timidez! Soy la <strong>Reina Negra</strong> y te enseño la apertura más dominante del ajedrez: el <strong>Gambito de Dama</strong> (<span class="move-pill">1. d4 d5</span> <span class="move-pill">2. c4!</span>).</p><p>Ofrecemos nuestro peón de c4 de regalo. Si el negro lo acepta, nos apoderamos del centro de inmediato con <span class="move-pill">e3</span> o <span class="move-pill">e4</span> y recuperamos el peón con nuestro alfil. Y si no lo acepta, su peón de d5 queda bajo una presión insoportable.</p>',
        pgn: '1. d4 d5 2. c4',
        highlightMove: 'c4',
        martinaQuote: '«El peón c4 no es un regalo inocente: es el cebo para adueñarnos del centro con nuestros peones e y d».',
        points: [
          '<strong>2. c4!:</strong> Desafío directo al peón central d5 de las negras desde la jugada 2.',
          '<strong>Control del Centro:</strong> Prepara el avance e4 para dominar el tablero.',
          '<strong>Iniciativa Blanca:</strong> Obliga a las negras a definirse entre aceptar o defender.'
        ]
      },
      {
        id: 'mod-1',
        title: '2. Gambito Aceptado (2...dxc4)',
        kicker: 'Módulo 2: Recuperación del Peón',
        heading: 'Dominio Central en el Gambito Aceptado',
        speech: '<p>Si las negras aceptan el regalo con <span class="move-pill">2...dxc4</span>, no nos apresuramos. Desarrollamos con <span class="move-pill">3. Nf3 Nf6 4. e3 e6 5. Bxc4</span>.</p><p>Recuperamos el peón de c4 con nuestro alfil activo, nos enrocamos rápido con <span class="move-pill">6. O-O</span> y preparamos la ruptura central <span class="move-pill">e4</span> o <span class="move-pill">c4</span> con un desarrollo superior.',
        pgn: '1. d4 d5 2. c4 dxc4 3. Nf3 Nf6 4. e3 e6 5. Bxc4 c5 6. O-O a6',
        highlightMove: 'O-O',
        martinaQuote: '«Si aceptan el peón, pierden tiempo mientras nuestro alfil recupera c4 y tomamos el control del centro».',
        points: [
          '<strong>2...dxc4:</strong> El negro abandona el centro a cambio de un peón temporal.',
          '<strong>4. e3 y 5. Bxc4:</strong> Recuperación limpia del peón con desarrollo directo.',
          '<strong>Estructura superior:</strong> Blancas dominan la columna d y el espacio central.'
        ]
      },
      {
        id: 'mod-2',
        title: '3. Gambito Rehusado (2...e6)',
        kicker: 'Módulo 3: La Variante Ortodoxa',
        heading: 'Presión en el Gambito de Dama Rehusado',
        speech: '<p>Si las negras rehúsan el gambito sosteniendo d5 con <span class="move-pill">2...e6</span>, aplicamos el desarrollo clásico ortodoxo: <span class="move-pill">3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3</span>.</p><p>Clavamos su caballo de f6 con nuestro alfil de g5. Esto inmoviliza al principal defensor del centro negro y nos da un control absoluto de la columna c.</p>',
        pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 Nbd7 7. Rc1 c6',
        highlightMove: 'c6',
        martinaQuote: '«Clavar el caballo en f6 es como ponerle un cerrojo al enroque negro: sus piezas quedan sofocadas».',
        points: [
          '<strong>2...e6:</strong> La defensa más sólida y popular contra 2. c4.',
          '<strong>4. Bg5!:</strong> Clavada incómoda sobre el caballo de f6.',
          '<strong>7. Rc1:</strong> Presión directa a lo largo de la columna abierta c.'
        ]
      },
      {
        id: 'mod-3',
        title: '4. La Defensa Eslava (2...c6)',
        kicker: 'Módulo 4: La Muralla Eslava',
        heading: 'Rompimiento frente a la Defensa Eslava',
        speech: '<p>Si las negras juegan la Defensa Eslava <span class="move-pill">2...c6</span> para sostener d5 sin encerrar a su alfil de c8, respondemos con <span class="move-pill">3. Nf3 Nf6 4. Nc3 dxc4 5. a4!</span>.</p><p>La jugada <span class="move-pill">5. a4!</span> es crucial: evita que el negro sostenga el peón c4 con b5. Luego recuperamos en c4 con <span class="move-pill">e3</span> y <span class="move-pill">Bxc4</span> manteniendo la ventaja posicional.</p>',
        pgn: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 dxc4 5. a4 Bf5 6. e3 e6 7. Bxc4',
        highlightMove: 'Bxc4',
        martinaQuote: '«5. a4! es la regla de oro: frena la expansión negra en el flanco de dama antes de recuperar el peón».',
        points: [
          '<strong>2...c6:</strong> Sostiene d5 y mantiene abierta la diagonal del alfil de casillas claras.',
          '<strong>5. a4!:</strong> Bloquea el avance b5 de las negras impidiendo que defiendan c4.',
          '<strong>7. Bxc4:</strong> Excelente estructura central con iniciativa blanca.'
        ]
      },
      {
        id: 'mod-4',
        title: '5. Contragambito Albin (2...e5!)',
        kicker: 'Módulo 5: Celadas y Contragolpes',
        heading: 'La Celada del Lasso en el Contragambito Albin',
        speech: '<p>¡Cuidado con las sorpresas! Si las negras responden con el agresivo Contragambito Albin <span class="move-pill">2...e5! 3. dxe5 d4</span>, avanzan un peón cuña a d4.</p><p>Si el blanco juega descuidado <span class="move-pill">4. e3? Bb4+ 5. Bd2 dxe3! 6. Bxb4??</span>, cae en la famosa celada: <span class="move-pill">6...exf2+ 7. Ke2 fxg1=N+!</span> ¡Promoción a caballo con jaque que gana la dama blanca! Por eso debemos jugar <span class="move-pill">4. Nf3</span> con tranquilidad.</p>',
        pgn: '1. d4 d5 2. c4 e5 3. dxe5 d4 4. Nf3 Nc6 5. g3 Bg4 6. Bg2 Qd7',
        highlightMove: 'Qd7',
        martinaQuote: '«No te apresures en e3: 4. Nf3 frena los trucos del peón d4 y nos da un peón de ventaja limpio».',
        points: [
          '<strong>2...e5! 3. dxe5 d4:</strong> Golpe violento de las negras buscando confundir al blanco.',
          '<strong>La Celada del Albin:</strong> Si 4. e3? Bb4+ 5. Bd2 dxe3!, el negro logra un subcoronamiento de caballo sangriento.',
          '<strong>4. Nf3!:</strong> La respuesta correcta que neutraliza el contragolpe y conserva la ventaja.'
        ]
      },
      {
        id: 'mod-5',
        title: '6. Defensa Chigorin (2...Nc6!)',
        kicker: 'Módulo 6: Contraataque de Piezas',
        heading: 'Desactivando la Defensa Chigorin',
        speech: '<p>En la Defensa Chigorin (<span class="move-pill">1. d4 d5 2. c4 Nc6!</span>), las negras desarrollan el caballo a c6 bloqueando su peón c para buscar un ataque de piezas rápido.</p><p>Respondemos con <span class="move-pill">3. Nf3 Bg4 4. cxd5 Bxf3 5. gxf3 Qxd5 6. e3!</span>. Aceptamos la estructura doblada de peones f3 a cambio de un centro sólido en e3-d4 y la pareja de alfiles destructiva.</p>',
        pgn: '1. d4 d5 2. c4 Nc6 3. Nf3 Bg4 4. cxd5 Bxf3 5. gxf3 Qxd5 6. e3 e5 7. Nc3 Bb4 8. Bd2 Bxc3 9. bxc3',
        highlightMove: 'bxc3',
        martinaQuote: '«Aceptamos peones doblados en f3 a cambio de un centro de peones gigantesco y la pareja de alfiles».',
        points: [
          '<strong>2...Nc6!:</strong> Provocación de las negras buscando juego de piezas rápido.',
          '<strong>4. cxd5 Bxf3 5. gxf3!:</strong> Abrimos la posición para aprovechar nuestros alfiles.',
          '<strong>6. e3!:</strong> Centro rocoso e3-d4 que paraliza cualquier intento de ataque negro.'
        ]
      }
    ]
  };

  window.CURRENT_COURSE_DATA = QUEENS_GAMBIT_COURSE;
})();
