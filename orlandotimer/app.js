/**
 * Orlando Timer — Executive Horology Suite
 * Author: Sir Orlando V. Pasion, Jr.
 * Plain Vanilla JavaScript (ES6+), Zero Frameworks. Works offline & on GitHub Pages.
 * 
 * Comprehensive 2-Category Theming Architecture:
 * - Category 1: Global Application Theme (Controls entire visual identity, surfaces, glows, background, buttons)
 * - Category 2: Clock & Typography Style (Controls numeral typography, finishes, specular gradients, shadows)
 */

(function () {
  'use strict';
  // ── SAFE LOCAL STORAGE HELPERS ──
  function safeGetItem(key, fallback = null) {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? v : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeSetItem(key, value) {
    try {
      localStorage.setItem(key, String(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Global Productivity Mode State (Hoisted to prevent TDZ)
  let currentProductivityMode = safeGetItem('orlando-productivity-mode', 'focus-protocol');

  // ── ACCESSIBILITY: SCREEN READER LIVE REGION ANNOUNCER ──
  function announceSR(message) {
    const sr = document.getElementById('srAnnouncements');
    if (sr) {
      sr.textContent = '';
      setTimeout(() => { sr.textContent = message; }, 40);
    }
  }

  // ── DESKTOP BROWSER NOTIFICATIONS ──
  function sendBrowserNotification(title, body) {
    try {
      const enabled = safeGetItem('orlando-browser-notifs', 'true') === 'true';
      if (!enabled) return;
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: body,
          icon: 'favicon.ico',
          badge: 'favicon.ico'
        });
      }
    } catch (e) {}
  }


  // ══════════════════════════════════════════════════════════════════════════
  // 1. BESPOKE THEMES DEFINITION (31 WORLD-CLASS HOROLOGY THEMES)
  // ══════════════════════════════════════════════════════════════════════════
  const THEMES = [
    // Flagship OLED Monolith (Default)
    "pure-black",
    // Precious Metals & Luxury (7)
    "platinum",
    "gold",
    "solis-gold",
    "sunset-rose",
    "chrome-3d",
    "midnight-gold",
    "liquid-mercury",
    // Cyberpunk & Synthwave (6)
    "crimson-laser",
    "cyber-emerald",
    "ice-titanium",
    "rainbow",
    "tokyo-neon",
    "cyber-matrix-rain",
    // Horology & Grand Prix (4)
    "royal-sapphire",
    "chronometer-din",
    "monaco-racing",
    "carbon-forged",
    // Deep Space & Cosmic (5)
    "supernova-crimson",
    "quantum-violet",
    "amethyst",
    "solaris-plasma",
    "deep-ocean-abyss",
    // Minimalist & Monolith (4)
    "minimal-white",
    "obsidian-noir",
    "stealth-matte-black",
    // Organic & Natural Wonders (5)
    "green-nature",
    "arctic-aurora",
    "desert-dune",
    "sakura-blossom",
    "sunset-amber"
  ];

  const THEME_DATA = {
    "pure-black": {
      name: "Pure Black",
      category: "minimal",
      desc: "Absolute True OLED #000000 solid void with razor-sharp architectural white contrast",
      swatch: "#FFFFFF",
      gradient: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 50%, #94A3B8 100%)",
      glow: "rgba(255, 255, 255, 0.06)"
    },
    "platinum": {
      name: "Pure Platinum",
      category: "metals",
      desc: "Specular Horizon 950 Platinum with frosted mirror sheen",
      swatch: "#F1F5F9",
      gradient: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 50%, #94A3B8 100%)",
      glow: "rgba(241, 245, 249, 0.45)"
    },
    "gold": {
      name: "Royal 24K Radiant Gold",
      category: "metals",
      desc: "24K Swiss Solid Gold & radiant cosmic obsidian backdrop",
      swatch: "#D9B95C",
      gradient: "linear-gradient(135deg, #FFFFFF 0%, #F5E5B8 25%, #D9B95C 60%, #997B28 100%)",
      glow: "rgba(217, 185, 92, 0.55)"
    },
    "solis-gold": {
      name: "Solis Radiant 18K Gold",
      category: "metals",
      desc: "High-noon solar corona brilliance & amber luminescence",
      swatch: "#EAB308",
      gradient: "linear-gradient(135deg, #FEF08A 0%, #EAB308 50%, #854D0E 100%)",
      glow: "rgba(234, 179, 8, 0.55)"
    },
    "sunset-rose": {
      name: "Sunset Rose Gold",
      category: "metals",
      desc: "Venetian rose gold alloy & warm twilight copper glow",
      swatch: "#FB7185",
      gradient: "linear-gradient(135deg, #FECDD3 0%, #FB7185 50%, #9F1239 100%)",
      glow: "rgba(251, 113, 133, 0.55)"
    },
    "chrome-3d": {
      name: "Executive Chrome 3D",
      category: "metals",
      desc: "Polished aerospace billet aluminum & horizon edge",
      swatch: "#E2E8F0",
      gradient: "linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 50%, #64748B 100%)",
      glow: "rgba(226, 232, 240, 0.5)"
    },
    "midnight-gold": {
      name: "Midnight Gold Dual-Tone Rim",
      category: "metals",
      desc: "Deep obsidian navy dial with 24K gilded fluted rim",
      swatch: "#F5E5B8",
      gradient: "linear-gradient(135deg, #FFFFFF 0%, #D9B95C 40%, #1E3A8A 100%)",
      glow: "rgba(217, 185, 92, 0.5)"
    },
    "liquid-mercury": {
      name: "Liquid Quicksilver Mercury",
      category: "metals",
      desc: "Fluid mirror chrome with dynamic liquid specular highlights",
      swatch: "#FFFFFF",
      gradient: "linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 40%, #64748B 80%, #FFFFFF 100%)",
      glow: "rgba(255, 255, 255, 0.65)"
    },
    "crimson-laser": {
      name: "Cyberpunk Crimson Laser",
      category: "cyber",
      desc: "High-voltage neon red laser grid & tachyon beam aura",
      swatch: "#EF4444",
      gradient: "linear-gradient(135deg, #FCA5A5 0%, #EF4444 50%, #991B1B 100%)",
      glow: "rgba(239, 68, 68, 0.6)"
    },
    "cyber-emerald": {
      name: "Cyberpunk Emerald Matrix",
      category: "cyber",
      desc: "Quantum data stream & bioluminescent neural green pulse",
      swatch: "#10B981",
      gradient: "linear-gradient(135deg, #6EE7B7 0%, #10B981 50%, #064E3B 100%)",
      glow: "rgba(16, 185, 129, 0.55)"
    },
    "ice-titanium": {
      name: "Glacial Titanium & Ice Blue",
      category: "cyber",
      desc: "Sub-zero cryogenic cerulean & diamond frost reflection",
      swatch: "#38BDF8",
      gradient: "linear-gradient(135deg, #BAE6FD 0%, #38BDF8 50%, #0369A1 100%)",
      glow: "rgba(56, 189, 248, 0.55)"
    },
    "rainbow": {
      name: "Prismatic Rainbow",
      category: "cyber",
      desc: "Iridescent chromatic dispersion & hyper-spectrum wave",
      swatch: "#FD79A8",
      gradient: "linear-gradient(135deg, #FF6B6B 0%, #FECA57 25%, #48DBFB 50%, #FF9FF3 75%, #54A0FF 100%)",
      glow: "rgba(253, 121, 168, 0.6)"
    },
    "tokyo-neon": {
      name: "Tokyo Cyber-Night 2099",
      category: "cyber",
      desc: "Shibuya midnight dual cyan and electric magenta synthwave neon",
      swatch: "#00F0FF",
      gradient: "linear-gradient(135deg, #E0FCFF 0%, #00F0FF 50%, #FF007F 100%)",
      glow: "rgba(0, 240, 255, 0.65)"
    },
    "cyber-matrix-rain": {
      name: "Neural Matrix Rain 2.0",
      category: "cyber",
      desc: "Cathode green terminal phosphor & cascading data glyph stream",
      swatch: "#39FF14",
      gradient: "linear-gradient(135deg, #EBFFE6 0%, #39FF14 50%, #008F11 100%)",
      glow: "rgba(57, 255, 20, 0.7)"
    },
    "royal-sapphire": {
      name: "Royal Sapphire & Cobalt Chrono",
      category: "chrono",
      desc: "Deep ocean cobalt crystal & electric sapphire chronometer",
      swatch: "#3B82F6",
      gradient: "linear-gradient(135deg, #93C5FD 0%, #3B82F6 50%, #1D4ED8 100%)",
      glow: "rgba(59, 130, 246, 0.55)"
    },
    "chronometer-din": {
      name: "German Chronometer DIN",
      category: "chrono",
      desc: "High-visibility aviation cockpit instrumentation orange",
      swatch: "#F97316",
      gradient: "linear-gradient(135deg, #FFEDD5 0%, #F97316 50%, #9A3412 100%)",
      glow: "rgba(249, 115, 22, 0.55)"
    },
    "monaco-racing": {
      name: "Monaco Heritage Chrono",
      category: "chrono",
      desc: "British racing green paddock with vintage gilded brass accents",
      swatch: "#E5C07B",
      gradient: "linear-gradient(135deg, #FFF6E5 0%, #E5C07B 50%, #8A6828 100%)",
      glow: "rgba(229, 192, 123, 0.55)"
    },
    "carbon-forged": {
      name: "Forged Hypercar Carbon",
      category: "chrono",
      desc: "High-gloss marbled carbon composite with acid yellow racing highlights",
      swatch: "#E2F800",
      gradient: "linear-gradient(135deg, #FAFFCC 0%, #E2F800 50%, #768000 100%)",
      glow: "rgba(226, 248, 0, 0.6)"
    },
    "supernova-crimson": {
      name: "Supernova Cosmic Flare",
      category: "cosmic",
      desc: "Blazing cosmic plasma explosion into stellar magenta-crimson",
      swatch: "#FF0055",
      gradient: "linear-gradient(135deg, #FFE4EF 0%, #FF0055 50%, #990033 100%)",
      glow: "rgba(255, 0, 85, 0.65)"
    },
    "quantum-violet": {
      name: "Quantum Singularity Void",
      category: "cosmic",
      desc: "Deep gravitational void with electric tachyon violet halo",
      swatch: "#8B5CF6",
      gradient: "linear-gradient(135deg, #EDE9FE 0%, #8B5CF6 50%, #4C1D95 100%)",
      glow: "rgba(139, 92, 246, 0.6)"
    },
    "amethyst": {
      name: "Imperial Amethyst Purple",
      category: "cosmic",
      desc: "Imperial dynasty violet crystal & ultraviolet corona",
      swatch: "#A855F7",
      gradient: "linear-gradient(135deg, #E9D5FF 0%, #A855F7 50%, #6B21A8 100%)",
      glow: "rgba(168, 85, 247, 0.55)"
    },
    "solaris-plasma": {
      name: "Solaris Fusion 24K Plasma",
      category: "cosmic",
      desc: "Thermonuclear white-hot solar core with 24K corona flare",
      swatch: "#FF6600",
      gradient: "linear-gradient(135deg, #FFF0E6 0%, #FF6600 50%, #FFCC00 100%)",
      glow: "rgba(255, 102, 0, 0.65)"
    },
    "deep-ocean-abyss": {
      name: "Mariana Oceanic Abyss",
      category: "cosmic",
      desc: "11,000m abyssal oceanic trench with electric cyan bioluminescence",
      swatch: "#00E5FF",
      gradient: "linear-gradient(135deg, #E0FCFF 0%, #00E5FF 50%, #0044B3 100%)",
      glow: "rgba(0, 229, 255, 0.65)"
    },
    "minimal-white": {
      name: "Pure Minimalist Studio White",
      category: "minimal",
      desc: "Ultra-clean high-contrast architectural luminescence",
      swatch: "#FFFFFF",
      gradient: "linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 50%, #CBD5E1 100%)",
      glow: "rgba(255, 255, 255, 0.5)"
    },
    "obsidian-noir": {
      name: "Titanium Obsidian Noir",
      category: "minimal",
      desc: "Stealth DLC matte charcoal & brushed titanium chassis",
      swatch: "#94A3B8",
      gradient: "linear-gradient(135deg, #CBD5E1 0%, #64748B 50%, #1E293B 100%)",
      glow: "rgba(148, 163, 184, 0.4)"
    },
    "stealth-matte-black": {
      name: "Vanta Noir Monolith",
      category: "minimal",
      desc: "99.9% light-absorbent true black stealth with razor silver rim",
      swatch: "#E5E7EB",
      gradient: "linear-gradient(135deg, #FFFFFF 0%, #D1D5DB 50%, #4B5563 100%)",
      glow: "rgba(255, 255, 255, 0.35)"
    },
    "green-nature": {
      name: "Green Nature Matrix",
      category: "nature",
      desc: "Organic deep forest canopy & vibrant emerald aurora",
      swatch: "#22C55E",
      gradient: "linear-gradient(135deg, #DCFCE7 0%, #22C55E 50%, #14532D 100%)",
      glow: "rgba(34, 197, 94, 0.55)"
    },
    "arctic-aurora": {
      name: "Arctic Borealis Aurora",
      category: "nature",
      desc: "Ethereal polar night sky with undulating emerald-cyan ribbons",
      swatch: "#00FFA3",
      gradient: "linear-gradient(135deg, #E6FFF6 0%, #00FFA3 50%, #00B3FF 100%)",
      glow: "rgba(0, 255, 163, 0.6)"
    },
    "desert-dune": {
      name: "Sahara Rose & Terracotta",
      category: "nature",
      desc: "Warm champagne desert sand, sun-baked terracotta & bronze",
      swatch: "#E2B18A",
      gradient: "linear-gradient(135deg, #FFF3EB 0%, #E2B18A 50%, #995530 100%)",
      glow: "rgba(226, 177, 138, 0.55)"
    },
    "sakura-blossom": {
      name: "Kyoto Imperial Sakura",
      category: "nature",
      desc: "Delicate spring blossom pink, rose quartz & porcelain white",
      swatch: "#F472B6",
      gradient: "linear-gradient(135deg, #FDF2F8 0%, #F472B6 50%, #9D174D 100%)",
      glow: "rgba(244, 114, 182, 0.55)"
    },
    "sunset-amber": {
      name: "Blazing Sunset Amber",
      category: "nature",
      desc: "Molten volcanic horizon fire & liquid amber warmth",
      swatch: "#F59E0B",
      gradient: "linear-gradient(135deg, #FEF3C7 0%, #F59E0B 50%, #78350F 100%)",
      glow: "rgba(245, 158, 11, 0.55)"
    }
  };

  const THEME_NAMES = {};
  const THEME_SWATCHES = {};
  THEMES.forEach((t) => {
    THEME_NAMES[t] = THEME_DATA[t].name;
    THEME_SWATCHES[t] = THEME_DATA[t].swatch;
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 1B. CYBERNETIC WEB AUDIO SYNTHESIZER (Horology Escapement & Sci-Fi Engine)
  // ══════════════════════════════════════════════════════════════════════════
  let acousticTickEnabled = false;
  try {
    acousticTickEnabled = localStorage.getItem('orlando-acoustic-tick') === 'true';
  } catch(e) {}

  const AudioHUD = (function () {
    let ctx = null;
    let tickCount = 0;

    function getCtx() {
      if (!ctx) {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (AudioCtor) ctx = new AudioCtor();
      }
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    }

    return {
      tick: function (freq = 880, force = false) {
        if (!acousticTickEnabled && !force) return;
        try {
          const c = getCtx();
          if (!c) return;
          const osc = c.createOscillator();
          const gain = c.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, c.currentTime);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.4, c.currentTime + 0.022);
          gain.gain.setValueAtTime(0.035, c.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.022);
          osc.connect(gain);
          gain.connect(c.destination);
          osc.start();
          osc.stop(c.currentTime + 0.025);
        } catch (e) {}
      },
      escapementTick: function () {
        if (!acousticTickEnabled) return;
        try {
          const c = getCtx();
          if (!c) return;
          tickCount++;
          // Alternate subtle pitch for authentic Swiss mechanical tick-tock
          const freq = (tickCount % 2 === 0) ? 1400 : 1750;
          const osc = c.createOscillator();
          const gain = c.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, c.currentTime);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.4, c.currentTime + 0.015);
          gain.gain.setValueAtTime(0.03, c.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.015);
          osc.connect(gain);
          gain.connect(c.destination);
          osc.start();
          osc.stop(c.currentTime + 0.018);
        } catch (e) {}
      },
      confirm: function () {
        if (!acousticTickEnabled) return;
        try {
          const c = getCtx();
          if (!c) return;
          const now = c.currentTime;
          [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.032);
            gain.gain.setValueAtTime(0.05, now + i * 0.032);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.032 + 0.16);
            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(now + i * 0.032);
            osc.stop(now + i * 0.032 + 0.18);
          });
        } catch (e) {}
      },
      hapticPulse: function (freq = 960, forceAudio = false) {
        try {
          if (navigator.vibrate) navigator.vibrate(10);
        } catch (e) {}
        this.tick(freq, forceAudio);
      },
      chimeHarmonic: function (forceAudio = false) {
        try {
          if (navigator.vibrate) navigator.vibrate([12, 24, 12]);
        } catch (e) {}
        if (!acousticTickEnabled && !forceAudio) return;
        try {
          const c = getCtx();
          if (!c) return;
          const now = c.currentTime;
          const osc1 = c.createOscillator();
          const osc2 = c.createOscillator();
          const gain = c.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(880, now);
          osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.28);
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(1318.5, now);
          osc2.frequency.exponentialRampToValueAtTime(2637, now + 0.28);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(c.destination);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.46);
          osc2.stop(now + 0.46);
        } catch (e) {}
      },
      supernovaShockwave: function (tier = 2) {
        try {
          const c = getCtx();
          if (!c) return;
          const now = c.currentTime;

          // 1. Visceral Sub-Bass Gravitational Implosion Sweep
          const bassOsc = c.createOscillator();
          const bassGain = c.createGain();
          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(68, now);
          bassOsc.frequency.exponentialRampToValueAtTime(26, now + 0.85);
          bassGain.gain.setValueAtTime(0.18, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
          bassOsc.connect(bassGain);
          bassGain.connect(c.destination);
          bassOsc.start(now);
          bassOsc.stop(now + 0.95);

          // 2. High Horology Acoustic Resonance Chimes (Harmonic pentatonic cascade)
          const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
          const count = tier === 3 ? 6 : (tier === 2 ? 4 : 3);
          notes.slice(0, count).forEach((freq, i) => {
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.045);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.008, now + i * 0.045 + 1.2);
            gain.gain.setValueAtTime(0.05 / (i + 1), now + i * 0.045);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.045 + 1.4);
            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(now + i * 0.045);
            osc.stop(now + i * 0.045 + 1.45);
          });
        } catch (e) {}
      }
    };
  })();

  // ══════════════════════════════════════════════════════════════════════════
  // 2. INDEPENDENT DUAL-CATEGORY CUSTOMIZATION ENGINE
  // ══════════════════════════════════════════════════════════════════════════
  let currentAppTheme = "pure-black";
  let currentClockStyle = "pure-black";

  // Load independent preferences from localStorage (Default: pure-black for OLED Infinite Contrast)
  try {
    const savedApp = localStorage.getItem('orlando-app-theme');
    if (savedApp && THEMES.includes(savedApp)) {
      currentAppTheme = savedApp;
    } else {
      currentAppTheme = "pure-black";
    }

    const savedClock = localStorage.getItem('orlando-clock-style') || localStorage.getItem('orlando-clock-theme');
    if (savedClock && THEMES.includes(savedClock)) {
      currentClockStyle = savedClock;
    } else {
      currentClockStyle = "pure-black";
    }

    // Default migration: Pure Black for OLED Infinite Contrast (Zero Blur, True Black)
    if (!localStorage.getItem('orlando-pure-black-default-v2')) {
      currentAppTheme = "pure-black";
      currentClockStyle = "pure-black";
      localStorage.setItem('orlando-app-theme', 'pure-black');
      localStorage.setItem('orlando-clock-style', 'pure-black');
      localStorage.setItem('orlando-pure-black-default-v2', 'true');
    }
  } catch(e) {}

  // Category 1: Global Application Theme Controller
  function applyAppTheme(theme) {
    if (!THEMES.includes(theme)) theme = "pure-black";
    currentAppTheme = theme;
    document.body.setAttribute('data-app-theme', theme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'pure-black' ? '#000000' : (THEME_SWATCHES[theme] || '#05070c'));
    }


    const label = document.getElementById('appThemeLabel');
    if (label) label.textContent = THEME_NAMES[theme] || theme;

    const swatch = document.getElementById('appThemeSwatch');
    if (swatch) {
      swatch.style.background = THEME_SWATCHES[theme] || '#D9B95C';
      swatch.style.color = THEME_SWATCHES[theme] || '#D9B95C';
    }

    if (window.updateParticleThemeColor) {
      window.updateParticleThemeColor(THEME_SWATCHES[theme], THEME_DATA[theme]?.category || 'metals');
    }

    try {
      localStorage.setItem('orlando-app-theme', theme);
    } catch(e) {}
  }

  // Category 2: Clock and Typography Style Controller
  function applyClockStyle(style) {
    if (!THEMES.includes(style)) style = "pure-black";
    currentClockStyle = style;
    document.body.setAttribute('data-clock-style', style);

    const label = document.getElementById('clockStyleLabel');
    if (label) label.textContent = THEME_NAMES[style] || style;

    const swatch = document.getElementById('clockStyleSwatch');
    if (swatch) {
      swatch.style.background = THEME_SWATCHES[style] || '#D9B95C';
      swatch.style.color = THEME_SWATCHES[style] || '#D9B95C';
    }

    try {
      localStorage.setItem('orlando-clock-style', style);
    } catch(e) {}
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 2B. HOLOGRAPHIC HUD THEME VAULT (LIVE PREVIEW & 3D GLASS CARDS)
  // ══════════════════════════════════════════════════════════════════════════
  let activeVaultTarget = null; // 'theme' | 'clock'
  let savedActiveTheme = currentAppTheme;
  let savedActiveClock = currentClockStyle;
  let currentFilter = 'all';

  const holoVaultModal = document.getElementById('holoVaultModal');
  const holoVaultBackdrop = document.getElementById('holoVaultBackdrop');
  const btnHoloVaultClose = document.getElementById('btnHoloVaultClose');
  const holoCardsGrid = document.getElementById('holoCardsGrid');
  const holoVaultKicker = document.getElementById('holoVaultKicker');
  const holoVaultTitle = document.getElementById('holoVaultTitle');
  const holoVaultSubtitle = document.getElementById('holoVaultSubtitle');
  const holoStatusText = document.getElementById('holoStatusText');
  const filterPills = document.querySelectorAll('.holo-filter-pill');
  const btnVaultSwitchTheme = document.getElementById('btnVaultSwitchTheme');
  const btnVaultSwitchClock = document.getElementById('btnVaultSwitchClock');
  const btnVaultResetDefault = document.getElementById('btnVaultResetDefault');

  function openHoloVault(target) {
    // Before switching target in-place, ensure any uncommitted hover preview is reverted to saved state
    document.body.setAttribute('data-app-theme', currentAppTheme);
    document.body.setAttribute('data-clock-style', currentClockStyle);

    activeVaultTarget = target;
    savedActiveTheme = currentAppTheme;
    savedActiveClock = currentClockStyle;

    if (btnVaultSwitchTheme && btnVaultSwitchClock) {
      btnVaultSwitchTheme.classList.toggle('active', target === 'theme');
      btnVaultSwitchTheme.setAttribute('aria-selected', target === 'theme' ? 'true' : 'false');
      btnVaultSwitchClock.classList.toggle('active', target === 'clock');
      btnVaultSwitchClock.setAttribute('aria-selected', target === 'clock' ? 'true' : 'false');
    }

    if (target === 'theme') {
      if (holoVaultKicker) holoVaultKicker.textContent = 'GLOBAL APPLICATION ENVIRONMENT · LIVE HOLO-SCRUB';
      if (holoVaultTitle) holoVaultTitle.textContent = 'HOLOGRAPHIC THEME VAULT';
      if (holoVaultSubtitle) holoVaultSubtitle.textContent = 'Hover over any card for instant ambient preview across the application. Click to lock in.';
    } else {
      if (holoVaultKicker) holoVaultKicker.textContent = 'DIGIT TYPOGRAPHY & MATERIAL FINISH · LIVE HOLO-SCRUB';
      if (holoVaultTitle) holoVaultTitle.textContent = 'DIGIT STYLE VAULT';
      if (holoVaultSubtitle) holoVaultSubtitle.textContent = 'Hover over any luxury card to preview specular reflections on timer, stopwatch & clock numerals. Click to lock in.';
    }

    if (holoStatusText) {
      holoStatusText.textContent = `Awaiting selection · Active: ${target === 'theme' ? THEME_NAMES[currentAppTheme] : THEME_NAMES[currentClockStyle]}`;
    }

    renderHoloCards(currentFilter, holoSearchQuery);

    if (holoVaultModal) {
      holoVaultModal.classList.add('open');
      holoVaultModal.setAttribute('aria-hidden', 'false');
    }
    AudioHUD.tick(1200);
  }

  if (btnVaultSwitchTheme) {
    btnVaultSwitchTheme.addEventListener('click', () => openHoloVault('theme'));
  }
  if (btnVaultSwitchClock) {
    btnVaultSwitchClock.addEventListener('click', () => openHoloVault('clock'));
  }

  function closeHoloVault(commit = false) {
    if (!holoVaultModal || !holoVaultModal.classList.contains('open')) return;

    if (!commit) {
      // Revert live preview to saved settings
      if (activeVaultTarget === 'theme') {
        document.body.setAttribute('data-app-theme', savedActiveTheme);
        if (window.updateParticleThemeColor) window.updateParticleThemeColor(THEME_SWATCHES[savedActiveTheme]);
      } else if (activeVaultTarget === 'clock') {
        document.body.setAttribute('data-clock-style', savedActiveClock);
      }
    }

    holoVaultModal.classList.remove('open');
    holoVaultModal.setAttribute('aria-hidden', 'true');
    activeVaultTarget = null;
    AudioHUD.tick(600);
  }

  let holoSearchQuery = '';

  function renderHoloCards(filterCategory = currentFilter, searchQuery = holoSearchQuery) {
    if (!holoCardsGrid) return;
    holoCardsGrid.innerHTML = '';

    const currentSelected = activeVaultTarget === 'theme' ? currentAppTheme : currentClockStyle;

    const filtered = THEMES.filter((themeKey) => {
      const data = THEME_DATA[themeKey];
      if (filterCategory !== 'all' && data.category !== filterCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = data.name.toLowerCase().includes(query);
        const matchDesc = data.desc.toLowerCase().includes(query);
        const matchCat = data.category.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      holoCardsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 20px; text-align: center; color: var(--theme-text-dim);">
          <div style="font-size: 36px; margin-bottom: 8px;">🛸</div>
          <div style="font-family: var(--mono); font-size: 13px; font-weight: 800; color: #FFFFFF; letter-spacing: 1px;">NO THEMES FOUND</div>
          <div style="font-size: 12px; color: var(--theme-text-mute); margin-top: 6px;">Try searching for "gold", "neon", "space", "racing", or "minimal"</div>
        </div>
      `;
      return;
    }

    filtered.forEach((themeKey) => {
      const data = THEME_DATA[themeKey];
      const card = document.createElement('div');
      card.className = 'holo-theme-card' + (themeKey === currentSelected ? ' active' : '');
      card.setAttribute('role', 'option');
      card.setAttribute('aria-selected', themeKey === currentSelected ? 'true' : 'false');
      card.style.setProperty('--card-color', data.swatch);
      card.style.setProperty('--card-glow', data.glow);
      card.style.setProperty('--card-gradient', data.gradient);

      card.innerHTML = `
        <div class="card-top-row">
          <div class="card-swatch-badge">
            <span class="card-orb"></span>
            <span class="card-meta-name">${data.name}</span>
          </div>
          <div class="card-right-badges">
            <span class="card-mini-digits" title="Digit Finish Preview">25</span>
            <span class="card-active-led">Active</span>
          </div>
        </div>
        <p class="card-meta-desc">${data.desc}</p>
      `;

      // Live Holo-Scrub on hover
      card.addEventListener('mouseenter', () => {
        AudioHUD.tick(920);
        if (holoStatusText) {
          holoStatusText.textContent = `Previewing: ${data.name} (Holo-Scrub Active)`;
        }
        if (activeVaultTarget === 'theme') {
          document.body.setAttribute('data-app-theme', themeKey);
          if (window.updateParticleThemeColor) window.updateParticleThemeColor(data.swatch, data.category);
        } else if (activeVaultTarget === 'clock') {
          document.body.setAttribute('data-clock-style', themeKey);
        }
      });

      // Commit on click
      card.addEventListener('click', () => {
        AudioHUD.confirm();
        if (activeVaultTarget === 'theme') {
          applyAppTheme(themeKey);
          savedActiveTheme = themeKey;
        } else if (activeVaultTarget === 'clock') {
          applyClockStyle(themeKey);
          savedActiveClock = themeKey;
        }
        closeHoloVault(true);
      });

      holoCardsGrid.appendChild(card);
    });
  }

  // Filter Pills event listeners
  if (filterPills) {
    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        filterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.getAttribute('data-category') || 'all';
        AudioHUD.tick(1050);
        renderHoloCards(currentFilter, holoSearchQuery);
      });
    });
  }

  // Search input binding
  const holoSearchInput = document.getElementById('holoSearchInput');
  const btnClearSearch = document.getElementById('btnClearSearch');
  if (holoSearchInput) {
    holoSearchInput.addEventListener('input', (e) => {
      holoSearchQuery = e.target.value.trim().toLowerCase();
      if (btnClearSearch) btnClearSearch.style.display = holoSearchQuery ? 'flex' : 'none';
      renderHoloCards(currentFilter, holoSearchQuery);
    });
  }
  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      if (holoSearchInput) holoSearchInput.value = '';
      holoSearchQuery = '';
      btnClearSearch.style.display = 'none';
      renderHoloCards(currentFilter, '');
    });
  }

  // Pure Black Default Reset
  if (btnVaultResetDefault) {
    btnVaultResetDefault.addEventListener('click', () => {
      applyAppTheme('pure-black');
      applyClockStyle('pure-black');
      savedActiveTheme = 'pure-black';
      savedActiveClock = 'pure-black';
      AudioHUD.confirm();
      if (holoStatusText) {
        holoStatusText.textContent = '◐ Restored Pure Black Default (App Theme + Digit Style)';
      }
      renderHoloCards(currentFilter, holoSearchQuery);
    });
  }

  // Quantum Shuffle
  const btnQuantumShuffle = document.getElementById('btnQuantumShuffle');
  if (btnQuantumShuffle) {
    btnQuantumShuffle.addEventListener('click', () => {
      const randomApp = THEMES[Math.floor(Math.random() * THEMES.length)];
      const randomClock = THEMES[Math.floor(Math.random() * THEMES.length)];
      applyAppTheme(randomApp);
      applyClockStyle(randomClock);
      savedActiveTheme = randomApp;
      savedActiveClock = randomClock;
      AudioHUD.confirm();
      if (holoStatusText) {
        holoStatusText.textContent = `🎲 Quantum Harmonized: ${THEME_NAMES[randomApp]} (App) + ${THEME_NAMES[randomClock]} (Clock)`;
      }
      renderHoloCards(currentFilter, holoSearchQuery);
      setTimeout(() => closeHoloVault(true), 380);
    });
  }

  // Acoustic Tick button binding (Watch Tick: 1s mechanical escapement & UI clicks)
  const btnAcousticTick = document.getElementById('btnAcousticTick');
  const acousticDot = document.getElementById('acousticDot');
  const acousticTickText = document.getElementById('acousticTickText');

  function updateAcousticTickUI() {
    if (acousticDot) {
      acousticDot.classList.toggle('active', acousticTickEnabled);
    }
    if (acousticTickText) {
      acousticTickText.textContent = acousticTickEnabled ? 'Watch Tick: ON' : 'Watch Tick: OFF';
    }
    if (btnAcousticTick) {
      btnAcousticTick.title = acousticTickEnabled
        ? 'Watch Tick: ON (Plays 1-second mechanical watch tick & UI click audio)'
        : 'Watch Tick: OFF (Silent operation — only completion alarms ring)';
    }
    try {
      localStorage.setItem('orlando-acoustic-tick', acousticTickEnabled ? 'true' : 'false');
    } catch(e) {}
  }
  if (btnAcousticTick) {
    updateAcousticTickUI();
    btnAcousticTick.addEventListener('click', () => {
      acousticTickEnabled = !acousticTickEnabled;
      updateAcousticTickUI();
      AudioHUD.tick(acousticTickEnabled ? 1200 : 600, true);
      if (typeof showQuantumTelemetryToast === 'function') {
        showQuantumTelemetryToast(
          acousticTickEnabled ? '⌚ WATCH TICK: ON' : '🔇 WATCH TICK: OFF',
          acousticTickEnabled
            ? '1-second Swiss mechanical tick & UI click audio enabled.'
            : 'Silent mode enabled. Only completion alarms will ring.'
        );
      }
    });
  }

  // Vault Close buttons
  if (btnHoloVaultClose) btnHoloVaultClose.addEventListener('click', () => closeHoloVault(false));
  if (holoVaultBackdrop) holoVaultBackdrop.addEventListener('click', () => closeHoloVault(false));

  // Cockpit Trigger Buttons
  const btnOpenThemeVault = document.getElementById('btnOpenThemeVault');
  if (btnOpenThemeVault) {
    btnOpenThemeVault.addEventListener('click', () => openHoloVault('theme'));
  }

  const btnOpenClockVault = document.getElementById('btnOpenClockVault');
  if (btnOpenClockVault) {
    btnOpenClockVault.addEventListener('click', () => openHoloVault('clock'));
  }

  // Keyboard Accelerators: 'T' for Theme Vault, 'C' for Clock Vault, 'Esc' to close
  window.addEventListener('keydown', (e) => {
    // If user is typing in an input field, do not hijack
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.key === 'Escape') {
      if (holoVaultModal && holoVaultModal.classList.contains('open')) {
        closeHoloVault(false);
      }
    } else if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      openHoloVault('theme');
    } else if (e.key === 'c' || e.key === 'C' || e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      openHoloVault('clock');
    }
  });

  // Apply initial decoupled themes
  applyAppTheme(currentAppTheme);
  applyClockStyle(currentClockStyle);

  // Precision Chrome Number Renderer (from OrlandoRecharge)
  function chromeHTML(str) {
    return str.split("").map((c) => {
      if (c === ":") return '<span class="c">:</span>';
      if (c === ".") return '<span class="ms-sep">.</span>';
      return '<span>' + c + '</span>';
    }).join("");
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 3. AUDIO SYNTHESIS & SOUND ENGINE (Web Audio API + Fallback)
  // ══════════════════════════════════════════════════════════════════════════
  let audioCtx = null;
  let alarmAudioInterval = null;
  let isRinging = null;
  let audioUnlocked = false;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function unlockAudio() {
    if (audioUnlocked) return;
    const ctx = getAudioContext();
    if (ctx) {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      audioUnlocked = true;
    }
  }

  window.addEventListener('click', unlockAudio, { once: true });
  window.addEventListener('touchstart', unlockAudio, { once: true });

  
  let currentAlarmSound = safeGetItem('orlando-alarm-sound', 'synth');
  let currentAlarmVolume = parseInt(safeGetItem('orlando-alarm-volume', '80'), 10) / 100;

  function synthesizeAlertSound(preset = currentAlarmSound, vol = currentAlarmVolume) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = Math.max(0.01, Math.min(1, vol));

    if (preset === 'gong') {
      // Zen Singularity Gong: Deep resonant bell with overtone harmonics
      const freqs = [130.81, 196.00, 261.63, 392.00];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === 0 ? 'sine' : (idx === 1 ? 'triangle' : 'sine');
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 2.2);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime((0.35 / (idx + 1)) * v, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.5);
      });
    } else if (preset === 'piano') {
      // Acoustic Piano / Melodic Chime: Rich Major 9th chord
      const freqs = [261.63, 329.63, 392.00, 493.88, 587.33];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.001, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime((0.28 / (idx + 1)) * v, now + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 1.85);
      });
    } else if (preset === 'bell') {
      // Horology Bell: High crystal Swiss escapement chime
      const freqs = [880, 1174.66, 1760];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime((0.26 / (idx + 1)) * v, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.45);
      });
    } else {
      // Cybernetic Synth / Luxury Chime
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime((0.25 / (idx + 1)) * v, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.25);
      });
    }
  }

  
  function playLuxuryChime() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.25 / (idx + 1), now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.25);
    });
  }

  function startRingingSound() {
    synthesizeAlertSound(currentAlarmSound, currentAlarmVolume);
    if (alarmAudioInterval) clearInterval(alarmAudioInterval);
    alarmAudioInterval = setInterval(() => {
      synthesizeAlertSound(currentAlarmSound, currentAlarmVolume);
    }, 1500);

    const audioEl = document.getElementById('alarmAudioElement');
    if (audioEl) {
      audioEl.volume = currentAlarmVolume;
      audioEl.currentTime = 0;
      audioEl.play().catch(() => {});
    }
  }

  function stopRingingSound() {
    if (alarmAudioInterval) {
      clearInterval(alarmAudioInterval);
      alarmAudioInterval = null;
    }
    const audioEl = document.getElementById('alarmAudioElement');
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 4. SCREEN WAKE LOCK API (Keep Screen Awake while Running)
  // ══════════════════════════════════════════════════════════════════════════
  let wakeLockSentinel = null;
  let isWakeLockRequested = safeGetItem('orlando-wake-lock', 'true') !== 'false';

  async function requestWakeLock() {
    if (!isWakeLockRequested) {
      updateWakeLockUI(false);
      return false;
    }
    if (!('wakeLock' in navigator)) {
      updateWakeLockUI(false);
      return false;
    }
    try {
      if (!wakeLockSentinel || wakeLockSentinel.released) {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        updateWakeLockUI(true);
        wakeLockSentinel.addEventListener('release', () => {
          updateWakeLockUI(false);
        });
      } else {
        updateWakeLockUI(true);
      }
      return true;
    } catch (err) {
      updateWakeLockUI(false);
      return false;
    }
  }

  function releaseWakeLock() {
    if (wakeLockSentinel) {
      wakeLockSentinel.release().catch(() => {});
      wakeLockSentinel = null;
    }
    updateWakeLockUI(false);
  }

  function updateWakeLockUI(active) {
    const textEl = document.getElementById('wakeLockText');
    const dotEl = document.querySelector('.status-dot-wake');
    const btnEl = document.getElementById('btnWakeLock');
    if (textEl) textEl.textContent = active ? 'Keep Awake: Active' : 'Keep Awake: Off';
    if (dotEl) {
      dotEl.classList.toggle('active', Boolean(active));
    }
    if (btnEl) {
      btnEl.title = active
        ? 'Keep Screen Awake: ACTIVE (Browser Screen Wake Lock prevents display sleep)'
        : 'Keep Screen Awake: OFF (Click to prevent display from dimming or sleeping)';
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isWakeLockRequested) {
      requestWakeLock();
    }
  });

  // Re-ensure Wake Lock on first user gesture if requested
  window.addEventListener('pointerdown', () => {
    if (isWakeLockRequested && (!wakeLockSentinel || wakeLockSentinel.released)) {
      requestWakeLock();
    }
  }, { passive: true });

  const btnWakeLock = document.getElementById('btnWakeLock');
  if (btnWakeLock) {
    btnWakeLock.addEventListener('click', async () => {
      if (wakeLockSentinel && !wakeLockSentinel.released) {
        isWakeLockRequested = false;
        safeSetItem('orlando-wake-lock', 'false');
        releaseWakeLock();
        AudioHUD.tick(600);
        if (typeof showQuantumTelemetryToast === 'function') {
          showQuantumTelemetryToast(
            '🌙 KEEP SCREEN AWAKE: OFF',
            'Standard OS display sleep timer restored.'
          );
        }
      } else {
        isWakeLockRequested = true;
        safeSetItem('orlando-wake-lock', 'true');
        const granted = await requestWakeLock();
        AudioHUD.tick(1100);
        if (typeof showQuantumTelemetryToast === 'function') {
          showQuantumTelemetryToast(
            granted ? '☀️ KEEP SCREEN AWAKE: ON' : '⚠️ WAKE LOCK UNAVAILABLE',
            granted
              ? 'Screen Wake Lock active — display will not sleep while this tab is visible.'
              : 'Your browser or Battery Saver blocked Screen Wake Lock.'
          );
        }
      }
    });
  }

  requestWakeLock();

  // ══════════════════════════════════════════════════════════════════════════
  // 5. FULLSCREEN API
  // ══════════════════════════════════════════════════════════════════════════
  const btnFullscreen = document.getElementById('btnFullscreen');
  const fsLabel = document.getElementById('fsLabel');

  function updateFullscreenUI() {
    const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    const enterText = 'Enter Full Screen';
    const exitText = 'Exit Full Screen';
    if (fsLabel) fsLabel.textContent = isFs ? exitText : enterText;
    if (btnFullscreen) btnFullscreen.title = isFs ? `${exitText} (F)` : `${enterText} (F)`;
    const zenFsSpan = document.querySelector('#btnZenFullscreen span');
    if (zenFsSpan) zenFsSpan.textContent = isFs ? exitText : enterText;
    const zenFsBtn = document.getElementById('btnZenFullscreen');
    if (zenFsBtn) zenFsBtn.title = isFs ? `${exitText} (F)` : `${enterText} (F)`;
  }

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    });
  }

  document.addEventListener('fullscreenchange', updateFullscreenUI);
  document.addEventListener('webkitfullscreenchange', updateFullscreenUI);

  // ══════════════════════════════════════════════════════════════════════════
  // 6. TAB NAVIGATION
  // ══════════════════════════════════════════════════════════════════════════
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  
  function switchAppTab(tabName) {
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (targetBtn) {
      targetBtn.click();
    }
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');
      tabBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(`panel-${tabTarget}`);
      if (panel) panel.classList.add('active');

      if (tabTarget === 'stopwatch') {
        if (typeof setChronoMode === 'function') {
          if (currentProductivityMode === 'quantum-flow') {
            setChronoMode('flow');
          } else {
            setChronoMode('precision');
          }
        }
      }
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 7. TIMER MODULE (Huge Digits in Master Inter Black 900 Chrome)
  // ══════════════════════════════════════════════════════════════════════════
  let timerTotalDuration = 25 * 60;
  let timerRemaining = timerTotalDuration;
  let timerInterval = null;
  let timerEndTime = null;
  let timerIsRunning = false;

  const timerDigitsEl = document.getElementById('timerDigits');
  const timerProgressBar = document.getElementById('timerProgressBar');
  const timerHourInput = document.getElementById('timerHours');
  const timerMinInput = document.getElementById('timerMinutes');
  const timerSecInput = document.getElementById('timerSeconds');

  const btnTimerStart = document.getElementById('btnTimerStart');
  const btnTimerPause = document.getElementById('btnTimerPause');
  const btnTimerReset = document.getElementById('btnTimerReset');

  function formatTimeHHMMSS(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  
  function updateTabTitle() {
    if (timerIsRunning) {
      const s = Math.max(0, Math.floor(timerRemaining));
      const hours = Math.floor(s / 3600);
      const minutes = Math.floor((s % 3600) / 60);
      const seconds = s % 60;
      const mm = String(minutes).padStart(2, '0');
      const ss = String(seconds).padStart(2, '0');
      const timeStr = hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
      document.title = `(${timeStr}) Orlando Timer`;
    } else if (timerRemaining > 0 && timerRemaining < timerTotalDuration) {
      const s = Math.max(0, Math.floor(timerRemaining));
      const minutes = Math.floor((s % 3600) / 60);
      const seconds = s % 60;
      document.title = `(Paused ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}) Orlando Timer`;
    } else {
      document.title = "Orlando Timer — Executive Horology Suite";
    }
  }

  function updateTimerDisplay() {
    updateTabTitle();
    // Update Zen HUD Ghost Controls
    const zenPlayText = document.getElementById('zenPlayText');
    const zenPlayIcon = document.getElementById('zenPlayIcon');
    if (zenPlayText && zenPlayIcon) {
      if (timerIsRunning) {
        zenPlayText.textContent = 'Pause';
        zenPlayIcon.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
      } else {
        zenPlayText.textContent = 'Start';
        zenPlayIcon.innerHTML = '<polygon points="6 4 20 12 6 20"/>';
      }
    }

    if (timerDigitsEl) {
      const timeStr = formatTimeHHMMSS(timerRemaining);
      timerDigitsEl.innerHTML = chromeHTML(timeStr);
    }
    const cometHead = document.getElementById('progressCometHead');
    if (timerProgressBar && timerTotalDuration > 0) {
      const pct = Math.max(0, Math.min(100, (timerRemaining / timerTotalDuration) * 100));
      timerProgressBar.style.width = `${pct}%`;
      if (cometHead) cometHead.style.opacity = pct <= 0 ? '0' : '1';
    } else if (timerProgressBar) {
      timerProgressBar.style.width = '100%';
      if (cometHead) cometHead.style.opacity = '1';
    }

    if (currentProductivityMode === 'deep-work' && timerTotalDuration > 0) {
      updateDeepWorkStripUI(timerTotalDuration, timerRemaining);
    } else if (timerTotalDuration > 0 && typeof updatePomoUI === 'function') {
      updatePomoUI();
    }

    // Highlight active preset pill if timerTotalDuration matches a preset minute
    const activePresetMins = Math.round((timerTotalDuration || 0) / 60);
    document.querySelectorAll('#presetsRow [data-minutes]').forEach(el => {
      const m = parseInt(el.getAttribute('data-minutes'), 10);
      el.classList.toggle('active', (timerTotalDuration % 60 === 0) && m === activePresetMins);
    });
  }

  function syncInputsFromRemaining(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;

    if (timerHourInput) timerHourInput.value = String(h).padStart(2, '0');
    if (timerMinInput) timerMinInput.value = String(m).padStart(2, '0');
    if (timerSecInput) timerSecInput.value = String(sec).padStart(2, '0');
  }

  function getDurationFromInputs() {
    const h = parseInt(timerHourInput?.value || '0', 10) || 0;
    const m = parseInt(timerMinInput?.value || '0', 10) || 0;
    const s = parseInt(timerSecInput?.value || '0', 10) || 0;
    return Math.max(0, h * 3600 + m * 60 + s);
  }

  function setTimerDuration(seconds, skipInputSync = false) {
    const validSecs = Math.max(0, Math.floor(seconds));
    timerTotalDuration = validSecs;
    timerRemaining = validSecs;
    if (timerIsRunning) {
      timerEndTime = Date.now() + validSecs * 1000;
      if (validSecs > 1800) examAlertsFired = { 1800: false, 600: false, 300: false };
      zenMilestonesTriggered = { 25: false, 50: false, 75: false };
    }
    if (!skipInputSync) {
      syncInputsFromRemaining(validSecs);
    }
    updateTimerDisplay();
  }

  
  // ── CLASSROOM EXAM MODE CONTROLLER ──
  let examModeEnabled = safeGetItem('orlando-exam-mode', 'false') === 'true';
  let examAlertsFired = { 1800: false, 600: false, 300: false };

  
  let zenMilestonesTriggered = { 25: false, 50: false, 75: false };
  function checkZenMilestones(currentSec) {
    if (!document.body.classList.contains('zen-mode') || !timerIsRunning || timerTotalDuration <= 0) return;
    const elapsed = timerTotalDuration - currentSec;
    const pct = Math.floor((elapsed / timerTotalDuration) * 100);
    [25, 50, 75].forEach(m => {
      if (pct >= m && !zenMilestonesTriggered[m]) {
        zenMilestonesTriggered[m] = true;
        if (timerDigitsEl) {
          timerDigitsEl.classList.remove('zen-shimmer-active');
          void timerDigitsEl.offsetWidth;
          timerDigitsEl.classList.add('zen-shimmer-active');
        }
        AudioHUD.tick(1200);
        announceSR(`Zen flow checkpoint: ${m} percent completed.`);
      }
    });
  }

  function checkExamCheckpoints(currentSec) {
    if (!examModeEnabled || !timerIsRunning) return;
    if (currentSec === 1800 && !examAlertsFired[1800]) {
      examAlertsFired[1800] = true;
      synthesizeAlertSound(currentAlarmSound, 0.7);
      showQuantumTelemetryToast("📝 EXAM CHECKPOINT", "30 minutes remaining in exam.");
      announceSR("Exam checkpoint: 30 minutes remaining.");
    } else if (currentSec === 600 && !examAlertsFired[600]) {
      examAlertsFired[600] = true;
      synthesizeAlertSound(currentAlarmSound, 0.85);
      showQuantumTelemetryToast("⚠️ EXAM CHECKPOINT", "10 minutes remaining. Finalize current section.");
      announceSR("Exam checkpoint: 10 minutes remaining.");
    } else if (currentSec === 300 && !examAlertsFired[300]) {
      examAlertsFired[300] = true;
      synthesizeAlertSound(currentAlarmSound, 1.0);
      showQuantumTelemetryToast("⏳ EXAM FINAL 5 MINUTES", "Review answer sheets and check work.");
      announceSR("Exam checkpoint: 5 minutes remaining. Final review.");
    }
  }

  // ── POMODORO FOCUS CYCLE ENGINE & PROTOCOL OPERATING SYSTEM ──
  let pomoMode = 'focus'; // 'focus' | 'shortBreak' | 'longBreak'
  let pomoRound = 1;      // 1 through 4
  let pomoAutoNext = safeGetItem('orlando-pomo-autonext', 'true') === 'true';

  const btnPomoFocus = document.getElementById('btnPomoFocus');
  const btnPomoShortBreak = document.getElementById('btnPomoShortBreak');
  const btnPomoLongBreak = document.getElementById('btnPomoLongBreak');
  const btnPomoAutoNext = document.getElementById('btnPomoAutoNext');
  const pomoStageTitle = document.getElementById('pomoStageTitle');
  const pomoRoundBadge = document.getElementById('pomoRoundBadge');
  const pomoDot = document.getElementById('pomoDot');

  // Daily Sprint Count Tracker
  function getTodayDateStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function getDailySprintCount() {
    const savedDate = safeGetItem('orlando-sprint-tally-date', '');
    const today = getTodayDateStr();
    if (savedDate !== today) {
      safeSetItem('orlando-sprint-tally-date', today);
      safeSetItem('orlando-sprint-tally-count', '0');
      return 0;
    }
    return parseInt(safeGetItem('orlando-sprint-tally-count', '0'), 10) || 0;
  }

  function incrementDailySprintCount() {
    const today = getTodayDateStr();
    safeSetItem('orlando-sprint-tally-date', today);
    const count = getDailySprintCount() + 1;
    safeSetItem('orlando-sprint-tally-count', String(count));
    updateDailySprintUI();
    return count;
  }

  function resetDailySprintCount() {
    safeSetItem('orlando-sprint-tally-count', '0');
    updateDailySprintUI();
    AudioHUD.tick(440);
  }

  function updateDailySprintUI() {
    const textEl = document.getElementById('sprintDailyCountText');
    if (textEl) {
      const count = getDailySprintCount();
      const mins = count * 25;
      textEl.textContent = `${count} Sprint${count === 1 ? '' : 's'} Done Today (${mins}m Focus)`;
    }
  }

  function updatePomoUI() {
    const totalMins = Math.max(1, Math.round((timerTotalDuration || 1500) / 60));
    if (btnPomoFocus) btnPomoFocus.classList.toggle('active', pomoMode === 'focus' && totalMins === 25);
    if (btnPomoShortBreak) btnPomoShortBreak.classList.toggle('active', pomoMode === 'shortBreak' && totalMins === 5);
    if (btnPomoLongBreak) btnPomoLongBreak.classList.toggle('active', pomoMode === 'longBreak' && totalMins === 15);

    if (pomoStageTitle) {
      if (pomoMode === 'shortBreak' && totalMins === 5) pomoStageTitle.textContent = `Short Rest (5m)`;
      else if (pomoMode === 'longBreak' && totalMins === 15) pomoStageTitle.textContent = `Deep Rest (15m)`;
      else if (totalMins === 25) pomoStageTitle.textContent = `Focus Session (25m)`;
      else pomoStageTitle.textContent = `Focus Sprint (${totalMins}m)`;
    }

    if (pomoRoundBadge) {
      pomoRoundBadge.textContent = `Round ${pomoRound}/4`;
    }

    if (btnPomoAutoNext) {
      btnPomoAutoNext.classList.toggle('active', pomoAutoNext);
      btnPomoAutoNext.textContent = pomoAutoNext ? 'Auto: ON' : 'Auto: OFF';
    }

    // Update 4 Sprint Pips
    const pips = document.querySelectorAll('.sprint-pip');
    pips.forEach(pip => {
      const r = parseInt(pip.getAttribute('data-round'), 10);
      pip.classList.toggle('active', r === pomoRound && pomoMode === 'focus');
      pip.classList.toggle('completed', r < pomoRound);
    });

    updateDailySprintUI();
  }

  function setPomoMode(mode, autostart = false) {
    const wasRunning = timerIsRunning;
    pomoMode = mode;
    pauseTimer();

    if (mode === 'focus') {
      setTimerDuration(25 * 60);
      announceSR(`Focus session set: 25 minutes. Round ${pomoRound} of 4.`);
    } else if (mode === 'shortBreak') {
      setTimerDuration(5 * 60);
      announceSR(`Short break set: 5 minutes. Round ${pomoRound} of 4.`);
    } else if (mode === 'longBreak') {
      setTimerDuration(15 * 60);
      announceSR('Long restorative break set: 15 minutes.');
    }

    updatePomoUI();

    if (autostart || wasRunning) {
      startTimer();
    }
  }

  function skipPomoPhase() {
    if (pomoMode === 'focus') {
      if (pomoRound >= 4) {
        pomoRound = 1;
        setPomoMode('longBreak', false);
      } else {
        pomoRound++;
        setPomoMode('shortBreak', false);
      }
    } else {
      setPomoMode('focus', false);
    }
    AudioHUD.tick(900);
  }

  // ── TIMER SUB-MODES: FOCUS PROTOCOL vs DEEP WORK SINGLE-STRIP ENGINE ──
  function setTimerSubMode(subMode) {
    const panelTimer = document.getElementById('panel-timer');
    const pomoStrip = document.getElementById('pomodoroCycleStrip');
    const dwStrip = document.getElementById('deepWorkCycleStrip');
    const presetsSec = document.getElementById('timerPresetsSection');

    if (panelTimer) panelTimer.setAttribute('data-timer-mode', subMode);
    if (presetsSec) presetsSec.style.display = 'flex';

    if (subMode === 'deep-work') {
      if (pomoStrip) pomoStrip.style.display = 'none';
      if (dwStrip) dwStrip.style.display = 'flex';
      updateDeepWorkStripUI(timerTotalDuration, timerRemaining);
    } else {
      if (pomoStrip) pomoStrip.style.display = 'flex';
      if (dwStrip) dwStrip.style.display = 'none';
      updatePomoUI();
    }
  }

  function updateDeepWorkStripUI(totalSec, remainingSec) {
    const dwStageTitle = document.getElementById('dwStageTitle');
    const dwPhaseBadge = document.getElementById('dwPhaseBadge');
    const totalMins = Math.round((totalSec || 5400) / 60);
    const elapsedMins = Math.max(0, ((totalSec || 5400) - (remainingSec || 0)) / 60);
    const remMins = Math.max(0, (remainingSec || 0) / 60);

    if (dwStageTitle) {
      if (totalMins === 20) {
        dwStageTitle.textContent = 'Restorative Recharge (20m)';
      } else {
        dwStageTitle.textContent = `Ultradian Deep Work (${totalMins}m)`;
      }
    }

    if (dwPhaseBadge) {
      if (totalMins <= 20) {
        dwPhaseBadge.textContent = 'Neural Recharge';
      } else if (elapsedMins < 15) {
        dwPhaseBadge.textContent = 'Phase 1 · Warm-Up';
      } else if (remMins <= 15 && remMins > 0) {
        dwPhaseBadge.textContent = 'Phase 3 · Review';
      } else {
        dwPhaseBadge.textContent = 'Phase 2 · Peak Flow';
      }
    }

    const dwBtns = document.querySelectorAll('[data-dw-mins]');
    dwBtns.forEach((btn) => {
      const m = parseInt(btn.getAttribute('data-dw-mins'), 10);
      btn.classList.toggle('active', m === totalMins);
    });
  }

  function startTimer() {
    if (timerIsRunning) return;

    const inputDuration = getDurationFromInputs();
    if (timerRemaining <= 0) {
      setTimerDuration(inputDuration > 0 ? inputDuration : 25 * 60);
    } else if (inputDuration > 0 && inputDuration !== timerTotalDuration) {
      // If the user changed the input boxes to a new duration before hitting Start, sync immediately
      setTimerDuration(inputDuration);
    }

    timerIsRunning = true;
    timerEndTime = Date.now() + timerRemaining * 1000;
    if (timerRemaining > 1800) examAlertsFired = { 1800: false, 600: false, 300: false };
    zenMilestonesTriggered = { 25: false, 50: false, 75: false };

    btnTimerStart.style.display = 'none';
    btnTimerPause.style.display = 'inline-flex';

    requestWakeLock();

    let lastTickSecond = -1;
    timerInterval = setInterval(() => {
      const diffMs = timerEndTime - Date.now();
      const currentSec = Math.max(0, Math.round(diffMs / 1000));

      if (currentSec !== lastTickSecond) {
        lastTickSecond = currentSec;
        if (acousticTickEnabled && currentSec > 0) {
          AudioHUD.escapementTick();
        }
        checkExamCheckpoints(currentSec);
        checkZenMilestones(currentSec);
      }

      timerRemaining = currentSec;
      updateTimerDisplay();

      if (timerRemaining <= 0) {
        pauseTimer();
        onTimerComplete();
      }
    }, 250);
  }

  function pauseTimer() {
    timerIsRunning = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    btnTimerStart.style.display = 'inline-flex';
    btnTimerPause.style.display = 'none';
    updateTabTitle();
  }

  function resetTimer() {
    pauseTimer();
    const targetSecs = (timerTotalDuration && timerTotalDuration > 0) ? timerTotalDuration : (getDurationFromInputs() || 25 * 60);
    setTimerDuration(targetSecs);
  }

  function onTimerComplete() {
    const completedMins = Math.max(1, Math.round((timerTotalDuration || 1500) / 60));
    const updatedTele = addFocusMinutes(completedMins);
    const tierInfo = getSupernovaTier(updatedTele.mins);

    // Automated Supernova Celebration centered on the timer display
    const timerStage = document.querySelector('.display-stage');
    let ox = window.innerWidth / 2;
    let oy = window.innerHeight / 2;
    if (timerStage) {
      const rect = timerStage.getBoundingClientRect();
      ox = rect.left + rect.width / 2;
      oy = rect.top + rect.height / 2;
    }

    if (window.spawnSupernovaBurst) {
      window.spawnSupernovaBurst(ox, oy, {
        tier: tierInfo.tier,
        showToast: false,
        celebration: true
      });
    }

    // Tab Title & Accessibility announcements
    document.title = "🔔 (00:00) Time's Up! — Orlando Timer";
    sendBrowserNotification("Orlando Timer", `Time's up! Session of ${completedMins} min completed.`);
    announceSR(`Time is up! Your timer session of ${completedMins} minutes has completed.`);

    // Pomodoro Progression
    if (pomoMode === 'focus') {
      incrementDailySprintCount();
      if (pomoRound >= 4) {
        pomoRound = 1;
        showQuantumTelemetryToast(
          "🌟 4 POMODORO ROUNDS COMPLETE!",
          "Entering 15-Minute Restorative Long Break."
        );
        setPomoMode('longBreak', pomoAutoNext);
      } else {
        pomoRound++;
        showQuantumTelemetryToast(
          "☕ FOCUS ROUND COMPLETE!",
          `Entering 5-Minute Short Break (Next: Round ${pomoRound}/4).`
        );
        setPomoMode('shortBreak', pomoAutoNext);
      }
    } else if (pomoMode === 'shortBreak' || pomoMode === 'longBreak') {
      showQuantumTelemetryToast(
        "⚡ BREAK COMPLETED!",
        `Ready for Focus Session: Round ${pomoRound}/4.`
      );
      setPomoMode('focus', pomoAutoNext);
    } else {
      showQuantumTelemetryToast(
        `🌟 FOCUS SESSION COMPLETED (+${completedMins} MIN)`,
        `TODAY: ${updatedTele.mins} MIN · ${tierInfo.name}`
      );
    }

    if (document.body.classList.contains('zen-mode')) {
      synthesizeAlertSound(currentAlarmSound, currentAlarmVolume);
      if (timerDigitsEl) {
        timerDigitsEl.classList.remove('zen-shimmer-active');
        void timerDigitsEl.offsetWidth;
        timerDigitsEl.classList.add('zen-shimmer-active');
      }
      announceSR(`Zen session complete. ${completedMins} minutes focused in tranquil state.`);
    } else {
      triggerAlertOverlay({
        type: 'timer',
        title: "00:00:00",
        message: `SESSION COMPLETE! +${completedMins}m Focus Logged (${tierInfo.name})`,
        canSnooze: false
      });
    }
  }

  // ── CUSTOM SAVED PRESETS MANAGER ──
  function loadCustomPresets() {
    try {
      const raw = localStorage.getItem('orlando-custom-presets');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter(n => typeof n === 'number' && n > 0 && n <= 720);
      }
    } catch(e) {}
    return [];
  }

  function saveCustomPresets(presets) {
    try {
      localStorage.setItem('orlando-custom-presets', JSON.stringify(presets));
    } catch(e) {}
  }

  function renderPresets() {
    const presetsRow = document.getElementById('presetsRow');
    if (!presetsRow) return;
    const defaultMins = [5, 10, 15, 25, 45, 90];
    const customMins = loadCustomPresets();

    let html = '';
    defaultMins.forEach(mins => {
      html += `<button type="button" class="preset-pill" data-minutes="${mins}">${mins} min</button>`;
    });

    customMins.forEach(mins => {
      html += `
        <div class="custom-preset-pill" data-minutes="${mins}">
          <span>${mins} min</span>
          <button type="button" class="btn-del-preset" data-del-minutes="${mins}" title="Delete ${mins}m preset" aria-label="Delete ${mins}m preset">×</button>
        </div>
      `;
    });

    presetsRow.innerHTML = html;

    presetsRow.querySelectorAll('[data-minutes]').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.btn-del-preset')) return;
        const mins = parseInt(el.getAttribute('data-minutes'), 10);
        if (!isNaN(mins) && mins > 0) {
          const wasRunning = timerIsRunning;
          pauseTimer();
          setTimerDuration(mins * 60);
          if (wasRunning) startTimer();
          AudioHUD.tick(920);
        }
      });
    });

    presetsRow.querySelectorAll('.btn-del-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const minsToDel = parseInt(btn.getAttribute('data-del-minutes'), 10);
        const currentCustom = loadCustomPresets().filter(m => m !== minsToDel);
        saveCustomPresets(currentCustom);
        renderPresets();
        AudioHUD.tick(500);
      });
    });
  }

  const btnAddPreset = document.getElementById('btnAddPreset');
  if (btnAddPreset) {
    btnAddPreset.addEventListener('click', () => {
      const input = prompt("Enter custom timer duration in minutes (e.g., 20, 50, 90):", "20");
      if (input !== null) {
        const mins = parseInt(input.trim(), 10);
        if (!isNaN(mins) && mins > 0 && mins <= 720) {
          const currentCustom = loadCustomPresets();
          if (!currentCustom.includes(mins)) {
            currentCustom.push(mins);
            currentCustom.sort((a, b) => a - b);
            saveCustomPresets(currentCustom);
            renderPresets();
            AudioHUD.confirm();
          }
        } else if (input.trim() !== '') {
          alert("Please enter a valid duration between 1 and 720 minutes.");
        }
      }
    });
  }

  // ── WIRE POMODORO FOCUS BUTTONS ──
  if (btnPomoFocus) {
    btnPomoFocus.addEventListener('click', () => {
      setPomoMode('focus');
      AudioHUD.confirm();
    });
  }
  if (btnPomoShortBreak) {
    btnPomoShortBreak.addEventListener('click', () => {
      setPomoMode('shortBreak');
      AudioHUD.confirm();
    });
  }
  if (btnPomoLongBreak) {
    btnPomoLongBreak.addEventListener('click', () => {
      setPomoMode('longBreak');
      AudioHUD.confirm();
    });
  }
  if (btnPomoAutoNext) {
    btnPomoAutoNext.addEventListener('click', () => {
      pomoAutoNext = !pomoAutoNext;
      safeSetItem('orlando-pomo-autonext', pomoAutoNext ? 'true' : 'false');
      updatePomoUI();
      AudioHUD.tick(pomoAutoNext ? 1200 : 600);
    });
  }

  // Wire Deep Work Strip Duration Buttons (60m, 90m, 120m, 20m Recharge)
  document.querySelectorAll('[data-dw-mins]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mins = parseInt(btn.getAttribute('data-dw-mins'), 10);
      if (!isNaN(mins) && mins > 0) {
        const wasRunning = timerIsRunning;
        pauseTimer();
        setTimerDuration(mins * 60);
        updateDeepWorkStripUI(mins * 60, mins * 60);
        if (wasRunning) startTimer();
        AudioHUD.confirm();
      }
    });
  });

  // Initialize presets and Pomodoro on load
  renderPresets();
  updatePomoUI();

  [timerHourInput, timerMinInput, timerSecInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      const dur = getDurationFromInputs();
      if (dur > 0) {
        setTimerDuration(dur, true);
      }
    });
    input.addEventListener('change', () => {
      const dur = getDurationFromInputs();
      if (dur > 0) {
        setTimerDuration(dur, false);
      } else {
        syncInputsFromRemaining(timerTotalDuration || 25 * 60);
      }
    });
  });

  window.stepTime = function (type, amount) {
    let h = parseInt(timerHourInput.value || '0', 10);
    let m = parseInt(timerMinInput.value || '0', 10);
    let s = parseInt(timerSecInput.value || '0', 10);

    if (type === 'h') h = Math.max(0, Math.min(99, h + amount));
    if (type === 'm') m = Math.max(0, Math.min(59, m + amount));
    if (type === 's') s = Math.max(0, Math.min(59, s + amount));

    const total = h * 3600 + m * 60 + s;
    if (total > 0) {
      setTimerDuration(total, false);
    }
  };

  btnTimerStart.addEventListener('click', startTimer);
  btnTimerPause.addEventListener('click', pauseTimer);
  btnTimerReset.addEventListener('click', resetTimer);

  setTimerDuration(25 * 60);

  // ══════════════════════════════════════════════════════════════════════════
  // 8. STOPWATCH MODULE (Huge Digits MM:SS.ms in Chrome Inter 900)
  // ══════════════════════════════════════════════════════════════════════════
  let swStartTime = 0;
  let swElapsedTime = 0;
  let swInterval = null;
  let swIsRunning = false;
  let laps = [];
  let lastLapTotalTime = 0;

  const swDigitsEl = document.getElementById('swDigits');
  const btnSwStart = document.getElementById('btnSwStart');
  const btnSwStop = document.getElementById('btnSwStop');
  const btnSwLap = document.getElementById('btnSwLap');
  const btnSwReset = document.getElementById('btnSwReset');
  const lapsListEl = document.getElementById('lapsList');

  let currentChronoMode = 'precision'; // 'precision' | 'flow'

  // ── QUANTUM FLOW vs PRECISION CHRONO SINGLE-STRIP ENGINE ──
  function setChronoMode(mode) {
    currentChronoMode = mode;
    const panelSw = document.getElementById('panel-stopwatch');
    const flowStrip = document.getElementById('flowCycleStrip');
    const btnStartText = document.getElementById('btnSwStartText');
    const btnStopText = document.getElementById('btnSwStopText');
    const btnLapText = document.getElementById('btnSwLapText');
    const lapsCol1 = document.getElementById('lapsCol1');

    if (panelSw) panelSw.setAttribute('data-chrono-mode', mode);

    if (mode === 'flow') {
      if (flowStrip) flowStrip.style.display = 'flex';
      if (btnStartText) btnStartText.textContent = 'Start Flow';
      if (btnStopText) btnStopText.textContent = 'Pause Flow';
      if (btnLapText) btnLapText.textContent = 'Checkpoint';
      if (lapsCol1) lapsCol1.textContent = 'Checkpoint #';
      updateFlowJourneyUI(swElapsedTime);
    } else {
      if (flowStrip) flowStrip.style.display = 'none';
      if (btnStartText) btnStartText.textContent = 'Start';
      if (btnStopText) btnStopText.textContent = 'Stop';
      if (btnLapText) btnLapText.textContent = 'Lap';
      if (lapsCol1) lapsCol1.textContent = 'Lap #';
    }
    updateStopwatchDisplay();
    renderLaps();
  }

  function updateFlowJourneyUI(elapsedMs) {
    const totalSecs = Math.floor(elapsedMs / 1000);
    const totalMins = Math.floor(totalSecs / 60);
    const stageTitle = document.getElementById('flowStageTitle');
    const totalBadge = document.getElementById('flowTotalBadge');

    if (totalBadge) {
      if (totalMins >= 60) {
        totalBadge.textContent = `${(totalMins / 60).toFixed(1)}h Elapsed`;
      } else {
        totalBadge.textContent = `${totalMins}m Elapsed`;
      }
    }

    if (stageTitle) {
      if (totalMins >= 90) {
        stageTitle.textContent = 'Flow State · Ultra Mastery (90m+)';
      } else if (totalMins >= 60) {
        stageTitle.textContent = 'Flow State · Deep Immersion (60m+)';
      } else if (totalMins >= 30) {
        stageTitle.textContent = 'Flow State · Creative Current (30m+)';
      } else if (totalMins >= 15) {
        stageTitle.textContent = 'Flow State · Spark Ignited (15m+)';
      } else {
        stageTitle.textContent = 'Flow State · Grounding Focus';
      }
    }

    const pills = document.querySelectorAll('.flow-milestone-pill');
    let activeTarget = 15;
    if (totalMins >= 90) activeTarget = 90;
    else if (totalMins >= 60) activeTarget = 60;
    else if (totalMins >= 30) activeTarget = 30;
    pills.forEach((pill) => {
      const m = parseInt(pill.getAttribute('data-min') || pill.getAttribute('data-flow-min'), 10);
      pill.classList.toggle('active', m === activeTarget || totalMins >= m);
    });
  }

  function formatStopwatchTime(totalMs) {
    const totalSec = Math.floor(totalMs / 1000);
    const ms = Math.floor((totalMs % 1000) / 10);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    const msStr = String(ms).padStart(2, '0');

    // Quantum Flow uses serene HH:MM:SS count-up without frantic millisecond blur
    if (currentChronoMode === 'flow') {
      return `${hh}:${mm}:${ss}`;
    }

    // Precision Chrono uses high-speed millisecond precision MM:SS.ms (or HH:MM:SS.ms)
    if (hours > 0) {
      return `${hh}:${mm}:${ss}.${msStr}`;
    }
    return `${mm}:${ss}.${msStr}`;
  }

  function updateStopwatchDisplay() {
    const formatted = formatStopwatchTime(swElapsedTime);
    if (swDigitsEl) {
      swDigitsEl.innerHTML = chromeHTML(formatted);
    }
  }

  function startStopwatch() {
    if (swIsRunning) return;
    swIsRunning = true;
    swStartTime = performance.now() - swElapsedTime;

    btnSwStart.style.display = 'none';
    btnSwStop.style.display = 'inline-flex';
    btnSwLap.disabled = false;

    requestWakeLock();

    let lastSwTickSec = Math.floor(swElapsedTime / 1000);
    swInterval = setInterval(() => {
      swElapsedTime = performance.now() - swStartTime;
      const currentSwSec = Math.floor(swElapsedTime / 1000);
      if (currentSwSec !== lastSwTickSec) {
        lastSwTickSec = currentSwSec;
        if (acousticTickEnabled && currentSwSec > 0) {
          AudioHUD.escapementTick();
        }
      }
      updateStopwatchDisplay();
      if (currentChronoMode === 'flow') {
        updateFlowJourneyUI(swElapsedTime);
      }
    }, 25);
  }

  function stopStopwatch() {
    swIsRunning = false;
    if (swInterval) {
      clearInterval(swInterval);
      swInterval = null;
    }
    btnSwStart.style.display = 'inline-flex';
    btnSwStop.style.display = 'none';
  }

  function resetStopwatch() {
    stopStopwatch();
    swElapsedTime = 0;
    lastLapTotalTime = 0;
    laps = [];
    updateStopwatchDisplay();
    renderLaps();
    updateFlowJourneyUI(0);
  }

  function recordLap() {
    if (!swIsRunning && swElapsedTime === 0) return;

    const currentTotal = swElapsedTime;
    const split = currentTotal - lastLapTotalTime;
    lastLapTotalTime = currentTotal;

    const lapNum = laps.length + 1;
    laps.unshift({
      lapNumber: lapNum,
      splitTime: split,
      totalTime: currentTotal
    });

    renderLaps();
  }

  function renderLaps() {
    if (!lapsListEl) return;
    if (laps.length === 0) {
      lapsListEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--theme-text-mute);font-size:13px;font-family:var(--mono);">No laps recorded yet</div>';
      return;
    }

    let minSplit = Infinity;
    let maxSplit = -Infinity;

    if (laps.length >= 2) {
      laps.forEach((l) => {
        if (l.splitTime < minSplit) minSplit = l.splitTime;
        if (l.splitTime > maxSplit) maxSplit = l.splitTime;
      });
    }

    lapsListEl.innerHTML = laps
      .map((lap) => {
        let badgeHtml = '';
        if (laps.length >= 2) {
          if (lap.splitTime === minSplit) {
            badgeHtml = '<span class="lap-badge fastest">Fastest</span>';
          } else if (lap.splitTime === maxSplit) {
            badgeHtml = '<span class="lap-badge slowest">Slowest</span>';
          }
        }

        const splitFmt = formatStopwatchTime(lap.splitTime);
        const totalFmt = formatStopwatchTime(lap.totalTime);

        return `
        <div class="lap-item">
          <span class="lap-num">${currentChronoMode === 'flow' ? 'Checkpoint' : 'Lap'} ${String(lap.lapNumber).padStart(2, '0')}${badgeHtml}</span>
          <span class="lap-split chrome">+${chromeHTML(splitFmt)}</span>
          <span class="lap-total chrome">${chromeHTML(totalFmt)}</span>
        </div>
      `;
      })
      .join('');
  }

  btnSwStart.addEventListener('click', startStopwatch);
  btnSwStop.addEventListener('click', stopStopwatch);
  btnSwLap.addEventListener('click', recordLap);
  btnSwReset.addEventListener('click', resetStopwatch);

  updateStopwatchDisplay();
  renderLaps();

  // ══════════════════════════════════════════════════════════════════════════
  // 9. ALARM MODULE (12-hour AM/PM, Multiple Alarms, Chrome Formatting)
  // ══════════════════════════════════════════════════════════════════════════
  const STORAGE_KEY = 'orlando_timer_alarms';
  let alarms = [];
  let alarmAmPm = 'AM';
  let lastCheckedMinute = -1;

  const alarmHourSelect = document.getElementById('alarmHour');
  const alarmMinuteSelect = document.getElementById('alarmMinute');
  const btnAm = document.getElementById('btnAm');
  const btnPm = document.getElementById('btnPm');
  const alarmLabelInput = document.getElementById('alarmLabel');
  const btnAddAlarm = document.getElementById('btnAddAlarm');
  const alarmsListContainer = document.getElementById('alarmsList');

  if (alarmHourSelect) {
    for (let h = 1; h <= 12; h++) {
      const opt = document.createElement('option');
      opt.value = String(h);
      opt.textContent = String(h).padStart(2, '0');
      if (h === 7) opt.selected = true;
      alarmHourSelect.appendChild(opt);
    }
  }

  if (alarmMinuteSelect) {
    for (let m = 0; m < 60; m++) {
      const opt = document.createElement('option');
      opt.value = String(m);
      opt.textContent = String(m).padStart(2, '0');
      if (m === 0) opt.selected = true;
      alarmMinuteSelect.appendChild(opt);
    }
  }

  if (btnAm && btnPm) {
    btnAm.addEventListener('click', () => {
      alarmAmPm = 'AM';
      btnAm.classList.add('active');
      btnPm.classList.remove('active');
    });
    btnPm.addEventListener('click', () => {
      alarmAmPm = 'PM';
      btnPm.classList.add('active');
      btnAm.classList.remove('active');
    });
  }

  function loadAlarms() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        alarms = JSON.parse(raw);
      } else {
        alarms = [
          {
            id: 'alarm_1',
            hour: 6,
            minute: 30,
            ampm: 'AM',
            label: 'Morning Focus & Planning',
            enabled: true
          },
          {
            id: 'alarm_2',
            hour: 1,
            minute: 0,
            ampm: 'PM',
            label: 'Afternoon Mathematics Review',
            enabled: true
          },
          {
            id: 'alarm_3',
            hour: 8,
            minute: 30,
            ampm: 'PM',
            label: 'Evening Executive Recharge',
            enabled: true
          }
        ];
        saveAlarms();
      }
    } catch (e) {
      alarms = [];
    }
  }

  function saveAlarms() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
    } catch (e) {}
    renderAlarms();
  }

  function calculateTimeUntil(alarmHour, alarmMinute, alarmAmPm) {
    const now = new Date();
    let targetHour = alarmHour;
    if (alarmAmPm === 'PM' && targetHour < 12) targetHour += 12;
    if (alarmAmPm === 'AM' && targetHour === 12) targetHour = 0;

    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, alarmMinute, 0, 0);
    if (targetDate <= now) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const diffMs = targetDate - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours === 0 && diffMins === 0) {
      return 'Rings in less than 1 min';
    }
    if (diffHours === 0) {
      return `Rings in ${diffMins}m`;
    }
    return `Rings in ${diffHours}h ${diffMins}m`;
  }

  function renderAlarms() {
    if (!alarmsListContainer) return;
    if (alarms.length === 0) {
      alarmsListContainer.innerHTML = '<div style="text-align:center;padding:32px;color:var(--theme-text-mute);font-size:14px;font-family:var(--mono);">No alarms set. Create one above!</div>';
      return;
    }

    alarmsListContainer.innerHTML = alarms
      .map((alarm) => {
        const timeDigits = `${String(alarm.hour).padStart(2, '0')}:${String(alarm.minute).padStart(2, '0')}`;
        const timeFormatted = chromeHTML(timeDigits);
        const countdownStr = alarm.enabled ? calculateTimeUntil(alarm.hour, alarm.minute, alarm.ampm) : 'Disabled';

        return `
        <div class="alarm-card ${alarm.enabled ? '' : 'disabled'}" id="card_${alarm.id}">
          <div class="alarm-card-left">
            <div class="alarm-card-time chrome">
              ${timeFormatted}
              <span style="font-size:0.52em;margin-left:0.18em;letter-spacing:0.04em;">${alarm.ampm}</span>
            </div>
            <div class="alarm-card-label">${escapeHtml(alarm.label || 'Alarm')}</div>
            <div class="alarm-card-countdown">${countdownStr}</div>
          </div>
          <div class="alarm-card-right">
            <label class="switch" title="Toggle Alarm">
              <input type="checkbox" ${alarm.enabled ? 'checked' : ''} onchange="window.toggleAlarm('${alarm.id}')">
              <span class="slider"></span>
            </label>
            <button type="button" class="btn-delete-alarm" title="Delete Alarm" onclick="window.deleteAlarm('${alarm.id}')">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
      })
      .join('');
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  window.toggleAlarm = function (id) {
    const alarm = alarms.find((a) => a.id === id);
    if (alarm) {
      alarm.enabled = !alarm.enabled;
      saveAlarms();
    }
  };

  window.deleteAlarm = function (id) {
    alarms = alarms.filter((a) => a.id !== id);
    saveAlarms();
  };

  if (btnAddAlarm) {
    btnAddAlarm.addEventListener('click', () => {
      const h = parseInt(alarmHourSelect.value, 10);
      const m = parseInt(alarmMinuteSelect.value, 10);
      const label = (alarmLabelInput.value || '').trim() || 'Orlando Timer Alarm';

      const newAlarm = {
        id: 'alarm_' + Date.now(),
        hour: h,
        minute: m,
        ampm: alarmAmPm,
        label: label,
        enabled: true
      };

      alarms.push(newAlarm);
      alarmLabelInput.value = '';
      saveAlarms();
    });
  }

  const alarmLiveDigitsEl = document.getElementById('alarmLiveDigits');

  function updateAlarmLiveClock() {
    if (!alarmLiveDigitsEl) return;
    const now = new Date();
    let currentHour24 = now.getHours();
    let currentAmPm = currentHour24 >= 12 ? 'PM' : 'AM';
    let currentHour12 = currentHour24 % 12;
    if (currentHour12 === 0) currentHour12 = 12;
    const hStr = String(currentHour12).padStart(2, '0');
    const mStr = String(now.getMinutes()).padStart(2, '0');
    const sStr = String(now.getSeconds()).padStart(2, '0');
    alarmLiveDigitsEl.innerHTML = chromeHTML(`${hStr}:${mStr}:${sStr}`) + `<span class="ampm-indicator">${currentAmPm}</span>`;
  }

  function checkAlarms() {
    updateAlarmLiveClock();
    const now = new Date();
    const currentMin = now.getMinutes();

    if (now.getSeconds() === 0 && currentMin !== lastCheckedMinute) {
      renderAlarms();
      lastCheckedMinute = currentMin;

      let currentHour24 = now.getHours();
      let currentAmPm = currentHour24 >= 12 ? 'PM' : 'AM';
      let currentHour12 = currentHour24 % 12;
      if (currentHour12 === 0) currentHour12 = 12;

      alarms.forEach((alarm) => {
        if (alarm.enabled && alarm.hour === currentHour12 && alarm.minute === currentMin && alarm.ampm === currentAmPm) {
          triggerAlertOverlay({
            type: 'alarm',
            title: `${String(alarm.hour).padStart(2, '0')}:${String(alarm.minute).padStart(2, '0')}`,
            message: `${alarm.label || 'Alarm Notification'} (${alarm.ampm})`,
            canSnooze: true
          });
        }
      });
    }
  }

  setInterval(checkAlarms, 1000);
  loadAlarms();
  updateAlarmLiveClock();

  // ══════════════════════════════════════════════════════════════════════════
  // 10. FULLSCREEN ALERT OVERLAY (Flashing, Sound, Snooze & Stop)
  // ══════════════════════════════════════════════════════════════════════════
  const overlayEl = document.getElementById('ov');
  const ovTitleEl = document.getElementById('ovTitle');
  const ovMessageEl = document.getElementById('ovMessage');
  const btnOvSnooze = document.getElementById('btnOvSnooze');
  const btnOvDismiss = document.getElementById('btnOvDismiss');

  function triggerAlertOverlay(info) {
    isRinging = info;
    if (ovTitleEl) ovTitleEl.innerHTML = chromeHTML(info.title);
    if (ovMessageEl) ovMessageEl.textContent = info.message;

    if (btnOvSnooze) {
      btnOvSnooze.style.display = info.canSnooze ? 'inline-flex' : 'none';
    }

    if (overlayEl) {
      overlayEl.style.display = 'flex';
      overlayEl.classList.add('flashing-screen');
    }

    startRingingSound();
    requestWakeLock();
  }

  function dismissAlert() {
    if (overlayEl) {
      overlayEl.style.display = 'none';
      overlayEl.classList.remove('flashing-screen');
    }
    stopRingingSound();
    isRinging = null;
  }

  function snoozeAlert() {
    dismissAlert();
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);

    let h24 = now.getHours();
    let ampm = h24 >= 12 ? 'PM' : 'AM';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;

    const snoozeAlarm = {
      id: 'snooze_' + Date.now(),
      hour: h12,
      minute: now.getMinutes(),
      ampm: ampm,
      label: `Snooze: ${isRinging ? isRinging.message : 'Alarm'}`,
      enabled: true
    };
    alarms.push(snoozeAlarm);
    saveAlarms();
  }

  if (btnOvDismiss) btnOvDismiss.addEventListener('click', dismissAlert);
  if (btnOvSnooze) btnOvSnooze.addEventListener('click', snoozeAlert);

  window.addEventListener('keydown', (e) => {
    if (isRinging) {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        dismissAlert();
      } else if ((e.key === 's' || e.key === 'S') && isRinging.canSnooze) {
        snoozeAlert();
      }
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ── 10B. QUANTUM TIME COMMAND & PRODUCTIVITY PROTOCOL MODES ──
  const btnLogoEasterEgg = document.getElementById('btnLogoEasterEgg');
  const brandFunTag = document.getElementById('brandFunTag');
  const funTagLabel = document.getElementById('funTagLabel');
  const funMicroCockpit = document.getElementById('funMicroCockpit');
  const btnCloseFunCockpit = document.getElementById('btnCloseFunCockpit');
  const btnFireSupernova = document.getElementById('btnFireSupernova');
  const btnToggleZenMode = document.getElementById('btnToggleZenMode');
  const zenModeLabel = document.getElementById('zenModeLabel');
  const dayProgressVal = document.getElementById('dayProgressVal');
  const dayProgressBar = document.getElementById('dayProgressBar');
  const dayCountdownSub = document.getElementById('dayCountdownSub');
  const drawerBackdropEl = document.getElementById('quantumDrawerBackdrop');

  // Zen Immersion HUD Elements & Variables
  const btnExitZenHUD = document.getElementById('btnExitZenHUD');
  const btnZenPlayPause = document.getElementById('btnZenPlayPause');
  const btnZenFullscreen = document.getElementById('btnZenFullscreen');
  let zenIdleTimeout = null;
  let toastTimeout = null;

  function resetZenIdleTimer() {
    if (!document.body.classList.contains('zen-mode')) return;
    document.body.classList.remove('zen-idle');
    if (zenIdleTimeout) clearTimeout(zenIdleTimeout);
    zenIdleTimeout = setTimeout(() => {
      if (document.body.classList.contains('zen-mode')) {
        document.body.classList.add('zen-idle');
      }
    }, 4500);
  }

  function toggleZenMode(force) {
    const isZen = force !== undefined ? force : !document.body.classList.contains('zen-mode');
    document.body.classList.toggle('zen-mode', isZen);
    document.body.classList.remove('zen-idle');
    if (zenModeLabel) zenModeLabel.textContent = isZen ? 'Exit Zen Mode' : 'Zen Immersion Mode';

    if (isZen) {
      toggleFunCockpit(false);
      toggleModeDropdown(false);
      announceSR("Zen Immersion Mode activated. Press Escape or Z to exit.");
      AudioHUD.confirm();
      resetZenIdleTimer();
    } else {
      if (currentProductivityMode === 'zen-immersion') {
        currentProductivityMode = 'focus-protocol';
        safeSetItem('orlando-productivity-mode', 'focus-protocol');
        if (funTagLabel) funTagLabel.textContent = 'Focus Protocol';
        document.querySelectorAll('.mode-option-btn').forEach((btn) => {
          btn.classList.toggle('active', btn.getAttribute('data-mode') === 'focus-protocol');
        });
      }
      announceSR("Zen Immersion Mode exited.");
      AudioHUD.tick(600);
      if (zenIdleTimeout) clearTimeout(zenIdleTimeout);
    }
  }

  // ── QUANTUM TIME COMMAND HUB CONTROLLER ──
  function toggleFunCockpit(show) {
    if (!funMicroCockpit) return;
    const isOpen = funMicroCockpit.classList.contains('open');
    const shouldOpen = show !== undefined ? show : !isOpen;
    if (shouldOpen) {
      funMicroCockpit.classList.add('open');
      if (drawerBackdropEl) drawerBackdropEl.classList.add('open');
      document.body.classList.add('drawer-open');
      updateFocusTelemetryUI();
      renderWeeklyFocusChart();
      updateEarthDayProgress();
      AudioHUD.confirm();
    } else {
      funMicroCockpit.classList.remove('open');
      if (drawerBackdropEl) drawerBackdropEl.classList.remove('open');
      document.body.classList.remove('drawer-open');
      AudioHUD.tick(500);
    }
  }

  function updateEarthDayProgress() {
    const now = new Date();
    const totalSecsInDay = 86400;
    const currentSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const pct = ((currentSecs / totalSecsInDay) * 100).toFixed(1);
    const secsLeft = totalSecsInDay - currentSecs;
    const hrsLeft = Math.floor(secsLeft / 3600);
    const minsLeft = Math.floor((secsLeft % 3600) / 60);

    if (dayProgressVal) dayProgressVal.textContent = `${pct}%`;
    if (dayProgressBar) dayProgressBar.style.width = `${pct}%`;
    if (dayCountdownSub) dayCountdownSub.textContent = `${hrsLeft}h ${minsLeft}m left`;
  }

  // ── 10C. QUANTUM FOCUS TELEMETRY & MILESTONE ENGINE ──
  function getTodayDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function getFocusTelemetry() {
    const today = getTodayDateString();
    const savedDate = localStorage.getItem('ot_focus_date');
    if (savedDate !== today) {
      localStorage.setItem('ot_focus_date', today);
      localStorage.setItem('ot_focus_mins', '0');
      return { date: today, mins: 0 };
    }
    const mins = parseInt(localStorage.getItem('ot_focus_mins') || '0', 10);
    return { date: today, mins };
  }

  // ── WEEKLY FOCUS HISTORY CHART ENGINE ──
  function getIsoWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  function getWeekKey() {
    const d = new Date();
    return `${d.getFullYear()}-W${getIsoWeekNumber(d)}`;
  }

  function getWeeklyFocusData() {
    const currentKey = getWeekKey();
    let data = { weekKey: currentKey, days: [0, 0, 0, 0, 0, 0, 0] };
    try {
      const raw = localStorage.getItem('orlando-weekly-focus');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.weekKey === currentKey && Array.isArray(parsed.days) && parsed.days.length === 7) {
          data = parsed;
        }
      }
    } catch (e) {}
    return data;
  }

  function recordWeeklyFocus(mins) {
    if (mins <= 0) return;
    const data = getWeeklyFocusData();
    const dayIndex = (new Date().getDay() + 6) % 7; // Mon=0, Sun=6
    data.days[dayIndex] = (data.days[dayIndex] || 0) + Math.round(mins);
    try {
      localStorage.setItem('orlando-weekly-focus', JSON.stringify(data));
    } catch (e) {}
    renderWeeklyFocusChart();
  }

  function renderWeeklyFocusChart() {
    const chartBars = document.getElementById('weeklyChartBars');
    const totalBadge = document.getElementById('weeklyTotalBadge');
    if (!chartBars) return;
    const data = getWeeklyFocusData();
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIndex = (new Date().getDay() + 6) % 7;

    const totalMins = data.days.reduce((a, b) => a + b, 0);
    const totalHours = (totalMins / 60).toFixed(1);
    if (totalBadge) {
      totalBadge.textContent = `${totalHours}h this week`;
    }

    const maxMins = Math.max(60, ...data.days);
    chartBars.innerHTML = '';
    data.days.forEach((mins, idx) => {
      const isToday = idx === todayIndex;
      const pct = Math.max(8, Math.min(100, Math.round((mins / maxMins) * 100)));
      const col = document.createElement('div');
      col.className = `weekly-chart-col${isToday ? ' today' : ''}`;
      col.innerHTML = `
        <div class="weekly-bar-track">
          <div class="weekly-bar-fill" style="height: ${pct}%;" title="${mins} mins"></div>
        </div>
        <span class="weekly-bar-day">${dayNames[idx]}</span>
        <span class="weekly-bar-val">${mins > 0 ? (mins >= 60 ? (mins/60).toFixed(1) + 'h' : mins + 'm') : '0'}</span>
      `;
      chartBars.appendChild(col);
    });
  }

  function addFocusMinutes(mins) {
    const current = getFocusTelemetry();
    if (mins <= 0) return current;
    const newMins = current.mins + Math.round(mins);
    localStorage.setItem('ot_focus_mins', String(newMins));
    recordWeeklyFocus(mins);
    updateFocusTelemetryUI();
    return { date: current.date, mins: newMins };
  }

  function getSupernovaTier(mins) {
    if (mins >= 120) return { tier: 3, label: 'Tier III · Hypernova', name: 'Tier III · Hypernova', minMins: 120, nextMins: 120, nextLabel: 'MAX TIER' };
    if (mins >= 60) return { tier: 2, label: 'Tier II · Supernova', name: 'Tier II · Supernova', minMins: 60, nextMins: 120, nextLabel: 'Tier III (120m)' };
    if (mins >= 25) return { tier: 1, label: 'Tier I · Nova', name: 'Tier I · Nova', minMins: 25, nextMins: 60, nextLabel: 'Tier II (60m)' };
    return { tier: 0, label: 'Dormant Nebula', name: 'Tier I · Nova', minMins: 0, nextMins: 25, nextLabel: 'Tier I (25m)' };
  }

  function updateFocusTelemetryUI() {
    const tele = getFocusTelemetry();
    const tierInfo = getSupernovaTier(tele.mins);
    const tierBadge = document.getElementById('supernovaTierBadge');
    const focusMinsEl = document.getElementById('telemetryFocusMins');
    const nextTierEl = document.getElementById('telemetryNextTier');
    const progressFill = document.getElementById('telemetryProgressFill');

    if (tierBadge) tierBadge.textContent = tierInfo.label;
    if (focusMinsEl) focusMinsEl.textContent = `${tele.mins}m`;
    if (nextTierEl) nextTierEl.textContent = tierInfo.nextLabel;
    if (progressFill) {
      if (tierInfo.tier === 3) {
        progressFill.style.width = '100%';
      } else {
        const span = tierInfo.nextMins - tierInfo.minMins;
        const current = tele.mins - tierInfo.minMins;
        const pct = Math.min(100, Math.max(0, (current / span) * 100));
        progressFill.style.width = `${pct}%`;
      }
    }
  }

  function showQuantumTelemetryToast(title, message) {
    const allowToast = safeGetItem('orlando-milestone-toast', 'true') === 'true';
    if (!allowToast) return;

    const toast = document.getElementById('quantumTelemetryToast');
    const tTitle = document.getElementById('toastTitle');
    const tMsg = document.getElementById('toastMessage');
    if (!toast || !tTitle || !tMsg) return;

    tTitle.textContent = title;
    tMsg.textContent = message;
    toast.style.display = 'flex';
    toast.classList.add('visible');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('visible');
      toast.style.display = 'none';
    }, 4200);
  }

  // ── 10D. QUANTUM RESONANCE BREATHING CALIBRATION (4-4-4-4) ──
  let breathingInterval = null;
  let breathingPhase = 0; // 0: inhale, 1: hold1, 2: exhale, 3: hold2
  let breathingSecLeft = 4;
  const breathingPhases = [
    { title: 'Inhale Prana', sub: 'Fill diaphragm with starlight', state: 'inhale' },
    { title: 'Hold Steady', sub: 'Retain cosmic resonance', state: 'hold-in' },
    { title: 'Exhale Void', sub: 'Release all cognitive tension', state: 'exhale' },
    { title: 'Hold Stillness', sub: 'Rest in pure stillness', state: 'hold-out' }
  ];

  function startBreathingSession() {
    const overlay = document.getElementById('quantumBreathingOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    overlay.classList.add('active');
    breathingPhase = 0;
    breathingSecLeft = 4;
    updateBreathingUI();
    AudioHUD.confirm();

    if (breathingInterval) clearInterval(breathingInterval);
    breathingInterval = setInterval(() => {
      breathingSecLeft--;
      if (breathingSecLeft <= 0) {
        breathingPhase = (breathingPhase + 1) % 4;
        breathingSecLeft = 4;
        AudioHUD.tick(800 + breathingPhase * 100);
      } else {
        AudioHUD.tick(440);
      }
      updateBreathingUI();
    }, 1000);
  }

  function stopBreathingSession() {
    const overlay = document.getElementById('quantumBreathingOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.display = 'none';
    }
    if (breathingInterval) {
      clearInterval(breathingInterval);
      breathingInterval = null;
    }
  }

  function updateBreathingUI() {
    const counter = document.getElementById('breathingCounter');
    const title = document.getElementById('breathingStateTitle');
    const subtext = document.getElementById('breathingSubtext');
    const orbOuter = document.getElementById('breathingOrbOuter');
    const orbCore = document.getElementById('breathingOrbCore');
    const dots = document.querySelectorAll('.b-cycle-dot');

    if (counter) counter.textContent = breathingSecLeft;
    const curr = breathingPhases[breathingPhase];
    if (title) title.textContent = curr.title;
    if (subtext) subtext.textContent = curr.sub;

    if (orbOuter && orbCore) {
      orbOuter.className = `breathing-orb-outer state-${curr.state}`;
      orbCore.className = `breathing-orb-core state-${curr.state}`;
    }

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === breathingPhase);
    });
  }

  // ── 10E. REAL PRODUCTIVITY PROTOCOL MODES CONTROLLER ──
  const MODE_METADATA = {
    'focus-protocol': {
      title: 'Focus Protocol',
      badge: 'Pomodoro',
      toastTitle: '🍅 FOCUS PROTOCOL ACTIVE',
      toastDesc: '25m Focus / 5m Break Pomodoro rhythm with auto-advance.',
      srText: 'Focus Protocol activated: 25-minute Pomodoro rhythm.'
    },
    'zen-immersion': {
      title: 'Zen Immersion',
      badge: 'Void',
      toastTitle: '🧘 ZEN IMMERSION ACTIVE',
      toastDesc: 'Pure distraction-free void with colossal floating horology digits.',
      srText: 'Zen Immersion activated: Minimalist focus void.'
    },
    'deep-work': {
      title: 'Deep Work',
      badge: '90m Ultra',
      toastTitle: '⚡ DEEP WORK ACTIVE',
      toastDesc: '90-minute human ultradian cycle (Warm-Up · Peak Flow · Review).',
      srText: 'Deep Work activated: 90-minute ultradian cycle.'
    },
    'quantum-flow': {
      title: 'Quantum Flow',
      badge: 'Flow State',
      toastTitle: '🌌 QUANTUM FLOW ACTIVE',
      toastDesc: 'Serene HH:MM:SS count-up with unbroken Flow Milestones.',
      srText: 'Quantum Flow activated: Serene count-up flow state.'
    },
    'precision-chrono': {
      title: 'Precision Chrono',
      badge: 'Split Laps',
      toastTitle: '⏱️ PRECISION CHRONOMETER ACTIVE',
      toastDesc: 'Swiss chronometer with 100fps milliseconds & split-lap telemetry.',
      srText: 'Precision Chrono activated: Millisecond chronometer with split laps.'
    }
  };

  function toggleModeDropdown(force) {
    const menu = document.getElementById('modeDropdownMenu');
    const tag = document.getElementById('brandFunTag');
    if (!menu || !tag) return;

    const isOpen = force !== undefined ? force : !menu.classList.contains('open');
    if (isOpen) {
      menu.classList.add('open');
      tag.classList.add('open');
      tag.setAttribute('aria-expanded', 'true');
      AudioHUD.tick(880);
    } else {
      menu.classList.remove('open');
      tag.classList.remove('open');
      tag.setAttribute('aria-expanded', 'false');
    }
  }

  function applyProductivityMode(modeKey, userAction = true) {
    if (!MODE_METADATA[modeKey]) modeKey = 'focus-protocol';
    currentProductivityMode = modeKey;
    safeSetItem('orlando-productivity-mode', modeKey);

    const meta = MODE_METADATA[modeKey];
    if (funTagLabel) funTagLabel.textContent = meta.title;

    // Update active state in dropdown
    const modeBtns = document.querySelectorAll('.mode-option-btn');
    modeBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === modeKey);
    });

    if (modeKey === 'focus-protocol') {
      const wasRunning = timerIsRunning;
      switchAppTab('timer');
      toggleZenMode(false);
      setTimerSubMode('focus-protocol');
      setPomoMode('focus', wasRunning);
    } else if (modeKey === 'zen-immersion') {
      switchAppTab('timer');
      setTimerSubMode('focus-protocol');
      if (userAction) {
        toggleZenMode(true);
      } else {
        toggleZenMode(false); // ALWAYS show full buttons and UI on page load/refresh
      }
    } else if (modeKey === 'deep-work') {
      const wasRunning = timerIsRunning;
      switchAppTab('timer');
      toggleZenMode(false);
      pauseTimer();
      setTimerDuration(90 * 60); // 90 min ultradian
      setTimerSubMode('deep-work');
      if (wasRunning) startTimer();
    } else if (modeKey === 'quantum-flow') {
      pauseTimer();
      switchAppTab('stopwatch');
      toggleZenMode(false);
      setChronoMode('flow');
    } else if (modeKey === 'precision-chrono') {
      pauseTimer();
      switchAppTab('stopwatch');
      toggleZenMode(false);
      setChronoMode('precision');
    }

    if (userAction) {
      showQuantumTelemetryToast(meta.toastTitle, meta.toastDesc);
      announceSR(meta.srText);
      AudioHUD.confirm();
    }
  }

  // ── ATTACH ALL EVENT LISTENERS ──

  // Expose Quantum Time Command Hub toggle globally for System Menu & Spotlight Palette
  window.toggleQuantumTimeCommand = toggleFunCockpit;

  // Brand emblem link returns cleanly to Master Portfolio (no accidental drawer toggle)
  if (btnLogoEasterEgg) {
    btnLogoEasterEgg.addEventListener('click', () => {
      AudioHUD.hapticPulse(920);
    });
  }

  // Close drawer button
  if (btnCloseFunCockpit) {
    btnCloseFunCockpit.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFunCockpit(false);
      AudioHUD.tick(500);
    });
  }

  // Fire Supernova button in drawer
  if (btnFireSupernova) {
    btnFireSupernova.addEventListener('click', (e) => {
      e.stopPropagation();
      const tele = getFocusTelemetry();
      const tierInfo = getSupernovaTier(tele.mins);
      if (window.spawnSupernovaBurst) {
        window.spawnSupernovaBurst(window.innerWidth / 2, window.innerHeight / 2, {
          tier: tierInfo.tier,
          showToast: true
        });
      }
    });
  }

  // Drawer backdrop click closes drawer
  if (drawerBackdropEl) {
    drawerBackdropEl.addEventListener('click', () => {
      toggleFunCockpit(false);
    });
  }

  // Mode Pill Dropdown toggle (ONLY toggles dropdown, not Zen mode)
  if (brandFunTag) {
    brandFunTag.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleModeDropdown();
    });
  }

  // Wire each of the 5 Real Mode Options
  const modeOptionBtns = document.querySelectorAll('.mode-option-btn');
  modeOptionBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modeKey = btn.getAttribute('data-mode');
      applyProductivityMode(modeKey, true);
      toggleModeDropdown(false);
    });
  });

  // Breathing session controls in drawer
  const btnStartBreathing = document.getElementById('btnStartBreathing');
  const btnCloseBreathing = document.getElementById('btnCloseBreathing');
  const btnStopBreathing = document.getElementById('btnStopBreathing');

  if (btnStartBreathing) {
    btnStartBreathing.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFunCockpit(false);
      startBreathingSession();
    });
  }

  if (btnCloseBreathing) {
    btnCloseBreathing.addEventListener('click', stopBreathingSession);
  }
  if (btnStopBreathing) {
    btnStopBreathing.addEventListener('click', stopBreathingSession);
  }

  // Zen Immersion HUD Buttons
  if (btnExitZenHUD) {
    btnExitZenHUD.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleZenMode(false);
    });
  }

  if (btnZenPlayPause) {
    btnZenPlayPause.addEventListener('click', (e) => {
      e.stopPropagation();
      if (timerIsRunning) {
        pauseTimer();
        AudioHUD.tick(600);
      } else {
        startTimer();
        AudioHUD.tick(1200);
      }
    });
  }

  if (btnZenFullscreen) {
    btnZenFullscreen.addEventListener('click', (e) => {
      e.stopPropagation();
      if (btnFullscreen) btnFullscreen.click();
    });
  }

  if (btnToggleZenMode) {
    btnToggleZenMode.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleZenMode();
    });
  }

  // Zen idle listeners
  window.addEventListener('mousemove', resetZenIdleTimer, { passive: true });
  window.addEventListener('touchstart', resetZenIdleTimer, { passive: true });

  // Keyboard hotkeys: Z toggles Zen Mode, Spacebar toggles Play/Pause, Escape exits
  document.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) return;
    
    if (e.key === 'z' || e.key === 'Z') {
      toggleZenMode();
    } else if (e.key === 'Escape') {
      toggleModeDropdown(false);
      if (document.body.classList.contains('zen-mode')) {
        toggleZenMode(false);
      }
      stopBreathingSession();
    } else if (e.code === 'Space') {
      e.preventDefault();
      if (timerIsRunning) {
        pauseTimer();
        AudioHUD.tick(600);
      } else {
        startTimer();
        AudioHUD.tick(1200);
      }
    }
  });

  // Clicking directly on digits in Zen Mode toggles Play / Pause
  if (timerDigitsEl) {
    timerDigitsEl.addEventListener('click', () => {
      if (document.body.classList.contains('zen-mode')) {
        if (timerIsRunning) {
          pauseTimer();
          AudioHUD.tick(600);
        } else {
          startTimer();
          AudioHUD.tick(1200);
        }
      }
    });
  }

  // Click outside Mode Dropdown closes it
  document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('modeDropdownWrapper');
    if (wrapper && !wrapper.contains(e.target)) {
      toggleModeDropdown(false);
    }
  });

  // On initial page load / refresh, always ensure Zen Mode is exited so buttons are visible
  toggleZenMode(false);
  document.body.classList.remove('zen-mode', 'zen-idle');
  // Initialize saved productivity mode on load (without triggering user action toast)
  applyProductivityMode(currentProductivityMode, false);
  updateEarthDayProgress();
  setInterval(updateEarthDayProgress, 30000);
  
  // Click outside Command Hub closes drawer
  document.addEventListener('click', (e) => {
    if (funMicroCockpit && funMicroCockpit.classList.contains('open')) {
      if (!funMicroCockpit.contains(e.target) && !btnLogoEasterEgg?.contains(e.target)) {
        toggleFunCockpit(false);
      }
    }
  });

  // 11. ANTIGRAVITY REPULSIVE PARTICLES CANVAS (Ultra-Smooth 60/120 FPS Engine)
  // ══════════════════════════════════════════════════════════════════════════
  const canvas = document.getElementById('antigravityCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let shockwave = null;
    const baseParticleBudget = 28; // Lean minimum particle budget
    let particleFieldFactor = 0; // 0 = Minimum (current lean 28 dots), 1 = Maximum (112 radiant stars)
    let mouse = { x: -1000, y: -1000, radius: 120 };
    let currentParticleColor = 'rgba(217, 185, 92, 0.45)';
    let particleSpeedFactor = 1.0;

    window.updateParticleThemeColor = function (hexColor) {
      if (hexColor) currentParticleColor = hexColor;
    };

    window.updateParticleSpeed = function (factor) {
      particleSpeedFactor = Math.max(0, factor);
    };

    window.updateParticleFieldSettings = function (factor) {
      particleFieldFactor = Math.max(0, Math.min(1, factor));
      const targetCount = Math.round(baseParticleBudget + particleFieldFactor * (112 - baseParticleBudget));

      const ambient = particles.filter(p => !p.isBurst);
      const bursts = particles.filter(p => p.isBurst);

      if (ambient.length < targetCount) {
        const needed = targetCount - ambient.length;
        for (let i = 0; i < needed; i++) {
          const baseS = Math.random() * 1.8 + 1.2;
          const s = baseS * (1 + particleFieldFactor * 0.75);
          ambient.push({
            x: Math.random() * (Math.max(10, width - s * 4)) + s * 2,
            y: Math.random() * (Math.max(10, height - s * 4)) + s * 2,
            vx: (Math.random() - 0.5) * (0.5 + particleFieldFactor * 0.35),
            vy: (Math.random() - 0.5) * (0.5 + particleFieldFactor * 0.35),
            size: s,
            targetSize: s,
            alpha: Math.random() * 0.25 + (0.18 + particleFieldFactor * 0.18),
            isDust: false,
            isBurst: false,
            shattered: false,
            dustTimer: 0
          });
        }
      } else if (ambient.length > targetCount) {
        ambient.length = targetCount;
      }

      // Smoothly scale existing particle sizes and targets
      for (let i = 0; i < ambient.length; i++) {
        const p = ambient[i];
        const baseS = Math.random() * 1.8 + 1.2;
        p.targetSize = baseS * (1 + particleFieldFactor * 0.75);
        if (!p.isDust) {
          p.size = p.targetSize;
        }
      }

      mouse.radius = 120 + particleFieldFactor * 60;
      particles = [...ambient, ...bursts];
    };

    window.spawnSupernovaBurst = function (originX, originY, options = {}) {
      const ox = originX !== undefined ? originX : width / 2;
      const oy = originY !== undefined ? originY : height / 2;
      const tele = getFocusTelemetry();
      const defaultTierInfo = getSupernovaTier(tele.mins);
      const tier = options.tier || defaultTierInfo.tier;

      // Reset any shattered states on existing ambient particles
      for (let i = 0; i < particles.length; i++) {
        if (!particles[i].isBurst) {
          particles[i].shattered = false;
        }
      }

      // 1. One big central explosion at the middle (lightweight ~22 radiant photons)
      const burstCount = tier === 3 ? 28 : (tier === 2 ? 22 : 18);
      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 2.5;
        particles.push({
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.2 + 1.2,
          alpha: 1.0,
          isBurst: true,
          decay: Math.random() * 0.015 + 0.01
        });
      }

      // 2. Single high-speed shockwave ring that smoothly triggers chain reaction
      shockwave = {
        x: ox,
        y: oy,
        radius: 6,
        maxRadius: Math.hypot(width, height) * 0.95,
        speed: 13,
        alpha: 0.95,
        decay: 0.009
      };

      // Procedural Acoustic Sound
      AudioHUD.supernovaShockwave(tier);

      // Telemetry Toast
      if (options.showToast) {
        const tierDetails = getSupernovaTier(tele.mins);
        showQuantumTelemetryToast(
          `✨ ${tierDetails.name} DETONATED`,
          `TODAY'S FOCUS: ${tele.mins} MIN · SMOOTH CHAIN REACTION`
        );
      }
    };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function initParticles() {
      particles = [];
      shockwave = null;
      const count = Math.round(baseParticleBudget + particleFieldFactor * (112 - baseParticleBudget));
      for (let i = 0; i < count; i++) {
        const baseS = Math.random() * 1.8 + 1.2;
        const s = baseS * (1 + particleFieldFactor * 0.75);
        particles.push({
          x: Math.random() * (Math.max(10, width - s * 4)) + s * 2,
          y: Math.random() * (Math.max(10, height - s * 4)) + s * 2,
          vx: (Math.random() - 0.5) * (0.5 + particleFieldFactor * 0.35),
          vy: (Math.random() - 0.5) * (0.5 + particleFieldFactor * 0.35),
          size: s,
          targetSize: s,
          alpha: Math.random() * 0.25 + (0.18 + particleFieldFactor * 0.18),
          isDust: false,
          isBurst: false,
          shattered: false,
          dustTimer: 0
        });
      }
    }

    let particleLoopActive = true;

    function checkParticleAnimationState() {
      const isHidden = document.visibilityState === 'hidden';
      const lowEffects = safeGetItem('orlando-low-effects', 'false') === 'true';
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const shouldRun = !isHidden && !lowEffects && !prefersReduced;

      if (shouldRun && !particleLoopActive) {
        particleLoopActive = true;
        requestAnimationFrame(renderParticles);
      } else if (!shouldRun && particleLoopActive) {
        particleLoopActive = false;
        if (ctx) ctx.clearRect(0, 0, width, height);
      }
    }
    window.checkParticleAnimationState = checkParticleAnimationState;

    document.addEventListener('visibilitychange', checkParticleAnimationState);
    if (window.matchMedia) {
      try {
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', checkParticleAnimationState);
      } catch(e) {}
    }

    function renderParticles() {
      if (!ctx || !particleLoopActive) return;
      ctx.clearRect(0, 0, width, height);

      // ── 1. Update & Render Smooth Shockwave Ring ──
      if (shockwave) {
        shockwave.radius += shockwave.speed;
        shockwave.alpha -= shockwave.decay;

        // Chain Reaction: as shockwave hits ambient particles, they explode into micro-dust!
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (!p.isBurst && !p.shattered) {
            const dx = p.x - shockwave.x;
            const dy = p.y - shockwave.y;
            const distSq = dx * dx + dy * dy;
            const swRad = shockwave.radius;

            // When the expanding shockwave front reaches this particle
            if (distSq <= (swRad + 24) * (swRad + 24)) {
              p.shattered = true;
              p.isDust = true;
              p.size = 0.45; // Turn into very very tiny micro-dust!
              p.dustTimer = 0;
              p.alpha = 0.9;
              // Micro-blast kick outward
              const kickAngle = Math.random() * Math.PI * 2;
              p.vx += Math.cos(kickAngle) * 2.8;
              p.vy += Math.sin(kickAngle) * 2.8;
            }
          }
        }

        // Draw clean shockwave ring without expensive shadow filters
        if (shockwave.alpha > 0 && shockwave.radius < shockwave.maxRadius) {
          ctx.beginPath();
          ctx.arc(shockwave.x, shockwave.y, shockwave.radius, 0, Math.PI * 2);
          ctx.strokeStyle = currentParticleColor;
          ctx.lineWidth = 1.8;
          ctx.globalAlpha = Math.max(0, shockwave.alpha);
          ctx.stroke();
        } else {
          shockwave = null;
        }
      }

      // ── 2. Update All Particles (Physics, Micro-Dust Merging & Boundaries) ──
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Central burst particles decay and fade away
        if (p.isBurst) {
          p.alpha -= p.decay;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.x += p.vx;
          p.y += p.vy;
          if (p.alpha <= 0) {
            particles.splice(i, 1);
            i--;
            continue;
          }
          continue;
        }

        // Micro-dust behavior: drifts tiny, then little by little merges into full particle form
        if (p.isDust) {
          p.dustTimer++;
          p.vx *= 0.94; // Smooth fluid brake
          p.vy *= 0.94;

          // After initial expansion (~30 frames), begin smooth gradual merging / regrowth
          if (p.dustTimer > 30) {
            p.size += 0.016; // Merging little by little
            if (p.size >= p.targetSize) {
              p.size = p.targetSize;
              p.isDust = false;
              p.shattered = false;
              p.alpha = Math.random() * 0.4 + 0.35;
            }
          }
        }

        if (particleSpeedFactor > 0) {
          // Mouse repulsion effect (works on both particles and dust)
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const mRadSq = mouse.radius * mouse.radius;

          if (distSq < mRadSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (mouse.radius - dist) / mouse.radius;
            p.vx += (dx / dist) * force * 1.2;
            p.vy += (dy / dist) * force * 1.2;
          }

          // Gentle fluid damping
          p.vx *= 0.985;
          p.vy *= 0.985;

          // Ambient gentle drift
          if (!p.isDust) {
            const speedSq = p.vx * p.vx + p.vy * p.vy;
            if (speedSq < 0.04) {
              p.vx += (Math.random() - 0.5) * 0.06;
              p.vy += (Math.random() - 0.5) * 0.06;
            } else if (speedSq > 9.0) {
              const spd = Math.sqrt(speedSq);
              p.vx = (p.vx / spd) * 3.0;
              p.vy = (p.vy / spd) * 3.0;
            }
          }

          p.x += p.vx * particleSpeedFactor;
          p.y += p.vy * particleSpeedFactor;

          // Strict Screen Boundary Retention (never leave screen!)
          const r = p.size;
          if (p.x <= r) {
            p.x = r;
            p.vx = Math.abs(p.vx);
          } else if (p.x >= width - r) {
            p.x = width - r;
            p.vx = -Math.abs(p.vx);
          }

          if (p.y <= r) {
            p.y = r;
            p.vy = Math.abs(p.vy);
          } else if (p.y >= height - r) {
            p.y = height - r;
            p.vy = -Math.abs(p.vy);
          }
        }
      }

      // ── 3. High-Performance Batched Rendering (Single GPU Draw Pass) ──
      ctx.fillStyle = currentParticleColor;

      // Group 1: Dust & burst particles (higher luminescence)
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.isDust || p.isBurst) {
          ctx.moveTo(p.x + p.size, p.y);
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
      }
      ctx.globalAlpha = 0.9;
      ctx.fill();

      // Group 2: Ambient particles (gentle luxury glow)
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.isDust && !p.isBurst) {
          ctx.moveTo(p.x + p.size, p.y);
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
      }
      ctx.globalAlpha = 0.40 + particleFieldFactor * 0.35;
      ctx.fill();

      ctx.globalAlpha = 1.0;
      if (particleLoopActive) requestAnimationFrame(renderParticles);
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    resizeCanvas();
    initParticles();
    requestAnimationFrame(renderParticles);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 12. ATMOSPHERE & PARTICLE FIELD LAB CONTROLLER (Ambient Glow & Floating Particles)
  // ══════════════════════════════════════════════════════════════════════════
  
  // ══════════════════════════════════════════════════════════════════════════
  // ── 10E. COMMAND HUB SYSTEM SETTINGS & QUICK-START ENGINE ──
  // ══════════════════════════════════════════════════════════════════════════
  function initCommandSettings() {
    const soundSelect = document.getElementById('alarmSoundSelect');
    const volSlider = document.getElementById('alarmVolumeSlider');
    const volBadge = document.getElementById('alarmVolumeBadge');
    const examToggle = document.getElementById('toggleExamMode');
    const lowEffectsToggle = document.getElementById('toggleLowEffects');
    const milestoneToggle = document.getElementById('toggleMilestoneToast');
    const browserNotifsToggle = document.getElementById('toggleBrowserNotifs');

    // 1. Alarm Sound Select
    if (soundSelect) {
      soundSelect.value = currentAlarmSound;
      soundSelect.addEventListener('change', (e) => {
        currentAlarmSound = e.target.value;
        safeSetItem('orlando-alarm-sound', currentAlarmSound);
        synthesizeAlertSound(currentAlarmSound, currentAlarmVolume);
      });
    }

    // 2. Alarm Volume Slider
    if (volSlider) {
      volSlider.value = Math.round(currentAlarmVolume * 100);
      if (volBadge) volBadge.textContent = `${volSlider.value}%`;

      volSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        currentAlarmVolume = val / 100;
        if (volBadge) volBadge.textContent = `${val}%`;
        safeSetItem('orlando-alarm-volume', val.toString());
        const audioEl = document.getElementById('alarmAudioElement');
        if (audioEl) audioEl.volume = currentAlarmVolume;
      });
      volSlider.addEventListener('change', () => {
        synthesizeAlertSound(currentAlarmSound, currentAlarmVolume);
      });
    }

    // 3. Classroom Exam Mode Toggle
    if (examToggle) {
      examToggle.checked = examModeEnabled;
      examToggle.addEventListener('change', (e) => {
        examModeEnabled = e.target.checked;
        safeSetItem('orlando-exam-mode', examModeEnabled ? 'true' : 'false');
        AudioHUD.tick(examModeEnabled ? 1100 : 550);
        if (examModeEnabled) {
          showQuantumTelemetryToast("📝 CLASSROOM EXAM MODE ACTIVE", "Alerts configured for 30m, 10m, and 5m checkpoints.");
        }
      });
    }

    // 4. Low Effects Mode Toggle
    if (lowEffectsToggle) {
      const savedLow = safeGetItem('orlando-low-effects', 'false') === 'true';
      lowEffectsToggle.checked = savedLow;
      lowEffectsToggle.addEventListener('change', (e) => {
        safeSetItem('orlando-low-effects', e.target.checked ? 'true' : 'false');
        if (window.checkParticleAnimationState) {
          window.checkParticleAnimationState();
        }
        AudioHUD.tick(600);
      });
    }

    // 5. Milestone Toast Notifications Toggle
    if (milestoneToggle) {
      const savedToast = safeGetItem('orlando-milestone-toast', 'true') === 'true';
      milestoneToggle.checked = savedToast;
      milestoneToggle.addEventListener('change', (e) => {
        safeSetItem('orlando-milestone-toast', e.target.checked ? 'true' : 'false');
        AudioHUD.tick(600);
      });
    }

    // 6. Browser Desktop Notifications Toggle
    if (browserNotifsToggle) {
      const savedNotifs = safeGetItem('orlando-browser-notifs', 'true') === 'true';
      browserNotifsToggle.checked = savedNotifs && ('Notification' in window && Notification.permission === 'granted');
      browserNotifsToggle.addEventListener('change', async (e) => {
        if (e.target.checked) {
          if ('Notification' in window) {
            const perm = await Notification.requestPermission();
            if (perm === 'granted') {
              safeSetItem('orlando-browser-notifs', 'true');
              sendBrowserNotification("Orlando Timer", "Desktop alerts enabled successfully!");
            } else {
              e.target.checked = false;
              safeSetItem('orlando-browser-notifs', 'false');
            }
          }
        } else {
          safeSetItem('orlando-browser-notifs', 'false');
        }
        AudioHUD.tick(700);
      });
    }
  }

  // ── URL QUERY PARAMETER QUICK-START (?t=25 or ?m=25) ──
  function checkUrlQueryParams() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const t = urlParams.get('t') || urlParams.get('m') || urlParams.get('min') || urlParams.get('minutes');
      if (t) {
        const mins = parseInt(t, 10);
        if (!isNaN(mins) && mins > 0 && mins <= 1440) {
          setTimerDuration(mins * 60);
        }
      }
      if (urlParams.get('autostart') === '1' || urlParams.get('start') === 'true') {
        setTimeout(startTimer, 600);
      }
    } catch(e) {}
  }

  initCommandSettings();
  checkUrlQueryParams();

  function initAtmosphereLab() {
    const btnAtmosphere = document.getElementById('btnAtmosphere');
    const atmospherePopup = document.getElementById('atmospherePopup');
    const atmoModalBackdrop = document.getElementById('atmoModalBackdrop');
    const btnCloseAtmosphere = document.getElementById('btnCloseAtmosphere');
    const atmoDot = document.getElementById('atmoDot');

    const sliderAmbientGlow = document.getElementById('sliderAmbientGlow');
    const glowValBadge = document.getElementById('glowValBadge');
    const glowChips = document.querySelectorAll('.atmo-preset-chip[data-glow]');

    const sliderParticles = document.getElementById('sliderParticles');
    const particlesValBadge = document.getElementById('particlesValBadge');
    const particleChips = document.querySelectorAll('.atmo-preset-chip[data-particles]');

    const sliderSpeed = document.getElementById('sliderSpeed');
    const speedValBadge = document.getElementById('speedValBadge');
    const speedChips = document.querySelectorAll('.atmo-preset-chip[data-speed]');

    // Toggle Atmosphere Popup
    function toggleAtmospherePopup(force) {
      if (!atmospherePopup) return;
      const isOpen = force !== undefined ? force : !atmospherePopup.classList.contains('open');
      if (isOpen) {
        atmospherePopup.classList.add('open');
        if (atmoModalBackdrop) atmoModalBackdrop.classList.add('open');
        btnAtmosphere?.classList.add('active');
        btnAtmosphere?.setAttribute('aria-expanded', 'true');
        if (typeof AudioHUD !== 'undefined' && AudioHUD.tick) AudioHUD.tick(980);
      } else {
        atmospherePopup.classList.remove('open');
        if (atmoModalBackdrop) atmoModalBackdrop.classList.remove('open');
        btnAtmosphere?.classList.remove('active');
        btnAtmosphere?.setAttribute('aria-expanded', 'false');
      }
    }

    window.toggleAtmosphereLab = toggleAtmospherePopup;

    if (btnAtmosphere) {
      btnAtmosphere.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAtmospherePopup();
      });
    }

    if (btnCloseAtmosphere) {
      btnCloseAtmosphere.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAtmospherePopup(false);
      });
    }

    if (atmoModalBackdrop) {
      atmoModalBackdrop.addEventListener('click', () => {
        toggleAtmospherePopup(false);
      });
    }

    // Dismiss when clicking outside
    document.addEventListener('click', (e) => {
      if (atmospherePopup && atmospherePopup.classList.contains('open')) {
        if (!atmospherePopup.contains(e.target) && !e.target.closest('#btnTimerSysAtmo')) {
          toggleAtmospherePopup(false);
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && atmospherePopup && atmospherePopup.classList.contains('open')) {
        toggleAtmospherePopup(false);
      }
    });

    // ── 1. AMBIENT GLOW CONTROLLER (0% Pure Black OLED -> 100% Vivid Radial Glow) ──
    let currentAmbientGlow = 100;
    try {
      const saved = localStorage.getItem('orlando-ambient-glow');
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
          currentAmbientGlow = parsed;
        }
      }
    } catch(e) {}

    function applyAmbientGlow(value, save = true) {
      currentAmbientGlow = Math.max(0, Math.min(100, Math.round(value)));
      const opacity = currentAmbientGlow / 100;
      
      // Update CSS custom property controlling .ambient-glow-backdrop opacity
      document.documentElement.style.setProperty('--ambient-glow-opacity', opacity.toString());
      document.body.style.setProperty('--ambient-glow-opacity', opacity.toString());

      if (sliderAmbientGlow) {
        sliderAmbientGlow.value = currentAmbientGlow;
      }

      if (glowValBadge) {
        if (currentAmbientGlow === 0) {
          glowValBadge.textContent = '0% OLED Black';
        } else if (currentAmbientGlow < 40) {
          glowValBadge.textContent = `${currentAmbientGlow}% Subtle`;
        } else if (currentAmbientGlow < 80) {
          glowValBadge.textContent = `${currentAmbientGlow}% Balanced`;
        } else {
          glowValBadge.textContent = `${currentAmbientGlow}% Vivid`;
        }
      }

      // Update active preset chips
      glowChips.forEach((chip) => {
        const chipVal = parseInt(chip.getAttribute('data-glow'), 10);
        if (chipVal === currentAmbientGlow) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });

      // Update atmosphere status dot luminescence
      if (atmoDot) {
        atmoDot.style.opacity = Math.max(0.3, opacity).toFixed(2);
      }

      if (save) {
        try {
          localStorage.setItem('orlando-ambient-glow', currentAmbientGlow.toString());
        } catch(e) {}
      }
    }

    if (sliderAmbientGlow) {
      sliderAmbientGlow.addEventListener('input', (e) => {
        applyAmbientGlow(parseFloat(e.target.value), true);
      });
    }

    glowChips.forEach((chip) => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = parseInt(chip.getAttribute('data-glow'), 10);
        applyAmbientGlow(val, true);
        if (typeof AudioHUD !== 'undefined' && AudioHUD.tick) AudioHUD.tick(840);
      });
    });

    // ── 2. FLOATING PARTICLES CONTROLLER (Minimum lean -> Maximum hyper-field) ──
    let currentParticleField = 0; // 0 = Minimum (current lean 28 dots)
    try {
      const savedP = localStorage.getItem('orlando-particle-field');
      if (savedP !== null) {
        const parsedP = parseInt(savedP, 10);
        if (!isNaN(parsedP) && parsedP >= 0 && parsedP <= 100) {
          currentParticleField = parsedP;
        }
      }
    } catch(e) {}

    function applyParticleField(value, save = true) {
      currentParticleField = Math.max(0, Math.min(100, Math.round(value)));
      const factor = currentParticleField / 100;

      if (sliderParticles) {
        sliderParticles.value = currentParticleField;
      }

      if (particlesValBadge) {
        if (currentParticleField === 0) {
          particlesValBadge.textContent = 'Min (Lean)';
        } else if (currentParticleField < 35) {
          particlesValBadge.textContent = `${currentParticleField}% Subtle`;
        } else if (currentParticleField < 70) {
          particlesValBadge.textContent = `${currentParticleField}% Stellar`;
        } else {
          particlesValBadge.textContent = `${currentParticleField}% Swarm`;
        }
      }

      // Update active preset chips
      particleChips.forEach((chip) => {
        const chipVal = parseInt(chip.getAttribute('data-particles'), 10);
        if (chipVal === currentParticleField) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });

      // Notify particle canvas engine
      if (window.updateParticleFieldSettings) {
        window.updateParticleFieldSettings(factor);
      }

      if (save) {
        try {
          localStorage.setItem('orlando-particle-field', currentParticleField.toString());
        } catch(e) {}
      }
    }

    if (sliderParticles) {
      sliderParticles.addEventListener('input', (e) => {
        applyParticleField(parseFloat(e.target.value), true);
      });
    }

    particleChips.forEach((chip) => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = parseInt(chip.getAttribute('data-particles'), 10);
        applyParticleField(val, true);
        if (typeof AudioHUD !== 'undefined' && AudioHUD.tick) AudioHUD.tick(1100);
      });
    });

    // ── 3. PARTICLE MOVEMENT (SPEED) CONTROLLER (0% Still -> 100% Hyper) ──
    let currentParticleSpeed = 50; // default 50% = 1.0x cosmic drift
    try {
      const savedS = localStorage.getItem('orlando-particle-speed');
      if (savedS !== null) {
        const parsedS = parseInt(savedS, 10);
        if (!isNaN(parsedS) && parsedS >= 0 && parsedS <= 100) {
          currentParticleSpeed = parsedS;
        }
      }
    } catch(e) {}

    function applyParticleSpeed(value, save = true) {
      currentParticleSpeed = Math.max(0, Math.min(100, Math.round(value)));
      // 0% -> 0.0x (Still), 50% -> 1.0x (Cosmic), 100% -> 2.0x (Hyper)
      const factor = currentParticleSpeed / 50.0;

      if (sliderSpeed) {
        sliderSpeed.value = currentParticleSpeed;
      }

      if (speedValBadge) {
        if (currentParticleSpeed === 0) {
          speedValBadge.textContent = '0% Still';
        } else if (currentParticleSpeed < 35) {
          speedValBadge.textContent = `${currentParticleSpeed}% Gentle`;
        } else if (currentParticleSpeed < 70) {
          speedValBadge.textContent = `${currentParticleSpeed}% Cosmic`;
        } else {
          speedValBadge.textContent = `${currentParticleSpeed}% Hyper`;
        }
      }

      // Update active preset chips
      speedChips.forEach((chip) => {
        const chipVal = parseInt(chip.getAttribute('data-speed'), 10);
        if (chipVal === currentParticleSpeed) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });

      // Notify particle canvas engine
      if (window.updateParticleSpeed) {
        window.updateParticleSpeed(factor);
      }

      if (save) {
        try {
          localStorage.setItem('orlando-particle-speed', currentParticleSpeed.toString());
        } catch(e) {}
      }
    }

    if (sliderSpeed) {
      sliderSpeed.addEventListener('input', (e) => {
        applyParticleSpeed(parseFloat(e.target.value), true);
      });
    }

    speedChips.forEach((chip) => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = parseInt(chip.getAttribute('data-speed'), 10);
        applyParticleSpeed(val, true);
        if (typeof AudioHUD !== 'undefined' && AudioHUD.tick) AudioHUD.tick(1100);
      });
    });

    // ── 4. ATMOSPHERE PANEL OPACITY (TRANSPARENCY) CONTROLLER ──
    const sliderPanelOpacity = document.getElementById('sliderPanelOpacity');
    const panelOpacityValBadge = document.getElementById('panelOpacityValBadge');
    const panelOpacityChips = document.querySelectorAll('.atmo-preset-chip[data-panel-opacity]');

    let currentPanelOpacity = 88; // Default 88% = Deep, crisp & readable
    try {
      const savedO = localStorage.getItem('orlando-atmo-panel-opacity');
      if (savedO !== null) {
        const parsedO = parseInt(savedO, 10);
        if (!isNaN(parsedO) && parsedO >= 35 && parsedO <= 100) {
          currentPanelOpacity = parsedO;
        }
      }
    } catch(e) {}

    function applyPanelOpacity(value, save = true) {
      currentPanelOpacity = Math.max(35, Math.min(100, Math.round(value)));
      const alpha = (currentPanelOpacity / 100).toFixed(2);

      if (sliderPanelOpacity) {
        sliderPanelOpacity.value = currentPanelOpacity;
      }

      if (panelOpacityValBadge) {
        if (currentPanelOpacity >= 98) {
          panelOpacityValBadge.textContent = '100% Solid';
        } else if (currentPanelOpacity >= 82) {
          panelOpacityValBadge.textContent = `${currentPanelOpacity}% Deep`;
        } else if (currentPanelOpacity >= 60) {
          panelOpacityValBadge.textContent = `${currentPanelOpacity}% Balanced`;
        } else {
          panelOpacityValBadge.textContent = `${currentPanelOpacity}% Glass`;
        }
      }

      // Update active preset chips
      panelOpacityChips.forEach((chip) => {
        const chipVal = parseInt(chip.getAttribute('data-panel-opacity'), 10);
        if (chipVal === currentPanelOpacity) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });

      // Apply dynamic opacity to atmosphere popup panel
      if (atmospherePopup) {
        const isPureBlack = document.body.getAttribute('data-app-theme') === 'pure-black';
        const rgb = isPureBlack ? '3, 4, 7' : '10, 14, 22';
        atmospherePopup.style.setProperty('background', `rgba(${rgb}, ${alpha})`, 'important');
      }

      if (save) {
        try {
          localStorage.setItem('orlando-atmo-panel-opacity', currentPanelOpacity.toString());
        } catch(e) {}
      }
    }

    if (sliderPanelOpacity) {
      sliderPanelOpacity.addEventListener('input', (e) => {
        applyPanelOpacity(parseFloat(e.target.value), true);
      });
    }

    panelOpacityChips.forEach((chip) => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = parseInt(chip.getAttribute('data-panel-opacity'), 10);
        applyPanelOpacity(val, true);
        if (typeof AudioHUD !== 'undefined' && AudioHUD.tick) AudioHUD.tick(1100);
      });
    });

    // Initialize defaults on load
    applyAmbientGlow(currentAmbientGlow, false);
    applyParticleField(currentParticleField, false);
    applyParticleSpeed(currentParticleSpeed, false);
    applyPanelOpacity(currentPanelOpacity, false);
  }


  // ════════════════════════════════════════════════════════════════════════════
  // ORLANDO TIMER v30.0 · 7-PILLAR GENIUS FLAGSHIP ARCHITECTURE
  // 1. Open Main Web App Desktop Launcher (PWA & Chromeless Standalone Window)
  // 2. Horology Spotlight Command Palette (Ctrl + K / ⌘K & /)
  // 3. Zero-Latency Speculative Pre-Fetching Engine (Hover 65ms + Touch + Idle)
  // 4. Executive Standalone Sub-App Dock (5-App Ecosystem Switcher)
  // 5. Deduplicated System Menu & 100% Machine-Vision Holographic QR
  // 6. Optimistic UI with Self-Healing Mutation Journal & Web Audio Haptics
  // 7. Google Cloud Firebase Firestore Singapore Real-Time Sync Engine
  // ════════════════════════════════════════════════════════════════════════════
  (function initOrlandoTimerPwaSuite() {
    let deferredInstallPrompt = null;
    const APP_URL = 'https://orlandopasion000.github.io/orlandotimer/';

    function notifyUserToast(title, msg) {
      if (typeof showQuantumTelemetryToast === 'function') {
        showQuantumTelemetryToast(title, msg);
      }
      if (typeof announceSR === 'function') {
        announceSR(title + ': ' + msg);
      }
    }
    window.showTelemetryToast = notifyUserToast;

    // -------------------------------------------------------------------------
    // PILLAR 1 & 4: OPEN MAIN WEB APP LAUNCHER & STANDALONE SUB-APP DOCK
    // -------------------------------------------------------------------------
    window.launchSubApp = function(folder, winName, w, h) {
      if (typeof AudioHUD !== 'undefined' && AudioHUD.hapticPulse) {
        AudioHUD.hapticPulse(1040, true);
      }
      const isGithub = window.location.hostname.includes('github.io');
      const origin = isGithub ? window.location.origin : 'https://orlandopasion000.github.io';
      const targetUrl = (folder ? (origin + '/' + folder + '/') : (origin + '/')) + '?standalone=true';
      const features = 'popup=yes,menubar=no,toolbar=no,location=no,status=no,personalbar=no,scrollbars=yes,resizable=yes,width=' + (w || 1280) + ',height=' + (h || 860) + ',left=90,top=50';
      const appWin = window.open(targetUrl, winName || 'OVPJStandaloneSubApp', features);
      if (appWin) {
        try { appWin.focus(); } catch (e) {}
      } else {
        window.location.href = targetUrl;
      }
    };

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      updateLaunchButtonState();
    });

    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      updateLaunchButtonState();
    });

    function isStandaloneMode() {
      return (
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        (window.matchMedia && window.matchMedia('(display-mode: window-controls-overlay)').matches) ||
        window.navigator.standalone === true ||
        window.name === 'OrlandoTimerStandaloneWindow' ||
        (window.location.search && window.location.search.includes('standalone=true'))
      );
    }

    function updateLaunchButtonState() {
      const topBtn = document.getElementById('btnTopbarLaunchApp');
      const topLbl = document.getElementById('topbarLaunchLabel');
      const dock = document.getElementById('standaloneSubAppDock');
      const active = isStandaloneMode();

      if (topBtn && topLbl) {
        if (active) {
          topBtn.classList.add('btn-app-active');
          topBtn.title = 'Orlando Timer (Main Web App) is Active · Click to toggle Sub-App Dock';
          topLbl.textContent = '✔ Standalone Active';
        } else {
          topBtn.classList.remove('btn-app-active');
          topBtn.title = 'Open Orlando Timer in Dedicated Standalone Desktop Window';
          topLbl.textContent = 'Open Main Web App';
        }
      }
      if (dock && active) {
        dock.classList.add('active');
      }
    }

    async function handleLaunchStandaloneApp() {
      if (typeof AudioHUD !== 'undefined' && AudioHUD.chimeHarmonic) {
        AudioHUD.chimeHarmonic(true);
      }
      if (isStandaloneMode()) {
        const dock = document.getElementById('standaloneSubAppDock');
        if (dock) {
          const nowActive = dock.classList.toggle('active');
          notifyUserToast('STANDALONE APP ACTIVE', nowActive ? '✨ Executive Sub-App Dock revealed!' : '✨ Orlando Timer is running in Standalone Mode!');
        } else {
          notifyUserToast('STANDALONE APP ACTIVE', '✨ Orlando Timer is already running as Main Web App!');
        }
        return;
      }

      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        try {
          const choice = await deferredInstallPrompt.userChoice;
          if (choice && choice.outcome === 'accepted') {
            deferredInstallPrompt = null;
            updateLaunchButtonState();
            return;
          }
        } catch (err) {}
      }

      const base = (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? (window.location.origin + window.location.pathname)
        : APP_URL;
      const targetUrl = base + (base.includes('?') ? '&' : '?') + 'standalone=true';
      const features = 'popup=yes,menubar=no,toolbar=no,location=no,status=no,personalbar=no,scrollbars=yes,resizable=yes,width=1280,height=860,left=100,top=60';
      const appWin = window.open(targetUrl, 'OrlandoTimerStandaloneWindow', features);
      if (appWin) {
        try { appWin.focus(); } catch (e) {}
      } else {
        window.location.href = targetUrl;
      }
    }

    window.launchOrlandoTimerMainApp = handleLaunchStandaloneApp;

    const launchBtn = document.getElementById('btnTopbarLaunchApp');
    if (launchBtn) {
      launchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLaunchStandaloneApp();
      });
    }
    updateLaunchButtonState();

    // -------------------------------------------------------------------------
    // PILLAR 3: ZERO-LATENCY SPECULATIVE PRE-FETCHING ENGINE
    // Desktop Hover Intent (65ms) + Mobile Touch Speculation + Idle Warmup
    // -------------------------------------------------------------------------
    const prefetchedUrls = new Set();
    function prefetchUrl(url) {
      if (!url || prefetchedUrls.has(url) || url.startsWith('#') || url.startsWith('javascript:')) return;
      prefetchedUrls.add(url);
      try {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
      } catch (e) {}
    }

    let hoverTimer = null;
    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest('a, button[data-href], .dock-pill-btn[data-href]');
      const href = el ? (el.href || el.getAttribute('data-href')) : null;
      if (href && (href.startsWith('/') || href.includes('orlandopasion000.github.io') || href.includes(window.location.origin))) {
        hoverTimer = setTimeout(() => prefetchUrl(href), 65);
      }
    });
    document.addEventListener('mouseout', () => {
      if (hoverTimer) clearTimeout(hoverTimer);
    });

    // Mobile Touch Speculation (Prefetches immediately on finger touch)
    document.addEventListener('touchstart', (e) => {
      const el = e.target.closest('a, button[data-href], .dock-pill-btn[data-href]');
      const href = el ? (el.href || el.getAttribute('data-href')) : null;
      if (href && (href.startsWith('/') || href.includes('orlandopasion000.github.io') || href.includes(window.location.origin))) {
        prefetchUrl(href);
      }
    }, { passive: true });

    // Background Idle Warmup for Sibling Flagship Apps
    function warmupFlagshipFleet() {
      const origin = window.location.hostname.includes('github.io') ? window.location.origin : 'https://orlandopasion000.github.io';
      const fleet = [
        origin + '/',
        origin + '/orlandorecharge/?standalone=true',
        origin + '/orlandochrome/?standalone=true',
        origin + '/orlandovault/?standalone=true'
      ];
      fleet.forEach((u, idx) => {
        setTimeout(() => prefetchUrl(u), 900 + idx * 350);
      });
    }
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(warmupFlagshipFleet);
    } else {
      setTimeout(warmupFlagshipFleet, 1800);
    }

    // -------------------------------------------------------------------------
    // PILLAR 5: DEDUPLICATED SYSTEM DROPDOWN MENU & MACHINE-VISION QR
    // -------------------------------------------------------------------------
    const btnTimerSystemMenu = document.getElementById('btnTimerSystemMenu');
    const timerSystemDropdown = document.getElementById('timerSystemDropdown');

    function toggleTimerSystemMenu(e) {
      if (e) e.stopPropagation();
      if (!timerSystemDropdown) return;
      const isOpen = timerSystemDropdown.style.display === 'block';
      timerSystemDropdown.style.display = isOpen ? 'none' : 'block';
      if (btnTimerSystemMenu) btnTimerSystemMenu.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen && typeof AudioHUD !== 'undefined' && AudioHUD.hapticPulse) {
        AudioHUD.hapticPulse(940);
      }
    }

    function closeTimerSystemMenu() {
      if (timerSystemDropdown) timerSystemDropdown.style.display = 'none';
      if (btnTimerSystemMenu) btnTimerSystemMenu.setAttribute('aria-expanded', 'false');
    }

    if (btnTimerSystemMenu) {
      btnTimerSystemMenu.addEventListener('click', toggleTimerSystemMenu);
    }
    document.addEventListener('click', (e) => {
      if (timerSystemDropdown && !e.target.closest('#timerSystemMenuWrapper')) {
        closeTimerSystemMenu();
      }
    });

    // Wire System Menu Item 1: Quantum Time Command (Cockpit) -> #funMicroCockpit
    const btnTimerSysCockpit = document.getElementById('btnTimerSysCockpit');
    if (btnTimerSysCockpit) {
      btnTimerSysCockpit.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTimerSystemMenu();
        if (typeof toggleFunCockpit === 'function') {
          toggleFunCockpit(true);
        }
      });
    }

    // Wire System Menu Item 2: Atmosphere & Particle Lab -> #atmospherePopup
    const btnTimerSysAtmo = document.getElementById('btnTimerSysAtmo');
    if (btnTimerSysAtmo) {
      btnTimerSysAtmo.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTimerSystemMenu();
        if (typeof window.toggleAtmosphereLab === 'function') {
          window.toggleAtmosphereLab(true);
        }
      });
    }

    // Wire System Menu Item 7: Timer Backup & Restore Modal -> #timerBackupModal
    const btnTimerSysBackup = document.getElementById('btnTimerSysBackup');
    const timerBackupModal = document.getElementById('timerBackupModal');
    const btnCloseTimerBackupModal = document.getElementById('btnCloseTimerBackupModal');
    const modalTimerExportBtn = document.getElementById('modalTimerExportBtn');
    const modalTimerImportBtn = document.getElementById('modalTimerImportBtn');
    const modalTimerImportFile = document.getElementById('modalTimerImportFile');

    function openTimerBackupModal() {
      closeTimerSystemMenu();
      if (timerBackupModal) timerBackupModal.style.display = 'flex';
      if (typeof AudioHUD !== 'undefined' && AudioHUD.hapticPulse) AudioHUD.hapticPulse(980);
    }
    function closeTimerBackupModal() {
      if (timerBackupModal) timerBackupModal.style.display = 'none';
    }

    if (btnTimerSysBackup) btnTimerSysBackup.addEventListener('click', openTimerBackupModal);
    if (btnCloseTimerBackupModal) btnCloseTimerBackupModal.addEventListener('click', closeTimerBackupModal);
    if (timerBackupModal) {
      timerBackupModal.addEventListener('click', (e) => {
        if (e.target === timerBackupModal) closeTimerBackupModal();
      });
    }

    if (modalTimerExportBtn) {
      modalTimerExportBtn.addEventListener('click', () => {
        const dump = {};
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('orlando-') || k.startsWith('ot_'))) {
            dump[k] = localStorage.getItem(k);
          }
        }
        const stateObj = {
          app: 'OrlandoTimer',
          timestamp: new Date().toISOString(),
          version: '30.0.0',
          localStorageDump: dump
        };
        const blob = new Blob([JSON.stringify(stateObj, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'OrlandoTimer-Backup-' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        closeTimerBackupModal();
        notifyUserToast('BACKUP EXPORTED', '💾 Horology state JSON exported successfully!');
      });
    }

    if (modalTimerImportBtn && modalTimerImportFile) {
      modalTimerImportBtn.addEventListener('click', () => modalTimerImportFile.click());
      modalTimerImportFile.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (re) => {
          try {
            const data = JSON.parse(re.target.result);
            const targetMap = data.localStorageDump || data;
            if (targetMap && typeof targetMap === 'object') {
              Object.keys(targetMap).forEach(k => {
                if (typeof targetMap[k] === 'string') {
                  localStorage.setItem(k, targetMap[k]);
                }
              });
            }
            closeTimerBackupModal();
            notifyUserToast('STATE RESTORED', '✨ Horology state restored! Reloading...');
            setTimeout(() => window.location.reload(), 600);
          } catch (err) {
            alert('Invalid backup file: ' + err.message);
          }
        };
        reader.readAsText(file);
      });
    }

    // Wire System Menu Item 6: Holographic QR Modal (100% Machine-Vision Ready)
    const qrModal = document.getElementById('otQrModal');
    const qrMount = document.getElementById('otQrMount');
    function openQrModal() {
      closeTimerSystemMenu();
      if (!qrModal) return;
      qrModal.classList.add('open');
      if (typeof AudioHUD !== 'undefined' && AudioHUD.hapticPulse) AudioHUD.hapticPulse(1020);
      if (qrMount && typeof window.qrcode === 'function') {
        try {
          const qr = window.qrcode(0, 'M');
          qr.addData(APP_URL);
          qr.make();
          const count = qr.getModuleCount();
          const margin = 2;
          const total = count + margin * 2;
          let d = '';
          for (let r = 0; r < count; r++) {
            for (let c = 0; c < count; c++) {
              if (qr.isDark(r, c)) d += `M${c + margin},${r + margin}h1v1h-1z `;
            }
          }
          qrMount.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;background:#ffffff;"><rect width="100%" height="100%" fill="#ffffff"/><path fill="#000000" d="${d}"/></svg>`;
        } catch (e) {}
      }
    }
    function closeQrModal() {
      if (qrModal) qrModal.classList.remove('open');
    }
    window.openOrlandoTimerQrModal = openQrModal;

    const openQrBtn = document.getElementById('otOpenQrBtn');
    const closeQr1 = document.getElementById('otCloseQrModal');
    const closeQr2 = document.getElementById('otQrCloseBtn2');
    const copyQrBtn = document.getElementById('otQrCopyBtn');

    if (openQrBtn) openQrBtn.addEventListener('click', openQrModal);
    if (closeQr1) closeQr1.addEventListener('click', closeQrModal);
    if (closeQr2) closeQr2.addEventListener('click', closeQrModal);
    if (qrModal) qrModal.addEventListener('click', (e) => { if (e.target === qrModal) closeQrModal(); });

    function copyTimerLink() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(APP_URL).catch(() => {});
      }
      if (typeof AudioHUD !== 'undefined' && AudioHUD.chimeHarmonic) AudioHUD.chimeHarmonic(true);
      notifyUserToast('LINK COPIED', '📋 Orlando Timer link copied to clipboard!');
    }
    if (copyQrBtn) copyQrBtn.addEventListener('click', copyTimerLink);

    // -------------------------------------------------------------------------
    // PILLAR 2: GENIUS HOROLOGY SPOTLIGHT COMMAND PALETTE (CTRL + K / ⌘K & /)
    // -------------------------------------------------------------------------
    const spotlightModal = document.getElementById('timerSpotlightModal');
    const spotlightInput = document.getElementById('timerSpotlightInput');
    const spotlightResults = document.getElementById('timerSpotlightResults');
    const btnTopbarSearch = document.getElementById('btnTopbarSearch');
    const btnCloseSpotlight = document.getElementById('btnCloseTimerSpotlight');

    let spotlightIndex = 0;
    let spotlightMatches = [];

    function escHtml(str) {
      return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[c]));
    }

    function setAndStartMinutes(mins) {
      if (typeof switchAppTab === 'function') {
        switchAppTab('timer');
      } else {
        const tabTimer = document.getElementById('tab-timer');
        if (tabTimer) tabTimer.click();
      }
      // 1. Force stop any active countdown interval so timerEndTime and timerRemaining can be cleanly replaced
      if (typeof pauseTimer === 'function') pauseTimer();

      // 2. Compute exact seconds and set the new countdown duration (updates timerTotalDuration, timerRemaining, inputs, big digits & progress bar)
      const totalSecs = Math.max(1, Math.round(mins * 60));
      if (typeof setTimerDuration === 'function') {
        setTimerDuration(totalSecs);
      }

      // 3. Immediately start the new countdown from the updated duration
      if (typeof startTimer === 'function') {
        startTimer();
      }

      if (typeof AudioHUD !== 'undefined' && AudioHUD.chimeHarmonic) {
        AudioHUD.chimeHarmonic(true);
      }
      const timeStr = typeof formatTimeHHMMSS === 'function' ? formatTimeHHMMSS(totalSecs) : `${Math.round(mins)}m`;
      notifyUserToast('INSTANT SPRINT ACTIVE', `⏱️ Countdown set to ${timeStr} and running now!`);
    }

    const BASE_SPOTLIGHT_COMMANDS = [
      // Instant Timer Sprints (Top Priority — Works whether timer is running, paused, or stopped)
      { id: 'timer-5', cat: 'Instant Timer Sprints', icon: '⏳', title: 'Start 5-Minute Quick Sprint', desc: 'Immediately switch countdown to 05:00 and start running', badge: '↵ Start', badgeAction: true, action: () => setAndStartMinutes(5) },
      { id: 'timer-10', cat: 'Instant Timer Sprints', icon: '⏳', title: 'Start 10-Minute Focus Sprint', desc: 'Immediately switch countdown to 10:00 and start running', badge: '↵ Start', badgeAction: true, action: () => setAndStartMinutes(10) },
      { id: 'timer-15', cat: 'Instant Timer Sprints', icon: '⏳', title: 'Start 15-Minute Focus Block', desc: 'Immediately switch countdown to 15:00 and start running', badge: '↵ Start', badgeAction: true, action: () => setAndStartMinutes(15) },
      { id: 'timer-25', cat: 'Instant Timer Sprints', icon: '⏳', title: 'Start 25-Minute Pomodoro Sprint', desc: 'Immediately switch countdown to 25:00 and start running', badge: '↵ Start', badgeAction: true, action: () => setAndStartMinutes(25) },
      { id: 'timer-45', cat: 'Instant Timer Sprints', icon: '⏳', title: 'Start 45-Minute Deep Session', desc: 'Immediately switch countdown to 45:00 and start running', badge: '↵ Start', badgeAction: true, action: () => setAndStartMinutes(45) },
      { id: 'timer-60', cat: 'Instant Timer Sprints', icon: '⏳', title: 'Start 60-Minute Deep Work Block', desc: 'Immediately switch countdown to 01:00:00 and start running', badge: '↵ Start', badgeAction: true, action: () => setAndStartMinutes(60) },
      { id: 'timer-90', cat: 'Instant Timer Sprints', icon: '⏳', title: 'Start 90-Minute Ultradian Block', desc: 'Immediately switch countdown to 01:30:00 and start running', badge: '↵ Start', badgeAction: true, action: () => setAndStartMinutes(90) },

      // Productivity Protocols (5)
      { id: 'proto-focus', cat: 'Productivity Protocols', icon: '🎯', title: 'Focus Protocol (Pomodoro 25m / 5m)', desc: 'Classic 25m Focus & 5m Break rhythm with auto-advance', badge: 'Protocol', action: () => { applyProductivityMode('focus-protocol', true); } },
      { id: 'proto-zen', cat: 'Productivity Protocols', icon: '🧘', title: 'Zen Immersion Mode (Pure Void)', desc: 'Distraction-free void with colossal floating horology digits', badge: 'Void', action: () => { applyProductivityMode('zen-immersion', true); } },
      { id: 'proto-deep', cat: 'Productivity Protocols', icon: '⚡', title: 'Deep Work (90m Ultradian Cycle)', desc: '90-minute human ultradian cycle (Warm-Up · Peak Flow · Review)', badge: '90m Ultra', action: () => { applyProductivityMode('deep-work', true); } },
      { id: 'proto-flow', cat: 'Productivity Protocols', icon: '🌊', title: 'Quantum Flow (Count-Up Flow State)', desc: 'Serene HH:MM:SS count-up with unbroken Flow Milestones', badge: 'Flow State', action: () => { applyProductivityMode('quantum-flow', true); } },
      { id: 'proto-chrono', cat: 'Productivity Protocols', icon: '⏱️', title: 'Precision Chrono (100fps Split Laps)', desc: 'Swiss chronometer with millisecond precision & lap telemetry', badge: 'Chrono', action: () => { applyProductivityMode('precision-chrono', true); } },

      // Horology System & Audio Commands (Every Item 100% Functional)
      { id: 'sys-vault-theme', cat: 'Horology System & Audio', icon: '🎨', title: 'Open Holographic Theme Vault', desc: 'Browse all 30 luxury themes with live holo-scrubbing (Hotkey: T)', badge: '30 Themes', action: () => { if (typeof openHoloVault === 'function') openHoloVault('theme'); } },
      { id: 'sys-vault-clock', cat: 'Horology System & Audio', icon: '🔢', title: 'Open Digit Style Vault', desc: 'Customize numeral material finish & specular reflections (Hotkey: D)', badge: 'Digits', action: () => { if (typeof openHoloVault === 'function') openHoloVault('clock'); } },
      { id: 'sys-shuffle', cat: 'Horology System & Audio', icon: '🎲', title: 'Quantum Shuffle (Theme + Digit Style)', desc: 'Harmonize a random luxury App Theme & Digit Style pair', badge: 'Shuffle', action: () => {
        const randomApp = THEMES[Math.floor(Math.random() * THEMES.length)];
        const randomClock = THEMES[Math.floor(Math.random() * THEMES.length)];
        applyAppTheme(randomApp);
        applyClockStyle(randomClock);
        if (typeof AudioHUD !== 'undefined' && AudioHUD.chimeHarmonic) AudioHUD.chimeHarmonic(true);
        notifyUserToast('QUANTUM SHUFFLE', `🎲 ${THEME_NAMES[randomApp] || randomApp} (App) + ${THEME_NAMES[randomClock] || randomClock} (Digits)`);
      } },
      { id: 'sys-cockpit', cat: 'Horology System & Audio', icon: '🚀', title: 'Quantum Time Command Cockpit', desc: 'Earth Solar Horizon, Supernova Telemetry & Weekly Focus Chart', badge: 'Cockpit', action: () => { if (typeof toggleFunCockpit === 'function') toggleFunCockpit(true); } },
      { id: 'sys-atmo', cat: 'Horology System & Audio', icon: '✦', title: 'Atmosphere & Particle Lab', desc: 'Adjust Ambient Glow (0%-100%), Floating Particles & Cosmic Speed', badge: 'Lab', action: () => { if (typeof window.toggleAtmosphereLab === 'function') window.toggleAtmosphereLab(true); } },
      { id: 'sys-supernova', cat: 'Horology System & Audio', icon: '💥', title: 'Detonate Celestial Supernova Shockwave', desc: 'Trigger a physics particle burst & sub-bass harmonic chime', badge: 'Burst', action: () => {
        if (window.spawnSupernovaBurst) {
          window.spawnSupernovaBurst(window.innerWidth / 2, window.innerHeight / 2, { tier: 2, showToast: true });
        }
      } },
      { id: 'sys-breath', cat: 'Horology System & Audio', icon: '🌬️', title: 'Quantum Resonance Breathing (4-4-4-4)', desc: 'Guided 4-second inhale, hold, exhale & reset calibration modal', badge: 'Calibrate', action: () => { if (typeof startBreathingSession === 'function') startBreathingSession(); } },
      { id: 'sys-tick', cat: 'Horology System & Audio', icon: '🔊', title: 'Toggle Mechanical Watch Tick Audio', desc: 'Enable or mute 1-second Swiss escapement tick & UI click audio', badge: 'Audio', action: () => { const b = document.getElementById('btnAcousticTick'); if (b) b.click(); } },
      { id: 'sys-awake', cat: 'Horology System & Audio', icon: '👁️', title: 'Toggle Keep Screen Awake (Wake Lock)', desc: 'Prevent display from dimming or sleeping during active sessions', badge: 'WakeLock', action: () => { const b = document.getElementById('btnWakeLock'); if (b) b.click(); } },
      { id: 'sys-qr', cat: 'Horology System & Audio', icon: '📱', title: 'Holographic Phone QR Scanner', desc: 'Scan with iPhone or Android camera for instant cloud sync', badge: 'QR Sync', action: openQrModal },
      { id: 'sys-sync', cat: 'Horology System & Audio', icon: '☁️', title: 'Sync Google Cloud Firebase Now', desc: 'Reconcile Self-Healing Mutation Journal with Singapore Firestore', badge: '0ms SWR', action: () => { if (window.OrlandoTimerFirebase) window.OrlandoTimerFirebase.pullNow(); } },
      { id: 'sys-backup', cat: 'Horology System & Audio', icon: '💾', title: 'Backup & Restore Horology State (.json)', desc: 'Export or import your presets, alarms, themes & focus history', badge: 'JSON', action: openTimerBackupModal },
      { id: 'sys-dock', cat: 'Horology System & Audio', icon: '🧭', title: 'Toggle Executive Sub-App Dock', desc: 'Show or hide the floating bottom 5-App Ecosystem Dock', badge: 'Dock', action: () => {
        const d = document.getElementById('standaloneSubAppDock');
        if (d) {
          const isAct = d.classList.toggle('active');
          notifyUserToast(isAct ? 'SUB-APP DOCK SHOWN' : 'SUB-APP DOCK HIDDEN', isAct ? '🧭 Bottom 5-App Ecosystem Dock is now visible.' : '🧭 Bottom Sub-App Dock concealed.');
        }
      } },
      { id: 'sys-fullscreen', cat: 'Horology System & Audio', icon: '⛶', title: 'Toggle Full Screen Display', desc: 'Enter or exit distraction-free full-screen horology mode (Hotkey: F)', badge: 'Fullscreen', action: () => { const b = document.getElementById('btnFullscreen'); if (b) b.click(); } },
      { id: 'sys-standalone', cat: 'Horology System & Audio', icon: '🪟', title: 'Open Main Web App (Standalone Window)', desc: 'Launch Orlando Timer in a dedicated chromeless desktop window', badge: 'PWA', action: handleLaunchStandaloneApp },

      // Flagship Ecosystem Sub-Apps
      { id: 'app-recharge', cat: 'Flagship Web Apps', icon: '⚡', title: 'Switch to OrlandoRecharge (Main Version)', desc: '23-block DepEd daily alarm cockpit & Tier 3 Quantum Realm', badge: 'Flagship', action: () => window.launchSubApp('orlandorecharge', 'OrlandoRechargeMainAppWindow', 1280, 850) },
      { id: 'app-chrome', cat: 'Flagship Web Apps', icon: '🌐', title: 'Switch to OrlandoChrome (Main Version)', desc: '22-profile Chrome taskbar command center & Wispr Flow dictation', badge: 'Flagship', action: () => window.launchSubApp('orlandochrome', 'OrlandoChromeStandaloneWindow', 1180, 820) },
      { id: 'app-vault', cat: 'Flagship Web Apps', icon: '🔐', title: 'Switch to OrlandoVault (Jarvis Security)', desc: '138+ AES-guarded accounts, Google Sheets sync & QR studio', badge: 'Flagship', action: () => window.launchSubApp('orlandovault', 'OrlandoVaultMainAppWindow', 1240, 820) },
      { id: 'app-portfolio', cat: 'Flagship Web Apps', icon: '🏛️', title: 'Return to Master Portfolio & Digital Library', desc: 'Sir Orlando V. Pasion, Jr. Official Portfolio & Mock Test Reviewers', badge: 'Root Hub', action: () => { window.location.href = 'https://orlandopasion000.github.io/'; } }
    ];

    function parseDurationQuery(q) {
      if (!q) return null;
      const mMatch = q.match(/^(\d+(?:\.\d+)?)\s*(m|min|mins|minute|minutes)?$/i);
      if (mMatch) {
        const val = parseFloat(mMatch[1]);
        if (val > 0 && val <= 999) return val;
      }
      const sMatch = q.match(/^(\d+)\s*(s|sec|secs|second|seconds)$/i);
      if (sMatch) {
        const secs = parseInt(sMatch[1], 10);
        if (secs > 0 && secs <= 5999) return secs / 60;
      }
      return null;
    }

    function renderSpotlightResults(query) {
      if (!spotlightResults) return;
      const q = (query || '').toLowerCase().trim();
      spotlightMatches = [];

      // 1. Dynamic Smart Duration Parser (e.g. "20", "15m", "45 min", "30s")
      const parsedMins = parseDurationQuery(q);
      if (parsedMins !== null) {
        const label = parsedMins >= 1 ? `${Math.round(parsedMins)}-Minute` : `${Math.round(parsedMins * 60)}-Second`;
        spotlightMatches.push({
          cat: 'Instant Custom Timer',
          icon: '⚡',
          title: `Start ${label} Countdown Timer Now`,
          desc: `Immediately configure and start a ${label.toLowerCase()} timer sprint`,
          badge: '↵ Start Now',
          badgeAction: true,
          action: () => setAndStartMinutes(parsedMins)
        });
      }

      // 2. Match Base Commands (and inject any user-saved custom presets right inside Instant Timer Sprints)
      BASE_SPOTLIGHT_COMMANDS.forEach(cmd => {
        if (!q || cmd.title.toLowerCase().includes(q) || cmd.desc.toLowerCase().includes(q) || cmd.cat.toLowerCase().includes(q)) {
          spotlightMatches.push(cmd);
        }
        if (cmd.id === 'timer-90' && typeof loadCustomPresets === 'function') {
          const customPresets = loadCustomPresets();
          customPresets.forEach(cMin => {
            if ([5, 10, 15, 25, 45, 60, 90].includes(cMin)) return;
            const titleStr = `Start ${cMin}-Minute Custom Sprint`;
            const descStr = `Immediately switch countdown to ${cMin}:00 and start running`;
            if (!q || titleStr.toLowerCase().includes(q) || descStr.toLowerCase().includes(q) || 'instant timer sprints'.includes(q)) {
              spotlightMatches.push({
                cat: 'Instant Timer Sprints',
                icon: '⏳',
                title: titleStr,
                desc: descStr,
                badge: '↵ Start',
                badgeAction: true,
                action: () => setAndStartMinutes(cMin)
              });
            }
          });
        }
      });

      // 3. Match All 30 Luxury Themes & Digit Styles
      if (Array.isArray(THEMES) && typeof THEME_DATA === 'object') {
        THEMES.forEach(themeKey => {
          const td = THEME_DATA[themeKey];
          if (!td) return;
          const matchTheme = !q
            ? true
            : (td.name.toLowerCase().includes(q) || td.desc.toLowerCase().includes(q) || td.category.toLowerCase().includes(q) || themeKey.includes(q));
          if (matchTheme) {
            spotlightMatches.push({
              cat: '30 Luxury Themes & Digit Styles',
              icon: '✦',
              title: `Theme: ${td.name}`,
              desc: td.desc,
              badge: '↵ Apply Theme & Digits',
              badgeAction: true,
              action: () => {
                applyAppTheme(themeKey);
                applyClockStyle(themeKey);
                if (typeof AudioHUD !== 'undefined' && AudioHUD.chimeHarmonic) AudioHUD.chimeHarmonic(true);
                notifyUserToast('THEME LOCKED IN', `✦ Applied ${td.name} across App & Digits!`);
              }
            });
          }
        });
      }

      if (spotlightMatches.length === 0) {
        spotlightResults.innerHTML = `<div style="padding:28px;text-align:center;color:#94a3b8;font-size:13px;">No commands or themes matching "<strong>${escHtml(query)}</strong>". Try typing <code>25m</code>, <code>gold</code>, <code>zen</code>, <code>qr</code>, or <code>recharge</code>.</div>`;
        return;
      }

      spotlightIndex = 0;
      let html = '';
      let currentCat = '';
      spotlightMatches.forEach((item, idx) => {
        if (item.cat !== currentCat) {
          currentCat = item.cat;
          html += `<div class="spotlight-group-title">${escHtml(currentCat)}</div>`;
        }
        const isSel = idx === spotlightIndex;
        html += `<button type="button" class="spotlight-item${isSel ? ' selected' : ''}" data-index="${idx}" role="option" aria-selected="${isSel}">`;
        html += `  <div class="spotlight-item-icon">${item.icon}</div>`;
        html += `  <div class="spotlight-item-info">`;
        html += `    <div class="spotlight-item-title">${escHtml(item.title)}</div>`;
        html += `    <div class="spotlight-item-desc">${escHtml(item.desc)}</div>`;
        html += `  </div>`;
        html += `  <span class="spotlight-item-badge${item.badgeAction ? ' badge-action' : ''}">${escHtml(item.badge || 'Run')}</span>`;
        html += `</button>`;
      });

      spotlightResults.innerHTML = html;
      spotlightResults.querySelectorAll('.spotlight-item').forEach(el => {
        el.addEventListener('click', function() {
          const idx = parseInt(this.getAttribute('data-index'), 10);
          executeSpotlightIndex(idx);
        });
      });
    }

    function updateSpotlightSelection(newIdx) {
      if (!spotlightResults) return;
      const items = spotlightResults.querySelectorAll('.spotlight-item');
      if (items.length === 0) return;
      spotlightIndex = Math.max(0, Math.min(newIdx, items.length - 1));
      items.forEach((el, idx) => {
        const active = idx === spotlightIndex;
        el.classList.toggle('selected', active);
        el.setAttribute('aria-selected', String(active));
        if (active) el.scrollIntoView({ block: 'nearest' });
      });
    }

    function openSpotlight() {
      closeTimerSystemMenu();
      if (!spotlightModal) return;
      spotlightModal.classList.add('open');
      if (spotlightInput) {
        spotlightInput.value = '';
        setTimeout(() => spotlightInput.focus(), 20);
      }
      renderSpotlightResults('');
      if (typeof AudioHUD !== 'undefined' && AudioHUD.hapticPulse) AudioHUD.hapticPulse(1080);
    }

    function closeSpotlight() {
      if (spotlightModal) spotlightModal.classList.remove('open');
    }

    function executeSpotlightIndex(idx) {
      const match = spotlightMatches[idx];
      if (match && typeof match.action === 'function') {
        closeSpotlight();
        match.action();
      }
    }

    if (btnTopbarSearch) {
      btnTopbarSearch.addEventListener('click', (e) => {
        e.stopPropagation();
        openSpotlight();
      });
    }
    if (btnCloseSpotlight) {
      btnCloseSpotlight.addEventListener('click', closeSpotlight);
    }
    if (spotlightModal) {
      spotlightModal.addEventListener('click', (e) => {
        if (e.target === spotlightModal) closeSpotlight();
      });
    }
    if (spotlightInput) {
      spotlightInput.addEventListener('input', (e) => {
        renderSpotlightResults(e.target.value);
      });
      spotlightInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          updateSpotlightSelection(spotlightIndex + 1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          updateSpotlightSelection(spotlightIndex - 1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          executeSpotlightIndex(spotlightIndex);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeSpotlight();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (spotlightModal && spotlightModal.classList.contains('open')) closeSpotlight();
        else openSpotlight();
      } else if (e.key === '/' && document.activeElement && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        openSpotlight();
      } else if (e.key === 'Escape' && spotlightModal && spotlightModal.classList.contains('open')) {
        closeSpotlight();
      }
    });

    window.openTimerSpotlight = openSpotlight;
    window.closeTimerSpotlight = closeSpotlight;
  })();

  // Initialize Atmosphere & Particle Field Lab
  initAtmosphereLab();

  // ════════════════════════════════════════════════════════════════════════════
  // PILLAR 6 & 7: OPTIMISTIC UI WITH SELF-HEALING MUTATION JOURNAL &
  // GOOGLE CLOUD FIREBASE FIRESTORE REAL-TIME ENGINE (Singapore asia-southeast1)
  // Project: orlandochrome-b6228 · Collection: orlandotimer_sync
  // ════════════════════════════════════════════════════════════════════════════
  (function initOrlandoTimerFirebase() {
    const FIREBASE_CONFIG = {
      apiKey: "AIzaSyCi8aUZiN1GnRXECM0Nc34UKMYQyTvzj9Y",
      authDomain: "orlandochrome-b6228.firebaseapp.com",
      projectId: "orlandochrome-b6228",
      storageBucket: "orlandochrome-b6228.firebasestorage.app",
      messagingSenderId: "775835530889",
      appId: "1:775835530889:web:0ff6cb27e5be63d7c7f858"
    };
    const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/orlandotimer_sync/master_channel?key=${FIREBASE_CONFIG.apiKey}`;
    const CLIENT_ID = 'ot_' + Math.random().toString(36).slice(2, 10);
    const LAST_MOD_KEY = 'orlando-last-modified';
    const JOURNAL_KEY = 'orlando-mutation-journal';
    const SYNC_KEYS = [
      'orlando-app-theme',
      'orlando-clock-style',
      'orlando-clock-theme',
      'orlando-acoustic-tick',
      'orlando-custom-presets',
      'orlando-alarms-v2',
      'orlando-productivity-mode',
      'orlando-weekly-focus',
      'ot_focus_date',
      'ot_focus_mins',
      'orlando-ambient-glow',
      'orlando-particle-field',
      'orlando-particle-speed',
      'orlando-atmo-panel-opacity',
      'orlando-exam-mode',
      'orlando-low-effects',
      'orlando-milestone-toast',
      'orlando-alarm-sound',
      'orlando-alarm-volume'
    ];

    let isApplyingRemote = false;
    let isSyncing = false;
    let pushTimer = null;
    const origSetItem = Storage.prototype.setItem;

    // Cross-Tab 0ms Optimistic BroadcastChannel Bridge
    let liveBridge = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        liveBridge = new BroadcastChannel('orlandotimer_live_bridge');
        liveBridge.onmessage = (ev) => {
          if (ev.data && ev.data.type === 'OPTIMISTIC_STATE_PATCH' && ev.data.cid !== CLIENT_ID) {
            applyCloudPacket(ev.data.packet);
          }
        };
      }
    } catch (e) {}

    function getJournal() {
      try {
        const raw = localStorage.getItem(JOURNAL_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }

    function appendJournalEntry(key) {
      try {
        const journal = getJournal();
        journal.push({
          id: 'mut_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
          key: key,
          ts: Date.now(),
          cid: CLIENT_ID
        });
        // Keep last 50 unacknowledged mutations max
        const trimmed = journal.slice(-50);
        origSetItem.call(localStorage, JOURNAL_KEY, JSON.stringify(trimmed));
        updateJournalBadge(trimmed.length);
      } catch (e) {}
    }

    function flushJournal() {
      try {
        origSetItem.call(localStorage, JOURNAL_KEY, '[]');
        updateJournalBadge(0);
      } catch (e) {}
    }

    function updateJournalBadge(queuedCount) {
      const badge = document.getElementById('firebaseJournalBadge');
      if (!badge) return;
      if (queuedCount > 0) {
        badge.textContent = `${queuedCount} Queued`;
        badge.style.background = 'rgba(245, 158, 11, 0.18)';
        badge.style.borderColor = 'rgba(245, 158, 11, 0.45)';
        badge.style.color = '#fbbf24';
      } else {
        badge.textContent = '0ms SWR';
        badge.style.background = 'rgba(16, 185, 129, 0.15)';
        badge.style.borderColor = 'rgba(16, 185, 129, 0.35)';
        badge.style.color = '#34d399';
      }
    }

    function setSyncBadge(status) {
      const sysDot = document.getElementById('systemSyncDot');
      const dot = document.getElementById('firebaseTimerSyncDot');
      const txt = document.getElementById('firebaseTimerSyncText');
      const color = status === 'syncing' ? '#38bdf8' : (status === 'offline' ? '#f59e0b' : '#10b981');

      if (sysDot) {
        sysDot.style.background = color;
        sysDot.style.boxShadow = `0 0 8px ${color}`;
      }
      if (dot) {
        dot.style.background = color;
        dot.style.boxShadow = `0 0 8px ${color}`;
      }
      if (txt) {
        if (status === 'syncing') txt.textContent = 'Syncing Cloud...';
        else if (status === 'offline') txt.textContent = 'Offline · Journal Armed';
        else txt.textContent = 'Cloud Synced';
      }
    }

    function collectPacket() {
      const data = {};
      SYNC_KEYS.forEach(k => {
        const v = localStorage.getItem(k);
        if (v !== null) data[k] = v;
      });
      const ts = parseInt(localStorage.getItem(LAST_MOD_KEY) || String(Date.now()), 10);
      return {
        v: 2,
        cid: CLIENT_ID,
        ts,
        journalDepth: getJournal().length,
        data
      };
    }

    async function pushToCloud(showFeedback = false) {
      if (isApplyingRemote) return false;
      try {
        setSyncBadge('syncing');
        const pkt = collectPacket();
        const body = {
          fields: {
            v: { integerValue: "2" },
            ts: { integerValue: String(pkt.ts) },
            cid: { stringValue: pkt.cid },
            payload: { stringValue: JSON.stringify(pkt) }
          }
        };
        const res = await fetch(FIRESTORE_URL, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (res.ok) {
          flushJournal();
          setSyncBadge('synced');
          if (showFeedback && typeof window.showTelemetryToast === 'function') {
            window.showTelemetryToast('FIREBASE CLOUD SYNCED', '☁️ Reconciled horology state with Google Cloud Singapore!');
          }
          return true;
        }
        setSyncBadge('offline');
      } catch (e) {
        setSyncBadge('offline');
      }
      return false;
    }

    function applyCloudPacket(pkt) {
      if (!pkt || !pkt.data) return;
      isApplyingRemote = true;
      try {
        Object.keys(pkt.data).forEach(k => {
          origSetItem.call(localStorage, k, pkt.data[k]);
        });
        origSetItem.call(localStorage, LAST_MOD_KEY, String(pkt.ts || Date.now()));
        if (pkt.data['orlando-app-theme'] && typeof applyAppTheme === 'function') {
          try { applyAppTheme(pkt.data['orlando-app-theme']); } catch (e) {}
        }
        if (pkt.data['orlando-clock-style'] && typeof applyClockStyle === 'function') {
          try { applyClockStyle(pkt.data['orlando-clock-style']); } catch (e) {}
        }
        if (pkt.data['orlando-productivity-mode'] && typeof applyProductivityMode === 'function') {
          try { applyProductivityMode(pkt.data['orlando-productivity-mode'], false); } catch (e) {}
        }
        if (typeof renderPresets === 'function') {
          try { renderPresets(); } catch (e) {}
        }
        if (typeof loadAlarms === 'function' && typeof renderAlarms === 'function') {
          try { loadAlarms(); renderAlarms(); } catch (e) {}
        }
        if (typeof renderWeeklyFocusChart === 'function') {
          try { renderWeeklyFocusChart(); } catch (e) {}
        }
        if (typeof updateFocusTelemetryUI === 'function') {
          try { updateFocusTelemetryUI(); } catch (e) {}
        }
      } finally {
        isApplyingRemote = false;
      }
    }

    async function pullFromCloud(isInitial = false, showFeedback = false) {
      if (isSyncing) return false;
      isSyncing = true;
      try {
        // Self-healing check: if we have unacknowledged offline mutations in the journal, push them first!
        const pendingMutations = getJournal();
        if (pendingMutations.length > 0 && !isInitial) {
          isSyncing = false;
          await pushToCloud(showFeedback);
          return true;
        }

        const res = await fetch(FIRESTORE_URL, { cache: 'no-store' });
        if (res.status === 404) {
          isSyncing = false;
          await pushToCloud(showFeedback);
          return true;
        }
        if (!res.ok) {
          setSyncBadge('offline');
          isSyncing = false;
          return false;
        }
        const doc = await res.json();
        let pkt = null;
        if (doc && doc.fields && doc.fields.payload && doc.fields.payload.stringValue) {
          pkt = JSON.parse(doc.fields.payload.stringValue);
        }
        if (!pkt) {
          isSyncing = false;
          await pushToCloud(showFeedback);
          return true;
        }
        const cloudTs = pkt.ts || 0;
        const localTs = parseInt(localStorage.getItem(LAST_MOD_KEY) || '0', 10);
        if (cloudTs > localTs && (pkt.cid !== CLIENT_ID || isInitial)) {
          applyCloudPacket(pkt);
          flushJournal();
          if (showFeedback && typeof window.showTelemetryToast === 'function') {
            window.showTelemetryToast('FIREBASE CLOUD SYNCED', '☁️ Pulled latest horology state from Google Cloud!');
          }
        } else if (localTs > cloudTs || pendingMutations.length > 0) {
          isSyncing = false;
          await pushToCloud(showFeedback);
          return true;
        } else if (showFeedback) {
          isSyncing = false;
          await pushToCloud(true);
          return true;
        }
        setSyncBadge('synced');
      } catch (e) {
        setSyncBadge('offline');
      } finally {
        isSyncing = false;
      }
      return true;
    }

    // Intercept localStorage writes for Frame-0 Optimistic UI + Self-Healing Mutation Journal
    Storage.prototype.setItem = function(key, val) {
      origSetItem.call(this, key, val);
      if (!isApplyingRemote && this === localStorage && SYNC_KEYS.includes(key)) {
        const nowTs = Date.now();
        origSetItem.call(localStorage, LAST_MOD_KEY, String(nowTs));
        appendJournalEntry(key);

        // Frame-0 cross-tab optimistic broadcast (0ms)
        if (liveBridge) {
          try {
            liveBridge.postMessage({
              type: 'OPTIMISTIC_STATE_PATCH',
              cid: CLIENT_ID,
              packet: collectPacket()
            });
          } catch (e) {}
        }

        if (pushTimer) clearTimeout(pushTimer);
        pushTimer = setTimeout(() => { pushToCloud(false); }, 120);
      }
    };

    console.log('⚡ [OrlandoTimer v30.0] Optimistic UI + Self-Healing Journal + Firebase Firestore Active (orlandochrome-b6228)');
    updateJournalBadge(getJournal().length);

    const syncBtn = document.getElementById('btnFirebaseTimerSync');
    if (syncBtn) {
      syncBtn.addEventListener('click', () => {
        if (typeof AudioHUD !== 'undefined' && AudioHUD.chimeHarmonic) AudioHUD.chimeHarmonic(true);
        pullFromCloud(false, true);
      });
    }

    pullFromCloud(true, false);
    window.addEventListener('focus', () => pullFromCloud(false, false));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') pullFromCloud(false, false);
    });
    window.addEventListener('online', () => {
      // Self-heal queued mutations immediately on network recovery
      if (getJournal().length > 0) pushToCloud(true);
      else pullFromCloud(false, false);
    });
    window.addEventListener('offline', () => setSyncBadge('offline'));
    setInterval(() => {
      if (document.visibilityState === 'visible') pullFromCloud(false, false);
    }, 5000);

    window.OrlandoTimerFirebase = {
      config: FIREBASE_CONFIG,
      pushNow: () => pushToCloud(true),
      pullNow: () => pullFromCloud(false, true),
      getJournal: getJournal
    };
  })();


  // Service Worker Registration (scoped strictly to /orlandotimer/ so root index.html is never affected)
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      const swPath = location.pathname.includes('/orlandotimer') ? '/orlandotimer/sw.js?v=30.2' : 'sw.js?v=30.2';
      const swOpts = location.pathname.includes('/orlandotimer') ? { scope: '/orlandotimer/' } : {};
      navigator.serviceWorker.register(swPath, swOpts).then(reg => {
        try { reg.update(); } catch (e) {}
      }).catch(() => {});
    });
  }
})();
