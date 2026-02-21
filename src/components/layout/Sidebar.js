import React from 'react';
import { Home, FileText, Upload, CheckCircle, MessageSquare, Settings, Users, Award, Calendar, Menu, LogOut, X } from 'lucide-react';

const Sidebar = ({ role, currentView, setCurrentView, sidebarOpen, setSidebarOpen, darkMode, handleLogout }) => {
  const menuItems = role === 'student' ? [
    { icon: Home, label: 'Dashboard', view: 'dashboard' },
    { icon: FileText, label: 'My Project', view: 'project' },
    { icon: Upload, label: 'Documents', view: 'documents' },
    { icon: CheckCircle, label: 'Tasks', view: 'tasks' },
    { icon: MessageSquare, label: 'Messages', view: 'messages' },
    { icon: Settings, label: 'Settings', view: 'settings' }
  ] : role === 'supervisor' ? [
    { icon: Home, label: 'Dashboard', view: 'supervisor-dashboard' },
    { icon: Users, label: 'My Students', view: 'students' },
    { icon: FileText, label: 'Submissions', view: 'submissions' },
    { icon: MessageSquare, label: 'Messages', view: 'supervisor-messages' },
    { icon: Award, label: 'Grading', view: 'grading' }
  ] : [
    { icon: Home, label: 'Dashboard', view: 'admin-dashboard' },
    { icon: FileText, label: 'All Projects', view: 'all-projects' },
    { icon: Users, label: 'Users', view: 'users' },
    { icon: Calendar, label: 'Timeline', view: 'timeline' },
    { icon: Settings, label: 'Settings', view: 'system-settings' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarOpen ? 'w-64' : 'lg:w-20'}
        ${darkMode ? 'bg-gray-900' : 'bg-gray-900'} 
        text-white h-screen fixed left-0 top-0 transition-all duration-300 z-30 shadow-2xl
      `}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">FYP Manager</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg lg:block"
          >
            {sidebarOpen ? <X size={24} className="lg:hidden" /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="mt-8 overflow-y-auto h-[calc(100vh-200px)]">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentView(item.view);
                // Close sidebar on mobile after selecting
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
              className={`w-full flex items-center ${sidebarOpen ? 'px-6' : 'px-4 justify-center'} py-4 hover:bg-gray-800 transition-all duration-200 group ${
                currentView === item.view ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-r-4 border-indigo-400' : ''
              }`}
            >
              <item.icon size={20} className="group-hover:scale-110 transition-transform flex-shrink-0" />
              {sidebarOpen && <span className="ml-4 font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarOpen ? 'px-6' : 'px-4 justify-center'} py-3 hover:bg-red-900/30 rounded-lg transition-all duration-200 text-red-400 hover:text-red-300 group`}
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform flex-shrink-0" />
            {sidebarOpen && <span className="ml-4 font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;