import React from 'react';
import { Users, FileText, MessageSquare, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { StatCard, ChartCard, BarChart, DonutChart, Sparkline, ColumnChart } from '../shared/Charts';

const SUBMISSION_TREND = [3, 5, 4, 7, 6, 8, 5, 9];
const FEEDBACK_TREND   = [2, 4, 3, 5, 4, 6, 5, 7];

const statusColor = (status) => {
  if (status === 'In Progress')    return 'bg-indigo-100 text-indigo-700';
  if (status === 'Proposal Stage') return 'bg-yellow-100 text-yellow-700';
  if (status === 'Completed')      return 'bg-green-100 text-green-700';
  return 'bg-gray-100 text-gray-600';
};

const progressColor = (p) => {
  if (p >= 70) return 'from-green-500 to-emerald-500';
  if (p >= 40) return 'from-indigo-500 to-purple-500';
  return 'from-amber-500 to-orange-500';
};

const SupervisorDashboard = ({ projects, darkMode }) => {
  const totalStudents = projects.length;
  const avgProgress   = Math.round(projects.reduce((s, p) => s + p.progress, 0) / (projects.length || 1));
  const onTrack       = projects.filter(p => p.progress >= 50).length;
  const needsAttention = projects.filter(p => p.progress < 30).length;

  // Progress distribution for column chart
  const progressBands = [
    { label: '0–25%',  values: [projects.filter(p => p.progress <= 25).length] },
    { label: '26–50%', values: [projects.filter(p => p.progress > 25 && p.progress <= 50).length] },
    { label: '51–75%', values: [projects.filter(p => p.progress > 50 && p.progress <= 75).length] },
    { label: '76–100%',values: [projects.filter(p => p.progress > 75).length] },
  ];

  const statusSegments = [
    { value: projects.filter(p => p.status === 'In Progress').length,    color: '#6366f1' },
    { value: projects.filter(p => p.status === 'Proposal Stage').length, color: '#f59e0b' },
    { value: projects.filter(p => p.status === 'Completed').length,      color: '#10b981' },
  ];

  const activityCols = SUBMISSION_TREND.map((s, i) => ({
    label: `W${i+1}`,
    values: [s, FEEDBACK_TREND[i]],
  }));

  return (
    <div className="space-y-6">

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Students" value={totalStudents} sub="Under supervision"
          icon={<Users className="text-white" size={24} />}
          gradient="from-indigo-500 to-purple-600" darkMode={darkMode} />
        <StatCard label="Avg Progress" value={avgProgress} sub="Across all projects"
          icon={<TrendingUp className="text-white" size={24} />}
          gradient="from-blue-500 to-cyan-500" darkMode={darkMode} />
        <StatCard label="On Track" value={onTrack} sub="Progress ≥ 50%"
          icon={<CheckCircle className="text-white" size={24} />}
          gradient="from-green-500 to-emerald-600" darkMode={darkMode} />
        <StatCard label="Need Attention" value={needsAttention} sub="Progress < 30%"
          icon={<AlertCircle className="text-white" size={24} />}
          gradient="from-orange-500 to-red-500" darkMode={darkMode} />
      </div>

      {/* ── Row 2: Status donut + Activity cols + Submission trend ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Project status donut */}
        <ChartCard title="Project Status" subtitle="All supervised projects" darkMode={darkMode}>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <DonutChart segments={statusSegments} size={110} stroke={20} darkMode={darkMode} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{totalStudents}</span>
              </div>
            </div>
            <div className="space-y-2.5 flex-1">
              {[
                { label: 'In Progress',    color: 'bg-indigo-500', count: projects.filter(p => p.status === 'In Progress').length },
                { label: 'Proposal Stage', color: 'bg-amber-400',  count: projects.filter(p => p.status === 'Proposal Stage').length },
                { label: 'Completed',      color: 'bg-emerald-500',count: projects.filter(p => p.status === 'Completed').length },
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

        {/* Progress distribution columns */}
        <ChartCard title="Progress Distribution" subtitle="Students by progress band" darkMode={darkMode}>
          <ColumnChart
            data={progressBands}
            labels={['0–25', '26–50', '51–75', '76–100']}
            colors={['#f59e0b']}
            darkMode={darkMode}
            height={120}
          />
        </ChartCard>

        {/* Submission + feedback trend */}
        <ChartCard title="Activity Trend" subtitle="Submissions vs feedback (8 weeks)" darkMode={darkMode}>
          <Sparkline data={SUBMISSION_TREND} color="#6366f1" height={60} darkMode={darkMode} />
          <Sparkline data={FEEDBACK_TREND}   color="#10b981" height={60} darkMode={darkMode} />
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-indigo-500 rounded" />
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Submissions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 rounded" />
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Feedback given</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* ── Student progress bars ── */}
      <ChartCard title="Student Progress" subtitle="Individual project completion" darkMode={darkMode}>
        <div className="space-y-4">
          {projects.map(project => (
            <div key={project.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {project.student?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{project.student}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} truncate max-w-xs`}>{project.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(project.status)}`}>{project.status}</span>
                  <span className={`text-sm font-bold w-10 text-right ${darkMode ? 'text-white' : 'text-gray-700'}`}>{project.progress}%</span>
                </div>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${progressColor(project.progress)} transition-all duration-1000 ease-out`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* ── Pending reviews list ── */}
      <ChartCard title="Pending Reviews" subtitle="Documents awaiting your feedback" darkMode={darkMode}>
        <div className="space-y-3">
          {[
            { student: 'John Doe',   doc: 'Chapter 2 Draft.pdf',       submitted: '2 hours ago',  priority: 'high' },
            { student: 'Jane Smith', doc: 'Methodology Revision.docx', submitted: '1 day ago',    priority: 'medium' },
            { student: 'Mike Wilson',doc: 'Project Proposal.pdf',      submitted: '2 days ago',   priority: 'high' },
            { student: 'Sarah Chen', doc: 'Literature Review v2.pdf',  submitted: '3 days ago',   priority: 'medium' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${
              darkMode ? 'border-gray-700 hover:bg-gray-700/40' : 'border-gray-100 hover:bg-gray-50'
            } transition-colors`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {item.student.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.student}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.doc} · {item.submitted}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>{item.priority}</span>
                <button className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">Review →</button>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default SupervisorDashboard;