import React, { useMemo, useState } from 'react';

/**
 * WEB-07 Order Management
 * View, accept/reject, and update order status (Pending, Confirmed, Processing,
 * Shipped, Delivered, Completed). Display comprehensive order details with
 * tracking timeline. Enable order cancellation for pending orders with refund.
 *
 * Also surfaces WEB-06 payment information (GCash, PayMaya, COD, Bank Transfer)
 * via the order detail panel.
 */

const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'];
const NEXT_STATUS = {
  Pending: 'Confirmed',
  Confirmed: 'Processing',
  Processing: 'Shipped',
  Shipped: 'Delivered',
  Delivered: 'Completed',
};

const STATUS_TONE = {
  Pending: 'tone-gold',
  Confirmed: 'tone-blue',
  Processing: 'tone-blue',
  Shipped: 'tone-blue',
  Delivered: 'tone-green',
  Completed: 'tone-green',
  Cancelled: 'tone-red',
};

const PAYMENT_BADGE = {
  GCash: { icon: '📱', cls: 'ap-pay-gcash', label: 'GCash' },
  PayMaya: { icon: '💳', cls: 'ap-pay-maya', label: 'PayMaya' },
  COD: { icon: '💵', cls: 'ap-pay-cod', label: 'Cash on Delivery' },
  'Bank Transfer': { icon: '🏦', cls: 'ap-pay-bank', label: 'Bank Transfer' },
};

const SAMPLE_ORDERS = [
  {
    id: 1042, buyer: 'Maria Santos', email: 'maria@example.com',
    address: '12 Sampaguita St., Quezon City',
    items: [{ name: 'Premium Jasmine Rice', qty: 25, unit: 'kg', price: 65 }],
    total: 25 * 65, status: 'Pending', payment: 'GCash', paid: true,
    placedAt: '2025-04-26T10:24:00',
  },
  {
    id: 1041, buyer: 'Jose Reyes', email: 'jose@example.com',
    address: '8 Acacia Ave., Pasig City',
    items: [
      { name: 'Sinandomeng Special', qty: 50, unit: 'kg', price: 55 },
      { name: 'Brown Rice', qty: 10, unit: 'kg', price: 80 },
    ],
    total: 50 * 55 + 10 * 80, status: 'Processing', payment: 'PayMaya', paid: true,
    placedAt: '2025-04-26T08:11:00',
  },
  {
    id: 1040, buyer: 'Ana Dela Cruz', email: 'ana@example.com',
    address: '34 Ilang-Ilang Rd., Makati City',
    items: [{ name: 'Premium Jasmine Rice', qty: 5, unit: 'kg', price: 65 }],
    total: 5 * 65, status: 'Shipped', payment: 'COD', paid: false,
    placedAt: '2025-04-25T16:02:00',
  },
  {
    id: 1039, buyer: 'Carlos Gomez', email: 'carlos@example.com',
    address: '101 Mahogany Drive, Manila',
    items: [{ name: 'Heirloom Black Rice', qty: 3, unit: 'kg', price: 140 }],
    total: 3 * 140, status: 'Delivered', payment: 'Bank Transfer', paid: true,
    placedAt: '2025-04-24T13:45:00',
  },
  {
    id: 1038, buyer: 'Liza Bautista', email: 'liza@example.com',
    address: '7 Narra St., Caloocan City',
    items: [{ name: 'Sinandomeng Special', qty: 20, unit: 'kg', price: 55 }],
    total: 20 * 55, status: 'Completed', payment: 'GCash', paid: true,
    placedAt: '2025-04-23T09:18:00',
  },
];

export default function OrdersTab() {
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const counts = useMemo(() => {
    const map = { All: orders.length };
    STATUSES.forEach(s => { map[s] = orders.filter(o => o.status === s).length; });
    return map;
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (filter !== 'All' && o.status !== filter) return false;
      if (search && !`${o.buyer} ${o.id}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [orders, filter, search]);

  const selected = orders.find(o => o.id === selectedId);

  const advanceStatus = (id) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const next = NEXT_STATUS[o.status];
      return next ? { ...o, status: next } : o;
    }));
  };

  const rejectOrCancel = (id) => {
    if (!window.confirm('Cancel this order? Refund will be processed where applicable.')) return;
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o));
  };

  const fmtMoney = (n) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtDate = (iso) => new Date(iso).toLocaleString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  // Build the tracking timeline from a status
  const timelineSteps = (status) => {
    if (status === 'Cancelled') return [{ label: 'Cancelled', done: true, current: true }];
    const order = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Completed'];
    const idx = order.indexOf(status);
    return order.map((label, i) => ({
      label,
      done: i <= idx,
      current: i === idx,
    }));
  };

  return (
    <div className="ap-tab-content">
      <div className="ap-page-header">
        <h2>Orders</h2>
        <span className="ap-page-sub">Manage incoming orders, payments, and fulfillment</span>
      </div>

      {/* Status filter chips */}
      <div className="ap-chip-row">
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            className={`ap-chip ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
            type="button"
          >
            {s} <span className="ap-chip-count">{counts[s] || 0}</span>
          </button>
        ))}
      </div>

      <div className="ap-orders-layout">
        {/* Order list */}
        <div className="ap-panel ap-orders-list">
          <div className="ap-orders-search">
            <input
              type="text"
              placeholder="🔍 Search by order # or buyer…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="ap-filter-input"
            />
          </div>
          {filtered.length === 0 ? (
            <p className="ap-empty-state">No orders match the filter.</p>
          ) : (
            <ul className="ap-order-rows">
              {filtered.map(o => (
                <li
                  key={o.id}
                  className={`ap-order-row ${selectedId === o.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(o.id)}
                >
                  <div className="ap-order-row-top">
                    <span className="ap-order-id">#{o.id}</span>
                    <span className={`ap-status-pill ${STATUS_TONE[o.status]}`}>{o.status}</span>
                  </div>
                  <div className="ap-order-row-buyer">{o.buyer}</div>
                  <div className="ap-order-row-meta">
                    <span>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</span>
                    <span className="ap-order-total">{fmtMoney(o.total)}</span>
                  </div>
                  <div className="ap-order-row-time">{fmtDate(o.placedAt)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Order detail */}
        <div className="ap-panel ap-order-detail">
          {!selected ? (
            <div className="ap-order-empty">
              <div className="ap-order-empty-icon">🛒</div>
              <p>Select an order to view details</p>
            </div>
          ) : (
            <>
              <div className="ap-order-detail-header">
                <div>
                  <h3>Order #{selected.id}</h3>
                  <span className="ap-order-detail-time">Placed {fmtDate(selected.placedAt)}</span>
                </div>
                <span className={`ap-status-pill ${STATUS_TONE[selected.status]}`}>{selected.status}</span>
              </div>

              {/* Tracking timeline */}
              <div className="ap-timeline">
                {timelineSteps(selected.status).map((step, i, arr) => (
                  <div key={step.label} className={`ap-timeline-step ${step.done ? 'done' : ''} ${step.current ? 'current' : ''}`}>
                    <div className="ap-timeline-dot" />
                    {i < arr.length - 1 && <div className="ap-timeline-line" />}
                    <span className="ap-timeline-label">{step.label}</span>
                  </div>
                ))}
              </div>

              {/* Buyer */}
              <div className="ap-order-section">
                <h4>Buyer</h4>
                <div className="ap-kv"><span>Name</span><strong>{selected.buyer}</strong></div>
                <div className="ap-kv"><span>Email</span><strong>{selected.email}</strong></div>
                <div className="ap-kv"><span>Delivery Address</span><strong>{selected.address}</strong></div>
              </div>

              {/* Items */}
              <div className="ap-order-section">
                <h4>Items</h4>
                <table className="ap-mini-table">
                  <thead>
                    <tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
                  </thead>
                  <tbody>
                    {selected.items.map((it, i) => (
                      <tr key={i}>
                        <td>{it.name}</td>
                        <td>{it.qty} {it.unit}</td>
                        <td>{fmtMoney(it.price)}</td>
                        <td>{fmtMoney(it.qty * it.price)}</td>
                      </tr>
                    ))}
                    <tr className="ap-mini-total">
                      <td colSpan="3">Total</td>
                      <td>{fmtMoney(selected.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment */}
              <div className="ap-order-section">
                <h4>Payment</h4>
                <div className="ap-payment-box">
                  <span className={`ap-pay-badge ${PAYMENT_BADGE[selected.payment].cls}`}>
                    {PAYMENT_BADGE[selected.payment].icon} {PAYMENT_BADGE[selected.payment].label}
                  </span>
                  <span className={`ap-pay-status ${selected.paid ? 'paid' : 'pending'}`}>
                    {selected.paid ? '✓ Paid' : '⌛ Pending'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="ap-order-actions">
                {selected.status !== 'Completed' && selected.status !== 'Cancelled' && (
                  <>
                    <button className="ap-btn-primary" onClick={() => advanceStatus(selected.id)}>
                      Mark as {NEXT_STATUS[selected.status]} →
                    </button>
                    {(selected.status === 'Pending' || selected.status === 'Confirmed') && (
                      <button className="ap-btn-danger" onClick={() => rejectOrCancel(selected.id)}>
                        Cancel Order
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
