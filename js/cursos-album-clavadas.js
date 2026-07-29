// js/cursos-album-clavadas.js — Datos de lecciones para "El Álbum de Clavadas de Martina" (9 Módulos)
(function() {
  'use strict';

  const PINS_MASTERCLASS_COURSE = {
    id: 'album-clavadas',
    title: 'El Álbum de Clavadas de Martina',
    subtitle: 'La Táctica Favorita de Martina: Coleccionando Clavadas Inolvidables',
    perspective: 'w', // Perspectiva de Blancas
    modules: [
      {
        id: 'mod-0',
        title: '1. La Clavada Absoluta',
        kicker: 'Módulo 1: Inmovilidad Total',
        heading: '¡Bienvenido a mi Colección de Clavadas!',
        speech: '<p>¡Llegaste a mi sección favorita de todo el ajedrez! Soy <strong>Martina</strong> y colecciono clavadas como otros coleccionan cromos. No les temo: ¡las busco y las celebro!</p><p>Una <strong>Clavada Absoluta</strong> ocurre cuando una pieza está atrapada frente a su propio <strong>Rey</strong>. Por las reglas del ajedrez, esa pieza <em>¡no puede moverse bajo ninguna circunstancia!</em> Es una estatua de piedra.</p>',
        pgn: '1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5',
        highlightMove: 'Bg5',
        martinaQuote: '«Una clavada absoluta es la parálisis perfecta: el caballo en f6 no puede moverse porque su Rey quedaría al descubierto».',
        points: [
          '<strong>Clavada Absoluta:</strong> La pieza inmovilizada cubre al Rey y no puede moverse por reglamento.',
          '<strong>9. Bg5!:</strong> Clava al caballo f6 contra el rey e8.',
          '<strong>Ventaja Táctica:</strong> La pieza clavada no puede defender a otros puntos del tablero.'
        ]
      },
      {
        id: 'mod-1',
        title: '2. La Clavada Relativa',
        kicker: 'Módulo 2: El Dilema del Material',
        heading: 'Arriesgando Piezas Mayores con la Clavada Relativa',
        speech: '<p>A diferencia de la absoluta, en la <strong>Clavada Relativa</strong> la pieza atrapada cubre a una figura valiosa (como la <strong>Dama</strong> o una <strong>Torre</strong>).</p><p>La pieza <em>puede</em> moverse legalmente, pero si se mueve... ¡nos zampamos la pieza valiosa que estaba detrás! Es un dilema doloroso para el rival.</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Bb7 10. d4 Re8 11. Ng5 Rf8',
        highlightMove: 'Rf8',
        martinaQuote: '«En la clavada relativa, si el rival mueve su pieza, ¡perderá su Dama o su Torre de inmediato!».',
        points: [
          '<strong>Clavada Relativa:</strong> La pieza cubre a una figura valiosa (Dama, Torre). Moverla es un suicidio material.',
          '<strong>11. Ng5!:</strong> Amenaza el punto f7 coordinado con el alfil de b3.',
          '<strong>Presión Constante:</strong> Obliga a las negras a mantenerse a la defensiva.'
        ]
      },
      {
        id: 'mod-2',
        title: '3. Aumentar la Presión',
        kicker: 'Módulo 3: La Regla de Oro',
        heading: '¡Aumenta los Ataques sobre la Pieza Clavada!',
        speech: '<p>¡Escucha bien la Regla de Oro de Martina!: <strong>«¡Nunca captures la pieza clavada de inmediato... súmale más atacantes!»</strong>.</p><p>Si una pieza está clavada, no se puede escapar. Si la atacas con peones o caballos adicionales, el rival se quedará sin defensores y su posición colapsará como un castillo de naipes.</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 d6 4. Nc3 Bg4 5. h3 Bh5 6. Nxe5! Bxd1?? 7. Bxf7+ Ke7 8. Nd5#',
        highlightMove: 'Nd5#',
        martinaQuote: '«Si atacas a una pieza clavada con peones o caballos adicionales, la posición rival colapsa por completo».',
        points: [
          '<strong>Regla de Oro:</strong> Ataca a la pieza clavada con más piezas o peones de menor valor.',
          '<strong>6. Nxe5!!:</strong> El famoso Mate de Légal tras romper la clavada sorpresivamente.',
          '<strong>8. Nd5#:</strong> Jaque mate impecable en el centro del tablero.'
        ]
      },
      {
        id: 'mod-3',
        title: '4. La Clavada Cruzada',
        kicker: 'Módulo 4: Parálisis Multidireccional',
        heading: 'Doble Presión con la Clavada en Cruz',
        speech: '<p>¿Qué es mejor que una clavada? <strong>¡Dos clavadas cruzadas sobre la misma pieza!</strong></p><p>Ocurre cuando una pieza queda clavada horizontalmente por una Torre y al mismo tiempo en diagonal por un Alfil o Dama. La pieza no puede ir hacia adelante, ni atrás, ni a los lados. ¡Parálisis multidireccional!</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Nf6 5. Nc3 Bb4 6. Nxc6 bxc6 7. Bd3 d5 8. exd5 cxd5 9. O-O O-O 10. Bg5 c6 11. Qf3 Be7 12. Rae1',
        highlightMove: 'Rae1',
        martinaQuote: '«Una clavada en cruz sofoca la pieza por dos diagonales y columnas distintas. ¡Imposible de defender!».',
        points: [
          '<strong>Clavada en Cruz:</strong> Múltiples piezas atacan la misma casilla desde distintas direcciones.',
          '<strong>10. Bg5 y 12. Rae1:</strong> Presión coordinada sobre el flanco de rey y columna e.',
          '<strong>Control Total:</strong> Paraliza las maniobras enemigas por completo.'
        ]
      },
      {
        id: 'mod-4',
        title: '5. Romper la Clavada',
        kicker: 'Módulo 5: Técnicas de Desclavada',
        heading: 'Cómo Liberarte de una Clavada Molesta',
        speech: '<p>Si el rival te clava una pieza, ¡no entres en pánico! Existen 3 métodos infalibles para <strong>desclavarte</strong>:</p><p>1. Interponer una pieza escudo (como <span class="move-pill">...Be7</span>).<br>2. Expulsar al atacante con peones (<span class="move-pill">...h6</span> y <span class="move-pill">...g5</span>).<br>3. Contra-atacar con un jaque o una amenaza mayor.</p>',
        pgn: '1. e4 e5 2. Nf3 d6 3. Bc4 Bg4 4. h3 Bh5 5. c3 Nf6 6. d3 Be7 7. Nbd2 O-O 8. Nf1 c6 9. Ng3 Bg6',
        highlightMove: 'Bg6',
        martinaQuote: '«Con ...Be7 o ...h6 y ...Bg6 rompemos la clavada del alfil enemigo limpiamente».',
        points: [
          '<strong>Interposición:</strong> Colocar un alfil en e7 bloquea la línea de la clavada.',
          '<strong>Expulsión:</strong> El peón h3 obliga al alfil a retirarse o cambiar.',
          '<strong>Reubicación:</strong> Mantener la armonía sin perder material.'
        ]
      },
      {
        id: 'mod-5',
        title: '6. Clavar al Defensor',
        kicker: 'Módulo 6: Destruir la Guardia',
        heading: 'Inmovilizando a la Pieza Defensora',
        speech: '<p>Una de las aplicaciones más astutas es <strong>clavar a la pieza que defiende una casilla clave</strong>.</p><p>Si el caballo de e7 o f6 defiende un peón o el enroque, lo clavamos con nuestro alfil. Al quedar inmovilizado, deja de proteger a sus compañeros y podemos irrumpir con fuerza.</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Bd2 Bxd2+ 8. Nbxd2 d5 9. exd5 Nxd5 10. Qb3 Nce7 11. O-O O-O 12. Rfe1 c6 13. Bg5',
        highlightMove: 'Bg5',
        martinaQuote: '«Clavar a la pieza defensora es como quitarle el escudo al rival: sus piezas quedan vulnerables».',
        points: [
          '<strong>Destruir la Guardia:</strong> Inmoviliza al caballo o alfil que protege los puntos críticos.',
          '<strong>13. Bg5!:</strong> Clava al caballo de e7 eliminando su control sobre d5.',
          '<strong>Dominio Posicional:</strong> Las piezas atacantes entran sin resistencia.'
        ]
      },
      {
        id: 'mod-6',
        title: '7. La Clavada en Finales',
        kicker: 'Módulo 7: Zugzwang de Torres',
        heading: 'Inmovilidad Mortal en el Final de Partida',
        speech: '<p>En los finales de partida con pocas piezas, ¡una clavada es aún más devastadora!</p><p>Si una Torre clava a otra Torre o peón contra el Rey en la 7ª fila, el bando rival queda en <strong>Zugzwang</strong>: cualquier movimiento que haga destruye su propia posición.</p>',
        pgn: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Bc5 5. Be3 Qf6 6. c3 Nge7 7. Bc4 O-O 8. O-O d6 9. f4 Bd7 10. Kh1 Rad8 11. Nc2 Bxe3 12. Nxe3',
        highlightMove: 'Nxe3',
        martinaQuote: '«En los finales, una clavada en la 7ª fila congela las torres enemigas y fuerza la victoria».',
        points: [
          '<strong>Zugzwang por Clavada:</strong> El rival no tiene jugadas útiles y empeora al mover.',
          '<strong>Dominio de Torres:</strong> Control vertical inquebrantable.',
          '<strong>Simplificación Ganadora:</strong> Forzado de cambio de piezas en posición favorable.'
        ]
      },
      {
        id: 'mod-7',
        title: '8. La Falsa Clavada',
        kicker: 'Módulo 8: La Celada Sorpresa',
        heading: 'Aprovechando la Falsa Sensación de Seguridad',
        speech: '<p>¡Cuidado! No todas las clavadas son seguras. A veces el rival cree que nos tiene clavados, ¡pero preparamos un sacrificio sorpresa!</p><p>Al mover la pieza "clavada" con un jaque o una amenaza de mate devastadora (como en el Mate de Légal), el rival descubre demasiado tarde que la clavada era una ilusión.</p>',
        pgn: '1. e4 e5 2. Nf3 d6 3. Bc4 Bg4 4. Nc3 g6 5. Nxe5 Bxd1 6. Bxf7+ Ke7 7. Nd5#',
        highlightMove: 'Nd5#',
        martinaQuote: '«El rival cree que te tiene atrapado, pero rompes la clavada con un jaque mortal que gana la partida».',
        points: [
          '<strong>Falsa Clavada:</strong> Romper la clavada entregando la Dama a cambio del Jaque Mate.',
          '<strong>5. Nxe5!!:</strong> Jugada maestra que aprovecha la debilidad de f7 y e7.',
          '<strong>7. Nd5#:</strong> Remate impecable de 3 piezas menores coordinadas.'
        ]
      },
      {
        id: 'mod-8',
        title: '9. La Ópera de París',
        kicker: 'Módulo 9: La Partida Inmortal de Morphy',
        heading: 'La Máxima Obra Maestra de las Clavadas (1858)',
        speech: '<p>Para coronar nuestra Masterclass, revivimos la partida más famosa de la historia: <strong>Paul Morphy en la Ópera de París (1858)</strong>.</p><p>Morphy utilizó una clavada absoluta en g5 y otra en b5 para entregar su Dama con <span class="move-pill">16. Qb8+!!</span> y dar Jaque Mate con su torre en d8. ¡La sinfonía definitiva de la clavada!</p>',
        pgn: '1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+!! Nxb8 17. Rd8#',
        highlightMove: 'Rd8#',
        martinaQuote: '«16. Qb8+!! y 17. Rd8#: ¡La sinfonía de clavadas más hermosa jamás jugada en un tablero!».',
        points: [
          '<strong>Clavada de Morphy:</strong> La torre de d1 y alfil de b5 inmovilizan la defensa d7.',
          '<strong>16. Qb8+!!:</strong> Sacrificio brillante de Dama para desviar al caballo.',
          '<strong>17. Rd8#:</strong> Jaque mate magistral rematado con la torre.'
        ]
      }
    ]
  };

  window.CURRENT_COURSE_DATA = PINS_MASTERCLASS_COURSE;
})();
