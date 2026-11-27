/* ==========================================================================
   ORLANDOVAULT PHASE 3: BUILT-IN RFC 6238 TOTP & SECURITY WATCHTOWER (HIBP)
   100% Client-Side Web Crypto Implementation
   ========================================================================== */
(function() {
  'use strict';

  const BASE32_ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const hibpBreachCache = new Map(); // RAM-only map: password -> count (cleared on lock)
  let currentWatchtowerFilter = 'all';
  let lastWatchtowerReport = null;

  function parseTotpInput(rawInput) {
    if (!rawInput || typeof rawInput !== 'string') return null;
    let secretRaw = rawInput.trim();
    let digits = 6;
    let period = 30;
    if (secretRaw.toLowerCase().startsWith('otpauth://')) {
      try {
        const u = new URL(secretRaw);
        secretRaw = u.searchParams.get('secret') || '';
        const d = parseInt(u.searchParams.get('digits') || '6', 10);
        const p = parseInt(u.searchParams.get('period') || '30', 10);
        if (d >= 6 && d <= 8) digits = d;
        if (p >= 15 && p <= 120) period = p;
      } catch(e) {
        return null;
      }
    }
    const clean = secretRaw.toUpperCase().replace(/[\s\-=]+/g, '');
    if (!clean || clean.length < 8 || !/^[A-Z2-7]+$/.test(clean)) return null;
    return { secret: clean, digits, period };
  }

  function decodeBase32(cleanB32) {
    let bits = 0;
    let value = 0;
    const out = [];
    for (let i = 0; i < cleanB32.length; i++) {
      const idx = BASE32_ALPHA.indexOf(cleanB32[i]);
      if (idx === -1) throw new Error('Invalid Base32 character');
      value = (value << 5) | idx;
      bits += 5;
      if (bits >= 8) {
        out.push((value >>> (bits - 8)) & 0xff);
        bits -= 8;
      }
    }
    return new Uint8Array(out);
  }

  async function generateTotp(rawInput, nowMs = Date.now()) {
    const parsed = parseTotpInput(rawInput);
    if (!parsed) throw new Error('Invalid 2FA Base32 secret.');
    const keyBytes = decodeBase32(parsed.secret);
    const epochSec = Math.floor(nowMs / 1000);
    const counter = Math.floor(epochSec / parsed.period);
    const remaining = parsed.period - (epochSec % parsed.period);

    const counterBuf = new ArrayBuffer(8);
    const view = new DataView(counterBuf);
    const hi = Math.floor(counter / 0x100000000);
    const lo = counter >>> 0;
    view.setUint32(0, hi, false);
    view.setUint32(4, lo, false);

    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );
    const sig = new Uint8Array(await window.crypto.subtle.sign('HMAC', cryptoKey, counterBuf));
    const offset = sig[sig.length - 1] & 0x0f;
    const binCode =
      ((sig[offset] & 0x7f) << 24) |
      ((sig[offset + 1] & 0xff) << 16) |
      ((sig[offset + 2] & 0xff) << 8) |
      (sig[offset + 3] & 0xff);
    const mod = Math.pow(10, parsed.digits);
    const code = String(binCode % mod).padStart(parsed.digits, '0');
    const formatted = parsed.digits === 6 ? (code.slice(0, 3) + ' ' + code.slice(3)) : code;
    return { code, formatted, remaining, period: parsed.period };
  }

  window.VaultTOTP = {
    parseSecret: parseTotpInput,
    decodeBase32: decodeBase32,
    generate: generateTotp
  };

  window.copyTotpById = async function(itemId, btnEl) {
    const items = (typeof window.getVaultItems === 'function' ? window.getVaultItems() : window.vaultItems) || [];
    const item = items.find(x => x.id === itemId);
    if (!item || !item.totpSecret) return false;
    try {
      const res = await generateTotp(item.totpSecret);
      if (typeof window.copyPasswordSilently === 'function') window.copyPasswordSilently(res.code);
      else if (navigator.clipboard) navigator.clipboard.writeText(res.code).catch(() => {});
      if (typeof window.startClipboardAutoWipe === 'function') window.startClipboardAutoWipe(res.code);
      if (typeof window.logAudit === 'function') window.logAudit('COPIED_TOTP', 'Copied 2FA code for: ' + (item.title || item.id));
      if (typeof window.showToast === 'function') window.showToast(`🔢 2FA Code ${res.formatted} copied! (${res.remaining}s left)`, '🔐');
      if (btnEl) {
        const prev = btnEl.innerHTML;
        btnEl.textContent = '✓ ' + res.formatted;
        setTimeout(() => { btnEl.innerHTML = prev; }, 1400);
      }
      return true;
    } catch(e) {
      if (typeof window.showToast === 'function') window.showToast('Invalid 2FA key: ' + e.message, '⚠️');
      return false;
    }
  };

  function isPasswordWeak(pwd, item) {
    if (!pwd) return 'Empty password';
    if (pwd.length < 10) return `Short (${pwd.length} chars < 10)`;
    const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z0-9]/].filter(rx => rx.test(pwd)).length;
    if (classes < 2) return 'Single character type only';
    const low = pwd.toLowerCase();
    if (/^(123456|password|qwerty|admin|letmein|welcome)/.test(low)) return 'Common predictable pattern';
    const titleWord = (item.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (titleWord.length >= 4 && low.includes(titleWord)) return 'Contains service name';
    return null;
  }

  function analyzeVault(items) {
    const active = (Array.isArray(items) ? items : []).filter(x => !x.trashed);
    const pwdCounts = new Map();
    active.forEach(it => {
      if (it.password) pwdCounts.set(it.password, (pwdCounts.get(it.password) || 0) + 1);
    });

    const findings = [];
    const counts = { total: active.length, breached: 0, reused: 0, weak: 0, old: 0, missing2fa: 0 };
    const now = Date.now();
    const OLD_MS = 180 * 86400000;
    const TWO_FA_CATS = ['Banking & Finance', 'Gmail', 'DepEd'];

    active.forEach(it => {
      const p = it.password || '';
      const breachNum = p ? (hibpBreachCache.get(p) || 0) : 0;
      if (breachNum > 0) {
        counts.breached++;
        findings.push({ type: 'breached', severity: 'breached', label: `Breached (${breachNum.toLocaleString()}×)`, item: it, targetField: 'editInputPassword' });
      }
      if (p && (pwdCounts.get(p) || 0) > 1) {
        counts.reused++;
        findings.push({ type: 'reused', severity: 'reused', label: `Reused on ${pwdCounts.get(p)} accounts`, item: it, targetField: 'editInputPassword' });
      }
      const weakReason = isPasswordWeak(p, it);
      if (weakReason) {
        counts.weak++;
        findings.push({ type: 'weak', severity: 'weak', label: weakReason, item: it, targetField: 'editInputPassword' });
      }
      const changedAt = Number(it.passwordChangedAt || it.updatedAt || 0);
      if (changedAt > 0 && (now - changedAt) > OLD_MS) {
        counts.old++;
        const days = Math.floor((now - changedAt) / 86400000);
        findings.push({ type: 'old', severity: 'old', label: `Last rotated ${days}d ago (>180d)`, item: it, targetField: 'editInputPassword' });
      }
      if (!it.totpSecret && (TWO_FA_CATS.includes(it.category) || (it.importance || '').toLowerCase() === 'critical')) {
        counts.missing2fa++;
        findings.push({ type: 'missing2fa', severity: '2fa', label: 'No built-in 2FA configured', item: it, targetField: 'editInputTotpSecret' });
      }
    });

    const penalty = (counts.breached * 14) + (counts.weak * 6) + (counts.reused * 4) + (counts.old * 1.5) + (counts.missing2fa * 1);
    const norm = active.length > 0 ? Math.min(95, (penalty / Math.max(1, active.length * 0.45)) * 18) : 0;
    const score = active.length === 0 ? 100 : Math.max(5, Math.round(100 - norm));
    const grade = score >= 95 ? 'A+' : (score >= 85 ? 'A' : (score >= 70 ? 'B' : (score >= 50 ? 'C' : 'D')));

    lastWatchtowerReport = { score, grade, counts, findings };
    updateWatchtowerBadge();
    return lastWatchtowerReport;
  }

  async function sha1HexUpper(text) {
    const buf = await window.crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  async function scanHibpBreaches(items, onProgress) {
    const active = (Array.isArray(items) ? items : []).filter(x => !x.trashed && x.password);
    const uniquePwds = Array.from(new Set(active.map(x => x.password)));
    const prefixMap = new Map();

    for (const pwd of uniquePwds) {
      const h = await sha1HexUpper(pwd);
      const prefix = h.slice(0, 5);
      const suffix = h.slice(5);
      if (!prefixMap.has(prefix)) prefixMap.set(prefix, []);
      prefixMap.get(prefix).push({ pwd, suffix });
    }

    const prefixes = Array.from(prefixMap.keys());
    for (let i = 0; i < prefixes.length; i++) {
      const prefix = prefixes[i];
      if (typeof onProgress === 'function') onProgress(i + 1, prefixes.length);
      try {
        const res = await fetch('https://api.pwnedpasswords.com/range/' + prefix, {
          headers: { 'Add-Padding': 'true' }
        });
        if (!res.ok) continue;
        const body = await res.text();
        const suffixCounts = new Map();
        body.split(/\r?\n/).forEach(line => {
          const parts = line.split(':');
          if (parts.length === 2) suffixCounts.set(parts[0].trim().toUpperCase(), parseInt(parts[1].trim(), 10) || 0);
        });
        prefixMap.get(prefix).forEach(({ pwd, suffix }) => {
          hibpBreachCache.set(pwd, suffixCounts.get(suffix) || 0);
        });
      } catch(e) {}
    }
    return analyzeVault(items);
  }

  function updateWatchtowerBadge() {
    const badge = document.getElementById('watchtowerIssueBadge');
    if (!badge) return;
    if (!window.isVaultUnlocked || !window.isVaultUnlocked()) {
      badge.textContent = '--';
      badge.className = 'wt-badge';
      return;
    }
    const items = (typeof window.getVaultItems === 'function' ? window.getVaultItems() : window.vaultItems) || [];
    const rep = analyzeVaultWithoutLoop(items);
    const urgent = rep.counts.breached + rep.counts.weak + rep.counts.reused;
    badge.textContent = urgent > 0 ? String(urgent) : '✓';
    badge.className = 'wt-badge ' + (rep.counts.breached > 0 || rep.counts.weak > 0 ? 'critical' : (urgent === 0 ? 'clean' : ''));
  }

  function analyzeVaultWithoutLoop(items) {
    // Quick count helper used by badge without triggering recursion
    const active = (Array.isArray(items) ? items : []).filter(x => !x.trashed);
    const pwdCounts = new Map();
    active.forEach(it => { if (it.password) pwdCounts.set(it.password, (pwdCounts.get(it.password) || 0) + 1); });
    let breached = 0, weak = 0, reused = 0;
    active.forEach(it => {
      if (it.password && (hibpBreachCache.get(it.password) || 0) > 0) breached++;
      if (isPasswordWeak(it.password || '', it)) weak++;
      if (it.password && (pwdCounts.get(it.password) || 0) > 1) reused++;
    });
    return { counts: { breached, weak, reused } };
  }

  function renderWatchtowerModal() {
    const body = document.getElementById('watchtowerBody');
    if (!body) return;
    const items = (typeof window.getVaultItems === 'function' ? window.getVaultItems() : window.vaultItems) || [];
    const rep = analyzeVault(items);
    const shown = currentWatchtowerFilter === 'all'
      ? rep.findings
      : rep.findings.filter(f => f.type === currentWatchtowerFilter);

    body.innerHTML = `
      <div class="wt-hero-row">
        <div style="display:flex;align-items:center;gap:14px;">
          <div class="wt-score-circle" style="border-color:${rep.score >= 85 ? '#10b981' : (rep.score >= 65 ? '#f59e0b' : '#ef4444')};">
            <div class="wt-score-val">${rep.score}</div>
            <div class="wt-score-grade">GRADE ${rep.grade}</div>
          </div>
          <div>
            <div style="font-size:15px;font-weight:800;color:#ffffff;">Security Health Watchtower</div>
            <div style="font-size:12px;color:#94a3b8;line-height:1.45;">
              Audited <strong>${rep.counts.total}</strong> active credentials 100% locally in RAM.
            </div>
          </div>
        </div>
        <button type="button" class="btn-sync-action primary" id="btnRunHibpScan" style="white-space:nowrap;">🔍 Scan Breaches (k-Anonymity)</button>
      </div>
      <div id="wtScanStatus" style="display:none;font-size:11.5px;color:#38bdf8;padding:4px 2px;"></div>
      <div class="wt-stats-grid">
        <button type="button" class="wt-stat-tile ${currentWatchtowerFilter === 'all' ? 'active' : ''}" data-wtf="all"><div class="wt-stat-num">${rep.findings.length}</div><div class="wt-stat-lbl">All Findings</div></button>
        <button type="button" class="wt-stat-tile ${currentWatchtowerFilter === 'breached' ? 'active' : ''}" data-wtf="breached"><div class="wt-stat-num" style="color:${rep.counts.breached ? '#fca5a5' : '#6ee7b7'}">${rep.counts.breached}</div><div class="wt-stat-lbl">Breached</div></button>
        <button type="button" class="wt-stat-tile ${currentWatchtowerFilter === 'reused' ? 'active' : ''}" data-wtf="reused"><div class="wt-stat-num" style="color:${rep.counts.reused ? '#fde047' : '#6ee7b7'}">${rep.counts.reused}</div><div class="wt-stat-lbl">Reused</div></button>
        <button type="button" class="wt-stat-tile ${currentWatchtowerFilter === 'weak' ? 'active' : ''}" data-wtf="weak"><div class="wt-stat-num" style="color:${rep.counts.weak ? '#fca5a5' : '#6ee7b7'}">${rep.counts.weak}</div><div class="wt-stat-lbl">Weak</div></button>
        <button type="button" class="wt-stat-tile ${currentWatchtowerFilter === 'old' ? 'active' : ''}" data-wtf="old"><div class="wt-stat-num">${rep.counts.old}</div><div class="wt-stat-lbl">Old (&gt;180d)</div></button>
        <button type="button" class="wt-stat-tile ${currentWatchtowerFilter === 'missing2fa' ? 'active' : ''}" data-wtf="missing2fa"><div class="wt-stat-num">${rep.counts.missing2fa}</div><div class="wt-stat-lbl">No 2FA</div></button>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${shown.length === 0
          ? '<div style="text-align:center;padding:24px;color:#6ee7b7;font-size:13px;">✅ Zero issues in this category!</div>'
          : shown.slice(0, 80).map(f => `
            <div class="wt-issue-row">
              <div style="min-width:0;flex:1;">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                  <strong style="color:#ffffff;font-size:13px;">${window.escapeHtml ? window.escapeHtml(f.item.title) : f.item.title}</strong>
                  <span class="wt-sev-pill wt-sev-${f.severity}">${window.escapeHtml ? window.escapeHtml(f.label) : f.label}</span>
                </div>
                <div style="font-size:11px;color:#94a3b8;margin-top:2px;">${window.escapeHtml ? window.escapeHtml(f.item.username || f.item.category || '') : ''}</div>
              </div>
              <button type="button" class="btn-wt-fix" data-fix-id="${f.item.id}" data-fix-field="${f.targetField}">✏️ Fix Now</button>
            </div>
          `).join('')}
      </div>
    `;

    body.querySelectorAll('[data-wtf]').forEach(btn => {
      btn.onclick = () => {
        currentWatchtowerFilter = btn.getAttribute('data-wtf');
        renderWatchtowerModal();
      };
    });
    body.querySelectorAll('.btn-wt-fix').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-fix-id');
        const fld = btn.getAttribute('data-fix-field') || 'editInputPassword';
        closeWatchtowerModal();
        if (typeof window.openCardEditor === 'function') window.openCardEditor(id, fld);
      };
    });
    const scanBtn = document.getElementById('btnRunHibpScan');
    if (scanBtn) {
      scanBtn.onclick = async () => {
        const statusEl = document.getElementById('wtScanStatus');
        scanBtn.disabled = true;
        scanBtn.textContent = '⏳ Checking SHA-1 prefixes...';
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.textContent = 'Privacy guarantee: only 5-char SHA-1 prefixes leave your device (k-anonymity).';
        }
        await scanHibpBreaches(items, (cur, tot) => {
          if (statusEl) statusEl.textContent = `Checking prefix group ${cur} / ${tot}...`;
        });
        renderWatchtowerModal();
      };
    }
  }

  function openWatchtowerModal() {
    const m = document.getElementById('watchtowerModal');
    if (!m) return;
    renderWatchtowerModal();
    m.classList.add('active');
  }
  function closeWatchtowerModal() {
    const m = document.getElementById('watchtowerModal');
    if (m) m.classList.remove('active');
  }

  window.VaultWatchtower = {
    analyzeVault,
    scanHibpBreaches,
    open: openWatchtowerModal,
    close: closeWatchtowerModal,
    render: renderWatchtowerModal,
    updateBadge: updateWatchtowerBadge,
    setHibpResultForTest: (pwd, count) => { hibpBreachCache.set(pwd, count); },
    clearCache: () => { hibpBreachCache.clear(); lastWatchtowerReport = null; updateWatchtowerBadge(); }
  };
})();
