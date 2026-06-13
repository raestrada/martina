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
        gender: 'male',
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
        gender: 'male',
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
        gender: 'male',
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
        gender: 'female',
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
        gender: 'female',
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
        gender: 'male',
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
        gender: 'female',
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
        gender: 'female',
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
        gender: 'male',
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
    this.chessHistorySan = [];
    this.lastChessMove = null;
    this.selectedSquare = null;
    this.isThinking = false;
    this.gameActive = false;
    this.playerColor = 'w';

    this.stockfishWorker = null;
    this.stockfishReady = false;
    this._sfInitPromise = null; // shared promise, loaded once

    this.capturedWhite = [];
    this.capturedBlack = [];

    this.moveAnnotations = {};
    this.lastEval = 0;

    this.audioCtx = null;
    this.soundEnabled = localStorage.getItem('martina_bots_sound') !== 'false';
    this.voiceEnabled = localStorage.getItem('martina_bots_voice') !== 'false';
    this.musicEnabled = localStorage.getItem('martina_bots_music') !== 'false';

    this.botQuoteTimer = null;
    this.quoteInterval = null;
    this.musicInterval = null;

    this._speakQueue = null;
    this._speaking = false;
    this._lastCmtText = '';
    this.board = null;

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

  // ========== SPEECH (Web Speech API) ==========
  speak(text, gender, profile) {
    if (!this.voiceEnabled || !text || !window.speechSynthesis) return;
    if (text === this._lastSpokenText) return; // Evitar repetición consecutiva exacta
    this._lastSpokenText = text;

    if (!this._speakQueue) this._speakQueue = [];
    this._speakQueue.push({ text, gender, profile, timestamp: Date.now() });
    if (!this._speaking) this._dequeueSpeak();
  }

  _dequeueSpeak() {
    if (!this._speakQueue || this._speakQueue.length === 0 || !this.voiceEnabled) {
      this._speaking = false;
      return;
    }
    this._speaking = true;
    const { text, gender, profile, timestamp } = this._speakQueue.shift();

    // Descartar audios desfasados (con más de 5 segundos de retraso en cola)
    const age = Date.now() - (timestamp || Date.now());
    if (age > 5000) {
      this._dequeueSpeak();
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const wantFemale = gender === 'female';
    let voice = voices.find(v => v.lang.startsWith('es') && (wantFemale ? /ónica|Paulina|female/i.test(v.name) : /Jorge|Diego|male/i.test(v.name)));
    if (!voice) voice = voices.find(v => v.lang.startsWith('es'));
    if (voice) utter.voice = voice;
    const pm = {high:{p:1.8,r:1.3},fast:{p:1.0,r:1.7},low:{p:0.45,r:0.75},dry:{p:0.7,r:0.95},deep:{p:0.25,r:0.6},slow:{p:0.55,r:0.65},male:{p:0.85,r:0.95},female:{p:1.25,r:1.05}};
    const pp = pm[profile] || pm[gender==='female'?'female':'male'];
    utter.pitch = pp.p; utter.rate = pp.r; utter.volume = 0.8;
    utter.onend = () => this._dequeueSpeak();
    utter.onerror = () => { this._speaking = false; this._dequeueSpeak(); };
    speechSynthesis.speak(utter);
  }

  getSpeakProfile(botId) {
    const profiles = {
      peoncito: { gender: 'male', pitch: 'high' },
      caballo:  { gender: 'male', pitch: 'fast' },
      alfil:    { gender: 'male', pitch: 'low' },
      torreta:  { gender: 'female', pitch: 'dry' },
      reinangra:{ gender: 'female', pitch: 'high' },
      sombra:   { gender: 'male', pitch: 'slow' },
      martina:  { gender: 'female', pitch: 'female' },
      judit:    { gender: 'female', pitch: 'male' },
      sombrasuprema: { gender: 'male', pitch: 'deep' }
    };
    return profiles[botId] || { gender: 'male', pitch: 'normal' };
  }

  // ========== THEMATIC CHIPTUNE BACKGROUND MUSIC ==========
  startMusic() {
    this.stopMusic();
    if (!this.musicEnabled || !this.gameActive) return;

    let audioCtx = this._resumeAudio();
    if (!audioCtx) return;

    const bot = this.selectedBot;
    const elo = bot.elo;

    let melody = [];
    let bass = [];
    let tempo = 200; // ms per step
    let type = 'triangle'; // lead synth oscillator type

    if (elo <= 400) { // Peoncito: Comic/carnival theme
      melody = [
        523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880.00, 698.46,
        523.25, 659.25, 783.99, 659.25, 493.88, 587.33, 783.99, 587.33
      ];
      bass = [
        130.81, 130.81, 174.61, 174.61, 130.81, 130.81, 196.00, 196.00
      ];
      tempo = 200;
      type = 'triangle';
    } else if (elo <= 600) { // Caballo: Gallop
      melody = [
        440.00, 523.25, 659.25, 880.00, 659.25, 523.25,
        392.00, 493.88, 587.33, 783.99, 587.33, 493.88
      ];
      bass = [
        110.00, 110.00, 110.00, 98.00, 98.00, 98.00
      ];
      tempo = 150;
      type = 'sine';
    } else if (elo <= 800) { // Alfil: Solemn/Baroque
      melody = [
        587.33, 698.46, 880.00, 783.99, 698.46, 659.25, 587.33, 554.37,
        587.33, 659.25, 698.46, 783.99, 880.00, 698.46, 587.33, 440.00
      ];
      bass = [
        146.83, 146.83, 196.00, 196.00, 220.00, 220.00, 146.83, 146.83
      ];
      tempo = 250;
      type = 'triangle';
    } else if (elo <= 1000) { // Torreta: Italian Tarantela
      melody = [
        440.00, 493.88, 523.25, 587.33, 523.25, 493.88,
        440.00, 493.88, 523.25, 493.88, 440.00, 415.30,
        440.00, 493.88, 523.25, 659.25, 587.33, 523.25,
        493.88, 523.25, 587.33, 523.25, 493.88, 415.30
      ];
      bass = [
        110.00, 110.00, 110.00, 164.81, 164.81, 164.81,
        110.00, 110.00, 110.00, 164.81, 164.81, 164.81
      ];
      tempo = 120;
      type = 'sine';
    } else if (elo <= 1200) { // Sombra (R5): Mid-level Tension
      melody = [
        440.00, 0, 493.88, 0, 523.25, 0, 493.88, 0,
        440.00, 0, 415.30, 0, 440.00, 523.25, 659.25, 0
      ];
      bass = [
        110.00, 110.00, 123.47, 123.47, 130.81, 130.81, 123.47, 123.47
      ];
      tempo = 180;
      type = 'triangle';
    } else if (elo <= 1400) { // Reina Negra: Waltz ebbs
      melody = [
        523.25, 587.33, 622.25, 783.99, 698.46, 622.25,
        587.33, 493.88, 392.00, 493.88, 587.33, 698.46,
        622.25, 587.33, 523.25, 392.00, 0, 0
      ];
      bass = [
        130.81, 130.81, 130.81, 155.56, 155.56, 155.56,
        196.00, 196.00, 196.00, 130.81, 130.81, 130.81
      ];
      tempo = 240;
      type = 'sine';
    } else if (elo <= 1600) { // Sombra (R7): Dark Synthwave
      melody = [
        329.63, 0, 392.00, 0, 369.99, 0, 493.88, 0,
        440.00, 0, 523.25, 0, 493.88, 0, 329.63, 0
      ];
      bass = [
        82.41, 82.41, 65.41, 65.41, 73.42, 73.42, 49.00, 49.00
      ];
      tempo = 350;
      type = 'sawtooth';
    } else if (elo <= 2200) { // Martina & Judit: JRPG Battle
      melody = [
        392.00, 466.16, 587.33, 523.25, 466.16, 440.00, 392.00, 369.99,
        392.00, 440.00, 466.16, 523.25, 587.33, 783.99, 739.99, 587.33
      ];
      bass = [
        98.00, 98.00, 77.78, 77.78, 87.31, 87.31, 73.42, 73.42
      ];
      tempo = 130;
      type = 'sawtooth';
    } else { // Sombra Suprema: Cyberpunk Industrial
      melody = [
        277.18, 329.63, 311.13, 369.99, 329.63, 415.30, 369.99, 493.88,
        440.00, 554.37, 493.88, 415.30, 0, 0, 0, 0
      ];
      bass = [
        69.30, 69.30, 55.00, 55.00, 61.74, 61.74, 41.20, 41.20
      ];
      tempo = 140;
      type = 'sawtooth';
    }

    let step = 0;
    this.musicInterval = setInterval(() => {
      if (!this.gameActive || !this.musicEnabled) {
        this.stopMusic();
        return;
      }

      const now = audioCtx.currentTime;

      // 1. Kick Drum (basic beat)
      const beat = step % 4;
      if (beat === 0) {
        try {
          const kOsc = audioCtx.createOscillator();
          const kGain = audioCtx.createGain();
          kOsc.type = 'sine';
          kOsc.frequency.setValueAtTime(140, now);
          kOsc.frequency.exponentialRampToValueAtTime(30, now + 0.08);
          kGain.gain.setValueAtTime(0.2, now);
          kGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
          kOsc.connect(kGain);
          kGain.connect(audioCtx.destination);
          kOsc.start(now);
          kOsc.stop(now + 0.1);
        } catch(e) {}
      }

      // 2. Closed Hi-hat (subtle ticking)
      if (beat === 2) {
        try {
          const hOsc = audioCtx.createOscillator();
          const hGain = audioCtx.createGain();
          hOsc.type = 'square';
          hOsc.frequency.setValueAtTime(12000, now);
          hGain.gain.setValueAtTime(0.008, now);
          hGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
          hOsc.connect(hGain);
          hGain.connect(audioCtx.destination);
          hOsc.start(now);
          hOsc.stop(now + 0.05);
        } catch(e) {}
      }

      // 3. Lead melody
      const leadFreq = melody[step % melody.length];
      if (leadFreq > 0) {
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(leadFreq, now);
          
          let vol = 0.025;
          if (type === 'sawtooth') vol = 0.015;
          gain.gain.setValueAtTime(vol, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + (tempo / 1000) * 0.9);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + tempo / 1000);
        } catch(e) {}
      }

      // 4. Bass accompaniment
      const bassIndex = Math.floor(step / 2) % bass.length;
      const bassFreq = bass[bassIndex];
      if (bassFreq > 0 && step % 2 === 0) {
        try {
          const bOsc = audioCtx.createOscillator();
          const bGain = audioCtx.createGain();
          bOsc.type = 'triangle';
          bOsc.frequency.setValueAtTime(bassFreq, now);
          bGain.gain.setValueAtTime(0.035, now);
          bGain.gain.exponentialRampToValueAtTime(0.0001, now + (tempo / 1000) * 1.8);
          bOsc.connect(bGain);
          bGain.connect(audioCtx.destination);
          bOsc.start(now);
          bOsc.stop(now + (tempo / 1000) * 2);
        } catch(e) {}
      }

      step = (step + 1) % 48;
    }, tempo);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // ========== STOCKFISH INTEGRATION ==========
  _detectGameEnd(isPlayer) {
    const parts = this.chessFEN.split(' ');
    const nextTurn = parts[1] || 'w';
    if (ChessEngine.isCheckmate(this.chessFEN, nextTurn)) {
      if (isPlayer) this.endGame('win', '¡JAQUE MATE!');
      else this.endGame('lose', 'Jaque mate.');
    } else if (ChessEngine.isStalemate(this.chessFEN, nextTurn)) {
      this.endGame('draw', '¡Ahogado! Tablas.');
    }
  }

  getEngineConfig(elo) {
    if (elo <= 400) {
      return {
        limitStrength: false,
        skillLevel: 0,
        depth: 1,
        blunderRate: 0.18,
        minDelay: 800,
        maxDelay: 1800,
        searchCmd: 'go depth 1'
      };
    } else if (elo <= 600) {
      return {
        limitStrength: false,
        skillLevel: 0,
        depth: 2,
        blunderRate: 0.10,
        minDelay: 800,
        maxDelay: 2000,
        searchCmd: 'go depth 2'
      };
    } else if (elo <= 800) {
      return {
        limitStrength: false,
        skillLevel: 0,
        depth: 3,
        blunderRate: 0.06,
        minDelay: 1000,
        maxDelay: 2200,
        searchCmd: 'go depth 3'
      };
    } else if (elo <= 1000) {
      return {
        limitStrength: false,
        skillLevel: 1,
        depth: 4,
        blunderRate: 0.03,
        minDelay: 1000,
        maxDelay: 2500,
        searchCmd: 'go depth 4'
      };
    } else if (elo <= 1200) {
      return {
        limitStrength: false,
        skillLevel: 2,
        depth: 5,
        blunderRate: 0.01,
        minDelay: 1200,
        maxDelay: 2800,
        searchCmd: 'go depth 5'
      };
    } else if (elo < 1350) {
      return {
        limitStrength: false,
        skillLevel: 3,
        depth: 6,
        blunderRate: 0.0,
        minDelay: 1200,
        maxDelay: 3000,
        searchCmd: 'go depth 6'
      };
    } else if (elo >= 2600) {
      return {
        limitStrength: false,
        skillLevel: 20,
        depth: null,
        blunderRate: 0.0,
        minDelay: 0,
        maxDelay: 0,
        searchCmd: 'go movetime 1500'
      };
    } else {
      return {
        limitStrength: true,
        elo: elo,
        skillLevel: null,
        depth: null,
        blunderRate: 0.0,
        minDelay: 0,
        maxDelay: 0,
        searchCmd: 'go movetime 1200'
      };
    }
  }

  initStockfishWorker() {
    if (this._sfInitPromise) return this._sfInitPromise;

    this._sfInitPromise = new Promise((resolve, reject) => {
      this.stockfishReady = false;

      try {
        this.stockfishWorker = new Worker('/js/sf-worker.js');

        const bot = this.selectedBot;
        const config = this.getEngineConfig(bot.elo);

        this.stockfishWorker.postMessage('uci');
        this.stockfishWorker.postMessage('isready');
        
        if (config.limitStrength) {
          this.stockfishWorker.postMessage('setoption name UCI_LimitStrength value true');
          this.stockfishWorker.postMessage(`setoption name UCI_Elo value ${config.elo}`);
        } else {
          this.stockfishWorker.postMessage('setoption name UCI_LimitStrength value false');
          this.stockfishWorker.postMessage(`setoption name Skill Level value ${config.skillLevel}`);
        }

        this.stockfishReady = true;
        setTimeout(resolve, 500);

        this.stockfishWorker.onerror = () => {
          this._sfInitPromise = null;
          this.stockfishWorker = null;
          reject(new Error('Worker crashed'));
        };

      } catch (err) {
        this._sfInitPromise = null;
        reject(err);
      }
    });

    return this._sfInitPromise;
  }

  _resetStockfishForNewGame() {
    if (this.stockfishWorker && this.stockfishReady) {
      const bot = this.selectedBot;
      const config = this.getEngineConfig(bot.elo);
      
      if (config.limitStrength) {
        this.stockfishWorker.postMessage('setoption name UCI_LimitStrength value true');
        this.stockfishWorker.postMessage(`setoption name UCI_Elo value ${config.elo}`);
      } else {
        this.stockfishWorker.postMessage('setoption name UCI_LimitStrength value false');
        this.stockfishWorker.postMessage(`setoption name Skill Level value ${config.skillLevel}`);
      }
      
      this.stockfishWorker.postMessage('ucinewgame');
    }
  }

  destroyWorker() {
    if (this.stockfishWorker) {
      this.stockfishWorker.terminate();
      this.stockfishWorker = null;
    }
    this.stockfishReady = false;
  }

  triggerEngineTurn() {
    this.isThinking = true;
    const bot = this.selectedBot;
    this.updateStatus(`${bot.name} está pensando...`, 'thinking');

    if (!this.stockfishWorker || !this.stockfishReady) {
      setTimeout(() => { if (this.gameActive) this.triggerEngineTurn(); }, 300);
      return;
    }

    const config = this.getEngineConfig(bot.elo);

    // Chessbox.js exact pattern: send commands first, then onmessage
    this.stockfishWorker.postMessage(`position fen ${this.chessFEN}`);
    this.stockfishWorker.postMessage(config.searchCmd);

    const startTime = Date.now();

    this.stockfishWorker.onmessage = (e) => {
      const line = e.data;
      if (line.includes('bestmove')) {
        let move = line.split(' ')[1];
        if (move && move !== '(none)' && this.gameActive) {
          const isBlunder = Math.random() < config.blunderRate;
          if (isBlunder) {
            const botColor = this.playerColor === 'w' ? 'b' : 'w';
            const validMoves = ChessEngine.getAllLegalMoves(this.chessFEN, botColor);
            if (validMoves.length > 0) {
              const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
              move = randomMove;
            }
          }

          let delay = 0;
          if (config.minDelay > 0) {
            const elapsedTime = Date.now() - startTime;
            const targetDelay = config.minDelay + Math.random() * (config.maxDelay - config.minDelay);
            delay = Math.max(0, targetDelay - elapsedTime);
          }

          setTimeout(() => {
            if (this.gameActive) {
              this.executeChessMove(move, false);
            }
          }, delay);
        } else {
          this.isThinking = false;
          this.renderChessBoard();
          this._detectGameEnd(false);
        }
      }
    };
  }

  // ========== BOARD RENDERING ==========
  showMovePopup(uciMove) {
    if (!this.board) return;
    this.board.showPopup(uciMove, this.moveAnnotations[uciMove] || null);
  }

  renderChessBoard() {
    if (!this.board) return;
    this.board.setColors(this.selectedBot.boardLight, this.selectedBot.boardDark);
    this.board.setLastMove(this.lastChessMove?.from, this.lastChessMove?.to, this.selectedBot.color);
    this.board.render(this.chessFEN);
  }

  clearHighlights() {
    if (this.board) this.board.clearHighlights();
  }

  handleSquareClick(r, c, coord, piece) {
    const parts = this.chessFEN.split(' ');
    const turn = parts[1] || 'w';
    if (turn !== this.playerColor || this.isThinking || !this.gameActive) return;

    this.board.clearHighlights();

    if (this.selectedSquare) {
      const fromCoord = this.selectedSquare.coord;
      const uciMove = fromCoord + coord;
      const validMoves = ChessEngine.getAllLegalMoves(this.chessFEN, this.playerColor);
      const targetMove = validMoves.find(m => m.substring(0, 4) === uciMove.substring(0, 4));
      if (targetMove) {
        this.executeChessMove(targetMove, true);
        this.selectedSquare = null;
        return;
      }
      this.selectedSquare = null;
    }

    const isOwnPiece = piece && (this.playerColor === 'w' ? (piece === piece.toUpperCase()) : (piece === piece.toLowerCase()));
    if (isOwnPiece) {
      this.selectedSquare = { r, c, coord };
      this.board.setSelected(coord);
      const moves = ChessEngine.getAllLegalMoves(this.chessFEN, this.playerColor);
      this.board.showLegalMoves(moves, coord);
    }
  }

  executeChessMove(uciMove, isPlayer) {
    if (!this.gameActive) return;

    const parts = this.chessFEN.split(' ');
    const turn = parts[1] || 'w';

    this.playMove();

    const moveCategories = ChessEngine.getMoveCategory(this.chessFEN, uciMove);
    const san = ChessEngine.uciToSan(this.chessFEN, uciMove);
    this.chessHistorySan.push(san);

    // Track captured piece BEFORE executing move
    const fenParts = this.chessFEN.split(' ');
    const epSquare = fenParts[3] || '-';
    const boardBefore = ChessEngine.parseFEN(this.chessFEN);
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

    // Evaluate BEFORE move for annotation
    const evalBefore = ChessEngine.evaluateBoard(this.chessFEN, this.playerColor);

    // For opponent moves: flash from/to squares before rendering
    if (!isPlayer) {
      const fromCoord = uciMove.substring(0, 2);
      const toCoord = uciMove.substring(2, 4);
      const fromSq = document.querySelector(`#bots-board .bots-chess-sq[data-coord="${fromCoord}"]`);
      const toSq = document.querySelector(`#bots-board .bots-chess-sq[data-coord="${toCoord}"]`);
      if (fromSq) fromSq.style.boxShadow = `inset 0 0 0 0 transparent`;
      if (toSq) toSq.style.boxShadow = `inset 0 0 0 5px ${this.selectedBot.color}`;
      this.updateStatus(`${this.selectedBot.name} jugó ${san}`, 'thinking');
    }

    this.chessFEN = ChessEngine.executeMoveRaw(this.chessFEN, uciMove);
    this.lastChessMove = { from: uciMove.substring(0, 2), to: uciMove.substring(2, 4) };
    this.chessHistory.push(uciMove);

    // Validate FEN integrity (should never fail, but catches rare engine bugs)
    const boardAfter = ChessEngine.parseFEN(this.chessFEN);
    let pieceCount = 0;
    let kings = { K: 0, k: 0 };
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      if (boardAfter[r][c]) { pieceCount++; if (boardAfter[r][c] === 'K') kings.K++; if (boardAfter[r][c] === 'k') kings.k++; }
    }
    if (kings.K !== 1 || kings.k !== 1 || pieceCount < 2) {
      console.warn('FEN corruption detected after', uciMove, '- resetting board');
      this.chessFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }

    // Evaluate AFTER move and classify
    const evalAfter = ChessEngine.evaluateBoard(this.chessFEN, this.playerColor);
    const diff = isPlayer ? (evalAfter - evalBefore) : (evalBefore - evalAfter);
    this.moveAnnotations[uciMove] = this.classifyMove(diff, isPlayer, moveCategories);
    this.lastEval = evalAfter;

    // Opponent: delay render for visual tracking
    if (!isPlayer) {
      this.isThinking = true;
      // Safety: force unstick after 4s if something goes wrong
      const safetyTimer = setTimeout(() => {
        if (this.isThinking && this.gameActive) {
          console.warn('Opponent move stuck, forcing release');
          this.renderChessBoard();
          this._detectGameEnd(false);
          this.isThinking = false;
          this.updateStatus('● Tu turno', 'turn');
        }
      }, 4000);
      setTimeout(() => {
        clearTimeout(safetyTimer);
        if (!this.gameActive) return;
        this.renderChessBoard();
        this.showMovePopup(uciMove);
        this.updateHistoryDisplay();
        this.updateCapturedDisplay();
        this.updateCommentary();
        this._detectGameEnd(false);
        setTimeout(() => {
          clearTimeout(safetyTimer);
          if (!this.gameActive) return;
          this.isThinking = false;
          this.updateStatus('● Tu turno', 'turn');
        }, 300);
      }, 350);
    } else {
      requestAnimationFrame(() => {
        this.renderChessBoard();
        this.showMovePopup(uciMove);
        this.updateHistoryDisplay();
        this.updateCapturedDisplay();
        this.updateCommentary();
      });
    }

    const newParts = this.chessFEN.split(' ');
    const nextTurn = newParts[1] || 'w';

    if (ChessEngine.isCheckmate(this.chessFEN, nextTurn)) {
      if (isPlayer) {
        this.endGame('win', '¡JAQUE MATE!');
      } else {
        this.endGame('lose', 'Jaque mate.');
      }
      return;
    }

    if (ChessEngine.isStalemate(this.chessFEN, nextTurn)) {
      this.endGame('draw', '¡Ahogado! Tablas.');
      return;
    }

    if (nextTurn !== this.playerColor) {
      this.triggerEngineTurn();
      if (isPlayer && moveCategories.includes('check')) this.updateStatus('⚡ ¡Jaque!', 'check');
    } else if (isPlayer) {
      if (moveCategories.includes('check')) this.updateStatus('⚡ ¡Jaque!', 'check');
      else this.updateStatus('● Tu turno', 'turn');
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

  // ========== COMMENTATOR ==========
  classifyMove(evalDiff, isPlayer, categories) {
    const absDiff = Math.abs(evalDiff);
    const hasCapture = categories && categories.includes('capture');
    const hasCastle = categories && categories.includes('castle');
    const hasPromo = categories && categories.includes('promotion');
    const hasCheck = categories && categories.includes('check');

    // Special moves always get at least ✓
    if (hasPromo) return evalDiff > -1 ? '⭐' : '✓';
    if (hasCapture && evalDiff > 0) return '⭐';
    if (hasCapture && evalDiff > -1.5) return '✓';
    if (hasCheck) return '⭐';
    if (hasCastle) return '✓';

    if (evalDiff > 2.0) return '✨';
    if (evalDiff > 0.8) return '⭐';
    if (evalDiff > 0.2) return '✓';
    if (evalDiff > -0.2) return '';
    if (evalDiff > -0.8) return '⁉️';
    if (evalDiff > -2.0) return '❌';
    return '💀';
  }

  updateCommentary() {
    const score = ChessEngine.evaluateBoard(this.chessFEN, 'w');
    const moves = this.chessHistory.length;
    const parts = this.chessFEN.split(' ');
    const fenPieces = parts[0].replace(/[0-9\/]/g, '').length;
    const pct = fenPieces < 28 ? 'open' : fenPieces < 22 ? 'endgame' : 'midgame';

    // Eval bar
    const bar = document.getElementById('bots-eval-bar');
    const scoreEl = document.getElementById('bots-eval-score');
    const clampedScore = Math.max(-5, Math.min(5, score));
    const barPct = 50 + clampedScore * 10;
    const barColor = clampedScore > 0.3 ? '#4ade80' : clampedScore < -0.3 ? '#f87171' : '#94a3b8';

    if (bar) bar.style.width = `${Math.max(5, Math.min(95, barPct))}%`;
    if (bar) bar.style.background = barColor;
    if (scoreEl) {
      const sign = clampedScore > 0 ? '+' : '';
      scoreEl.textContent = `${sign}${clampedScore.toFixed(1)}`;
      scoreEl.style.color = barColor;
    }

    // Material count
    const updateMat = (id, big) => {
      const el = document.getElementById(id);
      if (!el) return;
      const board = ChessEngine.parseFEN(this.chessFEN);
      const vals = {p:1,n:3,b:3,r:5,q:9,k:0};
      let mat = 0;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (!p) continue;
          const v = vals[p.toLowerCase()] || 0;
          mat += p === p.toUpperCase() ? v : -v;
        }
      }
      const sign = mat > 0 ? '+' : '';
      const color = mat > 0 ? '#4ade80' : mat < 0 ? '#f87171' : '#94a3b8';
      el.textContent = big ? `⚖ ${sign}${mat}` : `⚖ ${sign}${mat}`;
      el.style.color = color;
    };
    updateMat('bots-material', false);
    updateMat('bots-material-big', true);

    // Commentary list — stack entries
    const listEl = document.getElementById('bots-commentator-list');
    if (!listEl) return;

    let comment;
    if (moves < 4) {
      comment = 'Apertura. Desarrolla caballos y alfiles al centro.';
    } else if (moves < 8) {
      comment = 'Controla el centro con peones. Prepara el enroque.';
    } else if (moves < 14) {
      if (clampedScore > 0.8) comment = 'Buena apertura. Ventaja de desarrollo.';
      else if (clampedScore < -0.8) comment = 'Apertura pasiva. Necesitas activar tus piezas.';
      else comment = 'Apertura sólida. Posición equilibrada.';
    } else if (pct === 'endgame') {
      if (clampedScore > 1.5) comment = 'Final ganador. Activa el rey y empuja peones pasados.';
      else if (clampedScore > 0.3) comment = 'Final favorable. Simplifica hacia la victoria.';
      else if (clampedScore < -0.3) comment = 'Final inferior. Busca el empate con precisión.';
      else comment = 'Final igualado. Oposición y triangulación.';
    } else {
      if (clampedScore > 2) comment = 'Ventaja decisiva. Busca el ataque al rey enemigo.';
      else if (clampedScore > 0.8) comment = 'Buena posición. Controla columnas abiertas.';
      else if (clampedScore > 0.3) comment = 'Ligera ventaja. Mejora tus piezas lentamente.';
      else if (clampedScore < -0.3) comment = 'Tu rival presiona. Defensa sólida, busca contrajuego.';
      else if (clampedScore < -0.8) comment = 'Posición inferior. No te rindas, espera el error rival.';
      else if (clampedScore < -2) comment = 'Desventaja crítica. Intenta complicar la posición.';
      else comment = 'Equilibrio. Planea tu estrategia a largo plazo.';
    }

    // Add last move annotation
    const lastMove = this.chessHistory.length > 0 ? this.chessHistory[this.chessHistory.length-1] : null;
    const lastAnn = lastMove ? this.moveAnnotations[lastMove] : null;
    if (lastAnn) {
      const names = {'✨':'Brillante','⭐':'Genial','✓':'Buena','⁉️':'Imprecisión','❌':'Error','💀':'Gaffe'};
      comment += `  ${lastAnn}`;
    }

    // Determine who just moved (opponent move = bot, player move = player)
    const totalMoves = this.chessHistory.length;
    const isOpponent = totalMoves % 2 === 0; // even = black/opponent just moved
    const author = isOpponent ? this.selectedBot.name : 'Jugador';
    const color = isOpponent ? this.selectedBot.color : '#67e8f9';

    // Create entry and prepend to top (newest first)
    const entry = document.createElement('div');
    entry.className = 'bots-cmt-entry';
    entry.innerHTML = `<span class="bots-cmt-author" style="color:${color}">${author}</span> <span class="bots-cmt-text">${comment}</span>`;
    listEl.insertBefore(entry, listEl.firstChild);

    // Limit entries
    while (listEl.children.length > 25) {
      listEl.removeChild(listEl.lastChild);
    }

    // Speak commentator — opposite gender to opponent (skip duplicates)
    if (isOpponent && this.selectedBot) {
      if (comment !== this._lastCmtText) {
        this._lastCmtText = comment;
        const p = this.getSpeakProfile(this.selectedBot.id);
        const cmtGender = p.gender === 'female' ? 'male' : 'female';
        this.speak(comment, cmtGender, 'normal');
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
    // Speak with bot's voice
    if (this.selectedBot) {
      const p = this.getSpeakProfile(this.selectedBot.id);
      this.speak(quote, p.gender, p.pitch);
    }
  }

  updateStatus(msg, type) {
    const el = document.getElementById('bots-status');
    if (!el) return;
    el.textContent = msg;
    if (type === 'thinking') {
      el.style.background = 'rgba(251, 191, 36, 0.2)';
      el.style.color = '#fbbf24';
    } else if (type === 'check') {
      el.style.background = 'rgba(239, 68, 68, 0.18)';
      el.style.color = '#f87171';
    } else {
      el.style.background = 'rgba(74, 222, 128, 0.12)';
      el.style.color = '#4ade80';
    }
  }

  updateHistoryDisplay() {
    const annColors = { '✨': '#60a5fa', '⭐': '#4ade80', '✓': '#86efac', '⁉️': '#fbbf24', '❌': '#fca5a5', '💀': '#f87171' };
    const buildHist = (containerId, moveCountId) => {
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = '';
      for (let i = 0; i < this.chessHistory.length; i += 2) {
        const plUci = this.chessHistory[i] || '';
        const oppUci = this.chessHistory[i + 1] || '';
        const plSan = this.chessHistorySan[i] || plUci;
        const oppSan = this.chessHistorySan[i + 1] || oppUci;
        const plAnn = this.moveAnnotations[plUci] || '';
        const oppAnn = this.moveAnnotations[oppUci] || '';
        const line = document.createElement('div');
        line.className = 'bots-hist-row';
        line.innerHTML = `<span class="bots-hist-num">${Math.floor(i/2)+1}.</span>`
          + `<span class="bots-hist-move">${plSan}</span>`
          + (plAnn ? `<span class="bots-hist-ann" style="color:${annColors[plAnn] || '#94a3b8'}">${plAnn}</span>` : '<span class="bots-hist-ann"></span>')
          + `<span class="bots-hist-move opp">${oppSan}</span>`
          + (oppAnn ? `<span class="bots-hist-ann" style="color:${annColors[oppAnn] || '#94a3b8'}">${oppAnn}</span>` : '<span class="bots-hist-ann"></span>');
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
    const pieceMap = {
      K: 'wK', Q: 'wQ', R: 'wR', B: 'wB', N: 'wN', P: 'wP',
      k: 'bK', q: 'bQ', r: 'bR', b: 'bB', n: 'bN', p: 'bP'
    };
    if (wEl) {
      wEl.innerHTML = '';
      this.capturedWhite.forEach(p => {
        const img = document.createElement('img');
        img.src = `/assets/img/pieces/${pieceMap[p]}.svg`;
        img.className = 'bots-cap-img';
        wEl.appendChild(img);
      });
    }
    if (bEl) {
      bEl.innerHTML = '';
      this.capturedBlack.forEach(p => {
        const img = document.createElement('img');
        img.src = `/assets/img/pieces/${pieceMap[p]}.svg`;
        img.className = 'bots-cap-img';
        bEl.appendChild(img);
      });
    }
    const wLabel = document.getElementById('bots-captured-white-label');
    const bLabel = document.getElementById('bots-captured-black-label');
    if (wLabel) wLabel.style.display = this.capturedWhite.length > 0 ? 'none' : '';
    if (bLabel) bLabel.style.display = this.capturedBlack.length > 0 ? 'none' : '';
  }

  // ========== UI ==========
  showBotSelect() {
    this.selectedBot = null;
    this.gameActive = false;
    this.stopMusic();

    const stats = this._getStats();

    this.container.innerHTML = `
      <section class="bots-hero fade-in">
        <h1>Bots de Ajedrez</h1>
        <p class="bots-hero-subtitle">Enfréntate a los personajes del Reino de las 64 Casillas.<br>Cada bot tiene su propia personalidad, frases absurdas y nivel de juego.</p>
        ${stats.total > 0 ? `
        <div class="bots-dashboard-container">
          <div class="bots-stats-main-grid">
            <!-- Card 1: Resumen General -->
            <div class="bots-stat-box box-primary">
              <span class="box-label">Resumen General</span>
              <div class="general-stats-layout">
                <div class="stat-hero-col">
                  <span class="hero-label">Total Jugadas</span>
                  <div class="hero-number">${stats.total}</div>
                </div>
                <div class="stat-details-col">
                  <div class="detail-pill pill-win">
                    <span class="pill-dot"></span>
                    <span class="pill-label">Ganadas</span>
                    <span class="pill-val">${stats.wins}</span>
                  </div>
                  <div class="detail-pill pill-loss">
                    <span class="pill-dot"></span>
                    <span class="pill-label">Perdidas</span>
                    <span class="pill-val">${stats.losses}</span>
                  </div>
                  <div class="detail-pill pill-draw">
                    <span class="pill-dot"></span>
                    <span class="pill-label">Tablas</span>
                    <span class="pill-val">${stats.draws}</span>
                  </div>
                </div>
              </div>
              <div class="box-progress-wrapper">
                <div class="progress-info-row">
                  <span class="progress-label">Efectividad de Victoria</span>
                  <span class="progress-percentage">${stats.winRate}%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" style="width: ${stats.winRate}%;"></div>
                </div>
              </div>
            </div>
            
            <!-- Card 2: Estadísticas por Color -->
            <div class="bots-stat-box box-colors">
              <span class="box-label">Rendimiento por Color</span>
              <div class="color-stats-split">
                <!-- Blancas -->
                <div class="color-column white-theme-col">
                  <div class="color-header-badge">
                    <span class="color-badge-icon">⚪</span>
                    <span class="color-badge-text">Blancas</span>
                  </div>
                  <div class="color-metrics-list">
                    <div class="color-metric-row">
                      <span>Partidas:</span>
                      <strong>${stats.totalWhite}</strong>
                    </div>
                    <div class="color-metric-row">
                      <span>Récord:</span>
                      <strong class="color-record-text">
                        <span class="txt-win">${stats.winsWhite}G</span>
                        <span class="txt-sep">/</span>
                        <span class="txt-loss">${stats.lossesWhite}P</span>
                      </strong>
                    </div>
                    <div class="color-metric-row">
                      <span>Efectividad:</span>
                      <strong class="color-rate-text text-white-rate">${stats.winRateWhite}%</strong>
                    </div>
                  </div>
                </div>
                
                <div class="color-stat-divider"></div>
                
                <!-- Negras -->
                <div class="color-column black-theme-col">
                  <div class="color-header-badge">
                    <span class="color-badge-icon">⚫</span>
                    <span class="color-badge-text">Negras</span>
                  </div>
                  <div class="color-metrics-list">
                    <div class="color-metric-row">
                      <span>Partidas:</span>
                      <strong>${stats.totalBlack}</strong>
                    </div>
                    <div class="color-metric-row">
                      <span>Récord:</span>
                      <strong class="color-record-text">
                        <span class="txt-win">${stats.winsBlack}G</span>
                        <span class="txt-sep">/</span>
                        <span class="txt-loss">${stats.lossesBlack}P</span>
                      </strong>
                    </div>
                    <div class="color-metric-row">
                      <span>Efectividad:</span>
                      <strong class="color-rate-text text-black-rate">${stats.winRateBlack}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Card 3: Análisis de Combates -->
            <div class="bots-stat-box box-insights">
              <span class="box-label">Análisis de Combates</span>
              <div class="insights-list">
                <div class="insight-row">
                  <span class="insight-label-with-icon">📊 Elo Promedio Rivales</span>
                  <strong class="insight-value-highlight">${stats.averageElo}</strong>
                </div>
                <div class="insight-row">
                  <span class="insight-label-with-icon">⚖️ Rango de Elos</span>
                  <strong class="insight-value-highlight">${stats.lowestEloPlayed} - ${stats.highestEloPlayed}</strong>
                </div>
                <div class="insight-row">
                  <span class="insight-label-with-icon">🔥 Rival más Frecuente</span>
                  <strong class="insight-value-highlight">${stats.mostPlayed}</strong>
                </div>
                ${stats.bestWin ? `
                <div class="best-win-card">
                  <div class="best-win-header">
                    <span class="gold-trophy">🏆</span>
                    <span class="best-win-title">Mejor Victoria</span>
                  </div>
                  <div class="best-win-body">
                    <span class="best-win-opp">vs ${stats.bestWin.botName}</span>
                    <span class="best-win-elo">ELO ${stats.bestWin.botElo}</span>
                  </div>
                </div>` : ''}
              </div>
            </div>
          </div>
        </div>` : ''}
      </section>
      <section class="bots-grid-section fade-in stagger-1">
        <div class="bots-grid" id="bots-grid"></div>
      </section>
    `;

    const grid = document.getElementById('bots-grid');
    this.bots.forEach((bot, idx) => {
      const difficulty = bot.elo < 800 ? 'Principiante' : bot.elo < 1400 ? 'Intermedio' : bot.elo < 2000 ? 'Avanzado' : 'Experto';
      const diffColor = bot.elo < 800 ? '#4ade80' : bot.elo < 1400 ? '#fbbf24' : bot.elo < 2000 ? '#f97316' : '#ef4444';
      const br = stats.byBot[bot.id];
      const recordHTML = br ? `<div class="bot-card-record"><span style="color:#4ade80">${br.wins}G</span> <span style="color:#f87171">${br.losses}P</span> <span style="color:#fbbf24">${br.draws}T</span></div>` : '';

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
          ${recordHTML}
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
    this.stopVSIntroMusic();
    const ctx = this._resumeAudio();
    if (!ctx || !this.soundEnabled) return;

    // Metal dramático chiptune rápido al estilo Street Fighter / Guilty Gear
    const melody = [
      329.63, 329.63, 392.00, 329.63, 440.00, 329.63, 493.88, 440.00,
      329.63, 329.63, 392.00, 329.63, 369.99, 392.00, 329.63, 0
    ];
    const bass = [
      82.41, 82.41, 82.41, 82.41, 65.41, 65.41, 73.42, 73.42
    ];
    const tempo = 120; // 120ms (muy rápido!)

    let step = 0;
    this.vsMusicInterval = setInterval(() => {
      const now = ctx.currentTime;

      // Doble bombo acelerado
      const beat = step % 4;
      if (beat === 0 || beat === 2) {
        try {
          const kOsc = ctx.createOscillator();
          const kGain = ctx.createGain();
          kOsc.type = 'sine';
          kOsc.frequency.setValueAtTime(150, now);
          kOsc.frequency.exponentialRampToValueAtTime(35, now + 0.08);
          kGain.gain.setValueAtTime(0.28, now);
          kGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
          kOsc.connect(kGain);
          kGain.connect(ctx.destination);
          kOsc.start(now);
          kOsc.stop(now + 0.1);
        } catch(e) {}
      }

      // Caja (snare) en tiempo 2
      if (beat === 2) {
        try {
          const sOsc = ctx.createOscillator();
          const sGain = ctx.createGain();
          sOsc.type = 'triangle';
          sOsc.frequency.setValueAtTime(320, now);
          sGain.gain.setValueAtTime(0.12, now);
          sGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
          sOsc.connect(sGain);
          sGain.connect(ctx.destination);
          sOsc.start(now);
          sOsc.stop(now + 0.08);
        } catch(e) {}
      }

      // Melodía principal estilo guitarra metalera distorsionada
      const leadFreq = melody[step % melody.length];
      if (leadFreq > 0) {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(leadFreq, now);
          gain.gain.setValueAtTime(0.024, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
        } catch(e) {}
      }

      // Bajo pesado y constante
      const bassIndex = Math.floor(step / 2) % bass.length;
      const bassFreq = bass[bassIndex];
      if (bassFreq > 0 && step % 2 === 0) {
        try {
          const bOsc = ctx.createOscillator();
          const bGain = ctx.createGain();
          bOsc.type = 'triangle';
          bOsc.frequency.setValueAtTime(bassFreq, now);
          bGain.gain.setValueAtTime(0.045, now);
          bGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
          bOsc.connect(bGain);
          bGain.connect(ctx.destination);
          bOsc.start(now);
          bOsc.stop(now + 0.24);
        } catch(e) {}
      }

      step++;
    }, tempo);
  }

  stopVSIntroMusic() {
    if (this.vsMusicInterval) {
      clearInterval(this.vsMusicInterval);
      this.vsMusicInterval = null;
    }
  }

  playFightSound() {
    const ctx = this._resumeAudio();
    if (!ctx || !this.soundEnabled) return;
    try {
      const now = ctx.currentTime;
      // Gong metálico agudo estilo pelea
      const note1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      note1.type = 'sawtooth';
      note1.frequency.setValueAtTime(880, now);
      note1.frequency.linearRampToValueAtTime(1200, now + 0.1);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      note1.connect(gain1);
      gain1.connect(ctx.destination);
      note1.start(now);
      note1.stop(now + 0.4);

      // Impacto de caída de graves pesado
      const note2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      note2.type = 'sine';
      note2.frequency.setValueAtTime(80, now);
      note2.frequency.exponentialRampToValueAtTime(25, now + 0.4);
      gain2.gain.setValueAtTime(0.35, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      note2.connect(gain2);
      gain2.connect(ctx.destination);
      note2.start(now);
      note2.stop(now + 0.5);
    } catch(e) {}
  }

  playAnnouncerVoice(text) {
    if (!this.soundEnabled || !window.speechSynthesis) return;
    try {
      speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      let voice = voices.find(v => v.lang.startsWith('es') && /Jorge|Diego|male/i.test(v.name));
      if (!voice) voice = voices.find(v => v.lang.startsWith('es'));
      if (voice) utter.voice = voice;
      utter.pitch = 0.35; // Muy grave estilo presentador de pelea
      utter.rate = 0.85;  // Imponente y pausado
      utter.volume = 1.0;
      speechSynthesis.speak(utter);
    } catch(e) {}
  }

  showVSIntro(botIdx) {
    const bot = this.bots[botIdx];
    this.selectedBot = bot;
    this.playerColor = Math.random() < 0.5 ? 'w' : 'b';

    this._resumeAudio();
    this.playVSIntroMusic();
    this.playAnnouncerVoice(`¡Nuevo combate! ¿Preparados?`);

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
              <span class="bots-vs-badge" style="background: ${this.playerColor === 'w' ? '#fbbf24' : '#1e293b'}; color: ${this.playerColor === 'w' ? '#0a0a0a' : '#ffffff'};">${this.playerColor === 'w' ? 'BLANCAS' : 'NEGRAS'}</span>
              <h2 class="bots-vs-name name-player">Jugador</h2>
              <div class="bots-vs-player-icon">
                <span class="bots-vs-emoji-big">${this.playerColor === 'w' ? '♔' : '♚'}</span>
              </div>
              <p class="bots-vs-quote">«Juegas con ${this.playerColor === 'w' ? 'blancas. Primer movimiento.' : 'negras. El oponente inicia.'}»</p>
            </div>
          </div>
        </div>
        <div class="bots-vs-panel bots-vs-right" style="--opp-color: ${bot.color};">
          <div class="bots-vs-unskew">
            <div class="bots-vs-card">
              <span class="bots-vs-badge" style="background: ${bot.color}; color: #0a0a0a;">${this.playerColor === 'w' ? 'NEGRAS' : 'BLANCAS'}</span>
              <h2 class="bots-vs-name" style="text-shadow: 0 0 25px ${bot.color};">${bot.name}</h2>
              <div class="bots-vs-player-icon">
                <span class="bots-vs-emoji-big">${bot.emoji}</span>
              </div>
              <p class="bots-vs-elo" style="color: ${bot.color}; font-size: 1.15rem; font-weight: 800;">Stockfish ELO ${bot.elo} (${this.playerColor === 'w' ? 'NEGRAS' : 'BLANCAS'})</p>
              <p class="bots-vs-quote" style="color: #e2e8f0;">«${bot.quotes.greeting[0]}»</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bots-vs-center">
        <div class="bots-vs-vs">VS</div>
        <div class="bots-vs-ready-text">READY?</div>
      </div>
      <div class="bots-vs-energy"></div>
      <button class="bots-vs-skip-epic">
        ¡A PELEAR! <kbd>ENTER</kbd>
      </button>
    `;

    document.body.appendChild(overlay);

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      
      this.stopVSIntroMusic();
      this.playFightSound();
      this.playAnnouncerVoice("¡A luchar!");
      
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        this.startGame();
      }, 350);
    };

    overlay.querySelector('.bots-vs-skip-epic').addEventListener('click', cleanup);

    const keyHandler = (e) => {
      if (e.key === 'Enter') {
        document.removeEventListener('keydown', keyHandler);
        cleanup();
      }
    };
    document.addEventListener('keydown', keyHandler);
  }

  startGame() {
    // Clean up review board interval if running
    if (this._reviewData && this._reviewData.interval) {
      clearInterval(this._reviewData.interval);
      this._reviewData.interval = null;
      this._reviewData.playing = false;
    }

    this.gameActive = true;
    this.chessFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.chessHistory = [];
    this.chessHistorySan = [];
    this.lastChessMove = null;
    this.selectedSquare = null;
    this.isThinking = false;
    this.capturedWhite = [];
    this.capturedBlack = [];
    this.moveAnnotations = {};
    this.lastEval = 0;

    // Always render game immediately. Stockfish loads in background.
    this._renderGameUI();
    this.startMusic();

    // Load Stockfish (or reset if already loaded)
    if (this.stockfishReady) {
      this._resetStockfishForNewGame();
      if (this.playerColor === 'b') {
        this.triggerEngineTurn();
      }
    } else {
      this.initStockfishWorker().then(() => {
        if (this.playerColor === 'b' && this.gameActive) {
          this.triggerEngineTurn();
        }
      }).catch(err => {
        console.warn('Stockfish init failed:', err.message);
        // Show error in UI
        this.updateStatus('⚠️ Error: ' + err.message, 'check');
      });
    }
  }

  _renderGameUI() {
    const bot = this.selectedBot;
    const bl = bot.boardLight || '#e8d5b7';
    const bd = bot.boardDark || '#7c5c3e';
    const accent = bot.color;

    this.container.innerHTML = `
      <div class="bots-game-container" id="bots-game-container" style="--bot-accent: ${accent}; --bot-light: ${bl}; --bot-dark: ${bd};">
        <div class="bots-game-topbar" style="border-color: ${accent}55;">
          <button class="bots-btn-resign" id="bots-btn-resign">✕</button>
          <button class="bots-btn-mute" id="bots-btn-mute" title="${this.soundEnabled ? 'Silenciar' : 'Activar sonido'}">${this.soundEnabled ? '🔊' : '🔇'}</button>
          <button class="bots-btn-mute" id="bots-btn-voice" title="${this.voiceEnabled ? 'Silenciar voz' : 'Activar voz'}">${this.voiceEnabled ? '🗣️' : '🔈'}</button>
          <button class="bots-btn-mute" id="bots-btn-music" title="${this.musicEnabled ? 'Silenciar música' : 'Activar música'}">${this.musicEnabled ? '🎵' : '🔇🎵'}</button>
          <div class="bots-opponent-info">
            <span class="bots-opponent-emoji">${bot.emoji}</span>
            <div>
              <span class="bots-opponent-name">${bot.name}</span>
              <span class="bots-opponent-elo" style="color: ${accent};">ELO ${bot.elo}</span>
            </div>
          </div>
          <span id="bots-status">
            ${this.playerColor === 'w' ? '● Tu turno (Blancas) ♔' : `${bot.name} piensa (Blancas) ♔`}
          </span>
        </div>

        <div class="bots-game-main">
          <div class="bots-sidebar-left">
            <div class="bots-captured-section" style="border-color: ${accent}44;">
              <span class="bots-captured-label" id="bots-captured-white-label">Perdiste</span>
              <div class="bots-captured-pieces" id="bots-captured-white"></div>
            </div>
            <div class="bots-captured-section" style="border-color: ${accent}44;">
              <span class="bots-captured-label" id="bots-captured-black-label">Ganaste</span>
              <div class="bots-captured-pieces" id="bots-captured-black"></div>
            </div>
            <div class="bots-material-badge" id="bots-material-badge">
              <span id="bots-material-big">⚖ 0</span>
            </div>
            <div class="bots-commentator" id="bots-commentator" style="border-color: ${accent}44;">
              <div class="bots-commentator-header">
                <span>🎙️ Comentarista</span>
                <span style="display:flex;gap:8px;">
                  <span id="bots-material">⚖ 0</span>
                  <span id="bots-eval-score" style="color: #4ade80;">+0.0</span>
                </span>
              </div>
              <div class="bots-eval-bar-container">
                <div class="bots-eval-bar-fill" id="bots-eval-bar" style="width:50%;"></div>
              </div>
              <div class="bots-commentator-list" id="bots-commentator-list"></div>
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

    document.getElementById('bots-btn-voice').addEventListener('click', () => {
      this.voiceEnabled = !this.voiceEnabled;
      localStorage.setItem('martina_bots_voice', this.voiceEnabled ? 'true' : 'false');
      if (!this.voiceEnabled) {
        if (window.meSpeak) meSpeak.stop();
        speechSynthesis.cancel();
        this._speakQueue = [];
        this._speaking = false;
      }
      const btn = document.getElementById('bots-btn-voice');
      if (btn) {
        btn.textContent = this.voiceEnabled ? '🗣️' : '🔈';
        btn.title = this.voiceEnabled ? 'Silenciar voz' : 'Activar voz';
      }
    });

    document.getElementById('bots-btn-music').addEventListener('click', () => {
      this.musicEnabled = !this.musicEnabled;
      localStorage.setItem('martina_bots_music', this.musicEnabled ? 'true' : 'false');
      const btn = document.getElementById('bots-btn-music');
      if (btn) {
        btn.textContent = this.musicEnabled ? '🎵' : '🔇🎵';
        btn.title = this.musicEnabled ? 'Silenciar música' : 'Activar música';
      }
      if (this.musicEnabled) {
        this.startMusic();
      } else {
        this.stopMusic();
      }
    });

    // Initialize shared chess board
    this.board = new ChessBoard({
      containerId: 'bots-board',
      squareClass: 'bots-chess-sq',
      pieceClass: 'bots-chess-pc',
      popupClass: 'bots-popup',
      playerColor: this.playerColor,
      lightColor: bl, darkColor: bd,
      onSquareClick: (r, c, coord, piece) => this.handleSquareClick(r, c, coord, piece)
    });

    this.renderChessBoard();
    if (this.playerColor === 'w') {
      this.updateStatus('● Tu turno (Blancas)', 'turn');
    } else {
      this.updateStatus(`${bot.name} piensa (Blancas)...`, 'thinking');
    }
    this.updateCommentary();
    this.showBotComment(this.getBotQuote('greeting'));

    this.quoteInterval = setInterval(() => {
      if (this.isThinking && this.gameActive) {
        const thinkQuote = this.getBotQuote('think');
        if (thinkQuote) this.showBotComment(thinkQuote);
      }
    }, 5000);
  }

  endGame(result, reason) {
    // Prevent duplicate calls
    if (!this.gameActive) return;
    this.gameActive = false;

    // Detener voces activas y vaciar la cola de reproducción para evitar audios desfasados
    if (window.speechSynthesis) {
      speechSynthesis.cancel();
    }
    this._speakQueue = [];
    this._speaking = false;
    this._lastSpokenText = '';
    this.stopMusic();

    // Cancel any pending opponent move timers
    this.isThinking = false;
    this.destroyWorker();

    if (this.quoteInterval) {
      clearInterval(this.quoteInterval);
      this.quoteInterval = null;
    }

    if (result === 'win') this.playVictory();
    else if (result === 'lose') this.playDefeat();

    const bot = this.selectedBot;
    const quote = result === 'win'
      ? this.getBotQuote('defeat')
      : result === 'draw'
        ? this.getBotQuote('taunt')
        : this.getBotQuote('victory');

    // --- Performance analysis ---
    const annNames = {'✨':'Brillante','⭐':'Genial','✓':'Buena','⁉️':'Imprecisión','❌':'Error','💀':'Gaffe'};
    const playerAnns = { '✨':0, '⭐':0, '✓':0, '⁉️':0, '❌':0, '💀':0 };
    let totalPlayerMoves = 0;
    for (let i = 0; i < this.chessHistory.length; i += 2) {
      const m = this.chessHistory[i];
      if (m) {
        totalPlayerMoves++;
        const a = this.moveAnnotations[m];
        if (a && playerAnns[a] !== undefined) playerAnns[a]++;
      }
    }
    const good = playerAnns['✨'] + playerAnns['⭐'] + playerAnns['✓'];
    const bad = playerAnns['⁉️'] + playerAnns['❌'] + playerAnns['💀'];
    const accuracy = totalPlayerMoves > 0 ? Math.round((good / totalPlayerMoves) * 100) : 100;

    // --- ELO estimation ---
    let perfElo = bot.elo;
    if (result === 'win') perfElo = Math.min(3000, bot.elo + 150 + accuracy * 2);
    else if (result === 'lose') perfElo = Math.max(100, bot.elo - 250 + accuracy * 2);
    else perfElo = bot.elo - 50 + accuracy * 2;

    // --- Build summary lines ---
    let summaryHTML = '';
    if (playerAnns['💀'] > 0) summaryHTML += `<span style="color:#f87171">${playerAnns['💀']} gaffes 💀</span> `;
    if (playerAnns['❌'] > 0) summaryHTML += `<span style="color:#fca5a5">${playerAnns['❌']} errores</span> `;
    if (playerAnns['⁉️'] > 0) summaryHTML += `<span style="color:#fbbf24">${playerAnns['⁉️']} imprecisiones</span> `;
    if (playerAnns['⭐'] > 0) summaryHTML += `<span style="color:#4ade80">${playerAnns['⭐']} geniales ⭐</span> `;
    if (playerAnns['✓'] > 0) summaryHTML += `<span style="color:#86efac">${playerAnns['✓']} buenas</span>`;
    if (!summaryHTML) summaryHTML = 'Juego sólido sin imprecisiones.';

    const resultIcon = result === 'win' ? '👑' : result === 'draw' ? '🤝' : '😞';
    const resultTitle = result === 'win' ? '¡VICTORIA!' : result === 'draw' ? 'TABLAS' : 'DERROTA';
    const resultColor = result === 'win' ? '#4ade80' : result === 'draw' ? '#fbbf24' : '#ef4444';

    const gameContainer = document.getElementById('bots-game-container');
    if (!gameContainer) return;

    gameContainer.innerHTML = `
      <div class="bots-result-overlay" style="border-color: ${resultColor}; box-shadow: 0 0 60px ${resultColor}22;">
        <div class="bots-result-top">
          <span class="bots-result-icon">${resultIcon}</span>
          <h2 class="bots-result-title" style="color: ${resultColor};">${resultTitle}</h2>
          <span class="bots-result-reason">${reason}</span>
        </div>

        <div class="bots-result-body">
          <div class="bots-result-board-col">
            <div class="bots-review-board-wrap">
              <div id="bots-review-board" class="bots-review-board"></div>
            </div>
            <div class="bots-review-controls">
              <button class="bots-review-btn" data-action="first" title="Inicio">⏮</button>
              <button class="bots-review-btn" data-action="prev" title="Anterior">◀</button>
              <button class="bots-review-btn" data-action="play" title="Reproducir">▶</button>
              <button class="bots-review-btn" data-action="next" title="Siguiente">▶</button>
              <button class="bots-review-btn" data-action="last" title="Final">⏭</button>
            </div>
          </div>

          <div class="bots-result-info-col">
            <div class="bots-result-vs">
              <span class="result-player">Jugador</span>
              <span class="result-vs">vs</span>
              <span class="result-bot" style="color: ${bot.color};">${bot.name} (${bot.elo})</span>
            </div>
            ${quote ? `<p class="bots-result-quote">«${quote}»</p>` : ''}

            <div class="bots-result-stats">
              <div class="result-stat">
                <span>Jugadas</span>
                <strong>${this.chessHistory.length}</strong>
              </div>
              <div class="result-stat">
                <span>Capturas</span>
                <strong>${this.capturedBlack.length}-${this.capturedWhite.length}</strong>
              </div>
              <div class="result-stat">
                <span>Precisión</span>
                <strong style="color:${accuracy >= 70 ? '#4ade80' : accuracy >= 40 ? '#fbbf24' : '#f87171'}">${accuracy}%</strong>
              </div>
            </div>

            <div class="bots-result-elo">
              <span>ELO estimado</span>
              <strong style="color:${resultColor};">${perfElo}</strong>
            </div>

            <div class="bots-result-summary">${summaryHTML}</div>

            <div class="bots-result-move-info">
              <span class="bots-review-move-num">Jugada 0</span>
              <span class="bots-review-move-san">Posición Inicial</span>
            </div>

            <div class="bots-review-moves" id="bots-review-moves"></div>

            <div class="bots-result-actions">
              <button class="bots-result-btn" id="bots-btn-replay" style="background: ${bot.color}; color: ${bot.tier === 'shadow' || bot.tier === 'queen' ? '#0a0a0a' : '#fff'};">Revancha</button>
              <button class="bots-result-btn secondary" id="bots-btn-choose">Elegir otro bot</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('bots-btn-replay').addEventListener('click', () => this.startGame());
    document.getElementById('bots-btn-choose').addEventListener('click', () => this.showBotSelect());

    // Initialize game review board
    this._initReviewBoard(bot);

    // Save game result
    this._saveGameResult(result, bot, accuracy, perfElo);
  }

  _initReviewBoard(bot) {
    const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    // Reconstruct full FEN history from UCI moves
    const reviewHistory = [{ fen: START_FEN, uci: '', san: 'Posición Inicial' }];
    let fen = START_FEN;
    for (const uci of this.chessHistory) {
      const san = ChessEngine.uciToSan(fen, uci);
      fen = ChessEngine.executeMoveRaw(fen, uci);
      reviewHistory.push({ fen, uci, san });
    }

    this._reviewData = {
      history: reviewHistory,
      step: 0,
      playing: false,
      interval: null
    };

    // Create ChessBoard instance
    const perspective = this.playerColor;
    this._reviewBoard = new ChessBoard({
      containerId: 'bots-review-board',
      squareClass: 'bots-chess-sq',
      pieceClass: 'bots-chess-pc',
      lightColor: bot.boardLight || '#dbeafe',
      darkColor: bot.boardDark || '#1e4d8c',
      playerColor: perspective
    });

    // Build moves list with annotations
    this._buildReviewMoves();

    // Render initial position
    this._reviewGoToStep(0);

    // Bind controls
    this._bindReviewControls();
  }

  _buildReviewMoves() {
    const movesEl = document.getElementById('bots-review-moves');
    if (!movesEl) return;
    movesEl.innerHTML = '';

    const history = this._reviewData.history;
    for (let i = 1; i < history.length; i += 2) {
      const moveNum = Math.ceil(i / 2);
      const row = document.createElement('div');
      row.className = 'bots-review-move-row';
      row.innerHTML = `<span class="bots-review-move-number">${moveNum}.</span>`;

      // White move
      const wMove = history[i];
      const wAnn = this.moveAnnotations[wMove.uci] || '';
      const wSpan = document.createElement('span');
      wSpan.className = 'bots-review-move-item';
      wSpan.setAttribute('data-step', i);
      wSpan.innerHTML = `${wMove.san}<span class="bots-review-move-ann" style="color:${this._annColor(wAnn)}">${wAnn}</span>`;
      wSpan.addEventListener('click', () => {
        this._reviewPause();
        this._reviewGoToStep(i);
      });
      row.appendChild(wSpan);

      // Black move
      if (i + 1 < history.length) {
        const bMove = history[i + 1];
        const bAnn = this.moveAnnotations[bMove.uci] || '';
        const bSpan = document.createElement('span');
        bSpan.className = 'bots-review-move-item';
        bSpan.setAttribute('data-step', i + 1);
        bSpan.innerHTML = `${bMove.san}<span class="bots-review-move-ann" style="color:${this._annColor(bAnn)}">${bAnn}</span>`;
        bSpan.addEventListener('click', () => {
          this._reviewPause();
          this._reviewGoToStep(i + 1);
        });
        row.appendChild(bSpan);
      }

      movesEl.appendChild(row);
    }

    // Scroll to bottom
    movesEl.scrollTop = movesEl.scrollHeight;
  }

  _annColor(ann) {
    const colors = { '✨': '#60a5fa', '⭐': '#4ade80', '✓': '#86efac', '⁉️': '#fbbf24', '❌': '#fca5a5', '💀': '#f87171' };
    return colors[ann] || '#94a3b8';
  }

  _reviewGoToStep(idx) {
    const data = this._reviewData;
    if (idx < 0 || idx >= data.history.length) return;
    data.step = idx;

    const step = data.history[idx];

    if (idx > 0 && step.uci) {
      const from = step.uci.substring(0, 2);
      const to = step.uci.substring(2, 4);
      this._reviewBoard.setLastMove(from, to, '#fbbf24');
    } else {
      this._reviewBoard._lastMove = null;
      this._reviewBoard.clearHighlights();
    }
    this._reviewBoard.render(step.fen);

    // Update move info
    const numEl = document.querySelector('.bots-review-move-num');
    const sanEl = document.querySelector('.bots-review-move-san');
    if (numEl) {
      if (idx === 0) numEl.textContent = 'Posición Inicial';
      else {
        const moveNum = Math.ceil(idx / 2);
        const colorName = (idx % 2 === 1) ? 'Blancas' : 'Negras';
        numEl.textContent = `Jugada ${moveNum} (${colorName})`;
      }
    }
    if (sanEl) sanEl.textContent = step.san;

    // Highlight active move in list
    const allItems = document.querySelectorAll('.bots-review-move-item');
    allItems.forEach(el => el.classList.remove('active'));
    if (idx > 0) {
      const activeEl = document.querySelector(`.bots-review-move-item[data-step="${idx}"]`);
      if (activeEl) {
        activeEl.classList.add('active');
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }

  _bindReviewControls() {
    const btns = document.querySelectorAll('.bots-review-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        const data = this._reviewData;
        switch (action) {
          case 'first':
            this._reviewPause();
            this._reviewGoToStep(0);
            break;
          case 'prev':
            this._reviewPause();
            if (data.step > 0) this._reviewGoToStep(data.step - 1);
            break;
          case 'play':
            this._reviewTogglePlay();
            break;
          case 'next':
            this._reviewPause();
            if (data.step < data.history.length - 1) this._reviewGoToStep(data.step + 1);
            break;
          case 'last':
            this._reviewPause();
            this._reviewGoToStep(data.history.length - 1);
            break;
        }
      });
    });

    // Fix next button icon
    const nextBtn = document.querySelector('.bots-review-btn[data-action="next"]');
    if (nextBtn) nextBtn.textContent = '👉';
  }

  _reviewTogglePlay() {
    const data = this._reviewData;
    if (data.playing) {
      this._reviewPause();
    } else {
      if (data.step >= data.history.length - 1) this._reviewGoToStep(0);
      data.playing = true;
      const btn = document.querySelector('.bots-review-btn[data-action="play"]');
      if (btn) { btn.textContent = '⏸'; btn.classList.add('playing'); }
      data.interval = setInterval(() => {
        if (data.step < data.history.length - 1) {
          this._reviewGoToStep(data.step + 1);
        } else {
          this._reviewPause();
        }
      }, 1200);
    }
  }

  _reviewPause() {
    const data = this._reviewData;
    if (!data.playing) return;
    data.playing = false;
    if (data.interval) {
      clearInterval(data.interval);
      data.interval = null;
    }
    const btn = document.querySelector('.bots-review-btn[data-action="play"]');
    if (btn) { btn.textContent = '▶'; btn.classList.remove('playing'); }
  }

  _saveGameResult(result, bot, accuracy, perfElo) {
    try {
      let history = JSON.parse(localStorage.getItem('martina_bots_history') || '[]');
      history.push({
        result: result,
        botId: bot.id,
        botName: bot.name,
        botElo: bot.elo,
        accuracy: accuracy,
        perfElo: perfElo,
        playerColor: this.playerColor,
        moves: this.chessHistory.length,
        date: Date.now()
      });
      // Keep last 100 games
      if (history.length > 100) history = history.slice(-100);
      localStorage.setItem('martina_bots_history', JSON.stringify(history));
    } catch(e) {}
  }

  _getStats() {
    try {
      const history = JSON.parse(localStorage.getItem('martina_bots_history') || '[]');
      const stats = {
        total: history.length,
        wins: 0,
        losses: 0,
        draws: 0,
        bestWin: null,
        byBot: {},
        
        // White vs Black stats
        totalWhite: 0,
        winsWhite: 0,
        lossesWhite: 0,
        drawsWhite: 0,
        
        totalBlack: 0,
        winsBlack: 0,
        lossesBlack: 0,
        drawsBlack: 0,
        
        // ELO metrics
        totalEloPlayed: 0,
        highestEloPlayed: 0,
        lowestEloPlayed: 9999,
        
        // Most played
        botPlayCounts: {}
      };

      history.forEach(g => {
        const isWin = g.result === 'win';
        const isLoss = g.result === 'lose';
        const isDraw = !isWin && !isLoss;

        if (isWin) stats.wins++;
        else if (isLoss) stats.losses++;
        else stats.draws++;

        // Track by color perspective (fallback to 'w' if undefined for old games)
        const col = g.playerColor || 'w';
        if (col === 'w') {
          stats.totalWhite++;
          if (isWin) stats.winsWhite++;
          else if (isLoss) stats.lossesWhite++;
          else stats.drawsWhite++;
        } else {
          stats.totalBlack++;
          if (isWin) stats.winsBlack++;
          else if (isLoss) stats.lossesBlack++;
          else stats.drawsBlack++;
        }

        // ELO tracking
        const elo = parseInt(g.botElo) || 0;
        stats.totalEloPlayed += elo;
        if (elo > stats.highestEloPlayed) stats.highestEloPlayed = elo;
        if (elo < stats.lowestEloPlayed) stats.lowestEloPlayed = elo;

        // Best win
        if (isWin && (!stats.bestWin || elo > stats.bestWin.botElo)) {
          stats.bestWin = g;
        }

        // Most played bot tracking
        stats.botPlayCounts[g.botId] = (stats.botPlayCounts[g.botId] || 0) + 1;

        // Per-bot stats
        if (!stats.byBot[g.botId]) stats.byBot[g.botId] = { wins: 0, losses: 0, draws: 0 };
        if (isWin) stats.byBot[g.botId].wins++;
        else if (isLoss) stats.byBot[g.botId].losses++;
        else stats.byBot[g.botId].draws++;
      });

      stats.winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;
      stats.winRateWhite = stats.totalWhite > 0 ? Math.round((stats.winsWhite / stats.totalWhite) * 100) : 0;
      stats.winRateBlack = stats.totalBlack > 0 ? Math.round((stats.winsBlack / stats.totalBlack) * 100) : 0;
      stats.averageElo = stats.total > 0 ? Math.round(stats.totalEloPlayed / stats.total) : 0;
      
      if (stats.lowestEloPlayed === 9999) stats.lowestEloPlayed = 0;

      // Find most played bot name/emoji
      let mostPlayedId = null;
      let maxCount = 0;
      for (const bid in stats.botPlayCounts) {
        if (stats.botPlayCounts[bid] > maxCount) {
          maxCount = stats.botPlayCounts[bid];
          mostPlayedId = bid;
        }
      }
      if (mostPlayedId) {
        const matchingBot = this.bots.find(b => b.id === mostPlayedId);
        stats.mostPlayed = matchingBot ? `${matchingBot.emoji} ${matchingBot.name}` : mostPlayedId;
      } else {
        stats.mostPlayed = 'Ninguno';
      }

      return stats;
    } catch(e) {
      return { 
        total: 0, wins: 0, losses: 0, draws: 0, winRate: 0, byBot: {},
        totalWhite: 0, winsWhite: 0, lossesWhite: 0, drawsWhite: 0, winRateWhite: 0,
        totalBlack: 0, winsBlack: 0, lossesBlack: 0, drawsBlack: 0, winRateBlack: 0,
        averageElo: 0, highestEloPlayed: 0, lowestEloPlayed: 0, mostPlayed: 'Ninguno'
      };
    }
  }

  destroy() {
    this.gameActive = false;
    this.destroyWorker();
    this.stopMusic();
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
