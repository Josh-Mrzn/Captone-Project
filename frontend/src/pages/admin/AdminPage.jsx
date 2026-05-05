import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

// ── Components ─────────────────────────────────────────
import AdminSidebar from './components/AdminSidebar';
import NotificationCenter from './components/NotificationCenter';

// ── Tabs ───────────────────────────────────────────────
import DashboardTab   from './tabs/DashboardTab';
import ProductListTab from './tabs/ProductListTab';
import OrdersTab      from './tabs/OrdersTab';
import AnalyticsTab   from './tabs/AnalyticsTab';
import ReportsTab     from './tabs/ReportsTab';
import MessagesTab    from './tabs/MessagesTab';
import SettingsTab    from './tabs/SettingsTab';

import { logoutUser, clearSession } from '../../services/authApi';

export default function AdminPage({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser]               = useState({ email: '', role: 'Admin' });
  const [activeTab, setActiveTab]     = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogout, setShowLogout]   = useState(false);

  useEffect(() => {
    // Use the canonical 'user' key (set by LoginPage). Fall back to legacy
    // 'userSession' key for older sessions.
    const u = sessionStorage.getItem('user') || sessionStorage.getItem('userSession');
    if (u) {
      try { setUser(JSON.parse(u)); } catch { /* ignore */ }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Backend logout is a courtesy; even if it fails we still wipe the client.
    }
    clearSession();
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userSession');
    if (onLogout) onLogout();
    navigate('/login');
  };

  // ── Tab renderer ──────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case 'Dashboard':    return <DashboardTab user={user} setActiveTab={setActiveTab} />;
      case 'Product List': return <ProductListTab />;
      case 'Orders':       return <OrdersTab />;
      case 'Analytics':    return <AnalyticsTab />;
      case 'Reports':      return <ReportsTab />;
      case 'Messages':     return <MessagesTab />;
      case 'Settings':     return <SettingsTab />;
      default:             return null;
    }
  };

  return (
    <div className="ap-root">
      {/* SIDEBAR (component) */}
      <AdminSidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogoutClick={() => setShowLogout(true)}
      />

      {/* MAIN */}
      <main className="ap-main">
        <header className="ap-topbar">
          <button className="ap-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="ap-topbar-title">{activeTab}</div>
          <div className="ap-topbar-right">
            <NotificationCenter />
            <div className="ap-topbar-user">
              <div className="ap-topbar-avatar">
                {(user.email || 'AD').slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        <div className="ap-body">{renderTab()}</div>
      </main>

      {/* LOGOUT MODAL */}
      {showLogout && (
        <div className="ap-modal-overlay">
          <div className="ap-modal">
            <div className="ap-modal-icon">🚪</div>
            <h3>Log out?</h3>
            <p>Are you sure you want to sign out of AgriFair Admin?</p>
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
