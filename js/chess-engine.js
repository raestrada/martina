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
          if (piece.toLowerCase() === 'p' && (to.r === 0 || to.r === 7)) {
            ['q', 'n', 'r', 'b'].forEach(pChar => {
              const mPromo = from + toSq + pChar;
              if (!CE.isKingInCheck(CE.executeMoveRaw(fen, mPromo), color)) moves.push(mPromo);
            });
          } else {
            if (!CE.isKingInCheck(CE.executeMoveRaw(fen, m), color)) moves.push(m);
          }
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

  CE.pgnToMoves = function(pgnString) {
    if (!pgnString) return [];
    // Remove headers [Event ...]
    let cleaned = pgnString.replace(/\[[^\]]*\]/g, '');
    // Remove comments { ... }
    cleaned = cleaned.replace(/\{[^\}]*\}/g, '');
    // Remove variations ( ... ) recursively
    while (cleaned.includes('(') && cleaned.includes(')')) {
      cleaned = cleaned.replace(/\([^\)]*\)/g, '');
    }
    // Remove move numbers (e.g., "1. ", "1...", "2. ")
    cleaned = cleaned.replace(/\d+\.+\s*/g, '');
    // Remove results like "1-0", "0-1", "1/2-1/2", "*"
    cleaned = cleaned.replace(/(1-0|0-1|1\/2-1\/2|\*)/g, '');
    // Split by whitespace to get individual SAN moves
    const tokens = cleaned.trim().split(/\s+/).filter(x => x.length > 0);
    return tokens;
  };

  CE.sanToUCI = function(fen, san) {
    if (!san) return null;
    const cleanSan = san.replace(/[+#?!]/g, '').trim();
    const turn = fen.split(' ')[1] || 'w';

    // Handle castling
    if (cleanSan === 'O-O' || cleanSan === '0-0') {
      return turn === 'w' ? 'e1g1' : 'e8g8';
    }
    if (cleanSan === 'O-O-O' || cleanSan === '0-0-0') {
      return turn === 'w' ? 'e1c1' : 'e8c8';
    }

    const legalMoves = CE.getAllLegalMoves(fen, turn);
    const board = CE.parseFEN(fen);

    // Identify destination square (last two characters, e.g. e4, f7, a1)
    let dest = '';
    let promo = '';
    let match = cleanSan.match(/([a-h][1-8])(?:=?([QRNBCDTArnbcdta]))?$/);
    if (match) {
      dest = match[1];
      if (match[2]) {
        const promoChar = match[2].toUpperCase();
        const mapPromo = { 'Q': 'q', 'D': 'q', 'R': 'r', 'T': 'r', 'B': 'b', 'A': 'b', 'N': 'n', 'C': 'n' };
        promo = mapPromo[promoChar] || promoChar.toLowerCase();
      }
    } else {
      return null;
    }

    let rest = cleanSan.slice(0, cleanSan.length - dest.length - (promo ? (cleanSan.includes('=') ? 2 : 1) : 0));
    if (rest.endsWith('x')) {
      rest = rest.slice(0, -1);
    }

    let pieceChar = 'P'; // Default is Pawn
    let disambigFile = '';
    let disambigRank = '';

    if (rest.length > 0) {
      const first = rest[0];
      if ('NBRQK'.includes(first)) {
        pieceChar = first;
        rest = rest.slice(1);
      } else if ('ACRDT'.includes(first)) {
        const map = { 'R': 'K', 'D': 'Q', 'T': 'R', 'A': 'B', 'C': 'N' };
        pieceChar = map[first];
        rest = rest.slice(1);
      }

      for (const char of rest) {
        if (char >= 'a' && char <= 'h') disambigFile = char;
        if (char >= '1' && char <= '8') disambigRank = char;
      }
    }

    for (const uci of legalMoves) {
      const fromSq = uci.substring(0, 2);
      const toSq = uci.substring(2, 4);
      const p = uci.length > 4 ? uci[4] : '';

      if (toSq !== dest) continue;
      if (promo && p !== promo) continue;

      const fromC = fromSq.charCodeAt(0) - 97;
      const fromR = 8 - parseInt(fromSq[1]);
      const boardPiece = board[fromR][fromC];
      if (!boardPiece) continue;
      if (boardPiece.toUpperCase() !== pieceChar) continue;

      if (disambigFile && fromSq[0] !== disambigFile) continue;
      if (disambigRank && fromSq[1] !== disambigRank) continue;

      return uci;
    }

    return null;
  };

  CE.uciToSan = function(fen, uci) {
    const board = CE.parseFEN(fen);
    const fenParts = fen.split(' ');
    const turn = fenParts[1] || 'w';
    const epSquare = fenParts[3] || '-';

    const fromC = uci.charCodeAt(0) - 97;
    const fromR = 8 - parseInt(uci[1]);
    const toC = uci.charCodeAt(2) - 97;
    const toR = 8 - parseInt(uci[3]);
    const promo = uci.length > 4 ? uci[4] : null;

    const piece = board[fromR][fromC];
    if (!piece) return uci;

    const captured = board[toR][toC];
    const isPawn = piece.toLowerCase() === 'p';
    const toCoord = uci.substring(2, 4);

    /* Castling */
    if (piece.toLowerCase() === 'k' && Math.abs(fromC - toC) === 2) {
      return toC === 6 ? '0-0' : '0-0-0';
    }

    /* Determine check / checkmate */
    const nextFEN = CE.executeMoveRaw(fen, uci);
    const nextTurn = turn === 'w' ? 'b' : 'w';
    const isCheck = CE.isKingInCheck(nextFEN, nextTurn);
    const isMate = CE.isCheckmate(nextFEN, nextTurn);

    /* Spanish piece letters: R=Rey, D=Dama, T=Torre, A=Alfil, C=Caballo */
    const pieceLetters = { 'K': 'R', 'Q': 'D', 'R': 'T', 'B': 'A', 'N': 'C' };
    const pieceLetter = isPawn ? '' : (pieceLetters[piece.toUpperCase()] || '');

    /* En-passant capture detection */
    let isCapture = !!captured;
    if (isPawn && !captured && epSquare !== '-') {
      const epC = epSquare.charCodeAt(0) - 97;
      const epR = 8 - parseInt(epSquare[1]);
      if (toC === epC && toR === epR) isCapture = true;
    }

    /* Disambiguation for non-pawn pieces */
    let disambig = '';
    if (!isPawn) {
      const legalMoves = CE.getAllLegalMoves(fen, turn);
      const ambiguous = legalMoves.filter(m => {
        if (m === uci) return false;
        if (m.substring(2, 4) !== toCoord) return false;
        const fC = m.charCodeAt(0) - 97;
        const fR = 8 - parseInt(m[1]);
        return board[fR][fC] === piece;
      });
      if (ambiguous.length > 0) {
        const sameFile = ambiguous.some(m => m[0] === uci[0]);
        const sameRank = ambiguous.some(m => m[1] === uci[1]);
        if (!sameFile) disambig = uci[0];
        else if (!sameRank) disambig = uci[1];
        else disambig = uci.substring(0, 2);
      }
    }

    /* Build SAN */
    let san = '';
    if (isPawn) {
      san = isCapture ? (uci[0] + 'x' + toCoord) : toCoord;
    } else {
      san = pieceLetter + disambig + (isCapture ? 'x' : '') + toCoord;
    }

    /* Promotion */
    if (promo) {
      const promoMap = { 'q': 'D', 'r': 'T', 'b': 'A', 'n': 'C' };
      san += '=' + (promoMap[promo] || promo.toUpperCase());
    } else if (isPawn && (toR === 0 || toR === 7)) {
      san += '=D';
    }

    if (isMate) san += '#';
    else if (isCheck) san += '+';

    return san;
  };

  CE.playPGN = function(pgnString, startFen) {
    const sans = CE.pgnToMoves(pgnString);
    let fen = startFen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const history = [{ fen, uci: '', san: 'Posición Inicial' }];

    for (const san of sans) {
      const uci = CE.sanToUCI(fen, san);
      if (!uci) {
        console.error("Could not parse SAN move:", san, "at FEN:", fen);
        break;
      }
      fen = CE.executeMoveRaw(fen, uci);
      history.push({ fen, uci, san });
    }
    return history;
  };

  window.ChessEngine = CE;
})();
