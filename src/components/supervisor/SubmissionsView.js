import React, { useState } from 'react';
import {
  FileText, Search, Filter, Eye, Download, CheckCircle,
  AlertCircle, Clock, X, MessageSquare, ChevronDown, User
} from 'lucide-react';

const getFileStyle = (filename) => {
  const ext = (filename || '').split('.').pop().toLowerCase();
  if (ext === 'pdf')                       return { color: 'text-red-500',    bg: 'bg-red-50',    label: 'PDF' };
  if (['doc','docx'].includes(ext))        return { color: 'text-blue-500',   bg: 'bg-blue-50',   label: 'DOC' };
  if (['ppt','pptx'].includes(ext))        return { color: 'text-orange-500', bg: 'bg-orange-50', label: 'PPT' };
  if (['xls','xlsx'].includes(ext))        return { color: 'text-green-500',  bg: 'bg-green-50',  label: 'XLS' };
  return { color: 'text-gray-500', bg: 'bg-gray-100', label: ext.toUpperCase() || 'FILE' };
};

const STATUS = {
  'Pending Review': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock size={12} /> },
  'Approved':       { bg: 'bg-green-100',  text: 'text-green-800',  icon: <CheckCircle size={12} /> },
  'Needs Revision': { bg: 'bg-red-100',    text: 'text-red-700',    icon: <AlertCircle size={12} /> },
};

const INITIAL_SUBMISSIONS = [
  { id: 1,  student: 'John Doe',     studentId: 'BU/21/CS/001', doc: 'Chapter 2 Draft.pdf',        type: 'Chapter Draft',      submitted: '2025-10-12', status: 'Pending Review', feedback: null,                                              note: 'Second draft with revisions' },
  { id: 2,  student: 'John Doe',     studentId: 'BU/21/CS/001', doc: 'Project Proposal.pdf',       type: 'Project Proposal',   submitted: '2025-09-15', status: 'Approved',       feedback: 'Excellent proposal structure. Well researched.', note: null },
  { id: 3,  student: 'Jane Smith',   studentId: 'BU/21/CS/002', doc: 'Methodology Revision.docx',  type: 'Methodology',        submitted: '2025-10-11', status: 'Pending Review', feedback: null,                                              note: 'Revised based on previous feedback' },
  { id: 4,  student: 'Jane Smith',   studentId: 'BU/21/CS/002', doc: 'Literature Review.pdf',      type: 'Literature Review',  submitted: '2025-09-28', status: 'Needs Revision', feedback: 'Add more recent references from 2024–2025.',       note: null },
  { id: 5,  student: 'Mike Wilson',  studentId: 'BU/21/ENG/001', doc: 'Project Proposal.pdf',      type: 'Project Proposal',   submitted: '2025-10-09', status: 'Pending Review', feedback: null,                                              note: null },
  { id: 6,  student: 'Sarah Chen',   studentId: 'BU/21/CS/003', doc: 'Literature Review v2.pdf',   type: 'Literature Review',  submitted: '2025-10-07', status: 'Pending Review', feedback: null,                                              note: 'Updated version with new sources' },
  { id: 7,  student: 'Sarah Chen',   studentId: 'BU/21/CS/003', doc: 'Chapter 1 Draft.pdf',        type: 'Chapter Draft',      submitted: '2025-09-30', status: 'Approved',       feedback: 'Good structure. Proceed to Chapter 2.',           note: null },
];

const avatarColors = [
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-amber-500 to-orange-500',
  'from-teal-500 to-cyan-500',
];
const getAvatarColor = (name) => avatarColors[name.length % avatarColors.length];
const getInitials    = (name) => name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();

// ── Feedback Modal ────────────────────────────────────────────────────────────
const FeedbackModal = ({ submission, onClose, onSave, darkMode }) => {
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [status,   setStatus]   = useState(submission.status);

  const bg    = darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900';
  const inp   = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`;
  const divider = darkMode ? 'border-gray-700' : 'border-gray-200';

  const statusOptions = [
    { value: 'Approved',       label: 'Approve',          style: 'border-green-500 bg-green-50 text-green-700' },
    { value: 'Needs Revision', label: 'Request Revision', style: 'border-red-500 bg-red-50 text-red-700' },
    { value: 'Pending Review', label: 'Keep Pending',     style: 'border-yellow-400 bg-yellow-50 text-yellow-700' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl ${bg}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${divider}`}>
          <div>
            <h2 className="text-base font-bold">Review Submission</h2>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {submission.student} · {submission.doc}
            </p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Submission info */}
          <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Document Type</span><p className="font-medium mt-0.5">{submission.type}</p></div>
              <div><span className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Submitted</span><p className="font-medium mt-0.5">{submission.submitted}</p></div>
              {submission.note && <div className="col-span-2"><span className={`text-xs font-semibold uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Student Note</span><p className="font-medium mt-0.5 italic">{submission.note}</p></div>}
            </div>
          </div>

          {/* Decision */}
          <div>
            <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Decision</label>
            <div className="flex gap-2">
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 text-xs font-semibold transition ${status === opt.value ? opt.style : darkMode ? 'border-gray-600 text-gray-400 hover:border-gray-500' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className={`block text-xs font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Feedback {status === 'Needs Revision' && <span className="text-red-400">*</span>}
            </label>
            <textarea
              rows={4}
              className={`${inp} resize-none`}
              placeholder="Write your feedback here…"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
            />
          </div>
        </div>

        <div className={`flex justify-end gap-3 p-6 border-t ${divider}`}>
          <button onClick={onClose} className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>Cancel</button>
          <button
            onClick={() => onSave({ ...submission, status, feedback: feedback || null })}
            disabled={status === 'Needs Revision' && !feedback.trim()}
            className="px-6 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Review
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main SubmissionsView ──────────────────────────────────────────────────────
const SubmissionsView = ({ darkMode }) => {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [search,      setSearch]      = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [studentFilter, setStudentFilter] = useState('All');
  const [reviewing,   setReviewing]   = useState(null); // submission being reviewed
  const [expandedStudent, setExpandedStudent] = useState(null);

  const bg   = darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const sub  = darkMode ? 'text-gray-400' : 'text-gray-500';
  const hover = darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50';

  const students = [...new Set(submissions.map(s => s.student))];

  const filtered = submissions.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.student.toLowerCase().includes(q) || s.doc.toLowerCase().includes(q) || s.type.toLowerCase().includes(q);
    const matchStatus  = statusFilter  === 'All' || s.status  === statusFilter;
    const matchStudent = studentFilter === 'All' || s.student === studentFilter;
    return matchSearch && matchStatus && matchStudent;
  });

  // Group by student
  const grouped = students
    .filter(st => studentFilter === 'All' || st === studentFilter)
    .map(st => ({
      student: st,
      submissions: filtered.filter(s => s.student === st),
    }))
    .filter(g => g.submissions.length > 0);

  const handleSave = (updated) => {
    setSubmissions(prev => prev.map(s => s.id === updated.id ? updated : s));
    setReviewing(null);
  };

  const pending  = submissions.filter(s => s.status === 'Pending Review').length;
  const approved = submissions.filter(s => s.status === 'Approved').length;
  const revision = submissions.filter(s => s.status === 'Needs Revision').length;

  const inp = `px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`;

  return (
    <div className={`min-h-screen ${bg}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Submissions</h1>
        <p className={`text-sm ${sub}`}>Review documents submitted by your students</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending Review', value: pending,  color: 'from-yellow-400 to-amber-500',   icon: <Clock size={20} className="text-white" /> },
          { label: 'Approved',       value: approved, color: 'from-green-500 to-emerald-500',  icon: <CheckCircle size={20} className="text-white" /> },
          { label: 'Needs Revision', value: revision, color: 'from-red-500 to-rose-500',       icon: <AlertCircle size={20} className="text-white" /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className={`rounded-2xl border p-4 flex items-center gap-4 ${card}`}>
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>{icon}</div>
            <div>
              <p className={`text-xs font-semibold ${sub}`}>{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={`rounded-2xl border p-4 mb-4 flex flex-wrap items-center gap-3 ${card}`}>
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${sub}`} />
          <input className={`${inp} pl-9 w-full`} placeholder="Search documents or students…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <select className={inp} value={studentFilter} onChange={e => setStudentFilter(e.target.value)}>
          <option value="All">All Students</option>
          {students.map(s => <option key={s}>{s}</option>)}
        </select>

        <select className={inp} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option>Pending Review</option>
          <option>Approved</option>
          <option>Needs Revision</option>
        </select>
      </div>

      {/* Grouped by student */}
      <div className="space-y-4">
        {grouped.length === 0 ? (
          <div className={`rounded-2xl border p-16 text-center ${card}`}>
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className={`font-medium ${sub}`}>No submissions found</p>
            <p className={`text-xs mt-1 ${sub}`}>Try adjusting your filters</p>
          </div>
        ) : grouped.map(({ student, submissions: subs }) => {
          const isOpen = expandedStudent !== student;
          const pendingCount = subs.filter(s => s.status === 'Pending Review').length;

          return (
            <div key={student} className={`rounded-2xl border overflow-hidden ${card}`}>
              {/* Student header */}
              <button
                onClick={() => setExpandedStudent(isOpen ? student : null)}
                className={`w-full flex items-center justify-between px-5 py-4 ${hover} transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarColor(student)} flex items-center justify-center text-white text-xs font-bold shadow`}>
                    {getInitials(student)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">{student}</p>
                    <p className={`text-xs ${sub}`}>{subs.length} submission{subs.length !== 1 ? 's' : ''}</p>
                  </div>
                  {pendingCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                      {pendingCount} pending
                    </span>
                  )}
                </div>
                <ChevronDown size={18} className={`${sub} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Submissions table */}
              {isOpen && (
                <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <table className="w-full">
                    <thead className={darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}>
                      <tr>
                        {['Document', 'Type', 'Submitted', 'Status', 'Feedback', 'Actions'].map(h => (
                          <th key={h} className={`text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider ${sub}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                      {subs.map(s => {
                        const fs = getFileStyle(s.doc);
                        const st = STATUS[s.status] || STATUS['Pending Review'];
                        return (
                          <tr key={s.id} className={`${hover} transition-colors`}>
                            {/* Doc */}
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${fs.bg}`}>
                                  <span className={`text-xs font-bold ${fs.color}`}>{fs.label}</span>
                                </div>
                                <span className="text-sm font-medium">{s.doc}</span>
                              </div>
                            </td>
                            {/* Type */}
                            <td className={`px-5 py-3 text-sm ${sub}`}>{s.type}</td>
                            {/* Date */}
                            <td className={`px-5 py-3 text-sm ${sub}`}>{s.submitted}</td>
                            {/* Status */}
                            <td className="px-5 py-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                                {st.icon} {s.status}
                              </span>
                            </td>
                            {/* Feedback */}
                            <td className={`px-5 py-3 text-sm max-w-xs ${sub}`}>
                              {s.feedback
                                ? <span className="line-clamp-1" title={s.feedback}>{s.feedback}</span>
                                : <span className="italic opacity-50">No feedback yet</span>}
                            </td>
                            {/* Actions */}
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-1">
                                <button title="Download" className={`p-1.5 rounded-lg transition ${darkMode ? 'hover:bg-gray-600 text-green-400' : 'hover:bg-green-50 text-green-600'}`}><Download size={15} /></button>
                                <button
                                  title="Review"
                                  onClick={() => setReviewing(s)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    s.status === 'Pending Review'
                                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                      : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                  }`}
                                >
                                  <MessageSquare size={13} />
                                  {s.status === 'Pending Review' ? 'Review' : 'Edit'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Feedback modal */}
      {reviewing && (
        <FeedbackModal
          submission={reviewing}
          onClose={() => setReviewing(null)}
          onSave={handleSave}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default SubmissionsView;