// === JUEGO: CHESS BOXING — DUELO DE TITANES ===
// Fusiona boxeo retro 2D en Phaser (estilo Punch-Out) con ajedrez de alta tensión.
// Integración con Stockfish (vía Web Worker) y penalización de tiempo cruzada.

class ChessBoxGame {
  constructor(container) {
    this.container = container;
    this.currentLevelIndex = 0;
    this.score = 0;
    this.gameActive = false;
    this.selectedDifficulty = localStorage.getItem('martina_chessbox_difficulty') || 'medium';
    
    // Check if we need to reset legacy progress for the new Chess Boxing v2 characters & levels
    this.showResetAnnouncement = false;
    if (localStorage.getItem('martina_chessbox_v2_reset_v3_done') !== 'true') {
      const keys = [
        'martina_chessbox_progress',
        'martina_chessbox_progress_easy',
        'martina_chessbox_progress_hard',
        'martina_chessbox_progress_martina'
      ];
      let hadProgress = false;
      keys.forEach(k => {
        const val = localStorage.getItem(k);
        if (val) {
          try {
            const arr = JSON.parse(val);
            if (Array.isArray(arr) && arr.some(stars => stars > 0)) {
              hadProgress = true;
            }
          } catch(e) {}
        }
      });

      if (hadProgress) {
        // Reset all progresses to 0 for a fresh start with characters!
        const resetArr = JSON.stringify([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        keys.forEach(k => {
          localStorage.setItem(k, resetArr);
        });
        this.showResetAnnouncement = true;
      }
      localStorage.setItem('martina_chessbox_v2_reset_v3_done', 'true');
    }
    
    // Core Chess Boxing states
    this.currentRound = 1; // 1 to 6 (R1, R3, R5: Box | R2, R4, R6: Chess)
    this.playerHealth = 100;
    this.opponentHealth = 100;
    
    this.playerChessClock = 150000; // 150s base in ms
    this.opponentChessClock = 150000;
    
    this.hitsLandedThisRound = 0;
    this.hitsReceivedThisRound = 0;
    
    this.totalPunchesLanded = 0;
    this.totalPunchesReceived = 0;
    
    // Chess board FEN state (standard start)
    this.chessFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.chessHistory = [];
    this.lastChessMove = null;
    this.selectedSquare = null;
    this.isThinking = false;
    
    // Engine / Worker
    this.stockfishWorker = null;
    this.engineType = 'stockfish'; // 'stockfish' or 'local'
    
    // Interval reference
    this.chessClockInterval = null;
    
    // Phaser boxing reference
    this.phaserGame = null;
    this.boxingTimeLeft = 30; // 30s per box round
    this.boxingTimer = null;

    // Music chiptune state
    this.musicEnabled = localStorage.getItem('martina_chessbox_mute') !== 'true';
    this.musicInterval = null;
    this.synthNotes = [];
    this.activeMusicType = null; // 'boxing' or 'chess'

    // OGG audio playback for Inner Light boxing music
    this.oggBuffer = null;      // cached decoded AudioBuffer
    this.oggSource = null;      // current AudioBufferSourceNode
    this.oggGain = null;        // GainNode for volume/mute control
    this._oggLoading = false;   // prevent concurrent fetches

    // Mobile detection
    this.isMobile = window.innerWidth < 1024 || window.innerHeight < 500 || 'ontouchstart' in window;

    // 15 Progressive tournament levels (Chess Boxing v2 with dynamic tiers and stories)
    this.levels = [
      { name: "El Calentamiento de Peoncito", opponentName: "Peoncito", tier: "pawn", elo: 400, hp: 80, punchSpeed: 1400, color: "#38bdf8", desc: "Enfréntate a un Peón novato con un gran bigote postizo. ¡Aprende los esquives básicos!" },
      { name: "El Galope del Caballo de Ŋ", opponentName: "Caballo de Ŋ", tier: "knight", elo: 600, hp: 100, punchSpeed: 1300, color: "#4ade80", desc: "El Caballo de Ŋ lanza golpes en L y a veces en Ŋ. ¡Atento a sus saltos erráticos!" },
      { name: "El Ataque del Alfil Exiliado", opponentName: "Alfil Exiliado", tier: "bishop", elo: 800, hp: 110, punchSpeed: 1200, color: "#fbbf24", desc: "Movimientos diagonales veloces. El Alfil exiliado odia las tablas y ataca sin cesar." },
      { name: "La Guardia de la Torreta", opponentName: "Torreta", tier: "rook", elo: 1000, hp: 120, punchSpeed: 1100, color: "#f43f5e", desc: "Torreta adopta una postura defensiva firme y prepara su Enroque. ¡Rompe su guardia!" },
      { name: "Duelo en el Río Central", opponentName: "Sombra del Ring", tier: "shadow", elo: 1200, hp: 130, punchSpeed: 1000, color: "#a855f7", desc: "Tu primer combate contra la Sombra del Ring en las cuatro casillas centrales (d4, e4, d5, e5)." },
      { name: "La Alergia de la Reina Negra", opponentName: "Reina Negra", tier: "queen", elo: 1400, hp: 140, punchSpeed: 920, color: "#ec4899", desc: "Ganchos brutales de la monarca del sur. ¡Cuidado con sus estornudos de pañuelo!" },
      { name: "El Enroque de Acero", opponentName: "General Torreón", tier: "rook", elo: 1600, hp: 150, punchSpeed: 840, color: "#06b6d4", desc: "General Torreón regresa blindado y preparando Enroques de Acero. ¡Boxea al contragolpe!" },
      { name: "La Coronación de Peoncito", opponentName: "Peoncito Dorado", tier: "pawn", elo: 1800, hp: 160, punchSpeed: 760, color: "#3b82f6", desc: "¡Peoncito ha vuelto y busca coronarse! Si no lo noqueas rápido, aumentará su fuerza." },
      { name: "El Caballo Salvaje", opponentName: "Caballo de Ŋ Salvaje", tier: "knight", elo: 2000, hp: 170, punchSpeed: 680, color: "#6366f1", desc: "El Caballo de Ŋ regresa en su versión más caótica y rápida. ¡Esquiva con reflejos felinos!" },
      { name: "Fianchetto Maestro", opponentName: "Alfil Exiliado Pro", tier: "bishop", elo: 2200, hp: 180, punchSpeed: 600, color: "#14b8a6", desc: "El Alfil Exiliado ataca con precisión geométrica y ráfagas cruzadas desde las esquinas del ring." },
      { name: "El Templo de c3", opponentName: "Torreta de c3", tier: "rook", elo: 2300, hp: 190, punchSpeed: 540, color: "#f59e0b", desc: "Torreta pelea a máxima potencia comiendo empanadas picantes de la casilla c3 para sanarse." },
      { name: "El Caos del Bosque de Tal", opponentName: "Reina Negra de Tal", tier: "queen", elo: 2400, hp: 200, punchSpeed: 480, color: "#ef4444", desc: "La Reina Negra te lleva al bosque oscuro donde 2+2=5. ¡Ataques caóticos y sacrificios!" },
      { name: "La Diagonal del Sacrificio", opponentName: "Alfil Exiliado Final", tier: "bishop", elo: 2500, hp: 210, punchSpeed: 430, color: "#8b5cf6", desc: "El rival ataca sin descanso. Conectar golpes es vital para restarle tiempo." },
      { name: "El Desafío de Judit", opponentName: "General de Judit", tier: "rook", elo: 2600, hp: 225, punchSpeed: 380, color: "#d946ef", desc: "Ataque calculado y demolición posicional. La penúltima muralla antes del título." },
      { name: "La Corona de las 64 Casillas", opponentName: "Sombra Suprema", tier: "shadow", elo: 2800, hp: 250, punchSpeed: 330, color: "#fbbf24", desc: "¡Combate definitivo por el Campeonato Mundial Mágico! Stockfish al 100% y golpes de trueno." }
    ];
  }

  // --- INICIALIZAR MÚSICA Inner Light OGG (solo la primera vez, no reinicia entre rounds) ---
  startMusic(type) {
    this.activeMusicType = type;
    if (!this.musicEnabled) return;

    // Use or initialize GameAudio Web Audio Context
    let audioCtx = window.GameAudio.ctx;
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      window.GameAudio.ctx = audioCtx;
    }
    if (!audioCtx) return;

    // Restart context if suspended (browser security restrictions)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Only start OGG if not already playing — keeps music continuous across rounds
    if (this.oggSource) return;

    this._playInnerLightOGG(audioCtx);
    return;
    // Overdrive Distortion WaveShaper node for realistic electric guitar sound
    let distNode = window.GameAudio.distNode;
    if (!distNode) {
      try {
        distNode = audioCtx.createWaveShaper();
        const makeDistortionCurve = (amount = 80) => {
          const n_samples = 44100;
          const curve = new Float32Array(n_samples);
          const deg = Math.PI / 180;
          for (let i = 0; i < n_samples; ++i) {
            const x = (i * 2) / n_samples - 1;
            curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
          }
          return curve;
        };
        distNode.curve = makeDistortionCurve(135); // intense heavy metal overdrive distortion!
        distNode.oversample = '4x';
        distNode.connect(audioCtx.destination);
        window.GameAudio.distNode = distNode;
      } catch(e) {}
    }

    let melody = [];
    let bass = [];
    let tempo = 175; // 175ms = 8th note at 171 BPM — exact Inner Light tempo

    if (type === 'boxing') {
      // === HAJIME NO IPPO — INNER LIGHT (exact MIDI transcription) ===
      // Key: C minor. 171 BPM. Iconic guitar riff + soaring chorus.
      // MIDI notes: C4(60)=261.63 D#3(51)=155.56 A#3(58)=233.08 G3(55)=196.00 G4(67)=392.00
      const C4 = 261.63, Eb3 = 155.56, Bb3 = 233.08, G3 = 196.00, G4 = 392.00;
      melody = [
        // Bar 1: Cm — The iconic Inner Light riff! (MIDI Track 0)
        C4, C4, C4, Eb3, C4, C4, C4, C4,
        // Bar 2: Cm — continues with Bb inflection
        C4, C4, Bb3, Bb3, C4, C4, C4, C4,
        // Bar 3: G — the lift (MIDI Track 0 bars 4-5)
        G3, G3, G3, G3, G3, G3, Bb3, C4,
        // Bar 4: Cm — return to the riff, with soaring G4 climax (MIDI Track 0)
        C4, C4, C4, Eb3, G4, C4, Bb3, Bb3
      ];
      const C2 = 65.41, G2 = 98.00;
      bass = [
        // Cm — driving bass
        C2, C2, C2, C2, C2, C2, C2, C2,
        C2, C2, C2, C2, C2, C2, C2, C2,
        // G
        G2, G2, G2, G2, G2, G2, G2, G2,
        // Cm
        C2, C2, C2, C2, C2, C2, C2, C2
      ];
    } else {
      // Chess tension music: Slow, ominous A-minor drone with woodblock ticking
      melody = [
        0, 880.00, 0, 0, 0, 830.61, 0, 0,
        0, 783.99, 0, 0, 0, 739.99, 0, 0,
        0, 880.00, 0, 0, 0, 830.61, 0, 0,
        0, 783.99, 0, 987.77, 0, 1046.50, 0, 0
      ];
      bass = [
        55.00, 0, 55.00, 0, 48.99, 0, 48.99, 0,
        41.20, 0, 41.20, 0, 36.71, 0, 36.71, 0,
        55.00, 0, 55.00, 0, 48.99, 0, 48.99, 0,
        41.20, 0, 41.20, 0, 36.71, 0, 36.71, 0
      ];
      tempo = 350; // Slow ticking pace (350ms per step)
    }

    let step = 0;
    this.musicInterval = setInterval(() => {
      if (!this.gameActive || !this.musicEnabled) {
        this.stopMusic();
        return;
      }

      const now = audioCtx.currentTime;

      // 1. DYNAMIC DRUM CHANNEL (Relentless Ippo-style drums) for boxing
      if (type === 'boxing') {
        const beat = step % 8;
        // Kick Drum: RELENTLESS double kick on EVERY beat (0-7) for max intensity
        if (beat !== 2 && beat !== 6) { // everything except snare beats gets kick
          try {
            const kOsc = audioCtx.createOscillator();
            const kGain = audioCtx.createGain();
            kOsc.type = 'sine';
            kOsc.frequency.setValueAtTime(160, now);
            kOsc.frequency.exponentialRampToValueAtTime(25, now + 0.06);
            kGain.gain.setValueAtTime(0.28, now);
            kGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
            kOsc.connect(kGain);
            kGain.connect(audioCtx.destination);
            kOsc.start(now);
            kOsc.stop(now + 0.08);
            this.synthNotes.push(kOsc);
          } catch(e) {}
        }
        
        // Snare Drum: Powerful crack on beats 2 and 6 (half-time feel)
        if (beat === 2 || beat === 6) {
          try {
            const bufferSize = audioCtx.sampleRate * 0.15; // 150ms snare blast
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1000;
            filter.Q.value = 1.0;
            const noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(0.18, now); // loud snare crack
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);
            noise.start(now);
            noise.stop(now + 0.15);
            this.synthNotes.push(noise);
          } catch(e) {}
        }

        // Cymbals: Big crash on step 0, ride bell on 2/4/6, hi-hats on 1/3/5/7
        if (beat === 0) {
          try {
            const bufferSize = audioCtx.sampleRate * 0.5;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 7000;
            const noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(0.10, now); // bigger crash!
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);
            noise.start(now);
            noise.stop(now + 0.5);
            this.synthNotes.push(noise);
          } catch(e) {}
        } else if (beat === 2 || beat === 4 || beat === 6) {
          // Ride cymbal bell — metallic ping for training montage energy
          try {
            const rOsc = audioCtx.createOscillator();
            const rGain = audioCtx.createGain();
            rOsc.type = 'square';
            rOsc.frequency.setValueAtTime(4200, now);
            rGain.gain.setValueAtTime(0.016, now);
            rGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
            rOsc.connect(rGain);
            rGain.connect(audioCtx.destination);
            rOsc.start(now);
            rOsc.stop(now + 0.08);
            this.synthNotes.push(rOsc);
          } catch(e) {}
        } else {
          // Crisp closed hi-hat on 1, 3, 5, 7
          try {
            const hOsc = audioCtx.createOscillator();
            const hGain = audioCtx.createGain();
            hOsc.type = 'square';
            hOsc.frequency.setValueAtTime(14000, now);
            hGain.gain.setValueAtTime(0.014, now);
            hGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
            hOsc.connect(hGain);
            hGain.connect(audioCtx.destination);
            hOsc.start(now);
            hOsc.stop(now + 0.04);
            this.synthNotes.push(hOsc);
          } catch(e) {}
        }

        // Drum Fill: Epic snare roll every 4 bars (step 24-31) + big crash at bar end
        if (step >= 24 && step <= 30) {
          try {
            const fOsc = audioCtx.createOscillator();
            const fGain = audioCtx.createGain();
            fOsc.type = 'triangle';
            fOsc.frequency.setValueAtTime(200 + (step - 24) * 30, now);
            fGain.gain.setValueAtTime(0.08, now);
            fGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
            fOsc.connect(fGain);
            fGain.connect(audioCtx.destination);
            fOsc.start(now);
            fOsc.stop(now + 0.07);
            this.synthNotes.push(fOsc);
          } catch(e) {}
        }
        if (step === 30) {
          try {
            // BIG crash cymbal at fill climax
            const bufferSize = audioCtx.sampleRate * 0.7;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 6000;
            const noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(0.12, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(audioCtx.destination);
            noise.start(now);
            noise.stop(now + 0.7);
            this.synthNotes.push(noise);
          } catch(e) {}
        }
      }

      // 2. CHESS DRONE - Deep, ominous A-minor drone with woodblock ticking
      if (type === 'chess') {
        if (step % 8 === 0) {
          const droneNotes = [110.00, 130.81, 164.81, 220.00]; // A2, C3, E3, A3
          droneNotes.forEach(freq => {
            try {
              const dOsc = audioCtx.createOscillator();
              const dGain = audioCtx.createGain();
              dOsc.type = 'sine';
              dOsc.frequency.setValueAtTime(freq, now);
              dGain.gain.setValueAtTime(0.001, now);
              dGain.gain.linearRampToValueAtTime(0.012, now + 0.8);
              dGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
              dOsc.connect(dGain);
              dGain.connect(audioCtx.destination);
              dOsc.start(now);
              dOsc.stop(now + 2.9);
              this.synthNotes.push(dOsc);
            } catch(e) {}
          });
        }

        // Ticking woodblock effect for Chess Clock tension
        try {
          const tickOsc = audioCtx.createOscillator();
          const tickGain = audioCtx.createGain();
          tickOsc.type = 'triangle';
          const isDanger = this.playerChessClock < 10000;
          tickOsc.frequency.setValueAtTime(step % 2 === 0 ? (isDanger ? 1600 : 1200) : (isDanger ? 1100 : 800), now);
          tickGain.gain.setValueAtTime(isDanger ? 0.03 : 0.015, now);
          tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
          tickOsc.connect(tickGain);
          tickGain.connect(audioCtx.destination);
          tickOsc.start(now);
          tickOsc.stop(now + 0.04);
          this.synthNotes.push(tickOsc);
        } catch(e) {}
      }

      // 3. Lead melody track (Distorted Electric Guitar Power Chords for boxing, Sine for chess)
      const leadFreq = melody[step];
      if (leadFreq > 0) {
        try {
          if (type === 'boxing' && distNode) {
            // Polyphonic Power Chords: Root + Perfect Fifth + Octave
            // played with 3 detuned sawtooth waves to simulate heavy double-tracked guitars!
            const freqs = [leadFreq, leadFreq * 1.4983, leadFreq * 2.0];
            const detunes = [-12, 0, 12];
            const volumes = [0.022, 0.017, 0.013]; // rhythm guitars (support role under brass lead)
            
            freqs.forEach((f, idx) => {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(f, now);
              osc.detune.setValueAtTime(detunes[idx], now);
              
              gain.gain.setValueAtTime(volumes[idx], now);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12); // tight palm-muted decay
              
              osc.connect(gain);
              gain.connect(distNode); // Route to overdrive distortion
              osc.start(now);
              osc.stop(now + 0.17);
              this.synthNotes.push(osc);
            });
            
            // === HAJIME NO IPPO BRASS SECTION ===
            // Dual-layer trumpet synth: aggressive sawtooth through resonant lowpass filter
            // with dramatic envelope sweep — the signature Ippo heroic sound
            try {
              // Layer 1: Main trumpet — bright, wide filter sweep
              const b1Osc = audioCtx.createOscillator();
              const b1Filter = audioCtx.createBiquadFilter();
              const b1Gain = audioCtx.createGain();
              
              b1Osc.type = 'sawtooth';
              b1Osc.frequency.setValueAtTime(leadFreq * 2.0, now);
              b1Osc.detune.setValueAtTime(8, now); // slight detune for richness
              
              b1Filter.type = 'lowpass';
              b1Filter.frequency.setValueAtTime(250, now);
              b1Filter.frequency.linearRampToValueAtTime(4500, now + 0.05); // aggressive wah open
              b1Filter.frequency.exponentialRampToValueAtTime(500, now + 0.14); // quick close
              b1Filter.Q.value = 5.0; // resonant peak for trumpet bite
              
              b1Gain.gain.setValueAtTime(0.055, now); // LOUD — lead instrument!
              b1Gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
              
              b1Osc.connect(b1Filter);
              b1Filter.connect(b1Gain);
              b1Gain.connect(audioCtx.destination);
              b1Osc.start(now);
              b1Osc.stop(now + 0.18);
              this.synthNotes.push(b1Osc);

              // Layer 2: Harmony trumpet — one octave lower, slightly quieter, for depth
              const b2Osc = audioCtx.createOscillator();
              const b2Filter = audioCtx.createBiquadFilter();
              const b2Gain = audioCtx.createGain();
              
              b2Osc.type = 'sawtooth';
              b2Osc.frequency.setValueAtTime(leadFreq * 1.0, now);
              b2Osc.detune.setValueAtTime(-5, now);
              
              b2Filter.type = 'lowpass';
              b2Filter.frequency.setValueAtTime(200, now);
              b2Filter.frequency.linearRampToValueAtTime(3000, now + 0.05);
              b2Filter.frequency.exponentialRampToValueAtTime(400, now + 0.14);
              b2Filter.Q.value = 3.5;
              
              b2Gain.gain.setValueAtTime(0.030, now); // supportive harmony
              b2Gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
              
              b2Osc.connect(b2Filter);
              b2Filter.connect(b2Gain);
              b2Gain.connect(audioCtx.destination);
              b2Osc.start(now);
              b2Osc.stop(now + 0.18);
              this.synthNotes.push(b2Osc);
            } catch(e) {}
          } else {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(leadFreq, now);
            gain.gain.setValueAtTime(0.035, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.4);
            this.synthNotes.push(osc);
          }
        } catch(e) {}
      }

      // 4. Bass accompaniment (triangle wave)
      const bassFreq = bass[step];
      if (bassFreq > 0) {
        try {
          const bOsc = audioCtx.createOscillator();
          const bGain = audioCtx.createGain();
          bOsc.type = 'triangle';
          bOsc.frequency.setValueAtTime(bassFreq, now);
          bGain.gain.setValueAtTime(type === 'boxing' ? 0.05 : 0.06, now);
          bGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
          bOsc.connect(bGain);
          bGain.connect(audioCtx.destination);
          bOsc.start(now);
          bOsc.stop(now + 0.35);
          this.synthNotes.push(bOsc);
        } catch(e) {}
      }

      step = (step + 1) % melody.length;

      // Prevent memory accumulation leaks
      if (this.synthNotes.length > 60) {
        this.synthNotes.splice(0, 30);
      }
    }, tempo);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this._stopOGG();
  }

  _stopOGG() {
    if (this.oggSource) {
      try { this.oggSource.stop(); } catch(e) {}
      this.oggSource = null;
    }
  }

  // --- Play Inner Light OGG (rendered from original MIDI with GM SoundFont) ---
  async _playInnerLightOGG(audioCtx) {
    try {
      // Load and cache the OGG (only once)
      if (!this.oggBuffer) {
        if (this._oggLoading) return; // Already loading
        this._oggLoading = true;
        try {
          const response = await fetch('https://martinachess.com/assets/audio/inner_light.ogg');
          if (!response.ok) throw new Error('OGG not found');
          const arrayBuffer = await response.arrayBuffer();
          this.oggBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        } finally {
          this._oggLoading = false;
        }
      }

      this._stopOGG();

      // Create gain node for volume/mute control
      if (!this.oggGain) {
        this.oggGain = audioCtx.createGain();
        this.oggGain.gain.value = 5.0;
        this.oggGain.connect(audioCtx.destination);
      }

      // Create and start looping source — skip slow intro, start at energetic band entry
      this.oggSource = audioCtx.createBufferSource();
      this.oggSource.buffer = this.oggBuffer;
      this.oggSource.loop = true;
      this.oggSource.loopStart = 28.0; // skip slow intro, loop from where the band kicks in
      this.oggSource.loopEnd = this.oggBuffer.duration;
      this.oggSource.connect(this.oggGain);
      this.oggSource.start(0, 28.0);
    } catch(e) {
      // OGG failed (e.g. file:// CORS) — synthesis continues as fallback, silent ignore
    }
  }

  // --- SFX SYSTEM: Bell, punch impacts, crowd reactions ---
  _getAudioCtx() {
    let ctx = window.GameAudio.ctx;
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      window.GameAudio.ctx = ctx;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  playBell() {
    const ctx = this._getAudioCtx();
    if (!ctx || !this.musicEnabled) return;
    try {
      const now = ctx.currentTime;
      // Ring bell: two high-frequency strikes with metallic ring
      for (let i = 0; i < 2; i++) {
        const t = now + i * 0.18;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.setValueAtTime(1100, t + 0.02);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.4);
        this.synthNotes.push(osc);
      }
    } catch(e) {}
  }

  playPunchImpact() {
    const ctx = this._getAudioCtx();
    if (!ctx || !this.musicEnabled) return;
    try {
      const now = ctx.currentTime;
      // Low thud + high crack layered for satisfying punch sound
      // Thud layer
      const tOsc = ctx.createOscillator();
      const tGain = ctx.createGain();
      tOsc.type = 'sine';
      tOsc.frequency.setValueAtTime(150, now);
      tOsc.frequency.exponentialRampToValueAtTime(40, now + 0.07);
      tGain.gain.setValueAtTime(0.2, now);
      tGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      tOsc.connect(tGain);
      tGain.connect(ctx.destination);
      tOsc.start(now);
      tOsc.stop(now + 0.09);
      this.synthNotes.push(tOsc);
      // Crack layer
      const bufferSize = ctx.sampleRate * 0.06;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const nFilter = ctx.createBiquadFilter();
      nFilter.type = 'highpass';
      nFilter.frequency.value = 3000;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.1, now);
      nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      noise.connect(nFilter);
      nFilter.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.07);
      this.synthNotes.push(noise);
    } catch(e) {}
  }

  playPunchBlocked() {
    const ctx = this._getAudioCtx();
    if (!ctx || !this.musicEnabled) return;
    try {
      const now = ctx.currentTime;
      // Dull thud for blocked punch
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
      this.synthNotes.push(osc);
    } catch(e) {}
  }

  playCrowdCheer() {
    const ctx = this._getAudioCtx();
    if (!ctx || !this.musicEnabled) return;
    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 0.6;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.33);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.35);
      this.synthNotes.push(noise);
    } catch(e) {}
  }

  playCrowdGasp() {
    const ctx = this._getAudioCtx();
    if (!ctx || !this.musicEnabled) return;
    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.6;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      filter.Q.value = 0.4;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.23);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.25);
      this.synthNotes.push(noise);
    } catch(e) {}
  }

  toggleMute() {
    this.musicEnabled = !this.musicEnabled;
    localStorage.setItem('martina_chessbox_mute', (!this.musicEnabled).toString());
    
    // Update mute button states in DOM
    const btn = document.getElementById('chessbox-btn-mute');
    if (btn) btn.textContent = this.musicEnabled ? '🔊 Sonido' : '🔇 Mute';

    if (this.musicEnabled) {
      this.startMusic(this.activeMusicType || 'boxing');
    } else {
      this.stopMusic();
    }
  }

  // --- WELCOME SELECTOR ---
  showWelcomeScreen() {
    this.gameActive = false;
    this.destroy();

    let key = 'martina_chessbox_progress';
    if (this.selectedDifficulty === 'easy') key = 'martina_chessbox_progress_easy';
    if (this.selectedDifficulty === 'hard') key = 'martina_chessbox_progress_hard';
    if (this.selectedDifficulty === 'martina') key = 'martina_chessbox_progress_martina';

    let progress = JSON.parse(localStorage.getItem(key)) || [];
    while (progress.length < 15) progress.push(0);

    let levelCardsHTML = '';
    let starClass = 'star-medium';
    if (this.selectedDifficulty === 'easy') starClass = 'star-easy';
    if (this.selectedDifficulty === 'hard') starClass = 'star-hard';
    if (this.selectedDifficulty === 'martina') starClass = 'star-martina';

    this.levels.forEach((level, idx) => {
      const stars = progress[idx] || 0;
      const isLocked = idx > 0 && (progress[idx - 1] === 0);
      
      let starsHTML = '';
      for (let s = 1; s <= 3; s++) {
        if (s <= stars) {
          starsHTML += `<span class="star-filled ${starClass}">★</span>`;
        } else {
          starsHTML += '<span class="star-empty">★</span>';
        }
      }

      levelCardsHTML += `
        <div class="level-card ${isLocked ? 'locked' : ''}" data-level="${idx}" style="border-left: 5px solid ${level.color}">
          <div class="level-number" style="color: ${level.color}">Combate ${idx + 1}</div>
          <div class="level-card-stars">${isLocked ? '' : starsHTML}</div>
          <div class="level-card-title">${level.name}</div>
          <div class="level-card-desc">${level.desc}</div>
          <div class="level-card-footer">
            <span class="level-card-meta">🤖 Stockfish ELO ${level.elo}</span>
            ${isLocked ? '' : `<button class="level-card-play-btn" style="background:${level.color};">Pelear 🥊</button>`}
          </div>
        </div>
      `;
    });

    this.container.innerHTML = `
      <div class="level-select-container">
        ${this.showResetAnnouncement ? `
          <div id="chessbox-update-banner" style="
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(244, 63, 94, 0.15));
            border: 2px solid #ef4444;
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.25);
            border-radius: 12px;
            padding: 1.25rem;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            backdrop-filter: blur(10px);
            text-align: left;
            font-family: 'Outfit', sans-serif;
          ">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 2.2rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🥊</span>
              <div>
                <strong style="color: #ef4444; font-size: 1.1rem; display: block; margin-bottom: 0.25rem; letter-spacing: 0.5px; text-transform: uppercase;">¡GRAN ACTUALIZACIÓN DE PERSONAJES!</strong>
                <span style="color: #e2e8f0; font-size: 0.9rem; line-height: 1.45; display: inline-block;">
                  Hemos remodelado por completo el torneo con los divertidos personajes de los cuentos de <strong>Martina</strong> (Peoncito, Caballo de Ŋ, Alfil Exiliado, Torreta y la Reina Negra) con poderes dinámicos e ilustraciones vectoriales en el ring. Tu progreso anterior ha sido reiniciado para que experimentes la nueva campaña desde el principio. ¡A pelear!
                </span>
              </div>
            </div>
            <button onclick="document.getElementById('chessbox-update-banner').style.display='none';" style="
              background: #ef4444;
              color: white;
              border: none;
              padding: 0.6rem 1.2rem;
              border-radius: 8px;
              font-weight: 800;
              font-size: 0.9rem;
              cursor: pointer;
              transition: all 0.2s;
              white-space: nowrap;
              box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            " onmouseover="this.style.background='#f43f5e'; this.style.transform='scale(1.05)';" onmouseout="this.style.background='#ef4444'; this.style.transform='scale(1)';">
              ¡Entendido! 🥊
            </button>
          </div>
        ` : ''}
        <div class="level-select-header">
          <h2 style="color: #ef4444;">🥊 Chess Boxing: Duelo de Titanes 🥊</h2>
          <p>Alterna rondas de boxeo de reflejos con ajedrez mental contra Stockfish. ¡Los golpes restan tiempo en el reloj!</p>
          
          <div class="difficulty-selector">
            <button class="diff-tab easy ${this.selectedDifficulty === 'easy' ? 'active' : ''}" data-diff="easy">🟢 Fácil</button>
            <button class="diff-tab medium ${this.selectedDifficulty === 'medium' ? 'active' : ''}" data-diff="medium">🟡 Medio</button>
            <button class="diff-tab hard ${this.selectedDifficulty === 'hard' ? 'active' : ''}" data-diff="hard">🔴 Difícil</button>
            <button class="diff-tab martina ${this.selectedDifficulty === 'martina' ? 'active' : ''}" data-diff="martina">👑 Martina</button>
          </div>
        </div>
        <div class="level-grid">
          ${levelCardsHTML}
        </div>
      </div>
    `;

    // Bind difficulty tabs
    const diffButtons = this.container.querySelectorAll('.diff-tab');
    diffButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const diff = btn.getAttribute('data-diff');
        this.selectedDifficulty = diff;
        localStorage.setItem('martina_chessbox_difficulty', diff);
        window.GameAudio.playMove();
        this.showWelcomeScreen();
      });
    });

    // Bind level click events
    const cards = this.container.querySelectorAll('.level-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-level'));
        const isLocked = idx > 0 && (progress[idx - 1] === 0);
        if (!isLocked) {
          this.currentLevelIndex = idx;
          this.startGame();
        } else {
          window.GameAudio.playError();
        }
      });
    });

    this.injectGlobalStyles();
  }

  // --- START GAME COMBAT ---
  startGame() {
    this.gameActive = true;
    this.currentRound = 1;
    this.playerHealth = 100;
    this.opponentHealth = 100;
    this.score = 0;
    this.playerSuperPower = 0;
    this.opponentSuperPower = 0;
    
    // Set chess clocks based on level ELO & difficulty (increased to enable real, deep chess play!)
    let timeBase = 480000; // 480s base (Medium - 8 minutes)
    if (this.selectedDifficulty === 'easy') timeBase = 600000; // 600s (Easy - 10 minutes)
    if (this.selectedDifficulty === 'hard') timeBase = 360000; // 360s (Hard - 6 minutes)
    if (this.selectedDifficulty === 'martina') timeBase = 300000; // 300s (Martina - 5 minutes)
    
    this.playerChessClock = timeBase;
    this.opponentChessClock = timeBase;
    
    this.chessFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.chessHistory = [];
    this.lastChessMove = null;
    this.selectedSquare = null;
    this.isThinking = false;
    this.totalPunchesLanded = 0;
    this.totalPunchesReceived = 0;

    // Load Stockfish Worker
    this.initStockfishWorker();

    this.showChallengerIntro(() => {
      this.startRound();
    });
  }

  // =========================================================================
  // --- JAPANESE ANIME / MEGA MAN CHILLENGER PRESENTATION INTRO SCREEN ---
  // =========================================================================
  showChallengerIntro(onComplete) {
    const levelIdx = this.currentLevelIndex;
    const level = this.levels[levelIdx];
    const opponentName = level ? level.opponentName : 'General Torreón';
    const tier = level ? level.tier : 'rook';
    const elo = level ? level.elo : 1600;
    const opponentColor = level ? level.color : '#f43f5e';
    
    const powerData = this.getOpponentTacticalPower(opponentName, tier);
    
    // Stop any playing music
    this.stopMusic();
    
    // Play SFX
    try {
      const audioCtx = this._getAudioCtx();
      if (audioCtx) this.playAnimeIntroSound(audioCtx);
    } catch (e) {
      console.warn("Could not play anime intro sound:", e);
    }
    
    // Create element
    const introDiv = document.createElement('div');
    introDiv.id = 'chessbox-challenger-intro';
    introDiv.className = 'challenger-intro-overlay';
    
    // Build internal HTML structure
    introDiv.innerHTML = `
      <!-- Warning flashing banners -->
      <div class="warning-banner banner-top">
        <div class="warning-scroller">
          <span>⚠️ WARNING ⚠️ CHALLENGER APPROACHING ⚠️ ENCUENTRO DETECTADO ⚠️ AMENAZA NIVEL ELO ${elo} ⚠️ WARNING ⚠️ CHALLENGER APPROACHING ⚠️ ENCUENTRO DETECTADO ⚠️ AMENAZA NIVEL ELO ${elo} ⚠️</span>
        </div>
      </div>
      <div class="warning-banner banner-bottom">
        <div class="warning-scroller">
          <span>⚠️ WARNING ⚠️ CHALLENGER APPROACHING ⚠️ ENCUENTRO DETECTADO ⚠️ AMENAZA NIVEL ELO ${elo} ⚠️ WARNING ⚠️ CHALLENGER APPROACHING ⚠️ ENCUENTRO DETECTADO ⚠️ AMENAZA NIVEL ELO ${elo} ⚠️</span>
        </div>
      </div>
      
      <!-- Anime speed lines background -->
      <div class="intro-speed-lines"></div>
      
      <!-- Split screens -->
      <div class="intro-split-container">
        
        <!-- LEFT PANEL: Martina -->
        <div class="intro-panel intro-panel-left">
          <div class="panel-unskew">
            <div class="challenger-card">
              <span class="intro-badge badge-martina">DESAFIANTE</span>
              <h2 class="intro-challenger-name name-martina">Martina</h2>
              <p class="intro-challenger-elo">🧠 ELO 1500 + Táctica</p>
              
              <div class="canvas-wrapper">
                <canvas id="intro-canvas-martina" width="288" height="288"></canvas>
              </div>
              
              <p class="intro-challenger-quote">«¡El ajedrez no se trata de evitar la clavada, se trata de coleccionarla con orgullo!»</p>
            </div>
          </div>
        </div>
        
        <!-- RIGHT PANEL: Opponent -->
        <div class="intro-panel intro-panel-right" style="--opp-color: ${opponentColor}">
          <div class="panel-unskew">
            <div class="challenger-card">
              <span class="intro-badge" style="background: ${opponentColor}; color: #000;">ENEMIGO</span>
              <h2 class="intro-challenger-name" style="text-shadow: 0 0 15px ${opponentColor};">${opponentName}</h2>
              <p class="intro-challenger-elo">🤖 Stockfish ELO ${elo}</p>
              
              <div class="canvas-wrapper">
                <canvas id="intro-canvas-opponent" width="288" height="288"></canvas>
              </div>
              
              <div class="opponent-power-container" style="border-left: 4px solid ${opponentColor};">
                <h4 style="color: ${opponentColor}; text-transform: uppercase;">⚡ PODER: ${powerData.powerName}</h4>
                <p>${powerData.desc}</p>
              </div>
              
              <p class="intro-challenger-quote" style="color: #cbd5e1;">${powerData.quote}</p>
            </div>
          </div>
        </div>
        
      </div>
      
      <!-- Center flashing diagonal slash -->
      <div class="intro-diagonal-slash"></div>
      
      <!-- Giant VS in center -->
      <div class="intro-vs-container">
        <div class="intro-vs-badge">VS</div>
      </div>
      
      <!-- Skip button -->
      <button class="intro-skip-btn">OMITIR <kbd>ENTER</kbd></button>
    `;
    
    // Append to container
    this.container.appendChild(introDiv);
    
    // Set up cleanup and trigger functions
    let isCleaned = false;

    // Draw on canvases with an animation loop executing their powers!
    const canvasMartina = introDiv.querySelector('#intro-canvas-martina');
    const canvasOpp = introDiv.querySelector('#intro-canvas-opponent');
    
    let frame = 0;
    const animate = () => {
      if (isCleaned) return;
      frame++;
      
      if (canvasMartina) {
        const ctxM = canvasMartina.getContext('2d');
        ctxM.clearRect(0, 0, canvasMartina.width, canvasMartina.height);
        ctxM.save();
        ctxM.scale(1.5, 1.5);
        this.drawMartinaIntro(ctxM, frame);
        ctxM.restore();
      }
      
      if (canvasOpp) {
        const ctxO = canvasOpp.getContext('2d');
        ctxO.clearRect(0, 0, canvasOpp.width, canvasOpp.height);
        ctxO.save();
        ctxO.scale(1.5, 1.5);
        this.drawOpponentIntro(ctxO, tier, opponentName, frame);
        ctxO.restore();
      }
      
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);

    const cleanUpIntro = () => {

      if (isCleaned) return;
      isCleaned = true;
      
      // Remove keyboard listener
      window.removeEventListener('keydown', handleKeydown);
      
      // Fade out overlay
      introDiv.style.opacity = '0';
      introDiv.style.transition = 'opacity 0.4s ease-out';
      
      setTimeout(() => {
        if (introDiv.parentNode) {
          introDiv.parentNode.removeChild(introDiv);
        }
        // Start boxing music!
        this.startMusic('boxing');
        // Call next phase
        onComplete();
      }, 400);
    };
    
    const handleKeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        cleanUpIntro();
      }
    };
    
    // Skip button click
    const skipBtn = introDiv.querySelector('.intro-skip-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', cleanUpIntro);
    }
    
    window.addEventListener('keydown', handleKeydown);
    
    // Auto-skip after 4.5 seconds
    setTimeout(cleanUpIntro, 4500);
  }

  // --- DRAW MARTINA FRONT PROFILE FOR INTRO CARD ---
  drawMartinaIntro(ctx, frame = 0) {
    const bobY = frame > 0 ? Math.sin(frame * 0.15) * 2 : 0;
    const bobX = frame > 0 ? Math.cos(frame * 0.08) * 0.5 : 0;
    
    // Check if jabbing combo
    let leftGloveY = 96;
    let leftGloveScale = 1;
    let rightGloveY = 96;
    let rightGloveScale = 1;
    let martinaShiftX = 0;
    let martinaShiftY = 0;
    
    const cycle = frame > 0 ? (frame % 90) : 0;
    
    if (cycle >= 10 && cycle < 20) {
      // Left jab
      const progress = (cycle - 10) / 10; // 0 to 1
      const jabOffset = Math.sin(progress * Math.PI) * 26;
      leftGloveY = 96 - jabOffset;
      leftGloveScale = 1 + (jabOffset * 0.015);
      martinaShiftX = -2;
      martinaShiftY = -1;
      
      // Draw motion line trails
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(28, 96); ctx.lineTo(28, leftGloveY + 8);
      ctx.stroke();
    } else if (cycle >= 30 && cycle < 40) {
      // Right jab
      const progress = (cycle - 30) / 10;
      const jabOffset = Math.sin(progress * Math.PI) * 26;
      rightGloveY = 96 - jabOffset;
      rightGloveScale = 1 + (jabOffset * 0.015);
      martinaShiftX = 2;
      martinaShiftY = -1;
      
      // Draw motion line trails
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(100, 96); ctx.lineTo(100, rightGloveY + 8);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(bobX + martinaShiftX, bobY + martinaShiftY);

    // Peach skin neck
    ctx.fillStyle = '#fed7aa'; ctx.fillRect(52, 92, 24, 18);
    ctx.fillStyle = '#fdba74'; ctx.fillRect(52, 102, 24, 8); // Neck shadow
    
    // Round face
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath(); ctx.arc(64, 70, 28, 0, Math.PI*2); ctx.fill();
    
    // Hair cap & Ponytail Ribbon (Gold)
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.arc(42, 60, 6, 0, Math.PI*2); ctx.fill();
    
    // Hair: Chocolate brown with straight bangs and locks
    const hairGrad = ctx.createLinearGradient(30, 30, 98, 110);
    hairGrad.addColorStop(0, '#78350f'); hairGrad.addColorStop(1, '#451a03');
    ctx.fillStyle = hairGrad;
    
    // Bangs and sides
    ctx.beginPath();
    ctx.arc(64, 62, 28, Math.PI, 0); // cap top
    ctx.lineTo(92, 98); ctx.lineTo(85, 98); // right lock
    ctx.lineTo(84, 72);
    ctx.bezierCurveTo(76, 56, 52, 56, 44, 72); // bang curve
    ctx.lineTo(43, 98); ctx.lineTo(36, 98); // left lock
    ctx.closePath(); ctx.fill();
    
    // Flowing ponytail on the left
    ctx.beginPath();
    ctx.moveTo(42, 60);
    ctx.quadraticCurveTo(18, 76, 24, 106);
    ctx.quadraticCurveTo(40, 92, 42, 60);
    ctx.closePath(); ctx.fill();
    
    // Glasses (black thick rims)
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 3.5;
    ctx.strokeRect(43, 66, 17, 13);
    ctx.strokeRect(68, 66, 17, 13);
    ctx.beginPath(); ctx.moveTo(60, 71); ctx.lineTo(68, 71); ctx.stroke(); // bridge
    
    // Eyes inside glasses
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(51, 72, 3.2, 0, Math.PI*2); ctx.arc(76, 72, 3.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(49.5, 70.5, 1.2, 0, Math.PI*2); ctx.arc(74.5, 70.5, 1.2, 0, Math.PI*2); ctx.fill();
    
    // Grin smile
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(64, 84, 5, 0, Math.PI); ctx.stroke();
    
    // White shirt polo
    const poloGrad = ctx.createLinearGradient(35, 110, 100, 156);
    poloGrad.addColorStop(0, '#ffffff'); poloGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = poloGrad;
    ctx.beginPath();
    ctx.moveTo(42, 105); ctx.lineTo(86, 105); ctx.lineTo(96, 156); ctx.lineTo(32, 156);
    ctx.closePath(); ctx.fill();
    
    // Red detailing
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(56, 105); ctx.lineTo(64, 118); ctx.lineTo(72, 105); ctx.closePath(); ctx.fill();
    
    // Logo: Gold Pawn/Rook symbol on the chest
    ctx.fillStyle = '#eab308';
    ctx.fillRect(61, 126, 6, 8);
    ctx.fillRect(59, 123, 10, 3);
    ctx.fillRect(58, 134, 12, 2);
    
    // Pink boxing gloves raised up!
    // Left glove
    const leftRadius = 14 * leftGloveScale;
    const leftGloveGrad = ctx.createRadialGradient(28 - leftRadius*0.3, leftGloveY - leftRadius*0.3, leftRadius*0.1, 28, leftGloveY, leftRadius);
    leftGloveGrad.addColorStop(0, '#fbcfe8'); leftGloveGrad.addColorStop(0.3, '#ec4899'); leftGloveGrad.addColorStop(0.8, '#db2777'); leftGloveGrad.addColorStop(1, '#9d174d');
    ctx.fillStyle = leftGloveGrad;
    ctx.beginPath(); ctx.arc(28, leftGloveY, leftRadius, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'; ctx.beginPath(); ctx.arc(25, leftGloveY - leftRadius*0.3, leftRadius*0.25, 0, Math.PI*2); ctx.fill();
    
    // Right glove
    const rightRadius = 14 * rightGloveScale;
    const rightGloveGrad = ctx.createRadialGradient(100 - rightRadius*0.3, rightGloveY - rightRadius*0.3, rightRadius*0.1, 100, rightGloveY, rightRadius);
    rightGloveGrad.addColorStop(0, '#fbcfe8'); rightGloveGrad.addColorStop(0.3, '#ec4899'); rightGloveGrad.addColorStop(0.8, '#db2777'); rightGloveGrad.addColorStop(1, '#9d174d');
    ctx.fillStyle = rightGloveGrad;
    ctx.beginPath(); ctx.arc(100, rightGloveY, rightRadius, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'; ctx.beginPath(); ctx.arc(97, rightGloveY - rightRadius*0.3, rightRadius*0.25, 0, Math.PI*2); ctx.fill();

    ctx.restore();
  }

  // --- DRAW OPPONENT FRONT PROFILE FOR INTRO CARD ---
  drawOpponentIntro(ctx, tier, opponentName, frame = 0) {
    const getStoneGrad = (c, x1, y1, x2, y2) => {
      const g = c.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, '#374151'); g.addColorStop(0.2, '#6b7280'); g.addColorStop(0.5, '#d1d5db'); g.addColorStop(0.8, '#4b5563'); g.addColorStop(1, '#1f2937');
      return g;
    };

    // Tier-specific color schemes
    const tierColors = {
      pawn:   { body: ['#93c5fd', '#60a5fa', '#bfdbfe', '#3b82f6', '#1e3a5f'], glove: ['#fca5a5', '#60a5fa', '#3b82f6', '#1e3a5f'], eye: '#f59e0b', name: opponentName },
      knight: { body: ['#d4b88c', '#b8956a', '#f5e6d3', '#8b6914', '#5c3d0e'], glove: ['#fca5a5', '#d97706', '#b45309', '#7c2d12'], eye: '#ef4444', name: opponentName },
      bishop: { body: ['#c4b5fd', '#a78bfa', '#ddd6fe', '#7c3aed', '#4c1d95'], glove: ['#fca5a5', '#a855f7', '#7e22ce', '#581c87'], eye: '#fbbf24', name: opponentName },
      rook:   { body: ['#374151', '#6b7280', '#d1d5db', '#4b5563', '#1f2937'], glove: ['#fca5a5', '#dc2626', '#b91c1c', '#7f1d1d'], eye: '#facc15', name: opponentName },
      queen:  { body: ['#2d1b4e', '#5b21b6', '#a78bfa', '#4c1d95', '#1a0a2e'], glove: ['#fca5a5', '#c026d3', '#86198f', '#4a044e'], eye: '#f43f5e', name: opponentName },
      shadow: { body: ['#1f1235', '#3d2568', '#5b3c9b', '#110724', '#080212'], glove: ['#f472b6', '#ec4899', '#db2777', '#9d174d'], eye: '#a855f7', name: opponentName }
    };
    const tc = tierColors[tier] || tierColors['rook'];

    const opponentShortsColor = tc.body[3];
    const opponentBeltColor = tc.eye;
    const opponentBeltDark = tc.body[4];

    const getBodyGrad = (c, x1, y1, x2, y2) => {
      const g = c.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, tc.body[0]); g.addColorStop(0.2, tc.body[1]); g.addColorStop(0.5, tc.body[2]); g.addColorStop(0.8, tc.body[3]); g.addColorStop(1, tc.body[4]);
      return g;
    };
    const getGloveGrad = (c, x, y, r) => {
      const g = c.createRadialGradient(x - r*0.3, y - r*0.3, r*0.1, x, y, r);
      g.addColorStop(0, tc.glove[0]); g.addColorStop(0.3, tc.glove[1]); g.addColorStop(0.8, tc.glove[2]); g.addColorStop(1, tc.glove[3]);
      return g;
    };

    const drawOpponentBody = (c, isStunnedState) => {
      c.fillStyle = getBodyGrad(c, 44, 40, 148, 156);
      c.beginPath();
      
      if (tier === 'pawn') {
        c.moveTo(44, 156);
        c.bezierCurveTo(44, 120, 70, 96, 76, 86);
        c.lineTo(116, 86);
        c.bezierCurveTo(122, 96, 148, 120, 148, 156);
        c.closePath();
        c.fill();
        
        c.beginPath();
        c.arc(96, 62, 28, 0, Math.PI * 2);
        c.fill();
        
        if (!isStunnedState) {
          c.fillStyle = '#0f172a';
          c.beginPath();
          c.moveTo(96, 80);
          c.bezierCurveTo(80, 75, 60, 85, 62, 95);
          c.bezierCurveTo(62, 80, 85, 80, 96, 84);
          c.moveTo(96, 80);
          c.bezierCurveTo(112, 75, 132, 85, 130, 95);
          c.bezierCurveTo(130, 80, 107, 80, 96, 84);
          c.closePath();
          c.fill();
          c.fillRect(94, 79, 4, 6);
        }
      } else if (tier === 'knight') {
        c.moveTo(44, 156);
        c.lineTo(46, 126);
        c.bezierCurveTo(46, 110, 55, 96, 66, 86);
        c.lineTo(56, 76);
        c.bezierCurveTo(40, 66, 45, 46, 66, 50);
        c.lineTo(86, 50);
        c.lineTo(90, 36); c.lineTo(98, 44);
        c.lineTo(104, 34); c.lineTo(110, 46);
        c.bezierCurveTo(130, 56, 136, 86, 142, 116);
        c.lineTo(148, 156);
        c.closePath();
        c.fill();
        
        c.fillStyle = tc.body[4];
        c.beginPath();
        c.moveTo(110, 46);
        c.bezierCurveTo(135, 60, 140, 95, 144, 130);
        c.lineTo(136, 130);
        c.bezierCurveTo(130, 95, 125, 65, 105, 52);
        c.closePath();
        c.fill();
      } else if (tier === 'bishop') {
        c.moveTo(44, 156);
        c.bezierCurveTo(46, 110, 60, 96, 66, 86);
        c.lineTo(60, 80);
        c.bezierCurveTo(50, 60, 96, 26, 96, 26);
        c.bezierCurveTo(96, 26, 142, 60, 132, 80);
        c.lineTo(126, 86);
        c.bezierCurveTo(132, 96, 146, 110, 148, 156);
        c.closePath();
        c.fill();
        
        c.fillStyle = tc.eye;
        c.beginPath();
        c.arc(96, 25, 6, 0, Math.PI * 2);
        c.fill();
        
        c.strokeStyle = '#1e293b';
        c.lineWidth = 3.5;
        c.beginPath();
        c.moveTo(96, 38);
        c.lineTo(84, 56);
        c.stroke();
      } else if (tier === 'queen') {
        c.moveTo(44, 156);
        c.bezierCurveTo(46, 110, 66, 96, 70, 86);
        c.lineTo(60, 76);
        c.lineTo(54, 42);
        c.lineTo(76, 56);
        c.lineTo(96, 32);
        c.lineTo(116, 56);
        c.lineTo(138, 42);
        c.lineTo(122, 76);
        c.bezierCurveTo(126, 96, 146, 110, 148, 156);
        c.closePath();
        c.fill();
        
        c.fillStyle = '#fbbf24';
        c.beginPath();
        c.arc(54, 40, 5, 0, Math.PI*2);
        c.arc(96, 30, 6, 0, Math.PI*2);
        c.arc(138, 40, 5, 0, Math.PI*2);
        c.fill();

        if (opponentName.includes("Reina Negra")) {
          c.fillStyle = '#ffffff';
          c.beginPath();
          c.moveTo(90, 30);
          c.bezierCurveTo(80, 15, 102, 15, 102, 30);
          c.closePath();
          c.fill();
        }
      } else if (tier === 'shadow') {
        c.moveTo(44, 156);
        c.bezierCurveTo(44, 110, 58, 90, 68, 80);
        c.lineTo(124, 80);
        c.bezierCurveTo(134, 90, 148, 110, 148, 156);
        c.closePath();
        c.fill();
        
        c.beginPath();
        c.arc(96, 54, 30, 0, Math.PI*2);
        c.fill();
      } else {
        c.moveTo(52, 36); c.lineTo(68, 36); c.lineTo(68, 52); 
        c.lineTo(84, 52); c.lineTo(84, 36); c.lineTo(100, 36); 
        c.lineTo(100, 52); c.lineTo(116, 52); c.lineTo(116, 36); 
        c.lineTo(132, 36); c.lineTo(132, 52); c.lineTo(140, 52);
        c.lineTo(148, 156); c.lineTo(44, 156);
        c.closePath();
        c.fill();

        if (opponentName.includes("Torreta")) {
          c.save();
          c.beginPath();
          c.moveTo(52, 72);
          c.lineTo(140, 72);
          c.lineTo(148, 156);
          c.lineTo(44, 156);
          c.closePath();
          c.clip();
          
          c.fillStyle = '#ffffff';
          c.fillRect(56, 75, 80, 82);
          
          c.fillStyle = '#f43f5e';
          const size = 8;
          for (let x = 56; x < 136; x += size * 2) {
            for (let y = 75; y < 156; y += size * 2) {
              c.fillRect(x, y, size, size);
              c.fillRect(x + size, y + size, size, size);
            }
          }
          c.restore();
        }
      }
    };

    let eyeY = 84;
    let eyeXL = 76;
    let eyeXR = 116;
    if (tier === 'pawn') {
      eyeY = 62; eyeXL = 84; eyeXR = 108;
    } else if (tier === 'knight') {
      eyeY = 66; eyeXL = 68; eyeXR = 96;
    } else if (tier === 'bishop') {
      eyeY = 74; eyeXL = 82; eyeXR = 110;
    } else if (tier === 'queen') {
      eyeY = 80; eyeXL = 80; eyeXR = 112;
    } else if (tier === 'shadow') {
      eyeY = 54; eyeXL = 84; eyeXR = 108;
    }

    let mouthY = 108;
    if (tier === 'pawn') mouthY = 78;
    else if (tier === 'knight') mouthY = 78;
    else if (tier === 'bishop') mouthY = 92;
    else if (tier === 'queen') mouthY = 100;
    else if (tier === 'shadow') mouthY = 70;

    // Bobbing & Attack cycle staggered
    const bobY = frame > 0 ? Math.sin(frame * 0.12) * 2.5 : 0;
    const cycle = frame > 0 ? ((frame + 45) % 90) : 0;
    
    let oppShiftX = 0;
    let oppShiftY = bobY;
    let mustRotate = 0;
    let customAlpha = 1;
    
    // Execute active special powers rendering inside cycle!
    if (cycle >= 10 && cycle < 40) {
      const p = (cycle - 10) / 30; // 0 to 1
      
      if (tier === 'pawn') {
        // Peoncito Crystal embestida!
        const chargeOffset = Math.sin(p * Math.PI) * 16;
        oppShiftY += chargeOffset;
        mustRotate = Math.sin(frame * 0.7) * 0.12;
        
        // Spawn crystal stars
        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
        for (let i = 0; i < 3; i++) {
          const px = 96 + Math.sin(frame + i) * 32;
          const py = 70 + Math.cos(frame * 2 + i) * 32;
          ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI*2); ctx.fill();
        }
      } else if (tier === 'knight') {
        // Knight L-Leap!
        const leapProgress = (cycle - 10) / 25;
        if (leapProgress >= 0 && leapProgress <= 1) {
          oppShiftY -= Math.sin(leapProgress * Math.PI) * 26;
          oppShiftX += Math.sin(leapProgress * Math.PI * 2) * 12; // L-shaped horizontal shift
          
          // Draw green L-trail behind Knight
          ctx.strokeStyle = 'rgba(74, 222, 128, 0.35)';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(96, 96); ctx.lineTo(96 + oppShiftX, 96 + oppShiftY);
          ctx.stroke();
        }
      } else if (tier === 'bishop') {
        // Alfil Slash!
        oppShiftX += Math.sin(frame * 1.5) * 2; // shaking before strike
        const slashP = (cycle - 10) / 20;
        if (slashP > 0 && slashP <= 1) {
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(25, 25); ctx.lineTo(25 + slashP * 142, 25 + slashP * 142);
          ctx.stroke();
        }
      } else if (tier === 'rook') {
        // Torreta Steel Enroque Shield!
        const shieldAlpha = Math.sin(p * Math.PI) * 0.75;
        if (shieldAlpha > 0) {
          ctx.strokeStyle = `rgba(6, 182, 212, ${shieldAlpha})`;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const sx = 96 + Math.cos(angle) * 64;
            const sy = 96 + Math.sin(angle) * 64;
            if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      } else if (tier === 'shadow') {
        // Sombra Spatial Teleport/Fade!
        customAlpha = 1 - Math.sin(p * Math.PI) * 0.8;
      } else if (tier === 'queen') {
        // Reina Negra Sneeze Shockwave!
        oppShiftX += Math.sin(frame * 1.2) * 2;
        if (cycle >= 20) {
          const sneezeP = (cycle - 20) / 20;
          const r = sneezeP * 65;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * (1 - sneezeP)})`;
          ctx.beginPath();
          ctx.arc(96, mouthY + 10, r, 0, Math.PI*2);
          ctx.fill();
        }
      }
    }

    ctx.save();
    ctx.translate(oppShiftX, oppShiftY);
    if (mustRotate !== 0) {
      ctx.translate(96, 96);
      ctx.rotate(mustRotate);
      ctx.translate(-96, -96);
    }
    ctx.globalAlpha = customAlpha;

    if (tier === 'rook') {
      ctx.fillStyle = '#111827'; ctx.fillRect(52, 48, 88, 20);
    }
    
    drawOpponentBody(ctx, false);

    if (tier === 'rook') {
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(50, 72); ctx.lineTo(142, 72);
      ctx.moveTo(48, 102); ctx.lineTo(144, 102);
      ctx.moveTo(46, 132); ctx.lineTo(146, 132);
      ctx.moveTo(76, 52); ctx.lineTo(76, 72);
      ctx.moveTo(116, 52); ctx.lineTo(116, 72);
      ctx.moveTo(96, 72); ctx.lineTo(96, 102);
      ctx.moveTo(70, 102); ctx.lineTo(70, 132);
      ctx.moveTo(122, 102); ctx.lineTo(122, 132);
      ctx.stroke();

      ctx.strokeStyle = '#047857'; ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(54, 80); ctx.lineTo(60, 92);
      ctx.moveTo(136, 110); ctx.lineTo(130, 122);
      ctx.stroke();
    }

    ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(eyeXL, eyeY, 13, 0, Math.PI*2); ctx.arc(eyeXR, eyeY, 13, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ea580c'; ctx.beginPath(); ctx.arc(eyeXL, eyeY, 9, 0, Math.PI*2); ctx.arc(eyeXR, eyeY, 9, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(eyeXL, eyeY, 5, 0, Math.PI*2); ctx.arc(eyeXR, eyeY, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(eyeXL - 3, eyeY - 3, 1.8, 0, Math.PI*2); ctx.arc(eyeXR - 3, eyeY - 3, 1.8, 0, Math.PI*2); ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(eyeXL - 18, eyeY - 18); ctx.lineTo(eyeXL + 10, eyeY - 6); ctx.lineTo(eyeXL + 10, eyeY - 12); ctx.lineTo(eyeXL - 14, eyeY - 24); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(eyeXR + 18, eyeY - 18); ctx.lineTo(eyeXR - 10, eyeY - 6); ctx.lineTo(eyeXR - 10, eyeY - 12); ctx.lineTo(eyeXR + 14, eyeY - 24); ctx.closePath(); ctx.fill();

    ctx.fillStyle = '#0f172a'; ctx.fillRect(80, mouthY, 32, 16);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(82, mouthY + 2, 28, 12);
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(82, mouthY + 8); ctx.lineTo(110, mouthY + 8);
    ctx.moveTo(89, mouthY + 2); ctx.lineTo(89, mouthY + 14);
    ctx.moveTo(96, mouthY + 2); ctx.lineTo(96, mouthY + 14);
    ctx.moveTo(103, mouthY + 2); ctx.lineTo(103, mouthY + 14);
    ctx.stroke();

    ctx.fillStyle = opponentShortsColor; ctx.fillRect(44, 142, 104, 22);
    ctx.fillStyle = opponentBeltColor; ctx.fillRect(44, 142, 8, 22); ctx.fillRect(140, 142, 8, 22);
    ctx.beginPath(); ctx.arc(96, 142, 12, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = opponentBeltDark; ctx.beginPath(); ctx.arc(96, 142, 8, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1e1b4b'; ctx.beginPath();
    ctx.moveTo(91, 144); ctx.lineTo(93, 138); ctx.lineTo(96, 141); ctx.lineTo(99, 138); ctx.lineTo(101, 144);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = getGloveGrad(ctx, 36, 116, 26);
    ctx.beginPath(); ctx.arc(36, 116, 26, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; ctx.beginPath(); ctx.arc(30, 108, 6, 0, Math.PI*2); ctx.fill();

    ctx.fillStyle = getGloveGrad(ctx, 156, 116, 26);
    ctx.beginPath(); ctx.arc(156, 116, 26, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; ctx.beginPath(); ctx.arc(150, 108, 6, 0, Math.PI*2); ctx.fill();

    ctx.restore();
  }

  }

  // --- MAP OPPONENT UNIQUE STORIES AND TACTICAL POWERS ---
  getOpponentTacticalPower(opponentName, tier) {
    const data = {
      "Peoncito": {
        powerName: "Embestida de Cristal",
        desc: "Su bigote falso le otorga un estilo inquebrantable. Al aturdirse, ¡su bigote sale volando de la rabia!",
        quote: "«¡Un peón sin bigote es invisible, pero con estilo!»"
      },
      "Caballo de Ŋ": {
        powerName: "Salto en Ŋ Errático",
        desc: "Lanza golpes saltando en L o en Ŋ. ¡Sus trayectorias no euclidianas esquivan tus bloqueos!",
        quote: "«Geometría rebelde en L... ¡o algo parecido!»"
      },
      "Alfil Exiliado": {
        powerName: "Corte Geométrico",
        desc: "Ataques veloces en diagonales cruzadas. Odia las tablas y ataca sin cesar para desgastarte.",
        quote: "«Reinventando la geometría, paso a paso.»"
      },
      "Torreta": {
        powerName: "Enroque de Acero",
        desc: "Adopta una postura defensiva indestructible que reduce a la mitad el daño recibido.",
        quote: "«He visto demasiadas aperturas y muy pocos finales.»"
      },
      "Sombra del Ring": {
        powerName: "Distorsión del Río Central",
        desc: "Domina las casillas centrales d4, e4, d5, e5. ¡Sus golpes de sombra drenan tu tiempo mental!",
        quote: "«¿Juegas contra mí... o contra tus propios temores?»"
      },
      "Reina Negra": {
        powerName: "Estornudo Alérgico",
        desc: "Sufre alergia crónica al jaque mate. Sus estornudos de pañuelos te lanza brutales ganchos de empuje.",
        quote: "«¡Salud! Digo... ¡Jaque Mate prohibido!»"
      },
      "General Torreón": {
        powerName: "Enroque Blindado",
        desc: "Una muralla defensiva implacable de granito. Prepárate para un combate de alta resistencia.",
        quote: "«La solidez del enroque corto es absoluta.»"
      },
      "Peoncito Dorado": {
        powerName: "Corona de Cristal",
        desc: "Peoncito ha alcanzado la octava fila. Si no lo noqueas rápido, ¡su velocidad aumenta un 50%!",
        quote: "«¡El respeto de las 64 casillas es mío!»"
      },
      "Caballo de Ŋ Salvaje": {
        powerName: "Caos de Casillas Oscuras",
        desc: "Golpes caóticos y ultra veloces que desafían los reflejos humanos. Patrones imposibles.",
        quote: "«¡El salto definitivo sin frenos!»"
      },
      "Alfil Exiliado Pro": {
        powerName: "Fianchetto Cortante",
        desc: "Ráfagas tácticas cruzadas desde las esquinas del ring. Desvía tus golpes con precisión quirúrgica.",
        quote: "«El fianchetto no es una moda, es una ley.»"
      },
      "Torreta de c3": {
        powerName: "Empanada Picante de c3",
        desc: "Se cura salud comiendo empanadas de la Apertura Italiana hiper picantes a mitad del asalto.",
        quote: "«¡Cuidado con el Gambito de Dama sin dama!»"
      },
      "Reina Negra de Tal": {
        powerName: "Bosque Oscuro de Tal",
        desc: "Sacrifica su propia vida para infligir daño triplicado. Te llevará a un bosque donde 2+2=5.",
        quote: "«Llevemos al rival a un bosque oscuro y sin salida.»"
      },
      "Alfil Exiliado Final": {
        powerName: "Diagonal Infinita",
        desc: "Cada golpe recibido te robará 3 segundos adicionales en tu reloj de ajedrez para la siguiente ronda.",
        quote: "«La geometría final no tiene fin.»"
      },
      "General de Judit": {
        powerName: "Precisión de Judit",
        desc: "Precisión de ataque calculada milimétricamente. Rompe tu guardia y golpea donde más duele.",
        quote: "«El ataque absoluto es la mejor defensa.»"
      },
      "Sombra Suprema": {
        powerName: "Stockfish Infinito",
        desc: "Combina el poder de cálculo bruto de una supercomputadora con golpes de velocidad ultrasónica.",
        quote: "«El fin del tablero. 0-1.»"
      }
    };
    
    return data[opponentName] || data[opponentName.replace(" Pro", "").replace(" Salvaje", "").replace(" de c3", "").replace(" de Tal", "").replace(" Final", "").replace(" Dorado", "")] || {
      powerName: "Ataque Maestro",
      desc: "Un oponente formidable con tácticas avanzadas de ajedrez y velocidad superior.",
      quote: "«¡Que gane el mejor estratega!»"
    };
  }

  // --- PLAY RETRO CHIPTUNE SOUND SEQUENCE WITH WEB AUDIO API ---
  playAnimeIntroSound(audioCtx) {
    if (!this.musicEnabled) return;
    const now = audioCtx.currentTime;
    
    // 1. MEGA MAN STYLE FAST ASCENDING ARPEGGIO (Square wave)
    const notes = [
      130.81, 164.81, 196.00, 261.63,
      329.63, 392.00, 523.25, 659.25,
      783.99, 1046.50, 1318.51, 1567.98,
      2093.00
    ];
    
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      
      gain.gain.setValueAtTime(0.08, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.15);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.18);
    });

    // 2. POWERFUL DEEP IMPACT THUD (Sine + Noise) at the climax of the arpeggio
    const impactTime = now + notes.length * 0.05;
    
    const bOsc = audioCtx.createOscillator();
    const bGain = audioCtx.createGain();
    bOsc.type = 'sine';
    bOsc.frequency.setValueAtTime(180, impactTime);
    bOsc.frequency.exponentialRampToValueAtTime(30, impactTime + 0.4);
    
    bGain.gain.setValueAtTime(0.3, impactTime);
    bGain.gain.exponentialRampToValueAtTime(0.0001, impactTime + 0.45);
    
    bOsc.connect(bGain);
    bGain.connect(audioCtx.destination);
    bOsc.start(impactTime);
    bOsc.stop(impactTime + 0.5);

    // Exploding Crash Noise
    const bufferSize = audioCtx.sampleRate * 0.4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 1.0;
    
    const nGain = audioCtx.createGain();
    nGain.gain.setValueAtTime(0.12, impactTime);
    nGain.gain.exponentialRampToValueAtTime(0.0001, impactTime + 0.38);
    
    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(audioCtx.destination);
    
    noise.start(impactTime);
    noise.stop(impactTime + 0.4);

    // 3. RETRO ALERT SOUNDS (Blinking pulses after impact)
    for (let i = 0; i < 3; i++) {
      const alertTime = impactTime + 0.5 + i * 0.3;
      const aOsc = audioCtx.createOscillator();
      const aGain = audioCtx.createGain();
      aOsc.type = 'triangle';
      aOsc.frequency.setValueAtTime(440, alertTime);
      aOsc.frequency.setValueAtTime(660, alertTime + 0.08);
      
      aGain.gain.setValueAtTime(0.05, alertTime);
      aGain.gain.exponentialRampToValueAtTime(0.0001, alertTime + 0.2);
      
      aOsc.connect(aGain);
      aGain.connect(audioCtx.destination);
      
      aOsc.start(alertTime);
      aOsc.stop(alertTime + 0.25);
    }
  }

  // --- INIT STOCKFISH WEB WORKER WITH CORS-BYPASS ---

  initStockfishWorker() {
    this.destroyWorker();
    
    const stockfishUrl = 'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js';
    
    // Try to load via Blob fetch to bypass Web Worker cross-origin policies
    fetch(stockfishUrl)
      .then(response => {
        if (!response.ok) throw new Error("Offline or CDN block");
        return response.text();
      })
      .then(code => {
        const blob = new Blob([code], { type: 'application/javascript' });
        this.stockfishWorker = new Worker(URL.createObjectURL(blob));
        this.engineType = 'stockfish';
        console.log("Stockfish Engine loaded successfully via Web Worker.");
        
        // Initial setup commands
        this.stockfishWorker.postMessage('uci');
        this.stockfishWorker.postMessage('isready');
        
        // Adjust engine skill level based on level definition & difficulty
        const currentLevel = this.levels[this.currentLevelIndex];
        let skillLevel = Math.min(20, Math.max(1, Math.round(currentLevel.elo / 150)));
        if (this.selectedDifficulty === 'easy') skillLevel = Math.max(1, skillLevel - 3);
        if (this.selectedDifficulty === 'hard') skillLevel = Math.min(20, skillLevel + 3);
        if (this.selectedDifficulty === 'martina') skillLevel = 20; // Full grandmaster
        
        this.stockfishWorker.postMessage(`setoption name Skill Level value ${skillLevel}`);
      })
      .catch(err => {
        console.warn("Failed to load Stockfish Web Worker. Falling back to inline Local Engine.", err);
        this.engineType = 'local';
        // Instantiate our inline ChessDuel engine fallback
        this.localEngine = new window.ChessDuel(null, this.onChessWin.bind(this), this.onChessLose.bind(this));
      });
  }

  destroyWorker() {
    if (this.stockfishWorker) {
      this.stockfishWorker.terminate();
      this.stockfishWorker = null;
    }
  }

  // --- FLOW: ROUND ROUTING ---
  startRound() {
    // Stop intervals
    clearInterval(this.chessClockInterval);
    clearInterval(this.boxingTimer);

    if (this.currentRound > 6) {
      this.endGameByPoints();
      return;
    }

    this.hitsLandedThisRound = 0;
    this.hitsReceivedThisRound = 0;

    // Show dynamic transition modal first
    this.showTransitionPanel(() => {
      if (this.currentRound % 2 === 1) {
        // Odd rounds = Boxing
        this.startBoxingPhase();
      } else {
        // Even rounds = Chess
        this.startChessPhase();
      }
    });
  }

  // --- TRANSITION ROUND SCREEN ---
  showTransitionPanel(onComplete) {
    const isBox = this.currentRound % 2 === 1;
    const stageType = isBox ? "🥊 ROUND DE BOXEO 🥊" : "♔ ROUND DE AJEDREZ ♔";
    const accentColor = isBox ? "#ef4444" : "#fbbf24";
    const roundName = `Ronda ${this.currentRound} de 6`;
    
    const currentLevel = this.levels[this.currentLevelIndex];
    const opponentName = currentLevel ? currentLevel.opponentName : "tu oponente";

    // Connecting stats details
    let connectionStatsHTML = '';
    if (this.currentRound > 1) {
      if (isBox) {
        connectionStatsHTML = `
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; margin-bottom: 20px; font-size: 0.9rem;">
            <p style="color: #cbd5e1; margin-bottom: 5px;">Preservación del Tablero:</p>
            <span style="color: #fbbf24; font-weight:700;">El estado de tus piezas se mantiene intacto.</span>
          </div>
        `;
      } else {
        // Chess round incoming, show time penalties calculated from boxing hits!
        const playerPenalty = this.hitsReceivedThisRound * 0.5;
        const opponentPenalty = this.hitsLandedThisRound * 0.5;
        
        // Apply penalties to clocks (ensure clocks don't drop below 90 seconds floor!)
        this.playerChessClock = Math.max(90000, this.playerChessClock - playerPenalty * 1000);
        this.opponentChessClock = Math.max(90000, this.opponentChessClock - opponentPenalty * 1000);

        connectionStatsHTML = `
          <div style="background: rgba(239,68,68,0.06); border: 2px dashed rgba(239,68,68,0.25); border-radius: 15px; padding: 15px; margin-bottom: 20px; text-align: left;">
            <h4 style="color: #fca5a5; margin-bottom: 8px; text-align: center;">⚡ Penalización de Tiempo ⚡</h4>
            <div style="display:flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 6px;">
              <span>Recibiste <b>${this.hitsReceivedThisRound}</b> golpes:</span>
              <span style="color: #f87171; font-weight: 800;">-${playerPenalty}s a tu Reloj</span>
            </div>
            <div style="display:flex; justify-content: space-between; font-size: 0.9rem;">
              <span>Conectaste <b>${this.hitsLandedThisRound}</b> golpes:</span>
              <span style="color: #4ade80; font-weight: 800;">-${opponentPenalty}s al Reloj rival</span>
            </div>
          </div>
        `;
      }
    }

    this.container.innerHTML = `
      <div class="transition-overlay" style="animation: fadeIn 0.4s ease-out forwards;">
        <div class="transition-panel" style="border-top: 5px solid ${accentColor}">
          <span class="round-badge" style="background: ${accentColor}">${roundName}</span>
          <h2 style="color: ${accentColor}; font-size: 1.8rem; margin: 15px 0;">${stageType}</h2>
          <p style="color: #94a3b8; font-size: 0.95rem; margin-bottom: 20px; line-height: 1.5;">
            ${isBox 
              ? `¡Ponte la guardia! Esquiva los ganchos de ${opponentName} y conecta golpes para fundir su reloj mental en la siguiente ronda.` 
              : "¡Cabeza fría! Juega al ajedrez bajo el límite de tu reloj. Si tu tiempo llega a 0 serás derrotado por K.O. Técnico."}
          </p>

          ${connectionStatsHTML}

          <div style="display:flex; justify-content: space-around; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.05);">
            <div>
              <span style="display:block; font-size: 0.75rem; color:#94a3b8; text-transform: uppercase;">Salud Martina</span>
              <span style="font-size: 1.25rem; font-weight:800; color:#4ade80;">❤️ ${Math.round(this.playerHealth)}%</span>
            </div>
            <div>
              <span style="display:block; font-size: 0.75rem; color:#94a3b8; text-transform: uppercase;">Salud Oponente</span>
              <span style="font-size: 1.25rem; font-weight:800; color:#ef4444;">❤️ ${Math.round(this.opponentHealth)}%</span>
            </div>
            <div>
              <span style="display:block; font-size: 0.75rem; color:#94a3b8; text-transform: uppercase;">Tu Reloj Chess</span>
              <span style="font-size: 1.25rem; font-weight:800; color:#38bdf8;">⏱️ ${this.formatClock(this.playerChessClock)}</span>
            </div>
          </div>

          <button class="btn btn-game-screen" id="btn-start-round" style="background: ${accentColor}; font-weight: 800; border-color:${accentColor}; animation: pulse 1.5s infinite alternate;">
            ¡Entrar a la Arena! ➔
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-start-round').addEventListener('click', () => {
      window.GameAudio.playSuccess();
      onComplete();
    });
  }

  // ===================================================================
  // FASE A: BOXEO RETRO 2D (PHASER 3)
  // ===================================================================
  startBoxingPhase() {
    this.boxingTimeLeft = 30; // 30 seconds boxing
    
    // Start boxing chiptune music
    this.startMusic('boxing');
    this.playBell();

    this.container.innerHTML = `
      <div class="empanadas-container">
        <div class="empanadas-top-bar">
          <button class="btn-close-modal" id="btn-boxing-quit" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">
            ← Rendirse ✕
          </button>
          
          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="timer-box" id="chessbox-btn-mute" style="cursor: pointer; background: rgba(0,0,0,0.4); border-color: var(--glass-border); color: white;">
              ${this.musicEnabled ? '🔊 Sonido' : '🔇 Mute'}
            </button>
            <div class="timer-box" id="boxing-timer-box">
              <span>⏱️ TIEMPO:</span> <span id="boxing-timer-val">30s</span>
            </div>
            <div class="score-box" style="border-color: #ef4444;">
              <span>🥊 GOLPES:</span> <span id="boxing-punches-val">L: 0 | R: 0</span>
            </div>
          </div>
        </div>

        ${this.isMobile ? `
        <!-- Mobile: floating mini-HUD inside canvas -->
        <div style="position: absolute; top: 4px; left: 50%; transform: translateX(-50%); z-index: 20; display: flex; gap: 6px; pointer-events: none;">
          <span style="background: rgba(0,0,0,0.35); color: #fff; font-size: 0.55rem; padding: 2px 6px; border-radius: 6px; font-family: Outfit, sans-serif;" id="mobile-timer">⏱ 30s</span>
          <span style="background: rgba(0,0,0,0.35); color: #f87171; font-size: 0.55rem; padding: 2px 6px; border-radius: 6px; font-family: Outfit, sans-serif;" id="mobile-punches">🥊 0/0</span>
        </div>
        ` : ''}

        <div class="empanadas-layout" style="flex-direction: column; align-items: center;">
          <!-- Phaser Canvas container -->
          <div class="mario-canvas-container" id="phaser-boxing-parent" style="border: ${this.isMobile ? 'none' : '4px solid #ef4444'}; border-radius: ${this.isMobile ? '0' : '16px'}; background: #000; overflow:hidden; position:relative;">
            
            <!-- Super Power HUD Overlays -->
            <div style="position: absolute; top: ${this.isMobile ? '4px' : '12px'}; left: ${this.isMobile ? '4px' : '12px'}; width: ${this.isMobile ? '90px' : '195px'}; background: rgba(15,23,42,0.7); padding: ${this.isMobile ? '2px 4px' : '6px 10px'}; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.4); text-align: left; font-family: 'Outfit', sans-serif; pointer-events: none; z-index: 10;">
              <span style="font-size: 0.55rem; color: #38bdf8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; display:${this.isMobile ? 'none' : 'block'}; white-space: nowrap;">⚡ DEMPSEY ROLL</span>
              <div style="width: 100%; height: ${this.isMobile ? '5px' : '8px'}; background: rgba(255,255,255,0.15); border-radius: 3px; overflow: hidden; margin-top: ${this.isMobile ? '0' : '4px'}; border: 1px solid rgba(255,255,255,0.05);">
                <div id="super-player-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #38bdf8, #2563eb); transition: width 0.15s ease-out;"></div>
              </div>
              <span id="super-player-ready" style="font-size: 0.5rem; color: #fbbf24; display: none; font-weight: 900; animation: pulse 0.8s infinite alternate; margin-top: 2px;">⚡</span>
            </div>

            <div style="position: absolute; top: ${this.isMobile ? '4px' : '12px'}; right: ${this.isMobile ? '4px' : '12px'}; width: ${this.isMobile ? '90px' : '195px'}; background: rgba(15,23,42,0.7); padding: ${this.isMobile ? '2px 4px' : '6px 10px'}; border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.4); text-align: right; font-family: 'Outfit', sans-serif; pointer-events: none; z-index: 10;">
              <span style="font-size: 0.55rem; color: #f87171; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; display:${this.isMobile ? 'none' : 'block'}; white-space: nowrap;">🏰 ENROQUE DESTRUCTOR</span>
              <div style="width: 100%; height: ${this.isMobile ? '5px' : '8px'}; background: rgba(255,255,255,0.15); border-radius: 3px; overflow: hidden; margin-top: ${this.isMobile ? '0' : '4px'}; border: 1px solid rgba(255,255,255,0.05); direction: rtl;">
                <div id="super-opponent-bar" style="width: 0%; height: 100%; background: linear-gradient(270deg, #ef4444, #b91c1c); transition: width 0.15s ease-out;"></div>
              </div>
              <span id="super-opponent-ready" style="font-size: 0.5rem; color: #f43f5e; display: none; font-weight: 900; animation: pulse 0.8s infinite alternate; margin-top: 2px;">🔥</span>
            </div>

            <!-- Health Bars Overlay — compact -->
            <div style="position: absolute; top: ${this.isMobile ? '16px' : '62px'}; left: ${this.isMobile ? '4px' : '12px'}; width: ${this.isMobile ? '90px' : '170px'}; display: flex; align-items: center; gap: ${this.isMobile ? '3px' : '6px'}; pointer-events: none; z-index: 10;">
              <div style="flex: 1; height: ${this.isMobile ? '3px' : '5px'}; background: rgba(0,0,0,0.5); border-radius: 2px; overflow: hidden; border: 1px solid rgba(74,222,128,0.2);">
                <div id="health-player-bar" style="width: 100%; height: 100%; background: #4ade80; transition: width 0.3s ease-out; border-radius: 2px;"></div>
              </div>
              <span id="health-player-text" style="font-size: 0.5rem; color: #4ade80; font-weight: 800; min-width: auto;">100%</span>
            </div>

            <div style="position: absolute; top: ${this.isMobile ? '16px' : '62px'}; right: ${this.isMobile ? '4px' : '12px'}; width: ${this.isMobile ? '90px' : '170px'}; display: flex; align-items: center; gap: ${this.isMobile ? '3px' : '6px'}; flex-direction: row-reverse; pointer-events: none; z-index: 10;">
              <div style="flex: 1; height: ${this.isMobile ? '3px' : '5px'}; background: rgba(0,0,0,0.5); border-radius: 2px; overflow: hidden; border: 1px solid rgba(239,68,68,0.2);">
                <div id="health-opponent-bar" style="width: 100%; height: 100%; background: #ef4444; transition: width 0.3s ease-out; border-radius: 2px;"></div>
              </div>
              <span id="health-opponent-text" style="font-size: 0.5rem; color: #f87171; font-weight: 800; min-width: auto;">100%</span>
            </div>

            <!-- Mobile overlay controllers — two-thumb layout -->
            <div class="mario-touch-pad chessbox-touch-pad" style="z-index: 15;">
              <div class="touch-group touch-group-left">
                <div class="touch-dpad">
                  <div class="touch-btn touch-block" id="btn-block-guard">🛡<span class="touch-label">Bloquear</span></div>
                  <div class="touch-btn touch-dodge-l" id="btn-dodge-l">◀<span class="touch-label">Esquivar</span></div>
                  <div class="touch-dpad-spacer"></div>
                  <div class="touch-btn touch-dodge-r" id="btn-dodge-r"><span class="touch-label">Esquivar</span>▶</div>
                </div>
              </div>
              <div class="touch-group touch-group-right">
                <div class="touch-btn touch-punch-l" id="btn-punch-l">A<span class="touch-label">Jab</span></div>
                <div class="touch-btn touch-super" id="btn-super">⚡<span class="touch-label">Super</span></div>
                <div class="touch-btn touch-punch-r" id="btn-punch-r">D<span class="touch-label">Cross</span></div>
              </div>
            </div>
          </div>
          
          <p style="font-size: 0.82rem; color: #94a3b8; margin-top: 8px;" class="kb-hint">
            <b>Teclado</b>: <kbd>◀</kbd> Esquivar Izq | <kbd>▶</kbd> Esquivar Der | <kbd>W</kbd> Bloquear | <kbd>A</kbd> Golpe Izq | <kbd>D</kbd> Golpe Der | <kbd>␣</kbd> ⚡ DEMPSEY ROLL
          </p>
        </div>
      </div>
    `;

    document.getElementById('btn-boxing-quit').addEventListener('click', () => {
      this.gameOver("Te has rendido durante la ronda de boxeo. 😞");
    });

    document.getElementById('chessbox-btn-mute').addEventListener('click', () => {
      this.toggleMute();
    });

    // Start Phaser Game
    this.loadPhaser(() => {
      this.initPhaserBoxing();
    });
  }

  // --- INITIALIZE PHASER SCENE FOR BOXING ---
  initPhaserBoxing() {
    if (this.phaserGame) {
      this.phaserGame.destroy(true);
      this.phaserGame = null;
    }

    const self = this;
    const currentLevel = this.levels[this.currentLevelIndex];
    
    // Difficulty modifier for boxing oponent stats
    let speedMod = 1.0;
    let hpMod = 1.0;
    if (this.selectedDifficulty === 'easy') { speedMod = 1.3; hpMod = 0.8; }
    if (this.selectedDifficulty === 'hard') { speedMod = 0.85; hpMod = 1.25; }
    if (this.selectedDifficulty === 'martina') { speedMod = 0.70; hpMod = 1.5; }

    const finalPunchSpeed = currentLevel.punchSpeed * speedMod;
    const maxOpponentHP = Math.round(currentLevel.hp * hpMod * 2.5); // balanced to 2.5x to prevent first-round K.O.s and force playing chess!

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 450,
      parent: 'phaser-boxing-parent',
      backgroundColor: '#111827',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 450
      },
      physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
      },
      scene: {
        key: 'boxing',
        create: function() {
          const scene = this;
          
          // Render dynamically created retro textures
          self.renderBoxingTextures(scene);

          // Render 2D retro ring boxing ropes and corners using lines
          scene.ringGraphics = scene.add.graphics();
          self.drawRetroRingBackground(scene.ringGraphics, currentLevel.color);

          // Opponent (General Torreón) at the center top
          scene.opponent = scene.add.sprite(400, 180, 'opp-idle');
          scene.opponent.setOrigin(0.5, 0.5);
          scene.opponent.setScale(0.6);

          // Opponent idle breathing
          scene.oppBreathingTween = scene.tweens.add({
            targets: scene.opponent,
            scaleX: 0.62,
            scaleY: 0.58,
            duration: 1300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });

          scene.opponentHP = Math.max(1, Math.round((self.opponentHealth / 100) * maxOpponentHP));
          scene.opponentMaxHP = maxOpponentHP;

          // Player (Martina boxing back-silhouette) at the center bottom
          scene.player = scene.add.sprite(400, 350, 'player-idle');
          scene.player.setOrigin(0.5, 0.5);
          scene.player.setScale(0.65);

          // Idle breathing animation — subtle scale pulse for living feel
          scene.breathingTween = scene.tweens.add({
            targets: scene.player,
            scaleX: 0.67,
            scaleY: 0.63,
            duration: 1100,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });

          // Interactive overlays
          scene.starsEffect = scene.add.text(400, 80, '', { font: '40px Outfit, sans-serif', fill: '#fbbf24' }).setOrigin(0.5);
          scene.damageFlash = scene.add.graphics();

          // Combat states
          scene.playerState = 'idle'; // 'idle', 'dodging-l', 'dodging-r', 'blocking', 'punching-l', 'punching-r', 'hit', 'stunned'
          scene.opponentState = 'idle'; // 'idle', 'telegraphing-l', 'telegraphing-r', 'punching-l', 'punching-r', 'stunned', 'ko'
          scene.opponentStunnedTimer = 0;
          
          // Action mapping
          scene.keys = scene.input.keyboard.addKeys({
            dodgeL: Phaser.Input.Keyboard.KeyCodes.LEFT,
            dodgeR: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            block: Phaser.Input.Keyboard.KeyCodes.W,
            punchL: Phaser.Input.Keyboard.KeyCodes.A,
            punchR: Phaser.Input.Keyboard.KeyCodes.D,
            super: Phaser.Input.Keyboard.KeyCodes.SPACE
          });

          // Touch inputs binders
          const bindTouch = (id, callback) => {
            const el = document.getElementById(id);
            if (el) {
              el.addEventListener('mousedown', (e) => { e.preventDefault(); callback(); });
              el.addEventListener('touchstart', (e) => { e.preventDefault(); callback(); });
            }
          };

          bindTouch('btn-dodge-l', () => scene.executePlayerAction('dodgeL'));
          bindTouch('btn-dodge-r', () => scene.executePlayerAction('dodgeR'));
          bindTouch('btn-block-guard', () => scene.executePlayerAction('block'));
          bindTouch('btn-punch-l', () => scene.executePlayerAction('punchL'));
          bindTouch('btn-punch-r', () => scene.executePlayerAction('punchR'));
          bindTouch('btn-super', () => scene.executePlayerAction('super'));

          // Opponent Attack cycle loops
          scene.nextAttackTime = scene.time.now + 1000 + Math.random() * 1500;

          // Unleash Martina's legendary Super Dempsey Roll!
          scene.executeDempseyRoll = () => {
            self.playerSuperPower = 0;
            scene.playerState = 'dempsey';
            self.updateBoxingTopBar();
            
            window.GameAudio.playVictory(); // Triumphant bell sound!
            self.playCrowdCheer();
            scene.cameras.main.flash(200, 56, 189, 248, 0.4); // neon blue flash
            scene.addTextEffect(400, 310, "🌀 ¡DEMPSEY ROLL! 🌀", "#38bdf8");
            
            // Phase 1: Rapid figure-8 evasive weaves!
            scene.player.setTexture('player-dodge-l');
            scene.tweens.add({
              targets: scene.player,
              x: 280, y: 360,
              duration: 120,
              yoyo: true,
              onComplete: () => {
                scene.player.setTexture('player-dodge-r');
                scene.tweens.add({
                  targets: scene.player,
                  x: 520, y: 360,
                  duration: 120,
                  yoyo: true,
                  onComplete: () => {
                    // Phase 2: Unleash high-speed hook flurry!
                    let punchCount = 0;
                    const throwHook = () => {
                      if (punchCount >= 5 || scene.opponentState === 'ko') {
                        scene.player.setTexture('player-idle');
                        scene.player.x = 400; scene.player.y = 350;
                        scene.playerState = 'idle';
                        self.updateBoxingTopBar();
                        return;
                      }
                      
                      punchCount++;
                      const side = punchCount % 2 === 0 ? 'left' : 'right';
                      scene.player.setTexture(side === 'left' ? 'player-punch-l' : 'player-punch-r');
                      scene.player.x = side === 'left' ? 370 : 430;
                      scene.player.y = 300;
                      
                      scene.cameras.main.shake(80, 0.015);
                      
                      // Massive unblockable damage! (Balanced from 16 to 8 for satisfying yet fair K.O. potential!)
                      scene.opponentHP = Math.max(0, scene.opponentHP - 8.0);
                      self.opponentHealth = Math.max(0, (scene.opponentHP / scene.opponentMaxHP) * 100);
                      window.GameAudio.playSuccess();
                      scene.spawnSparkleParticles(400, 160, '#38bdf8');
                      scene.addTextEffect(400, 140, "🥊 FLURRY HOOK! 🥊", "#fbbf24");
                      
                      // Opponent recoil
                      scene.opponentState = 'hit';
                      scene.opponent.setTexture('opp-stunned');
                      scene.tweens.add({
                        targets: scene.opponent,
                        x: 400 + (side === 'left' ? 30 : -30),
                        y: 170,
                        duration: 80,
                        yoyo: true
                      });
                      
                      self.updateBoxingTopBar();
                      
                      if (scene.opponentHP <= 0) {
                        scene.triggerOpponentKO();
                      } else {
                        scene.time.delayedCall(120, throwHook);
                      }
                    };
                    throwHook();
                  }
                });
              }
            });
          };

          // Unleash General's ultimate super: Enroque Destructor!
          scene.executeOpponentEnroque = () => {
            self.opponentSuperPower = 0;
            scene.opponentState = 'enroque';
            self.updateBoxingTopBar();
            
            window.GameAudio.playError(); // Alarm sound!
            self.playCrowdGasp();
            scene.cameras.main.flash(200, 239, 68, 68, 0.4); // neon red flash
            scene.addTextEffect(400, 140, "🏰 ¡ENROQUE DESTRUCTOR! 🏰", "#f43f5e");
            
            // Phase 1: Retreat to defensive castle cover (castling depth!)
            scene.tweens.add({
              targets: scene.opponent,
              y: 120,
              scaleX: 0.45, scaleY: 0.45,
              duration: 450,
              onComplete: () => {
                // Charge forward in unstoppable rook stampede crusher!
                scene.opponent.setTexture('opp-idle'); // serious expression
                scene.tweens.add({
                  targets: scene.opponent,
                  y: 260,
                  scaleX: 0.85, scaleY: 0.85,
                  duration: 200,
                  yoyo: true,
                  onComplete: () => {
                    scene.opponent.y = 180;
                    scene.opponent.setScale(0.6);
                    if (scene.opponentState !== 'ko' && scene.opponentState !== 'stunned') {
                      scene.opponentState = 'idle';
                      scene.opponent.setTexture('opp-idle');
                      scene.nextAttackTime = scene.time.now + 1500;
                    }
                  }
                });
                
                // Impact calculations after charge delay
                scene.time.delayedCall(160, () => {
                  scene.checkEnroqueImpact();
                });
              }
            });
          };

          // Check if Enroque Destructor hits player
          scene.checkEnroqueImpact = () => {
            if (scene.playerState === 'dodging-l' || scene.playerState === 'dodging-r') {
              scene.addTextEffect(400, 310, "💨 ¡ESQUIVA CRÍTICA!", "#4ade80");
              scene.spawnSparkleParticles(400, 340, '#4ade80');
            } else if (scene.playerState === 'blocking') {
              // Guard completely broken! Martina takes partial damage and brief recoil
              self.playerHealth = Math.max(0, self.playerHealth - 12);
              window.GameAudio.playError();
              scene.addTextEffect(400, 310, "🛡️ ¡GUARDIA ROTA! (-12)", "#fbbf24");
              scene.cameras.main.shake(120, 0.015);
              
              scene.playerState = 'hit';
              scene.player.y = 370;
              scene.tweens.add({
                targets: scene.player,
                y: 350,
                duration: 350,
                onComplete: () => { scene.playerState = 'idle'; }
              });
              
              if (self.playerHealth <= 0) {
                scene.playerState = 'stunned';
                self.gameOver("¡Tu guardia fue destruida por el Enroque del General! 😞");
              }
            } else {
              // Clean impact! Severe damage taken!
              self.playerHealth = Math.max(0, self.playerHealth - 25);
              window.GameAudio.playError();
              scene.addTextEffect(400, 310, "💥 ¡IMPACTO CRÍTICO! (-25)", "#ef4444");
              scene.cameras.main.shake(200, 0.035);
              
              scene.playerState = 'hit';
              scene.player.y = 385; // knocked down heavily
              scene.tweens.add({
                targets: scene.player,
                y: 350,
                duration: 450,
                onComplete: () => { scene.playerState = 'idle'; }
              });
              
              if (self.playerHealth <= 0) {
                scene.playerState = 'stunned';
                self.gameOver("¡Fuiste noqueado por la apisonadora del Enroque Destructor! 😞");
              }
          }
            self.updateBoxingTopBar();
          };

          // Unleash Queen's ultimate super: Estornudo Alérgico!
          scene.executeOpponentSneeze = () => {
            self.opponentSuperPower = 0;
            scene.opponentState = 'super';
            self.updateBoxingTopBar();
            
            window.GameAudio.playError();
            self.playCrowdGasp();
            scene.cameras.main.flash(200, 236, 72, 153, 0.4); // purple flash
            scene.addTextEffect(400, 140, "🤧 ¡ESTORNUDO ALÉRGICO! 🤧", "#ec4899");
            
            // Phase 1: Sneezing wind-up (retreats slightly, shakes)
            scene.tweens.add({
              targets: scene.opponent,
              y: 150,
              scaleX: 0.55, scaleY: 0.55,
              duration: 400,
              yoyo: true,
              onComplete: () => {
                // Sneeze impact!
                scene.opponent.setTexture('opp-punch-l');
                scene.tweens.add({
                  targets: scene.opponent,
                  y: 200,
                  duration: 150,
                  yoyo: true,
                  onComplete: () => {
                    scene.opponent.y = 180;
                    scene.opponent.setScale(0.6);
                    if (scene.opponentState !== 'ko' && scene.opponentState !== 'stunned') {
                      scene.opponentState = 'idle';
                      scene.opponent.setTexture('opp-idle');
                      scene.nextAttackTime = scene.time.now + 1500;
                    }
                  }
                });
                
                // Impact calculations
                if (scene.playerState === 'blocking') {
                  // Sneezing ignores blocks, blows player away!
                  self.playerHealth = Math.max(0, self.playerHealth - 15);
                  window.GameAudio.playError();
                  scene.addTextEffect(400, 310, "💨 ¡VIENTO ALÉRGICO! (-15)", "#ec4899");
                  scene.cameras.main.shake(150, 0.02);
                  scene.playerState = 'hit';
                  scene.player.y = 380;
                  scene.tweens.add({
                    targets: scene.player,
                    y: 350,
                    duration: 400,
                    onComplete: () => { scene.playerState = 'idle'; }
                  });
                } else if (scene.playerState === 'dodging-l' || scene.playerState === 'dodging-r') {
                  scene.addTextEffect(400, 310, "💨 ¡ESQUIVA IMPECABLE!", "#4ade80");
                } else {
                  // Direct impact!
                  self.playerHealth = Math.max(0, self.playerHealth - 25);
                  window.GameAudio.playError();
                  scene.addTextEffect(400, 310, "💥 ¡SOPLO MÁXIMO! (-25)", "#ef4444");
                  scene.cameras.main.shake(200, 0.03);
                  scene.playerState = 'hit';
                  scene.player.y = 390;
                  scene.tweens.add({
                    targets: scene.player,
                    y: 350,
                    duration: 500,
                    onComplete: () => { scene.playerState = 'idle'; }
                  });
                }
                
                if (self.playerHealth <= 0) {
                  self.gameOver("¡Fuiste barrido por el estornudo de la Reina Negra! 🤧");
                }
                self.updateBoxingTopBar();
              }
            });
          };

          // Unleash Shadow's ultimate super: Robo de Tiempo!
          scene.executeOpponentTimeTheft = () => {
            self.opponentSuperPower = 0;
            scene.opponentState = 'super';
            self.updateBoxingTopBar();
            
            window.GameAudio.playError();
            self.playCrowdGasp();
            scene.cameras.main.flash(200, 168, 85, 247, 0.4); // deep purple flash
            scene.addTextEffect(400, 140, "⏳ ¡TRAMPA DEL TIEMPO! ⏳", "#a855f7");
            
            scene.tweens.add({
              targets: scene.opponent,
              scaleX: 0.8, scaleY: 0.8,
              duration: 300,
              yoyo: true,
              onComplete: () => {
                // Punch lunging forward
                scene.opponent.setTexture('opp-punch-r');
                scene.tweens.add({
                  targets: scene.opponent,
                  y: 220,
                  duration: 150,
                  yoyo: true,
                  onComplete: () => {
                    scene.opponent.y = 180;
                    scene.opponent.setScale(0.6);
                    if (scene.opponentState !== 'ko' && scene.opponentState !== 'stunned') {
                      scene.opponentState = 'idle';
                      scene.opponent.setTexture('opp-idle');
                      scene.nextAttackTime = scene.time.now + 1500;
                    }
                  }
                });
                
                // Impact calculations
                if (scene.playerState === 'dodging-l' || scene.playerState === 'dodging-r') {
                  scene.addTextEffect(400, 310, "💨 ¡TIEMPO ESQUIVADO!", "#4ade80");
                } else {
                  // Hit lands! Drains EITHER blocks OR direct hits, and takes 15 seconds from player chess clock!
                  const timeLost = 15000; // 15 seconds
                  self.playerChessClock = Math.max(90000, self.playerChessClock - timeLost); // floor at 90s
                  self.playerHealth = Math.max(0, self.playerHealth - (scene.playerState === 'blocking' ? 5 : 15));
                  
                  window.GameAudio.playError();
                  scene.cameras.main.shake(120, 0.015);
                  scene.addTextEffect(400, 310, "⏳ ¡TIEMPO ROBADO! (-15s ajedrez)", "#f87171");
                  
                  scene.playerState = 'hit';
                  scene.player.y = 370;
                  scene.tweens.add({
                    targets: scene.player,
                    y: 350,
                    duration: 300,
                    onComplete: () => { scene.playerState = 'idle'; }
                  });
                }
                
                if (self.playerHealth <= 0) {
                  self.gameOver("¡La Sombra del Ring absorbió tu energía vital! 😞");
                }
                self.updateBoxingTopBar();
              }
            });
          };

          // Unleash Knight's ultimate super: Salto Errático!
          scene.executeOpponentKnightJump = () => {
            self.opponentSuperPower = 0;
            scene.opponentState = 'super';
            self.updateBoxingTopBar();
            
            window.GameAudio.playError();
            scene.addTextEffect(400, 140, "🐎 ¡GOLPE DE Ŋ SALVAJE! 🐎", "#fbbf24");
            
            // Jumps to the left high, then descends diagonally to the right!
            scene.tweens.add({
              targets: scene.opponent,
              x: 280, y: 120,
              duration: 300,
              onComplete: () => {
                scene.opponent.setTexture('opp-punch-l');
                scene.tweens.add({
                  targets: scene.opponent,
                  x: 520, y: 220,
                  duration: 200,
                  yoyo: true,
                  onComplete: () => {
                    scene.opponent.x = 400; scene.opponent.y = 180;
                    scene.opponent.setScale(0.6);
                    if (scene.opponentState !== 'ko' && scene.opponentState !== 'stunned') {
                      scene.opponentState = 'idle';
                      scene.opponent.setTexture('opp-idle');
                      scene.nextAttackTime = scene.time.now + 1500;
                    }
                  }
                });
                
                // Impact calculations: Player must dodge LEFT to escape the diagonal swoop
                if (scene.playerState === 'dodging-l') {
                  scene.addTextEffect(400, 310, "💨 ¡ESQUIVA MAESTRA DE Ŋ!", "#4ade80");
                } else {
                  self.playerHealth = Math.max(0, self.playerHealth - (scene.playerState === 'blocking' ? 8 : 20));
                  window.GameAudio.playError();
                  scene.addTextEffect(400, 310, "💥 ¡SABLAZO EN L! (-20)", "#ef4444");
                  scene.cameras.main.shake(150, 0.02);
                  scene.playerState = 'hit';
                  scene.player.y = 375;
                  scene.tweens.add({
                    targets: scene.player,
                    y: 350,
                    duration: 350,
                    onComplete: () => { scene.playerState = 'idle'; }
                  });
                }
                
                if (self.playerHealth <= 0) {
                  self.gameOver("¡El Caballo de Ŋ te noqueó con su salto de geometría! 🐎");
                }
                self.updateBoxingTopBar();
              }
            });
          };

          // Unleash Bishop's ultimate super: Corte Diagonal!
          scene.executeOpponentBishopSlash = () => {
            self.opponentSuperPower = 0;
            scene.opponentState = 'super';
            self.updateBoxingTopBar();
            
            window.GameAudio.playError();
            scene.addTextEffect(400, 140, "📐 ¡CORTE GEOMÉTRICO! 📐", "#a855f7");
            
            // Fades or teleports side-to-side, then slashes!
            scene.tweens.add({
              targets: scene.opponent,
              x: 500, y: 140,
              duration: 250,
              onComplete: () => {
                scene.opponent.setTexture('opp-punch-r');
                scene.tweens.add({
                  targets: scene.opponent,
                  x: 300, y: 220,
                  duration: 180,
                  yoyo: true,
                  onComplete: () => {
                    scene.opponent.x = 400; scene.opponent.y = 180;
                    scene.opponent.setScale(0.6);
                    if (scene.opponentState !== 'ko' && scene.opponentState !== 'stunned') {
                      scene.opponentState = 'idle';
                      scene.opponent.setTexture('opp-idle');
                      scene.nextAttackTime = scene.time.now + 1500;
                    }
                  }
                });
                
                // Impact calculations: Player must dodge RIGHT to escape the diagonal swoop
                if (scene.playerState === 'dodging-r') {
                  scene.addTextEffect(400, 310, "💨 ¡DIAGONAL ESQUIVADA!", "#4ade80");
                } else {
                  self.playerHealth = Math.max(0, self.playerHealth - (scene.playerState === 'blocking' ? 8 : 20));
                  window.GameAudio.playError();
                  scene.addTextEffect(400, 310, "💥 ¡FIANCHETTO BRUTAL! (-20)", "#ef4444");
                  scene.cameras.main.shake(150, 0.02);
                  scene.playerState = 'hit';
                  scene.player.y = 375;
                  scene.tweens.add({
                    targets: scene.player,
                    y: 350,
                    duration: 350,
                    onComplete: () => { scene.playerState = 'idle'; }
                  });
                }
                
                if (self.playerHealth <= 0) {
                  self.gameOver("¡El Alfil Exiliado te rebanó con su diagonal infinita! 📐");
                }
                self.updateBoxingTopBar();
              }
            });
          };

          // Unleash Pawn's ultimate lunge: Envestida de Cristal!
          scene.executeOpponentPawnLunge = () => {
            self.opponentSuperPower = 0;
            scene.opponentState = 'super';
            self.updateBoxingTopBar();
            
            window.GameAudio.playError();
            scene.addTextEffect(400, 140, "⭐ ¡ENVESTIDA DE PEÓN! ⭐", "#38bdf8");
            
            scene.tweens.add({
              targets: scene.opponent,
              y: 150,
              duration: 350,
              onComplete: () => {
                scene.opponent.setTexture('opp-punch-l');
                scene.tweens.add({
                  targets: scene.opponent,
                  y: 230,
                  duration: 150,
                  yoyo: true,
                  onComplete: () => {
                    scene.opponent.y = 180;
                    scene.opponent.setScale(0.6);
                    if (scene.opponentState !== 'ko' && scene.opponentState !== 'stunned') {
                      scene.opponentState = 'idle';
                      scene.opponent.setTexture('opp-idle');
                      scene.nextAttackTime = scene.time.now + 1500;
                    }
                  }
                });
                
                // Impact calculations: blocking works perfectly, but direct hits deal 18
                if (scene.playerState === 'blocking') {
                  self.playerHealth = Math.max(0, self.playerHealth - 3);
                  scene.addTextEffect(400, 310, "🛡️ ¡BLOQUEO EXCELENTE! (-3)", "#4ade80");
                } else if (scene.playerState === 'dodging-l' || scene.playerState === 'dodging-r') {
                  scene.addTextEffect(400, 310, "💨 ¡ESQUIVADO!", "#4ade80");
                } else {
                  self.playerHealth = Math.max(0, self.playerHealth - 18);
                  window.GameAudio.playError();
                  scene.addTextEffect(400, 310, "💥 ¡ENVESTIDA DE CRISTAL! (-18)", "#ef4444");
                  scene.cameras.main.shake(120, 0.015);
                  scene.playerState = 'hit';
                  scene.player.y = 370;
                  scene.tweens.add({
                    targets: scene.player,
                    y: 350,
                    duration: 300,
                    onComplete: () => { scene.playerState = 'idle'; }
                  });
                }
                
                if (self.playerHealth <= 0) {
                  self.gameOver("¡Peoncito te derrotó y se ganó todo el respeto! ⭐");
                }
                self.updateBoxingTopBar();
              }
            });
          };

          // Master Player Action controller
          scene.executePlayerAction = (action) => {
            if (scene.playerState !== 'idle') return;
            
            if (action === 'super') {
              if (self.playerSuperPower === 100) {
                scene.executeDempseyRoll();
              }
            } else if (action === 'dodgeL') {
              scene.playerState = 'dodging-l';
              scene.player.setTexture('player-dodge-l');
              scene.tweens.add({
                targets: scene.player,
                x: 320, y: 360,
                duration: 180,
                yoyo: true,
                onComplete: () => {
                  scene.player.x = 400; scene.player.y = 350;
                  scene.player.setTexture('player-idle');
                  scene.playerState = 'idle';
                }
              });
            } else if (action === 'dodgeR') {
              scene.playerState = 'dodging-r';
              scene.player.setTexture('player-dodge-r');
              scene.tweens.add({
                targets: scene.player,
                x: 480, y: 360,
                duration: 180,
                yoyo: true,
                onComplete: () => {
                  scene.player.x = 400; scene.player.y = 350;
                  scene.player.setTexture('player-idle');
                  scene.playerState = 'idle';
                }
              });
            } else if (action === 'block') {
              scene.playerState = 'blocking';
              scene.player.setTexture('player-block');
              scene.player.y = 360;
              scene.time.delayedCall(250, () => {
                scene.player.setTexture('player-idle');
                scene.player.y = 350;
                scene.playerState = 'idle';
              });
            } else if (action === 'punchL') {
              scene.playerState = 'punching-l';
              scene.player.setTexture('player-punch-l');
              scene.tweens.add({
                targets: scene.player,
                y: 310,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                  scene.player.setTexture('player-idle');
                  scene.playerState = 'idle';
                }
              });
              scene.checkPunchHit('left');
            } else if (action === 'punchR') {
              scene.playerState = 'punching-r';
              scene.player.setTexture('player-punch-r');
              scene.tweens.add({
                targets: scene.player,
                y: 310,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                  scene.player.setTexture('player-idle');
                  scene.playerState = 'idle';
                }
              });
              scene.checkPunchHit('right');
            }
          };

          // Check if player punch lands on oponent
          scene.checkPunchHit = (side) => {
            if (scene.opponentState === 'stunned') {
              // Stunned opponent takes massive critical damage! (balanced from 12 to 8)
              scene.opponentHP -= 8;
              self.playerSuperPower = Math.min(100, self.playerSuperPower + 8); // charge Dempsey (highly balanced rate)
              self.hitsLandedThisRound++;
              self.totalPunchesLanded++;
              window.GameAudio.playSuccess();
              self.playPunchImpact();
              scene.spawnSparkleParticles(400, 160, currentLevel.color);

              // Flash Opponent red and scale briefly
              scene.opponent.setTint(0xff3333); // vibrant red hit flash
              scene.tweens.add({
                targets: scene.opponent,
                alpha: 0.85, // practically solid to prevent showing background ropes!
                scaleX: 0.54, scaleY: 0.54,
                duration: 60,
                yoyo: true,
                repeat: 2,
                onComplete: () => {
                  scene.opponent.clearTint(); // restore original colors!
                  if (scene.opponentState === 'stunned') {
                    scene.opponent.setScale(0.6);
                  }
                }
              });

              // Check if opponent is KO'ed
              self.opponentHealth = Math.max(0, (scene.opponentHP / scene.opponentMaxHP) * 100);
              if (scene.opponentHP <= 0) {
                scene.triggerOpponentKO();
              }
            } else if (scene.opponentState === 'idle') {
              // Idle opponent blocks punches easily
              window.GameAudio.playMove();
              self.playPunchBlocked();
              scene.addTextEffect(400, 140, "¡BLOQUEADO!", "#cbd5e1");
              self.opponentSuperPower = Math.min(100, self.opponentSuperPower + 5); // charge opponent (balanced rate)
            } else if (scene.opponentState === 'telegraphing-l' || scene.opponentState === 'telegraphing-r') {
              // Opponent gets interrupted if caught preparing a punch! Clean hit! (balanced from 8 to 6)
              scene.opponentHP -= 6;
              self.playerSuperPower = Math.min(100, self.playerSuperPower + 10); // massive Dempsey charge (highly balanced rate)
              self.hitsLandedThisRound++;
              self.totalPunchesLanded++;
              window.GameAudio.playSuccess();
              self.playPunchImpact();
              scene.spawnSparkleParticles(400, 160, currentLevel.color);
              
              // Interrupt! Shift state to brief hit recoil, cancel telegraphing!
              scene.opponentState = 'hit';
              scene.opponent.setTexture('opp-stunned'); // hurt/dazed expression
              scene.addTextEffect(400, 140, "💥 ¡INTERRUPCIÓN!", "#facc15");
              
              scene.opponentStunnedTimer = scene.time.now + 350; // flinch recoil for 350ms
              
              // Flinch tween
              scene.tweens.add({
                targets: scene.opponent,
                y: 165,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                  if (scene.opponentState === 'hit') scene.opponent.y = 180;
                }
              });

              self.opponentHealth = Math.max(0, (scene.opponentHP / scene.opponentMaxHP) * 100);
              if (scene.opponentHP <= 0) {
                scene.triggerOpponentKO();
              }
            } else {
              // Hitting punching opponent has no effect or gets blocked
              window.GameAudio.playMove();
              self.playPunchBlocked();
            }
            self.updateBoxingTopBar();
          };

          // Spawn text effects dynamically
          scene.addTextEffect = (x, y, text, color) => {
            const txt = scene.add.text(x, y, text, { font: 'bold 20px Outfit, sans-serif', fill: color }).setOrigin(0.5);
            scene.tweens.add({
              targets: txt,
              y: y - 40,
              alpha: 0,
              duration: 800,
              onComplete: () => txt.destroy()
            });
          };

          // Sparkle emitter
          scene.spawnSparkleParticles = (x, y, color) => {
            for (let i = 0; i < 8; i++) {
              const sparkle = scene.add.ellipse(x, y, 8, 8, Phaser.Display.Color.HexStringToColor(color).color);
              const angle = Math.random() * Math.PI * 2;
              const speed = 100 + Math.random() * 150;
              scene.physics.add.existing(sparkle);
              sparkle.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
              scene.tweens.add({
                targets: sparkle,
                scale: 0.1,
                alpha: 0,
                duration: 400 + Math.random() * 300,
                onComplete: () => sparkle.destroy()
              });
            }
          };

          // Trigger Opponent KO
          scene.triggerOpponentKO = () => {
            self.playCrowdCheer();
            scene.opponentState = 'ko';
            scene.opponent.setTexture('opp-stunned');
            scene.starsEffect.setText('');
            scene.tweens.add({
              targets: scene.opponent,
              y: 280,
              angle: 90,
              alpha: 0,
              duration: 800,
              onComplete: () => {
                self.completeCombatVictory();
              }
            });
          };

          // Trigger player hit (damage taken)
          scene.triggerPlayerHit = (damage, side) => {
            if (scene.playerState === 'blocking') {
              // Block damage reduction
              scene.playerState = 'idle';
              self.playerHealth = Math.max(0, self.playerHealth - damage * 0.2);
              self.playerSuperPower = Math.min(100, self.playerSuperPower + 5); // charge Dempsey (highly balanced rate)
              window.GameAudio.playMove();
              self.playPunchBlocked();
              scene.addTextEffect(400, 310, "🛡️ ¡BLOQUEADO!", "#38bdf8");
              scene.spawnSparkleParticles(400, 340, '#38bdf8');
            } else if ((side === 'left' && scene.playerState === 'dodging-l') || 
                       (side === 'right' && scene.playerState === 'dodging-r')) {
              // Dodged perfectly!
              scene.addTextEffect(400, 310, "💨 ¡ESQUIVADO!", "#4ade80");
              self.playerSuperPower = Math.min(100, self.playerSuperPower + 15); // massive Dempsey dodge charge (highly balanced rate)
              
              // Opponent gets stunned for counter-attack
              scene.opponentState = 'stunned';
              scene.opponent.setTexture('opp-stunned');
              scene.starsEffect.setText("💫💫💫");
              scene.opponentStunnedTimer = scene.time.now + 1200;
            } else {
              // Clean impact! Player takes damage and flinches!
              self.playerHealth = Math.max(0, self.playerHealth - damage);
              self.opponentSuperPower = Math.min(100, self.opponentSuperPower + 10); // charge opponent super (balanced rate)
              self.hitsReceivedThisRound++;
              self.totalPunchesReceived++;
              window.GameAudio.playError();
              self.playPunchImpact();
              scene.addTextEffect(400, 310, "💥 ¡IMPACTO!", "#ef4444");

              const currentTier = self.levels[self.currentLevelIndex].tier;
              if (currentTier === 'shadow') {
                const stolen = 2000; // 2 seconds
                self.playerChessClock = Math.max(90000, self.playerChessClock - stolen); // floor at 90s
                scene.addTextEffect(400, 270, "⏳ ¡TIEMPO DRENADO! (-2s)", "#a855f7");
              }

              // Interrupt player inputs and trigger hit flinch animation
              scene.playerState = 'hit';
              scene.player.y = 375; // knock down slightly
              scene.tweens.add({
                targets: scene.player,
                y: 350,
                duration: 250,
                onComplete: () => {
                  if (scene.playerState === 'hit') {
                    scene.playerState = 'idle';
                    scene.player.setTexture('player-idle');
                  }
                }
              });

              // Screen shake camera
              scene.cameras.main.shake(150, 0.02);

              // Red flash border overlay
              scene.damageFlash.clear();
              scene.damageFlash.fillStyle(0xff0000, 0.35);
              scene.damageFlash.fillRect(0, 0, 800, 450);
              scene.time.delayedCall(120, () => scene.damageFlash.clear());

              // Verify KO
              if (self.playerHealth <= 0) {
                scene.playerState = 'stunned';
                self.gameOver("¡Has quedado noqueado en el ring! 😞 ¡Mejora tus bloqueos e intenta esquivar a tiempo!");
              }
            }
            self.updateBoxingTopBar();
          };
        },
        update: function(time, delta) {
          const scene = this;

          // Restart idle breathing animations when fighters are idle
          if (scene.playerState === 'idle' && (!scene.breathingTween || !scene.breathingTween.isPlaying())) {
            if (scene.breathingTween) scene.breathingTween.stop();
            scene.breathingTween = scene.tweens.add({
              targets: scene.player,
              scaleX: 0.67,
              scaleY: 0.63,
              duration: 1100,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
          }
          if (scene.opponentState === 'idle' && (!scene.oppBreathingTween || !scene.oppBreathingTween.isPlaying())) {
            if (scene.oppBreathingTween) scene.oppBreathingTween.stop();
            scene.oppBreathingTween = scene.tweens.add({
              targets: scene.opponent,
              scaleX: 0.62,
              scaleY: 0.58,
              duration: 1300,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
          }

          // Redraw ring background with dynamic crowd bobbing and sporadic flashes in real-time!
          self.drawRetroRingBackground(scene.ringGraphics, currentLevel.color, time);

          // Controls listeners mapped to actions
          if (scene.playerState === 'idle') {
            if (Phaser.Input.Keyboard.JustDown(scene.keys.dodgeL)) scene.executePlayerAction('dodgeL');
            if (Phaser.Input.Keyboard.JustDown(scene.keys.dodgeR)) scene.executePlayerAction('dodgeR');
            if (Phaser.Input.Keyboard.JustDown(scene.keys.block)) scene.executePlayerAction('block');
            if (Phaser.Input.Keyboard.JustDown(scene.keys.punchL)) scene.executePlayerAction('punchL');
            if (Phaser.Input.Keyboard.JustDown(scene.keys.punchR)) scene.executePlayerAction('punchR');
            if (Phaser.Input.Keyboard.JustDown(scene.keys.super)) scene.executePlayerAction('super');
          }

          // Handle Opponent Stun or Hit state clock
          if ((scene.opponentState === 'stunned' || scene.opponentState === 'hit') && time > scene.opponentStunnedTimer) {
            scene.opponentState = 'idle';
            scene.opponent.setTexture('opp-idle');
            scene.opponent.y = 180;
            scene.starsEffect.setText('');
            scene.nextAttackTime = time + 800 + Math.random() * 1000;
          }

          // Handle Opponent Attack AI cycles
          if (scene.opponentState === 'idle' && time > scene.nextAttackTime) {
            // Check if Opponent has full Super Power!
            if (self.opponentSuperPower === 100) {
              const currentTier = self.levels[self.currentLevelIndex].tier;
              if (currentTier === 'rook') {
                scene.executeOpponentEnroque();
              } else if (currentTier === 'queen') {
                scene.executeOpponentSneeze();
              } else if (currentTier === 'shadow') {
                scene.executeOpponentTimeTheft();
              } else if (currentTier === 'knight') {
                scene.executeOpponentKnightJump();
              } else if (currentTier === 'bishop') {
                scene.executeOpponentBishopSlash();
              } else if (currentTier === 'pawn') {
                scene.executeOpponentPawnLunge();
              } else {
                scene.executeOpponentEnroque();
              }
              return;
            }

            const punchSide = Math.random() < 0.5 ? 'left' : 'right';
            scene.opponentState = punchSide === 'left' ? 'telegraphing-l' : 'telegraphing-r';
            scene.opponent.setTexture(punchSide === 'left' ? 'opp-punch-l' : 'opp-punch-r');
            
            // Visual exclamation indicator
            const exclam = scene.add.text(punchSide === 'left' ? 340 : 460, 130, "⚠️ !", { font: '900 32px Outfit, sans-serif', fill: '#f43f5e' }).setOrigin(0.5);
            scene.tweens.add({
              targets: exclam,
              scale: 1.3,
              duration: 250,
              yoyo: true,
              onComplete: () => exclam.destroy()
            });

            // Lunge and launch punch after telegraphing window
            scene.time.delayedCall(finalPunchSpeed, () => {
              if (scene.opponentState === 'telegraphing-l' || scene.opponentState === 'telegraphing-r') {
                scene.opponentState = punchSide === 'left' ? 'punching-l' : 'punching-r';
                scene.tweens.add({
                  targets: scene.opponent,
                  y: 220,
                  duration: 100,
                  yoyo: true,
                  onComplete: () => {
                    if (scene.opponentState !== 'ko' && scene.opponentState !== 'stunned') {
                      scene.opponentState = 'idle';
                      scene.opponent.setTexture('opp-idle');
                      scene.nextAttackTime = time + 1200 + Math.random() * 1500;
                    }
                  }
                });
                scene.triggerPlayerHit(8, punchSide);
              }
            });
          }
        }
      }
    };

    this.phaserGame = new Phaser.Game(config);

    // Setup the round countdown timer
    this.boxingTimer = setInterval(() => {
      this.boxingTimeLeft--;
      const el = document.getElementById('boxing-timer-val');
      if (el) el.textContent = `${this.boxingTimeLeft}s`;
      // Mobile mini-HUD
      const mel = document.getElementById('mobile-timer');
      if (mel) mel.textContent = `⏱ ${this.boxingTimeLeft}s`;

      if (this.boxingTimeLeft <= 5) {
        const box = document.getElementById('boxing-timer-box');
        if (box) box.classList.add('timer-danger');
      }

      if (this.boxingTimeLeft <= 0) {
        clearInterval(this.boxingTimer);
        this.destroyPhaserEngine();
        
        // Bell sound and round transition to Chess!
        window.GameAudio.playVictory();
        this.currentRound++;
        this.startRound();
      }
    }, 1000);
  }

  // --- DYNAMICALLY DRAW PHASER CANVAS RETRO VECTOR TEXTURES ---
  renderBoxingTextures(scene) {
    const levelIdx = this.currentLevelIndex;
    this._renderPlayerTextures(scene);
    this._renderOpponentTextures(scene, levelIdx);
  }

  _getOpponentTier(levelIdx) {
    const level = this.levels[levelIdx];
    return level ? level.tier : 'rook';
  }

  // --- PLAYER TEXTURES (Martina — always the same) ---
  _renderPlayerTextures(scene) {
    // Shared color gradients and styling helpers
    const getPoloGrad = (ctx, x1, y1, x2, y2) => {
      const g = ctx.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, '#f1f5f9'); g.addColorStop(0.5, '#ffffff'); g.addColorStop(1, '#cbd5e1');
      return g;
    };
    
    const getPinkGloveGrad = (ctx, x, y, r) => {
      const g = ctx.createRadialGradient(x - r*0.3, y - r*0.3, r*0.1, x, y, r);
      g.addColorStop(0, '#fbcfe8'); g.addColorStop(0.3, '#ec4899'); g.addColorStop(0.8, '#db2777'); g.addColorStop(1, '#9d174d');
      return g;
    };

    const getStoneGrad = (ctx, x1, y1, x2, y2) => {
      const g = ctx.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, '#374151'); g.addColorStop(0.2, '#6b7280'); g.addColorStop(0.5, '#d1d5db'); g.addColorStop(0.8, '#4b5563'); g.addColorStop(1, '#1f2937');
      return g;
    };

    const getRedGloveGrad = (ctx, x, y, r) => {
      const g = ctx.createRadialGradient(x - r*0.3, y - r*0.3, r*0.1, x, y, r);
      g.addColorStop(0, '#fca5a5'); g.addColorStop(0.3, '#dc2626'); g.addColorStop(0.8, '#b91c1c'); g.addColorStop(1, '#7f1d1d');
      return g;
    };

    // 1. Martina Boxing back profile (idle) - Canvas 128x192
    const pCanvas = document.createElement('canvas'); pCanvas.width = 128; pCanvas.height = 192;
    const pCtx = pCanvas.getContext('2d');
    
    // Draw Shadow
    pCtx.shadowColor = 'rgba(0, 0, 0, 0.25)'; pCtx.shadowBlur = 8; pCtx.shadowOffsetY = 4;
    
    // Peach skin neck
    pCtx.fillStyle = '#fed7aa'; pCtx.fillRect(52, 76, 24, 16);
    pCtx.fillStyle = '#fdba74'; pCtx.fillRect(52, 88, 24, 4); // Neck shadow
    
    // Hair base (Chocolate Brown)
    const hairGrad = pCtx.createLinearGradient(32, 24, 96, 76);
    hairGrad.addColorStop(0, '#78350f'); hairGrad.addColorStop(1, '#451a03');
    pCtx.fillStyle = hairGrad;
    pCtx.beginPath(); pCtx.arc(64, 52, 28, Math.PI, 0); pCtx.rect(36, 52, 56, 24); pCtx.fill();
    // Hair highlights and strands
    pCtx.strokeStyle = '#b45309'; pCtx.lineWidth = 2.5; pCtx.beginPath();
    pCtx.moveTo(42, 52); pCtx.quadraticCurveTo(64, 38, 86, 52);
    pCtx.moveTo(48, 62); pCtx.quadraticCurveTo(64, 48, 80, 62);
    pCtx.stroke();

    // Gold ponytail ribbon
    pCtx.fillStyle = '#facc15'; pCtx.beginPath(); pCtx.arc(64, 76, 8, 0, Math.PI*2); pCtx.fill();
    pCtx.fillStyle = '#eab308'; pCtx.beginPath(); pCtx.arc(61, 74, 3, 0, Math.PI*2); pCtx.arc(67, 74, 3, 0, Math.PI*2); pCtx.fill();

    // Flowing ponytail lock
    pCtx.fillStyle = hairGrad; pCtx.beginPath();
    pCtx.moveTo(64, 76);
    pCtx.quadraticCurveTo(36, 104, 48, 136);
    pCtx.quadraticCurveTo(68, 116, 64, 76);
    pCtx.closePath(); pCtx.fill();

    // White Shirt with collars
    pCtx.fillStyle = getPoloGrad(pCtx, 32, 80, 96, 140);
    pCtx.beginPath();
    pCtx.moveTo(44, 80); pCtx.lineTo(84, 80); pCtx.lineTo(96, 140); pCtx.lineTo(32, 140);
    pCtx.closePath(); pCtx.fill();
    
    // Chess Rook Emblem on the back
    pCtx.fillStyle = '#ef4444';
    pCtx.fillRect(60, 104, 8, 12);
    pCtx.fillRect(58, 100, 12, 4); // crown base
    pCtx.fillRect(57, 116, 14, 3);  // base block

    // Royal Blue Shorts
    pCtx.fillStyle = '#1d4ed8'; pCtx.fillRect(32, 140, 64, 14);
    pCtx.fillStyle = '#ffffff'; pCtx.fillRect(32, 140, 4, 14); pCtx.fillRect(92, 140, 4, 14); // white stripes

    // Pink Gloves raised in guard
    // Left Glove
    pCtx.fillStyle = getPinkGloveGrad(pCtx, 24, 80, 20);
    pCtx.beginPath(); pCtx.arc(24, 80, 20, 0, Math.PI*2); pCtx.fill();
    pCtx.fillStyle = 'rgba(255, 255, 255, 0.45)'; pCtx.beginPath(); pCtx.arc(20, 74, 5, 0, Math.PI*2); pCtx.fill(); // leather gloss
    pCtx.fillStyle = '#f8fafc'; pCtx.fillRect(14, 96, 20, 5); // wrist wrap
    // Right Glove
    pCtx.fillStyle = getPinkGloveGrad(pCtx, 104, 80, 20);
    pCtx.beginPath(); pCtx.arc(104, 80, 20, 0, Math.PI*2); pCtx.fill();
    pCtx.fillStyle = 'rgba(255, 255, 255, 0.45)'; pCtx.beginPath(); pCtx.arc(100, 74, 5, 0, Math.PI*2); pCtx.fill();
    pCtx.fillStyle = '#f8fafc'; pCtx.fillRect(94, 96, 20, 5);

    scene.textures.addCanvas('player-idle', pCanvas);

    // 2. Martina Dodge Left (Canvas 128x192)
    const dlCanvas = document.createElement('canvas'); dlCanvas.width = 128; dlCanvas.height = 192;
    const dlCtx = dlCanvas.getContext('2d');
    
    // Leaning left coordinates
    dlCtx.shadowColor = 'rgba(0, 0, 0, 0.25)'; dlCtx.shadowBlur = 8; dlCtx.shadowOffsetY = 4;
    dlCtx.fillStyle = '#fed7aa'; dlCtx.fillRect(36, 92, 24, 16);
    
    // Hair base shifted left
    dlCtx.fillStyle = hairGrad;
    dlCtx.beginPath(); dlCtx.arc(48, 68, 28, Math.PI, 0); dlCtx.rect(20, 68, 56, 24); dlCtx.fill();
    
    // Ponytail Ribbon
    dlCtx.fillStyle = '#facc15'; dlCtx.beginPath(); dlCtx.arc(48, 92, 8, 0, Math.PI*2); dlCtx.fill();
    
    // Dynamic Ponytail lock blowing to the RIGHT
    dlCtx.fillStyle = hairGrad; dlCtx.beginPath();
    dlCtx.moveTo(48, 92);
    dlCtx.quadraticCurveTo(80, 110, 84, 146);
    dlCtx.quadraticCurveTo(60, 130, 48, 92);
    dlCtx.closePath(); dlCtx.fill();
    
    // Torso White Shirt shifted
    dlCtx.fillStyle = getPoloGrad(dlCtx, 16, 96, 80, 156);
    dlCtx.beginPath();
    dlCtx.moveTo(28, 96); dlCtx.lineTo(68, 96); dlCtx.lineTo(80, 156); dlCtx.lineTo(16, 156);
    dlCtx.closePath(); dlCtx.fill();
    
    // Shorts
    dlCtx.fillStyle = '#1d4ed8'; dlCtx.fillRect(16, 156, 64, 14);
    
    // Gloves tucked low for defense
    dlCtx.fillStyle = getPinkGloveGrad(dlCtx, 12, 88, 20);
    dlCtx.beginPath(); dlCtx.arc(12, 88, 20, 0, Math.PI*2); dlCtx.fill();
    dlCtx.fillStyle = getPinkGloveGrad(dlCtx, 84, 88, 20);
    dlCtx.beginPath(); dlCtx.arc(84, 88, 20, 0, Math.PI*2); dlCtx.fill();

    scene.textures.addCanvas('player-dodge-l', dlCanvas);

    // 3. Martina Dodge Right (Canvas 128x192)
    const drCanvas = document.createElement('canvas'); drCanvas.width = 128; drCanvas.height = 192;
    const drCtx = drCanvas.getContext('2d');
    
    // Leaning right coordinates
    drCtx.shadowColor = 'rgba(0, 0, 0, 0.25)'; drCtx.shadowBlur = 8; drCtx.shadowOffsetY = 4;
    drCtx.fillStyle = '#fed7aa'; drCtx.fillRect(68, 92, 24, 16);
    
    // Hair base shifted right
    drCtx.fillStyle = hairGrad;
    drCtx.beginPath(); drCtx.arc(80, 68, 28, Math.PI, 0); drCtx.rect(52, 68, 56, 24); drCtx.fill();
    
    // Ponytail Ribbon
    drCtx.fillStyle = '#facc15'; drCtx.beginPath(); drCtx.arc(80, 92, 8, 0, Math.PI*2); drCtx.fill();
    
    // Dynamic Ponytail lock blowing to the LEFT
    drCtx.fillStyle = hairGrad; drCtx.beginPath();
    drCtx.moveTo(80, 92);
    drCtx.quadraticCurveTo(48, 110, 44, 146);
    drCtx.quadraticCurveTo(68, 130, 80, 92);
    drCtx.closePath(); drCtx.fill();
    
    // Torso shifted right
    drCtx.fillStyle = getPoloGrad(drCtx, 48, 96, 112, 156);
    drCtx.beginPath();
    drCtx.moveTo(60, 96); drCtx.lineTo(100, 96); drCtx.lineTo(112, 156); drCtx.lineTo(48, 156);
    drCtx.closePath(); drCtx.fill();
    
    // Shorts
    drCtx.fillStyle = '#1d4ed8'; drCtx.fillRect(48, 156, 64, 14);
    
    // Gloves tucked low
    drCtx.fillStyle = getPinkGloveGrad(drCtx, 44, 88, 20);
    drCtx.beginPath(); drCtx.arc(44, 88, 20, 0, Math.PI*2); drCtx.fill();
    drCtx.fillStyle = getPinkGloveGrad(drCtx, 116, 88, 20);
    drCtx.beginPath(); drCtx.arc(116, 88, 20, 0, Math.PI*2); drCtx.fill();

    scene.textures.addCanvas('player-dodge-r', drCanvas);

    // 4. Martina Block Guard (Canvas 128x192)
    const bCanvas = document.createElement('canvas'); bCanvas.width = 128; bCanvas.height = 192;
    const bCtx = bCanvas.getContext('2d');
    
    bCtx.shadowColor = 'rgba(0, 0, 0, 0.25)'; bCtx.shadowBlur = 8; bCtx.shadowOffsetY = 4;
    bCtx.fillStyle = '#fed7aa'; bCtx.fillRect(52, 76, 24, 16);
    bCtx.fillStyle = hairGrad;
    bCtx.beginPath(); bCtx.arc(64, 52, 28, Math.PI, 0); bCtx.rect(36, 52, 56, 24); bCtx.fill();
    bCtx.fillStyle = '#facc15'; bCtx.beginPath(); bCtx.arc(64, 76, 8, 0, Math.PI*2); bCtx.fill();
    bCtx.fillStyle = hairGrad; bCtx.beginPath();
    bCtx.moveTo(64, 76); bCtx.quadraticCurveTo(36, 104, 48, 136); bCtx.quadraticCurveTo(68, 116, 64, 76); bCtx.closePath(); bCtx.fill();

    // Body
    bCtx.fillStyle = getPoloGrad(bCtx, 32, 80, 96, 140);
    bCtx.beginPath(); bCtx.moveTo(44, 80); bCtx.lineTo(84, 80); bCtx.lineTo(96, 140); bCtx.lineTo(32, 140); bCtx.closePath(); bCtx.fill();
    bCtx.fillStyle = '#1d4ed8'; bCtx.fillRect(32, 140, 64, 14);

    // Giant Gloves raised covering her whole face! (Y=48, closer together)
    bCtx.fillStyle = getPinkGloveGrad(bCtx, 46, 48, 22);
    bCtx.beginPath(); bCtx.arc(46, 48, 22, 0, Math.PI*2); bCtx.fill();
    bCtx.fillStyle = 'rgba(255, 255, 255, 0.45)'; bCtx.beginPath(); bCtx.arc(42, 42, 5.5, 0, Math.PI*2); bCtx.fill();
    bCtx.fillStyle = '#f8fafc'; bCtx.fillRect(34, 66, 20, 5); // wrist wrap

    bCtx.fillStyle = getPinkGloveGrad(bCtx, 82, 48, 22);
    bCtx.beginPath(); bCtx.arc(82, 48, 22, 0, Math.PI*2); bCtx.fill();
    bCtx.fillStyle = 'rgba(255, 255, 255, 0.45)'; bCtx.beginPath(); bCtx.arc(78, 42, 5.5, 0, Math.PI*2); bCtx.fill();
    bCtx.fillStyle = '#f8fafc'; bCtx.fillRect(74, 66, 20, 5);

    scene.textures.addCanvas('player-block', bCanvas);

    // 5. Martina Punch Left (Canvas 128x192)
    const plCanvas = document.createElement('canvas'); plCanvas.width = 128; plCanvas.height = 192;
    const plCtx = plCanvas.getContext('2d');
    
    plCtx.shadowColor = 'rgba(0, 0, 0, 0.25)'; plCtx.shadowBlur = 8; plCtx.shadowOffsetY = 4;
    plCtx.fillStyle = '#fed7aa'; plCtx.fillRect(52, 76, 24, 16);
    plCtx.fillStyle = hairGrad;
    plCtx.beginPath(); plCtx.arc(64, 52, 28, Math.PI, 0); plCtx.rect(36, 52, 56, 24); plCtx.fill();
    plCtx.fillStyle = '#facc15'; plCtx.beginPath(); plCtx.arc(64, 76, 8, 0, Math.PI*2); plCtx.fill();
    plCtx.fillStyle = hairGrad; plCtx.beginPath();
    plCtx.moveTo(64, 76); plCtx.quadraticCurveTo(36, 104, 48, 136); plCtx.quadraticCurveTo(68, 116, 64, 76); plCtx.closePath(); plCtx.fill();

    // Torso white
    plCtx.fillStyle = getPoloGrad(plCtx, 32, 80, 96, 140);
    plCtx.beginPath(); plCtx.moveTo(44, 80); plCtx.lineTo(84, 80); plCtx.lineTo(96, 140); plCtx.lineTo(32, 140); plCtx.closePath(); plCtx.fill();
    plCtx.fillStyle = '#1d4ed8'; plCtx.fillRect(32, 140, 64, 14);

    // Normal Right Glove in Guard
    plCtx.fillStyle = getPinkGloveGrad(plCtx, 104, 80, 20);
    plCtx.beginPath(); plCtx.arc(104, 80, 20, 0, Math.PI*2); plCtx.fill();
    plCtx.fillStyle = '#f8fafc'; plCtx.fillRect(94, 96, 20, 5);

    // EXTENDED LEFT GLOVE (Foreshortened 3D Perspective! drawn huge at Y=28, radius=32!)
    // Motion trail blur lines
    plCtx.strokeStyle = 'rgba(236, 72, 153, 0.35)'; plCtx.lineWidth = 8;
    plCtx.beginPath(); plCtx.moveTo(28, 80); plCtx.lineTo(28, 28); plCtx.stroke();
    
    plCtx.fillStyle = getPinkGloveGrad(plCtx, 28, 28, 32);
    plCtx.beginPath(); plCtx.arc(28, 28, 32, 0, Math.PI*2); plCtx.fill();
    plCtx.fillStyle = 'rgba(255, 255, 255, 0.55)'; plCtx.beginPath(); plCtx.arc(22, 20, 8, 0, Math.PI*2); plCtx.fill(); // bright flash sheen
    plCtx.fillStyle = '#f8fafc'; plCtx.fillRect(16, 54, 24, 6);

    scene.textures.addCanvas('player-punch-l', plCanvas);

    // 6. Martina Punch Right (Canvas 128x192)
    const prCanvas = document.createElement('canvas'); prCanvas.width = 128; prCanvas.height = 192;
    const prCtx = prCanvas.getContext('2d');
    
    prCtx.shadowColor = 'rgba(0, 0, 0, 0.25)'; prCtx.shadowBlur = 8; prCtx.shadowOffsetY = 4;
    prCtx.fillStyle = '#fed7aa'; prCtx.fillRect(52, 76, 24, 16);
    prCtx.fillStyle = hairGrad;
    prCtx.beginPath(); prCtx.arc(64, 52, 28, Math.PI, 0); prCtx.rect(36, 52, 56, 24); prCtx.fill();
    prCtx.fillStyle = '#facc15'; prCtx.beginPath(); prCtx.arc(64, 76, 8, 0, Math.PI*2); prCtx.fill();
    prCtx.fillStyle = hairGrad; prCtx.beginPath();
    prCtx.moveTo(64, 76); prCtx.quadraticCurveTo(36, 104, 48, 136); prCtx.quadraticCurveTo(68, 116, 64, 76); prCtx.closePath(); prCtx.fill();

    // Torso white
    prCtx.fillStyle = getPoloGrad(prCtx, 32, 80, 96, 140);
    prCtx.beginPath(); prCtx.moveTo(44, 80); prCtx.lineTo(84, 80); prCtx.lineTo(96, 140); prCtx.lineTo(32, 140); prCtx.closePath(); prCtx.fill();
    prCtx.fillStyle = '#1d4ed8'; prCtx.fillRect(32, 140, 64, 14);

    // Normal Left Glove in Guard
    prCtx.fillStyle = getPinkGloveGrad(prCtx, 24, 80, 20);
    prCtx.beginPath(); prCtx.arc(24, 80, 20, 0, Math.PI*2); prCtx.fill();
    prCtx.fillStyle = '#f8fafc'; prCtx.fillRect(14, 96, 20, 5);

    // EXTENDED RIGHT GLOVE (Foreshortened 3D, huge at Y=28, radius=32!)
    prCtx.strokeStyle = 'rgba(236, 72, 153, 0.35)'; prCtx.lineWidth = 8;
    prCtx.beginPath(); prCtx.moveTo(100, 80); prCtx.lineTo(100, 28); prCtx.stroke();

    prCtx.fillStyle = getPinkGloveGrad(prCtx, 100, 28, 32);
    prCtx.beginPath(); prCtx.arc(100, 28, 32, 0, Math.PI*2); prCtx.fill();
    prCtx.fillStyle = 'rgba(255, 255, 255, 0.55)'; prCtx.beginPath(); prCtx.arc(94, 20, 8, 0, Math.PI*2); prCtx.fill();
    prCtx.fillStyle = '#f8fafc'; prCtx.fillRect(88, 54, 24, 6);

    scene.textures.addCanvas('player-punch-r', prCanvas);
  }

  _renderOpponentTextures(scene, levelIdx) {
    const level = this.levels[levelIdx];
    const opponentName = level ? level.opponentName : 'General Torreón';
    const tier = level ? level.tier : 'rook';

    const getStoneGrad = (ctx, x1, y1, x2, y2) => {
      const g = ctx.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, '#374151'); g.addColorStop(0.2, '#6b7280'); g.addColorStop(0.5, '#d1d5db'); g.addColorStop(0.8, '#4b5563'); g.addColorStop(1, '#1f2937');
      return g;
    };

    const getRedGloveGrad = (ctx, x, y, r) => {
      const g = ctx.createRadialGradient(x - r*0.3, y - r*0.3, r*0.1, x, y, r);
      g.addColorStop(0, '#fca5a5'); g.addColorStop(0.3, '#dc2626'); g.addColorStop(0.8, '#b91c1c'); g.addColorStop(1, '#7f1d1d');
      return g;
    };

    // Tier-specific color schemes
    const tierColors = {
      pawn:   { body: ['#93c5fd', '#60a5fa', '#bfdbfe', '#3b82f6', '#1e3a5f'], glove: ['#fca5a5', '#60a5fa', '#3b82f6', '#1e3a5f'], eye: '#f59e0b', name: opponentName },
      knight: { body: ['#d4b88c', '#b8956a', '#f5e6d3', '#8b6914', '#5c3d0e'], glove: ['#fca5a5', '#d97706', '#b45309', '#7c2d12'], eye: '#ef4444', name: opponentName },
      bishop: { body: ['#c4b5fd', '#a78bfa', '#ddd6fe', '#7c3aed', '#4c1d95'], glove: ['#fca5a5', '#a855f7', '#7e22ce', '#581c87'], eye: '#fbbf24', name: opponentName },
      rook:   { body: ['#374151', '#6b7280', '#d1d5db', '#4b5563', '#1f2937'], glove: ['#fca5a5', '#dc2626', '#b91c1c', '#7f1d1d'], eye: '#facc15', name: opponentName },
      queen:  { body: ['#2d1b4e', '#5b21b6', '#a78bfa', '#4c1d95', '#1a0a2e'], glove: ['#fca5a5', '#c026d3', '#86198f', '#4a044e'], eye: '#f43f5e', name: opponentName },
      shadow: { body: ['#1f1235', '#3d2568', '#5b3c9b', '#110724', '#080212'], glove: ['#f472b6', '#ec4899', '#db2777', '#9d174d'], eye: '#a855f7', name: opponentName }
    };
    const tc = tierColors[tier] || tierColors['rook'];

    const opponentShortsColor = tc.body[3];
    const opponentBeltColor = tc.eye;
    const opponentBeltDark = tc.body[4];
    const opponentEyeGlow = tc.eye;

    const getBodyGrad = (ctx, x1, y1, x2, y2) => {
      const g = ctx.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, tc.body[0]); g.addColorStop(0.2, tc.body[1]); g.addColorStop(0.5, tc.body[2]); g.addColorStop(0.8, tc.body[3]); g.addColorStop(1, tc.body[4]);
      return g;
    };
    const getGloveGrad = (ctx, x, y, r) => {
      const g = ctx.createRadialGradient(x - r*0.3, y - r*0.3, r*0.1, x, y, r);
      g.addColorStop(0, tc.glove[0]); g.addColorStop(0.3, tc.glove[1]); g.addColorStop(0.8, tc.glove[2]); g.addColorStop(1, tc.glove[3]);
      return g;
    };

    // Helper: Draw custom piece shapes based on the current tier!
    const drawOpponentBody = (ctx, isStunnedState) => {
      ctx.fillStyle = getBodyGrad(ctx, 44, 40, 148, 156);
      ctx.beginPath();
      
      if (tier === 'pawn') {
        // Pawn shape: rounded head + conical shoulders
        ctx.moveTo(44, 156);
        ctx.bezierCurveTo(44, 120, 70, 96, 76, 86); // Left shoulder
        ctx.lineTo(116, 86); // Neck connector
        ctx.bezierCurveTo(122, 96, 148, 120, 148, 156); // Right shoulder
        ctx.closePath();
        ctx.fill();
        
        // Round head
        ctx.beginPath();
        ctx.arc(96, 62, 28, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw Peoncito's big fake mustache!
        if (!isStunnedState) {
          ctx.fillStyle = '#0f172a'; // black mustache
          ctx.beginPath();
          // Left curl
          ctx.moveTo(96, 80);
          ctx.bezierCurveTo(80, 75, 60, 85, 62, 95);
          ctx.bezierCurveTo(62, 80, 85, 80, 96, 84);
          // Right curl
          ctx.moveTo(96, 80);
          ctx.bezierCurveTo(112, 75, 132, 85, 130, 95);
          ctx.bezierCurveTo(130, 80, 107, 80, 96, 84);
          ctx.closePath();
          ctx.fill();
          
          // Little center tie
          ctx.fillRect(94, 79, 4, 6);
        } else {
          // Stunned Peoncito: mustache is flying away in the air!
          ctx.save();
          ctx.translate(145, 55);
          ctx.rotate(0.4);
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-16, -5, -36, 5, -34, 15);
          ctx.bezierCurveTo(-34, 0, -11, 0, 0, 4);
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(16, -5, 36, 5, 34, 15);
          ctx.bezierCurveTo(34, 0, 11, 0, 0, 4);
          ctx.closePath();
          ctx.fill();
          ctx.fillRect(-2, -1, 4, 6);
          ctx.restore();
          
          // draw small exclamation text
          ctx.fillStyle = '#f43f5e';
          ctx.font = 'bold 12px Outfit, sans-serif';
          ctx.fillText('¡Mi bigote!', 20, 40);
        }
      } else if (tier === 'knight') {
        // Knight shape: horse head pointing left
        ctx.moveTo(44, 156);
        ctx.lineTo(46, 126);
        ctx.bezierCurveTo(46, 110, 55, 96, 66, 86); // Back neck
        ctx.lineTo(56, 76);
        ctx.bezierCurveTo(40, 66, 45, 46, 66, 50); // Nose/snout top
        ctx.lineTo(86, 50); // Mane top
        ctx.lineTo(90, 36); ctx.lineTo(98, 44);
        ctx.lineTo(104, 34); ctx.lineTo(110, 46);
        ctx.bezierCurveTo(130, 56, 136, 86, 142, 116);
        ctx.lineTo(148, 156);
        ctx.closePath();
        ctx.fill();
        
        // Mane details
        ctx.fillStyle = tc.body[4];
        ctx.beginPath();
        ctx.moveTo(110, 46);
        ctx.bezierCurveTo(135, 60, 140, 95, 144, 130);
        ctx.lineTo(136, 130);
        ctx.bezierCurveTo(130, 95, 125, 65, 105, 52);
        ctx.closePath();
        ctx.fill();
      } else if (tier === 'bishop') {
        // Bishop shape: mitre hat pointed top
        ctx.moveTo(44, 156);
        ctx.bezierCurveTo(46, 110, 60, 96, 66, 86); // shoulders left
        ctx.lineTo(60, 80);
        ctx.bezierCurveTo(50, 60, 96, 26, 96, 26); // Mitre left half
        ctx.bezierCurveTo(96, 26, 142, 60, 132, 80); // Mitre right half
        ctx.lineTo(126, 86);
        ctx.bezierCurveTo(132, 96, 146, 110, 148, 156); // shoulders right
        ctx.closePath();
        ctx.fill();
        
        // Small sphere on top of mitre
        ctx.fillStyle = tc.eye;
        ctx.beginPath();
        ctx.arc(96, 25, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Slit/cleft inside the mitre
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(96, 38);
        ctx.lineTo(84, 56);
        ctx.stroke();
      } else if (tier === 'queen') {
        // Queen shape: Tall crown
        ctx.moveTo(44, 156);
        ctx.bezierCurveTo(46, 110, 66, 96, 70, 86); // Left body
        ctx.lineTo(60, 76);
        ctx.lineTo(54, 42); // Left peak
        ctx.lineTo(76, 56); // Valley 1
        ctx.lineTo(96, 32); // Center peak
        ctx.lineTo(116, 56); // Valley 2
        ctx.lineTo(138, 42); // Right peak
        ctx.lineTo(122, 76);
        ctx.bezierCurveTo(126, 96, 146, 110, 148, 156); // Right body
        ctx.closePath();
        ctx.fill();
        
        // Golden spheres on crown peaks
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(54, 40, 5, 0, Math.PI*2);
        ctx.arc(96, 30, 6, 0, Math.PI*2);
        ctx.arc(138, 40, 5, 0, Math.PI*2);
        ctx.fill();

        // Draw comical tissue box pañuelo in Queen's crown if level is Reina Negra
        if (opponentName.includes("Reina Negra")) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(90, 30);
          ctx.bezierCurveTo(80, 15, 102, 15, 102, 30);
          ctx.closePath();
          ctx.fill();
        }
      } else if (tier === 'shadow') {
        // Shadow shape: round creepy head + broad shoulders
        ctx.moveTo(44, 156);
        ctx.bezierCurveTo(44, 110, 58, 90, 68, 80);
        ctx.lineTo(124, 80);
        ctx.bezierCurveTo(134, 90, 148, 110, 148, 156);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(96, 54, 30, 0, Math.PI*2);
        ctx.fill();
      } else {
        // Rook shape (Default)
        // Crenellations (teeth) top
        ctx.moveTo(52, 36); ctx.lineTo(68, 36); ctx.lineTo(68, 52); 
        ctx.lineTo(84, 52); ctx.lineTo(84, 36); ctx.lineTo(100, 36); 
        ctx.lineTo(100, 52); ctx.lineTo(116, 52); ctx.lineTo(116, 36); 
        ctx.lineTo(132, 36); ctx.lineTo(132, 52); ctx.lineTo(140, 52);
        // Cylinder body
        ctx.lineTo(148, 156); ctx.lineTo(44, 156);
        ctx.closePath();
        ctx.fill();

        // Draw "delantal a cuadros" (checked apron) for Torreta
        if (opponentName.includes("Torreta")) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(52, 72);
          ctx.lineTo(140, 72);
          ctx.lineTo(148, 156);
          ctx.lineTo(44, 156);
          ctx.closePath();
          ctx.clip();
          
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(56, 75, 80, 82);
          
          ctx.fillStyle = '#f43f5e';
          const size = 8;
          for (let x = 56; x < 136; x += size * 2) {
            for (let y = 75; y < 156; y += size * 2) {
              ctx.fillRect(x, y, size, size);
              ctx.fillRect(x + size, y + size, size, size);
            }
          }
          ctx.restore();
        }
      }
    };

    // Calculate dynamic eye and mouth positions based on tier
    let eyeY = 84;
    let eyeXL = 76;
    let eyeXR = 116;
    if (tier === 'pawn') {
      eyeY = 62; eyeXL = 84; eyeXR = 108;
    } else if (tier === 'knight') {
      eyeY = 66; eyeXL = 68; eyeXR = 96;
    } else if (tier === 'bishop') {
      eyeY = 74; eyeXL = 82; eyeXR = 110;
    } else if (tier === 'queen') {
      eyeY = 80; eyeXL = 80; eyeXR = 112;
    } else if (tier === 'shadow') {
      eyeY = 54; eyeXL = 84; eyeXR = 108;
    }

    let mouthY = 108;
    if (tier === 'pawn') mouthY = 78;
    else if (tier === 'knight') mouthY = 78;
    else if (tier === 'bishop') mouthY = 92;
    else if (tier === 'queen') mouthY = 100;
    else if (tier === 'shadow') mouthY = 70;

    // ==========================================
    // 7. Dynamic Opponent Idle (Canvas 192x192)
    // ==========================================
    const oCanvas = document.createElement('canvas'); oCanvas.width = 192; oCanvas.height = 192;
    const oCtx = oCanvas.getContext('2d');
    
    oCtx.shadowColor = 'rgba(0, 0, 0, 0.3)'; oCtx.shadowBlur = 10; oCtx.shadowOffsetY = 6;
    
    if (tier === 'rook') {
      // Castle battlements interior shadow
      oCtx.fillStyle = '#111827'; oCtx.fillRect(52, 48, 88, 20);
    }
    
    // Draw Dynamic Body Shape
    drawOpponentBody(oCtx, false);

    if (tier === 'rook') {
      // Weathered Stone joints / Brick lines (width 2.5 for crisp outlines)
      oCtx.strokeStyle = '#1e293b'; oCtx.lineWidth = 2.2;
      oCtx.beginPath();
      oCtx.moveTo(50, 72); oCtx.lineTo(142, 72);
      oCtx.moveTo(48, 102); oCtx.lineTo(144, 102);
      oCtx.moveTo(46, 132); oCtx.lineTo(146, 132);
      oCtx.moveTo(76, 52); oCtx.lineTo(76, 72);
      oCtx.moveTo(116, 52); oCtx.lineTo(116, 72);
      oCtx.moveTo(96, 72); oCtx.lineTo(96, 102);
      oCtx.moveTo(70, 102); oCtx.lineTo(70, 132);
      oCtx.moveTo(122, 102); oCtx.lineTo(122, 132);
      oCtx.stroke();

      // Moss cracks details
      oCtx.strokeStyle = '#047857'; oCtx.lineWidth = 1.8;
      oCtx.beginPath();
      oCtx.moveTo(54, 80); oCtx.lineTo(60, 92);
      oCtx.moveTo(136, 110); oCtx.lineTo(130, 122);
      oCtx.stroke();
    }

    // Angry glowing eyes
    oCtx.fillStyle = '#111827'; oCtx.beginPath(); oCtx.arc(eyeXL, eyeY, 13, 0, Math.PI*2); oCtx.arc(eyeXR, eyeY, 13, 0, Math.PI*2); oCtx.fill();
    oCtx.fillStyle = '#ea580c'; oCtx.beginPath(); oCtx.arc(eyeXL, eyeY, 9, 0, Math.PI*2); oCtx.arc(eyeXR, eyeY, 9, 0, Math.PI*2); oCtx.fill();
    oCtx.fillStyle = '#facc15'; oCtx.beginPath(); oCtx.arc(eyeXL, eyeY, 5, 0, Math.PI*2); oCtx.arc(eyeXR, eyeY, 5, 0, Math.PI*2); oCtx.fill();
    oCtx.fillStyle = '#ffffff'; oCtx.beginPath(); oCtx.arc(eyeXL - 3, eyeY - 3, 1.8, 0, Math.PI*2); oCtx.arc(eyeXR - 3, eyeY - 3, 1.8, 0, Math.PI*2); oCtx.fill();

    // Thick angry eyebrows
    oCtx.fillStyle = '#0f172a';
    oCtx.beginPath();
    oCtx.moveTo(eyeXL - 18, eyeY - 18); oCtx.lineTo(eyeXL + 10, eyeY - 6); oCtx.lineTo(eyeXL + 10, eyeY - 12); oCtx.lineTo(eyeXL - 14, eyeY - 24); oCtx.closePath(); oCtx.fill();
    oCtx.beginPath();
    oCtx.moveTo(eyeXR + 18, eyeY - 18); oCtx.lineTo(eyeXR - 10, eyeY - 6); oCtx.lineTo(eyeXR - 10, eyeY - 12); oCtx.lineTo(eyeXR + 14, eyeY - 24); oCtx.closePath(); oCtx.fill();

    // Gritting teeth mouth
    oCtx.fillStyle = '#0f172a'; oCtx.fillRect(80, mouthY, 32, 16);
    oCtx.fillStyle = '#ffffff'; oCtx.fillRect(82, mouthY + 2, 28, 12);
    oCtx.strokeStyle = '#475569'; oCtx.lineWidth = 1.2;
    oCtx.beginPath();
    oCtx.moveTo(82, mouthY + 8); oCtx.lineTo(110, mouthY + 8);
    oCtx.moveTo(89, mouthY + 2); oCtx.lineTo(89, mouthY + 14);
    oCtx.moveTo(96, mouthY + 2); oCtx.lineTo(96, mouthY + 14);
    oCtx.moveTo(103, mouthY + 2); oCtx.lineTo(103, mouthY + 14);
    oCtx.stroke();

    // Trunks & Champion belt
    oCtx.fillStyle = opponentShortsColor; oCtx.fillRect(44, 142, 104, 22);
    oCtx.fillStyle = opponentBeltColor; oCtx.fillRect(44, 142, 8, 22); oCtx.fillRect(140, 142, 8, 22);
    oCtx.beginPath(); oCtx.arc(96, 142, 12, 0, Math.PI*2); oCtx.fill();
    oCtx.fillStyle = opponentBeltDark; oCtx.beginPath(); oCtx.arc(96, 142, 8, 0, Math.PI*2); oCtx.fill();
    oCtx.fillStyle = '#1e1b4b'; oCtx.beginPath();
    oCtx.moveTo(91, 144); oCtx.lineTo(93, 138); oCtx.lineTo(96, 141); oCtx.lineTo(99, 138); oCtx.lineTo(101, 144);
    oCtx.closePath(); oCtx.fill();

    // Gloves in guard
    oCtx.fillStyle = getGloveGrad(oCtx, 36, 116, 26);
    oCtx.beginPath(); oCtx.arc(36, 116, 26, 0, Math.PI*2); oCtx.fill();
    oCtx.fillStyle = 'rgba(255, 255, 255, 0.4)'; oCtx.beginPath(); oCtx.arc(30, 108, 6, 0, Math.PI*2); oCtx.fill();

    oCtx.fillStyle = getGloveGrad(oCtx, 156, 116, 26);
    oCtx.beginPath(); oCtx.arc(156, 116, 26, 0, Math.PI*2); oCtx.fill();
    oCtx.fillStyle = 'rgba(255, 255, 255, 0.4)'; oCtx.beginPath(); oCtx.arc(150, 108, 6, 0, Math.PI*2); oCtx.fill();

    scene.textures.addCanvas('opp-idle', oCanvas);

    // ==========================================
    // 8. Opponent Punching Left (Canvas 192x192)
    // ==========================================
    const olCanvas = document.createElement('canvas'); olCanvas.width = 192; olCanvas.height = 192;
    const olCtx = olCanvas.getContext('2d');
    
    olCtx.shadowColor = 'rgba(0, 0, 0, 0.3)'; olCtx.shadowBlur = 10; olCtx.shadowOffsetY = 6;
    if (tier === 'rook') {
      olCtx.fillStyle = '#111827'; olCtx.fillRect(52, 48, 88, 20);
    }
    
    drawOpponentBody(olCtx, false);
    
    // Eyes angry
    olCtx.fillStyle = '#111827'; olCtx.beginPath(); olCtx.arc(eyeXL, eyeY, 13, 0, Math.PI*2); olCtx.arc(eyeXR, eyeY, 13, 0, Math.PI*2); olCtx.fill();
    olCtx.fillStyle = '#ef4444'; olCtx.beginPath(); olCtx.arc(eyeXL, eyeY, 9, 0, Math.PI*2); olCtx.arc(eyeXR, eyeY, 9, 0, Math.PI*2); olCtx.fill();

    // ROARING mouth
    olCtx.fillStyle = '#0f172a'; olCtx.beginPath(); olCtx.arc(96, mouthY + 8, 16, 0, Math.PI*2); olCtx.fill();
    olCtx.fillStyle = '#f97316'; olCtx.beginPath(); olCtx.arc(96, mouthY + 10, 11, 0, Math.PI*2); olCtx.fill();
    olCtx.fillStyle = '#ffffff'; olCtx.fillRect(86, mouthY - 6, 4, 4); olCtx.fillRect(102, mouthY - 6, 4, 4);

    // Trunks
    olCtx.fillStyle = opponentShortsColor; olCtx.fillRect(44, 142, 104, 22);
    olCtx.fillStyle = opponentBeltColor; olCtx.beginPath(); olCtx.arc(96, 142, 12, 0, Math.PI*2); olCtx.fill();

    // Normal Right Glove in guard
    olCtx.fillStyle = getGloveGrad(olCtx, 156, 116, 26);
    olCtx.beginPath(); olCtx.arc(156, 116, 26, 0, Math.PI*2); olCtx.fill();

    // EXTENDED LEFT GLOVE
    olCtx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; olCtx.lineWidth = 12;
    olCtx.beginPath(); olCtx.moveTo(36, 116); olCtx.lineTo(28, 146); olCtx.stroke();

    olCtx.fillStyle = getGloveGrad(olCtx, 28, 146, 36);
    olCtx.beginPath(); olCtx.arc(28, 146, 36, 0, Math.PI*2); olCtx.fill();
    olCtx.fillStyle = 'rgba(255, 255, 255, 0.5)'; olCtx.beginPath(); olCtx.arc(20, 136, 8, 0, Math.PI*2); olCtx.fill();

    scene.textures.addCanvas('opp-punch-l', olCanvas);

    // ==========================================
    // 9. Opponent Punching Right (Canvas 192x192)
    // ==========================================
    const orCanvas = document.createElement('canvas'); orCanvas.width = 192; orCanvas.height = 192;
    const orCtx = orCanvas.getContext('2d');
    
    orCtx.shadowColor = 'rgba(0, 0, 0, 0.3)'; orCtx.shadowBlur = 10; orCtx.shadowOffsetY = 6;
    if (tier === 'rook') {
      orCtx.fillStyle = '#111827'; orCtx.fillRect(52, 48, 88, 20);
    }
    
    drawOpponentBody(orCtx, false);
    
    // Eyes angry
    orCtx.fillStyle = '#111827'; orCtx.beginPath(); orCtx.arc(eyeXL, eyeY, 13, 0, Math.PI*2); orCtx.arc(eyeXR, eyeY, 13, 0, Math.PI*2); orCtx.fill();
    orCtx.fillStyle = '#ef4444'; orCtx.beginPath(); orCtx.arc(eyeXL, eyeY, 9, 0, Math.PI*2); orCtx.arc(eyeXR, eyeY, 9, 0, Math.PI*2); orCtx.fill();

    // ROARING mouth
    orCtx.fillStyle = '#0f172a'; orCtx.beginPath(); oCtx.arc(96, mouthY + 8, 16, 0, Math.PI*2); olCtx.fill();
    orCtx.fillStyle = '#f97316'; orCtx.beginPath(); oCtx.arc(96, mouthY + 10, 11, 0, Math.PI*2); olCtx.fill();
    orCtx.fillStyle = '#ffffff'; orCtx.fillRect(86, mouthY - 6, 4, 4); orCtx.fillRect(102, mouthY - 6, 4, 4);

    // Trunks
    orCtx.fillStyle = opponentShortsColor; orCtx.fillRect(44, 142, 104, 22);
    orCtx.fillStyle = opponentBeltColor; orCtx.beginPath(); orCtx.arc(96, 142, 12, 0, Math.PI*2); orCtx.fill();

    // Normal Left Glove in guard
    orCtx.fillStyle = getGloveGrad(orCtx, 36, 116, 26);
    orCtx.beginPath(); orCtx.arc(36, 116, 26, 0, Math.PI*2); orCtx.fill();

    // EXTENDED RIGHT GLOVE
    orCtx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; orCtx.lineWidth = 12;
    orCtx.beginPath(); orCtx.moveTo(156, 116); orCtx.lineTo(164, 146); orCtx.stroke();

    orCtx.fillStyle = getGloveGrad(orCtx, 164, 146, 36);
    orCtx.beginPath(); orCtx.arc(164, 146, 36, 0, Math.PI*2); orCtx.fill();
    orCtx.fillStyle = 'rgba(255, 255, 255, 0.5)'; orCtx.beginPath(); orCtx.arc(156, 136, 8, 0, Math.PI*2); orCtx.fill();

    scene.textures.addCanvas('opp-punch-r', orCanvas);

    // ==========================================
    // 10. Opponent Stunned (Canvas 192x192)
    // ==========================================
    const osCanvas = document.createElement('canvas'); osCanvas.width = 192; osCanvas.height = 192;
    const osCtx = osCanvas.getContext('2d');
    
    osCtx.shadowColor = 'rgba(0, 0, 0, 0.3)'; osCtx.shadowBlur = 10; osCtx.shadowOffsetY = 6;
    
    if (tier === 'rook') {
      osCtx.fillStyle = '#111827'; osCtx.fillRect(52, 48, 88, 20);
    }
    
    // Draw Dynamic Body Shape (Bruised Stunned Colors)
    drawOpponentBody(osCtx, true);

    if (tier === 'rook') {
      osCtx.strokeStyle = '#1e293b'; osCtx.lineWidth = 2.2;
      osCtx.beginPath();
      osCtx.moveTo(50, 72); osCtx.lineTo(142, 72); osCtx.moveTo(48, 102); osCtx.lineTo(144, 102); osCtx.moveTo(46, 132); osCtx.lineTo(146, 132);
      osCtx.stroke();
    }

    // COMICAL SPIRAL EYES
    const drawSpiral = (ctx, cx, cy, maxR) => {
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let theta = 0; theta < Math.PI * 5; theta += 0.1) {
        const r = (theta / (Math.PI * 5)) * maxR;
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        if (theta === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    osCtx.fillStyle = '#111827'; osCtx.beginPath(); osCtx.arc(eyeXL, eyeY, 13, 0, Math.PI*2); osCtx.arc(eyeXR, eyeY, 13, 0, Math.PI*2); osCtx.fill();
    drawSpiral(osCtx, eyeXL, eyeY, 11);
    drawSpiral(osCtx, eyeXR, eyeY, 11);

    // Drooping sad eyebrows
    osCtx.strokeStyle = '#000000'; osCtx.lineWidth = 3.5;
    osCtx.beginPath();
    osCtx.moveTo(eyeXL - 18, eyeY - 8); osCtx.lineTo(eyeXL + 8, eyeY - 2);
    osCtx.moveTo(eyeXR + 18, eyeY - 8); osCtx.lineTo(eyeXR - 8, eyeY - 2);
    osCtx.stroke();

    // Dazed open mouth with tongue hanging out!
    osCtx.fillStyle = '#111827'; osCtx.fillRect(80, mouthY, 32, 18);
    osCtx.fillStyle = '#f43f5e'; // pink tongue
    osCtx.beginPath(); osCtx.arc(96, mouthY + 12, 8, 0, Math.PI); osCtx.fill();
    osCtx.fillStyle = '#ffffff'; osCtx.fillRect(82, mouthY, 6, 4); osCtx.fillRect(104, mouthY, 6, 4);

    // Bruise purple mark
    osCtx.fillStyle = 'rgba(168, 85, 247, 0.45)';
    osCtx.beginPath(); osCtx.arc(62, eyeY + 22, 10, 0, Math.PI*2); osCtx.fill();

    // Band-aid
    if (tier === 'rook') {
      osCtx.fillStyle = '#fed7aa'; osCtx.fillRect(120, 44, 20, 8);
      osCtx.fillStyle = '#fca5a5'; osCtx.fillRect(126, 44, 8, 8);
    }

    // Red shorts
    osCtx.fillStyle = opponentShortsColor; osCtx.fillRect(44, 142, 104, 22);

    // Gloves dropped and hanging down weakly!
    osCtx.fillStyle = getGloveGrad(osCtx, 32, 156, 20);
    osCtx.beginPath(); osCtx.arc(32, 156, 20, 0, Math.PI*2); osCtx.fill();

    osCtx.fillStyle = getGloveGrad(osCtx, 160, 156, 20);
    osCtx.beginPath(); osCtx.arc(160, 156, 20, 0, Math.PI*2); osCtx.fill();

    // COMICAL SPINNING GOLD STARS ORBIT
    osCtx.strokeStyle = 'rgba(251, 191, 36, 0.35)'; osCtx.lineWidth = 1.5;
    osCtx.beginPath(); osCtx.ellipse(96, 22, 44, 10, Math.PI / 12, 0, Math.PI * 2); osCtx.stroke();
    
    const drawGoldStar = (ctx, sx, sy, r) => {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * r + sx, -Math.sin((18 + i * 72) * Math.PI / 180) * r + sy);
        ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (r*0.4) + sx, -Math.sin((54 + i * 72) * Math.PI / 180) * (r*0.4) + sy);
      }
      ctx.closePath(); ctx.fill();
    };
    drawGoldStar(osCtx, 56, 20, 6);
    drawGoldStar(osCtx, 96, 12, 6);
    drawGoldStar(osCtx, 136, 20, 6);

    scene.textures.addCanvas('opp-stunned', osCanvas);
  }

  // --- DRAW RETRO 3D PERSPECTIVE RING ON GRAPHICS CANVAS ---
  drawRetroRingBackground(g, colorHex, time) {
    g.clear();
    
    // 1. Dark arena sky background
    g.fillStyle(0x020617, 1);
    g.fillRect(0, 0, 800, 450);

    const horizonY = 160;

    // 2. Cheering Stadium Crowd Rows (drawn programmatically with shaded retro silhouettes)
    const t = time ? time * 0.004 : 0;
    for (let rY = 20; rY < horizonY; rY += 28) {
      // Stand base
      g.fillStyle(0x0f172a, 0.9);
      g.fillRect(0, rY, 800, 8);
      
      // Spectators silhouettes
      g.fillStyle(0x1e293b, 1);
      for (let cx = 10; cx < 800; cx += 24) {
        // Dynamic crowd bobbing wave using time!
        const wave = Math.sin(t + cx * 0.04 + rY * 0.15) * 3.5;
        const hOffset = wave + (Math.sin(cx * 12) * 2); // randomize head heights + wave bobbing
        g.fillCircle(cx, rY + 16 + hOffset, 8); // head
        g.fillRect(cx - 10, rY + 22 + hOffset, 20, 20); // shoulders
        
        // Sporadic, slow camera flashes in the crowd!
        if ((cx + rY) % 7 === 0) { // Only about 14% of the crowd has a camera
          const flashCycle = ((time || 0) + cx * 987 + rY * 432) % 7000; // 7 seconds loop
          if (flashCycle < 300) {
            const intensity = Math.sin((flashCycle / 300) * Math.PI); // smooth 300ms bell curve flash
            g.fillStyle(0xffffff, intensity * 0.95);
            g.fillCircle(cx, rY + 14 + hOffset, 3.5); // bulb
            g.fillStyle(0xfef08a, intensity * 0.45);
            g.fillCircle(cx, rY + 14 + hOffset, 20); // flash glow aura
            g.fillStyle(0x1e293b, 1); // restore spectator color
          }
        }
      }
    }

    // Shadow boundary at the horizon to blend crowd and floor
    g.fillStyle(0x090d16, 0.95);
    g.fillRect(0, horizonY - 12, 800, 16);

    // 3. Sweep Spotlight Beams (Dramatic championship light cones!)
    g.fillStyle(0x38bdf8, 0.08); // soft blue spotlight
    g.beginPath();
    g.moveTo(0, 0); g.lineTo(240, 450); g.lineTo(480, 450); g.closePath(); g.fill();

    g.fillStyle(0xf87171, 0.06); // soft red spotlight
    g.beginPath();
    g.moveTo(800, 0); g.lineTo(560, 450); g.lineTo(320, 450); g.closePath(); g.fill();

    // 4. Floor: 3D perspective grid lines
    g.lineStyle(2, 0x1e293b, 0.7);
    for (let i = 0; i <= 20; i++) {
      const xStart = (i - 10) * 130 + 400;
      g.beginPath();
      g.moveTo(xStart, 450);
      g.lineTo((i - 10) * 18 + 400, horizonY);
      g.strokePath();
    }
    for (let y = horizonY; y < 450; y += 32) {
      const factor = (y - horizonY) / (450 - horizonY);
      const w = 420 * factor;
      g.beginPath();
      g.moveTo(400 - w, y);
      g.lineTo(400 + w, y);
      g.strokePath();
    }

    // 5. Drawing Canvas Ring Base Platform with 3D Depth (Apron)
    
    // Canvas Top surface coordinates
    const tL = { x: 180, y: horizonY + 20 };
    const tR = { x: 620, y: horizonY + 20 };
    const bR = { x: 750, y: 415 };
    const bL = { x: 50, y: 415 };
    
    // Platform height (apron depth)
    const apronH = 15;
    
    // Draw Front Apron (vertical front wall)
    g.fillStyle(0x0f172a, 1); // Dark grey metal/canvas apron
    g.beginPath();
    g.moveTo(bL.x, bL.y);
    g.lineTo(bR.x, bR.y);
    g.lineTo(bR.x + 8, bR.y + apronH);
    g.lineTo(bL.x - 8, bL.y + apronH);
    g.closePath();
    g.fill();
    
    // Draw Left Side Apron (vertical left wall)
    g.fillStyle(0x0a0f1d, 1);
    g.beginPath();
    g.moveTo(tL.x, tL.y);
    g.lineTo(bL.x, bL.y);
    g.lineTo(bL.x - 8, bL.y + apronH);
    g.lineTo(tL.x - 4, tL.y + apronH);
    g.closePath();
    g.fill();

    // Draw Right Side Apron (vertical right wall)
    g.fillStyle(0x080c16, 1);
    g.beginPath();
    g.moveTo(tR.x, tR.y);
    g.lineTo(bR.x, bR.y);
    g.lineTo(bR.x + 8, bR.y + apronH);
    g.lineTo(tR.x + 4, tR.y + apronH);
    g.closePath();
    g.fill();
    
    // Red accent stripes on the front apron for a retro punch-out aesthetic
    g.fillStyle(0xdc2626, 1);
    g.fillRect(bL.x - 5, bL.y + 4, bR.x - bL.x + 10, 3);

    // 3D perspective projection helper for the ring canvas surface
    const getCanvasPt = (u, v) => {
      const leftX = tL.x + (bL.x - tL.x) * v;
      const rightX = tR.x + (bR.x - tR.x) * v;
      const y = tL.y + (bL.y - tL.y) * v;
      const x = leftX + (rightX - leftX) * u;
      return { x, y };
    };

    // Draw detailed 3D Chessboard Pattern directly on the Ring Canvas!
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const p0 = getCanvasPt(col / 8, row / 8);
        const p1 = getCanvasPt((col + 1) / 8, row / 8);
        const p2 = getCanvasPt((col + 1) / 8, (row + 1) / 8);
        const p3 = getCanvasPt(col / 8, (row + 1) / 8);
        
        // Alternate squares between deep royal-indigo and dark retro blue
        const isDark = (row + col) % 2 === 1;
        g.fillStyle(isDark ? 0x1a1840 : 0x0c0b24, 0.95);
        g.beginPath();
        g.moveTo(p0.x, p0.y);
        g.lineTo(p1.x, p1.y);
        g.lineTo(p2.x, p2.y);
        g.lineTo(p3.x, p3.y);
        g.closePath();
        g.fill();
      }
    }

    // Outer border stroke around the chessboard to outline the ring floor
    g.lineStyle(3, 0xfbbf24, 0.85); // gold border around the canvas top
    g.beginPath();
    g.moveTo(tL.x, tL.y); g.lineTo(tR.x, tR.y); g.lineTo(bR.x, bR.y); g.lineTo(bL.x, bL.y); g.closePath();
    g.strokePath();

    // Canvas Seams / Grid Lines (stitched retro texture along the cell boundaries)
    g.lineStyle(1.5, 0x1e293b, 0.35);
    for (let i = 1; i < 8; i++) {
      const startH = getCanvasPt(0, i / 8);
      const endH = getCanvasPt(1, i / 8);
      g.beginPath(); g.moveTo(startH.x, startH.y); g.lineTo(endH.x, endH.y); g.strokePath();

      const startV = getCanvasPt(i / 8, 0);
      const endV = getCanvasPt(i / 8, 1);
      g.beginPath(); g.moveTo(startV.x, startV.y); g.lineTo(endV.x, endV.y); g.strokePath();
    }

    // Shadows beneath the fighters (grounding them perfectly on the 3D floor)
    g.fillStyle(0x000000, 0.45);
    g.fillEllipse(400, 198, 90, 24); // Opponent foot shadow
    g.fillEllipse(400, 385, 140, 32); // Player foot shadow
    
    // Highlight spotlight center (ambient illumination overlay on the canvas)
    g.fillStyle(0xffffff, 0.04);
    g.fillEllipse(400, 290, 420, 110); // broad light reflection glow covering the canvas

    // 6. Premium 3D Padded Corner Cushions with metallic turnbuckles and cylindrical capsule style
    
    // Bottom-Left (Red Corner)
    g.fillStyle(0xb91c1c, 1); // Red base pad
    g.fillRoundedRect(bL.x - 12, 230, 24, 185, 8);
    g.fillStyle(0xef4444, 1); // Highlight cylinder strip
    g.fillRoundedRect(bL.x - 8, 230, 8, 185, 4);
    g.fillStyle(0x7f1d1d, 1); // Shadow cylinder strip
    g.fillRoundedRect(bL.x, 230, 11, 185, 4);
    
    // Bottom-Left Top/Bottom steel caps
    g.fillStyle(0x475569, 1);
    g.fillEllipse(bL.x, 230, 26, 6);
    g.fillEllipse(bL.x, 415, 26, 6);
    g.fillStyle(0x94a3b8, 1);
    g.fillEllipse(bL.x, 230, 16, 3);
    
    // Bottom-Left Leather tension straps
    g.fillStyle(0x0f172a, 1);
    for (let sy = 250; sy < 400; sy += 45) {
      g.fillRect(bL.x - 14, sy, 28, 4);
    }
    
    // Bottom-Left Chrome Bracket turnbuckles connecting to ropes
    g.fillStyle(0x64748b, 1);
    g.fillRect(bL.x - 15, 258, 30, 4);
    g.fillRect(bL.x - 15, 308, 30, 4);
    g.fillRect(bL.x - 15, 358, 30, 4);
    g.fillStyle(0xe2e8f0, 1);
    g.fillRect(bL.x - 17, 259, 3, 2); g.fillRect(bL.x + 14, 259, 3, 2);
    g.fillRect(bL.x - 17, 309, 3, 2); g.fillRect(bL.x + 14, 309, 3, 2);
    g.fillRect(bL.x - 17, 359, 3, 2); g.fillRect(bL.x + 14, 359, 3, 2);
    
    // Bottom-Right (Blue Corner)
    g.fillStyle(0x1d4ed8, 1); // Blue base pad
    g.fillRoundedRect(bR.x - 12, 230, 24, 185, 8);
    g.fillStyle(0x3b82f6, 1); // Highlight cylinder strip
    g.fillRoundedRect(bR.x - 8, 230, 8, 185, 4);
    g.fillStyle(0x1e3a8a, 1); // Shadow cylinder strip
    g.fillRoundedRect(bR.x, 230, 11, 185, 4);
    
    // Bottom-Right Top/Bottom steel caps
    g.fillStyle(0x475569, 1);
    g.fillEllipse(bR.x, 230, 26, 6);
    g.fillEllipse(bR.x, 415, 26, 6);
    g.fillStyle(0x94a3b8, 1);
    g.fillEllipse(bR.x, 230, 16, 3);
    
    // Bottom-Right Leather tension straps
    g.fillStyle(0x0f172a, 1);
    for (let sy = 250; sy < 400; sy += 45) {
      g.fillRect(bR.x - 14, sy, 28, 4);
    }
    
    // Bottom-Right Chrome Bracket turnbuckles connecting to ropes
    g.fillStyle(0x64748b, 1);
    g.fillRect(bR.x - 15, 258, 30, 4);
    g.fillRect(bR.x - 15, 308, 30, 4);
    g.fillRect(bR.x - 15, 358, 30, 4);
    g.fillStyle(0xe2e8f0, 1);
    g.fillRect(bR.x - 17, 259, 3, 2); g.fillRect(bR.x + 14, 259, 3, 2);
    g.fillRect(bR.x - 17, 309, 3, 2); g.fillRect(bR.x + 14, 309, 3, 2);
    g.fillRect(bR.x - 17, 359, 3, 2); g.fillRect(bR.x + 14, 359, 3, 2);

    // Top-Left (Neutral White Corner)
    g.fillStyle(0xd1d5db, 1); // White base pad
    g.fillRoundedRect(tL.x - 8, tL.y - 40, 16, 60, 4);
    g.fillStyle(0xf3f4f6, 1); // Highlight cylinder strip
    g.fillRoundedRect(tL.x - 6, tL.y - 40, 5, 60, 2);
    g.fillStyle(0x9ca3af, 1); // Shadow cylinder strip
    g.fillRoundedRect(tL.x - 1, tL.y - 40, 7, 60, 2);
    
    // Top-Left top cap
    g.fillStyle(0x475569, 1);
    g.fillEllipse(tL.x, tL.y - 40, 18, 4);
    
    // Top-Left Leather tension straps and hooks
    g.fillStyle(0x0f172a, 1);
    for (let sy = tL.y - 30; sy < tL.y + 20; sy += 18) {
      g.fillRect(tL.x - 10, sy, 20, 2);
    }
    g.fillStyle(0x64748b, 1);
    g.fillRect(tL.x - 10, 138, 20, 2);
    g.fillRect(tL.x - 10, 163, 20, 2);
    g.fillRect(tL.x - 10, 188, 20, 2);

    // Top-Right (Neutral White Corner)
    g.fillStyle(0xd1d5db, 1); // White base pad
    g.fillRoundedRect(tR.x - 8, tR.y - 40, 16, 60, 4);
    g.fillStyle(0xf3f4f6, 1); // Highlight cylinder strip
    g.fillRoundedRect(tR.x - 6, tR.y - 40, 5, 60, 2);
    g.fillStyle(0x9ca3af, 1); // Shadow cylinder strip
    g.fillRoundedRect(tR.x - 1, tR.y - 40, 7, 60, 2);
    
    // Top-Right top cap
    g.fillStyle(0x475569, 1);
    g.fillEllipse(tR.x, tR.y - 40, 18, 4);
    
    // Top-Right Leather tension straps and hooks
    g.fillStyle(0x0f172a, 1);
    for (let sy = tR.y - 30; sy < tR.y + 20; sy += 18) {
      g.fillRect(tR.x - 10, sy, 20, 2);
    }
    g.fillStyle(0x64748b, 1);
    g.fillRect(tR.x - 10, 138, 20, 2);
    g.fillRect(tR.x - 10, 163, 20, 2);
    g.fillRect(tR.x - 10, 188, 20, 2);

    // 7. Glowing Dual-Pass Neon Ring Ropes (ultra premium light tube style)
    const neonCol = Phaser.Display.Color.HexStringToColor(colorHex).color;
    
    // Shadow ropes for 3D depth on the floor canvas
    g.lineStyle(5, 0x000000, 0.45);
    g.beginPath();
    g.moveTo(bL.x, 264); g.lineTo(tL.x, horizonY - 16); g.lineTo(tR.x, horizonY - 16); g.lineTo(bR.x, 264);
    g.moveTo(bL.x, 314); g.lineTo(tL.x, horizonY + 9); g.lineTo(tR.x, horizonY + 9); g.lineTo(bR.x, 314);
    g.moveTo(bL.x, 364); g.lineTo(tL.x, horizonY + 34); g.lineTo(tR.x, horizonY + 34); g.lineTo(bR.x, 364);
    g.strokePath();

    // Pass 1: Glowing thick outer line (neon bloom glow)
    g.lineStyle(9, neonCol, 0.45);
    g.beginPath();
    g.moveTo(bL.x, 260); g.lineTo(tL.x, horizonY - 20); g.lineTo(tR.x, horizonY - 20); g.lineTo(bR.x, 260);
    g.moveTo(bL.x, 310); g.lineTo(tL.x, horizonY + 5); g.lineTo(tR.x, horizonY + 5); g.lineTo(bR.x, 310);
    g.moveTo(bL.x, 360); g.lineTo(tL.x, horizonY + 30); g.lineTo(tR.x, horizonY + 30); g.lineTo(bR.x, 360);
    g.strokePath();

    // Pass 2: Bright thin inner core (intense neon glow tube)
    g.lineStyle(3, 0xffffff, 0.95);
    g.beginPath();
    g.moveTo(bL.x, 260); g.lineTo(tL.x, horizonY - 20); g.lineTo(tR.x, horizonY - 20); g.lineTo(bR.x, 260);
    g.moveTo(bL.x, 310); g.lineTo(tL.x, horizonY + 5); g.lineTo(tR.x, horizonY + 5); g.lineTo(bR.x, 310);
    g.moveTo(bL.x, 360); g.lineTo(tL.x, horizonY + 30); g.lineTo(tR.x, horizonY + 30); g.lineTo(bR.x, 360);
    g.strokePath();
  }

  // --- BOXING HUD UPDATER ---
  updateBoxingTopBar() {
    const pEl = document.getElementById('boxing-punches-val');
    if (pEl) {
      pEl.textContent = `L: ${this.hitsLandedThisRound} | R: ${this.hitsReceivedThisRound}`;
    }
    // Mobile mini-HUD
    const mpEl = document.getElementById('mobile-punches');
    if (mpEl) mpEl.textContent = `🥊 ${this.hitsLandedThisRound}/${this.hitsReceivedThisRound}`;
    
    // Update Health bars — simple solid color changes for thin bars
    const pHPBar = document.getElementById('health-player-bar');
    const pHPText = document.getElementById('health-player-text');
    if (pHPBar) {
      pHPBar.style.width = `${this.playerHealth}%`;
      if (this.playerHealth < 30) pHPBar.style.background = '#ef4444';
      else if (this.playerHealth < 60) pHPBar.style.background = '#fbbf24';
      else pHPBar.style.background = '#4ade80';
    }
    if (pHPText) pHPText.textContent = `${Math.round(this.playerHealth)}%`;

    const oHPBar = document.getElementById('health-opponent-bar');
    const oHPText = document.getElementById('health-opponent-text');
    if (oHPBar) {
      const oppPct = Math.round(this.opponentHealth);
      oHPBar.style.width = `${oppPct}%`;
      if (oppPct < 30) oHPBar.style.background = '#991b1b';
      else if (oppPct < 60) oHPBar.style.background = '#f59e0b';
      else oHPBar.style.background = '#ef4444';
    }
    if (oHPText) oHPText.textContent = `${Math.round(this.opponentHealth)}%`;
    
    // Update Super progress bars in DOM
    const pBar = document.getElementById('super-player-bar');
    if (pBar) {
      pBar.style.width = `${this.playerSuperPower}%`;
      if (this.playerSuperPower === 100) {
        pBar.style.boxShadow = '0 0 10px #38bdf8';
        const readyText = document.getElementById('super-player-ready');
        if (readyText) readyText.style.display = 'block';
        const btnSuper = document.getElementById('btn-super');
        if (btnSuper) btnSuper.style.display = 'flex';
      } else {
        pBar.style.boxShadow = 'none';
        const readyText = document.getElementById('super-player-ready');
        if (readyText) readyText.style.display = 'none';
        const btnSuper = document.getElementById('btn-super');
        if (btnSuper) btnSuper.style.display = 'none';
      }
    }

    const oBar = document.getElementById('super-opponent-bar');
    if (oBar) {
      oBar.style.width = `${this.opponentSuperPower}%`;
      if (this.opponentSuperPower === 100) {
        oBar.style.boxShadow = '0 0 10px #ef4444';
        const oReady = document.getElementById('super-opponent-ready');
        if (oReady) oReady.style.display = 'block';
      } else {
        oBar.style.boxShadow = 'none';
        const oReady = document.getElementById('super-opponent-ready');
        if (oReady) oReady.style.display = 'none';
      }
    }
  }

  destroyPhaserEngine() {
    clearInterval(this.boxingTimer);
    if (this.phaserGame) {
      this.phaserGame.destroy(true);
      this.phaserGame = null;
    }
  }

  // ===================================================================
  // FASE B: AJEDREZ ESTRATÉGICO CON RELOJ Y STOCKFISH
  // ===================================================================
  startChessPhase() {
    // Start tension clock-ticking chess chiptune music
    this.startMusic('chess');
    this.playBell();

    // Calculate damage-based visual filters & overlays (smoothly gradual blurry vision, blood, vignette)
    let boardStyle = "";
    let statusStyle = "";
    let vignetteOverlayHTML = "";
    let bloodDropsHTML = "";

    // Threshold changed to 80% to keep first rounds pristine and damage scaling highly gradual!
    if (this.playerHealth < 80) {
      const damageFactor = (80 - this.playerHealth) / 80; // starts at 0 (at 80% health) and scales to 1.0 (at 0% health)
      
      // 1. Gradual Blur: Subtle at first, severely blurred only when critical
      const blurPx = (damageFactor * 1.8).toFixed(2);
      boardStyle = `filter: blur(${blurPx}px); transition: filter 0.3s; pointer-events: auto;`;

      // 2. Chromatic Aberration & Double Vision Text Shadow
      const offsetPx = (damageFactor * 2.5).toFixed(2);
      const isCritical = this.playerHealth < 35;
      statusStyle = `
        text-shadow: ${offsetPx}px 0 1px rgba(239,68,68,0.65), -${offsetPx}px 0 1px rgba(56,189,248,0.65);
        ${isCritical ? 'font-weight: 900; animation: shakeHeavy 0.5s infinite;' : ''}
      `;

      // 3. Gradual Damage Vignette (purple-blue cartoon tint, not blood red)
      const vignetteIntensity = (damageFactor * 0.60).toFixed(2);
      const vignetteBlur = Math.round(15 + damageFactor * 30);
      vignetteOverlayHTML = `
        <div id="chess-damage-vignette" style="
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 100;
          box-shadow: inset 0 0 ${vignetteBlur}px rgba(139, 92, 246, ${vignetteIntensity});
          ${isCritical ? 'animation: pulseVignette 1.2s infinite alternate;' : ''}
          transition: all 0.5s ease;
          border-radius: 20px;
        "></div>
      `;

      // 4. Cartoonish damage effects: comical band-aids, stars, cracked lens
      if (this.playerHealth < 65) {
        const dmgOpacity = ((65 - this.playerHealth) / 65 * 0.75 + 0.10).toFixed(2);
        bloodDropsHTML = `
          <!-- Cartoonish Battle Damage Overlays — kid-friendly! -->
          <svg style="position: absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index: 101;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" preserveAspectRatio="none">
            <!-- Top-left: Comical band-aid -->
            <g transform="translate(25, 25) rotate(-15)" opacity="${dmgOpacity}">
              <rect x="0" y="0" width="60" height="22" rx="3" fill="#fed7aa" stroke="#d97706" stroke-width="1.5"/>
              <rect x="22" y="0" width="16" height="22" fill="#fca5a5" stroke="#d97706" stroke-width="0.8"/>
              <circle cx="4" cy="11" r="2" fill="#d97706"/>
              <circle cx="12" cy="11" r="2" fill="#d97706"/>
              <circle cx="48" cy="11" r="2" fill="#d97706"/>
              <circle cx="56" cy="11" r="2" fill="#d97706"/>
            </g>
            <!-- Top-right: Cartoon spinning stars -->
            <g transform="translate(755, 35)" opacity="${dmgOpacity}">
              <polygon points="0,-18 5,-6 18,-6 8,2 11,15 0,7 -11,15 -8,2 -18,-6 -5,-6" fill="#fbbf24" stroke="#f59e0b" stroke-width="1">
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite"/>
              </polygon>
            </g>
            <g transform="translate(725, 55)" opacity="${(dmgOpacity * 0.7).toFixed(2)}">
              <polygon points="0,-10 3,-3 10,-3 5,1 7,8 0,3 -7,8 -5,1 -10,-3 -3,-3" fill="#fbbf24" stroke="#f59e0b" stroke-width="0.8">
                <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="2.2s" repeatCount="indefinite"/>
              </polygon>
            </g>
            <!-- Bottom-right: Cracked lens / glass shatter effect -->
            <g transform="translate(700, 380)" opacity="${dmgOpacity}">
              <line x1="0" y1="0" x2="45" y2="-30" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
              <line x1="45" y1="-30" x2="60" y2="-50" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
              <line x1="45" y1="-30" x2="70" y2="-15" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="0" y1="0" x2="-35" y2="-20" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
              <line x1="0" y1="0" x2="-20" y2="-45" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
            </g>
            <!-- Bottom-left: Comical purple bruise marks (cartoon circles) -->
            <g transform="translate(50, 385)" opacity="${(dmgOpacity * 0.8).toFixed(2)}">
              <circle cx="0" cy="0" r="15" fill="none" stroke="#a855f7" stroke-width="3" stroke-dasharray="6,4">
                <animate attributeName="r" values="15;18;15" dur="1.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="0" cy="0" r="8" fill="#c084fc" opacity="0.5">
                <animate attributeName="r" values="8;10;8" dur="1.5s" repeatCount="indefinite"/>
              </circle>
            </g>
          </svg>
        `;
      }
    }

    this.container.innerHTML = `
      <div class="empanadas-container chessbox-chess-container" style="position: relative; overflow: hidden; border-radius: 20px;">
        ${vignetteOverlayHTML}
        ${bloodDropsHTML}
        <div class="empanadas-top-bar">
          <button class="btn-close-modal" id="btn-chess-resign" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">
            ← Rendirse ✕
          </button>
          
          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="timer-box" id="chessbox-btn-mute" style="cursor: pointer; background: rgba(0,0,0,0.4); border-color: var(--glass-border); color: white;">
              ${this.musicEnabled ? '🔊 Sonido' : '🔇 Mute'}
            </button>
            <div class="timer-box" id="chess-player-clock-box">
              <span>⏱️ TÚ:</span> <span id="chess-player-clock-val">--:--</span>
            </div>
            <div class="timer-box" id="chess-opponent-clock-box" style="border-color: #ef4444;">
              <span>⏱️ RIVAL:</span> <span id="chess-opponent-clock-val">--:--</span>
            </div>
          </div>
        </div>

        <div class="empanadas-layout">
          <!-- Chess Board -->
          <div class="cooking-station">
            <div class="chess-board-wrapper" style="${boardStyle}">
              <div class="chess-board" id="chessbox-board-DOM"></div>
            </div>
          </div>

          <!-- Round Status & Controls -->
          <div class="maze-dashboard" style="background: rgba(0,0,0,0.3); border:1px solid var(--glass-border); border-radius: 15px; padding: 15px; box-shadow: var(--glass-shadow); max-width:340px;">
            <div style="border-bottom: 1px solid var(--glass-border); padding-bottom: 8px; margin-bottom: 10px;">
              <span class="round-badge" style="background: #fbbf24; font-size:0.75rem;">Ronda ${this.currentRound} — Ajedrez</span>
              <h4 style="color:#fbbf24; font-size:1.15rem; margin-top:5px;">🧠 Batalla Mental</h4>
              <p id="chessbox-status" style="font-size:0.85rem; color:#cbd5e1; margin-top:4px; ${statusStyle}">¡Tu turno! Juegas con blancas ♔</p>
            </div>
            
            <div style="background: rgba(0,0,0,0.25); padding: 10px; border-radius: 8px; font-size: 0.85rem; border:1px solid rgba(255,255,255,0.03); max-height: 120px; overflow-y: auto;">
              <span style="font-weight: 700; color:#cbd5e1; display:block; margin-bottom: 5px;">Movimientos:</span>
              <div id="chessbox-history" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; color: #94a3b8; font-family: monospace;"></div>
            </div>

            <!-- Boxing round duration timer (A Chess round lasts 300s, then bell rings and switches to boxing!) -->
            <div class="recipe-instruction-card" style="border-color: #fbbf24; margin-top:10px; padding: 8px 12px; text-align:center;">
              <span style="font-size: 0.75rem; color:#94a3b8; text-transform:uppercase;">Duración del Asalto de Ajedrez</span>
              <div style="font-size: 1.5rem; font-weight:800; color:#fbbf24;" id="chessbox-round-timer-val">300s</div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-chess-resign').addEventListener('click', () => {
      this.gameOver("Te rendiste durante la ronda de ajedrez. 😞");
    });

    document.getElementById('chessbox-btn-mute').addEventListener('click', () => {
      this.toggleMute();
    });

    this.renderChessBoard();
    this.startChessClocks();
  }

  // --- CHESS CLOCKS RUNNER & TIMERS ---
  startChessClocks() {
    const playerClockVal = document.getElementById('chess-player-clock-val');
    const opponentClockVal = document.getElementById('chess-opponent-clock-val');
    const roundTimerVal = document.getElementById('chess-box-round-timer-val') || document.getElementById('chessbox-round-timer-val');
    
    let chessRoundSecondsLeft = 300; // 300s (5 minutes) chess round limit for comfortable, deep strategic play!
    
    // Set initial text
    if (playerClockVal) playerClockVal.textContent = this.formatClock(this.playerChessClock);
    if (opponentClockVal) opponentClockVal.textContent = this.formatClock(this.opponentChessClock);

    const getTurn = () => {
      const parts = this.chessFEN.split(' ');
      return parts[1] || 'w';
    };

    this.chessClockInterval = setInterval(() => {
      const turn = getTurn();

      // Tick chess round limit
      chessRoundSecondsLeft--;
      if (roundTimerVal) roundTimerVal.textContent = `${chessRoundSecondsLeft}s`;

      // Tick active player clock
      if (turn === 'w') {
        this.playerChessClock = Math.max(0, this.playerChessClock - 100);
        if (playerClockVal) playerClockVal.textContent = this.formatClock(this.playerChessClock);
        
        if (this.playerChessClock <= 10000) {
          const box = document.getElementById('chess-player-clock-box');
          if (box) box.classList.add('timer-danger');
        }

        if (this.playerChessClock <= 0) {
          this.gameOver("¡Tu tiempo en el reloj de ajedrez se ha agotado! Nocaut Técnico (K.O.T.) por caída de bandera. 😞");
          return;
        }
      } else {
        this.opponentChessClock = Math.max(0, this.opponentChessClock - 100);
        if (opponentClockVal) opponentClockVal.textContent = this.formatClock(this.opponentChessClock);

        if (this.opponentChessClock <= 10000) {
          const box = document.getElementById('chess-opponent-clock-box');
          if (box) box.classList.add('timer-danger');
        }

        if (this.opponentChessClock <= 0) {
          this.completeChessVictory("¡El reloj de tu oponente se ha agotado! Victoria por K.O. Técnico (K.O.T.) 🏆");
          return;
        }
      }

      // If chess round time hits 0 -> switch back to boxing!
      if (chessRoundSecondsLeft <= 0) {
        clearInterval(this.chessClockInterval);
        
        // Ring bell and transition back to ring!
        window.GameAudio.playVictory();
        this.currentRound++;
        this.startRound();
      }
    }, 100);
  }

  // --- RENDER DOM CHESSBOARD GRID ---
  renderChessBoard() {
    const boardDOM = document.getElementById('chessbox-board-DOM');
    if (!boardDOM) return;
    boardDOM.innerHTML = '';

    const board = this.parseFEN(this.chessFEN);
    const sym = {
      'K':'♔','Q':'♕','R':'♖','B':'♗','N':'♘','P':'♙',
      'k':'♚','q':'♛','r':'♜','b':'♝','n':'♞','p':'♟'
    };

    const legalMoves = this.getAllLegalMoves(this.chessFEN, 'w');
    const parts = this.chessFEN.split(' ');
    const turn = parts[1] || 'w';

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const square = document.createElement('div');
        const light = (r + c) % 2 === 0;
        const file = String.fromCharCode(97 + c);
        const rank = 8 - r;
        const coord = `${file}${rank}`;

        square.className = `chess-square ${light ? 'square-light' : 'square-dark'}`;
        square.setAttribute('data-coord', coord);
        square.setAttribute('data-file', file);
        square.setAttribute('data-rank', rank);

        const piece = board[r][c];
        if (piece) {
          const pieceEl = document.createElement('div');
          pieceEl.className = 'chess-piece';
          pieceEl.textContent = sym[piece] || '';
          pieceEl.style.color = piece === piece.toUpperCase() ? '#ffffff' : '#0a0a0a';
          pieceEl.style.textShadow = piece === piece.toUpperCase()
            ? '-1px -1px 0 #1a1a2e, 1px -1px 0 #1a1a2e, -1px 1px 0 #1a1a2e, 1px 1px 0 #1a1a2e, 0 3px 6px rgba(0,0,0,0.5)'
            : '-1px -1px 0 #e2e8f0, 1px -1px 0 #e2e8f0, -1px 1px 0 #e2e8f0, 1px 1px 0 #e2e8f0, 0 2px 4px rgba(0,0,0,0.3)';
          pieceEl.style.fontSize = '2.6rem';
          pieceEl.style.fontWeight = '700';
          square.appendChild(pieceEl);
        }

        // Highlight last move
        if (this.lastChessMove) {
          if (coord === this.lastChessMove.from || coord === this.lastChessMove.to) {
            square.style.backgroundColor = (r + c) % 2 === 0 ? '#c8d45a' : '#a8b440';
          }
        }

        // Click handler
        square.addEventListener('click', () => this.handleSquareClick(r, c));

        boardDOM.appendChild(square);
      }
    }

    this.updateChessHistoryDisplay();
  }

  // --- INTERACTIVITY: SQUARE CLICKS & MOVES ---
  handleSquareClick(r, c) {
    const parts = this.chessFEN.split(' ');
    const turn = parts[1] || 'w';
    if (turn !== 'w' || this.isThinking || !this.gameActive) return;

    const board = this.parseFEN(this.chessFEN);
    const piece = board[r][c];
    const file = String.fromCharCode(97 + c);
    const rank = 8 - r;
    const coord = `${file}${rank}`;

    // Remove highlighted guides
    document.querySelectorAll('#chessbox-board-DOM div').forEach(sq => {
      sq.style.boxShadow = ''; sq.style.outline = '';
    });

    if (this.selectedSquare) {
      const fromCoord = this.selectedSquare.coord;
      const fr = this.selectedSquare.r;
      const fc = this.selectedSquare.c;
      const uciMove = fromCoord + coord;

      // Validate move safety against check
      const validMoves = this.getAllLegalMoves(this.chessFEN, 'w');
      let targetMove = validMoves.find(m => m.substring(0, 4) === uciMove.substring(0,4));

      if (targetMove) {
        // Execute player move
        this.executeChessMove(targetMove, true);
        this.selectedSquare = null;
        return;
      }
      
      this.selectedSquare = null;
    }

    // Select piece
    if (piece && piece === piece.toUpperCase()) {
      this.selectedSquare = { r, c, coord };
      
      // Outline selected
      const sq = document.querySelector(`#chessbox-board-DOM div[data-coord="${coord}"]`);
      if (sq) sq.style.outline = '3px solid #4ade80';

      // Highlight moves
      const moves = this.getAllLegalMoves(this.chessFEN, 'w');
      moves.forEach(m => {
        if (m.substring(0,2) === coord) {
          const dest = m.substring(2,4);
          const destSq = document.querySelector(`#chessbox-board-DOM div[data-coord="${dest}"]`);
          if (destSq) {
            const hasPiece = destSq.querySelector('.chess-piece');
            const highlightColor = hasPiece ? 'rgba(239,68,68,0.55)' : 'rgba(74,222,128,0.35)';
            destSq.style.boxShadow = `inset 0 0 0 4px ${highlightColor}`;
          }
        }
      });
    }
  }

  // --- EXECUTE CHESS MOVE & CHECK VERIFICATION ---
  executeChessMove(uciMove, isPlayer) {
    if (!this.gameActive) return;

    window.GameAudio.playMove();

    // Execute Move Raw on state
    this.chessFEN = this.executeMoveRaw(this.chessFEN, uciMove);
    this.lastChessMove = { from: uciMove.substring(0, 2), to: uciMove.substring(2, 4) };
    
    // Add to history
    this.chessHistory.push(uciMove);
    this.renderChessBoard();

    // Check game over
    const parts = this.chessFEN.split(' ');
    const nextTurn = parts[1] || 'w';

    const nextLegalMoves = this.getAllLegalMoves(this.chessFEN, nextTurn);
    if (nextLegalMoves.length === 0) {
      if (this.isKingInCheck(this.chessFEN, nextTurn)) {
        if (isPlayer) {
          this.completeChessVictory("¡JAQUE MATE! Has derrotado a tu oponente en el tablero de ajedrez. 🏆");
        } else {
          this.gameOver("¡Jaque Mate! Has sido derrotado en el tablero de ajedrez. 😞 ¡Analiza tu apertura!");
        }
      } else {
        // Stalemate
        this.completeChessVictory("¡Ahogado! Tablas por falta de movimientos legales. 🔄 Combate empatado.");
      }
      return;
    }

    // Trigger AI turn
    if (nextTurn === 'b') {
      this.triggerEngineTurn();
    } else {
      this.updateStatus('¡Tu turno! ♔');
    }
  }

  // --- TRIGGER ENGINE STOCKFISH OR FALLBACK LOCAL MOVE ---
  triggerEngineTurn() {
    this.isThinking = true;
    const level = this.levels[this.currentLevelIndex];
    const name = level ? level.opponentName : 'Tu oponente';
    this.updateStatus(`${name} está pensando... 🤔`);

    if (this.engineType === 'stockfish' && this.stockfishWorker) {
      // Send FEN to Stockfish Web Worker
      this.stockfishWorker.postMessage(`position fen ${this.chessFEN}`);
      this.stockfishWorker.postMessage('go movetime 1200');

      this.stockfishWorker.onmessage = (e) => {
        const line = e.data;
        if (line.includes('bestmove')) {
          const parts = line.split(' ');
          const move = parts[1];
          this.isThinking = false;
          if (move && move !== '(none)') {
            this.executeChessMove(move, false);
          }
        }
      };
    } else {
      // Fallback local engine thinking (~300 ELO)
      setTimeout(() => {
        if (!this.gameActive) return;
        const validMoves = this.getAllLegalMoves(this.chessFEN, 'b');
        if (validMoves.length > 0) {
          // Select move with ELO simulation
          let chosenMove = validMoves[0];
          
          // ELO simulation logic: 30% random, 55% best material, 15% blunder
          const evalScore = (m) => {
            const nextFEN = this.executeMoveRaw(this.chessFEN, m);
            return this.evaluateBoardLocal(nextFEN, 'b');
          };

          validMoves.sort((x, y) => evalScore(y) - evalScore(x));
          
          if (Math.random() < 0.3) {
            chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          } else {
            chosenMove = validMoves[0]; // best evaluated
          }

          this.isThinking = false;
          this.executeChessMove(chosenMove, false);
        } else {
          this.isThinking = false;
        }
      }, 800 + Math.random() * 500);
    }
  }

  // --- SIMPLE LOCAL ENGINE EVALUATION FOR FALLBACK ---
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
          // Center bonus
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

  // --- RAW MOVE EXECUTION (FEN -> MOVE -> FEN) ---
  executeMoveRaw(fen, uciMove) {
    const fromC = uciMove.charCodeAt(0) - 97;
    const fromR = 8 - parseInt(uciMove[1]);
    const toC = uciMove.charCodeAt(2) - 97;
    const toR = 8 - parseInt(uciMove[3]);

    const board = this.parseFEN(fen);
    const parts = fen.split(' ');
    const turn = parts[1] || 'w';
    const castling = parts[2] || 'KQkq';

    const piece = board[fromR][fromC];
    board[toR][toC] = piece;
    board[fromR][fromC] = null;

    // Castling: Move Rook too
    if (piece && piece.toLowerCase() === 'k' && Math.abs(fromC - toC) === 2) {
      if (toC === 6) { // Kingside
        board[toR][5] = board[toR][7];
        board[toR][7] = null;
      } else { // Queenside
        board[toR][3] = board[toR][0];
        board[toR][0] = null;
      }
    }

    // Promotion
    if (uciMove.length > 4) {
      const pChar = uciMove[4];
      board[toR][toC] = turn === 'w' ? pChar.toUpperCase() : pChar.toLowerCase();
    } else if (piece && piece.toLowerCase() === 'p' && (toR === 0 || toR === 7)) {
      board[toR][toC] = turn === 'w' ? 'Q' : 'q';
    }

    // Rebuild FEN rows
    let fenRows = [];
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
      fenRows.push(row);
    }

    const newTurn = turn === 'w' ? 'b' : 'w';
    return fenRows.join('/') + ' ' + newTurn + ' ' + castling + ' - 0 1';
  }

  // --- PARSE FEN TO BOARD GRID ---
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

  // --- PSEUDO-LEGAL MOVES GENERATOR ---
  generatePseudoMoves(fen, r, c, skipCastling) {
    const board = this.parseFEN(fen);
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
        break;
      }
      case 'n':
        for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) {
          add(r + dr, c + dc);
        }
        break;
      case 'b': slide(1, 1); slide(1, -1); slide(-1, 1); slide(-1, -1); break;
      case 'r': slide(1, 0); slide(-1, 0); slide(0, 1); slide(0, -1); break;
      case 'q': slide(1, 0); slide(-1, 0); slide(0, 1); slide(0, -1); slide(1, 1); slide(1, -1); slide(-1, 1); slide(-1, -1); break;
      case 'k':
        for (const [dr, dc] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
          add(r + dr, c + dc);
        }
        // Castling
        if (!skipCastling && color === 'w' && r === 7 && c === 4) {
          // Kingside
          if (board[7][7] === 'R' && !board[7][5] && !board[7][6] &&
              !this.isSquareAttacked(fen, 7, 4, 'b') && !this.isSquareAttacked(fen, 7, 5, 'b') && !this.isSquareAttacked(fen, 7, 6, 'b')) {
            moves.push({ r: 7, c: 6 });
          }
          // Queenside
          if (board[7][0] === 'R' && !board[7][1] && !board[7][2] && !board[7][3] &&
              !this.isSquareAttacked(fen, 7, 4, 'b') && !this.isSquareAttacked(fen, 7, 3, 'b') && !this.isSquareAttacked(fen, 7, 2, 'b')) {
            moves.push({ r: 7, c: 2 });
          }
        }
        if (!skipCastling && color === 'b' && r === 0 && c === 4) {
          // Kingside
          if (board[0][7] === 'r' && !board[0][5] && !board[0][6] &&
              !this.isSquareAttacked(fen, 0, 4, 'w') && !this.isSquareAttacked(fen, 0, 5, 'w') && !this.isSquareAttacked(fen, 0, 6, 'w')) {
            moves.push({ r: 0, c: 6 });
          }
          // Queenside
          if (board[0][0] === 'r' && !board[0][1] && !board[0][2] && !board[0][3] &&
              !this.isSquareAttacked(fen, 0, 4, 'w') && !this.isSquareAttacked(fen, 0, 3, 'w') && !this.isSquareAttacked(fen, 0, 2, 'w')) {
            moves.push({ r: 0, c: 2 });
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

  // --- GET ALL LEGAL MOVES (Ensures King safety) ---
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
          if (piece.toLowerCase() === 'p' && (to.r === 0 || to.r === 7)) m += 'q'; // Pawn auto-promotion to Queen

          // Validate that the move doesn't leave own King in check
          const nextFEN = this.executeMoveRaw(fen, m);
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

  // --- UI METRICS UPDATE ---
  updateStatus(msg) {
    const el = document.getElementById('chessbox-status');
    if (el) el.textContent = msg;
  }

  updateChessHistoryDisplay() {
    const el = document.getElementById('chessbox-history');
    if (!el) return;
    el.innerHTML = '';
    
    for (let i = 0; i < this.chessHistory.length; i += 2) {
      const plMove = this.chessHistory[i] || '';
      const oppMove = this.chessHistory[i+1] || '';
      const moveNum = Math.floor(i / 2) + 1;
      
      const line = document.createElement('div');
      line.textContent = `${moveNum}. ${plMove}  ${oppMove}`;
      el.appendChild(line);
    }
    el.scrollTop = el.scrollHeight; // Autoscroll to bottom
  }

  // ===================================================================
  // END GAME SCENARIOS: VICTORY, LOSS, STATS PERSISTENCE
  // ===================================================================
  
  // --- WIN BY CHESS (Mate, Clock) ---
  completeChessVictory(msg) {
    this.gameActive = false;
    this.destroy();
    window.GameAudio.playVictory();

    // Star calculation (Martina style)
    let starsWon = 1;
    if (this.playerHealth >= 70) {
      starsWon = 3;
    } else if (this.playerHealth >= 35) {
      starsWon = 2;
    }

    this.saveTournamentProgress(starsWon);

    this.container.innerHTML = `
      <div class="game-screen" style="border-color: #fbbf24; box-shadow: 0 10px 40px rgba(250,204,21,0.2);">
        <div class="game-screen-img" style="border-color:#fbbf24; background: linear-gradient(135deg, #1e1b4b, #fbbf24);">
          <div style="font-size: 4.5rem; text-shadow: 0 4px 8px rgba(0,0,0,0.5);">👑</div>
        </div>
        <h2>¡VICTORIA EN AJEDREZ! 🏆</h2>
        <p style="color:#fef08a;">${msg}</p>
        
        <div style="margin: 1rem 0;">
          ${this.getStarsHTML(starsWon)}
        </div>

        <div class="game-screen-stats">
          <div class="stat-item" style="border-color:#fbbf24;">
            <span>Salud Restante</span>
            <div class="stat-val" style="color:#4ade80;">❤️ ${Math.round(this.playerHealth)}%</div>
          </div>
          <div class="stat-item" style="border-color:#fbbf24;">
            <span>Ronda Final</span>
            <div class="stat-val">R${this.currentRound}</div>
          </div>
          <div class="stat-item" style="border-color:#fbbf24;">
            <span>Puños Conectados</span>
            <div class="stat-val" style="color:#38bdf8;">🥊 ${this.totalPunchesLanded}</div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; width: 100%;">
          <button class="btn btn-game-screen" id="btn-combat-menu" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">
            Ver Torneos 📋
          </button>
          ${this.currentLevelIndex < this.levels.length - 1 ? '<button class="btn btn-game-screen" id="btn-next-combat" style="background:#fbbf24; border-color:#fbbf24; color:#1e1b4b;">Siguiente Combate ➔</button>' : ''}
        </div>
      </div>
    `;

    document.getElementById('btn-combat-menu').addEventListener('click', () => {
      this.showWelcomeScreen();
    });

    if (this.currentLevelIndex < this.levels.length - 1) {
      document.getElementById('btn-next-combat').addEventListener('click', () => {
        this.currentLevelIndex++;
        this.startGame();
      });
    }
  }

  // --- WIN BY BOXING KO ---
  completeCombatVictory() {
    this.gameActive = false;
    this.destroy();
    window.GameAudio.playVictory();

    const level = this.levels[this.currentLevelIndex];
    const name = level ? level.opponentName : 'tu oponente';

    let starsWon = 3;
    if (this.playerHealth < 40) starsWon = 2;

    this.saveTournamentProgress(starsWon);

    this.container.innerHTML = `
      <div class="game-screen" style="border-color: #ef4444; box-shadow: 0 10px 40px rgba(239,68,68,0.2);">
        <div class="game-screen-img" style="border-color:#ef4444; background: linear-gradient(135deg, #1e1b4b, #ef4444);">
          <div style="font-size: 4.5rem; text-shadow: 0 4px 8px rgba(0,0,0,0.5);">🥊</div>
        </div>
        <h2>¡K.O. VICTORIA EN EL RING! 🏆</h2>
        <p style="color:#fca5a5;">¡Fantástica Martina! Has mandado a la lona al ${name} en la Ronda de Boxeo.</p>
        
        <div style="margin: 1rem 0;">
          ${this.getStarsHTML(starsWon)}
        </div>

        <div class="game-screen-stats">
          <div class="stat-item" style="border-color:#ef4444;">
            <span>Salud Restante</span>
            <div class="stat-val" style="color:#4ade80;">❤️ ${Math.round(this.playerHealth)}%</div>
          </div>
          <div class="stat-item" style="border-color:#ef4444;">
            <span>Ronda Final</span>
            <div class="stat-val">R${this.currentRound}</div>
          </div>
          <div class="stat-item" style="border-color:#ef4444;">
            <span>Puños Conectados</span>
            <div class="stat-val" style="color:#38bdf8;">🥊 ${this.totalPunchesLanded}</div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; width: 100%;">
          <button class="btn btn-game-screen" id="btn-combat-menu" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">
            Ver Torneos 📋
          </button>
          ${this.currentLevelIndex < this.levels.length - 1 ? '<button class="btn btn-game-screen" id="btn-next-combat" style="background:#ef4444; border-color:#ef4444; color:#ffffff;">Siguiente Combate ➔</button>' : ''}
        </div>
      </div>
    `;

    document.getElementById('btn-combat-menu').addEventListener('click', () => {
      this.showWelcomeScreen();
    });

    if (this.currentLevelIndex < this.levels.length - 1) {
      document.getElementById('btn-next-combat').addEventListener('click', () => {
        this.currentLevelIndex++;
        this.startGame();
      });
    }
  }

  // --- END BY POINTS (6 Rounds completed) ---
  endGameByPoints() {
    this.gameActive = false;
    this.destroy();
    
    // Evaluate points: connecting punches adds 10, material balance adds score
    const pPoints = this.totalPunchesLanded * 10 - this.totalPunchesReceived * 5;
    const materialPoints = this.evaluateBoardLocal(this.chessFEN, 'w') * 50;
    const totalPoints = pPoints + materialPoints;

    if (totalPoints > 0) {
      // Won by points decision!
      window.GameAudio.playVictory();
      this.saveTournamentProgress(1);
      
      this.container.innerHTML = `
        <div class="game-screen" style="border-color: #38bdf8;">
          <div class="game-screen-img" style="border-color:#38bdf8; background: linear-gradient(135deg, #1e1b4b, #38bdf8);">
            <div style="font-size: 4.5rem;">📋</div>
          </div>
          <h2>VICTORIA POR DECISIÓN 📋</h2>
          <p>¡El combate completó las 6 rondas! Has ganado por acumulación de puntos estratégicos y golpes conectados.</p>
          
          <div style="margin: 1rem 0;">
            ${this.getStarsHTML(1)}
          </div>

          <div class="game-screen-stats">
            <div class="stat-item" style="border-color:#38bdf8;">
              <span>Puntos Totales</span>
              <div class="stat-val" style="color:#4ade80;">${Math.round(totalPoints)} pts</div>
            </div>
            <div class="stat-item" style="border-color:#38bdf8;">
              <span>Golpes Netos</span>
              <div class="stat-val">+${this.totalPunchesLanded - this.totalPunchesReceived}</div>
            </div>
            <div class="stat-item" style="border-color:#38bdf8;">
              <span>Balance Ajedrez</span>
              <div class="stat-val">${Math.round(materialPoints)} pts</div>
            </div>
          </div>

          <button class="btn btn-game-screen" id="btn-combat-menu">Ver Torneos 📋</button>
        </div>
      `;
    } else {
      // Lost by points decision
      window.GameAudio.playError();
      this.container.innerHTML = `
        <div class="game-screen" style="border-color: #ef4444;">
          <div class="game-screen-img" style="border-color:#ef4444; background: linear-gradient(135deg, #1e1b4b, #ef4444);">
            <div style="font-size: 4.5rem;">📉</div>
          </div>
          <h2>DERROTA POR DECISIÓN 😞</h2>
          <p>¡Se agotaron las 6 rondas! Tu oponente ha acumulado más puntos estratégicos y golpes conectados en el ring.</p>

          <button class="btn btn-game-screen" id="btn-combat-menu" style="background:#ef4444; border-color:#ef4444;">Reintentar 🔁</button>
        </div>
      `;
    }

    document.getElementById('btn-combat-menu').addEventListener('click', () => {
      this.showWelcomeScreen();
    });
  }

  // --- DEFEAT / GAME OVER ---
  gameOver(reason) {
    this.gameActive = false;
    this.destroy();
    window.GameAudio.playError();

    this.container.innerHTML = `
      <div class="game-screen" style="border-color: #ef4444; box-shadow: 0 10px 40px rgba(239,68,68,0.25);">
        <div class="game-screen-img" style="border-color:#ef4444; background: #000;">
          <div style="font-size: 4.5rem; animation: wobble-head 2.5s infinite ease-in-out;">🥊</div>
        </div>
        <h2>COMBATE PERDIDO 😞</h2>
        <p style="color:#fca5a5;">${reason}</p>
        
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; width: 100%;">
          <button class="btn btn-game-screen" id="btn-combat-menu" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--warm-white);">
            Ver Torneos 📋
          </button>
          <button class="btn btn-game-screen" id="btn-retry-combat" style="background:#ef4444; border-color:#ef4444; color:#ffffff;">Reintentar Pelea 🔁</button>
        </div>
      </div>
    `;

    document.getElementById('btn-combat-menu').addEventListener('click', () => {
      this.showWelcomeScreen();
    });

    document.getElementById('btn-retry-combat').addEventListener('click', () => {
      this.startGame();
    });
  }

  // --- SAVE TOURNAMENT PROGRESS AND STACK PACKS ---
  saveTournamentProgress(starsWon) {
    let key = 'martina_chessbox_progress';
    if (this.selectedDifficulty === 'easy') key = 'martina_chessbox_progress_easy';
    if (this.selectedDifficulty === 'hard') key = 'martina_chessbox_progress_hard';
    if (this.selectedDifficulty === 'martina') key = 'martina_chessbox_progress_martina';

    let progress = JSON.parse(localStorage.getItem(key)) || [];
    while (progress.length < 15) progress.push(0);

    const oldStars = progress[this.currentLevelIndex] || 0;
    if (starsWon > oldStars) {
      progress[this.currentLevelIndex] = starsWon;
      localStorage.setItem(key, JSON.stringify(progress));
    }

    // Got 3 stars -> Award card pack sticker!
    if (starsWon === 3 && oldStars < 3) {
      try {
        let packs = parseInt(localStorage.getItem('martina_album_packs') || '0');
        localStorage.setItem('martina_album_packs', (packs + 1).toString());
      } catch (e) {
        console.error(e);
      }
    }

    // Refresh global dashboard
    if (typeof window.loadDashboardStats === 'function') {
      window.loadDashboardStats();
    }
  }

  // --- HELPER UTILS ---
  getStarsHTML(starsCount) {
    let starClass = 'star-medium';
    if (this.selectedDifficulty === 'easy') starClass = 'star-easy';
    if (this.selectedDifficulty === 'hard') starClass = 'star-hard';
    if (this.selectedDifficulty === 'martina') starClass = 'star-martina';

    let starsHTML = '';
    for (let s = 1; s <= 3; s++) {
      starsHTML += s <= starsCount 
        ? `<span class="star-filled ${starClass}" style="font-size: 3.5rem;">★</span>`
        : '<span class="star-empty" style="font-size: 3.5rem;">★</span>';
    }
    return starsHTML;
  }

  formatClock(ms) {
    const sTotal = Math.ceil(ms / 1000);
    const m = Math.floor(sTotal / 60);
    const s = sTotal % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // --- CLEANUP TIMERS & WORKERS TO AVOID LEAKS ---
  destroy() {
    this.stopMusic();
    this.destroyPhaserEngine();
    this.destroyWorker();
    clearInterval(this.chessClockInterval);
    clearInterval(this.boxingTimer);
  }

  // --- DYNAMICALLY INJECT PREMIUM CSS CUSTOM STYLES ---
  injectGlobalStyles() {
    if (document.getElementById('chessbox-premium-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'chessbox-premium-styles';
    styles.textContent = `
      .transition-overlay {
        position: absolute;
        inset: 0;
        z-index: 100;
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Outfit', 'Inter', sans-serif;
      }
      .transition-panel {
        background: rgba(30, 41, 59, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 30px;
        max-width: 440px;
        width: 90%;
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        text-align: center;
        color: white;
      }
      .round-badge {
        display: inline-block;
        padding: 4px 14px;
        border-radius: 12px;
        font-size: 0.82rem;
        font-weight: 800;
        letter-spacing: 0.5px;
        color: #1e1b4b;
      }
      kbd {
        background: #475569;
        border-radius: 4px;
        padding: 2px 6px;
        font-family: monospace;
        font-size: 0.8rem;
        box-shadow: inset 0 -2px 0 rgba(0,0,0,0.25);
        color: white;
        margin: 0 2px;
      }
      @keyframes pulse {
        from { transform: scale(1); box-shadow: 0 0 10px rgba(251, 191, 36, 0.3); }
        to { transform: scale(1.04); box-shadow: 0 0 20px rgba(251, 191, 36, 0.6); }
      }
      @keyframes pulseVignette {
        from { box-shadow: inset 0 0 35px rgba(139, 92, 246, 0.30); }
        to { box-shadow: inset 0 0 55px rgba(139, 92, 246, 0.55); }
      }
      @keyframes shakeHeavy {
        0% { transform: translate(1px, 1px) rotate(0deg); }
        10% { transform: translate(-1px, -2px) rotate(-1deg); }
        20% { transform: translate(-3px, 0px) rotate(1deg); }
        30% { transform: translate(0px, 2px) rotate(0deg); }
        40% { transform: translate(1px, -1px) rotate(1deg); }
        50% { transform: translate(-1px, 2px) rotate(-1deg); }
        60% { transform: translate(-3px, 1px) rotate(0deg); }
        70% { transform: translate(2px, 1px) rotate(-1deg); }
        80% { transform: translate(-1px, -1px) rotate(1deg); }
        100% { transform: translate(1px, -2px) rotate(-1deg); }
      }
      
      /* =========================================================================
         JAPANESE ANIME / MEGA MAN RETRO INTRO STYLES
         ========================================================================= */
      .challenger-intro-overlay {
        position: absolute;
        inset: 0;
        z-index: 9999;
        background: #050512;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: 'Outfit', 'Inter', sans-serif;
        color: white;
        transition: opacity 0.4s ease-out;
      }
      
      .warning-banner {
        position: absolute;
        left: 0;
        width: 100%;
        height: 35px;
        background: repeating-linear-gradient(
          -45deg,
          #dc2626,
          #dc2626 12px,
          #000000 12px,
          #000000 24px
        );
        display: flex;
        align-items: center;
        overflow: hidden;
        border-top: 2px solid #f43f5e;
        border-bottom: 2px solid #f43f5e;
        box-shadow: 0 0 20px rgba(244, 63, 94, 0.4);
      }
      .banner-top { top: 35px; }
      .banner-bottom { bottom: 35px; }
      
      .warning-scroller {
        white-space: nowrap;
        animation: scrollIntroText 15s linear infinite;
        font-weight: 900;
        font-size: 0.9rem;
        color: #fff;
        text-shadow: 1px 1px 2px #000, 0 0 5px #f43f5e;
        letter-spacing: 2px;
      }
      
      @keyframes scrollIntroText {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      
      .intro-speed-lines {
        position: absolute;
        inset: -100px;
        background: 
          repeating-radial-gradient(
            circle,
            transparent,
            transparent 8px,
            rgba(255, 255, 255, 0.02) 8px,
            rgba(255, 255, 255, 0.02) 16px
          );
        animation: animeSpeedlines 0.18s linear infinite;
        opacity: 0.25;
        pointer-events: none;
      }
      
      @keyframes animeSpeedlines {
        0% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-4px, 4px) scale(1.015); }
        100% { transform: translate(4px, -4px) scale(1); }
      }
      
      .intro-split-container {
        display: flex;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      
      .intro-panel {
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      .intro-panel-left {
        background: linear-gradient(135deg, rgba(13, 148, 136, 0.9) 0%, rgba(6, 182, 212, 0.95) 100%);
        transform: skewX(-12deg) translateX(-100%);
        animation: slideLeftPanel 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        border-right: 4px solid #67e8f9;
        box-shadow: 15px 0 35px rgba(6, 182, 212, 0.45);
      }
      
      .intro-panel-right {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(88, 28, 135, 0.9) 100%);
        transform: skewX(-12deg) translateX(100%);
        animation: slideRightPanel 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        animation-delay: 0.08s;
        border-left: 4px solid var(--opp-color);
        box-shadow: -15px 0 35px rgba(124, 58, 237, 0.4);
      }
      
      .panel-unskew {
        transform: skewX(12deg);
        width: 85%;
        max-width: 440px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      @keyframes slideLeftPanel {
        0% { transform: skewX(-12deg) translateX(-100%); }
        100% { transform: skewX(-12deg) translateX(0); }
      }
      @keyframes slideRightPanel {
        0% { transform: skewX(-12deg) translateX(100%); }
        100% { transform: skewX(-12deg) translateX(0); }
      }
      
      .challenger-card {
        text-align: center;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        animation: panelContentFade 0.5s ease-out 0.65s both;
      }
      
      @keyframes panelContentFade {
        from { opacity: 0; transform: translateY(25px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .intro-badge {
        display: inline-block;
        padding: 5px 18px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 900;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-bottom: 12px;
      }
      .badge-martina {
        background: #fbbf24;
        color: #1e1b4b;
        box-shadow: 0 0 15px rgba(251, 191, 36, 0.5);
      }
      
      .intro-challenger-name {
        font-size: 2.6rem;
        font-weight: 900;
        margin: 5px 0;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        font-family: 'Outfit', sans-serif;
      }
      .name-martina {
        color: #ffffff;
        text-shadow: 0 0 15px rgba(6, 182, 212, 0.8);
      }
      
      .intro-challenger-elo {
        color: #e2e8f0;
        font-size: 0.95rem;
        font-weight: 600;
        margin-bottom: 18px;
        background: rgba(0, 0, 0, 0.35);
        padding: 3px 12px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      .canvas-wrapper {
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 15px;
        margin-bottom: 18px;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.7), 0 10px 25px rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.3s ease;
      }
      .canvas-wrapper:hover {
        transform: scale(1.04);
      }
      .canvas-wrapper canvas {
        width: 180px;
        height: 180px;
        display: block;
        image-rendering: pixelated;
      }
      
      .opponent-power-container {
        background: rgba(0, 0, 0, 0.45);
        padding: 12px 18px;
        border-radius: 12px;
        text-align: left;
        margin-bottom: 14px;
        font-size: 0.88rem;
        line-height: 1.45;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      .opponent-power-container h4 {
        margin: 0 0 6px 0;
        font-weight: 900;
        letter-spacing: 0.5px;
        font-size: 0.92rem;
      }
      .opponent-power-container p {
        margin: 0;
        color: #cbd5e1;
      }
      
      .intro-challenger-quote {
        font-style: italic;
        color: #a5f3fc;
        font-size: 0.85rem;
        max-width: 320px;
        margin: 5px auto;
        line-height: 1.45;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
      }
      
      .intro-diagonal-slash {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 8px;
        background: #fbbf24;
        box-shadow: 0 0 35px #f59e0b, 0 0 15px #fbbf24;
        transform: translateX(-50%) skewX(-12deg);
        z-index: 10;
        animation: slashGlow 0.15s linear infinite;
      }
      
      @keyframes slashGlow {
        0% { opacity: 0.85; filter: blur(0.5px); }
        50% { opacity: 1; filter: blur(2px); }
        100% { opacity: 0.85; filter: blur(0.5px); }
      }
      
      .intro-vs-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 20;
      }
      
      .intro-vs-badge {
        font-size: 3.5rem;
        font-weight: 900;
        color: #030712;
        background: #fbbf24;
        border: 4px solid #ffffff;
        padding: 10px 25px;
        border-radius: 15px;
        box-shadow: 0 0 30px #fbbf24, 0 10px 30px rgba(0, 0, 0, 0.7);
        text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff;
        transform: rotate(-10deg) scale(0);
        animation: popVs 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.6s forwards;
      }
      
      @keyframes popVs {
        0% { transform: rotate(-10deg) scale(0); }
        75% { transform: rotate(-15deg) scale(1.2); }
        100% { transform: rotate(-10deg) scale(1); }
      }
      
      .intro-skip-btn {
        position: absolute;
        bottom: 85px;
        right: 40px;
        z-index: 30;
        background: rgba(0, 0, 0, 0.75);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: white;
        padding: 8px 18px;
        font-size: 0.85rem;
        font-weight: 800;
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .intro-skip-btn:hover {
        background: white;
        color: black;
        border-color: white;
        transform: translateY(-2px);
      }
      .intro-skip-btn kbd {
        background: #334155;
        border-radius: 4px;
        padding: 2px 6px;
        font-family: monospace;
        font-size: 0.75rem;
        box-shadow: inset 0 -2px 0 rgba(0,0,0,0.25);
        color: white;
      }
    `;
    document.head.appendChild(styles);

  }

  // --- DYNAMIC PHASER SCRIPT LOAD ---
  loadPhaser(callback) {
    if (window.Phaser) {
      callback();
      return;
    }
    const script = document.createElement('script');
    script.id = 'phaser-cdn-script';
    script.src = 'https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js';
    script.onload = callback;
    script.onerror = () => {
      const parent = document.getElementById('phaser-boxing-parent');
      if (parent) {
        parent.innerHTML = `
          <div class="game-screen">
            <h2>Error de Conexión</h2>
            <p>No se pudo cargar el motor Phaser 3 desde la red. Verifica tu conexión.</p>
          </div>
        `;
      }
    };
    document.body.appendChild(script);
  }
}

// Bind to games list namespace
window.MartinaGames.chessbox = ChessBoxGame;
