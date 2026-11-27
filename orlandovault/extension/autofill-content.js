/* ==========================================================================
   ORLANDOVAULT SMART AUTOFILL CONTENT SCRIPT (Isolates UI via Shadow DOM)
   ========================================================================== */
(function() {
  'use strict';

  if (typeof location !== 'undefined' && location.pathname && location.pathname.startsWith('/orlandovault')) {
    return;
  }

  let inlineHost = null;
  let toastHost = null;
  let currentFocusedInput = null;
  let blurHideTimer = null;

  function isVisibleInput(el) {
    if (!el || el.disabled || el.readOnly) return false;
    const type = (el.type || 'text').toLowerCase();
    if (['hidden', 'submit', 'button', 'checkbox', 'radio', 'file', 'image', 'reset'].includes(type)) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    return rect.width >= 16 && rect.height >= 14;
  }

  function fieldHint(el) {
    return [
      el.getAttribute('autocomplete') || '',
      el.name || '',
      el.id || '',
      el.placeholder || '',
      el.getAttribute('aria-label') || ''
    ].join(' ').toLowerCase();
  }

  function findPasswordInputs() {
    return Array.from(document.querySelectorAll('input[type="password"], input[data-ov-pwd="1"]')).filter(isVisibleInput);
  }

  function findUsernameInput(pwdEl) {
    const scope = (pwdEl && pwdEl.form) || (pwdEl && pwdEl.closest('div, section, main, article')) || document.body;
    const inputs = Array.from(scope.querySelectorAll('input')).filter(isVisibleInput);
    const pwdIdx = pwdEl ? inputs.indexOf(pwdEl) : inputs.length;
    const candidates = inputs.slice(0, pwdIdx === -1 ? inputs.length : pwdIdx);
    const ranked = candidates.filter(inp => {
      const t = (inp.type || 'text').toLowerCase();
      if (t === 'password') return false;
      const hint = fieldHint(inp);
      if (/otp|2fa|totp|verification.?code|pin.?code|captcha/i.test(hint)) return false;
      return t === 'email' || /user|email|login|account|id\b|deped|emp|handle/i.test(hint) || t === 'text' || t === 'tel';
    });
    if (ranked.length === 0) return null;
    const exactMatch = ranked.slice().reverse().find(inp => {
      const t = (inp.type || 'text').toLowerCase();
      const hint = fieldHint(inp);
      return t === 'email' || /user|email|login|account|deped/i.test(hint);
    });
    return exactMatch || ranked[ranked.length - 1];
  }

  function findTotpInputs() {
    const all = Array.from(document.querySelectorAll('input')).filter(isVisibleInput);
    const single = all.find(inp => {
      const t = (inp.type || 'text').toLowerCase();
      if (t === 'password' || t === 'email') return false;
      const hint = fieldHint(inp);
      return inp.getAttribute('autocomplete') === 'one-time-code' ||
        /totp|\botp\b|2fa|two.?factor|auth.?code|verification.?code|security.?code|authenticator/i.test(hint);
    });
    if (single) return [single];

    const splitBoxes = all.filter(inp => inp.maxLength === 1 && !/password|email/i.test(inp.type || ''));
    if (splitBoxes.length === 6) return splitBoxes;
    return [];
  }

  function setNativeInputValue(inputEl, val) {
    if (!inputEl) return false;
    try {
      inputEl.focus({ preventScroll: true });
    } catch (e) {
      try { inputEl.focus(); } catch (e2) {}
    }
    const proto = window.HTMLInputElement ? window.HTMLInputElement.prototype : null;
    const setter = proto ? Object.getOwnPropertyDescriptor(proto, 'value')?.set : null;
    if (setter) {
      setter.call(inputEl, val);
    } else {
      inputEl.value = val;
    }
    try {
      inputEl.dispatchEvent(new Event('focus', { bubbles: true }));
    } catch (e) {}
    try {
      inputEl.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: val }));
    } catch (e) {
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
    inputEl.dispatchEvent(new Event('change', { bubbles: true }));
    inputEl.setAttribute('data-ov-filled', '1');
    return true;
  }

  function showPageToast(title, totpFormatted) {
    if (!toastHost) {
      toastHost = document.createElement('div');
      toastHost.id = 'orlandovault-toast-host';
      toastHost.style.cssText = 'position:fixed;top:14px;right:14px;z-index:2147483647;pointer-events:none;';
      document.documentElement.appendChild(toastHost);
    }
    const shadow = toastHost.shadowRoot || toastHost.attachShadow({ mode: 'open' });
    const msg = totpFormatted ? `⚡ Filled ${title} · 🔐 2FA ${totpFormatted} copied` : `⚡ Filled ${title}`;
    shadow.innerHTML = `
      <style>
        .ov-toast {
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #ecfdf5;
          background: linear-gradient(135deg, rgba(6, 78, 59, 0.96), rgba(15, 23, 42, 0.96));
          border: 1px solid rgba(16, 185, 129, 0.7);
          border-radius: 12px;
          padding: 10px 14px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(12px);
          animation: ovSlideIn 0.2s ease-out;
        }
        @keyframes ovSlideIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      </style>
      <div class="ov-toast"></div>
    `;
    shadow.querySelector('.ov-toast').textContent = msg;
    setTimeout(() => {
      if (toastHost && toastHost.shadowRoot) toastHost.shadowRoot.innerHTML = '';
    }, 3200);
  }

  function executePageAutofill(payload) {
    if (!payload) return;
    const pwdInputs = findPasswordInputs();
    const targetPwd = (currentFocusedInput && currentFocusedInput.type === 'password' && isVisibleInput(currentFocusedInput))
      ? currentFocusedInput
      : pwdInputs[0] || null;
    const targetUser = (currentFocusedInput && currentFocusedInput !== targetPwd && !/totp|otp|2fa/i.test(fieldHint(currentFocusedInput)))
      ? currentFocusedInput
      : findUsernameInput(targetPwd);

    if (targetUser && payload.username) {
      setNativeInputValue(targetUser, payload.username);
    }
    if (targetPwd && payload.password) {
      if (targetPwd.type === 'password') targetPwd.setAttribute('data-ov-pwd', '1');
      setNativeInputValue(targetPwd, payload.password);
    }

    if (payload.totpCode) {
      const otpTargets = findTotpInputs();
      if (otpTargets.length === 1) {
        setNativeInputValue(otpTargets[0], payload.totpCode);
      } else if (otpTargets.length === 6) {
        payload.totpCode.split('').forEach((ch, idx) => {
          if (otpTargets[idx]) setNativeInputValue(otpTargets[idx], ch);
        });
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(payload.totpCode).catch(() => {});
      }
    }

    hideInlinePill();
    showPageToast(payload.title || 'OrlandoVault', payload.totpFormatted || '');
  }

  function hideInlinePill() {
    if (inlineHost) {
      inlineHost.style.display = 'none';
    }
  }

  function showInlinePill(anchorEl, state) {
    if (!anchorEl || !state || !state.hasEnvelope) return hideInlinePill();
    if (state.unlocked && (!state.matches || state.matches.length === 0)) return hideInlinePill();

    if (!inlineHost) {
      inlineHost = document.createElement('div');
      inlineHost.id = 'orlandovault-inline-host';
      document.documentElement.appendChild(inlineHost);
    }
    const rect = anchorEl.getBoundingClientRect();
    inlineHost.style.cssText = `position:fixed;left:${Math.max(8, Math.round(rect.left))}px;top:${Math.round(rect.bottom + 6)}px;z-index:2147483646;display:block;`;

    const shadow = inlineHost.shadowRoot || inlineHost.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .ov-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 6px;
          border-radius: 11px;
          background: rgba(10, 15, 26, 0.96);
          border: 1px solid rgba(56, 189, 248, 0.45);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55);
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
        }
        .ov-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid rgba(16, 185, 129, 0.45);
          background: rgba(16, 185, 129, 0.16);
          color: #ecfdf5;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
        }
        .ov-btn:hover { background: rgba(16, 185, 129, 0.3); }
        .ov-btn.locked {
          border-color: rgba(245, 158, 11, 0.45);
          background: rgba(245, 158, 11, 0.14);
          color: #fde68a;
          cursor: default;
        }
        .ov-sub { font-size: 10.5px; color: #94a3b8; font-weight: 500; }
      </style>
      <div class="ov-bar"></div>
    `;
    const bar = shadow.querySelector('.ov-bar');
    if (!state.unlocked) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ov-btn locked';
      btn.textContent = '🔒 OrlandoVault Locked · Press Alt+Shift+O to Unlock';
      bar.appendChild(btn);
      return;
    }

    state.matches.slice(0, 3).forEach(m => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ov-btn';
      btn.addEventListener('mousedown', (ev) => {
        ev.preventDefault();
        chrome.runtime.sendMessage({ type: 'FILL_CREDENTIAL_IN_TAB', itemId: m.id }, () => {});
      });
      const titleSpan = document.createElement('span');
      titleSpan.textContent = `⚡ Fill ${m.title}`;
      const subSpan = document.createElement('span');
      subSpan.className = 'ov-sub';
      subSpan.textContent = m.hasTotp ? `${m.username} · +2FA` : m.username;
      btn.appendChild(titleSpan);
      if (subSpan.textContent) btn.appendChild(subSpan);
      bar.appendChild(btn);
    });
  }

  function looksLikeAuthInput(el) {
    if (!el || el.tagName !== 'INPUT' || !isVisibleInput(el)) return false;
    const t = (el.type || 'text').toLowerCase();
    if (t === 'password' || t === 'email') return true;
    const hint = fieldHint(el);
    return /user|email|login|account|deped|otp|totp|2fa|auth.?code|one-time-code/i.test(hint);
  }

  document.addEventListener('focusin', (e) => {
    if (!looksLikeAuthInput(e.target)) return;
    if (blurHideTimer) { clearTimeout(blurHideTimer); blurHideTimer = null; }
    currentFocusedInput = e.target;
    chrome.runtime.sendMessage({ type: 'GET_PAGE_MATCH_SUMMARY', tabUrl: location.href }, (res) => {
      if (chrome.runtime.lastError || !res || !res.ok) return;
      showInlinePill(e.target, res);
    });
  }, true);

  document.addEventListener('focusout', () => {
    if (blurHideTimer) clearTimeout(blurHideTimer);
    blurHideTimer = setTimeout(hideInlinePill, 220);
  }, true);

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg && msg.type === 'EXECUTE_PAGE_AUTOFILL') {
      executePageAutofill(msg.payload);
      sendResponse({ ok: true });
      return true;
    }
  });
})();
