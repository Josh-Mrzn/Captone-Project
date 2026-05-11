import React, { useState, useEffect, useCallback } from 'react';

/**
 * WEB-11 Profile Management — with localStorage persistence.
 *
 * Every section saves independently to its own localStorage key so
 * data survives page refreshes, tab closes, and browser restarts.
 *
 * Keys used:
 *   agrifair_admin_profile       — profile form fields
 *   agrifair_admin_farm          — farm details + certifications
 *   agrifair_admin_addresses     — saved addresses array
 *   agrifair_admin_notifications — notification toggles
 */

// ── Persistence helpers ──────────────────────────────────────────────────
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded — fail silently */ }
}

// ── Defaults (first-run values, overridden by localStorage) ─────────────
const DEFAULT_PROFILE = {
  fullName: 'Juan dela Cruz',
  email: 'admin@agrifair.ph',
  phone: '+63 917 555 0123',
  bio: 'Rice farmer from Nueva Ecija. Producing premium varieties since 2012.',
};

const DEFAULT_FARM = {
  farmName: 'Dela Cruz Family Farm',
  location: 'Cabanatuan, Nueva Ecija',
  sizeHectares: '4.5',
  primaryCrops: 'Jasmine, Sinandomeng, Brown Rice',
  certifications: ['Organic-PH (2023)'],
};

const DEFAULT_ADDRESSES = [
  { id: 1, label: 'Farm Pickup',      full: 'Sitio Mabini, Brgy. Sapang, Cabanatuan, Nueva Ecija', primary: true  },
  { id: 2, label: 'Manila Warehouse', full: 'Unit 14, Bagong Silang St., Tondo, Manila',            primary: false },
];

const DEFAULT_NOTIFS = {
  orders: true,
  payments: true,
  messages: true,
  lowStock: true,
  announcements: false,
  emailDigest: true,
};

// ── Section list ─────────────────────────────────────────────────────────
const SECTIONS = [
  { key: 'profile',       icon: '👤', label: 'Profile'       },
  { key: 'farm',          icon: '🌾', label: 'Farm Details'  },
  { key: 'addresses',     icon: '📍', label: 'Addresses'     },
  { key: 'security',      icon: '🔒', label: 'Security'      },
  { key: 'notifications', icon: '🔔', label: 'Notifications' },
];

// ── Component ─────────────────────────────────────────────────────────────
export default function SettingsTab() {
  const [section, setSection] = useState('profile');

  // Load from localStorage on mount; fall back to defaults if nothing saved
  const [profile,   setProfileState]   = useState(() => load('agrifair_admin_profile',       DEFAULT_PROFILE));
  const [farm,      setFarmState]       = useState(() => load('agrifair_admin_farm',          DEFAULT_FARM));
  const [addresses, setAddressesState]  = useState(() => load('agrifair_admin_addresses',     DEFAULT_ADDRESSES));
  const [notifs,    setNotifsState]     = useState(() => load('agrifair_admin_notifications', DEFAULT_NOTIFS));

  // Wrap setters so every mutation also writes to localStorage immediately
  const setProfile   = useCallback(updater => setProfileState(prev => {
    const next = typeof updater === 'function' ? updater(prev) : updater;
    save('agrifair_admin_profile', next);
    return next;
  }), []);

  const setFarm      = useCallback(updater => setFarmState(prev => {
    const next = typeof updater === 'function' ? updater(prev) : updater;
    save('agrifair_admin_farm', next);
    return next;
  }), []);

  const setAddresses = useCallback(updater => setAddressesState(prev => {
    const next = typeof updater === 'function' ? updater(prev) : updater;
    save('agrifair_admin_addresses', next);
    return next;
  }), []);

  const setNotifs    = useCallback(updater => setNotifsState(prev => {
    const next = typeof updater === 'function' ? updater(prev) : updater;
    save('agrifair_admin_notifications', next);
    return next;
  }), []);

  // UI state (not persisted)
  const [newAddress, setNewAddress] = useState({ label: '', full: '' });
  const [pwd,        setPwd]        = useState({ current: '', next: '', confirm: '' });
  const [pwdMsg,     setPwdMsg]     = useState('');
  const [savedToast, setSavedToast] = useState('');

  const flashSaved = (msg = 'Saved successfully.') => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(''), 2500);
  };

  // Certifications
  const handleAddCert = () => {
    const name = window.prompt('Certification name (e.g. Organic-PH 2025):');
    if (name?.trim()) setFarm(f => ({ ...f, certifications: [...f.certifications, name.trim()] }));
  };
  const handleRemoveCert = (i) => {
    setFarm(f => ({ ...f, certifications: f.certifications.filter((_, idx) => idx !== i) }));
  };

  // Addresses
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.label.trim() || !newAddress.full.trim()) return;
    setAddresses(prev => [...prev, { ...newAddress, id: Date.now(), primary: false }]);
    setNewAddress({ label: '', full: '' });
    flashSaved('Address added.');
  };
  const setPrimary    = (id) => setAddresses(prev => prev.map(a => ({ ...a, primary: a.id === id })));
  const removeAddress = (id) => setAddresses(prev => prev.filter(a => a.id !== id));

  // Password (UI only — real change requires backend)
  const changePassword = (e) => {
    e.preventDefault();
    if (!pwd.current || !pwd.next || !pwd.confirm) { setPwdMsg('All fields are required.'); return; }
    if (pwd.next.length < 6)                        { setPwdMsg('New password must be at least 6 characters.'); return; }
    if (pwd.next !== pwd.confirm)                   { setPwdMsg('Passwords do not match.'); return; }
    setPwdMsg('');
    setPwd({ current: '', next: '', confirm: '' });
    flashSaved('Password updated.');
  };

  // Notifications — auto-saves on every toggle
  const toggleNotif = (k) => setNotifs(n => ({ ...n, [k]: !n[k] }));

  return (
    <div className="ap-tab-content">
      <div className="ap-page-header">
        <div>
          <h2>Settings</h2>
          <span className="ap-page-sub">Manage your account, farm, and preferences — changes are saved automatically</span>
        </div>
      </div>

      {savedToast && <div className="ap-toast">{savedToast}</div>}

      <div className="ap-settings-layout">
        {/* Section nav */}
        <nav className="ap-settings-nav">
          {SECTIONS.map(s => (
            <button
              key={s.key}
              className={`ap-settings-nav-item ${section === s.key ? 'active' : ''}`}
              onClick={() => setSection(s.key)}
              type="button"
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </nav>

        <div className="ap-settings-body">

          {/* ── PROFILE ── */}
          {section === 'profile' && (
            <div className="ap-panel">
              <div className="ap-panel-header">
                <h3>Profile</h3>
                <span className="ap-panel-sub">Public information visible to buyers</span>
              </div>
              <div className="ap-profile-row">
                <div className="ap-profile-avatar">
                  {profile.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <button className="ap-btn-ghost" type="button">Change photo</button>
              </div>
              <div className="ap-form-row">
                <div className="ap-form-field">
                  <label>Full Name</label>
                  <input value={profile.fullName} onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))} />
                </div>
                <div className="ap-form-field">
                  <label>Phone</label>
                  <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <div className="ap-form-field">
                <label>Email Address</label>
                <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="ap-form-field">
                <label>Bio</label>
                <textarea rows="3" value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} />
              </div>
              <div className="ap-form-actions">
                <button className="ap-btn-primary" type="button" onClick={() => flashSaved('Profile saved.')}>
                  Save Profile
                </button>
                <span className="ap-settings-autosave-hint">✓ Changes are also auto-saved as you type</span>
              </div>
            </div>
          )}

          {/* ── FARM ── */}
          {section === 'farm' && (
            <div className="ap-panel">
              <div className="ap-panel-header">
                <h3>Farm Details</h3>
                <span className="ap-panel-sub">Information shown on your seller page</span>
              </div>
              <div className="ap-form-row">
                <div className="ap-form-field">
                  <label>Farm Name</label>
                  <input value={farm.farmName} onChange={e => setFarm(f => ({ ...f, farmName: e.target.value }))} />
                </div>
                <div className="ap-form-field">
                  <label>Location</label>
                  <input value={farm.location} onChange={e => setFarm(f => ({ ...f, location: e.target.value }))} />
                </div>
              </div>
              <div className="ap-form-row">
                <div className="ap-form-field">
                  <label>Farm Size (hectares)</label>
                  <input type="number" min="0" step="0.1" value={farm.sizeHectares} onChange={e => setFarm(f => ({ ...f, sizeHectares: e.target.value }))} />
                </div>
                <div className="ap-form-field">
                  <label>Primary Crops</label>
                  <input value={farm.primaryCrops} onChange={e => setFarm(f => ({ ...f, primaryCrops: e.target.value }))} />
                </div>
              </div>
              <div className="ap-form-field">
                <label>Certifications</label>
                <div className="ap-cert-list">
                  {farm.certifications.map((c, i) => (
                    <span className="ap-cert-pill" key={i}>
                      {c} <button type="button" onClick={() => handleRemoveCert(i)} aria-label="Remove">×</button>
                    </span>
                  ))}
                  <button className="ap-btn-ghost ap-cert-add" type="button" onClick={handleAddCert}>+ Add Certification</button>
                </div>
              </div>
              <div className="ap-form-actions">
                <button className="ap-btn-primary" type="button" onClick={() => flashSaved('Farm details saved.')}>
                  Save Farm Details
                </button>
                <span className="ap-settings-autosave-hint">✓ Changes are also auto-saved as you type</span>
              </div>
            </div>
          )}

          {/* ── ADDRESSES ── */}
          {section === 'addresses' && (
            <div className="ap-panel">
              <div className="ap-panel-header">
                <h3>Saved Addresses</h3>
                <span className="ap-panel-sub">Used for pickups, delivery, and shipping</span>
              </div>
              <ul className="ap-address-list">
                {addresses.map(a => (
                  <li key={a.id} className={`ap-address-card ${a.primary ? 'primary' : ''}`}>
                    <div>
                      <div className="ap-address-label">
                        {a.label}
                        {a.primary && <span className="ap-address-badge">Primary</span>}
                      </div>
                      <div className="ap-address-full">{a.full}</div>
                    </div>
                    <div className="ap-row-actions">
                      {!a.primary && (
                        <button className="ap-btn-ghost ap-btn-sm" type="button" onClick={() => setPrimary(a.id)}>Set Primary</button>
                      )}
                      <button className="ap-icon-btn delete" type="button" onClick={() => removeAddress(a.id)} title="Delete">🗑️</button>
                    </div>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleAddAddress} className="ap-address-form">
                <h4>Add New Address</h4>
                <div className="ap-form-row">
                  <div className="ap-form-field">
                    <label>Label</label>
                    <input
                      placeholder="e.g. Cebu Warehouse"
                      value={newAddress.label}
                      onChange={e => setNewAddress(n => ({ ...n, label: e.target.value }))}
                    />
                  </div>
                  <div className="ap-form-field" style={{ flex: 2 }}>
                    <label>Full Address</label>
                    <input
                      placeholder="Street, City, Province"
                      value={newAddress.full}
                      onChange={e => setNewAddress(n => ({ ...n, full: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="ap-form-actions">
                  <button className="ap-btn-primary" type="submit">+ Add Address</button>
                </div>
              </form>
            </div>
          )}

          {/* ── SECURITY ── */}
          {section === 'security' && (
            <div className="ap-panel">
              <div className="ap-panel-header">
                <h3>Change Password</h3>
                <span className="ap-panel-sub">Update your account password</span>
              </div>
              <form onSubmit={changePassword}>
                <div className="ap-form-field">
                  <label>Current Password</label>
                  <input type="password" value={pwd.current} onChange={e => setPwd(p => ({ ...p, current: e.target.value }))} />
                </div>
                <div className="ap-form-row">
                  <div className="ap-form-field">
                    <label>New Password</label>
                    <input type="password" value={pwd.next} onChange={e => setPwd(p => ({ ...p, next: e.target.value }))} />
                  </div>
                  <div className="ap-form-field">
                    <label>Confirm New Password</label>
                    <input type="password" value={pwd.confirm} onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} />
                  </div>
                </div>
                {pwdMsg && <p className="ap-pwd-error">{pwdMsg}</p>}
                <div className="ap-form-actions">
                  <button className="ap-btn-primary" type="submit">Update Password</button>
                </div>
              </form>

              <div className="ap-panel" style={{ marginTop: '1.5rem', background: 'var(--green-50)', border: '1px solid var(--green-200)' }}>
                <div className="ap-panel-header">
                  <h3>Active Sessions</h3>
                  <span className="ap-panel-sub">Devices currently logged into your account</span>
                </div>
                <div className="ap-session-row">
                  <span className="ap-session-icon">💻</span>
                  <div>
                    <div className="ap-session-name">This device — Chrome on Windows</div>
                    <div className="ap-session-meta">Quezon City, PH · Active now</div>
                  </div>
                  <span className="ap-session-current">Current</span>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {section === 'notifications' && (
            <div className="ap-panel">
              <div className="ap-panel-header">
                <h3>Notification Preferences</h3>
                <span className="ap-panel-sub">Toggles are saved automatically</span>
              </div>
              <ul className="ap-notif-prefs">
                {[
                  { key: 'orders',        label: 'Order updates',          desc: 'New orders, status changes, cancellations' },
                  { key: 'payments',      label: 'Payment activity',       desc: 'Payment received, refunds, payouts' },
                  { key: 'messages',      label: 'Buyer messages',         desc: 'New messages from buyers' },
                  { key: 'lowStock',      label: 'Low stock alerts',       desc: 'When a product falls below threshold' },
                  { key: 'announcements', label: 'Platform announcements', desc: 'News and feature updates from AgriFair' },
                  { key: 'emailDigest',   label: 'Weekly email digest',    desc: 'A summary of your week, every Monday' },
                ].map(p => (
                  <li key={p.key} className="ap-notif-row">
                    <div>
                      <div className="ap-notif-label">{p.label}</div>
                      <div className="ap-notif-desc">{p.desc}</div>
                    </div>
                    <label className="ap-switch">
                      <input
                        type="checkbox"
                        checked={notifs[p.key]}
                        onChange={() => toggleNotif(p.key)}
                      />
                      <span className="ap-switch-slider" />
                    </label>
                  </li>
                ))}
              </ul>
              <div className="ap-form-actions">
                <button className="ap-btn-primary" type="button" onClick={() => flashSaved('Preferences saved.')}>
                  Save Preferences
                </button>
                <span className="ap-settings-autosave-hint">✓ Toggles save instantly</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
