// js/cursos-gambito-evans.js — Datos de lecciones para "El Gambito Evans" con Caballo de Ŋ
(function() {
  'use strict';

  const EVANS_GAMBIT_COURSE = {
    id: 'gambito-evans',
    title: 'El Gambito Evans',
    subtitle: 'Ataque Relámpago y Geometría Rebelde con Caballo de Ŋ',
    perspective: 'w', // Perspectiva de Blancas
    modules: [
      {
        id: 'mod-0',
        title: '1. El Sacrificio en b4',
        kicker: 'Módulo 1: La Bomba de Paul Morphy',
        heading: '¡Bienvenido al Gambito Evans con Caballo de Ŋ!',
        speech: '<p>¡Salto en L o en Ŋ, pero siempre al ataque! Soy el <strong>Caballo de Ŋ</strong> y te presento el <strong>Gambito Evans</strong> (<span class="move-pill">1. e4 e5</span> <span class="move-pill">2. Nf3 Nc6</span> <span class="move-pill">3. Bc4 Bc5</span> <span class="move-pill">4. b4!</span>).</p><p>Regalamos el peón b4 en la jugada 4. No buscamos defender peones, ¡buscamos ganarle un tiempo al alfil negro, formar un centro gigante con c3 y d4 y aplastar el enroque enemigo antes de que puedan respirar!</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3',
        highlightMove: 'c3',
        martinaQuote: '«Entregas el peón b4 para ganar tiempos vitales con c3 y d4. ¡Un sacrificio de libro!».',
        points: [
          '<strong>4. b4!:</strong> Desaloja al alfil negro de c5 obligándolo a perder un tiempo.',
          '<strong>5. c3:</strong> Prepara la ocupación total del centro con d4.',
          '<strong>Ataque de Románticos:</strong> El arma favorita de Paul Morphy y Garry Kasparov.'
        ]
      },
      {
        id: 'mod-1',
        title: '2. Línea Principal (5...Ba5)',
        kicker: 'Módulo 2: Ocupación Central',
        heading: 'Avance Central Inevitable 6. d4!',
        speech: '<p>Si las negras retiran su alfil a a5 (<span class="move-pill">5...Ba5</span>), desatamos la tormenta central con <span class="move-pill">6. d4!</span>.</p><p>Tras <span class="move-pill">6...exd4 7. O-O</span>, no nos apuramos en recapturar. Nuestro alfil de c4 apunta a f7, nuestra dama tiene la diagonal libre y las piezas negras quedan paralizadas en su flanco de dama.</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O dxc3 8. Qb3',
        highlightMove: 'Qb3',
        martinaQuote: '«7. O-O y 8. Qb3: Dama y Alfil forman una batería letal que apunta directo a f7».',
        points: [
          '<strong>5...Ba5:</strong> La retirada más teórica de las negras.',
          '<strong>6. d4!:</strong> Avance temático que dinamita el centro negro.',
          '<strong>8. Qb3:</strong> Amenaza doble sobre f7 y b7 con ataque directo.'
        ]
      },
      {
        id: 'mod-2',
        title: '3. Defensa 5...Be7',
        kicker: 'Módulo 3: Retirada Prudente',
        heading: 'Abriendo Brecha contra 5...Be7',
        speech: '<p>Si las negras juegan la retirada cautelosa <span class="move-pill">5...Be7</span>, no les damos respiro y golpeamos igual con <span class="move-pill">6. d4!</span>.</p><p>Si responden <span class="move-pill">6...Na5</span> atacando nuestro alfil, respondemos con <span class="move-pill">7. Be2! exd4 8. Qxd4!</span>. Mantenemos el alfil activo y colocamos a la Dama blanca en el centro dominando el tablero.</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Be7 6. d4 Na5 7. Be2 exd4 8. Qxd4',
        highlightMove: 'Qxd4',
        martinaQuote: '«7. Be2 conserva nuestro alfil clave sin permitir que el caballo negro lo cambie».',
        points: [
          '<strong>5...Be7:</strong> Retirada alternativa buscando proteger el alfil.',
          '<strong>6...Na5:</strong> Contragolpe negro atacando el alfil c4.',
          '<strong>7. Be2! y 8. Qxd4:</strong> Control central total y amenaza sobre g7.'
        ]
      },
      {
        id: 'mod-3',
        title: '4. La Defensa Lasker',
        kicker: 'Módulo 4: Devolución del Peón',
        heading: 'Neutralizando la Defensa Lasker',
        speech: '<p>El Campeón Mundial Emanuel Lasker propuso devolver el peón con <span class="move-pill">6. d4 d6 7. O-O Bb6! 8. dxe5 dxe5</span>.</p><p>Tras <span class="move-pill">9. Qxd8+ Nxd8 10. Nxe5</span>, las negras consiguen simplificar posiciones, ¡pero las blancas recuperan su peón con mejor estructura de piezas y caballo centralizado en e5!</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 d6 7. O-O Bb6 8. dxe5 dxe5 9. Qxd8+ Nxd8 10. Nxe5',
        highlightMove: 'Nxe5',
        martinaQuote: '«Incluso si el negro devuelve el peón, recuperamos material e ingresamos a un final superior».',
        points: [
          '<strong>7...Bb6!:</strong> La jugada de Lasker para devolver el peón de ventaja.',
          '<strong>9. Qxd8+:</strong> Cambio de damas que neutraliza el ataque violento.',
          '<strong>10. Nxe5:</strong> Recuperación de peón con mejor actividad de piezas.'
        ]
      },
      {
        id: 'mod-4',
        title: '5. Ataque Feroz 7. Qb3',
        kicker: 'Módulo 5: Asalto Directo',
        heading: 'Presión Bivalente con 7. Qb3',
        speech: '<p>En la variante agresiva tras <span class="move-pill">5...Ba5 6. d4 exd4</span>, lanzamos <span class="move-pill">7. Qb3! Qe7 8. O-O</span>.</p><p>Acompañamos a nuestro caballo con un ataque cruzado sobre f7 y b7. Si el negro captura <span class="move-pill">8...dxc3</span>, activamos nuestras piezas con <span class="move-pill">9. Nxc3</span> para un remate relámpago.</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. Qb3 Qe7 8. O-O Bb6 9. Ba3',
        highlightMove: 'Ba3',
        martinaQuote: '«9. Ba3! inmoviliza a la dama negra en la diagonal a3-f8 impidiendo su desarrollo».',
        points: [
          '<strong>7. Qb3!:</strong> Ataque combinado sobre las debilidades negras.',
          '<strong>8...Bb6:</strong> El negro intenta reubicar su alfil para defender.',
          '<strong>9. Ba3!:</strong> Clavada letal que congela a la Dama negra.'
        ]
      }
    ]
  };

  window.CURRENT_COURSE_DATA = EVANS_GAMBIT_COURSE;
})();
