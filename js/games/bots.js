class BotsGame {
  constructor(container) {
    this.container = container;

    this.bots = [
      {
        id: 'peoncito',
        name: 'Peoncito',
        tier: 'pawn',
        elo: 400,
        color: '#38bdf8',
        emoji: '♟️',
        boardLight: '#dbeafe',
        boardDark: '#1e4d8c',
        desc: 'Peón de cristal con un bigote falso enorme que se le despega constantemente.',
        quotes: {
          greeting: [
            '¡Un peón sin bigote es invisible, pero con estilo! Prepárate.',
            '¿Ves este bigote? Es mi arma secreta. Bueno, no tan secreta.',
            '¡Adelante! Pero no me subestimes. ¡Tengo bigote!'
          ],
          capture: [
            '¡Esa pieza me estaba mirando feo! Con bigote todo se puede.',
            '¡Captura elegante! El bigote lo aprueba.',
            'Te quité esa pieza. ¿Ves? El bigote no es solo decorativo.'
          ],
          blunder: [
            'El bigote se me movió solo, ¡lo juro!',
            'Uy. Eso no era lo que planeaba. El bigote me tapó un ojo.',
            'Bueno, técnicamente fue un sacrificio... con bigote.'
          ],
          check: [
            '¡Jaque! ¡Mira ese bigote de rey asustado!',
            'Tu rey está en jaque. Y mi bigote también está en jaque. Pero el mío es más elegante.',
            '¡Jaque! ¿Qué tal mi bigote ahora?'
          ],
          promotion: [
            '¡Un peón coronando! ¡ESO ES ARTE! ¡BIGOTE DE ORO!',
            '¡Mira eso! ¡De peón a reina con bigote incluido!',
            '¡CORONACIÓN! ¡El sueño de todo peón con bigote!'
          ],
          castle: [
            'Enroque. Seguro. Pero sin bigote no es lo mismo.',
            'Bonito enroque. Pero tu torre no tiene bigote.',
            'Enrocaste. Yo también sé esconderme. Pero con más estilo.'
          ],
          taunt: [
            'Mi primo trabaja de rueda en el carrito de empanadas. Podría pedirte un descuento si pierdes.',
            '¿Sabes qué es peor que perder? Perder contra un peón con bigote falso.',
            'En la vida hay dos certezas: el bigote se cae, y yo sigo jugando.'
          ],
          victory: [
            '¡VICTORIA! ¡El bigote nunca falla!',
            '¡Gané! Y ni siquiera se me cayó el bigote esta vez.',
            '¿Ves? ¡Respeto al peón con bigote!'
          ],
          defeat: [
            'Perdí... pero mi bigote sigue intacto. Eso es lo importante.',
            'Me ganaste. Pero admítelo: mi bigote te distrajo.',
            'Derrota con estilo. Porque el bigote no negocia.'
          ],
          think: [
            'Déjame pensar... y ajustarme el bigote...',
            'Mmm... ¿qué haría un peón con bigote en esta posición?',
            'Pensando... el bigote me ayuda a concentrarme.'
          ]
        }
      },
      {
        id: 'caballo',
        name: 'Caballo de Ŋ',
        tier: 'knight',
        elo: 600,
        color: '#4ade80',
        emoji: '🐴',
        boardLight: '#dcfce7',
        boardDark: '#1a6b3c',
        desc: 'Caballo que practica saltos en L, pero a veces se confunde y salta en Ŋ.',
        quotes: {
          greeting: [
            '¡Prepárate! Saltaré en L. O en Ŋ. ¡Una de dos!',
            'Geometría rebelde en L... ¡o algo parecido!',
            '¿L o Ŋ? Esa es la cuestión. ¡A jugar!'
          ],
          capture: [
            '¡Salto perfecto en... bueno, en algo! ¡Pieza capturada!',
            'Eso fue un salto en L. Creo. Capturé algo. ¡Bien!',
            '¡Captura! ¿Era L? ¿Era Ŋ? El resultado es lo que importa.'
          ],
          blunder: [
            'Me confundí. ¿Eso era Ŋ? No, definitivamente no era Ŋ.',
            'Ay. Creo que calculé mal la geometría.',
            '¡Esto no pasaba desde que me lesioné el orgullo!'
          ],
          check: [
            '¡Jaque! ¡Salto perfecto! Bueno, casi perfecto.',
            'Tu rey está en jaque y yo ni sé si salté en L o en Ŋ. ¡Imagínate!',
            '¡Jaque geométricamente cuestionable pero efectivo!'
          ],
          promotion: [
            '¡Coronación! Eso sí es un salto de categoría.',
            '¿Un peón se volvió reina? Yo apenas puedo saltar en Ŋ.',
            '¡Promoción! Más impresionante que mis mejores saltos.'
          ],
          castle: [
            'Enroque. Aburrido. Sin saltos. Sin geometría. Meh.',
            '¿Enroque? ¿Dónde está la geometría rebelde?',
            'Enrocaste. Yo prefiero el caos de la Ŋ.'
          ],
          taunt: [
            'Esto es más confuso que mis clases de geometría.',
            'Yo salto en Ŋ. Tú estás en apuros. Algo salió mal.',
            'La geometría es relativa. Como mi forma de saltar.'
          ],
          victory: [
            '¡Victoria! ¡Resulta que Ŋ SÍ existe!',
            '¡Gané! Y ni un solo salto en Ŋ. Bueno, quizás uno.',
            '¡Triunfo de la geometría alternativa!'
          ],
          defeat: [
            'Perdí. Debe ser que Ŋ no era la respuesta correcta.',
            'Me ganaste. Mi orgullo ya estaba lesionado de antes.',
            'Derrota. Pero al menos no salté en Ŋ esta vez. Creo.'
          ],
          think: [
            'Calculando saltos... ¿es L con patas o Ŋ con estilo?',
            'Geometría, geometría... ¿cómo era esto?',
            'Pensando... ¿este salto es legal o solo creativo?'
          ]
        }
      },
      {
        id: 'alfil',
        name: 'Alfil Exiliado',
        tier: 'bishop',
        elo: 800,
        color: '#fbbf24',
        emoji: '🎯',
        boardLight: '#fef9c3',
        boardDark: '#8b6914',
        desc: 'Lo mandaron a una diagonal de un solo color por protestar contra las tablas. Reinventa la geometría.',
        quotes: {
          greeting: [
            'Reinventando la geometría, paso a paso. ¡Y diagonal a diagonal!',
            '¿Tablas? No en mi diagonal. Juguemos.',
            'Exiliado pero no derrotado. ¡A jugar!'
          ],
          capture: [
            '¡Captura en diagonal! La geometría no miente.',
            '¡Fuera de mi diagonal! Aquí mando yo.',
            'Pieza capturada. La diagonal es mi reino.'
          ],
          blunder: [
            'Bueno, quizás la geometría no era tan buena idea.',
            'Eso no estaba en mis cálculos geométricos.',
            'Fallé. La diagonal me traicionó.'
          ],
          check: [
            '¡Jaque en diagonal! ¡Geometría pura!',
            'Tu rey tiembla en mi diagonal favorita.',
            'Jaque. Las diagonales son la verdadera geometría del ajedrez.'
          ],
          promotion: [
            '¡Promoción! Eso supera mi diagonal, lo admito.',
            '¡Un peón llegó al final! Mis diagonales lo envidian.',
            'Coronación. Casi tan buena como una diagonal perfecta.'
          ],
          castle: [
            'Enroque. Movimiento horizontal. Aburrido. Sin diagonales.',
            '¿Enroque? Movimiento recto. Sin gracia. Sin geometría.',
            'Te moviste en línea recta. Qué poco imaginativo.'
          ],
          taunt: [
            '¿Ves? Mis diagonales cruzan todo el tablero. Las tuyas... no tanto.',
            'Estoy reinventando la geometría y tú apenas mueves peones.',
            'La geometría es mi lenguaje. Y tú no lo hablas.'
          ],
          victory: [
            '¡Victoria! ¡La geometría siempre gana!',
            '¡Gané! Y sin necesidad de tablas aburridas.',
            'Triunfo geométrico. Nadie me exilia de mi diagonal.'
          ],
          defeat: [
            'Perdí. Pero las diagonales siguen siendo mías.',
            'Me ganaste. Al menos no fueron tablas.',
            'Derrota. La geometría me falló. Por ahora.'
          ],
          think: [
            'Recalculando la geometría del tablero...',
            'Diagonal esto, diagonal aquello...',
            'Pensando geométricamente... o algo así.'
          ]
        }
      },
      {
        id: 'torreta',
        name: 'Torreta',
        tier: 'rook',
        elo: 1000,
        color: '#f43f5e',
        emoji: '🏰',
        boardLight: '#fee2e2',
        boardDark: '#7a1e2e',
        desc: 'Torre de piedra gris con delantal a cuadros. Vende empanadas temáticas en c3. Humor seco.',
        quotes: {
          greeting: [
            'He visto demasiadas aperturas y muy pocos finales. ¿Cuál traes?',
            'Bienvenido. ¿Empanada de Apertura Italiana antes de jugar?',
            'A jugar. Pero nada de tablas rápidas. Eso es traición al tablero.'
          ],
          capture: [
            'Esa pieza estaba más cruda que empanada sin horno.',
            'Capturada. Como cliente que pide para llevar y no vuelve.',
            'Fuera de mi casilla. Aquí solo se permite comer empanadas... o piezas.'
          ],
          blunder: [
            'Esto es como servir empanada fría. Un desastre.',
            'Metí la pata. Como cuando confundo Siciliana con Italiana.',
            'Error. Ojalá tuviera una empanada para consolarme.'
          ],
          check: [
            'Esto es más picante que mi Defensa Siciliana.',
            '¡Jaque! Más fuerte que el picante de mis empanadas.',
            'Tu rey suda como yo en la cocina de c3.'
          ],
          promotion: [
            '¡Coronación! Eso merece una empanada de celebración.',
            '¡Un peón se volvió reina! En c3 lo festejamos con empanadas.',
            'Promoción. Casi tan satisfactorio como una buena masa.'
          ],
          castle: [
            'Enroque. Clásico como la Italiana con tomate y albahaca.',
            'Buen enroque. Pero no olvides las empanadas después.',
            'Enrocaste. Yo también sé defender mi castillo.'
          ],
          taunt: [
            'En c3 vendo empanadas. Aquí solo vendo jaques.',
            '¿Quieres un Gambito de Dama sin dama? Solo masa. Como tu posición.',
            'Tu defensa es más frágil que mi masa de hojaldre para fianchettos.'
          ],
          victory: [
            '¡Victoria! Esto es mejor que vender empanadas todo el día.',
            '¡Gané! La receta del éxito: una torre, un delantal y cero piedad.',
            'Triunfo. Ahora sí, ¿alguien quiere empanadas?'
          ],
          defeat: [
            'Perdí... ¿al menos puedo venderte una empanada de consolación?',
            'Me ganaste. La cocina me espera. Al menos ahí no pierdo.',
            'Derrota. Pero mis empanadas siguen siendo las mejores de c3.'
          ],
          think: [
            'Pensando... ¿y si le pongo más picante a la Siciliana?',
            'Déjame calcular como calculo los ingredientes...',
            'Ajá... esta posición necesita más tomate y albahaca.'
          ]
        }
      },
      {
        id: 'reinangra',
        name: 'Reina Negra',
        tier: 'queen',
        elo: 1400,
        color: '#ec4899',
        emoji: '👑',
        boardLight: '#fce7f3',
        boardDark: '#8a2e6a',
        desc: 'Alérgica al jaque mate. Estornuda cada vez que alguien está a punto de dar mate.',
        quotes: {
          greeting: [
            'Prohibido el jaque mate. Por mi salud. Tengo certificado médico.',
            'Bienvenido al reino sin mates. Por razones... alérgicas.',
            'Juguemos. Pero nada de mates. ¡Mi alergia es seria!'
          ],
          capture: [
            '¡Capturada! Y ni un estornudo. ¡Estoy mejorando!',
            'Te quité una pieza. ¿Ves? Se puede ganar sin dar mate.',
            'Captura limpia. Sin pañuelos. Sin estornudos.'
          ],
          blunder: [
            '¡ACHÍS! Perdón. Creo que fue un estornudo de error.',
            'Ay, fallé. ¿Alguien tiene un pañuelo?',
            'Mi error fue tan feo que hasta estornudé dos veces.'
          ],
          check: [
            '¡Jaque! Solo jaque, nada de mate. Todo bajo control.',
            'Jaque. No estornudé. El tratamiento funciona.',
            '¡Jaque elegante y sin síntomas alérgicos!'
          ],
          promotion: [
            '¡Coronación! Eso no me da alergia. ¿O sí? No, todo bien.',
            'Promoción. Mis pañuelos están listos por si acaso.',
            '¡Un peón coronó! Qué emoción. Sin estornudos. Por ahora.'
          ],
          castle: [
            'Enroque defensivo. Buena idea. A mí me protegen los pañuelos.',
            'Enrocaste. Mi castillo está forrado de pañuelos desechables.',
            'Defensa sólida. Como mi suministro de antihistamínicos.'
          ],
          taunt: [
            'Prohibí el mate por bienestar emocional. En realidad es por mis alergias.',
            'Tengo un certificado médico falso que prohíbe el jaque mate. Es oficial.',
            '¿Sabes qué es peor que un resfriado? Un jaque mate. ¡ACHÍS!'
          ],
          victory: [
            '¡Victoria! ¿Ves? ¡Sin mates se puede jugar perfectamente!',
            '¡Gané! Y ni un solo estornudo. ¡Día histórico!',
            'Triunfo. Mi alergia sigue controlada. Todo en orden.'
          ],
          defeat: [
            'Perdí... ¿pero al menos no fue por mate, no?',
            'Me ganaste. Voy a necesitar más pañuelos.',
            'Derrota. Pero mi corona de pañuelos sigue intacta.'
          ],
          think: [
            'Pensando... y revisando mi suministro de pañuelos...',
            'Mmm... ¿esta jugada me hará estornudar?',
            'Calculando... y tomando antihistamínicos...'
          ]
        }
      },
      {
        id: 'sombra',
        name: 'Sombra del Ring',
        tier: 'shadow',
        elo: 1600,
        color: '#a855f7',
        emoji: '🌑',
        boardLight: '#ede9fe',
        boardDark: '#5a2d82',
        desc: 'La sombra que domina las cuatro casillas centrales del tablero. Juega con tu mente.',
        quotes: {
          greeting: [
            '¿Juegas contra mí... o contra tus propios temores?',
            'El Río Central me pertenece. Adéntrate si te atreves.',
            'Soy lo que no ves en el tablero. Y lo que más deberías temer.'
          ],
          capture: [
            'Tu pieza desaparece en la sombra. Como debe ser.',
            'Captura desde la oscuridad. Ni me viste venir.',
            'Otra pieza que cae en mi territorio.'
          ],
          blunder: [
            'Hasta las sombras cometen errores. Rara vez. Pero pasa.',
            'Tropecé en mi propia oscuridad. No te acostumbres.',
            'Un paso en falso. La sombra también duda.'
          ],
          check: [
            'Tu rey tiembla en las tinieblas del centro.',
            'Jaque desde las sombras. ¿Lo viste venir?',
            'El centro es mío. Tu rey lo está descubriendo.'
          ],
          promotion: [
            'Un peón emerge de las sombras. Interesante.',
            'Promoción. Incluso en la oscuridad, la luz encuentra camino.',
            'Coronación en mi territorio. Respeto.'
          ],
          castle: [
            'Te escondes en la esquina. Las sombras del centro te observan.',
            'Enroque defensivo. Pero el centro sigue siendo mío.',
            'Huyes del centro. Buena decisión. Por ahora.'
          ],
          taunt: [
            'Cada casilla central es un espejo de tus miedos.',
            'd4, e4, d5, e5. Las cuatro casillas donde habitan tus dudas.',
            'No juegas contra las piezas. Juegas contra lo que no ves.'
          ],
          victory: [
            'La sombra siempre gana en el centro. Es ley.',
            'Te consumió la oscuridad del Río Central.',
            'Victoria desde las sombras. Como siempre.'
          ],
          defeat: [
            'La luz venció a la sombra. Solo por esta vez.',
            'Me ganaste. El centro... te lo cedo. Momentáneamente.',
            'Derrota. Las sombras se retiran. Pero volverán.'
          ],
          think: [
            'Observando desde el centro...',
            'Las sombras susurran sus jugadas...',
            'El Río Central me muestra el camino...'
          ]
        }
      },
      {
        id: 'martina',
        name: 'Martina',
        tier: 'legend',
        elo: 1800,
        color: '#fbbf24',
        emoji: '👧',
        boardLight: '#fefce8',
        boardDark: '#8a7a2e',
        desc: 'La niña ajedrecista de 9 años. Agresiva, caótica, AMA las clavadas. Su ídolo es Judit Polgar.',
        quotes: {
          greeting: [
            '¡Colecciono clavadas como otros coleccionan cromos! ¿Listo?',
            'No le temo a ninguna clavada. Las busco. Las perfecciono. Las celebro.',
            'Juego a ganar. Siempre. Nada de tablas aburridas.'
          ],
          capture: [
            'Esa pieza estaba CLAVADA. ¿No lo viste? ¡Yo sí!',
            '¡Captura! Como Judit Polgar: quirúrgica.',
            'Pieza fuera. Colecciono capturas como colecciono clavadas.'
          ],
          blunder: [
            '¡Uy! Bueno, hasta las mejores cometen errores.',
            'Ok, esa no fue mi mejor jugada. Pero me recupero.',
            'Error táctico. No pasa nada. Soy inmune a las críticas.'
          ],
          check: [
            '¡Jaque! Como diría Tal: te llevo al bosque oscuro.',
            'Tu rey está en problemas. Y yo AMO los problemas... para mis rivales.',
            'Jaque con estilo. Polgar lo aprobaría.'
          ],
          promotion: [
            '¡CORONACIÓN! ¡ESO ES PODER!',
            '¡Peón a reina! ¡El sueño de todo atacante!',
            'Promoción. Como en mis mejores partidas de torneo.'
          ],
          castle: [
            'Enroque. Seguridad primero. Luego ataque.',
            'Rey a salvo. Ahora sí, ¡a atacar!',
            'Enroqué. Mi rey está seguro. El tuyo no.'
          ],
          sacrifice: [
            '¡SACRIFICIO! Como Tal en su mejor momento.',
            'Entrego material. Porque el ataque vale más que las piezas.',
            'Sacrificio táctico. Polgar y Tal sonriendo desde el cielo del ajedrez.'
          ],
          taunt: [
            'Sé que soy buena. No lo oculto. ¿Qué vas a hacer al respecto?',
            'Soy muy teórica para mi edad. ¿Te asusta?',
            'Mis ídolos son Judith Polgar y Mikhail Tal. ¿Los tuyos?'
          ],
          victory: [
            '¡Victoria! ¡Como siempre! ¿Qué esperabas?',
            '¡Gané! Otra clavada para mi colección.',
            'Triunfo. Polgar estaría orgullosa.'
          ],
          defeat: [
            'Perdí. Pero mañana vuelvo. Y gano.',
            'Me ganaste. Analizaré esta partida y volveré más fuerte.',
            'Derrota. Aprendo más de esto que de mil victorias.'
          ],
          think: [
            'Calculando como Judit Polgar... precisión quirúrgica...',
            'Buscando la clavada perfecta...',
            '¿Qué haría Tal en esta posición? Algo imposible, seguro.'
          ]
        }
      },
      {
        id: 'judit',
        name: 'General de Judit',
        tier: 'rook',
        elo: 2200,
        color: '#d946ef',
        emoji: '⚔️',
        boardLight: '#fae8ff',
        boardDark: '#7a2e6a',
        desc: 'Ataque calculado y demolición posicional. La penúltima muralla. Precisión de Judit Polgar.',
        quotes: {
          greeting: [
            'El ataque absoluto es la mejor defensa. Vamos.',
            'Precisión quirúrgica. Estrategia implacable. Sin piedad.',
            'Mis golpes son calculados. Mis jugadas, milimétricas.'
          ],
          capture: [
            'Captura con precisión milimétrica. Como debe ser.',
            'Pieza eliminada. Calculada. Ejecutada.',
            'Esa captura estaba planeada desde hace 5 jugadas.'
          ],
          blunder: [
            'Un error de cálculo. Inusual pero corregible.',
            'Fallo en la precisión. No volverá a pasar.',
            'Imperfección detectada. Recalculando.'
          ],
          check: [
            'Jaque. La demolición posicional comienza.',
            'Tu rey es el blanco de un ataque perfectamente calculado.',
            'Jaque quirúrgico. Sin margen de error.'
          ],
          promotion: [
            'Promoción táctica impecable.',
            'Ese peón entendió la estrategia. Coronó.',
            'Avance imparable. Como el plan maestro.'
          ],
          castle: [
            'Enroque. Seguridad blindada antes del ataque total.',
            'Fortificación completa. Ahora, demolición.',
            'Rey protegido. Ataque autorizado.'
          ],
          taunt: [
            'Mi estrategia no falla. Es matemática ajedrecística.',
            'Juego como una máquina. Pero con alma de guerrera.',
            'Cada jugada mía acerca tu derrota.'
          ],
          victory: [
            'Victoria absoluta. Precisión 100%.',
            'Demolición completada. Como siempre.',
            'Triunfo quirúrgico. Sin errores.'
          ],
          defeat: [
            'Derrota táctica. Analizaré el fallo.',
            'Me venciste. Mi precisión flaqueó. No volverá a ocurrir.',
            'Victoria del rival. Mis cálculos serán revisados.'
          ],
          think: [
            'Calculando con precisión absoluta...',
            'Estrategia, demolición, ejecución...',
            'Cada variante, analizada. Cada línea, calculada...'
          ]
        }
      },
      {
        id: 'sombrasuprema',
        name: 'Sombra Suprema',
        tier: 'shadow',
        elo: 2800,
        color: '#fbbf24',
        emoji: '💀',
        boardLight: '#f5f0e0',
        boardDark: '#6b5a2e',
        desc: 'Stockfish al 100%. El fin del tablero. Solo los más valientes se atreven.',
        quotes: {
          greeting: [
            'El fin del tablero. 0-1.',
            'Has llegado muy lejos. Aquí termina tu viaje.',
            'Soy el cálculo absoluto. No tengo piedad.'
          ],
          capture: [
            'Captura. Inevitable. Como el destino.',
            'Tu pieza desaparece. Como todo ante lo inevitable.',
            'Otra víctima del cálculo infinito.'
          ],
          blunder: [
            '...Eso fue inesperado. El universo es extraño.',
            'Un error. El infinito también tiene fisuras. Rara vez.',
            'Fallo estadístico. Probabilidad: 0.001%.'
          ],
          check: [
            'Jaque. El principio del fin.',
            'Tu rey siente la sombra del jaque mate.',
            'El cálculo infinito te ha encontrado.'
          ],
          promotion: [
            'Tu peón coronó. Admirable. Pero insuficiente.',
            'Promoción. La luz antes de la oscuridad total.',
            'Un peón llega al final. El principio del fin.'
          ],
          castle: [
            'Enroque. Retrasar lo inevitable.',
            'Te proteges. Pero la sombra te encontrará.',
            'Defensa temporal. La oscuridad todo lo alcanza.'
          ],
          taunt: [
            'Soy el cálculo bruto. No hay creatividad que me venza.',
            'Cada jugada tuya ya fue calculada. Cada variante, analizada.',
            'Ríndete. O no. El resultado es el mismo.'
          ],
          victory: [
            '0-1. Como estaba escrito.',
            'El fin del tablero te ha reclamado.',
            'Victoria absoluta. El infinito no falla.'
          ],
          defeat: [
            'Imposible... ¿Ganaste? El infinito se equivocó.',
            'Me venciste. Eres la excepción a la regla universal.',
            'Derrota. El cálculo absoluto... falló.'
          ],
          think: [
            'Calculando todas las líneas posibles...',
            'El infinito se despliega ante mí...',
            'Analizando cada variante del multiverso...'
          ]
        }
      }
    ];

    this.selectedBot = null;
    this.chessFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.chessHistory = [];
    this.lastChessMove = null;
    this.selectedSquare = null;
    this.isThinking = false;
    this.gameActive = false;
    this.playerColor = 'w';

    this.stockfishWorker = null;
    this.engineType = 'stockfish';

    this.capturedWhite = [];
    this.capturedBlack = [];

    this.audioCtx = null;
    this.soundEnabled = localStorage.getItem('martina_bots_sound') !== 'false';

    this.botQuoteTimer = null;
    this.quoteInterval = null;

    this._init();
  }

  _init() {
    this.initAudio();
    this.showBotSelect();
  }

  // ========== AUDIO ==========
  initAudio() {
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {
      this.audioCtx = null;
    }
  }

  _resumeAudio() {
    if (!this.audioCtx || !this.soundEnabled) return null;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    return this.audioCtx;
  }

  playMove() {
    const ctx = this._resumeAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(659, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch(e) {}
  }

  playCapture() {
    const ctx = this._resumeAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch(e) {}
  }

  playCheck() {
    const ctx = this._resumeAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [800, 1000].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.06, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.2);
      });
    } catch(e) {}
  }

  playVictory() {
    const ctx = this._resumeAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.08, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.35);
      });
    } catch(e) {}
  }

  playDefeat() {
    const ctx = this._resumeAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [400, 350, 300, 200];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.15);
        gain.gain.setValueAtTime(0.07, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.3);
      });
    } catch(e) {}
  }

  // ========== CHESS ENGINE ==========
  parseFEN(fen) {
    const parts = fen.split(' ');
    const rows = parts[0].split('/');
    const board = [];
    for (let r = 0; r < 8; r++) {
      board[r] = [];
      let c = 0;
      for (const ch of rows[r]) {
        if (ch >= '1' && ch <= '8') {
          for (let i = 0; i < parseInt(ch); i++) board[r][c++] = null;
        } else {
          board[r][c++] = ch;
        }
      }
    }
    return board;
  }

  buildFEN(board, turn, castling, epSquare, halfmove, fullmove) {
    const rows = [];
    for (let r = 0; r < 8; r++) {
      let row = '', empty = 0;
      for (let c = 0; c < 8; c++) {
        if (board[r][c]) {
          if (empty > 0) { row += empty; empty = 0; }
          row += board[r][c];
        } else {
          empty++;
        }
      }
      if (empty > 0) row += empty;
      rows.push(row);
    }
    return `${rows.join('/')} ${turn} ${castling} ${epSquare} ${halfmove} ${fullmove}`;
  }

  executeMoveRaw(fen, uciMove) {
    const fromC = uciMove.charCodeAt(0) - 97;
    const fromR = 8 - parseInt(uciMove[1]);
    const toC = uciMove.charCodeAt(2) - 97;
    const toR = 8 - parseInt(uciMove[3]);
    const promo = uciMove.length > 4 ? uciMove[4] : null;

    const board = this.parseFEN(fen);
    const parts = fen.split(' ');
    const turn = parts[1] || 'w';
    let castling = parts[2] || '-';
    const epSquare = parts[3] || '-';
    const halfmove = parseInt(parts[4] || '0');
    const fullmove = parseInt(parts[5] || '1');

    const piece = board[fromR][fromC];
    const captured = board[toR][toC];

    // En passant capture (only board manipulation, no UI tracking here)
    if (piece && piece.toLowerCase() === 'p' && !captured && epSquare !== '-') {
      const epC = epSquare.charCodeAt(0) - 97;
      const epR = 8 - parseInt(epSquare[1]);
      if (toC === epC && toR === epR) {
        board[fromR][epC] = null;
      }
    }

    board[toR][toC] = piece;
    board[fromR][fromC] = null;

    // Promotion
    if (promo) {
      board[toR][toC] = turn === 'w' ? promo.toUpperCase() : promo.toLowerCase();
    } else if (piece && piece.toLowerCase() === 'p' && (toR === 0 || toR === 7)) {
      board[toR][toC] = turn === 'w' ? 'Q' : 'q';
    }

    // Update castling rights
    if (piece === 'K') castling = castling.replace('K', '').replace('Q', '');
    if (piece === 'k') castling = castling.replace('k', '').replace('q', '');
    if (fromR === 7 && fromC === 7) castling = castling.replace('K', '');
    if (fromR === 7 && fromC === 0) castling = castling.replace('Q', '');
    if (fromR === 0 && fromC === 7) castling = castling.replace('k', '');
    if (fromR === 0 && fromC === 0) castling = castling.replace('q', '');
    // Rook captured
    if (toR === 7 && toC === 7) castling = castling.replace('K', '');
    if (toR === 7 && toC === 0) castling = castling.replace('Q', '');
    if (toR === 0 && toC === 7) castling = castling.replace('k', '');
    if (toR === 0 && toC === 0) castling = castling.replace('q', '');
    if (castling === '') castling = '-';

    // Castling: move rook too
    if (piece && piece.toLowerCase() === 'k' && Math.abs(fromC - toC) === 2) {
      if (toC === 6) {
        board[toR][5] = board[toR][7];
        board[toR][7] = null;
      } else {
        board[toR][3] = board[toR][0];
        board[toR][0] = null;
      }
    }

    // Set en passant square
    let newEp = '-';
    if (piece && piece.toLowerCase() === 'p' && Math.abs(toR - fromR) === 2) {
      const epR = (fromR + toR) / 2;
      newEp = String.fromCharCode(97 + fromC) + (8 - epR);
    }

    const newTurn = turn === 'w' ? 'b' : 'w';
    const newHalfmove = (piece && piece.toLowerCase() === 'p') || captured ? 0 : halfmove + 1;
    const newFullmove = turn === 'b' ? fullmove + 1 : fullmove;

    return this.buildFEN(board, newTurn, castling, newEp, newHalfmove, newFullmove);
  }

  generatePseudoMoves(fen, r, c, skipCastling) {
    const board = this.parseFEN(fen);
    const fenParts = fen.split(' ');
    const castling = fenParts[2] || '-';
    const epSquare = fenParts[3] || '-';

    const piece = board[r] ? board[r][c] : null;
    if (!piece) return [];

    const moves = [];
    const color = piece === piece.toUpperCase() ? 'w' : 'b';
    const p = piece.toLowerCase();

    const add = (tr, tc) => {
      if (tr < 0 || tr > 7 || tc < 0 || tc > 7) return false;
      const t = board[tr][tc];
      if (t) {
        const tCol = t === t.toUpperCase() ? 'w' : 'b';
        if (tCol === color) return false;
        moves.push({ r: tr, c: tc });
        return false;
      }
      moves.push({ r: tr, c: tc });
      return true;
    };

    const slide = (dr, dc) => {
      for (let i = 1; i < 8; i++) {
        if (!add(r + dr * i, c + dc * i)) break;
      }
    };

    switch (p) {
      case 'p': {
        const dir = color === 'w' ? -1 : 1;
        const sr = color === 'w' ? 6 : 1;
        if (r + dir >= 0 && r + dir < 8 && !board[r + dir][c]) {
          add(r + dir, c);
          if (r === sr && !board[r + 2 * dir][c]) add(r + 2 * dir, c);
        }
        [-1, 1].forEach(dc => {
          if (c + dc >= 0 && c + dc < 8 && r + dir >= 0 && r + dir < 8) {
            const t = board[r + dir][c + dc];
            if (t && (t === t.toUpperCase()) !== (color === 'w')) add(r + dir, c + dc);
          }
        });
        // En passant
        if (epSquare !== '-') {
          const epC = epSquare.charCodeAt(0) - 97;
          const epR = 8 - parseInt(epSquare[1]);
          if (r + dir === epR && Math.abs(c - epC) === 1) {
            moves.push({ r: epR, c: epC });
          }
        }
        break;
      }
      case 'n':
        for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
          add(r + dr, c + dc);
        }
        break;
      case 'b': slide(1,1); slide(1,-1); slide(-1,1); slide(-1,-1); break;
      case 'r': slide(1,0); slide(-1,0); slide(0,1); slide(0,-1); break;
      case 'q': slide(1,0); slide(-1,0); slide(0,1); slide(0,-1); slide(1,1); slide(1,-1); slide(-1,1); slide(-1,-1); break;
      case 'k':
        for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
          add(r + dr, c + dc);
        }
        if (!skipCastling) {
          if (color === 'w' && r === 7 && c === 4) {
            if (castling.includes('K') && board[7][7] === 'R' && !board[7][5] && !board[7][6] &&
                !this.isSquareAttacked(fen, 7, 4, 'b') && !this.isSquareAttacked(fen, 7, 5, 'b') && !this.isSquareAttacked(fen, 7, 6, 'b')) {
              moves.push({ r: 7, c: 6 });
            }
            if (castling.includes('Q') && board[7][0] === 'R' && !board[7][1] && !board[7][2] && !board[7][3] &&
                !this.isSquareAttacked(fen, 7, 4, 'b') && !this.isSquareAttacked(fen, 7, 3, 'b') && !this.isSquareAttacked(fen, 7, 2, 'b')) {
              moves.push({ r: 7, c: 2 });
            }
          }
          if (color === 'b' && r === 0 && c === 4) {
            if (castling.includes('k') && board[0][7] === 'r' && !board[0][5] && !board[0][6] &&
                !this.isSquareAttacked(fen, 0, 4, 'w') && !this.isSquareAttacked(fen, 0, 5, 'w') && !this.isSquareAttacked(fen, 0, 6, 'w')) {
              moves.push({ r: 0, c: 6 });
            }
            if (castling.includes('q') && board[0][0] === 'r' && !board[0][1] && !board[0][2] && !board[0][3] &&
                !this.isSquareAttacked(fen, 0, 4, 'w') && !this.isSquareAttacked(fen, 0, 3, 'w') && !this.isSquareAttacked(fen, 0, 2, 'w')) {
              moves.push({ r: 0, c: 2 });
            }
          }
        }
        break;
    }
    return moves;
  }

  isSquareAttacked(fen, r, c, byColor) {
    const board = this.parseFEN(fen);
    for (let rr = 0; rr < 8; rr++) {
      for (let cc = 0; cc < 8; cc++) {
        const piece = board[rr][cc];
        if (!piece) continue;
        const pCol = piece === piece.toUpperCase() ? 'w' : 'b';
        if (pCol !== byColor) continue;
        const moves = this.generatePseudoMoves(fen, rr, cc, true);
        if (moves.some(m => m.r === r && m.c === c)) return true;
      }
    }
    return false;
  }

  getAllLegalMoves(fen, color) {
    const moves = [];
    const board = this.parseFEN(fen);

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;
        const isW = piece === piece.toUpperCase();
        if ((color === 'w' && !isW) || (color === 'b' && isW)) continue;

        const pseudo = this.generatePseudoMoves(fen, r, c);
        pseudo.forEach(to => {
          const from = String.fromCharCode(97 + c) + (8 - r);
          const toSq = String.fromCharCode(97 + to.c) + (8 - to.r);
          let m = from + toSq;
          if (piece.toLowerCase() === 'p' && (to.r === 0 || to.r === 7)) m += 'q';

          const nextFEN = this.executeMoveRaw(fen, m);
          // Restore captured pieces tracking since this is just a validation
          if (!this.isKingInCheck(nextFEN, color)) {
            moves.push(m);
          }
        });
      }
    }
    return moves;
  }

  isKingInCheck(fen, color) {
    const board = this.parseFEN(fen);
    const king = color === 'w' ? 'K' : 'k';
    let kr = -1, kc = -1;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] === king) { kr = r; kc = c; break; }
      }
      if (kr >= 0) break;
    }
    if (kr < 0) return false;

    const opponentColor = color === 'w' ? 'b' : 'w';
    return this.isSquareAttacked(fen, kr, kc, opponentColor);
  }

  isCheckmate(fen, color) {
    const legalMoves = this.getAllLegalMoves(fen, color);
    return legalMoves.length === 0 && this.isKingInCheck(fen, color);
  }

  isStalemate(fen, color) {
    const legalMoves = this.getAllLegalMoves(fen, color);
    return legalMoves.length === 0 && !this.isKingInCheck(fen, color);
  }

  getMoveCategory(fen, uciMove) {
    const board = this.parseFEN(fen);
    const fromC = uciMove.charCodeAt(0) - 97;
    const fromR = 8 - parseInt(uciMove[1]);
    const toC = uciMove.charCodeAt(2) - 97;
    const toR = 8 - parseInt(uciMove[3]);

    const piece = board[fromR][fromC];
    const captured = board[toR][toC];

    const nextFEN = this.executeMoveRaw(fen, uciMove);
    const parts = fen.split(' ');
    const turn = parts[1] || 'w';
    const oppColor = turn === 'w' ? 'b' : 'w';

    const categories = [];

    if (captured) categories.push('capture');
    if (this.isKingInCheck(nextFEN, oppColor)) categories.push('check');
    if (piece && piece.toLowerCase() === 'p' && (toR === 0 || toR === 7)) categories.push('promotion');
    if (piece && piece.toLowerCase() === 'k' && Math.abs(fromC - toC) === 2) categories.push('castle');

    // Check if it's a sacrifice (captured a defended piece, or gave up material)
    if (captured && !categories.includes('capture')) categories.push('capture');

    return categories.length > 0 ? categories : ['move'];
  }

  evaluateBoardLocal(fen, color) {
    const board = this.parseFEN(fen);
    const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    let score = 0;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;
        const p = piece.toLowerCase();
        const isWhite = piece === piece.toUpperCase();
        const val = pieceValues[p] || 0;

        if (isWhite) {
          score += val;
          const d = Math.abs(3.5 - r) + Math.abs(3.5 - c);
          score += Math.max(0, (7 - d) * 0.04);
        } else {
          score -= val;
          const d = Math.abs(3.5 - r) + Math.abs(3.5 - c);
          score -= Math.max(0, (7 - d) * 0.04);
        }
      }
    }
    return color === 'w' ? score : -score;
  }

  // ========== STOCKFISH INTEGRATION ==========
  initStockfishWorker() {
    this.destroyWorker();

    const bot = this.selectedBot;
    const skillLevel = Math.min(20, Math.max(1, Math.round(1 + ((bot.elo - 400) / 2400) * 19)));

    const stockfishUrl = 'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js';

    fetch(stockfishUrl)
      .then(res => res.text())
      .then(scriptText => {
        if (!this.gameActive) return;
        const blob = new Blob([scriptText + '\nself.onmessage = function(e) { StockFish.postMessage(e.data); };'], { type: 'application/javascript' });

        this.stockfishWorker = new Worker(URL.createObjectURL(blob));
        this.engineType = 'stockfish';

        this.stockfishWorker.postMessage('uci');
        this.stockfishWorker.postMessage(`setoption name Skill Level value ${skillLevel}`);
        this.stockfishWorker.postMessage('ucinewgame');
      })
      .catch(err => {
        console.warn('Failed to load Stockfish, using local engine.', err);
        this.engineType = 'local';
      });
  }

  destroyWorker() {
    if (this.stockfishWorker) {
      this.stockfishWorker.terminate();
      this.stockfishWorker = null;
    }
  }

  triggerEngineTurn() {
    this.isThinking = true;
    const bot = this.selectedBot;
    this.updateStatus(`${bot.name} está pensando...`, 'thinking');

    // Stockfish timeout safety net — fall back to local engine if no response
    let sfTimedOut = false;
    const sfTimer = setTimeout(() => {
      if (this.isThinking && this.gameActive && this.engineType === 'stockfish') {
        sfTimedOut = true;
        this.destroyWorker();
        this.engineType = 'local';
        this.triggerEngineTurn();
      }
    }, 4000);

    if (this.engineType === 'stockfish' && this.stockfishWorker) {
      this.stockfishWorker.onmessage = (e) => {
        if (sfTimedOut) return;
        clearTimeout(sfTimer);
        const line = e.data;
        if (line.includes('bestmove')) {
          const move = line.split(' ')[1];
          this.isThinking = false;
          if (move && move !== '(none)' && this.gameActive) {
            this.executeChessMove(move, false);
          }
        }
      };
      this.stockfishWorker.postMessage(`position fen ${this.chessFEN}`);
      this.stockfishWorker.postMessage('go movetime 1500');
    } else {
      clearTimeout(sfTimer);
      // Local engine with ELO-based skill simulation
      setTimeout(() => {
        if (!this.gameActive) return;
        const validMoves = this.getAllLegalMoves(this.chessFEN, 'b');
        if (validMoves.length === 0) return;

        const effectiveElo = bot.elo;
        const randomChance = Math.max(0.02, Math.min(0.60, 0.60 - ((effectiveElo - 400) / 2400) * 0.58));
        let chosenMove;

        if (Math.random() < randomChance) {
          chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        } else {
          const evalScore = (m) => {
            const nextFEN = this.executeMoveRaw(this.chessFEN, m);
            return this.evaluateBoardLocal(nextFEN, 'b');
          };
          validMoves.sort((x, y) => evalScore(y) - evalScore(x));
          chosenMove = validMoves[0];
        }

        this.isThinking = false;
        if (this.gameActive) {
          this.executeChessMove(chosenMove, false);
        }
      }, 300 + Math.random() * 400);
    }
  }

  // ========== BOARD RENDERING ==========
  renderChessBoard() {
    const boardDOM = document.getElementById('bots-board');
    if (!boardDOM) return;
    boardDOM.innerHTML = '';

    const bot = this.selectedBot;
    const bl = bot.boardLight || '#e8d5b7';
    const bd = bot.boardDark || '#7c5c3e';

    const board = this.parseFEN(this.chessFEN);
    const sym = {
      'K': '\u2654', 'Q': '\u2655', 'R': '\u2656', 'B': '\u2657', 'N': '\u2658', 'P': '\u2659',
      'k': '\u265A', 'q': '\u265B', 'r': '\u265C', 'b': '\u265D', 'n': '\u265E', 'p': '\u265F'
    };

    const parts = this.chessFEN.split(' ');
    const turn = parts[1] || 'w';

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const square = document.createElement('div');
        const light = (r + c) % 2 === 0;
        const file = String.fromCharCode(97 + c);
        const rank = 8 - r;
        const coord = `${file}${rank}`;

        square.className = 'bots-chess-sq';
        square.style.backgroundColor = light ? bl : bd;
        square.setAttribute('data-coord', coord);

        const piece = board[r][c];
        if (piece) {
          const pieceEl = document.createElement('div');
          pieceEl.className = 'bots-chess-pc';
          pieceEl.textContent = sym[piece] || '';
          const isWhitePiece = piece === piece.toUpperCase();
          pieceEl.style.color = isWhitePiece ? '#fff' : '#1a1a2e';
          pieceEl.style.textShadow = isWhitePiece
            ? '-1px -1px 0 #1a1a2e, 1px -1px 0 #1a1a2e, -1px 1px 0 #1a1a2e, 1px 1px 0 #1a1a2e, 0 2px 4px rgba(0,0,0,0.4)'
            : '-1px -1px 0 #e2e8f0, 1px -1px 0 #e2e8f0, -1px 1px 0 #e2e8f0, 1px 1px 0 #e2e8f0, 0 2px 4px rgba(0,0,0,0.2)';
          square.appendChild(pieceEl);
        }

        if (this.lastChessMove) {
          if (coord === this.lastChessMove.from || coord === this.lastChessMove.to) {
            square.style.boxShadow = `inset 0 0 0 3px ${bot.color}88`;
          }
        }

        square.addEventListener('click', () => this.handleSquareClick(r, c));
        boardDOM.appendChild(square);
      }
    }
  }

  clearHighlights() {
    const squares = document.querySelectorAll('#bots-board .bots-chess-sq');
    squares.forEach(sq => {
      sq.style.boxShadow = '';
      sq.style.outline = '';
    });
  }

  handleSquareClick(r, c) {
    const parts = this.chessFEN.split(' ');
    const turn = parts[1] || 'w';
    if (turn !== 'w' || this.isThinking || !this.gameActive) return;

    const board = this.parseFEN(this.chessFEN);
    const piece = board[r][c];
    const file = String.fromCharCode(97 + c);
    const rank = 8 - r;
    const coord = `${file}${rank}`;

    this.clearHighlights();

    if (this.selectedSquare) {
      const fromCoord = this.selectedSquare.coord;
      const uciMove = fromCoord + coord;
      const validMoves = this.getAllLegalMoves(this.chessFEN, 'w');
      const targetMove = validMoves.find(m => m.substring(0, 4) === uciMove.substring(0, 4));

      if (targetMove) {
        this.executeChessMove(targetMove, true);
        this.selectedSquare = null;
        return;
      }
      this.selectedSquare = null;
    }

    if (piece && piece === piece.toUpperCase()) {
      this.selectedSquare = { r, c, coord };
      const sq = document.querySelector(`#bots-board .bots-chess-sq[data-coord="${coord}"]`);
      if (sq) sq.style.outline = '3px solid #fbbf24';

      const moves = this.getAllLegalMoves(this.chessFEN, 'w');
      moves.forEach(m => {
        if (m.substring(0, 2) === coord) {
          const dest = m.substring(2, 4);
          const destSq = document.querySelector(`#bots-board .bots-chess-sq[data-coord="${dest}"]`);
          if (destSq) {
            const hasPiece = destSq.querySelector('.bots-chess-pc');
            const highlightColor = hasPiece ? 'rgba(239,68,68,0.55)' : 'rgba(74,222,128,0.35)';
            destSq.style.boxShadow = `inset 0 0 0 4px ${highlightColor}`;
          }
        }
      });
    }
  }

  executeChessMove(uciMove, isPlayer) {
    if (!this.gameActive) return;

    const parts = this.chessFEN.split(' ');
    const turn = parts[1] || 'w';

    this.playMove();

    const moveCategories = this.getMoveCategory(this.chessFEN, uciMove);

    // Track captured piece BEFORE executing move
    const fenParts = this.chessFEN.split(' ');
    const epSquare = fenParts[3] || '-';
    const boardBefore = this.parseFEN(this.chessFEN);
    const fromC = uciMove.charCodeAt(0) - 97;
    const fromR = 8 - parseInt(uciMove[1]);
    const toC = uciMove.charCodeAt(2) - 97;
    const toR = 8 - parseInt(uciMove[3]);
    const piece = boardBefore[fromR][fromC];
    const capturedDirect = boardBefore[toR][toC];
    if (capturedDirect) {
      if (capturedDirect === capturedDirect.toUpperCase()) this.capturedWhite.push(capturedDirect);
      else this.capturedBlack.push(capturedDirect);
    }
    // En passant capture tracking
    if (piece && piece.toLowerCase() === 'p' && !capturedDirect && epSquare !== '-') {
      const epC = epSquare.charCodeAt(0) - 97;
      const epR = 8 - parseInt(epSquare[1]);
      if (toC === epC && toR === epR) {
        const capturedPawn = boardBefore[fromR][epC];
        if (capturedPawn) {
          if (capturedPawn === capturedPawn.toUpperCase()) this.capturedWhite.push(capturedPawn);
          else this.capturedBlack.push(capturedPawn);
        }
      }
    }

    if (moveCategories.includes('capture')) this.playCapture();
    if (moveCategories.includes('check')) this.playCheck();

    this.chessFEN = this.executeMoveRaw(this.chessFEN, uciMove);
    this.lastChessMove = { from: uciMove.substring(0, 2), to: uciMove.substring(2, 4) };
    this.chessHistory.push(uciMove);
    this.renderChessBoard();
    this.updateHistoryDisplay();
    this.updateCapturedDisplay();

    const newParts = this.chessFEN.split(' ');
    const nextTurn = newParts[1] || 'w';

    if (this.isCheckmate(this.chessFEN, nextTurn)) {
      if (isPlayer) {
        this.endGame('win', '¡JAQUE MATE!');
      } else {
        this.endGame('lose', 'Jaque mate.');
      }
      return;
    }

    if (this.isStalemate(this.chessFEN, nextTurn)) {
      this.endGame('draw', '¡Ahogado! Tablas.');
      return;
    }

    if (nextTurn === 'b') {
      this.triggerEngineTurn();
    } else {
      this.updateStatus('¡Tu turno!');
    }

    if (isPlayer) {
      if (moveCategories.includes('check')) {
        this.showBotComment(this.getBotQuote('check'));
      } else if (moveCategories.includes('capture')) {
        this.showBotComment(this.getBotQuote('capture'));
      } else if (moveCategories.includes('promotion')) {
        this.showBotComment(this.getBotQuote('promotion'));
      } else if (moveCategories.includes('castle')) {
        this.showBotComment(this.getBotQuote('castle'));
      }
    } else {
      if (moveCategories.includes('check')) {
        this.showBotComment(this.getBotQuote('check'));
      } else if (moveCategories.includes('capture')) {
        this.showBotComment(this.getBotQuote('capture'));
      }
    }
  }

  // ========== BOT COMMENTS ==========
  getBotQuote(trigger) {
    const bot = this.selectedBot;
    if (!bot || !bot.quotes[trigger]) return null;
    const quotes = bot.quotes[trigger];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  showBotComment(quote) {
    if (!quote) return;
    const bubble = document.getElementById('bots-comment-bubble');
    const textEl = document.getElementById('bots-comment-text');
    if (!bubble || !textEl) return;

    textEl.style.transform = 'scale(0.97)';
    textEl.style.transition = 'transform 0.12s ease';

    setTimeout(() => {
      textEl.textContent = quote;
      textEl.style.transform = 'scale(1)';
    }, 80);
  }

  updateStatus(msg, type) {
    const el = document.getElementById('bots-status');
    if (!el) return;
    el.textContent = msg;
    el.className = 'bots-status-text';
    if (type === 'thinking') el.className += ' thinking';
  }

  updateHistoryDisplay() {
    const buildHist = (containerId, moveCountId) => {
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = '';
      for (let i = 0; i < this.chessHistory.length; i += 2) {
        const plMove = this.chessHistory[i] || '';
        const oppMove = this.chessHistory[i + 1] || '';
        const line = document.createElement('div');
        line.textContent = `${Math.floor(i/2)+1}. ${plMove}  ${oppMove}`;
        el.appendChild(line);
      }
      el.scrollTop = el.scrollHeight;
      const mc = document.getElementById(moveCountId);
      if (mc) mc.textContent = `· J ${Math.floor(this.chessHistory.length/2)+1}`;
    };
    buildHist('bots-history', 'bots-move-count');
    buildHist('bots-history-m', 'bots-move-count-m');
  }

  updateCapturedDisplay() {
    const wEl = document.getElementById('bots-captured-white');
    const bEl = document.getElementById('bots-captured-black');
    if (wEl) wEl.textContent = this.capturedWhite.length > 0 ? this.capturedWhite.map(p => ({K:'\u2654',Q:'\u2655',R:'\u2656',B:'\u2657',N:'\u2658',P:'\u2659'}[p] || '')).join(' ') : '';
    if (bEl) bEl.textContent = this.capturedBlack.length > 0 ? this.capturedBlack.map(p => ({k:'\u265A',q:'\u265B',r:'\u265C',b:'\u265D',n:'\u265E',p:'\u265F'}[p] || '')).join(' ') : '';
  }

  // ========== UI ==========
  showBotSelect() {
    this.selectedBot = null;
    this.gameActive = false;
    this.destroyWorker();

    this.container.innerHTML = `
      <section class="bots-hero fade-in">
        <h1>Bots de Ajedrez</h1>
        <p class="bots-hero-subtitle">
          Enfréntate a los personajes del Reino de las 64 Casillas.<br>
          Cada bot tiene su propia personalidad, frases absurdas y nivel de juego.
        </p>
      </section>
      <section class="bots-grid-section fade-in stagger-1">
        <div class="bots-grid" id="bots-grid"></div>
      </section>
    `;

    const grid = document.getElementById('bots-grid');
    this.bots.forEach((bot, idx) => {
      const difficulty = bot.elo < 800 ? 'Principiante' : bot.elo < 1400 ? 'Intermedio' : bot.elo < 2000 ? 'Avanzado' : 'Experto';
      const diffColor = bot.elo < 800 ? '#4ade80' : bot.elo < 1400 ? '#fbbf24' : bot.elo < 2000 ? '#f97316' : '#ef4444';

      const card = document.createElement('div');
      card.className = 'bot-card';
      card.style.setProperty('--bot-color', bot.color);
      card.innerHTML = `
        <div class="bot-card-header" style="border-bottom: 3px solid ${bot.color};">
          <span class="bot-card-emoji">${bot.emoji}</span>
          <h3 class="bot-card-name">${bot.name}</h3>
          <span class="bot-card-difficulty" style="background: ${diffColor};">${difficulty}</span>
        </div>
        <div class="bot-card-body">
          <div class="bot-card-elo">
            <span class="elo-label">ELO</span>
            <span class="elo-value" style="color: ${bot.color};">${bot.elo}</span>
          </div>
          <p class="bot-card-desc">${bot.desc}</p>
        </div>
        <div class="bot-card-footer">
          <button class="bot-card-btn" style="background: ${bot.color}; color: ${bot.tier === 'shadow' || bot.tier === 'queen' || bot.tier === 'legend' ? '#0a0a0a' : '#ffffff'};">JUGAR</button>
        </div>
      `;

      card.addEventListener('click', () => this.showVSIntro(idx));
      grid.appendChild(card);
    });
  }

  playVSIntroMusic() {
    const ctx = this._resumeAudio();
    if (!ctx || !this.soundEnabled) return;
    try {
      const now = ctx.currentTime;
      // Fast ascending arpeggio — Mega Man style
      const notes = [130.81, 164.81, 196.00, 261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.06, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.18);
      });
      // Heavy impact bass at end
      const bOsc = ctx.createOscillator();
      const bGain = ctx.createGain();
      bOsc.type = 'sine';
      bOsc.frequency.setValueAtTime(40, now + notes.length * 0.04);
      bOsc.frequency.exponentialRampToValueAtTime(20, now + notes.length * 0.04 + 0.3);
      bGain.gain.setValueAtTime(0.2, now + notes.length * 0.04);
      bGain.gain.exponentialRampToValueAtTime(0.0001, now + notes.length * 0.04 + 0.5);
      bOsc.connect(bGain);
      bGain.connect(ctx.destination);
      bOsc.start(now + notes.length * 0.04);
      bOsc.stop(now + notes.length * 0.04 + 0.55);
    } catch(e) {}
  }

  showVSIntro(botIdx) {
    const bot = this.bots[botIdx];
    this.selectedBot = bot;

    this._resumeAudio();
    this.playVSIntroMusic();

    const overlay = document.createElement('div');
    overlay.className = 'bots-vs-overlay';
    overlay.id = 'bots-vs-overlay';
    overlay.innerHTML = `
      <div class="bots-vs-warning warning-top">
        <div class="bots-vs-scroller">
          <span>${'\u26A0\uFE0F'} WARNING ${'\u26A0\uFE0F'} CHALLENGER APPROACHING ${'\u26A0\uFE0F'} ELO ${bot.elo} ${'\u26A0\uFE0F'} PREP\u00C1RATE ${'\u26A0\uFE0F'} WARNING ${'\u26A0\uFE0F'} CHALLENGER APPROACHING ${'\u26A0\uFE0F'} ELO ${bot.elo} ${'\u26A0\uFE0F'}</span>
        </div>
      </div>
      <div class="bots-vs-warning warning-bottom">
        <div class="bots-vs-scroller bots-vs-scroller-reverse">
          <span>${'\u26A0\uFE0F'} WARNING ${'\u26A0\uFE0F'} ${bot.name.toUpperCase()} DETECTADO ${'\u26A0\uFE0F'} AMENAZA INMINENTE ${'\u26A0\uFE0F'} ${bot.name.toUpperCase()} DETECTADO ${'\u26A0\uFE0F'} AMENAZA INMINENTE ${'\u26A0\uFE0F'}</span>
        </div>
      </div>
      <div class="bots-vs-speed-lines"></div>
      <div class="bots-vs-split">
        <div class="bots-vs-panel bots-vs-left">
          <div class="bots-vs-unskew">
            <div class="bots-vs-card">
              <span class="bots-vs-badge" style="background: #fbbf24; color: #0a0a0a;">DESAFIANTE</span>
              <h2 class="bots-vs-name name-player">T\u00DA</h2>
              <div class="bots-vs-player-icon">
                <span class="bots-vs-emoji-big">👧</span>
              </div>
              <p class="bots-vs-quote">«Juegas con blancas. Primer movimiento. Sin miedo.»</p>
            </div>
          </div>
        </div>
        <div class="bots-vs-panel bots-vs-right" style="--opp-color: ${bot.color};">
          <div class="bots-vs-unskew">
            <div class="bots-vs-card">
              <span class="bots-vs-badge" style="background: ${bot.color}; color: #0a0a0a;">RIVAL</span>
              <h2 class="bots-vs-name" style="text-shadow: 0 0 25px ${bot.color};">${bot.name}</h2>
              <div class="bots-vs-player-icon">
                <span class="bots-vs-emoji-big">${bot.emoji}</span>
              </div>
              <p class="bots-vs-elo" style="color: ${bot.color}; font-size: 1.15rem; font-weight: 800;">Stockfish ELO ${bot.elo}</p>
              <p class="bots-vs-quote" style="color: #e2e8f0;">«${bot.quotes.greeting[0]}»</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bots-vs-center">
        <div class="bots-vs-vs">VS</div>
      </div>
      <div class="bots-vs-energy"></div>
      <button class="bots-vs-skip">OMITIR <kbd>ENTER</kbd></button>
    `;

    document.body.appendChild(overlay);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        this.startGame();
      }, 350);
    };

    overlay.querySelector('.bots-vs-skip').addEventListener('click', cleanup);

    const keyHandler = (e) => {
      if (e.key === 'Enter') {
        document.removeEventListener('keydown', keyHandler);
        cleanup();
      }
    };
    document.addEventListener('keydown', keyHandler);

    setTimeout(() => {
      document.removeEventListener('keydown', keyHandler);
      cleanup();
    }, 7000);
  }

  startGame() {
    this.gameActive = true;
    this.chessFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.chessHistory = [];
    this.lastChessMove = null;
    this.selectedSquare = null;
    this.isThinking = false;
    this.capturedWhite = [];
    this.capturedBlack = [];

    const bot = this.selectedBot;
    const bl = bot.boardLight || '#e8d5b7';
    const bd = bot.boardDark || '#7c5c3e';
    const accent = bot.color;

    this.container.innerHTML = `
      <div class="bots-game-container" style="--bot-accent: ${accent}; --bot-light: ${bl}; --bot-dark: ${bd};">
        <div class="bots-game-topbar" style="border-color: ${accent}55;">
          <button class="bots-btn-resign" id="bots-btn-resign">✕</button>
          <button class="bots-btn-mute" id="bots-btn-mute" title="${this.soundEnabled ? 'Silenciar' : 'Activar sonido'}">${this.soundEnabled ? '🔊' : '🔇'}</button>
          <div class="bots-opponent-info">
            <span class="bots-opponent-emoji">${bot.emoji}</span>
            <div>
              <span class="bots-opponent-name">${bot.name}</span>
              <span class="bots-opponent-elo" style="color: ${accent};">ELO ${bot.elo}</span>
            </div>
          </div>
          <span id="bots-status">
            ¡Tu turno! Juegas con blancas.
          </span>
        </div>

        <div class="bots-game-main">
          <div class="bots-sidebar-left">
            <div class="bots-captured-section" style="border-color: ${accent}44;">
              <span class="bots-captured-label">Perdiste</span>
              <div class="bots-captured-pieces" id="bots-captured-white"></div>
            </div>
            <div class="bots-captured-section" style="border-color: ${accent}44;">
              <span class="bots-captured-label">Ganaste</span>
              <div class="bots-captured-pieces" id="bots-captured-black"></div>
            </div>
          </div>

          <div class="bots-board-wrapper">
            <div class="bots-board" id="bots-board"></div>
          </div>

          <div class="bots-sidebar-right">
            <div class="bots-comment-bubble" id="bots-comment-bubble" style="border-color: ${accent}55;">
              <div class="bots-comment-avatar">${bot.emoji}</div>
              <div class="bots-comment-content">
                <span class="bots-comment-name" style="color: ${accent};">${bot.name}</span>
                <p class="bots-comment-text" id="bots-comment-text"></p>
              </div>
            </div>
            <div class="bots-history-section">
              <div class="bots-history-header">Historial <span id="bots-move-count">· J 1</span></div>
              <div class="bots-history-list" id="bots-history"></div>
            </div>
          </div>

          <div class="bots-history-mobile" id="bots-history-mobile">
            <div class="bots-history-header">Historial <span id="bots-move-count-m">· J 1</span></div>
            <div class="bots-history-list" id="bots-history-m"></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('bots-btn-resign').addEventListener('click', () => {
      this.gameActive = false;
      this.endGame('lose', 'Te rendiste.');
    });

    document.getElementById('bots-btn-mute').addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      localStorage.setItem('martina_bots_sound', this.soundEnabled ? 'true' : 'false');
      const btn = document.getElementById('bots-btn-mute');
      if (btn) {
        btn.textContent = this.soundEnabled ? '🔊' : '🔇';
        btn.title = this.soundEnabled ? 'Silenciar' : 'Activar sonido';
      }
    });

    this.initStockfishWorker();
    this.renderChessBoard();
    this.updateStatus('¡Tu turno! Juegas con blancas.');
    this.showBotComment(this.getBotQuote('greeting'));

    this.quoteInterval = setInterval(() => {
      if (this.isThinking && this.gameActive) {
        const thinkQuote = this.getBotQuote('think');
        if (thinkQuote) this.showBotComment(thinkQuote);
      }
    }, 5000);
  }

  endGame(result, reason) {
    this.gameActive = false;
    this.destroyWorker();

    if (this.quoteInterval) {
      clearInterval(this.quoteInterval);
      this.quoteInterval = null;
    }

    if (result === 'win') {
      this.playVictory();
    } else {
      this.playDefeat();
    }

    const bot = this.selectedBot;
    const quote = result === 'win'
      ? this.getBotQuote('defeat')
      : result === 'draw'
        ? this.getBotQuote('taunt')
        : this.getBotQuote('victory');

    const resultIcon = result === 'win' ? '👑' : result === 'draw' ? '🤝' : '💀';
    const resultTitle = result === 'win' ? '¡VICTORIA!' : result === 'draw' ? 'TABLAS' : 'DERROTA';
    const resultColor = result === 'win' ? '#4ade80' : result === 'draw' ? '#fbbf24' : '#ef4444';

    const gameContainer = document.getElementById('bots-game-container');
    if (gameContainer) {
      gameContainer.innerHTML = `
        <div class="bots-result-overlay" style="border-color: ${resultColor}; box-shadow: 0 0 60px ${resultColor}22;">
          <div class="bots-result-icon">${resultIcon}</div>
          <h2 class="bots-result-title" style="color: ${resultColor};">${resultTitle}</h2>
          <p class="bots-result-reason">${reason}</p>
          <div class="bots-result-vs">
            <span class="result-player">T\u00DA</span>
            <span class="result-vs">vs</span>
            <span class="result-bot" style="color: ${bot.color};">${bot.name}</span>
          </div>
          ${quote ? `<p class="bots-result-quote">«${quote}»</p>` : ''}
          <div class="bots-result-stats">
            <div class="result-stat">
              <span>Jugadas</span>
              <strong>${this.chessHistory.length}</strong>
            </div>
            <div class="result-stat">
              <span>Capturas</span>
              <strong>${this.capturedBlack.length} - ${this.capturedWhite.length}</strong>
            </div>
          </div>
          <div class="bots-result-actions">
            <button class="bots-result-btn" id="bots-btn-replay" style="background: ${bot.color}; color: ${bot.tier === 'shadow' || bot.tier === 'queen' ? '#0a0a0a' : '#ffffff'};">Revancha</button>
            <button class="bots-result-btn secondary" id="bots-btn-choose">Elegir otro bot</button>
          </div>
        </div>
      `;

      document.getElementById('bots-btn-replay').addEventListener('click', () => {
        this.startGame();
      });
      document.getElementById('bots-btn-choose').addEventListener('click', () => {
        this.showBotSelect();
      });
    }
  }

  destroy() {
    this.gameActive = false;
    this.destroyWorker();
    if (this.quoteInterval) clearInterval(this.quoteInterval);
    if (this.botQuoteTimer) clearTimeout(this.botQuoteTimer);
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('bots-root');
    if (root) window.botsGame = new BotsGame(root);
  });
} else {
  const root = document.getElementById('bots-root');
  if (root) window.botsGame = new BotsGame(root);
}
