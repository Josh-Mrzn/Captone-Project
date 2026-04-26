import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

// ── TABS ──────────────────────────────────────────────
const TABS = ['Dashboard', 'Users', 'Events', 'Product List', 'Reports', 'Messages', 'Settings'];
const TAB_ICONS = { Dashboard:'🏠', Users:'👥', Events:'📅', 'Product List':'📦', Reports:'📊', Messages:'💬', Settings:'⚙️' };

// ── EMPTY STAT CARDS ──────────────────────────────────
const INIT_STATS = [
  { key:'users',    icon:'👥', label:'Total Users',    value:'' },
  { key:'events',   icon:'📅', label:'Active Events',  value:'' },
  { key:'products', icon:'📦', label:'Products Listed',value:'' },
  { key:'reports',  icon:'📊', label:'Pending Reports',value:'' },
];

// ── EMPTY PRODUCT TABLE ───────────────────────────────
const EMPTY_PRODUCT = { name:'', category:'', price:'', stock:'', status:'Active' };

// ── MOCK CHAT USERS ───────────────────────────────────
const MOCK_USERS = [
  { id:1, name:'Maria Santos',   avatar:'MS', lastMsg:'Hello, I have a question…', time:'2m', unread:2 },
  { id:2, name:'Jose Reyes',     avatar:'JR', lastMsg:'Thank you for the update.', time:'15m', unread:0 },
  { id:3, name:'Ana Dela Cruz',  avatar:'AD', lastMsg:'When will the event start?', time:'1h', unread:1 },
  { id:4, name:'Carlos Gomez',   avatar:'CG', lastMsg:'Got it, thanks!',            time:'3h', unread:0 },
];

export default function AdminPage({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser]                 = useState({ email:'', role:'Admin' });
  const [activeTab, setActiveTab]       = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [showLogout, setShowLogout]     = useState(false);

  // Stats — editable
  const [stats, setStats]               = useState(INIT_STATS);

  // Product List state
  const [products, setProducts]         = useState([]);
  const [prodForm, setProdForm]         = useState(EMPTY_PRODUCT);
  const [editingId, setEditingId]       = useState(null);
  const [showProdForm, setShowProdForm] = useState(false);

  // Chat state
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatUsers]                     = useState(MOCK_USERS);
  const [messages, setMessages]         = useState({});
  const [msgInput, setMsgInput]         = useState('');
  const msgEndRef                       = useRef(null);

  useEffect(() => {
    const s = sessionStorage.getItem('userSession');
    if (s) setUser(JSON.parse(s));
  }, []);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, selectedChat]);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userSession');
    if (onLogout) onLogout();
    navigate('/login');
  };

  const initials = user.email ? user.email.slice(0,2).toUpperCase() : 'AD';

  // ── STAT EDIT ─────────────────────────────────────
  const handleStatChange = (key, val) => {
    setStats(prev => prev.map(s => s.key === key ? { ...s, value: val } : s));
  };

  // ── PRODUCT CRUD ──────────────────────────────────
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

  const handleProdEdit = (prod) => {
    setProdForm({ name:prod.name, category:prod.category, price:prod.price, stock:prod.stock, status:prod.status });
    setEditingId(prod.id);
    setShowProdForm(true);
  };

  const handleProdDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const cancelProdForm = () => {
    setProdForm(EMPTY_PRODUCT);
    setEditingId(null);
    setShowProdForm(false);
  };

  // ── CHAT ──────────────────────────────────────────
  const sendMessage = () => {
    if (!msgInput.trim() || !selectedChat) return;
    const newMsg = { from:'admin', text: msgInput.trim(), time: new Date().toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'}) };
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg]
    }));
    setMsgInput('');
  };

  const handleMsgKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const selectChat = (id) => {
    setSelectedChat(id);
    if (!messages[id]) setMessages(prev => ({
      ...prev,
      [id]: [{ from:'user', text: chatUsers.find(u=>u.id===id)?.lastMsg || '', time:'earlier' }]
    }));
  };

  // ── RENDER CONTENT BY TAB ─────────────────────────
  const renderContent = () => {
    switch (activeTab) {

      // ─── DASHBOARD ───
      case 'Dashboard':
        return (
          <div className="ap-tab-content">
            <div className="ap-welcome">
              <div>
                <h1>Good day, {user.email || 'Admin'} 👋</h1>
                <p>{new Date().toLocaleDateString('en-PH',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
              </div>
            </div>
            <p className="ap-hint">Click any stat value below to update it.</p>
            <div className="ap-stats-grid">
              {stats.map(s => (
                <div className="ap-stat-card" key={s.key}>
                  <div className="ap-stat-icon">{s.icon}</div>
                  <div className="ap-stat-label">{s.label}</div>
                  <input
                    className="ap-stat-input"
                    type="text"
                    value={s.value}
                    onChange={e => handleStatChange(s.key, e.target.value)}
                    placeholder="—"
                  />
                </div>
              ))}
            </div>
            <div className="ap-panel ap-activity-panel">
              <div className="ap-panel-header"><h2>Recent Activity</h2></div>
              <p className="ap-empty-state">Activity will appear here once connected to the backend.</p>
            </div>
          </div>
        );

      // ─── USERS ───
      case 'Users':
        return (
          <div className="ap-tab-content">
            <div className="ap-page-header">
              <h2>User Management</h2>
              <button className="ap-btn-primary">+ Add User</button>
            </div>
            <div className="ap-panel">
              <p className="ap-empty-state">User data will load here once connected to the backend API.</p>
            </div>
          </div>
        );

      // ─── EVENTS ───
      case 'Events':
        return (
          <div className="ap-tab-content">
            <div className="ap-page-header">
              <h2>Events</h2>
              <button className="ap-btn-primary">+ New Event</button>
            </div>
            <div className="ap-panel">
              <p className="ap-empty-state">Events will load here once connected to the backend API.</p>
            </div>
          </div>
        );

      // ─── PRODUCT LIST (CRUD) ───
      case 'Product List':
        return (
          <div className="ap-tab-content">
            <div className="ap-page-header">
              <h2>Product List</h2>
              {!showProdForm && (
                <button className="ap-btn-primary" onClick={() => setShowProdForm(true)}>+ Add Product</button>
              )}
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
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Out of Stock</option>
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
                    <thead>
                      <tr>
                        <th>#</th><th>Name</th><th>Category</th>
                        <th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p, i) => (
                        <tr key={p.id}>
                          <td>{i+1}</td>
                          <td className="ap-td-name">{p.name}</td>
                          <td>{p.category || '—'}</td>
                          <td>{p.price ? `₱${parseFloat(p.price).toLocaleString()}` : '—'}</td>
                          <td>{p.stock || '—'}</td>
                          <td><span className={`ap-badge ap-badge-${p.status.toLowerCase().replace(/ /g,'-')}`}>{p.status}</span></td>
                          <td>
                            <div className="ap-row-actions">
                              <button className="ap-icon-btn edit" onClick={() => handleProdEdit(p)} title="Edit">✏️</button>
                              <button className="ap-icon-btn delete" onClick={() => handleProdDelete(p.id)} title="Delete">🗑️</button>
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

      // ─── REPORTS ───
      case 'Reports':
        return (
          <div className="ap-tab-content">
            <div className="ap-page-header"><h2>Reports</h2></div>
            <div className="ap-panel">
              <p className="ap-empty-state">Reports will load here once connected to the backend API.</p>
            </div>
          </div>
        );

      // ─── MESSAGES (CHAT) ───
      case 'Messages':
        return (
          <div className="ap-tab-content ap-chat-layout">
            {/* User list */}
            <div className="ap-chat-sidebar">
              <div className="ap-chat-sidebar-header"><h3>Messages</h3></div>
              {chatUsers.map(u => (
                <button
                  key={u.id}
                  className={`ap-chat-user ${selectedChat === u.id ? 'active' : ''}`}
                  onClick={() => selectChat(u.id)}
                >
                  <div className="ap-chat-avatar">{u.avatar}</div>
                  <div className="ap-chat-user-info">
                    <span className="ap-chat-user-name">{u.name}</span>
                    <span className="ap-chat-user-last">{u.lastMsg}</span>
                  </div>
                  <div className="ap-chat-meta">
                    <span className="ap-chat-time">{u.time}</span>
                    {u.unread > 0 && <span className="ap-chat-unread">{u.unread}</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* Conversation */}
            <div className="ap-chat-main">
              {!selectedChat ? (
                <div className="ap-chat-empty">
                  <div className="ap-chat-empty-icon">💬</div>
                  <p>Select a conversation to start messaging</p>
                </div>
              ) : (
                <>
                  <div className="ap-chat-header">
                    <div className="ap-chat-avatar">{chatUsers.find(u=>u.id===selectedChat)?.avatar}</div>
                    <div>
                      <div className="ap-chat-header-name">{chatUsers.find(u=>u.id===selectedChat)?.name}</div>
                      <div className="ap-chat-header-status">● Online</div>
                    </div>
                  </div>
                  <div className="ap-chat-messages">
                    {(messages[selectedChat] || []).map((m, i) => (
                      <div key={i} className={`ap-msg ${m.from === 'admin' ? 'ap-msg-out' : 'ap-msg-in'}`}>
                        <div className="ap-msg-bubble">{m.text}</div>
                        <div className="ap-msg-time">{m.time}</div>
                      </div>
                    ))}
                    <div ref={msgEndRef} />
                  </div>
                  <div className="ap-chat-input-row">
                    <input
                      className="ap-chat-input"
                      type="text"
                      placeholder="Type a message…"
                      value={msgInput}
                      onChange={e => setMsgInput(e.target.value)}
                      onKeyDown={handleMsgKey}
                    />
                    <button className="ap-chat-send" onClick={sendMessage} disabled={!msgInput.trim()}>Send ➤</button>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      // ─── SETTINGS ───
      case 'Settings':
        return (
          <div className="ap-tab-content">
            <div className="ap-page-header"><h2>Settings</h2></div>
            <div className="ap-panel">
              <p className="ap-empty-state">Settings will be configurable once connected to the backend API.</p>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="ap-root">
      {/* SIDEBAR */}
      <aside className={`ap-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="ap-sidebar-header">
          <div className="ap-logo"><span>🌿</span><span className="ap-logo-text">AgriFair</span></div>
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
          <button className="ap-logout-btn" onClick={() => setShowLogout(true)}>🚪 Logout</button>
        </div>
      </aside>

      {sidebarOpen && <div className="ap-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* MAIN */}
      <main className="ap-main">
        <header className="ap-topbar">
          <button className="ap-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="ap-topbar-title">{activeTab}</div>
        </header>
        <div className="ap-body">{renderContent()}</div>
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
