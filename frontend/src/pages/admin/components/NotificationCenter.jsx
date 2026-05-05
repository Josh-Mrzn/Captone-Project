import React, { useEffect, useRef, useState } from 'react';

/**
 * WEB-13 Notification Center
 * Bell icon in the topbar with a dropdown of notifications.
 * Supports marking as read/unread, filtering by type, and counts.
 */

const SEED_NOTIFS = [
  { id: 1, type: 'order',   icon: '🛒', text: 'New order #1042 from Maria Santos',         time: '5m',  read: false },
  { id: 2, type: 'payment', icon: '💳', text: 'Payment received for Order #1041 (₱2,800)', time: '24m', read: false },
  { id: 3, type: 'message', icon: '💬', text: 'Jose Reyes sent you a message',              time: '1h',  read: false },
  { id: 4, type: 'stock',   icon: '⚠️', text: 'Brown Rice (Premium) is running low',        time: '3h',  read: true  },
  { id: 5, type: 'order',   icon: '🛒', text: 'Order #1040 marked as Delivered',           time: '6h',  read: true  },
  { id: 6, type: 'announcement', icon: '📣', text: 'New feature: descriptive analytics is live!', time: '1d', read: true },
];

const TYPE_TONE = {
  order: 'tone-green',
  payment: 'tone-gold',
  message: 'tone-blue',
  stock: 'tone-red',
  announcement: 'tone-purple',
};

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(SEED_NOTIFS);
  const [filter, setFilter] = useState('All');
  const wrapRef = useRef(null);

  const unread = notifs.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const visible = filter === 'All'
    ? notifs
    : filter === 'Unread'
      ? notifs.filter(n => !n.read)
      : notifs.filter(n => n.type === filter.toLowerCase());

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const toggleRead  = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  const dismiss     = (id) => setNotifs(prev => prev.filter(n => n.id !== id));

  return (
    <div className="ap-notif-wrap" ref={wrapRef}>
      <button
        className="ap-notif-btn"
        onClick={() => setOpen(o => !o)}
        type="button"
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && <span className="ap-notif-badge">{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div className="ap-notif-panel" role="dialog" aria-label="Notification center">
          <div className="ap-notif-panel-header">
            <h3>Notifications</h3>
            {unread > 0 && (
              <button className="ap-notif-mark-all" onClick={markAllRead} type="button">
                Mark all as read
              </button>
            )}
          </div>

          <div className="ap-notif-filter-row">
            {['All', 'Unread', 'Order', 'Payment', 'Message'].map(f => (
              <button
                key={f}
                className={`ap-notif-filter ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                type="button"
              >{f}</button>
            ))}
          </div>

          <ul className="ap-notif-list">
            {visible.length === 0 ? (
              <li className="ap-notif-empty">You're all caught up. ✨</li>
            ) : visible.map(n => (
              <li
                key={n.id}
                className={`ap-notif-item ${n.read ? '' : 'unread'}`}
                onClick={() => toggleRead(n.id)}
              >
                <span className={`ap-notif-icon ${TYPE_TONE[n.type] || ''}`}>{n.icon}</span>
                <div className="ap-notif-content">
                  <p className="ap-notif-text">{n.text}</p>
                  <span className="ap-notif-time">{n.time} ago</span>
                </div>
                <button
                  className="ap-notif-dismiss"
                  onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                  aria-label="Dismiss"
                  type="button"
                >×</button>
              </li>
            ))}
          </ul>

          <div className="ap-notif-foot">
            <a href="#" onClick={(e) => e.preventDefault()}>View all notifications</a>
          </div>
        </div>
      )}
    </div>
  );
}
