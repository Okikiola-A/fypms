import React from 'react';

const SettingsView = ({ darkMode }) => (
  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border p-6`}>
    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h3>
    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>Settings page coming soon...</p>
  </div>
);

export default SettingsView;