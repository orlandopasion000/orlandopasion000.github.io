/* ==========================================================================
   ORLANDOVAULT PHASE 6: IPHONE FACE ID + DYNAMIC ISLAND AUTO-SEEK ENGINE
   AND ZERO-KNOWLEDGE ENCRYPTED ID / CARD PHOTO SCANS
   ========================================================================== */
(function() {
  'use strict';

  const LS_BIO_WRAP = 'orlandovault_bio_wrap_v4';
  const LS_FACEID_DISMISSED = 'orlandovault_faceid_prompt_dismissed_v1';
  const IDB_FACEID_DB = 'orlandovault_faceid_idb_v4';
  const IDB_FACEID_STORE = 'hw_keys';
  const IDB_FACEID_KEY = 'bio_wrap_key_v4';

  const IDB_SCANS_DB = 'orlandovault_enc_scans_v4';
  const IDB_SCANS_STORE = 'scans';

  let activeFaceIdPromise = null;
  let gestureAutoSeekArmed = true;
  let suppressAutoSeekOnce = false;
  let autoMountTimer = null;
  let diResetTimer = null;
  let forceEnrollPromptNextUnlock = false;
  let currentPinMode = 'unlock';

  // Transient in-memory AES-GCM token holding unlocked secret for 3 mins
  // so 1-tap Face ID enrollment never forces re-typing PIN/Password right after unlock.
  let transientTokenObj = null;
  let transientEphemeralKey = null;

  function hooks() {
    return window._ovFaceIdHooks || {};
  }

  function hasBioWrapConfigured() {
    try {
      const raw = localStorage.getItem(LS_BIO_WRAP);
      if (!raw) return false;
      const p = JSON.parse(raw);
      return !!(p && p.credentialId && (p.wrappedPayload || p.wrappedPwd));
    } catch (e) {
      return false;
    }
  }

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
  }

  function base64ToArrayBuffer(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }

  function hexToBytes(hex) {
    const clean = String(hex || '').replace(/[^0-9a-f]/gi, '');
    const pairs = clean.match(/.{1,2}/g) || [];
    return new Uint8Array(pairs.map(b => parseInt(b, 16)));
  }

  async function isPlatformBiometricSupported() {
    try {
      if (!window.PublicKeyCredential || !navigator.credentials) return false;
      if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function buildRpDescriptor() {
    const rp = { name: 'OrlandoVault' };
    const host = window.location.hostname || '';
    if (host && !/^\d+\.\d+\.\d+\.\d+$/.test(host) && host.includes('.') || host === 'localhost') {
      rp.id = host;
    }
    return rp;
  }

  // IndexedDB helpers for Tier-2 non-extractable CryptoKey storage
  function openIdb(dbName, storeName, keyPath) {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error('IndexedDB unavailable'));
      const req = window.indexedDB.open(dbName, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, keyPath ? { keyPath } : undefined);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('IndexedDB open error'));
    });
  }

  async function putHardwareKeyInIdb(cryptoKey) {
    const db = await openIdb(IDB_FACEID_DB, IDB_FACEID_STORE, null);
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_FACEID_STORE, 'readwrite');
      tx.objectStore(IDB_FACEID_STORE).put(cryptoKey, IDB_FACEID_KEY);
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onerror = () => { db.close(); reject(tx.error || new Error('Failed to store hardware wrap key')); };
    });
  }

  async function getHardwareKeyFromIdb() {
    const db = await openIdb(IDB_FACEID_DB, IDB_FACEID_STORE, null);
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_FACEID_STORE, 'readonly');
      const req = tx.objectStore(IDB_FACEID_STORE).get(IDB_FACEID_KEY);
      req.onsuccess = () => { db.close(); resolve(req.result || null); };
      req.onerror = () => { db.close(); reject(req.error || new Error('Failed to read hardware wrap key')); };
    });
  }

  async function clearHardwareKeyFromIdb() {
    try {
      const db = await openIdb(IDB_FACEID_DB, IDB_FACEID_STORE, null);
      await new Promise((resolve) => {
        const tx = db.transaction(IDB_FACEID_STORE, 'readwrite');
        tx.objectStore(IDB_FACEID_STORE).delete(IDB_FACEID_KEY);
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onerror = () => { db.close(); resolve(); };
      });
    } catch (e) {}
  }

  async function encryptWithAesKey(text, aesKey) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);
    const cipherBuf = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, encoded);
    return {
      v: 4,
      iv: arrayBufferToBase64(iv),
      ciphertext: arrayBufferToBase64(cipherBuf)
    };
  }

  async function decryptWithAesKey(cipherObj, aesKey) {
    if (!cipherObj || !cipherObj.iv || !cipherObj.ciphertext) {
      throw new Error('Invalid encrypted biometric payload.');
    }
    const iv = new Uint8Array(base64ToArrayBuffer(cipherObj.iv));
    const cipherBuf = base64ToArrayBuffer(cipherObj.ciphertext);
    const plainBuf = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, cipherBuf);
    return new TextDecoder().decode(plainBuf);
  }

  async function deriveExtractableKeyB64(secret, saltHex, iterations) {
    const keyMat = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    const derived = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: hexToBytes(saltHex),
        iterations: iterations || 600000,
        hash: 'SHA-256'
      },
      keyMat,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const rawBuf = await window.crypto.subtle.exportKey('raw', derived);
    const rawView = new Uint8Array(rawBuf);
    const b64 = arrayBufferToBase64(rawBuf);
    rawView.fill(0);
    return b64;
  }

  // Transient enrollment secret handling (RAM-only encrypted for 180s)
  async function stashTransientUnlockSecret(secret, saltHex, passcodeMode) {
    try {
      if (!secret || !saltHex) return;
      transientEphemeralKey = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
      transientTokenObj = await encryptWithAesKey(JSON.stringify({
        secret,
        saltHex,
        passcodeMode: passcodeMode || 'pin6',
        exp: Date.now() + 180000
      }), transientEphemeralKey);
    } catch (e) {
      clearTransientSecret();
    }
  }

  async function readTransientUnlockSecret() {
    try {
      if (!transientTokenObj || !transientEphemeralKey) return null;
      const jsonStr = await decryptWithAesKey(transientTokenObj, transientEphemeralKey);
      const obj = JSON.parse(jsonStr);
      if (!obj || !obj.secret || Date.now() > (obj.exp || 0)) {
        clearTransientSecret();
        return null;
      }
      return obj;
    } catch (e) {
      return null;
    }
  }

  function clearTransientSecret() {
    transientTokenObj = null;
    transientEphemeralKey = null;
  }

  // ==========================================================================
  // DYNAMIC ISLAND UI CONTROLLER
  // ==========================================================================
  function ensureDynamicIslandEl() {
    let di = document.getElementById('iosDynamicIsland');
    if (di) return di;
    const overlay = document.getElementById('vaultLockOverlay');
    if (!overlay) return null;
    di = document.createElement('div');
    di.id = 'iosDynamicIsland';
    di.className = 'ios-dynamic-island';
    di.setAttribute('data-di-state', 'idle');
    di.setAttribute('role', 'button');
    di.setAttribute('tabindex', '0');
    di.setAttribute('aria-label', 'Face ID Dynamic Island');
    di.innerHTML = buildDynamicIslandInnerHtml();
    overlay.insertBefore(di, overlay.firstChild);
    bindDynamicIslandClick(di);
    return di;
  }

  function buildDynamicIslandInnerHtml() {
    return `
      <span class="di-lock-wrap" aria-hidden="true">
        <svg class="di-lock-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
          <path class="di-lock-shackle" d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          <rect x="5" y="11" width="14" height="10" rx="2.5"></rect>
        </svg>
      </span>
      <span class="di-label" id="iosDiText">Face ID</span>
      <span class="di-face-wrap" aria-hidden="true">
        <svg class="di-face-svg" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8.5 3.5H5.5C4.4 3.5 3.5 4.4 3.5 5.5V8.5"/>
          <path d="M19.5 3.5H22.5C23.6 3.5 24.5 4.4 24.5 5.5V8.5"/>
          <path d="M3.5 19.5V22.5C3.5 23.6 4.4 24.5 5.5 24.5H8.5"/>
          <path d="M24.5 19.5V22.5C24.5 23.6 23.6 24.5 22.5 24.5H19.5"/>
          <path d="M9.8 10.2V12.2"/>
          <path d="M18.2 10.2V12.2"/>
          <path d="M14 10.2V14.6C14 15.3 13.5 15.8 12.8 15.8H12.2"/>
          <path d="M10 18.2C11 19.6 12.4 20.3 14 20.3C15.6 20.3 17 19.6 18 18.2"/>
        </svg>
        <svg class="di-check-svg" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="14" cy="14" r="10.5"/>
          <polyline points="9.5 14.3 12.6 17.5 18.8 11.2"/>
        </svg>
      </span>
    `;
  }

  function setDynamicIslandState(state, customLabel) {
    const di = ensureDynamicIslandEl();
    if (!di) return;
    if (diResetTimer) { clearTimeout(diResetTimer); diResetTimer = null; }
    di.setAttribute('data-di-state', state || 'idle');
    const txt = document.getElementById('iosDiText');
    if (txt) {
      if (customLabel !== undefined) txt.textContent = customLabel;
      else if (state === 'scanning') txt.textContent = 'Face ID';
      else if (state === 'matched') txt.textContent = 'Unlocked';
      else if (state === 'failed') txt.textContent = 'Face ID Failed';
      else if (state === 'hint') txt.textContent = 'Passcode first';
      else txt.textContent = '';
    }
  }

  function updateDynamicIslandVisibility(visible) {
    const di = ensureDynamicIslandEl();
    if (!di) return;
    di.classList.toggle('visible', !!visible);
    if (visible) {
      di.classList.toggle('di-configured', hasBioWrapConfigured());
    }
  }

  function handleDynamicIslandActivation() {
    if (hasBioWrapConfigured()) {
      unlockWithFaceId({ reason: 'dynamic_island', silentOnCancel: false });
      return;
    }
    setDynamicIslandState('hint', 'Passcode first');
    const subEl = document.getElementById('iosPinSubHint');
    if (subEl) {
      subEl.textContent = 'Enter your 6-digit passcode once to activate Face ID';
      subEl.classList.add('visible');
    }
    forceEnrollPromptNextUnlock = true;
    diResetTimer = setTimeout(() => setDynamicIslandState('idle'), 1500);
  }

  function bindDynamicIslandClick(di) {
    if (!di || di._diBound) return;
    di._diBound = true;
    di.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleDynamicIslandActivation();
    });
    di.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleDynamicIslandActivation();
      }
    });
  }

  // ==========================================================================
  // 1-TAP FACE ID ACTIVATION SHEET (#iosFaceIdEnrollSheet)
  // ==========================================================================
  function ensureFaceIdEnrollSheet() {
    let sheet = document.getElementById('iosFaceIdEnrollSheet');
    if (sheet) return sheet;
    sheet = document.createElement('div');
    sheet.id = 'iosFaceIdEnrollSheet';
    sheet.className = 'ios-faceid-sheet-backdrop';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', 'Enable iPhone Face ID');
    sheet.innerHTML = `
      <div class="ios-faceid-sheet-card">
        <div class="ios-faceid-hero-icon" aria-hidden="true">
          <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8.5 3.5H5.5C4.4 3.5 3.5 4.4 3.5 5.5V8.5"/>
            <path d="M19.5 3.5H22.5C23.6 3.5 24.5 4.4 24.5 5.5V8.5"/>
            <path d="M3.5 19.5V22.5C3.5 23.6 4.4 24.5 5.5 24.5H8.5"/>
            <path d="M24.5 19.5V22.5C24.5 23.6 23.6 24.5 22.5 24.5H19.5"/>
            <path d="M9.8 10.2V12.2"/>
            <path d="M18.2 10.2V12.2"/>
            <path d="M14 10.2V14.6C14 15.3 13.5 15.8 12.8 15.8H12.2"/>
            <path d="M10 18.2C11 19.6 12.4 20.3 14 20.3C15.6 20.3 17 19.6 18 18.2"/>
          </svg>
        </div>
        <h3 class="ios-faceid-sheet-title">Enable iPhone Face ID?</h3>
        <p class="ios-faceid-sheet-desc" id="faceIdSheetDesc">Unlock OrlandoVault automatically the moment you look at your iPhone or start entering your 6 digits.</p>
        <div id="faceIdSecretVerifyRow" class="ios-faceid-verify-row" style="display:none;">
          <input type="password" id="faceIdVerifyInput" class="vault-gate-input" autocomplete="off" placeholder="Confirm your 6-digit passcode or password...">
        </div>
        <div id="faceIdEnrollError" class="ios-faceid-error" style="display:none;"></div>
        <div class="ios-faceid-sheet-actions">
          <button type="button" id="btnConfirmFaceIdSheet" class="btn-ios-faceid-primary">Activate Face ID</button>
          <button type="button" id="btnLaterFaceIdSheet" class="btn-ios-faceid-secondary">Not Now</button>
        </div>
      </div>
    `;
    document.body.appendChild(sheet);

    const closeSheet = (markDismissed) => {
      sheet.classList.remove('active');
      const err = document.getElementById('faceIdEnrollError');
      if (err) { err.style.display = 'none'; err.textContent = ''; }
      const inp = document.getElementById('faceIdVerifyInput');
      if (inp) inp.value = '';
      if (markDismissed) {
        try { localStorage.setItem(LS_FACEID_DISMISSED, '1'); } catch (e) {}
      }
    };

    document.getElementById('btnLaterFaceIdSheet').onclick = () => closeSheet(true);
    sheet.addEventListener('click', (e) => { if (e.target === sheet) closeSheet(false); });

    document.getElementById('btnConfirmFaceIdSheet').onclick = async () => {
      const btn = document.getElementById('btnConfirmFaceIdSheet');
      const errEl = document.getElementById('faceIdEnrollError');
      const verifyRow = document.getElementById('faceIdSecretVerifyRow');
      const inp = document.getElementById('faceIdVerifyInput');
      if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
      const needsInput = verifyRow && verifyRow.style.display !== 'none';
      const typedSecret = needsInput && inp ? inp.value : null;
      if (needsInput && !typedSecret) {
        if (errEl) { errEl.textContent = 'Please enter your current passcode or password.'; errEl.style.display = 'block'; }
        return;
      }
      try {
        btn.disabled = true;
        btn.textContent = 'Scanning Face ID...';
        await enrollFaceId(typedSecret);
        closeSheet(false);
        if (typeof window.showToast === 'function') window.showToast('Face ID & Dynamic Island Auto-Unlock active!', '🧬');
      } catch (err) {
        if (errEl) {
          errEl.textContent = (err && err.message) || 'Could not activate Face ID.';
          errEl.style.display = 'block';
        }
      } finally {
        btn.disabled = false;
        btn.textContent = needsInput ? 'Verify & Activate Face ID' : 'Activate Face ID';
      }
    };
    return sheet;
  }

  async function openEnrollSheet(preferredMode) {
    const sheet = ensureFaceIdEnrollSheet();
    const verifyRow = document.getElementById('faceIdSecretVerifyRow');
    const confirmBtn = document.getElementById('btnConfirmFaceIdSheet');
    const errEl = document.getElementById('faceIdEnrollError');
    const inp = document.getElementById('faceIdVerifyInput');
    if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
    if (inp) inp.value = '';

    const tok = await readTransientUnlockSecret();
    const useOneTap = preferredMode === 'one_tap' || !!tok;
    if (verifyRow) verifyRow.style.display = useOneTap ? 'none' : 'block';
    if (confirmBtn) confirmBtn.textContent = useOneTap ? 'Activate Face ID' : 'Verify & Activate Face ID';
    sheet.classList.add('active');
    if (!useOneTap && inp) setTimeout(() => inp.focus(), 80);
  }

  function closeEnrollSheet() {
    const sheet = document.getElementById('iosFaceIdEnrollSheet');
    if (sheet) sheet.classList.remove('active');
  }

  // ==========================================================================
  // CORE WEBAUTHN FACE ID ENROLLMENT & DUAL-TIER UNLOCK ENGINE
  // ==========================================================================
  async function enrollFaceId(explicitSecret = null) {
    if (!window.PublicKeyCredential || !navigator.credentials) {
      throw new Error('Face ID / WebAuthn Passkeys are not supported in this browser.');
    }
    const h = hooks();
    if (!h.isUnlocked || !h.isUnlocked()) {
      throw new Error('Unlock OrlandoVault before activating Face ID.');
    }
    const meta = (h.getActiveMeta && h.getActiveMeta()) || null;
    if (!meta || !meta.saltHex) {
      throw new Error('Vault encryption metadata is unavailable.');
    }

    let secret = explicitSecret;
    let saltHex = meta.saltHex;
    let passcodeMode = meta.passcodeMode || 'pin6';

    if (secret) {
      const ok = h.verifySecretAgainstActiveMeta ? await h.verifySecretAgainstActiveMeta(secret) : false;
      if (!ok) throw new Error('Incorrect passcode / password.');
    } else {
      const tok = await readTransientUnlockSecret();
      if (!tok || !tok.secret) {
        await openEnrollSheet('verify_secret');
        throw new Error('Passcode confirmation required to enroll Face ID.');
      }
      secret = tok.secret;
      saltHex = tok.saltHex || saltHex;
      passcodeMode = tok.passcodeMode || passcodeMode;
    }

    const rawKeyB64 = await deriveExtractableKeyB64(secret, saltHex, meta.kdfIterations || 600000);
    const bundleJson = JSON.stringify({ rawKeyB64, secret, saltHex, passcodeMode });

    const prfSalt = new Uint8Array(32);
    const challenge = new Uint8Array(32);
    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(prfSalt);
    window.crypto.getRandomValues(challenge);
    window.crypto.getRandomValues(userId);

    const emailLabel = document.getElementById('syncAuthEmailLabel')?.textContent;
    const userEmail = (emailLabel && emailLabel !== 'Not Signed In') ? emailLabel : 'owner@orlandovault';

    const cred = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: buildRpDescriptor(),
        user: {
          id: userId,
          name: userEmail,
          displayName: 'OrlandoVault Face ID'
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },
          { alg: -257, type: 'public-key' }
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred'
        },
        extensions: {
          prf: { eval: { first: prfSalt } }
        }
      }
    });

    const ext = cred.getClientExtensionResults ? cred.getClientExtensionResults() : {};
    let prfBytes = (ext.prf && ext.prf.results && ext.prf.results.first) ? new Uint8Array(ext.prf.results.first) : null;
    if (!prfBytes && ext.prf && ext.prf.enabled === true) {
      try {
        const chal2 = new Uint8Array(32);
        window.crypto.getRandomValues(chal2);
        const a2 = await navigator.credentials.get({
          publicKey: {
            challenge: chal2,
            allowCredentials: [{ id: cred.rawId, type: 'public-key' }],
            userVerification: 'required',
            extensions: { prf: { eval: { first: prfSalt } } }
          }
        });
        const ext2 = a2.getClientExtensionResults ? a2.getClientExtensionResults() : {};
        if (ext2.prf && ext2.prf.results && ext2.prf.results.first) {
          prfBytes = new Uint8Array(ext2.prf.results.first);
        }
      } catch (e) {}
    }

    let record;
    if (prfBytes && prfBytes.byteLength > 0) {
      const wrapDigest = await window.crypto.subtle.digest('SHA-256', prfBytes);
      const wrapKey = await window.crypto.subtle.importKey('raw', wrapDigest, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
      const wrappedPayload = await encryptWithAesKey(bundleJson, wrapKey);
      record = {
        v: 6,
        tier: 'prf',
        credentialId: arrayBufferToBase64(cred.rawId),
        prfSalt: arrayBufferToBase64(prfSalt),
        wrappedPayload,
        saltHex,
        createdAt: Date.now()
      };
    } else {
      const idbWrapKey = await window.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
      await putHardwareKeyInIdb(idbWrapKey);
      const wrappedPayload = await encryptWithAesKey(bundleJson, idbWrapKey);
      record = {
        v: 6,
        tier: 'idb_uv',
        credentialId: arrayBufferToBase64(cred.rawId),
        wrappedPayload,
        saltHex,
        createdAt: Date.now()
      };
    }

    localStorage.setItem(LS_BIO_WRAP, JSON.stringify(record));
    try { localStorage.removeItem(LS_FACEID_DISMISSED); } catch (e) {}
    updateDynamicIslandVisibility(false);
    if (h.refreshBioUI) h.refreshBioUI();
    if (typeof window.logAudit === 'function') {
      window.logAudit('FACEID_ENABLED', `Activated iPhone Face ID Quick-Unlock (${record.tier})`);
    }
    return record;
  }

  async function disableFaceId() {
    try { localStorage.removeItem(LS_BIO_WRAP); } catch (e) {}
    await clearHardwareKeyFromIdb();
    updateDynamicIslandVisibility(currentPinMode === 'unlock');
    if (hooks().refreshBioUI) hooks().refreshBioUI();
  }

  function clearBioWrapStorage() {
    try { localStorage.removeItem(LS_BIO_WRAP); } catch (e) {}
    clearHardwareKeyFromIdb();
    updateDynamicIslandVisibility(currentPinMode === 'unlock');
  }

  async function runFaceIdAttempt(opts) {
    const options = opts || {};
    const reason = options.reason || 'manual';
    const silentOnCancel = !!options.silentOnCancel;
    const h = hooks();

    const raw = localStorage.getItem(LS_BIO_WRAP);
    if (!raw) throw new Error('Face ID is not configured on this device.');
    const saved = JSON.parse(raw);
    if (!saved || !saved.credentialId || (!saved.wrappedPayload && !saved.wrappedPwd)) {
      throw new Error('Stored Face ID configuration is incomplete.');
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);
    const pubKey = {
      challenge,
      allowCredentials: [{ id: base64ToArrayBuffer(saved.credentialId), type: 'public-key' }],
      userVerification: 'required'
    };
    if (saved.tier !== 'idb_uv' && saved.prfSalt) {
      pubKey.extensions = {
        prf: { eval: { first: new Uint8Array(base64ToArrayBuffer(saved.prfSalt)) } }
      };
    }

    setDynamicIslandState('scanning', 'Face ID');
    const tStart = performance.now();

    try {
      const assertion = await navigator.credentials.get({ publicKey: pubKey });
      if (!assertion || !assertion.response || !assertion.response.authenticatorData) {
        throw new Error('Face ID assertion returned empty authenticator data.');
      }

      const authData = new Uint8Array(assertion.response.authenticatorData);
      if (authData.byteLength < 37) {
        throw new Error('Malformed authenticator data.');
      }
      const flags = authData[32];
      const userPresent = (flags & 0x01) !== 0;
      const userVerified = (flags & 0x04) !== 0;
      if (!userPresent || !userVerified) {
        throw new Error('Face ID biometric verification flag not satisfied.');
      }

      let bundle = null;
      if (saved.tier === 'idb_uv') {
        const hwKey = await getHardwareKeyFromIdb();
        if (!hwKey) throw new Error('Hardware biometric wrap key missing on this device.');
        const plainJson = await decryptWithAesKey(saved.wrappedPayload, hwKey);
        bundle = JSON.parse(plainJson);
      } else {
        const ext = assertion.getClientExtensionResults ? assertion.getClientExtensionResults() : {};
        const prfBytes = (ext.prf && ext.prf.results && ext.prf.results.first)
          ? new Uint8Array(ext.prf.results.first)
          : null;
        if (!prfBytes || prfBytes.byteLength === 0) {
          throw new Error('Face ID hardware PRF key release failed.');
        }
        const wrapDigest = await window.crypto.subtle.digest('SHA-256', prfBytes);
        const wrapKey = await window.crypto.subtle.importKey('raw', wrapDigest, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
        if (saved.wrappedPayload) {
          const plainJson = await decryptWithAesKey(saved.wrappedPayload, wrapKey);
          bundle = JSON.parse(plainJson);
        } else if (saved.wrappedPwd) {
          // Backward compatible upgrade path for Phase 1 LS_BIO_WRAP
          const legacySecret = window.VaultCrypto
            ? await window.VaultCrypto.decryptStrict(saved.wrappedPwd, wrapKey)
            : await decryptWithAesKey(saved.wrappedPwd, wrapKey);
          bundle = { rawKeyB64: null, secret: legacySecret, saltHex: null, passcodeMode: 'pin6' };
        }
      }

      if (h.isUnlocked && h.isUnlocked()) {
        setDynamicIslandState('idle');
        return true;
      }

      gestureAutoSeekArmed = false;
      setDynamicIslandState('matched', 'Unlocked');
      if (h.fillAllPinDotsForMatch) h.fillAllPinDotsForMatch();
      if (navigator.vibrate) {
        try { navigator.vibrate([12, 30, 18]); } catch (e) {}
      }

      await new Promise(r => setTimeout(r, 220));
      if (h.completeFastHardwareUnlock) {
        await h.completeFastHardwareUnlock(bundle);
      }
      return true;
    } catch (err) {
      const elapsed = performance.now() - tStart;
      const isGestureGate = reason === 'auto_mount'
        && err
        && (err.name === 'NotAllowedError' || err.name === 'SecurityError')
        && elapsed < 220
        && !(navigator.userActivation && navigator.userActivation.isActive);

      if (isGestureGate) {
        gestureAutoSeekArmed = true;
        setDynamicIslandState('idle');
        return false;
      }

      setDynamicIslandState('failed', 'Face ID Failed');
      if (diResetTimer) clearTimeout(diResetTimer);
      diResetTimer = setTimeout(() => setDynamicIslandState('idle'), 1000);

      if (!silentOnCancel && h.setLockError) {
        h.setLockError('Face ID: ' + ((err && err.message) || 'Verification cancelled or did not match.'));
      }
      if (silentOnCancel) return false;
      throw err;
    }
  }

  function unlockWithFaceId(opts = {}) {
    if (activeFaceIdPromise) return activeFaceIdPromise;
    activeFaceIdPromise = (async () => {
      try {
        return await runFaceIdAttempt(opts);
      } finally {
        activeFaceIdPromise = null;
      }
    })();
    return activeFaceIdPromise;
  }

  // ==========================================================================
  // AUTOMATIC FACE ID SEEKING HOOKS (LOCK SCREEN, DIGIT TAP, SWIPE UP, RESUME)
  // ==========================================================================
  function onPinPanelShown(mode) {
    currentPinMode = mode || 'unlock';
    const isUnlock = currentPinMode === 'unlock';
    updateDynamicIslandVisibility(isUnlock);
    if (!isUnlock) {
      setDynamicIslandState('idle');
      return;
    }

    setDynamicIslandState('idle');
    if (hasBioWrapConfigured()) {
      gestureAutoSeekArmed = true;
      if (!suppressAutoSeekOnce && document.visibilityState === 'visible') {
        if (autoMountTimer) clearTimeout(autoMountTimer);
        autoMountTimer = setTimeout(() => {
          const pinPanel = document.getElementById('iosPinPanel');
          const overlay = document.getElementById('vaultLockOverlay');
          const panelOpen = pinPanel && pinPanel.style.display !== 'none' && overlay && !overlay.classList.contains('unlocked');
          if (panelOpen && currentPinMode === 'unlock' && !(hooks().isUnlocked && hooks().isUnlocked())) {
            unlockWithFaceId({ reason: 'auto_mount', silentOnCancel: true }).catch(() => {});
          }
        }, 80);
      }
    } else {
      gestureAutoSeekArmed = false;
    }
    suppressAutoSeekOnce = false;
  }

  function onKeypadDigitClick() {
    if (currentPinMode !== 'unlock') return;
    if (!hasBioWrapConfigured()) return;
    if (!gestureAutoSeekArmed || activeFaceIdPromise) return;
    if (hooks().isUnlocked && hooks().isUnlocked()) return;
    gestureAutoSeekArmed = false;
    // Fires immediately inside real click gesture so iOS Safari allows Face ID prompt
    // while keeping already-tapped digits intact if user falls back to passcode!
    unlockWithFaceId({ reason: 'typing_digits', silentOnCancel: true }).catch(() => {});
  }

  function onManualVaultLock() {
    suppressAutoSeekOnce = true;
    gestureAutoSeekArmed = true;
    clearTransientSecret();
    if (autoMountTimer) { clearTimeout(autoMountTimer); autoMountTimer = null; }
    setDynamicIslandState('idle');
    if (window.VaultEncryptedScans) window.VaultEncryptedScans.clearDecryptedMemory();
  }

  async function onPasscodeUnlockSuccess(secret, saltHex, passcodeMode, isInteractive = false) {
    await stashTransientUnlockSecret(secret, saltHex, passcodeMode);
    if (hasBioWrapConfigured()) {
      forceEnrollPromptNextUnlock = false;
      return;
    }
    let dismissed = false;
    try { dismissed = localStorage.getItem(LS_FACEID_DISMISSED) === '1'; } catch (e) {}
    const isTouchDevice = (navigator.maxTouchPoints > 0)
      || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || '')
      || !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    const shouldForce = forceEnrollPromptNextUnlock;
    forceEnrollPromptNextUnlock = false;
    if (!shouldForce && (!isInteractive || !isTouchDevice || dismissed)) return;

    const supported = await isPlatformBiometricSupported();
    if (!supported && !shouldForce) return;

    setTimeout(() => {
      if (hooks().isUnlocked && hooks().isUnlocked() && !hasBioWrapConfigured()) {
        openEnrollSheet('one_tap');
      }
    }, 360);
  }

  function wireGlobalGestures() {
    ensureDynamicIslandEl();
    const overlay = document.getElementById('vaultLockOverlay');
    if (overlay && !overlay._faceIdSwipeBound) {
      overlay._faceIdSwipeBound = true;
      let startY = null;
      let startX = null;

      overlay.addEventListener('pointerdown', (e) => {
        if (e.target && e.target.closest && e.target.closest('.ios-key-btn, button, input')) {
          startY = null;
          return;
        }
        startY = e.clientY;
        startX = e.clientX;
      }, { passive: true });

      overlay.addEventListener('pointerup', (e) => {
        if (startY === null) return;
        const dy = e.clientY - startY;
        const dx = Math.abs(e.clientX - startX);
        startY = null;
        if (dy <= -36 && dx < 70 && currentPinMode === 'unlock' && hasBioWrapConfigured()) {
          const pinPanel = document.getElementById('iosPinPanel');
          if (pinPanel && pinPanel.style.display !== 'none' && !overlay.classList.contains('unlocked')) {
            unlockWithFaceId({ reason: 'swipe_up', silentOnCancel: false }).catch(() => {});
          }
        }
      }, { passive: true });
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return;
      const overlayEl = document.getElementById('vaultLockOverlay');
      const pinPanel = document.getElementById('iosPinPanel');
      const isLockedOnPin = overlayEl && !overlayEl.classList.contains('unlocked')
        && pinPanel && pinPanel.style.display !== 'none'
        && currentPinMode === 'unlock';
      if (isLockedOnPin && hasBioWrapConfigured() && !activeFaceIdPromise && !(hooks().isUnlocked && hooks().isUnlocked())) {
        unlockWithFaceId({ reason: 'visibility_return', silentOnCancel: true }).catch(() => {});
      }
    });
  }

  // ==========================================================================
  // ZERO-KNOWLEDGE ENCRYPTED ID & CARD PHOTO SCANS (INDEXEDDB + CLOUD SYNC)
  // ==========================================================================
  const decryptedScanCache = new Map();
  let pendingEditorScans = {
    itemId: '',
    frontDataUrl: undefined,
    backDataUrl: undefined,
    removeFront: false,
    removeBack: false
  };

  async function compressImageToDataUrl(fileOrDataUrl, maxDim = 1000, quality = 0.76) {
    let srcUrl = '';
    let revokeObjUrl = false;
    if (typeof fileOrDataUrl === 'string') {
      srcUrl = fileOrDataUrl;
    } else if (fileOrDataUrl instanceof Blob) {
      srcUrl = URL.createObjectURL(fileOrDataUrl);
      revokeObjUrl = true;
    } else {
      throw new Error('Unsupported scan image source.');
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          let w = img.naturalWidth || img.width || 640;
          let h = img.naturalHeight || img.height || 400;
          if (w > maxDim || h > maxDim) {
            const ratio = Math.min(maxDim / w, maxDim / h);
            w = Math.max(1, Math.round(w * ratio));
            h = Math.max(1, Math.round(h * ratio));
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          let outUrl = '';
          try {
            outUrl = canvas.toDataURL('image/webp', quality);
          } catch (e) {}
          if (!outUrl || !outUrl.startsWith('data:image/')) {
            outUrl = canvas.toDataURL('image/jpeg', quality);
          }
          if (revokeObjUrl) URL.revokeObjectURL(srcUrl);
          resolve(outUrl);
        } catch (err) {
          if (revokeObjUrl) URL.revokeObjectURL(srcUrl);
          reject(err);
        }
      };
      img.onerror = () => {
        if (revokeObjUrl) URL.revokeObjectURL(srcUrl);
        reject(new Error('Failed to decode scan image.'));
      };
      img.src = srcUrl;
    });
  }

  async function getLocalScanRecord(itemId) {
    if (!itemId) return null;
    try {
      const db = await openIdb(IDB_SCANS_DB, IDB_SCANS_STORE, 'itemId');
      return await new Promise((resolve) => {
        const tx = db.transaction(IDB_SCANS_STORE, 'readonly');
        const req = tx.objectStore(IDB_SCANS_STORE).get(itemId);
        req.onsuccess = () => { db.close(); resolve(req.result || null); };
        req.onerror = () => { db.close(); resolve(null); };
      });
    } catch (e) {
      return null;
    }
  }

  async function putLocalScanRecord(record) {
    const db = await openIdb(IDB_SCANS_DB, IDB_SCANS_STORE, 'itemId');
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_SCANS_STORE, 'readwrite');
      tx.objectStore(IDB_SCANS_STORE).put(record);
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onerror = () => { db.close(); reject(tx.error || new Error('Scan IndexedDB write error')); };
    });
  }

  async function syncEncryptedScanRecordToCloud(record) {
    try {
      const b = window.OrlandoVaultCloudBridge;
      if (!b || !b.isUnlocked() || !b.isCloudAuthenticated() || !b.firebaseDb) return false;
      const docName = 'scan_' + record.itemId;
      await b.firebaseDb.collection('orlandovault_sync').doc(docName).set({
        itemId: record.itemId,
        frontEnc: record.frontEnc ? JSON.stringify(record.frontEnc) : '',
        backEnc: record.backEnc ? JSON.stringify(record.backEnc) : '',
        updatedAt: record.updatedAt || Date.now()
      }, { merge: true });
      return true;
    } catch (e) {
      return false;
    }
  }

  async function fetchCloudScanRecord(itemId) {
    try {
      const b = window.OrlandoVaultCloudBridge;
      if (!b || !b.isUnlocked() || !b.isCloudAuthenticated() || !b.firebaseDb) return null;
      const snap = await b.firebaseDb.collection('orlandovault_sync').doc('scan_' + itemId).get();
      if (!snap || !snap.exists) return null;
      const d = snap.data() || {};
      return {
        itemId,
        frontEnc: d.frontEnc ? JSON.parse(d.frontEnc) : null,
        backEnc: d.backEnc ? JSON.parse(d.backEnc) : null,
        updatedAt: d.updatedAt || 0
      };
    } catch (e) {
      return null;
    }
  }

  async function saveItemScan(itemId, side, fileOrDataUrl) {
    const h = hooks();
    if (!h.isUnlocked || !h.isUnlocked() || !h.encryptWithSession) {
      throw new Error('Unlock OrlandoVault before saving encrypted scans.');
    }
    const compactDataUrl = await compressImageToDataUrl(fileOrDataUrl, 1000, 0.76);
    const encObj = await h.encryptWithSession(compactDataUrl);
    const existing = (await getLocalScanRecord(itemId)) || { itemId, frontEnc: null, backEnc: null, updatedAt: 0 };
    if (side === 'back') existing.backEnc = encObj;
    else existing.frontEnc = encObj;
    existing.updatedAt = Date.now();
    await putLocalScanRecord(existing);

    const cached = decryptedScanCache.get(itemId) || { front: null, back: null };
    if (side === 'back') cached.back = compactDataUrl;
    else cached.front = compactDataUrl;
    decryptedScanCache.set(itemId, cached);

    syncEncryptedScanRecordToCloud(existing).catch(() => {});
    if (typeof window.logAudit === 'function') {
      window.logAudit('SAVED_ENCRYPTED_SCAN', `Saved AES-GCM ${side} scan for ${itemId}`);
    }
    return compactDataUrl;
  }

  async function removeItemScan(itemId, side) {
    const existing = await getLocalScanRecord(itemId);
    if (!existing) return;
    if (side === 'back') existing.backEnc = null;
    else existing.frontEnc = null;
    existing.updatedAt = Date.now();
    await putLocalScanRecord(existing);
    const cached = decryptedScanCache.get(itemId);
    if (cached) {
      if (side === 'back') cached.back = null;
      else cached.front = null;
    }
    syncEncryptedScanRecordToCloud(existing).catch(() => {});
  }

  async function loadDecryptedScans(itemId) {
    const h = hooks();
    if (!itemId || !h.isUnlocked || !h.isUnlocked() || !h.decryptWithSession) {
      return { front: null, back: null };
    }
    if (decryptedScanCache.has(itemId)) {
      return decryptedScanCache.get(itemId);
    }
    let rec = await getLocalScanRecord(itemId);
    if ((!rec || (!rec.frontEnc && !rec.backEnc))) {
      const cloudRec = await fetchCloudScanRecord(itemId);
      if (cloudRec && (cloudRec.frontEnc || cloudRec.backEnc)) {
        rec = cloudRec;
        await putLocalScanRecord(cloudRec).catch(() => {});
      }
    }
    const out = { front: null, back: null };
    if (rec && rec.frontEnc && rec.frontEnc.ciphertext) {
      try { out.front = await h.decryptWithSession(rec.frontEnc); } catch (e) {}
    }
    if (rec && rec.backEnc && rec.backEnc.ciphertext) {
      try { out.back = await h.decryptWithSession(rec.backEnc); } catch (e) {}
    }
    decryptedScanCache.set(itemId, out);
    return out;
  }

  async function hasScansMeta(itemId) {
    const rec = await getLocalScanRecord(itemId);
    return !!(rec && (rec.frontEnc || rec.backEnc));
  }

  async function reencryptAllLocalScans(oldDecryptFn, newEncryptFn) {
    try {
      const db = await openIdb(IDB_SCANS_DB, IDB_SCANS_STORE, 'itemId');
      const all = await new Promise((resolve) => {
        const tx = db.transaction(IDB_SCANS_STORE, 'readonly');
        const req = tx.objectStore(IDB_SCANS_STORE).getAll();
        req.onsuccess = () => { db.close(); resolve(req.result || []); };
        req.onerror = () => { db.close(); resolve([]); };
      });
      for (let i = 0; i < all.length; i++) {
        const rec = all[i];
        let changed = false;
        if (rec.frontEnc && rec.frontEnc.ciphertext) {
          try {
            const plain = await oldDecryptFn(rec.frontEnc);
            if (plain) { rec.frontEnc = await newEncryptFn(plain); changed = true; }
          } catch (e) {}
        }
        if (rec.backEnc && rec.backEnc.ciphertext) {
          try {
            const plain = await oldDecryptFn(rec.backEnc);
            if (plain) { rec.backEnc = await newEncryptFn(plain); changed = true; }
          } catch (e) {}
        }
        if (changed) {
          rec.updatedAt = Date.now();
          await putLocalScanRecord(rec);
          syncEncryptedScanRecordToCloud(rec).catch(() => {});
        }
      }
    } catch (e) {}
  }

  // Editor scan staging helpers
  function resetEditorScansForItem(itemId) {
    pendingEditorScans = {
      itemId: itemId || '',
      frontDataUrl: undefined,
      backDataUrl: undefined,
      removeFront: false,
      removeBack: false
    };
    refreshEditorScanStatusLabels();
  }

  async function stageEditorScan(side, fileOrDataUrl) {
    const compact = await compressImageToDataUrl(fileOrDataUrl, 1000, 0.76);
    if (side === 'back') {
      pendingEditorScans.backDataUrl = compact;
      pendingEditorScans.removeBack = false;
    } else {
      pendingEditorScans.frontDataUrl = compact;
      pendingEditorScans.removeFront = false;
    }
    refreshEditorScanStatusLabels();
    return compact;
  }

  function clearStagedEditorScan(side) {
    if (side === 'back') {
      pendingEditorScans.backDataUrl = undefined;
      pendingEditorScans.removeBack = true;
    } else {
      pendingEditorScans.frontDataUrl = undefined;
      pendingEditorScans.removeFront = true;
    }
    refreshEditorScanStatusLabels();
  }

  async function refreshEditorScanStatusLabels() {
    const lblF = document.getElementById('lblScanFrontStatus');
    const lblB = document.getElementById('lblScanBackStatus');
    const rmF = document.getElementById('btnRemoveScanFront');
    const rmB = document.getElementById('btnRemoveScanBack');
    if (!lblF && !lblB) return;

    let hasExistingF = false;
    let hasExistingB = false;
    if (pendingEditorScans.itemId) {
      const rec = await getLocalScanRecord(pendingEditorScans.itemId);
      hasExistingF = !!(rec && rec.frontEnc && rec.frontEnc.ciphertext);
      hasExistingB = !!(rec && rec.backEnc && rec.backEnc.ciphertext);
    }

    const frontReady = !pendingEditorScans.removeFront && (!!pendingEditorScans.frontDataUrl || hasExistingF);
    const backReady = !pendingEditorScans.removeBack && (!!pendingEditorScans.backDataUrl || hasExistingB);

    if (lblF) {
      lblF.textContent = pendingEditorScans.frontDataUrl
        ? 'Staged (Encrypted on Save)'
        : (frontReady ? 'Encrypted Scan Stored' : 'None');
      lblF.classList.toggle('ready', frontReady);
    }
    if (lblB) {
      lblB.textContent = pendingEditorScans.backDataUrl
        ? 'Staged (Encrypted on Save)'
        : (backReady ? 'Encrypted Scan Stored' : 'None');
      lblB.classList.toggle('ready', backReady);
    }
    if (rmF) rmF.style.display = frontReady ? 'inline-flex' : 'none';
    if (rmB) rmB.style.display = backReady ? 'inline-flex' : 'none';
  }

  async function commitPendingEditorScans(savedItemId) {
    if (!savedItemId) return;
    if (pendingEditorScans.frontDataUrl) {
      await saveItemScan(savedItemId, 'front', pendingEditorScans.frontDataUrl);
    } else if (pendingEditorScans.removeFront) {
      await removeItemScan(savedItemId, 'front');
    }
    if (pendingEditorScans.backDataUrl) {
      await saveItemScan(savedItemId, 'back', pendingEditorScans.backDataUrl);
    } else if (pendingEditorScans.removeBack) {
      await removeItemScan(savedItemId, 'back');
    }
    resetEditorScansForItem(savedItemId);
  }

  // Lightbox for zoomed scan viewing + strict RAM wipe
  function ensureScanLightboxOverlay() {
    let lb = document.getElementById('scanLightboxOverlay');
    if (lb) return lb;
    lb = document.createElement('div');
    lb.id = 'scanLightboxOverlay';
    lb.className = 'scan-lightbox-overlay';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Encrypted Scan Preview');
    lb.innerHTML = `
      <div class="scan-lightbox-inner">
        <div class="scan-lightbox-head">
          <span id="scanLightboxTitle">Encrypted Scan</span>
          <button type="button" class="modal-close-btn" id="btnCloseScanLightbox" title="Close">✕</button>
        </div>
        <img id="scanLightboxImg" alt="Decrypted ID or Card Scan">
      </div>
    `;
    document.body.appendChild(lb);
    document.getElementById('btnCloseScanLightbox').onclick = closeScanLightbox;
    lb.addEventListener('click', (e) => { if (e.target === lb) closeScanLightbox(); });
    return lb;
  }

  function openScanLightbox(dataUrl, title) {
    const lb = ensureScanLightboxOverlay();
    const img = document.getElementById('scanLightboxImg');
    const ttl = document.getElementById('scanLightboxTitle');
    if (ttl) ttl.textContent = title || 'Encrypted ID / Card Scan';
    if (img) img.src = dataUrl || '';
    lb.classList.add('active');
  }

  function closeScanLightbox() {
    const lb = document.getElementById('scanLightboxOverlay');
    const img = document.getElementById('scanLightboxImg');
    if (img) img.src = '';
    if (lb) lb.classList.remove('active');
  }

  function clearDecryptedMemory() {
    decryptedScanCache.clear();
    closeScanLightbox();
    const host = document.getElementById('focusEncryptedScansHost');
    if (host) host.innerHTML = '';
    pendingEditorScans = { itemId: '', frontDataUrl: undefined, backDataUrl: undefined, removeFront: false, removeBack: false };
  }

  // ==========================================================================
  // PUBLIC EXPORTS & INIT
  // ==========================================================================
  window.VaultFaceId = {
    LS_BIO_WRAP,
    LS_FACEID_DISMISSED,
    hasBioWrapConfigured,
    isPlatformBiometricSupported,
    enrollFaceId,
    disableFaceId,
    clearBioWrapStorage,
    unlockWithFaceId,
    openEnrollSheet,
    closeEnrollSheet,
    onPinPanelShown,
    onKeypadDigitClick,
    onManualVaultLock,
    onPasscodeUnlockSuccess,
    stashTransientUnlockSecret,
    clearTransientSecret,
    setDynamicIslandState,
    updateDynamicIslandVisibility,
    getState: () => {
      const di = document.getElementById('iosDynamicIsland');
      return {
        configured: hasBioWrapConfigured(),
        diVisible: !!(di && di.classList.contains('visible')),
        diState: di ? di.getAttribute('data-di-state') : 'missing',
        gestureAutoSeekArmed,
        inFlight: !!activeFaceIdPromise
      };
    }
  };

  window.VaultEncryptedScans = {
    compressImageToDataUrl,
    saveItemScan,
    removeItemScan,
    loadDecryptedScans,
    hasScansMeta,
    reencryptAllLocalScans,
    resetEditorScansForItem,
    stageEditorScan,
    clearStagedEditorScan,
    refreshEditorScanStatusLabels,
    commitPendingEditorScans,
    openScanLightbox,
    closeScanLightbox,
    clearDecryptedMemory
  };

  document.addEventListener('DOMContentLoaded', wireGlobalGestures);
})();
