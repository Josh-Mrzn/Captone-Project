import React, { useMemo, useState } from 'react';

/**
 * WEB-08 Descriptive Analytics Dashboard
 * Sales performance, rice variety analysis, pricing analytics with market
 * comparisons, customer insights, inventory metrics, seasonal patterns,
 * and order fulfillment statistics. Supports custom date range filtering.
 *
 * All charts are SVG mini-charts so we have no external dependencies.
 */

// ── Mock data sets ──────────────────────────────────────────
const REVENUE_DATA = {
  '7d': [
    { label: 'Mon', value: 18200 }, { label: 'Tue', value: 22400 },
    { label: 'Wed', value: 19800 }, { label: 'Thu', value: 26100 },
    { label: 'Fri', value: 31200 }, { label: 'Sat', value: 38400 },
    { label: 'Sun', value: 27500 },
  ],
  '30d': [
    { label: 'W1', value: 142000 }, { label: 'W2', value: 168000 },
    { label: 'W3', value: 154000 }, { label: 'W4', value: 198000 },
  ],
  '90d': [
    { label: 'Feb', value: 480000 }, { label: 'Mar', value: 562000 },
    { label: 'Apr', value: 612000 },
  ],
};

const VARIETY_DATA = [
  { label: 'Jasmine',    value: 38, color: '#43a047' },
  { label: 'Sinandomeng',value: 26, color: '#f9a825' },
  { label: 'Brown Rice', value: 14, color: '#7dbf7d' },
  { label: 'Dinorado',   value: 10, color: '#a78bfa' },
  { label: 'Black Rice', value: 7,  color: '#1c3a1c' },
  { label: 'Other',      value: 5,  color: '#cbd5e1' },
];

const TOP_BUYERS = [
  { name: 'Maria Santos',  orders: 14, spend: 38420, location: 'Quezon City' },
  { name: 'Jose Reyes',    orders: 11, spend: 28640, location: 'Pasig' },
  { name: 'Ana Dela Cruz', orders: 9,  spend: 22180, location: 'Makati' },
  { name: 'Carlos Gomez',  orders: 7,  spend: 18900, location: 'Manila' },
  { name: 'Liza Bautista', orders: 6,  spend: 15240, location: 'Caloocan' },
];

const FULFILLMENT = [
  { label: 'Completed', value: 68, color: '#43a047' },
  { label: 'In transit', value: 18, color: '#f9a825' },
  { label: 'Pending',   value: 11, color: '#3b82f6' },
  { label: 'Cancelled', value: 3,  color: '#e53935' },
];

const SEASONAL = [
  { m: 'Jan', v: 32 }, { m: 'Feb', v: 38 }, { m: 'Mar', v: 45 },
  { m: 'Apr', v: 52 }, { m: 'May', v: 48 }, { m: 'Jun', v: 41 },
  { m: 'Jul', v: 36 }, { m: 'Aug', v: 39 }, { m: 'Sep', v: 44 },
  { m: 'Oct', v: 58 }, { m: 'Nov', v: 72 }, { m: 'Dec', v: 84 },
];

const PRICE_VS_MARKET = [
  { variety: 'Jasmine',     yours: 65, market: 62 },
  { variety: 'Sinandomeng', yours: 55, market: 58 },
  { variety: 'Brown Rice',  yours: 80, market: 78 },
  { variety: 'Black Rice',  yours: 140, market: 135 },
];

const fmtMoney = (n) => `₱${n.toLocaleString('en-PH')}`;

// ── Mini chart components (pure SVG) ────────────────────────

function LineChart({ data, height = 160, color = '#43a047' }) {
  const padX = 32, padY = 18;
  const width = 480;
  const max = Math.max(...data.map(d => d.value)) * 1.1;
  const stepX = (width - padX * 2) / (data.length - 1);

  const points = data.map((d, i) => [
    padX + i * stepX,
    padY + (height - padY * 2) * (1 - d.value / max),
  ]);

  const linePath = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1][0]} ${height - padY} L ${points[0][0]} ${height - padY} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="ap-chart-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="line-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid */}
      {[0.25, 0.5, 0.75].map(t => (
        <line key={t}
          x1={padX} x2={width - padX}
          y1={padY + (height - padY * 2) * t} y2={padY + (height - padY * 2) * t}
          stroke="#e2e8f0" strokeDasharray="3 3" />
      ))}
      <path d={areaPath} fill="url(#line-grad)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />
      ))}
      {data.map((d, i) => (
        <text key={i}
          x={padX + i * stepX} y={height - 4}
          textAnchor="middle"
          fontSize="11" fill="#8a9bb0" fontFamily="DM Sans, sans-serif"
        >{d.label}</text>
      ))}
    </svg>
  );
}

function BarChart({ data, height = 200, color = '#43a047' }) {
  const padX = 28, padY = 18;
  const width = 480;
  const max = Math.max(...data.map(d => d.v)) * 1.1;
  const innerW = width - padX * 2;
  const barW = innerW / data.length * 0.6;
  const gap = innerW / data.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="ap-chart-svg" preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map(t => (
        <line key={t}
          x1={padX} x2={width - padX}
          y1={padY + (height - padY * 2) * t} y2={padY + (height - padY * 2) * t}
          stroke="#e2e8f0" strokeDasharray="3 3" />
      ))}
      {data.map((d, i) => {
        const h = (height - padY * 2) * (d.v / max);
        const x = padX + i * gap + (gap - barW) / 2;
        const y = height - padY - h;
        return (
          <g key={d.m}>
            <rect x={x} y={y} width={barW} height={h} rx="3" fill={color} opacity="0.85" />
            <text x={x + barW / 2} y={height - 4}
              textAnchor="middle" fontSize="10" fill="#8a9bb0" fontFamily="DM Sans, sans-serif">{d.m}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ data, size = 180 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 12;
  const inner = r - 28;

  let cum = 0;
  const arcs = data.map(d => {
    const start = (cum / total) * Math.PI * 2 - Math.PI / 2;
    cum += d.value;
    const end = (cum / total) * Math.PI * 2 - Math.PI / 2;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(start),  y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end),    y2 = cy + r * Math.sin(end);
    const x3 = cx + inner * Math.cos(end),   y3 = cy + inner * Math.sin(end);
    const x4 = cx + inner * Math.cos(start), y4 = cy + inner * Math.sin(start);
    return {
      d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${inner} ${inner} 0 ${large} 0 ${x4} ${y4} Z`,
      color: d.color,
      pct: Math.round((d.value / total) * 100),
      label: d.label,
    };
  });

  return (
    <div className="ap-donut-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color} />)}
        <circle cx={cx} cy={cy} r={inner - 2} fill="#fff" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontFamily="Fraunces, serif" fontWeight="600" fill="#1c3a1c">{total}%</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#8a9bb0" fontFamily="DM Sans, sans-serif" letterSpacing="1">SHARE</text>
      </svg>
      <ul className="ap-donut-legend">
        {arcs.map(a => (
          <li key={a.label}>
            <span className="ap-donut-swatch" style={{ background: a.color }} />
            <span className="ap-donut-label">{a.label}</span>
            <span className="ap-donut-pct">{a.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────
export default function AnalyticsTab() {
  const [range, setRange] = useState('7d');

  const revenue = REVENUE_DATA[range];
  const totalRevenue = useMemo(
    () => revenue.reduce((s, d) => s + d.value, 0),
    [revenue]
  );

  const avgFulfillmentDays = 2.4;
  const repeatRate = 42;

  return (
    <div className="ap-tab-content">
      <div className="ap-page-header">
        <div>
          <h2>Analytics</h2>
          <span className="ap-page-sub">Sales performance, customer insights, and trends</span>
        </div>
        <div className="ap-range-tabs">
          {['7d', '30d', '90d'].map(r => (
            <button
              key={r}
              className={`ap-range-tab ${range === r ? 'active' : ''}`}
              onClick={() => setRange(r)}
              type="button"
            >
              Last {r === '7d' ? '7 days' : r === '30d' ? '30 days' : '90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI summary */}
      <div className="ap-kpi-grid">
        <div className="ap-kpi-card">
          <span className="ap-kpi-label">Total Revenue</span>
          <span className="ap-kpi-value">{fmtMoney(totalRevenue)}</span>
          <span className="ap-kpi-delta up">↑ 12.4%</span>
        </div>
        <div className="ap-kpi-card">
          <span className="ap-kpi-label">Avg Fulfillment</span>
          <span className="ap-kpi-value">{avgFulfillmentDays} days</span>
          <span className="ap-kpi-delta up">↑ 0.6 faster</span>
        </div>
        <div className="ap-kpi-card">
          <span className="ap-kpi-label">Repeat Buyer Rate</span>
          <span className="ap-kpi-value">{repeatRate}%</span>
          <span className="ap-kpi-delta up">↑ 4.1%</span>
        </div>
        <div className="ap-kpi-card">
          <span className="ap-kpi-label">Inventory Turnover</span>
          <span className="ap-kpi-value">3.8×</span>
          <span className="ap-kpi-delta neutral">→ stable</span>
        </div>
      </div>

      {/* Revenue trend */}
      <section className="ap-panel">
        <div className="ap-panel-header">
          <h3>Revenue Trend</h3>
          <span className="ap-panel-sub">Daily revenue across the selected period</span>
        </div>
        <LineChart data={revenue} />
      </section>

      <div className="ap-analytics-grid">
        {/* Variety mix */}
        <section className="ap-panel">
          <div className="ap-panel-header">
            <h3>Sales by Rice Variety</h3>
            <span className="ap-panel-sub">Share of total sales volume</span>
          </div>
          <DonutChart data={VARIETY_DATA} />
        </section>

        {/* Fulfillment */}
        <section className="ap-panel">
          <div className="ap-panel-header">
            <h3>Order Fulfillment</h3>
            <span className="ap-panel-sub">Status distribution this period</span>
          </div>
          <DonutChart data={FULFILLMENT} />
        </section>

        {/* Top buyers */}
        <section className="ap-panel">
          <div className="ap-panel-header">
            <h3>Top Buyers</h3>
            <span className="ap-panel-sub">By total spend</span>
          </div>
          <ul className="ap-buyer-list">
            {TOP_BUYERS.map((b, i) => (
              <li key={b.name} className="ap-buyer-row">
                <span className="ap-buyer-rank">#{i + 1}</span>
                <div className="ap-buyer-info">
                  <span className="ap-buyer-name">{b.name}</span>
                  <span className="ap-buyer-meta">{b.location} · {b.orders} orders</span>
                </div>
                <span className="ap-buyer-spend">{fmtMoney(b.spend)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Price vs market */}
        <section className="ap-panel">
          <div className="ap-panel-header">
            <h3>Price vs Market</h3>
            <span className="ap-panel-sub">Your pricing compared to local market average</span>
          </div>
          <table className="ap-mini-table">
            <thead>
              <tr><th>Variety</th><th>Your price</th><th>Market</th><th>Diff</th></tr>
            </thead>
            <tbody>
              {PRICE_VS_MARKET.map(r => {
                const diff = r.yours - r.market;
                const pct = ((diff / r.market) * 100).toFixed(1);
                return (
                  <tr key={r.variety}>
                    <td>{r.variety}</td>
                    <td>{fmtMoney(r.yours)}</td>
                    <td>{fmtMoney(r.market)}</td>
                    <td className={diff > 0 ? 'tone-green' : diff < 0 ? 'tone-red' : ''}>
                      {diff > 0 ? '+' : ''}{pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>

      {/* Seasonal pattern */}
      <section className="ap-panel">
        <div className="ap-panel-header">
          <h3>Seasonal Patterns</h3>
          <span className="ap-panel-sub">Sales volume by month (last 12 months, in cavans)</span>
        </div>
        <BarChart data={SEASONAL} color="#2e7d32" />
      </section>
    </div>
  );
}
