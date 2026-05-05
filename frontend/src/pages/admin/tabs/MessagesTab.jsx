import React, { useEffect, useRef, useState } from 'react';

/**
 * WEB-10 Messaging System
 * Direct communication between farmers and buyers with real-time messaging,
 * conversation history, typing indicators, read receipts, and image sharing.
 */

const MOCK_USERS = [
  { id: 1, name: 'Maria Santos',  avatar: 'MS', online: true,  lastMsg: 'Hello, I have a question about the Jasmine rice…',  time: '2m',  unread: 2 },
  { id: 2, name: 'Jose Reyes',    avatar: 'JR', online: true,  lastMsg: 'Thank you for the update.',  time: '15m', unread: 0 },
  { id: 3, name: 'Ana Dela Cruz', avatar: 'AD', online: false, lastMsg: 'When will my order ship?', time: '1h',  unread: 1 },
  { id: 4, name: 'Carlos Gomez',  avatar: 'CG', online: false, lastMsg: 'Got it, thanks!',            time: '3h',  unread: 0 },
  { id: 5, name: 'Liza Bautista', avatar: 'LB', online: true,  lastMsg: 'Can I get a bulk discount?', time: '1d',  unread: 0 },
];

const SEED_HISTORY = {
  1: [
    { from: 'user',  text: 'Hi! Is the Premium Jasmine still available?', time: '10:14', read: true },
    { from: 'admin', text: 'Yes, we have 120 kg in stock right now.',    time: '10:18', read: true },
    { from: 'user',  text: 'Hello, I have a question about the Jasmine rice…', time: '10:22', read: false },
  ],
  2: [
    { from: 'admin', text: 'Your order has shipped, tracking #PHX-1041',  time: '09:01', read: true },
    { from: 'user',  text: 'Thank you for the update.',                   time: '09:14', read: true },
  ],
  3: [
    { from: 'user',  text: 'When will my order ship?',                    time: '08:45', read: false },
  ],
};

export default function MessagesTab() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatUsers, setChatUsers]       = useState(MOCK_USERS);
  const [messages, setMessages]         = useState(SEED_HISTORY);
  const [msgInput, setMsgInput]         = useState('');
  const [typing, setTyping]             = useState(false);
  const [search, setSearch]             = useState('');
  const msgEndRef                       = useRef(null);
  const fileInputRef                    = useRef(null);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChat, typing]);

  // Mark messages as read when a conversation is opened
  useEffect(() => {
    if (selectedChat == null) return;
    setMessages(prev => ({
      ...prev,
      [selectedChat]: (prev[selectedChat] || []).map(m =>
        m.from === 'user' ? { ...m, read: true } : m
      ),
    }));
    setChatUsers(prev => prev.map(u =>
      u.id === selectedChat ? { ...u, unread: 0 } : u
    ));
  }, [selectedChat]);

  const filteredUsers = chatUsers.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = () => {
    if (!msgInput.trim() || !selectedChat) return;
    const newMsg = {
      from: 'admin',
      text: msgInput.trim(),
      time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg],
    }));
    setMsgInput('');

    // Simulate typing + read receipt
    setTimeout(() => setTyping(true), 600);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => ({
        ...prev,
        [selectedChat]: prev[selectedChat].map(m =>
          m.from === 'admin' ? { ...m, read: true } : m
        ),
      }));
    }, 2200);
  };

  const handleSendImage = (file) => {
    if (!selectedChat) return;
    const url = URL.createObjectURL(file);
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [
        ...(prev[selectedChat] || []),
        {
          from: 'admin', image: url, name: file.name,
          time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
          read: false,
        },
      ],
    }));
  };

  const onFilePick = (e) => {
    const file = e.target.files?.[0];
    if (file) handleSendImage(file);
    e.target.value = '';
  };

  const handleMsgKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const activeUser = chatUsers.find(u => u.id === selectedChat);

  return (
    <div className="ap-tab-content ap-chat-layout">
      {/* User list */}
      <div className="ap-chat-sidebar">
        <div className="ap-chat-sidebar-header">
          <h3>Messages</h3>
          <input
            type="text"
            className="ap-chat-search"
            placeholder="🔍 Search conversations…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {filteredUsers.length === 0 ? (
          <p className="ap-empty-state" style={{ padding: '1rem' }}>No matches.</p>
        ) : filteredUsers.map(u => (
          <button
            key={u.id}
            className={`ap-chat-user ${selectedChat === u.id ? 'active' : ''}`}
            onClick={() => setSelectedChat(u.id)}
          >
            <div className="ap-chat-avatar-wrap">
              <div className="ap-chat-avatar">{u.avatar}</div>
              {u.online && <span className="ap-chat-presence" />}
            </div>
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
              <div className="ap-chat-avatar-wrap">
                <div className="ap-chat-avatar">{activeUser?.avatar}</div>
                {activeUser?.online && <span className="ap-chat-presence" />}
              </div>
              <div>
                <div className="ap-chat-header-name">{activeUser?.name}</div>
                <div className="ap-chat-header-status">
                  {activeUser?.online ? '● Online' : '○ Last seen recently'}
                </div>
              </div>
            </div>

            <div className="ap-chat-messages">
              {(messages[selectedChat] || []).map((m, i, arr) => {
                const isLastFromAdmin =
                  m.from === 'admin' &&
                  (!arr[i + 1] || arr[i + 1].from !== 'admin');
                return (
                  <div key={i} className={`ap-msg ${m.from === 'admin' ? 'ap-msg-out' : 'ap-msg-in'}`}>
                    <div className="ap-msg-bubble">
                      {m.image ? (
                        <div className="ap-msg-image">
                          <img src={m.image} alt={m.name || 'shared'} />
                          {m.name && <span className="ap-msg-image-name">{m.name}</span>}
                        </div>
                      ) : m.text}
                    </div>
                    <div className="ap-msg-meta">
                      <span className="ap-msg-time">{m.time}</span>
                      {m.from === 'admin' && isLastFromAdmin && (
                        <span className={`ap-msg-receipt ${m.read ? 'read' : ''}`}>
                          {m.read ? '✓✓ Read' : '✓ Sent'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {typing && (
                <div className="ap-msg ap-msg-in">
                  <div className="ap-msg-bubble ap-msg-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={msgEndRef} />
            </div>

            <div className="ap-chat-input-row">
              <button
                className="ap-chat-attach"
                onClick={() => fileInputRef.current?.click()}
                title="Send image"
                type="button"
              >📎</button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={onFilePick}
              />
              <input
                className="ap-chat-input"
                type="text"
                placeholder="Type a message…"
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                onKeyDown={handleMsgKey}
              />
              <button className="ap-chat-send" onClick={sendMessage} disabled={!msgInput.trim()}>
                Send ➤
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
