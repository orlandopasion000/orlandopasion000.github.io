/* ==========================================================================
   ORLANDOVAULT PHASE 3: CLOUD-SYNCED ENCRYPTED AUDIT, DEVICE REGISTRY,
   AUTOMATED WEEKLY SNAPSHOTS & PORTABLE BITWARDEN EXPORT
   ========================================================================== */
(function() {
  'use strict';

  const LS_ENC_AUDIT = 'orlandovault_enc_audit_v4';
  const LS_ENC_DEVICES = 'orlandovault_enc_devices_v4';
  const WEEKLY_MS = 7 * 24 * 60 * 60 * 1000;
  let auditSyncTimer = null;
  let lastCloudDevices = [];
  let lastCloudSnapshots = [];

  function getFriendlyDeviceLabel() {
    const ua = navigator.userAgent || '';
    if (/iPhone/i.test(ua)) return 'iPhone · iOS';
    if (/iPad/i.test(ua)) return 'iPad · iPadOS';
    if (/Android/i.test(ua)) return 'Android Phone';
    const isEdge = /Edg\//i.test(ua);
    const isChrome = /Chrome\//i.test(ua) && !isEdge;
    const isSafari = /Safari\//i.test(ua) && !isChrome && !isEdge;
    const browser = isEdge ? 'Edge' : (isChrome ? 'Chrome' : (isSafari ? 'Safari' : 'Browser'));
    if (/Windows/i.test(ua)) return 'Windows PC · ' + browser;
    if (/Macintosh|Mac OS/i.test(ua)) return 'Mac · ' + browser;
    return 'Desktop · ' + browser;
  }

  function getBridge() {
    return window.OrlandoVaultCloudBridge || null;
  }

  async function readEncryptedSyncDoc(docName) {
    const b = getBridge();
    if (!b || !b.isUnlocked() || !b.isCloudAuthenticated()) return null;
    try {
      let data = null;
      if (b.firebaseDb) {
        const snap = await b.firebaseDb.collection('orlandovault_sync').doc(docName).get();
        if (snap && snap.exists) data = snap.data();
      } else {
        const headers = await b.getAuthHeaders();
        const url = `${b.firestoreBase}/orlandovault_sync/${docName}?key=${b.apiKey}`;
        const res = await fetch(url, { cache: 'no-store', headers });
        if (res.ok) {
          const j = await res.json();
          const f = (j && j.fields) || {};
          data = {
            encrypted: f.encrypted ? f.encrypted.stringValue : '',
            updatedAt: f.updatedAt ? parseInt(f.updatedAt.integerValue || '0', 10) : 0
          };
        }
      }
      if (!data || !data.encrypted) return null;
      const cipherObj = typeof data.encrypted === 'string' ? JSON.parse(data.encrypted) : data.encrypted;
      const plainStr = await b.decryptStrict(cipherObj);
      return JSON.parse(plainStr || 'null');
    } catch(e) {
      return null;
    }
  }

  async function writeEncryptedSyncDoc(docName, payloadObj) {
    const b = getBridge();
    if (!b || !b.isUnlocked() || !b.isCloudAuthenticated()) return false;
    try {
      const enc = await b.encrypt(JSON.stringify(payloadObj));
      const now = Date.now();
      if (b.firebaseDb) {
        await b.firebaseDb.collection('orlandovault_sync').doc(docName).set({
          v: 4,
          encrypted: JSON.stringify(enc),
          updatedAt: now
        });
        return true;
      }
      const headers = Object.assign({ 'Content-Type': 'application/json' }, await b.getAuthHeaders());
      const url = `${b.firestoreBase}/orlandovault_sync/${docName}?key=${b.apiKey}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          fields: {
            v: { integerValue: '4' },
            encrypted: { stringValue: JSON.stringify(enc) },
            updatedAt: { integerValue: String(now) }
          }
        })
      });
      return res.ok;
    } catch(e) {
      return false;
    }
  }

  async function persistAuditEncrypted(entries) {
    const b = getBridge();
    if (!b || !b.isUnlocked()) return;
    try {
      const enc = await b.encrypt(JSON.stringify((entries || []).slice(0, 150)));
      localStorage.setItem(LS_ENC_AUDIT, JSON.stringify(enc));
    } catch(e) {}
  }

  async function loadAuditEncrypted() {
    const b = getBridge();
    if (!b || !b.isUnlocked()) return [];
    try {
      const raw = localStorage.getItem(LS_ENC_AUDIT);
      if (!raw) return [];
      const plain = await b.decryptStrict(JSON.parse(raw));
      const parsed = JSON.parse(plain || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch(e) {
      return [];
    }
  }

  async function syncAuditWithCloud(localEntries) {
    const remote = await readEncryptedSyncDoc('audit_trail');
    const byId = new Map();
    const list = Array.isArray(remote && remote.entries) ? remote.entries : [];
    list.concat(localEntries || []).forEach(ev => {
      if (ev && ev.id) byId.set(ev.id, ev);
    });
    const merged = Array.from(byId.values())
      .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
      .slice(0, 150);
    await persistAuditEncrypted(merged);
    await writeEncryptedSyncDoc('audit_trail', { entries: merged, updatedAt: Date.now() });
    return merged;
  }

  function scheduleAuditCloudSync(getEntriesFn) {
    if (auditSyncTimer) clearTimeout(auditSyncTimer);
    auditSyncTimer = setTimeout(async () => {
      const entries = typeof getEntriesFn === 'function' ? getEntriesFn() : [];
      await persistAuditEncrypted(entries);
      await syncAuditWithCloud(entries);
    }, 1000);
  }

  async function syncDeviceHeartbeat(lastAction = 'Active Session') {
    const b = getBridge();
    if (!b || !b.isUnlocked()) return [];
    const clientId = window.VAULT_CLIENT_ID || 'ov_local';
    const label = getFriendlyDeviceLabel();
    const now = Date.now();
    const currentDevice = {
      clientId,
      label,
      platform: navigator.platform || '',
      lastSeenAt: now,
      lastAction,
      appVersion: 'v74'
    };

    const reg = (await readEncryptedSyncDoc('device_registry')) || { devices: [], revokedClientIds: [] };
    if (Array.isArray(reg.revokedClientIds) && reg.revokedClientIds.includes(clientId)) {
      if (typeof window.lockVault === 'function') {
        window.lockVault('This device session was revoked from another trusted device.');
      }
      if (b.signOut) b.signOut();
      return [];
    }

    const others = (Array.isArray(reg.devices) ? reg.devices : []).filter(d => d && d.clientId && d.clientId !== clientId);
    const mergedDevices = [currentDevice, ...others].slice(0, 12);
    lastCloudDevices = mergedDevices;

    try {
      const encDev = await b.encrypt(JSON.stringify(mergedDevices));
      localStorage.setItem(LS_ENC_DEVICES, JSON.stringify(encDev));
    } catch(e) {}

    await writeEncryptedSyncDoc('device_registry', {
      devices: mergedDevices,
      revokedClientIds: reg.revokedClientIds || []
    });
    renderDeviceRegistryPanel();
    return mergedDevices;
  }

  async function revokeOtherDevices() {
    const b = getBridge();
    if (!b || !b.isUnlocked()) return false;
    const clientId = window.VAULT_CLIENT_ID || 'ov_local';
    const reg = (await readEncryptedSyncDoc('device_registry')) || { devices: lastCloudDevices, revokedClientIds: [] };
    const revokedSet = new Set(Array.isArray(reg.revokedClientIds) ? reg.revokedClientIds : []);
    (reg.devices || []).forEach(d => {
      if (d && d.clientId && d.clientId !== clientId) revokedSet.add(d.clientId);
    });
    const mine = (reg.devices || []).filter(d => d && d.clientId === clientId);
    lastCloudDevices = mine.length ? mine : [{ clientId, label: getFriendlyDeviceLabel(), lastSeenAt: Date.now(), lastAction: 'Revoked Others', appVersion: 'v74' }];
    await writeEncryptedSyncDoc('device_registry', {
      devices: lastCloudDevices,
      revokedClientIds: Array.from(revokedSet).slice(-30)
    });
    renderDeviceRegistryPanel();
    if (typeof window.showToast === 'function') window.showToast('🚫 Revoked all other registered devices.', '🛡️');
    return true;
  }

  function renderDeviceRegistryPanel() {
    const panel = document.getElementById('deviceRegistryPanel');
    if (!panel) return;
    const clientId = window.VAULT_CLIENT_ID || 'ov_local';
    const devices = lastCloudDevices.length ? lastCloudDevices : [{ clientId, label: getFriendlyDeviceLabel(), lastSeenAt: Date.now(), lastAction: 'Current Session', appVersion: 'v74' }];

    panel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <strong style="font-size:12px;color:#38bdf8;">📱 Active Trusted Devices (${devices.length})</strong>
        <button type="button" class="btn-sync-action" id="btnRevokeOtherDevices" style="padding:4px 9px;font-size:11px;color:#fca5a5;border-color:rgba(239,68,68,0.45);">🚫 Revoke Other Devices</button>
      </div>
      ${devices.map(d => {
        const isCurrent = d.clientId === clientId;
        const when = d.lastSeenAt ? new Date(d.lastSeenAt).toLocaleString() : 'Active';
        return `
          <div class="device-pill-row">
            <div>
              <strong>${window.escapeHtml ? window.escapeHtml(d.label) : d.label}</strong>
              ${isCurrent ? '<span class="audit-device-chip" style="margin-left:6px;background:rgba(16,185,129,0.2);color:#6ee7b7;border-color:rgba(16,185,129,0.45);">THIS DEVICE</span>' : ''}
              <div style="font-size:10.5px;color:#94a3b8;">${window.escapeHtml ? window.escapeHtml(d.lastAction || '') : ''} · ${when}</div>
            </div>
            <span style="font-size:10.5px;color:#64748b;">${d.appVersion || ''}</span>
          </div>
        `;
      }).join('')}
      <div id="cloudSnapshotTimelineRow" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:4px;border-top:1px solid rgba(255,255,255,0.08);flex-wrap:wrap;">
        <span style="font-size:11px;color:#cbd5e1;">☁️ Weekly Cloud Snapshots: <strong>${lastCloudSnapshots.length} saved</strong></span>
        ${lastCloudSnapshots.length > 0 ? '<button type="button" class="btn-sync-action" id="btnRestoreWeeklyCloudSnap" style="padding:4px 9px;font-size:11px;">↺ Restore Latest Cloud Snapshot</button>' : ''}
      </div>
    `;

    document.getElementById('btnRevokeOtherDevices')?.addEventListener('click', revokeOtherDevices);
    document.getElementById('btnRestoreWeeklyCloudSnap')?.addEventListener('click', async () => {
      if (lastCloudSnapshots[0]) await restoreCloudSnapshot(lastCloudSnapshots[0]);
    });
  }

  async function buildCloudSnapshotPacket(reason = 'weekly_auto') {
    const items = (typeof window.getVaultItems === 'function' ? window.getVaultItems() : window.vaultItems) || [];
    const pins = typeof window.getPinnedRegistry === 'function' ? window.getPinnedRegistry() : [];
    const tombstones = typeof window.getVaultTombstones === 'function' ? window.getVaultTombstones() : {};
    return {
      id: 'csnap_' + Date.now(),
      ts: Date.now(),
      reason,
      deviceLabel: getFriendlyDeviceLabel(),
      recordCount: items.length,
      items,
      pins,
      tombstones
    };
  }

  async function ensureWeeklyCloudSnapshot(force = false) {
    const b = getBridge();
    if (!b || !b.isUnlocked()) return null;
    const items = (typeof window.getVaultItems === 'function' ? window.getVaultItems() : window.vaultItems) || [];
    if (items.length === 0) return null;

    const existing = (await readEncryptedSyncDoc('cloud_snapshots')) || { snapshots: [] };
    let snaps = Array.isArray(existing.snapshots) ? existing.snapshots : [];
    const latestTs = snaps[0] ? (snaps[0].ts || 0) : 0;
    if (!force && latestTs > 0 && (Date.now() - latestTs) < WEEKLY_MS) {
      lastCloudSnapshots = snaps;
      renderDeviceRegistryPanel();
      return null;
    }

    const pkt = await buildCloudSnapshotPacket(force ? 'manual_cloud' : 'weekly_auto');
    snaps.unshift(pkt);
    if (snaps.length > 5) snaps = snaps.slice(0, 5);
    lastCloudSnapshots = snaps;
    await writeEncryptedSyncDoc('cloud_snapshots', { snapshots: snaps, updatedAt: Date.now() });
    renderDeviceRegistryPanel();
    return pkt;
  }

  async function restoreCloudSnapshot(snap) {
    if (!snap || !Array.isArray(snap.items) || snap.items.length === 0) return false;
    window.vaultItems = snap.items;
    if (typeof window.setVaultItems === 'function') window.setVaultItems(snap.items);
    if (Array.isArray(snap.pins) && typeof window.savePinnedRegistry === 'function') window.savePinnedRegistry(snap.pins);
    if (snap.tombstones && typeof window.saveVaultTombstones === 'function') window.saveVaultTombstones(snap.tombstones);
    if (typeof window.persistEncryptedVaultCache === 'function') await window.persistEncryptedVaultCache();
    if (typeof window.renderVault === 'function') window.renderVault();
    if (typeof window.renderMetrics === 'function') window.renderMetrics();
    if (typeof window.markVaultFullPush === 'function') window.markVaultFullPush();
    if (typeof window.triggerVaultCloudPush === 'function') window.triggerVaultCloudPush();
    if (typeof window.showToast === 'function') window.showToast(`☁️ Restored cloud snapshot (${snap.items.length} items)!`, '✅');
    return true;
  }

  function buildBitwardenJsonPayload(items) {
    const active = (Array.isArray(items) ? items : []).filter(x => !x.trashed);
    const catIds = new Map();
    const folders = [];
    active.forEach(it => {
      const cat = it.category || 'Portals';
      if (!catIds.has(cat)) {
        const fid = 'folder-' + cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        catIds.set(cat, fid);
        folders.push({ id: fid, name: cat });
      }
    });
    const bwItems = active.map(it => {
      const rType = it.recordType || 'login';
      const urlMatch = (it.metadata || '').match(/https?:\/\/[^\s|]+/i);
      if (rType === 'bank_card' && it.templateData) {
        const td = it.templateData;
        const m = String(td.expiryMonthYear || '').match(/^(\d{1,2})\s*\/\s*(\d{2}|\d{4})$/);
        const expMonth = m ? String(parseInt(m[1], 10)).padStart(2, '0') : '';
        const expYear = m ? (m[2].length === 2 ? '20' + m[2] : m[2]) : '';
        return {
          id: it.id,
          folderId: catIds.get(it.category || 'IDs & Cards') || null,
          type: 3,
          name: it.title || 'Untitled Card',
          notes: [it.notes, it.metadata].filter(Boolean).join('\n'),
          favorite: !!(it.isPriority || it.pinned),
          card: {
            cardholderName: td.cardHolder || '',
            brand: td.brand || 'Visa',
            number: td.cardNumber || '',
            expMonth,
            expYear,
            code: td.cvv || ''
          }
        };
      }
      if ((rType === 'gov_id' || rType === 'wifi' || rType === 'recovery_codes') && it.templateData) {
        const td = it.templateData;
        const fields = Object.keys(td).map(k => ({
          name: k,
          value: typeof td[k] === 'string' ? td[k] : JSON.stringify(td[k]),
          type: 0
        }));
        return {
          id: it.id,
          folderId: catIds.get(it.category || 'IDs & Cards') || null,
          type: 2,
          name: it.title || 'Secure Item',
          notes: [it.notes, it.metadata, rType === 'wifi' ? `Wi-Fi Password: ${it.password || ''}` : ''].filter(Boolean).join('\n'),
          favorite: !!(it.isPriority || it.pinned),
          fields,
          secureNote: { type: 0 }
        };
      }
      return {
        id: it.id,
        folderId: catIds.get(it.category || 'Portals') || null,
        type: 1,
        name: it.title || 'Untitled',
        notes: [it.notes, it.metadata].filter(Boolean).join('\n'),
        favorite: !!(it.isPriority || it.pinned),
        login: {
          uris: urlMatch ? [{ uri: urlMatch[0] }] : [],
          username: it.username || '',
          password: it.password || '',
          totp: it.totpSecret || null
        }
      };
    });
    return { encrypted: false, folders, items: bwItems };
  }

  function exportBitwardenJson(skipConfirm = false) {
    if (!skipConfirm) {
      const ok = window.confirm('Export unencrypted Bitwarden-compatible JSON? Remember to delete the downloaded file cleanly after importing.');
      if (!ok) return null;
    }
    const items = (typeof window.getVaultItems === 'function' ? window.getVaultItems() : window.vaultItems) || [];
    const payload = buildBitwardenJsonPayload(items);
    if (!skipConfirm) {
      const dataStr = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = `OrlandoVault_Bitwarden_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (typeof window.showToast === 'function') window.showToast(`📦 Exported ${payload.items.length} entries in Bitwarden JSON format.`, '⚠️');
    }
    return payload;
  }

  window.VaultCloudTelemetry = {
    getFriendlyDeviceLabel,
    persistAuditEncrypted,
    loadAuditEncrypted,
    syncAuditWithCloud,
    scheduleAuditCloudSync,
    syncDeviceHeartbeat,
    revokeOtherDevices,
    renderDeviceRegistryPanel,
    buildCloudSnapshotPacket,
    ensureWeeklyCloudSnapshot,
    buildBitwardenJsonPayload,
    exportBitwardenJson,
    setDevicesForView: (devs) => { lastCloudDevices = Array.isArray(devs) ? devs : []; renderDeviceRegistryPanel(); },
    setSnapshotsForView: (snaps) => { lastCloudSnapshots = Array.isArray(snaps) ? snaps : []; renderDeviceRegistryPanel(); }
  };
})();
