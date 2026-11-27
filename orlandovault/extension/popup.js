/* ==========================================================================
   ORLANDOVAULT POPUP CONTROLLER
   ========================================================================== */
(function() {
  'use strict';

  const WEB_VAULT_URL = 'https://orlandopasion000.github.io/orlandovault/';
  let currentTabUrl = '';
  let currentTabId = null;
  let pinBuffer = '';
  let currentPasscodeMode = 'pin6';
  let totpRefreshTimer = null;

  function sendMsg(payload) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(payload, (res) => {
        if (chrome.runtime.lastError) {
          resolve({ ok: false, error: chrome.runtime.lastError.message });
          return;
        }
        resolve(res || { ok: false });
      });
    });
  }

  function showToast(msg) {
    const el = document.getElementById('extToast');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 2200);
  }

  function setUnlockError(msg) {
    const el = document.getElementById('extUnlockError');
    if (!el) return;
    if (msg) {
      el.textContent = msg;
      el.style.display = 'block';
    } else {
      el.textContent = '';
      el.style.display = 'none';
    }
  }

  function updatePinDots() {
    const spans = document.querySelectorAll('#extPinDots span');
    spans.forEach((sp, i) => {
      sp.classList.toggle('filled', i < pinBuffer.length);
    });
  }

  function showView(viewId) {
    ['viewSetup', 'viewLocked', 'viewUnlocked'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = id === viewId ? 'flex' : 'none';
    });
  }

  async function resolveActiveTargetTab() {
    const params = new URLSearchParams(window.location.search);
    const paramUrl = params.get('tabUrl');
    if (paramUrl) {
      currentTabUrl = paramUrl;
      const tabs = await chrome.tabs.query({});
      const exact = tabs.find(t => t.url === paramUrl);
      currentTabId = exact ? exact.id : null;
    } else {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        currentTabUrl = tab.url || '';
        currentTabId = tab.id || null;
      }
    }
    const hostLbl = document.getElementById('extHostLabel');
    if (hostLbl) {
      try {
        const u = new URL(currentTabUrl);
        hostLbl.textContent = u.host || 'Zero-Knowledge Autofill';
      } catch (e) {
        hostLbl.textContent = 'Zero-Knowledge Autofill';
      }
    }
  }

  function renderAccountCard(item, isMatched) {
    const row = document.createElement('div');
    row.className = 'ext-item' + (isMatched ? ' matched' : '');

    const top = document.createElement('div');
    top.className = 'ext-item-top';
    const meta = document.createElement('div');
    meta.style.minWidth = '0';
    const titleEl = document.createElement('div');
    titleEl.className = 'ext-item-title';
    titleEl.textContent = item.title;
    const userEl = document.createElement('div');
    userEl.className = 'ext-item-user';
    userEl.textContent = item.username || item.category;
    meta.appendChild(titleEl);
    meta.appendChild(userEl);
    top.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'ext-item-actions';

    if (currentTabId) {
      const fillBtn = document.createElement('button');
      fillBtn.type = 'button';
      fillBtn.className = 'ext-mini-btn accent';
      fillBtn.textContent = '⚡ Fill';
      fillBtn.addEventListener('click', async () => {
        const res = await sendMsg({ type: 'FILL_CREDENTIAL_IN_TAB', itemId: item.id, tabId: currentTabId });
        if (res.ok) {
          showToast('⚡ Filled ' + item.title);
          if (!new URLSearchParams(window.location.search).get('tabUrl')) {
            setTimeout(() => window.close(), 350);
          }
        } else {
          showToast('❌ ' + (res.error || 'Could not autofill tab'));
        }
      });
      actions.appendChild(fillBtn);
    }

    const copyUserBtn = document.createElement('button');
    copyUserBtn.type = 'button';
    copyUserBtn.className = 'ext-mini-btn';
    copyUserBtn.textContent = '👤 User';
    copyUserBtn.addEventListener('click', async () => {
      const res = await sendMsg({ type: 'GET_SECRET_FOR_POPUP', itemId: item.id });
      if (res.ok && res.username) {
        await navigator.clipboard.writeText(res.username);
        showToast('👤 Username copied');
      }
    });
    actions.appendChild(copyUserBtn);

    const copyPwdBtn = document.createElement('button');
    copyPwdBtn.type = 'button';
    copyPwdBtn.className = 'ext-mini-btn';
    copyPwdBtn.textContent = '🔑 Pass';
    copyPwdBtn.addEventListener('click', async () => {
      const res = await sendMsg({ type: 'GET_SECRET_FOR_POPUP', itemId: item.id });
      if (res.ok && res.password) {
        await navigator.clipboard.writeText(res.password);
        showToast('🔑 Password copied');
      }
    });
    actions.appendChild(copyPwdBtn);

    if (item.hasTotp) {
      const totpBtn = document.createElement('button');
      totpBtn.type = 'button';
      totpBtn.className = 'ext-mini-btn totp';
      totpBtn.textContent = item.totpFormatted ? `🔐 ${item.totpFormatted} (${item.totpRemaining}s)` : '🔐 2FA';
      totpBtn.addEventListener('click', async () => {
        const res = await sendMsg({ type: 'GET_SECRET_FOR_POPUP', itemId: item.id });
        if (res.ok && res.totp && res.totp.code) {
          await navigator.clipboard.writeText(res.totp.code);
          showToast(`🔐 2FA ${res.totp.formatted} copied`);
        }
      });
      actions.appendChild(totpBtn);
    }

    row.appendChild(top);
    row.appendChild(actions);
    return row;
  }

  async function refreshUnlockedList() {
    const q = (document.getElementById('extSearchInput')?.value || '').trim();
    const res = await sendMsg({ type: 'QUERY_VAULT_ITEMS', tabUrl: currentTabUrl, query: q });
    if (!res.ok) {
      if (res.error === 'VAULT_LOCKED') await initPopupState();
      return;
    }

    const matchSec = document.getElementById('extMatchesSection');
    const matchList = document.getElementById('extMatchesList');
    const othersList = document.getElementById('extOthersList');
    const othersLbl = document.getElementById('extOthersLabel');

    matchList.innerHTML = '';
    othersList.innerHTML = '';

    if (res.matches && res.matches.length > 0) {
      matchSec.style.display = 'block';
      res.matches.forEach(m => matchList.appendChild(renderAccountCard(m, true)));
    } else {
      matchSec.style.display = 'none';
    }

    othersLbl.textContent = q ? `SEARCH RESULTS (${res.others.length})` : `ALL ACCOUNTS (${res.totalCount})`;
    if (!res.others || res.others.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'ext-card-desc';
      empty.textContent = q ? 'No other accounts match your search.' : 'No other accounts.';
      othersList.appendChild(empty);
    } else {
      res.others.forEach(it => othersList.appendChild(renderAccountCard(it, false)));
    }
  }

  function startTotpTicker() {
    if (totpRefreshTimer) clearInterval(totpRefreshTimer);
    totpRefreshTimer = setInterval(() => {
      const unlockedEl = document.getElementById('viewUnlocked');
      if (unlockedEl && unlockedEl.style.display !== 'none') {
        refreshUnlockedList();
      }
    }, 1000);
  }

  async function attemptUnlock(secret) {
    setUnlockError('');
    const res = await sendMsg({
      type: 'UNLOCK_EXT_VAULT',
      secret,
      tabUrl: currentTabUrl,
      tabId: currentTabId
    });
    if (!res.ok) {
      pinBuffer = '';
      updatePinDots();
      setUnlockError(res.error || 'Incorrect Passcode / Password');
      return;
    }
    pinBuffer = '';
    updatePinDots();
    await initPopupState();
  }

  async function initPopupState() {
    await resolveActiveTargetTab();
    const status = await sendMsg({ type: 'GET_EXT_STATUS', tabUrl: currentTabUrl });
    const dot = document.getElementById('extStatusDot');
    const lockBtn = document.getElementById('btnExtLock');

    if (!status.hasEnvelope) {
      if (dot) dot.classList.remove('unlocked');
      if (lockBtn) lockBtn.style.display = 'none';
      showView('viewSetup');
      return;
    }

    if (!status.unlocked) {
      if (dot) dot.classList.remove('unlocked');
      if (lockBtn) lockBtn.style.display = 'none';
      currentPasscodeMode = status.passcodeMode || 'pin6';
      const isPin = currentPasscodeMode === 'pin6';
      document.getElementById('extPinPanel').style.display = isPin ? 'flex' : 'none';
      document.getElementById('extPwdForm').style.display = isPin ? 'none' : 'flex';
      showView('viewLocked');
      if (!isPin) document.getElementById('extMasterPwdInput')?.focus();
      return;
    }

    if (dot) dot.classList.add('unlocked');
    if (lockBtn) lockBtn.style.display = 'inline-flex';
    showView('viewUnlocked');
    await refreshUnlockedList();
    startTotpTicker();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#extPinGrid button[data-digit]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (pinBuffer.length >= 6) return;
        pinBuffer += btn.getAttribute('data-digit');
        updatePinDots();
        if (pinBuffer.length === 6) {
          attemptUnlock(pinBuffer);
        }
      });
    });

    document.getElementById('btnPinBackspace')?.addEventListener('click', () => {
      pinBuffer = pinBuffer.slice(0, -1);
      updatePinDots();
    });

    document.getElementById('btnPinSwitchPwd')?.addEventListener('click', () => {
      document.getElementById('extPinPanel').style.display = 'none';
      document.getElementById('extPwdForm').style.display = 'flex';
      document.getElementById('extMasterPwdInput')?.focus();
    });

    document.getElementById('btnSwitchBackToPin')?.addEventListener('click', () => {
      document.getElementById('extPwdForm').style.display = 'none';
      document.getElementById('extPinPanel').style.display = 'flex';
      pinBuffer = '';
      updatePinDots();
    });

    document.getElementById('extPwdForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = document.getElementById('extMasterPwdInput')?.value || '';
      if (val) attemptUnlock(val);
    });

    document.addEventListener('keydown', (e) => {
      const lockedEl = document.getElementById('viewLocked');
      const pinPanel = document.getElementById('extPinPanel');
      if (!lockedEl || lockedEl.style.display === 'none' || !pinPanel || pinPanel.style.display === 'none') return;
      if (/^\d$/.test(e.key) && pinBuffer.length < 6) {
        pinBuffer += e.key;
        updatePinDots();
        if (pinBuffer.length === 6) attemptUnlock(pinBuffer);
      } else if (e.key === 'Backspace') {
        pinBuffer = pinBuffer.slice(0, -1);
        updatePinDots();
      }
    });

    const openWebSync = () => chrome.tabs.create({ url: WEB_VAULT_URL });
    document.getElementById('btnOpenWebPair')?.addEventListener('click', openWebSync);
    document.getElementById('btnExtSyncWeb')?.addEventListener('click', openWebSync);

    document.getElementById('btnExtLock')?.addEventListener('click', async () => {
      await sendMsg({ type: 'LOCK_EXT_VAULT' });
      await initPopupState();
    });

    document.getElementById('extImportOvaultInput')?.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        const res = await sendMsg({ type: 'IMPORT_OVAULT_ENVELOPE', envelope: parsed });
        if (!res.ok) throw new Error(res.error || 'Import failed');
        showToast(`📥 Loaded ${res.recordCount} encrypted items`);
        await initPopupState();
      } catch (err) {
        showToast('❌ ' + (err.message || 'Invalid backup'));
      }
    });

    document.getElementById('extSearchInput')?.addEventListener('input', refreshUnlockedList);

    const regen = () => {
      document.getElementById('extGenPassword').textContent = OVExtCore.generateStrongPassword(20);
    };
    document.getElementById('btnToggleGen')?.addEventListener('click', () => {
      const p = document.getElementById('extGenPanel');
      const show = p.style.display === 'none';
      p.style.display = show ? 'flex' : 'none';
      if (show) regen();
    });
    document.getElementById('btnRegenPwd')?.addEventListener('click', regen);
    document.getElementById('btnCopyGenPwd')?.addEventListener('click', async () => {
      const pwd = document.getElementById('extGenPassword')?.textContent || '';
      if (pwd) {
        await navigator.clipboard.writeText(pwd);
        showToast('⚡ Strong password copied');
      }
    });

    initPopupState();
  });
})();
