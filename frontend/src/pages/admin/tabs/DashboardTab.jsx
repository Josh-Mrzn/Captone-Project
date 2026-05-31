import React, { useMemo } from 'react';

/**
 * Admin Dashboard
 * KPI cards (Total Users, Sellers, Inventory, Sales) + Bar Graph
 */

const KPI_CARDS = [
  { key: 'users',     icon: '👥', label: 'Total Users',    value: '1,284',   delta: '+34 this month',    trend: 'up',      color: '#43a047' },
  { key: 'sellers',   icon: '🏪', label: 'Sellers',         value: '148',     delta: '+8 new this week',  trend: 'up',      color: '#3b82f6' },
  { key: 'inventory', icon: '📦', label: 'Inventory (kg)',  value: '24,360',  delta: '6 low-stock alerts',trend: 'warn',    color: '#f9a825' },
  { key: 'sales',     icon: '💰', label: 'Total Sales',     value: '₱248,560',delta: '+12.4% vs last mo.',trend: 'up',      color: '#a855f7' },
];

// Monthly sales bar chart data
const BAR_DATA = [
  { label: 'Jan', value: 112000 },
  { label: 'Feb', value: 134000 },
  { label: 'Mar', value: 98000  },
  { label: 'Apr', value: 162000 },
  { label: 'May', value: 148000 },
  { label: 'Jun', value: 175000 },
  { label: 'Jul', value: 131000 },
  { label: 'Aug', value: 158000 },
  { label: 'Sep', value: 183000 },
  { label: 'Oct', value: 196000 },
  { label: 'Nov', value: 210000 },
  { label: 'Dec', value: 248560 },
];

const fmtMoney = (n) => `₱${(n / 1000).toFixed(0)}k`;

function SalesBarChart({ data }) {
  const max = Math.max(...data.map(d => d.value));
  const w = 640, h = 200, padX = 36, padY = 16, barGap = 6;
  const barW = (w - padX * 2) / data.length - barGap;

  return (
    <svg viewBox={`0 0 ${w} ${h + 28}`} className="ap-chart-svg" style={{ width: '100%', height: 'auto' }}>
      {/* Y-axis grid lines */}
      {[0.25, 0.5, 0.75, 1].map(t => {
        const y = padY + (h - padY * 2) * (1 - t);
        return (
          <g key={t}>
            <line x1={padX} x2={w - padX} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
            <text x={padX - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{fmtMoney(max * t)}</text>
          </g>
        );
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const barH = ((d.value / max) * (h - padY * 2));
        const x = padX + i * (barW + barGap);
        const y = padY + (h - padY * 2) - barH;
        const isLast = i === data.length - 1;
        return (
          <g key={d.label}>
            <rect
              x={x} y={y} width={barW} height={barH}
              rx="3"
              fill={isLast ? '#43a047' : '#86efac'}
              opacity={isLast ? 1 : 0.75}
            />
            <text x={x + barW / 2} y={h + padY + 12} textAnchor="middle" fontSize="9" fill="#64748b">{d.label}</text>
          </g>
        );
      })}
      {/* Axis line */}
      <line x1={padX} x2={w - padX} y1={h - padY + padY} y2={h - padY + padY} stroke="#cbd5e1" />
    </svg>
  );
}

export default function DashboardTab({ user, setActiveTab }) {
  const today = useMemo(
    () => new Date().toLocaleDateString('en-PH', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }),
    []
  );

  return (
    <div className="ap-tab-content">
      {/* Welcome strip */}
      <div className="ap-welcome">
        <div>
          <h1>Good day, {user?.email || 'Admin'} 👋</h1>
          <p>{today}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="ap-stats-grid">
        {KPI_CARDS.map((s) => (
          <div className="ap-stat-card ap-stat-rich" key={s.key} style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="ap-stat-card-top">
              <div className="ap-stat-icon" style={{ fontSize: '1.5rem' }}>{s.icon}</div>
              <span className={`ap-stat-trend ap-stat-trend-${s.trend}`}>
                {s.trend === 'up' ? '↑' : s.trend === 'warn' ? '⚠' : '•'}
              </span>
            </div>
            <div className="ap-stat-label">{s.label}</div>
            <div className="ap-stat-value-rich" style={{ color: s.color }}>{s.value}</div>
            <div className="ap-stat-delta">{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Monthly Sales Bar Chart */}
      <section className="ap-panel">
        <div className="ap-panel-header">
          <h3>Monthly Sales Overview</h3>
          <span className="ap-panel-sub">Revenue trend for the current year</span>
        </div>
        <div style={{ padding: '0.5rem 0.5rem 0' }}>
          <SalesBarChart data={BAR_DATA} />
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', padding: '0.75rem 1rem', borderTop: '1px solid #f1f5f9', fontSize: '0.82rem', color: '#64748b' }}>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: '#43a047', marginRight: 4 }} />Current Month</span>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: '#86efac', marginRight: 4 }} />Previous Months</span>
        </div>
      </section>
    </div>
  );
}
