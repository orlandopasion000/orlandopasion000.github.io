/**
 * Quantum Divisor Arcade — Grand Cosmic Mathematical Odyssey
 * Fusion of God-Tier VFX: [ DYNAMO ] [ HELIX ] [ METEOR ] [ COMET ] [ ORB ] [ MOLTEN ]
 * Featuring 6 Interactive Celestial Multiplication & Divisibility Games:
 * [ 6 ]  [ 7 ]  [ 8 ]  [ 9 ]  [ 12 ]  [ 13 ]
 *
 * Rules:
 * - The player's cursor is the Divisor Celestial Core.
 * - Exactly 20 roaming 3D glassmorphic spheres drift freely across the cosmos.
 * - Catch all 9 numbers divisible by the base divisor (from 2nd term up to 10th term).
 * - Avoid numbers that are not divisible by it (gentle deflection + educational guidance).
 * - High-speed 60fps HTML5 Canvas physics + Web Audio melodic synthesizer.
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

  function playSuccessChord(multiplier = 1) {
    if (audioMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const baseFreq = 440 * (1 + (multiplier - 1) * 0.08);
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];
      notes.forEach((f, idx) => {
        setTimeout(() => {
          playTone(f, 0.28, 'triangle', 0.14);
        }, idx * 45);
      });
    } catch (e) {}
  }

  function playErrorTone() {
    if (audioMuted) return;
    playTone(180, 0.25, 'sawtooth', 0.1);
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
    active: false,
    angle: 0
  };

  // 30 Roaming Spheres
  const TOTAL_SPHERES = 20;
  let spheres = [];

  // Particles & Visual Shockwaves
  let particles = [];
  let shockwaves = [];
  let floatingTexts = [];

  // Game Progress
  let caughtMultiples = new Set();
  let score = 0;
  let combo = 1;
  let shields = 3;
  let gameStartTime = 0;
  let gameCleared = false;

  // ══════════════════════════════════════════════════════════════════════════
  // 4. SPHERE GENERATION & AUTONOMOUS ROAMING
  // ══════════════════════════════════════════════════════════════════════════
  function createSphere(preferredValue = null, spawnOffscreen = false) {
    const cfg = GAME_CONFIGS[currentDivisor];
    let val = preferredValue;

    if (val === null) {
      // Choose whether to spawn a remaining target or a distractor
      const remainingTargets = cfg.targetMultiples.filter(m => !caughtMultiples.has(m));
      // Keep about 4-5 target multiples present in the pool of 20
      const currentTargetCount = spheres.filter(s => cfg.targetMultiples.includes(s.value)).length;
      
      if (remainingTargets.length > 0 && (currentTargetCount < 5 || Math.random() < 0.35)) {
        val = remainingTargets[Math.floor(Math.random() * remainingTargets.length)];
      } else {
        const pool = cfg.nonMultiplesPool;
        val = pool[Math.floor(Math.random() * pool.length)];
      }
    }

    const radius = Math.max(22, Math.min(30, width * 0.024));
    let x, y;

    if (spawnOffscreen) {
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) { x = Math.random() * width; y = -radius - 10; }
      else if (edge === 1) { x = width + radius + 10; y = Math.random() * height; }
      else if (edge === 2) { x = Math.random() * width; y = height + radius + 10; }
      else { x = -radius - 10; y = Math.random() * height; }
    } else {
      // Safe initial spawn away from center cursor
      const cx = width / 2;
      const cy = height / 2;
      do {
        x = radius + Math.random() * (width - radius * 2);
        y = 90 + radius + Math.random() * (height - 110 - radius * 2);
      } while (Math.hypot(x - cx, y - cy) < 140);
    }

    const speed = 0.75 + Math.random() * 1.4;
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
      rotSpeed: (Math.random() - 0.5) * 0.025,
      pulsePhase: Math.random() * Math.PI * 2,
      opacity: 1,
      scale: 1,
      isDeflected: false,
      deflectTimer: 0
    };
  }

  function initSpheres() {
    spheres = [];
    const cfg = GAME_CONFIGS[currentDivisor];

    // Ensure at least 6 distinct remaining target multiples are seeded
    const targetCopy = [...cfg.targetMultiples];
    targetCopy.sort(() => Math.random() - 0.5);

    for (let i = 0; i < 6 && i < targetCopy.length; i++) {
      spheres.push(createSphere(targetCopy[i], false));
    }

    // Fill the remainder up to TOTAL_SPHERES (20 spheres roaming)
    while (spheres.length < TOTAL_SPHERES) {
      spheres.push(createSphere(null, false));
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 5. GRAPHICS RENDERING ENGINE
  // ══════════════════════════════════════════════════════════════════════════

  // Draw 3D Glassmorphic Number Sphere
  function drawSphere(s, time) {
    const cfg = GAME_CONFIGS[currentDivisor];
    const isTarget = s.isTarget;

    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.scale(s.scale, s.scale);

    const r = s.radius;
    const pulse = Math.sin(time * 0.003 + s.pulsePhase) * 1.5;

    // 1. Ambient Outer Halo
    const haloGrad = ctx.createRadialGradient(0, 0, r * 0.6, 0, 0, r * 1.55);
    if (isTarget) {
      haloGrad.addColorStop(0, cfg.palette.aura);
      haloGrad.addColorStop(0.7, 'rgba(251, 191, 36, 0.22)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      haloGrad.addColorStop(0, 'rgba(148, 163, 184, 0.22)');
      haloGrad.addColorStop(0.8, 'rgba(51, 65, 85, 0.12)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.55, 0, Math.PI * 2);
    ctx.fill();

    // 2. 3D Volumetric Sphere Body (Off-center light source)
    const sphereGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
    if (isTarget) {
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
    ctx.lineWidth = isTarget ? 2.2 : 1.2;
    ctx.strokeStyle = isTarget ? cfg.palette.secondary : 'rgba(148, 163, 184, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, r + pulse * 0.3, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Subtle Rotating Bohr Orbit with Sparkle for Targets
    if (isTarget) {
      ctx.save();
      ctx.rotate(s.rotation);
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.25, r * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Electron Sparkle
      const ex = Math.cos(time * 0.005 + s.pulsePhase) * r * 1.25;
      const ey = Math.sin(time * 0.005 + s.pulsePhase) * r * 0.55;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex, ey, 2.2, 0, Math.PI * 2);
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

    // Outer Text Shadow for 100% Readability
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(String(s.value), 0, 1);

    // Inner Text Fill
    ctx.fillStyle = isTarget ? '#ffffff' : '#f1f5f9';
    ctx.fillText(String(s.value), 0, 1);

    ctx.restore();
  }

  // Draw Grand Player Divisor Cursor
  function drawCursor(time) {
    if (!cursor.active && cursor.x === 0 && cursor.y === 0) {
      // Default to center if no movement yet
      cursor.x = width / 2;
      cursor.y = height / 2;
      cursor.targetX = width / 2;
      cursor.targetY = height / 2;
    }

    // Spring interpolation towards target
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
      const bolts = 3;
      for (let b = 0; b < bolts; b++) {
        const startAngle = Math.random() * Math.PI * 2;
        const targetDist = r * 1.6 + Math.random() * r * 0.8;
        let lx = Math.cos(startAngle) * r * 0.7;
        let ly = Math.sin(startAngle) * r * 0.7;

        ctx.beginPath();
        ctx.moveTo(lx, ly);
        const segments = 4;
        for (let s = 1; s <= segments; s++) {
          const frac = s / segments;
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
    const helixRot = time * 0.002;
    ctx.rotate(helixRot);
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

      // Orbital Node
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

    // Gold Outer Core Rim
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = cfg.palette.secondary;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();

    // 6. Grand Divisor Model Numeral (e.g. "6", "7", "12", etc.)
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

  // Draw Dynamic Parallax Nebula & Starfield
  function drawBackground(time) {
    const cfg = GAME_CONFIGS[currentDivisor];

    // Deep Cosmic Base
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // Radial Ambient Nebulae
    const grad1 = ctx.createRadialGradient(width * 0.25, height * 0.35, 50, width * 0.25, height * 0.35, width * 0.6);
    grad1.addColorStop(0, cfg.palette.aura);
    grad1.addColorStop(1, 'rgba(3, 7, 18, 0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);

    const grad2 = ctx.createRadialGradient(width * 0.75, height * 0.75, 40, width * 0.75, height * 0.75, width * 0.5);
    grad2.addColorStop(0, 'rgba(251, 191, 36, 0.12)');
    grad2.addColorStop(1, 'rgba(3, 7, 18, 0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 6. PARTICLES, SHOCKWAVES & FLOATING LABELS
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

    // Expanding Shockwave Ring
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
      color: '#f43f5e',
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
    // 1. Particles
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

    // 2. Shockwaves
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

    // 3. Floating Math Texts
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
  // 7. COLLISION & CATCH LOGIC
  // ══════════════════════════════════════════════════════════════════════════
  function checkCollisions() {
    if (gameCleared) return;
    const cfg = GAME_CONFIGS[currentDivisor];
    const hitRadius = cursor.radius + 18;

    for (let i = spheres.length - 1; i >= 0; i--) {
      const s = spheres[i];
      const dist = Math.hypot(cursor.x - s.x, cursor.y - s.y);

      if (dist < hitRadius + s.radius) {
        // HIT DETECTED!
        if (s.isTarget) {
          // ── CORRECT: DIVISIBLE BY CURRENT DIVISOR! ──
          handleCorrectCatch(s, i);
        } else {
          // ── INCORRECT: NOT DIVISIBLE BY CURRENT DIVISOR! ──
          handleIncorrectTouch(s);
        }
      }
    }
  }

  function handleCorrectCatch(s, index) {
    const cfg = GAME_CONFIGS[currentDivisor];
    const val = s.value;
    const quotient = Math.round(val / currentDivisor);

    // Spawn spectacular effects
    spawnSupernova(s.x, s.y, 42);
    playSuccessChord(combo);

    // Update Progress
    caughtMultiples.add(val);
    score += 100 * combo;
    combo = Math.min(10, combo + 1);

    // Floating text: e.g. "+100 · 36 ÷ 6 = 6!"
    spawnFloatingText(`+${100 * combo}!  ${val} ÷ ${currentDivisor} = ${quotient}`, s.x, s.y, '#fef08a', 18);

    // Remove caught sphere and spawn a new distractor/remaining target to maintain exactly 20
    spheres.splice(index, 1);
    spheres.push(createSphere(null, true));

    updateHUD();

    // Check Victory Condition: All 9 target multiples caught!
    if (caughtMultiples.size >= cfg.targetMultiples.length) {
      triggerVictory();
    }
  }

  function handleIncorrectTouch(s) {
    if (s.deflectTimer > 0) return; // Prevent multiple hits on same collision

    const quotient = Math.floor(s.value / currentDivisor);
    const rem = s.value % currentDivisor;

    // Deflect sphere away with high repulsive velocity
    const angle = Math.atan2(s.y - cursor.y, s.x - cursor.x);
    s.vx = Math.cos(angle) * 6;
    s.vy = Math.sin(angle) * 6;
    s.deflectTimer = 35;

    spawnDeflectionWave(s.x, s.y);
    playErrorTone();

    combo = 1;
    // Educational Feedback
    spawnFloatingText(`${s.value} ÷ ${currentDivisor} = ${quotient} r ${rem} (Not Divisible!)`, s.x, s.y, '#fb7185', 14);

    updateHUD();
  }

  function triggerVictory() {
    gameCleared = true;
    playVictoryFanfare();

    // Massive screen fireworks
    for (let f = 0; f < 6; f++) {
      setTimeout(() => {
        const fx = width * (0.2 + Math.random() * 0.6);
        const fy = height * (0.2 + Math.random() * 0.5);
        spawnSupernova(fx, fy, 60);
      }, f * 180);
    }

    const modal = document.getElementById('qDivisorVictoryModal');
    if (modal) {
      const cfg = GAME_CONFIGS[currentDivisor];
      const titleEl = document.getElementById('qVictoryTitle');
      const tableEl = document.getElementById('qVictoryTable');
      const scoreEl = document.getElementById('qVictoryScore');

      if (titleEl) titleEl.textContent = `DIVISOR ${currentDivisor} FULLY MASTERED!`;
      if (scoreEl) scoreEl.textContent = `Final Score: ${score.toLocaleString()} Points`;

      // Render Complete Multiplication Table Mastered
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
  // 8. HUD & UI MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════
  function updateHUD() {
    const cfg = GAME_CONFIGS[currentDivisor];

    // Checklist Pills
    const checklistEl = document.getElementById('qGameChecklistRow');
    if (checklistEl) {
      let html = '';
      cfg.targetMultiples.forEach(m => {
        const isCaught = caughtMultiples.has(m);
        html += `
          <div class="qg-check-pill ${isCaught ? 'caught' : ''}" data-target="${m}">
            <span class="qg-pill-num">${m}</span>
            <span class="qg-pill-check">${isCaught ? '✓' : ''}</span>
          </div>
        `;
      });
      checklistEl.innerHTML = html;
    }

    // Score & Multiplier
    const scoreValEl = document.getElementById('qGameScoreVal');
    if (scoreValEl) scoreValEl.textContent = score.toLocaleString();

    const comboValEl = document.getElementById('qGameComboVal');
    if (comboValEl) comboValEl.textContent = `x${combo}`;

    // Level Header Titles
    const titleEl = document.getElementById('qGameLevelTitle');
    if (titleEl) titleEl.textContent = `DIVISOR ${currentDivisor} · ${cfg.name.toUpperCase()}`;

    const subEl = document.getElementById('qGameLevelSubtitle');
    if (subEl) subEl.textContent = `Catch All Numbers Divisible by ${currentDivisor} (9 Multiples Total: 2nd..10th Term)`;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 9. ANIMATION LOOP
  // ══════════════════════════════════════════════════════════════════════════
  function loop(time) {
    if (!activeGame) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Nebula Background
    drawBackground(time);

    // 2. Update & Draw the 30 Roaming Spheres
    const topMargin = 100;
    for (let i = 0; i < spheres.length; i++) {
      const s = spheres[i];

      // Autonomous Floating Physics
      s.x += s.vx;
      s.y += s.vy;
      s.rotation += s.rotSpeed;

      if (s.deflectTimer > 0) {
        s.deflectTimer--;
        s.vx *= 0.95;
        s.vy *= 0.95;
      }

      // Smooth Elastic Wall Bouncing
      if (s.x - s.radius < 0) {
        s.x = s.radius;
        s.vx = Math.abs(s.vx);
      } else if (s.x + s.radius > width) {
        s.x = width - s.radius;
        s.vx = -Math.abs(s.vx);
      }

      if (s.y - s.radius < topMargin) {
        s.y = topMargin + s.radius;
        s.vy = Math.abs(s.vy);
      } else if (s.y + s.radius > height) {
        s.y = height - s.radius;
        s.vy = -Math.abs(s.vy);
      }

      drawSphere(s, time);
    }

    // 3. Collision Detection
    checkCollisions();

    // 4. Update & Draw Shockwaves, Particles & Math Texts
    updateAndDrawFX();

    // 5. Draw Grand Player Divisor Cursor
    drawCursor(time);

    animationId = requestAnimationFrame(loop);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 10. PUBLIC API & CONTROLS
  // ══════════════════════════════════════════════════════════════════════════
  function launch(divisorNum = 6) {
    initAudio();

    if (!GAME_CONFIGS[divisorNum]) divisorNum = 6;
    currentDivisor = divisorNum;
    caughtMultiples.clear();
    score = 0;
    combo = 1;
    gameCleared = false;
    particles = [];
    shockwaves = [];
    floatingTexts = [];

    const overlay = document.getElementById('quantumDivisorGameOverlay');
    if (!overlay) return;

    overlay.style.display = 'block';
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('qgame-active');

    // Setup Canvas
    canvas = document.getElementById('quantumDivisorCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Bind Controls
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    initSpheres();
    updateHUD();

    // Update active tab in HUD
    document.querySelectorAll('.qg-tab-btn').forEach(btn => {
      const d = parseInt(btn.getAttribute('data-divisor'), 10);
      btn.classList.toggle('active', d === currentDivisor);
    });

    const modal = document.getElementById('qDivisorVictoryModal');
    if (modal) modal.style.display = 'none';

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
    } else if (['6', '7', '8', '9'].includes(e.key)) {
      launch(parseInt(e.key, 10));
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
  // 11. BOOTSTRAPPER & EVENT WIRING
  // ══════════════════════════════════════════════════════════════════════════
  function initDOMBindings() {
    // Delegated click handler on document to guarantee clicks on buttons or nested spans always launch
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

    // Topbar launch buttons direct binding
    const triggerButtons = document.querySelectorAll('[data-divisor-launch]');
    triggerButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const d = parseInt(btn.getAttribute('data-divisor-launch'), 10) || 6;
        launch(d);
      });
    });

    // In-game HUD level switcher tabs
    document.querySelectorAll('.qg-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = parseInt(btn.getAttribute('data-divisor'), 10) || 6;
        launch(d);
      });
    });

    // Close button
    const closeBtn = document.getElementById('qGameCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', exit);

    // Audio mute toggle
    const audioBtn = document.getElementById('qGameAudioToggleBtn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        audioMuted = !audioMuted;
        updateAudioToggleBtn();
      });
    }

    // In-Game Fullscreen toggle
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

    // Victory modal action buttons
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

  // Auto-init on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDOMBindings);
  } else {
    initDOMBindings();
  }

  // Expose global namespace
  window.QuantumDivisorGame = {
    launch: launch,
    exit: exit,
    isActive: () => Boolean(activeGame)
  };
})();
