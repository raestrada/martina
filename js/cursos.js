// js/cursos.js — Lógica de la sección de Cursos y locución interactiva con Martina
(function() {
  'use strict';

  class CourseController {
    constructor() {
      this.course = window.CURRENT_COURSE_DATA || null;
      if (!this.course) return;

      this.currentModuleIdx = 0;
      this.board = null;
      this.currentHistory = [];
      this.currentMoveHistoryIdx = 0;
      this.moveAutoPlayTimer = null;
      this.isAudioPlaying = false;

      this.init();
    }

    init() {
      // Configurar perspectiva del tablero (w o b)
      const playerColor = this.course.perspective || 'w';
      
      this.board = new window.ChessBoard({
        containerId: 'course-board',
        squareClass: 'chess-sq',
        pieceClass: 'chess-pc',
        playerColor: playerColor,
        lightColor: '#e8d5b7',
        darkColor: '#7c5c3e'
      });

      this.renderModuleStepper();
      this.bindEvents();
      this.loadModule(0);
    }

    renderModuleStepper() {
      const container = document.getElementById('course-step-pills');
      if (!container) return;

      container.innerHTML = '';
      this.course.modules.forEach((mod, idx) => {
        const btn = document.createElement('button');
        btn.className = `step-pill ${idx === 0 ? 'active' : ''}`;
        btn.textContent = mod.title;
        btn.addEventListener('click', () => {
          this.stopMoveAutoPlay();
          this.loadModule(idx);
        });
        container.appendChild(btn);
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
            this.stopMoveAutoPlay();
            this.loadModule(this.currentModuleIdx - 1);
          }
        });
      }

      if (btnNext) {
        btnNext.addEventListener('click', () => {
          if (this.currentModuleIdx < this.course.modules.length - 1) {
            this.stopMoveAutoPlay();
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

      // Update Board position from FEN or PGN
      this.currentHistory = window.ChessEngine.playPGN(mod.pgn, mod.fen);
      this.renderMovesList(this.currentHistory);
      this.stopMoveAutoPlay();
      this.goToMoveIdx(0);

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
        btnNext.textContent = idx === this.course.modules.length - 1 ? '¡Finalizado!' : 'Siguiente →';
      }
    }

    renderMovesList(history) {
      const container = document.getElementById('course-moves-list');
      if (!container) return;

      container.innerHTML = '';
      history.forEach((step, idx) => {
        const item = document.createElement('li');
        item.className = `course-move-item ${idx === this.currentMoveHistoryIdx ? 'active' : ''}`;
        
        let label = '';
        if (idx === 0) {
          label = '0. Inicio';
        } else {
          const moveNum = Math.ceil(idx / 2);
          const isWhite = idx % 2 !== 0;
          label = isWhite ? `${moveNum}. ${step.san}` : `${step.san}`;
        }

        item.textContent = label;
        item.addEventListener('click', () => {
          this.stopMoveAutoPlay();
          this.goToMoveIdx(idx);
        });
        container.appendChild(item);
      });
    }

    goToMoveIdx(idx) {
      if (!this.currentHistory || this.currentHistory.length === 0) return;
      
      let targetIdx = Math.max(0, Math.min(idx, this.currentHistory.length - 1));
      this.currentMoveHistoryIdx = targetIdx;

      const step = this.currentHistory[targetIdx];
      this.board._lastMove = step.uci ? {
        from: step.uci.substring(0, 2),
        to: step.uci.substring(2, 4)
      } : null;

      this.board.render(step.fen);

      // Highlight active move in move list
      const items = document.querySelectorAll('.course-move-item');
      items.forEach((it, i) => {
        it.classList.toggle('active', i === targetIdx);
      });
    }

    toggleMoveAutoPlay() {
      const btnPlay = document.getElementById('btn-step-play');
      if (this.moveAutoPlayTimer) {
        this.stopMoveAutoPlay();
      } else {
        if (this.currentMoveHistoryIdx >= this.currentHistory.length - 1) {
          this.goToMoveIdx(0);
        }
        if (btnPlay) btnPlay.textContent = '⏸';
        this.moveAutoPlayTimer = setInterval(() => {
          if (this.currentMoveHistoryIdx < this.currentHistory.length - 1) {
            this.goToMoveIdx(this.currentMoveHistoryIdx + 1);
          } else {
            this.stopMoveAutoPlay();
          }
        }, 1200);
      }
    }

    stopMoveAutoPlay() {
      if (this.moveAutoPlayTimer) {
        clearInterval(this.moveAutoPlayTimer);
        this.moveAutoPlayTimer = null;
      }
      const btnPlay = document.getElementById('btn-step-play');
      if (btnPlay) btnPlay.textContent = '▶️';
    }

    toggleAudio() {
      if (this.isAudioPlaying) {
        window.speechSynthesis.cancel();
        this.isAudioPlaying = false;
        this.updateAudioBtn(false);
      } else {
        const mod = this.course.modules[this.currentModuleIdx];
        if (!mod) return;

        // Clean HTML tags from speech string for TTS
        const tmp = document.createElement('DIV');
        tmp.innerHTML = mod.speech;
        const textToRead = (mod.heading ? mod.heading + '. ' : '') + tmp.textContent || tmp.innerText || '';

        if ('speechSynthesis' in window) {
          const utter = new SpeechSynthesisUtterance(textToRead);
          utter.lang = 'es-ES';
          utter.rate = 0.95;

          utter.onstart = () => {
            this.isAudioPlaying = true;
            this.updateAudioBtn(true);
          };

          utter.onend = () => {
            this.isAudioPlaying = false;
            this.updateAudioBtn(false);
          };

          utter.onerror = () => {
            this.isAudioPlaying = false;
            this.updateAudioBtn(false);
          };

          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utter);
        }
      }
    }

    updateAudioBtn(isPlaying) {
      const btn = document.getElementById('btn-audio-speak');
      const label = document.getElementById('audio-btn-label');
      if (btn && label) {
        if (isPlaying) {
          btn.classList.add('playing');
          label.textContent = 'Detener';
        } else {
          btn.classList.remove('playing');
          label.textContent = 'Escuchar';
        }
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.COURSE_CONTROLLER = new CourseController();
  });
})();
