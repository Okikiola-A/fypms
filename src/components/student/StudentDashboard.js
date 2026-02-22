import React from 'react';
import { CheckCircle, Calendar, FileText, Award, TrendingUp } from 'lucide-react';
import { StatCard, ChartCard, RadialProgress, BarChart, DonutChart, Sparkline, useCountUp } from '../shared/Charts';

// Weekly activity mock data (submissions + task completions over 8 weeks)
const WEEKLY_ACTIVITY = [2, 3, 1, 4, 3, 5, 4, 6];
const MONTHS = ['Sep', 'Oct', 'Nov', 'Dec'];
const PROGRESS_HISTORY = [20, 30, 38, 45, 52, 60, 65];

const StudentDashboard = ({ projects, tasks, documents, darkMode }) => {
  const project = projects[0];
  const pendingTasks    = tasks.filter(t => t.status !== 'completed').length;
  const completedTasks  = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const pendingDocs     = documents.filter(d => d.status === 'Pending Review').length;
  const approvedDocs    = documents.filter(d => d.status === 'Approved').length;
  const revisionDocs    = documents.filter(d => d.status === 'Needs Revision').length;

  const taskBarData = [
    { label: 'Completed', value: completedTasks, color: 'linear-gradient(to right,#10b981,#059669)' },
    { label: 'In Progress', value: inProgressTasks, color: 'linear-gradient(to right,#6366f1,#8b5cf6)' },
    { label: 'Pending',    value: pendingTasks - inProgressTasks, color: 'linear-gradient(to right,#f59e0b,#d97706)' },
  ];

  const docSegments = [
    { value: approvedDocs, color: '#10b981' },
    { value: pendingDocs,  color: '#f59e0b' },
    { value: revisionDocs, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Project Progress" value={project?.progress} sub="Overall completion"
          icon={<CheckCircle className="text-white" size={24} />}
          gradient="from-indigo-500 to-purple-600" darkMode={darkMode} />
        <StatCard label="Tasks Completed" value={completedTasks} sub={`${pendingTasks} remaining`}
          icon={<Award className="text-white" size={24} />}
          gradient="from-green-500 to-emerald-600" darkMode={darkMode} />
        <StatCard label="Docs Pending" value={pendingDocs} sub="Awaiting supervisor review"
          icon={<FileText className="text-white" size={24} />}
          gradient="from-blue-500 to-cyan-600" darkMode={darkMode} />
        <StatCard label="Upcoming Tasks" value={pendingTasks} sub="Not yet completed"
          icon={<Calendar className="text-white" size={24} />}
          gradient="from-orange-500 to-red-500" darkMode={darkMode} />
      </div>

      {/* ── Row 2: Radial + Progress history + Task breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Radial progress + project info */}
        <ChartCard title="Project Progress" subtitle={project?.title} darkMode={darkMode}>
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <RadialProgress percent={project?.progress || 0} size={120} stroke={12} color="#6366f1" darkMode={darkMode} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {project?.progress}%
                </span>
              </div>
            </div>
            <div className="space-y-2 flex-1 min-w-0">
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {project?.status}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Supervisor: {project?.supervisor}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Deadline: {project?.deadline}
              </p>
              <div className="pt-1">
                {[
                  { label: 'On Track', color: 'bg-green-500' },
                  { label: `${35 - (project?.progress || 0) > 0 ? 35 - (project?.progress || 0) : 0}% to milestone`, color: 'bg-indigo-400' },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5 mt-1">
                    <span className={`w-2 h-2 rounded-full ${b.color}`} />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Progress over time sparkline */}
        <ChartCard title="Progress Over Time" subtitle="Last 7 checkpoints" darkMode={darkMode}>
          <Sparkline data={PROGRESS_HISTORY} color="#6366f1" height={80} darkMode={darkMode} />
          <div className="flex justify-between mt-2">
            {['Sep', 'Oct', 'Oct', 'Oct', 'Nov', 'Nov', 'Now'].map((m, i) => (
              <span key={i} className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{m}</span>
            ))}
          </div>
          <div className={`mt-3 flex items-center gap-1.5 text-xs font-medium text-green-500`}>
            <TrendingUp size={14} />
            <span>+{PROGRESS_HISTORY[PROGRESS_HISTORY.length-1] - PROGRESS_HISTORY[0]}% total growth</span>
          </div>
        </ChartCard>

        {/* Task breakdown bars */}
        <ChartCard title="Task Breakdown" subtitle={`${tasks.length} tasks total`} darkMode={darkMode}>
          <BarChart data={taskBarData} darkMode={darkMode} />
          <div className={`mt-4 pt-3 border-t text-xs ${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
            Task completion rate: <span className="font-semibold text-green-500">
              {tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0}%
            </span>
          </div>
        </ChartCard>
      </div>

      {/* ── Row 3: Document status donut + activity sparkline + upcoming tasks ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Document status donut */}
        <ChartCard title="Document Status" subtitle={`${documents.length} documents submitted`} darkMode={darkMode}>
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <DonutChart segments={docSegments} size={110} stroke={20} darkMode={darkMode} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{documents.length}</span>
              </div>
            </div>
            <div className="space-y-2.5 flex-1">
              {[
                { label: 'Approved',       count: approvedDocs, color: 'bg-emerald-500' },
                { label: 'Pending Review', count: pendingDocs,  color: 'bg-amber-400' },
                { label: 'Needs Revision', count: revisionDocs, color: 'bg-red-400' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.label}</span>
                  </div>
                  <span className={`text-xs font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Weekly activity sparkline */}
        <ChartCard title="Weekly Activity" subtitle="Submissions & completions (8 weeks)" darkMode={darkMode}>
          <Sparkline data={WEEKLY_ACTIVITY} color="#8b5cf6" height={80} darkMode={darkMode} />
          <div className="flex justify-between mt-1">
            {['Wk1','Wk2','Wk3','Wk4','Wk5','Wk6','Wk7','Wk8'].map(w => (
              <span key={w} className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{w}</span>
            ))}
          </div>
        </ChartCard>

        {/* Upcoming tasks list */}
        <ChartCard title="Upcoming Tasks" subtitle="Next deadlines" darkMode={darkMode}>
          <div className="space-y-2.5">
            {tasks.filter(t => t.status !== 'completed').slice(0, 4).map(task => (
              <div key={task.id} className={`flex items-center justify-between p-2.5 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{task.title}</p>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Due {task.deadline}</p>
                </div>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>{task.priority}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ── Recent document activity ── */}
      <ChartCard title="Recent Document Activity" darkMode={darkMode}>
        <div className="space-y-3">
          {documents.slice(0, 4).map(doc => (
            <div key={doc.id} className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
              darkMode ? 'border-gray-700 hover:bg-gray-700/40' : 'border-gray-100 hover:bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0">
                  <FileText className="text-indigo-600" size={16} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{doc.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Uploaded {doc.uploadDate}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                doc.status === 'Approved'       ? 'bg-green-100 text-green-800' :
                doc.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                                                  'bg-red-100 text-red-800'
              }`}>{doc.status}</span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default StudentDashboard;