import React, { useState, useRef, useEffect } from 'react';

const MOCK_USERS = [
  { id: 1, name: 'Maria Santos',  avatar: 'MS', lastMsg: 'Hello, I have a question…',  time: '2m',  unread: 2 },
  { id: 2, name: 'Jose Reyes',    avatar: 'JR', lastMsg: 'Thank you for the update.',  time: '15m', unread: 0 },
  { id: 3, name: 'Ana Dela Cruz', avatar: 'AD', lastMsg: 'When will the event start?', time: '1h',  unread: 1 },
  { id: 4, name: 'Carlos Gomez',  avatar: 'CG', lastMsg: 'Got it, thanks!',            time: '3h',  unread: 0 },
];

export default function MessagesTab() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatUsers]                     = useState(MOCK_USERS);
  const [messages, setMessages]         = useState({});
  const [msgInput, setMsgInput]         = useState('');
  const msgEndRef                       = useRef(null);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChat]);

  const sendMessage = () => {
    if (!msgInput.trim() || !selectedChat) return;
    const newMsg = {
      from: 'admin',
      text: msgInput.trim(),
      time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg],
    }));
    setMsgInput('');
  };

  const handleMsgKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const selectChat = (id) => {
    setSelectedChat(id);
    if (!messages[id]) {
      setMessages(prev => ({
        ...prev,
        [id]: [{ from: 'user', text: chatUsers.find(u => u.id === id)?.lastMsg || '', time: 'earlier' }],
      }));
    }
  };

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
              <div className="ap-chat-avatar">{chatUsers.find(u => u.id === selectedChat)?.avatar}</div>
              <div>
                <div className="ap-chat-header-name">{chatUsers.find(u => u.id === selectedChat)?.name}</div>
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
