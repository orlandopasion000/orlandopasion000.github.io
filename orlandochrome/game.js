/**
 * Chrome Synapse: Quantum Arcade Arena (v2.0)
 * ─────────────────────────────────────────────────────────────
 * Designed for Sir Orlando V. Pasion, Jr. — Teacher VI, Mathematics Educator, EdTech Innovator
 * 
 * Games:
 * 1. 🧮 Math Overdrive: Professional Eight-Level Difficulty System (20 Qs/level, 10 Mistakes Max)
 * 2. ⚡ Reflex Blitz: Quantum Realm, Helix & Meteor Catcher with Tier 3 Extra Big Particles (10 Lives)
 * 3. 🧠 Memory Matrix: 16-Box (4x4) Fullscreen Neural Array with Harmonic Synthesizer (1 Mistake Game Over)
 */

(function () {
  'use strict';

  // --- Procedural Web Audio API Synthesizer ---
  class CyberAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type = 'sine', duration = 0.2, gainVal = 0.15) {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    }

    playCorrectChime(combo = 1) {
      if (this.isMuted) return;
      this.init();
      const baseFreq = 523.25; // C5
      const mult = Math.min(2.0, 1 + (combo - 1) * 0.12);
      this.playTone(baseFreq * mult, 'sine', 0.16, 0.18);
      setTimeout(() => this.playTone(baseFreq * mult * 1.25, 'sine', 0.22, 0.18), 70);
      setTimeout(() => this.playTone(baseFreq * mult * 1.5, 'sine', 0.30, 0.22), 140);
    }

    playMistakeBuzzer() {
      if (this.isMuted) return;
      this.init();
      this.playTone(130.81, 'sawtooth', 0.25, 0.22); // C3
      setTimeout(() => this.playTone(110.00, 'sawtooth', 0.35, 0.25), 100); // A2
    }

    playMorphChime() {
      if (this.isMuted) return;
      this.init();
      // Sci-fi arpeggio
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((f, i) => {
        setTimeout(() => this.playTone(f, 'triangle', 0.20, 0.16), i * 50);
      });
    }

    playMatrixTone(boxIndex) {
      if (this.isMuted) return;
      this.init();
      // 16 distinct harmonic frequencies across two octaves (C4 to D6)
      const pitches = [
        261.63, 293.66, 329.63, 349.23,
        392.00, 440.00, 493.88, 523.25,
        587.33, 659.25, 698.46, 783.99,
        880.00, 987.77, 1046.50, 1174.66
      ];
      const freq = pitches[boxIndex % pitches.length];
      this.playTone(freq, 'sine', 0.35, 0.25);
    }

    playVictoryFanfare() {
      if (this.isMuted) return;
      this.init();
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((f, idx) => {
        setTimeout(() => this.playTone(f, 'sine', 0.45, 0.20), idx * 80);
      });
    }
  }

  const audio = new CyberAudioEngine();

  // --- Eight-Level Mathematics Engine ---
  const MathEngine = {
    // Generate exactly 20 questions for the selected level
    generateLevelSet(levelNum) {
      const questions = [];
      const usedSignatures = new Set();

      // Operation distributions per level
      let dist;
      switch (levelNum) {
        case 1: dist = { add: 8, sub: 6, mul: 4, div: 2 }; break;
        case 2: dist = { add: 6, sub: 6, mul: 4, div: 4 }; break;
        case 3: dist = { add: 5, sub: 5, mul: 5, div: 5 }; break;
        case 4: dist = { add: 6, sub: 6, mul: 4, div: 4 }; break;
        case 5: dist = { add: 5, sub: 5, mul: 5, div: 5 }; break;
        case 6: dist = { add: 5, sub: 5, mul: 5, div: 5 }; break;
        case 7: dist = { add: 5, sub: 5, mul: 5, div: 5 }; break;
        case 8:
        default: dist = { add: 5, sub: 5, mul: 5, div: 5 }; break;
      }

      const opList = [
        ...Array(dist.add).fill('+'),
        ...Array(dist.sub).fill('−'),
        ...Array(dist.mul).fill('×'),
        ...Array(dist.div).fill('÷')
      ];

      // Shuffle operations
      for (let i = opList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opList[i], opList[j]] = [opList[j], opList[i]];
      }

      for (let i = 0; i < opList.length; i++) {
        const op = opList[i];
        let q = null;
        let attempts = 0;

        while (!q && attempts < 100) {
          attempts++;
          const candidate = this.createQuestion(levelNum, op, i);
          const sig = `${candidate.a}|${op}|${candidate.b}`;
          const commSig = (op === '+' || op === '×') ? `${candidate.b}|${op}|${candidate.a}` : sig;

          if (!usedSignatures.has(sig) && !usedSignatures.has(commSig)) {
            usedSignatures.add(sig);
            usedSignatures.add(commSig);
            q = candidate;
          }
        }

        if (!q) {
          // Fallback if space is tight
          q = this.createQuestion(levelNum, op, i, true);
        }
        questions.push(q);
      }

      return questions;
    },

    createQuestion(level, op, qIdx, allowFallback = false) {
      let a = 1, b = 1, ans = 0;

      // Random integer in range [min, max] inclusive
      const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const randNonZero = (min, max) => {
        let v = 0;
        while (v === 0) v = randInt(min, max);
        return v;
      };

      if (level === 1) {
        // Level 1: Positive one-digit integers (1 to 9). Sub nonnegative, div whole number
        if (op === '+') {
          a = randInt(1, 9);
          b = randInt(1, 9);
          ans = a + b;
        } else if (op === '−') {
          a = randInt(1, 9);
          b = randInt(1, a); // guarantees a >= b
          ans = a - b;
        } else if (op === '×') {
          a = randInt(1, 9);
          b = randInt(1, 9);
          ans = a * b;
        } else if (op === '÷') {
          b = randInt(1, 9);
          ans = randInt(1, 9);
          a = b * ans;
          if (a > 9 && !allowFallback) {
            // keep 1-digit dividend if possible, or small quotient
            b = randInt(1, 4);
            ans = randInt(1, 2);
            a = b * ans;
          }
        }
      } else if (level === 2) {
        // Level 2: Exactly one negative operand (abs 1 to 9)
        const signA = Math.random() < 0.5 ? -1 : 1;
        const signB = -signA; // exactly one negative

        if (op === '+') {
          a = randInt(1, 9) * signA;
          b = randInt(1, 9) * signB;
          ans = a + b;
        } else if (op === '−') {
          a = randInt(1, 9) * signA;
          b = randInt(1, 9) * signB;
          ans = a - b;
        } else if (op === '×') {
          a = randInt(1, 9) * signA;
          b = randInt(1, 9) * signB;
          ans = a * b;
        } else if (op === '÷') {
          const quotMag = randInt(1, 9);
          const divMag = randInt(1, 9);
          b = divMag * signB;
          ans = quotMag * (signA * signB);
          a = b * ans;
          // adjust signs so exactly one of a or b is negative
          if ((a < 0 && b < 0) || (a > 0 && b > 0)) {
            a = -a;
            ans = Math.round(a / b);
          }
        }
      } else if (level === 3) {
        // Level 3: Mixed signs (abs 1 to 9). At least 40% two negative operands
        const requireTwoNeg = (qIdx < 8) || (Math.random() < 0.45);
        let signA, signB;
        if (requireTwoNeg) {
          signA = -1;
          signB = -1;
        } else {
          signA = Math.random() < 0.5 ? 1 : -1;
          signB = Math.random() < 0.5 ? 1 : -1;
        }

        if (op === '+') {
          a = randInt(1, 9) * signA;
          b = randInt(1, 9) * signB;
          ans = a + b;
        } else if (op === '−') {
          a = randInt(1, 9) * signA;
          b = randInt(1, 9) * signB;
          ans = a - b;
        } else if (op === '×') {
          a = randInt(1, 9) * signA;
          b = randInt(1, 9) * signB;
          ans = a * b;
        } else if (op === '÷') {
          const divMag = randInt(1, 9);
          const quotMag = randInt(1, 9);
          b = divMag * signB;
          ans = quotMag * (signA * signB);
          a = b * ans;
          if (signA === -1 && a > 0) a = -a;
          if (signA === 1 && a < 0) a = -a;
          ans = Math.round(a / b);
        }
      } else if (level === 4) {
        // Level 4: Positive two-digit integers (10-99) & positive one-digit (1-5)
        if (op === '+') {
          a = randInt(10, 99);
          b = randInt(1, 5);
          ans = a + b;
        } else if (op === '−') {
          a = randInt(10, 99);
          b = randInt(1, 5);
          ans = a - b;
        } else if (op === '×') {
          a = randInt(10, 19);
          b = randInt(2, 5);
          ans = a * b;
        } else if (op === '÷') {
          const quot = randInt(10, 19);
          b = randInt(2, 5);
          a = b * quot;
          ans = quot;
        }
      } else if (level === 5) {
        // Level 5: Signed two-digit (abs 10-99) & small one-digit (abs 1-5)
        const signA = Math.random() < 0.5 ? 1 : -1;
        const signB = Math.random() < 0.5 ? 1 : -1;

        if (op === '+') {
          a = randInt(10, 99) * signA;
          b = randInt(1, 5) * signB;
          ans = a + b;
        } else if (op === '−') {
          a = randInt(10, 99) * signA;
          b = randInt(1, 5) * signB;
          ans = a - b;
        } else if (op === '×') {
          a = randInt(10, 19) * signA;
          b = randInt(1, 5) * signB;
          ans = a * b;
        } else if (op === '÷') {
          const quot = randInt(10, 19) * signA;
          b = randInt(2, 5) * signB;
          a = b * quot;
          ans = quot;
        }
      } else if (level === 6) {
        // Level 6: Signed two-digit (abs 10-99) & larger one-digit (abs 6-9)
        const signA = Math.random() < 0.5 ? 1 : -1;
        const signB = Math.random() < 0.5 ? 1 : -1;

        if (op === '+') {
          a = randInt(10, 99) * signA;
          b = randInt(6, 9) * signB;
          ans = a + b;
        } else if (op === '−') {
          a = randInt(10, 99) * signA;
          b = randInt(6, 9) * signB;
          ans = a - b;
        } else if (op === '×') {
          a = randInt(10, 19) * signA;
          b = randInt(6, 9) * signB;
          ans = a * b;
        } else if (op === '÷') {
          b = randInt(6, 9) * signB;
          const maxQuot = Math.floor(99 / Math.abs(b));
          const quotMag = randInt(10, Math.max(10, maxQuot));
          ans = quotMag * (signA * signB);
          a = b * ans;
        }
      } else if (level === 7) {
        // Level 7: Advanced signed integers (abs 10 to 50)
        const signA = Math.random() < 0.5 ? 1 : -1;
        const signB = Math.random() < 0.5 ? 1 : -1;
        if (op === '+') {
          a = randInt(10, 50) * signA;
          b = randInt(10, 50) * signB;
          ans = a + b;
        } else if (op === '−') {
          a = randInt(10, 50) * signA;
          b = randInt(10, 50) * signB;
          ans = a - b;
        } else if (op === '×') {
          a = randInt(10, 25) * signA;
          b = randInt(2, 8) * signB;
          ans = a * b;
        } else if (op === '÷') {
          const quot = randInt(10, 25) * signA;
          b = randInt(2, 6) * signB;
          a = b * quot;
          ans = quot;
        }
      } else {
        // Level 8: Master fluency across full 10-99 signed range
        const signA = Math.random() < 0.5 ? 1 : -1;
        const signB = Math.random() < 0.5 ? 1 : -1;
        if (op === '+') {
          a = randInt(15, 99) * signA;
          b = randInt(15, 99) * signB;
          ans = a + b;
        } else if (op === '−') {
          a = randInt(15, 99) * signA;
          b = randInt(15, 99) * signB;
          ans = a - b;
        } else if (op === '×') {
          a = randInt(12, 35) * signA;
          b = randInt(3, 12) * signB;
          ans = a * b;
        } else if (op === '÷') {
          const quot = randInt(12, 30) * signA;
          b = randInt(3, 9) * signB;
          a = b * quot;
          ans = quot;
        }
      }

      // Format operand with parentheses if negative
      const fmt = (n) => (n < 0 ? `(${n})` : `${n}`);
      const expr = `${fmt(a)} ${op} ${fmt(b)}`;

      // Generate 3 plausible distractors
      const options = [ans];
      const deltas = [-10, 10, -1, 1, -2, 2, -ans, ans * -1];

      // Shuffle deltas
      deltas.sort(() => Math.random() - 0.5);

      for (const d of deltas) {
        if (options.length >= 4) break;
        const cand = (d === -ans || d === ans * -1) ? -ans : ans + d;
        if (!options.includes(cand)) {
          options.push(cand);
        }
      }

      while (options.length < 4) {
        const offset = (Math.random() < 0.5 ? -1 : 1) * randInt(1, 15);
        const cand = ans + offset;
        if (!options.includes(cand)) {
          options.push(cand);
        }
      }

      // Shuffle options
      options.sort(() => Math.random() - 0.5);

      return {
        expr,
        a,
        b,
        op,
        ans,
        options
      };
    }
  };

  // --- Particle Systems & Quantum Renderers (Realm, Helix, Meteor) ---
  const QuantumRenderer = {
    // 1. Quantum Realm Atomic Cursor (Quantum Core / Player Atom / Singularity Core)
    drawQuantumAtomic(ctx, cx, cy, now, progress = 0) {
      ctx.save();
      ctx.translate(cx, cy);

      const t = now * 0.0016;
      const rotBase = now * 0.0004;
      const colorShift = (now * 0.04) % 360;
      const exc = progress > 0 ? progress * 0.35 : 0;
      const spinMult = 1.0 + exc * 2.5;

      // ── 1. Diffracted Horizontal & Diagonal Photonic Lens Flares ──
      const flareLen = 44 + exc * 12;
      const flareW = 2.8 + exc * 1.0;

      // Horizontal primary flare beam (cyan to purple to violet)
      const hGrad = ctx.createLinearGradient(-flareLen, 0, flareLen, 0);
      hGrad.addColorStop(0.0, "rgba(168, 85, 247, 0)");
      hGrad.addColorStop(0.2, "rgba(192, 132, 252, 0.40)");
      hGrad.addColorStop(0.38, "rgba(56, 189, 248, 0.75)");
      hGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
      hGrad.addColorStop(0.62, "rgba(56, 189, 248, 0.75)");
      hGrad.addColorStop(0.8, "rgba(192, 132, 252, 0.40)");
      hGrad.addColorStop(1.0, "rgba(168, 85, 247, 0)");

      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.moveTo(-flareLen, 0);
      ctx.lineTo(0, -flareW);
      ctx.lineTo(flareLen, 0);
      ctx.lineTo(0, flareW);
      ctx.closePath();
      ctx.fill();

      // Diagonal flares (golden amber along 60 deg and -60 deg axes)
      for (let d = 0; d < 2; d++) {
        const dAngle = d === 0 ? Math.PI / 3 : -Math.PI / 3;
        ctx.save();
        ctx.rotate(dAngle);
        const dGrad = ctx.createLinearGradient(-flareLen * 0.75, 0, flareLen * 0.75, 0);
        dGrad.addColorStop(0.0, "rgba(245, 158, 11, 0)");
        dGrad.addColorStop(0.3, "rgba(251, 191, 36, 0.40)");
        dGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.85)");
        dGrad.addColorStop(0.7, "rgba(251, 191, 36, 0.40)");
        dGrad.addColorStop(1.0, "rgba(245, 158, 11, 0)");
        ctx.fillStyle = dGrad;
        ctx.beginPath();
        ctx.moveTo(-flareLen * 0.75, 0);
        ctx.lineTo(0, -1.8);
        ctx.lineTo(flareLen * 0.75, 0);
        ctx.lineTo(0, 1.8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // ── 2. Central Quantum Nucleus Sphere ──
      const rCore = 14.5 + exc * 2.0;
      const haloGrad = ctx.createRadialGradient(0, 0, rCore * 0.7, 0, 0, rCore * 1.55);
      haloGrad.addColorStop(0.0, "rgba(168, 85, 247, 0.40)");
      haloGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.20)");
      haloGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rCore * 1.55, 0, Math.PI * 2);
      ctx.fill();

      const sphereGrad = ctx.createRadialGradient(-2, -3, 1, 0, 0, rCore);
      sphereGrad.addColorStop(0.0, "rgba(233, 213, 255, 0.98)");
      sphereGrad.addColorStop(0.25, "rgba(168, 85, 247, 0.95)");
      sphereGrad.addColorStop(0.55, "rgba(67, 20, 103, 0.95)");
      const hueRim1 = (colorShift + 30) % 360;
      const hueRim2 = (colorShift + 180) % 360;
      sphereGrad.addColorStop(0.80, 'hsla(' + hueRim1 + ', 90%, 55%, 0.85)');
      sphereGrad.addColorStop(0.95, 'hsla(' + hueRim2 + ', 95%, 65%, 0.92)');
      sphereGrad.addColorStop(1.0, progress > 0.8 ? "rgba(255, 215, 0, 0.98)" : "rgba(254, 240, 138, 0.95)");

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rCore, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // ── 3. Three 3D Precessing Orbital Rings with Shifting Colors ──
      const majorA = 26 + exc * 4;
      const minorB = 9.8 + exc * 1.5;
      const rings = [
        { baseAngle: 0, phaseOffset: 0, hueBase: colorShift },
        { baseAngle: Math.PI / 3, phaseOffset: 2.094, hueBase: (colorShift + 120) % 360 },
        { baseAngle: 2 * Math.PI / 3, phaseOffset: 4.188, hueBase: (colorShift + 240) % 360 }
      ];

      for (let ri = 0; ri < 3; ri++) {
        const ring = rings[ri];
        ctx.save();
        const wobble = Math.sin(t * 1.4 * spinMult + ring.phaseOffset) * 0.08;
        ctx.rotate(ring.baseAngle + wobble + rotBase * spinMult);
        const curB = minorB * (1.0 + 0.12 * Math.cos(t * 1.6 * spinMult + ring.phaseOffset));

        const rGrad = ctx.createLinearGradient(-majorA, 0, majorA, 0);
        const h1 = Math.round(ring.hueBase);
        const h2 = Math.round((ring.hueBase + 60) % 360);
        rGrad.addColorStop(0.0, 'hsla(' + h1 + ', 95%, 68%, 0.95)');
        rGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.95)");
        rGrad.addColorStop(0.5, 'hsla(' + h2 + ', 100%, 72%, 0.90)');
        rGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.95)");
        rGrad.addColorStop(1.0, 'hsla(' + h1 + ', 95%, 68%, 0.95)');

        ctx.strokeStyle = rGrad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(0, 0, majorA, curB, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Circulating electron quantum wavepacket spark
        const eSpeed = 0.0032 * spinMult;
        const u = (now * eSpeed + ring.phaseOffset) % (Math.PI * 2);
        const ex = majorA * Math.cos(u);
        const ey = curB * Math.sin(u);

        ctx.beginPath();
        ctx.arc(ex, ey, 4.2, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + h1 + ', 100%, 70%, 0.28)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ex, ey, 2.0, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        // Apex flares
        ctx.beginPath();
        ctx.arc(majorA, 0, 1.4, 0, Math.PI * 2);
        ctx.arc(-majorA, 0, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.90)";
        ctx.fill();

        ctx.restore();
      }

      // ── 4. Precision Micro-Singularity Center Reticle ──
      ctx.beginPath();
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.restore();
    },

    // 2. Quantum Helix Atomic Cursor (Quantum Core / Player Atom / Singularity Core)
    drawHelixCore(ctx, cx, cy, now, progress = 0) {
      ctx.save();
      ctx.translate(cx, cy);

      const exc = progress > 0 ? progress * 0.35 : 0;
      const t = now * 0.0016;
      const rotBase = now * 0.0006;
      const spinMult = 1.0 + exc * 2.5;

      // ── 1. Compact Specular Bi-Chromatic Lens Flare Glint ──
      const flareLen = 28 + exc * 8;
      const flareW = 2.0 + exc * 0.5;

      const hGrad = ctx.createLinearGradient(-flareLen, 0, flareLen, 0);
      hGrad.addColorStop(0.0, "rgba(6, 182, 212, 0)");
      hGrad.addColorStop(0.30, "rgba(34, 211, 238, 0.40)");
      hGrad.addColorStop(0.50, "rgba(255, 255, 255, 0.95)");
      hGrad.addColorStop(0.70, "rgba(217, 70, 239, 0.40)");
      hGrad.addColorStop(1.0, "rgba(168, 85, 247, 0)");

      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.moveTo(-flareLen, 0);
      ctx.lineTo(0, -flareW);
      ctx.lineTo(flareLen, 0);
      ctx.lineTo(0, flareW);
      ctx.closePath();
      ctx.fill();

      // ── 2. Prominent 3D Quantum Helix Sphere ──
      const rCore = 16.0 + exc * 2.5;

      // Ambient Luminous Halo
      const haloGrad = ctx.createRadialGradient(0, 0, rCore * 0.65, 0, 0, rCore * 1.55);
      haloGrad.addColorStop(0.0, "rgba(34, 211, 238, 0.38)");
      haloGrad.addColorStop(0.5, "rgba(217, 70, 239, 0.22)");
      haloGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rCore * 1.55, 0, Math.PI * 2);
      ctx.fill();

      // Solid 3D Spherical Core Shading
      const sphereGrad = ctx.createRadialGradient(-3, -4, 1, 0, 0, rCore);
      sphereGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.98)");
      sphereGrad.addColorStop(0.28, "rgba(56, 189, 248, 0.95)");
      sphereGrad.addColorStop(0.62, "rgba(147, 51, 234, 0.92)");
      sphereGrad.addColorStop(0.88, "rgba(59, 7, 100, 0.95)");
      sphereGrad.addColorStop(1.0, progress > 0.8 ? "rgba(255, 215, 0, 0.98)" : "rgba(34, 211, 238, 0.95)");

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(0, 0, rCore, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // ── 3. DNA Double-Helix Emblem Inscribed Inside the Sphere ──
      ctx.save();
      const dnaAngle = -0.45 + Math.sin(t * 0.7) * 0.08;
      ctx.rotate(dnaAngle);

      const dnaLen = (rCore - 1.8) * 1.92;
      const dnaAmp = rCore * 0.36;
      const dnaSteps = 12;
      const dnaPhase = t * spinMult * 2.2;

      // Batched base-pair connecting rungs
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.80)";
      ctx.beginPath();
      for (let bi = -3; bi <= 3; bi++) {
        const bNorm = bi / 3.8;
        const bx = bNorm * (dnaLen * 0.46);
        const bEnv = Math.sqrt(Math.max(0, 1 - bNorm * bNorm));
        const bPhase = dnaPhase + bNorm * Math.PI * 1.75;
        const by1 = Math.sin(bPhase) * dnaAmp * bEnv;
        ctx.moveTo(bx, by1);
        ctx.lineTo(bx, -by1);
      }
      ctx.stroke();

      // Strand 1: Electric Cyan DNA Helix Strand
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i <= dnaSteps; i++) {
        const sNorm = -1 + (2 * i) / dnaSteps;
        const ix = sNorm * (dnaLen * 0.48);
        const sEnv = Math.sqrt(Math.max(0, 1 - sNorm * sNorm));
        const iPhase = dnaPhase + sNorm * Math.PI * 1.75;
        const iy1 = Math.sin(iPhase) * dnaAmp * sEnv;
        if (i === 0) ctx.moveTo(ix, iy1); else ctx.lineTo(ix, iy1);
      }
      ctx.stroke();

      // Strand 2: Royal Magenta DNA Helix Strand
      ctx.strokeStyle = "#f472b6";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i <= dnaSteps; i++) {
        const sNorm = -1 + (2 * i) / dnaSteps;
        const ix = sNorm * (dnaLen * 0.48);
        const sEnv = Math.sqrt(Math.max(0, 1 - sNorm * sNorm));
        const iPhase = dnaPhase + sNorm * Math.PI * 1.75;
        const iy2 = -Math.sin(iPhase) * dnaAmp * sEnv;
        if (i === 0) ctx.moveTo(ix, iy2); else ctx.lineTo(ix, iy2);
      }
      ctx.stroke();
      ctx.restore();

      // ── 4. Three 3D Precessing Gyroscope Rings ──
      const majorA = 27 + exc * 4;
      const minorB = 10.2 + exc * 1.5;

      // Ring 1: Electric Cyan (+45 deg)
      ctx.save();
      ctx.rotate(Math.PI / 4 + rotBase * spinMult);
      ctx.beginPath();
      ctx.ellipse(0, 0, majorA, minorB, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.75)";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      const nodeAngle1 = t * 2.0 * spinMult;
      ctx.beginPath();
      ctx.arc(Math.cos(nodeAngle1) * majorA, Math.sin(nodeAngle1) * minorB, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "#67e8f9";
      ctx.fill();
      ctx.restore();

      // Ring 2: Royal Magenta (-45 deg)
      ctx.save();
      ctx.rotate(-Math.PI / 4 - rotBase * spinMult);
      ctx.beginPath();
      ctx.ellipse(0, 0, majorA, minorB, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(217, 70, 239, 0.75)";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      const nodeAngle2 = -t * 2.0 * spinMult;
      ctx.beginPath();
      ctx.arc(Math.cos(nodeAngle2) * majorA, Math.sin(nodeAngle2) * minorB, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "#f472b6";
      ctx.fill();
      ctx.restore();

      // Ring 3: Equatorial Iridescent Violet (0 deg)
      ctx.save();
      ctx.rotate(rotBase * spinMult * 0.5);
      ctx.beginPath();
      ctx.ellipse(0, 0, majorA * 1.08, minorB * 0.85, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(192, 132, 252, 0.55)";
      ctx.lineWidth = 0.95;
      ctx.stroke();
      ctx.restore();

      // Precision Center Reticle
      ctx.beginPath();
      ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.restore();
    },

    // 3. Quantum Meteor Asteroid Cursor (Quantum Core / Player Atom / Singularity Core)
    drawMeteorAsteroid(ctx, cx, cy, now, progress = 0) {
      ctx.save();

      const exc = progress > 0 ? progress * 0.35 : 0;
      const t = now * 0.0018;
      const rotBase = now * 0.0006;
      const spinMult = 1.0 + exc * 2.5;
      const tumble = now * 0.0012;
      const pitch = Math.sin(now * 0.0015) * 0.25;

      const trailAngle = -Math.PI * 0.5; // flames flow up/back
      const coreR = 15.0 + exc * 3.0;

      // ── 1. SOLAR CORONA & VOLUMETRIC ATMOSPHERIC PLASMA HALO ──
      const coronaR = coreR * 2.3;
      const coronaGrad = ctx.createRadialGradient(cx, cy, coreR * 0.35, cx, cy, coronaR);
      coronaGrad.addColorStop(0.0, 'rgba(255, 255, 250, ' + (0.92 + exc * 0.08).toFixed(2) + ')');
      coronaGrad.addColorStop(0.20, 'rgba(254, 240, 138, ' + (0.75 + exc * 0.15).toFixed(2) + ')');
      coronaGrad.addColorStop(0.48, 'rgba(249, 115, 22, ' + (0.42 + exc * 0.20).toFixed(2) + ')');
      coronaGrad.addColorStop(0.80, 'rgba(220, 38, 38, ' + (0.16 + exc * 0.12).toFixed(2) + ')');
      coronaGrad.addColorStop(1.0, "rgba(185, 28, 28, 0.0)");
      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coronaR, 0, Math.PI * 2);
      ctx.fill();

      // ── 2. ANAMORPHIC SOLAR PROMINENCE FLARE BEAMS ──
      const flareLen = coreR * 2.6 + exc * 12;
      const flareW = coreR * 0.18 + exc * 1.2;
      ctx.save();
      ctx.translate(cx, cy);
      const hFlare = ctx.createLinearGradient(-flareLen, 0, flareLen, 0);
      hFlare.addColorStop(0.0, "rgba(220, 38, 38, 0)");
      hFlare.addColorStop(0.25, "rgba(249, 115, 22, 0.45)");
      hFlare.addColorStop(0.45, "rgba(254, 240, 138, 0.85)");
      hFlare.addColorStop(0.50, "rgba(255, 255, 255, 1.0)");
      hFlare.addColorStop(0.55, "rgba(254, 240, 138, 0.85)");
      hFlare.addColorStop(0.75, "rgba(249, 115, 22, 0.45)");
      hFlare.addColorStop(1.0, "rgba(220, 38, 38, 0)");
      ctx.fillStyle = hFlare;
      ctx.beginPath();
      ctx.moveTo(-flareLen, 0);
      ctx.lineTo(0, -flareW);
      ctx.lineTo(flareLen, 0);
      ctx.lineTo(0, flareW);
      ctx.closePath();
      ctx.fill();

      // Diagonal flares (at 60 deg and -60 deg)
      for (let d = 0; d < 2; d++) {
        ctx.save();
        ctx.rotate(d === 0 ? Math.PI / 3 : -Math.PI / 3);
        const dFlare = ctx.createLinearGradient(-flareLen * 0.72, 0, flareLen * 0.72, 0);
        dFlare.addColorStop(0.0, "rgba(234, 88, 12, 0)");
        dFlare.addColorStop(0.35, "rgba(251, 191, 36, 0.45)");
        dFlare.addColorStop(0.50, "rgba(255, 255, 255, 0.90)");
        dFlare.addColorStop(0.65, "rgba(251, 191, 36, 0.45)");
        dFlare.addColorStop(1.0, "rgba(234, 88, 12, 0)");
        ctx.fillStyle = dFlare;
        ctx.beginPath();
        ctx.moveTo(-flareLen * 0.72, 0);
        ctx.lineTo(0, -flareW * 0.72);
        ctx.lineTo(flareLen * 0.72, 0);
        ctx.lineTo(0, flareW * 0.72);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // ── 3. LIVING FLAME WISPS & CONVECTION VORTICES ──
      const flameBaseLen = coreR * 1.45;
      for (let f = 0; f < 4; f++) {
        const fAng = trailAngle + (f - 1.5) * 0.38 + Math.sin(t * 6.0 + f * 1.8) * 0.14;
        const fLen = flameBaseLen * (0.85 + 0.30 * Math.sin(t * 7.5 + f * 2.2));
        const fEndX = cx + Math.cos(fAng) * fLen;
        const fEndY = cy + Math.sin(fAng) * fLen;
        const fMidX = (cx + fEndX) * 0.5 + Math.sin(t * 8.0 + f) * (coreR * 0.22);
        const fMidY = (cy + fEndY) * 0.5 + Math.cos(t * 8.0 + f) * (coreR * 0.22);

        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(fAng + 0.25) * (coreR * 0.55), cy + Math.sin(fAng + 0.25) * (coreR * 0.55));
        ctx.quadraticCurveTo(fMidX, fMidY, fEndX, fEndY);
        ctx.quadraticCurveTo(fMidX - Math.sin(fAng) * 4, fMidY + Math.cos(fAng) * 4, cx + Math.cos(fAng - 0.25) * (coreR * 0.55), cy + Math.sin(fAng - 0.25) * (coreR * 0.55));
        ctx.closePath();
        const flGrad = ctx.createLinearGradient(cx, cy, fEndX, fEndY);
        flGrad.addColorStop(0.0, "rgba(254, 240, 138, 0.88)");
        flGrad.addColorStop(0.40, "rgba(249, 115, 22, 0.68)");
        flGrad.addColorStop(0.80, "rgba(220, 38, 38, 0.35)");
        flGrad.addColorStop(1.0, "rgba(185, 28, 28, 0.0)");
        ctx.fillStyle = flGrad;
        ctx.fill();
      }

      // Floating Convection Cinder Sparks around the asteroid core
      for (let sp = 0; sp < 6; sp++) {
        const sAng = t * 3.2 + sp * 1.05;
        const sDist = coreR * (1.15 + 0.35 * Math.sin(t * 4.0 + sp * 2.1));
        const sx = cx + Math.cos(sAng) * sDist;
        const sy = cy + Math.sin(sAng) * sDist;
        const sAlpha = 0.40 + 0.50 * Math.sin(t * 6.0 + sp * 1.7);
        ctx.beginPath();
        ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(254, 240, 138, ' + sAlpha.toFixed(2) + ')';
        ctx.fill();
      }

      // ── 4. THREE 3D PRECESSED BLAZING SOLAR MAGNETIC DYNAMO RINGS ──
      const majorA = 26 + exc * 4;
      const minorB = 9.8 + exc * 1.5;
      const rings = [
        { baseAngle: 0, phaseOffset: 0, color: "rgba(251, 191, 36, 0.95)" },
        { baseAngle: Math.PI / 3, phaseOffset: 2.094, color: "rgba(244, 63, 94, 0.90)" },
        { baseAngle: 2 * Math.PI / 3, phaseOffset: 4.188, color: "rgba(254, 240, 138, 0.95)" }
      ];

      for (let ri = 0; ri < 3; ri++) {
        const ring = rings[ri];
        ctx.save();
        ctx.translate(cx, cy);
        const wobble = Math.sin(t * 1.4 * spinMult + ring.phaseOffset) * 0.08;
        ctx.rotate(ring.baseAngle + wobble + rotBase * spinMult);
        const curB = minorB * (1.0 + 0.12 * Math.cos(t * 1.6 * spinMult + ring.phaseOffset));

        const rGrad = ctx.createLinearGradient(-majorA, 0, majorA, 0);
        rGrad.addColorStop(0.0, "rgba(220, 38, 38, 0.3)");
        rGrad.addColorStop(0.25, ring.color);
        rGrad.addColorStop(0.50, "rgba(255, 255, 255, 0.98)");
        rGrad.addColorStop(0.75, ring.color);
        rGrad.addColorStop(1.0, "rgba(220, 38, 38, 0.3)");

        ctx.strokeStyle = rGrad;
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.ellipse(0, 0, majorA, curB, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Circulating Miniature Sun Plasmoid
        const eSpeed = 0.0035 * spinMult;
        const u = (now * eSpeed + ring.phaseOffset) % (Math.PI * 2);
        const ex = majorA * Math.cos(u);
        const ey = curB * Math.sin(u);

        ctx.beginPath();
        ctx.arc(ex, ey, 4.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(249, 115, 22, 0.38)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ex, ey, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(254, 240, 138, 0.92)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ex, ey, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();
      }

      // ── 5. HYPER-REALISTIC PROCEDURAL 3D MOLTEN ASTEROID ROCK CORE ──
      const rockR = coreR * 1.05;
      const SAMPLES = 32;
      const dTheta = (Math.PI * 2) / SAMPLES;
      const contourPts = [];
      for (let s = 0; s < SAMPLES; s++) {
        const th = s * dTheta;
        let rVar = 1.0;
        rVar += Math.sin(th * 2 + tumble * 0.7) * 0.14;
        rVar += Math.cos(th * 3 - pitch * 1.5) * 0.09;
        rVar += Math.sin(th * 5 + tumble * 1.2) * 0.06;
        rVar += Math.cos(th * 7) * 0.04;
        const rad = rockR * Math.max(0.70, rVar);
        contourPts.push({ x: cx + Math.cos(th) * rad, y: cy + Math.sin(th) * rad });
      }

      ctx.save();
      ctx.beginPath();
      for (let s = 0; s < SAMPLES; s++) {
        if (s === 0) ctx.moveTo(contourPts[s].x, contourPts[s].y);
        else ctx.lineTo(contourPts[s].x, contourPts[s].y);
      }
      ctx.closePath();
      ctx.clip();

      // 3D Directional Lighting
      const sunX = cx - rockR * 0.45;
      const sunY = cy - rockR * 0.55;
      const bodyGrad = ctx.createRadialGradient(sunX, sunY, rockR * 0.12, cx, cy, rockR * 1.30);
      bodyGrad.addColorStop(0.0, "#5c4537");
      bodyGrad.addColorStop(0.30, "#3d2b20");
      bodyGrad.addColorStop(0.62, "#21140e");
      bodyGrad.addColorStop(0.88, "#110906");
      bodyGrad.addColorStop(1.0, "#050302");
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // 3D Impact Craters with Sunlit Rims and Molten Magma Wells
      const craterDefs = [
        { x: -0.32, y: -0.38, r: 0.22, heatPhase: 0 },
        { x: 0.38, y: -0.25, r: 0.26, heatPhase: 1.8 },
        { x: -0.25, y: 0.35, r: 0.28, heatPhase: 3.5 }
      ];
      for (let c = 0; c < craterDefs.length; c++) {
        const cr = craterDefs[c];
        const crAng = Math.atan2(cr.y, cr.x) + tumble * 0.4;
        const crDist = Math.hypot(cr.x, cr.y) * rockR;
        const crX = cx + Math.cos(crAng) * crDist;
        const crY = cy + Math.sin(crAng) * crDist;
        const crRad = rockR * cr.r;

        ctx.beginPath();
        ctx.arc(crX, crY, crRad, 0, Math.PI * 2);
        ctx.fillStyle = "#070302";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(crX - 0.7, crY - 0.9, crRad, Math.PI * 0.7, Math.PI * 1.9);
        ctx.strokeStyle = "rgba(160, 130, 110, 0.65)";
        ctx.lineWidth = 1.1;
        ctx.stroke();

        const crHeat = 0.5 + 0.5 * Math.sin(t * 4.2 + cr.heatPhase);
        ctx.beginPath();
        ctx.arc(crX, crY, crRad * 0.58, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(234, 88, 12, ' + (0.60 + crHeat * 0.35).toFixed(2) + ')';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(crX, crY, crRad * 0.26, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(254, 240, 138, ' + (0.75 + crHeat * 0.25).toFixed(2) + ')';
        ctx.fill();
      }

      // Branching 5000K Magma Fissures
      const magmaPulse = 0.5 + 0.5 * Math.sin(t * 3.6);
      const fissureChains = [
        [[-0.60, -0.35], [-0.38, -0.28], [-0.18, -0.10], [0.05, 0.04], [0.28, 0.12], [0.48, 0.28], [0.68, 0.38]],
        [[0.32, -0.52], [0.22, -0.28], [0.05, 0.04], [-0.12, 0.25], [-0.28, 0.45], [-0.48, 0.60]]
      ];

      for (let fc = 0; fc < fissureChains.length; fc++) {
        const chain = fissureChains[fc];
        const pts = [];
        for (let j = 0; j < chain.length; j++) {
          const wobbleX = Math.sin(t * 4.5 + fc * 2.3 + j * 1.2) * 1.1;
          const wobbleY = Math.cos(t * 4.0 + fc * 1.7 + j * 1.4) * 1.1;
          pts.push({ x: cx + chain[j][0] * rockR + wobbleX, y: cy + chain[j][1] * rockR + wobbleY });
        }

        // Layer 1: Radiant molten solar orange-gold lava stream
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let j = 1; j < pts.length; j++) {
          const midX = (pts[j - 1].x + pts[j].x) * 0.5;
          const midY = (pts[j - 1].y + pts[j].y) * 0.5;
          ctx.quadraticCurveTo(pts[j - 1].x, pts[j - 1].y, midX, midY);
        }
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        ctx.strokeStyle = 'rgba(249, 115, 22, ' + (0.85 + magmaPulse * 0.15).toFixed(2) + ')';
        ctx.lineWidth = Math.max(1.4, rockR * 0.14);
        ctx.stroke();

        // Layer 2: Blinding 5000K incandescent white-gold core vein
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let j = 1; j < pts.length; j++) {
          const midX = (pts[j - 1].x + pts[j].x) * 0.5;
          const midY = (pts[j - 1].y + pts[j].y) * 0.5;
          ctx.quadraticCurveTo(pts[j - 1].x, pts[j - 1].y, midX, midY);
        }
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        ctx.strokeStyle = 'rgba(255, 255, 245, ' + (0.92 + magmaPulse * 0.08).toFixed(2) + ')';
        ctx.lineWidth = Math.max(0.8, rockR * 0.06);
        ctx.stroke();
      }

      ctx.restore(); // end clip
      ctx.restore();
    },

    // 4. Tier 3 Extra Big Quantum Realm Particle (Falling in Reflex Blitz & Displayed in Memory Matrix)
    drawTier3RealmParticle(ctx, p, now) {
      ctx.save();
      const headR = p.headR || 23.0;
      const K = p.spine.length;

      // ── 1. Tapered Inverse Kinematics Body Streamer ──
      const tailX = p.spine[K - 1].x;
      const tailY = p.spine[K - 1].y;
      const grad = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
      grad.addColorStop(0.0, "rgba(168, 85, 247, 0.0)");
      grad.addColorStop(0.35, "rgba(192, 132, 252, 0.45)");
      grad.addColorStop(0.70, "rgba(56, 189, 248, 0.85)");
      grad.addColorStop(1.0, "rgba(255, 255, 255, 0.98)");

      ctx.fillStyle = grad;
      // Draw smoothly tapered tail polygon
      ctx.beginPath();
      const perpAngle = Math.atan2(p.y - tailY, p.x - tailX) + Math.PI / 2;
      const cosP = Math.cos(perpAngle);
      const sinP = Math.sin(perpAngle);
      ctx.moveTo(p.x - cosP * (headR * 0.85), p.y - sinP * (headR * 0.85));
      for (let i = 1; i < K; i++) {
        const seg = p.spine[i];
        const taper = 1.0 - (i / K);
        ctx.lineTo(seg.x - cosP * (headR * 0.85 * taper), seg.y - sinP * (headR * 0.85 * taper));
      }
      ctx.lineTo(tailX, tailY);
      for (let i = K - 1; i >= 1; i--) {
        const seg = p.spine[i];
        const taper = 1.0 - (i / K);
        ctx.lineTo(seg.x + cosP * (headR * 0.85 * taper), seg.y + sinP * (headR * 0.85 * taper));
      }
      ctx.lineTo(p.x + cosP * (headR * 0.85), p.y + sinP * (headR * 0.85));
      ctx.closePath();
      ctx.fill();

      // ── 2. Multi-Branch Crackling Lightning Electric Arcs along Spine ──
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i < K - 1; i++) {
        const seg = p.spine[i];
        const next = p.spine[i + 1];
        const mx = (seg.x + next.x) * 0.5 + Math.sin(now * 0.04 + i * 1.5) * 8;
        const my = (seg.y + next.y) * 0.5 + Math.cos(now * 0.04 + i * 1.5) * 6;
        if (i === 0) ctx.moveTo(seg.x, seg.y);
        ctx.lineTo(mx, my);
        ctx.lineTo(next.x, next.y);
      }
      ctx.stroke();

      // Secondary White Lightning Filament
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      for (let i = 0; i < K - 1; i++) {
        const seg = p.spine[i];
        const next = p.spine[i + 1];
        const mx = (seg.x + next.x) * 0.5 - Math.sin(now * 0.035 + i * 2.1) * 6;
        const my = (seg.y + next.y) * 0.5 - Math.cos(now * 0.035 + i * 2.1) * 4;
        if (i === 0) ctx.moveTo(seg.x, seg.y);
        ctx.lineTo(mx, my);
        ctx.lineTo(next.x, next.y);
      }
      ctx.stroke();

      // ── 3. Luminous Quantum Singularity Head ──
      const haloR = headR * 1.45;
      const aGrad = ctx.createRadialGradient(p.x, p.y, headR * 0.4, p.x, p.y, haloR);
      aGrad.addColorStop(0.0, "rgba(56, 189, 248, 0.45)");
      aGrad.addColorStop(0.6, "rgba(168, 85, 247, 0.22)");
      aGrad.addColorStop(1.0, "rgba(168, 85, 247, 0.0)");
      ctx.fillStyle = aGrad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
      ctx.fill();

      // Searing Spherical Core
      const hGrad = ctx.createRadialGradient(p.x - 2, p.y - 2, 2, p.x, p.y, headR);
      hGrad.addColorStop(0.0, "#ffffff");
      hGrad.addColorStop(0.35, "#38bdf8");
      hGrad.addColorStop(0.75, "#c084fc");
      hGrad.addColorStop(1.0, "#6b21a8");
      ctx.fillStyle = hGrad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, headR, 0, Math.PI * 2);
      ctx.fill();

      // ── 4. 3D Concentric & Precessing Bohr Orbitals with Quantum Spark ──
      ctx.save();
      ctx.translate(p.x, p.y);
      const spinAngle = now * 0.0032;

      // Inner Concentric Orbital
      ctx.beginPath();
      ctx.arc(0, 0, headR * 1.85, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(168, 85, 247, 0.45)";
      ctx.lineWidth = 1.35;
      ctx.stroke();

      // Outer Precessing Ellipse
      ctx.beginPath();
      ctx.ellipse(0, 0, headR * 2.35, headR * 1.15, spinAngle, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.55)";
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // Orbiting Quantum Spark Node
      const qNodeX = Math.cos(spinAngle) * (headR * 2.35);
      const qNodeY = Math.sin(spinAngle) * (headR * 1.15);
      ctx.beginPath();
      ctx.arc(qNodeX, qNodeY, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.restore();

      ctx.restore();
    },

    // 5. Tier 3 Extra Big Quantum Helix Particle (Falling in Reflex Blitz & Displayed in Memory Matrix)
    drawTier3HelixParticle(ctx, p, now) {
      ctx.save();
      const headR = p.headR || 23.0;
      const K = p.spine.length;
      const t = now * 0.003;
      const waveAmp = 15;

      // ── 1. Central Harmonic Phase-Beam ──
      ctx.beginPath();
      ctx.moveTo(p.spine[0].x, p.spine[0].y);
      for (let i = 1; i < K; i++) {
        ctx.lineTo(p.spine[i].x, p.spine[i].y);
      }
      ctx.strokeStyle = "rgba(165, 243, 252, 0.75)";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // ── 2. Cyan & Magenta Intertwining DNA Ribbons ──
      // Strand 1 (Electric Cyan)
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      for (let i = 0; i < K; i++) {
        const seg = p.spine[i];
        const offset = Math.sin(t - i * 0.75) * waveAmp;
        const px = seg.x + offset;
        if (i === 0) ctx.moveTo(px, seg.y); else ctx.lineTo(px, seg.y);
      }
      ctx.stroke();

      // Strand 2 (Royal Magenta)
      ctx.strokeStyle = "#d946ef";
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      for (let i = 0; i < K; i++) {
        const seg = p.spine[i];
        const offset = -Math.sin(t - i * 0.75) * waveAmp;
        const px = seg.x + offset;
        if (i === 0) ctx.moveTo(px, seg.y); else ctx.lineTo(px, seg.y);
      }
      ctx.stroke();

      // Base Pair Connecting Rungs with Energized Nucleotide Pearls
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 1.4;
      for (let i = 1; i < K - 1; i += 2) {
        const seg = p.spine[i];
        const offset = Math.sin(t - i * 0.75) * waveAmp;
        ctx.beginPath();
        ctx.moveTo(seg.x + offset, seg.y);
        ctx.lineTo(seg.x - offset, seg.y);
        ctx.stroke();

        // Pearl at midpoint
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }

      // ── 3. Glowing Cyan Droplet Head with Searing White Nucleus ──
      ctx.beginPath();
      ctx.arc(p.x, p.y, headR * 1.35, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34, 211, 238, 0.32)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, headR, 0, Math.PI * 2);
      ctx.fillStyle = "hsla(188, 98%, 74%, 0.98)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y + 2, headR * 0.44, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
      ctx.fill();

      // ── 4. Bi-Chromatic Cyan & Magenta 3D Orbitals ──
      ctx.save();
      ctx.translate(p.x, p.y);
      const spinAngle = now * 0.0032;

      // Cyan Ring
      ctx.beginPath();
      ctx.arc(0, 0, headR * 1.85, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(34, 211, 238, 0.45)";
      ctx.lineWidth = 1.30;
      ctx.stroke();

      // Magenta Ellipse
      ctx.beginPath();
      ctx.ellipse(0, 0, headR * 2.35, headR * 1.15, spinAngle, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(217, 70, 239, 0.45)";
      ctx.lineWidth = 1.20;
      ctx.stroke();

      // Rotating Nucleotide Node
      const nNodeX = Math.cos(spinAngle) * (headR * 2.35);
      const nNodeY = Math.sin(spinAngle) * (headR * 1.15);
      ctx.beginPath();
      ctx.arc(nNodeX, nNodeY, 2.0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(165, 243, 252, 0.98)";
      ctx.fill();
      ctx.restore();

      ctx.restore();
    },

    // 6. Tier 3 Extra Big Quantum Meteor Particle (Falling in Reflex Blitz & Displayed in Memory Matrix)
    drawTier3MeteorParticle(ctx, p, now) {
      ctx.save();
      const headR = p.headR || 24.0;
      const K = p.spine.length;

      // ── 1. Solar Prominence Smoke Puffs ──
      const puffR = headR * 1.45;
      const tailX = p.spine[K - 1].x;
      const tailY = p.spine[K - 1].y;

      const smokeGrad = ctx.createRadialGradient(tailX, tailY, puffR * 0.2, tailX, tailY, puffR);
      smokeGrad.addColorStop(0.0, "rgba(80, 50, 40, 0.35)");
      smokeGrad.addColorStop(0.5, "rgba(50, 30, 25, 0.18)");
      smokeGrad.addColorStop(1.0, "rgba(30, 20, 20, 0.0)");
      ctx.fillStyle = smokeGrad;
      ctx.beginPath();
      ctx.arc(tailX, tailY, puffR, 0, Math.PI * 2);
      ctx.fill();

      // ── 2. Real Fire Inner Core Convective Flame Tongue ──
      const flameEndIdx = Math.min(K - 1, Math.max(2, (K * 0.75) | 0));
      const fGrad = ctx.createLinearGradient(p.spine[flameEndIdx].x, p.spine[flameEndIdx].y, p.x, p.y);
      fGrad.addColorStop(0.0, "rgba(185, 28, 28, 0.0)");
      fGrad.addColorStop(0.3, "rgba(234, 88, 12, 0.65)");
      fGrad.addColorStop(0.7, "rgba(251, 146, 60, 0.88)");
      fGrad.addColorStop(1.0, "rgba(255, 255, 245, 0.98)");

      // Outer Flame Tongue
      ctx.fillStyle = fGrad;
      ctx.beginPath();
      ctx.moveTo(p.x - headR * 0.85, p.y);
      ctx.quadraticCurveTo(p.x - headR * 0.4, p.spine[flameEndIdx].y + 10, tailX, tailY);
      ctx.quadraticCurveTo(p.x + headR * 0.4, p.spine[flameEndIdx].y + 10, p.x + headR * 0.85, p.y);
      ctx.closePath();
      ctx.fill();

      // Inner White-Hot Flame Core
      const innerFlameGrad = ctx.createLinearGradient(p.spine[flameEndIdx].x, p.spine[flameEndIdx].y, p.x, p.y);
      innerFlameGrad.addColorStop(0.0, "rgba(249, 115, 22, 0.0)");
      innerFlameGrad.addColorStop(0.4, "rgba(254, 240, 138, 0.85)");
      innerFlameGrad.addColorStop(1.0, "rgba(255, 255, 255, 1.0)");
      ctx.strokeStyle = innerFlameGrad;
      ctx.lineWidth = headR * 0.48;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      for (let sj = 1; sj <= flameEndIdx; sj++) {
        ctx.lineTo(p.spine[sj].x, p.spine[sj].y);
      }
      ctx.stroke();

      // ── 3. Hyper-Realistic Procedural 3D Molten Asteroid Body (32-point craggy contour) ──
      const rockR = headR * 1.15;
      const SAMPLES = 32;
      const dTheta = (Math.PI * 2) / SAMPLES;
      const contourPts = [];
      const tumble = now * 0.002;

      for (let s = 0; s < SAMPLES; s++) {
        const th = s * dTheta;
        let rVar = 1.0;
        rVar += Math.sin(th * 2 + tumble * 0.7) * 0.14;
        rVar += Math.cos(th * 3) * 0.09;
        rVar += Math.sin(th * 5) * 0.06;
        const rad = rockR * Math.max(0.70, rVar);
        contourPts.push({ x: p.x + Math.cos(th) * rad, y: p.y + Math.sin(th) * rad });
      }

      ctx.save();
      ctx.beginPath();
      for (let s = 0; s < SAMPLES; s++) {
        if (s === 0) ctx.moveTo(contourPts[s].x, contourPts[s].y);
        else ctx.lineTo(contourPts[s].x, contourPts[s].y);
      }
      ctx.closePath();
      ctx.clip();

      // 3D Directional Lighting
      const bodyGrad = ctx.createRadialGradient(p.x - rockR * 0.4, p.y - rockR * 0.5, rockR * 0.1, p.x, p.y, rockR * 1.3);
      bodyGrad.addColorStop(0.0, "#5c4537");
      bodyGrad.addColorStop(0.35, "#3d2b20");
      bodyGrad.addColorStop(0.70, "#21140e");
      bodyGrad.addColorStop(1.0, "#050302");
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // 3D Impact Craters with Magma Wells
      const craters = [
        { x: -0.32, y: -0.38, r: 0.22 },
        { x: 0.35, y: -0.22, r: 0.25 },
        { x: -0.15, y: 0.32, r: 0.26 }
      ];
      for (let c = 0; c < craters.length; c++) {
        const cr = craters[c];
        const crX = p.x + cr.x * rockR;
        const crY = p.y + cr.y * rockR;
        const crRad = rockR * cr.r;
        ctx.beginPath();
        ctx.arc(crX, crY, crRad, 0, Math.PI * 2);
        ctx.fillStyle = "#070302";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(crX, crY, crRad * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(254, 240, 138, 0.90)";
        ctx.fill();
      }

      // 5000K Incandescent White-Gold Magma Fissures
      const fissures = [
        [[-0.55, -0.30], [-0.15, -0.08], [0.08, 0.06], [0.45, 0.25]],
        [[0.28, -0.45], [0.08, 0.06], [-0.25, 0.40]]
      ];
      for (let fc = 0; fc < fissures.length; fc++) {
        const chain = fissures[fc];
        ctx.beginPath();
        for (let j = 0; j < chain.length; j++) {
          const fx = p.x + chain[j][0] * rockR;
          const fy = p.y + chain[j][1] * rockR;
          if (j === 0) ctx.moveTo(fx, fy); else ctx.lineTo(fx, fy);
        }
        ctx.strokeStyle = "rgba(249, 115, 22, 0.85)";
        ctx.lineWidth = Math.max(1.4, rockR * 0.14);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 255, 245, 0.95)";
        ctx.lineWidth = Math.max(0.8, rockR * 0.06);
        ctx.stroke();
      }
      ctx.restore(); // end clip

      // ── 4. Orbiting Molten Ember Plasma Ring ──
      const orbBaseRM = rockR * 1.95;
      const spinM = now * 0.0035;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, orbBaseRM * 1.2, orbBaseRM * 0.7, spinM, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(251, 146, 60, 0.45)";
      ctx.lineWidth = 1.35;
      ctx.stroke();

      // Orbiting Ember Spark
      const eNodeX = p.x + Math.cos(spinM) * (orbBaseRM * 1.2);
      const eNodeY = p.y + Math.sin(spinM) * (orbBaseRM * 0.7);
      ctx.beginPath();
      ctx.arc(eNodeX, eNodeY, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 240, 138, 0.98)";
      ctx.fill();

      ctx.restore();
    }
  };

  // --- Main Application State ---
  const state = {
    active: false,
    gameType: 'math', // 'math' | 'reflex' | 'memory'

    // Math Overdrive State
    mathLevel: 1,
    mathQuestions: [],
    mathQIdx: 0,
    mathMistakes: 0,
    mathTimer: null,
    mathTimeLeft: 100,

    // Reflex Blitz State
    reflexLives: 10,
    catcherType: 'realm', // 'realm' | 'helix' | 'meteor'
    catcherX: 0.5,
    lastTransmuteTime: 0,
    particles: [],

    // Memory Matrix State
    memoryRound: 1,
    memorySequence: [],
    playerSequence: [],
    isAcceptingInput: false,

    // Shared Stats
    score: 0,
    combo: 1,
    bestScores: {
      math: parseInt(localStorage.getItem('oc_best_math') || '0', 10),
      reflex: parseInt(localStorage.getItem('oc_best_reflex') || '0', 10),
      memory: parseInt(localStorage.getItem('oc_best_memory') || '0', 10)
    }
  };

  let animFrameId = null;
  let dom = {};

  // --- DOM Initializer ---
  function initDOM() {
    dom = {
      modal: document.getElementById('chromeGameModal'),
      btnClose: document.getElementById('cgCloseBtn'),
      btnFullscreen: document.getElementById('cgFullscreenBtn'),
      btnMute: document.getElementById('cgMuteBtn'),
      scoreVal: document.getElementById('cgScoreVal'),
      comboVal: document.getElementById('cgComboVal'),
      bestVal: document.getElementById('cgBestVal'),
      gameTitle: document.getElementById('cgGameTitle'),
      gameSub: document.getElementById('cgGameSub'),

      // Game Views
      viewMath: document.getElementById('cgViewMath'),
      viewReflex: document.getElementById('cgViewReflex'),
      viewMemory: document.getElementById('cgViewMemory'),
      canvasReflex: document.getElementById('cgCanvasReflex'),

      // Math View Elements
      mathLevelTabs: document.querySelectorAll('.math-level-tab'),
      mathProgressLabel: document.getElementById('mathProgressLabel'),
      mathShields: document.getElementById('mathShields'),
      mathEquation: document.getElementById('mathEquation'),
      mathTimeBar: document.getElementById('mathTimeBar'),
      mathOptions: document.querySelectorAll('.math-opt-btn'),

      // Reflex View Elements
      reflexShields: document.getElementById('reflexShields'),
      transmuteIndicator: document.getElementById('transmuteIndicator'),

      // Memory View Elements
      memoryRoundLabel: document.getElementById('memoryRoundLabel'),
      memoryGrid: document.getElementById('memoryGrid'),

      // Overlays
      screenOverlay: document.getElementById('cgScreenOverlay'),
      screenTitle: document.getElementById('cgScreenTitle'),
      screenDesc: document.getElementById('cgScreenDesc'),
      btnStartAction: document.getElementById('cgBtnStartAction')
    };
  }

  // --- Fullscreen Manager ---
  function toggleAppFullscreen() {
    if (!document.fullscreenElement) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  // --- Game Modal Launch & Lifecycle ---
  function openGame(type = 'math') {
    initDOM();
    if (!dom.modal) return;

    state.gameType = type;
    dom.modal.classList.add('active');
    dom.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Activate the corresponding view
    if (dom.viewMath) dom.viewMath.style.display = type === 'math' ? 'flex' : 'none';
    if (dom.viewReflex) dom.viewReflex.style.display = type === 'reflex' ? 'block' : 'none';
    if (dom.viewMemory) dom.viewMemory.style.display = type === 'memory' ? 'flex' : 'none';

    updateHeaderUI();
    startGame(type);
  }

  function closeGame() {
    state.active = false;
    clearInterval(state.mathTimer);
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    if (dom.modal) {
      dom.modal.classList.remove('active');
      dom.modal.style.display = 'none';
    }
    document.body.style.overflow = '';
  }

  function updateHeaderUI() {
    if (!dom.gameTitle) return;

    if (state.gameType === 'math') {
      dom.gameTitle.textContent = 'MATH OVERDRIVE';
      dom.gameSub.textContent = `Level ${state.mathLevel} · 20 Questions · 10 Mistakes Max`;
    } else if (state.gameType === 'reflex') {
      dom.gameTitle.textContent = 'REFLEX BLITZ';
      dom.gameSub.textContent = 'Quantum Realm · Helix · Meteor Catcher (10 Lives)';
    } else if (state.gameType === 'memory') {
      dom.gameTitle.textContent = 'MEMORY MATRIX';
      dom.gameSub.textContent = '16-Box Quantum Array (1 Mistake = Game Over)';
    }

    if (dom.scoreVal) dom.scoreVal.textContent = state.score.toLocaleString();
    if (dom.comboVal) dom.comboVal.textContent = `${state.combo}x`;
    if (dom.bestVal) dom.bestVal.textContent = (state.bestScores[state.gameType] || 0).toLocaleString();
  }

  function startGame(type) {
    state.active = true;
    state.score = 0;
    state.combo = 1;
    updateHeaderUI();

    if (dom.screenOverlay) dom.screenOverlay.style.display = 'none';

    if (type === 'math') {
      startMathGame();
    } else if (type === 'reflex') {
      startReflexGame();
    } else if (type === 'memory') {
      startMemoryGame();
    }
  }

  function handleGameOver(title, desc) {
    state.active = false;
    clearInterval(state.mathTimer);
    if (animFrameId) cancelAnimationFrame(animFrameId);

    // Save best score
    if (state.score > (state.bestScores[state.gameType] || 0)) {
      state.bestScores[state.gameType] = state.score;
      localStorage.setItem(`oc_best_${state.gameType}`, state.score.toString());
      desc += `\n🌟 NEW PERSONAL RECORD: ${state.score.toLocaleString()} PTS!`;
    }

    if (dom.screenTitle) dom.screenTitle.textContent = title;
    if (dom.screenDesc) dom.screenDesc.textContent = desc;
    if (dom.btnStartAction) dom.btnStartAction.textContent = 'PLAY AGAIN';
    if (dom.screenOverlay) dom.screenOverlay.style.display = 'flex';
    audio.playMistakeBuzzer();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GAME 1: MATH OVERDRIVE (Eight-Level System)
  // ══════════════════════════════════════════════════════════════════════════
  function startMathGame() {
    state.mathMistakes = 0;
    state.mathQIdx = 0;
    state.mathQuestions = MathEngine.generateLevelSet(state.mathLevel);
    renderMathShields();
    presentMathQuestion();
  }

  function renderMathShields() {
    if (!dom.mathShields) return;
    const remaining = 10 - state.mathMistakes;
    dom.mathShields.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const cell = document.createElement('span');
      cell.className = `shield-cell ${i < remaining ? 'shield-on' : 'shield-lost'}`;
      dom.mathShields.appendChild(cell);
    }
  }

  function presentMathQuestion() {
    if (state.mathQIdx >= 20) {
      // Level Complete!
      audio.playVictoryFanfare();
      state.score += 500 * state.mathLevel;
      if (state.mathLevel < 8) {
        state.mathLevel++;
        handleGameOver(
          `LEVEL ${state.mathLevel - 1} COMPLETED!`,
          `Exceptional fluency! Advancing to Level ${state.mathLevel}. Total Score: ${state.score}`
        );
      } else {
        handleGameOver(
          'MASTER MATHEMATICIAN!',
          `You conquered all 8 difficulty levels with ${10 - state.mathMistakes} shields remaining!`
        );
      }
      return;
    }

    const q = state.mathQuestions[state.mathQIdx];
    if (dom.mathEquation) dom.mathEquation.textContent = `${q.expr} = ?`;
    if (dom.mathProgressLabel) dom.mathProgressLabel.textContent = `QUESTION ${state.mathQIdx + 1} / 20`;

    // Render 4 Options
    dom.mathOptions.forEach((btn, idx) => {
      btn.textContent = q.options[idx];
      btn.className = 'math-opt-btn';
      btn.onclick = () => checkMathAnswer(q.options[idx], q.ans);
    });

    // Reset countdown timer (4.5s)
    clearInterval(state.mathTimer);
    let timeLeft = 100;
    if (dom.mathTimeBar) dom.mathTimeBar.style.width = '100%';

    state.mathTimer = setInterval(() => {
      timeLeft -= 2.2;
      if (dom.mathTimeBar) dom.mathTimeBar.style.width = `${Math.max(0, timeLeft)}%`;

      if (timeLeft <= 0) {
        clearInterval(state.mathTimer);
        // Timeout counts as a mistake
        registerMathMistake();
        state.mathQIdx++;
        presentMathQuestion();
      }
    }, 100);
  }

  function checkMathAnswer(selected, correct) {
    clearInterval(state.mathTimer);

    if (selected === correct) {
      // Correct!
      audio.playCorrectChime(state.combo);
      state.score += 100 * state.combo * state.mathLevel;
      state.combo = Math.min(8, state.combo + 1);
    } else {
      registerMathMistake();
    }

    updateHeaderUI();
    if (state.mathMistakes >= 10) {
      handleGameOver('10 MISTAKES EXCEEDED', `Level ${state.mathLevel} stopped at question ${state.mathQIdx + 1}/20.`);
      return;
    }

    state.mathQIdx++;
    setTimeout(presentMathQuestion, 300);
  }

  function registerMathMistake() {
    state.mathMistakes++;
    state.combo = 1;
    audio.playMistakeBuzzer();
    renderMathShields();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GAME 2: REFLEX BLITZ (Quantum Realm, Helix & Meteor Catcher)
  // ══════════════════════════════════════════════════════════════════════════
  function startReflexGame() {
    state.reflexLives = 10;
    state.catcherType = 'realm';
    state.catcherX = 0.5;
    state.lastTransmuteTime = performance.now();
    state.particles = [];

    renderReflexShields();
    updateTransmuteIndicator();
    resizeCanvas();

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(reflexGameLoop);
  }

  function renderReflexShields() {
    if (!dom.reflexShields) return;
    dom.reflexShields.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const cell = document.createElement('span');
      cell.className = `shield-cell ${i < state.reflexLives ? 'shield-on' : 'shield-lost'}`;
      dom.reflexShields.appendChild(cell);
    }
  }

  function updateTransmuteIndicator() {
    if (!dom.transmuteIndicator) return;
    const labels = {
      realm: '⚛️ ACTIVE CORE: QUANTUM REALM (Catch Rainbow Streamers!)',
      helix: '🧬 ACTIVE CORE: QUANTUM HELIX (Catch Cyan/Magenta Strands!)',
      meteor: '☄️ ACTIVE CORE: QUANTUM METEOR (Catch Fiery Asteroids!)'
    };
    dom.transmuteIndicator.textContent = labels[state.catcherType];
    dom.transmuteIndicator.className = `transmute-badge transmute-${state.catcherType}`;
  }

  function resizeCanvas() {
    if (!dom.canvasReflex) return;
    const dpr = window.devicePixelRatio || 1;
    dom.canvasReflex.width = window.innerWidth * dpr;
    dom.canvasReflex.height = window.innerHeight * dpr;
  }

  function reflexGameLoop(timestamp) {
    if (!state.active || state.gameType !== 'reflex') return;

    const ctx = dom.canvasReflex?.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = dom.canvasReflex.width / dpr;
    const h = dom.canvasReflex.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Subtle Quantum Grid Background
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Check Core Transmutation (Morphs every 11 seconds)
    if (timestamp - state.lastTransmuteTime > 11000) {
      const types = ['realm', 'helix', 'meteor'].filter(t => t !== state.catcherType);
      state.catcherType = types[Math.floor(Math.random() * types.length)];
      state.lastTransmuteTime = timestamp;
      audio.playMorphChime();
      updateTransmuteIndicator();
    }

    // Spawn Tier 3 Extra Big Flagship Particles
    if (Math.random() < 0.038) {
      const types = ['realm', 'helix', 'meteor'];
      const pType = types[Math.floor(Math.random() * types.length)];
      const px = Math.random() * (w - 140) + 70;
      const speed = 3.2 + Math.random() * 2.4;

      const p = {
        type: pType,
        x: px,
        y: -45,
        speed: speed,
        headR: 24.0,
        spine: [],
        stardust: []
      };

      for (let j = 0; j < 8; j++) {
        p.spine.push({ x: px, y: -45 - j * 8.5 });
      }
      state.particles.push(p);
    }

    // Draw Quantum Core (Player Atom / Singularity Core) Catcher at Bottom
    const catcherPixelX = Math.max(55, Math.min(w - 55, state.catcherX * w));
    const catcherPixelY = h - 75;

    if (state.catcherType === 'realm') {
      QuantumRenderer.drawQuantumAtomic(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
    } else if (state.catcherType === 'helix') {
      QuantumRenderer.drawHelixCore(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
    } else {
      QuantumRenderer.drawMeteorAsteroid(ctx, catcherPixelX, catcherPixelY, timestamp, 0.5);
    }

    // Update and Render Falling Tier 3 Extra Big Particles with Exact Tail FX & World-Space Stardust
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.y += p.speed;

      // Update spine IK with natural fluid sway
      p.spine[0].x = p.x;
      p.spine[0].y = p.y;
      for (let j = 1; j < p.spine.length; j++) {
        p.spine[j].y = p.y - j * 8.5;
        p.spine[j].x = p.x + Math.sin(timestamp * 0.005 + j * 0.6) * (j * 1.1);
      }

      // Render Particle
      if (p.type === 'realm') {
        QuantumRenderer.drawTier3RealmParticle(ctx, p, timestamp);
      } else if (p.type === 'helix') {
        QuantumRenderer.drawTier3HelixParticle(ctx, p, timestamp);
      } else {
        QuantumRenderer.drawTier3MeteorParticle(ctx, p, timestamp);
      }

      // Trailing Stardust Sparks in World Space
      p.stardust = p.stardust || [];
      if (p.type === 'realm') {
        if (Math.random() < 0.65 && p.stardust.length < 14) {
          const segIdx = 1 + Math.floor(Math.random() * (p.spine.length - 1));
          p.stardust.push({
            x: p.spine[segIdx].x + (Math.random() - 0.5) * 28,
            y: p.spine[segIdx].y + (Math.random() - 0.5) * 16,
            r: 0.8 + Math.random() * 1.6,
            alpha: 0.98,
            hue: Math.random() < 0.76 ? (190 + Math.random() * 24) : (258 + Math.random() * 22),
            electric: true
          });
        }
      } else if (p.type === 'helix') {
        if (Math.random() < 0.45 && p.stardust.length < 10) {
          const segIdx = 1 + Math.floor(Math.random() * (p.spine.length - 1));
          const isCyan = Math.random() < 0.5;
          p.stardust.push({
            x: p.spine[segIdx].x + (Math.random() - 0.5) * 24,
            y: p.spine[segIdx].y + (Math.random() - 0.5) * 16,
            r: 0.8 + Math.random() * 1.5,
            alpha: 0.98,
            hue: isCyan ? (186 + Math.random() * 16) : (294 + Math.random() * 30),
            helix: true
          });
        }
      } else {
        if (Math.random() < 0.68 && p.stardust.length < 14) {
          const segIdx = 1 + Math.floor(Math.random() * (p.spine.length - 1));
          p.stardust.push({
            x: p.spine[segIdx].x + (Math.random() - 0.5) * 26,
            y: p.spine[segIdx].y + (Math.random() - 0.5) * 16,
            r: 0.8 + Math.random() * 1.6,
            alpha: 0.98,
            hue: 22 + Math.random() * 26,
            meteor: true
          });
        }
      }

      // Draw and advance stardust
      for (let s = p.stardust.length - 1; s >= 0; s--) {
        const spk = p.stardust[s];
        spk.alpha *= spk.meteor ? 0.90 : 0.88;
        spk.y -= 0.6;
        if (spk.alpha > 0.05) {
          ctx.beginPath();
          ctx.arc(spk.x, spk.y, spk.r * 2.2, 0, Math.PI * 2);
          if (spk.meteor) {
            ctx.fillStyle = 'rgba(255, ' + Math.round(135 + spk.hue * 2.2) + ', 60, ' + (spk.alpha * 0.35).toFixed(2) + ')';
          } else {
            ctx.fillStyle = 'hsla(' + Math.round(spk.hue) + ', 100%, 68%, ' + (spk.alpha * 0.30).toFixed(2) + ')';
          }
          ctx.fill();

          ctx.beginPath();
          ctx.arc(spk.x, spk.y, spk.r, 0, Math.PI * 2);
          if (spk.meteor) {
            ctx.fillStyle = 'rgba(255, ' + Math.round(180 + spk.hue * 1.5) + ', 120, ' + spk.alpha.toFixed(2) + ')';
          } else {
            ctx.fillStyle = 'hsla(' + Math.round(spk.hue) + ', 100%, 78%, ' + spk.alpha.toFixed(2) + ')';
          }
          ctx.fill();

          if (spk.alpha > 0.4 && spk.r > 1.0) {
            ctx.beginPath();
            ctx.arc(spk.x, spk.y, spk.r * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
          }
        } else {
          p.stardust.splice(s, 1);
        }
      }

      // Collision Detection with Quantum Core Catcher
      const dist = Math.hypot(p.x - catcherPixelX, p.y - catcherPixelY);
      if (dist < 48) {
        if (p.type === state.catcherType) {
          // Correct Catch!
          state.score += 150 * state.combo;
          state.combo = Math.min(10, state.combo + 1);
          audio.playCorrectChime(state.combo);
        } else {
          // Mismatched Catch: Lose 1 Life!
          state.reflexLives--;
          state.combo = 1;
          audio.playMistakeBuzzer();
          renderReflexShields();

          if (state.reflexLives <= 0) {
            handleGameOver('OUT OF SHIELDS', `Surpassed ${state.score.toLocaleString()} points dodging anomalies.`);
            ctx.restore();
            return;
          }
        }
        state.particles.splice(i, 1);
        updateHeaderUI();
        continue;
      }

      // Screen exit
      if (p.y > h + 70) {
        state.particles.splice(i, 1);
      }
    }

    ctx.restore();
    animFrameId = requestAnimationFrame(reflexGameLoop);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GAME 3: MEMORY MATRIX (16 Boxes 4x4 Array, 1 Mistake Game Over)
  // ══════════════════════════════════════════════════════════════════════════
  const MATRIX_PALETTES = [
    { name: 'Realm Core', color: '#a855f7', type: 'core-realm' },
    { name: 'Helix Core', color: '#06b6d4', type: 'core-helix' },
    { name: 'Meteor Core', color: '#f59e0b', type: 'core-meteor' },
    { name: 'Tier 3 Realm', color: '#38bdf8', type: 'tier3-realm' },
    { name: 'Tier 3 Helix', color: '#d946ef', type: 'tier3-helix' },
    { name: 'Tier 3 Meteor', color: '#ea580c', type: 'tier3-meteor' },
    { name: 'Emerald Core', color: '#10b981', type: 'core-realm' },
    { name: 'Rose Helix', color: '#f43f5e', type: 'core-helix' },
    { name: 'Solar Flame', color: '#f97316', type: 'core-meteor' },
    { name: 'Cyan Apex', color: '#0ea5e9', type: 'tier3-realm' },
    { name: 'Violet Wave', color: '#9333ea', type: 'tier3-helix' },
    { name: 'Molten Rock', color: '#dc2626', type: 'tier3-meteor' },
    { name: 'Gold Singularity', color: '#ffd700', type: 'core-realm' },
    { name: 'Orchid Pulse', color: '#c084fc', type: 'core-helix' },
    { name: 'Corona Blaze', color: '#fbbf24', type: 'core-meteor' },
    { name: 'White Nova', color: '#f8fafc', type: 'tier3-realm' }
  ];

  function startMemoryGame() {
    state.memoryRound = 1;
    state.memorySequence = [];
    state.playerSequence = [];
    state.isAcceptingInput = false;

    renderMemoryGrid();
    advanceMemoryRound();

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(memoryGameLoop);
  }

  function memoryGameLoop(timestamp) {
    if (!state.active || state.gameType !== 'memory') return;

    if (dom.memoryGrid && dom.memoryGrid.children.length === 16) {
      for (let i = 0; i < 16; i++) {
        const box = dom.memoryGrid.children[i];
        const canvas = box.querySelector('canvas');
        if (!canvas) continue;
        const ctx = canvas.getContext('2d');
        const cx = 60, cy = 52;
        ctx.clearRect(0, 0, 120, 120);

        const pal = MATRIX_PALETTES[i];
        if (pal.type === 'core-realm') {
          QuantumRenderer.drawQuantumAtomic(ctx, cx, cy, timestamp + i * 200, 0);
        } else if (pal.type === 'core-helix') {
          QuantumRenderer.drawHelixCore(ctx, cx, cy, timestamp + i * 200, 0);
        } else if (pal.type === 'core-meteor') {
          QuantumRenderer.drawMeteorAsteroid(ctx, cx, cy, timestamp + i * 200, 0);
        } else if (pal.type === 'tier3-realm') {
          const fakeP = { x: cx, y: cy + 12, headR: 17.0, spine: [] };
          for (let j = 0; j < 7; j++) fakeP.spine.push({ x: cx, y: cy + 12 - j * 6 });
          QuantumRenderer.drawTier3RealmParticle(ctx, fakeP, timestamp + i * 200);
        } else if (pal.type === 'tier3-helix') {
          const fakeP = { x: cx, y: cy + 12, headR: 17.0, spine: [] };
          for (let j = 0; j < 7; j++) fakeP.spine.push({ x: cx, y: cy + 12 - j * 6 });
          QuantumRenderer.drawTier3HelixParticle(ctx, fakeP, timestamp + i * 200);
        } else if (pal.type === 'tier3-meteor') {
          const fakeP = { x: cx, y: cy + 12, headR: 18.0, spine: [] };
          for (let j = 0; j < 7; j++) fakeP.spine.push({ x: cx, y: cy + 12 - j * 6 });
          QuantumRenderer.drawTier3MeteorParticle(ctx, fakeP, timestamp + i * 200);
        }
      }
    }

    animFrameId = requestAnimationFrame(memoryGameLoop);
  }

  function renderMemoryGrid() {
    if (!dom.memoryGrid) return;
    dom.memoryGrid.innerHTML = '';

    for (let i = 0; i < 16; i++) {
      const pal = MATRIX_PALETTES[i];
      const box = document.createElement('div');
      box.className = 'matrix-box';
      box.dataset.index = i;
      box.style.setProperty('--box-color', pal.color);

      // Mini Canvas inside box for live character rendering
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 120;
      box.appendChild(canvas);

      const label = document.createElement('span');
      label.className = 'matrix-box-label';
      label.textContent = pal.name;
      box.appendChild(label);

      // Initial character preview render
      const ctx = canvas.getContext('2d');
      const cx = 60, cy = 52;
      if (pal.type === 'core-realm') {
        QuantumRenderer.drawQuantumAtomic(ctx, cx, cy, 1000 + i * 200);
      } else if (pal.type === 'core-helix') {
        QuantumRenderer.drawHelixCore(ctx, cx, cy, 1000 + i * 200);
      } else if (pal.type === 'core-meteor') {
        QuantumRenderer.drawMeteorAsteroid(ctx, cx, cy, 1000 + i * 200);
      } else if (pal.type === 'tier3-realm') {
        const fakeP = { x: cx, y: cy + 12, headR: 17.0, spine: [] };
        for (let j = 0; j < 7; j++) fakeP.spine.push({ x: cx, y: cy + 12 - j * 6 });
        QuantumRenderer.drawTier3RealmParticle(ctx, fakeP, 1000 + i * 200);
      } else if (pal.type === 'tier3-helix') {
        const fakeP = { x: cx, y: cy + 12, headR: 17.0, spine: [] };
        for (let j = 0; j < 7; j++) fakeP.spine.push({ x: cx, y: cy + 12 - j * 6 });
        QuantumRenderer.drawTier3HelixParticle(ctx, fakeP, 1000 + i * 200);
      } else if (pal.type === 'tier3-meteor') {
        const fakeP = { x: cx, y: cy + 12, headR: 18.0, spine: [] };
        for (let j = 0; j < 7; j++) fakeP.spine.push({ x: cx, y: cy + 12 - j * 6 });
        QuantumRenderer.drawTier3MeteorParticle(ctx, fakeP, 1000 + i * 200);
      }

      box.onclick = () => handleMemoryBoxClick(i);
      dom.memoryGrid.appendChild(box);
    }
  }

  function advanceMemoryRound() {
    state.playerSequence = [];
    state.isAcceptingInput = false;
    state.memorySequence.push(Math.floor(Math.random() * 16));

    if (dom.memoryRoundLabel) {
      dom.memoryRoundLabel.textContent = `ROUND ${state.memoryRound} · WATCH MATRIX SEQUENCE`;
    }

    // Playback sequence
    let step = 0;
    const interval = setInterval(() => {
      if (step >= state.memorySequence.length) {
        clearInterval(interval);
        state.isAcceptingInput = true;
        if (dom.memoryRoundLabel) {
          dom.memoryRoundLabel.textContent = `ROUND ${state.memoryRound} · YOUR TURN! (1 MISTAKE = GAME OVER)`;
        }
        return;
      }

      flashMemoryBox(state.memorySequence[step]);
      step++;
    }, 700);
  }

  function flashMemoryBox(index) {
    const box = dom.memoryGrid?.children[index];
    if (!box) return;

    box.classList.add('box-flashing');
    audio.playMatrixTone(index);

    setTimeout(() => {
      box.classList.remove('box-flashing');
    }, 400);
  }

  function handleMemoryBoxClick(index) {
    if (!state.active || !state.isAcceptingInput) return;

    flashMemoryBox(index);
    state.playerSequence.push(index);

    const stepIdx = state.playerSequence.length - 1;
    if (state.playerSequence[stepIdx] !== state.memorySequence[stepIdx]) {
      // 1 MISTAKE = GAME OVER!
      handleGameOver(
        'SUDDEN DEATH: MATRIX OVERLOAD',
        `Mistake on step ${stepIdx + 1} of Round ${state.memoryRound}. In Memory Matrix, one mistake ends the simulation!`
      );
      return;
    }

    if (state.playerSequence.length === state.memorySequence.length) {
      // Round Complete!
      state.score += 250 * state.memoryRound;
      state.memoryRound++;
      updateHeaderUI();
      audio.playCorrectChime(state.memoryRound);
      state.isAcceptingInput = false;
      setTimeout(advanceMemoryRound, 900);
    }
  }

  // --- Keyboard & Mouse Steering ---
  function initControls() {
    window.addEventListener('keydown', (e) => {
      if (dom.modal && dom.modal.style.display === 'flex') {
        if (e.key === 'Escape') {
          closeGame();
        } else if (state.active && state.gameType === 'math') {
          if (['1', '2', '3', '4'].includes(e.key)) {
            const idx = parseInt(e.key, 10) - 1;
            if (dom.mathOptions[idx]) dom.mathOptions[idx].click();
          }
        } else if (state.active && state.gameType === 'reflex') {
          if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
            state.catcherX = Math.max(0.06, state.catcherX - 0.06);
          } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
            state.catcherX = Math.min(0.94, state.catcherX + 0.06);
          }
        }
      }
    });

    const handlePointerMove = (clientX) => {
      if (state.active && state.gameType === 'reflex') {
        state.catcherX = Math.max(0.05, Math.min(0.95, clientX / window.innerWidth));
      }
    };

    window.addEventListener('mousemove', (e) => handlePointerMove(e.clientX));
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) handlePointerMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('resize', resizeCanvas);
  }

  // --- Event Bindings ---
  function initEvents() {
    initDOM();
    initControls();

    if (dom.btnClose) dom.btnClose.onclick = closeGame;
    if (dom.btnFullscreen) dom.btnFullscreen.onclick = toggleAppFullscreen;
    if (dom.btnMute) {
      dom.btnMute.onclick = () => {
        audio.isMuted = !audio.isMuted;
        dom.btnMute.innerHTML = audio.isMuted ? '🔇' : '🔊';
      };
    }
    if (dom.btnStartAction) {
      dom.btnStartAction.onclick = () => startGame(state.gameType);
    }

    // Level selector tabs
    dom.mathLevelTabs.forEach(tab => {
      tab.onclick = () => {
        const lvl = parseInt(tab.dataset.level, 10);
        state.mathLevel = lvl;
        dom.mathLevelTabs.forEach(t => t.classList.toggle('active', t === tab));
        startMathGame();
      };
    });

    // Designated topbar launch buttons
    const btnMath = document.getElementById('btnLaunchMathGame');
    const btnReflex = document.getElementById('btnLaunchReflexGame');
    const btnMemory = document.getElementById('btnLaunchMemoryGame');
    const btnTopFullscreen = document.getElementById('btnTopbarFullscreen');

    if (btnMath) btnMath.onclick = () => openGame('math');
    if (btnReflex) btnReflex.onclick = () => openGame('reflex');
    if (btnMemory) btnMemory.onclick = () => openGame('memory');
    if (btnTopFullscreen) btnTopFullscreen.onclick = toggleAppFullscreen;
  }

  // Global API
  window.chromeSynapseGame = {
    open: openGame,
    close: closeGame,
    toggleFullscreen: toggleAppFullscreen,
    setLevel: (lvl) => { state.mathLevel = lvl; }
  };
  window.openChromeGame = openGame;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEvents);
  } else {
    initEvents();
  }
})();
