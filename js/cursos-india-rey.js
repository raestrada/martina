// js/cursos-india-rey.js — Datos de lecciones para "La Defensa India de Rey" con Martina
(function() {
  'use strict';

  const KINGS_INDIAN_COURSE = {
    id: 'defensa-india-de-rey',
    title: 'La Defensa India de Rey',
    subtitle: 'El Ataque de Fuego de Martina contra 1. d4',
    perspective: 'b', // Perspectiva de Negras
    modules: [
      {
        id: 'mod-0',
        title: '1. Filosofía del Caos',
        kicker: 'Módulo 1: La Filosofía del Caos',
        heading: '¡Bienvenido a la Defensa India de Rey con Martina!',
        speech: '<p>¡Hola! Soy <strong>Martina</strong>. En los torneos mi lema es muy claro: ¡prefiero incendiar el tablero y arriesgar por la victoria antes que aceptar unas tablas aburridas!</p><p>La <strong>Defensa India de Rey</strong> (<span class="move-pill">1. d4 Nf6</span>, <span class="move-pill">2. c4 g6</span>, <span class="move-pill">3. Nc3 Bg7</span>, <span class="move-pill">4. e4 d6</span>) es la apertura de los grandes atacantes como Mikhail Tal, Garry Kasparov y Judit Polgar. Regalamos el centro en las primeras jugadas para luego lanzar una tormenta de peones sobre su rey.</p>',
        pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6',
        highlightMove: 'd6',
        martinaQuote: '«Le regalamos el centro en la jugada 4 para llevar a su rey a un bosque oscuro donde dos más dos son cinco».',
        points: [
          '<strong>Fianchetto de Alfil:</strong> El alfil en g7 apunta como un cañón a lo largo de la gran diagonal negra.',
          '<strong>Iniciativa al ataque:</strong> Cedemos el centro de peones inicial para atacarlo con fuerza destructiva.',
          '<strong>Apertura de Campeones:</strong> El arma predilecta de Mikhail Tal, Garry Kasparov y Judit Polgar.'
        ]
      },
      {
        id: 'mod-1',
        title: '2. Variante Clásica (5. Nf3)',
        kicker: 'Módulo 2: Batalla en el Flanco de Rey',
        heading: 'La Tormenta de Peones en la Variante Clásica',
        speech: '<p>Cuando las blancas juegan el desarrollo natural <span class="move-pill">5. Nf3 O-O</span> <span class="move-pill">6. Be2</span>, respondemos con el golpe central <span class="move-pill">6...e5!</span>.</p><p>Tras <span class="move-pill">7. O-O Nc6 8. d5 Ne7</span>, el centro queda cerrado. El blanco intentará atacar por el flanco de dama, ¡pero nosotros lanzamos una avalancha por el flanco de rey con <span class="move-pill">...f5</span>, <span class="move-pill">...f4</span>, <span class="move-pill">...g5</span> y <span class="move-pill">...g4</span> buscando el jaque mate!</p>',
        pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6 8. d5 Ne7',
        highlightMove: 'Ne7',
        martinaQuote: '«El blanco ataca en el flanco de dama para ganar un peón; nosotros atacamos en el flanco de rey para ganar el juego».',
        points: [
          '<strong>6...e5!:</strong> Golpeamos el centro blanco. Si cambian damas en d8, entramos a un juego cómodo.',
          '<strong>8. d5 Ne7:</strong> Cuando el centro se cierra, la batalla se divide: el blanco ataca en dama, nosotros en rey.',
          '<strong>Tormenta de peones:</strong> Avanzamos ...f5, ...f4, ...g5 buscando romper el enroque blanco.'
        ]
      },
      {
        id: 'mod-2',
        title: '3. Ataque 4 Peones (5. f4)',
        kicker: 'Módulo 3: Castigando el Centro Sobreextendido',
        heading: 'Destruyendo el Muro de Cuatro Peones',
        speech: '<p>Si las blancas se vuelven muy codiciosas y juegan <span class="move-pill">5. f4</span> (Ataque de los Cuatro Peones) creando un muro gigante en c4, d4, e4 y f4, ¡no nos asustamos!</p><p>Enroscamos <span class="move-pill">5...O-O</span> y en cuanto juegan <span class="move-pill">6. Nf3</span>, hacemos volar su centro con el dinamitazo <span class="move-pill">6...c5!</span>. Si avanzan <span class="move-pill">7. d5</span>, abrimos la columna e con <span class="move-pill">7...e6!</span> dejando sus peones centrales sobreextendidos y vulnerables.</p>',
        pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. f4 O-O 6. Nf3 c5 7. d5 e6',
        highlightMove: 'e6',
        martinaQuote: '«Un centro de cuatro peones se ve aterrador, pero es frágil como un castillo de naipes cuando dinamitas c5».',
        points: [
          '<strong>5. f4 O-O:</strong> Mantenemos la calma y aseguramos nuestro rey.',
          '<strong>6...c5!:</strong> Golpe dinámico al centro blanco aprovechando que están sobreextendidos.',
          '<strong>7...e6!:</strong> Abrimos líneas para atacar sus peones débiles.'
        ]
      },
      {
        id: 'mod-3',
        title: '4. Variante Sämisch (5. f3)',
        kicker: 'Módulo 4: Duelos de Enroques Opuestos',
        heading: 'Rompimiento Táctico contra la Sämisch',
        speech: '<p>En la Variante Sämisch <span class="move-pill">5. f3</span>, las blancas construyen una fortaleza sólida apoyando e4 y preparando el enroque largo para atacarnos.</p><p>Nosotros nos enrocamos <span class="move-pill">5...O-O</span> y atacamos su centro con <span class="move-pill">6. Be3 e5!</span>. Si cierran con <span class="move-pill">7. d5</span>, preparamos la expansión en el flanco de dama con <span class="move-pill">...c6</span> o <span class="move-pill">...a6</span> y <span class="move-pill">...b5</span>.</p>',
        pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. f3 O-O 6. Be3 e5 7. d5 c6',
        highlightMove: 'c6',
        martinaQuote: '«En enroques opuestos no hay tiempo para dudar: el que ataca primero con más fuerza se lleva la victoria».',
        points: [
          '<strong>5. f3 O-O:</strong> Las blancas preparan enroque largo y ataque en el flanco de rey.',
          '<strong>6. Be3 e5!:</strong> Reaccionamos en el centro antes de que inicien su ataque.',
          '<strong>7. d5 c6:</strong> Contraataque por el flanco de dama para abrir líneas hacia su rey.'
        ]
      },
      {
        id: 'mod-4',
        title: '5. Variante Fianchetto (5. g3)',
        kicker: 'Módulo 5: Duelo de Alfiles en la Diagonal',
        heading: 'Neutralizando el Fianchetto Blanco',
        speech: '<p>Si las blancas juegan <span class="move-pill">5. Nf3 O-O 6. g3</span> para respondernos con su propio alfil en g2, jugamos <span class="move-pill">6...d6</span> y golpeamos con <span class="move-pill">7...e5!</span>.</p><p>Tras <span class="move-pill">8. Bg2 Nbd7 9. O-O a5</span>, logramos una posición sumamente sólida. Controlamos la casilla c5 y evitamos que las blancas se expandan fácilmente en el flanco de dama.</p>',
        pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. g3 e5 7. Bg2 Nbd7',
        highlightMove: 'Nbd7',
        martinaQuote: '«Su alfil en g2 intenta neutralizar el nuestro, pero con e5 y Nbd7 bloqueamos su diagonal y mantenemos el control».',
        points: [
          '<strong>6. g3 e5!:</strong> Aseguramos nuestra presencia central.',
          '<strong>7. Bg2 Nbd7:</strong> Desarrollo flexible protegiendo el peón e5.',
          '<strong>Control posicional:</strong> Igualdad cómoda sin permitir sorpresas tácticas al blanco.'
        ]
      },
      {
        id: 'mod-5',
        title: '6. Variante Averbakh (5. Be2)',
        kicker: 'Módulo 6: La Respuesta Benoni',
        heading: 'Neutralizando la Averbakh con 6...c5 y 7...e6!',
        speech: '<p>En la Variante Averbakh (<span class="move-pill">5. Be2 O-O 6. Bg5</span>), las blancas colocan su alfil en g5 para bloquear nuestro avance tradicional e5.</p><p>¡La respuesta teórica de Martina es impecable! Respondemos con el golpe dinámico estilo Benoni <span class="move-pill">6...c5!</span>. Y cuando las blancas avanzan <span class="move-pill">7. d5</span>, minamos su centro con <span class="move-pill">7...e6!</span>. Abrimos la columna e, activamos nuestros alfiles y neutralizamos por completo el plan blanco.</p>',
        pgn: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Be2 O-O 6. Bg5 c5 7. d5 e6',
        highlightMove: 'e6',
        martinaQuote: '«Si nos bloquean e5, no nos desanimamos: atacamos por c5 y rompemos en e6 para adueñarnos del tablero».',
        points: [
          '<strong>6. Bg5 c5!:</strong> Golpe contragolpeador que evita que las blancas restrinjan nuestro juego.',
          '<strong>7. d5 e6!:</strong> Rompimiento central temático que dinamita la cadena blanca d5.',
          '<strong>Control dinámico:</strong> Abrimos la columna e y logramos una cómoda igualdad de piezas.'
        ]
      }
    ]
  };

  window.CURRENT_COURSE_DATA = KINGS_INDIAN_COURSE;
})();
