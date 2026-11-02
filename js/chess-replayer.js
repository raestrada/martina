// chess-replayer.js — Native offline chess game replayer for Martina cuentos
// Integrates with existing ChessEngine and ChessBoard

(function() {
  'use strict';

  // --- STORY PARTIDAS DATABASE ---
  const STORY_GAMES = {
    1: {
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Nc3 Nxe4 8. O-O Nxc3 9. bxc3 Bxc3 10. Qb3 Bxa1 11. Bxf7+ Kf8 12. Bg5 Ne7 13. Ne5 Bxd4 14. Bg6 d5 15. Qf3+ Bf5 16. Bxf5 Bxe5 17. Be6+ Bf6 18. Bxf6 gxf6 19. Qxf6+ Ke8 20. Qf7# 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    2: {
      pgn: `1. e4 e5 2. Nf3 d6 3. c3 f5 4. Bc4 Nf6 5. d4 fxe4 6. dxe5 exf3 7. exf6 Qxf6 8. gxf3 Nc6 9. f4 Bd7 10. Be3 O-O-O 11. Nd2 Re8 12. Qf3 Bf5 13. O-O-O d5 14. Bxd5 Qxc3+ 15. bxc3 Ba3# 0-1`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    3: {
      pgn: `1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    4: {
      pgn: `1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 d6 6. Be2 Be7 7. O-O O-O 8. Be3 Nc6 9. f4 Qc7 10. Kh1 Bd7 11. Qe1 a6 12. Qg3 Kh8 13. Rad1 Rad8 14. Qh3 Nxd4 15. Bxd4 Bc6 16. Bd3 Nh5 17. Rf3 Bf6 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    5: {
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Bxc6 dxc6 5. d4 exd4 6. Qxd4 Qxd4 7. Nxd4 Bd7 8. Nc3 O-O-O 9. Be3 Bb4 10. O-O-O Nf6 11. f3 Rhe8 12. Nce2 Nd5 13. Bf2 Nb6 14. c3 Bf8 *`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    6: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3 O-O 8. Qd2 Nc6 9. Bc4 Nxd4 10. Bxd4 Be6 11. Bb3 Qa5 12. O-O-O b5 13. Kb1 b4 14. Nd5 Bxd5 15. Bxd5 Rac8 16. Bb3 Rc7 17. h4 Qb5 18. h5 a5 19. hxg6 hxg6 20. g4 a4 21. Bxf6 Bxf6 22. Qh6 Rfc8 23. Qxg6+ *`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    7: {
      pgn: `1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6 20. e4 d4 21. f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 exf5 27. Rxf5 Nh7 28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7 32. Qe5 Qe8 33. a4 Qd8 34. R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8 37. Qe4 Nf6 38. Rxf6 gxf6 39. Rxf6 Kg8 40. Bc4 Kh8 41. Qf4 *`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    8: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. Bd3 h6 11. Qh3 Nb6 12. Rhe1 e5 13. Nf5 Bxf5 14. exf5 O-O-O 15. Bxf6 Bxf6 16. Be4 exf4 17. Nd5 Nxd5 18. Bxd5 Kb8 19. Re4 Rhe8 20. Rb4 b6 21. Qb3 Ka7 22. a4 Re3 23. c3 Rc8 24. Kb1 Bxc3 25. bxc3 Rxc3 26. Qb2 Qc5 27. Be4 d5 28. Rxd5 Rc1+ 29. Ka2 Rc2 30. Rd7+ Kb8 31. Rxb6+ Qxb6 32. Rb7+ Qxb7 33. Bxb7 Rxb2+ 34. Kxb2 Kxb7 0-1`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    9: {
      pgn: `1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Qxa1+ 19. Ke2 Bxg1 20. e5 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7# 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    10: {
      pgn: `1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 Bb4 5. e3 O-O 6. Bd3 c5 7. O-O Nc6 8. a3 Ba5 9. Ne2 dxc4 10. Bxc4 Bb6 11. dxc5 Qxd1 12. Rxd1 Bxc5 13. b4 Be7 14. Bb2 Bd7 15. Rac1 Rfd8 16. Ned4 Nxd4 17. Nxd4 Ba4 18. Bb3 Bxb3 19. Nxb3 Rxd1+ 20. Rxd1 Rc8 21. Kf1 Kf8 22. Ke2 Ne4 23. Rc1 Rxc1 24. Bxc1 f6 25. Na5 Nd6 26. Kd3 Bd8 27. Nc4 Bc7 28. Nxd6 Bxd6 29. b5 Bxh2 30. g3 h5 31. Ke2 h4 32. Kf3 Ke7 33. Kg2 hxg3 34. fxg3 Bxg3 35. Kxg3 Kd6 36. a4 Kd5 37. Ba3 Ke4 38. Bc5 a6 39. b6 f5 40. Kh4 f4 41. exf4 Kxf4 42. Bd6+ Kf5 43. Kg3 Ke4 44. Kg4 Kd5 45. Bf8 g6 46. Kg5 e5 47. Kxg6 e4 48. Kf5 e3 49. Bb4 Kd4 50. Ke6 e2 51. Kd7 Kc4 52. Be1 Kb3 53. Kc7 Kxa4 54. Kxb7 Kb5 55. Ka7 a5 56. b7 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    11: {
      pgn: `1. Ke2 Kd7 2. Ke3 Ke6 3. Ke4 Kf6 4. Kd5 Ke7 5. Ke5 Kf7 6. Kd6 Ke8 7. Kd5 Kd7 8. Ke5 Ke8 9. Ke6 Kd8 10. d5 Ke8 11. d6 Kd8 12. d7 Kc7 13. Ke7 1-0`,
      startFen: '4k3/8/8/8/3P4/8/8/4K3 w - - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    12: {
      pgn: `1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 Nbd7 7. Bd3 c5 8. O-O cxd4 9. exd4 dxc4 10. Bxc4 Nb6 11. Bb3 Bd7 12. Qd3 Nbd5 13. Ne5 Bc6 14. Rad1 Rc8 15. Qh3 Nxc3 16. bxc3 Bd5 17. c4 Be4 18. Rfe1 Bf5 19. Qf3 Nd7 20. Bxe7 Qxe7 21. Qxb7 Rfd8 22. Ba4 Qa3 23. Bxd7 Rb8 24. Qc7 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    13: {
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Na5 6. d3 h6 7. Nf3 e4 8. Qe2 Nxc4 9. dxc4 Bc5 10. h3 O-O 11. Nh2 c6 12. dxc6 bxc6 13. O-O Qb6 14. Nc3 Ba6 15. Na4 Qb4 16. Nxc5 Bxc4 17. Nd3 exd3 18. cxd3 Rfe8 19. Qd1 Ba6 20. a3 Qd4 21. Be3 Qxd3 22. Qxd3 Bxd3 23. Rfd1 Be4 24. Bd4 Nd5 25. f3 Bg6 26. Rac1 Nf4`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    14: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e6 7. f3 b5 8. Qd2 Bb7 9. a4 b4 10. Na2 d5 11. e5 Nfd7 12. f4 Nc6 13. Nxc6 Bxc6 14. Nxb4 Bb7 15. Be2 Be7 16. O-O O-O 17. c3 a5 18. Nc2 Nc5 19. Nd4 Ne4 20. Qc2 Bc5 21. Bd3 Qb6 22. Bxe4 dxe4 23. Rfd1 Rfd8 24. Qf2 Bd5 25. Nf5 Bxe3 26. Nxe3 Rab8 27. Rd2 Bb3 28. Rxd8+ Rxd8 29. Nf1 Qxf2+ 30. Kxf2 f5 0-1`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    15: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bc4 e6 7. Bb3 Be7 8. O-O O-O 9. f4 Nc6 10. Be3 Bd7 11. f5 Nxd4 12. Bxd4 b5 13. a3 Rc8 14. Qd3 e5 15. Bf2 Bc6 16. Bh4 Nd7 17. Bxe7 Qxe7 18. Bd5 Nc5 19. Qd2 Bxd5 20. f6 gxf6 21. Nxd5 Qe6 22. Qh6 Nxe4 23. Nxf6+ Nxf6 24. Rxf6 Qg4 25. c3 Rcd8 26. Raf1 d5 27. R6f3 Qg6 28. Rg3 d4 29. cxd4 exd4 30. Rxg6+ hxg6 31. Rf3 f5 32. Qxg6+ Kh8 33. Rh3#`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    16: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Be7 8. Qf3 Qc7 9. O-O-O Nbd7 10. Bd3 h6 11. Qh3 Nb6 12. Rhe1 e5 13. Nf5 Bxf5 14. exf5 O-O-O 15. Bxf6 Bxf6 16. Be4 exf4 17. Nd5 Nxd5 18. Bxd5 Kb8 19. Re4 Rhe8 20. Rb4 b6 21. Qb3 Ka7 22. a4 Re3 23. c3 Rc8 24. Kb1 Bxc3 25. bxc3 Rxc3 26. Qb2 Qc5 27. Be4 d5 28. Rxd5 Rc1+ 29. Ka2 Rc2 30. Rd7+ Kb8 31. Rxb6+ Qxb6 32. Rb7+ Qxb7 33. Bxb7 Rxb2+ 34. Kxb2 Kxb7 0-1`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    17: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. g4 Bxg4 7. f3 Bd7 8. Be3 e6 9. Qd2 Nc6 10. O-O-O Be7 11. Rg1 g6 12. Bh6 Rg8 13. f4 Qb6 14. Nf3 O-O-O 15. Bc4 Na5 16. Bb3 Nxb3+ 17. axb3 d5 18. exd5 exd5 19. Bg5 Bf5 20. Qd4 Qxd4 21. Nxd4 Be4 22. Rge1 Rge8 23. f5 Ng4 24. Bxe7 Rxe7 25. h3 Nf6 26. fxg6 fxg6 27. Rf1 Nh5 28. Rde1 Rde8 29. Kd2 Bg2 30. Rxe7 Rxe7 31. Rf8+ Kd7 32. h4 Ng3 33. Rf2 Ne4+ 34. Nxe4 Bxe4 35. Rf8 Kd6 36. c4 Ke5 37. Ke3 Bf5 38. Nxf5 gxf5 39. cxd5 Kxd5+ 40. Kf4 Kd4 41. Kxf5 Kd3 42. Kf6 Rc7 43. Rf7 Rxf7+ 44. Kxf7 Kc2 45. h5 Kxb2 46. h6 Kxb3 47. Kg7 a5 48. Kxh7 a4 49. Kg6 a3 50. h7 a2 51. h8=Q Kc2 52. Qa1 Kb3 53. Kf5 b5 54. Ke4 b4 55. Kd3 Ka3 56. Kc4 b3 57. Kc3 Ka4 58. Qb2 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    18: {
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d3 O-O 6. O-O d6 7. a4 a6 8. Re1 Ba7 9. Nbd2 Ne7 10. Nf1 Ng6 11. Ng3 c6 12. Bb3 Re8 13. h4 h6 14. g4 d5 15. g5 Ng4 16. d4 exd4 17. cxd4 dxe4 18. Nxe4 Qc7 19. Bg5 Bf5 20. Ng3 Rxe1+ 21. Qxe1 Bd7 22. Qe4 Re8 23. Qxg6 Be6 24. Bxe6 Rxe6 25. Qf7# 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    19: {
      pgn: `1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nc3 Bg7 6. Be3 Nf6 7. Bc4 O-O 8. Bb3 Ng4 9. Qxg4 Nxd4 10. Qh4 Qa5 11. O-O Nxb3 12. axb3 Qd8 13. Nd5 f6 14. Bb6 axb6 15. Rxa8 e6 16. Rxc8 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    20: {
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. d4 Nd6 6. Bxc6 dxc6 7. dxe5 Nf5 8. Qxd8+ Kxd8 9. Nc3 h6 10. Rd1+ Ke8 11. h3 Be7 12. Ne2 Nh4 13. Nxh4 Bxh4 14. Be3 Bf5 15. Nd4 Bh7 16. g4 Be7 17. Kg2 h5 18. Nf5 Bf8 19. Kf3 Bg6 20. Rd2 hxg4+ 21. hxg4 Rh3+ 22. Kg2 Rh7 23. Kg3 f6 24. Bf4 Bxf5 25. gxf5 fxe5 26. Re1 Bd6 27. Bxe5 Kd7 28. c4 c5 29. Bxd6 cxd6 30. Re6 Rah8 31. Rexd6+ Kc8 32. R2d5 Rh3+ 33. Kg2 Rh2+ 34. Kf3 R2h3+ 35. Ke4 b6 36. Rc6+ Kb8 37. Rd7 Rh2 38. Ke3 Rf8 39. Rcc7 Rxf5 40. Rb7+ ... 42. Rxg7 Kc8 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    21: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Qb6 8. Qd2 Qxb2 9. Rb1 Qa3 10. f5 Nc6 11. fxe6 fxe6 12. Nxc6 bxc6 13. e5 dxe5 14. Bxf6 gxf6 15. Ne4 Be7 16. Be2 h5 17. Rb3 Qa4 18. c4 f5 19. O-O fxe4 20. Qd1 Bd7 21. Bxh5+ Kd8 22. Rb7 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    22: {
      pgn: `1. e4 e5 2. Nf3 d6 3. Bc4 Nc6 4. Nc3 Bg4 5. Nxe5 Bxd1 6. Bxf7+ Ke7 7. Nd5# 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    23: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e6 7. f3 b5 8. Qd2 Nbd7 9. g4 Bb7 10. O-O-O h6 11. h4 b4 12. Nce2 d5 13. exd5 Nxd5 14. Nf4 Nxe3 15. g4 Qb6 16. Qxe3 Bc5 17. Rhe1 O-O 18. Nf5 exf5 19. Qd3 Rad8 20. Qxf5 Be3+ 21. Kb1 Bxf4 22. Qxf4 Nc5 23. Rxd8 Qxd8 24. g5 hxg5 25. hxg5 Bd5 26. Rd1 Ne6 27. Qh4 Bxc4 28. Rxd8 Rxd8 29. Bh6 Bd5 30. f4 Be4 31. g6 Bxg6 32. f5 Bxf5 33. Qxb4 Rd1+ 34. Kb2 Rd8 35. Qf6+ Kf8 36. Bg7+ Rxg7 37. Ne6+ Kg8 38. Qf8# 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    24: {
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Nc3 d5 8. exd5 Nxd5 9. O-O Be6 10. Bg5 Be7 11. Bxd5 Bxd5 12. Nxd5 Qxd5 13. Bxe7 Nxe7 14. Re1 f6 15. Qe2 Qd7 16. Rac1 c6 17. d5 cxd5 18. Nd4 Kf7 19. Ne6 Rhc8 20. Qg4 g6 21. Ng5+ Ke8 22. Rxe7+ Kf8 23. Rf7+ Kg8 24. Rg7+ Kh8 25. Rxh7+ 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    25: {
      pgn: `1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 d6 6. Be3 a6 7. g4 h6 8. f4 Nc6 9. Qf3 e5 10. Nxc6 bxc6 11. f5 Rb8 12. O-O-O Qa5 13. Bc4 Qb4 14. Bb3 c5 15. a3 Qb7 16. h4 Bd7 17. g5 c4 18. gxf6 cxb3 19. fxg7 Bxg7 20. f6 Bf8 21. Rd2 bxc2 22. Rxc2 Be6 23. Rd1 Rg8 24. Nd5 Bxd5 25. exd5 Qd7 26. Qe4 Rg4 27. Qh7 Rxh4 28. Qg8 Rg4 29. Qh8 Qf5 30. Bxh6 Kd7 31. Bxf8 Qg5+ 32. Kb1 Rg1 33. Rxg1 Qxg1+ 34. Ka2 Qd4 35. Qh3+ Kd8 36. Be7+ Ke8 37. Rc8+ Rxc8 38. Qxc8# 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    26: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e6 7. g4 h6 8. f4 Nc6 9. Qf3 e5 10. Nxc6 bxc6 11. f5 Rb8 12. O-O-O Qa5 13. Bc4 Qb4 14. Bb3 c5 15. a3 Qb7 16. h4 Bd7 17. g5 c4 18. gxf6 cxb3 19. fxg7 Bxg7 20. f6 Bf8 21. Rd2 bxc2 22. Rxc2 Be6 23. Rd1 Rg8 24. Nd5 Bxd5 25. exd5 Qd7 26. Qe4 Rg4 27. Qh7 Rxh4 28. Qg8 Rg4 29. Qh8 Qf5 30. Bxh6 Kd7 31. Bxf8 Qg5+ 32. Kb1 Rg1 33. Rxg1 Qxg1+ 34. Ka2 Qd4 35. Qh3+ Kd8 36. Be7+ Ke8 37. Rc8+ Rxc8 38. Qxc8# 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    27: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bc4 e6 7. Bb3 Be7 8. f4 O-O 9. Qf3 Qc7 10. O-O b5 11. f5 b4 12. Na4 e5 13. Ne2 Bb7 14. Ng3 Nbd7 15. Be3 Bc6 16. Bf2 Qb7 17. Rfe1 d5 18. exd5 Nxd5 19. Ne4 Nf4 20. c4 g6 21. fxg6 f5 22. g7 Kxg7 23. Qg3+ Kh8 24. Nec5 Nxc5 25. Nxc5 Qc7 26. Qe3 Bf6 27. Bg3 Nxg2 28. Bxe5 Qg7 29. Qg3 Nxe1 30. Rxe1 Bxe5 31. Rxe5 f4 32. Qxg7+ Kxg7 33. Ne6+ Kf6 34. Nxf8 Kxe5 35. Nxh7 Rg8+ 36. Kf1 Rg7 0-1`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    28: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e6 7. g4 h6 8. f4 Nc6 9. Qf3 e5 10. Nxc6 bxc6 11. f5 Rb8 12. O-O-O Qa5 13. Bc4 Qb4 14. Bb3 c5 15. a3 Qb7 16. h4 Bd7 17. g5 c4 18. gxf6 cxb3 19. fxg7 Bxg7 20. f6 Bf8 21. Rd2 bxc2 22. Rxc2 Be6 23. Rd1 Rg8 24. Nd5 Bxd5 25. exd5 Qd7 26. Qe4 Rg4 27. Qh7 Rxh4 28. Qg8 Rg4 29. Bxh6 Rxg8 30. Bxf8 Rxf8 31. Rc6 Rc8 32. Rxc8+ Qxc8+ 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    29: {
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O d3 8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 b5 12. Qxb5 Rb8 13. Qa4 Bb6 14. Nbd2 Bb7 15. Ne4 Qf5 16. Bxd3 Qh5 17. Nf6+ gxf6 18. exf6 Rg8 19. Rad1 Qxf3 20. Rxe7+ Nxe7 21. Qxd7+ Kxd7 22. Bf5+ Ke8 23. Bd7+ Kf8 24. Bxe7# 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    30: {
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7 11. Nbd2 Bb7 12. Bc2 Re8 13. Nf1 Bf8 14. Ng3 g6 15. b3 Bg7 16. d5 Rc8 17. Be3 c6 18. c4 cxd5 19. cxd5 Nc5 20. Qd2 h5 21. Rac1 Nh7 22. Bb1 h4 23. Ne2 f5 24. exf5 gxf5 25. Bxf5 Rc7 26. b4 Na4 27. Rxc7 Qxc7 28. Rc1 Qe7 29. Be6+ Kh8 30. Ng5 Bf6 31. Nf7+ Kg7 32. Bh6+ Kg6 33. Qd3+ 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    31: {
      pgn: `1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Nf6 5. Qd3 e5 6. dxe5 Qa5+ 7. Bd2 Qxe5 8. O-O-O Nxe4 9. Qd8+ Kxd8 10. Bg5+ Kc7 11. Bd8# 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    32: {
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 f5 4. d3 fxe4 5. dxe4 Nf6 6. O-O Bc5 7. Bxc6 bxc6 8. Nxe5 O-O 9. Nd3 Bb6 10. Nc3 d6 11. Bg5 Qe8 12. Bxf6 Rxf6 13. Kh1 Ba6 14. f4 Bd4 15. Qe1 Re6 16. f5 Bxc3 17. Qxc3 Rxe4 18. f6 gxf6 19. Rxf6 Bxd3 20. cxd3 Re5 21. Raf1 Qe7 22. d4 Re3 23. Qxc6 Re8 24. Qd5+ Kh8 25. h3 Re1 26. Qf3 Rxf1+ 27. Qxf1 Qe1 28. Rf8+ Kg7 29. Rf7+ Kg8 30. Rf8+ Kg7 31. Rf7+ Kg8 32. Rf8+ 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    33: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Qb6 8. Qd2 Qxb2 9. Rb1 Qa3 10. f5 Nc6 11. fxe6 fxe6 12. Nxc6 bxc6 13. e5 dxe5 14. Bxf6 gxf6 15. Ne4 Be7 16. Be2 h5 17. Rb3 Qa4 18. Nxf6+ Bxf6 19. c4 Bh4+ 20. g3 Be7 21. O-O 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    34: {
      pgn: `1. e4 e5 2. f4 exf4 3. Nf3 d6 4. Bc4 h6 5. d4 g5 6. O-O Bg7 7. c3 Nc6 8. g3 g4 9. Nh4 f3 10. Nd2 Bf6 11. Ndxf3 gxf3 12. Qxf3 Bh3 13. Bxf7+ Kxf7 14. Qh5+ Kf8 15. Ng6+ Kg7 16. Nxh8 Bxf1 17. Qf7+ Kxh8 18. Bxh6 Nxh6 19. Qg6 Bg7 20. Rxf1 Qe8 21. Rf7 Qxf7 22. Qxf7 Nxf7 23. Kf2 0-1`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    35: {
      pgn: `1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Bb7 5. Bg2 Be7 6. O-O O-O 7. d5 exd5 8. Nh4 c6 9. cxd5 Nxd5 10. Nf5 Nc7 11. e4 d5 12. exd5 Nxd5 13. Nc3 Nxc3 14. Qg4 Bf6 15. bxc3 Bc8 16. Nh6+ Kh8 17. Qh5 g6 18. Qf3 Kg7 19. Rd1 Qe7 20. Bf4 Be6 21. Bd6 Qd8 22. Bxf8+ Qxf8 23. Ng4 Be7 24. Qf4 Kg8 25. Re1 Nd7 26. Rad1 Nc5 27. Nh6+ Kh8 28. Bxc6 Rc8 29. Bd5 Bxd5 30. Rxd5 f6 31. Ng4 Qf7 32. Qd4 h5 33. Ne3 Kg7 34. Rd1 Re8 35. h4 Ne6 36. Qc4 Nc5 37. Ng2 Bf8 38. Nf4 Re4 39. Qf1 Be7 40. Rd7 Nxd7 41. Rxd7 Re5 42. Qd3 g5 43. hxg5 fxg5 44. Qd4 Qf5 45. Nd3 Kf6 46. Qxe5+ Qxe5 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    36: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Bc4 exd4 8. Qxd4 Nc6 9. Qb3 Na5 10. Bxf7+ Ke7 11. Nd5+ Kxf7 12. Qb6 Qe8 13. Nc7 Qxe4 14. O-O-O Nc4 15. Qb3 Be6 16. Nxe6 Kxe6 17. Rfe1 Kf7 18. Bg5 Qd5 19. Bxf6 gxf6 20. Rad1 Qc6 21. Rd4 b5 22. Qh3 Ne5 23. Qh5+ Ng6 24. Rde4 d5 25. Re6 Qxe6 26. Rxe6 Kxe6 27. Qh3+ f5 28. Qe3+ Kf7 29. Qb6 Be7 30. g3 Rhc8 31. c3 Ne5 32. Qh6 Bf6 33. Qxh7+ Ke6 34. Qb7 Rcb8 35. Qc7 Rc8 36. Qb6+ Rc6 37. Qb7 Rd8 38. f4 Rd7 39. Qb8 Nf3+ 40. Kf2 Nxh2 41. Qe8+ Be7 42. Qg6+ Bf6 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    37: {
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Nc3 d5 8. exd5 Nxd5 9. O-O Be6 10. Bg5 Be7 11. Bxd5 Bxd5 12. Nxd5 Qxd5 13. Bxe7 Nxe7 14. Re1 f6 15. Qe2 Qd7 16. Rac1 c6 17. d5 cxd5 18. Nd4 Kf7 19. Ne6 Rhc8 20. Qg4 g6 21. Ng5+ Ke8 22. Rxe7+ Kf8 23. Rf7+ Kg8 24. Rg7+ Kh8 25. Rxh7+ 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    38: {
      pgn: `1. f4 d5 2. e3 Nf6 3. b3 e6 4. Bb2 Be7 5. Bd3 b6 6. Nc3 Bb7 7. Nf3 Nbd7 8. O-O O-O 9. Ne2 c5 10. Ng3 Qc7 11. Ne5 Nxe5 12. Bxe5 Qc6 13. Qe2 a6 14. Nh5 Nxh5 15. Bxh7+ Kxh7 16. Qxh5+ Kg8 17. Bxg7 Kxg7 18. Qg4+ Kh7 19. Rf3 e5 20. Rh3+ Qh6 21. Rxh6+ Kxh6 22. Qd7 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    39: {
      pgn: `1. d4 e6 2. Nf3 f5 3. c4 Nf6 4. Bg5 Be7 5. Nc3 O-O 6. e3 b6 7. Bd3 Bb7 8. O-O Ne4 9. Bxe7 Qxe7 10. Bxe4 fxe4 11. Nd2 d5 12. f3 exf3 13. Rxf3 Nd7 14. Qe2 c5 15. Raf1 Nf6 16. Rf4 dxc4 17. Nxc4 Ba6 18. a4 Rad8 19. Nb5 Qd7 20. Ne5 Qd5 21. Qc2 Bb7 22. R1f2 a6 23. Nc3 Qd6 24. Rh4 cxd4 25. exd4 Rfe8 26. h3 Re7 27. Kh2 h6 28. Qg6 Kf8 29. Rg4 Rc7 30. Rxf6+ gxf6 31. Qxf6+ Ke8 32. Rg8+ Qf8 33. Rxf8# 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    40: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be2 Bg7 7. Be3 Nc6 8. Nb3 Be6 9. f4 O-O 10. g4 d5 11. f5 Bc8 12. exd5 Nb4 13. d6 Qxd6 14. Bc5 Qf4 15. Rf1 Qxh2 16. Bxb4 Nxg4 17. Bxg4 Qg3+ 18. Rf2 Qg1+ 19. Rf1 Qg3+ 20. Rf2 Qg1+ 1/2-1/2`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    41: {
      pgn: `1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 dxc4 5. a4 Bf5 6. Ne5 Nbd7 7. Nxc4 Qc7 8. g3 e5 9. dxe5 Nxe5 10. Bf4 Nfd7 11. Bg2 Be6 12. Nxe5 Nxe5 13. O-O Be7 14. Qc2 Rd8 15. Rfd1 O-O 16. Nb5 Rxd1+ 17. Rxd1 Qa5 18. Nd4 Bc8 19. b4 Qc7 20. b5 c5 21. Nf5 f6 22. Ne3 Be6 23. Bd5 Bxd5 24. Rxd5 Qa5 25. Nf5 Qe1+ 26. Kg2 Bd8 27. Bxe5 fxe5 28. Rd7 Bf6 29. Nh6+ Kh8 30. Qxc5 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    42: {
      pgn: `1. c4 e5 2. Nc3 Nf6 3. g3 d5 4. cxd5 Nxd5 5. Bg2 Be6 6. Nf3 Nc6 7. O-O Nb6 8. d3 Be7 9. a3 a5 10. Be3 O-O 11. Na4 Nxa4 12. Qxa4 Bd5 13. Rfc1 Re8 14. Rc2 Bf8 15. Rac1 Nb8 16. Rxc7 Bc6 17. R1xc6 bxc6 18. Rxf7 h6 19. Rb7 Qc8 20. Qc4+ Kh8 21. Nh4 Qxb7 22. Ng6+ Kh7 23. Be4 Bd6 24. Nxe5+ g6 25. Bxg6+ Kg7 26. Bxh6+ Kxh6 27. Qh4+ Kg7 28. Qh7+ Kf6 29. Ng4+ Ke6 30. Qxb7 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    43: {
      pgn: `1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. a3 Ba5 6. b4 cxd4 7. Qg4 Ne7 8. bxa5 dxc3 9. Qxg7 Rg8 10. Qxh7 Nd7 11. Nf3 Nf8 12. Qd3 Qxa5 13. h4 Bd7 14. Bg5 Rc8 15. Nd4 Nf5 16. Rb1 Rc4 17. Nxf5 exf5 18. Rxb7 Re4+ 19. Qxe4 dxe4 20. Rb8+ Bc8 21. Bb5+ Qxb5 22. Rxb5 Ne6 23. Bf6 Rxg2 24. h5 Ba6 25. h6 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    44: {
      pgn: `1. c4 Nf6 2. Nf3 g6 3. g3 Bg7 4. Bg2 O-O 5. d4 d6 6. Nc3 Nbd7 7. O-O e5 8. e4 c6 9. h3 Qb6 10. d5 cxd5 11. cxd5 Nc5 12. Ne1 Bd7 13. Nd3 Nxd3 14. Qxd3 Rfc8 15. Rb1 Nh5 16. Be3 Qb4 17. Qe2 Rc4 18. Rfc1 Rac8 19. Kh2 f5 20. exf5 Bxf5 21. Ra1 Nf4 22. gxf4 exf4 23. Bd2 Qxb2 24. Rab1 f3 25. Rxb2 fxe2 26. Rb3 Rd4 27. Be1 Be5+ 28. Kg1 Bf4 29. Nxe2 Rxc1 30. Nxd4 Rxe1+ 31. Bf1 Be4 32. Ne2 Be5 33. f4 Bf6 34. Rxb7 Bxd5 35. Rc7 Bxa2 36. Rxa7 Bc4 37. Ra8+ Kf7 38. Ra7+ Ke6 39. f5+ Kxf5 40. Ng3+ Kf4 41. Ra4 d5 42. Kf2 Bh4 43. Bxc4 Bxg3+ 44. Kg2 dxc4 45. Rxc4+ Re4 46. Rc7 h5 47. Rf7+ Kg5 0-1`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#2b3a4a',
      accentColor: '#fbbf24'
    },
    45: {
      pgn: `1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. Nf3 c5 7. O-O Nc6 8. a3 Bxc3 9. bxc3 b6 10. cxd5 exd5 11. Bb2 c4 12. Bc2 Bg4 13. Qe1 Ne4 14. Nd2 Nxd2 15. Qxd2 Bh5 16. f3 Bg6 17. e4 Qd7 18. Rae1 dxe4 19. fxe4 Rfe8 20. Qf4 b5 21. Bd1 Re7 22. Bg4 Qe8 23. e5 a5 24. Re3 Rd8 25. Rfe1 Re6 26. a4 Ne7 27. Bxe6 fxe6 28. Qf1 Nd5 29. Rf3 Bd3 30. Rxd3 cxd3 31. Qxd3 b4 32. cxb4 axb4 33. a5 Ra8 34. Ra1 Qc6 35. Bc1 Qc3 36. Qxc3 bxc3 37. Kf2 Kf7 38. Ke2 Ke7 39. Kd3 Kd7 40. Kc4 Kc6 41. a6 Kb6 1/2-1/2`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    46: {
      pgn: `1. e4 e5 2. f4 exf4 3. Nf3 d5 4. exd5 Bd6 5. Nc3 Ne7 6. d4 O-O 7. Bd3 Nd7 8. O-O h6 9. Ne4 Nxd5 10. c4 Ne3 11. Bxe3 fxe3 12. c5 Be7 13. Bc2 Re8 14. Qd3 e2 15. Nd6 Nf8 16. Nxf7 exf1=Q+ 17. Rxf1 Bf5 18. Qxf5 Qd7 19. Qf4 Bf6 20. N3e5 Qe7 21. Bb3 Bxe5 22. Nxe5+ Kh8 23. Qe4 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    47: {
      pgn: `1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 41. Kc1 Rc2# 0-1`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#eae9e4',
      darkColor: '#4b5563',
      accentColor: '#fbbf24'
    },
    48: {
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Na5 10. Bc2 c5 11. d4 Qc7 12. Nbd2 Nc6 13. d5 Nd8 14. a4 Rb8 15. axb5 axb5 16. b4 Nb7 17. Nf1 Bd7 18. Bd2 Ra8 19. Qe2 c4 20. Ng3 g6 21. Nh2 Rfb8 22. f4 exf4 23. Bxf4 Be8 24. Nf3 Nd7 25. Qd2 Bf6 26. e5 dxe5 27. Ne4 Bg7 28. Bh6 Nd6 29. Bxg7 Kxg7 30. Nxd6 Qxd6 31. Rad1 f6 32. Nh2 Nb6 33. Ng4 Bd7 34. Qh6+ Kg8 35. Bxg6 hxg6 36. Qxg6+ Kf8 37. Nxf6 Ke7 38. Qg7+ Kd8 39. Ne4 Qe7 40. Qh8+ Qe8 41. Qh4+ Kc7 42. d6+ Kc6 43. Nf6 Qd8 44. Qe4# 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    49: {
      pgn: `1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1 d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8 Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7 1-0`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    50: {
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4 5. d4 Nd6 6. Bxc6 dxc6 7. dxe5 Nf5 8. Qxd8+ Kxd8 9. Nc3 h6 10. b3 Ke8 11. Bb2 Be6 12. h3 Be7 13. Rad1 Rd8 14. Ne2 c5 15. c4 g5 16. Nc3 c6 17. Ne4 b6 18. g4 Ng7 19. Rfe1 Rxd1 20. Rxd1 Kf8 21. Kg2 Ne8 22. Kg3 Rg8 23. Nf6 Rh8 24. Nd7+ Kg7 25. Nb8 h5 1/2-1/2`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    51: {
      pgn: `1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bd6 9. O-O O-O 10. Qc2 Bb7 11. a3 Rc8 12. Ng5 c5 13. Nxh7 Ng4 14. f4 cxd4 15. exd4 Bc5 16. Be2 Nde5 17. Bxg4 Bxd4+ 18. Kh1 Nxg4 19. Nxf8 f5 20. h3 Qh4 21. Qd3 Be3 22. Bxe3 Qxh3+ 23. Kg1 Qxg2#`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    52: {
      pgn: `1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. f3 e5 6. Nb3 Be7 7. c4 a5 8. Be3 a4 9. Nc1 O-O 10. Nc3 Qa5 11. Qd2 Na6 12. Be2 Nc5 13. O-O Bd7 14. Rb1 Rfc8 15. b4 axb3 16. axb3 Qd8 17. Nd3 Ne6 18. Nb4 Bc6 19. Rfd1 h5 20. Bf1 h4 21. Qf2 Nd7 22. g3 Ra3 23. Bh3 Rca8 24. Nc2 R3a6 25. Nb4 Ra5 26. Nc2 b6 27. Rd2 Qc7 28. Rbd1 Bf8 29. gxh4 Nf4 30. Bxf4 exf4 31. Bxd7 Qxd7 32. Nb4 Ra3 33. Nxc6 Qxc6 34. Nb5 Rxb3 35. Nd4 Qxc4 36. Nxb3 Qxb3 37. Qe2 Be7 38. Kg2 Qe6 39. h5 Ra3 40. Rd3 Ra2 41. R3d2 Ra3 42. Rd3 Ra7 43. Rd5 Rc7 44. Qd2 Qf6 45. Rf5 Qh4 46. Rc1 Ra7 47. Qxf4 Ra2+ 48. Kh1 Qf2 49. Rc8+ Kh7 50. Qh6+ gxh6 51. Rxf7#`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    53: {
      pgn: `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. d3 b5 7. Bb3 d6 8. a4 Bd7 9. h3 O-O 10. Be3 Na5 11. Ba2 bxa4 12. Nc3 Rb8 13. Bb1 Qe8 14. b3 c5 15. Nxa4 Nc6 16. Nc3 a5 17. Nd2 Be6 18. Nc4 d5 19. exd5 Nxd5 20. Bd2 Nxc3 21. Bxc3 Bxc4 22. bxc4 Bd8 23. Bd2 Bc7 24. c3 f5 25. Re1 Rd8 26. Ra2 Qg6 27. Qe2 Qd6 28. g3 Rde8 29. Qf3 e4 30. dxe4 Ne5 31. Qg2 Nd3 32. Bxd3 Qxd3 33. exf5 Rxe1+ 34. Bxe1 Qxc4 35. Ra1 Rxf5 36. Bd2 h6 37. Qc6 Rf7 38. Re1 Kh7 39. Be3 Be5 40. Qe8 Bxc3 41. Rc1 Rf6 42. Qd7 Qe2 43. Qd5 Bb4 44. Qe4+ Kg8 45. Qd5+ Kh7 46. Qe4+ Rg6 47. Qf5 c4 48. h4 Qd3 49. Qf3 Rf6 50. Qg4 c3 51. Rd1 Qg6 52. Qc8 Rc6 53. Qa8 Rd6 54. Rxd6 Qxd6 55. Qe4+ Qg6 56. Qc4 Qb1+ 57. Kh2 a4 58. Bd4 a3 59. Qc7 Qg6 60. Qc4 c2 61. Be3 Bd6 62. Kg2 h5 63. Kf1 Be5 64. g4 hxg4 65. h5 Qf5 66. Qd5 g3 67. f4 a2 68. Qxa2 Bxf4 0-1`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#dfd0b8',
      darkColor: '#3c5c4e',
      accentColor: '#fbbf24'
    },
    54: {
      pgn: `1. Nf3 d5 2. g3 c5 3. Bg2 Nc6 4. d4 e6 5. O-O cxd4 6. Nxd4 Nge7 7. c4 Nxd4 8. Qxd4 Nc6 9. Qd1 d4 10. e3 Bc5 11. exd4 Bxd4 12. Nc3 O-O 13. Nb5 Bb6 14. b3 a6 15. Nc3 Bd4 16. Bb2 e5 17. Qd2 Be6 18. Nd5 b5 19. cxb5 axb5 20. Nf4 exf4 21. Bxc6 Bxb2 22. Qxb2 Rb8 23. Rfd1 Qb6 24. Bf3 fxg3 25. hxg3 b4 26. Rd4 Rfd8 27. Rad1 Rxd4 28. Rxd4 h6 29. Qd2 Qc7 30. Kg2 g5 31. Rd6 Qc3 32. Rd3 Qxd2 33. Rxd2 Kg7 34. Be4 Kf6 35. f4 Rc8 36. Kf2 Rc3 37. Rd4 Rc5 38. Rxb4 Ra5 39. Bb1 g4 40. Rd4 h5 41. Rd2 Rc5 42. b4 Rc3 43. Be4 Ra3 44. b5 Bxa2 45. b6 Be6 46. Rb2 Rb3 47. Rxb3 Bxb3 48. Ke3 Ke7 49. Kd4 Kd6 50. b7 Kc7 51. Ke5 Be6 52. Kf6 Bb3 53. Kg5 Ba2 54. Kxh5 Be6 55. f5 Bc4 56. Kxg4 f6 57. Kh5 Bf7+ 58. Kh6 0-1`,
      startFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      lightColor: '#fef3c7',
      darkColor: '#0f766e',
      accentColor: '#f59e0b'
    }
  };

  // --- REPLAYER CLASS ---
  class ChessReplayer {
    constructor(container, storyId) {
      this.container = container;
      this.storyId = storyId;
      this.config = STORY_GAMES[storyId];
      if (!this.config) {
        console.error(`No game config found for story ID: ${storyId}`);
        return;
      }

      this.currentStep = 0;
      this.isPlaying = false;
      this.playInterval = null;
      this.autoPlaySpeed = 1500; // ms

      this.init();
    }

    init() {
      // 1. Parse PGN using ChessEngine
      try {
        this.history = ChessEngine.playPGN(this.config.pgn, this.config.startFen);
      } catch (err) {
        console.error("Error processing PGN moves:", err);
        this.history = [{ fen: this.config.startFen, uci: '', san: 'Error de carga' }];
      }

      // 2. Generate DOM structure
      this.container.innerHTML = `
        <div class="chess-replayer">
          <div class="replayer-main">
            <div class="replayer-board-wrapper" tabindex="0">
              <div id="replayer-board-${this.storyId}" class="replayer-board"></div>
            </div>
            
            <div class="replayer-sidebar">
              <div class="replayer-game-info">
                <span class="replayer-move-indicator">Jugada 0</span>
                <span class="replayer-active-move">Posición Inicial</span>
              </div>
              
              <div class="replayer-moves-list" id="replayer-moves-${this.storyId}"></div>
              
              <div class="replayer-controls">
                <button class="replayer-btn btn-first" title="Ir al inicio" aria-label="Inicio">⏮</button>
                <button class="replayer-btn btn-prev" title="Jugada anterior" aria-label="Anterior">◀</button>
                <button class="replayer-btn btn-play" title="Auto-reproducir" aria-label="Reproducir">▶</button>
                <button class="replayer-btn btn-next" title="Siguiente jugada" aria-label="Siguiente">▶</button>
                <button class="replayer-btn btn-last" title="Ir al final" aria-label="Final">⏭</button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Make next button mirror a single step forwards, while btn-play handles loop
      const btnNext = this.container.querySelector('.btn-next');
      if (btnNext) btnNext.innerHTML = '👉'; // Visual differentiation for simple step

      // 3. Initialize Shared ChessBoard
      this.board = new ChessBoard({
        containerId: `replayer-board-${this.storyId}`,
        squareClass: 'chess-sq',
        pieceClass: 'chess-pc',
        lightColor: this.config.lightColor,
        darkColor: this.config.darkColor,
        playerColor: 'w'
      });

      // 4. Generate Moves List DOM
      this.generateMovesList();

      // 5. Bind Event Handlers
      this.bindEvents();

      // 6. Draw Initial Position
      this.goToStep(0);
    }

    generateMovesList() {
      const movesContainer = this.container.querySelector(`.replayer-moves-list`);
      if (!movesContainer) return;
      movesContainer.innerHTML = '';

      // Skip the initial step (index 0)
      for (let i = 1; i < this.history.length; i += 2) {
        const moveNum = Math.ceil(i / 2);
        
        const row = document.createElement('div');
        row.className = 'replayer-move-row';
        row.innerHTML = `<span class="replayer-move-num">${moveNum}.</span>`;

        // White move span
        const wMove = document.createElement('span');
        wMove.className = 'replayer-move-item';
        wMove.textContent = this.history[i].san;
        wMove.setAttribute('data-step', i);
        wMove.addEventListener('click', () => {
          this.pause();
          this.goToStep(i);
        });
        row.appendChild(wMove);

        // Black move span (if exists)
        if (i + 1 < this.history.length) {
          const bMove = document.createElement('span');
          bMove.className = 'replayer-move-item';
          bMove.textContent = this.history[i + 1].san;
          bMove.setAttribute('data-step', i + 1);
          bMove.addEventListener('click', () => {
            this.pause();
            this.goToStep(i + 1);
          });
          row.appendChild(bMove);
        }

        movesContainer.appendChild(row);
      }
    }

    bindEvents() {
      const btnFirst = this.container.querySelector('.btn-first');
      const btnPrev = this.container.querySelector('.btn-prev');
      const btnPlay = this.container.querySelector('.btn-play');
      const btnNext = this.container.querySelector('.btn-next');
      const btnLast = this.container.querySelector('.btn-last');
      const boardWrapper = this.container.querySelector('.replayer-board-wrapper');

      btnFirst.addEventListener('click', () => { this.pause(); this.goToStep(0); });
      btnPrev.addEventListener('click', () => { this.pause(); this.prevStep(); });
      btnPlay.addEventListener('click', () => { this.togglePlay(); });
      btnNext.addEventListener('click', () => { this.pause(); this.nextStep(); });
      btnLast.addEventListener('click', () => { this.pause(); this.goToStep(this.history.length - 1); });

      // Keyboard support
      if (boardWrapper) {
        boardWrapper.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.pause();
            this.nextStep();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.pause();
            this.prevStep();
          } else if (e.key === ' ') {
            e.preventDefault();
            this.togglePlay();
          }
        });
      }
    }

    goToStep(idx) {
      if (idx < 0 || idx >= this.history.length) return;
      this.currentStep = idx;

      const step = this.history[idx];

      // Draw the board position
      this.board.render(step.fen);

      // Apply last move highlights
      if (idx > 0 && step.uci) {
        const from = step.uci.substring(0, 2);
        const to = step.uci.substring(2, 4);
        this.board.setLastMove(from, to, this.config.accentColor);
        // re-render immediately to show the highlights
        this.board.render(step.fen);
      } else {
        this.board._lastMove = null;
        this.board.clearHighlights();
        this.board.render(step.fen);
      }

      // Update indicator text
      const ind = this.container.querySelector('.replayer-move-indicator');
      const act = this.container.querySelector('.replayer-active-move');
      if (ind) {
        if (idx === 0) {
          ind.textContent = 'Posición Inicial';
        } else {
          const moveNum = Math.ceil(idx / 2);
          const colorName = (idx % 2 === 1) ? 'Blancas' : 'Negras';
          ind.textContent = `Jugada ${moveNum} (${colorName})`;
        }
      }
      if (act) {
        act.textContent = step.san;
      }

      // Update visual moves list highlights
      const allItems = this.container.querySelectorAll('.replayer-move-item');
      allItems.forEach(el => el.classList.remove('active'));

      if (idx > 0) {
        const activeEl = this.container.querySelector(`.replayer-move-item[data-step="${idx}"]`);
        if (activeEl) {
          activeEl.classList.add('active');
          // Auto-scroll list to active element
          activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }

    nextStep() {
      if (this.currentStep < this.history.length - 1) {
        this.goToStep(this.currentStep + 1);
        return true;
      } else {
        this.pause();
        return false;
      }
    }

    prevStep() {
      if (this.currentStep > 0) {
        this.goToStep(this.currentStep - 1);
      }
    }

    togglePlay() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }

    play() {
      if (this.isPlaying) return;
      
      // If we are at the end, restart from step 0
      if (this.currentStep >= this.history.length - 1) {
        this.goToStep(0);
      }

      this.isPlaying = true;
      const btnPlay = this.container.querySelector('.btn-play');
      if (btnPlay) {
        btnPlay.innerHTML = '⏸';
        btnPlay.classList.add('playing');
      }

      this.playInterval = setInterval(() => {
        const hasNext = this.nextStep();
        if (!hasNext) {
          this.pause();
        }
      }, this.autoPlaySpeed);
    }

    pause() {
      if (!this.isPlaying) return;
      this.isPlaying = false;
      if (this.playInterval) {
        clearInterval(this.playInterval);
        this.playInterval = null;
      }

      const btnPlay = this.container.querySelector('.btn-play');
      if (btnPlay) {
        btnPlay.innerHTML = '▶';
        btnPlay.classList.remove('playing');
      }
    }
  }

  // --- DYNAMIC REPLAYER (PGN arbitrario para el Tutor IA) ---
  // Reutiliza toda la lógica de ChessReplayer pero sin STORY_GAMES.
  // Uso:
  //   const r = ChessReplayer.fromPGN(containerEl, {
  //     pgn: '1. e4 e5 2. Nf3 ...',
  //     startFen: '',           // vacío = posición inicial
  //     lightColor: '#dfd0b8',
  //     darkColor: '#3c5c4e',
  //     accentColor: '#fbbf24'
  //   });
  // Devuelve instancia o null si el PGN no es válido.
  ChessReplayer.fromPGN = function(container, opts) {
    opts = opts || {};
    const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const pgn = (opts.pgn || '').trim();
    const startFen = (opts.startFen || '').trim() || DEFAULT_FEN;

    if (!pgn) return null;

    // Validar el PGN con el motor:parsear SANs y comprobar que todas las jugadas se convierten.
    let history;
    try {
      const sans = ChessEngine.pgnToMoves(pgn);
      if (sans.length === 0) return null;
      let fen = startFen;
      history = [{ fen, uci: '', san: 'Posición Inicial' }];
      for (const san of sans) {
        const uci = ChessEngine.sanToUCI(fen, san);
        if (!uci) return null; // jugada ilegal => PGN inválido
        fen = ChessEngine.executeMoveRaw(fen, uci);
        history.push({ fen, uci, san });
      }
    } catch (err) {
      console.warn('DynamicReplayer: PGN inválido', err);
      return null;
    }

    // Construir una instancia "ligera" reutilizando el prototipo de ChessReplayer
    // sin pasar por STORY_GAMES[id].
    const config = {
      pgn,
      startFen,
      lightColor: opts.lightColor || '#dfd0b8',
      darkColor: opts.darkColor || '#3c5c4e',
      accentColor: opts.accentColor || '#fbbf24'
    };

    const inst = Object.create(ChessReplayer.prototype);
    inst.container = container;
    inst.storyId = '__dynamic__';
    inst.config = config;
    inst.currentStep = 0;
    inst.isPlaying = false;
    inst.playInterval = null;
    inst.autoPlaySpeed = 1500;
    // Inyectar la historia validada para que init() no la reparsing
    inst._validatedHistory = history;

    //_override temporal de init para que use _validatedHistory
    const origInit = inst.init;
    inst.init = function() {
      this.history = this._validatedHistory;
      this.buildDOM();
      this.board = new ChessBoard({
        containerId: `replayer-board-${this._uid}`,
        squareClass: 'chess-sq',
        pieceClass: 'chess-pc',
        lightColor: this.config.lightColor,
        darkColor: this.config.darkColor,
        playerColor: 'w'
      });
      this.generateMovesList();
      this.bindEvents();
      this.goToStep(0);
    };

    inst._uid = 'dyn_' + Math.random().toString(36).slice(2, 9);
    // Reescribir buildDOM con id único
    inst.buildDOM = function() {
      this.container.innerHTML = `
        <div class="chess-replayer">
          <div class="replayer-main">
            <div class="replayer-board-wrapper" tabindex="0">
              <div id="replayer-board-${this._uid}" class="replayer-board"></div>
            </div>
            <div class="replayer-sidebar">
              <div class="replayer-game-info">
                <span class="replayer-move-indicator">Jugada 0</span>
                <span class="replayer-active-move">Posición Inicial</span>
              </div>
              <div class="replayer-moves-list" id="replayer-moves-${this._uid}"></div>
              <div class="replayer-controls">
                <button class="replayer-btn btn-first" title="Ir al inicio" aria-label="Inicio">⏮</button>
                <button class="replayer-btn btn-prev" title="Jugada anterior" aria-label="Anterior">◀</button>
                <button class="replayer-btn btn-play" title="Auto-reproducir" aria-label="Reproducir">▶</button>
                <button class="replayer-btn btn-next" title="Siguiente jugada" aria-label="Siguiente">▶</button>
                <button class="replayer-btn btn-last" title="Ir al final" aria-label="Final">⏭</button>
              </div>
            </div>
          </div>
        </div>
      `;
      const btnNext = this.container.querySelector('.btn-next');
      if (btnNext) btnNext.innerHTML = '👉';
    };

    inst.init();
    return inst;
  };

  // --- AUTO INITIALIZE ON PAGE LOAD ---
  function initAllReplayers() {
    const containers = document.querySelectorAll('.chess-replayer-container');
    containers.forEach(container => {
      const storyIdStr = container.getAttribute('data-story-id');
      const storyId = parseInt(storyIdStr, 10);
      if (storyId) {
        new ChessReplayer(container, storyId);
      }
    });

    // Add explicit smooth scroll handler for "Ver partida" header links
    const jumpLinks = document.querySelectorAll('.jump-to-game');
    jumpLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector('.chess-replayer-container');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllReplayers);
  } else {
    initAllReplayers();
  }

  // Expose globally
  window.ChessReplayer = ChessReplayer;
})();
