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

  // ══════════════════════════════════════════════════════════════════════════
  // 1. BESPOKE THEMES DEFINITION (30 WORLD-CLASS HOROLOGY THEMES)
  // ══════════════════════════════════════════════════════════════════════════
  const THEMES = [
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
    // Minimalist & Monolith (3)
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
      tick: function (freq = 880) {
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
      }
    };
  })();

  // ══════════════════════════════════════════════════════════════════════════
  // 2. INDEPENDENT DUAL-CATEGORY CUSTOMIZATION ENGINE
  // ══════════════════════════════════════════════════════════════════════════
  let currentAppTheme = "platinum";
  let currentClockStyle = "platinum";

  // Load independent preferences from localStorage
  try {
    const savedApp = localStorage.getItem('orlando-app-theme');
    if (savedApp && THEMES.includes(savedApp)) currentAppTheme = savedApp;

    const savedClock = localStorage.getItem('orlando-clock-style') || localStorage.getItem('orlando-clock-theme');
    if (savedClock && THEMES.includes(savedClock)) currentClockStyle = savedClock;
  } catch(e) {}

  // Category 1: Global Application Theme Controller
  function applyAppTheme(theme) {
    if (!THEMES.includes(theme)) theme = "platinum";
    currentAppTheme = theme;
    document.body.setAttribute('data-app-theme', theme);

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
    if (!THEMES.includes(style)) style = "platinum";
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

  function openHoloVault(target) {
    activeVaultTarget = target;
    savedActiveTheme = currentAppTheme;
    savedActiveClock = currentClockStyle;

    if (target === 'theme') {
      if (holoVaultKicker) holoVaultKicker.textContent = 'GLOBAL APPLICATION ENVIRONMENT · LIVE HOLO-SCRUB';
      if (holoVaultTitle) holoVaultTitle.textContent = 'HOLOGRAPHIC THEME VAULT';
      if (holoVaultSubtitle) holoVaultSubtitle.textContent = 'Hover over any card for instant ambient preview across the application. Click to lock in.';
    } else {
      if (holoVaultKicker) holoVaultKicker.textContent = 'CHRONOMETER TYPOGRAPHY & FINISH ONLY · LIVE HOLO-SCRUB';
      if (holoVaultTitle) holoVaultTitle.textContent = 'CHRONO TYPOGRAPHY VAULT';
      if (holoVaultSubtitle) holoVaultSubtitle.textContent = 'Hover over any card to preview specular reflections on clock numerals. Click to lock in.';
    }

    if (holoStatusText) {
      holoStatusText.textContent = `Awaiting selection · Active: ${target === 'theme' ? THEME_NAMES[currentAppTheme] : THEME_NAMES[currentClockStyle]}`;
    }

    renderHoloCards(currentFilter);

    if (holoVaultModal) {
      holoVaultModal.classList.add('open');
      holoVaultModal.setAttribute('aria-hidden', 'false');
    }
    AudioHUD.tick(1200);
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
          <span class="card-active-led">Active</span>
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

  // Acoustic Tick button binding
  const btnAcousticTick = document.getElementById('btnAcousticTick');
  const acousticDot = document.getElementById('acousticDot');
  const acousticTickText = document.getElementById('acousticTickText');

  function updateAcousticTickUI() {
    if (acousticDot) {
      if (acousticTickEnabled) acousticDot.classList.add('active');
      else acousticDot.classList.remove('active');
    }
    if (acousticTickText) {
      acousticTickText.textContent = acousticTickEnabled ? 'Tick: ON' : 'Tick: OFF';
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
      AudioHUD.tick(acousticTickEnabled ? 1200 : 600);
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
    } else if (e.key === 'c' || e.key === 'C') {
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
    playLuxuryChime();
    if (alarmAudioInterval) clearInterval(alarmAudioInterval);
    alarmAudioInterval = setInterval(() => {
      playLuxuryChime();
    }, 1400);

    const audioEl = document.getElementById('alarmAudioElement');
    if (audioEl) {
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
  let isWakeLockRequested = true;

  async function requestWakeLock() {
    if (!('wakeLock' in navigator)) return;
    try {
      if (!wakeLockSentinel || wakeLockSentinel.released) {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        updateWakeLockUI(true);
        wakeLockSentinel.addEventListener('release', () => {
          updateWakeLockUI(false);
        });
      }
    } catch (err) {
      updateWakeLockUI(false);
    }
  }

  function releaseWakeLock() {
    if (wakeLockSentinel) {
      wakeLockSentinel.release().catch(() => {});
      wakeLockSentinel = null;
      updateWakeLockUI(false);
    }
  }

  function updateWakeLockUI(active) {
    const textEl = document.getElementById('wakeLockText');
    const dotEl = document.querySelector('.status-dot-wake');
    if (textEl) textEl.textContent = active ? 'Awake ON' : 'Awake OFF';
    if (dotEl) {
      dotEl.style.background = active ? 'var(--emerald)' : 'var(--theme-text-mute)';
      dotEl.style.boxShadow = active ? '0 0 8px var(--emerald)' : 'none';
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isWakeLockRequested) {
      requestWakeLock();
    }
  });

  const btnWakeLock = document.getElementById('btnWakeLock');
  if (btnWakeLock) {
    btnWakeLock.addEventListener('click', () => {
      if (wakeLockSentinel && !wakeLockSentinel.released) {
        isWakeLockRequested = false;
        releaseWakeLock();
      } else {
        isWakeLockRequested = true;
        requestWakeLock();
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
    if (fsLabel) fsLabel.textContent = isFs ? 'Exit Fullscreen' : 'Fullscreen';
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

  function updateTimerDisplay() {
    if (timerDigitsEl) {
      const timeStr = formatTimeHHMMSS(timerRemaining);
      timerDigitsEl.innerHTML = chromeHTML(timeStr);
    }
    if (timerProgressBar && timerTotalDuration > 0) {
      const pct = Math.max(0, Math.min(100, (timerRemaining / timerTotalDuration) * 100));
      timerProgressBar.style.width = `${pct}%`;
    } else if (timerProgressBar) {
      timerProgressBar.style.width = '100%';
    }
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

  function setTimerDuration(seconds) {
    timerTotalDuration = seconds;
    timerRemaining = seconds;
    syncInputsFromRemaining(seconds);
    updateTimerDisplay();
  }

  function startTimer() {
    if (timerIsRunning) return;

    if (timerRemaining <= 0) {
      const inputDuration = getDurationFromInputs();
      if (inputDuration <= 0) {
        setTimerDuration(25 * 60);
      } else {
        setTimerDuration(inputDuration);
      }
    }

    timerIsRunning = true;
    timerEndTime = Date.now() + timerRemaining * 1000;

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
  }

  function resetTimer() {
    pauseTimer();
    const inputDuration = getDurationFromInputs();
    if (inputDuration > 0) {
      setTimerDuration(inputDuration);
    } else {
      setTimerDuration(timerTotalDuration || 25 * 60);
    }
  }

  function onTimerComplete() {
    triggerAlertOverlay({
      type: 'timer',
      title: "00:00:00",
      message: "TIME'S UP! Your countdown has finished.",
      canSnooze: false
    });
  }

  const presetPills = document.querySelectorAll('.preset-pill');
  presetPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pauseTimer();
      const mins = parseInt(pill.getAttribute('data-minutes') || '25', 10);
      setTimerDuration(mins * 60);
    });
  });

  [timerHourInput, timerMinInput, timerSecInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('change', () => {
      if (!timerIsRunning) {
        const dur = getDurationFromInputs();
        setTimerDuration(dur);
      }
    });
  });

  window.stepTime = function (type, amount) {
    if (timerIsRunning) return;
    let h = parseInt(timerHourInput.value || '0', 10);
    let m = parseInt(timerMinInput.value || '0', 10);
    let s = parseInt(timerSecInput.value || '0', 10);

    if (type === 'h') h = Math.max(0, Math.min(99, h + amount));
    if (type === 'm') m = Math.max(0, Math.min(59, m + amount));
    if (type === 's') s = Math.max(0, Math.min(59, s + amount));

    timerHourInput.value = String(h).padStart(2, '0');
    timerMinInput.value = String(m).padStart(2, '0');
    timerSecInput.value = String(s).padStart(2, '0');

    setTimerDuration(h * 3600 + m * 60 + s);
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

  function formatStopwatchTime(totalMs) {
    const totalSec = Math.floor(totalMs / 1000);
    const ms = Math.floor((totalMs % 1000) / 10);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    const msStr = String(ms).padStart(2, '0');

    if (hours > 0) {
      const hh = String(hours).padStart(2, '0');
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

    swInterval = setInterval(() => {
      swElapsedTime = performance.now() - swStartTime;
      updateStopwatchDisplay();
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
          <span class="lap-num">Lap ${String(lap.lapNumber).padStart(2, '0')}${badgeHtml}</span>
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
  // 11. ANTIGRAVITY REPULSIVE PARTICLES CANVAS (Signature Visual FX)
  // ══════════════════════════════════════════════════════════════════════════
  const canvas = document.getElementById('antigravityCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    const particleCount = 50;
    let mouse = { x: -1000, y: -1000, radius: 140 };
    let currentParticleColor = 'rgba(217, 185, 92, 0.45)';

    window.updateParticleThemeColor = function (hexColor) {
      if (hexColor) currentParticleColor = hexColor;
    };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2.2 + 1.2;
        // Spawn strictly inside the screen
        particles.push({
          x: Math.random() * (Math.max(10, width - size * 4)) + size * 2,
          y: Math.random() * (Math.max(10, height - size * 4)) + size * 2,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: size,
          alpha: Math.random() * 0.5 + 0.3
        });
      }
    }

    function renderParticles() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = currentParticleColor;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Mouse repulsion effect: particles move away from cursor
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.vx += (dx / dist) * force * 1.5;
          p.vy += (dy / dist) * force * 1.5;
        }

        // Apply gentle fluid damping
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Ensure particles always keep a gentle ambient float
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (currentSpeed < 0.2) {
          p.vx += (Math.random() - 0.5) * 0.08;
          p.vy += (Math.random() - 0.5) * 0.08;
        } else if (currentSpeed > 4.0) {
          p.vx = (p.vx / currentSpeed) * 4.0;
          p.vy = (p.vy / currentSpeed) * 4.0;
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // 2. Strict screen boundaries: particles NEVER leave the view!
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

        // Render particle strictly within view
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(renderParticles);
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

  // Service Worker Registration
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
