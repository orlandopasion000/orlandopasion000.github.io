const fs = require('fs');
const path = require('path');

const repoDir = 'C:\\Users\\Orlando\\.gemini\\antigravity\\scratch\\orlandopasion000.github.io';
const srcFile = path.join(repoDir, 'orlandorecharge.html');
const destFile = path.join(repoDir, 'recharge-clean.html');

// 1. Maintain lightweight instant forwarder in recharge-clean.html to native blank canvas
const cleanRedirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=https://orlandopasion000.github.io/orlandorecharge?preset=blank">
  <title>OrlandoRecharge — Blank Canvas</title>
  <script>
    window.location.replace("https://orlandopasion000.github.io/orlandorecharge?preset=blank");
  </script>
</head>
<body style="background:#000;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <p>Loading Blank Canvas in <a href="https://orlandopasion000.github.io/orlandorecharge?preset=blank" style="color:#d4af37;">OrlandoRecharge</a>...</p>
</body>
</html>
`;

fs.writeFileSync(destFile, cleanRedirectHtml, 'utf8');
console.log('Successfully updated recharge-clean.html as native blank canvas forwarder');

// 2. Copy orlandorecharge.html to orlandorecharge/index.html
const subfolderIndex = path.join(repoDir, 'orlandorecharge', 'index.html');
fs.writeFileSync(subfolderIndex, fs.readFileSync(srcFile, 'utf8'), 'utf8');
console.log('Successfully copied orlandorecharge.html to orlandorecharge/index.html');
