import React, { useState } from 'react';

/**
 * WEB-09 Report Generation
 * Generate and download sales reports (PDF), inventory reports, financial
 * summaries, and export transaction data to CSV.
 */

const REPORT_TYPES = [
  {
    key: 'sales',     icon: '💰', title: 'Sales Report',
    desc: 'Detailed sales performance with revenue breakdown by product and period.',
    formats: ['PDF', 'CSV'],
  },
  {
    key: 'inventory', icon: '📦', title: 'Inventory Report',
    desc: 'Current stock levels, low-stock items, and inventory movement history.',
    formats: ['PDF', 'CSV'],
  },
  {
    key: 'financial', icon: '📊', title: 'Financial Summary',
    desc: 'Revenue, expenses, taxes, and net profit summary for the selected period.',
    formats: ['PDF'],
  },
  {
    key: 'transactions', icon: '🧾', title: 'Transaction Data',
    desc: 'Raw transaction log with order IDs, buyers, payment methods, and timestamps.',
    formats: ['CSV'],
  },
  {
    key: 'customers', icon: '👥', title: 'Customer Report',
    desc: 'Top buyers, repeat customers, and customer location distribution.',
    formats: ['PDF', 'CSV'],
  },
  {
    key: 'orders',    icon: '🛒', title: 'Order Fulfillment',
    desc: 'Order statuses, fulfillment times, and cancellation analysis.',
    formats: ['PDF', 'CSV'],
  },
];

const RECENT_REPORTS = [
  { name: 'Sales Report — April 2025',     type: 'PDF', size: '248 KB', date: '2025-04-26' },
  { name: 'Transaction Data — Q1 2025',    type: 'CSV', size: '1.2 MB', date: '2025-04-15' },
  { name: 'Inventory Report — Mar 2025',   type: 'PDF', size: '186 KB', date: '2025-04-01' },
  { name: 'Financial Summary — Mar 2025',  type: 'PDF', size: '320 KB', date: '2025-04-01' },
];

export default function ReportsTab() {
  const today = new Date().toISOString().slice(0, 10);
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const [from, setFrom] = useState(lastMonth.toISOString().slice(0, 10));
  const [to, setTo]     = useState(today);
  const [generating, setGenerating] = useState(null); // key of report being generated
  const [toast, setToast] = useState('');

  const handleGenerate = (report, format) => {
    setGenerating(`${report.key}-${format}`);

    // Simulate generation; in production this would call the backend
    // and then trigger a download via blob URL or signed URL.
    setTimeout(() => {
      setGenerating(null);
      setToast(`${report.title} (${format}) ready — download started.`);

      // Trigger a placeholder download so the UI feels real.
      try {
        const filename = `${report.key}_${from}_to_${to}.${format.toLowerCase()}`;
        const content = format === 'CSV'
          ? `Report,${report.title}\nFrom,${from}\nTo,${to}\n\n(Sample data — connect backend to populate)\n`
          : `%PDF-1.4\n% AgriFair placeholder PDF for ${report.title}\n%%EOF`;
        const blob = new Blob([content], { type: format === 'CSV' ? 'text/csv' : 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        // Ignore — the toast still tells the user it's "ready".
      }

      setTimeout(() => setToast(''), 3500);
    }, 900);
  };

  return (
    <div className="ap-tab-content">
      <div className="ap-page-header">
        <div>
          <h2>Reports</h2>
          <span className="ap-page-sub">Generate and download reports for your records</span>
        </div>
      </div>

      {toast && <div className="ap-toast">{toast}</div>}

      {/* Date range picker */}
      <div className="ap-panel ap-range-panel">
        <h3>Report Period</h3>
        <div className="ap-range-fields">
          <div className="ap-form-field">
            <label>From</label>
            <input type="date" value={from} max={to} onChange={e => setFrom(e.target.value)} />
          </div>
          <div className="ap-form-field">
            <label>To</label>
            <input type="date" value={to} min={from} max={today} onChange={e => setTo(e.target.value)} />
          </div>
          <div className="ap-range-presets">
            <button className="ap-chip" type="button" onClick={() => {
              const d = new Date(); d.setDate(d.getDate() - 7);
              setFrom(d.toISOString().slice(0, 10)); setTo(today);
            }}>Last 7 days</button>
            <button className="ap-chip" type="button" onClick={() => {
              const d = new Date(); d.setDate(d.getDate() - 30);
              setFrom(d.toISOString().slice(0, 10)); setTo(today);
            }}>Last 30 days</button>
            <button className="ap-chip" type="button" onClick={() => {
              const d = new Date(); d.setMonth(d.getMonth() - 3);
              setFrom(d.toISOString().slice(0, 10)); setTo(today);
            }}>Last 90 days</button>
          </div>
        </div>
      </div>

      {/* Report cards */}
      <div className="ap-report-grid">
        {REPORT_TYPES.map(r => (
          <div className="ap-report-card" key={r.key}>
            <div className="ap-report-icon">{r.icon}</div>
            <h4 className="ap-report-title">{r.title}</h4>
            <p className="ap-report-desc">{r.desc}</p>
            <div className="ap-report-actions">
              {r.formats.map(fmt => {
                const busy = generating === `${r.key}-${fmt}`;
                return (
                  <button
                    key={fmt}
                    className={`ap-btn-${fmt === 'PDF' ? 'primary' : 'ghost'}`}
                    onClick={() => handleGenerate(r, fmt)}
                    disabled={busy}
                    type="button"
                  >
                    {busy ? 'Generating…' : `Download ${fmt}`}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Recent reports */}
      <section className="ap-panel">
        <div className="ap-panel-header">
          <h3>Recent Reports</h3>
          <span className="ap-panel-sub">Recently generated reports for this account</span>
        </div>
        <div className="ap-table-wrap">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Format</th>
                <th>Size</th>
                <th>Generated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_REPORTS.map((r, i) => (
                <tr key={i}>
                  <td className="ap-td-name">{r.name}</td>
                  <td><span className={`ap-format-pill ap-format-${r.type.toLowerCase()}`}>{r.type}</span></td>
                  <td>{r.size}</td>
                  <td>{r.date}</td>
                  <td>
                    <div className="ap-row-actions">
                      <button className="ap-icon-btn" title="Download">⬇️</button>
                      <button className="ap-icon-btn delete" title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
