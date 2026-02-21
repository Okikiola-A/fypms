import React from 'react';
import { Search, MessageSquare } from 'lucide-react';
import MessageInput from './MessageInput';

const MessagesView = ({ darkMode, selectedChat, setSelectedChat, messages, setMessages }) => {
  const chats = [
    { id: 1, name: 'Dr. Sarah Johnson', lastMessage: 'Please review the latest feedback', time: '2 hours ago', unread: 2, avatar: 'SJ' },
    { id: 2, name: 'Department Admin', lastMessage: 'Deadline reminder', time: '1 day ago', unread: 0, avatar: 'DA' }
  ];

  const handleSendMessage = (messageText) => {
    if (selectedChat) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        message: messageText,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isSupervisor: false
      };
      setMessages([...messages, newMessage]);
    }
  };

  return (
    <div className={`h-[calc(100vh-12rem)] flex ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border overflow-hidden`}>
      <div className={`w-1/3 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
            <input
              type="text"
              placeholder="Search messages..."
              className={`w-full pl-10 pr-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
            />
          </div>
        </div>
        <div className="overflow-y-auto h-full">
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'} cursor-pointer transition-all duration-200 ${selectedChat?.id === chat.id ? (darkMode ? 'bg-gray-700' : 'bg-indigo-50') : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {chat.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{chat.name}</h4>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{chat.time}</span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="bg-indigo-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedChat.avatar}
                </div>
                <div>
                  <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedChat.name}</h3>
                  <p className="text-xs text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isSupervisor ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.isSupervisor 
                      ? (darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800')
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  } shadow-md`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.isSupervisor ? (darkMode ? 'text-gray-400' : 'text-gray-500') : 'text-indigo-200'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <MessageInput onSend={handleSendMessage} darkMode={darkMode} />
          </>
        ) : (
          <div className={`flex-1 flex items-center justify-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            <div className="text-center">
              <MessageSquare size={64} className={`mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;