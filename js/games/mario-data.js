// === MARIO DATA — Level definitions for Super Martina: El Salto Mágico ===
// Each level has its own biome, platform layout, enemies, coins, and goal.

window.MartinaLevels = {

  // Max possible score per level index (coins + burst + enemies + crowns)
  maxScore: {
    0: 9900,
    1: 9900,
    2: 9900,
    3: 9900
  },

  levels: [
    // ================================================================
    // LEVEL 1 — "El Primer Movimiento" — Grass / Magical Realm
    // ================================================================
    {
      biome: 'grass',
      worldWidth: 2400,
      backgroundColor: '#5c94fc',

      platformsData: [
        { x: 0, y: 410, w: 800, h: 40 },
        { x: 980, y: 410, w: 750, h: 40 },
        { x: 1850, y: 410, w: 600, h: 40 },  // marble finish
        { x: 260, y: 310, w: 140, h: 20 },
        { x: 460, y: 220, w: 100, h: 20 },
        { x: 640, y: 300, w: 120, h: 20 },
        { x: 830, y: 310, w: 120, h: 20 },
        { x: 1080, y: 310, w: 160, h: 20 },
        { x: 1320, y: 220, w: 120, h: 20 },
        { x: 1540, y: 310, w: 100, h: 20 },
        { x: 1730, y: 310, w: 120, h: 20 }
      ],

      coinsData: [
        { x: 300, y: 260 }, { x: 330, y: 260 }, { x: 360, y: 260 },
        { x: 510, y: 170 },
        { x: 680, y: 250 }, { x: 710, y: 250 },
        { x: 860, y: 260 },
        { x: 1120, y: 260 }, { x: 1150, y: 260 },
        { x: 1380, y: 170 },
        { x: 1590, y: 260 },
        { x: 1750, y: 260 }, { x: 1790, y: 260 },
        { x: 220, y: 370 }, { x: 250, y: 370 }, { x: 280, y: 370 },
        { x: 380, y: 370 }, { x: 410, y: 370 }, { x: 440, y: 370 },
        { x: 580, y: 370 }, { x: 610, y: 370 }, { x: 640, y: 370 },
        { x: 1060, y: 370 }, { x: 1090, y: 370 }, { x: 1120, y: 370 },
        { x: 1200, y: 370 }, { x: 1230, y: 370 }, { x: 1260, y: 370 },
        { x: 1460, y: 370 }, { x: 1490, y: 370 }, { x: 1520, y: 370 },
        { x: 1960, y: 360 }, { x: 2010, y: 360 }, { x: 2060, y: 360 }
      ],

      enemiesData: [
        { x: 380, y: 360, left: 180, right: 600, speed: 70 },
        { x: 650, y: 360, left: 450, right: 750, speed: 60 },
        { x: 1200, y: 360, left: 1020, right: 1500, speed: 80 },
        { x: 1520, y: 360, left: 1350, right: 1680, speed: 70 },
        { x: 1950, y: 360, left: 1880, right: 2120, speed: 90 }
      ],

      airEnemiesData: [
        { x: 500, y: 140, pattern: 'horizontal', minX: 400, maxX: 640, speed: 75 },
        { x: 910, y: 220, pattern: 'diagonal', minX: 830, maxX: 980, minY: 160, maxY: 260, speed: 70, speedY: 55 },
        { x: 1790, y: 200, pattern: 'sinusoidal', minX: 1700, maxX: 1880, baseY: 190, ampY: 45, speed: 80 }
      ],

      crownsData: [
        { x: 890, y: 180 },
        { x: 1380, y: 110 },
        { x: 1790, y: 180 }
      ],

      // Goal configuration
      goal: {
        type: 'portal_queen',  // Portal + White Queen
        portalX: 2150, portalY: 245
      }
    },

    // ================================================================
    // LEVEL 2 — "Tic, Tac, Jaque Mate" — Clockwork / Real World
    // ================================================================
    {
      biome: 'clockwork',
      worldWidth: 2400,
      backgroundColor: '#1a1520',

      platformsData: [
        // Ground — mechanical brass platforms
        { x: 0, y: 410, w: 650, h: 40 },
        { x: 820, y: 410, w: 580, h: 40 },
        { x: 1580, y: 410, w: 820, h: 40 },  // marble/trophy runway

        // Clock-gear floating platforms — vertical tiered design
        { x: 200, y: 310, w: 110, h: 20 },
        { x: 440, y: 240, w: 80, h: 20 },
        { x: 620, y: 320, w: 100, h: 20 },

        // Over first pit — mechanical bridge
        { x: 740, y: 310, w: 100, h: 20 },

        // Mid-level gear cluster (more vertical)
        { x: 980, y: 310, w: 140, h: 20 },
        { x: 1150, y: 220, w: 100, h: 20 },
        { x: 1320, y: 310, w: 120, h: 20 },
        { x: 1480, y: 240, w: 80, h: 20 },

        // Over second pit
        { x: 1560, y: 310, w: 80, h: 20 },

        // Final approach — symmetrical gear arrangement
        { x: 1800, y: 300, w: 120, h: 20 },
        { x: 1980, y: 240, w: 90, h: 20 },
        { x: 2150, y: 310, w: 100, h: 20 }
      ],

      coinsData: [
        // Starting area — gear circle pattern
        { x: 180, y: 260 }, { x: 210, y: 250 }, { x: 240, y: 260 },
        { x: 480, y: 190 },
        { x: 660, y: 270 }, { x: 690, y: 270 },

        // Mid-section — clock numeral positions
        { x: 1020, y: 260 }, { x: 1060, y: 250 }, { x: 1100, y: 260 },
        { x: 1200, y: 170 },
        { x: 1360, y: 260 }, { x: 1400, y: 260 },

        // Ground coins — gear teeth pattern
        { x: 180, y: 370 }, { x: 220, y: 370 }, { x: 260, y: 370 },
        { x: 340, y: 370 }, { x: 380, y: 370 }, { x: 420, y: 370 },
        { x: 500, y: 370 }, { x: 540, y: 370 }, { x: 580, y: 370 },

        { x: 900, y: 370 }, { x: 940, y: 370 }, { x: 980, y: 370 },
        { x: 1100, y: 370 }, { x: 1140, y: 370 }, { x: 1180, y: 370 },
        { x: 1260, y: 370 }, { x: 1300, y: 370 },

        { x: 1680, y: 370 }, { x: 1720, y: 370 }, { x: 1760, y: 370 },
        { x: 1880, y: 370 }, { x: 1920, y: 370 },

        // Trophy approach
        { x: 2060, y: 360 }, { x: 2110, y: 360 }, { x: 2160, y: 360 }
      ],

      enemiesData: [
        // Faster hedgehog pawns (Tomás style!)
        { x: 320, y: 360, left: 100, right: 520, speed: 100 },
        { x: 600, y: 360, left: 480, right: 650, speed: 90 },
        { x: 1050, y: 360, left: 850, right: 1300, speed: 110 },
        { x: 1420, y: 360, left: 1250, right: 1550, speed: 95 },
        { x: 1850, y: 360, left: 1620, right: 2150, speed: 105 }
      ],

      airEnemiesData: [
        // Flying clock hands
        { x: 480, y: 150, pattern: 'horizontal', minX: 380, maxX: 620, speed: 90 },
        { x: 1100, y: 150, pattern: 'diagonal', minX: 950, maxX: 1250, minY: 100, maxY: 210, speed: 80, speedY: 60 },
        { x: 1800, y: 180, pattern: 'sinusoidal', minX: 1680, maxX: 1950, baseY: 170, ampY: 50, speed: 85 }
      ],

      crownsData: [
        { x: 780, y: 180 },
        { x: 1200, y: 100 },
        { x: 2000, y: 150 }
      ],

      // Goal: Tournament trophy instead of portal
      goal: {
        type: 'trophy',
        trophyX: 2180, trophyY: 270
      },

      // Rotating clockwork gear platforms (unique level 2 mechanic)
      gearData: [
        {
          centerX: 600, centerY: 280,
          radius: 76,
          numTeeth: 8,
          speed: 0.55,
          hazardIndices: [2, 6]
        },
        {
          centerX: 1850, centerY: 280,
          radius: 85,
          numTeeth: 10,
          speed: 0.72,
          hazardIndices: [1, 4, 7]
        }
      ]
    },

    // ================================================================
    // LEVEL 3 — "La Clavada del Alfil Exiliado" — Neon Diagonal
    // ================================================================
    {
      biome: 'neon',
      worldWidth: 2600,
      backgroundColor: '#0a0020',

      platformsData: [
        // Ground — neon-edged platforms
        { x: 0, y: 410, w: 650, h: 40 },
        { x: 800, y: 410, w: 550, h: 40 },
        { x: 1500, y: 410, w: 600, h: 40 },  // extends to boss room
        // Boss room floor — spans to goal
        { x: 2100, y: 410, w: 500, h: 40 },

        // Floating neon platforms — diagonal arrangement
        { x: 200, y: 320, w: 110, h: 18 },
        { x: 440, y: 230, w: 90, h: 18 },
        { x: 640, y: 320, w: 100, h: 18 },
        { x: 880, y: 290, w: 120, h: 18 },
        { x: 1080, y: 220, w: 100, h: 18 },
        { x: 1280, y: 310, w: 110, h: 18 },
        { x: 1450, y: 250, w: 80, h: 18 },
        { x: 1620, y: 310, w: 100, h: 18 },
        { x: 1780, y: 270, w: 80, h: 18 },
        { x: 1920, y: 310, w: 100, h: 18 },
        // Inside boss room — small platforms
        { x: 2150, y: 290, w: 75, h: 18 },
        { x: 2320, y: 300, w: 70, h: 18 },
        { x: 2450, y: 280, w: 80, h: 18 }
      ],

      coinsData: [
        { x: 230, y: 270 }, { x: 260, y: 270 }, { x: 290, y: 270 },
        { x: 500, y: 180 },
        { x: 690, y: 270 }, { x: 720, y: 270 },
        { x: 920, y: 240 }, { x: 950, y: 240 },
        { x: 1120, y: 170 },
        { x: 1320, y: 260 }, { x: 1350, y: 260 },
        { x: 1500, y: 200 },
        { x: 1660, y: 260 }, { x: 1690, y: 260 },
        { x: 1830, y: 220 },
        // Ground coins
        { x: 180, y: 370 }, { x: 220, y: 370 }, { x: 260, y: 370 },
        { x: 360, y: 370 }, { x: 400, y: 370 },
        { x: 540, y: 370 }, { x: 580, y: 370 },
        { x: 880, y: 370 }, { x: 920, y: 370 }, { x: 960, y: 370 },
        { x: 1100, y: 370 }, { x: 1140, y: 370 },
        { x: 1280, y: 370 }, { x: 1320, y: 370 },
        { x: 1600, y: 370 }, { x: 1640, y: 370 }, { x: 1680, y: 370 },
        { x: 1800, y: 370 }, { x: 1840, y: 370 },
        // Boss room coins
        { x: 2180, y: 370 }, { x: 2220, y: 370 },
        { x: 2360, y: 370 }, { x: 2400, y: 370 },
        // Goal approach
        { x: 2520, y: 360 }, { x: 2540, y: 360 }
      ],

      enemiesData: [
        { x: 340, y: 360, left: 120, right: 520, speed: 75 },
        { x: 600, y: 360, left: 480, right: 650, speed: 65 },
        { x: 1050, y: 360, left: 840, right: 1300, speed: 85 },
        { x: 1450, y: 360, left: 1320, right: 1600, speed: 70 },
        { x: 1750, y: 360, left: 1620, right: 1920, speed: 80 }
      ],

      airEnemiesData: [
        { x: 460, y: 150, pattern: 'horizontal', minX: 360, maxX: 600, speed: 80 },
        { x: 1100, y: 140, pattern: 'diagonal', minX: 980, maxX: 1280, minY: 100, maxY: 200, speed: 75, speedY: 50 },
        { x: 1650, y: 160, pattern: 'sinusoidal', minX: 1550, maxX: 1780, baseY: 160, ampY: 40, speed: 80 }
      ],

      crownsData: [
        { x: 910, y: 170 },
        { x: 1120, y: 100 },
        { x: 2200, y: 200 }
      ],

      // Pin rays — diagonal hazard beams (stun on contact)
      pinRaysData: [
        { x: 380, y: 80, angle: 45, length: 280, pulseSpeed: 0.03 },
        { x: 700, y: 100, angle: -45, length: 300, pulseSpeed: 0.04 },
        { x: 1200, y: 70, angle: 45, length: 320, pulseSpeed: 0.035 },
        { x: 1600, y: 90, angle: -45, length: 260, pulseSpeed: 0.045 }
      ],

      // Boss: Alfil Exiliado
      bossData: {
        type: 'alfil_exiliado',
        hp: 3,
        roomLeft: 2080,
        roomRight: 2510,
        x: 2300, y: 280,
        speed: 65,
        projectileSpeed: 220,
        projectileInterval: 90  // frames between shots
      },

      // Goal after defeating boss
      goal: {
        type: 'neon_portal',
        portalX: 2550, portalY: 245
      }
    },

    // ================================================================
    // LEVEL 4 — "El Caballo Salvaje" — Prairie / Stable
    // ================================================================
    {
      biome: 'prairie',
      worldWidth: 2400,
      backgroundColor: '#87CEEB',

      platformsData: [
        // Ground — dirt & grass
        { x: 0, y: 410, w: 700, h: 40 },
        { x: 850, y: 410, w: 600, h: 40 },
        { x: 1600, y: 410, w: 500, h: 40 },
        // Chess room floor
        { x: 2150, y: 410, w: 250, h: 40 },

        // Floating wooden platforms — L-shaped knight jump arrangements
        { x: 200, y: 300, w: 100, h: 16 },
        { x: 400, y: 220, w: 90, h: 16 },
        { x: 620, y: 310, w: 100, h: 16 },
        { x: 860, y: 290, w: 110, h: 16 },
        { x: 1050, y: 210, w: 90, h: 16 },
        { x: 1250, y: 300, w: 100, h: 16 },
        { x: 1450, y: 240, w: 80, h: 16 },
        { x: 1650, y: 300, w: 100, h: 16 },
        { x: 1820, y: 250, w: 80, h: 16 },
        { x: 1970, y: 310, w: 100, h: 16 }
      ],

      coinsData: [
        { x: 230, y: 250 }, { x: 260, y: 250 }, { x: 290, y: 250 },
        { x: 450, y: 170 },
        { x: 660, y: 260 }, { x: 690, y: 260 },
        { x: 900, y: 240 }, { x: 930, y: 240 },
        { x: 1090, y: 160 },
        { x: 1290, y: 250 }, { x: 1320, y: 250 },
        { x: 1500, y: 190 },
        { x: 1690, y: 250 }, { x: 1720, y: 250 },
        { x: 1870, y: 200 },
        // Ground coins
        { x: 180, y: 370 }, { x: 220, y: 370 }, { x: 260, y: 370 },
        { x: 380, y: 370 }, { x: 420, y: 370 },
        { x: 540, y: 370 }, { x: 580, y: 370 },
        { x: 920, y: 370 }, { x: 960, y: 370 }, { x: 1000, y: 370 },
        { x: 1140, y: 370 }, { x: 1180, y: 370 },
        { x: 1320, y: 370 }, { x: 1360, y: 370 },
        { x: 1680, y: 370 }, { x: 1720, y: 370 }, { x: 1760, y: 370 },
        { x: 1880, y: 370 }, { x: 1920, y: 370 },
        // Chess room approach
        { x: 2200, y: 360 }, { x: 2250, y: 360 }, { x: 2300, y: 360 }
      ],

      enemiesData: [
        { x: 320, y: 360, left: 100, right: 550, speed: 70 },
        { x: 580, y: 360, left: 480, right: 680, speed: 65 },
        { x: 1020, y: 360, left: 880, right: 1280, speed: 75 },
        { x: 1400, y: 360, left: 1280, right: 1580, speed: 70 }
      ],

      airEnemiesData: [
        { x: 450, y: 140, pattern: 'horizontal', minX: 350, maxX: 600, speed: 72 },
        { x: 1150, y: 130, pattern: 'diagonal', minX: 1000, maxX: 1300, minY: 100, maxY: 190, speed: 70, speedY: 50 }
      ],

      crownsData: [
        { x: 500, y: 120 },
        { x: 1100, y: 100 },
        { x: 1700, y: 150 }
      ],

      // Chess duel room instead of boss
      chessRoom: {
        triggerX: 2100,
        roomLeft: 2080,
        roomRight: 2400,
        elo: 300
      },

      goal: {
        type: 'chess_victory',
        portalX: 2330, portalY: 245
      }
    }
  ]
};
