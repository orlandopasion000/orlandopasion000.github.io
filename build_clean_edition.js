const fs = require('fs');
const path = require('path');

const repoDir = 'C:\\Users\\Orlando\\.gemini\\antigravity\\scratch\\orlandopasion000.github.io';
const srcFile = path.join(repoDir, 'orlandorecharge.html');
const destFile = path.join(repoDir, 'recharge-clean.html');

let src = fs.readFileSync(srcFile, 'utf8');

// 1. Replace Title & Meta Title to clearly mark Clean Blank Edition
src = src.replace(
  /<title>.*?<\/title>/,
  '<title>OrlandoRecharge (Clean Edition) — Blank Canvas</title>'
);
src = src.replace(
  /<meta name="apple-mobile-web-app-title" content=".*?">/,
  '<meta name="apple-mobile-web-app-title" content="Clean Recharge">'
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
            <div class="dist-icon">⚡</div>
            <div class="dist-card-meta">
              <div class="dist-name">Main Executive App</div>
              <div class="dist-desc">Switch to complete 23-block schedule</div>
            </div>
          </div>
          <div class="dist-btn-stack">
            <a class="primary dist-btn" id="installAppBtn" href="https://orlandopasion000.github.io/orlandorecharge" target="_blank" rel="noopener">⚡ 1-Click Install App</a>
            <div class="dist-btn-row">
              <a class="ghost dist-btn" href="downloads/Install-OrlandoRecharge-Windows.cmd" download title="1-Click Windows Setup Script">⚡ Setup (.cmd)</a>
              <a class="ghost dist-btn" href="downloads/DailyRecharge-Setup.exe" download title="Standalone .exe for Windows">⬇ .exe</a>
            </div>
          </div>
        </div>

        <!-- Card 2:`;
src = src.replace(card1Search, card1CleanReplacement);

// 5. Card 4 in Clean Edition: Active Clean Blank Canvas with Reset button
const card4Search = /<!-- Card 4: Clean Blank Edition[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;
const card4CleanReplacement = `<!-- Card 4: Clean Blank Edition (Active) -->
        <div class="dist-card dist-card-blank">
          <div class="dist-card-top">
            <div class="dist-icon dist-icon-gold">📝</div>
            <div class="dist-card-meta">
              <div class="dist-name" style="color:var(--gold)">Clean Blank Canvas (Active)</div>
              <div class="dist-desc">Currently active: 0 alarms scheduled</div>
            </div>
          </div>
          <div class="dist-btn-stack">
            <button type="button" class="primary dist-btn" id="cleanResetCanvasBtn" style="width:100%">↺ Clear &amp; Reset Blank Canvas</button>
            <div class="dist-btn-row">
              <a class="ghost dist-btn" href="downloads/DailyRecharge-Clean-Setup.exe" download title="Clean Edition .exe">⬇ .exe</a>
              <button class="ghost dist-btn" id="downloadBlankAppBtn" title="Clean Standalone HTML">💾 .html</button>
            </div>
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
src = src.replace(/owner:"Sir Orlando V\. Pasion, Jr\."/g, 'owner:"Public Clean Edition"');
src = src.replace(/daily-recharge-schedule-backup\.json/g, 'daily-recharge-clean-backup.json');

// 9. Wire cleanResetCanvasBtn before initial bootstrap
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
    showToast("Schedule reset to blank canvas (0 alarms)", "📝");
  };
}
`;
src = src.replace('/* ───────── INITIAL BOOTSTRAP', cleanHooks + '\n/* ───────── INITIAL BOOTSTRAP');

// 10. Write file
fs.writeFileSync(destFile, src, 'utf8');
console.log('Successfully generated recharge-clean.html from orlandorecharge.html');
