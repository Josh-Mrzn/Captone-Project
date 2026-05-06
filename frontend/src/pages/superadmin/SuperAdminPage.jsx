import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../admin/AdminPage.css';
import './SuperAdminPage.css';
import { logoutUser, clearSession } from '../../services/authApi';

/**
 * SuperAdminPage — WEB-12 Admin Panel
 *
 * Tabs available ONLY to superadmin:
 *   Overview      — platform-wide KPIs + system activity feed
 *   Users         — all registered farmers/buyers + suspend/activate
 *   Admin Accounts — pending + active admins, approve/suspend
 *   System Logs   — audit log of superadmin actions
 *   Platform Analytics — platform-wide revenue, user growth, variety trends
 *   Settings      — platform configuration
 *
 * Regular admins are BLOCKED at the route level (ProtectedRoute role="superadmin"
 * in App.jsx). This page adds an extra runtime guard on mount just in case.
 */

// ── Mock data (replace with API calls when backend is wired) ────────────
const MOCK_USERS = [
  { id: 1, name: 'Maria Santos',  email: 'maria@example.com', role: 'user',       status: 'active',    joined: '2025-03-12' },
  { id: 2, name: 'Jose Reyes',    email: 'jose@example.com',  role: 'user',       status: 'active',    joined: '2025-03-18' },
  { id: 3, name: 'Ana Dela Cruz', email: 'ana@example.com',   role: 'user',       status: 'suspended', joined: '2025-04-01' },
  { id: 4, name: 'Juan Admin',    email: 'juan@example.com',  role: 'admin',      status: 'active',    joined: '2025-02-20' },
  { id: 5, name: 'Lisa Admin',    email: 'lisa@example.com',  role: 'admin',      status: 'pending',   joined: '2025-04-22' },
  { id: 6, name: 'Carlos Buyer',  email: 'carlos@example.com',role: 'user',       status: 'active',    joined: '2025-04-15' },
];

const MOCK_LOGS = [
  { id: 1, action: 'ACTIVATE_USER',   actor: 'dev@agrifair.com', target: 'ana@example.com',  ts: '2025-04-26T10:14:00', detail: 'Reactivated suspended account' },
  { id: 2, action: 'SUSPEND_USER',    actor: 'dev@agrifair.com', target: 'ana@example.com',  ts: '2025-04-25T09:42:00', detail: 'Policy violation — repeat offence' },
  { id: 3, action: 'APPROVE_ADMIN',   actor: 'dev@agrifair.com', target: 'juan@example.com', ts: '2025-04-20T14:05:00', detail: 'Background check cleared' },
  { id: 4, action: 'CREATE_USER',     actor: 'dev@agrifair.com', target: 'lisa@example.com', ts: '2025-04-22T11:30:00', detail: 'Admin account provisioned manually' },
  { id: 5, action: 'DELETE_USER',     actor: 'dev@agrifair.com', target: 'spam@bad.com',     ts: '2025-04-18T08:55:00', detail: 'Spam / fake account removed' },
];

const ACTIVITY_TONE = {
  ACTIVATE_USER: 'tone-green',
  APPROVE_ADMIN: 'tone-green',
  SUSPEND_USER:  'tone-red',
  DELETE_USER:   'tone-red',
  CREATE_USER:   'tone-blue',
  UPDATE_USER:   'tone-gold',
};
const ACTIVITY_ICON = {
  ACTIVATE_USER: '✅',
  APPROVE_ADMIN: '✅',
  SUSPEND_USER:  '🚫',
  DELETE_USER:   '🗑️',
  CREATE_USER:   '➕',
  UPDATE_USER:   '✏️',
};

const TABS = [
  { key: 'Overview',            icon: '🛡️', label: 'Overview' },
  { key: 'Users',               icon: '👥', label: 'Users' },
  { key: 'Admin Accounts',      icon: '👤', label: 'Admin Accounts' },
  { key: 'System Logs',         icon: '🗂️', label: 'System Logs' },
  { key: 'Platform Analytics',  icon: '📊', label: 'Platform Analytics' },
  { key: 'Settings',            icon: '⚙️', label: 'Settings' },
];

const fmtDate = (iso) => new Date(iso).toLocaleString('en-PH', {
  month: 'short', day: 'numeric', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

// ── Component ────────────────────────────────────────────────────────────
export default function SuperAdminPage({ onLogout }) {
  const navigate  = useNavigate();
  const [user, setUser]             = useState({ email: '', role: 'superadmin', name: 'SuperAdmin' });
  const [activeTab, setActiveTab]   = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  // Users tab state
  const [users, setUsers]           = useState(MOCK_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('All');

  // System Logs
  const [logs] = useState(MOCK_LOGS);

  // Toast
  const [toast, setToast] = useState('');
  const flashToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  // ── Runtime guard: redirect if not superadmin ──────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem('user') || sessionStorage.getItem('userSession');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        const role = (parsed.role || '').toLowerCase();
        if (role !== 'superadmin') {
          // Should never reach here due to ProtectedRoute, but belt-and-suspenders
          navigate('/login', { replace: true });
        }
      } catch { /* ignore */ }
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = async () => {
    try { await logoutUser(); } catch { /* swallow */ }
    clearSession();
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userSession');
    if (onLogout) onLogout();
    navigate('/login');
  };

  // ── User management actions ────────────────────────────────────────────
  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const next = u.status === 'active' ? 'suspended' : 'active';
      flashToast(`${u.name} — status changed to ${next}.`);
      return { ...u, status: next };
    }));
  };

  const approveAdmin = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      flashToast(`${u.name} approved as Admin.`);
      return { ...u, status: 'active' };
    }));
  };

  const deleteUser = (id) => {
    if (!window.confirm('Permanently delete this user? This cannot be undone.')) return;
    const u = users.find(x => x.id === id);
    setUsers(prev => prev.filter(x => x.id !== id));
    flashToast(`${u?.name} deleted.`);
  };

  // ── Filtered user list ─────────────────────────────────────────────────
  const filteredUsers = useMemo(() => users.filter(u => {
    if (userFilter !== 'All' && u.role !== userFilter.toLowerCase() && u.status !== userFilter.toLowerCase()) return false;
    if (userSearch && !`${u.name} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())) return false;
    return true;
  }), [users, userFilter, userSearch]);

  const pendingAdmins = users.filter(u => u.role === 'admin' && u.status === 'pending');

  // ── Tab content ───────────────────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {

      // ── OVERVIEW ──────────────────────────────────────────────────────
      case 'Overview': return (
        <div className="ap-tab-content">
          <div className="ap-welcome">
            <div>
              <h1>Super Admin Panel 🛡️</h1>
              <p>{new Date().toLocaleDateString('en-PH',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
            </div>
          </div>

          {pendingAdmins.length > 0 && (
            <div className="sa-alert-banner">
              ⚠️ {pendingAdmins.length} admin account{pendingAdmins.length > 1 ? 's are' : ' is'} waiting for approval.
              <button className="sa-alert-link" onClick={() => setActiveTab('Admin Accounts')}>Review →</button>
            </div>
          )}

          <div className="ap-stats-grid">
            {[
              { icon: '👥', label: 'Total Users',       value: users.filter(u=>u.role==='user').length,       delta: 'registered farmers & buyers' },
              { icon: '👤', label: 'Admin Accounts',     value: users.filter(u=>u.role==='admin').length,      delta: `${pendingAdmins.length} pending approval` },
              { icon: '🚫', label: 'Suspended Accounts', value: users.filter(u=>u.status==='suspended').length, delta: 'requires monitoring' },
              { icon: '📋', label: 'Audit Log Entries',  value: logs.length,                                   delta: 'platform-wide actions' },
            ].map(s => (
              <div className="ap-stat-card ap-stat-rich" key={s.label}>
                <div className="ap-stat-card-top"><div className="ap-stat-icon">{s.icon}</div></div>
                <div className="ap-stat-label">{s.label}</div>
                <div className="ap-stat-value-rich">{s.value}</div>
                <div className="ap-stat-delta">{s.delta}</div>
              </div>
            ))}
          </div>

          <section className="ap-panel">
            <div className="ap-panel-header">
              <h3>Recent Audit Activity</h3>
              <button className="sa-view-all" onClick={() => setActiveTab('System Logs')}>View all →</button>
            </div>
            <ul className="ap-activity-list">
              {logs.slice(0, 5).map(l => (
                <li className="ap-activity-item" key={l.id}>
                  <span className={`ap-activity-icon ${ACTIVITY_TONE[l.action] || ''}`}>{ACTIVITY_ICON[l.action] || '•'}</span>
                  <div className="ap-activity-body">
                    <p className="ap-activity-msg">
                      <strong>{l.action.replace(/_/g, ' ')}</strong> — {l.target} ({l.detail})
                    </p>
                    <span className="ap-activity-time">{fmtDate(l.ts)} by {l.actor}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      );

      // ── USERS ─────────────────────────────────────────────────────────
      case 'Users': return (
        <div className="ap-tab-content">
          <div className="ap-page-header">
            <div><h2>All Users</h2><span className="ap-page-sub">Farmers, buyers, and admins on the platform</span></div>
          </div>

          <div className="ap-filter-bar">
            <input
              type="text"
              className="ap-filter-input"
              placeholder="🔍 Search by name or email…"
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
            />
            {['All', 'user', 'admin', 'active', 'suspended', 'pending'].map(f => (
              <button key={f} className={`ap-chip ${userFilter===f?'active':''}`} onClick={() => setUserFilter(f)}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>

          <div className="ap-panel">
            {filteredUsers.length === 0 ? (
              <p className="ap-empty-state">No users match the filter.</p>
            ) : (
              <div className="ap-table-wrap">
                <table className="ap-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td className="ap-td-name">{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`ap-role-pill role-${u.role}`}>{u.role}</span>
                        </td>
                        <td>
                          <span className={`ap-status-pill ${u.status==='active'?'tone-green':u.status==='pending'?'tone-gold':'tone-red'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td>{u.joined}</td>
                        <td>
                          <div className="ap-row-actions">
                            {u.role === 'admin' && u.status === 'pending' && (
                              <button className="ap-icon-btn" title="Approve admin" onClick={() => approveAdmin(u.id)}>✅</button>
                            )}
                            <button
                              className="ap-icon-btn"
                              title={u.status === 'active' ? 'Suspend' : 'Activate'}
                              onClick={() => toggleStatus(u.id)}
                            >
                              {u.status === 'active' ? '🚫' : '✔️'}
                            </button>
                            <button className="ap-icon-btn delete" title="Delete user" onClick={() => deleteUser(u.id)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );

      // ── ADMIN ACCOUNTS ─────────────────────────────────────────────────
      case 'Admin Accounts': {
        const admins = users.filter(u => u.role === 'admin');
        return (
          <div className="ap-tab-content">
            <div className="ap-page-header">
              <div>
                <h2>Admin Accounts</h2>
                <span className="ap-page-sub">Approve pending admins and manage existing accounts</span>
              </div>
            </div>

            {pendingAdmins.length > 0 && (
              <section className="ap-panel">
                <div className="ap-panel-header">
                  <h3>⏳ Pending Approval ({pendingAdmins.length})</h3>
                  <span className="ap-panel-sub">New admin registrations awaiting your review</span>
                </div>
                <ul className="sa-approval-list">
                  {pendingAdmins.map(a => (
                    <li key={a.id} className="sa-approval-card">
                      <div className="sa-approval-avatar">{a.name.slice(0,2).toUpperCase()}</div>
                      <div className="sa-approval-info">
                        <strong>{a.name}</strong>
                        <span>{a.email}</span>
                        <span className="sa-approval-joined">Registered: {a.joined}</span>
                      </div>
                      <div className="ap-row-actions">
                        <button className="ap-btn-primary" onClick={() => approveAdmin(a.id)}>Approve</button>
                        <button className="ap-btn-danger"  onClick={() => deleteUser(a.id)}>Reject</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="ap-panel">
              <div className="ap-panel-header">
                <h3>Active Admins ({admins.filter(a=>a.status==='active').length})</h3>
              </div>
              <div className="ap-table-wrap">
                <table className="ap-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {admins.filter(a => a.status !== 'pending').map(a => (
                      <tr key={a.id}>
                        <td className="ap-td-name">{a.name}</td>
                        <td>{a.email}</td>
                        <td>
                          <span className={`ap-status-pill ${a.status==='active'?'tone-green':'tone-red'}`}>{a.status}</span>
                        </td>
                        <td>{a.joined}</td>
                        <td>
                          <div className="ap-row-actions">
                            <button className="ap-icon-btn" title={a.status==='active'?'Suspend':'Reactivate'} onClick={() => toggleStatus(a.id)}>
                              {a.status === 'active' ? '🚫' : '✔️'}
                            </button>
                            <button className="ap-icon-btn delete" title="Remove admin" onClick={() => deleteUser(a.id)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        );
      }

      // ── SYSTEM LOGS ────────────────────────────────────────────────────
      case 'System Logs': return (
        <div className="ap-tab-content">
          <div className="ap-page-header">
            <div><h2>System Logs</h2><span className="ap-page-sub">Full audit trail of all superadmin actions</span></div>
          </div>
          <div className="ap-panel">
            <div className="ap-table-wrap">
              <table className="ap-table">
                <thead>
                  <tr><th>Action</th><th>Actor</th><th>Target</th><th>Detail</th><th>Timestamp</th></tr>
                </thead>
                <tbody>
                  {logs.map(l => (
                    <tr key={l.id}>
                      <td>
                        <span className={`ap-status-pill ${ACTIVITY_TONE[l.action]||''}`}>
                          {ACTIVITY_ICON[l.action]} {l.action.replace(/_/g,' ')}
                        </span>
                      </td>
                      <td>{l.actor}</td>
                      <td>{l.target}</td>
                      <td className="ap-td-sub">{l.detail}</td>
                      <td style={{whiteSpace:'nowrap'}}>{fmtDate(l.ts)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

      // ── PLATFORM ANALYTICS ─────────────────────────────────────────────
      case 'Platform Analytics': return (
        <div className="ap-tab-content">
          <div className="ap-page-header">
            <div><h2>Platform Analytics</h2><span className="ap-page-sub">Platform-wide metrics across all sellers and buyers</span></div>
          </div>
          <div className="ap-stats-grid">
            {[
              { icon:'💰', label:'Platform GMV',        value:'₱1.24M',  delta:'Gross merchandise value, all time' },
              { icon:'📦', label:'Total Products',       value:'184',     delta:'Across all seller accounts' },
              { icon:'🛒', label:'Total Orders',         value:'2,841',   delta:'Since platform launch' },
              { icon:'📈', label:'Avg Order Value',      value:'₱2,380',  delta:'Up 8.4% vs last month' },
            ].map(s => (
              <div className="ap-stat-card ap-stat-rich" key={s.label}>
                <div className="ap-stat-card-top"><div className="ap-stat-icon">{s.icon}</div></div>
                <div className="ap-stat-label">{s.label}</div>
                <div className="ap-stat-value-rich">{s.value}</div>
                <div className="ap-stat-delta">{s.delta}</div>
              </div>
            ))}
          </div>
          <div className="ap-panel">
            <div className="ap-panel-header"><h3>Top Selling Varieties — Platform Wide</h3></div>
            <div className="ap-table-wrap">
              <table className="ap-table">
                <thead><tr><th>Variety</th><th>Total Volume (kg)</th><th>Revenue Share</th><th>Sellers</th></tr></thead>
                <tbody>
                  {[
                    ['Jasmine Rice', '42,800', '38%', '24'],
                    ['Sinandomeng', '28,400', '26%', '18'],
                    ['Brown Rice',   '15,200', '14%', '12'],
                    ['Dinorado',     '10,900', '10%', '9'],
                    ['Black Rice',    '7,600',  '7%', '5'],
                  ].map(([v,vol,share,sellers]) => (
                    <tr key={v}>
                      <td className="ap-td-name">{v}</td>
                      <td>{vol}</td>
                      <td><span className="ap-status-pill tone-green">{share}</span></td>
                      <td>{sellers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

      // ── SETTINGS ──────────────────────────────────────────────────────
      case 'Settings': return (
        <div className="ap-tab-content">
          <div className="ap-page-header">
            <div><h2>Platform Settings</h2><span className="ap-page-sub">System-wide configuration (super admin only)</span></div>
          </div>
          <div className="ap-panel">
            <div className="ap-panel-header"><h3>Access Control</h3><span className="ap-panel-sub">Who can register and what they can do</span></div>
            {[
              { label:'Allow new admin self-registration',  desc:'If disabled, admins can only be created by a super admin.',    on: true  },
              { label:'Require admin approval before login', desc:'New admins stay in "pending" until a super admin approves.',   on: true  },
              { label:'Allow user self-deletion',           desc:'Users can delete their own accounts from the mobile app.',      on: false },
              { label:'Maintenance mode',                   desc:'Locks the platform for all non-superadmin users.',              on: false },
            ].map(s => (
              <div className="ap-notif-row" key={s.label}>
                <div>
                  <div className="ap-notif-label">{s.label}</div>
                  <div className="ap-notif-desc">{s.desc}</div>
                </div>
                <label className="ap-switch">
                  <input type="checkbox" defaultChecked={s.on} />
                  <span className="ap-switch-slider" />
                </label>
              </div>
            ))}
            <div className="ap-form-actions" style={{marginTop:'1rem'}}>
              <button className="ap-btn-primary" onClick={() => flashToast('Platform settings saved.')}>Save Settings</button>
            </div>
          </div>
        </div>
      );

      default: return null;
    }
  };

  const initials = (user.name || user.email || 'SA').slice(0, 2).toUpperCase();

  return (
    <div className="ap-root sa-root">
      {/* ── SIDEBAR ── */}
      <aside className={`ap-sidebar sa-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="ap-sidebar-header">
          <div className="ap-logo">
            <span>🌿</span>
            <span className="ap-logo-text">AgriFair</span>
          </div>
          <div className="sa-sidebar-badge">Super Admin</div>
          <button className="ap-sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="ap-nav">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`ap-nav-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
            >
              <span className="ap-nav-icon">{tab.icon}</span>
              <span className="ap-nav-label">{tab.label}</span>
              {tab.key === 'Admin Accounts' && pendingAdmins.length > 0 && (
                <span className="ap-nav-badge">{pendingAdmins.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="ap-sidebar-foot">
          <div className="ap-user-chip">
            <div className="ap-avatar sa-avatar">{initials}</div>
            <div className="ap-user-chip-text">
              <div className="ap-user-email">{user.email || 'dev@agrifair.com'}</div>
              <div className="ap-user-role sa-role-label">Super Admin</div>
            </div>
          </div>
          <button className="ap-logout-btn" onClick={() => setShowLogout(true)}>🚪 Logout</button>
        </div>
      </aside>

      {sidebarOpen && <div className="ap-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── MAIN ── */}
      <main className="ap-main">
        <header className="ap-topbar sa-topbar">
          <button className="ap-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="ap-topbar-title">{activeTab}</div>
          <div className="ap-topbar-right">
            <span className="sa-topbar-badge">🛡️ Super Admin</span>
            <div className="ap-topbar-user">
              <div className="ap-topbar-avatar sa-topbar-avatar">{initials}</div>
            </div>
          </div>
        </header>
        <div className="ap-body">{renderTab()}</div>
      </main>

      {/* ── TOAST ── */}
      {toast && <div className="ap-toast">{toast}</div>}

      {/* ── LOGOUT MODAL ── */}
      {showLogout && (
        <div className="ap-modal-overlay">
          <div className="ap-modal">
            <div className="ap-modal-icon">🚪</div>
            <h3>Log out?</h3>
            <p>Sign out of the AgriFair Super Admin panel?</p>
            <div className="ap-modal-actions">
              <button className="ap-modal-cancel" onClick={() => setShowLogout(false)}>Cancel</button>
              <button className="ap-modal-confirm" onClick={handleLogout}>Yes, Log Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
