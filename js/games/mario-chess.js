// === CHESS DUEL MODULE — Engine propio ~300 ELO + UI ===
// Motor de ajedrez inline (sin dependencias externas).
// Evalúa material y posición, busca a profundidad 1 con blunders realistas.

window.ChessDuel = class ChessDuel {
  constructor(container, onWin, onLose) {
    this.container = container;
    this.onWin = onWin;
    this.onLose = onLose;
    this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    this.turn = 'w';
    this.selectedSquare = null;
    this.playerColor = 'w';
    this.gameOver = false;
    this.moveHistory = [];
    this.pieceValues = { p:1, n:3, b:3, r:5, q:9, k:0 };
    this.isThinking = false;
  }

  start() {
    this.renderBoard();
    this.updateStatus('¡Tu turno! Juegas con blancas ♔');
  }

  // --- ENGINE: Find best move for opponent (~300 ELO) ---
  findOpponentMove() {
    try {
      const legalMoves = this.getAllLegalMoves('b');
      if (legalMoves.length === 0) return null;
      
      // 300 ELO: 40% random, 60% semi-smart
      if (Math.random() < 0.40) {
        return legalMoves[Math.floor(Math.random() * legalMoves.length)];
      }
      
      let bestMove = legalMoves[0];
      let bestScore = -Infinity;
      
      for (const move of legalMoves) {
        const savedFEN = this.fen;
        const savedHistory = [...this.moveHistory];
        const savedTurn = this.turn;
        
        this.executeMoveRaw(move);
        const score = this.evaluateBoard('b');
        
        this.fen = savedFEN;
        this.moveHistory = savedHistory;
        this.turn = savedTurn;
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
      
      // 15% blunder: pick second-best
      if (Math.random() < 0.15 && legalMoves.length > 1) {
        const others = legalMoves.filter(m => m !== bestMove);
        return others[Math.floor(Math.random() * others.length)];
      }
      
      return bestMove || legalMoves[0];
    } catch(e) {
      console.error('Engine error:', e);
      const legalMoves = this.getAllLegalMoves('b');
      return legalMoves.length > 0 ? legalMoves[Math.floor(Math.random() * legalMoves.length)] : null;
    }
  }

  // --- Simple board evaluation (material + position) ---
  evaluateBoard(color) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.getPiece(r, c);
        if (!piece) continue;
        const p = piece.toLowerCase();
        const isWhite = piece === piece.toUpperCase();
        const val = this.pieceValues[p] || 0;
        
        // Material
        if (isWhite) {
          score += val;
          // Center control bonus (white perspective)
          const centerDist = Math.abs(3.5 - r) + Math.abs(3.5 - c);
          score += Math.max(0, (7 - centerDist) * 0.05);
        } else {
          score -= val;
          const centerDist = Math.abs(3.5 - r) + Math.abs(3.5 - c);
          score -= Math.max(0, (7 - centerDist) * 0.05);
        }
        
        // Mobility bonus (piece can move = good for that side)
        if (isWhite) score += this.generateMoves(r, c).length * 0.1;
        else score -= this.generateMoves(r, c).length * 0.1;
      }
    }
    return color === 'w' ? score : -score;
  }

  // --- Raw move execution (modifies state, no checks) ---
  executeMoveRaw(uciMove) {
    const fromC = uciMove.charCodeAt(0) - 97;
    const fromR = 8 - parseInt(uciMove[1]);
    const toC = uciMove.charCodeAt(2) - 97;
    const toR = 8 - parseInt(uciMove[3]);
    
    const { board, turn, castling, enPassant } = this.parseFEN();
    board[toR][toC] = board[fromR][fromC];
    board[fromR][fromC] = null;
    
    if (uciMove.length > 4) {
      board[toR][toC] = turn === 'w' ? uciMove[4].toUpperCase() : uciMove[4].toLowerCase();
    }
    
    let fenRows = [];
    for (let r = 0; r < 8; r++) {
      let row = '', empty = 0;
      for (let c = 0; c < 8; c++) {
        if (board[r][c]) { if (empty>0){row+=empty;empty=0;} row+=board[r][c]; }
        else empty++;
      }
      if (empty>0) row+=empty;
      fenRows.push(row);
    }
    const newTurn = turn === 'w' ? 'b' : 'w';
    this.fen = fenRows.join('/') + ' ' + newTurn + ' ' + castling + ' ' + enPassant + ' 0 1';
    this.turn = newTurn;
    this.moveHistory.push(uciMove);
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
        } else board[r][c++] = ch;
      }
    }
    return { board, turn: parts[1], castling: parts[2], enPassant: parts[3] };
  }

  getPiece(r, c) {
    const { board } = this.parseFEN();
    return board[r] ? board[r][c] : null;
  }

  // --- GENERATE PSEUDO-LEGAL MOVES ---
  generateMoves(r, c) {
    const piece = this.getPiece(r, c);
    if (!piece) return [];
    const moves = [];
    const color = piece === piece.toUpperCase() ? 'w' : 'b';
    const p = piece.toLowerCase();

    const add = (tr, tc) => {
      if (tr < 0 || tr > 7 || tc < 0 || tc > 7) return false;
      const t = this.getPiece(tr, tc);
      if (t) {
        const tCol = t === t.toUpperCase() ? 'w' : 'b';
        if (tCol === color) return false;
        moves.push({ r: tr, c: tc });
        return false;
      }
      moves.push({ r: tr, c: tc });
      return true;
    };

    const slide = (dr, dc) => { for (let i=1; i<8; i++) if (!add(r+dr*i, c+dc*i)) break; };

    switch (p) {
      case 'p': {
        const dir = color === 'w' ? -1 : 1;
        const sr = color === 'w' ? 6 : 1;
        if (!this.getPiece(r+dir, c)) {
          add(r+dir, c);
          if (r===sr && !this.getPiece(r+2*dir, c)) add(r+2*dir, c);
        }
        [-1,1].forEach(dc => {
          const t = this.getPiece(r+dir, c+dc);
          if (t && ((t===t.toUpperCase())!==(color==='w'))) add(r+dir, c+dc);
        });
        break;
      }
      case 'n':
        for (const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r+dr,c+dc);
        break;
      case 'b': slide(1,1);slide(1,-1);slide(-1,1);slide(-1,-1); break;
      case 'r': slide(1,0);slide(-1,0);slide(0,1);slide(0,-1); break;
      case 'q': slide(1,0);slide(-1,0);slide(0,1);slide(0,-1);slide(1,1);slide(1,-1);slide(-1,1);slide(-1,-1); break;
      case 'k':
        for (const [dr,dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) add(r+dr,c+dc);
        break;
    }
    return moves;
  }

  // --- GET ALL LEGAL MOVES ---
  getAllLegalMoves(color) {
    const moves = [];
    for (let r=0; r<8; r++) {
      for (let c=0; c<8; c++) {
        const piece = this.getPiece(r, c);
        if (!piece) continue;
        const isW = piece === piece.toUpperCase();
        if ((color==='w'&&!isW)||(color==='b'&&isW)) continue;
        this.generateMoves(r,c).forEach(to => {
          const from = String.fromCharCode(97+c)+(8-r);
          const toSq = String.fromCharCode(97+to.c)+(8-to.r);
          moves.push(from+toSq);
        });
      }
    }
    return moves;
  }

  // --- EXECUTE A MOVE (with validation) ---
  executeMove(uciMove, isPlayer) {
    if (this.gameOver) return;
    // Only block player moves while thinking, not engine moves
    if (isPlayer && this.isThinking) return;
    
    const fromC = uciMove.charCodeAt(0) - 97;
    const fromR = 8 - parseInt(uciMove[1]);
    const toC = uciMove.charCodeAt(2) - 97;
    const toR = 8 - parseInt(uciMove[3]);
    
    // Validate against our own king being left in check
    const savedFEN = this.fen;
    const savedHistory = [...this.moveHistory];
    const savedTurn = this.turn;
    
    this.executeMoveRaw(uciMove);
    
    const currentColor = isPlayer ? 'w' : 'b';
    if (this.isKingInCheck(currentColor)) {
      this.fen = savedFEN;
      this.moveHistory = savedHistory;
      this.turn = savedTurn;
      return;
    }
    
    this.renderBoard();
    
    // Check game over
    const nextColor = this.turn;
    const allMoves = this.getAllLegalMoves(nextColor);
    if (allMoves.length === 0) {
      this.gameOver = true;
      if (this.isKingInCheck(nextColor)) {
        if (isPlayer) {
          this.updateStatus('¡JAQUE MATE! ¡Ganaste! 🎉');
          setTimeout(() => this.onWin(), 1500);
        } else {
          this.updateStatus('Jaque mate. Perdiste 😞');
          setTimeout(() => this.onLose(), 1500);
        }
      } else {
        this.updateStatus('¡Ahogado! Tablas — cuentas como ganador 🎉');
        setTimeout(() => this.onWin(), 1500);
      }
      return;
    }
    
    // Opponent's turn
    if (this.turn === 'b' && !this.gameOver) {
      this.isThinking = true;
      this.updateStatus('Equis está pensando... 🤔');
      
      setTimeout(() => {
        if (this.gameOver) { this.isThinking = false; return; }
        const move = this.findOpponentMove();
        if (move) {
          this.executeMove(move, false);
        }
        this.isThinking = false;
      }, 500 + Math.random() * 600);
    } else if (this.turn === 'w') {
      this.updateStatus('¡Tu turno! ♔');
    }
  }

  isKingInCheck(color) {
    const king = color === 'w' ? 'K' : 'k';
    let kr = -1, kc = -1;
    for (let r=0; r<8; r++) {
      for (let c=0; c<8; c++) {
        if (this.getPiece(r,c)===king){kr=r;kc=c;break;}
      }
      if (kr>=0) break;
    }
    if (kr<0) return false;
    const opp = color==='w'?'b':'w';
    for (let r=0; r<8; r++) {
      for (let c=0; c<8; c++) {
        const p = this.getPiece(r,c);
        if (!p) continue;
        const pCol = p===p.toUpperCase()?'w':'b';
        if (pCol!==opp) continue;
        if (this.generateMoves(r,c).some(m=>m.r===kr&&m.c===kc)) return true;
      }
    }
    return false;
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
      background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);
      font-family:'Outfit',sans-serif;
    `;
    
    overlay.innerHTML = `
      <div style="background:rgba(20,15,10,0.92);border:3px solid #8B6914;border-radius:16px;padding:18px;text-align:center;">
        <h2 style="color:#daa520;margin:0 0 6px 0;font-size:22px;">🐴 Desafío de Ajedrez — Equis</h2>
        <p id="chess-status" style="color:#cbd5e1;font-size:13px;margin-bottom:10px;">Cargando...</p>
        <div id="chess-board" style="display:grid;grid-template-columns:repeat(8,50px);grid-template-rows:repeat(8,50px);border:2px solid #5c3d0e;margin:0 auto;"></div>
        <button id="chess-resign" style="margin-top:10px;background:#8b0000;color:#fff;border:none;padding:5px 16px;border-radius:8px;font-weight:700;cursor:pointer;font-family:Outfit,sans-serif;">Rendirse ✕</button>
      </div>
    `;
    
    this.container.appendChild(overlay);
    
    const boardEl = document.getElementById('chess-board');
    const { board } = this.parseFEN();
    const sym = {
      'K':'♔','Q':'♕','R':'♖','B':'♗','N':'♘','P':'♙',
      'k':'♚','q':'♛','r':'♜','b':'♝','n':'♞','p':'♟'
    };
    
    for (let r=0; r<8; r++) {
      for (let c=0; c<8; c++) {
        const sq = document.createElement('div');
        const light = (r+c)%2===0;
        sq.style.cssText = `
          width:50px;height:50px;
          background:${light?'#f0d9b5':'#b58863'};
          display:flex;align-items:center;justify-content:center;
          font-size:38px;cursor:pointer;user-select:none;
          font-weight:700;
        `;
        sq.dataset.r=r; sq.dataset.c=c;
        const piece = board[r][c];
        if (piece) {
          sq.textContent = sym[piece]||'';
          // White pieces: bright ivory with dark shadow, Black: dark charcoal
          sq.style.color = piece===piece.toUpperCase()?'#fffef0':'#1a1a1a';
          sq.style.textShadow = piece===piece.toUpperCase()
            ? '0 2px 3px rgba(0,0,0,0.4)'
            : '0 1px 2px rgba(255,255,255,0.15)';
        }
        sq.addEventListener('click', ()=>this.handleClick(r,c));
        boardEl.appendChild(sq);
      }
    }
    
    document.getElementById('chess-resign').addEventListener('click', ()=>{
      this.gameOver = true;
      this.updateStatus('Te rendiste 😞');
      setTimeout(()=>this.onLose(), 1000);
    });
    
    this.updateStatus(this.turn==='w'?'¡Tu turno! ♔':'Equis está pensando... 🤔');
  }

  handleClick(r, c) {
    if (this.gameOver || this.turn!=='w' || this.isThinking) return;
    
    const piece = this.getPiece(r, c);
    const isWhite = piece && piece===piece.toUpperCase();
    
    document.querySelectorAll('#chess-board div').forEach(sq=>{
      sq.style.boxShadow=''; sq.style.outline='';
    });
    
    if (this.selectedSquare) {
      const fr=this.selectedSquare.r, fc=this.selectedSquare.c;
      const moves=this.generateMoves(fr,fc);
      if (moves.some(m=>m.r===r&&m.c===c)) {
        const from=String.fromCharCode(97+fc)+(8-fr);
        const to=String.fromCharCode(97+c)+(8-r);
        this.selectedSquare=null;
        this.executeMove(from+to, true);
        return;
      }
      this.selectedSquare=null;
      if (isWhite) {
        this.selectedSquare={r,c};
        this.highlight(r,c,'#4ade80');
        this.highlightMoves(r,c);
      }
    } else if (isWhite) {
      this.selectedSquare={r,c};
      this.highlight(r,c,'#4ade80');
      this.highlightMoves(r,c);
    }
  }

  highlight(r,c,color) {
    const sq=document.querySelector(`#chess-board div[data-r="${r}"][data-c="${c}"]`);
    if (sq) sq.style.outline=`3px solid ${color}`;
  }

  highlightMoves(r,c) {
    this.generateMoves(r,c).forEach(m=>{
      const t=this.getPiece(m.r,m.c);
      const color=t?'rgba(239,68,68,0.55)':'rgba(74,222,128,0.35)';
      const sq=document.querySelector(`#chess-board div[data-r="${m.r}"][data-c="${m.c}"]`);
      if (sq) sq.style.boxShadow=`inset 0 0 0 4px ${color}`;
    });
  }

  updateStatus(msg) {
    const el = document.getElementById('chess-status');
    if (el) el.textContent = msg;
  }

  destroy() {
    this.gameOver = true;
    const overlay = document.getElementById('chess-overlay');
    if (overlay) overlay.remove();
  }
};
