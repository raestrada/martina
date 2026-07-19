// js/games/puzzles.js — Chess Puzzles (Táctica) module
// Implements interactive puzzles with points, streaks, character commentary, and speech/sounds.

(function() {
  class PuzzlesGame {
    constructor() {
      // 1. Puzzle Database (8 Puzzles: 2x M1, 2x M2, 2x M3, 2x M4)
      this.puzzles = [
        {
          id: 'p1',
          difficulty: 1,
          title: 'El Mate Escolar',
          desc: 'Martina y Peoncito están estudiando la apertura. El oponente se descuidó... ¡gana de inmediato!',
          fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
          solution: ['h5f7'],
          character: 'peoncito',
          quotes: {
            greeting: '¡Mira esto! El rey oponente no se abrochó bien el cinturón. ¡Mate en uno!',
            success: '¡Eso es! ¡El pasillo quedó completamente sellado!', // M1 solved is immediate success
            fail: '¡No! Mi bigote falso se despegó del susto con esa jugada. ¡Prueba otra vez!',
            solved: '¡Excelente! Has encontrado el mate escolar perfecto.'
          }
        },
        {
          id: 'p2',
          difficulty: 1,
          title: 'El Pasillo de la Torre',
          desc: 'El rey negro se ha quedado sin salida detrás de sus propios peones. ¡Aprovecha la columna abierta!',
          fen: '3r2k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1',
          solution: ['d1d8'],
          character: 'peoncito',
          quotes: {
            greeting: '¡Mira, mira! El rey enemigo se olvidó de abrir la ventana. ¡Mate en uno!',
            success: '¡Eso es! ¡El pasillo quedó completamente sellado!',
            fail: '¡No! Le diste aire para escapar. ¡Prueba otra vez!',
            solved: '¡Gran trabajo! Los peones del oponente lo atraparon.'
          }
        },
        {
          id: 'p3',
          difficulty: 2,
          title: 'Atracción al Pasillo',
          desc: 'El oponente piensa que su dama defiende la última fila, pero puedes forzarla a deambular.',
          fen: '6k1/5ppp/q7/8/8/8/3R4/3Q2K1 w - - 0 1',
          solution: ['d2d8', 'a6d8', 'd1d8'],
          character: 'reinangra',
          quotes: {
            greeting: '¡Alergia al mate! Pero hoy te perdonaré si resuelves este mate en dos pasos.',
            success: '¡Buen movimiento! Ahora remata la última fila.',
            fail: '¡Achu! Esa jugada me da alergia de lo mala que es. ¡Prueba otra vez!',
            solved: '¡Salud! Digo, ¡gran mate en dos! La dama enemiga cayó en la trampa.'
          }
        },
        {
          id: 'p4',
          difficulty: 2,
          title: 'El Mate de la Coz',
          desc: 'Un mate espectacular donde el rey enemigo es asfixiado por sus propias piezas defensoras.',
          fen: '5r1k/5ppp/7N/8/8/2Q5/8/6K1 w - - 0 1',
          solution: ['c3g8', 'f8g8', 'h6f7'],
          character: 'caballo',
          quotes: {
            greeting: '¡Caballo de Ŋ listo! Aquí hay un salto en L genial para asfixiar al rey.',
            success: '¡Excelente! Ahora el rey no tiene escapatoria.',
            fail: 'Mmm, ese salto no fue muy L ni muy Ŋ. ¡A pensar de nuevo!',
            solved: '¡Perfecto! ¡El rey oponente quedó atrapado por sus propios guardias!'
          }
        },
        {
          id: 'p5',
          difficulty: 3,
          title: 'La Coz Completa',
          desc: 'El mate de la coz completo. Atraes al rey al rincón, sacrificas la dama y dejas al rey sin aire.',
          fen: 'r4r1k/1p3Npp/8/8/8/8/1Q3PPP/R5RK w - - 0 1',
          solution: ['f7h6', 'g8h8', 'b2g8', 'f8g8', 'h6f7'],
          character: 'alfil',
          quotes: {
            greeting: 'Alfil Exiliado reportándose. Este es un mate en tres muy geométrico. Piensa bien.',
            success: '¡Bien! El rey se esconde en la esquina. Sigue el ataque.',
            fail: 'Te desviaste de la diagonal correcta. Intenta recalcular tu posición.',
            solved: '¡Maravilloso! Diagonales, saltos y sacrificios. Una obra de arte matemática.'
          }
        },
        {
          id: 'p6',
          difficulty: 3,
          title: 'La Desviación de la Torre',
          desc: 'Desvía la pieza defensora de la octava fila sacrificando tu dama para penetrar con las torres.',
          fen: '5r1k/5ppp/8/8/8/8/4R3/Q3R2K w - - 0 1',
          solution: ['a1a8', 'f8a8', 'e1e8', 'a8e8', 'e2e8'],
          character: 'martina',
          quotes: {
            greeting: '¡Hola, soy Martina! Este es un problema muy bonito. A Judith Polgar le encantaba desviar las piezas defensoras.',
            success: '¡Buen camino! La torre enemiga fue desviada, entra con tu primera torre.',
            fail: 'Esa jugada no desvía a la torre protectora. ¡Busca una jugada que la obligue a moverse!',
            solved: '¡Mate del pasillo ejecutado con éxito! Judith estaría orgullosa de tu visión táctica.'
          }
        },
        {
          id: 'p7',
          difficulty: 4,
          title: 'El Dilema del Rey',
          desc: 'Un ataque feroz de caballo y dama. El oponente debe elegir su destino... pero ambos caminos llevan al mate.',
          fen: 'r1bq1r1k/pp4pp/2n5/2p1Np2/2B5/8/PP3PPP/R2QR1K1 w - - 0 1',
          solution: ['e5f7', 'f8f7', 'd1d8', 'c6d8', 'e1e8', 'f7f8', 'e1f8'],
          character: 'sombra',
          quotes: {
            greeting: 'Sombra del Ring aquí. La oscuridad cubre el tablero. Encuentra el mate en cuatro... si te atreves.',
            success: 'Vas por el camino correcto de la sombra. Mantén la presión.',
            fail: 'Te perdiste en la oscuridad. Vuelve a encender la luz y piensa de nuevo.',
            solved: 'Impresionante. Viste todas las variantes de la sombra. Has ganado mis respetos.'
          }
        },
        {
          id: 'p8',
          difficulty: 4,
          title: 'El Sacrificio Celestial',
          desc: 'Usa la fuerza de tu dama y torre para acorralar al rey enemigo en el borde del tablero mediante un hermoso desvío.',
          fen: 'r1b2r1k/pp3ppp/8/3N1b2/8/3B1R2/PPQ3PP/7K w - - 0 1',
          solution: ['c2h7', 'h8h7', 'f3h3', 'f5h3', 'h3h3', 'h7g8', 'd5e7'],
          character: 'reinangra',
          quotes: {
            greeting: 'La Reina Negra te desafía a un mate en cuatro. Sacrifica con elegancia celestial.',
            success: '¡Eso es! El sacrificio celestial abrió la columna. Entra con la torre.',
            fail: 'Esa jugada no tiene la fuerza celestial necesaria. ¡Vuelve a intentarlo!',
            solved: '¡Increíble! Has resuelto el mate en cuatro celestial con total maestría.'
          }
        }
      ];

      // 2. Character configuration mapping
      this.characters = {
        peoncito: { name: 'Peoncito', emoji: '♟️', gender: 'male', pitch: 'high', light: '#dbeafe', dark: '#1e4d8c' },
        reinangra: { name: 'Reina Negra', emoji: '👑', gender: 'female', pitch: 'high', light: '#f3e8ff', dark: '#581c87' },
        caballo: { name: 'Caballo de Ŋ', emoji: '🐴', gender: 'male', pitch: 'fast', light: '#dcfce7', dark: '#1a6b3c' },
        alfil: { name: 'Alfil Exiliado', emoji: '📐', gender: 'male', pitch: 'low', light: '#fef9c3', dark: '#8b6914' },
        sombra: { name: 'Sombra del Ring', emoji: '👥', gender: 'male', pitch: 'slow', light: '#f1f5f9', dark: '#334155' },
        martina: { name: 'Martina', emoji: '👧', gender: 'female', pitch: 'female', light: '#ffe4e6', dark: '#be123c' }
      };

      // State variables
      this.currentPuzzle = null;
      this.currentMoveIndex = 0;
      this.selectedSquare = null;
      this.puzzleStateFen = '';
      this.score = parseInt(localStorage.getItem('martina_puzzle_score')) || 0;
      this.streak = parseInt(localStorage.getItem('martina_puzzle_streak')) || 0;
      this.solvedList = JSON.parse(localStorage.getItem('martina_puzzle_solved')) || [];

      // Audio & Speech
      this.audioCtx = null;
      this.soundEnabled = localStorage.getItem('martina_sound_enabled') !== 'false';
      this.voiceEnabled = localStorage.getItem('martina_voice_enabled') !== 'false';
      this._speakQueue = [];
      this._speaking = false;
      this._lastSpokenText = '';

      // Initialize
      this.initDOM();
      this.initAudio();
      this.loadProgress();
      this.renderPuzzlesList();

      // Load first unsolved puzzle, or default to first
      const firstUnsolved = this.puzzles.find(p => !this.solvedList.includes(p.id)) || this.puzzles[0];
      this.loadPuzzle(firstUnsolved);
    }

    // ========== AUDIO & SOUND SYNTHESIS ==========
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

    playMoveSound() {
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

    playCaptureSound() {
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

    playCheckSound() {
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

    playVictorySound() {
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

    playDefeatSound() {
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

    // ========== SPEECH SYNTHESIS (Web Speech API) ==========
    speak(text, gender, profile) {
      if (!this.voiceEnabled || !text || !window.speechSynthesis) return;
      if (text === this._lastSpokenText) return;
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

      const pm = {
        high: { p: 1.8, r: 1.25 },
        fast: { p: 1.0, r: 1.6 },
        low: { p: 0.5, r: 0.8 },
        dry: { p: 0.7, r: 0.9 },
        slow: { p: 0.6, r: 0.7 },
        female: { p: 1.2, r: 1.0 },
        male: { p: 0.85, r: 0.95 }
      };
      const pp = pm[profile] || pm[gender === 'female' ? 'female' : 'male'];
      utter.pitch = pp.p;
      utter.rate = pp.r;
      utter.volume = 0.85;

      const safetyTimeout = setTimeout(() => {
        this._speaking = false;
        this._dequeueSpeak();
      }, 7000);

      utter.onend = () => {
        clearTimeout(safetyTimeout);
        this._speaking = false;
        this._dequeueSpeak();
      };
      utter.onerror = () => {
        clearTimeout(safetyTimeout);
        this._speaking = false;
        this._dequeueSpeak();
      };
      speechSynthesis.speak(utter);
    }

    stopSpeaking() {
      if (window.speechSynthesis) {
        speechSynthesis.cancel();
      }
      this._speakQueue = [];
      this._speaking = false;
    }

    // ========== STATE & DOM ==========
    initDOM() {
      // Bind controls
      document.getElementById('btn-reset').addEventListener('click', () => this.resetPuzzle());
      document.getElementById('btn-hint').addEventListener('click', () => this.showHint());
      document.getElementById('btn-next').addEventListener('click', () => this.loadNextPuzzle());
      document.getElementById('btn-play-voice').addEventListener('click', () => {
        this.stopSpeaking();
        if (this.currentPuzzle) {
          const char = this.characters[this.currentPuzzle.character];
          const text = document.getElementById('char-bubble').textContent.trim();
          this.speak(text, char.gender, char.pitch);
        }
      });

      const soundBtn = document.getElementById('btn-toggle-sound');
      soundBtn.textContent = `🎵 Sonido: ${this.soundEnabled ? 'Sí' : 'No'}`;
      soundBtn.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('martina_sound_enabled', this.soundEnabled);
        soundBtn.textContent = `🎵 Sonido: ${this.soundEnabled ? 'Sí' : 'No'}`;
      });

      // Chess Board
      this.board = new ChessBoard({
        containerId: 'puzzles-board',
        squareClass: 'bots-chess-sq',
        pieceClass: 'bots-chess-pc',
        playerColor: 'w',
        lightColor: '#e8d5b7',
        darkColor: '#7c5c3e',
        onSquareClick: (r, c, coord, piece) => this.handleSquareClick(r, c, coord, piece)
      });
    }

    loadProgress() {
      document.getElementById('puzzle-score').textContent = `${this.score} pts`;
      document.getElementById('puzzle-streak').textContent = this.streak;
      document.getElementById('puzzle-solved-count').textContent = `${this.solvedList.length} / ${this.puzzles.length}`;
    }

    saveProgress(earnedPoints) {
      if (earnedPoints > 0) {
        this.score += earnedPoints;
        localStorage.setItem('martina_puzzle_score', this.score);
      }
      localStorage.setItem('martina_puzzle_streak', this.streak);
      localStorage.setItem('martina_puzzle_solved', JSON.stringify(this.solvedList));
      this.loadProgress();

      // Dispatch global storage event to sync dashboard stats
      window.dispatchEvent(new Event('storage'));
    }

    renderPuzzlesList() {
      const lists = {
        1: document.getElementById('list-mate-1'),
        2: document.getElementById('list-mate-2'),
        3: document.getElementById('list-mate-3'),
        4: document.getElementById('list-mate-4')
      };

      // Clear lists
      Object.values(lists).forEach(el => { if (el) el.innerHTML = ''; });

      this.puzzles.forEach((p, idx) => {
        const item = document.createElement('div');
        const isSolved = this.solvedList.includes(p.id);
        item.className = `puzzle-select-item ${isSolved ? 'solved' : ''}`;
        item.id = `select-item-${p.id}`;
        
        item.innerHTML = `
          <span>#${idx + 1} - ${p.title}</span>
          <span class="puzzle-status-icon">${isSolved ? '✅' : '🎯'}</span>
        `;
        item.addEventListener('click', () => this.loadPuzzle(p));

        const listEl = lists[p.difficulty];
        if (listEl) listEl.appendChild(item);
      });
    }

    // ========== GAMEPLAY LOOP ==========
    loadPuzzle(puzzle) {
      this.stopSpeaking();
      this.currentPuzzle = puzzle;
      this.currentMoveIndex = 0;
      this.selectedSquare = null;
      this.puzzleStateFen = puzzle.fen;

      // Update sidebar selector active classes
      document.querySelectorAll('.puzzle-select-item').forEach(el => el.classList.remove('active'));
      const activeItem = document.getElementById(`select-item-${puzzle.id}`);
      if (activeItem) activeItem.classList.add('active');

      // Update character styling
      const char = this.characters[puzzle.character];
      document.getElementById('char-emoji').textContent = char.emoji;
      document.getElementById('char-name').textContent = char.name;
      
      // Bubble greeting
      document.getElementById('char-bubble').textContent = puzzle.quotes.greeting;
      this.speak(puzzle.quotes.greeting, char.gender, char.pitch);

      // Description & title
      document.getElementById('puzzle-title').textContent = puzzle.title;
      document.getElementById('puzzle-desc').textContent = puzzle.desc;

      // Board configuration
      this.board.setColors(char.light, char.dark);
      this.board.setLastMove(null, null);
      this.board.render(this.puzzleStateFen);
      this.board.clearHighlights();

      // Reset UI elements
      document.getElementById('btn-next').disabled = true;
      document.getElementById('puzzles-board').classList.remove('success-glow');
      document.getElementById('turn-indicator').textContent = 'Blancas Juegan y Dan Mate';
      document.getElementById('turn-indicator').style.borderColor = 'rgba(74, 222, 128, 0.3)';
      document.getElementById('turn-indicator').style.color = '#4ade80';
      document.getElementById('turn-indicator').style.backgroundColor = 'rgba(22, 163, 74, 0.15)';
    }

    resetPuzzle() {
      if (this.currentPuzzle) {
        this.loadPuzzle(this.currentPuzzle);
      }
    }

    showHint() {
      if (!this.currentPuzzle) return;
      const expectedMove = this.currentPuzzle.solution[this.currentMoveIndex];
      if (!expectedMove) return;

      const fromCoord = expectedMove.substring(0, 2);
      
      // Clear prev highlight and set outline to show the starting piece of the puzzle
      this.board.clearHighlights();
      const sq = document.querySelector(`#puzzles-board .bots-chess-sq[data-coord="${fromCoord}"]`);
      if (sq) {
        sq.style.outline = '4px solid var(--gold)';
        sq.style.boxShadow = '0 0 15px var(--gold)';
      }
    }

    handleSquareClick(r, c, coord, piece) {
      if (!this.currentPuzzle) return;
      
      // If puzzle is already completed, do nothing
      if (this.currentMoveIndex >= this.currentPuzzle.solution.length) return;

      // 1. Piece Selection
      if (!this.selectedSquare) {
        if (piece && piece === piece.toUpperCase()) { // White pieces are uppercase
          this.selectedSquare = coord;
          this.board.setSelected(coord);
        }
      } else {
        // 2. Clicked same square -> deselect
        if (coord === this.selectedSquare) {
          this.selectedSquare = null;
          this.board.clearHighlights();
          return;
        }

        // 3. Clicked another white piece -> switch selection
        if (piece && piece === piece.toUpperCase()) {
          this.selectedSquare = coord;
          this.board.setSelected(coord);
          return;
        }

        // 4. Play move
        const moveUci = `${this.selectedSquare}${coord}`;
        this.selectedSquare = null;
        this.board.clearHighlights();
        this.attemptPlayerMove(moveUci);
      }
    }

    attemptPlayerMove(moveUci) {
      const expectedMove = this.currentPuzzle.solution[this.currentMoveIndex];
      
      if (moveUci === expectedMove) {
        // Correct Move!
        const boardMapBefore = window.ChessEngine.parseFEN(this.puzzleStateFen);
        const fromC = expectedMove.charCodeAt(0) - 97;
        const fromR = 8 - parseInt(expectedMove[1]);
        const toC = expectedMove.charCodeAt(2) - 97;
        const toR = 8 - parseInt(expectedMove[3]);
        const isCapture = !!boardMapBefore[toR][toC];

        // Execute Move in the Engine
        const nextFen = window.ChessEngine.executeMoveRaw(this.puzzleStateFen, moveUci);
        this.puzzleStateFen = nextFen;
        
        // Update board visualization
        const char = this.characters[this.currentPuzzle.character];
        this.board.setLastMove(expectedMove.substring(0, 2), expectedMove.substring(2, 4), '#22c55e');
        this.board.render(this.puzzleStateFen);

        if (isCapture) this.playCaptureSound();
        else this.playMoveSound();

        this.currentMoveIndex++;

        // Check if there are opponent responses
        if (this.currentMoveIndex < this.currentPuzzle.solution.length) {
          // Play opponent response with a small delay
          document.getElementById('turn-indicator').textContent = 'Oponente responde...';
          document.getElementById('turn-indicator').style.borderColor = 'rgba(239, 68, 68, 0.3)';
          document.getElementById('turn-indicator').style.color = '#ef4444';
          document.getElementById('turn-indicator').style.backgroundColor = 'rgba(239, 68, 68, 0.15)';

          setTimeout(() => {
            const oppMove = this.currentPuzzle.solution[this.currentMoveIndex];
            const boardMapBeforeOpp = window.ChessEngine.parseFEN(this.puzzleStateFen);
            const oppFromC = oppMove.charCodeAt(0) - 97;
            const oppFromR = 8 - parseInt(oppMove[1]);
            const oppToC = oppMove.charCodeAt(2) - 97;
            const oppToR = 8 - parseInt(oppMove[3]);
            const oppIsCapture = !!boardMapBeforeOpp[oppToR][oppToC];

            const oppFen = window.ChessEngine.executeMoveRaw(this.puzzleStateFen, oppMove);
            this.puzzleStateFen = oppFen;

            this.board.setLastMove(oppMove.substring(0, 2), oppMove.substring(2, 4), '#ef4444');
            this.board.render(this.puzzleStateFen);

            if (oppIsCapture) this.playCaptureSound();
            else this.playMoveSound();

            this.currentMoveIndex++;
            document.getElementById('turn-indicator').textContent = 'Blancas Juegan y Dan Mate';
            document.getElementById('turn-indicator').style.borderColor = 'rgba(74, 222, 128, 0.3)';
            document.getElementById('turn-indicator').style.color = '#4ade80';
            document.getElementById('turn-indicator').style.backgroundColor = 'rgba(22, 163, 74, 0.15)';

            // Speak progress comment
            const successQuote = this.currentPuzzle.quotes.success;
            document.getElementById('char-bubble').textContent = successQuote;
            this.speak(successQuote, char.gender, char.pitch);
          }, 7000 / 10); // 700ms delay
        } else {
          // Solved completely!
          this.handleSolved();
        }
      } else {
        // Wrong Move!
        this.handleFailure();
      }
    }

    handleSolved() {
      const puzzle = this.currentPuzzle;
      const char = this.characters[puzzle.character];
      
      this.playVictorySound();
      this.stopSpeaking();

      // UI enhancements for success
      document.getElementById('puzzles-board').classList.add('success-glow');
      document.getElementById('char-bubble').textContent = puzzle.quotes.solved;
      this.speak(puzzle.quotes.solved, char.gender, char.pitch);

      document.getElementById('turn-indicator').textContent = '🏆 ¡¡JAQUE MATE!! 🏆';
      document.getElementById('turn-indicator').style.borderColor = 'var(--gold)';
      document.getElementById('turn-indicator').style.color = 'var(--gold)';
      document.getElementById('turn-indicator').style.backgroundColor = 'rgba(234, 179, 8, 0.2)';

      // Calculate score points (10 per difficulty level)
      let earnedPoints = 0;
      if (!this.solvedList.includes(puzzle.id)) {
        earnedPoints = puzzle.difficulty * 10;
        this.solvedList.push(puzzle.id);
      }

      this.streak++;
      this.saveProgress(earnedPoints);
      this.renderPuzzlesList();

      document.getElementById('btn-next').disabled = false;
    }

    handleFailure() {
      const puzzle = this.currentPuzzle;
      const char = this.characters[puzzle.character];
      
      this.playDefeatSound();
      this.stopSpeaking();

      // Shake effect
      const boardDOM = document.getElementById('puzzles-board');
      boardDOM.classList.add('shake-element');
      setTimeout(() => boardDOM.classList.remove('shake-element'), 400);

      // Bubble text & voice
      document.getElementById('char-bubble').textContent = puzzle.quotes.fail;
      this.speak(puzzle.quotes.fail, char.gender, char.pitch);

      // Reset streak
      this.streak = 0;
      this.saveProgress(0);

      // Auto-restart puzzle after a short dialog reading delay
      setTimeout(() => {
        this.loadPuzzle(puzzle);
      }, 2500);
    }

    loadNextPuzzle() {
      const currentIdx = this.puzzles.findIndex(p => p.id === this.currentPuzzle.id);
      const nextIdx = (currentIdx + 1) % this.puzzles.length;
      this.loadPuzzle(this.puzzles[nextIdx]);
    }
  }

  // Self initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    window.Puzzles = new PuzzlesGame();
  });
})();
