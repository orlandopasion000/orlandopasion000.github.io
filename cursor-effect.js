/*!
 * ═══════════════════════════════════════════════
 *  AURORA CURSOR EFFECT  — by Sir Orlando Pasion
 *  Version 1.0
 *
 *  HOW TO USE IN ANY WEBSITE:
 *  Just paste this ONE line before </body> in your HTML:
 *
 *  <script src="cursor-effect.js"></script>
 *
 *  That's it. Works on any HTML file automatically.
 * ═══════════════════════════════════════════════
 */
(function () {

  /* ── SETTINGS — change these to customize ──────────────
     You can edit these values to adjust the effect.       */
  const CONFIG = {
    colors: [
      [155, 114, 207], // purple
      [224, 122, 95],  // coral
      [60,  179, 113], // teal
      [100, 180, 255], // sky blue
      [255, 200, 80],  // gold
      [220, 100, 180], // pink
    ],
    auroraDecay:    0.006,  // how fast glow particles fade (lower = longer trail)
    sparkDecay:     0.028,  // how fast spark particles fade
    burstCount:     30,     // how many stars explode on click
    speedThreshold: 7,      // mouse speed needed to trigger sparks
    spawnRate:      0.20,   // particles per pixel of movement
    innerLerp:      0.22,   // inner dot chase speed (0.1 = slow, 0.5 = instant)
    outerLerp:      0.10,   // outer ring chase speed
    orbitals:       5,      // number of orbiting dots around cursor
    constellationDist: 70,  // max distance for constellation lines (px)
    hoverSelector: 'a, button, input, select, textarea, [role="button"]',
  };
  /* ─────────────────────────────────────────────────── */

  /* ── Wait for DOM to be ready ── */
  function init() {

    /* 1. Create the canvas */
    const cv = document.createElement('canvas');
    cv.style.cssText = [
      'position:fixed', 'inset:0', 'width:100%', 'height:100%',
      'z-index:2147483647', 'pointer-events:none', 'top:0', 'left:0'
    ].join(';');
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');

    let W = cv.width  = window.innerWidth;
    let H = cv.height = window.innerHeight;
    window.addEventListener('resize', () => {
      W = cv.width  = window.innerWidth;
      H = cv.height = window.innerHeight;
    });

    /* 2. State */
    let isInside = false;
    let isHover  = false;
    let speed    = 0;
    let spawnAcc = 0;

    const mouse  = { x: -999, y: -999, px: -999, py: -999 };
    const dot    = { x: -999, y: -999, tx: -999, ty: -999 }; // fast inner dot
    const ring   = { x: -999, y: -999, tx: -999, ty: -999 }; // slow outer ring

    const particles   = [];
    const clickBursts = [];

    /* 3. Mouse enter / leave — KEY to your request */
    document.addEventListener('mouseenter', () => {
      isInside = true;
      document.body.style.cursor = 'none';
    });
    document.addEventListener('mouseleave', () => {
      isInside = false;
      document.body.style.cursor = 'auto'; // restore default cursor
      speed = 0;
    });

    /* 4. Mouse move */
    document.addEventListener('mousemove', e => {
      mouse.px = mouse.x; mouse.py = mouse.y;
      mouse.x  = e.clientX; mouse.y = e.clientY;
      speed    = Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py);
      dot.tx   = mouse.x; dot.ty   = mouse.y;
      ring.tx  = mouse.x; ring.ty  = mouse.y;
    });

    /* 5. Hover detection */
    document.addEventListener('mouseover', e => {
      isHover = !!(e.target.closest(CONFIG.hoverSelector));
    });

    /* 6. Click burst */
    document.addEventListener('click', e => {
      if (!isInside) return;
      clickBursts.push({ x: e.clientX, y: e.clientY, r: 0, life: 1 });
      for (let i = 0; i < CONFIG.burstCount; i++) {
        particles.push(new Particle(e.clientX, e.clientY, 'burst'));
      }
    });

    /* ── Particle class ── */
    class Particle {
      constructor(x, y, type) {
        this.x    = x + (Math.random() - 0.5) * 8;
        this.y    = y + (Math.random() - 0.5) * 8;
        this.type = type;
        this.col  = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];

        if (type === 'aurora') {
          const s = Math.random() * 1.4 + 0.2, a = Math.random() * Math.PI * 2;
          this.vx = Math.cos(a) * s + (Math.random() - 0.5) * speed * 0.25;
          this.vy = Math.sin(a) * s - Math.random() * 0.6;
          this.r  = Math.random() * 4 + 2;
          this.life = 1; this.decay = Math.random() * CONFIG.auroraDecay + 0.003;
          this.gravity = 0.010; this.drag = 0.988;

        } else if (type === 'spark') {
          const s = Math.random() * 6 + 3, a = Math.random() * Math.PI * 2;
          this.vx = Math.cos(a) * s + (Math.random() - 0.5) * speed * 0.5;
          this.vy = Math.sin(a) * s - Math.random() * 3;
          this.r  = Math.random() * 2.5 + 1;
          this.life = 1; this.decay = Math.random() * CONFIG.sparkDecay + 0.015;
          this.gravity = 0.10; this.drag = 0.935;
          this.angle = Math.random() * Math.PI * 2;
          this.spin  = (Math.random() - 0.5) * 0.35;

        } else { // burst
          const s = Math.random() * 8 + 4, a = Math.random() * Math.PI * 2;
          this.vx = Math.cos(a) * s; this.vy = Math.sin(a) * s - Math.random() * 2;
          this.r  = Math.random() * 5 + 2;
          this.life = 1; this.decay = Math.random() * 0.018 + 0.010;
          this.gravity = 0.055; this.drag = 0.955;
          this.angle = Math.random() * Math.PI * 2;
          this.spin  = (Math.random() - 0.5) * 0.18;
        }
      }

      update() {
        this.vx *= this.drag; this.vy *= this.drag;
        this.vy += this.gravity;
        this.x  += this.vx;  this.y  += this.vy;
        this.life -= this.decay;
        if (this.spin) this.angle += this.spin;
      }

      draw() {
        if (this.life <= 0) return;
        const [r, g, b] = this.col;
        ctx.save();

        if (this.type === 'aurora') {
          ctx.globalAlpha = Math.max(0, this.life * 0.75);
          const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
          grd.addColorStop(0,   `rgba(${r},${g},${b},1)`);
          grd.addColorStop(0.4, `rgba(${r},${g},${b},0.4)`);
          grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = grd;
          ctx.beginPath(); ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2); ctx.fill();

        } else if (this.type === 'spark') {
          ctx.globalAlpha = Math.max(0, this.life * 0.9);
          ctx.translate(this.x, this.y); ctx.rotate(this.angle);
          ctx.fillStyle = `rgba(${r},${g},${b},1)`;
          ctx.fillRect(-this.r / 2, -this.r * 0.4, this.r, this.r * 0.8);

        } else {
          ctx.globalAlpha = Math.max(0, this.life * 0.95);
          ctx.translate(this.x, this.y); ctx.rotate(this.angle);
          ctx.fillStyle = `rgba(${r},${g},${b},1)`;
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            ctx.lineTo(Math.cos(a) * (i % 2 === 0 ? this.r : this.r * 0.35),
                       Math.sin(a) * (i % 2 === 0 ? this.r : this.r * 0.35));
          }
          ctx.closePath(); ctx.fill();
          const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r * 2);
          sg.addColorStop(0, `rgba(${r},${g},${b},0.35)`);
          sg.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0, 0, this.r * 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
    }

    /* ── Constellation threads ── */
    function drawConstellation() {
      const live = particles.filter(p => p.life > 0.25 && p.type === 'aurora');
      const D = CONFIG.constellationDist;
      for (let i = 0; i < live.length; i++) {
        for (let j = i + 1; j < live.length; j++) {
          const d = Math.hypot(live[i].x - live[j].x, live[i].y - live[j].y);
          if (d < D) {
            const alpha = (1 - d / D) * Math.min(live[i].life, live[j].life) * 0.22;
            const [r, g, b] = live[i].col;
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(live[i].x, live[i].y);
            ctx.lineTo(live[j].x, live[j].y);
            ctx.stroke();
          }
        }
      }
    }

    /* ── Click shockwave rings ── */
    function drawBursts() {
      for (let i = clickBursts.length - 1; i >= 0; i--) {
        const b = clickBursts[i];
        b.r += 6; b.life -= 0.040;
        if (b.life <= 0) { clickBursts.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(224,122,95,${b.life * 0.85})`; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.55, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(155,114,207,${b.life * 0.5})`; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${b.life * 0.3})`; ctx.fill();
      }
    }

    /* ── Orbital dots ── */
    function drawOrbitals(x, y, t) {
      const N = CONFIG.orbitals, dist = isHover ? 24 : 17;
      for (let i = 0; i < N; i++) {
        const a  = (i / N) * Math.PI * 2 + t * 0.9;
        const ox = x + Math.cos(a) * dist;
        const oy = y + Math.sin(a) * dist;
        const [r, g, b] = CONFIG.colors[i % CONFIG.colors.length];
        const pulse = 0.35 + Math.sin(t * 2.5 + i * 1.4) * 0.35;
        ctx.beginPath(); ctx.arc(ox, oy, isHover ? 2.8 : 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${pulse})`; ctx.fill();
      }
    }

    /* ── Main cursor ── */
    function drawCursor(x, y, rx, ry, t) {
      if (isHover) {
        const hg = ctx.createRadialGradient(rx, ry, 0, rx, ry, 44);
        hg.addColorStop(0, 'rgba(224,122,95,0.14)');
        hg.addColorStop(1, 'rgba(224,122,95,0)');
        ctx.beginPath(); ctx.arc(rx, ry, 44, 0, Math.PI * 2);
        ctx.fillStyle = hg; ctx.fill();
      }
      const outerR = isHover ? 30 : 20;
      ctx.beginPath(); ctx.arc(rx, ry, outerR, 0, Math.PI * 2);
      ctx.strokeStyle = isHover ? 'rgba(224,122,95,0.7)' : 'rgba(155,114,207,0.45)';
      ctx.lineWidth = isHover ? 2 : 1.2; ctx.stroke();
      for (let i = 0; i < 3; i++) {
        const a0 = t * 1.6 + (i / 3) * Math.PI * 2;
        ctx.beginPath(); ctx.arc(rx, ry, outerR, a0, a0 + 0.55);
        const [r, g, b] = CONFIG.colors[i * 2];
        ctx.strokeStyle = `rgba(${r},${g},${b},0.95)`; ctx.lineWidth = 2.8; ctx.stroke();
      }
      drawOrbitals(x, y, t);
      const innerR = isHover ? 5 : 3;
      const ig = ctx.createRadialGradient(x, y, 0, x, y, innerR * 2.5);
      ig.addColorStop(0, 'rgba(255,255,255,1)');
      ig.addColorStop(0.35, isHover ? 'rgba(224,122,95,0.9)' : 'rgba(155,114,207,0.85)');
      ig.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath(); ctx.arc(x, y, innerR * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = ig; ctx.fill();
    }

    /* ── Particle spawner ── */
    function spawnParticles() {
      if (!isInside || speed < 0.5) return;
      spawnAcc += speed * CONFIG.spawnRate;
      while (spawnAcc >= 1) {
        spawnAcc--;
        particles.push(new Particle(mouse.x, mouse.y, 'aurora'));
        if (speed > CONFIG.speedThreshold) {
          particles.push(new Particle(mouse.x, mouse.y, 'spark'));
        }
      }
    }

    /* ── Main animation loop ── */
    const startT = performance.now();
    function loop() {
      ctx.clearRect(0, 0, W, H);
      const t = (performance.now() - startT) / 1000;

      dot.x  += (dot.tx  - dot.x)  * CONFIG.innerLerp;
      dot.y  += (dot.ty  - dot.y)  * CONFIG.innerLerp;
      ring.x += (ring.tx - ring.x) * CONFIG.outerLerp;
      ring.y += (ring.ty - ring.y) * CONFIG.outerLerp;

      spawnParticles();
      drawConstellation();

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) particles.splice(i, 1);
      }

      drawBursts();

      if (isInside) drawCursor(dot.x, dot.y, ring.x, ring.y, t);

      requestAnimationFrame(loop);
    }
    loop();
  }

  /* Run after page loads */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
