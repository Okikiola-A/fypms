import React from 'react';
import { CheckCircle, Calendar, FileText, Award } from 'lucide-react';

const StudentDashboard = ({ projects, tasks, documents, darkMode }) => {
  const project = projects[0];
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingDocs = documents.filter(d => d.status === 'Pending Review').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium`}>Project Progress</p>
              <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mt-2`}>{project?.progress}%</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
              <CheckCircle className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium`}>Pending Tasks</p>
              <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mt-2`}>{pendingTasks}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
              <Calendar className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium`}>Documents Pending</p>
              <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mt-2`}>{pendingDocs}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl">
              <FileText className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium`}>Tasks Completed</p>
              <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mt-2`}>{completedTasks}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
              <Award className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Current Project</h3>
          <div className="space-y-4">
            <div>
              <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'} text-lg`}>{project?.title}</h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Supervisor: {project?.supervisor}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>{project?.description}</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Progress</span>
                <span className="font-bold text-indigo-600">{project?.progress}%</span>
              </div>
              <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}>
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${project?.progress}%` }}
                ></div>
              </div>
            </div>
            <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Deadline: {project?.deadline}</span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                {project?.status}
              </span>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Upcoming Tasks</h3>
          <div className="space-y-3">
            {tasks.filter(t => t.status !== 'completed').slice(0, 4).map(task => (
              <div key={task.id} className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg hover:shadow-md transition-all duration-200`}>
                <div className="flex-1">
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'} text-sm`}>{task.title}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Due: {task.deadline}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Recent Document Activity</h3>
        <div className="space-y-3">
          {documents.slice(0, 4).map(doc => (
            <div key={doc.id} className={`flex items-center justify-between p-4 border ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'} rounded-lg transition-all duration-200`}>
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <FileText className="text-indigo-600" size={20} />
                </div>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{doc.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Uploaded: {doc.uploadDate}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                doc.status === 'Approved' ? 'bg-green-100 text-green-800' :
                doc.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;