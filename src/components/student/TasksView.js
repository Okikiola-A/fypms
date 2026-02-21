import React, { useState } from 'react';
import { Calendar, CheckCircle, Award, Search, X } from 'lucide-react';

const TasksView = ({ tasks, darkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className={`w-full pl-10 pr-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'} border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Found {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Tasks */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Calendar className="text-yellow-600" size={24} />
              </div>
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Pending</h3>
            </div>
            <span className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {pendingTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.map(task => (
                <div key={task.id} className={`p-3 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg hover:shadow-md transition-all duration-200 transform hover:-translate-y-1`}>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'} text-sm`}>{task.title}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Due: {task.deadline}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {task.priority} priority
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-center py-4`}>
                {searchQuery ? 'No pending tasks found' : 'No pending tasks'}
              </p>
            )}
          </div>
        </div>

        {/* In Progress Tasks */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <CheckCircle className="text-blue-600" size={24} />
              </div>
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>In Progress</h3>
            </div>
            <span className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {inProgressTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.map(task => (
                <div key={task.id} className={`p-3 ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50'} rounded-lg hover:shadow-md transition-all duration-200 transform hover:-translate-y-1`}>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'} text-sm`}>{task.title}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Due: {task.deadline}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {task.priority} priority
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-center py-4`}>
                {searchQuery ? 'No in-progress tasks found' : 'No in-progress tasks'}
              </p>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Award className="text-green-600" size={24} />
              </div>
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Completed</h3>
            </div>
            <span className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {completedTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {completedTasks.length > 0 ? (
              completedTasks.map(task => (
                <div key={task.id} className={`p-3 ${darkMode ? 'bg-gray-700/50' : 'bg-green-50'} rounded-lg hover:shadow-md transition-all duration-200`}>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'} text-sm line-through`}>{task.title}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Completed</p>
                </div>
              ))
            ) : (
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-center py-4`}>
                {searchQuery ? 'No completed tasks found' : 'No completed tasks'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksView;