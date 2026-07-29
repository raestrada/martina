// js/cursos.js — Lógica de la sección de Cursos y locución interactiva con Martina
(function() {
  'use strict';

  // Base de datos de lecciones para "La Defensa Checa" con Torreta
  const CHECH_COURSE = {
    id: 'defensa-checa',
    title: 'La Defensa Checa',
    subtitle: 'El Escudo de Piedra de Torreta contra e4, d4 y aperturas irregulares',
    perspective: 'b', // Perspectiva de Negras por defecto
    modules: [
      {
        id: 'mod-0',
        title: '1. Filosofía del Escudo',
        kicker: 'Módulo 1: Introducción',
        heading: '¡Bienvenido a la cocina de la Defensa Checa!',
        speech: '<p>¡Hola! Soy <strong>Torreta</strong>. En la casilla c3 preparo empanadas temáticas de ajedrez, pero mi verdadera especialidad es la <strong>Defensa Checa</strong> (<span class="move-pill">1...d6</span>, <span class="move-pill">2...Nf6</span>, <span class="move-pill">3...c6</span>).</p><p>He visto miles de aperturas y muy pocos finales, y si algo sé, es que un buen escudo de peones es como una torre de piedra: crujiente por fuera, rocoso por dentro e <strong>impenetrable para el rival</strong>.</p>',
        pgn: '1. e4 d6 2. d4 Nf6 3. Nc3 c6',
        highlightMove: 'c6',
        martinaQuote: '«Para preparar un buen ataque primero necesitas una masa firme que nadie pueda romper desde el centro».',
        points: [
          '<strong>Estructura rocosa:</strong> La combinación d6 + c6 + Nf6 es sólida e impenetrable.',
          '<strong>Sistema universal:</strong> Se puede jugar contra casi cualquier apertura blanca.',
          '<strong>Contragolpe activo:</strong> Prepara rupturas crujientes con ...b5 o la clavada de dama en a5.'
        ]
      },
      {
        id: 'mod-1',
        title: '2. Contra 1. e4',
        kicker: 'Módulo 2: Frente al Peón de Rey',
        heading: 'Cocinando la respuesta frente a 1. e4',
        speech: '<p>Cuando las blancas abren con <span class="move-pill">1. e4</span> buscando un juego ruidoso, nosotros servimos <span class="move-pill">1...d6</span> sin inmutarnos.</p><p>Cuando avanzan <span class="move-pill">2. d4</span> ocupando el centro, provocamos a su peón con <span class="move-pill">2...Nf6</span>. Y en cuanto defienden con <span class="move-pill">3. Nc3</span>, cerramos la receta con <span class="move-pill">3...c6</span>. ¡Controlamos la casilla d5 y preparamos la expansión b5 en el flanco de dama!</p>',
        pgn: '1. e4 d6 2. d4 Nf6 3. Nc3 c6',
        highlightMove: 'c6',
        martinaQuote: '«No intentes cocinar rápido. Deja que el rival avance sus peones mientras tú montas la masa del contragolpe».',
        points: [
          '<strong>1. e4 d6:</strong> Evitamos la teoría cargada y obligamos al blanco a jugar nuestro terreno.',
          '<strong>2. d4 Nf6:</strong> Presionamos el peón e4 sin arriesgar piezas.',
          '<strong>3. Nc3 c6:</strong> Bloqueamos saltos a d5 y preparamos la expansión por el flanco de dama.'
        ]
      },
      {
        id: 'mod-2',
        title: '3. Contra 1. d4',
        kicker: 'Módulo 3: Frente al Peón de Dama',
        heading: 'Provocando el avance 3. d5 con 2...c5',
        speech: '<p>Frente a <span class="move-pill">1. d4</span>, la teoría cambia de ingrediente. Tras <span class="move-pill">1. d4 Nf6 2. c4</span>, lanzamos el contragolpe <span class="move-pill">2...c5!</span> atacando directamente el peón de d4.</p><p>¿Por qué las blancas quedan <strong>OBLIGADAS</strong> a avanzar <span class="move-pill">3. d5</span>? Porque si comieran <span class="move-pill">3. dxc5?</span>, responderíamos <span class="move-pill">3...e6!</span>. Liberamos el alfil negro, recuperamos c5 de inmediato y tomamos el centro. Para no regalar la ventaja, las blancas DEBEN jugar <span class="move-pill">3. d5</span>. ¡Y al obligarlas a jugar d5, cerramos el centro con <span class="move-pill">3...e5</span> sellando nuestro Escudo de Piedra!</p>',
        pgn: '1. d4 Nf6 2. c4 c5 3. d5 e5',
        highlightMove: 'e5',
        martinaQuote: '«Si el blanco come en c5, nos regala el centro y activa nuestro alfil con 3...e6. Por eso están obligados a avanzar a d5, donde cerramos la puerta con 3...e5».',
        points: [
          '<strong>1. d4 Nf6 2. c4 c5:</strong> Atacamos el peón d4 desde la jugada 2.',
          '<strong>¿Por qué no 3. dxc5?:</strong> Porque 3...e6! activa el alfil, recupera el peón y nos da un centro superior.',
          '<strong>3. d5 e5:</strong> Las blancas quedan obligadas a avanzar. Respondemos 3...e5 cerrando el centro en una fortaleza de piedra.'
        ]
      },
      {
        id: 'mod-3',
        title: '4. Sin e4 ni d4',
        kicker: 'Módulo 4: Aperturas de Flanco',
        heading: 'Dominando la Inglesa (1. c4) y la Réti (1. Nf3)',
        speech: '<p>¿Qué pasa si las blancas no juegan ni <span class="move-pill">1. e4</span> ni <span class="move-pill">1. d4</span>, sino que abren desde las alas con <span class="move-pill">1. c4</span> (Inglesa) o <span class="move-pill">1. Nf3</span> (Réti)?</p><p>¡Atención a la regla de oro! Cuando el rival no ocupa el centro con un peón en la jugada 1, aprovechamos y tomamos el centro de inmediato con <span class="move-pill">1...e5!</span> (Siciliana Invertida). Luego reforzamos con <span class="move-pill">2...Nf6</span> y <span class="move-pill">3...d6</span>. Al adueñarnos del centro mientras ellos mueven por los costados, nuestra posición queda sólida como una roca.</p>',
        pgn: '1. c4 e5 2. Nc3 Nf6 3. g3 d6',
        highlightMove: 'd6',
        martinaQuote: '«Si las blancas no ocupan el centro en el primer movimiento, nos regalan el espacio. Tomamos el centro con 1...e5 y armamos nuestra fortaleza».',
        points: [
          '<strong>Contra 1. c4 (Inglesa):</strong> Respondemos 1...e5! tomando el centro directamente.',
          '<strong>Estructura e5 + d6 + Nf6:</strong> Garantiza control central, seguridad para el rey y desarrollo natural.',
          '<strong>Contra 1. Nf3 (Réti):</strong> Respondemos 1...d5 o 1...Nf6 para tomar espacio y evitar restricciones.'
        ]
      },
      {
        id: 'mod-4',
        title: '5. Ataque 4. f4 (Qa5!)',
        kicker: 'Módulo 5: El Ataque Austríaco',
        heading: 'La Clavada de Dama contra 4. f4',
        speech: '<p>Frente a la agresiva <span class="move-pill">4. f4</span> (Ataque Austríaco) donde las blancas quieren aplastarnos con un centro de 3 peones, respondemos con la letal clavada <span class="move-pill">4...Qa5!</span>.</p><p>Clavamos el caballo de c3 a su rey en e1. Si el blanco juega descuidado (<span class="move-pill">5. Nf3?</span>), castigamos con <span class="move-pill">5...Nxe4!</span> ganando el peón por la clavada. Por eso las blancas deben jugar <span class="move-pill">5. Bd3</span>, y nosotros golpeamos en el centro con <span class="move-pill">5...e5!</span>.</p>',
        pgn: '1. e4 d6 2. d4 Nf6 3. Nc3 c6 4. f4 Qa5 5. Bd3 e5',
        highlightMove: 'e5',
        martinaQuote: '«¡Una clavada en el momento justo es el ingrediente secreto! 4...Qa5 congela al caballo c3 y paraliza al blanco».',
        points: [
          '<strong>4. f4 Qa5!:</strong> Clavada directa en la diagonal a5-e1 aprovechando que el rey blanco no se ha enrocado.',
          '<strong>Aprovechar descuidos:</strong> Si juegan 5. Nf3?, ganamos el peón e4 con 5...Nxe4! ya que el caballo c3 no puede capturar.',
          '<strong>5. Bd3 e5!:</strong> Obligamos a defender e4 y contraatacamos el centro.'
        ]
      },
      {
        id: 'mod-5',
        title: '6. Línea Clásica 4. Nf3',
        kicker: 'Módulo 6: Desarrollo Clásico',
        heading: 'La Clavada de Alfil contra 4. Nf3',
        speech: '<p>Si las blancas eligen el desarrollo clásico con <span class="move-pill">4. Nf3</span>, nosotros aplicamos la clavada de alfil con <span class="move-pill">4...Bg4!</span>.</p><p>Clavamos su caballo de f3, que es el principal defensor de su peón central de d4. Si intentan expulsar al alfil con <span class="move-pill">5. h3</span>, mantenemos la clavada retirándonos a <span class="move-pill">5...Bh5</span>. Desarrollamos nuestras piezas con total armonía (<span class="move-pill">...Nbd7</span>, <span class="move-pill">...e5</span>) sin debilidades en nuestra posición.</p>',
        pgn: '1. e4 d6 2. d4 Nf6 3. Nc3 c6 4. Nf3 Bg4 5. h3 Bh5',
        highlightMove: 'Bh5',
        martinaQuote: '«Inmovilizar al defensor principal del centro blanco nos da el control de la cocina sin despeinarnos».',
        points: [
          '<strong>4. Nf3 Bg4!:</strong> Clavamos al defensor clave del centro blanco.',
          '<strong>5. h3 Bh5:</strong> Mantenemos la presión sin regalar la pareja de alfiles.',
          '<strong>Desarrollo armónico:</strong> Seguimos con Nbd7 y e5 garantizando igualdad total.'
        ]
      },
      {
        id: 'mod-6',
        title: '7. Fianchetto 4. g3',
        kicker: 'Módulo 7: Esquema de Fianchetto',
        heading: 'El Contragolpe Central contra 4. g3',
        speech: '<p>Si las blancas juegan <span class="move-pill">4. g3</span> para sacar su alfil por g2, aplicamos el contragolpe central inmediato <span class="move-pill">4...e5!</span>.</p><p>Si cambian damas (<span class="move-pill">5. dxe5 dxe5 6. Qxd8+ Kxd8</span>), entramos a un final igualado donde su alfil de g2 queda chocado contra su propio peón de e4. Y si desarrollan <span class="move-pill">5. Nf3</span>, reforzamos con <span class="move-pill">5...Nbd7</span> armando una posición sólida como roca.</p>',
        pgn: '1. e4 d6 2. d4 Nf6 3. Nc3 c6 4. g3 e5 5. Nf3 Nbd7',
        highlightMove: 'Nbd7',
        martinaQuote: '«Cuando el alfil blanco se fianchetta en g2, choca directo contra nuestra masa de peones. El centro queda bajo nuestro dominio».',
        points: [
          '<strong>4. g3 e5!:</strong> Golpe central directo antes de que el alfil blanco se ubique en g2.',
          '<strong>Final favorable:</strong> Si cambian damas, su alfil g2 queda bloqueado por peones.',
          '<strong>5. Nf3 Nbd7:</strong> Desarrollo sólido y armónico del Escudo Checo.'
        ]
      }
    ]
  };

  class CourseController {
    constructor(courseData) {
      this.course = courseData;
      this.currentModuleIdx = 0;
      this.board = null;
      this.speechSynth = window.speechSynthesis || null;
      this.currentUtterance = null;
      this.isPlayingAudio = false;

      this.init();
    }

    init() {
      // 1. Render Step Pills
      this.renderPills();

      // 2. Init ChessBoard
      this.initBoard();

      // 3. Bind UI Buttons
      this.bindEvents();

      // 4. Load First Module
      this.loadModule(0);
    }

    renderPills() {
      const pillsContainer = document.getElementById('course-step-pills');
      if (!pillsContainer) return;
      pillsContainer.innerHTML = '';

      this.course.modules.forEach((mod, idx) => {
        const pill = document.createElement('button');
        pill.className = `step-pill${idx === 0 ? ' active' : ''}`;
        pill.textContent = mod.title;
        pill.setAttribute('data-idx', idx);
        pill.addEventListener('click', () => {
          this.stopAudio();
          this.loadModule(idx);
        });
        pillsContainer.appendChild(pill);
      });
    }

    initBoard() {
      const boardContainer = document.getElementById('course-board');
      if (!boardContainer) return;

      this.board = new window.ChessBoard({
        containerId: 'course-board',
        squareClass: 'chess-sq',
        pieceClass: 'chess-pc',
        lightColor: '#dfd0b8',
        darkColor: '#3c5c4e',
        playerColor: this.course.perspective || 'b',
        onSquareClick: (r, c, coord, piece) => {
          this.handleSquareClick(r, c, coord, piece);
        }
      });
    }

    bindEvents() {
      const btnPrev = document.getElementById('course-btn-prev');
      const btnNext = document.getElementById('course-btn-next');
      const btnAudio = document.getElementById('btn-audio-speak');
      const btnFlip = document.getElementById('board-flip-btn');

      if (btnPrev) {
        btnPrev.addEventListener('click', () => {
          if (this.currentModuleIdx > 0) {
            this.stopAudio();
            this.loadModule(this.currentModuleIdx - 1);
          }
        });
      }

      if (btnNext) {
        btnNext.addEventListener('click', () => {
          if (this.currentModuleIdx < this.course.modules.length - 1) {
            this.stopAudio();
            this.loadModule(this.currentModuleIdx + 1);
          }
        });
      }

      if (btnAudio) {
        btnAudio.addEventListener('click', () => {
          this.toggleAudio();
        });
      }

      if (btnFlip) {
        btnFlip.addEventListener('click', () => {
          this.board.playerColor = this.board.playerColor === 'w' ? 'b' : 'w';
          if (this.currentHistory && this.currentHistory[this.currentMoveHistoryIdx]) {
            this.board.render(this.currentHistory[this.currentMoveHistoryIdx].fen);
          }
        });
      }

      // Step Move Controls (Paso a Paso de la Variante)
      const btnStart = document.getElementById('btn-step-start');
      const btnStepPrev = document.getElementById('btn-step-prev');
      const btnStepPlay = document.getElementById('btn-step-play');
      const btnStepNext = document.getElementById('btn-step-next');
      const btnEnd = document.getElementById('btn-step-end');

      if (btnStart) btnStart.addEventListener('click', () => { this.stopMoveAutoPlay(); this.goToMoveIdx(0); });
      if (btnStepPrev) btnStepPrev.addEventListener('click', () => { this.stopMoveAutoPlay(); this.goToMoveIdx(this.currentMoveHistoryIdx - 1); });
      if (btnStepPlay) btnStepPlay.addEventListener('click', () => { this.toggleMoveAutoPlay(); });
      if (btnStepNext) btnStepNext.addEventListener('click', () => { this.stopMoveAutoPlay(); this.goToMoveIdx(this.currentMoveHistoryIdx + 1); });
      if (btnEnd) btnEnd.addEventListener('click', () => { this.stopMoveAutoPlay(); this.goToMoveIdx(this.currentHistory ? this.currentHistory.length - 1 : 0); });
    }

    loadModule(idx) {
      this.currentModuleIdx = idx;
      const mod = this.course.modules[idx];

      // Update pills
      const pills = document.querySelectorAll('.step-pill');
      pills.forEach((p, pIdx) => {
        p.classList.toggle('active', pIdx === idx);
        if (pIdx < idx) p.classList.add('completed');
      });

      // Update progress fill
      const fill = document.getElementById('course-progress-fill');
      if (fill) {
        const pct = ((idx + 1) / this.course.modules.length) * 100;
        fill.style.width = `${pct}%`;
      }

      // Update text fields
      const kickerEl = document.getElementById('course-kicker');
      const headingEl = document.getElementById('course-heading');
      const speechTextEl = document.getElementById('course-speech-text');
      const quoteEl = document.getElementById('course-quote');
      const pointsListEl = document.getElementById('course-points-list');

      if (kickerEl) kickerEl.textContent = mod.kicker;
      if (headingEl) headingEl.textContent = mod.heading;
      if (speechTextEl) speechTextEl.innerHTML = mod.speech;

      if (quoteEl) {
        if (mod.martinaQuote) {
          quoteEl.style.display = 'block';
          quoteEl.textContent = mod.martinaQuote;
        } else {
          quoteEl.style.display = 'none';
        }
      }

      if (pointsListEl && mod.points) {
        pointsListEl.innerHTML = mod.points.map(pt => `<li>${pt}</li>`).join('');
      }

      // Update Board position from PGN
      this.currentHistory = window.ChessEngine.playPGN(mod.pgn);
      this.renderMovesList(this.currentHistory);
      this.stopMoveAutoPlay();
      this.goToMoveIdx(this.currentHistory.length - 1);

      // Quiz mode handling
      const quizBox = document.getElementById('quiz-box');
      const quizFeedback = document.getElementById('quiz-feedback');
      if (quizBox) {
        if (mod.isQuiz) {
          quizBox.style.display = 'block';
          const promptEl = document.getElementById('quiz-prompt-text');
          if (promptEl) promptEl.textContent = mod.quizPrompt;
          if (quizFeedback) quizFeedback.className = 'quiz-feedback';
        } else {
          quizBox.style.display = 'none';
        }
      }

      // Update Prev / Next buttons
      const btnPrev = document.getElementById('course-btn-prev');
      const btnNext = document.getElementById('course-btn-next');
      if (btnPrev) btnPrev.disabled = idx === 0;
      if (btnNext) {
        btnNext.disabled = idx === this.course.modules.length - 1;
        btnNext.textContent = idx === this.course.modules.length - 1 ? '¡Completado! 🎉' : 'Siguiente →';
      }
    }

    goToMoveIdx(historyIdx) {
      if (!this.currentHistory || this.currentHistory.length === 0) return;
      if (historyIdx < 0) historyIdx = 0;
      if (historyIdx >= this.currentHistory.length) historyIdx = this.currentHistory.length - 1;

      this.currentMoveHistoryIdx = historyIdx;
      const state = this.currentHistory[historyIdx];

      if (state.uci) {
        const from = state.uci.substring(0, 2);
        const to = state.uci.substring(2, 4);
        this.board.setLastMove(from, to, '#fbbf24');
      } else {
        this.board._lastMove = null;
        this.board.clearHighlights();
      }

      this.board.render(state.fen);

      // Update Move Chips
      const chips = document.querySelectorAll('.course-move-chip');
      chips.forEach((c, cIdx) => {
        c.classList.toggle('active', cIdx === historyIdx - 1);
      });

      // Update Step Button Disabled States
      const btnStart = document.getElementById('btn-step-start');
      const btnStepPrev = document.getElementById('btn-step-prev');
      const btnStepNext = document.getElementById('btn-step-next');
      const btnEnd = document.getElementById('btn-step-end');

      if (btnStart) btnStart.disabled = historyIdx === 0;
      if (btnStepPrev) btnStepPrev.disabled = historyIdx === 0;
      if (btnStepNext) btnStepNext.disabled = historyIdx === this.currentHistory.length - 1;
      if (btnEnd) btnEnd.disabled = historyIdx === this.currentHistory.length - 1;
    }

    toggleMoveAutoPlay() {
      if (this.moveAutoPlayTimer) {
        this.stopMoveAutoPlay();
      } else {
        this.startMoveAutoPlay();
      }
    }

    startMoveAutoPlay() {
      this.stopMoveAutoPlay();
      if (!this.currentHistory || this.currentHistory.length <= 1) return;

      if (this.currentMoveHistoryIdx >= this.currentHistory.length - 1) {
        this.goToMoveIdx(0);
      }

      const btnPlay = document.getElementById('btn-step-play');
      if (btnPlay) btnPlay.textContent = '⏸️';

      this.moveAutoPlayTimer = setInterval(() => {
        if (this.currentMoveHistoryIdx < this.currentHistory.length - 1) {
          this.goToMoveIdx(this.currentMoveHistoryIdx + 1);
        } else {
          this.stopMoveAutoPlay();
        }
      }, 900);
    }

    stopMoveAutoPlay() {
      if (this.moveAutoPlayTimer) {
        clearInterval(this.moveAutoPlayTimer);
        this.moveAutoPlayTimer = null;
      }
      const btnPlay = document.getElementById('btn-step-play');
      if (btnPlay) btnPlay.textContent = '▶️';
    }

    renderMovesList(history) {
      const container = document.getElementById('course-moves-list');
      if (!container) return;
      container.innerHTML = '';

      for (let i = 1; i < history.length; i++) {
        const item = document.createElement('li');
        const isWhite = i % 2 === 1;
        const moveNum = Math.ceil(i / 2);
        item.className = `course-move-chip${i === history.length - 1 ? ' active' : ''}`;
        item.textContent = isWhite ? `${moveNum}. ${history[i].san}` : history[i].san;

        item.addEventListener('click', () => {
          this.board.render(history[i].fen);
          if (history[i].uci) {
            this.board.setLastMove(history[i].uci.substring(0, 2), history[i].uci.substring(2, 4), '#fbbf24');
            this.board.render(history[i].fen);
          }
          document.querySelectorAll('.course-move-chip').forEach(el => el.classList.remove('active'));
          item.classList.add('active');
        });

        container.appendChild(item);
      }
    }

    // TTS Speech Engine
    toggleAudio() {
      if (this.isPlayingAudio) {
        this.stopAudio();
      } else {
        this.playAudio();
      }
    }

    playAudio() {
      if (!this.speechSynth) {
        alert('Tu navegador no soporta reproducción de voz.');
        return;
      }

      this.stopAudio();

      const mod = this.course.modules[this.currentModuleIdx];
      const textToRead = `${mod.heading}. ${mod.speech}`;

      this.currentUtterance = new SpeechSynthesisUtterance(textToRead);
      this.currentUtterance.lang = 'es-ES';
      this.currentUtterance.pitch = 0.9; // Voz de Torreta: más calmada, firme y serena
      this.currentUtterance.rate = 0.96;

      // Buscar voz en español si está disponible
      const voices = this.speechSynth.getVoices();
      const esVoice = voices.find(v => v.lang.startsWith('es'));
      if (esVoice) this.currentUtterance.voice = esVoice;

      this.currentUtterance.onend = () => {
        this.setAudioState(false);
      };

      this.currentUtterance.onerror = () => {
        this.setAudioState(false);
      };

      this.speechSynth.speak(this.currentUtterance);
      this.setAudioState(true);
    }

    stopAudio() {
      if (this.speechSynth && this.speechSynth.speaking) {
        this.speechSynth.cancel();
      }
      this.setAudioState(false);
    }

    setAudioState(isPlaying) {
      this.isPlayingAudio = isPlaying;
      const btn = document.getElementById('btn-audio-speak');
      const label = document.getElementById('audio-btn-label');
      if (btn) {
        btn.classList.toggle('playing', isPlaying);
      }
      if (label) {
        label.textContent = isPlaying ? 'Pausar' : 'Escuchar';
      }
    }

    // Interacción en el Tablero (Mini-Quiz / Práctica)
    handleSquareClick(r, c, coord, piece) {
      const mod = this.course.modules[this.currentModuleIdx];
      if (!mod.isQuiz) return;

      if (!this.selectedSquare) {
        if (piece && piece === piece.toLowerCase()) { // Es pieza negra (turno del usuario)
          this.selectedSquare = coord;
          this.board.setSelected(coord);
        }
      } else {
        const moveUci = this.selectedSquare + coord;
        this.selectedSquare = null;
        this.board.clearHighlights();

        const feedback = document.getElementById('quiz-feedback');
        if (moveUci === mod.targetMove) {
          // Ejecutar movimiento correcto
          const currentFen = this.currentHistory[this.currentHistory.length - 1].fen;
          const nextFen = window.ChessEngine.executeMoveRaw(currentFen, moveUci);
          this.board.render(nextFen);
          this.board.setLastMove(moveUci.substring(0, 2), moveUci.substring(2, 4), '#2a9d8f');
          this.board.render(nextFen);

          if (feedback) {
            feedback.className = 'quiz-feedback success';
            feedback.textContent = mod.quizSuccessMsg;
          }
        } else {
          if (feedback) {
            feedback.className = 'quiz-feedback error';
            feedback.textContent = mod.quizErrorMsg;
          }
        }
      }
    }
  }

  // Inicializar al cargar el DOM
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('course-board')) {
      const activeCourse = window.CURRENT_COURSE_DATA || CHECH_COURSE;
      window.courseApp = new CourseController(activeCourse);
    }
  });
})();
