/* ==========================================================================
   ORLANDOVAULT PHASE 5: STRUCTURED TEMPLATES (GOV ID, BANK CARD, WI-FI QR,
   RECOVERY CODES) & PRINTABLE EMERGENCY VAULT RECOVERY KIT
   ========================================================================== */
(function() {
  'use strict';

  const RECORD_TYPES = [
    { id: 'login', icon: '🔑', label: 'Login' },
    { id: 'gov_id', icon: '🪪', label: 'Gov ID' },
    { id: 'bank_card', icon: '💳', label: 'Bank Card' },
    { id: 'wifi', icon: '📶', label: 'Wi-Fi QR' },
    { id: 'recovery_codes', icon: '🛟', label: 'Recovery' }
  ];

  const GOV_ID_PRESETS = {
    PRC: {
      title: 'PRC Professional License',
      agency: 'Professional Regulation Commission (PRC)',
      url: 'https://online.prc.gov.ph/'
    },
    LTO: {
      title: "LTO Driver's License",
      agency: 'Land Transportation Office (LTO)',
      url: 'https://portal.lto.gov.ph/'
    },
    TIN: {
      title: 'BIR Taxpayer Identification (TIN)',
      agency: 'Bureau of Internal Revenue (BIR)',
      url: 'https://orus.bir.gov.ph/'
    },
    PhilHealth: {
      title: 'PhilHealth Member ID',
      agency: 'PhilHealth',
      url: 'https://memberinquiry.philhealth.gov.ph/'
    },
    'Pag-IBIG': {
      title: 'Pag-IBIG Loyalty / MID',
      agency: 'Pag-IBIG Fund',
      url: 'https://www.pagibigfundservices.com/virtualpagibig/'
    },
    GSIS: {
      title: 'GSIS / UMID Card',
      agency: 'GSIS',
      url: 'https://touch.gsis.gov.ph/'
    },
    Passport: {
      title: 'Philippine Passport',
      agency: 'Department of Foreign Affairs (DFA)',
      url: 'https://passport.gov.ph/'
    },
    PhilSys: {
      title: 'PhilSys National ID',
      agency: 'Philippine Statistics Authority (PSA)',
      url: 'https://everify.gov.ph/'
    }
  };

  let activeEditorType = 'login';

  function esc(str) {
    if (typeof window.escapeHtml === 'function') return window.escapeHtml(str);
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function maskLast4(val) {
    const raw = String(val || '').trim();
    if (!raw) return 'Not set';
    const clean = raw.replace(/\s+/g, '');
    if (clean.length <= 4) return '••••';
    if (/^\d{13,19}$/.test(clean)) {
      return clean.slice(0, 4) + ' •••• •••• ' + clean.slice(-4);
    }
    return '•••• ' + clean.slice(-4);
  }

  function formatCardNumberDisplay(num) {
    const digits = String(num || '').replace(/\s+/g, '');
    if (/^\d{13,19}$/.test(digits)) {
      return digits.replace(/(.{4})/g, '$1 ').trim();
    }
    return String(num || '');
  }

  function evaluateItemExpiry(item, nowMs = Date.now()) {
    if (!item || !item.templateData) return { status: 'none', daysLeft: null, label: '' };
    const rType = item.recordType || 'login';
    let targetMs = null;

    if (rType === 'gov_id' && item.templateData.expiryDate) {
      const m = String(item.templateData.expiryDate).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (m) {
        targetMs = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10), 23, 59, 59).getTime();
      }
    } else if (rType === 'bank_card' && item.templateData.expiryMonthYear) {
      const m = String(item.templateData.expiryMonthYear).trim().match(/^(\d{1,2})\s*\/\s*(\d{2}|\d{4})$/);
      if (m) {
        const month = Math.max(1, Math.min(12, parseInt(m[1], 10)));
        const yrRaw = parseInt(m[2], 10);
        const year = yrRaw < 100 ? 2000 + yrRaw : yrRaw;
        targetMs = new Date(year, month, 0, 23, 59, 59).getTime();
      }
    }

    if (!targetMs || isNaN(targetMs)) return { status: 'none', daysLeft: null, label: '' };
    const daysLeft = Math.ceil((targetMs - nowMs) / 86400000);
    if (daysLeft < 0) {
      return { status: 'expired', daysLeft, label: `Expired ${Math.abs(daysLeft)}d ago` };
    }
    if (daysLeft <= 60) {
      return { status: 'expiring', daysLeft, label: `Expires in ${daysLeft}d` };
    }
    return { status: 'valid', daysLeft, label: `Valid (${daysLeft}d)` };
  }

  function escapeWifiField(val) {
    return String(val || '').replace(/([\\;,:"])/g, '\\$1');
  }

  function buildWifiQrPayload(ssid, password, security = 'WPA', hidden = false) {
    const sec = (security || 'WPA').toUpperCase();
    const tVal = sec === 'NOPASS' || sec === 'OPEN' ? 'nopass' : (sec === 'WEP' ? 'WEP' : 'WPA');
    const passPart = tVal === 'nopass' ? '' : escapeWifiField(password || '');
    return `WIFI:T:${tVal};S:${escapeWifiField(ssid || '')};P:${passPart};H:${hidden ? 'true' : 'false'};;`;
  }

  function renderWifiQrSvg(ssid, password, security = 'WPA', hidden = false) {
    const payload = buildWifiQrPayload(ssid, password, security, hidden);
    if (typeof window.qrcode === 'function') {
      try {
        const qr = window.qrcode(0, 'M');
        qr.addData(payload);
        qr.make();
        const count = qr.getModuleCount();
        const margin = 3;
        const total = count + margin * 2;
        let d = '';
        for (let r = 0; r < count; r++) {
          for (let c = 0; c < count; c++) {
            if (qr.isDark(r, c)) {
              d += `M${c + margin},${r + margin}h1v1h-1z`;
            }
          }
        }
        return `<svg viewBox="0 0 ${total} ${total}" width="184" height="184" shape-rendering="crispEdges" role="img" aria-label="Wi-Fi QR Code for ${esc(ssid)}"><rect width="100%" height="100%" fill="#ffffff" rx="2"/><path d="${d}" fill="#0f172a"/></svg>`;
      } catch (e) {}
    }
    return `<div style="padding:14px;background:#fff;color:#0f172a;border-radius:10px;font-family:monospace;font-size:11px;word-break:break-all;">${esc(payload)}</div>`;
  }

  function parseRecoveryCodesText(rawText, prevCodes = []) {
    const prevMap = new Map();
    if (Array.isArray(prevCodes)) {
      prevCodes.forEach(c => {
        if (c && c.code) prevMap.set(c.code.trim(), c);
      });
    }
    const tokens = String(rawText || '')
      .split(/[\r\n,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
    const seen = new Set();
    const out = [];
    tokens.forEach(tok => {
      if (seen.has(tok)) return;
      seen.add(tok);
      const old = prevMap.get(tok);
      out.push({
        code: tok,
        used: !!(old && old.used),
        usedAt: old && old.usedAt ? old.usedAt : 0
      });
    });
    return out;
  }

  function formatRecoveryCodesText(codes) {
    if (!Array.isArray(codes)) return '';
    return codes.map(c => (c && c.code ? c.code : '')).filter(Boolean).join('\n');
  }

  function renderScanUploadSectionHtml() {
    return `
      <div class="tpl-scan-upload-box">
        <div class="tpl-scan-upload-head">📷 ENCRYPTED PHOTO SCANS (FRONT / BACK · E2E AES-GCM)</div>
        <div class="tpl-scan-upload-row">
          <div class="tpl-scan-slot">
            <input type="file" id="inputScanFront" accept="image/*" style="display:none;">
            <button type="button" class="btn-tpl-copy" id="btnPickScanFront">📷 Front Scan</button>
            <button type="button" class="btn-tpl-copy" id="btnRemoveScanFront" style="display:none;color:#fca5a5;">✕</button>
            <span class="tpl-scan-status" id="lblScanFrontStatus">None</span>
          </div>
          <div class="tpl-scan-slot">
            <input type="file" id="inputScanBack" accept="image/*" style="display:none;">
            <button type="button" class="btn-tpl-copy" id="btnPickScanBack">📷 Back Scan</button>
            <button type="button" class="btn-tpl-copy" id="btnRemoveScanBack" style="display:none;color:#fca5a5;">✕</button>
            <span class="tpl-scan-status" id="lblScanBackStatus">None</span>
          </div>
        </div>
      </div>
    `;
  }

  function bindEditorScanUploadControls() {
    const wireSide = (side, inputId, pickBtnId, rmBtnId) => {
      const inp = document.getElementById(inputId);
      const pick = document.getElementById(pickBtnId);
      const rm = document.getElementById(rmBtnId);
      if (pick && inp) pick.onclick = () => inp.click();
      if (inp) {
        inp.onchange = async () => {
          const f = inp.files && inp.files[0];
          if (!f || !window.VaultEncryptedScans) return;
          try {
            await window.VaultEncryptedScans.stageEditorScan(side, f);
            if (typeof window.showToast === 'function') window.showToast(`📷 ${side === 'back' ? 'Back' : 'Front'} scan staged for AES-GCM encryption.`, '🛡️');
          } catch (err) {
            if (typeof window.showToast === 'function') window.showToast('Scan error: ' + err.message, '❌');
          }
          inp.value = '';
        };
      }
      if (rm) {
        rm.onclick = () => {
          if (window.VaultEncryptedScans) window.VaultEncryptedScans.clearStagedEditorScan(side);
        };
      }
    };
    wireSide('front', 'inputScanFront', 'btnPickScanFront', 'btnRemoveScanFront');
    wireSide('back', 'inputScanBack', 'btnPickScanBack', 'btnRemoveScanBack');
    if (window.VaultEncryptedScans && typeof window.VaultEncryptedScans.refreshEditorScanStatusLabels === 'function') {
      window.VaultEncryptedScans.refreshEditorScanStatusLabels();
    }
  }

  function renderStructuredEditorFields(type, td = {}) {
    const host = document.getElementById('editStructuredFieldsHost');
    if (!host) return;

    if (type === 'login') {
      host.style.display = 'none';
      host.innerHTML = '';
      return;
    }

    host.style.display = 'flex';
    if (type === 'gov_id') {
      const presetBtns = Object.keys(GOV_ID_PRESETS).map(k =>
        `<button type="button" class="gov-preset-chip ${td.idType === k ? 'active' : ''}" data-gov-preset="${esc(k)}">${esc(k)}</button>`
      ).join('');
      host.innerHTML = `
        <div class="tpl-section-box">
          <div class="tpl-section-title">🪪 PHILIPPINE GOVERNMENT ID PRESETS</div>
          <div class="gov-preset-row">${presetBtns}</div>
          <input type="hidden" id="tplGovIdType" value="${esc(td.idType || '')}">
          <div class="tpl-two-col">
            <div class="edit-form-group" style="margin:0;">
              <label class="edit-form-label" for="tplGovIdNumber">ID / LICENSE NUMBER:</label>
              <input type="text" class="edit-form-input" id="tplGovIdNumber" autocomplete="off" value="${esc(td.idNumber || '')}" placeholder="e.g. 0123456">
            </div>
            <div class="edit-form-group" style="margin:0;">
              <label class="edit-form-label" for="tplGovHolderName">FULL NAME ON ID:</label>
              <input type="text" class="edit-form-input" id="tplGovHolderName" autocomplete="off" value="${esc(td.holderName || '')}" placeholder="e.g. Orlando V. Pasion Jr.">
            </div>
          </div>
          <div class="edit-form-group" style="margin:6px 0 0;">
            <label class="edit-form-label" for="tplGovAgency">ISSUING AGENCY:</label>
            <input type="text" class="edit-form-input" id="tplGovAgency" autocomplete="off" value="${esc(td.agency || '')}" placeholder="e.g. Professional Regulation Commission (PRC)">
          </div>
          <div class="tpl-two-col" style="margin-top:6px;">
            <div class="edit-form-group" style="margin:0;">
              <label class="edit-form-label" for="tplGovIssueDate">ISSUE DATE:</label>
              <input type="date" class="edit-form-input" id="tplGovIssueDate" value="${esc(td.issueDate || '')}">
            </div>
            <div class="edit-form-group" style="margin:0;">
              <label class="edit-form-label" for="tplGovExpiryDate">EXPIRATION DATE:</label>
              <input type="date" class="edit-form-input" id="tplGovExpiryDate" value="${esc(td.expiryDate || '')}">
            </div>
          </div>
          ${renderScanUploadSectionHtml()}
        </div>
      `;
      bindEditorScanUploadControls();
      host.querySelectorAll('[data-gov-preset]').forEach(btn => {
        btn.onclick = () => {
          const k = btn.getAttribute('data-gov-preset');
          const p = GOV_ID_PRESETS[k];
          if (!p) return;
          host.querySelectorAll('[data-gov-preset]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const idTypeEl = document.getElementById('tplGovIdType');
          const agencyEl = document.getElementById('tplGovAgency');
          const titleEl = document.getElementById('editInputTitle');
          const metaEl = document.getElementById('editInputMetadata');
          const catEl = document.getElementById('editSelectCategory');
          if (idTypeEl) idTypeEl.value = k;
          if (agencyEl) agencyEl.value = p.agency;
          if (titleEl && !titleEl.value.trim()) titleEl.value = p.title;
          if (metaEl && !metaEl.value.trim()) metaEl.value = p.url;
          if (catEl && catEl.querySelector('option[value="IDs & Cards"]')) catEl.value = 'IDs & Cards';
        };
      });
      return;
    }

    if (type === 'bank_card') {
      const brandOpts = ['Visa', 'Mastercard', 'BancNet', 'JCB', 'Amex', 'Debit / ATM'];
      host.innerHTML = `
        <div class="tpl-section-box">
          <div class="tpl-section-title">💳 ENCRYPTED BANK / CREDIT CARD VAULT</div>
          <div class="tpl-two-col">
            <div class="edit-form-group" style="margin:0;">
              <label class="edit-form-label" for="tplCardBrand">CARD BRAND:</label>
              <select class="edit-form-select" id="tplCardBrand">
                ${brandOpts.map(b => `<option value="${b}" ${(td.brand || 'Visa') === b ? 'selected' : ''}>${b}</option>`).join('')}
              </select>
            </div>
            <div class="edit-form-group" style="margin:0;">
              <label class="edit-form-label" for="tplCardExpiry">EXPIRY (MM/YY):</label>
              <input type="text" class="edit-form-input" id="tplCardExpiry" autocomplete="off" value="${esc(td.expiryMonthYear || '')}" placeholder="08/29">
            </div>
          </div>
          <div class="edit-form-group" style="margin:6px 0 0;">
            <label class="edit-form-label" for="tplCardNumber">CARD NUMBER:</label>
            <input type="text" class="edit-form-input" id="tplCardNumber" autocomplete="off" value="${esc(td.cardNumber || '')}" placeholder="4532 8910 3344 8821">
          </div>
          <div class="tpl-two-col" style="margin-top:6px;">
            <div class="edit-form-group" style="margin:0;">
              <label class="edit-form-label" for="tplCardHolder">CARDHOLDER NAME:</label>
              <input type="text" class="edit-form-input" id="tplCardHolder" autocomplete="off" value="${esc(td.cardHolder || '')}" placeholder="ORLANDO V PASION JR">
            </div>
            <div class="tpl-two-col" style="margin:0;">
              <div class="edit-form-group" style="margin:0;">
                <label class="edit-form-label" for="tplCardCvv">CVV / CVC:</label>
                <input type="text" class="edit-form-input" id="tplCardCvv" autocomplete="off" value="${esc(td.cvv || '')}" placeholder="842">
              </div>
              <div class="edit-form-group" style="margin:0;">
                <label class="edit-form-label" for="tplCardPin">ATM PIN:</label>
                <input type="text" class="edit-form-input" id="tplCardPin" autocomplete="off" value="${esc(td.atmPin || '')}" placeholder="Optional">
              </div>
            </div>
          </div>
          ${renderScanUploadSectionHtml()}
        </div>
      `;
      bindEditorScanUploadControls();
      return;
    }

    if (type === 'wifi') {
      const secOpts = ['WPA', 'WEP', 'nopass'];
      host.innerHTML = `
        <div class="tpl-section-box">
          <div class="tpl-section-title">📶 WI-FI NETWORK & PHONE QR SHARING</div>
          <div class="tpl-two-col">
            <div class="edit-form-group" style="margin:0;">
              <label class="edit-form-label" for="tplWifiSsid">NETWORK NAME (SSID):</label>
              <input type="text" class="edit-form-input" id="tplWifiSsid" autocomplete="off" value="${esc(td.ssid || '')}" placeholder="e.g. Pasion_Home_5G">
            </div>
            <div class="edit-form-group" style="margin:0;">
              <label class="edit-form-label" for="tplWifiSecurity">SECURITY:</label>
              <select class="edit-form-select" id="tplWifiSecurity">
                ${secOpts.map(s => `<option value="${s}" ${(td.security || 'WPA') === s ? 'selected' : ''}>${s === 'nopass' ? 'Open (No Password)' : s + ' / WPA2 / WPA3'}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="tpl-two-col" style="margin-top:6px;align-items:center;">
            <div class="edit-form-group" style="margin:0;">
              <label class="edit-form-label" for="tplWifiRouterUrl">ROUTER ADMIN URL:</label>
              <input type="text" class="edit-form-input" id="tplWifiRouterUrl" autocomplete="off" value="${esc(td.routerUrl || '')}" placeholder="http://192.168.1.1">
            </div>
            <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:#cbd5e1;padding-top:16px;cursor:pointer;">
              <input type="checkbox" id="tplWifiHidden" ${td.hidden ? 'checked' : ''}>
              <span>Hidden SSID</span>
            </label>
          </div>
        </div>
      `;
      return;
    }

    if (type === 'recovery_codes') {
      const textVal = formatRecoveryCodesText(td.codes);
      const count = Array.isArray(td.codes) ? td.codes.length : 0;
      host.innerHTML = `
        <div class="tpl-section-box">
          <div class="tpl-section-title" style="display:flex;justify-content:space-between;align-items:center;">
            <span>🛟 BACKUP &amp; 2FA RECOVERY CODES</span>
            <span id="tplRecoveryCountBadge" class="wt-badge clean">${count} codes</span>
          </div>
          <textarea class="edit-form-textarea" id="tplRecoveryCodesInput" rows="5" spellcheck="false" placeholder="Paste one recovery code per line (or comma-separated)...">${esc(textVal)}</textarea>
        </div>
      `;
      const ta = document.getElementById('tplRecoveryCodesInput');
      if (ta) {
        ta.addEventListener('input', () => {
          const parsed = parseRecoveryCodesText(ta.value, []);
          const badge = document.getElementById('tplRecoveryCountBadge');
          if (badge) badge.textContent = parsed.length + ' codes';
        });
      }
    }
  }

  function applyEditorVisibilityForType(type) {
    const userGroup = document.getElementById('editInputUsername')?.closest('.edit-form-group');
    const pwdGroup = document.getElementById('editInputPassword')?.closest('.edit-form-group');
    const totpGroup = document.getElementById('editInputTotpSecret')?.closest('.edit-form-group');
    const pwdLabel = document.querySelector('label[for="editInputPassword"]');

    if (userGroup) userGroup.style.display = type === 'login' ? '' : 'none';
    if (pwdGroup) pwdGroup.style.display = (type === 'login' || type === 'wifi') ? '' : 'none';
    if (totpGroup) totpGroup.style.display = type === 'login' ? '' : 'none';
    if (pwdLabel) {
      pwdLabel.textContent = type === 'wifi' ? 'WI-FI PASSWORD:' : 'PASSWORD:';
    }
  }

  function renderRecordTypeBar() {
    const bar = document.getElementById('editRecordTypeBar');
    if (!bar) return;
    bar.innerHTML = RECORD_TYPES.map(rt =>
      `<button type="button" class="record-type-pill ${activeEditorType === rt.id ? 'active' : ''}" data-record-type="${rt.id}">${rt.icon} ${rt.label}</button>`
    ).join('');
    bar.querySelectorAll('[data-record-type]').forEach(btn => {
      btn.onclick = () => {
        const next = btn.getAttribute('data-record-type') || 'login';
        setEditorType(next);
      };
    });
  }

  function setEditorType(type, existingTemplateData) {
    activeEditorType = RECORD_TYPES.some(r => r.id === type) ? type : 'login';
    renderRecordTypeBar();
    renderStructuredEditorFields(activeEditorType, existingTemplateData || {});
    applyEditorVisibilityForType(activeEditorType);
    const catSel = document.getElementById('editSelectCategory');
    const cardId = (document.getElementById('editCardId') || {}).value;
    if (!cardId && activeEditorType !== 'login' && catSel && catSel.querySelector('option[value="IDs & Cards"]')) {
      catSel.value = 'IDs & Cards';
    }
  }

  function populateEditorForItem(item) {
    if (window.VaultEncryptedScans && typeof window.VaultEncryptedScans.resetEditorScansForItem === 'function') {
      window.VaultEncryptedScans.resetEditorScansForItem(item && item.id ? item.id : '');
    }
    const rType = (item && item.recordType) || 'login';
    setEditorType(rType, (item && item.templateData) || {});
  }

  function collectEditorTemplatePayload(existingItem) {
    const rType = activeEditorType || 'login';
    if (rType === 'login') {
      return { recordType: 'login', templateData: null, autoUsername: null };
    }
    if (rType === 'gov_id') {
      const td = {
        idType: (document.getElementById('tplGovIdType')?.value || '').trim(),
        idNumber: (document.getElementById('tplGovIdNumber')?.value || '').trim(),
        holderName: (document.getElementById('tplGovHolderName')?.value || '').trim(),
        agency: (document.getElementById('tplGovAgency')?.value || '').trim(),
        issueDate: (document.getElementById('tplGovIssueDate')?.value || '').trim(),
        expiryDate: (document.getElementById('tplGovExpiryDate')?.value || '').trim()
      };
      return { recordType: 'gov_id', templateData: td, autoUsername: td.idNumber || td.agency || '' };
    }
    if (rType === 'bank_card') {
      const td = {
        brand: (document.getElementById('tplCardBrand')?.value || 'Visa').trim(),
        cardNumber: (document.getElementById('tplCardNumber')?.value || '').trim(),
        cardHolder: (document.getElementById('tplCardHolder')?.value || '').trim(),
        expiryMonthYear: (document.getElementById('tplCardExpiry')?.value || '').trim(),
        cvv: (document.getElementById('tplCardCvv')?.value || '').trim(),
        atmPin: (document.getElementById('tplCardPin')?.value || '').trim()
      };
      return {
        recordType: 'bank_card',
        templateData: td,
        autoUsername: td.cardNumber ? maskLast4(td.cardNumber) : (td.cardHolder || td.brand)
      };
    }
    if (rType === 'wifi') {
      const td = {
        ssid: (document.getElementById('tplWifiSsid')?.value || '').trim(),
        security: (document.getElementById('tplWifiSecurity')?.value || 'WPA').trim(),
        routerUrl: (document.getElementById('tplWifiRouterUrl')?.value || '').trim(),
        hidden: !!document.getElementById('tplWifiHidden')?.checked
      };
      return { recordType: 'wifi', templateData: td, autoUsername: td.ssid || '' };
    }
    if (rType === 'recovery_codes') {
      const prev = existingItem && existingItem.templateData && existingItem.templateData.codes ? existingItem.templateData.codes : [];
      const rawText = document.getElementById('tplRecoveryCodesInput')?.value || '';
      const codes = parseRecoveryCodesText(rawText, prev);
      const unused = codes.filter(c => !c.used).length;
      return {
        recordType: 'recovery_codes',
        templateData: { codes },
        autoUsername: `${unused} / ${codes.length} unused codes`
      };
    }
    return { recordType: 'login', templateData: null, autoUsername: null };
  }

  window.copyTemplateField = function(itemId, fieldKey, label, btnEl) {
    const items = (typeof window.getVaultItems === 'function' ? window.getVaultItems() : window.vaultItems) || [];
    const item = items.find(x => x.id === itemId);
    if (!item) return false;
    let val = '';
    if (fieldKey === 'password') val = item.password || '';
    else if (item.templateData && item.templateData[fieldKey] !== undefined) val = String(item.templateData[fieldKey] || '');
    else if (fieldKey === 'nextRecoveryCode' && item.templateData && Array.isArray(item.templateData.codes)) {
      const next = item.templateData.codes.find(c => c && !c.used) || item.templateData.codes[0];
      val = next ? next.code : '';
    }
    if (!val) {
      if (typeof window.showToast === 'function') window.showToast(`⚠️ No ${label} saved on this card.`, '🔒');
      return false;
    }
    if (typeof window.copyPasswordSilently === 'function') window.copyPasswordSilently(val);
    else if (navigator.clipboard) navigator.clipboard.writeText(val).catch(() => {});
    if (typeof window.startClipboardAutoWipe === 'function') window.startClipboardAutoWipe(val);
    if (typeof window.logAudit === 'function') window.logAudit('COPIED_SECRET_FIELD', `Copied ${label} for: ${item.title || item.id}`);
    if (typeof window.showToast === 'function') window.showToast(`📋 ${label} copied! Auto-wipes in 25s.`, '🛡️');
    if (btnEl) {
      const orig = btnEl.innerHTML;
      btnEl.textContent = '✓ Copied';
      setTimeout(() => { btnEl.innerHTML = orig; }, 1200);
    }
    return true;
  };

  function renderCardStructuredDeck(item, masked) {
    const rType = item && item.recordType ? item.recordType : 'login';
    if (rType === 'login' || !item.templateData) return null;
    const td = item.templateData;

    if (rType === 'gov_id') {
      const shownNum = masked ? maskLast4(td.idNumber) : (td.idNumber || 'Not set');
      const exp = evaluateItemExpiry(item);
      const expPill = exp.status === 'expired'
        ? `<span class="tpl-exp-pill expired">🚨 ${esc(exp.label)}</span>`
        : (exp.status === 'expiring'
          ? `<span class="tpl-exp-pill expiring">⚠️ ${esc(exp.label)}</span>`
          : (td.expiryDate ? `<span class="tpl-exp-pill valid">EXP ${esc(td.expiryDate)}</span>` : ''));
      return `
        <div class="tpl-card-deck tpl-gov-deck" onclick="event.stopPropagation();">
          <div class="tpl-deck-top">
            <span class="tpl-type-tag">🪪 ${esc(td.idType || 'GOV ID')}</span>
            ${expPill}
          </div>
          <div class="tpl-deck-main-row">
            <span class="tpl-mono-val" data-raw-id="${esc(td.idNumber || '')}">${esc(shownNum)}</span>
            <button type="button" class="btn-tpl-copy" onclick="event.stopPropagation(); copyTemplateField('${item.id}', 'idNumber', 'ID Number', this);">📋 Copy ID</button>
          </div>
        </div>
      `;
    }

    if (rType === 'bank_card') {
      const shownCard = masked ? maskLast4(td.cardNumber) : formatCardNumberDisplay(td.cardNumber);
      const exp = evaluateItemExpiry(item);
      const expClass = exp.status === 'expired' ? 'expired' : (exp.status === 'expiring' ? 'expiring' : 'valid');
      return `
        <div class="tpl-card-deck tpl-bank-deck" onclick="event.stopPropagation();">
          <div class="tpl-deck-top">
            <span class="tpl-type-tag">💳 ${esc(td.brand || 'CARD')}</span>
            ${td.expiryMonthYear ? `<span class="tpl-exp-pill ${expClass}">EXP ${esc(td.expiryMonthYear)}</span>` : ''}
          </div>
          <div class="tpl-deck-main-row">
            <span class="tpl-mono-val">${esc(shownCard || 'No card number')}</span>
            <div style="display:flex;gap:5px;flex-shrink:0;">
              <button type="button" class="btn-tpl-copy" onclick="event.stopPropagation(); copyTemplateField('${item.id}', 'cardNumber', 'Card Number', this);">📋 Card</button>
              <button type="button" class="btn-tpl-copy" onclick="event.stopPropagation(); copyTemplateField('${item.id}', 'cvv', 'CVV', this);">🛡️ CVV</button>
            </div>
          </div>
        </div>
      `;
    }

    if (rType === 'wifi') {
      return `
        <div class="tpl-card-deck tpl-wifi-deck" onclick="event.stopPropagation();">
          <div class="tpl-deck-top">
            <span class="tpl-type-tag">📶 ${esc(td.ssid || item.title)}</span>
            <span class="tpl-exp-pill valid">${esc((td.security || 'WPA').toUpperCase())}</span>
          </div>
          <div class="tpl-deck-main-row">
            <span class="tpl-mono-val">${masked ? '••••••••••••' : esc(item.password || 'Open Network')}</span>
            <div style="display:flex;gap:5px;flex-shrink:0;">
              <button type="button" class="btn-tpl-copy" onclick="event.stopPropagation(); copyTemplateField('${item.id}', 'password', 'Wi-Fi Password', this);">📋 Pass</button>
              <button type="button" class="btn-tpl-copy accent" onclick="event.stopPropagation(); openAccountFocusModal('${item.id}', false);">📱 Wi-Fi QR</button>
            </div>
          </div>
        </div>
      `;
    }

    if (rType === 'recovery_codes') {
      const codes = Array.isArray(td.codes) ? td.codes : [];
      const unused = codes.filter(c => c && !c.used).length;
      return `
        <div class="tpl-card-deck tpl-recovery-deck" onclick="event.stopPropagation();">
          <div class="tpl-deck-top">
            <span class="tpl-type-tag">🛟 2FA RECOVERY</span>
            <span class="tpl-exp-pill ${unused <= 2 ? 'expiring' : 'valid'}">${unused} / ${codes.length} Unused</span>
          </div>
          <div class="tpl-deck-main-row">
            <span class="tpl-mono-val">${unused > 0 ? '••••-••••' : 'All codes used'}</span>
            <button type="button" class="btn-tpl-copy" onclick="event.stopPropagation(); copyTemplateField('${item.id}', 'nextRecoveryCode', 'Next Recovery Code', this);">📋 Copy Next</button>
          </div>
        </div>
      `;
    }
    return null;
  }

  function renderFocusStructuredDeck(item, portalUrl) {
    const rType = item && item.recordType ? item.recordType : 'login';
    if (rType === 'login' || !item.templateData) return null;
    const td = item.templateData;

    if (rType === 'gov_id') {
      const exp = evaluateItemExpiry(item);
      return `
        <div class="focus-deck-card">
          <div class="focus-deck-label">
            <span>🪪 Government ID / License Number</span>
            <button type="button" class="btn-focus-copy-user-inline" onclick="copyTemplateField('${item.id}', 'idNumber', 'ID Number', this);">📋 Copy ID</button>
          </div>
          <div class="focus-deck-value" style="font-family:monospace;font-size:18px;letter-spacing:0.06em;">${esc(td.idNumber || 'Not set')}</div>
        </div>
        <div class="focus-pwd-deck" style="border-color:rgba(56,189,248,0.35);">
          <div class="focus-deck-label">
            <span>Identity Metadata &amp; Validity</span>
            ${exp.label ? `<span class="tpl-exp-pill ${exp.status}">${esc(exp.label)}</span>` : ''}
          </div>
          <div class="tpl-meta-rows">
            ${td.holderName ? `<div><strong>Holder:</strong> ${esc(td.holderName)}</div>` : ''}
            ${td.agency ? `<div><strong>Agency:</strong> ${esc(td.agency)}</div>` : ''}
            ${td.issueDate ? `<div><strong>Issued:</strong> ${esc(td.issueDate)}</div>` : ''}
            ${td.expiryDate ? `<div><strong>Expires:</strong> ${esc(td.expiryDate)}</div>` : ''}
          </div>
          ${portalUrl ? `<button type="button" class="btn-focus-copy-launch" id="btnFocusCopyAndLaunch" data-portal-url="${esc(portalUrl)}">⚡ Copy ID &amp; Open Portal ↗</button>` : ''}
        </div>
        <div id="focusEncryptedScansHost"></div>
      `;
    }

    if (rType === 'bank_card') {
      const exp = evaluateItemExpiry(item);
      const formattedNum = formatCardNumberDisplay(td.cardNumber || '');
      const cvvMask = '•'.repeat(Math.max(3, String(td.cvv || '').length || 3));
      const pinMask = td.atmPin ? '•'.repeat(td.atmPin.length) : '';
      return `
        <div class="focus-deck-card">
          <div class="focus-deck-label">
            <span>💳 ${esc(td.brand || 'Card')} Number</span>
            <button type="button" class="btn-focus-copy-user-inline" onclick="copyTemplateField('${item.id}', 'cardNumber', 'Card Number', this);">📋 Copy Card #</button>
          </div>
          <div class="focus-deck-value" style="font-family:monospace;font-size:18px;letter-spacing:0.08em;">${esc(formattedNum || 'Not set')}</div>
          <div style="display:flex;gap:14px;margin-top:8px;font-size:12px;color:#cbd5e1;flex-wrap:wrap;">
            ${td.cardHolder ? `<span>Holder: <strong>${esc(td.cardHolder)}</strong></span>` : ''}
            ${td.expiryMonthYear ? `<span>Expiry: <strong>${esc(td.expiryMonthYear)}</strong></span>` : ''}
            ${exp.label ? `<span class="tpl-exp-pill ${exp.status}">${esc(exp.label)}</span>` : ''}
          </div>
        </div>
        <div class="focus-pwd-deck">
          <div class="focus-deck-label">
            <span style="color:#ffd700;">🛡️ Security Code (CVV / CVC)</span>
            <button type="button" class="btn-focus-copy-user-inline" id="btnFocusCopyCvv" onclick="copyTemplateField('${item.id}', 'cvv', 'CVV', this);">📋 Copy CVV</button>
          </div>
          <div class="focus-deck-val-row">
            <div class="focus-pwd-display masked" id="focusCvvVal" data-raw="${esc(td.cvv || '')}" data-masked="${cvvMask}">${cvvMask}</div>
            <button type="button" class="btn-pwd-action" id="btnFocusToggleCvv" style="padding:6px 10px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#fff;cursor:pointer;">👁️ Show CVV</button>
          </div>
          ${td.atmPin ? `
            <div class="focus-deck-val-row" style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);">
              <span style="font-size:12px;color:#94a3b8;">ATM PIN: <strong id="focusPinVal" data-raw="${esc(td.atmPin)}" data-masked="${pinMask}">${pinMask}</strong></span>
              <div style="display:flex;gap:6px;">
                <button type="button" class="btn-tpl-copy" id="btnFocusTogglePin">👁️ PIN</button>
                <button type="button" class="btn-tpl-copy" onclick="copyTemplateField('${item.id}', 'atmPin', 'ATM PIN', this);">📋 Copy PIN</button>
              </div>
            </div>
          ` : ''}
        </div>
        <div id="focusEncryptedScansHost"></div>
      `;
    }

    if (rType === 'wifi') {
      const qrSvg = renderWifiQrSvg(td.ssid || item.title, item.password || '', td.security || 'WPA', !!td.hidden);
      return `
        <div class="focus-totp-deck" style="align-items:center;text-align:center;">
          <div class="focus-deck-label" style="width:100%;">
            <span style="color:#6ee7b7;">📶 WI-FI INSTANT CAMERA JOIN</span>
            <span style="color:#94a3b8;font-size:10px;">${esc((td.security || 'WPA').toUpperCase())}</span>
          </div>
          <div class="wifi-qr-box" id="focusWifiQrBox">${qrSvg}</div>
          <div style="font-size:11.5px;color:#cbd5e1;">Point iPhone or Android camera here to connect to <strong>${esc(td.ssid || item.title)}</strong>.</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:100%;margin-top:4px;">
            <button type="button" class="btn-sync-action" onclick="copyTemplateField('${item.id}', 'ssid', 'Wi-Fi Name (SSID)', this);">📋 Copy SSID</button>
            <button type="button" class="btn-sync-action primary" onclick="copyTemplateField('${item.id}', 'password', 'Wi-Fi Password', this);">🔑 Copy Wi-Fi Pass</button>
          </div>
        </div>
      `;
    }

    if (rType === 'recovery_codes') {
      const codes = Array.isArray(td.codes) ? td.codes : [];
      const unused = codes.filter(c => c && !c.used).length;
      return `
        <div class="focus-deck-card">
          <div class="focus-deck-label">
            <span>🛟 Backup &amp; 2FA Recovery Codes</span>
            <span class="tpl-exp-pill ${unused <= 2 ? 'expiring' : 'valid'}" id="focusRecoveryCounter">${unused} / ${codes.length} Unused</span>
          </div>
          <div class="recovery-code-grid" id="focusRecoveryGrid">
            ${codes.map((c, idx) => `
              <div class="recovery-code-pill ${c.used ? 'used' : ''}">
                <span class="rec-code-str">${esc(c.code)}</span>
                <div style="display:flex;gap:4px;">
                  <button type="button" class="btn-rec-mini" data-rec-copy="${idx}" title="Copy code">📋</button>
                  <button type="button" class="btn-rec-mini" data-rec-toggle="${idx}" title="Mark Used / Unused">${c.used ? '↺' : '✓'}</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    return null;
  }

  function wireFocusStructuredActions(item, refreshCallback) {
    if (!item || !item.templateData) return;
    const btnCvv = document.getElementById('btnFocusToggleCvv');
    if (btnCvv) {
      let shown = false;
      btnCvv.onclick = () => {
        shown = !shown;
        const valEl = document.getElementById('focusCvvVal');
        if (valEl) {
          valEl.textContent = shown ? valEl.getAttribute('data-raw') : valEl.getAttribute('data-masked');
          valEl.classList.toggle('masked', !shown);
        }
        btnCvv.textContent = shown ? '🙈 Hide CVV' : '👁️ Show CVV';
      };
    }

    const btnPin = document.getElementById('btnFocusTogglePin');
    if (btnPin) {
      let pinShown = false;
      btnPin.onclick = () => {
        pinShown = !pinShown;
        const valEl = document.getElementById('focusPinVal');
        if (valEl) valEl.textContent = pinShown ? valEl.getAttribute('data-raw') : valEl.getAttribute('data-masked');
        btnPin.textContent = pinShown ? '🙈 Hide' : '👁️ PIN';
      };
    }

    if (item.recordType === 'gov_id') {
      const btnGovLaunch = document.getElementById('btnFocusCopyAndLaunch');
      if (btnGovLaunch) {
        const portalUrl = btnGovLaunch.getAttribute('data-portal-url');
        btnGovLaunch.onclick = () => {
          window.copyTemplateField(item.id, 'idNumber', 'ID Number', btnGovLaunch);
          if (portalUrl) try { window.open(portalUrl, '_blank', 'noopener,noreferrer'); } catch (e) {}
        };
      }
    }

    if ((item.recordType === 'gov_id' || item.recordType === 'bank_card') && window.VaultEncryptedScans) {
      const scanHost = document.getElementById('focusEncryptedScansHost');
      if (scanHost) {
        window.VaultEncryptedScans.loadDecryptedScans(item.id).then((scans) => {
          if (!scans || (!scans.front && !scans.back)) return;
          if (!document.body.contains(scanHost)) return;
          scanHost.innerHTML = `
            <div class="focus-scans-deck" id="focusEncryptedScansDeck">
              <div class="focus-deck-label">
                <span style="color:#93c5fd;">📷 ENCRYPTED CARD / ID SCANS</span>
                <button type="button" class="btn-tpl-copy" id="btnToggleScanBlur">👁️ Reveal ID Scans</button>
              </div>
              <div class="focus-scans-grid">
                ${scans.front ? `
                  <div class="scan-thumb-card" data-scan-side="front">
                    <img class="scan-thumb-img blurred" id="scanImgFront" src="${scans.front}" alt="Encrypted Front Scan">
                    <div class="scan-thumb-cap">Front Side (Tap to Zoom)</div>
                  </div>
                ` : ''}
                ${scans.back ? `
                  <div class="scan-thumb-card" data-scan-side="back">
                    <img class="scan-thumb-img blurred" id="scanImgBack" src="${scans.back}" alt="Encrypted Back Scan">
                    <div class="scan-thumb-cap">Back Side (Tap to Zoom)</div>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
          let revealed = false;
          const toggleBtn = document.getElementById('btnToggleScanBlur');
          if (toggleBtn) {
            toggleBtn.onclick = () => {
              revealed = !revealed;
              scanHost.querySelectorAll('.scan-thumb-img').forEach(img => img.classList.toggle('blurred', !revealed));
              toggleBtn.textContent = revealed ? '🙈 Blur Scans' : '👁️ Reveal ID Scans';
            };
          }
          scanHost.querySelectorAll('.scan-thumb-card').forEach(card => {
            card.onclick = () => {
              const side = card.getAttribute('data-scan-side');
              const url = side === 'back' ? scans.back : scans.front;
              if (url && window.VaultEncryptedScans) {
                window.VaultEncryptedScans.openScanLightbox(url, `${item.title || 'ID'} · ${side === 'back' ? 'Back' : 'Front'} Scan`);
              }
            };
          });
        }).catch(() => {});
      }
    }

    if (item.recordType === 'recovery_codes') {
      const grid = document.getElementById('focusRecoveryGrid');
      if (grid) {
        grid.querySelectorAll('[data-rec-copy]').forEach(btn => {
          btn.onclick = () => {
            const idx = parseInt(btn.getAttribute('data-rec-copy'), 10);
            const c = item.templateData.codes[idx];
            if (!c || !c.code) return;
            if (typeof window.copyPasswordSilently === 'function') window.copyPasswordSilently(c.code);
            if (typeof window.startClipboardAutoWipe === 'function') window.startClipboardAutoWipe(c.code);
            if (typeof window.logAudit === 'function') window.logAudit('COPIED_SECRET_FIELD', 'Copied recovery code for: ' + (item.title || item.id));
            if (typeof window.showToast === 'function') window.showToast('📋 Recovery code copied! Auto-wipes in 25s.', '🛟');
          };
        });
        grid.querySelectorAll('[data-rec-toggle]').forEach(btn => {
          btn.onclick = async () => {
            const idx = parseInt(btn.getAttribute('data-rec-toggle'), 10);
            const c = item.templateData.codes[idx];
            if (!c) return;
            c.used = !c.used;
            c.usedAt = c.used ? Date.now() : 0;
            const unused = item.templateData.codes.filter(x => x && !x.used).length;
            item.username = `${unused} / ${item.templateData.codes.length} unused codes`;
            item.updatedAt = Date.now();
            item.rev = (item.rev || 0) + 1;
            if (typeof window.persistEncryptedVaultCache === 'function') await window.persistEncryptedVaultCache();
            if (typeof window.markVaultRecordDirty === 'function') window.markVaultRecordDirty(item.id);
            if (typeof window.triggerVaultCloudPush === 'function') window.triggerVaultCloudPush();
            if (typeof window.renderVault === 'function') window.renderVault();
            if (window.VaultWatchtower && typeof window.VaultWatchtower.updateBadge === 'function') window.VaultWatchtower.updateBadge();
            if (typeof refreshCallback === 'function') refreshCallback();
          };
        });
      }
    }
  }

  function renderEmergencyKitSheet() {
    const sheet = document.getElementById('emergencyKitPrintSheet');
    if (!sheet) return;
    const items = ((typeof window.getVaultItems === 'function' ? window.getVaultItems() : window.vaultItems) || []).filter(x => x && !x.trashed);
    const incIds = document.getElementById('chkKitIds')?.checked !== false;
    const incRec = document.getElementById('chkKitRecovery')?.checked !== false;
    const incCrit = document.getElementById('chkKitCritical')?.checked !== false;

    const ownerEmail = document.getElementById('syncAuthEmailLabel')?.textContent || 'Authorized Owner';
    const govIds = items.filter(x => x.recordType === 'gov_id' && x.templateData);
    const recItems = items.filter(x => x.recordType === 'recovery_codes' && x.templateData && Array.isArray(x.templateData.codes));
    const critItems = items.filter(x => (x.importance || '').toLowerCase() === 'critical');

    sheet.innerHTML = `
      <div class="kit-doc-head">
        <div>
          <h2>ORLANDOVAULT · EMERGENCY RECOVERY KIT</h2>
          <div>Store printed copy in a sealed fireproof envelope or physical home safe.</div>
        </div>
        <div style="text-align:right;">
          <div><strong>Generated:</strong> ${new Date().toLocaleDateString()}</div>
          <div><strong>Owner:</strong> ${esc(ownerEmail)}</div>
        </div>
      </div>

      <div class="kit-box">
        <div class="kit-box-title">🔐 1. VAULT ACCESS &amp; HANDWRITTEN SECRET KEY (NEVER PRINTED AUTOMATICALLY)</div>
        <div><strong>Vault URL:</strong> https://orlandopasion000.github.io/orlandovault/</div>
        <div style="margin-top:8px;"><strong>Primary 6-Digit iPhone Passcode / Master Password (Write by hand):</strong></div>
        <div class="kit-write-line"></div>
        <div style="margin-top:6px;"><strong>Trusted Recovery Note / Physical Backup Location:</strong></div>
        <div class="kit-write-line"></div>
      </div>

      ${incIds ? `
        <div class="kit-box">
          <div class="kit-box-title">🪪 2. GOVERNMENT IDs &amp; LICENSES SUMMARY (${govIds.length})</div>
          ${govIds.length === 0 ? '<div class="kit-empty">No Government ID templates saved yet.</div>' : `
            <table class="kit-table">
              <thead><tr><th>Document</th><th>Agency</th><th>Number</th><th>Expiry</th></tr></thead>
              <tbody>
                ${govIds.map(g => `<tr><td>${esc(g.title)}</td><td>${esc(g.templateData.agency || '-')}</td><td>${esc(g.templateData.idNumber || '-')}</td><td>${esc(g.templateData.expiryDate || '-')}</td></tr>`).join('')}
              </tbody>
            </table>
          `}
        </div>
      ` : ''}

      ${incRec ? `
        <div class="kit-box">
          <div class="kit-box-title">🛟 3. UNUSED 2FA &amp; BACKUP RECOVERY CODES (${recItems.length} accounts)</div>
          ${recItems.length === 0 ? '<div class="kit-empty">No Recovery Code templates saved yet.</div>' : recItems.map(r => {
            const unused = r.templateData.codes.filter(c => c && !c.used).map(c => c.code);
            return `<div style="margin-bottom:6px;"><strong>${esc(r.title)}:</strong> <code>${esc(unused.join('  ·  ') || 'All codes marked used')}</code></div>`;
          }).join('')}
        </div>
      ` : ''}

      ${incCrit ? `
        <div class="kit-box">
          <div class="kit-box-title">⚡ 4. CRITICAL ACCOUNTS DIRECTORY (${critItems.length})</div>
          ${critItems.length === 0 ? '<div class="kit-empty">No Critical accounts marked.</div>' : `
            <table class="kit-table">
              <thead><tr><th>Service</th><th>Category</th><th>Username / Email</th></tr></thead>
              <tbody>
                ${critItems.slice(0, 25).map(c => `<tr><td>${esc(c.title)}</td><td>${esc(c.category || '-')}</td><td>${esc(c.username || '-')}</td></tr>`).join('')}
              </tbody>
            </table>
          `}
        </div>
      ` : ''}
    `;
  }

  function openEmergencyKit() {
    const m = document.getElementById('emergencyKitModal');
    if (!m) return;
    renderEmergencyKitSheet();
    m.classList.add('active');
    if (typeof window.logAudit === 'function') window.logAudit('OPENED_EMERGENCY_KIT', 'Generated printable Emergency Vault Recovery Kit');
  }

  function closeEmergencyKit() {
    const m = document.getElementById('emergencyKitModal');
    if (m) m.classList.remove('active');
  }

  function wireEmergencyKitControls() {
    document.getElementById('btnOpenEmergencyKit')?.addEventListener('click', () => {
      const syncM = document.getElementById('syncHealthModal');
      if (syncM) syncM.style.display = 'none';
      openEmergencyKit();
    });
    document.getElementById('closeEmergencyKitModal')?.addEventListener('click', closeEmergencyKit);
    document.getElementById('btnPrintEmergencyKit')?.addEventListener('click', () => window.print());
    ['chkKitIds', 'chkKitRecovery', 'chkKitCritical'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', renderEmergencyKitSheet);
    });
    const m = document.getElementById('emergencyKitModal');
    if (m) {
      m.addEventListener('click', (e) => { if (e.target === m) closeEmergencyKit(); });
    }
  }

  window.VaultTemplates = {
    RECORD_TYPES,
    GOV_ID_PRESETS,
    maskLast4,
    evaluateItemExpiry,
    buildWifiQrPayload,
    renderWifiQrSvg,
    parseRecoveryCodesText,
    setEditorType,
    populateEditorForItem,
    collectEditorTemplatePayload,
    renderCardStructuredDeck,
    renderFocusStructuredDeck,
    wireFocusStructuredActions,
    openEmergencyKit,
    closeEmergencyKit,
    renderEmergencyKitSheet
  };

  document.addEventListener('DOMContentLoaded', () => {
    renderRecordTypeBar();
    wireEmergencyKitControls();
  });
})();
