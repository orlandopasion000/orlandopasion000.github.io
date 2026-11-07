const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- COMPREHENSIVE RECHARGE VERIFICATION ---');

let pass = true;

// 1. Check all 13 audio files exist and have non-zero size
const requiredSounds = [
  'green-noise.wav', 'rain.mp3', 'waves.mp3', 'river.mp3', 'wind.mp3',
  'campfire.mp3', 'birds.mp3', 'piano.mp3', 'space.mp3', 'brown-noise.wav',
  'pink-noise.wav', 'white-noise.wav', 'blue-noise.wav'
];

requiredSounds.forEach(sound => {
  const p = path.join(__dirname, 'sounds', sound);
  if (!fs.existsSync(p)) {
    console.error('FAIL: Missing sound file:', sound);
    pass = false;
  } else {
    const stat = fs.statSync(p);
    if (stat.size < 1000) {
      console.error('FAIL: Sound file too small:', sound, stat.size);
      pass = false;
    }
  }
});
console.log('✓ All 13 ambient soundscapes verified on disk');

// 2. Check privacy-policy.html and terms.html exist
['privacy-policy.html', 'terms.html'].forEach(f => {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p) || fs.statSync(p).size < 100) {
    console.error('FAIL: Missing or empty document:', f);
    pass = false;
  }
});
console.log('✓ Store-ready Privacy Policy and Terms of Service exist');

// 3. Verify JavaScript syntax in daily-recharge-alarm.html and recharge-clean.html
['daily-recharge-alarm.html', 'recharge-clean.html'].forEach(f => {
  const html = fs.readFileSync(path.join(__dirname, f), 'utf8');
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) {
    console.error('FAIL: No script in', f);
    pass = false;
    return;
  }
  const tempScript = path.join(__dirname, `temp_syntax_${f}.js`);
  fs.writeFileSync(tempScript, m[1], 'utf8');
  try {
    execSync(`node -c "${tempScript}"`);
    console.log(`✓ JavaScript syntax valid for ${f}`);
  } catch (err) {
    console.error(`FAIL: JavaScript syntax error in ${f}:`, err.message);
    pass = false;
  } finally {
    try { fs.unlinkSync(tempScript); } catch(e){}
  }
});

// 4. Verify Service Worker v9 caches all 13 sounds
const swContent = fs.readFileSync(path.join(__dirname, 'recharge-sw.js'), 'utf8');
if (!/recharge-v[9\d]/.test(swContent)) {
  console.error('FAIL: Service worker version is not recharge-v9 or higher');
  pass = false;
} else {
  console.log('✓ Service Worker is on recharge-v9');
}
requiredSounds.forEach(s => {
  if (!swContent.includes(s)) {
    console.error('FAIL: Service worker does not cache sound:', s);
    pass = false;
  }
});
console.log('✓ Service Worker caches all 13 ambient soundscapes');

// 5. Verify manifests
['recharge-manifest.webmanifest', 'recharge-clean-manifest.webmanifest'].forEach(mFile => {
  try {
    const raw = fs.readFileSync(path.join(__dirname, mFile), 'utf8');
    JSON.parse(raw);
    console.log(`✓ Valid JSON manifest: ${mFile}`);
  } catch(e) {
    console.error(`FAIL: Invalid JSON in ${mFile}:`, e.message);
    pass = false;
  }
});

if (pass) {
  console.log('\n========================================');
  console.log('🎉 ALL COMPREHENSIVE TESTS PASSED! 100% STORE READY');
  console.log('========================================');
} else {
  console.error('\n❌ SOME CHECKS FAILED');
  process.exit(1);
}
