/* ==========================================================================
   ORLANDOVAULT EXTENSION CORE: ZERO-KNOWLEDGE WEB CRYPTO, RFC 6238 TOTP &
   PHISHING-SAFE DOMAIN MATCHER (Service-Worker & Popup Compatible)
   ========================================================================== */
(function(root) {
  'use strict';

  const CANARY_PLAINTEXT = 'ORLANDOVAULT_CANARY_V4';
  const KDF_ITERATIONS_V4 = 600000;
  const BASE32_ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const MULTI_PART_TLDS = new Set([
    'gov.ph', 'edu.ph', 'com.ph', 'org.ph', 'net.ph', 'mil.ph',
    'co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'com.au', 'co.jp', 'com.sg'
  ]);

  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return globalThis.btoa(binary);
  }

  function base64ToArrayBuffer(base64) {
    const binary = globalThis.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }

  function hexToBytes(hex) {
    const clean = (hex || '').replace(/[^0-9a-f]/gi, '');
    const pairs = clean.match(/.{1,2}/g) || [];
    return new Uint8Array(pairs.map(b => parseInt(b, 16)));
  }

  async function deriveKeyAndRawBase64(passphrase, saltHex, iterations = KDF_ITERATIONS_V4) {
    if (!passphrase || typeof passphrase !== 'string') {
      throw new Error('Passcode or Master Password is required.');
    }
    if (!saltHex || typeof saltHex !== 'string' || saltHex.length < 16) {
      throw new Error('Invalid vault cryptographic salt.');
    }
    const enc = new TextEncoder();
    const keyMaterial = await globalThis.crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    const extractableKey = await globalThis.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: hexToBytes(saltHex),
        iterations: Number(iterations) || KDF_ITERATIONS_V4,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const rawBuf = await globalThis.crypto.subtle.exportKey('raw', extractableKey);
    const rawKeyBase64 = arrayBufferToBase64(rawBuf);
    return { cryptoKey: extractableKey, rawKeyBase64 };
  }

  async function importSessionKey(rawKeyBase64) {
    if (!rawKeyBase64) return null;
    const rawBuf = base64ToArrayBuffer(rawKeyBase64);
    return await globalThis.crypto.subtle.importKey(
      'raw',
      rawBuf,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function decryptStrict(cipherObj, key) {
    if (!key) throw new Error('Vault is locked.');
    if (!cipherObj || !cipherObj.ciphertext || !cipherObj.iv) return '';
    const iv = base64ToArrayBuffer(cipherObj.iv);
    const cipherBytes = base64ToArrayBuffer(cipherObj.ciphertext);
    const decrypted = await globalThis.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      key,
      cipherBytes
    );
    return new TextDecoder().decode(decrypted);
  }

  async function verifyCanary(canaryObj, key) {
    try {
      if (!canaryObj || !canaryObj.ciphertext) return false;
      const plain = await decryptStrict(canaryObj, key);
      return plain === CANARY_PLAINTEXT;
    } catch (e) {
      return false;
    }
  }

  async function computeOvaultSha256(saltHex, iv, ciphertext) {
    const data = new TextEncoder().encode(String(saltHex || '') + ':' + String(iv || '') + ':' + String(ciphertext || ''));
    const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

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
      } catch (e) {
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
    view.setUint32(0, Math.floor(counter / 0x100000000), false);
    view.setUint32(4, counter >>> 0, false);

    const cryptoKey = await globalThis.crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );
    const sig = new Uint8Array(await globalThis.crypto.subtle.sign('HMAC', cryptoKey, counterBuf));
    const offset = sig[sig.length - 1] & 0x0f;
    const binCode =
      ((sig[offset] & 0x7f) << 24) |
      ((sig[offset + 1] & 0xff) << 16) |
      ((sig[offset + 2] & 0xff) << 8) |
      (sig[offset + 3] & 0xff);
    const code = String(binCode % Math.pow(10, parsed.digits)).padStart(parsed.digits, '0');
    const formatted = parsed.digits === 6 ? (code.slice(0, 3) + ' ' + code.slice(3)) : code;
    return { code, formatted, remaining, period: parsed.period };
  }

  function generateStrongPassword(length = 20) {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnopqrstuvwxyz';
    const digits = '23456789';
    const symbols = '!@#$%^&*-_=+?';
    const all = upper + lower + digits + symbols;
    const len = Math.max(12, Math.min(64, length));
    const rand = new Uint32Array(len);
    globalThis.crypto.getRandomValues(rand);
    const chars = [
      upper[rand[0] % upper.length],
      lower[rand[1] % lower.length],
      digits[rand[2] % digits.length],
      symbols[rand[3] % symbols.length]
    ];
    for (let i = 4; i < len; i++) {
      chars.push(all[rand[i] % all.length]);
    }
    for (let i = chars.length - 1; i > 0; i--) {
      const j = rand[i] % (i + 1);
      const tmp = chars[i];
      chars[i] = chars[j];
      chars[j] = tmp;
    }
    return chars.join('');
  }

  function parseUrlSafe(urlStr) {
    if (!urlStr || typeof urlStr !== 'string') return null;
    try {
      const u = new URL(urlStr.trim());
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
      return u;
    } catch (e) {
      return null;
    }
  }

  function extractRegistrableDomain(hostname) {
    const h = (hostname || '').toLowerCase().replace(/^www\./, '');
    if (!h) return '';
    if (h === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(h) || h.includes(':')) return h;
    const parts = h.split('.').filter(Boolean);
    if (parts.length <= 2) return parts.join('.');
    const tail2 = parts.slice(-2).join('.');
    if (MULTI_PART_TLDS.has(tail2) && parts.length >= 3) {
      return parts.slice(-3).join('.');
    }
    return tail2;
  }

  function resolveItemCandidateUrls(item) {
    const out = [];
    const combined = (item && item.metadata ? item.metadata : '') + ' ' + (item && item.notes ? item.notes : '');
    const rx = /https?:\/\/[^\s,;|)"'<>]+/gi;
    let m;
    while ((m = rx.exec(combined)) !== null) {
      out.push(m[0].replace(/[.,;)]+$/, ''));
    }
    const t = ((item && item.title) || '').toLowerCase();
    const cat = ((item && item.category) || '').toLowerCase();
    if (t.includes('gmail') || t.includes('google') || cat.includes('gmail')) {
      out.push('https://accounts.google.com/', 'https://mail.google.com/');
    }
    if (t.includes('facebook') || /\bmeta\b/.test(t)) out.push('https://www.facebook.com/');
    if (t.includes('netflix')) out.push('https://www.netflix.com/');
    if (t.includes('disney')) out.push('https://www.disneyplus.com/');
    if (t.includes('youtube')) out.push('https://www.youtube.com/');
    if (t.includes('github')) out.push('https://github.com/');
    if (t.includes('gitlab')) out.push('https://gitlab.com/');
    if (t.includes('claude')) out.push('https://claude.ai/');
    if (t.includes('chatgpt') || t.includes('openai')) out.push('https://chatgpt.com/', 'https://auth.openai.com/');
    if (t.includes('gemini')) out.push('https://gemini.google.com/');
    if (t.includes('bpi')) out.push('https://online.bpi.com.ph/');
    if (t.includes('bdo')) out.push('https://online.bdo.com.ph/');
    if (t.includes('landbank')) out.push('https://www.lbpiaccess.com/');
    if (t.includes('unionbank')) out.push('https://online.unionbankph.com/');
    if (t.includes('deped')) out.push('https://lis.deped.gov.ph/', 'https://deped.gov.ph/');
    if (t.includes('microsoft') || cat.includes('microsoft')) out.push('https://login.microsoftonline.com/', 'https://portal.office.com/');
    if (/\bprc\b/.test(t)) out.push('https://online.prc.gov.ph/');
    if (t.includes('philhealth')) out.push('https://memberinquiry.philhealth.gov.ph/');
    if (t.includes('pag-ibig') || t.includes('pagibig')) out.push('https://www.pagibigfundservices.com/');
    if (/\bbir\b/.test(t) || /\btin\b/.test(t)) out.push('https://orus.bir.gov.ph/');
    return out;
  }

  function scoreAccountForUrl(item, tabUrlStr) {
    const tabUrl = parseUrlSafe(tabUrlStr);
    if (!tabUrl || !item || item.trashed) return 0;
    const tabHost = tabUrl.hostname.toLowerCase();
    const tabPort = tabUrl.port || (tabUrl.protocol === 'https:' ? '443' : '80');
    const tabReg = extractRegistrableDomain(tabHost);
    const isLocalTab = tabHost === '127.0.0.1' || tabHost === 'localhost';
    const candidates = resolveItemCandidateUrls(item);

    let best = 0;
    for (const rawCand of candidates) {
      const cu = parseUrlSafe(rawCand);
      if (!cu) continue;
      const chost = cu.hostname.toLowerCase();
      const cport = cu.port || (cu.protocol === 'https:' ? '443' : '80');
      const creg = extractRegistrableDomain(chost);

      if (isLocalTab) {
        if (chost === tabHost && cport === tabPort) {
          const cPath = cu.pathname.replace(/\/+$/, '');
          const tPath = tabUrl.pathname.replace(/\/+$/, '');
          if (cPath && tPath.startsWith(cPath)) {
            best = Math.max(best, 100);
          } else {
            best = Math.max(best, 92);
          }
        }
        continue;
      }

      if (chost === tabHost) {
        best = Math.max(best, 100);
      } else if (tabReg && creg && tabReg === creg) {
        best = Math.max(best, 85);
      }
    }
    return best;
  }

  root.OVExtCore = {
    CANARY_PLAINTEXT,
    KDF_ITERATIONS_V4,
    deriveKeyAndRawBase64,
    importSessionKey,
    decryptStrict,
    verifyCanary,
    computeOvaultSha256,
    parseTotpInput,
    generateTotp,
    generateStrongPassword,
    extractRegistrableDomain,
    resolveItemCandidateUrls,
    scoreAccountForUrl
  };
})(typeof globalThis !== 'undefined' ? globalThis : self);
