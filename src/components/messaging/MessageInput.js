import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, X, File, Image } from 'lucide-react';

const EMOJI_LIST = [
  '😊','😂','❤️','👍','👎','🙏','🔥','✅','❌','⚡',
  '🎉','😭','😅','🤔','💯','👀','🚀','💪','🎓','📚',
  '📝','⏰','✨','😍','🙌','👋','💬','📌','🏆','💡'
];

const MAX_CHARS = 500;

const MessageInput = ({ onSend, darkMode }) => {
  const [localMessage, setLocalMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize as user types
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = '0';
    ta.style.height = Math.min(Math.max(ta.scrollHeight, 42), 160) + 'px';
  }, [localMessage]);

  const resetHeight = () => {
    const ta = textareaRef.current;
    if (ta) ta.style.height = '42px';
  };

  const handleSend = () => {
    if (localMessage.trim() || attachedFile) {
      onSend(localMessage.trim(), attachedFile);
      // Reset height synchronously before React re-renders
      resetHeight();
      setLocalMessage('');
      setAttachedFile(null);
      setShowEmojiPicker(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift+Enter: default textarea behaviour (new line) — no interception needed
  };

  const handleEmojiClick = (emoji) => {
    const ta = textareaRef.current;
    if (ta) {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = localMessage.slice(0, start) + emoji + localMessage.slice(end);
      setLocalMessage(newVal);
      // Restore cursor position after state update
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + emoji.length;
        ta.focus();
      });
    } else {
      setLocalMessage(prev => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file)
      });
    }
    e.target.value = '';
  };

  const charsLeft = MAX_CHARS - localMessage.length;
  const nearLimit = localMessage.length > 400;
  const isImage = attachedFile?.type === 'image';
  const canSend = localMessage.trim().length > 0 || !!attachedFile;

  const baseBtn = `p-2.5 rounded-xl transition-all duration-200 flex-shrink-0`;
  const ghostBtn = darkMode
    ? `${baseBtn} text-gray-400 hover:text-indigo-400 hover:bg-gray-700`
    : `${baseBtn} text-gray-400 hover:text-indigo-600 hover:bg-indigo-50`;

  return (
    <div className={`border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>

      {/* ── Emoji Picker ── */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          showEmojiPicker ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`mx-4 mt-3 p-3 rounded-xl border shadow-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-wrap gap-1.5">
            {EMOJI_LIST.map((emoji, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="text-xl p-1 rounded-lg hover:scale-125 hover:bg-indigo-50 transition-all duration-150 cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── File Attachment Preview ── */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          attachedFile ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {attachedFile && (
          <div className={`mx-4 mt-3 flex items-center space-x-3 p-3 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-indigo-50 border-indigo-100'}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isImage ? 'bg-purple-100' : 'bg-indigo-100'}`}>
              {isImage
                ? <Image size={18} className="text-purple-600" />
                : <File size={18} className="text-indigo-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{attachedFile.name}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{attachedFile.size}</p>
            </div>
            <button
              type="button"
              onClick={() => setAttachedFile(null)}
              className={`p-1.5 rounded-full transition-colors flex-shrink-0 ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>

      {/* ── Input Row ── */}
      <div className="p-3 flex items-center gap-2">
        {/* Attach */}
        <button type="button" onClick={() => fileInputRef.current?.click()} title="Attach file" className={ghostBtn}>
          <Paperclip size={20} />
        </button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

        {/* Emoji toggle */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(prev => !prev)}
          title="Emoji"
          className={`${baseBtn} ${
            showEmojiPicker
              ? 'text-indigo-600 bg-indigo-50'
              : darkMode
                ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-700'
                : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Smile size={20} />
        </button>

        {/* Textarea + char counter */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={localMessage}
            onChange={(e) => setLocalMessage(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            placeholder="Type your message…"
            rows={1}
            className={`w-full px-4 py-2.5 ${nearLimit ? 'pb-6' : ''} rounded-xl border resize-none overflow-y-auto focus:ring-2 focus:ring-indigo-500 focus:border-transparent leading-relaxed scrollbar-hide ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'
            }`}
            style={{ maxHeight: '160px' }}
            autoComplete="off"
          />
          {/* Counter sits inside, below text, only appears near limit */}
          {nearLimit && (
            <span className={`absolute bottom-2 right-3 text-xs pointer-events-none select-none ${
              charsLeft <= 20 ? 'text-red-400 font-semibold' : 'text-gray-400'
            }`}>
              {charsLeft}
            </span>
          )}
        </div>

        {/* Send */}
        <button
          onClick={handleSend}
          type="button"
          disabled={!canSend}
          title="Send (Enter)"
          className={`p-3 rounded-xl transition-all duration-200 flex-shrink-0 ${
            canSend
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
              : darkMode
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;