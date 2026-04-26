import React, { useState } from 'react';

// Stats visible to Admin: Products Listed only (numerical fields relevant to seller/admin scope)
// Removed: Total Users (Super Admin only), Active Events (removed), Pending Reports (removed)
const INIT_STATS = [
  { key: 'products',    icon: '📦', label: 'Products Listed',   value: '' },
  { key: 'sales',       icon: '💰', label: 'Total Sales (₱)',    value: '' },
  { key: 'orders',      icon: '🛒', label: 'Orders Today',       value: '' },
  { key: 'revenue',     icon: '📈', label: 'Monthly Revenue (₱)', value: '' },
];

export default function DashboardTab({ user }) {
  const [stats, setStats] = useState(INIT_STATS);

  const handleStatChange = (key, val) => {
    // Numerical only — reject non-numeric characters
    if (val !== '' && !/^\d*\.?\d*$/.test(val)) return;
    setStats(prev => prev.map(s => s.key === key ? { ...s, value: val } : s));
  };

  return (
    <div className="ap-tab-content">
      <div className="ap-welcome">
        <div>
          <h1>Good day, {user.email || 'Admin'} 👋</h1>
          <p>
            {new Date().toLocaleDateString('en-PH', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <p className="ap-hint">Click any stat value below to update it (numbers only).</p>

      <div className="ap-stats-grid">
        {stats.map(s => (
          <div className="ap-stat-card" key={s.key}>
            <div className="ap-stat-icon">{s.icon}</div>
            <div className="ap-stat-label">{s.label}</div>
            <input
              className="ap-stat-input"
              type="number"
              min="0"
              value={s.value}
              onChange={e => handleStatChange(s.key, e.target.value)}
              placeholder="0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
