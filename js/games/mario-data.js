// === MARIO DATA — Level definitions for Super Martina: El Salto Mágico ===
// Each level has its own biome, platform layout, enemies, coins, and goal.

window.MartinaLevels = {

  // Max possible score per level index (coins + burst + enemies + crowns)
  maxScore: {
    0: 9900,  // Level 1
    1: 9900   // Level 2
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
          speed: 0.55,       // degrees per frame
          hazardIndices: [2, 6]  // which teeth deal damage (0-indexed)
        }
      ]
    }
  ]
};
