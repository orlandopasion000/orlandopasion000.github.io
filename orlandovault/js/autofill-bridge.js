/* ==========================================================================
   ORLANDOVAULT PHASE 4: BROWSER AUTOFILL EXTENSION BRIDGE & QUICK-FILL HUB
   Syncs ONLY encrypted v4 envelopes (never plaintext) with Chrome/Edge Ext.
   ========================================================================== */
(function() {
  'use strict';

  const LS_ENC_CACHE = 'orlandovault_enc_cache_v4';
  const MULTI_PART_TLDS = new Set([
    'gov.ph', 'edu.ph', 'com.ph', 'org.ph', 'net.ph', 'mil.ph',
    'co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'com.au', 'co.jp', 'com.sg'
  ]);

  let extState = {
    detected: false,
    version: '',
    hasEnvelope: false,
    syncedAt: 0,
    unlocked: false
  };

  function refreshTopbarAutofillBadge() {
    const dot = document.getElementById('autofillTopbarDot');
    const btn = document.getElementById('btnTopbarAutofill');
    const isDomDetected = !!(document.documentElement && document.documentElement.getAttribute('data-orlandovault-ext'));
    if (isDomDetected && !extState.detected) {
      extState.detected = true;
      extState.version = document.documentElement.getAttribute('data-orlandovault-ext') || '1.0.0';
    }
    if (dot) {
      dot.className = 'autofill-dot ' + (extState.detected ? (extState.hasEnvelope ? 'synced' : 'connected') : '');
    }
    if (btn) {
      btn.title = extState.detected
        ? `Browser Autofill Extension v${extState.version || '1.0.0'} Connected`
        : 'Install Browser Autofill Companion Extension (Chrome / Edge)';
    }
  }

  function parseUrlSafe(urlStr) {
    if (!urlStr || typeof urlStr !== 'string') return null;
    try {
      const normalized = /^https?:\/\//i.test(urlStr.trim()) ? urlStr.trim() : ('https://' + urlStr.trim());
      return new URL(normalized);
    } catch (e) {
      return null;
    }
  }

  function extractRegistrableDomain(hostname) {
    const h = (hostname || '').toLowerCase().replace(/^www\./, '');
    if (!h) return '';
    if (h === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;
    const parts = h.split('.').filter(Boolean);
    if (parts.length <= 2) return parts.join('.');
    const tail2 = parts.slice(-2).join('.');
    if (MULTI_PART_TLDS.has(tail2) && parts.length >= 3) return parts.slice(-3).join('.');
    return tail2;
  }

  function resolveItemUrls(item) {
    const out = [];
    const combined = (item && item.metadata ? item.metadata : '') + ' ' + (item && item.notes ? item.notes : '');
    const rx = /https?:\/\/[^\s,;|)"'<>]+/gi;
    let m;
    while ((m = rx.exec(combined)) !== null) out.push(m[0].replace(/[.,;)]+$/, ''));
    const t = ((item && item.title) || '').toLowerCase();
    const cat = ((item && item.category) || '').toLowerCase();
    if (t.includes('gmail') || t.includes('google') || cat.includes('gmail')) out.push('https://accounts.google.com/', 'https://mail.google.com/');
    if (t.includes('facebook') || /\bmeta\b/.test(t)) out.push('https://www.facebook.com/');
    if (t.includes('netflix')) out.push('https://www.netflix.com/');
    if (t.includes('github')) out.push('https://github.com/');
    if (t.includes('claude')) out.push('https://claude.ai/');
    if (t.includes('chatgpt') || t.includes('openai')) out.push('https://chatgpt.com/');
    if (t.includes('bpi')) out.push('https://online.bpi.com.ph/');
    if (t.includes('bdo')) out.push('https://online.bdo.com.ph/');
    if (t.includes('landbank')) out.push('https://www.lbpiaccess.com/');
    if (t.includes('deped')) out.push('https://lis.deped.gov.ph/', 'https://deped.gov.ph/');
    if (t.includes('microsoft') || cat.includes('microsoft')) out.push('https://login.microsoftonline.com/');
    if (/\bprc\b/.test(t)) out.push('https://online.prc.gov.ph/');
    return out;
  }

  function matchAccountsForUrl(urlStr, items) {
    const target = parseUrlSafe(urlStr);
    if (!target || !Array.isArray(items)) return [];
    const targetHost = target.hostname.toLowerCase();
    const targetReg = extractRegistrableDomain(targetHost);
    const out = [];
    items.forEach(item => {
      if (!item || item.trashed) return;
      const cands = resolveItemUrls(item);
      let best = 0;
      for (const c of cands) {
        const cu = parseUrlSafe(c);
        if (!cu) continue;
        const ch = cu.hostname.toLowerCase();
        const cr = extractRegistrableDomain(ch);
        if (ch === targetHost) best = Math.max(best, 100);
        else if (targetReg && cr && targetReg === cr) best = Math.max(best, 85);
      }
      if (best > 0) out.push({ item, score: best, launchUrl: cands[0] || target.href });
    });
    return out.sort((a, b) => b.score - a.score);
  }

  function pingExtension() {
    refreshTopbarAutofillBadge();
    try {
      window.postMessage({ source: 'ORLANDOVAULT_WEB', type: 'PING_EXT' }, window.location.origin);
    } catch (e) {}
  }

  function syncEnvelopeToExtension(showFeedback = false) {
    try {
      const raw = localStorage.getItem(LS_ENC_CACHE);
      if (!raw) {
        if (showFeedback && typeof window.showToast === 'function') {
          window.showToast('Unlock OrlandoVault first to prepare the encrypted extension envelope.', '⚠️');
        }
        return false;
      }
      const env = JSON.parse(raw);
      if (!env || env.v !== 4 || !env.encryptedData || !env.saltHex || !env.keyCanary) {
        return false;
      }
      window.postMessage({ source: 'ORLANDOVAULT_WEB', type: 'SYNC_ENCRYPTED_ENVELOPE', envelope: env }, window.location.origin);
      if (showFeedback && typeof window.showToast === 'function') {
        window.showToast(
          extState.detected
            ? '🧩 Encrypted v4 Vault Envelope synced to Browser Extension!'
            : '🧩 Synced envelope posted. Load the Chrome/Edge extension to receive live updates.',
          '⚡'
        );
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window || !event.data || event.data.source !== 'ORLANDOVAULT_EXT') return;
    const d = event.data;
    if (d.type === 'EXT_READY') {
      extState.detected = true;
      extState.version = d.version || '1.0.0';
      pingExtension();
      syncEnvelopeToExtension(false);
    } else if (d.type === 'EXT_STATUS') {
      extState.detected = true;
      extState.hasEnvelope = !!d.hasEnvelope;
      extState.syncedAt = d.syncedAt || 0;
      extState.unlocked = !!d.unlocked;
    } else if (d.type === 'EXT_SYNC_ACK' && d.ok) {
      extState.detected = true;
      extState.hasEnvelope = true;
      extState.syncedAt = d.syncedAt || Date.now();
    }
    refreshTopbarAutofillBadge();
    const modal = document.getElementById('autofillHubModal');
    if (modal && modal.classList.contains('active')) renderAutofillHub();
  });

  function renderAutofillHub() {
    refreshTopbarAutofillBadge();
    const body = document.getElementById('autofillHubBody');
    if (!body) return;

    const statusBadge = extState.detected
      ? `<span class="af-status-pill connected">🟢 Extension Active (v${extState.version || '1.0.0'})${extState.hasEnvelope ? ' · Envelope Synced' : ''}</span>`
      : '<span class="af-status-pill">🧩 Extension Not Loaded in This Browser</span>';

    const syncedLabel = extState.syncedAt
      ? 'Last synced: ' + new Date(extState.syncedAt).toLocaleString()
      : 'Pair automatically when unlocked, or import an encrypted .ovault backup inside the extension.';

    const testUrlVal = document.getElementById('afTestUrlInput')?.value || 'https://lis.deped.gov.ph';
    const items = (typeof window.getVaultItems === 'function' ? window.getVaultItems() : window.vaultItems) || [];
    const matched = matchAccountsForUrl(testUrlVal, items);
    const esc = window.escapeHtml || (s => String(s || ''));

    body.innerHTML = `
      <div class="af-hero-box">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <div>
            <div style="font-size:15px;font-weight:800;color:#ffffff;">Browser Autofill &amp; Quick-Fill Companion</div>
            <div style="font-size:11.5px;color:#94a3b8;margin-top:3px;">${esc(syncedLabel)}</div>
          </div>
          ${statusBadge}
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
          <a href="downloads/orlandovault-autofill-extension.zip" download="orlandovault-autofill-extension.zip" class="btn-sync-action primary" id="btnDownloadExtZip" style="text-decoration:none;">📦 Download Chrome / Edge Extension (.zip)</a>
          <button type="button" class="btn-sync-action" id="btnTriggerExtSyncNow">🔄 Sync Encrypted Vault Now</button>
          <button type="button" class="btn-sync-action" id="btnCopyExtUrl">📋 Copy chrome://extensions</button>
        </div>
      </div>

      <div class="af-install-steps">
        <div style="font-size:12px;font-weight:800;color:#7dd3fc;margin-bottom:6px;">⚡ 3-Step Chrome / Edge Extension Setup (Zero-Knowledge)</div>
        <div class="af-step-row"><span>1</span><span>Download &amp; extract <code>orlandovault-autofill-extension.zip</code> into a folder on your PC.</span></div>
        <div class="af-step-row"><span>2</span><span>Open <code>chrome://extensions</code> (or <code>edge://extensions</code>) and switch <strong>Developer mode</strong> ON.</span></div>
        <div class="af-step-row"><span>3</span><span>Click <strong>Load unpacked</strong>, pick the folder, then unlock OrlandoVault once — ciphertext syncs automatically!</span></div>
        <div style="margin-top:8px;font-size:11px;color:#94a3b8;">Shortcuts: <kbd>Alt+Shift+O</kbd> open popup · <kbd>Alt+Shift+L</kbd> instant-fill Login + 6-digit 2FA on any website.</div>
      </div>

      <div class="af-matcher-box">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
          <strong style="font-size:12px;color:#6ee7b7;">🎯 Quick-Fill Website Matcher Tester</strong>
          <span style="font-size:11px;color:#94a3b8;">Phishing-safe domain verification</span>
        </div>
        <input type="text" id="afTestUrlInput" class="vault-gate-input" value="${esc(testUrlVal)}" placeholder="Enter URL to test e.g. https://lis.deped.gov.ph" style="width:100%;padding:8px 10px;font-size:12.5px;margin-bottom:10px;">
        <div id="afMatchedRows" style="display:flex;flex-direction:column;gap:7px;">
          ${matched.length === 0
            ? '<div style="font-size:12px;color:#94a3b8;padding:10px;text-align:center;">No active vault accounts match that domain yet. Add the website URL in Metadata to link it.</div>'
            : matched.slice(0, 6).map(m => `
              <div class="af-match-card">
                <div style="min-width:0;flex:1;">
                  <div style="font-size:13px;font-weight:700;color:#ffffff;">${esc(m.item.title)}</div>
                  <div style="font-size:11px;color:#94a3b8;">${esc(m.item.username)} · Score ${m.score}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" class="btn-sync-action" data-af-pass="${esc(m.item.id)}" data-af-url="${esc(m.launchUrl)}" style="padding:5px 10px;font-size:11px;">⚡ Copy Pass &amp; Open ↗</button>
                  ${m.item.totpSecret ? `<button type="button" class="btn-sync-action primary" data-af-totp="${esc(m.item.id)}" data-af-url="${esc(m.launchUrl)}" style="padding:5px 10px;font-size:11px;">🔐 Copy 2FA &amp; Open ↗</button>` : ''}
                </div>
              </div>
            `).join('')}
        </div>
      </div>
    `;

    document.getElementById('btnTriggerExtSyncNow')?.addEventListener('click', () => syncEnvelopeToExtension(true));
    document.getElementById('btnCopyExtUrl')?.addEventListener('click', () => {
      if (navigator.clipboard) navigator.clipboard.writeText('chrome://extensions').catch(() => {});
      if (typeof window.showToast === 'function') window.showToast('📋 Copied chrome://extensions — paste into your address bar!', '🧩');
    });
    const urlInput = document.getElementById('afTestUrlInput');
    if (urlInput) {
      urlInput.addEventListener('input', () => {
        const list = document.getElementById('afMatchedRows');
        if (!list) return;
        const fresh = matchAccountsForUrl(urlInput.value, items);
        list.innerHTML = fresh.length === 0
          ? '<div style="font-size:12px;color:#94a3b8;padding:10px;text-align:center;">No active vault accounts match that domain yet.</div>'
          : fresh.slice(0, 6).map(m => `
            <div class="af-match-card">
              <div style="min-width:0;flex:1;">
                <div style="font-size:13px;font-weight:700;color:#ffffff;">${esc(m.item.title)}</div>
                <div style="font-size:11px;color:#94a3b8;">${esc(m.item.username)} · Score ${m.score}</div>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button type="button" class="btn-sync-action" data-af-pass="${esc(m.item.id)}" data-af-url="${esc(m.launchUrl)}" style="padding:5px 10px;font-size:11px;">⚡ Copy Pass &amp; Open ↗</button>
                ${m.item.totpSecret ? `<button type="button" class="btn-sync-action primary" data-af-totp="${esc(m.item.id)}" data-af-url="${esc(m.launchUrl)}" style="padding:5px 10px;font-size:11px;">🔐 Copy 2FA &amp; Open ↗</button>` : ''}
              </div>
            </div>
          `).join('');
        wireLaunchButtons(list);
      });
    }
    wireLaunchButtons(body);
  }

  function wireLaunchButtons(container) {
    container.querySelectorAll('[data-af-pass]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-af-pass');
        const url = btn.getAttribute('data-af-url');
        if (typeof window.copyPasswordById === 'function') window.copyPasswordById(id, btn, false);
        if (url) try { window.open(url, '_blank', 'noopener,noreferrer'); } catch (e) {}
      };
    });
    container.querySelectorAll('[data-af-totp]').forEach(btn => {
      btn.onclick = async () => {
        const id = btn.getAttribute('data-af-totp');
        const url = btn.getAttribute('data-af-url');
        if (typeof window.copyTotpById === 'function') await window.copyTotpById(id, btn);
        if (url) try { window.open(url, '_blank', 'noopener,noreferrer'); } catch (e) {}
      };
    });
  }

  function openAutofillHub() {
    const m = document.getElementById('autofillHubModal');
    if (!m) return;
    pingExtension();
    renderAutofillHub();
    m.classList.add('active');
  }

  function closeAutofillHub() {
    const m = document.getElementById('autofillHubModal');
    if (m) m.classList.remove('active');
  }

  window.VaultAutofillBridge = {
    ping: pingExtension,
    syncEnvelopeToExtension,
    matchAccountsForUrl,
    getState: () => Object.assign({}, extState),
    open: openAutofillHub,
    close: closeAutofillHub,
    render: renderAutofillHub
  };

  document.addEventListener('DOMContentLoaded', () => {
    refreshTopbarAutofillBadge();
    pingExtension();
    setTimeout(pingExtension, 450);
  });
})();
