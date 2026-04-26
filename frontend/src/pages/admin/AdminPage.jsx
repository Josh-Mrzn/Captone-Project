import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

// ── Components ─────────────────────────────────────────
import AdminSidebar from './components/AdminSidebar';

// ── Tabs ───────────────────────────────────────────────
import DashboardTab   from './tabs/DashboardTab';
import ProductListTab from './tabs/ProductListTab';
import ReportsTab     from './tabs/ReportsTab';
import MessagesTab    from './tabs/MessagesTab';
import SettingsTab    from './tabs/SettingsTab';

// ── Tab configuration (Events & User Management removed — Super Admin only) ──
const TABS = ['Dashboard', 'Product List', 'Reports', 'Messages', 'Settings'];

export default function AdminPage({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser]               = useState({ email: '', role: 'Admin' });
  const [activeTab, setActiveTab]     = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogout, setShowLogout]   = useState(false);

  useEffect(() => {
    const s = sessionStorage.getItem('userSession');
    if (s) setUser(JSON.parse(s));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userSession');
    if (onLogout) onLogout();
    navigate('/login');
  };

  // ── Tab renderer ──────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case 'Dashboard':    return <DashboardTab user={user} />;
      case 'Product List': return <ProductListTab />;
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
