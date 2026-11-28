/**
 * Quantum Divisor Arcade — Grand Cosmic Mathematical Odyssey (v3.0 Wisdom Edition)
 * Fusion of God-Tier VFX: [ DYNAMO ] [ HELIX ] [ METEOR ] [ COMET ] [ ORB ] [ MOLTEN ]
 * Featuring 6 Interactive Celestial Multiplication & Divisibility Games:
 * [ 6 ]  [ 7 ]  [ 8 ]  [ 9 ]  [ 12 ]  [ 13 ]
 *
 * Integrated 10 Classroom Wisdom & Contemplative Systems:
 * 1. Superhot Stasis Engine (Universe freezes to 0.02x when cursor pauses for calm contemplation)
 * 2. Harmonic Planetary Constellations (Spheres orbit in 3 concentric celestial rings — zero random pinballing)
 * 3. Quantum Telekinesis / Remote Tractor Beam (Aim laser locks onto spheres; click/space absorbs remotely)
 * 4. Prime Factor Dissection Card (Real-time HUD breakdown: 42 = 2 × 3 × 7, quotient & remainder)
 * 5. Wisdom Vision Heuristic Filters (Key V: ALL, PARITY [dim odd numbers for even divisors], DIGIT-SUM [Σ])
 * 6. Harmonic Chain Reactions (Resonant golden ripples highlighting doubles and quadruples)
 * 7. Remainder Transmutation (Key T or HUD: Alchemically transmute non-divisibles into multiples: 34 + 2 -> 36)
 * 8. Archimedes Move Economy (Zero-mistake deduction earns the 3-Star Archimedes Grandmaster Laurel)
 * 9. Titan Boss Climax (Central celestial boss dismantled via 3 telekinesis resonance pulses)
 * 10. The Codex of Orlando (Rich astronomical, historical, and mathematical lore for each divisor)
 */

(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════════════════════
  // 1. GAME DATA & LEVEL CONFIGURATIONS
  // ══════════════════════════════════════════════════════════════════════════
  const GAME_CONFIGS = {
    6: {
      divisor: 6,
      name: 'Dynamo Singularity',
      subtitle: 'Multiples of 6 (Max: 60)',
      theme: 'dynamo',
      maxTerm: 10,
      normalFactors: [2, 3, 4, 5, 6, 7, 8, 9],
      titanMultiple: 60,
      targetMultiples: [12, 18, 24, 30, 36, 42, 48, 54, 60],
      nonMultiplesPool: [5, 8, 10, 14, 15, 16, 20, 22, 25, 26, 27, 28, 32, 34, 35, 38, 40, 44, 45, 50, 52, 55, 58, 62, 64],
      palette: {
        primary: '#38bdf8', // Electric Sapphire
        secondary: '#fbbf24', // Amber Spark
        aura: 'rgba(56, 189, 248, 0.45)',
        coreGradStart: '#0284c7',
        coreGradEnd: '#082f49',
        ringColor: '#38bdf8',
        bohrRingA: '#fbbf24',
        bohrRingB: '#fde047',
        particleHue: 200,
        lightningColor: '#e0f2fe'
      }
    },
    7: {
      divisor: 7,
      name: 'Prism Helix',
      subtitle: 'Multiples of 7 (Max: 70)',
      theme: 'helix',
      maxTerm: 10,
      normalFactors: [2, 3, 4, 5, 6, 7, 8, 9],
      titanMultiple: 70,
      targetMultiples: [14, 21, 28, 35, 42, 49, 56, 63, 70],
      nonMultiplesPool: [9, 12, 15, 16, 18, 20, 22, 25, 27, 29, 30, 32, 36, 38, 40, 44, 45, 48, 50, 52, 55, 58, 60, 65, 72],
      palette: {
        primary: '#c084fc', // Violet Strand
        secondary: '#22d3ee', // Cyan Strand
        aura: 'rgba(192, 132, 252, 0.45)',
        coreGradStart: '#9333ea',
        coreGradEnd: '#3b0764',
        ringColor: '#22d3ee',
        bohrRingA: '#c084fc',
        bohrRingB: '#22d3ee',
        particleHue: 280,
        lightningColor: '#f5d0fe'
      }
    },
    8: {
      divisor: 8,
      name: 'Volcanic Meteor',
      subtitle: 'Multiples of 8 (Max: 80)',
      theme: 'meteor',
      maxTerm: 10,
      normalFactors: [2, 3, 4, 5, 6, 7, 8, 9],
      titanMultiple: 80,
      targetMultiples: [16, 24, 32, 40, 48, 56, 64, 72, 80],
      nonMultiplesPool: [10, 14, 18, 20, 22, 26, 28, 30, 34, 35, 38, 42, 44, 46, 50, 52, 54, 58, 60, 62, 68, 70, 75, 78, 82],
      palette: {
        primary: '#f97316', // Blazing Orange
        secondary: '#fbbf24', // Sun Flare
        aura: 'rgba(249, 115, 22, 0.45)',
        coreGradStart: '#ea580c',
        coreGradEnd: '#431407',
        ringColor: '#f97316',
        bohrRingA: '#fbbf24',
        bohrRingB: '#fb923c',
        particleHue: 25,
        lightningColor: '#fed7aa'
      }
    },
    9: {
      divisor: 9,
      name: 'Plasma Comet',
      subtitle: 'Multiples of 9 (Max: 90)',
      theme: 'comet',
      maxTerm: 10,
      normalFactors: [2, 3, 4, 5, 6, 7, 8, 9],
      titanMultiple: 90,
      targetMultiples: [18, 27, 36, 45, 54, 63, 72, 81, 90],
      nonMultiplesPool: [12, 15, 20, 24, 28, 30, 32, 35, 40, 42, 48, 50, 52, 58, 60, 65, 68, 70, 75, 78, 80, 85, 88, 92, 95],
      palette: {
        primary: '#818cf8', // Indigo Starlight
        secondary: '#2dd4bf', // Ion Cyan
        aura: 'rgba(129, 140, 248, 0.45)',
        coreGradStart: '#6366f1',
        coreGradEnd: '#1e1b4b',
        ringColor: '#2dd4bf',
        bohrRingA: '#818cf8',
        bohrRingB: '#38bdf8',
        particleHue: 240,
        lightningColor: '#e0e7ff'
      }
    },
    12: {
      divisor: 12,
      name: 'Crystal Orb',
      subtitle: 'Multiples of 12 (Max: 120)',
      theme: 'orb',
      maxTerm: 10,
      normalFactors: [2, 3, 4, 5, 6, 7, 8, 9],
      titanMultiple: 120,
      targetMultiples: [24, 36, 48, 60, 72, 84, 96, 108, 120],
      nonMultiplesPool: [18, 20, 28, 30, 32, 40, 42, 45, 50, 52, 55, 58, 64, 68, 70, 75, 78, 80, 82, 90, 92, 100, 105, 110, 114, 122],
      palette: {
        primary: '#34d399', // Emerald Glow
        secondary: '#e879f9', // Prismatic Magenta
        aura: 'rgba(52, 211, 153, 0.45)',
        coreGradStart: '#059669',
        coreGradEnd: '#022c22',
        ringColor: '#e879f9',
        bohrRingA: '#34d399',
        bohrRingB: '#6ee7b7',
        particleHue: 155,
        lightningColor: '#d1fae5'
      }
    },
    13: {
      divisor: 13,
      name: 'Thermonuclear Molten',
      subtitle: 'Multiples of 13 (Max: 130)',
      theme: 'molten',
      maxTerm: 10,
      normalFactors: [2, 3, 4, 5, 6, 7, 8, 9],
      titanMultiple: 130,
      targetMultiples: [26, 39, 52, 65, 78, 91, 104, 117, 130],
      nonMultiplesPool: [15, 20, 24, 28, 30, 35, 42, 45, 48, 50, 55, 60, 68, 70, 75, 80, 85, 95, 100, 108, 112, 120, 125, 135],
      palette: {
        primary: '#ef4444', // Magma Red
        secondary: '#f59e0b', // Solar Flare Amber
        aura: 'rgba(239, 68, 68, 0.45)',
        coreGradStart: '#b91c1c',
        coreGradEnd: '#450a0a',
        ringColor: '#f59e0b',
        bohrRingA: '#ef4444',
        bohrRingB: '#f97316',
        particleHue: 10,
        lightningColor: '#fee2e2'
      }
    }
  };

  // The Codex of Orlando: Architectural & Astronomical Lore
  const CODEX_LORE = {
    6: {
      title: "📜 THE CODEX OF ORLANDO · WISDOM OF 6 (HEXAGONAL HARMONY)",
      text: "The number 6 is the first 'Perfect Number' in mathematics, equal to the sum of its proper positive divisors (1 + 2 + 3 = 6). In ancient Babylonian astronomy, 6 formed the bedrock of sexagesimal timekeeping (base-60), gifting civilization 60 seconds in a minute, 60 minutes in an hour, and 360 degrees in a circle. In nature, 6 forms the hexagonal lattice of honeycombs, snow crystals, and carbon rings—the most space-efficient packing geometry in the cosmos."
    },
    7: {
      title: "📜 THE CODEX OF ORLANDO · WISDOM OF 7 (THE SACRED HEPTAD)",
      text: "The number 7 is the classical arithmological Heptad, representing cosmic rhythm and cyclical completeness across human cultures. It dictates our 7-day weekly calendar, mirrors the 7 classical celestial bodies visible to the naked eye (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn), and governs Western music's 7-note diatonic octave (Do-Re-Mi-Fa-Sol-La-Ti). In geometry, 7 is the smallest positive integer that cannot be constructed with classical compass and straightedge."
    },
    8: {
      title: "📜 THE CODEX OF ORLANDO · WISDOM OF 8 (THE CUBIC FOUNDATION)",
      text: "The number 8 is the first non-trivial cube in mathematics (2³ = 8). In modern digital computing, 8 bits form exactly 1 Byte—the fundamental quantum of electronic information capable of encoding 256 unique symbols. In quantum chemistry, the Nobel-winning 'Octet Rule' governs atomic stability, stating that main-group atoms achieve chemical peace when their valence shell holds exactly 8 electrons."
    },
    9: {
      title: "📜 THE CODEX OF ORLANDO · WISDOM OF 9 (THE CELESTIAL ENNEAD)",
      text: "The number 9 is the ultimate single-digit integer in decimal mathematics, renowned for the magical theorem of 'Casting Out Nines'. The sum of digits of any multiple of 9 is always divisible by 9 (e.g. 54 → 5+4=9, 81 → 8+1=9). In ancient philosophy, the Ennead represented the 9 Muses of arts and sciences, and in geometry, the 9-point circle harmonizes nine distinct triangle centers into one elegant locus."
    },
    12: {
      title: "📜 THE CODEX OF ORLANDO · WISDOM OF 12 (THE SUBLIME DUODECIMAL)",
      text: "The number 12 is a Sublime Highly Composite Number, possessing more divisors (1, 2, 3, 4, 6, 12) than any number of equal or smaller size. Because 12 divides evenly into halves, thirds, and quarters, ancient chronologers divided the day into 12 hours of light and 12 hours of darkness, segmented the year into 12 solar months, and mapped the celestial zodiac into 12 constellations. It remains the bedrock of human horology."
    },
    13: {
      title: "📜 THE CODEX OF ORLANDO · WISDOM OF 13 (THE FIBONACCI PRIME)",
      text: "The number 13 is a powerful Prime and the 7th Fibonacci number (1, 1, 2, 3, 5, 8, 13). In celestial mechanics, the Moon completes approximately 13 orbital revolutions around Earth in one solar year (365 ÷ 28 ≈ 13), creating 13 lunar months. In geometry, there exist exactly 13 Archimedean semi-regular polyhedra, showcasing spatial symmetries that bridge classical Greek polyhedra to modern nano-crystallography."
    }
  };

  const TOTAL_SPHERES = 20;

  // ══════════════════════════════════════════════════════════════════════════
  // 2. STATE MANAGEMENT & WISDOM SYSTEMS
  // ══════════════════════════════════════════════════════════════════════════
  let activeGame = null;
  let currentDivisor = 6;
  let score = 0;
  let combo = 1;
  let caughtMultiples = new Set();
  let animationId = null;
  let audioCtx = null;
  let audioMuted = false;
  let gamePaused = false;
  let gameCleared = false;

  // Pedagogical Quest & Shield State
  let questFactor = 2; // Starts at Divisor x 2
  let questTarget = 12; // Divisor x questFactor
  let shields = 3; // 3 shields before reboot
  let consecutiveCorrect = 0;

  // Boss Encounter State
  let bossActive = false;
  let boss = null;

  // ── 10 Wisdom Systems State ──
  let stasisFactor = 1.0;
  let lastCursorX = 0;
  let lastCursorY = 0;
  let lastMoveTimestamp = performance.now();
  let wisdomVisionMode = 'ALL'; // 'ALL' | 'PARITY' | 'DIGIT_SUM'
  let targetedSphere = null;
  let targetedBoss = false;
  let mistakesMade = 0;
  let totalCaptures = 0;
  let chainHighlightSpheres = new Map(); // sphere -> remainingFrames

  // Canvas & Render Context
  let canvas = null;
  let ctx = null;
  let width = 0;
  let height = 0;

  // Player Cursor Physics
  const cursor = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    radius: 36,
    active: false,
    trail: []
  };

  // Spheres & FX
  let spheres = [];
  let supernovas = [];
  let floatingTexts = [];
  let shockwaves = [];
  let cosmicDust = [];
  let tractorParticles = [];

  // ══════════════════════════════════════════════════════════════════════════
  // 3. SOUND SYNTHESIZER (WEB AUDIO API)
  // ══════════════════════════════════════════════════════════════════════════
  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }

  function playTone(freq, duration = 0.15, type = 'sine', gainVal = 0.12) {
    if (audioMuted || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
  }

  function playCriticalChord(multiplier = 1) {
    if (audioMuted || !audioCtx) return;
    try {
      const baseFreq = 261.63 * Math.min(2.5, 1 + (multiplier * 0.12));
      const chord = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];
      chord.forEach((f, idx) => {
        setTimeout(() => playTone(f, 0.35, 'triangle', 0.15), idx * 45);
      });
    } catch (_) {}
  }

  function playErrorTone() {
    playTone(180, 0.28, 'sawtooth', 0.18);
    setTimeout(() => playTone(140, 0.35, 'sawtooth', 0.15), 110);
  }

  function playBossStrikeTone(locksRemaining) {
    const freqs = [330, 440, 587.33, 880];
    const f = freqs[Math.max(0, locksRemaining)] || 440;
    playTone(f, 0.45, 'triangle', 0.22);
  }

  function playVictoryFanfare() {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 0.4, 'sine', 0.18), idx * 90);
    });
  }

  function playTransmuteArpeggio() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 0.3, 'triangle', 0.14), idx * 60);
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 4. MATHEMATICAL UTILITIES & PRIME ANATOMY
  // ══════════════════════════════════════════════════════════════════════════
  function getPrimeFactors(n) {
    if (n <= 1) return [n];
    const factors = [];
    let d = 2;
    let temp = n;
    while (d * d <= temp) {
      while (temp % d === 0) {
        factors.push(d);
        temp /= d;
      }
      d++;
    }
    if (temp > 1) factors.push(temp);
    return factors;
  }

  const SUPERSCRIPTS = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  function toSuperscript(num) {
    return String(num).split('').map(d => SUPERSCRIPTS[d] || d).join('');
  }

  function formatPrimeAnatomy(n) {
    const factors = getPrimeFactors(n);
    if (factors.length === 1) {
      return `${n} is a Prime Number (Only divisible by 1 & ${n})`;
    }
    const counts = {};
    factors.forEach(f => { counts[f] = (counts[f] || 0) + 1; });
    const parts = Object.entries(counts).map(([base, exp]) => exp > 1 ? `${base}${toSuperscript(exp)}` : `${base}`);
    return `Prime Anatomy: ${parts.join(' × ')} = ${n}`;
  }

  function advanceQuest() {
    consecutiveCorrect = 0;
    questFactor++;
    const cfg = GAME_CONFIGS[currentDivisor];

    if (questFactor > 9) {
      triggerTitanBoss();
      return;
    }

    questTarget = currentDivisor * questFactor;
    ensureTargetInPool(questTarget);
    updateHUD();

    playTone(523.25, 0.2, 'sine', 0.15);
    setTimeout(() => playTone(659.25, 0.25, 'sine', 0.15), 100);
    spawnFloatingText(`QUEST ADVANCED: ${currentDivisor} × ${questFactor} = ?`, width / 2, height * 0.22, '#fde047', 22);
  }

  function ensureTargetInPool(targetVal) {
    const exists = spheres.some(s => s.value === targetVal);
    if (!exists && spheres.length > 0) {
      let nonDivIdx = spheres.findIndex(s => !s.isTarget);
      let replaceIdx = nonDivIdx !== -1 ? nonDivIdx : Math.floor(Math.random() * spheres.length);
      if (replaceIdx >= 0) {
        spheres[replaceIdx].value = targetVal;
        spheres[replaceIdx].isTarget = true;
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 5. HARMONIC PLANETARY CONSTELLATIONS (ZERO ERRATIC PINBALLING)
  // ══════════════════════════════════════════════════════════════════════════
  // 3 Concentric Celestial Orbital Rings:
  // Ring 0 (Inner): 5 spheres, gentle clockwise rotation (+0.0016)
  // Ring 1 (Mid):   7 spheres, counter-clockwise rotation (-0.0012)
  // Ring 2 (Outer): 8 spheres, calm clockwise rotation (+0.0009)
  // Total = 20 Spheres in perfect harmonic equilibrium
  const ORBIT_RINGS = [
    { ring: 0, count: 5, radiusRatio: 0.22, speed: 0.0016 },
    { ring: 1, count: 7, radiusRatio: 0.35, speed: -0.0012 },
    { ring: 2, count: 8, radiusRatio: 0.46, speed: 0.0009 }
  ];

  function createSphere(preferredValue, ringIndex, slotIndex, totalInRing) {
    const cfg = GAME_CONFIGS[currentDivisor];
    let val = preferredValue;

    if (val === null || val === undefined) {
      const remainingTargets = cfg.normalFactors
        .map(f => currentDivisor * f)
        .filter(m => !caughtMultiples.has(m));

      const currentTargetCount = spheres.filter(s => cfg.targetMultiples.includes(s.value)).length;
      if (remainingTargets.length > 0 && (currentTargetCount < 4 || Math.random() < 0.35)) {
        val = remainingTargets[Math.floor(Math.random() * remainingTargets.length)];
      } else {
        const pool = cfg.nonMultiplesPool;
        val = pool[Math.floor(Math.random() * pool.length)];
      }
    }

    const radius = Math.max(22, Math.min(28, width * 0.024));
    const baseAngle = (Math.PI * 2 * slotIndex) / Math.max(1, totalInRing) + (Math.random() - 0.5) * 0.25;
    const isTarget = cfg.targetMultiples.includes(val);

    return {
      value: val,
      isTarget: isTarget,
      ringIndex: ringIndex,
      baseAngle: baseAngle,
      currentAngle: baseAngle,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.0015 + Math.random() * 0.001,
      wobbleAmp: 8 + Math.random() * 10,
      radius: radius,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      pulsePhase: Math.random() * Math.PI * 2,
      scale: 1,
      x: width / 2,
      y: height / 2
    };
  }

  function initSpheres() {
    spheres = [];
    const cfg = GAME_CONFIGS[currentDivisor];

    // Prepare list of multiples to seed
    const multiplesToSeed = [questTarget];
    const otherTargets = cfg.normalFactors
      .map(f => currentDivisor * f)
      .filter(m => m !== questTarget);
    otherTargets.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3 && i < otherTargets.length; i++) {
      multiplesToSeed.push(otherTargets[i]);
    }

    let seedIdx = 0;
    ORBIT_RINGS.forEach(ringDef => {
      for (let s = 0; s < ringDef.count; s++) {
        let val = null;
        if (seedIdx < multiplesToSeed.length) {
          val = multiplesToSeed[seedIdx++];
        }
        spheres.push(createSphere(val, ringDef.ring, s, ringDef.count));
      }
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 6. GRAPHICS RENDERING ENGINE
  // ══════════════════════════════════════════════════════════════════════════

  // Draw 3D Glassmorphic Number Sphere
  function drawSphere(s, time) {
    const cfg = GAME_CONFIGS[currentDivisor];
    const isQuestTarget = s.value === questTarget;
    const isTarget = s.isTarget;
    const isChained = chainHighlightSpheres.has(s);

    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.scale(s.scale, s.scale);

    const r = s.radius;
    const pulse = Math.sin(time * 0.003 + s.pulsePhase) * 1.5;

    // Wisdom Vision 1: Parity Filter (Dim odd numbers for even divisors)
    if (wisdomVisionMode === 'PARITY' && currentDivisor % 2 === 0) {
      if (s.value % 2 !== 0) {
        ctx.globalAlpha = 0.22;
      }
    }

    // 1. Ambient Outer Halo
    const haloGrad = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 1.6);
    if (isQuestTarget) {
      haloGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      haloGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.25)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else if (isTarget) {
      haloGrad.addColorStop(0, cfg.palette.aura);
      haloGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.2)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      haloGrad.addColorStop(0, 'rgba(148, 163, 184, 0.18)');
      haloGrad.addColorStop(0.8, 'rgba(51, 65, 85, 0.08)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Harmonic Chain Reaction Resonant Ripples
    if (isChained) {
      const rippleR = r * 1.5 + Math.sin(time * 0.01) * 6;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, rippleR, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. 3D Volumetric Sphere Body (Off-center light source)
    const sphereGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
    if (isQuestTarget) {
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.3, '#fef08a');
      sphereGrad.addColorStop(0.7, '#d97706');
      sphereGrad.addColorStop(1, '#451a03');
    } else if (isTarget) {
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.35, cfg.palette.coreGradStart);
      sphereGrad.addColorStop(0.8, cfg.palette.coreGradEnd);
      sphereGrad.addColorStop(1, '#020617');
    } else {
      sphereGrad.addColorStop(0, '#f1f5f9');
      sphereGrad.addColorStop(0.4, '#475569');
      sphereGrad.addColorStop(0.85, '#1e293b');
      sphereGrad.addColorStop(1, '#090d16');
    }

    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // 3. Specular Reflection Highlight (Glass Glare)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(-r * 0.3, -r * 0.35, r * 0.42, r * 0.22, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fill();
    ctx.restore();

    // 4. Outer Glass Rim
    ctx.strokeStyle = isQuestTarget ? 'rgba(251, 191, 36, 0.8)' : isTarget ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = isQuestTarget ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Number Typography
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${Math.round(r * 0.9)}px 'Space Grotesk', system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 6;
    ctx.fillText(s.value, 0, 1);
    ctx.shadowBlur = 0;

    // Wisdom Vision 2: Digit Sum Pill (Σ)
    if (wisdomVisionMode === 'DIGIT_SUM') {
      const digitSum = String(s.value).split('').reduce((a, b) => a + Number(b), 0);
      const isSpecialSum = (currentDivisor === 9 && digitSum % 9 === 0) || (currentDivisor === 6 && digitSum % 3 === 0);
      ctx.fillStyle = isSpecialSum ? 'rgba(251, 191, 36, 0.95)' : 'rgba(30, 41, 59, 0.85)';
      ctx.strokeStyle = isSpecialSum ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      
      const badgeW = 38;
      const badgeH = 16;
      ctx.beginPath();
      ctx.roundRect(-badgeW / 2, -r - 18, badgeW, badgeH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isSpecialSum ? '#030712' : '#f8fafc';
      ctx.font = "800 10px monospace";
      ctx.fillText(`Σ=${digitSum}`, 0, -r - 10);
    }

    // Wisdom Vision 1: Parity Tag
    if (wisdomVisionMode === 'PARITY' && currentDivisor % 2 === 0 && s.value % 2 !== 0) {
      ctx.fillStyle = 'rgba(244, 63, 94, 0.9)';
      ctx.font = "800 10px monospace";
      ctx.fillText("ODD ✗", 0, -r - 10);
    }

    ctx.restore();
  }

  // Draw Grand Player Divisor Cursor
  function drawCursor(time) {
    if (!cursor.active && cursor.x === 0 && cursor.y === 0) {
      cursor.x = width / 2;
      cursor.y = height / 2;
      cursor.targetX = width / 2;
      cursor.targetY = height / 2;
    }

    cursor.x += (cursor.targetX - cursor.x) * 0.25;
    cursor.y += (cursor.targetY - cursor.y) * 0.25;

    const cfg = GAME_CONFIGS[currentDivisor];
    const cx = cursor.x;
    const cy = cursor.y;
    const r = cursor.radius;

    ctx.save();
    ctx.translate(cx, cy);

    // 1. DYNAMO: Crackling Tesla Lightning Arcs
    if (Math.random() < 0.65) {
      for (let b = 0; b < 3; b++) {
        const startAngle = Math.random() * Math.PI * 2;
        const targetDist = r * 1.6 + Math.random() * r * 0.8;
        let lx = Math.cos(startAngle) * r * 0.7;
        let ly = Math.sin(startAngle) * r * 0.7;

        ctx.beginPath();
        ctx.moveTo(lx, ly);
        for (let s = 1; s <= 4; s++) {
          const frac = s / 4;
          const nx = Math.cos(startAngle) * (r * 0.7 + targetDist * frac) + (Math.random() - 0.5) * 12;
          const ny = Math.sin(startAngle) * (r * 0.7 + targetDist * frac) + (Math.random() - 0.5) * 12;
          ctx.lineTo(nx, ny);
        }
        ctx.strokeStyle = cfg.palette.lightningColor;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = cfg.palette.primary;
        ctx.shadowBlur = 8;
        ctx.stroke();
      }
    }

    // 2. HELIX: Counter-Rotating Sine-Wave Double-Helix Strands
    ctx.save();
    ctx.rotate(time * 0.002);
    for (let h = 0; h < 2; h++) {
      const strandColor = h === 0 ? cfg.palette.primary : cfg.palette.secondary;
      ctx.strokeStyle = strandColor;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = strandColor;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      for (let theta = 0; theta < Math.PI * 2; theta += 0.2) {
        const rad = r * 1.45 + Math.sin(theta * 3 + (h * Math.PI)) * 7;
        const hx = Math.cos(theta) * rad;
        const hy = Math.sin(theta) * rad;
        if (theta === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();

    // 3. METEOR: Radiating Volcanic Heat Flare
    const flareGrad = ctx.createRadialGradient(0, 0, r * 0.6, 0, 0, r * 2.1);
    flareGrad.addColorStop(0, cfg.palette.aura);
    flareGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.18)');
    flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = flareGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 2.1, 0, Math.PI * 2);
    ctx.fill();

    // 4. COMET: Orbital Ion Dust Shell
    ctx.save();
    ctx.rotate(-time * 0.0015);
    for (let p = 0; p < 8; p++) {
      const a = (p / 8) * Math.PI * 2;
      const dist = r * 1.25 + Math.sin(time * 0.004 + p) * 5;
      ctx.fillStyle = cfg.palette.secondary;
      ctx.shadowColor = cfg.palette.primary;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * dist, Math.sin(a) * dist, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 5. ORB: Multi-Ring Gyroscope Bohr Rings
    ctx.save();
    ctx.rotate(time * 0.001);
    ctx.strokeStyle = cfg.palette.bohrRingA;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = cfg.palette.bohrRingA;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.35, r * 0.55, time * 0.001, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = cfg.palette.bohrRingB;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.35, r * 0.55, -time * 0.0015 + 1.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 6. MOLTEN: Deep Thermonuclear Fusion Core
    const coreGrad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.3, cfg.palette.coreGradStart);
    coreGrad.addColorStop(0.85, cfg.palette.coreGradEnd);
    coreGrad.addColorStop(1, '#050505');

    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Specular Highlight
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(-r * 0.32, -r * 0.35, r * 0.45, r * 0.22, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fill();
    ctx.restore();

    // Golden / Electric Rim
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();

    // Core Divisor Number Glyph
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${Math.round(r * 1.05)}px 'Space Grotesk', system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 10;
    ctx.fillText(currentDivisor, 0, 2);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // Draw Quantum Telekinesis Laser Tractor Beam & Lock-on Reticle
  function drawTractorBeam(targetX, targetY, isBoss = false, isDivisible = true, time) {
    ctx.save();

    // 1. Oscillating Plasma Laser Core
    const beamGrad = ctx.createLinearGradient(cursor.x, cursor.y, targetX, targetY);
    if (isBoss) {
      beamGrad.addColorStop(0, 'rgba(251, 191, 36, 0.8)');
      beamGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.9)');
      beamGrad.addColorStop(1, 'rgba(251, 191, 36, 0.8)');
    } else if (isDivisible) {
      beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.7)');
      beamGrad.addColorStop(0.5, 'rgba(74, 222, 128, 0.9)');
      beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0.7)');
    } else {
      beamGrad.addColorStop(0, 'rgba(251, 113, 133, 0.6)');
      beamGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.8)');
      beamGrad.addColorStop(1, 'rgba(251, 113, 133, 0.6)');
    }

    ctx.strokeStyle = beamGrad;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = isDivisible ? '#38bdf8' : '#fb7185';
    ctx.shadowBlur = 12;

    // Laser sine-wave oscillation
    ctx.beginPath();
    ctx.moveTo(cursor.x, cursor.y);
    const dist = Math.hypot(targetX - cursor.x, targetY - cursor.y);
    const steps = 12;
    const nx = (targetY - cursor.y) / dist;
    const ny = -(targetX - cursor.x) / dist;

    for (let i = 1; i < steps; i++) {
      const frac = i / steps;
      const wave = Math.sin(time * 0.01 + frac * Math.PI * 4) * 4;
      const px = cursor.x + (targetX - cursor.x) * frac + nx * wave;
      const py = cursor.y + (targetY - cursor.y) * frac + ny * wave;
      ctx.lineTo(px, py);
    }
    ctx.lineTo(targetX, targetY);
    ctx.stroke();

    // 2. Targeting Lock Reticle Brackets [ ]
    const reticleR = isBoss ? 90 : 38;
    ctx.translate(targetX, targetY);
    ctx.rotate(time * 0.003);

    ctx.strokeStyle = isBoss ? '#fbbf24' : isDivisible ? '#4ade80' : '#fb7185';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;

    const bSize = 10;
    // 4 Corner Brackets
    [-reticleR, reticleR].forEach(bx => {
      [-reticleR, reticleR].forEach(by => {
        ctx.beginPath();
        const sx = bx > 0 ? -bSize : bSize;
        const sy = by > 0 ? -bSize : bSize;
        ctx.moveTo(bx + sx, by);
        ctx.lineTo(bx, by);
        ctx.lineTo(bx, by + sy);
        ctx.stroke();
      });
    });

    ctx.restore();
  }

  // Draw Grand Titan Boss
  function drawTitanBoss(time) {
    if (!boss) return;
    const cfg = GAME_CONFIGS[currentDivisor];
    const bx = boss.x;
    const by = boss.y;
    const br = boss.radius;

    ctx.save();
    ctx.translate(bx, by);

    // 1. Titan Gravitational Horizon Pulsing Flare
    const titanGrad = ctx.createRadialGradient(0, 0, br * 0.6, 0, 0, br * 2.4);
    titanGrad.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
    titanGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
    titanGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = titanGrad;
    ctx.beginPath();
    ctx.arc(0, 0, br * 2.4, 0, Math.PI * 2);
    ctx.fill();

    // 2. Multi-Shield Harmonic Rotating Rings (Number of rings = boss.hp)
    for (let s = 0; s < boss.hp; s++) {
      ctx.save();
      const rot = (time * 0.001 * (s % 2 === 0 ? 1 : -1)) + (s * 1.2);
      ctx.rotate(rot);
      ctx.strokeStyle = s === 0 ? '#fbbf24' : s === 1 ? '#f97316' : '#ef4444';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 14;
      ctx.setLineDash([18, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, br * (1.25 + s * 0.18), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Titan Core Body
    const bodyGrad = ctx.createRadialGradient(-br * 0.35, -br * 0.35, br * 0.1, 0, 0, br);
    bodyGrad.addColorStop(0, '#ffffff');
    bodyGrad.addColorStop(0.3, '#ea580c');
    bodyGrad.addColorStop(0.8, '#7f1d1d');
    bodyGrad.addColorStop(1, '#000000');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, br, 0, Math.PI * 2);
    ctx.fill();

    // Outer Heavy Golden Rim
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Titan Number & Title
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${Math.round(br * 0.72)}px 'Space Grotesk', system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 12;
    ctx.fillText(boss.value, 0, -4);

    // HP Bar Beneath Boss
    const barW = br * 1.6;
    const barH = 8;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(-barW / 2, br + 12, barW, barH);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-barW / 2, br + 12, barW * (boss.hp / boss.maxHp), barH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-barW / 2, br + 12, barW, barH);

    ctx.restore();
  }

  // Draw Deep Celestial Cosmos with Concentric Orbit Tracks
  function drawBackground() {
    // Deep Cosmic Gradient
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) * 0.85);
    bgGrad.addColorStop(0, '#0a0f1d');
    bgGrad.addColorStop(0.6, '#030712');
    bgGrad.addColorStop(1, '#000000');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle Concentric Planetary Orbit Tracks
    const cx = width / 2;
    const cy = Math.max(height / 2, 280);
    const minDim = Math.min(width, height);

    ctx.save();
    ORBIT_RINGS.forEach((ringDef, rIdx) => {
      const radius = minDim * ringDef.radiusRatio;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.restore();

    // Cosmic Star Dust
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < cosmicDust.length; i++) {
      const d = cosmicDust[i];
      d.y += d.speed * stasisFactor;
      if (d.y > height) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 7. GOD-TIER PARTICLE PHYSICS & SHOCKWAVES
  // ══════════════════════════════════════════════════════════════════════════
  function spawnSupernova(x, y, count = 35) {
    const cfg = GAME_CONFIGS[currentDivisor];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      supernovas.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 4,
        alpha: 1,
        decay: 0.015 + Math.random() * 0.02,
        color: Math.random() < 0.6 ? cfg.palette.primary : cfg.palette.secondary
      });
    }
    shockwaves.push({ x: x, y: y, radius: 10, maxRadius: 130, alpha: 0.9 });
  }

  function spawnFloatingText(text, x, y, color = '#fef08a', fontSize = 16) {
    floatingTexts.push({
      text: text,
      x: x,
      y: y,
      alpha: 1,
      vy: -1.2,
      color: color,
      fontSize: fontSize
    });
  }

  function updateAndDrawFX() {
    // 1. Supernova Particles
    for (let i = supernovas.length - 1; i >= 0; i--) {
      const p = supernovas[i];
      p.x += p.vx * stasisFactor;
      p.y += p.vy * stasisFactor;
      p.alpha -= p.decay * Math.max(0.2, stasisFactor);

      if (p.alpha <= 0) {
        supernovas.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Shockwaves
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const w = shockwaves[i];
      w.radius += 4 * stasisFactor;
      w.alpha -= 0.025 * Math.max(0.2, stasisFactor);

      if (w.alpha <= 0 || w.radius >= w.maxRadius) {
        shockwaves.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = w.alpha;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Floating Score / Educational Texts
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const t = floatingTexts[i];
      t.y += t.vy * stasisFactor;
      t.alpha -= 0.015 * Math.max(0.2, stasisFactor);

      if (t.alpha <= 0) {
        floatingTexts.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = t.alpha;
      ctx.fillStyle = t.color;
      ctx.font = `800 ${t.fontSize}px 'Space Grotesk', system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 8;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 8. REMOTE ABSORPTION & WISDOM HIT LOGIC
  // ══════════════════════════════════════════════════════════════════════════
  function triggerRemoteAbsorption() {
    if (gameCleared || gamePaused) return;

    if (bossActive && boss) {
      handleBossStrike();
      return;
    }

    if (targetedSphere) {
      const idx = spheres.indexOf(targetedSphere);
      if (idx !== -1) {
        if (targetedSphere.value === questTarget) {
          handleQuestTargetHit(targetedSphere, idx);
        } else if (targetedSphere.isTarget) {
          handleSecondaryMultipleHit(targetedSphere, idx);
        } else {
          mistakesMade++;
          handleNonDivisibleHit(targetedSphere);
        }
      }
    }
  }

  function handleQuestTargetHit(s, index) {
    const val = s.value;
    const factor = questFactor;

    totalCaptures++;
    spawnSupernova(s.x, s.y, 45);
    playCriticalChord(combo);

    caughtMultiples.add(val);
    score += 300 * combo;
    combo = Math.min(10, combo + 1);
    consecutiveCorrect++;

    // Harmonic Chain Reaction: Highlight doubles and multiples of this number!
    spheres.forEach(other => {
      if (other !== s && other.value > val && other.value % val === 0) {
        chainHighlightSpheres.set(other, 180);
      }
    });

    // Shield Restoration on 2 consecutive correct catches
    if (consecutiveCorrect >= 2 && shields < 3) {
      shields++;
      consecutiveCorrect = 0;
      spawnFloatingText(`Shield Restored! +1 🛡️`, cursor.x, cursor.y - 40, '#4ade80', 16);
      playTone(880, 0.25, 'triangle', 0.15);
    }

    spawnFloatingText(`CRITICAL HIT! +${300 * combo}  ${currentDivisor} × ${factor} = ${val}!`, s.x, s.y, '#fef08a', 18);

    // Replace sphere smoothly on same orbit ring
    spheres[index] = createSphere(null, s.ringIndex, Math.floor(Math.random() * 8), 8);

    updateHUD();
    advanceQuest();
  }

  function handleSecondaryMultipleHit(s, index) {
    const val = s.value;
    const factor = val / currentDivisor;

    totalCaptures++;
    spawnSupernova(s.x, s.y, 30);
    playTone(587.33, 0.25, 'triangle', 0.16);

    caughtMultiples.add(val);
    score += 150 * combo;
    combo = Math.min(10, combo + 1);

    spawnFloatingText(`MULTIPLE CAPTURED! +${150 * combo}  (${currentDivisor} × ${factor} = ${val})`, s.x, s.y, '#38bdf8', 16);

    spheres[index] = createSphere(null, s.ringIndex, Math.floor(Math.random() * 8), 8);

    updateHUD();
  }

  function handleNonDivisibleHit(s) {
    const val = s.value;
    const quotient = Math.floor(val / currentDivisor);
    const rem = val % currentDivisor;

    combo = 1;
    consecutiveCorrect = 0;
    shields--;

    playErrorTone();
    showRemainderToast(val, quotient, rem);

    if (shields <= 0) {
      triggerReviveModal();
    } else {
      updateHUD();
    }
  }

  function triggerRemainderTransmutation() {
    if (!targetedSphere || targetedSphere.isTarget) return;

    const val = targetedSphere.value;
    const rem = val % currentDivisor;
    const needed = currentDivisor - rem;

    targetedSphere.value += needed;
    targetedSphere.isTarget = true;
    score += 150;

    spawnSupernova(targetedSphere.x, targetedSphere.y, 35);
    playTransmuteArpeggio();
    spawnFloatingText(`⚗️ TRANSMUTED: ${val} + ${needed} = ${targetedSphere.value}!`, targetedSphere.x, targetedSphere.y, '#c084fc', 18);

    updateHUD();
  }

  function showRemainderToast(val, quotient, rem) {
    const toast = document.getElementById('qGameRemainderToast');
    if (!toast) return;

    const titleEl = document.getElementById('qRemainderTitle');
    const mathEl = document.getElementById('qRemainderMath');
    const explainEl = document.getElementById('qRemainderExplain');

    if (titleEl) titleEl.textContent = `⚠️ Non-Divisible: ${val} (Shields Remaining: ${Math.max(0, shields)}/3)`;
    if (mathEl) mathEl.textContent = `${val} ÷ ${currentDivisor} = ${quotient} with Remainder ${rem}`;
    if (explainEl) {
      explainEl.textContent = `Because ${currentDivisor} × ${quotient} = ${currentDivisor * quotient}, we need ${currentDivisor - rem} more to reach ${currentDivisor * (quotient + 1)}.`;
    }

    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 4200);
  }

  function triggerReviveModal() {
    gamePaused = true;
    const modal = document.getElementById('qGameReviveModal');
    if (!modal) return;

    const explain = document.getElementById('qReviveExplain');
    if (explain) {
      explain.textContent = `Remember: Every multiple of ${currentDivisor} leaves a remainder of exactly 0. You can freeze time by resting your cursor, inspect prime factorizations calmly, or use Remainder Transmutation [T]!`;
    }
    modal.style.display = 'flex';
  }

  function triggerTitanBoss() {
    bossActive = true;
    const cfg = GAME_CONFIGS[currentDivisor];

    boss = {
      x: width / 2,
      y: height * 0.38,
      radius: Math.max(68, Math.min(85, width * 0.065)),
      hp: 3,
      maxHp: 3,
      value: cfg.titanMultiple
    };

    playTone(330, 0.4, 'sawtooth', 0.18);
    setTimeout(() => playTone(440, 0.4, 'triangle', 0.22), 250);

    spawnFloatingText('⚠️ TITAN 10TH TERM DETECTED!', width / 2, height * 0.5, '#ef4444', 26);
    updateHUD();
  }

  function handleBossStrike() {
    if (!boss || boss.hp <= 0) return;

    boss.hp--;
    playBossStrikeTone(boss.hp);
    spawnSupernova(boss.x, boss.y, 50);
    score += 500;

    spawnFloatingText(`TITAN LOCK BREACHED! +500`, cursor.x, cursor.y - 30, '#fde047', 20);
    updateHUD();

    if (boss.hp <= 0) {
      bossActive = false;
      caughtMultiples.add(boss.value);
      triggerVictory();
    }
  }

  function triggerVictory() {
    gameCleared = true;
    playVictoryFanfare();

    for (let f = 0; f < 8; f++) {
      setTimeout(() => {
        const fx = width * (0.15 + Math.random() * 0.7);
        const fy = height * (0.2 + Math.random() * 0.5);
        spawnSupernova(fx, fy, 65);
      }, f * 160);
    }

    const modal = document.getElementById('qDivisorVictoryModal');
    if (modal) {
      const cfg = GAME_CONFIGS[currentDivisor];
      const titleEl = document.getElementById('qVictoryTitle');
      const tableEl = document.getElementById('qVictoryTable');
      const scoreEl = document.getElementById('qVictoryScore');
      const rankEl = document.getElementById('qVictoryRank');
      const codexTitleEl = document.getElementById('qCodexTitle');
      const codexTextEl = document.getElementById('qCodexText');

      if (titleEl) titleEl.textContent = `DIVISOR ${currentDivisor} & TITAN ${cfg.titanMultiple} DEFEATED!`;
      if (scoreEl) scoreEl.textContent = `Final Score: ${score.toLocaleString()} Points · Move Economy: ${mistakesMade} Mistakes`;

      // Archimedes Grandmaster Laurel Rating
      if (rankEl) {
        if (mistakesMade === 0) {
          rankEl.textContent = '⭐⭐⭐ ARCHIMEDES GRANDMASTER · ZERO MISTAKES DEDUCTION';
        } else if (mistakesMade === 1) {
          rankEl.textContent = '⭐⭐ PYTHAGOREAN SCHOLAR · 1 MISTAKE SUSTAINED';
        } else {
          rankEl.textContent = '⭐ EUCLIDEAN APPRENTICE · COMPLETE VICTORY';
        }
      }

      // Populate Multiplication Table
      if (tableEl) {
        let tableHtml = '';
        cfg.targetMultiples.forEach((m, idx) => {
          const factor = idx + 2;
          tableHtml += `
            <div class="qg-table-row">
              <span class="qg-fact-eq">${currentDivisor} × ${factor} = <strong>${m}</strong></span>
              <span class="qg-fact-div">${m} ÷ ${currentDivisor} = <strong>${factor}</strong> ✓</span>
            </div>
          `;
        });
        tableEl.innerHTML = tableHtml;
      }

      // The Codex of Orlando Lore Card
      const lore = CODEX_LORE[currentDivisor] || CODEX_LORE[6];
      if (codexTitleEl) codexTitleEl.textContent = lore.title;
      if (codexTextEl) codexTextEl.textContent = lore.text;

      modal.style.display = 'flex';
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 9. HUD MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════
  function updateHUD() {
    const cfg = GAME_CONFIGS[currentDivisor];

    const levelTitle = document.getElementById('qGameLevelTitle');
    const levelSub = document.getElementById('qGameLevelSubtitle');
    const questFormula = document.getElementById('qGameQuestFormula');
    const questHint = document.getElementById('qGameQuestHint');
    const scoreVal = document.getElementById('qGameScoreVal');
    const comboVal = document.getElementById('qGameComboVal');
    const shieldIcons = document.getElementById('qGameShieldIcons');
    const progressBar = document.getElementById('qGameProgressBar');

    if (levelTitle) levelTitle.textContent = `DIVISOR ${currentDivisor} · ${cfg.name.toUpperCase()}`;
    if (levelSub) levelSub.textContent = cfg.subtitle;

    if (questFormula && questHint) {
      if (bossActive) {
        questFormula.textContent = `FINAL TITAN BOSS (${cfg.titanMultiple})`;
        questFormula.style.color = '#ef4444';
        questHint.textContent = `[Absorb 3 Resonance Pulses!]`;
        questHint.style.color = '#fbbf24';
      } else {
        questFormula.textContent = `${currentDivisor} × ${questFactor} = ?`;
        questFormula.style.color = '#ffffff';
        questHint.textContent = `[Find ${questTarget}]`;
        questHint.style.color = '#fde047';
      }
    }

    if (scoreVal) scoreVal.textContent = score.toLocaleString();
    if (comboVal) comboVal.textContent = `x${combo}`;

    if (shieldIcons) {
      let sHtml = '';
      for (let i = 0; i < 3; i++) {
        sHtml += i < shields ? '🛡️' : '🖤';
      }
      shieldIcons.innerHTML = sHtml;
    }

    if (progressBar) {
      const pct = (caughtMultiples.size / cfg.targetMultiples.length) * 100;
      progressBar.style.width = `${Math.min(100, pct)}%`;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 10. ANIMATION LOOP & SUPERHOT STASIS ENGINE
  // ══════════════════════════════════════════════════════════════════════════
  function loop(time) {
    if (!activeGame) return;

    if (!gamePaused) {
      // Superhot Stasis: Freeze cosmos if cursor pauses for calm reflection
      const timeSinceMove = performance.now() - lastMoveTimestamp;
      const targetStasis = timeSinceMove > 160 ? 0.02 : 1.0;
      stasisFactor += (targetStasis - stasisFactor) * 0.12;

      // Update Stasis HUD Badge
      const stasisBadge = document.getElementById('qGameStasisBadge');
      const stasisText = document.getElementById('qStasisStateText');
      if (stasisBadge && stasisText) {
        if (stasisFactor < 0.25) {
          stasisBadge.classList.remove('qg-stasis-active');
          stasisText.textContent = '❄️ FROZEN';
          stasisText.style.color = '#4ade80';
        } else {
          stasisBadge.classList.add('qg-stasis-active');
          stasisText.textContent = '⚡ FLUID';
          stasisText.style.color = '#fbbf24';
        }
      }

      // Decay harmonic chain highlights
      for (const [s, frames] of chainHighlightSpheres.entries()) {
        if (frames <= 1) chainHighlightSpheres.delete(s);
        else chainHighlightSpheres.set(s, frames - 1);
      }

      ctx.clearRect(0, 0, width, height);
      drawBackground();

      // Update Planetary Constellations along 3 orbital rings
      const cx = width / 2;
      const cy = Math.max(height / 2, 280);
      const minDim = Math.min(width, height);

      for (let i = 0; i < spheres.length; i++) {
        const s = spheres[i];
        const ringDef = ORBIT_RINGS[s.ringIndex] || ORBIT_RINGS[0];
        s.currentAngle += ringDef.speed * stasisFactor;
        const r = (minDim * ringDef.radiusRatio) + Math.sin(time * s.wobbleSpeed + s.wobblePhase) * s.wobbleAmp;
        s.x = cx + Math.cos(s.currentAngle) * r;
        s.y = cy + Math.sin(s.currentAngle) * r;
        s.rotation += s.rotSpeed * stasisFactor;

        drawSphere(s, time);
      }

      // Draw Boss if active
      if (bossActive && boss) {
        drawTitanBoss(time);
      }

      // Find Closest Sphere for Quantum Telekinesis Lock-on
      if (bossActive && boss) {
        targetedBoss = true;
        targetedSphere = null;
        drawTractorBeam(boss.x, boss.y, true, true, time);
      } else {
        targetedBoss = false;
        let best = null;
        let minDist = Math.max(340, width * 0.35);
        for (const s of spheres) {
          const d = Math.hypot(cursor.x - s.x, cursor.y - s.y);
          if (d < minDist) {
            minDist = d;
            best = s;
          }
        }
        targetedSphere = best;
        if (targetedSphere) {
          const isDiv = targetedSphere.value % currentDivisor === 0;
          drawTractorBeam(targetedSphere.x, targetedSphere.y, false, isDiv, time);
        }
      }

      // Update Telekinesis HUD Card
      const inspectCard = document.getElementById('qGameTeleInspectCard');
      if (inspectCard) {
        if (targetedBoss && boss) {
          inspectCard.style.display = 'flex';
          document.getElementById('qInspectNum').textContent = boss.value;
          const stEl = document.getElementById('qInspectStatus');
          stEl.textContent = `TITAN BOSS (LOCKS: ${boss.hp}/${boss.maxHp})`;
          stEl.className = 'qg-inspect-status is-divisible';
          document.getElementById('qInspectPrime').textContent = formatPrimeAnatomy(boss.value);
          document.getElementById('qInspectFormula').textContent = `${boss.value} ÷ ${currentDivisor} = 10 (FINAL TITAN TERM)`;
          const transBtn = document.getElementById('qInspectTransmuteBtn');
          if (transBtn) transBtn.style.display = 'none';
        } else if (targetedSphere) {
          inspectCard.style.display = 'flex';
          const val = targetedSphere.value;
          document.getElementById('qInspectNum').textContent = val;
          const isDiv = val % currentDivisor === 0;
          const stEl = document.getElementById('qInspectStatus');
          const transBtn = document.getElementById('qInspectTransmuteBtn');

          if (isDiv) {
            stEl.textContent = 'DIVISIBLE ✓';
            stEl.className = 'qg-inspect-status is-divisible';
            document.getElementById('qInspectFormula').textContent = `${val} ÷ ${currentDivisor} = ${val / currentDivisor} (Remainder: 0)`;
            if (transBtn) transBtn.style.display = 'none';
          } else {
            stEl.textContent = 'NOT DIVISIBLE ✗';
            stEl.className = 'qg-inspect-status is-not-divisible';
            const q = Math.floor(val / currentDivisor);
            const rem = val % currentDivisor;
            const needed = currentDivisor - rem;
            document.getElementById('qInspectFormula').textContent = `${val} ÷ ${currentDivisor} = ${q} (Remainder: ${rem})`;
            if (transBtn) {
              transBtn.style.display = 'inline-flex';
              transBtn.textContent = `⚗️ Transmute (+${needed} → ${val + needed})`;
            }
          }
          document.getElementById('qInspectPrime').textContent = formatPrimeAnatomy(val);
        } else {
          inspectCard.style.display = 'none';
        }
      }

      updateAndDrawFX();
      drawCursor(time);
    }

    animationId = requestAnimationFrame(loop);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 11. PUBLIC CONTROLS & LIFECYCLE
  // ══════════════════════════════════════════════════════════════════════════
  function launch(divisorNum = 6) {
    if (!GAME_CONFIGS[divisorNum]) divisorNum = 6;
    currentDivisor = divisorNum;
    activeGame = divisorNum;

    score = 0;
    combo = 1;
    caughtMultiples = new Set();
    questFactor = 2;
    questTarget = currentDivisor * 2;
    shields = 3;
    consecutiveCorrect = 0;
    bossActive = false;
    boss = null;
    gamePaused = false;
    gameCleared = false;
    mistakesMade = 0;
    totalCaptures = 0;
    stasisFactor = 1.0;
    lastMoveTimestamp = performance.now();

    supernovas = [];
    floatingTexts = [];
    shockwaves = [];
    chainHighlightSpheres.clear();

    const overlay = document.getElementById('quantumDivisorGameOverlay');
    if (!overlay) return;

    overlay.style.display = 'block';
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('qg-game-active');

    canvas = document.getElementById('quantumDivisorCanvas');
    if (canvas) {
      ctx = canvas.getContext('2d');
      resizeCanvas();
    }

    // Generate Background Cosmic Dust
    cosmicDust = [];
    for (let d = 0; d < 80; d++) {
      cosmicDust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.8 + Math.random() * 1.6,
        speed: 0.2 + Math.random() * 0.5
      });
    }

    initAudio();
    initSpheres();
    updateHUD();

    // Reset modals
    const revModal = document.getElementById('qGameReviveModal');
    if (revModal) revModal.style.display = 'none';
    const vicModal = document.getElementById('qDivisorVictoryModal');
    if (vicModal) vicModal.style.display = 'none';

    if (animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(loop);
  }

  function exit() {
    activeGame = null;
    gamePaused = true;
    if (animationId) cancelAnimationFrame(animationId);

    const overlay = document.getElementById('quantumDivisorGameOverlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('qg-game-active');

    const revModal = document.getElementById('qGameReviveModal');
    if (revModal) revModal.style.display = 'none';
    const vicModal = document.getElementById('qDivisorVictoryModal');
    if (vicModal) vicModal.style.display = 'none';
    const inspectCard = document.getElementById('qGameTeleInspectCard');
    if (inspectCard) inspectCard.style.display = 'none';
  }

  function resizeCanvas() {
    if (!canvas) return;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function onMouseMove(e) {
    cursor.targetX = e.clientX;
    cursor.targetY = e.clientY;
    cursor.active = true;
    lastMoveTimestamp = performance.now();
  }

  function onTouchMove(e) {
    if (e.touches && e.touches[0]) {
      cursor.targetX = e.touches[0].clientX;
      cursor.targetY = e.touches[0].clientY;
      cursor.active = true;
      lastMoveTimestamp = performance.now();
    }
  }

  function onTouchStart(e) {
    initAudio();
    if (e.touches && e.touches[0]) {
      cursor.x = e.touches[0].clientX;
      cursor.y = e.touches[0].clientY;
      cursor.targetX = e.touches[0].clientX;
      cursor.targetY = e.touches[0].clientY;
      cursor.active = true;
      lastMoveTimestamp = performance.now();
      triggerRemoteAbsorption();
    }
  }

  function onCanvasClick(e) {
    initAudio();
    triggerRemoteAbsorption();
  }

  function onKeyDown(e) {
    if (!activeGame) return;
    if (e.key === 'Escape') {
      exit();
    } else if (e.key === 'm' || e.key === 'M') {
      audioMuted = !audioMuted;
      updateAudioToggleBtn();
    } else if (e.key === 'f' || e.key === 'F') {
      toggleGameFullscreen();
    } else if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      triggerRemoteAbsorption();
    } else if (e.key === 'v' || e.key === 'V') {
      cycleWisdomVision();
    } else if (e.key === 't' || e.key === 'T') {
      triggerRemainderTransmutation();
    }
  }

  function cycleWisdomVision() {
    if (wisdomVisionMode === 'ALL') wisdomVisionMode = 'PARITY';
    else if (wisdomVisionMode === 'PARITY') wisdomVisionMode = 'DIGIT_SUM';
    else wisdomVisionMode = 'ALL';

    const btn = document.getElementById('qGameWisdomVisionBtn');
    if (btn) {
      if (wisdomVisionMode === 'ALL') btn.textContent = '👁️ ALL';
      else if (wisdomVisionMode === 'PARITY') btn.textContent = '👁️ PARITY';
      else btn.textContent = '👁️ DIGIT-SUM';
    }
    playTone(660, 0.15, 'sine', 0.12);
  }

  function toggleGameFullscreen() {
    const overlay = document.getElementById('quantumDivisorGameOverlay');
    if (!document.fullscreenElement) {
      if (overlay && overlay.requestFullscreen) overlay.requestFullscreen().catch(() => {});
      else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    }
  }

  function updateAudioToggleBtn() {
    const btn = document.getElementById('qGameAudioToggleBtn');
    if (btn) btn.textContent = audioMuted ? '🔇 Sound: OFF' : '🔊 Sound: ON';
  }

  // DOM Bindings Initialization
  function initDOMBindings() {
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('keydown', onKeyDown);

    const canvasEl = document.getElementById('quantumDivisorCanvas');
    if (canvasEl) {
      canvasEl.addEventListener('mousemove', onMouseMove);
      canvasEl.addEventListener('touchmove', onTouchMove, { passive: true });
      canvasEl.addEventListener('touchstart', onTouchStart, { passive: true });
      canvasEl.addEventListener('click', onCanvasClick);
    }

    const closeBtn = document.getElementById('qGameCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', exit);

    const audioBtn = document.getElementById('qGameAudioToggleBtn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        initAudio();
        audioMuted = !audioMuted;
        updateAudioToggleBtn();
      });
    }

    const fsBtn = document.getElementById('qGameFullscreenBtn');
    if (fsBtn) fsBtn.addEventListener('click', toggleGameFullscreen);

    const visionBtn = document.getElementById('qGameWisdomVisionBtn');
    if (visionBtn) visionBtn.addEventListener('click', cycleWisdomVision);

    const absorbBtn = document.getElementById('qInspectAbsorbBtn');
    if (absorbBtn) absorbBtn.addEventListener('click', triggerRemoteAbsorption);

    const transmuteBtn = document.getElementById('qInspectTransmuteBtn');
    if (transmuteBtn) transmuteBtn.addEventListener('click', triggerRemainderTransmutation);

    // Revive Modal Actions
    const rebootBtn = document.getElementById('qReviveRebootBtn');
    if (rebootBtn) {
      rebootBtn.addEventListener('click', () => {
        shields = 3;
        gamePaused = false;
        const revModal = document.getElementById('qGameReviveModal');
        if (revModal) revModal.style.display = 'none';
        updateHUD();
      });
    }

    const retryBtn = document.getElementById('qReviveRetryBtn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        launch(currentDivisor);
      });
    }

    // Victory Modal Actions
    const vicNextBtn = document.getElementById('qVictoryNextBtn');
    if (vicNextBtn) {
      vicNextBtn.addEventListener('click', () => {
        const order = [6, 7, 8, 9, 12, 13];
        const nextIdx = (order.indexOf(currentDivisor) + 1) % order.length;
        launch(order[nextIdx]);
      });
    }

    const vicCloseBtn = document.getElementById('qVictoryCloseBtn');
    if (vicCloseBtn) vicCloseBtn.addEventListener('click', exit);

    // Header & Spotlight Launcher Buttons: [ 6 ] [ 7 ] [ 8 ] [ 9 ] [ 12 ] [ 13 ]
    const launcherBtns = document.querySelectorAll('[data-divisor-launch], .qgame-btn-launch, .qg-header-pill');
    launcherBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const raw = btn.getAttribute('data-divisor-launch') || btn.getAttribute('data-divisor');
        const divNum = parseInt(raw, 10) || 6;
        launch(divNum);
      });
    });

    // In-game Divisor Tabs: [6] [7] [8] [9] [12] [13]
    const tabBtns = document.querySelectorAll('.qg-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const divNum = parseInt(btn.getAttribute('data-divisor'), 10) || 6;
        launch(divNum);
      });
    });

    // Global Event Delegation fallback for any divisor launcher button
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-divisor-launch], .qgame-btn-launch');
      if (target) {
        e.preventDefault();
        const divNum = parseInt(target.getAttribute('data-divisor-launch') || target.getAttribute('data-divisor'), 10) || 6;
        launch(divNum);
      }
    });
  }

  // Run DOM initialization on DOMContentLoaded or immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDOMBindings);
  } else {
    initDOMBindings();
  }

  // Expose Global Public APIs on window (supporting both QuantumDivisorGame and QuantumDivisorArcade)
  const publicAPI = {
    launch: launch,
    exit: exit,
    setDivisor: (n) => launch(n),
    getDivisors: () => Object.keys(GAME_CONFIGS).map(Number)
  };
  window.QuantumDivisorGame = publicAPI;
  window.QuantumDivisorArcade = publicAPI;

})();
