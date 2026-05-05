import React, { useMemo } from 'react';

/**
 * WEB-02 Farmer Dashboard
 * Displays key metrics (total revenue, sales volume, pending orders, active products)
 * with quick access to common tasks and recent activity summary.
 */

const STATS = [
  { key: 'revenue',  icon: '💰', label: 'Total Revenue',  value: '₱248,560', delta: '+12.4% vs last month',  trend: 'up' },
  { key: 'sales',    icon: '📊', label: 'Sales Volume',   value: '1,284 kg',   delta: '+8.1% this week',       trend: 'up' },
  { key: 'pending',  icon: '🛒', label: 'Pending Orders', value: '14',          delta: '3 awaiting confirmation', trend: 'neutral' },
  { key: 'products', icon: '📦', label: 'Active Products', value: '23',         delta: '2 low on stock',         trend: 'warn' },
];

const QUICK_ACTIONS = [
  { icon: '➕', label: 'Add Product',     desc: 'List a new rice variety', target: 'Product List' },
  { icon: '📦', label: 'View Orders',     desc: 'Review pending orders',  target: 'Orders' },
  { icon: '💬', label: 'Reply to Buyers', desc: '4 unread messages',     target: 'Messages' },
  { icon: '📈', label: 'View Analytics',  desc: 'Sales trends & insights', target: 'Analytics' },
];

const RECENT_ACTIVITY = [
  { type: 'order',   icon: '🛒', msg: 'New order #1042 — 25kg Jasmine Rice from Maria Santos', time: '5m ago' },
  { type: 'payment', icon: '💳', msg: 'Payment received for Order #1041 (₱2,800 via GCash)',  time: '24m ago' },
  { type: 'message', icon: '💬', msg: 'Jose Reyes sent you a message about Order #1039',     time: '1h ago' },
  { type: 'stock',   icon: '⚠️', msg: 'Brown Rice (Premium) is running low — only 12kg left', time: '3h ago' },
  { type: 'order',   icon: '🛒', msg: 'Order #1040 marked as Delivered',                     time: '6h ago' },
];

const TYPE_TONE = {
  order:   'tone-green',
  payment: 'tone-gold',
  message: 'tone-blue',
  stock:   'tone-red',
};

export default function DashboardTab({ user, setActiveTab }) {
  const today = useMemo(
    () => new Date().toLocaleDateString('en-PH', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }),
    []
  );

  const goTo = (tab) => () => setActiveTab && setActiveTab(tab);

  return (
    <div className="ap-tab-content">
      {/* Welcome strip */}
      <div className="ap-welcome">
        <div>
          <h1>Good day, {user?.email || 'Admin'} 👋</h1>
          <p>{today}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="ap-stats-grid">
        {STATS.map((s) => (
          <div className="ap-stat-card ap-stat-rich" key={s.key}>
            <div className="ap-stat-card-top">
              <div className="ap-stat-icon">{s.icon}</div>
              <span className={`ap-stat-trend ap-stat-trend-${s.trend}`}>
                {s.trend === 'up' ? '↑' : s.trend === 'warn' ? '⚠' : '•'}
              </span>
            </div>
            <div className="ap-stat-label">{s.label}</div>
            <div className="ap-stat-value-rich">{s.value}</div>
            <div className="ap-stat-delta">{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Two-column: Quick actions + Recent activity */}
      <div className="ap-dashboard-grid">
        <section className="ap-panel">
          <div className="ap-panel-header">
            <h3>Quick Actions</h3>
            <span className="ap-panel-sub">Jump straight to common tasks</span>
          </div>
          <div className="ap-quick-grid">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                className="ap-quick-card"
                onClick={goTo(a.target)}
                type="button"
              >
                <div className="ap-quick-icon">{a.icon}</div>
                <div className="ap-quick-text">
                  <span className="ap-quick-label">{a.label}</span>
                  <span className="ap-quick-desc">{a.desc}</span>
                </div>
                <span className="ap-quick-arrow">→</span>
              </button>
            ))}
          </div>
        </section>

        <section className="ap-panel">
          <div className="ap-panel-header">
            <h3>Recent Activity</h3>
            <span className="ap-panel-sub">Last 24 hours</span>
          </div>
          <ul className="ap-activity-list">
            {RECENT_ACTIVITY.map((a, i) => (
              <li className="ap-activity-item" key={i}>
                <span className={`ap-activity-icon ${TYPE_TONE[a.type]}`}>{a.icon}</span>
                <div className="ap-activity-body">
                  <p className="ap-activity-msg">{a.msg}</p>
                  <span className="ap-activity-time">{a.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
