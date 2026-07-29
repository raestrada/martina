// js/cursos-sistema-colle.js — Datos de lecciones para "El Sistema Colle" con Alfil Exiliado
(function() {
  'use strict';

  const COLLE_SYSTEM_COURSE = {
    id: 'sistema-colle',
    title: 'El Sistema Colle',
    subtitle: 'La Pirámide de Piedra y el Regalo Griego en d3 con Alfil Exiliado',
    perspective: 'w', // Perspectiva de Blancas
    modules: [
      {
        id: 'mod-0',
        title: '1. La Pirámide de Piedra',
        kicker: 'Módulo 1: Geometría de Alfil Exiliado',
        heading: '¡Bienvenido al Sistema Colle con Alfil Exiliado!',
        speech: '<p>¡Me exiliaron a esta diagonal por protestar contra las tablas aburridas, pero desde aquí reinventamos la geometría! Soy el <strong>Alfil Exiliado</strong> y te enseño el <strong>Sistema Colle</strong> (<span class="move-pill">1. d4</span>, <span class="move-pill">2. Nf3</span>, <span class="move-pill">3. e3</span>, <span class="move-pill">4. Bd3</span>, <span class="move-pill">5. c3</span>, <span class="move-pill">6. Nbd2</span>, <span class="move-pill">7. O-O</span>).</p><p>Construimos una pirámide de peones impenetrable en c3-d4-e3 mientras colocamos a nuestro alfil en d3 apuntando como un francotirador al enroque negro.</p>',
        pgn: '1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. O-O O-O',
        highlightMove: 'O-O',
        martinaQuote: '«Una masa sólida en el centro sostiene la posición; mi diagonal desde d3 destruye el enroque enemigo».',
        points: [
          '<strong>Pirámide c3-d4-e3:</strong> Solidez absoluta a prueba de cualquier ataque negro en el centro.',
          '<strong>El Francotirador en d3:</strong> El alfil apunta directo a la casilla h7 del rey rival.',
          '<strong>Desarrollo tranquilo:</strong> O-O sin arriesgar piezas ni memorizar teoría compleja.'
        ]
      },
      {
        id: 'mod-1',
        title: '2. El Contragolpe 8. e4!',
        kicker: 'Módulo 2: La Ruptura de Colle',
        heading: 'La Ruptura Central Inevitable 8. e4!',
        speech: '<p>Una vez que ambas partes se enrocan, ¡llegó el momento de encender la mecha con <span class="move-pill">8. e4!</span>.</p><p>Si las negras capturan <span class="move-pill">8...dxe4 9. Nxe4 Nxe4 10. Bxe4</span>, abrimos el centro por completo. Nuestro alfil de e4 y el de c1 quedan apuntando hacia el enroque negro con una fuerza destructiva insostenible.</p>',
        pgn: '1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. O-O O-O 8. e4 dxe4 9. Nxe4 Nxe4 10. Bxe4',
        highlightMove: 'Bxe4',
        martinaQuote: '«8. e4 no es solo un avance: es el detonador que abre las diagonales para el ataque final».',
        points: [
          '<strong>8. e4!:</strong> Rompimiento temático que abre el centro cuando nuestras piezas están listas.',
          '<strong>10. Bxe4:</strong> El alfil toma el centro y apunta hacia h7 con soporte directo.',
          '<strong>Apertura de diagonales:</strong> Las negras sufren para defender su rey sin casillas de escape.'
        ]
      },
      {
        id: 'mod-2',
        title: '3. El Regalo Griego (Bxh7+!)',
        kicker: 'Módulo 3: El Sacrificio Legendario',
        heading: '¿Qué gana el Blanco al sacrificar el Alfil en h7?',
        speech: '<p>¡Tensamos la trampa! Tras <span class="move-pill">10...cxd4</span>, la casilla h7 no tiene defensa. ¡Desatamos el Regalo Griego <span class="move-pill">11. Bxh7+!!</span>!</p><p><strong>Paso 1:</strong> <span class="move-pill">11. Bxh7+! Kxh7</span> captura el peón de h7, destruye el refugio del rey y lo obliga a salir.<br><strong>Paso 2:</strong> <span class="move-pill">12. Ng5+! Kg8</span> da jaque con el caballo y despeja la diagonal d1-h5.<br><strong>Paso 3:</strong> <span class="move-pill">13. Qh5!</span> coloca la Dama en la columna h despejada. Como la casilla h6 está libre, la Dama entra directo a dar <strong>16. Qh7# (Jaque Mate)</strong>.</p>',
        pgn: '1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. O-O O-O 8. e4 dxe4 9. Nxe4 Nxe4 10. Bxe4 cxd4 11. Bxh7+ Kxh7 12. Ng5+ Kg8 13. Qh5 Re8 14. Qxf7+ Kh8 15. Qh5+ Kg8 16. Qh7#',
        highlightMove: 'Qh7#',
        martinaQuote: '«Entregas un alfil de 3 puntos en h7 para abrir la columna h y darle Jaque Mate a su rey».',
        points: [
          '<strong>11. Bxh7+!!:</strong> Captura el peón de h7, destruye el escudo del rey y lo obliga a salir.',
          '<strong>12. Ng5+!:</strong> Da jaque y abre la columna h para la Dama blanca.',
          '<strong>13. Qh5 + 16. Qh7#:</strong> Amenaza de jaque mate imparable al estar despejada la casilla h6.'
        ]
      },
      {
        id: 'mod-3',
        title: '4. Frente a 1...g6 / ...Nf6',
        kicker: 'Módulo 4: Adaptación Posicional',
        heading: 'Adaptando la Pirámide contra el Fianchetto',
        speech: '<p>Si las negras intentan bloquear la diagonal h1-a8 mediante un fianchetto (<span class="move-pill">1. d4 Nf6 2. Nf3 g6</span>), adaptamos el esquema Colle con <span class="move-pill">3. e3 Bg7 4. Bd3 d6 5. O-O O-O 6. e4!</span>.</p><p>En lugar de c3, avanzamos directamente <span class="move-pill">6. e4</span> ganando espacio en el centro y transformando la posición en un ataque directo con <span class="move-pill">Re1</span> y <span class="move-pill">c3</span>.</p>',
        pgn: '1. d4 Nf6 2. Nf3 g6 3. e3 Bg7 4. Bd3 d6 5. O-O O-O 6. e4 Nbd7 7. Re1 e5 8. c3',
        highlightMove: 'c3',
        martinaQuote: '«Frente al fianchetto negro no nos quedamos pasivos: tomamos el centro con e4 y mantenemos la presión».',
        points: [
          '<strong>6. e4!:</strong> Ocupamos el centro de inmediato aprovechando que el negro no jugó ...d5.',
          '<strong>7. Re1 e5:</strong> Sostenemos la posición central con equilibrio total.',
          '<strong>Estructura flexible:</strong> Adaptabilidad total sin arriesgar debilidades.'
        ]
      },
      {
        id: 'mod-4',
        title: '5. Colle-Zukertort (b3 & Bb2)',
        kicker: 'Módulo 5: El Doble Alfil de Ataque',
        heading: 'Activando el Alfil de c1 con b3',
        speech: '<p>Cuando las negras sacan su alfil temprano a <span class="move-pill">...Bf5</span> para bloquear a nuestro francotirador de d3, aplicamos la variante <strong>Colle-Zukertort</strong>.</p><p>Jugamos <span class="move-pill">1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 c5 5. b3! Nc6 6. O-O Bd6 7. Bb2!</span>. Sacamos a nuestro alfil por b2 a la gran diagonal a1-h8. ¡Ahora tenemos dos alfiles apuntando simultáneamente al enroque negro!</p>',
        pgn: '1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 c5 5. b3 Nc6 6. O-O Bd6 7. Bb2 O-O 8. Ne5',
        highlightMove: 'Ne5',
        martinaQuote: '«Con b3 y Bb2, mis dos alfiles forman un compás perfecto apuntando al rey enemigo».',
        points: [
          '<strong>5. b3! y 7. Bb2!:</strong> El Colle-Zukertort activa ambos alfiles en diagonales paralelas.',
          '<strong>8. Ne5!:</strong> Puesto avanzado para el caballo respaldado por el alfil de b2.',
          '<strong>Ataque temático:</strong> Prepara f4 y Rf3-h3 lanzando una defensa imparable.'
        ]
      },
      {
        id: 'mod-5',
        title: '6. Dominio del Ataque Completo',
        kicker: 'Módulo 6: La Maniobra de Cierre',
        heading: 'Coordinación Final de Piezas en el Colle',
        speech: '<p>Repasemos la hoja de ruta del Colle para tus partidas: 1) Construye la pirámide <span class="move-pill">d4-e3-c3</span>. 2) Ubica al alfil en <span class="move-pill">d3</span> y al caballo en <span class="move-pill">d2</span>. 3) Enrócate seguro.</p><p>4) Si el centro se abre con <span class="move-pill">8. e4</span>, busca la combinación con <span class="move-pill">Nxe4</span>, <span class="move-pill">Ng5</span> y <span class="move-pill">Qh5</span>. ¡El Sistema Colle te dará victorias constantes y espectaculares!</p>',
        pgn: '1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. O-O O-O 8. e4 dxe4 9. Nxe4 Nxe4 10. Bxe4',
        highlightMove: 'Bxe4',
        martinaQuote: '«Construye con calma, apunta con precisión y dispara con audacia. ¡Esa es la regla del Colle!».',
        points: [
          '<strong>Orden claro:</strong> 1.d4, 2.Nf3, 3.e3, 4.Bd3, 5.c3, 6.Nbd2, 7.O-O, 8.e4.',
          '<strong>Visión táctica:</strong> Alfil en d3 listo para sacrificar o presionar h7.',
          '<strong>Solidez y ataque:</strong> Fácil de aprender, imposible de derribar si se juega con precisión.'
        ]
      }
    ]
  };

  window.CURRENT_COURSE_DATA = COLLE_SYSTEM_COURSE;
})();
