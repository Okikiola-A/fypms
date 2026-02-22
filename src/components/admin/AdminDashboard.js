import React from 'react';
import { Users, BookOpen, UserCheck, TrendingUp, BarChart2, Activity } from 'lucide-react';
import { StatCard, ChartCard, BarChart, DonutChart, Sparkline, ColumnChart } from '../shared/Charts';

const MONTHLY_SUBMISSIONS = [18, 24, 19, 32, 28, 35, 30, 42];
const MONTHLY_COMPLETIONS = [4,  6,  5,  9,  8,  10, 9,  13];

const DEPT_DATA = [
  { label: 'Computer Science', value: 68, color: 'linear-gradient(to right,#6366f1,#8b5cf6)' },
  { label: 'Engineering',       value: 22, color: 'linear-gradient(to right,#3b82f6,#06b6d4)' },
  { label: 'Business',          value: 12, color: 'linear-gradient(to right,#10b981,#059669)' },
  { label: 'Sciences',          value: 8,  color: 'linear-gradient(to right,#f59e0b,#d97706)', unit: '' },
];

const AdminDashboard = ({ projects, darkMode }) => {
  const total     = projects.length;
  const inProg    = projects.filter(p => p.status === 'In Progress').length;
  const proposal  = projects.filter(p => p.status === 'Proposal').length;
  const completed = projects.filter(p => p.status === 'Completed').length;
  const avgProgress = Math.round(projects.reduce((s, p) => s + p.progress, 0) / (total || 1));

  const statusSegments = [
    { value: inProg,    color: '#6366f1' },
    { value: proposal,  color: '#f59e0b' },
    { value: completed, color: '#10b981' },
    { value: Math.max(total - inProg - proposal - completed, 0), color: '#e5e7eb' },
  ];

  const deptCols = DEPT_DATA.map(d => ({ label: d.label.split(' ')[0], values: [d.value] }));

  return (
    <div className="space-y-6">

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Projects"  value={total}  sub="Across all departments"
          icon={<BookOpen className="text-white" size={24} />}
          gradient="from-indigo-500 to-purple-600" darkMode={darkMode} />
        <StatCard label="Students"        value={156}    sub="Currently enrolled"
          icon={<Users className="text-white" size={24} />}
          gradient="from-blue-500 to-cyan-500" darkMode={darkMode} />
        <StatCard label="Supervisors"     value={24}     sub="Active this semester"
          icon={<UserCheck className="text-white" size={24} />}
          gradient="from-green-500 to-emerald-600" darkMode={darkMode} />
        <StatCard label="Avg Completion"  value={avgProgress} sub="System-wide average"
          icon={<TrendingUp className="text-white" size={24} />}
          gradient="from-orange-500 to-red-500" darkMode={darkMode} />
      </div>

      {/* ── Row 2: Status donut + Dept breakdown + Trend ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Project status donut */}
        <ChartCard title="Project Status" subtitle="System-wide distribution" darkMode={darkMode}>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <DonutChart segments={statusSegments} size={110} stroke={20} darkMode={darkMode} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{total}</span>
              </div>
            </div>
            <div className="space-y-2.5 flex-1">
              {[
                { label: 'In Progress', color: 'bg-indigo-500', count: inProg },
                { label: 'Proposal',    color: 'bg-amber-400',  count: proposal },
                { label: 'Completed',   color: 'bg-emerald-500',count: completed },
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

        {/* Dept breakdown bars */}
        <ChartCard title="Department Breakdown" subtitle="Projects by department" darkMode={darkMode}>
          <BarChart data={DEPT_DATA} darkMode={darkMode} />
        </ChartCard>

        {/* Monthly trend sparklines */}
        <ChartCard title="Monthly Trends" subtitle="Submissions & completions (8 months)" darkMode={darkMode}>
          <Sparkline data={MONTHLY_SUBMISSIONS} color="#6366f1" height={60} darkMode={darkMode} />
          <Sparkline data={MONTHLY_COMPLETIONS} color="#10b981" height={60} darkMode={darkMode} />
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-indigo-500 rounded" />
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Submissions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 rounded" />
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Completions</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* ── Progress distribution columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Progress Distribution" subtitle="Students grouped by completion %" darkMode={darkMode}>
          <ColumnChart
            data={[
              { label: '0–25%',   values: [projects.filter(p => p.progress <= 25).length * 8] },
              { label: '26–50%',  values: [projects.filter(p => p.progress > 25 && p.progress <= 50).length * 8] },
              { label: '51–75%',  values: [projects.filter(p => p.progress > 50 && p.progress <= 75).length * 8] },
              { label: '76–100%', values: [projects.filter(p => p.progress > 75).length * 8] },
            ]}
            labels={['0–25%','26–50%','51–75%','76–100%']}
            colors={['#6366f1']}
            darkMode={darkMode}
            height={130}
          />
          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            * Scaled proportionally across 156 students
          </p>
        </ChartCard>

        {/* Supervisor workload */}
        <ChartCard title="Supervisor Workload" subtitle="Students per supervisor (top 5)" darkMode={darkMode}>
          <BarChart
            data={[
              { label: 'Dr. Johnson', value: 8, color: 'linear-gradient(to right,#6366f1,#8b5cf6)' },
              { label: 'Dr. Brown',   value: 6, color: 'linear-gradient(to right,#3b82f6,#06b6d4)' },
              { label: 'Dr. Davis',   value: 7, color: 'linear-gradient(to right,#10b981,#059669)' },
              { label: 'Dr. Wilson',  value: 5, color: 'linear-gradient(to right,#f59e0b,#d97706)' },
              { label: 'Dr. Lee',     value: 4, color: 'linear-gradient(to right,#ec4899,#f43f5e)' },
            ]}
            darkMode={darkMode}
          />
        </ChartCard>
      </div>

      {/* ── All projects table ── */}
      <ChartCard title="All Projects" subtitle={`${total} projects across all departments`} darkMode={darkMode}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <tr>
                {['Project', 'Student', 'Supervisor', 'Dept', 'Progress', 'Status'].map(h => (
                  <th key={h} className={`text-left pb-3 text-xs font-bold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id} className={`border-b transition-colors ${darkMode ? 'border-gray-700/50 hover:bg-gray-700/30' : 'border-gray-50 hover:bg-gray-50'}`}>
                  <td className={`py-3 pr-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{project.title}</td>
                  <td className={`py-3 pr-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.student}</td>
                  <td className={`py-3 pr-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.supervisor}</td>
                  <td className={`py-3 pr-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.department || '—'}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} style={{ minWidth: 60 }}>
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className={`text-xs font-semibold w-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{project.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      project.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' :
                      project.status === 'Proposal'    ? 'bg-yellow-100 text-yellow-700' :
                                                         'bg-green-100 text-green-700'
                    }`}>{project.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};

export default AdminDashboard;