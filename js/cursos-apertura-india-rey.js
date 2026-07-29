// js/cursos-apertura-india-rey.js — Datos de lecciones para "La Apertura India del Rey" con Peoncito
(function() {
  'use strict';

  const KINGS_INDIAN_ATTACK_COURSE = {
    id: 'apertura-india-del-rey',
    title: 'La Apertura India del Rey',
    subtitle: 'El Arma Universal de Blancas de Bobby Fischer y Peoncito',
    perspective: 'w', // Perspectiva de Blancas
    modules: [
      {
        id: 'mod-0',
        title: '1. La Receta Universal',
        kicker: 'Módulo 1: La Filosofía de Peoncito',
        heading: '¡Bienvenido a la Apertura India del Rey!',
        speech: '<p>¡Un peón sin bigote es invisible, pero un peón con bigote comanda el ejército blanco! Soy <strong>Peoncito</strong> y te presento la <strong>Apertura India del Rey</strong> (<span class="move-pill">1. Nf3</span>, <span class="move-pill">2. g3</span>, <span class="move-pill">3. Bg2</span>, <span class="move-pill">4. O-O</span>, <span class="move-pill">5. d3</span>, <span class="move-pill">6. Nbd2</span>, <span class="move-pill">7. e4!</span>).</p><p>Es el sistema universal preferido por el legendario Bobby Fischer. No importa lo que jueguen las negras, armamos nuestra fortaleza de hierro y lanzamos una avalancha al enroque rival.</p>',
        pgn: '1. Nf3 d5 2. g3 Nf6 3. Bg2 c6 4. O-O Bg4 5. d3 Nbd7 6. Nbd2 e5 7. e4',
        highlightMove: 'e4',
        martinaQuote: '«No memorizamos mil aperturas: armamos nuestra fortaleza con bigote y atacamos el rey negro».',
        points: [
          '<strong>Sistema Universal:</strong> Funciona contra 1...d5, la Defensa Francesa, Siciliana o Caro-Kann.',
          '<strong>Enroque ultraseguro:</strong> El rey blanco queda protegido detrás del alfil en g2.',
          '<strong>Ruptura 7. e4!:</strong> Ocupamos el centro en el momento perfecto para iniciar el ataque.'
        ]
      },
      {
        id: 'mod-1',
        title: '2. Contra Defensa Francesa',
        kicker: 'Módulo 2: La Estrategia de Bobby Fischer',
        heading: 'El Plan Inevitable de Bobby Fischer',
        speech: '<p>Cuando las negras juegan la Defensa Francesa (<span class="move-pill">1. e4 e6</span> <span class="move-pill">2. d3 d5</span> <span class="move-pill">3. Nbd2 Nf6</span>), armamos nuestra India del Rey con <span class="move-pill">4. g3 c5 5. Bg2 Nc6 6. Ngf3 Be7 7. O-O O-O</span>.</p><p>¡Y aquí viene la jugada maestra de Fischer: <span class="move-pill">8. e5!</span>. Expulsamos su caballo de f6, jugamos <span class="move-pill">9. Re1 Nd7 10. Nf1!</span> maniobrando el caballo hacia g3 o h5 para dar jaque mate.</p>',
        pgn: '1. e4 e6 2. d3 d5 3. Nbd2 Nf6 4. g3 c5 5. Bg2 Nc6 6. Ngf3 Be7 7. O-O O-O 8. e5 Nd7 9. Re1',
        highlightMove: 'Re1',
        martinaQuote: '«8. e5 es la llave que abre el ataque: desaloja al defensor f6 y deja libre la autopista hacia el rey».',
        points: [
          '<strong>8. e5!:</strong> Expulsa al caballo f6, el principal defensor del enroque negro.',
          '<strong>Maniobra Nf1-g3/h5:</strong> El caballo se reubica hacia el flanco de rey para sumarse a la embestida.',
          '<strong>Planes de ataque:</strong> Continuamos con h4-h5, Bf4 y Qe2 creando amenazas letales.'
        ]
      },
      {
        id: 'mod-2',
        title: '3. Contra Defensa Siciliana',
        kicker: 'Módulo 3: Neutralizando el Centro Siciliano',
        heading: 'Construyendo el Muro contra la Siciliana',
        speech: '<p>Frente a la agresiva Defensa Siciliana (<span class="move-pill">1. e4 c5</span>), jugamos <span class="move-pill">2. Nf3 e6 3. d3 d5 4. Nbd2 Nc6 5. g3</span>.</p><p>Evitamos entrar en las complejas y peligrosas líneas principales de la Siciliana. Mantenemos el control del juego con <span class="move-pill">6. Bg2 Nf6 7. O-O Be7 8. e5!</span>, cerrando el centro a nuestro favor y trasladando la batalla a nuestro terreno de ataque.</p>',
        pgn: '1. e4 c5 2. Nf3 e6 3. d3 d5 4. Nbd2 Nc6 5. g3 Nf6 6. Bg2 Be7 7. O-O O-O 8. e5 Nd7',
        highlightMove: 'Nd7',
        martinaQuote: '«No entramos al terreno del rival: lo traemos a nuestro territorio donde conocemos cada casilla».',
        points: [
          '<strong>Evitar teoría pesada:</strong> Con 2. Nf3 y 3. d3 evitamos memorizar 30 variantes de la Siciliana.',
          '<strong>Estructura sólida:</strong> El alfil en g2 frena cualquier ataque negro en el flanco de dama.',
          '<strong>8. e5!:</strong> Repetimos la receta ganadora de control espacial.'
        ]
      },
      {
        id: 'mod-3',
        title: '4. Variante Yugoslavia (4...Bg4)',
        kicker: 'Módulo 4: Frente al Desarrollo de Alfil',
        heading: 'Neutralizando la Clavada con 5. d3 y Nbd2',
        speech: '<p>En la Variante Yugoslavia (<span class="move-pill">1. Nf3 d5 2. g3 Nf6 3. Bg2 c6 4. O-O</span>), las negras desarrollan su alfil a <span class="move-pill">4...Bg4</span> para clavar nuestro caballo.</p><p>Respondemos con sangre fría: <span class="move-pill">5. d3 Nbd7 6. Nbd2 e5 7. e4!</span>. Si las negras cambian peones <span class="move-pill">7...dxe4 8. dxe4</span>, mantenemos un centro impecable y preparamos <span class="move-pill">h3</span> y <span class="move-pill">c3</span> para expandirnos.</p>',
        pgn: '1. Nf3 d5 2. g3 Nf6 3. Bg2 c6 4. O-O Bg4 5. d3 Nbd7 6. Nbd2 e5 7. e4 dxe4 8. dxe4',
        highlightMove: 'dxe4',
        martinaQuote: '«Si clavan el caballo, no nos desesperamos. Reforzamos con Nbd2 y e4 manteniendo la sartén por el mango».',
        points: [
          '<strong>4...Bg4:</strong> Intento negro de presionar nuestro caballo f3.',
          '<strong>6. Nbd2 e5 7. e4!:</strong> Avance firme que sostiene el centro blanco.',
          '<strong>8. dxe4:</strong> Mantenemos la estructura de peones intacta y dominamos la columna d.'
        ]
      },
      {
        id: 'mod-4',
        title: '5. Ruptura Central con 7. c4',
        kicker: 'Módulo 5: Flexibilidad Estratégica',
        heading: 'Abriendo el Centro con 7. c4',
        speech: '<p>Cuando las negras arman un centro muy sólido con <span class="move-pill">1. Nf3 d5 2. g3 c6 3. Bg2 Nf6 4. O-O Bf5 5. d3 e6</span>, la India del Rey ofrece una alternativa brillante: el golpe <span class="move-pill">6. c4!</span>.</p><p>En lugar de avanzar e4 de inmediato, minamos su peón de d5 desde c4. Tras <span class="move-pill">6...Be7 7. Nc3 O-O 8. cxd5 exd5</span>, abrimos la diagonal para nuestro alfil de g2 y tomamos la iniciativa en el centro.</p>',
        pgn: '1. Nf3 d5 2. g3 c6 3. Bg2 Nf6 4. O-O Bf5 5. d3 e6 6. c4 Be7 7. Nc3 O-O 8. cxd5 exd5',
        highlightMove: 'exd5',
        martinaQuote: '«Un buen comandante sabe cuándo empujar e4 y cuándo golpear con c4. ¡La versatilidad es poder!».',
        points: [
          '<strong>6. c4!:</strong> Ruptura lateral que dinamita el soporte negro en d5.',
          '<strong>8. cxd5:</strong> Abre la diagonal grande h1-a8 para nuestro alfil de g2.',
          '<strong>Presión central:</strong> Activa todas las piezas blancas sin arriesgar la estructura.'
        ]
      },
      {
        id: 'mod-5',
        title: '6. La Maniobra del Caballo',
        kicker: 'Módulo 6: La Táctica de Jaque Mate',
        heading: 'La Maniobra de Ataque Final de Peoncito',
        speech: '<p>¡El toque maestro del ataque! Tras <span class="move-pill">1. e4 e6 2. d3 d5 3. Nbd2 Nf6 4. g3 c5 5. Bg2 Nc6 6. Ngf3 Be7 7. O-O O-O 8. e5 Nd7 9. Re1 b5</span>, iniciamos la maniobra de traslado de piezas.</p><p>Jugamos <span class="move-pill">10. Nf1! a5 11. h4! Ba6 12. Bf4</span>. El caballo de f1 se desplaza a g3 o e3 para saltar a <span class="move-pill">g4</span> o <span class="move-pill">h5</span>. ¡Combinado con el avance h4-h5, el enroque negro colapsa irremediablemente!</p>',
        pgn: '1. e4 e6 2. d3 d5 3. Nbd2 Nf6 4. g3 c5 5. Bg2 Nc6 6. Ngf3 Be7 7. O-O O-O 8. e5 Nd7 9. Re1 b5 10. Nf1 a5 11. h4 Ba6 12. Bf4',
        highlightMove: 'Bf4',
        martinaQuote: '«Nf1, h4 y Bf4: la trilogía perfecta para que Peoncito guíe las tropas hacia el jaque mate».',
        points: [
          '<strong>10. Nf1!:</strong> El caballo se reubica para atacar el flanco de rey.',
          '<strong>11. h4!:</strong> Abre paso al avance del peón de h y despeja g4.',
          '<strong>12. Bf4:</strong> Coordina el ataque sobre la diagonal e5-h7 apuntando al rey enemigo.'
        ]
      }
    ]
  };

  window.CURRENT_COURSE_DATA = KINGS_INDIAN_ATTACK_COURSE;
})();
