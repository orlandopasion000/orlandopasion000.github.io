/* ==========================================================================
   ORLANDOVAULT WEB <-> EXTENSION CIPHERTEXT BRIDGE
   Relays ONLY Zero-Knowledge AES-GCM encrypted envelopes (never secrets).
   ========================================================================== */
(function() {
  'use strict';

  const EXT_VERSION = '1.0.0';

  function markExtensionInstalled() {
    if (document.documentElement) {
      document.documentElement.setAttribute('data-orlandovault-ext', EXT_VERSION);
    }
  }
  markExtensionInstalled();
  if (!document.documentElement) {
    document.addEventListener('DOMContentLoaded', markExtensionInstalled, { once: true });
  }

  function postToWeb(data) {
    try {
      window.postMessage(Object.assign({ source: 'ORLANDOVAULT_EXT', version: EXT_VERSION }, data), window.location.origin);
    } catch (e) {}
  }

  // Announce presence cleanly so OrlandoVault's Autofill Hub upgrades from "Install" -> "Connected"
  postToWeb({ type: 'EXT_READY' });
  window.addEventListener('DOMContentLoaded', () => {
    markExtensionInstalled();
    postToWeb({ type: 'EXT_READY' });
  });

  window.addEventListener('message', (event) => {
    if (event.source !== window || !event.data || event.data.source !== 'ORLANDOVAULT_WEB') return;
    const { type, envelope } = event.data;

    if (type === 'PING_EXT') {
      chrome.runtime.sendMessage({ type: 'GET_EXT_STATUS' }, (res) => {
        if (chrome.runtime.lastError) return;
        postToWeb(Object.assign({ type: 'EXT_STATUS' }, res || {}));
      });
    } else if (type === 'SYNC_ENCRYPTED_ENVELOPE' && envelope) {
      chrome.runtime.sendMessage({ type: 'BRIDGE_SYNC_ENVELOPE', envelope }, (res) => {
        if (chrome.runtime.lastError) return;
        postToWeb(Object.assign({ type: 'EXT_SYNC_ACK' }, res || {}));
      });
    }
  });
})();
