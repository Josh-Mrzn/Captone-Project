import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../admin/AdminPage.css'; // reuse same styles

const TABS = ['Overview', 'Admins', 'Product List', 'System Logs', 'Messages', 'Settings'];
const TAB_ICONS = { Overview:'📊', Admins:'👤', 'Product List':'📦', 'System Logs':'🗂️', Messages:'💬', Settings:'⚙️' };
const EMPTY_PRODUCT = { name:'', category:'', price:'', stock:'', status:'Active' };

export default function SuperAdminPage({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser]               = useState({ email:'', role:'Super Admin' });
  const [activeTab, setActiveTab]     = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogout, setShowLogout]   = useState(false);

  // Stats
  const [stats, setStats] = useState([
    { key:'admins',   icon:'👤', label:'Total Admins',  value:'' },
    { key:'users',    icon:'👥', label:'Total Users',   value:'' },
    { key:'products', icon:'📦', label:'Products',      value:'' },
    { key:'events',   icon:'📅', label:'Total Events',  value:'' },
  ]);

  // Products
  const [products, setProducts]         = useState([]);
  const [prodForm, setProdForm]         = useState(EMPTY_PRODUCT);
  const [editingId, setEditingId]       = useState(null);
  const [showProdForm, setShowProdForm] = useState(false);

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

  const initials = user.email ? user.email.slice(0,2).toUpperCase() : 'SA';

  const handleStatChange = (key, val) => {
    setStats(prev => prev.map(s => s.key === key ? { ...s, value: val } : s));
  };

  const handleProdSubmit = (e) => {
    e.preventDefault();
    if (!prodForm.name.trim()) return;
    if (editingId !== null) {
      setProducts(prev => prev.map(p => p.id === editingId ? { ...prodForm, id: editingId } : p));
      setEditingId(null);
    } else {
      setProducts(prev => [...prev, { ...prodForm, id: Date.now() }]);
    }
    setProdForm(EMPTY_PRODUCT);
    setShowProdForm(false);
  };

  const cancelProdForm = () => { setProdForm(EMPTY_PRODUCT); setEditingId(null); setShowProdForm(false); };

  const renderContent = () => {
    switch (activeTab) {

      case 'Overview':
        return (
          <div className="ap-tab-content">
            <div className="ap-welcome">
              <div>
                <h1>Super Admin Panel 🛡️</h1>
                <p>{new Date().toLocaleDateString('en-PH',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
              </div>
            </div>
            <p className="ap-hint">Click any stat value below to update it.</p>
            <div className="ap-stats-grid">
              {stats.map(s => (
                <div className="ap-stat-card" key={s.key}>
                  <div className="ap-stat-icon">{s.icon}</div>
                  <div className="ap-stat-label">{s.label}</div>
                  <input className="ap-stat-input" type="text" value={s.value}
                    onChange={e => handleStatChange(s.key, e.target.value)} placeholder="—" />
                </div>
              ))}
            </div>
            <div className="ap-panel ap-activity-panel">
              <div className="ap-panel-header"><h2>System Activity</h2></div>
              <p className="ap-empty-state">System-wide activity will appear here once connected to the backend.</p>
            </div>
          </div>
        );

      case 'Admins':
        return (
          <div className="ap-tab-content">
            <div className="ap-page-header">
              <h2>Admin Accounts</h2>
              <button className="ap-btn-primary">+ Add Admin</button>
            </div>
            <div className="ap-panel">
              <p className="ap-empty-state">Admin accounts will load here once connected to the backend API.</p>
            </div>
          </div>
        );

      case 'Product List':
        return (
          <div className="ap-tab-content">
            <div className="ap-page-header">
              <h2>Product List</h2>
              {!showProdForm && <button className="ap-btn-primary" onClick={() => setShowProdForm(true)}>+ Add Product</button>}
            </div>

            {showProdForm && (
              <div className="ap-panel ap-form-panel">
                <h3>{editingId !== null ? 'Edit Product' : 'New Product'}</h3>
                <form className="ap-prod-form" onSubmit={handleProdSubmit}>
                  <div className="ap-form-row">
                    <div className="ap-form-field">
                      <label>Product Name *</label>
                      <input type="text" placeholder="e.g. Organic Rice" value={prodForm.name}
                        onChange={e => setProdForm(p=>({...p,name:e.target.value}))} required />
                    </div>
                    <div className="ap-form-field">
                      <label>Category</label>
                      <input type="text" placeholder="e.g. Grains" value={prodForm.category}
                        onChange={e => setProdForm(p=>({...p,category:e.target.value}))} />
                    </div>
                  </div>
                  <div className="ap-form-row">
                    <div className="ap-form-field">
                      <label>Price (₱)</label>
                      <input type="number" placeholder="0.00" min="0" step="0.01" value={prodForm.price}
                        onChange={e => setProdForm(p=>({...p,price:e.target.value}))} />
                    </div>
                    <div className="ap-form-field">
                      <label>Stock</label>
                      <input type="number" placeholder="0" min="0" value={prodForm.stock}
                        onChange={e => setProdForm(p=>({...p,stock:e.target.value}))} />
                    </div>
                    <div className="ap-form-field">
                      <label>Status</label>
                      <select value={prodForm.status} onChange={e => setProdForm(p=>({...p,status:e.target.value}))}>
                        <option>Active</option><option>Inactive</option><option>Out of Stock</option>
                      </select>
                    </div>
                  </div>
                  <div className="ap-form-actions">
                    <button type="button" className="ap-btn-ghost" onClick={cancelProdForm}>Cancel</button>
                    <button type="submit" className="ap-btn-primary">{editingId !== null ? 'Save Changes' : 'Add Product'}</button>
                  </div>
                </form>
              </div>
            )}

            <div className="ap-panel">
              {products.length === 0 ? (
                <p className="ap-empty-state">No products yet. Click <strong>+ Add Product</strong> to get started.</p>
              ) : (
                <div className="ap-table-wrap">
                  <table className="ap-table">
                    <thead><tr><th>#</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {products.map((p, i) => (
                        <tr key={p.id}>
                          <td>{i+1}</td>
                          <td className="ap-td-name">{p.name}</td>
                          <td>{p.category||'—'}</td>
                          <td>{p.price ? `₱${parseFloat(p.price).toLocaleString()}` : '—'}</td>
                          <td>{p.stock||'—'}</td>
                          <td><span className={`ap-badge ap-badge-${p.status.toLowerCase().replace(/ /g,'-')}`}>{p.status}</span></td>
                          <td>
                            <div className="ap-row-actions">
                              <button className="ap-icon-btn edit" onClick={() => { setProdForm({name:p.name,category:p.category,price:p.price,stock:p.stock,status:p.status}); setEditingId(p.id); setShowProdForm(true); }}>✏️</button>
                              <button className="ap-icon-btn delete" onClick={() => setProducts(prev=>prev.filter(x=>x.id!==p.id))}>🗑️</button>
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

      case 'System Logs':
        return (
          <div className="ap-tab-content">
            <div className="ap-page-header"><h2>System Logs</h2></div>
            <div className="ap-panel">
              <p className="ap-empty-state">System logs will load here once connected to the backend API.</p>
            </div>
          </div>
        );

      case 'Messages':
        return (
          <div className="ap-tab-content">
            <div className="ap-page-header"><h2>Messages</h2></div>
            <div className="ap-panel">
              <p className="ap-empty-state">Super Admin messaging will load here once connected to the backend API.</p>
            </div>
          </div>
        );

      case 'Settings':
        return (
          <div className="ap-tab-content">
            <div className="ap-page-header"><h2>System Settings</h2></div>
            <div className="ap-panel">
              <p className="ap-empty-state">System-wide settings will be configurable once connected to the backend.</p>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="ap-root">
      <aside className={`ap-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="ap-sidebar-header">
          <div className="ap-logo"><span>🌿</span><span className="ap-logo-text">AgriFair</span></div>
          <button className="ap-sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav className="ap-nav">
          {TABS.map(tab => (
            <button key={tab} className={`ap-nav-item ${activeTab===tab?'active':''}`}
              onClick={() => { setActiveTab(tab); setSidebarOpen(false); }}>
              <span className="ap-nav-icon">{TAB_ICONS[tab]}</span>{tab}
            </button>
          ))}
        </nav>
        <div className="ap-sidebar-foot">
          <div className="ap-user-chip">
            <div className="ap-avatar" style={{background:'#b45309'}}>{initials}</div>
            <div>
              <div className="ap-user-email">{user.email || 'superadmin@agrifair.ph'}</div>
              <div className="ap-user-role" style={{color:'#fbbf24'}}>Super Admin</div>
            </div>
          </div>
          <button className="ap-logout-btn" onClick={() => setShowLogout(true)}>🚪 Logout</button>
        </div>
      </aside>

      {sidebarOpen && <div className="ap-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="ap-main">
        <header className="ap-topbar">
          <button className="ap-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="ap-topbar-title">{activeTab}</div>
        </header>
        <div className="ap-body">{renderContent()}</div>
      </main>

      {showLogout && (
        <div className="ap-modal-overlay">
          <div className="ap-modal">
            <div className="ap-modal-icon">🚪</div>
            <h3>Log out?</h3>
            <p>Are you sure you want to sign out?</p>
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
