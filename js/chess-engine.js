// chess-engine.js — Pure chess logic (no DOM)
// Reusable across bots, puzzles, game viewer, etc.
(function() {
  const CE = {};

  CE.parseFEN = function(fen) {
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
  };

  CE.buildFEN = function(board, turn, castling, epSquare, halfmove, fullmove) {
    const rows = [];
    for (let r = 0; r < 8; r++) {
      let row = '', empty = 0;
      for (let c = 0; c < 8; c++) {
        if (board[r][c]) {
          if (empty > 0) { row += empty; empty = 0; }
          row += board[r][c];
        } else { empty++; }
      }
      if (empty > 0) row += empty;
      rows.push(row);
    }
    return `${rows.join('/')} ${turn} ${castling} ${epSquare} ${halfmove} ${fullmove}`;
  };

  CE.executeMoveRaw = function(fen, uciMove) {
    const fromC = uciMove.charCodeAt(0) - 97;
    const fromR = 8 - parseInt(uciMove[1]);
    const toC = uciMove.charCodeAt(2) - 97;
    const toR = 8 - parseInt(uciMove[3]);
    const promo = uciMove.length > 4 ? uciMove[4] : null;

    const board = CE.parseFEN(fen);
    const parts = fen.split(' ');
    const turn = parts[1] || 'w';
    let castling = parts[2] || '-';
    const epSquare = parts[3] || '-';
    const halfmove = parseInt(parts[4] || '0');
    const fullmove = parseInt(parts[5] || '1');

    const piece = board[fromR][fromC];
    const captured = board[toR][toC];

    if (piece && piece.toLowerCase() === 'p' && !captured && epSquare !== '-') {
      const epC = epSquare.charCodeAt(0) - 97;
      const epR = 8 - parseInt(epSquare[1]);
      if (toC === epC && toR === epR) board[fromR][epC] = null;
    }

    board[toR][toC] = piece;
    board[fromR][fromC] = null;

    if (promo) board[toR][toC] = turn === 'w' ? promo.toUpperCase() : promo.toLowerCase();
    else if (piece && piece.toLowerCase() === 'p' && (toR === 0 || toR === 7)) board[toR][toC] = turn === 'w' ? 'Q' : 'q';

    if (piece === 'K') castling = castling.replace('K', '').replace('Q', '');
    if (piece === 'k') castling = castling.replace('k', '').replace('q', '');
    if (fromR === 7 && fromC === 7) castling = castling.replace('K', '');
    if (fromR === 7 && fromC === 0) castling = castling.replace('Q', '');
    if (fromR === 0 && fromC === 7) castling = castling.replace('k', '');
    if (fromR === 0 && fromC === 0) castling = castling.replace('q', '');
    if (toR === 7 && toC === 7) castling = castling.replace('K', '');
    if (toR === 7 && toC === 0) castling = castling.replace('Q', '');
    if (toR === 0 && toC === 7) castling = castling.replace('k', '');
    if (toR === 0 && toC === 0) castling = castling.replace('q', '');
    if (castling === '') castling = '-';

    if (piece && piece.toLowerCase() === 'k' && Math.abs(fromC - toC) === 2) {
      if (toC === 6) { board[toR][5] = board[toR][7]; board[toR][7] = null; }
      else { board[toR][3] = board[toR][0]; board[toR][0] = null; }
    }

    let newEp = '-';
    if (piece && piece.toLowerCase() === 'p' && Math.abs(toR - fromR) === 2) {
      newEp = String.fromCharCode(97 + fromC) + (8 - (fromR + toR) / 2);
    }

    const newTurn = turn === 'w' ? 'b' : 'w';
    const newHalfmove = (piece && piece.toLowerCase() === 'p') || captured ? 0 : halfmove + 1;
    const newFullmove = turn === 'b' ? fullmove + 1 : fullmove;

    return CE.buildFEN(board, newTurn, castling, newEp, newHalfmove, newFullmove);
  };

  CE.generatePseudoMoves = function(fen, r, c, skipCastling) {
    const board = CE.parseFEN(fen);
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
        if ((t === t.toUpperCase() ? 'w' : 'b') === color) return false;
        moves.push({ r: tr, c: tc });
        return false;
      }
      moves.push({ r: tr, c: tc });
      return true;
    };

    const slide = (dr, dc) => { for (let i = 1; i < 8; i++) { if (!add(r + dr * i, c + dc * i)) break; } };

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
        if (epSquare !== '-') {
          const epC = epSquare.charCodeAt(0) - 97;
          const epR = 8 - parseInt(epSquare[1]);
          if (r + dir === epR && Math.abs(c - epC) === 1) moves.push({ r: epR, c: epC });
        }
        break;
      }
      case 'n':
        for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r + dr, c + dc);
        break;
      case 'b': slide(1,1); slide(1,-1); slide(-1,1); slide(-1,-1); break;
      case 'r': slide(1,0); slide(-1,0); slide(0,1); slide(0,-1); break;
      case 'q': slide(1,0); slide(-1,0); slide(0,1); slide(0,-1); slide(1,1); slide(1,-1); slide(-1,1); slide(-1,-1); break;
      case 'k':
        for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) add(r + dr, c + dc);
        if (!skipCastling) {
          if (color === 'w' && r === 7 && c === 4) {
            if (castling.includes('K') && board[7][7] === 'R' && !board[7][5] && !board[7][6] &&
                !CE.isSquareAttacked(fen,7,4,'b') && !CE.isSquareAttacked(fen,7,5,'b') && !CE.isSquareAttacked(fen,7,6,'b')) moves.push({r:7,c:6});
            if (castling.includes('Q') && board[7][0] === 'R' && !board[7][1] && !board[7][2] && !board[7][3] &&
                !CE.isSquareAttacked(fen,7,4,'b') && !CE.isSquareAttacked(fen,7,3,'b') && !CE.isSquareAttacked(fen,7,2,'b')) moves.push({r:7,c:2});
          }
          if (color === 'b' && r === 0 && c === 4) {
            if (castling.includes('k') && board[0][7] === 'r' && !board[0][5] && !board[0][6] &&
                !CE.isSquareAttacked(fen,0,4,'w') && !CE.isSquareAttacked(fen,0,5,'w') && !CE.isSquareAttacked(fen,0,6,'w')) moves.push({r:0,c:6});
            if (castling.includes('q') && board[0][0] === 'r' && !board[0][1] && !board[0][2] && !board[0][3] &&
                !CE.isSquareAttacked(fen,0,4,'w') && !CE.isSquareAttacked(fen,0,3,'w') && !CE.isSquareAttacked(fen,0,2,'w')) moves.push({r:0,c:2});
          }
        }
        break;
    }
    return moves;
  };

  CE.isSquareAttacked = function(fen, r, c, byColor) {
    const board = CE.parseFEN(fen);
    for (let rr = 0; rr < 8; rr++) {
      for (let cc = 0; cc < 8; cc++) {
        const piece = board[rr][cc];
        if (!piece) continue;
        if ((piece === piece.toUpperCase() ? 'w' : 'b') !== byColor) continue;
        if (CE.generatePseudoMoves(fen, rr, cc, true).some(m => m.r === r && m.c === c)) return true;
      }
    }
    return false;
  };

  CE.getAllLegalMoves = function(fen, color) {
    const moves = [];
    const board = CE.parseFEN(fen);
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;
        if ((color === 'w') !== (piece === piece.toUpperCase())) continue;
        const pseudo = CE.generatePseudoMoves(fen, r, c);
        pseudo.forEach(to => {
          const from = String.fromCharCode(97 + c) + (8 - r);
          const toSq = String.fromCharCode(97 + to.c) + (8 - to.r);
          let m = from + toSq;
          if (piece.toLowerCase() === 'p' && (to.r === 0 || to.r === 7)) m += 'q';
          if (!CE.isKingInCheck(CE.executeMoveRaw(fen, m), color)) moves.push(m);
        });
      }
    }
    return moves;
  };

  CE.isKingInCheck = function(fen, color) {
    const board = CE.parseFEN(fen);
    const king = color === 'w' ? 'K' : 'k';
    let kr = -1, kc = -1;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] === king) { kr = r; kc = c; break; }
      }
      if (kr >= 0) break;
    }
    if (kr < 0) return false;
    return CE.isSquareAttacked(fen, kr, kc, color === 'w' ? 'b' : 'w');
  };

  CE.isCheckmate = function(fen, color) {
    return CE.getAllLegalMoves(fen, color).length === 0 && CE.isKingInCheck(fen, color);
  };

  CE.isStalemate = function(fen, color) {
    return CE.getAllLegalMoves(fen, color).length === 0 && !CE.isKingInCheck(fen, color);
  };

  CE.getMoveCategory = function(fen, uciMove) {
    const board = CE.parseFEN(fen);
    const fromC = uciMove.charCodeAt(0) - 97;
    const fromR = 8 - parseInt(uciMove[1]);
    const toC = uciMove.charCodeAt(2) - 97;
    const toR = 8 - parseInt(uciMove[3]);
    const piece = board[fromR][fromC];
    const captured = board[toR][toC];
    const nextFEN = CE.executeMoveRaw(fen, uciMove);
    const turn = fen.split(' ')[1] || 'w';
    const cats = [];
    if (captured) cats.push('capture');
    if (CE.isKingInCheck(nextFEN, turn === 'w' ? 'b' : 'w')) cats.push('check');
    if (piece && piece.toLowerCase() === 'p' && (toR === 0 || toR === 7)) cats.push('promotion');
    if (piece && piece.toLowerCase() === 'k' && Math.abs(fromC - toC) === 2) cats.push('castle');
    return cats.length > 0 ? cats : ['move'];
  };

  CE.evaluateBoard = function(fen, color) {
    const board = CE.parseFEN(fen);
    const vals = { p:1, n:3, b:3, r:5, q:9, k:0 };
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;
        const v = vals[piece.toLowerCase()] || 0;
        const d = Math.abs(3.5 - r) + Math.abs(3.5 - c);
        const centerBonus = Math.max(0, (7 - d) * 0.04);
        score += (piece === piece.toUpperCase() ? 1 : -1) * (v + centerBonus);
      }
    }
    return color === 'w' ? score : -score;
  };

  window.ChessEngine = CE;
})();
