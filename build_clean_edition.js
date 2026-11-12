const fs = require('fs');
const path = require('path');

const repoDir = 'C:\\Users\\Orlando\\.gemini\\antigravity\\scratch\\orlandopasion000.github.io';
const srcFile = path.join(repoDir, 'orlandorecharge.html');
const destFile = path.join(repoDir, 'recharge-clean.html');

let src = fs.readFileSync(srcFile, 'utf8');

// 1. Replace Title & Meta Title to clearly mark Blank Canvas (Main Version)
src = src.replace(
  /<title>.*?<\/title>/,
  '<title>OrlandoRecharge (Main Version) — Blank Canvas</title>'
);
src = src.replace(
  /<meta name="apple-mobile-web-app-title" content=".*?">/,
  '<meta name="apple-mobile-web-app-title" content="OrlandoRecharge (Main Version)">'
);

// 2. Replace Manifest
src = src.replace(
  /<link rel="manifest" href=".*?">/,
  '<link rel="manifest" href="recharge-clean-manifest.webmanifest">'
);

// 3. Replace Description & Subtitle
src = src.replace(
  /<meta name="description" content=".*?">/,
  '<meta name="description" content="Clean, 100% blank daily alarm schedule (0 alarms). Zero personal data — fresh canvas ready for anyone.">'
);
src = src.replace(
  /<div class="dist-subtitle">.*?<\/div>/,
  '<div class="dist-subtitle">100% clean, schedule-free blank canvas (0 alarms). Clean storage ready for your personal routine.</div>'
);

// 4. Card 1 in Clean Edition: Open Sir Orlando's Main Executive Schedule (23 Blocks)
const card1Search = /<!-- Card 1: Main Executive Schedule -->[\s\S]*?<!-- Card 2:/;
const card1CleanReplacement = `<!-- Card 1: Main Executive Schedule -->
        <div class="dist-card">
          <div class="dist-card-top">
            <div class="dist-icon dist-icon-gold">
              <svg class="modern-icon modern-icon-gold" viewBox="0 0 24 24" style="width:19px;height:19px;margin:0"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            <div class="dist-card-meta">
              <div class="dist-name">Main Executive App</div>
              <div class="dist-desc">Switch to complete 23-block schedule</div>
            </div>
          </div>
          <div class="dist-btn-stack">
            <a class="primary dist-btn" id="openMainAppBtn" href="https://orlandopasion000.github.io/orlandorecharge" target="_blank" rel="noopener" title="Open Complete 23-Block Main Schedule in New Window">
              <svg class="modern-icon" viewBox="0 0 24 24" style="width:14px;height:14px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              <span>Open Main Web App</span>
            </a>
          </div>
        </div>

        <!-- Card 2:`;
src = src.replace(card1Search, card1CleanReplacement);

// 5. Card 4 in Clean Edition: Active Clean Blank Canvas with Reset button
const card4Search = /<!-- Card 4: Clean Blank Edition[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
const card4CleanReplacement = `<!-- Card 4: Clean Blank Edition (Active) -->
        <div class="dist-card dist-card-blank">
          <div class="dist-card-top">
            <div class="dist-icon dist-icon-gold">
              <svg class="modern-icon modern-icon-gold" viewBox="0 0 24 24" style="width:19px;height:19px;margin:0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <div class="dist-card-meta">
              <div class="dist-name" style="color:var(--gold)">Clean Blank Canvas (Active)</div>
              <div class="dist-desc">Currently active: 0 alarms scheduled</div>
            </div>
          </div>
          <div class="dist-btn-stack">
            <button type="button" class="primary dist-btn" id="cleanResetCanvasBtn" style="width:100%">
              <svg class="modern-icon" viewBox="0 0 24 24" style="width:14px;height:14px"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
              <span>Clear &amp; Reset Blank Canvas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>`;
src = src.replace(card4Search, card4CleanReplacement);

// 6. Replace default schedule with 0 alarms & add self-healing storage purge
const scheduleLoadCode = `var DEFAULT_SCHEDULE = [];
var S = [];
try {
  var cleanInit = localStorage.getItem("dra-clean-blank-v5");
  if (!cleanInit) {
    S = [];
    localStorage.setItem("dra-clean-schedule", JSON.stringify([]));
    localStorage.setItem("dra-clean-preset-key", "blank");
    localStorage.setItem("dra-clean-blank-v5", "1");
  } else {
    var savedClean = localStorage.getItem("dra-clean-schedule");
    if (savedClean) {
      var parsedClean = JSON.parse(savedClean);
      if (Array.isArray(parsedClean)) {
        // If contaminated with the 23-block main schedule, purge it completely
        if (parsedClean.length === 23 && parsedClean[0] && parsedClean[0][3] && String(parsedClean[0][3]).indexOf("Arrive — read") !== -1) {
          S = [];
          localStorage.setItem("dra-clean-schedule", JSON.stringify([]));
          localStorage.setItem("dra-clean-preset-key", "blank");
        } else {
          S = parsedClean;
        }
      }
    }
  }
} catch(e){ S = []; }`;

const origSchedLoadRegex = /var DEFAULT_SCHEDULE\s*=\s*\[[\s\S]*?var S\s*=\s*DEFAULT_SCHEDULE\.slice\(0\);[\s\S]*?catch\(e\)\{\}/;
src = src.replace(origSchedLoadRegex, scheduleLoadCode);

// 7. Change storage keys so clean edition is 100% isolated
src = src.replace(/"dra-schedule"/g, '"dra-clean-schedule"');
src = src.replace(/"dra-days"/g, '"dra-clean-days"');
src = src.replace(/"dra-theme"/g, '"dra-clean-theme"');
src = src.replace(/"dra-snoozes"/g, '"dra-clean-snoozes"');
src = src.replace(/"dra-theme-mode"/g, '"dra-clean-theme-mode"');
src = src.replace(/"dra-font-scale"/g, '"dra-clean-font-scale"');
src = src.replace(/"dra-tour-done"/g, '"dra-clean-tour-done"');
src = src.replace(/"dra-preset-key"/g, '"dra-clean-preset-key"');

// 8. Replace personal strings
src = src.replace(/owner:"Sir Orlando V\. Pasion, Jr\."/g, 'owner:"Public Main Version"');
src = src.replace(/daily-recharge-schedule-backup\.json/g, 'daily-recharge-clean-backup.json');

// 9. Enforce OrlandoRecharge (Main Version) everywhere
src = src.split('OrlandoRecharge (Clean Edition)').join('OrlandoRecharge (Main Version)');

// 10. Wire cleanResetCanvasBtn before initial bootstrap
const cleanHooks = `
if ($("cleanResetCanvasBtn")) {
  $("cleanResetCanvasBtn").onclick = function() {
    S = [];
    try {
      localStorage.setItem("dra-clean-schedule", JSON.stringify([]));
      localStorage.setItem("dra-clean-preset-key", "blank");
    } catch(e){}
    renderList();
    if (typeof updatePresetSelectorUI === "function") updatePresetSelectorUI();
    if (typeof updatePresetDaysBadge === "function") updatePresetDaysBadge();
    tick();
    showToast("Schedule reset to blank canvas (0 alarms)", "📋");
  };
}
`;
src = src.replace('/* ───────── INITIAL BOOTSTRAP', cleanHooks + '\n/* ───────── INITIAL BOOTSTRAP');

// 11. Write file
fs.writeFileSync(destFile, src, 'utf8');
console.log('Successfully generated recharge-clean.html from orlandorecharge.html with OrlandoRecharge (Main Version)');

// 12. Copy orlandorecharge.html to orlandorecharge/index.html
const subfolderIndex = path.join(repoDir, 'orlandorecharge', 'index.html');
fs.writeFileSync(subfolderIndex, fs.readFileSync(srcFile, 'utf8'), 'utf8');
console.log('Successfully copied orlandorecharge.html to orlandorecharge/index.html');
