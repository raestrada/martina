// === INTERACTIVE CHESS PINS STICKER ALBUM ENGINE ===
// Built for Martina's chess bedtime stories website.
// Features: LocalStorage sync, Web Audio API sounds, dynamic 8x8 chessboards, daily trivia, and 3D pack opening.

document.addEventListener('DOMContentLoaded', () => {
  // === 1. STICKERS DATABASE DEFINITION ===
  const STICKERS = [
    {
      id: 1,
      category: "clavadas",
      name: "Clavada Absoluta",
      rarity: "normal",
      badge: "Común",
      icon: "🛡️♔",
      silhouette: "♔",
      quote: "«¡Esta pieza no se mueve ni por orden del juez! Dejaría a mi Rey bajo ataque.»",
      description: "Ocurre cuando la pieza inmovilizada protege directamente al Rey. Moverla es un movimiento ilegal según las reglas oficiales del ajedrez. ¡Tu oponente está totalmente atado!",
      tip: "Busca piezas enemigas alineadas con su rey y coloca tu alfil o torre apuntando hacia ellas para inmovilizarlas.",
      position: {
        pieces: { 'e8': '♚', 'f6': '♞', 'g5': '♗', 'e1': '♔' },
        highlights: {
          'f6': 'highlight-pin',
          'e8': 'highlight-pin',
          'g5': 'highlight-attacker'
        }
      }
    },
    {
      id: 2,
      category: "clavadas",
      name: "Clavada Relativa",
      rarity: "normal",
      badge: "Común",
      icon: "⚔️♕",
      silhouette: "♕",
      quote: "«Poder, puedo moverme... pero si lo hago, ¡mi hermosa Dama desaparecerá!»",
      description: "Sucede cuando la pieza inmovilizada protege a otra pieza de mayor valor, como la Dama. Moverla es legal, pero estratégicamente desastroso porque perderás material muy valioso.",
      tip: "Usa la clavada relativa para paralizar defensores y luego añade más atacantes pequeños (como peones) sobre la pieza clavada.",
      position: {
        pieces: { 'd8': '♛', 'f6': '♞', 'g5': '♗', 'e8': '♚', 'e1': '♔' },
        highlights: {
          'f6': 'highlight-pin',
          'd8': 'highlight-pin',
          'g5': 'highlight-attacker'
        }
      }
    },
    {
      id: 3,
      category: "clavadas",
      name: "Clavada Cruzada",
      rarity: "epic",
      badge: "Épico",
      icon: "❌♖",
      silhouette: "♖",
      quote: "«¿Por la fila o por la diagonal? ¡Me tienen atrapado desde dos lados a la vez!»",
      description: "Una de las joyas tácticas más espectaculares. Una pieza ya clavada en una dirección es clavada simultáneamente en otra diagonal o columna por un segundo atacante. ¡Es el colmo de la inmovilidad!",
      tip: "Si ves que tu oponente ha defendido una pieza clavada, busca diagonales o columnas secundarias para clavar también al defensor.",
      position: {
        pieces: { 'g7': '♚', 'e8': '♜', 'e5': '♛', 'e1': '♖', 'c3': '♗', 'g1': '♔' },
        highlights: {
          'e5': 'highlight-pin',
          'g7': 'highlight-pin',
          'e8': 'highlight-pin',
          'e1': 'highlight-attacker',
          'c3': 'highlight-attacker'
        }
      }
    },
    {
      id: 4,
      category: "clavadas",
      name: "La Ópera de Morphy",
      rarity: "epic",
      badge: "Épico",
      icon: "🎭♗",
      silhouette: "♗",
      quote: "«En el palco de la ópera, Paul Morphy demostró que un alfil clavador vale más que mil cantantes.»",
      description: "Inspirado en la partida más famosa de la historia (París, 1858). Paul Morphy clavó mortalmente el caballo de f6 del Duque de Brunswick contra su dama d8, desatando un torbellino de sacrificios mágicos.",
      tip: "Estudia las partidas clásicas. El Alfil en g5 clavando el caballo en f6 es un patrón agresivo fundamental que debes dominar.",
      position: {
        pieces: { 'e8': '♚', 'd8': '♛', 'f6': '♞', 'g5': '♗', 'e1': '♔', 'b8': '♞', 'c6': '♟' },
        highlights: {
          'f6': 'highlight-pin',
          'd8': 'highlight-pin',
          'g5': 'highlight-attacker'
        }
      }
    },
    {
      id: 5,
      category: "clavadas",
      name: "El Estilo Polgar",
      rarity: "epic",
      badge: "Épico",
      icon: "⚡♜",
      silhouette: "♜",
      quote: "«Judit Polgar rompió barreras atacando con precisión quirúrgica. ¡Una clavada y al ataque!»",
      description: "Rinde homenaje a Judit Polgar, la ajedrecista más fuerte de la historia. Su estilo agresivo aprovechaba las piezas sobrecargadas y las clavadas en columnas abiertas para asaltar el enroque enemigo sin piedad.",
      tip: "Cuando tu oponente esté clavado, no tengas prisa en capturar. Mantén la tensión y busca cómo abrir líneas hacia su rey.",
      position: {
        pieces: { 'e8': '♚', 'd8': '♛', 'd7': '♞', 'd1': '♖', 'f3': '♘', 'a8': '♜' },
        highlights: {
          'd7': 'highlight-pin',
          'd8': 'highlight-pin',
          'd1': 'highlight-attacker'
        }
      }
    },
    {
      id: 6,
      category: "clavadas",
      name: "Alfil Exiliado",
      rarity: "legendary",
      badge: "Legendario",
      icon: "🧙‍♂️♗",
      silhouette: "♗",
      quote: "«Me exiliaron a una sola diagonal por protestar contra las tablas... ¡Pero esta diagonal es invencible!»",
      description: "El cromo más codiciado del álbum. Representa al Alfil Exiliado del Reino de las Sesenta y Cuatro Casillas, quien conjura un hechizo de inmovilidad absoluto sobre el tablero, demostrando que la geometría mágica es real.",
      tip: "El Alfil Exiliado te recuerda: ¡diviértete y arriesga! Prefiere siempre una línea de ataque caótica antes que unas tablas aburridas.",
      position: {
        pieces: { 'e8': '♚', 'f6': '♞', 'g5': '♗', 'e1': '♔', 'd1': '♕', 'h8': '♜', 'a8': '♜' },
        highlights: {
          'f6': 'highlight-pin',
          'e8': 'highlight-pin',
          'g5': 'highlight-attacker'
        }
      }
    },
    {
      id: 7,
      category: "ataque",
      name: "El Bosque de Tal",
      rarity: "epic",
      badge: "Épico",
      icon: "🌲🌲",
      silhouette: "♘",
      quote: "«Lleva a tu rival a un bosque profundo y oscuro donde 2+2=5 y la salida es para uno solo.»",
      description: "Inspirado en la célebre filosofía de ataque de Mikhail Tal. Un sacrificio de pieza desata el caos táctico, creando clavadas y amenazas cruzadas donde el cálculo frío del rival tropieza con la fantasía salvaje.",
      tip: "No temas complicar la posición si tu oponente es demasiado sólido. ¡El caos es tu mejor aliado si sabes navegar en él!",
      position: {
        pieces: { 'e8': '♚', 'f7': '♟', 'g7': '♟', 'h7': '♟', 'f6': '♞', 'g5': '♗', 'e4': '♞', 'c4': '♗', 'e1': '♔', 'f3': '♘', 'd1': '♕', 'd8': '♛' },
        highlights: {
          'f6': 'highlight-pin',
          'd8': 'highlight-pin',
          'g5': 'highlight-attacker'
        }
      }
    },
    {
      id: 8,
      category: "ataque",
      name: "Pieza Sobrecargada",
      rarity: "normal",
      badge: "Común",
      icon: "🏋️‍♂️📦",
      silhouette: "♜",
      quote: "«Si tienes que vigilar la puerta del frente y del patio de atrás al mismo tiempo... ¡alguien va a entrar!»",
      description: "Ocurre cuando una sola pieza defensora tiene la tarea de proteger dos o más casillas o piezas críticas a la vez. Al clavar o desviar a ese defensor sobrecargado, todo su esquema defensivo se derrumba.",
      tip: "Busca piezas enemigas que realicen tareas dobles. ¡Una simple clavada o amenaza de desviación las obligará a abandonar a uno de sus amigos!",
      position: {
        pieces: { 'e8': '♚', 'd8': '♜', 'd7': '♜', 'd1': '♖', 'f7': '♟', 'g7': '♟', 'h7': '♟', 'a7': '♟' },
        highlights: {
          'd7': 'highlight-pin',
          'd8': 'highlight-pin',
          'd1': 'highlight-attacker'
        }
      }
    },
    {
      id: 9,
      category: "ataque",
      name: "Clavada de Contragolpe",
      rarity: "normal",
      badge: "Común",
      icon: "🛡️⚡",
      silhouette: "♗",
      quote: "«¿Creías que me habías clavado? ¡Mira detrás de tu propio escudo!»",
      description: "Una genialidad defensiva. Frente a la agresión de una clavada, respondes con una contra-clavada o un jaque intermedio que obliga al atacante a retirarse o perder material. ¡La mejor defensa es un ataque inesperado!",
      tip: "Nunca te desanimes ante una clavada. Revisa si puedes usar una de tus piezas para clavar al atacante o crear una amenaza mayor.",
      position: {
        pieces: { 'h8': '♚', 'g7': '♟', 'f6': '♗', 'c3': '♗', 'e8': '♜', 'e1': '♖', 'd8': '♛', 'd1': '♕' },
        highlights: {
          'f6': 'highlight-pin',
          'c3': 'highlight-pin',
          'f6': 'highlight-attacker'
        }
      }
    },
    {
      id: 10,
      category: "ataque",
      name: "La Inmortal",
      rarity: "legendary",
      badge: "Legendario",
      icon: "🧙‍♂️💀",
      silhouette: "♔",
      quote: "«Sacrifiqué mis torres y mi Dama... ¡pero a cambio conjuré el jaque mate más hermoso de la eternidad!»",
      description: "Rinde homenaje a 'La Inmortal' (Londres, 1851), donde Adolf Anderssen entregó casi todo su ejército para tejer una red de mate insólita. Demuestra que en ajedrez, el valor de las piezas es relativo al mate.",
      tip: "Recuerda la lección de Anderssen: ¡el ajedrez es actividad, espacio y coordinación, no solo coleccionar material!",
      position: {
        pieces: { 'e8': '♚', 'd7': '♟', 'e7': '♝', 'f3': '♘', 'c4': '♗', 'd6': '♗', 'e2': '♙', 'f7': '♘', 'g5': '♟' },
        highlights: {
          'e8': 'highlight-pin',
          'f7': 'highlight-attacker',
          'd6': 'highlight-attacker'
        }
      }
    },
    {
      id: 11,
      category: "ataque",
      name: "Clavada en Rayos X",
      rarity: "epic",
      badge: "Épico",
      icon: "⚡💀",
      silhouette: "♛",
      quote: "«¡Puedo ver a través de tu escudo! Tu rey está en mi línea de fuego aunque pongas un muro.»",
      description: "Un ataque misterioso que atraviesa una pieza enemiga para clavar o amenazar la pieza que está detrás, ¡como si Martina tuviera superpoderes de rayos X en el Reino de las Casillas!",
      tip: "Las torres y damas son ideales para ataques de rayos X a través de defensores enemigos alineados.",
      position: {
        pieces: { 'e8': '♚', 'e5': '♜', 'e1': '♖' },
        highlights: {
          'e5': 'highlight-pin',
          'e8': 'highlight-pin',
          'e1': 'highlight-attacker'
        }
      }
    },
    {
      id: 12,
      category: "ataque",
      name: "Ataque a la Descubierta",
      rarity: "normal",
      badge: "Común",
      icon: "🏃‍♂️🔥",
      silhouette: "♘",
      quote: "«¡Sorpresa! Me muevo para dejar pasar el rayo láser de mi torre y atacar al mismo tiempo.»",
      description: "Mueves una pieza quitándola del camino, ¡y de pronto se abre la cortina y otra de tus piezas lanza un ataque devastador al rey! Es el colmo de la sorpresa táctica.",
      tip: "Busca alinear tu alfil o torre con el rey enemigo antes de que la pieza intermedia salte con jaque.",
      position: {
        pieces: { 'h8': '♚', 'g7': '♟', 'd4': '♗', 'c5': '♘', 'f6': '♞' },
        highlights: {
          'c5': 'highlight-attacker',
          'h8': 'highlight-pin',
          'd4': 'highlight-attacker'
        }
      }
    },
    {
      id: 13,
      category: "defensas",
      name: "Gambito de Dama",
      rarity: "epic",
      badge: "Épico",
      icon: "👑♟",
      silhouette: "♕",
      quote: "«Te ofrezco mi peón de c4... pero no es un regalo. ¡Es una invitación a perder el centro!»",
      description: "Una de las aperturas más prestigiosas y profundas. Al ofrecer el peón de c4, las blancas buscan desviar el peón negro del centro (d5) para dominar el tablero con e4 y abrir líneas de ataque quirúrgicas.",
      tip: "En el Gambito de Dama, no te obsesiones con aferrarte al peón de más. Prioriza siempre el desarrollo rápido y el control central.",
      position: {
        pieces: { 'e8': '♚', 'd5': '♟', 'e6': '♟', 'd4': '♙', 'c4': '♙', 'b1': '♘', 'c8': '♗', 'g1': '♔' },
        highlights: {
          'd5': 'highlight-pin',
          'c4': 'highlight-attacker'
        }
      }
    },
    {
      id: 14,
      category: "defensas",
      name: "Defensa Siciliana Dragón",
      rarity: "epic",
      badge: "Épico",
      icon: "🐉🔥",
      silhouette: "♝",
      quote: "«¡Despierta al dragón en g7! Que su aliento de fuego barra todo el flanco de dama.»",
      description: "La defensa favorita de Martina contra e4. Las negras colocan su alfil en g7 (el alfil dragón) para dominar la gran diagonal diagonal con fuego y contraatacar en el flanco de dama con garras de dragón.",
      tip: "Enroca corto rápido y usa la columna c abierta para lanzar tus torres al ataque del enroque blanco.",
      position: {
        pieces: { 'g8': '♚', 'f7': '♟', 'g6': '♟', 'h7': '♟', 'g7': '♝', 'c8': '♗', 'c6': '♞', 'e4': '♙', 'd4': '♙' },
        highlights: {
          'g7': 'highlight-attacker',
          'c6': 'highlight-pin'
        }
      }
    },
    {
      id: 15,
      category: "defensas",
      name: "Gambito de Rey",
      rarity: "normal",
      badge: "Común",
      icon: "⚔️♟",
      silhouette: "♙",
      quote: "«¿Quieres mi peón de f4? Tómalo, pero prepárate para un huracán de ataques al rey.»",
      description: "Una apertura romántica y caótica que Martina adora por su locura. Se ofrece el peón de f4 en la segunda jugada para desviar al peón negro, abrir la columna f y atacar al rey enemigo de inmediato.",
      tip: "Si aceptas el gambito de rey con negras, prepárate para devolver material a cambio de un rápido desarrollo.",
      position: {
        pieces: { 'e8': '♚', 'e5': '♟', 'f4': '♙', 'e4': '♙', 'g1': '♘', 'd8': '♛' },
        highlights: {
          'f4': 'highlight-attacker',
          'e5': 'highlight-pin'
        }
      }
    },
    {
      id: 16,
      category: "defensas",
      name: "Apertura Italiana",
      rarity: "normal",
      badge: "Común",
      icon: "🍕🍕",
      silhouette: "♝",
      quote: "«Una empanada italiana recién salida de la casilla c3 para sazonar el ataque en f7.»",
      description: "Con 1.e4 e5 2.Cf3 Cc6 3.Ac4, Torreta coloca su alfil en la diagonal activa c4 apuntando directamente al punto débil f7 de las negras. ¡Es la favorita de Martina para aprender táctica!",
      tip: "El punto f7 solo está defendido por el rey negro, lo que lo hace el blanco perfecto para sacrificios rápidos de alfil o caballo.",
      position: {
        pieces: { 'e8': '♚', 'c5': '♝', 'c4': '♗', 'f7': '♟', 'e1': '♔', 'e5': '♟', 'e4': '♙' },
        highlights: {
          'c4': 'highlight-attacker',
          'f7': 'highlight-pin'
        }
      }
    },
    {
      id: 17,
      category: "defensas",
      name: "Defensa Nimzoindia",
      rarity: "epic",
      badge: "Épico",
      icon: "🐘🏰",
      silhouette: "♞",
      quote: "«Te clavo el caballo en c3 antes de que pueda saltar al centro. ¡Control mental absoluto!»",
      description: "Una defensa hipermoderna elegante. En lugar de ocupar el centro con peones, las negras clavan el caballo blanco de c3 con su alfil en b4 para controlar indirectamente la casilla clave e4.",
      tip: "Úsala para doblar los peones blancos en la columna c y luego presionar esas debilidades con tus piezas menores.",
      position: {
        pieces: { 'e8': '♚', 'b4': '♝', 'c3': '♘', 'd4': '♙', 'e1': '♔' },
        highlights: {
          'b4': 'highlight-attacker',
          'c3': 'highlight-pin'
        }
      }
    },
    {
      id: 18,
      category: "defensas",
      name: "El Escudo de Enroque",
      rarity: "legendary",
      badge: "Legendario",
      icon: "🏰🛡️",
      silhouette: "♔",
      quote: "«¡Mi rey duerme tranquilo en su castillo de g1 mientras yo siembro el caos afuera!»",
      description: "La máxima fortaleza de tu rey. El enroque corto o largo protege al monarca detrás de una muralla de tres peones y una torre activa. ¡Martina sabe que un rey seguro ataca mejor!",
      tip: "No muevas tus peones de enroque sin una buena razón; cada movimiento de peón debilita la seguridad de tu rey.",
      position: {
        pieces: { 'g1': '♔', 'f2': '♙', 'g2': '♙', 'h2': '♙', 'f1': '♖', 'e8': '♚' },
        highlights: {
          'g1': 'highlight-pin',
          'f1': 'highlight-pin'
        }
      }
    },
    {
      id: 19,
      category: "finales",
      name: "Clavada del Pasillo",
      rarity: "normal",
      badge: "Común",
      icon: "🚪💀",
      silhouette: "♜",
      quote: "«¡Tu propio muro de peones es una hermosa celda si dejas el pasillo abierto!»",
      description: "Un peligro táctico clásico. Ocurre cuando el Rey está atrapado detrás de su propia cadena de peones del enroque sin ninguna casilla de escape (f7, g7, h7) y una torre o dama enemiga invade la octava fila logrando un jaque mate fulminante.",
      tip: "¡Dale siempre un 'aire' a tu Rey! Un movimiento de peón a h3 o g3 en el momento justo evita desastres de pasillo en el final de partida.",
      position: {
        pieces: { 'g8': '♚', 'f7': '♟', 'g7': '♟', 'h7': '♟', 'a8': '♜', 'a1': '♖', 'g1': '♔', 'f2': '♙', 'g2': '♙', 'h2': '♙' },
        highlights: {
          'g8': 'highlight-pin',
          'a8': 'highlight-attacker'
        }
      }
    },
    {
      id: 20,
      category: "finales",
      name: "El Zugzwang de Peoncito",
      rarity: "normal",
      badge: "Común",
      icon: "🐌⏳",
      silhouette: "♙",
      quote: "«Cualquier paso que des es un paso hacia el abismo. ¡Te toca mover!»",
      description: "La parálisis total en finales. Ocurre cuando a tu oponente le toca mover, pero cualquier jugada legal que haga destruirá su propia posición. ¡Peoncito adora ver al enemigo inmovilizado!",
      tip: "El zugzwang es el arma secreta más potente en los finales de reyes y peones. ¡Planifica con paciencia y precisión!",
      position: {
        pieces: { 'f6': '♚', 'f4': '♔', 'f5': '♙', 'e5': '♟' },
        highlights: {
          'f6': 'highlight-pin',
          'f4': 'highlight-attacker'
        }
      }
    },
    {
      id: 21,
      category: "finales",
      name: "Oposición de Spassky",
      rarity: "epic",
      badge: "Épico",
      icon: "👥↔️",
      silhouette: "♔",
      quote: "«Cara a cara, paso a paso, mi rey no te dejará avanzar ni una sola casilla.»",
      description: "Una danza geométrica de reyes. Ocurre cuando los dos reyes están separados por una sola casilla vacía, y el que tiene que mover pierde terreno. Martina la dominó estudiando el final Spassky-Fischer de 1972.",
      tip: "Mantén la oposición para obligar al rey enemigo a apartarse y abrir paso a tu propio rey o peón pasado.",
      position: {
        pieces: { 'd6': '♚', 'd4': '♔', 'd5': '♙' },
        highlights: {
          'd6': 'highlight-pin',
          'd4': 'highlight-attacker'
        }
      }
    },
    {
      id: 22,
      category: "finales",
      name: "Triangulación Mágica",
      rarity: "normal",
      badge: "Común",
      icon: "🔺🪄",
      silhouette: "♔",
      quote: "«Doy un rodeo en triángulo: d4, c4, d5... ¡y ahora la jugada incómoda te toca a ti!»",
      description: "Una maniobra de rey en forma de triángulo para perder un tiempo deliberadamente y transferir el turno al oponente, forzándolo a caer en zugzwang en el final.",
      tip: "Úsala cuando necesites que el oponente mueva primero para romper su defensa de peones y ganar la oposición.",
      position: {
        pieces: { 'e6': '♚', 'd4': '♔', 'd5': '♙', 'e5': '♟' },
        highlights: {
          'd4': 'highlight-attacker',
          'e6': 'highlight-pin'
        }
      }
    },
    {
      id: 23,
      category: "finales",
      name: "Regla del Cuadrado",
      rarity: "epic",
      badge: "Épico",
      icon: "📐⬜",
      silhouette: "♙",
      quote: "«No necesito calcular jugada por jugada. Mi peón está fuera de tu cuadrado. ¡Soy Dama!»",
      description: "Un truco mental para calcular al instante si un rey enemigo puede atrapar a tu peón pasado antes de coronar. Dibuja un cuadrado imaginario; si el rey no puede entrar en él, el peón ganará la carrera.",
      tip: "Si el rey enemigo no puede pisar el cuadrado imaginario del peón en su turno, ¡el peón coronará sin ayuda de tu rey!",
      position: {
        pieces: { 'a4': '♙', 'f6': '♚', 'e1': '♔' },
        highlights: {
          'a4': 'highlight-attacker',
          'f6': 'highlight-pin'
        }
      }
    },
    {
      id: 24,
      category: "finales",
      name: "Subcoronación Absurda",
      rarity: "legendary",
      badge: "Legendario",
      icon: "🦄🐴",
      silhouette: "♘",
      quote: "«¿Quién quiere una Dama aburrida cuando puedes coronar un caballo mágico que da jaque doble?»",
      description: "Coronar un peón no siempre significa pedir una Dama. A veces, pedir un Caballo o una Torre es la única jugada mágica para dar jaque mate inmediato o evitar un ahogado táctico.",
      tip: "Revisa siempre si una subcoronación a caballo o torre puede salvarte de un ahogado o dar un jaque doble decisivo.",
      position: {
        pieces: { 'h8': '♚', 'g8': '♜', 'h7': '♙', 'f6': '♔', 'h6': '♟' },
        highlights: {
          'h7': 'highlight-attacker',
          'h8': 'highlight-pin'
        }
      }
    }
  ];da la lección de Anderssen: ¡el ajedrez es actividad, espacio y coordinación, no solo coleccionar material!",
      position: {
        pieces: { 'e8': '♚', 'd7': '♟', 'e7': '♝', 'f3': '♘', 'c4': '♗', 'd6': '♗', 'e2': '♙', 'f7': '♘', 'g5': '♟' },
        highlights: {
          'e8': 'highlight-pin',
          'f7': 'highlight-attacker',
          'd6': 'highlight-attacker'
        }
      }
    }
  ];

  // === 2. WEB AUDIO API SYNTHESIZER ===
  const SoundEffects = {
    // Generate a paper-ripping/foil-tearing sound
    playRip: () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        // 1. Noise Buffer (Foil friction)
        const bufferSize = ctx.sampleRate * 0.45; 
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.4);
        filter.Q.setValueAtTime(4, ctx.currentTime);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.45);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        
        // 2. High-Frequency Tear pop (Oscillator)
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.18);
        
        oscGain.gain.setValueAtTime(0.35, ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + 0.18);
        
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } catch (e) {
        console.warn('AudioContext disabled or blocked by browser policy.', e);
      }
    },

    // Play a shiny card flip sound
    playFlip: () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.14);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.14);
      } catch (e) {}
    },

    // Play a gentle error/incorrect buzzer sound
    playError: () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.25);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } catch (e) {}
    },

    // Play solid cardboard pasting sound with magic sparkle
    playPaste: () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        // 1. Thud / Knock sound
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(190, ctx.currentTime);
        osc1.frequency.linearRampToValueAtTime(45, ctx.currentTime + 0.15);
        
        gain1.gain.setValueAtTime(0.4, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.15);
        
        // 2. Chime / Sparkle
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1400, ctx.currentTime);
          osc2.frequency.setValueAtTime(1900, ctx.currentTime + 0.04);
          
          gain2.gain.setValueAtTime(0.08, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
          
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.12);
        }, 80);
      } catch (e) {}
    },

    // Play high-fidelity congrats fanfare (major arpeggio)
    playCongrats: () => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        notes.forEach((freq, idx) => {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
          }, idx * 75);
        });
      } catch (e) {}
    }
  };

  // === 3. LOCALSTORAGE STATE SYNC ===
  let unlockedList = [];
  let packsCount = 1;
  let lastTriviaSolvedDate = "";
  let lastTorretaClaimTimestamp = 0;

  function loadStateFromStorage() {
    try {
      unlockedList = JSON.parse(localStorage.getItem('martina_album_unlocked')) || [];
      
      // If we don't have packs saved, grant 1 pack initially so they can play immediately!
      if (localStorage.getItem('martina_album_packs') === null) {
        localStorage.setItem('martina_album_packs', '1');
      }
      packsCount = parseInt(localStorage.getItem('martina_album_packs')) || 0;
      
      lastTriviaSolvedDate = localStorage.getItem('martina_trivia_last_solved') || "";
      lastTorretaClaimTimestamp = parseInt(localStorage.getItem('martina_torreta_claimed')) || 0;
    } catch (e) {
      console.error("Failed to read LocalStorage.", e);
    }
  }

  function saveStateToStorage() {
    try {
      localStorage.setItem('martina_album_unlocked', JSON.stringify(unlockedList));
      localStorage.setItem('martina_album_packs', packsCount.toString());
      localStorage.setItem('martina_trivia_last_solved', lastTriviaSolvedDate);
      localStorage.setItem('martina_torreta_claimed', lastTorretaClaimTimestamp.toString());
    } catch (e) {
      console.error("Failed to write to LocalStorage.", e);
    }
  }

  // === 4. TRIVIA ACERTIJO DATA & ENGINE ===
  const TRIVIA_QUESTIONS = [
    {
      question: "¿Qué es una clavada absoluta en ajedrez?",
      options: [
        "Cuando se ataca una pieza que protege a la Dama enemiga.",
        "Cuando la pieza clavada no se puede mover porque dejaría al Rey en jaque legalmente.",
        "Cuando un caballo salta dos veces seguidas en L.",
        "Cuando capturas al paso en las dos primeras jugadas."
      ],
      correct: 1
    },
    {
      question: "Si tu oponente tiene una pieza clavada contra su Dama (clavada relativa), ¿cuál es la mejor estrategia?",
      options: [
        "Ignorarla y enrocar tu propio rey de inmediato.",
        "Ofrecer tablas rápidas porque el oponente se asustará.",
        "Atacar a la pieza inmovilizada con más peones o piezas menores para ganar material.",
        "Intercambiar tus torres para simplificar la partida."
      ],
      correct: 2
    },
    {
      question: "¿Qué gran campeona de ajedrez demostró que las mujeres pueden atacar con precisión quirúrgica y romper todas las barreras?",
      options: [
        "La Reina Negra del Reino Mágico",
        "Torreta, la cocinera de empanadas en c3",
        "Judit Polgar",
        "La Dama Blanca de la casilla d4"
      ],
      correct: 2
    },
    {
      question: "¿Qué genial campeón mundial es conocido como el 'Mago de Riga' por su estilo hiper-creativo, lleno de sacrificios caóticos en un bosque oscuro?",
      options: [
        "Mikhail Tal",
        "Paul Morphy",
        "Stockfish 16",
        "Peoncito con bigote"
      ],
      correct: 0
    }
  ];

  function getTodayString() {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }

  function initTrivia() {
    const triviaQuestionText = document.getElementById('triviaQuestionText');
    const triviaOptionsContainer = document.getElementById('triviaOptionsContainer');
    
    if (!triviaQuestionText || !triviaOptionsContainer) return;
    
    const today = getTodayString();
    
    // Check if trivia was already solved today
    if (lastTriviaSolvedDate === today) {
      triviaQuestionText.innerHTML = `🧙‍♂️ <em>¡Excelente trabajo! Ya has descifrado el acertijo de hoy y reclamado tu sobre. Vuelve mañana para un nuevo desafío táctico del Alfil Exiliado.</em>`;
      triviaOptionsContainer.innerHTML = `<div style="text-align: center; font-size: 3.5rem; margin-top: 1rem;">✨🧙‍♂️✨</div>`;
      return;
    }
    
    // Determine trivia index based on calendar day to rotate questions daily
    const d = new Date();
    const dayIndex = d.getDate() % TRIVIA_QUESTIONS.length;
    const currentTrivia = TRIVIA_QUESTIONS[dayIndex];
    
    triviaQuestionText.textContent = currentTrivia.question;
    triviaOptionsContainer.innerHTML = '';
    
    currentTrivia.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'trivia-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleTriviaAnswer(idx, currentTrivia.correct, btn));
      triviaOptionsContainer.appendChild(btn);
    });
  }

  function handleTriviaAnswer(selectedIndex, correctIndex, buttonElement) {
    const optionsButtons = document.querySelectorAll('.trivia-btn');
    optionsButtons.forEach(btn => btn.disabled = true);
    
    if (selectedIndex === correctIndex) {
      // Correct!
      buttonElement.classList.add('correct');
      SoundEffects.playCongrats();
      
      // Update states
      packsCount += 1;
      lastTriviaSolvedDate = getTodayString();
      saveStateToStorage();
      updateHeaderStats();
      
      setTimeout(() => {
        const triviaQuestionText = document.getElementById('triviaQuestionText');
        const triviaOptionsContainer = document.getElementById('triviaOptionsContainer');
        triviaQuestionText.innerHTML = `🎉 <strong>¡Respuesta Correcta!</strong> El Alfil Exiliado asiente con respeto. Has ganado <strong>1 sobre de cromos extra</strong>.`;
        triviaOptionsContainer.innerHTML = `<div style="text-align: center; font-size: 3.5rem; margin-top: 0.5rem; animation: bounce 1.5s infinite;">🎒✨</div>`;
      }, 1000);
    } else {
      // Incorrect!
      buttonElement.classList.add('incorrect');
      SoundEffects.playError();
      
      const triviaQuestionText = document.getElementById('triviaQuestionText');
      const originalText = triviaQuestionText.textContent;
      triviaQuestionText.innerHTML = `<span style="color: #dc3545; font-weight: bold;">❌ ¡Esa no es la respuesta correcta! Analiza bien la posición e inténtalo de nuevo.</span>`;
      
      // Shake incorrect button
      buttonElement.classList.add('wiggle-action');
      setTimeout(() => buttonElement.classList.remove('wiggle-action'), 400);
      
      // Re-enable options after 1.8s to let them try again!
      setTimeout(() => {
        triviaQuestionText.textContent = originalText;
        optionsButtons.forEach(btn => {
          btn.disabled = false;
          btn.classList.remove('incorrect');
        });
      }, 1800);
    }
  }

  // === 5. TORRETA CLAIM COOLDOWN (12h) ===
  let cooldownInterval = null;

  function updateClaimCooldown() {
    const claimBtn = document.getElementById('claimPackBtn');
    const claimTxt = document.getElementById('claimCooldownText');
    if (!claimBtn || !claimTxt) return;
    
    const now = Date.now();
    const cooldownPeriod = 12 * 60 * 60 * 1000; // 12 hours
    const elapsed = now - lastTorretaClaimTimestamp;
    
    if (elapsed >= cooldownPeriod) {
      // Claim is ready!
      claimBtn.disabled = false;
      claimBtn.style.opacity = '1';
      claimBtn.style.cursor = 'pointer';
      claimTxt.textContent = "🎁 ¡Sobres recién horneados! Haz clic aquí.";
      claimTxt.style.color = "var(--sage)";
    } else {
      // On cooldown
      claimBtn.disabled = true;
      claimBtn.style.opacity = '0.6';
      claimBtn.style.cursor = 'not-allowed';
      
      const remainingMs = cooldownPeriod - elapsed;
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
      
      claimTxt.textContent = `Disponible en ${hours}h ${minutes}m ${seconds}s`;
      claimTxt.style.color = "var(--rose)";
    }
  }

  function setupTorretaClaim() {
    const claimBtn = document.getElementById('claimPackBtn');
    if (!claimBtn) return;
    
    claimBtn.addEventListener('click', () => {
      const now = Date.now();
      const cooldownPeriod = 12 * 60 * 60 * 1000;
      if (now - lastTorretaClaimTimestamp >= cooldownPeriod) {
        lastTorretaClaimTimestamp = now;
        packsCount += 1;
        saveStateToStorage();
        updateHeaderStats();
        SoundEffects.playCongrats();
        
        // Dynamic animation on button to show success
        claimBtn.classList.add('wiggle-action');
        setTimeout(() => claimBtn.classList.remove('wiggle-action'), 500);
        
        updateClaimCooldown();
      }
    });
    
    // Start interval
    updateClaimCooldown();
    cooldownInterval = setInterval(updateClaimCooldown, 1000);
  }

  // === 6. PACK REVEALING ALGORITHM (Rarity balanced) ===
  let currentRevealedStickerIds = [];

  function generateRandomPack() {
    const pack = [];
    while (pack.length < 3) {
      const rand = Math.random();
      let selectedSticker = null;
      
      // Roll rarity
      if (rand < 0.70) {
        // Normal (ID 1, 2)
        const normals = STICKERS.filter(s => s.rarity === 'normal');
        selectedSticker = normals[Math.floor(Math.random() * normals.length)];
      } else if (rand < 0.90) {
        // Epic (ID 3, 4, 5)
        const epics = STICKERS.filter(s => s.rarity === 'epic');
        selectedSticker = epics[Math.floor(Math.random() * epics.length)];
      } else {
        // Legendary (ID 6, 12, etc.)
        const legendaries = STICKERS.filter(s => s.rarity === 'legendary');
        selectedSticker = legendaries[Math.floor(Math.random() * legendaries.length)];
      }
      
      // Prevent duplicate sticker IDs inside the same pack
      if (selectedSticker && !pack.some(s => s.id === selectedSticker.id)) {
        pack.push(selectedSticker);
      }
    }
    return pack;
  }

  // === 7. PACK MODAL TEARING & CARD FLIP INTERACTIVITY ===
  function setupPackZone() {
    const openPackBtn = document.getElementById('openPackBtn');
    const packVisual = document.getElementById('packVisual');
    const packModal = document.getElementById('packModal');
    const closePackModalBtn = document.getElementById('closePackModalBtn');
    const foilPackWrapper = document.getElementById('foilPackWrapper');
    const revealInstruction = document.getElementById('revealInstruction');
    const cardsDeck = document.getElementById('cardsDeck');
    const pasteStickersBtn = document.getElementById('pasteStickersBtn');
    
    if (!openPackBtn || !packModal) return;
    
    // Open Modal Trigger
    const triggerOpenFlow = () => {
      if (packsCount <= 0) {
        alert("¡No tienes sobres en tu mochila! Juega a los minijuegos o responde el acertijo para conseguir más.");
        return;
      }
      
      // Deduct pack
      packsCount -= 1;
      saveStateToStorage();
      updateHeaderStats();
      
      // Reset Modal State
      foilPackWrapper.classList.remove('ripped');
      cardsDeck.innerHTML = '';
      revealInstruction.style.display = 'block';
      revealInstruction.textContent = "¡Haz clic en el sobre para rasgarlo y liberar los cromos!";
      pasteStickersBtn.classList.remove('active');
      pasteStickersBtn.style.display = 'none';
      closePackModalBtn.style.display = 'block';
      
      // Open modal
      packModal.classList.add('active');
    };
    
    openPackBtn.addEventListener('click', triggerOpenFlow);
    if (packVisual) packVisual.addEventListener('click', triggerOpenFlow);
    
    // Envelope Tearing Trigger
    foilPackWrapper.addEventListener('click', () => {
      if (foilPackWrapper.classList.contains('ripped')) return;
      
      // Play tearing sound
      SoundEffects.playRip();
      
      foilPackWrapper.classList.add('ripped');
      revealInstruction.textContent = "¡Haz clic en cada cromo para darle la vuelta y revelarlo!";
      
      // Generate the 3 stickers in the pack
      const packStickers = generateRandomPack();
      currentRevealedStickerIds = packStickers.map(s => s.id);
      
      // Build 3D cards
      cardsDeck.innerHTML = '';
      packStickers.forEach((sticker) => {
        const isDuplicate = unlockedList.includes(sticker.id);
        
        const cardContainer = document.createElement('div');
        cardContainer.className = 'flip-card';
        
        const badgeHTML = isDuplicate 
          ? `<span class="sticker-badge" style="color: var(--rose); font-weight:800; background:rgba(230,57,70,0.1); padding:0.15rem 0.4rem; border-radius:4px; font-size:0.65rem;">Repetido</span>` 
          : `<span class="sticker-badge" style="color: #2a9d8f; font-weight:800; background:rgba(42,157,143,0.15); padding:0.15rem 0.4rem; border-radius:4px; font-size:0.65rem;">¡NUEVO!</span>`;
        
        cardContainer.innerHTML = `
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <span class="card-hint">TÁCTICA</span>
            </div>
            <div class="flip-card-back">
              <div class="sticker sticker-rarity-${sticker.rarity}">
                <div class="sticker-header">
                  <span class="sticker-id">#${sticker.id}</span>
                  ${badgeHTML}
                </div>
                <div class="sticker-art">${sticker.icon}</div>
                <div class="sticker-title">${sticker.name}</div>
              </div>
            </div>
          </div>
        `;
        
        // Flip event
        cardContainer.addEventListener('click', () => {
          if (cardContainer.classList.contains('flipped')) return;
          
          SoundEffects.playFlip();
          cardContainer.classList.add('flipped');
          
          // Check if all cards in the deck are flipped
          const allFlipped = Array.from(cardsDeck.querySelectorAll('.flip-card'))
            .every(card => card.classList.contains('flipped'));
            
          if (allFlipped) {
            revealInstruction.textContent = "¡Cromos revelados! Hora de pegarlos en tu cuaderno.";
            pasteStickersBtn.style.display = 'block';
            setTimeout(() => {
              pasteStickersBtn.classList.add('active');
            }, 100);
          }
        });
        
        cardsDeck.appendChild(cardContainer);
      });
    });
    
    // Paste Stickers Trigger
    pasteStickersBtn.addEventListener('click', () => {
      // Play satisfying pasting sound
      SoundEffects.playPaste();
      
      // Add stickers to unlocked list if new
      let newlyPastedCount = 0;
      currentRevealedStickerIds.forEach(id => {
        if (!unlockedList.includes(id)) {
          unlockedList.push(id);
          newlyPastedCount++;
        }
      });
      
      // Sort list
      unlockedList.sort((a, b) => a - b);
      
      saveStateToStorage();
      packModal.classList.remove('active');
      
      // Refresh UI
      updateHeaderStats();
      renderAlbumGrid();
      
      // Check if complete
      checkAlbumCompletion();
    });

    // Close Pack Modal Handler (prevent getting stuck & refund/auto-save)
    const closePackModal = () => {
      if (foilPackWrapper.classList.contains('ripped')) {
        // Auto-paste if they tore it so they don't lose their cards
        let newlyPastedCount = 0;
        currentRevealedStickerIds.forEach(id => {
          if (!unlockedList.includes(id)) {
            unlockedList.push(id);
            newlyPastedCount++;
          }
        });
        unlockedList.sort((a, b) => a - b);
        saveStateToStorage();
        renderAlbumGrid();
        checkAlbumCompletion();
      } else {
        // Refund pack if they close without tearing
        packsCount += 1;
        saveStateToStorage();
      }
      packModal.classList.remove('active');
      updateHeaderStats();
    };

    closePackModalBtn.addEventListener('click', closePackModal);
  }

  // === 8. HEADER STATS & CONGRATS BANNER ===
  function updateHeaderStats() {
    const statsProgress = document.getElementById('statsProgress');
    const progressBar = document.getElementById('progressBar');
    const statsPacks = document.getElementById('statsPacks');
    const packCountBadge = document.getElementById('packCountBadge');
    
    if (statsProgress) statsProgress.textContent = `${unlockedList.length} / ${STICKERS.length}`;
    if (progressBar) {
      const percentage = (unlockedList.length / STICKERS.length) * 100;
      progressBar.style.width = `${percentage}%`;
    }
    if (statsPacks) statsPacks.textContent = packsCount;
    if (packCountBadge) {
      packCountBadge.textContent = packsCount === 1 ? "1 Sobre" : `${packsCount} Sobres`;
    }
    
    // Disable/Enable open button based on packs count
    const openPackBtn = document.getElementById('openPackBtn');
    if (openPackBtn) {
      if (packsCount <= 0) {
        openPackBtn.disabled = true;
        openPackBtn.style.background = 'var(--board-dark)';
        openPackBtn.style.color = 'rgba(255,255,255,0.4)';
        openPackBtn.style.cursor = 'not-allowed';
        openPackBtn.textContent = "Sin sobres en mochila";
      } else {
        openPackBtn.disabled = false;
        openPackBtn.style.background = 'var(--gold)';
        openPackBtn.style.color = 'var(--magic-dark)';
        openPackBtn.style.cursor = 'pointer';
        openPackBtn.textContent = "✂ Rasgar y Abrir Sobre";
      }
    }
  }

  function checkAlbumCompletion() {
    const congratsBanner = document.getElementById('congratsBanner');
    if (!congratsBanner) return;
    
    if (unlockedList.length === STICKERS.length) {
      congratsBanner.classList.add('active');
      SoundEffects.playCongrats();
    } else {
      congratsBanner.classList.remove('active');
    }
  }

  // === 9. 8x8 DYNAMIC CHESSBOARD GENERATOR ===
  function renderChessPosition(boardContainer, positionData) {
    if (!boardContainer) return;
    boardContainer.innerHTML = '';
    
    const pieces = positionData.pieces || {};
    const highlights = positionData.highlights || {};
    
    for (let r = 8; r >= 1; r--) {
      for (let c = 0; c < 8; c++) {
        const file = String.fromCharCode(97 + c); // a-h
        const coord = `${file}${r}`;
        const isDark = (r + c) % 2 === 0;
        
        const square = document.createElement('div');
        square.className = `album-chess-square ${isDark ? 'dark' : 'light'}`;
        
        // Highlight squares if matching pin elements
        if (highlights[coord]) {
          square.classList.add(highlights[coord]);
        }
        
        // Add Chess piece if exists
        const piece = pieces[coord];
        if (piece) {
          const pieceEl = document.createElement('div');
          pieceEl.className = 'album-chess-piece';
          pieceEl.textContent = piece;
          
          const isWhite = '♙♘♗♖♕♔'.includes(piece);
          pieceEl.style.color = isWhite ? '#f4a261' : '#012a4a';
          pieceEl.style.textShadow = isWhite 
            ? '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000'
            : '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff';
            
          square.appendChild(pieceEl);
        }
        
        boardContainer.appendChild(square);
      }
    }
  }

  // === 10. DETAIL MODAL DIALOGS ===
  let activeDetailStickerId = null;

  function openDetailModal(stickerId) {
    const sticker = STICKERS.find(s => s.id === stickerId);
    if (!sticker) return;
    
    activeDetailStickerId = stickerId;
    
    const detailModal = document.getElementById('detailModal');
    const detailIcon = document.getElementById('detailIcon');
    const detailRarity = document.getElementById('detailRarity');
    const detailTitle = document.getElementById('detailTitle');
    const detailQuote = document.getElementById('detailQuote');
    const detailInfo = document.getElementById('detailInfo');
    const detailTip = document.getElementById('detailTip');
    const detailChessBoard = document.getElementById('detailChessBoard');
    
    if (!detailModal) return;
    
    // Set text elements
    detailIcon.textContent = sticker.icon;
    detailRarity.textContent = `Cromo ${sticker.badge}`;
    
    // Set classes for rarity color
    detailRarity.className = 'detail-rarity';
    if (sticker.rarity === 'epic') {
      detailRarity.style.color = '#8e44ad';
    } else if (sticker.rarity === 'legendary') {
      detailRarity.style.color = '#d4af37';
    } else {
      detailRarity.style.color = 'var(--magic-blue)';
    }
    
    detailTitle.textContent = sticker.name;
    detailQuote.textContent = sticker.quote;
    detailInfo.textContent = sticker.description;
    detailTip.textContent = sticker.tip;
    
    // Render the chess position in standard Segoe UI transform baseline
    renderChessPosition(detailChessBoard, sticker.position);
    
    // Display modal
    detailModal.classList.add('active');
  }

  function setupDetailModalEvents() {
    const detailModal = document.getElementById('detailModal');
    const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
    
    if (!detailModal || !closeDetailModalBtn) return;
    
    const closeModal = () => {
      detailModal.classList.remove('active');
      activeDetailStickerId = null;
    };
    
    closeDetailModalBtn.addEventListener('click', closeModal);
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) {
        closeModal();
      }
    });
  }

  // === 11. ALBUM GRID RENDERER ===
  let activeCategory = "all";

  function setupTabFilters() {
    const tabsContainer = document.getElementById('albumTabs');
    if (!tabsContainer) return;
    
    const tabButtons = tabsContainer.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-category');
        renderAlbumGrid();
      });
    });
  }

  function renderAlbumGrid() {
    const albumGrid = document.getElementById('albumGrid');
    if (!albumGrid) return;
    
    albumGrid.innerHTML = '';
    
    const filteredStickers = activeCategory === "all" 
      ? STICKERS 
      : STICKERS.filter(s => s.category === activeCategory);
    
    filteredStickers.forEach((sticker) => {
      const isUnlocked = unlockedList.includes(sticker.id);
      const slot = document.createElement('div');
      slot.className = `sticker-slot ${isUnlocked ? 'unlocked' : ''}`;
      
      if (isUnlocked) {
        // Unlocked state (gorgeous sticker + action button)
        slot.innerHTML = `
          <div class="sticker-frame">
            <div class="sticker sticker-rarity-${sticker.rarity}" style="--rotation: ${(sticker.id % 2 === 0 ? '-' : '')}${(2 + (sticker.id % 3))}deg;">
              <div class="sticker-header">
                <span class="sticker-id">#${sticker.id}</span>
                <span class="sticker-badge" style="${
                  sticker.rarity === 'epic' ? 'color: #8e44ad;' : (sticker.rarity === 'legendary' ? 'color: #d4af37;' : 'color: var(--magic-blue);')
                }">${sticker.badge}</span>
              </div>
              <div class="sticker-art">${sticker.icon}</div>
              <div class="sticker-title">${sticker.name}</div>
            </div>
          </div>
          <div class="sticker-slot-title">${sticker.name}</div>
          <div class="sticker-slot-desc" style="color: var(--sage); font-weight:800;">✓ Pegado en cuaderno</div>
          <button class="sticker-status-btn">👁️ Ver Detalles</button>
        `;
        
        // Detail click bind on card slot button and slot frame
        const detailBtn = slot.querySelector('.sticker-status-btn');
        detailBtn.addEventListener('click', () => openDetailModal(sticker.id));
        
        const stickerEl = slot.querySelector('.sticker');
        stickerEl.addEventListener('click', () => openDetailModal(sticker.id));
      } else {
        // Locked state (silhouette + lock button)
        slot.innerHTML = `
          <div class="sticker-frame">
            <div class="silhouette">${sticker.silhouette}</div>
          </div>
          <div class="sticker-slot-title" style="opacity: 0.6;">Cromo #${sticker.id}</div>
          <div class="sticker-slot-desc">Bloqueado en el Reino</div>
          <button class="sticker-status-btn" style="background:var(--board-dark); cursor:not-allowed;" disabled>🔒 Bloqueado</button>
        `;
      }
      
      albumGrid.appendChild(slot);
    });
  }

  // === 12. RUN ENGINE ===
  loadStateFromStorage();
  updateHeaderStats();
  checkAlbumCompletion();
  setupTabFilters();
  renderAlbumGrid();
  setupPackZone();
  initTrivia();
  setupTorretaClaim();
  setupDetailModalEvents();
});
