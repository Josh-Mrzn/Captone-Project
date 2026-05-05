import React from 'react';

const TABS = ['Dashboard', 'Product List', 'Orders', 'Analytics', 'Reports', 'Messages', 'Settings'];
const TAB_ICONS = {
  Dashboard:      '🏠',
  'Product List': '📦',
  Orders:         '🛒',
  Analytics:      '📈',
  Reports:        '📊',
  Messages:       '💬',
  Settings:       '⚙️',
};

// Optional badges (hardcoded for now — replace with real data when backend is wired)
const TAB_BADGES = {
  Orders:   3,
  Messages: 4,
};

export default function AdminSidebar({ user, activeTab, setActiveTab, sidebarOpen, setSidebarOpen, onLogoutClick }) {
  const initials = user.email ? user.email.slice(0, 2).toUpperCase() : 'AD';
  const displayName = user.name || user.email || 'admin@agrifair.ph';
  const displayRole = user.role || 'Admin';

  return (
    <>
      <aside className={`ap-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="ap-sidebar-header">
          <div className="ap-logo">
            <span>🌿</span>
            <span className="ap-logo-text">AgriFair</span>
          </div>
          <button className="ap-sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <nav className="ap-nav">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`ap-nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setSidebarOpen(false); }}
            >
              <span className="ap-nav-icon">{TAB_ICONS[tab]}</span>
              <span className="ap-nav-label">{tab}</span>
              {TAB_BADGES[tab] && (
                <span className="ap-nav-badge">{TAB_BADGES[tab]}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="ap-sidebar-foot">
          <div className="ap-user-chip">
            <div className="ap-avatar">{initials}</div>
            <div className="ap-user-chip-text">
              <div className="ap-user-email">{displayName}</div>
              <div className="ap-user-role">{displayRole}</div>
            </div>
          </div>
          <button className="ap-logout-btn" onClick={onLogoutClick}>🚪 Logout</button>
        </div>
      </aside>

      {sidebarOpen && <div className="ap-overlay" onClick={() => setSidebarOpen(false)} />}
    </>
  );
}
