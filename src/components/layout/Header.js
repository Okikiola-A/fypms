import React from 'react';
import { Bell, Sun, Moon, Settings, LogOut, ChevronDown } from 'lucide-react';

const Header = ({ 
  currentView, 
  darkMode, 
  setDarkMode, 
  sidebarOpen, 
  notifications, 
  showNotifications, 
  setShowNotifications,
  setShowUserMenu,
  showUserMenu,
  currentUser,
  markAsRead,
  markAllAsRead,
  setCurrentView,
  handleLogout
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4 flex justify-between items-center transition-all duration-300 fixed top-0 right-0 left-0 z-10 shadow-sm`}>
      <div className="flex items-center space-x-4">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {currentView.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg transition-all duration-200 ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'} hover:scale-110`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className={`relative p-2 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition-all duration-200 hover:scale-110`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-96 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-2xl border z-50 max-h-96 overflow-hidden`}>
              <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id} className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} ${!notif.read ? (darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')} transition-colors cursor-pointer group`}>
                    <div className="flex justify-between items-start">
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'} flex-1`}>{notif.message}</p>
                      {!notif.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                          }}
                          className="ml-2 text-xs text-indigo-600 hover:text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full px-4 py-2 hover:shadow-lg transition-all duration-200 hover:scale-105`}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {currentUser?.avatar}
            </div>
            <div className="text-sm text-left">
              <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{currentUser?.name}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>{currentUser?.role}</p>
            </div>
            <ChevronDown size={16} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>

          {showUserMenu && (
            <div className={`absolute right-0 mt-2 w-56 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-2xl border z-50 overflow-hidden`}>
              <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{currentUser?.name}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{currentUser?.email}</p>
              </div>
              <button
                onClick={() => setCurrentView('settings')}
                className={`w-full px-4 py-3 text-left ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'} transition-colors flex items-center space-x-2`}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 transition-colors flex items-center space-x-2 border-t border-gray-200"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;