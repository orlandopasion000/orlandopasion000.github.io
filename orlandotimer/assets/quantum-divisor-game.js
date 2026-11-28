/**
 * Quantum Divisor Arcade — Grand Cosmic Mathematical Odyssey (v2.0)
 * Fusion of God-Tier VFX: [ DYNAMO ] [ HELIX ] [ METEOR ] [ COMET ] [ ORB ] [ MOLTEN ]
 * Featuring 6 Interactive Celestial Multiplication & Divisibility Games:
 * [ 6 ]  [ 7 ]  [ 8 ]  [ 9 ]  [ 12 ]  [ 13 ]
 *
 * Integrated Classroom Pedagogical Enhancements:
 * 1. Target Term Quest Engine (Active Multiplication Prompts e.g. "6 × 4 = ? [Find 24]")
 * 2. 3 Quantum Shields with Educational Remainder Feedback & Friendly Revive Reboot
 * 3. Titan 10th-Term Boss Encounter (Multi-Shield Climax at N × 10)
 * 4. Optimized 20 Roaming 3D Glassmorphic Spheres for clear observation
 * 5. High-speed 60fps HTML5 Canvas physics + Real-time Web Audio Synthesizer
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
      nonMultiplesPool: [20, 24, 28, 30, 35, 40, 42, 45, 48, 50, 55, 60, 68, 70, 72, 75, 80, 82, 85, 88, 95, 100, 105, 110, 112, 120, 125, 132],
      palette: {
        primary: '#f43f5e', // Supercritical Ruby
        secondary: '#fde047', // Core Gold
        aura: 'rgba(244, 63, 94, 0.45)',
        coreGradStart: '#e11d48',
        coreGradEnd: '#4c0519',
        ringColor: '#fde047',
        bohrRingA: '#fb7185',
        bohrRingB: '#fde047',
        particleHue: 350,
        lightningColor: '#ffe4e6'
      }
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // 2. SYNTHESIZED WEB AUDIO ENGINE (ZERO EXTERNAL DEPENDENCY)
  // ══════════════════════════════════════════════════════════════════════════
  let audioCtx = null;
  let audioMuted = false;

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
    if (audioMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playCriticalChord(multiplier = 1) {
    if (audioMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const baseFreq = 440 * (1 + (multiplier - 1) * 0.08);
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];
      notes.forEach((f, idx) => {
        setTimeout(() => {
          playTone(f, 0.32, 'triangle', 0.16);
        }, idx * 45);
      });
    } catch (e) {}
  }

  function playErrorTone() {
    if (audioMuted) return;
    playTone(180, 0.25, 'sawtooth', 0.12);
  }

  function playBossStrikeTone(locksRemaining) {
    if (audioMuted) return;
    const base = 220 + (3 - locksRemaining) * 110;
    playTone(base, 0.45, 'triangle', 0.22);
    playTone(base * 1.5, 0.45, 'sawtooth', 0.15);
  }

  function playVictoryFanfare() {
    if (audioMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50, 1318.51];
      const times = [0, 120, 240, 360, 520, 680, 840];
      notes.forEach((f, i) => {
        setTimeout(() => {
          playTone(f, 0.35, 'triangle', 0.18);
        }, times[i]);
      });
    } catch (e) {}
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 3. GAME STATE & SPHERE ENGINE
  // ══════════════════════════════════════════════════════════════════════════
  let activeGame = null;
  let currentDivisor = 6;
  let animationId = null;
  let canvas = null;
  let ctx = null;
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Cursor Tracking
  const cursor = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    radius: 34,
    vx: 0,
    vy: 0,
    active: false
  };

  // 20 Roaming Spheres
  const TOTAL_SPHERES = 20;
  let spheres = [];

  // Particles & Visual Shockwaves
  let particles = [];
  let shockwaves = [];
  let floatingTexts = [];

  // Game Progress & Feature 1 (Target Term Quest)
  let questFactor = 2; // Active multiplier challenge (2..9)
  let questTarget = 12; // currentDivisor * questFactor
  let uncompletedFactors = [];
  let caughtMultiples = new Set();
  let score = 0;
  let combo = 1;
  let consecutiveCorrect = 0;

  // Feature 4 (3 Shields & Remainder Feedback)
  let shields = 3;
  let remainderToastTimeout = null;
  let gamePaused = false;

  // Feature 8 (Titan 10th-Term Boss Encounter)
  let bossActive = false;
  let boss = null;
  let gameCleared = false;

  // ══════════════════════════════════════════════════════════════════════════
  // 4. QUEST & FACTOR MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════
  function advanceQuest() {
    const cfg = GAME_CONFIGS[currentDivisor];
    // Remaining factors to solve before Titan Boss
    uncompletedFactors = cfg.normalFactors.filter(f => !caughtMultiples.has(currentDivisor * f));

    if (uncompletedFactors.length === 0) {
      // All 8 normal terms completed -> Trigger Titan 10th Term Boss!
      triggerTitanBoss();
      return;
    }

    // Set next active quest factor (sequential or lowest remaining for pedagogical rhythm)
    questFactor = uncompletedFactors[0];
    questTarget = currentDivisor * questFactor;

    // Guarantee the active questTarget is present in the floating pool of 20
    ensureTargetInPool(questTarget);
    updateHUD();
  }

  function ensureTargetInPool(targetVal) {
    const hasTarget = spheres.some(s => s.value === targetVal);
    if (!hasTarget && spheres.length > 0) {
      // Replace one non-target sphere with the quest target
      const replaceIdx = spheres.findIndex(s => !s.isTarget);
      if (replaceIdx !== -1) {
        spheres[replaceIdx] = createSphere(targetVal, true);
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 5. SPHERE GENERATION & AUTONOMOUS ROAMING
  // ══════════════════════════════════════════════════════════════════════════
  function createSphere(preferredValue = null, spawnOffscreen = false) {
    const cfg = GAME_CONFIGS[currentDivisor];
    let val = preferredValue;

    if (val === null) {
      const remainingTargets = cfg.normalFactors
        .map(f => currentDivisor * f)
        .filter(m => !caughtMultiples.has(m));

      const currentTargetCount = spheres.filter(s => cfg.targetMultiples.includes(s.value)).length;
      
      // Always prioritize having the active questTarget, plus 3-4 other targets in the 20 pool
      if (remainingTargets.length > 0 && (currentTargetCount < 4 || Math.random() < 0.35)) {
        val = remainingTargets[Math.floor(Math.random() * remainingTargets.length)];
      } else {
        const pool = cfg.nonMultiplesPool;
        val = pool[Math.floor(Math.random() * pool.length)];
      }
    }

    const radius = Math.max(22, Math.min(28, width * 0.024));
    let x, y;

    if (spawnOffscreen) {
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) { x = Math.random() * width; y = -radius - 10; }
      else if (edge === 1) { x = width + radius + 10; y = Math.random() * height; }
      else if (edge === 2) { x = Math.random() * width; y = height + radius + 10; }
      else { x = -radius - 10; y = Math.random() * height; }
    } else {
      const cx = width / 2;
      const cy = height / 2;
      do {
        x = radius + Math.random() * (width - radius * 2);
        y = 120 + radius + Math.random() * (height - 140 - radius * 2);
      } while (Math.hypot(x - cx, y - cy) < 140);
    }

    const speed = 0.7 + Math.random() * 1.3;
    const angle = Math.random() * Math.PI * 2;
    const isTarget = cfg.targetMultiples.includes(val);

    return {
      value: val,
      isTarget: isTarget,
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: radius,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      pulsePhase: Math.random() * Math.PI * 2,
      scale: 1,
      deflectTimer: 0
    };
  }

  function initSpheres() {
    spheres = [];
    const cfg = GAME_CONFIGS[currentDivisor];

    // Seed active quest target first
    spheres.push(createSphere(questTarget, false));

    // Seed 3 other distinct normal multiples
    const otherTargets = cfg.normalFactors
      .map(f => currentDivisor * f)
      .filter(m => m !== questTarget);
    otherTargets.sort(() => Math.random() - 0.5);

    for (let i = 0; i < 3 && i < otherTargets.length; i++) {
      spheres.push(createSphere(otherTargets[i], false));
    }

    // Fill remainder up to TOTAL_SPHERES (20 spheres roaming)
    while (spheres.length < TOTAL_SPHERES) {
      spheres.push(createSphere(null, false));
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 6. GRAPHICS RENDERING ENGINE
  // ══════════════════════════════════════════════════════════════════════════

  // Draw 3D Glassmorphic Number Sphere
  function drawSphere(s, time) {
    const cfg = GAME_CONFIGS[currentDivisor];
    const isQuestTarget = s.value === questTarget;
    const isTarget = s.isTarget;

    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.scale(s.scale, s.scale);

    const r = s.radius;
    const pulse = Math.sin(time * 0.003 + s.pulsePhase) * 1.5;

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

    // 2. 3D Volumetric Sphere Body (Off-center light source)
    const sphereGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
    if (isQuestTarget) {
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.25, '#fbbf24');
      sphereGrad.addColorStop(0.75, '#b45309');
      sphereGrad.addColorStop(1, '#050c1a');
    } else if (isTarget) {
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.2, cfg.palette.primary);
      sphereGrad.addColorStop(0.75, cfg.palette.coreGradStart);
      sphereGrad.addColorStop(1, '#050c1a');
    } else {
      sphereGrad.addColorStop(0, '#cbd5e1');
      sphereGrad.addColorStop(0.25, '#475569');
      sphereGrad.addColorStop(0.8, '#1e293b');
      sphereGrad.addColorStop(1, '#020617');
    }
    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r + pulse * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // 3. Glowing Perimeter Ring
    ctx.lineWidth = isQuestTarget ? 3 : (isTarget ? 2 : 1.2);
    ctx.strokeStyle = isQuestTarget ? '#fde047' : (isTarget ? cfg.palette.secondary : 'rgba(148, 163, 184, 0.35)');
    ctx.beginPath();
    ctx.arc(0, 0, r + pulse * 0.3, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Rotating Bohr Orbit with Sparkle for Targets
    if (isTarget) {
      ctx.save();
      ctx.rotate(s.rotation);
      ctx.strokeStyle = isQuestTarget ? 'rgba(254, 240, 138, 0.85)' : 'rgba(254, 240, 138, 0.45)';
      ctx.lineWidth = isQuestTarget ? 1.5 : 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.3, r * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Electron Sparkle
      const ex = Math.cos(time * 0.005 + s.pulsePhase) * r * 1.3;
      const ey = Math.sin(time * 0.005 + s.pulsePhase) * r * 0.55;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex, ey, isQuestTarget ? 3.2 : 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 5. Specular Gloss Reflection (Top-Left Apple-Glass Arch)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(-r * 0.32, -r * 0.38, r * 0.55, r * 0.28, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.fill();
    ctx.restore();

    // 6. Centered Crisp Typography
    ctx.font = `800 ${Math.round(r * 0.88)}px 'Lexend', 'Chakra Petch', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(String(s.value), 0, 1);
    ctx.fillStyle = isQuestTarget ? '#ffffff' : (isTarget ? '#ffffff' : '#f1f5f9');
    ctx.fillText(String(s.value), 0, 1);

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

    // 3. ORB: 3D Multi-Ring Bohr Orbits (Golden & Neon Bands)
    const bohrRings = [
      { rx: r * 1.85, ry: r * 0.75, angle: time * 0.0018, color: cfg.palette.bohrRingA },
      { rx: r * 1.85, ry: r * 0.75, angle: -time * 0.0022 + 1.2, color: cfg.palette.bohrRingB },
      { rx: r * 1.65, ry: r * 0.95, angle: time * 0.0015 + 2.4, color: cfg.palette.primary }
    ];

    bohrRings.forEach(ring => {
      ctx.save();
      ctx.rotate(ring.angle);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = ring.color;
      ctx.shadowBlur = 9;
      ctx.beginPath();
      ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
      ctx.stroke();

      const nx = Math.cos(time * 0.004) * ring.rx;
      const ny = Math.sin(time * 0.004) * ring.ry;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(nx, ny, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 4. METEOR & MOLTEN: Solar Corona Flare Beams
    const coronaGrad = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 2.2);
    coronaGrad.addColorStop(0, cfg.palette.aura);
    coronaGrad.addColorStop(0.6, 'rgba(251, 191, 36, 0.18)');
    coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coronaGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. Central Gravitational Core Sphere
    const coreGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.25, cfg.palette.primary);
    coreGrad.addColorStop(0.75, cfg.palette.coreGradStart);
    coreGrad.addColorStop(1, cfg.palette.coreGradEnd);
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Specular Crescent Arc
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(-r * 0.35, -r * 0.38, r * 0.5, r * 0.22, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fill();
    ctx.restore();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = cfg.palette.secondary;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();

    // Grand Numeral
    ctx.font = `900 ${Math.round(r * 1.05)}px 'Lexend', 'Chakra Petch', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(String(currentDivisor), 0, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(String(currentDivisor), 0, 2);

    ctx.restore();
  }

  // Draw Titan Boss Sphere (Feature 8)
  function drawTitanBoss(time) {
    if (!bossActive || !boss) return;

    ctx.save();
    ctx.translate(boss.x, boss.y);

    const r = boss.radius;
    boss.angle += 0.012;

    // 1. Massive Solar Ejecta Corona
    const coronaGrad = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 2.2);
    coronaGrad.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
    coronaGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.35)');
    coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coronaGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // 2. Revolving Concentric Energy Shield Locks (1 for each remaining HP)
    for (let l = 0; l < boss.hp; l++) {
      ctx.save();
      ctx.rotate(boss.angle * (l % 2 === 0 ? 1 : -1) + l * 1.2);
      ctx.strokeStyle = l === 0 ? '#ef4444' : (l === 1 ? '#f59e0b' : '#fde047');
      ctx.lineWidth = 3.5;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * (1.3 + l * 0.22), r * (0.65 + l * 0.15), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Volcanic Molten Core Sphere
    const coreGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.2, '#fde047');
    coreGrad.addColorStop(0.6, '#ea580c');
    coreGrad.addColorStop(1, '#450a0a');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // 4. Gold Outer Border
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Titan Numeral (e.g. 60, 70, 80, 90, 120, 130)
    ctx.font = `900 ${Math.round(r * 0.72)}px 'Lexend', 'Chakra Petch', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(String(boss.value), 0, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(String(boss.value), 0, 2);

    ctx.restore();
  }

  // Draw Parallax Nebula Background
  function drawBackground() {
    const cfg = GAME_CONFIGS[currentDivisor];
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    const grad1 = ctx.createRadialGradient(width * 0.25, height * 0.35, 50, width * 0.25, height * 0.35, width * 0.6);
    grad1.addColorStop(0, bossActive ? 'rgba(239, 68, 68, 0.25)' : cfg.palette.aura);
    grad1.addColorStop(1, 'rgba(3, 7, 18, 0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 7. PARTICLES & FLOATING LABELS
  // ══════════════════════════════════════════════════════════════════════════
  function spawnSupernova(x, y, count = 35) {
    const cfg = GAME_CONFIGS[currentDivisor];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3.5,
        color: Math.random() < 0.6 ? cfg.palette.primary : cfg.palette.secondary,
        life: 1,
        decay: 0.015 + Math.random() * 0.02
      });
    }

    shockwaves.push({
      x: x,
      y: y,
      radius: 10,
      maxRadius: 85,
      color: cfg.palette.secondary,
      life: 1,
      decay: 0.025
    });
  }

  function spawnDeflectionWave(x, y) {
    shockwaves.push({
      x: x,
      y: y,
      radius: 12,
      maxRadius: 65,
      color: '#ef4444',
      life: 1,
      decay: 0.04
    });
  }

  function spawnFloatingText(text, x, y, color = '#fef08a', fontSize = 16) {
    floatingTexts.push({
      text: text,
      x: x,
      y: y,
      vy: -1.2,
      life: 1,
      decay: 0.018,
      color: color,
      fontSize: fontSize
    });
  }

  function updateAndDrawFX() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += (sw.maxRadius - sw.radius) * 0.12;
      sw.life -= sw.decay;

      if (sw.life <= 0) {
        shockwaves.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = sw.life;
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 3.5 * sw.life;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y += ft.vy;
      ft.life -= ft.decay;

      if (ft.life <= 0) {
        floatingTexts.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = ft.life;
      ctx.font = `800 ${ft.fontSize}px 'Lexend', 'Chakra Petch', sans-serif`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#000000';
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 8. COLLISION DETECTION & CLASSROOM LOGIC
  // ══════════════════════════════════════════════════════════════════════════
  function checkCollisions() {
    if (gameCleared || gamePaused) return;

    // A. Boss Encounter Collision
    if (bossActive && boss) {
      const dist = Math.hypot(cursor.x - boss.x, cursor.y - boss.y);
      if (dist < cursor.radius + boss.radius) {
        handleBossStrike();
      }
      return;
    }

    // B. Normal Roaming Spheres Collision
    const hitRadius = cursor.radius + 16;
    for (let i = spheres.length - 1; i >= 0; i--) {
      const s = spheres[i];
      const dist = Math.hypot(cursor.x - s.x, cursor.y - s.y);

      if (dist < hitRadius + s.radius) {
        if (s.value === questTarget) {
          // ── 1. ACTIVE QUEST TARGET HIT! (CRITICAL STRIKE) ──
          handleQuestTargetHit(s, i);
        } else if (s.isTarget) {
          // ── 2. VALID MULTIPLE, BUT NOT CURRENT QUEST ──
          handleSecondaryMultipleHit(s, i);
        } else {
          // ── 3. NON-DIVISIBLE HIT (REMAINDER FEEDBACK & SHIELD LOSS) ──
          handleNonDivisibleHit(s);
        }
        break;
      }
    }
  }

  function handleQuestTargetHit(s, index) {
    const val = s.value;
    const factor = questFactor;

    spawnSupernova(s.x, s.y, 45);
    playCriticalChord(combo);

    caughtMultiples.add(val);
    score += 300 * combo;
    combo = Math.min(10, combo + 1);
    consecutiveCorrect++;

    // Shield Restoration on consecutive correct catches
    if (consecutiveCorrect >= 2 && shields < 3) {
      shields++;
      consecutiveCorrect = 0;
      spawnFloatingText(`Shield Restored! +1 🛡️`, cursor.x, cursor.y - 40, '#4ade80', 16);
      playTone(880, 0.25, 'triangle', 0.15);
    }

    spawnFloatingText(`CRITICAL HIT! +${300 * combo}  ${currentDivisor} × ${factor} = ${val}!`, s.x, s.y, '#fef08a', 18);

    // Replace sphere
    spheres.splice(index, 1);
    spheres.push(createSphere(null, true));

    advanceQuest();
  }

  function handleSecondaryMultipleHit(s, index) {
    const val = s.value;
    const factor = Math.round(val / currentDivisor);

    spawnSupernova(s.x, s.y, 25);
    playTone(587.33, 0.2, 'triangle', 0.12);

    caughtMultiples.add(val);
    score += 100 * combo;

    spawnFloatingText(`+${100 * combo}! Good Multiple (${val}), but Target Quest was ${currentDivisor} × ${questFactor} = ${questTarget}!`, s.x, s.y, '#38bdf8', 14);

    spheres.splice(index, 1);
    spheres.push(createSphere(null, true));

    advanceQuest();
  }

  function handleNonDivisibleHit(s) {
    if (s.deflectTimer > 0) return;

    const quotient = Math.floor(s.value / currentDivisor);
    const rem = s.value % currentDivisor;

    const angle = Math.atan2(s.y - cursor.y, s.x - cursor.x);
    s.vx = Math.cos(angle) * 7;
    s.vy = Math.sin(angle) * 7;
    s.deflectTimer = 35;

    spawnDeflectionWave(s.x, s.y);
    playErrorTone();

    shields--;
    combo = 1;
    consecutiveCorrect = 0;

    // Show Educational Remainder Toast (Feature 4)
    showRemainderToast(s.value, quotient, rem);
    updateHUD();

    if (shields <= 0) {
      triggerReviveModal();
    }
  }

  function showRemainderToast(val, quotient, rem) {
    const toast = document.getElementById('qGameRemainderToast');
    const titleEl = document.getElementById('qRemainderTitle');
    const mathEl = document.getElementById('qRemainderMath');
    const explainEl = document.getElementById('qRemainderExplain');

    if (toast && mathEl && explainEl) {
      if (titleEl) titleEl.textContent = `NOT DIVISIBLE BY ${currentDivisor}!`;
      mathEl.textContent = `${val} ÷ ${currentDivisor} = ${quotient} with Remainder ${rem}`;
      explainEl.textContent = `Because ${currentDivisor} × ${quotient} = ${currentDivisor * quotient} (+ ${rem} = ${val})`;

      toast.style.display = 'flex';
      if (remainderToastTimeout) clearTimeout(remainderToastTimeout);
      remainderToastTimeout = setTimeout(() => {
        toast.style.display = 'none';
      }, 2200);
    }
  }

  // Feature 4: Friendly Quantum Reboot Revive Prompt
  function triggerReviveModal() {
    gamePaused = true;
    const modal = document.getElementById('qGameReviveModal');
    const qEl = document.getElementById('qReviveQuestion');
    const optContainer = document.getElementById('qReviveOptions');

    if (!modal || !qEl || !optContainer) return;

    const reviveFactor = 2 + Math.floor(Math.random() * 8);
    const correctAns = currentDivisor * reviveFactor;
    const wrongA = correctAns + (Math.random() < 0.5 ? 2 : -2);
    const wrongB = correctAns + (Math.random() < 0.5 ? 4 : -3);

    const options = [correctAns, wrongA, wrongB].sort(() => Math.random() - 0.5);

    qEl.textContent = `${currentDivisor} × ${reviveFactor} = ?`;

    let html = '';
    options.forEach(opt => {
      html += `<button type="button" class="qg-revive-btn" data-revive-ans="${opt}">${opt}</button>`;
    });
    optContainer.innerHTML = html;

    optContainer.querySelectorAll('.qg-revive-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = parseInt(btn.getAttribute('data-revive-ans'), 10);
        if (chosen === correctAns) {
          shields = 2;
          gamePaused = false;
          modal.style.display = 'none';
          playCriticalChord(1);
          spawnFloatingText('SHIELDS RESTORED! RESUMING...', width / 2, height / 2, '#4ade80', 22);
          updateHUD();
        } else {
          playErrorTone();
          btn.style.borderColor = '#ef4444';
          btn.style.color = '#f87171';
        }
      });
    });

    modal.style.display = 'flex';
  }

  // Feature 8: Titan 10th-Term Boss Encounter
  function triggerTitanBoss() {
    bossActive = true;
    const cfg = GAME_CONFIGS[currentDivisor];

    // Fade/clear regular spheres
    spheres = [];

    // Initialize Titan Boss
    boss = {
      x: width / 2,
      y: height * 0.35,
      vx: 1.2,
      vy: 0.8,
      radius: Math.max(68, Math.min(85, width * 0.065)),
      hp: 3,
      maxHp: 3,
      value: cfg.titanMultiple,
      angle: 0
    };

    // Play Alert Sound
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

    // Deflect boss slightly away from cursor
    const angle = Math.atan2(boss.y - cursor.y, boss.x - cursor.x);
    boss.vx = Math.cos(angle) * 4;
    boss.vy = Math.sin(angle) * 4;

    updateHUD();

    if (boss.hp <= 0) {
      // TITAN DEFEATED!
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

      if (titleEl) titleEl.textContent = `DIVISOR ${currentDivisor} & TITAN ${cfg.titanMultiple} DEFEATED!`;
      if (scoreEl) scoreEl.textContent = `Final Score: ${score.toLocaleString()} Points · 100% Accuracy`;

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

      modal.style.display = 'flex';
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 9. HUD MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════
  function updateHUD() {
    const cfg = GAME_CONFIGS[currentDivisor];

    // 1. Feature 1: Target Term Quest Strip
    const questStrip = document.getElementById('qGameQuestStrip');
    const questFormulaEl = document.getElementById('qGameQuestFormula');
    const questHintEl = document.getElementById('qGameQuestHint');

    if (bossActive) {
      if (questStrip) questStrip.style.display = 'none';
    } else {
      if (questStrip) questStrip.style.display = 'flex';
      if (questFormulaEl) questFormulaEl.textContent = `${currentDivisor} × ${questFactor} = ?`;
      if (questHintEl) questHintEl.textContent = `[Find ${questTarget}]`;
    }

    // 2. Feature 4: 3 Shields Display
    for (let i = 1; i <= 3; i++) {
      const shieldEl = document.getElementById(`qShield${i}`);
      if (shieldEl) {
        shieldEl.classList.toggle('lost', i > shields);
      }
    }

    // 3. Feature 8: Titan Boss Strip
    const bossStrip = document.getElementById('qGameBossStrip');
    const bossNameEl = document.getElementById('qGameBossName');
    const bossFillEl = document.getElementById('qGameBossHpFill');
    const bossTextEl = document.getElementById('qGameBossHpText');

    if (bossActive && boss) {
      if (bossStrip) bossStrip.style.display = 'flex';
      if (bossNameEl) bossNameEl.textContent = `TITAN ${boss.value} (${currentDivisor} × 10)`;
      if (bossFillEl) bossFillEl.style.width = `${(boss.hp / boss.maxHp) * 100}%`;
      if (bossTextEl) bossTextEl.textContent = `${boss.hp} / ${boss.maxHp} LOCKS`;
    } else {
      if (bossStrip) bossStrip.style.display = 'none';
    }

    // 4. Checklist Row (All 9 Multiples)
    const checklistEl = document.getElementById('qGameChecklistRow');
    if (checklistEl) {
      let html = '';
      cfg.targetMultiples.forEach(m => {
        const isCaught = caughtMultiples.has(m);
        const isQuestTarget = m === questTarget && !bossActive;
        const isTitan = m === cfg.titanMultiple;
        html += `
          <div class="qg-check-pill ${isCaught ? 'caught' : ''} ${isQuestTarget ? 'active-quest' : ''}" data-target="${m}">
            <span class="qg-pill-num">${m}</span>
            <span class="qg-pill-check">${isCaught ? '✓' : (isTitan ? '👑' : '')}</span>
          </div>
        `;
      });
      checklistEl.innerHTML = html;
    }

    // Metrics
    const scoreValEl = document.getElementById('qGameScoreVal');
    if (scoreValEl) scoreValEl.textContent = score.toLocaleString();

    const comboValEl = document.getElementById('qGameComboVal');
    if (comboValEl) comboValEl.textContent = `x${combo}`;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 10. ANIMATION LOOP
  // ══════════════════════════════════════════════════════════════════════════
  function loop(time) {
    if (!activeGame) return;

    if (!gamePaused) {
      ctx.clearRect(0, 0, width, height);
      drawBackground();

      // Update & Draw Boss (if active)
      if (bossActive && boss) {
        boss.x += boss.vx;
        boss.y += boss.vy;

        if (boss.x - boss.radius < 0 || boss.x + boss.radius > width) boss.vx = -boss.vx;
        if (boss.y - boss.radius < 110 || boss.y + boss.radius > height) boss.vy = -boss.vy;

        drawTitanBoss(time);
      } else {
        // Normal 20 Roaming Spheres
        const topMargin = 110;
        for (let i = 0; i < spheres.length; i++) {
          const s = spheres[i];
          s.x += s.vx;
          s.y += s.vy;
          s.rotation += s.rotSpeed;

          if (s.deflectTimer > 0) {
            s.deflectTimer--;
            s.vx *= 0.95;
            s.vy *= 0.95;
          }

          if (s.x - s.radius < 0) { s.x = s.radius; s.vx = Math.abs(s.vx); }
          else if (s.x + s.radius > width) { s.x = width - s.radius; s.vx = -Math.abs(s.vx); }

          if (s.y - s.radius < topMargin) { s.y = topMargin + s.radius; s.vy = Math.abs(s.vy); }
          else if (s.y + s.radius > height) { s.y = height - s.radius; s.vy = -Math.abs(s.vy); }

          drawSphere(s, time);
        }
      }

      checkCollisions();
      updateAndDrawFX();
      drawCursor(time);
    }

    animationId = requestAnimationFrame(loop);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 11. PUBLIC CONTROLS & LIFECYCLE
  // ══════════════════════════════════════════════════════════════════════════
  function launch(divisorNum = 6) {
    initAudio();

    if (!GAME_CONFIGS[divisorNum]) divisorNum = 6;
    currentDivisor = divisorNum;
    caughtMultiples.clear();
    score = 0;
    combo = 1;
    consecutiveCorrect = 0;
    shields = 3;
    gameCleared = false;
    gamePaused = false;
    bossActive = false;
    boss = null;
    particles = [];
    shockwaves = [];
    floatingTexts = [];

    const overlay = document.getElementById('quantumDivisorGameOverlay');
    if (!overlay) return;

    overlay.style.display = 'block';
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('qgame-active');

    canvas = document.getElementById('quantumDivisorCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    advanceQuest();
    initSpheres();
    updateHUD();

    document.querySelectorAll('.qg-tab-btn').forEach(btn => {
      const d = parseInt(btn.getAttribute('data-divisor'), 10);
      btn.classList.toggle('active', d === currentDivisor);
    });

    const vModal = document.getElementById('qDivisorVictoryModal');
    if (vModal) vModal.style.display = 'none';

    const rModal = document.getElementById('qGameReviveModal');
    if (rModal) rModal.style.display = 'none';

    const toast = document.getElementById('qGameRemainderToast');
    if (toast) toast.style.display = 'none';

    activeGame = true;
    if (animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(loop);
  }

  function exit() {
    activeGame = false;
    if (animationId) cancelAnimationFrame(animationId);

    const overlay = document.getElementById('quantumDivisorGameOverlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('qgame-active');

    window.removeEventListener('resize', resizeCanvas);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('keydown', onKeyDown);
  }

  function resizeCanvas() {
    if (!canvas) return;
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  function onMouseMove(e) {
    cursor.targetX = e.clientX;
    cursor.targetY = e.clientY;
    cursor.active = true;
  }

  function onTouchMove(e) {
    if (e.touches && e.touches.length > 0) {
      e.preventDefault();
      cursor.targetX = e.touches[0].clientX;
      cursor.targetY = e.touches[0].clientY;
      cursor.active = true;
    }
  }

  function onTouchStart(e) {
    if (e.touches && e.touches.length > 0) {
      cursor.targetX = e.touches[0].clientX;
      cursor.targetY = e.touches[0].clientY;
      cursor.x = cursor.targetX;
      cursor.y = cursor.targetY;
      cursor.active = true;
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      exit();
    } else if (e.key === 'm' || e.key === 'M') {
      audioMuted = !audioMuted;
      updateAudioToggleBtn();
    }
  }

  function updateAudioToggleBtn() {
    const btn = document.getElementById('qGameAudioToggleBtn');
    if (btn) {
      btn.innerHTML = audioMuted ? '🔇 Muted' : '🔊 Sound: ON';
      btn.classList.toggle('muted', audioMuted);
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 12. DOM BINDINGS & DELEGATED EVENT ROUTING
  // ══════════════════════════════════════════════════════════════════════════
  function initDOMBindings() {
    document.addEventListener('click', (e) => {
      const launchBtn = e.target.closest('[data-divisor-launch]');
      if (launchBtn) {
        e.preventDefault();
        const d = parseInt(launchBtn.getAttribute('data-divisor-launch'), 10) || 6;
        launch(d);
        return;
      }
      const tabBtn = e.target.closest('.qg-tab-btn');
      if (tabBtn) {
        e.preventDefault();
        const d = parseInt(tabBtn.getAttribute('data-divisor'), 10) || 6;
        launch(d);
        return;
      }
    });

    const closeBtn = document.getElementById('qGameCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', exit);

    const audioBtn = document.getElementById('qGameAudioToggleBtn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        audioMuted = !audioMuted;
        updateAudioToggleBtn();
      });
    }

    const fsBtn = document.getElementById('qGameFullscreenBtn');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    const btnPlayAgain = document.getElementById('qVictoryPlayAgain');
    if (btnPlayAgain) {
      btnPlayAgain.addEventListener('click', () => {
        launch(currentDivisor);
      });
    }

    const btnNextLevel = document.getElementById('qVictoryNextLevel');
    if (btnNextLevel) {
      btnNextLevel.addEventListener('click', () => {
        const order = [6, 7, 8, 9, 12, 13];
        const nextIdx = (order.indexOf(currentDivisor) + 1) % order.length;
        launch(order[nextIdx]);
      });
    }

    const btnVictoryExit = document.getElementById('qVictoryExit');
    if (btnVictoryExit) {
      btnVictoryExit.addEventListener('click', exit);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDOMBindings);
  } else {
    initDOMBindings();
  }

  window.QuantumDivisorGame = {
    launch: launch,
    exit: exit,
    isActive: () => Boolean(activeGame)
  };
})();
