import React, { useState } from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ onSend, darkMode }) => {
  const [localMessage, setLocalMessage] = useState('');

  const handleSend = () => {
    if (localMessage.trim()) {
      onSend(localMessage.trim());
      setLocalMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex space-x-2">
        <input
          type="text"
          value={localMessage}
          onChange={(e) => setLocalMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className={`flex-1 px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'} border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
          autoComplete="off"
        />
        <button
          onClick={handleSend}
          type="button"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
        >
          <Send size={18} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;