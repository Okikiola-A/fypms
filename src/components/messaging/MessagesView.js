import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MessageSquare, MoreVertical, Check, CheckCheck, X, Reply } from 'lucide-react';
import MessageInput from './MessageInput';

const groupMessagesByDate = (messages) => {
  const groups = [];
  let currentDate = null;
  messages.forEach((msg) => {
    const msgDate = msg.date || 'Today';
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groups.push({ type: 'date', label: msgDate });
    }
    groups.push({ type: 'message', data: msg });
  });
  return groups;
};

const REACTION_EMOJIS = ['❤️', '😂', '👍', '😮', '😢', '🔥'];

const MessageBubble = ({ msg, darkMode, onReact, onReply, onScrollTo, highlightId }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const isOwn = !msg.isSupervisor;
  const hoverTimeout = useRef(null);
  const prevHighlightRef = useRef(null);

  // Flash highlight when this message is jumped to
  useEffect(() => {
    if (highlightId === msg.id && highlightId !== prevHighlightRef.current) {
      prevHighlightRef.current = highlightId;
      setHighlighted(true);
      const t = setTimeout(() => setHighlighted(false), 1500);
      return () => clearTimeout(t);
    }
  }, [highlightId, msg.id]);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => setShowReactions(true), 650);
  };
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    setShowReactions(false);
  };

  const userReaction = msg.userReaction || null;

  return (
    <div
      data-msg-id={msg.id}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group relative`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Incoming avatar */}
      {!isOwn && (
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mr-2 mt-1">
          {msg.sender?.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
      )}

      {/* Bubble column */}
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-xs lg:max-w-md`}>

        {/* Reply-to preview — clickable to scroll to original */}
        {msg.replyTo && (
          <button
            type="button"
            onClick={() => onScrollTo(msg.replyTo.id)}
            className={`text-xs px-3 py-1.5 rounded-t-xl border-l-2 border-indigo-400 mb-0.5 w-full text-left truncate hover:opacity-75 transition-opacity ${
              darkMode ? 'bg-gray-700/80 text-gray-400' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <span className="font-medium text-indigo-400">{msg.replyTo.sender}: </span>
            {msg.replyTo.message}
          </button>
        )}

        {/* Bubble */}
        <div className={`relative px-4 py-3 rounded-2xl shadow-md transition-all duration-300 ${
          isOwn
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
            : darkMode
              ? 'bg-gray-700 text-white'
              : 'bg-white text-gray-800 border border-gray-100'
        } ${highlighted ? 'ring-2 ring-indigo-400 ring-offset-2 brightness-110' : ''}`}>
          {msg.attachment?.type === 'image' && (
            <img src={msg.attachment.url} alt={msg.attachment.name}
              className="rounded-lg mb-2 max-w-full max-h-48 object-cover" />
          )}
          {msg.attachment?.type === 'file' && (
            <div className={`flex items-center space-x-2 mb-2 px-2 py-1.5 rounded-lg ${
              isOwn ? 'bg-white/20' : darkMode ? 'bg-gray-600' : 'bg-gray-100'
            }`}>
              <div className="w-7 h-7 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold flex-shrink-0">
                {msg.attachment.name.split('.').pop().toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{msg.attachment.name}</p>
                <p className={`text-xs ${isOwn ? 'text-indigo-200' : darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{msg.attachment.size}</p>
              </div>
            </div>
          )}

          {msg.message && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
          )}

          <div className={`flex items-center mt-1 space-x-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <p className={`text-xs ${isOwn ? 'text-indigo-200' : darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
              {msg.time}
            </p>
            {isOwn && (
              <span className={msg.read ? 'text-indigo-200' : 'text-indigo-300/60'}>
                {msg.read ? <CheckCheck size={13} /> : <Check size={13} />}
              </span>
            )}
          </div>
        </div>

        {/* Reaction badge — one per user, toggleable */}
        {userReaction && (
          <div className="mt-1.5">
            <button
              type="button"
              onClick={() => onReact(msg.id, userReaction)}
              className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-0.5 transition-all duration-200 hover:scale-110 animate-[scaleIn_0.15s_ease-out] ${
                darkMode
                  ? 'bg-indigo-900/40 border-indigo-700 hover:bg-indigo-900/60'
                  : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 shadow-sm'
              }`}
            >
              {userReaction}
            </button>
          </div>
        )}

        {/* Reply button — separated below bubble with clear gap */}
        <div className={`mt-2 transition-all duration-150 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100`}>
          <button
            type="button"
            onClick={() => onReply({ id: msg.id, sender: msg.sender, message: msg.message })}
            title="Reply"
            className={`p-1.5 rounded-full transition-colors ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600'
            }`}
          >
            <Reply size={13} />
          </button>
        </div>
      </div>

      {/* Reaction picker — always in DOM, animated in/out with CSS */}
      <div className={`absolute ${isOwn ? 'right-0' : 'left-8'} -top-11 z-10`}>
        <div className={`flex items-center space-x-0.5 px-2.5 py-1.5 rounded-full shadow-lg border transition-all duration-200 ease-out origin-bottom ${
          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
        } ${showReactions
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-75 translate-y-1 pointer-events-none'
        }`}>
          {REACTION_EMOJIS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => { onReact(msg.id, emoji); setShowReactions(false); }}
              className={`text-lg p-0.5 rounded transition-all duration-150 hover:scale-125 ${
                userReaction === emoji ? 'bg-indigo-100 ring-1 ring-indigo-300' : ''
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = ({ darkMode, name }) => (
  <div className="flex justify-start items-end space-x-2">
    <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
      {name?.split(' ').map(w => w[0]).join('').slice(0, 2)}
    </div>
    <div className={`px-4 py-3 rounded-2xl shadow-md ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-100'}`}>
      <div className="flex space-x-1 items-center h-4">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>typing...</span>
  </div>
);

const MessagesView = ({ darkMode, selectedChat, setSelectedChat, messages, setMessages }) => {
  const [chatSearch, setChatSearch] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesScrollRef = useRef(null);
  const typingTimeout = useRef(null);
  const prevLengthRef = useRef(messages.length);

  const chats = [
    { id: 1, name: 'Dr. Sarah Johnson', lastMessage: 'Please review the latest feedback', time: '2h ago', unread: 2, avatar: 'SJ', online: true, role: 'Supervisor' },
    { id: 2, name: 'Department Admin', lastMessage: 'Deadline reminder: Submit by Friday', time: '1d ago', unread: 0, avatar: 'DA', online: false, role: 'Admin' },
    { id: 3, name: 'Prof. Michael Brown', lastMessage: 'Great progress on your chapter!', time: '3d ago', unread: 0, avatar: 'MB', online: true, role: 'Supervisor' },
  ];

  const filteredChats = chats.filter(c =>
    c.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(chatSearch.toLowerCase())
  );

  // Scroll to bottom only when a new message arrives
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLengthRef.current = messages.length;
  }, [messages]);

  // Scroll to bottom when typing indicator appears
  useEffect(() => {
    if (isTyping) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isTyping]);

  // Scroll to a specific message by id and flash-highlight it
  const handleScrollTo = useCallback((targetId) => {
    if (!targetId) return;
    const container = messagesScrollRef.current;
    const el = container?.querySelector(`[data-msg-id="${targetId}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightId(null);
    requestAnimationFrame(() => setHighlightId(targetId));
  }, []);

  const simulateReply = () => {
    setIsTyping(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "Thanks for your message! I'll review it shortly.",
        "Good point. Let's discuss this in our next meeting.",
        "I've noted that. Keep up the great work!",
        "Please also check the formatting guidelines in the handbook.",
        "Noted! I'll get back to you with detailed feedback.",
      ];
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: selectedChat?.name || 'Dr. Sarah Johnson',
        message: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isSupervisor: true,
        read: false,
        date: 'Today',
        userReaction: null,
      }]);
    }, 1800 + Math.random() * 1200);
  };

  const handleSendMessage = (messageText, attachment) => {
    if (!selectedChat || (!messageText.trim() && !attachment)) return;
    const newMessage = {
      id: Date.now(),
      sender: 'You',
      message: messageText.trim(),
      attachment: attachment || null,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isSupervisor: false,
      read: false,
      date: 'Today',
      userReaction: null,
      replyTo: replyTo ? { id: replyTo.id, sender: replyTo.sender, message: replyTo.message } : null,
    };
    setMessages(prev => [...prev.map(m => (!m.isSupervisor ? { ...m, read: true } : m)), newMessage]);
    setReplyTo(null);
    setTimeout(() => simulateReply(), 600);
  };

  // One reaction per user: same emoji removes it, different emoji replaces it
  const handleReact = (msgId, emoji) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      return { ...m, userReaction: m.userReaction === emoji ? null : emoji };
    }));
  };

  const grouped = groupMessagesByDate(messages);

  return (
    <div className={`h-[calc(100vh-12rem)] flex ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border overflow-hidden`}>

      {/* Chat List Sidebar */}
      <div className={`w-80 flex-shrink-0 flex flex-col border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Messages</h2>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={chatSearch}
              onChange={e => setChatSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {filteredChats.length === 0 ? (
            <p className={`text-center text-sm mt-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No conversations found</p>
          ) : filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b cursor-pointer transition-all duration-200 ${
                darkMode ? 'border-gray-700/50' : 'border-gray-50'
              } ${
                selectedChat?.id === chat.id
                  ? darkMode ? 'bg-indigo-900/30 border-l-4 border-l-indigo-500' : 'bg-indigo-50 border-l-4 border-l-indigo-500'
                  : darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {chat.avatar}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${darkMode ? 'border-gray-800' : 'border-white'} ${chat.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>{chat.name}</h4>
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{chat.role}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{chat.time}</span>
                      {chat.unread > 0 && (
                        <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={`text-xs mt-0.5 truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-gray-50/80'}`}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {selectedChat.avatar}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${darkMode ? 'border-gray-900' : 'border-gray-50'} ${selectedChat.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                <div>
                  <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedChat.name}</h3>
                  <p className={`text-xs flex items-center gap-1 ${selectedChat.online ? 'text-green-500' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {selectedChat.online
                      ? <><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />Online</>
                      : 'Offline'
                    }
                  </p>
                </div>
              </div>
              <button type="button" title="More options" className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <MoreVertical size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={messagesScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {grouped.map((item, idx) =>
                item.type === 'date' ? (
                  <div key={`date-${idx}`} className="flex items-center justify-center my-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      {item.label}
                    </div>
                  </div>
                ) : (
                  <MessageBubble
                    key={item.data.id}
                    msg={item.data}
                    darkMode={darkMode}
                    onReact={handleReact}
                    onReply={setReplyTo}
                    onScrollTo={handleScrollTo}
                    highlightId={highlightId}
                  />
                )
              )}
              {isTyping && <TypingIndicator darkMode={darkMode} name={selectedChat.name} />}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply banner */}
            {replyTo && (
              <div className={`px-4 py-2 flex items-center justify-between border-t ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-indigo-50 border-indigo-100'}`}>
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-0.5 h-8 bg-indigo-500 rounded-full flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-indigo-500">Replying to {replyTo.sender}</p>
                    <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{replyTo.message}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setReplyTo(null)} className={`p-1 rounded-full ml-2 flex-shrink-0 ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-indigo-100 text-gray-500'}`}>
                  <X size={14} />
                </button>
              </div>
            )}

            <MessageInput onSend={handleSendMessage} darkMode={darkMode} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <MessageSquare size={36} className={darkMode ? 'text-gray-600' : 'text-gray-300'} />
              </div>
              <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Select a conversation</p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Choose from your existing conversations to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;