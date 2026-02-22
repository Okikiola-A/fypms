import React, { useState, useEffect } from 'react';

// Component imports
import LoginPage from './components/auth/LoginPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import StudentDashboard from './components/student/StudentDashboard';
import DocumentsView from './components/student/DocumentsView';
import TasksView from './components/student/TasksView';
import MessagesView from './components/messaging/MessagesView';
import SupervisorDashboard from './components/supervisor/SupervisorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import SettingsView from './components/shared/SettingsView';
import ProfileSettings from './components/shared/ProfileSettings';
import CalendarView from './components/shared/CalendarView';

const FYPManagementSystem = () => {
  // State declarations
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [projects, setProjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (currentUser) {
      initializeMockData();
    }
  }, [currentUser]);

  const initializeMockData = () => {
    if (currentUser.role === 'student') {
      setProjects([{
        id: 1,
        title: "AI-Powered Healthcare Diagnosis System",
        supervisor: "Dr. Sarah Johnson",
        status: "In Progress",
        progress: 65,
        deadline: "2025-12-15",
        description: "Developing a machine learning model for early disease detection using neural networks"
      }]);
      
      setDocuments([
        { id: 1, name: "Project Proposal.pdf", uploadDate: "2025-09-15", status: "Approved", feedback: "Excellent proposal structure. Well researched." },
        { id: 2, name: "Literature Review.docx", uploadDate: "2025-09-28", status: "Pending Review", feedback: null },
        { id: 3, name: "Chapter 1 Draft.pdf", uploadDate: "2025-10-01", status: "Needs Revision", feedback: "Add more recent references from 2024-2025" },
        { id: 4, name: "Methodology.pdf", uploadDate: "2025-10-05", status: "Pending Review", feedback: null }
      ]);

      setTasks([
        { id: 1, title: "Complete literature review", deadline: "2025-10-10", status: "completed", priority: "high" },
        { id: 2, title: "Submit methodology chapter", deadline: "2025-10-15", status: "in-progress", priority: "high" },
        { id: 3, title: "Prepare mid-term presentation", deadline: "2025-10-20", status: "pending", priority: "medium" },
        { id: 4, title: "Implement core algorithm", deadline: "2025-11-01", status: "pending", priority: "high" },
        { id: 5, title: "Data collection phase", deadline: "2025-11-15", status: "pending", priority: "medium" }
      ]);

      setNotifications([
        { id: 1, message: "Dr. Johnson commented on your latest submission", time: "2 hours ago", read: false, type: "comment" },
        { id: 2, message: "New task assigned: Prepare mid-term presentation", time: "5 hours ago", read: false, type: "task" },
        { id: 3, message: "Deadline approaching: Submit methodology chapter", time: "1 day ago", read: true, type: "deadline" },
        { id: 4, message: "Your proposal has been approved", time: "2 days ago", read: true, type: "approval" }
      ]);

      setMessages([
        { id: 1, sender: 'Dr. Sarah Johnson', message: 'Hi John, I reviewed your latest submission. Great work on the literature review!', time: '10:30 AM', isSupervisor: true, read: true, date: 'Yesterday', reactions: [] },
        { id: 2, sender: 'You', message: 'Thank you, Dr. Johnson! I appreciate your feedback.', time: '10:45 AM', isSupervisor: false, read: true, date: 'Yesterday', reactions: [] },
        { id: 3, sender: 'Dr. Sarah Johnson', message: 'For the next chapter, make sure to include more recent references from 2024-2025.', time: '11:00 AM', isSupervisor: true, read: true, date: 'Yesterday', reactions: [] },
        { id: 4, sender: 'You', message: 'Understood! I will update the references section and resubmit by end of week.', time: '9:15 AM', isSupervisor: false, read: true, date: 'Today', reactions: [] },
        { id: 5, sender: 'Dr. Sarah Johnson', message: 'Please review the latest feedback on your methodology chapter when you get a chance.', time: '9:45 AM', isSupervisor: true, read: false, date: 'Today', reactions: [] },
      ]);
    } else if (currentUser.role === 'supervisor') {
      setProjects([
        { id: 1, title: "AI-Powered Healthcare Diagnosis System", student: "John Doe", status: "In Progress", progress: 65, deadline: "2025-12-15", email: "john@university.edu" },
        { id: 2, title: "Blockchain-Based Voting System", student: "Jane Smith", status: "In Progress", progress: 45, deadline: "2025-12-15", email: "jane@university.edu" },
        { id: 3, title: "IoT Smart Agriculture Platform", student: "Mike Wilson", status: "Proposal Stage", progress: 20, deadline: "2025-12-15", email: "mike@university.edu" },
        { id: 4, title: "E-Learning Platform with AR", student: "Sarah Chen", status: "In Progress", progress: 55, deadline: "2025-12-15", email: "sarah@university.edu" }
      ]);

      setNotifications([
        { id: 1, message: "John Doe submitted a new document", time: "1 hour ago", read: false, type: "submission" },
        { id: 2, message: "Jane Smith sent you a message", time: "3 hours ago", read: false, type: "message" },
        { id: 3, message: "Department meeting tomorrow at 10 AM", time: "1 day ago", read: true, type: "meeting" },
        { id: 4, message: "Mike Wilson requested feedback", time: "2 days ago", read: true, type: "request" }
      ]);
    } else {
      setProjects([
        { id: 1, title: "AI Healthcare System", student: "John Doe", supervisor: "Dr. Johnson", status: "In Progress", progress: 65, department: "Computer Science" },
        { id: 2, title: "Blockchain Voting", student: "Jane Smith", supervisor: "Dr. Johnson", status: "In Progress", progress: 45, department: "Computer Science" },
        { id: 3, title: "IoT Agriculture", student: "Mike Wilson", supervisor: "Dr. Brown", status: "Proposal", progress: 20, department: "Engineering" },
        { id: 4, title: "Mobile Banking App", student: "Sarah Lee", supervisor: "Dr. Davis", status: "In Progress", progress: 80, department: "Computer Science" },
        { id: 5, title: "Smart Traffic System", student: "Alex Kim", supervisor: "Dr. Brown", status: "In Progress", progress: 50, department: "Engineering" }
      ]);

      setNotifications([
        { id: 1, message: "5 new project proposals submitted", time: "30 mins ago", read: false, type: "system" },
        { id: 2, message: "System maintenance scheduled", time: "2 hours ago", read: false, type: "system" },
        { id: 3, message: "Monthly report ready for review", time: "1 day ago", read: true, type: "report" }
      ]);
    }
  };

  const handleLogin = (email, password, role) => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    const user = {
      id: 1,
      name: role === 'student' ? 'John Doe' : role === 'supervisor' ? 'Dr. Sarah Johnson' : 'Admin User',
      email: email,
      role: role,
      avatar: role === 'student' ? 'JD' : role === 'supervisor' ? 'SJ' : 'AU'
    };
    setCurrentUser(user);
    setCurrentView(role === 'student' ? 'dashboard' : role === 'supervisor' ? 'supervisor-dashboard' : 'admin-dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    setShowUserMenu(false);
  };

  const markAsRead = (notifId) => {
    setNotifications(notifications.map(n => 
      n.id === notifId ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  if (!currentUser) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-all duration-500 ease-in-out`}>
      <Sidebar 
        role={currentUser.role}
        currentView={currentView}
        setCurrentView={setCurrentView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        handleLogout={handleLogout}
      />
      <Header 
        currentView={currentView}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        setShowUserMenu={setShowUserMenu}
        showUserMenu={showUserMenu}
        currentUser={currentUser}
        markAsRead={markAsRead}
        markAllAsRead={markAllAsRead}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
      />
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} mt-20 p-6 transition-all duration-300`}>
        {currentView === 'dashboard' && <StudentDashboard projects={projects} tasks={tasks} documents={documents} darkMode={darkMode} />}
        {currentView === 'project' && <StudentDashboard projects={projects} tasks={tasks} documents={documents} darkMode={darkMode} />}
        {currentView === 'documents' && <DocumentsView documents={documents} darkMode={darkMode} />}
        {currentView === 'tasks' && <TasksView tasks={tasks} darkMode={darkMode} />}
        {currentView === 'messages' && <MessagesView darkMode={darkMode} selectedChat={selectedChat} setSelectedChat={setSelectedChat} messages={messages} setMessages={setMessages} />}
        {currentView === 'calendar' && <CalendarView role="student" tasks={tasks} documents={documents} projects={projects} darkMode={darkMode} />}
        {currentView === 'supervisor-dashboard' && <SupervisorDashboard projects={projects} darkMode={darkMode} />}
        {currentView === 'students' && <SupervisorDashboard projects={projects} darkMode={darkMode} />}
        {currentView === 'submissions' && <DocumentsView documents={documents} darkMode={darkMode} />}
        {currentView === 'supervisor-messages' && <MessagesView darkMode={darkMode} selectedChat={selectedChat} setSelectedChat={setSelectedChat} messages={messages} setMessages={setMessages} />}
        {currentView === 'supervisor-calendar' && <CalendarView role="supervisor" tasks={tasks} documents={documents} projects={projects} darkMode={darkMode} />}
        {currentView === 'grading' && <SettingsView darkMode={darkMode} />}
        {currentView === 'admin-dashboard' && <AdminDashboard projects={projects} darkMode={darkMode} />}
        {currentView === 'all-projects' && <AdminDashboard projects={projects} darkMode={darkMode} />}
        {currentView === 'users' && <SettingsView darkMode={darkMode} />}
        {currentView === 'timeline' && <CalendarView role="admin" tasks={tasks} documents={documents} projects={projects} darkMode={darkMode} />}
        {currentView === 'settings' && <ProfileSettings currentUser={currentUser} darkMode={darkMode} setDarkMode={setDarkMode} />}
        {currentView === 'system-settings' && <SettingsView darkMode={darkMode} />}
      </div>
    </div>
  );
};

export default FYPManagementSystem;