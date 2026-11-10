const fs = require('fs');
const path = require('path');

const repoDir = 'C:\\Users\\Orlando\\.gemini\\antigravity\\scratch\\orlandopasion000.github.io';
const srcFile = path.join(repoDir, 'daily-recharge-alarm.html');
const destFile = path.join(repoDir, 'recharge-clean.html');

let src = fs.readFileSync(srcFile, 'utf8');

// Replace Title
src = src.replace(
  /<title>Daily Recharge Alarm — Sir Orlando V\. Pasion, Jr\.<\/title>/,
  '<title>Daily Recharge Alarm — Personal Rhythm & Rest Deck</title>'
);

// Replace Manifest
src = src.replace(
  /<link rel="manifest" href="recharge-manifest\.webmanifest">/,
  '<link rel="manifest" href="recharge-clean-manifest.webmanifest">'
);

// Replace Description
src = src.replace(
  /<meta name="description" content="Daily schedule alarm cockpit with music clips and Rest Mode clock\.">/,
  '<meta name="description" content="Clean, customizable daily alarm schedule with luxury metallic clocks and Rest Mode.">'
);

// Replace Subtitle
src = src.replace(
  /<div class="dist-subtitle">Installed, offline-cached, shareable, and verified for Sir Orlando V\. Pasion, Jr\.<\/div>/,
  '<div class="dist-subtitle">Installed, offline-cached, shareable, and 100% customizable for your personal daily rhythm.</div>'
);

// Replace Downloads in Card 1
src = src.replace(
  /href="downloads\/DailyRecharge-Setup\.exe"/g,
  'href="downloads/DailyRecharge-Clean-Setup.exe"'
);
src = src.replace(
  /href="downloads\/Install-DailyRecharge-Windows\.cmd"/g,
  'href="downloads/Install-DailyRecharge-Clean-Windows.cmd"'
);

// Replace Clean Blank Edition Highlight Card with Master Preset Highlight Card
const oldHighlightCard = `    <!-- Highlight Banner: Clean Blank Edition (For Friends & Students) -->
    <div class="dist-card highlight-card">
      <div class="dist-card-top">
        <div class="dist-icon" style="background:rgba(217,185,92,.15);color:var(--gold);border-color:rgba(217,185,92,.3)">🎁</div>
        <div>
          <div class="dist-name" style="color:var(--gold)">Clean Blank Edition (For Anyone)</div>
          <div class="dist-desc">A 100% clean, schedule-free app with isolated storage. Zero personal data — ready for anyone to enter their own schedule.</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <a class="primary dist-btn" href="recharge-clean.html" target="_blank" rel="noopener" style="flex:1;min-width:140px;text-align:center;text-decoration:none;display:inline-flex;align-items:center;justify-content:center">🚀 Open Blank Web App</a>
        <a class="ghost dist-btn" href="downloads/DailyRecharge-Clean-Setup.exe" download style="flex:1;min-width:140px;text-align:center;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;font-size:.85rem">⬇ Windows (.exe)</a>
        <button class="ghost dist-btn" id="downloadBlankAppBtn" style="flex:1;min-width:140px;font-size:.85rem">💾 Standalone (.html)</button>
      </div>
    </div>`;

const newHighlightCard = `    <!-- Highlight Banner: Preset Routines (Class Day, Weekend, Gymmers, Holidays, Seminar) -->
    <div class="dist-card highlight-card">
      <div class="dist-card-top">
        <div class="dist-icon" style="background:rgba(217,185,92,.15);color:var(--gold);border-color:rgba(217,185,92,.3)">🎓</div>
        <div>
          <div class="dist-name" style="color:var(--gold)">11+ Routine Presets Ready</div>
          <div class="dist-desc">Choose from curated presets: Weekend Recharge, Gymmers, Holidays, Seminar, Deep Rest, Class Day, and more.</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="primary dist-btn" id="explorePresetsBtn" style="flex:1;min-width:140px;text-align:center">📋 Switch Routine Preset</button>
        <button class="ghost dist-btn" id="clearScheduleBtn" style="flex:1;min-width:140px;font-size:.85rem">📝 Start Blank</button>
      </div>
    </div>`;

src = src.replace(oldHighlightCard, newHighlightCard);

// Replace default schedule in recharge-clean.html so it starts with a clean starter or blank
const defaultSchedDecl = `var DEFAULT_SCHEDULE = [
  [7,0,"work","Arrive — read, learn, develop"],
  [8,0,"rest","Short recharge — 10 min"],
  [8,10,"work","Work and print"],
  [8,20,"rest","Recharge before class — 10 min"],
  [8,30,"class","Class: Math 8"],
  [9,30,"rest","Long recharge — 40 min"],
  [10,11,"work","Work and print"],
  [10,30,"rest","Recharge before class — 15 min"],
  [10,45,"class","Class: Math 10"],
  [11,45,"err","Principal’s office — log out/in"],
  [12,0,"rest","Lunch and recharge — 45 min"],
  [12,45,"err","Personal hygiene"],
  [12,50,"rest","Recharge before class — 10 min"],
  [13,0,"class","Class: Math 8"],
  [14,0,"rest","Longest recharge — 60 min"],
  [15,0,"work","Work and print"],
  [15,10,"rest","Quick recharge — 5 min"],
  [15,15,"class","Class: Gen Math 11"],
  [16,16,"err","Organize files"],
  [16,21,"rest","Recharge, then go home"],
  [20,0,"night","Shutdown — write tomorrow’s top 3"],
  [20,30,"night","Wind-down — no screens"],
  [21,30,"night","Bedtime"]
];`;

const cleanDefaultSchedDecl = `var DEFAULT_SCHEDULE = [];`; // Starts blank canvas

src = src.replace(defaultSchedDecl, cleanDefaultSchedDecl);

// Change storage keys so clean edition is 100% isolated
src = src.replace(/"dra-schedule"/g, '"dra-clean-schedule"');
src = src.replace(/"dra-days"/g, '"dra-clean-days"');
src = src.replace(/"dra-theme"/g, '"dra-clean-theme"');
src = src.replace(/"dra-snoozes"/g, '"dra-clean-snoozes"');
src = src.replace(/"dra-theme-mode"/g, '"dra-clean-theme-mode"');
src = src.replace(/"dra-font-scale"/g, '"dra-clean-font-scale"');
src = src.replace(/"dra-tour-done"/g, '"dra-clean-tour-done"');
src = src.replace(/"dra-preset-key"/g, '"dra-clean-preset-key"');

// Replace any remaining personal references in strings
src = src.replace(/owner:"Sir Orlando V\. Pasion, Jr\."/g, 'owner:"Public Clean Edition"');
src = src.replace(/title:"Daily Recharge Alarm — Sir Orlando V\. Pasion, Jr\."/g, 'title:"Daily Recharge Alarm — Personal Rhythm & Rest Deck"');
src = src.replace(/https:\/\/orlandopasion000\.github\.io\/daily-recharge-alarm\.html/g, 'https://orlandopasion000.github.io/recharge-clean.html');
src = src.replace(/daily-recharge-schedule-backup\.json/g, 'daily-recharge-clean-backup.json');

// Wire up explorePresetsBtn and clearScheduleBtn if present
const cleanHooks = `
if ($("explorePresetsBtn")) {
  $("explorePresetsBtn").onclick = function() {
    var p = $("presetSelect");
    if (p) {
      p.scrollIntoView({ behavior: "smooth", block: "center" });
      p.focus();
    }
  };
}
if ($("clearScheduleBtn")) {
  $("clearScheduleBtn").onclick = function() {
    applyPreset("blank", true);
  };
}
`;

src = src.replace('/* ───────── INITIAL BOOTSTRAP ───────── */', cleanHooks + '\n/* ───────── INITIAL BOOTSTRAP ───────── */');

fs.writeFileSync(destFile, src, 'utf8');
console.log('Successfully generated recharge-clean.html from daily-recharge-alarm.html');
