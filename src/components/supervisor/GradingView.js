import React, { useState } from 'react';
import {
  Award, ChevronDown, ChevronRight, Save, CheckCircle,
  AlertCircle, TrendingUp, User, FileText, MessageSquare
} from 'lucide-react';

const RUBRIC = [
  {
    category: 'Project Proposal',
    weight: 10,
    criteria: [
      { id: 'proposal_clarity',    label: 'Clarity & Scope',         max: 10 },
      { id: 'proposal_objectives', label: 'Objectives & Feasibility', max: 10 },
      { id: 'proposal_literature', label: 'Initial Literature',       max: 10 },
    ]
  },
  {
    category: 'Chapters (1–3)',
    weight: 50,
    criteria: [
      { id: 'ch_intro',       label: 'Introduction (Ch. 1)',       max: 10 },
      { id: 'ch_lit_review',  label: 'Literature Review (Ch. 2)', max: 10 },
      { id: 'ch_methodology', label: 'Methodology (Ch. 3)',        max: 10 },
      { id: 'ch_analysis',    label: 'Analysis & Results',         max: 10 },
      { id: 'ch_writing',     label: 'Academic Writing Quality',   max: 10 },
    ]
  },
  {
    category: 'Presentation',
    weight: 20,
    criteria: [
      { id: 'pres_delivery', label: 'Delivery & Confidence', max: 10 },
      { id: 'pres_slides',   label: 'Slide Quality',          max: 10 },
      { id: 'pres_qa',       label: 'Q&A Handling',           max: 10 },
    ]
  },
  {
    category: 'Viva Voce',
    weight: 20,
    criteria: [
      { id: 'viva_knowledge',  label: 'Subject Knowledge',    max: 10 },
      { id: 'viva_defence',    label: 'Defence of Work',       max: 10 },
      { id: 'viva_response',   label: 'Response to Questions', max: 10 },
    ]
  },
];

const STUDENTS = [
  { id: 1, name: 'John Doe',    matric: 'BU/21/CS/001', project: 'AI-Powered Healthcare Diagnosis System',  status: 'In Progress', progress: 65 },
  { id: 2, name: 'Jane Smith',  matric: 'BU/21/CS/002', project: 'Blockchain-Based Voting System',          status: 'In Progress', progress: 45 },
  { id: 3, name: 'Mike Wilson', matric: 'BU/21/ENG/001', project: 'IoT Smart Agriculture Platform',         status: 'Proposal Stage', progress: 20 },
  { id: 4, name: 'Sarah Chen',  matric: 'BU/21/CS/003', project: 'E-Learning Platform with AR',            status: 'In Progress', progress: 55 },
];

const avatarColors = [
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-amber-500 to-orange-500',
  'from-teal-500 to-cyan-500',
];
const getAvatarColor = (id) => avatarColors[id % avatarColors.length];
const getInitials    = (name) => name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();

const gradeLabel = (pct) => {
  if (pct >= 70) return { label: 'A',  desc: 'Distinction',  color: 'text-green-600' };
  if (pct >= 60) return { label: 'B',  desc: 'Merit',        color: 'text-blue-600' };
  if (pct >= 50) return { label: 'C',  desc: 'Pass',         color: 'text-indigo-600' };
  if (pct >= 45) return { label: 'D',  desc: 'Borderline',   color: 'text-amber-600' };
  return             { label: 'F',  desc: 'Fail',         color: 'text-red-600' };
};

const progressColor = (pct) => {
  if (pct >= 70) return 'from-green-500 to-emerald-500';
  if (pct >= 50) return 'from-indigo-500 to-purple-500';
  if (pct >= 45) return 'from-amber-500 to-orange-400';
  return 'from-red-500 to-rose-400';
};

// ── Score slider row ────────────────────────────────────────────────────────
const ScoreRow = ({ criterion, value, onChange, darkMode }) => {
  const pct = (value / criterion.max) * 100;
  return (
    <div className={`flex items-center gap-4 py-3 border-b last:border-0 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
      <div className="flex-1">
        <p className="text-sm font-medium">{criterion.label}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <input
            type="range"
            min={0}
            max={criterion.max}
            step={0.5}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="flex-1 h-2 rounded-full accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 w-28">
        <div className={`flex-1 h-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div className={`h-1.5 rounded-full bg-gradient-to-r ${progressColor(pct)} transition-all`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center gap-0.5 w-16 justify-end">
          <input
            type="number"
            min={0}
            max={criterion.max}
            step={0.5}
            value={value}
            onChange={e => onChange(Math.min(criterion.max, Math.max(0, Number(e.target.value))))}
            className={`w-10 text-center px-1 py-0.5 rounded border text-sm font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-200'
            }`}
          />
          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>/{criterion.max}</span>
        </div>
      </div>
    </div>
  );
};

// ── Student grading panel ───────────────────────────────────────────────────
const StudentGradingPanel = ({ student, darkMode }) => {
  const [scores,   setScores]   = useState(() => {
    const init = {};
    RUBRIC.forEach(cat => cat.criteria.forEach(c => { init[c.id] = 0; }));
    return init;
  });
  const [comments,  setComments]  = useState('');
  const [saved,     setSaved]     = useState(false);
  const [openCats,  setOpenCats]  = useState(RUBRIC.map(c => c.category));

  const setScore = (id, val) => { setScores(s => ({ ...s, [id]: val })); setSaved(false); };
  const toggleCat = (cat) => setOpenCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  // Weighted total
  const weightedTotal = RUBRIC.reduce((total, cat) => {
    const catCriteria = cat.criteria;
    const catMax   = catCriteria.reduce((a, c) => a + c.max, 0);
    const catScore = catCriteria.reduce((a, c) => a + (scores[c.id] || 0), 0);
    const catPct   = catMax > 0 ? (catScore / catMax) * 100 : 0;
    return total + (catPct * cat.weight) / 100;
  }, 0);

  const finalPct = Math.round(weightedTotal);
  const grade    = gradeLabel(finalPct);

  const card    = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const sub     = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inp     = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300'}`;
  const catCard = darkMode ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-200';

  return (
    <div className="space-y-4">
      {/* Grade summary */}
      <div className={`rounded-2xl border p-5 ${card}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${sub}`}>Weighted Total</p>
            <div className="flex items-end gap-3 mt-1">
              <span className="text-5xl font-black">{finalPct}</span>
              <span className={`text-lg font-semibold mb-1 ${sub}`}>/ 100</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-6xl font-black ${grade.color}`}>{grade.label}</div>
            <p className={`text-sm font-semibold mt-1 ${grade.color}`}>{grade.desc}</p>
          </div>
        </div>
        <div className={`mt-4 h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className={`h-3 rounded-full bg-gradient-to-r ${progressColor(finalPct)} transition-all duration-500`}
            style={{ width: `${finalPct}%` }}
          />
        </div>
        {/* Per-category mini bars */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {RUBRIC.map(cat => {
            const catMax   = cat.criteria.reduce((a, c) => a + c.max, 0);
            const catScore = cat.criteria.reduce((a, c) => a + (scores[c.id] || 0), 0);
            const catPct   = catMax > 0 ? Math.round((catScore / catMax) * 100) : 0;
            return (
              <div key={cat.category}>
                <p className={`text-xs font-semibold truncate ${sub}`}>{cat.category}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={`flex-1 h-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className={`h-1.5 rounded-full bg-gradient-to-r ${progressColor(catPct)}`} style={{ width: `${catPct}%` }} />
                  </div>
                  <span className="text-xs font-bold w-8 text-right">{catPct}%</span>
                </div>
                <p className={`text-xs ${sub} mt-0.5`}>{cat.weight}% weight</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rubric categories */}
      {RUBRIC.map(cat => {
        const isOpen   = openCats.includes(cat.category);
        const catMax   = cat.criteria.reduce((a, c) => a + c.max, 0);
        const catScore = cat.criteria.reduce((a, c) => a + (scores[c.id] || 0), 0);
        const catPct   = catMax > 0 ? Math.round((catScore / catMax) * 100) : 0;

        return (
          <div key={cat.category} className={`rounded-2xl border overflow-hidden ${card}`}>
            <button
              onClick={() => toggleCat(cat.category)}
              className={`w-full flex items-center justify-between px-5 py-4 ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors`}
            >
              <div className="flex items-center gap-3">
                {isOpen ? <ChevronDown size={16} className={sub} /> : <ChevronRight size={16} className={sub} />}
                <span className="font-semibold text-sm">{cat.category}</span>
                <span className={`text-xs ${sub}`}>({cat.weight}% of total)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-24 h-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className={`h-1.5 rounded-full bg-gradient-to-r ${progressColor(catPct)}`} style={{ width: `${catPct}%` }} />
                </div>
                <span className={`text-sm font-bold w-12 text-right ${catPct >= 50 ? '' : 'text-red-500'}`}>{catScore}/{catMax}</span>
              </div>
            </button>
            {isOpen && (
              <div className={`px-5 pb-2 border-t ${darkMode ? 'border-gray-700 bg-gray-700/20' : 'border-gray-100 bg-gray-50/50'}`}>
                {cat.criteria.map(c => (
                  <ScoreRow
                    key={c.id}
                    criterion={c}
                    value={scores[c.id] || 0}
                    onChange={val => setScore(c.id, val)}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Supervisor comments */}
      <div className={`rounded-2xl border p-5 ${card}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
          Supervisor Comments
        </h3>
        <textarea
          rows={4}
          className={inp}
          placeholder="Write overall comments, commendations, or areas for improvement…"
          value={comments}
          onChange={e => { setComments(e.target.value); setSaved(false); }}
        />
      </div>

      {/* Save */}
      <div className="flex items-center justify-between">
        {saved && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
            <CheckCircle size={16} /> Grade saved!
          </div>
        )}
        {!saved && <div />}
        <button
          onClick={() => setSaved(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-lg shadow-indigo-200"
        >
          <Save size={15} /> Save Grade
        </button>
      </div>
    </div>
  );
};

// ── Main GradingView ──────────────────────────────────────────────────────────
const GradingView = ({ darkMode }) => {
  const [selectedStudent, setSelectedStudent] = useState(STUDENTS[0]);

  const bg   = darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const sub  = darkMode ? 'text-gray-400' : 'text-gray-500';
  const hover = darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50';

  return (
    <div className={`min-h-screen ${bg}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Grading</h1>
        <p className={`text-sm ${sub}`}>Evaluate and grade your students' final year projects</p>
      </div>

      <div className="flex gap-6">
        {/* Student selector sidebar */}
        <div className="flex-shrink-0 w-64">
          <div className={`rounded-2xl border overflow-hidden ${card}`}>
            <div className={`px-4 py-3 border-b text-xs font-bold uppercase tracking-wider ${sub} ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              Students
            </div>
            {STUDENTS.map(student => {
              const isSelected = selectedStudent.id === student.id;
              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors border-b last:border-0 text-left ${
                    darkMode ? 'border-gray-700' : 'border-gray-100'
                  } ${isSelected
                    ? 'bg-indigo-600 text-white'
                    : `${hover} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getAvatarColor(student.id)} flex items-center justify-center text-white text-xs font-bold shadow flex-shrink-0`}>
                    {getInitials(student.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{student.name}</p>
                    <p className={`text-xs truncate ${isSelected ? 'text-indigo-200' : sub}`}>{student.status}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grading panel */}
        <div className="flex-1 min-w-0">
          {/* Student info header */}
          <div className={`rounded-2xl border p-5 mb-4 ${card}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getAvatarColor(selectedStudent.id)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                {getInitials(selectedStudent.name)}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">{selectedStudent.name}</h2>
                <p className={`text-sm ${sub}`}>{selectedStudent.matric}</p>
                <p className={`text-xs mt-0.5 ${sub} truncate`}>{selectedStudent.project}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-xs font-semibold ${sub}`}>Project Progress</p>
                <p className="text-2xl font-black mt-0.5">{selectedStudent.progress}%</p>
              </div>
            </div>
          </div>

          <StudentGradingPanel
            key={selectedStudent.id}
            student={selectedStudent}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
};

export default GradingView;