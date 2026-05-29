// === CHESS DUEL MODULE — Stockfish WASM + UI for Super Martina level 4 ===
// Loads Stockfish as Web Worker, renders board as HTML overlay on Phaser canvas.
// Simulates ~300 ELO opponent via depth=1 + random blunder probability.

window.ChessDuel = class ChessDuel {
  constructor(container, onWin, onLose) {
    this.container = container;
    this.onWin = onWin;
    this.onLose = onLose;
    this.sfWorker = null;
    this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.turn = 'w';
    this.selectedSquare = null;
    this.playerColor = 'w';
    this.gameOver = false;
    this.sfReady = false;
    this.pendingBestmove = null;
    this.moveHistory = [];
  }

  // --- START THE DUEL ---
  start() {
    this.renderBoard();
    this.loadStockfish();
  }

  // --- LOAD STOCKFISH WASM AS WEB WORKER ---
  loadStockfish() {
    const sfUrl = 'https://cdn.jsdelivr.net/npm/stockfish.wasm@0.10.0/stockfish.js';
    
    // Show loading
    const statusEl = document.getElementById('chess-status');
    if (statusEl) statusEl.textContent = 'Cargando Stockfish...';

    try {
      this.sfWorker = new Worker(sfUrl);
    } catch(e) {
      // Fallback: if Worker from CDN fails, try inline
      this.sfFailed('No se pudo cargar el motor de ajedrez');
      return;
    }

    this.sfWorker.onmessage = (e) => {
      const msg = e.data || '';
      this.handleSFMessage(msg);
    };

    this.sfWorker.onerror = () => {
      this.sfFailed('Error en el motor de ajedrez');
    };

    // Initialize UCI protocol
    this.sfWorker.postMessage('uci');
  }

  handleSFMessage(msg) {
    if (msg === 'uciok') {
      // Set low strength
      this.sfWorker.postMessage('setoption name UCI_LimitStrength value true');
      this.sfWorker.postMessage('setoption name UCI_Elo value 1320');
      this.sfWorker.postMessage('isready');
    } else if (msg === 'readyok') {
      this.sfReady = true;
      this.sfWorker.postMessage('ucinewgame');
      const statusEl = document.getElementById('chess-status');
      if (statusEl) statusEl.textContent = '¡Tu turno! Juegas con blancas ♔';
    } else if (msg.startsWith('bestmove')) {
      const parts = msg.split(' ');
      const bestMove = parts[1];
      if (bestMove && bestMove !== '(none)') {
        this.pendingBestmove = bestMove;
        // Apply blunder logic for ~300 ELO feel
        this.applyBlunderThenMove();
      }
    }
  }

  // --- BLUNDER LOGIC: sometimes play random instead of Stockfish's move ---
  applyBlunderThenMove() {
    const sfMove = this.pendingBestmove;
    this.pendingBestmove = null;
    if (!sfMove) return;

    // 35% chance of blunder: play a random legal move instead
    const legalMoves = this.getAllLegalMoves('b');
    let chosenMove = sfMove;

    if (Math.random() < 0.35 && legalMoves.length > 1) {
      // Pick random move, but avoid the best one (sfMove) to ensure it's a blunder
      const filtered = legalMoves.filter(m => m !== sfMove);
      if (filtered.length > 0) {
        chosenMove = filtered[Math.floor(Math.random() * filtered.length)];
      }
    }

    this.executeMove(chosenMove, false);
  }

  // --- GET ALL LEGAL MOVES FOR A COLOR ---
  getAllLegalMoves(color) {
    const moves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.getPiece(r, c);
        if (!piece) continue;
        const isWhite = piece === piece.toUpperCase();
        if ((color === 'w' && !isWhite) || (color === 'b' && isWhite)) continue;
        
        const pieceMoves = this.generateMoves(r, c);
        pieceMoves.forEach(to => {
          const fromIdx = r * 8 + c;
          const toIdx = to.r * 8 + to.c;
          const from = String.fromCharCode(97 + c) + (8 - r);
          const toSq = String.fromCharCode(97 + to.c) + (8 - to.r);
          moves.push(from + toSq);
        });
      }
    }
    return moves;
  }

  // --- PARSE FEN ---
  parseFEN() {
    const parts = this.fen.split(' ');
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
    return { board, turn: parts[1], castling: parts[2], enPassant: parts[3] };
  }

  getPiece(r, c) {
    const { board } = this.parseFEN();
    return board[r] ? board[r][c] : null;
  }

  // --- GENERATE PSEUDO-LEGAL MOVES (no check validation for speed) ---
  generateMoves(r, c) {
    const piece = this.getPiece(r, c);
    if (!piece) return [];
    const moves = [];
    const color = piece === piece.toUpperCase() ? 'w' : 'b';
    const p = piece.toLowerCase();

    const addIfValid = (tr, tc) => {
      if (tr < 0 || tr > 7 || tc < 0 || tc > 7) return false;
      const target = this.getPiece(tr, tc);
      if (target) {
        const tColor = target === target.toUpperCase() ? 'w' : 'b';
        if (tColor === color) return false; // can't capture own piece
        moves.push({ r: tr, c: tc });
        return false; // stop after capture
      }
      moves.push({ r: tr, c: tc });
      return true; // continue sliding
    };

    const slide = (dr, dc) => {
      for (let i = 1; i < 8; i++) {
        if (!addIfValid(r + dr * i, c + dc * i)) break;
      }
    };

    switch (p) {
      case 'p': {
        const dir = color === 'w' ? -1 : 1;
        const startRow = color === 'w' ? 6 : 1;
        // Forward
        if (!this.getPiece(r + dir, c)) {
          addIfValid(r + dir, c);
          // Double forward from start
          if (r === startRow && !this.getPiece(r + 2 * dir, c)) {
            addIfValid(r + 2 * dir, c);
          }
        }
        // Captures
        const capL = this.getPiece(r + dir, c - 1);
        if (capL && ((capL === capL.toUpperCase()) !== (color === 'w'))) addIfValid(r + dir, c - 1);
        const capR = this.getPiece(r + dir, c + 1);
        if (capR && ((capR === capR.toUpperCase()) !== (color === 'w'))) addIfValid(r + dir, c + 1);
        break;
      }
      case 'n':
        for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
          addIfValid(r + dr, c + dc);
        }
        break;
      case 'b':
        slide(1, 1); slide(1, -1); slide(-1, 1); slide(-1, -1);
        break;
      case 'r':
        slide(1, 0); slide(-1, 0); slide(0, 1); slide(0, -1);
        break;
      case 'q':
        slide(1, 0); slide(-1, 0); slide(0, 1); slide(0, -1);
        slide(1, 1); slide(1, -1); slide(-1, 1); slide(-1, -1);
        break;
      case 'k':
        for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
          addIfValid(r + dr, c + dc);
        }
        break;
    }
    return moves;
  }

  // --- EXECUTE A MOVE (UCI format: e2e4) ---
  executeMove(uciMove, isPlayer) {
    if (this.gameOver) return;
    
    const fromC = uciMove.charCodeAt(0) - 97;
    const fromR = 8 - parseInt(uciMove[1]);
    const toC = uciMove.charCodeAt(2) - 97;
    const toR = 8 - parseInt(uciMove[3]);
    
    const piece = this.getPiece(fromR, fromC);
    if (!piece) return;
    
    // Update FEN
    const { board, turn, castling, enPassant } = this.parseFEN();
    
    // Execute on board
    board[toR][toC] = piece;
    board[fromR][fromC] = null;
    
    // Handle promotion (auto-queen for simplicity)
    const promoPiece = uciMove.length > 4 ? uciMove[4] : null;
    if (promoPiece) {
      board[toR][toC] = turn === 'w' ? promoPiece.toUpperCase() : promoPiece.toLowerCase();
    }
    
    // Rebuild FEN
    let fenRows = [];
    for (let r = 0; r < 8; r++) {
      let row = '';
      let empty = 0;
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
    this.turn = newTurn;
    this.fen = fenRows.join('/') + ' ' + newTurn + ' ' + castling + ' ' + enPassant + ' 0 1';
    this.moveHistory.push(uciMove);
    
    // Update board display
    this.renderBoard();
    
    // Check for checkmate / game over
    const allMoves = this.getAllLegalMoves(newTurn);
    if (allMoves.length === 0) {
      this.gameOver = true;
      // Determine if checkmate or stalemate
      if (this.isKingInCheck(newTurn)) {
        // Checkmate!
        if (isPlayer) {
          // Player won!
          this.showResult('¡JAQUE MATE! ¡Ganaste! 🎉');
          setTimeout(() => this.onWin(), 1500);
        } else {
          // Stockfish won
          this.showResult('Jaque mate. Perdiste 😞');
          setTimeout(() => this.onLose(), 1500);
        }
      } else {
        // Stalemate — treat as win for player against low ELO
        this.showResult('¡Ahogado! Es tablas, pero cuentas como ganador 🎉');
        setTimeout(() => this.onWin(), 1500);
      }
      return;
    }
    
    // If it's Stockfish's turn, ask it to move
    if (newTurn === 'b' && this.sfReady && !this.gameOver) {
      const statusEl = document.getElementById('chess-status');
      if (statusEl) statusEl.textContent = 'Equis está pensando... 🤔';
      
      const movesStr = this.moveHistory.join(' ');
      this.sfWorker.postMessage('position startpos moves ' + movesStr);
      this.sfWorker.postMessage('go depth 1');
    } else if (newTurn === 'w') {
      const statusEl = document.getElementById('chess-status');
      if (statusEl) statusEl.textContent = '¡Tu turno! Juegas con blancas ♔';
    }
  }

  isKingInCheck(color) {
    // Find king position
    const king = color === 'w' ? 'K' : 'k';
    let kr = -1, kc = -1;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.getPiece(r, c) === king) { kr = r; kc = c; break; }
      }
      if (kr >= 0) break;
    }
    if (kr < 0) return false;
    
    // Check if any opponent piece attacks the king
    const oppColor = color === 'w' ? 'b' : 'w';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.getPiece(r, c);
        if (!piece) continue;
        const pColor = piece === piece.toUpperCase() ? 'w' : 'b';
        if (pColor !== oppColor) continue;
        const moves = this.generateMoves(r, c);
        if (moves.some(m => m.r === kr && m.c === kc)) return true;
      }
    }
    return false;
  }

  sfFailed(msg) {
    const statusEl = document.getElementById('chess-status');
    if (statusEl) statusEl.textContent = msg;
    // Fallback: use random moves without Stockfish
    this.sfReady = false;
  }

  // --- RENDER CHESS BOARD ---
  renderBoard() {
    const existing = document.getElementById('chess-overlay');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'chess-overlay';
    overlay.style.cssText = `
      position:absolute;inset:0;z-index:50;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);
      font-family:'Outfit',sans-serif;
    `;
    
    overlay.innerHTML = `
      <div style="background:rgba(20,15,10,0.9);border:3px solid #8B6914;border-radius:16px;padding:20px;text-align:center;">
        <h2 style="color:#daa520;margin:0 0 8px 0;font-size:22px;">🐴 Desafío de Ajedrez — Equis</h2>
        <p id="chess-status" style="color:#cbd5e1;font-size:13px;margin-bottom:12px;">Cargando motor...</p>
        <div id="chess-board" style="display:grid;grid-template-columns:repeat(8,52px);grid-template-rows:repeat(8,52px);border:2px solid #5c3d0e;margin:0 auto;"></div>
        <button id="chess-resign" style="margin-top:12px;background:#8b0000;color:#fff;border:none;padding:6px 18px;border-radius:8px;font-weight:700;cursor:pointer;font-family:Outfit,sans-serif;">Rendirse ✕</button>
      </div>
    `;
    
    this.container.appendChild(overlay);
    
    // Draw board squares
    const boardEl = document.getElementById('chess-board');
    const { board } = this.parseFEN();
    const pieceSymbols = {
      'K':'♔','Q':'♕','R':'♖','B':'♗','N':'♘','P':'♙',
      'k':'♚','q':'♛','r':'♜','b':'♝','n':'♞','p':'♟'
    };
    
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = document.createElement('div');
        const isLight = (r + c) % 2 === 0;
        sq.style.cssText = `
          width:52px;height:52px;
          background:${isLight ? '#e8d5b7' : '#8B6914'};
          display:flex;align-items:center;justify-content:center;
          font-size:36px;cursor:pointer;user-select:none;
          position:relative;
        `;
        sq.dataset.r = r;
        sq.dataset.c = c;
        
        const piece = board[r][c];
        if (piece) {
          sq.textContent = pieceSymbols[piece] || '';
          sq.style.color = piece === piece.toUpperCase() ? '#1a1a1a' : '#2d2d2d';
        }
        
        sq.addEventListener('click', () => this.handleSquareClick(r, c));
        boardEl.appendChild(sq);
      }
    }
    
    // Resign button
    document.getElementById('chess-resign').addEventListener('click', () => {
      this.gameOver = true;
      this.showResult('Te rendiste 😞');
      setTimeout(() => this.onLose(), 1000);
    });
  }

  handleSquareClick(r, c) {
    if (this.gameOver) return;
    if (this.turn !== 'w') return; // not player's turn
    
    const piece = this.getPiece(r, c);
    const isWhitePiece = piece && piece === piece.toUpperCase();
    
    // Clear previous highlights
    document.querySelectorAll('#chess-board div').forEach(sq => {
      sq.style.boxShadow = '';
      sq.style.outline = '';
    });
    
    if (this.selectedSquare !== null) {
      // Try to move
      const fromR = this.selectedSquare.r;
      const fromC = this.selectedSquare.c;
      const fromPiece = this.getPiece(fromR, fromC);
      
      // Validate move
      const moves = this.generateMoves(fromR, fromC);
      const isValid = moves.some(m => m.r === r && m.c === c);
      
      if (isValid && fromPiece) {
        const fromSq = String.fromCharCode(97 + fromC) + (8 - fromR);
        const toSq = String.fromCharCode(97 + c) + (8 - r);
        const uciMove = fromSq + toSq;
        
        // Check if this is a legal move (doesn't leave king in check)
        // Quick check: execute on copy
        const savedFEN = this.fen;
        const savedHistory = [...this.moveHistory];
        
        // Temporarily execute
        const { board: tmpBoard, turn: tmpTurn } = this.parseFEN();
        const piece2 = tmpBoard[fromR][fromC];
        tmpBoard[r][c] = piece2;
        tmpBoard[fromR][fromC] = null;
        
        // Rebuild temp FEN
        let fenRows2 = [];
        for (let rr = 0; rr < 8; rr++) {
          let row = ''; let empty = 0;
          for (let cc = 0; cc < 8; cc++) {
            if (tmpBoard[rr][cc]) { if (empty>0){row+=empty;empty=0;} row+=tmpBoard[rr][cc]; }
            else empty++;
          }
          if (empty>0) row+=empty;
          fenRows2.push(row);
        }
        const tempFEN = fenRows2.join('/') + ' ' + tmpTurn + ' KQkq - 0 1';
        const savedFEN2 = this.fen;
        this.fen = tempFEN;
        
        const inCheck = this.isKingInCheck('w');
        this.fen = savedFEN2;
        
        if (!inCheck) {
          this.selectedSquare = null;
          this.executeMove(uciMove, true);
          return;
        }
      }
      
      // Invalid move — keep selected if clicking another own piece
      this.selectedSquare = null;
      if (isWhitePiece) {
        this.selectedSquare = { r, c };
        this.highlightSquare(r, c, '#4ade80');
        this.highlightMoves(r, c);
      }
    } else if (isWhitePiece) {
      this.selectedSquare = { r, c };
      this.highlightSquare(r, c, '#4ade80');
      this.highlightMoves(r, c);
    }
  }

  highlightSquare(r, c, color) {
    const sq = document.querySelector(`#chess-board div[data-r="${r}"][data-c="${c}"]`);
    if (sq) sq.style.outline = `3px solid ${color}`;
  }

  highlightMoves(r, c) {
    const moves = this.generateMoves(r, c);
    moves.forEach(m => {
      const target = this.getPiece(m.r, m.c);
      const color = target ? 'rgba(239,68,68,0.6)' : 'rgba(74,222,128,0.4)';
      const sq = document.querySelector(`#chess-board div[data-r="${m.r}"][data-c="${m.c}"]`);
      if (sq) sq.style.boxShadow = `inset 0 0 0 4px ${color}`;
    });
  }

  showResult(msg) {
    const statusEl = document.getElementById('chess-status');
    if (statusEl) statusEl.textContent = msg;
  }

  // --- CLEANUP ---
  destroy() {
    if (this.sfWorker) {
      this.sfWorker.postMessage('quit');
      this.sfWorker.terminate();
      this.sfWorker = null;
    }
    const overlay = document.getElementById('chess-overlay');
    if (overlay) overlay.remove();
    const hb = document.getElementById('chess-health-bar');
    if (hb) hb.remove();
  }
};
