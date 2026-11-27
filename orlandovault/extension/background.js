/* ==========================================================================
   ORLANDOVAULT EXTENSION MV3 SERVICE WORKER (Zero-Knowledge RAM Session Only)
   ========================================================================== */
importScripts('vault-crypto-totp.js');

const STORAGE_ENC_KEY = 'ov_ext_enc_envelope_v4';
const SESSION_RAW_KEY = 'ov_ext_session_key_b64';
const ALARM_AUTOLOCK = 'ov_ext_autolock';
const AUTOLOCK_MINUTES = 15;

try {
  if (chrome.storage && chrome.storage.session && chrome.storage.session.setAccessLevel) {
    chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' }).catch(() => {});
  }
} catch (e) {}

async function getStoredEnvelope() {
  const res = await chrome.storage.local.get(STORAGE_ENC_KEY);
  return res[STORAGE_ENC_KEY] || null;
}

async function getSessionCryptoKey() {
  const res = await chrome.storage.session.get(SESSION_RAW_KEY);
  const raw = res[SESSION_RAW_KEY];
  if (!raw) return null;
  return await OVExtCore.importSessionKey(raw);
}

async function getDecryptedVaultItems() {
  const [env, key] = await Promise.all([getStoredEnvelope(), getSessionCryptoKey()]);
  if (!env || !env.encryptedData || !key) return { env, unlocked: false, items: [] };
  try {
    const plain = await OVExtCore.decryptStrict(env.encryptedData, key);
    const parsed = JSON.parse(plain || '{}');
    const rawItems = Array.isArray(parsed.items) ? parsed.items : [];
    const activeItems = rawItems.filter(x => x && !x.trashed);
    return { env, unlocked: true, items: activeItems };
  } catch (e) {
    await chrome.storage.session.remove(SESSION_RAW_KEY);
    return { env, unlocked: false, items: [] };
  }
}

function resetAutoLockAlarm() {
  try {
    chrome.alarms.create(ALARM_AUTOLOCK, { delayInMinutes: AUTOLOCK_MINUTES });
  } catch (e) {}
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm && alarm.name === ALARM_AUTOLOCK) {
    lockExtensionVault().catch(() => {});
  }
});

async function lockExtensionVault() {
  await chrome.storage.session.remove(SESSION_RAW_KEY);
  try {
    await chrome.alarms.clear(ALARM_AUTOLOCK);
    await chrome.action.setBadgeText({ text: '' });
  } catch (e) {}
}

function rankAndSummarizeItems(items, tabUrl, searchQuery = '') {
  const q = (searchQuery || '').trim().toLowerCase();
  const scored = items.map(it => {
    const urlScore = tabUrl ? OVExtCore.scoreAccountForUrl(it, tabUrl) : 0;
    const isPriority = !!(it.isPriority || it.pinned);
    return { item: it, urlScore, isPriority };
  });

  const filtered = q
    ? scored.filter(({ item }) => {
        const hay = [item.title, item.username, item.category, item.metadata, item.notes].join(' ').toLowerCase();
        return hay.includes(q);
      })
    : scored;

  filtered.sort((a, b) => {
    if (b.urlScore !== a.urlScore) return b.urlScore - a.urlScore;
    if (a.isPriority !== b.isPriority) return a.isPriority ? -1 : 1;
    return (b.item.usageScore || 0) - (a.item.usageScore || 0);
  });

  return filtered.map(({ item, urlScore, isPriority }) => ({
    id: item.id,
    title: item.title || 'Untitled',
    username: item.username || '',
    category: item.category || 'Portals',
    isPriority,
    hasTotp: !!OVExtCore.parseTotpInput(item.totpSecret || ''),
    score: urlScore
  }));
}

async function updateBadgeForTab(tabId, tabUrl) {
  try {
    const state = await getDecryptedVaultItems();
    if (!state.unlocked || !tabUrl || (!tabUrl.startsWith('http://') && !tabUrl.startsWith('https://'))) {
      await chrome.action.setBadgeText({ tabId, text: '' });
      return;
    }
    const matches = state.items.filter(it => OVExtCore.scoreAccountForUrl(it, tabUrl) > 0);
    await chrome.action.setBadgeBackgroundColor({ tabId, color: '#10b981' });
    await chrome.action.setBadgeText({ tabId, text: matches.length > 0 ? String(matches.length) : '' });
  } catch (e) {}
}

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (tab && tab.url) await updateBadgeForTab(tabId, tab.url);
  } catch (e) {}
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === 'complete') {
    const u = changeInfo.url || (tab && tab.url);
    if (u) await updateBadgeForTab(tabId, u);
  }
});

async function dispatchAutofillToTab(item, tabId) {
  let totp = null;
  if (item.totpSecret && OVExtCore.parseTotpInput(item.totpSecret)) {
    try {
      totp = await OVExtCore.generateTotp(item.totpSecret);
    } catch (e) {}
  }
  const payload = {
    id: item.id,
    title: item.title || 'OrlandoVault Account',
    username: item.username || '',
    password: item.password || '',
    totpCode: totp ? totp.code : '',
    totpFormatted: totp ? totp.formatted : '',
    totpRemaining: totp ? totp.remaining : 0
  };
  await chrome.tabs.sendMessage(tabId, { type: 'EXECUTE_PAGE_AUTOFILL', payload });
  resetAutoLockAlarm();
  return payload;
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'autofill-active-tab') return;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id || !tab.url) return;
    const state = await getDecryptedVaultItems();
    if (!state.unlocked) return;
    const ranked = rankAndSummarizeItems(state.items, tab.url).filter(m => m.score > 0);
    if (ranked.length === 0) return;
    const item = state.items.find(x => x.id === ranked[0].id);
    if (item) await dispatchAutofillToTab(item, tab.id);
  } catch (e) {}
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    const extPrefix = chrome.runtime.getURL('');
    const isFromTab = !!(sender && sender.tab && !(sender.url && sender.url.startsWith(extPrefix)));
    const type = msg && msg.type;

    if (type === 'BRIDGE_SYNC_ENVELOPE') {
      const env = msg.envelope;
      if (!env || env.v !== 4 || !env.saltHex || !env.keyCanary || !env.encryptedData) {
        sendResponse({ ok: false, error: 'INVALID_ENCRYPTED_ENVELOPE' });
        return;
      }
      const stored = {
        v: 4,
        passcodeMode: env.passcodeMode || 'pin6',
        saltHex: env.saltHex,
        kdfIterations: env.kdfIterations || OVExtCore.KDF_ITERATIONS_V4,
        keyCanary: env.keyCanary,
        encryptedData: env.encryptedData,
        updatedAt: env.updatedAt || Date.now(),
        syncedAt: Date.now()
      };
      await chrome.storage.local.set({ [STORAGE_ENC_KEY]: stored });
      if (sender && sender.tab && sender.tab.id && sender.tab.url) {
        updateBadgeForTab(sender.tab.id, sender.tab.url);
      }
      sendResponse({ ok: true, syncedAt: stored.syncedAt });
      return;
    }

    if (type === 'IMPORT_OVAULT_ENVELOPE') {
      if (isFromTab) {
        sendResponse({ ok: false, error: 'POPUP_ONLY' });
        return;
      }
      const ov = msg.envelope;
      if (!ov || ov.format !== 'ORLANDOVAULT_ZK_V4' || !ov.encryptedPayload || !ov.sha256Checksum) {
        sendResponse({ ok: false, error: 'Invalid .ovault v4 backup format.' });
        return;
      }
      const computed = await OVExtCore.computeOvaultSha256(
        ov.saltHex,
        ov.encryptedPayload.iv,
        ov.encryptedPayload.ciphertext
      );
      if (computed !== ov.sha256Checksum) {
        sendResponse({ ok: false, error: 'SHA-256 integrity checksum mismatch.' });
        return;
      }
      const stored = {
        v: 4,
        passcodeMode: ov.passcodeMode || 'pin6',
        saltHex: ov.saltHex,
        kdfIterations: ov.kdfIterations || OVExtCore.KDF_ITERATIONS_V4,
        keyCanary: ov.keyCanary,
        encryptedData: ov.encryptedPayload,
        recordCount: ov.recordCount || 0,
        syncedAt: Date.now()
      };
      await chrome.storage.local.set({ [STORAGE_ENC_KEY]: stored });
      await lockExtensionVault();
      sendResponse({ ok: true, recordCount: stored.recordCount, passcodeMode: stored.passcodeMode });
      return;
    }

    if (type === 'GET_PAGE_MATCH_SUMMARY') {
      const tabUrl = (sender && sender.tab && sender.tab.url) || msg.tabUrl || '';
      const env = await getStoredEnvelope();
      if (!env) {
        sendResponse({ ok: true, hasEnvelope: false, unlocked: false, matchCount: 0, matches: [] });
        return;
      }
      const state = await getDecryptedVaultItems();
      if (!state.unlocked) {
        sendResponse({ ok: true, hasEnvelope: true, unlocked: false, matchCount: 0, matches: [] });
        return;
      }
      const matched = rankAndSummarizeItems(state.items, tabUrl)
        .filter(m => m.score > 0)
        .slice(0, 5)
        .map(m => ({ id: m.id, title: m.title, username: m.username, hasTotp: m.hasTotp }));
      sendResponse({ ok: true, hasEnvelope: true, unlocked: true, matchCount: matched.length, matches: matched });
      return;
    }

    if (type === 'GET_EXT_STATUS') {
      const env = await getStoredEnvelope();
      const sessionRes = await chrome.storage.session.get(SESSION_RAW_KEY);
      const unlocked = !!(env && sessionRes[SESSION_RAW_KEY]);
      sendResponse({
        ok: true,
        hasEnvelope: !!env,
        passcodeMode: env ? (env.passcodeMode || 'pin6') : 'pin6',
        syncedAt: env ? (env.syncedAt || 0) : 0,
        unlocked
      });
      return;
    }

    if (type === 'UNLOCK_EXT_VAULT') {
      if (isFromTab) {
        sendResponse({ ok: false, error: 'POPUP_ONLY' });
        return;
      }
      const env = await getStoredEnvelope();
      if (!env || !env.saltHex || !env.keyCanary || !env.encryptedData) {
        sendResponse({ ok: false, error: 'No synced vault envelope yet.' });
        return;
      }
      const secret = String(msg.secret || '');
      const { cryptoKey, rawKeyBase64 } = await OVExtCore.deriveKeyAndRawBase64(
        secret,
        env.saltHex,
        env.kdfIterations || OVExtCore.KDF_ITERATIONS_V4
      );
      const valid = await OVExtCore.verifyCanary(env.keyCanary, cryptoKey);
      if (!valid) {
        sendResponse({ ok: false, error: 'Incorrect Passcode / Master Password.' });
        return;
      }
      const plain = await OVExtCore.decryptStrict(env.encryptedData, cryptoKey);
      const parsed = JSON.parse(plain || '{}');
      const items = Array.isArray(parsed.items) ? parsed.items.filter(x => x && !x.trashed) : [];
      await chrome.storage.session.set({ [SESSION_RAW_KEY]: rawKeyBase64 });
      resetAutoLockAlarm();
      if (msg.tabUrl && msg.tabId) {
        updateBadgeForTab(msg.tabId, msg.tabUrl);
      }
      sendResponse({ ok: true, totalCount: items.length });
      return;
    }

    if (type === 'LOCK_EXT_VAULT') {
      if (isFromTab) {
        sendResponse({ ok: false, error: 'POPUP_ONLY' });
        return;
      }
      await lockExtensionVault();
      sendResponse({ ok: true });
      return;
    }

    if (type === 'QUERY_VAULT_ITEMS') {
      if (isFromTab) {
        sendResponse({ ok: false, error: 'POPUP_ONLY' });
        return;
      }
      const state = await getDecryptedVaultItems();
      if (!state.unlocked) {
        sendResponse({ ok: false, error: 'VAULT_LOCKED' });
        return;
      }
      resetAutoLockAlarm();
      const ranked = rankAndSummarizeItems(state.items, msg.tabUrl || '', msg.query || '');
      const attachLiveTotp = async (summary) => {
        if (!summary.hasTotp) return summary;
        const full = state.items.find(x => x.id === summary.id);
        if (!full || !full.totpSecret) return summary;
        try {
          const t = await OVExtCore.generateTotp(full.totpSecret);
          return Object.assign({}, summary, { totpFormatted: t.formatted, totpRemaining: t.remaining });
        } catch (e) {
          return summary;
        }
      };
      const matchesRaw = ranked.filter(r => r.score > 0);
      const othersRaw = ranked.filter(r => r.score === 0).slice(0, 60);
      const matches = await Promise.all(matchesRaw.map(attachLiveTotp));
      const others = await Promise.all(othersRaw.map(attachLiveTotp));
      sendResponse({ ok: true, matches, others, totalCount: state.items.length });
      return;
    }

    if (type === 'GET_SECRET_FOR_POPUP') {
      if (isFromTab) {
        sendResponse({ ok: false, error: 'POPUP_ONLY' });
        return;
      }
      const state = await getDecryptedVaultItems();
      if (!state.unlocked) {
        sendResponse({ ok: false, error: 'VAULT_LOCKED' });
        return;
      }
      const item = state.items.find(x => x.id === msg.itemId);
      if (!item) {
        sendResponse({ ok: false, error: 'ITEM_NOT_FOUND' });
        return;
      }
      resetAutoLockAlarm();
      let totp = null;
      if (item.totpSecret && OVExtCore.parseTotpInput(item.totpSecret)) {
        try { totp = await OVExtCore.generateTotp(item.totpSecret); } catch (e) {}
      }
      sendResponse({
        ok: true,
        username: item.username || '',
        password: item.password || '',
        totp
      });
      return;
    }

    if (type === 'FILL_CREDENTIAL_IN_TAB') {
      const state = await getDecryptedVaultItems();
      if (!state.unlocked) {
        sendResponse({ ok: false, error: 'VAULT_LOCKED' });
        return;
      }
      const item = state.items.find(x => x.id === msg.itemId);
      if (!item) {
        sendResponse({ ok: false, error: 'ITEM_NOT_FOUND' });
        return;
      }
      const targetTabId = isFromTab ? sender.tab.id : msg.tabId;
      if (isFromTab) {
        const matchScore = OVExtCore.scoreAccountForUrl(item, sender.tab.url || '');
        if (matchScore <= 0) {
          sendResponse({ ok: false, error: 'DOMAIN_MISMATCH' });
          return;
        }
      }
      if (!targetTabId) {
        sendResponse({ ok: false, error: 'NO_TARGET_TAB' });
        return;
      }
      const payload = await dispatchAutofillToTab(item, targetTabId);
      sendResponse({ ok: true, title: payload.title, hasTotp: !!payload.totpCode });
      return;
    }

    sendResponse({ ok: false, error: 'UNKNOWN_MESSAGE' });
  })().catch(err => {
    sendResponse({ ok: false, error: (err && err.message) || 'EXTENSION_ERROR' });
  });
  return true;
});
