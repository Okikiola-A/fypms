import React from 'react';

const AdminDashboard = ({ projects, darkMode }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-4 gap-6">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border p-6`}>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Total Projects</p>
        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mt-2`}>{projects.length}</p>
      </div>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border p-6`}>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Students</p>
        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mt-2`}>156</p>
      </div>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border p-6`}>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Supervisors</p>
        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mt-2`}>24</p>
      </div>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border p-6`}>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Completion</p>
        <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mt-2`}>87%</p>
      </div>
    </div>

    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border p-6`}>
      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>All Projects</h3>
      <table className="w-full">
        <thead className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <tr>
            <th className={`text-left p-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Project</th>
            <th className={`text-left p-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Student</th>
            <th className={`text-left p-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Supervisor</th>
            <th className={`text-left p-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Progress</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <td className={`p-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{project.title}</td>
              <td className={`p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.student}</td>
              <td className={`p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.supervisor}</td>
              <td className={`p-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.progress}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboard;