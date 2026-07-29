// js/cursos-ataques-descubierto.js — Datos de lecciones para "Ataques y Jaques al Descubierto" (8 Módulos de Grandes Maestros)
(function() {
  'use strict';

  const DISCOVERED_ATTACKS_COURSE = {
    id: 'ataques-al-descubierto',
    title: 'Ataques y Jaques al Descubierto',
    subtitle: 'La Magia de la Jugada Invisible con Peoncito',
    perspective: 'w', // Perspectiva de Blancas
    modules: [
      {
        id: 'mod-0',
        title: '1. Jaque al Descubierto (Morphy 1858)',
        kicker: 'Módulo 1: La Obra Maestra de Morphy vs Anderssen',
        heading: 'Jaque al Descubierto Inmortal (Morphy vs Anderssen, 1858)',
        speech: '<p>¡Bienvenido a la Masterclass! Soy <strong>Peoncito</strong> y te enseño las mejores combinaciones de la historia. En Morphy vs Anderssen (1858), Morphy lanzó el temible jaque al descubierto <span class="move-pill">13. Nxf6+!!</span>.</p><p>El caballo salta de d5 a f6 dando jaque, ¡mientras al mismo tiempo descubre el ataque del alfil c4 hacia el rey en f7! El rey negro entra en pánico total.</p>',
        pgn: '1. e4 c5 2. d4 cxd4 3. Nf3 Nc6 4. Nxd4 e6 5. Nb5 d6 6. Bf4 e5 7. Be3 f5 8. N1c3 f4 9. Nd5! fxe3 10. Nbc7+ Kf7 11. Qf3+ Nf6 12. Bc4! Nd4 13. Nxf6+! d5 14. Bxd5+ Kg6 15. Qh5+ Kxf6 16. fxe3',
        highlightMove: 'fxe3',
        martinaQuote: '«13. Nxf6+!!: El caballo se retira con jaque y abre la línea del alfil c4. ¡Dos jaques en una sola jugada!».',
        points: [
          '<strong>Jaque al Descubierto Maestro:</strong> Paul Morphy retira el caballo de d5 con jaque en f6.',
          '<strong>Coordinación Caballo-Alfil:</strong> El alfil c4 ataca f7 simultáneamente.',
          '<strong>Destrucción de la Posición:</strong> El rey negro en f7 queda desprotegido ante el remate.'
        ]
      },
      {
        id: 'mod-1',
        title: '2. Clavada y Descubierto en la Ópera',
        kicker: 'Módulo 2: Morphy vs Duque de Brunswick (1858)',
        heading: 'Ataque al Descubierto en la Ópera de París',
        speech: '<p>En la famosa Partida de la Ópera (1858), Morphy combina la clavada absoluta en la columna d con un devastador jaque al descubierto: <span class="move-pill">13. Rxd7!</span> seguido de <span class="move-pill">15. Bxd7+!</span>.</p><p>Al capturar en d7 con el alfil, Morphy descubre el ataque de la torre d1 que inmoviliza a la posición entera antes del famoso sacrificio de Dama <span class="move-pill">16. Qb8+!!</span>.</p>',
        pgn: '1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7! Rxd7 14. Rd1 Qe6 15. Bxd7+! Nxd7 16. Qb8+!! Nxb8 17. Rd8#',
        highlightMove: 'Rd8#',
        martinaQuote: '«15. Bxd7+! despeja la columna d al descubierto y prepara el remate final de la partida».',
        points: [
          '<strong>Ataque al Descubierto en d7:</strong> Despeje de la columna d con jaque.',
          '<strong>16. Qb8+!!:</strong> Sacrificio brillante de Dama para desviar al caballo negro.',
          '<strong>17. Rd8#:</strong> Jaque mate impecable en la columna abierta.'
        ]
      },
      {
        id: 'mod-2',
        title: '3. El Jaque Doble Legendario',
        kicker: 'Módulo 3: Réti vs Tartakower (Viena 1910)',
        heading: 'La Máxima Expresión del Jaque Doble',
        speech: '<p>¡El <strong>Jaque Doble</strong> es el ataque más destructivo del ajedrez! DOS piezas dan jaque al mismo tiempo. El rival no puede cubrirse ni capturar: <em>¡está obligado a mover su Rey!</em></p><p>En la inmortal Réti vs Tartakower (1910), tras <span class="move-pill">9. Qd8+!! Kxd8</span>, Réti desató el jaque doble <span class="move-pill">10. Bg5+!!</span> (alfil g5 y torre d1). El rey huyó a c7 y <span class="move-pill">11. Bd8#</span> dio un Jaque Mate de leyenda.</p>',
        pgn: '1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Nf6 5. Qd3 e5 6. dxe5 Qa5+ 7. Bd2 Qxe5 8. O-O-O Nxe4 9. Qd8+!! Kxd8 10. Bg5+!! Kc7 11. Bd8#',
        highlightMove: 'Bd8#',
        martinaQuote: '«9. Qd8+!! y 10. Bg5+!!: Jaque doble con alfil y torre. Imposible de cubrir, solo queda huir al mate».',
        points: [
          '<strong>Jaque Doble:</strong> Dos piezas atacan al Rey simultáneamente. Obliga al Rey a moverse.',
          '<strong>9. Qd8+!!:</strong> Sacrificio brillante de Dama para atraer al Rey.',
          '<strong>11. Bd8#:</strong> Remate impecable de jaque mate en 11 jugadas.'
        ]
      },
      {
        id: 'mod-3',
        title: '4. El Molino de Viento',
        kicker: 'Módulo 4: Carlos Torre vs Emanuel Lasker (1925)',
        heading: 'La Maquinaria Inmortal del Molino de Viento',
        speech: '<p>El <strong>Molino de Viento</strong> es la combinación más espectacular de jaques al descubierto: una Torre y un Alfil devoran todas las piezas enemigas una tras otra.</p><p>En la famosa partida Carlos Torre vs Emanuel Lasker (Moscú 1925), Torre lanzó <span class="move-pill">25. Bf6!!</span> entregando su Dama. Luego ejecutó <span class="move-pill">26. Rxg7+ Kh8 27. Rxf7+ Kg8 28. Rg7+ Kh8 29. Rxb7+ Kg8 30. Rg7+ Kh8 31. Rg5+!</span> capturando a la Dama y todo el ejército de Lasker.</p>',
        pgn: '1. d4 Nf6 2. Nf3 e6 3. Bg5 c5 4. e3 cxd4 5. exd4 Be7 6. Nbd2 d6 7. c3 Nbd7 8. Bd3 b6 9. Nc4 Bb7 10. Qe2 Qc7 11. O-O O-O 12. Rfe1 Rfe8 13. Rad1 Nf8 14. Bc1 Nd5 15. Ng5 b5 16. Na3 b4 17. cxb4 Nxb4 18. Qh5 Bxg5 19. Bxg5 Nxd3 20. Rxd3 Qa5 21. b4! Qf5 22. Rg3 h6 23. Nc4 Qd5 24. Ne3 Qb5 25. Bf6!! Qxh5 26. Rxg7+ Kh8 27. Rxf7+ Kg8 28. Rg7+ Kh8 29. Rxb7+ Kg8 30. Rg7+ Kh8 31. Rg5+ Kh7 32. Rxh5',
        highlightMove: 'Rxh5',
        martinaQuote: '«25. Bf6!! desata el Molino de Viento: 26. Rxg7+, 27. Rxf7+, 29. Rxb7+ y 31. Rg5+ devoran todo a su paso».',
        points: [
          '<strong>25. Bf6!!:</strong> El sacrificio de Dama legendario de Carlos Torre.',
          '<strong>Molino de Viento:</strong> Bucle continuo de jaque directo y jaque al descubierto.',
          '<strong>32. Rxh5:</strong> Recuperación de la Dama con ventaja material limpia de 3 piezas.'
        ]
      },
      {
        id: 'mod-4',
        title: '5. La Perla de Kasparov',
        kicker: 'Módulo 5: Kasparov vs Topalov (Wijk aan Zee 1999)',
        heading: 'El Ataque al Descubierto Más Grande de la Historia',
        speech: '<p>Considerada por muchos como la mejor partida de ajedrez de todos los tiempos, Garry Kasparov desató un ataque al descubierto colosal con <span class="move-pill">24. Rxd4!!</span> seguido del jaque al descubierto de Torre <span class="move-pill">25. Re7+!</span>.</p><p>El rey de Topalov fue perseguido por todo el tablero en una cacería inolvidable que pasó a la historia como "La Perla de Kasparov".</p>',
        pgn: '1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1 d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4!! cxd4 25. Re7+! Kb6 26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7! Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+! Kxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1! Rd2 37. Rd7! Rxd7 38. Bxc4 bxc4 39. Qxh8',
        highlightMove: 'Qxh8',
        martinaQuote: '«24. Rxd4!! y 25. Re7+!: La combinación de ataque al descubierto más genial de Kasparov».',
        points: [
          '<strong>24. Rxd4!!:</strong> Sacrificio de torre legendario.',
          '<strong>25. Re7+!:</strong> Jaque al descubierto que saca al rey enemigo a la intemperie.',
          '<strong>Cacería Mortal:</strong> Red de mate que persigue al rey por todo el tablero.'
        ]
      },
      {
        id: 'mod-5',
        title: '6. Cacería de Rey (Lasker vs Thomas 1912)',
        kicker: 'Módulo 6: Edward Lasker vs Sir George Thomas (1912)',
        heading: 'La Inmortal Marcha del Rey por Jaques al Descubierto',
        speech: '<p>En la famosa "Cacería del Rey" (Londres 1912), Edward Lasker sacrificó su Dama con <span class="move-pill">11. Qxh7+!!</span> seguido del jaque doble al descubierto <span class="move-pill">12. Nxf6+!!</span>.</p><p>El jaque al descubierto forzó al rey negro a marchar desde h7 cruzando todo el tablero hasta g1, donde fue ejecutado con <span class="move-pill">18. Kd2#</span>. ¡La caminata mortal más famosa jamás jugada!</p>',
        pgn: '1. d4 e6 2. Nf3 f5 3. Nc3 Nf6 4. Bg5 Be7 5. Bxf6 Bxf6 6. e4 fxe4 7. Nxe4 b6 8. Ne5 O-O 9. Bd3 Bb7 10. Qh5 Qe7 11. Qxh7+!! Kxh7 12. Nxf6+!! Kh6 13. Neg4+ Kg5 14. h4+ Kf4 15. g3+ Kf3 16. Be2+ Kg2 17. Rh2+ Kg1 18. Kd2#',
        highlightMove: 'Kd2#',
        martinaQuote: '«11. Qxh7+!! y 12. Nxf6+!!: Jaque doble que arrastra al rey enemigo desde su refugio en h7 hasta g1 para el mate final».',
        points: [
          '<strong>11. Qxh7+!!:</strong> Sacrificio brillante de Dama para forzar la salida del Rey.',
          '<strong>12. Nxf6+!!:</strong> Jaque doble al descubierto con caballo e3 y alfil d3.',
          '<strong>18. Kd2#:</strong> Jaque mate magistral con el rey blanco retirándose para dar paso a la torre.'
        ]
      },
      {
        id: 'mod-6',
        title: '7. Despeje al Descubierto',
        kicker: 'Módulo 7: Abrir Canales de Ataque',
        heading: 'Despeje al Descubierto en la Columna Central',
        speech: '<p>En la posición <span class="move-pill">8. Nc3!</span> de las Dos Caballos, la maniobra del caballo no solo ataca a la Dama en d5, sino que <strong>despeja la columna e al descubierto</strong> para que la torre e1 arrase el centro.</p><p>Tras <span class="move-pill">9. Nxe4 Be6 10. Neg5!</span>, las blancas dominan el flanco de rey e impiden el enroque cómodo de las negras.</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d4 exd4 5. O-O Nxe4 6. Re1 d5 7. Bxd5 Qxd5 8. Nc3! Qa5 9. Nxe4 Be6 10. Neg5 O-O-O 11. Nxe6 fxe6 12. Rxe6',
        highlightMove: 'Rxe6',
        martinaQuote: '«Despejar la columna e al descubierto inmoviliza el centro negro y recupera el material con ventaja».',
        points: [
          '<strong>Despeje al Descubierto:</strong> Retirar el caballo para abrir la columna de la Torre.',
          '<strong>8. Nc3! y 10. Neg5!:</strong> Ataques coordinados sobre e6 y d5.',
          '<strong>12. Rxe6:</strong> Dominio de la columna e abierta.'
        ]
      },
      {
        id: 'mod-7',
        title: '8. El Ataque de Judit Polgar',
        kicker: 'Módulo 8: Polgar vs Piket (1997)',
        heading: 'Ataque al Descubierto Destructivo de Judit Polgar',
        speech: '<p>Judit Polgar es la reina de las tácticas agresivas. En Polgar vs Piket (1997), Judit combinó la clavada de peones con el rompimiento al descubierto <span class="move-pill">18. g5! d5 19. gxf6!</span>.</p><p>Polgar abre paso a sus piezas mayores destruyendo el flanco de rey de Piket y obligando al abandono en la jugada 21 con un ataque de mate imparable.</p>',
        pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 Nbd7 9. Qd2 b5 10. O-O-O Be7 11. g4 b4 12. Nd5 Bxd5 13. exd5 Nb6 14. Na5 Nbxd5 15. Nc6 Qc7 16. Nxb4 Nxe3 17. Qxe3 O-O 18. g5 d5 19. gxf6 Bxb4 20. Qg5 g6 21. Qh6',
        highlightMove: 'Qh6',
        martinaQuote: '«Judit Polgar utiliza la apertura de líneas al descubierto para sentenciar la partida con 21. Qh6 (Mate imparable)».',
        points: [
          '<strong>Ataque Agresivo de Polgar:</strong> Ruptura g5 y gxf6 al descubierto.',
          '<strong>20. Qg5 y 21. Qh6:</strong> Red de mate directa sobre g7.',
          '<strong>Dominio Total:</strong> Demostración de ataque de Grandes Maestros.'
        ]
      }
    ]
  };

  window.CURRENT_COURSE_DATA = DISCOVERED_ATTACKS_COURSE;
})();
