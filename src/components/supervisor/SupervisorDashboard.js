import React from 'react';

const SupervisorDashboard = ({ projects, darkMode }) => {
  const totalStudents = projects.length;
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6 hover:shadow-xl transition-all`}>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Total Students</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mt-2`}>{totalStudents}</p>
        </div>
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6 hover:shadow-xl transition-all`}>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Avg Progress</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mt-2`}>{avgProgress}%</p>
        </div>
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6 hover:shadow-xl transition-all`}>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Pending Reviews</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mt-2`}>5</p>
        </div>
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6 hover:shadow-xl transition-all`}>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Messages</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mt-2`}>12</p>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Student Projects</h3>
        {projects.map(project => (
          <div key={project.id} className={`p-4 mb-4 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg`}>
            <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{project.title}</h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Student: {project.student}</p>
            <div className="mt-2">
              <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupervisorDashboard;