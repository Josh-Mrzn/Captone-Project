import React from 'react';

const TABS = ['Dashboard', 'Product List', 'Reports', 'Messages', 'Settings'];
const TAB_ICONS = {
  Dashboard: '🏠',
  'Product List': '📦',
  Reports: '📊',
  Messages: '💬',
  Settings: '⚙️',
};

export default function AdminSidebar({ user, activeTab, setActiveTab, sidebarOpen, setSidebarOpen, onLogoutClick }) {
  const initials = user.email ? user.email.slice(0, 2).toUpperCase() : 'AD';

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
              {tab}
            </button>
          ))}
        </nav>

        <div className="ap-sidebar-foot">
          <div className="ap-user-chip">
            <div className="ap-avatar">{initials}</div>
            <div>
              <div className="ap-user-email">{user.email || 'admin@agrifair.ph'}</div>
              <div className="ap-user-role">{user.role || 'Admin'}</div>
            </div>
          </div>
          <button className="ap-logout-btn" onClick={onLogoutClick}>🚪 Logout</button>
        </div>
      </aside>

      {sidebarOpen && <div className="ap-overlay" onClick={() => setSidebarOpen(false)} />}
    </>
  );
}
