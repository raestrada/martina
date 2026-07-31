// js/cursos-finales-peones.js — Lecciones interactivas para "Finales de Peones: Oposición y Zugzwang"
(function() {
  'use strict';

  const PEONES_ENDGAME_COURSE = {
    id: 'finales-de-peones',
    title: 'Finales de Peones: Oposición y Zugzwang',
    subtitle: 'El Arte de Ganar Finales con el Reloj Parlante, Peoncito y Martina',
    perspective: 'w',
    modules: [
      {
        id: 'mod-0',
        title: '1. La Regla del Cuadrado',
        kicker: 'Módulo 1: Geometría de la Carrera',
        heading: 'Saber si el Rey Alcaza al Peón sin Calcular',
        speech: '<p>¡Bienvenido al arte de los finales! Soy el <strong>Reloj Parlante</strong> y te enseño la regla geométrica más rápida del ajedrez: <strong>La Regla del Cuadrado</strong>.</p><p>Cuenta la distancia del peón a la casilla de coronación e imagina un cuadrado de ese tamaño. Si el Rey enemigo puede entrar al cuadrado en su turno, ¡alcanza al peón! Si no puede entrar, ¡el peón corona solo!</p>',
        fen: '8/8/5k2/P7/4K3/8/8/8 w - - 0 1',
        pgn: '1. a6 Ke6 2. a7 Kd6 3. a8=Q',
        highlightMove: 'a8=Q',
        martinaQuote: '«3. a8=Q: El peón a5 corona directamente a Dama porque el Rey negro quedó fuera del cuadrado».',
        points: [
          '<strong>Regla del Cuadrado:</strong> Contar casillas desde el peón hasta la meta.',
          '<strong>Fórmula Visual:</strong> Si el Rey rival entra al cuadrado en su turno, frena el peón.',
          '<strong>3. a8=Q!:</strong> El peón corona a Dama victorioso.'
        ]
      },
      {
        id: 'mod-1',
        title: '2. La Oposición Directa',
        kicker: 'Módulo 2: El Baile de los Reyes',
        heading: 'Ganar la Oposición (Rey contra Rey y Peón)',
        speech: '<p>Soy <strong>Peoncito</strong> y te enseño el secreto del rey en el final: <strong>Ganar la Oposición</strong>.</p><p>Cuando los dos Reyes están cara a cara separados por una sola casilla, el bando que NO TIENE EL TURNO tiene la oposición, obligando al otro Rey a apartarse a un lado y ceder paso.</p>',
        fen: '8/1k6/8/1K6/1P6/8/8/8 w - - 0 1',
        pgn: '1. Kc5 Kc7 2. b5 Kb7 3. b6 Kc8 4. Kc6 Kb8 5. b7 Ka7 6. Kc7 Ka6 7. b8=Q Ka5 8. Qb3 Ka6 9. Qb6#',
        highlightMove: 'Qb6#',
        martinaQuote: '«7. b8=Q y 9. Qb6#: Tomar la oposición te permite escoltar al peón hasta coronar Dama y dar mate».',
        points: [
          '<strong>Oposición Directa:</strong> Frente a frente a una casilla de distancia.',
          '<strong>Obligar a Ceder Paso:</strong> El rey rival debe apartarse a la izquierda o derecha.',
          '<strong>9. Qb6#:</strong> Jaque mate impecable en el borde.'
        ]
      },
      {
        id: 'mod-2',
        title: '3. Triangulación y Casillas Clave',
        kicker: 'Módulo 3: Ganar Tiempos con el Rey',
        heading: 'La Triangulación de Peon-Rueda',
        speech: '<p>Soy <strong>Peon-Rueda</strong> 🛞 y te enseño a <strong>triangular</strong>. A veces no podemos avanzar directamente, pero podemos hacer un movimiento en triángulo con nuestro Rey para devolverle el turno al rival y obligarlo a perder su posición.</p>',
        fen: '8/4k3/8/3PK3/8/8/8/8 w - - 0 1',
        pgn: '1. d6+ Kd7 2. Kd5 Kd8 3. Ke6 Ke8 4. d7+ Kd8 5. Kd6',
        highlightMove: 'Kd6',
        martinaQuote: '«Triangular es como girar en círculo: pierdes un tiempo a propósito para transferirle la responsabilidad de mover al oponente».',
        points: [
          '<strong>Triangulación:</strong> Hacer un camino de 3 pasos con el Rey para ceder el turno.',
          '<strong>Casillas Clave:</strong> Puntos del tablero desde donde el triunfo es 100% seguro.',
          '<strong>5. Kd6:</strong> Posición de control absoluto.'
        ]
      },
      {
        id: 'mod-3',
        title: '4. El Zugzwang (Parálisis)',
        kicker: 'Módulo 4: Cuando Mover Perjudica',
        heading: 'La Parálisis Obligada con Alfil Exiliado',
        speech: '<p>Soy <strong>Alfil Exiliado</strong> ♗. En el ajedrez, el <strong>Zugzwang</strong> ocurre cuando cualquier jugada legal empeora tu posición. Estás obligado a mover por reglamento, ¡pero mover es suicidarse!</p>',
        fen: '4k3/8/4K3/4P3/8/8/8/8 w - - 0 1',
        pgn: '1. Kd6 Kd8 2. e6 Ke8 3. e7 Kf7 4. Kd7 Kg7 5. e8=Q',
        highlightMove: 'e8=Q',
        martinaQuote: '«5. e8=Q: En Zugzwang el rey rival debe ceder el paso e7/f7 permitiendo la coronación limpia a Dama».',
        points: [
          '<strong>Zugzwang:</strong> Obligación de mover cuando cualquier jugada pierde.',
          '<strong>Parálisis Defensiva:</strong> El rival agota sus esperanzas de tablas.',
          '<strong>5. e8=Q:</strong> Coronación de Dama victoriosa.'
        ]
      },
      {
        id: 'mod-4',
        title: '5. El Peón Pasado Alejado',
        kicker: 'Módulo 5: El Señuelo Distante',
        heading: 'Distraer al Rey Enemigo con Torreta',
        speech: '<p>Soy <strong>Torreta</strong> 🏰. Un <strong>Peón Pasado Alejado</strong> es un peón que está en un flanco alejado del resto de las piezas. Funciona como un cebo irresistible: obliga al Rey enemigo a viajar hasta el borde del tablero a capturarlo, mientras nuestro propio Rey devora los peones del otro flanco libremente.</p>',
        fen: '8/5p1p/3k2p1/2p5/P1K4P/2P3P1/5P2/8 w - - 0 1',
        pgn: '1. a5 Kc6 2. a6 Kb6 3. a7 Kxa7 4. Kxc5 Kb7 5. Kd6',
        highlightMove: 'Kd6',
        martinaQuote: '«5. Kd6: El peón pasado distante a saca al rey negro de la escena. Mientras el rey rival come en a7, el rey blanco devora el centro».',
        points: [
          '<strong>Peón Señuelo:</strong> Atrae al rey rival hacia el borde del tablero.',
          '<strong>Ruptura en el Flanco Opuesto:</strong> El rey atacante arrasa la posición desprotegida.',
          '<strong>5. Kd6:</strong> Dominio total del centro.'
        ]
      },
      {
        id: 'mod-5',
        title: '6. Subcoronación Táctica',
        kicker: 'Módulo 6: Evitar el Ahogado',
        heading: 'Coronar Caballo o Torre con Caballo de Ŋ',
        speech: '<p>Soy <strong>Caballo de Ŋ</strong> 🐴. ¡No siempre hay que coronar Dama! A veces, promocionar a Dama causa un <strong>Ahogado instantáneo</strong> empate, o nos cuesta la partida por no dar jaque inmediato.</p><p>Subcoronar a <strong>Caballo (N)</strong> o <strong>Torre (R)</strong> da jaque mate directo o evita tablas por ahogado.</p>',
        fen: '8/5P1P/7k/7n/8/8/8/6K1 w - - 0 1',
        pgn: '1. f8=N+ Kg7 2. h8=Q+ Kxh8 3. Ng6+',
        highlightMove: 'Ng6+',
        martinaQuote: '«1. f8=N+: Subcoronación doble a Caballo que da jaque instantáneo y evita tablas».',
        points: [
          '<strong>Peligro de Ahogado:</strong> La Dama le quita todas las casillas al rey rival sin dar jaque.',
          '<strong>1. f8=N+!:</strong> Primera subcoronación a Caballo con jaque.',
          '<strong>3. Ng6+:</strong> Ataque de Caballo victorioso.'
        ]
      },
      {
        id: 'mod-6',
        title: '7. El Final Inmortal de Réti (1921)',
        kicker: 'Módulo 7: La Maniobra Mágica',
        heading: 'Richard Réti (1921) — El Milagro de las Dos Metas',
        speech: '<p>Cerramos la masterclass con la obra maestra de <strong>Richard Réti (1921)</strong> explicada por <strong>Martina</strong>.</p><p>El Rey blanco parece totalmente perdido: el peón c6 está lejos de coronar y el peón h4 negro parece inalcanzable. Pero con la diagonal mágica <span class="move-pill">1. Kg7! h3 2. Kf6! Kb6 3. Ke5!!</span>, el Rey blanco amenaza apoyar a su peón Y atrapar al negro al mismo tiempo. ¡Empate de leyenda!</p>',
        fen: '7K/8/k1P5/8/7p/8/8/8 w - - 0 1',
        pgn: '1. Kg7 h3 2. Kf6 Kb6 3. Ke5 Kxc6 4. Kf4 h2 5. Kg3',
        highlightMove: 'Kg3',
        martinaQuote: '«1. Kg7! y 3. Ke5!!: El Rey se mueve en diagonal persiguiendo dos objetivos a la vez. ¡Geometría pura de ajedrez!».',
        points: [
          '<strong>Maniobra de Réti (1921):</strong> Caminar en diagonal persigue dos metas paralelas.',
          '<strong>Doble Amenaza de Rey:</strong> Amenaza coronar c6 e interceptar h4.',
          '<strong>5. Kg3:</strong> Intercepción limpia que garantiza tablas.'
        ]
      }
    ]
  };

  window.CURRENT_COURSE_DATA = PEONES_ENDGAME_COURSE;
})();
