import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, FileText, CheckCircle, AlertCircle, Users, X } from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────────────────
const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const pad = (n) => String(n).padStart(2, '0');
const toKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

// Event type → colour + icon
const EVENT_STYLES = {
  deadline:   { bg: 'bg-red-500',    light: 'bg-red-50 border-red-200 text-red-700',    dot: 'bg-red-500',    icon: AlertCircle },
  submission: { bg: 'bg-indigo-500', light: 'bg-indigo-50 border-indigo-200 text-indigo-700', dot: 'bg-indigo-500', icon: FileText },
  meeting:    { bg: 'bg-purple-500', light: 'bg-purple-50 border-purple-200 text-purple-700', dot: 'bg-purple-500', icon: Users },
  task:       { bg: 'bg-amber-500',  light: 'bg-amber-50 border-amber-200 text-amber-700',   dot: 'bg-amber-500',  icon: CheckCircle },
  milestone:  { bg: 'bg-green-500',  light: 'bg-green-50 border-green-200 text-green-700',   dot: 'bg-green-500',  icon: Calendar },
};

// ── Mock events per role ───────────────────────────────────────────────
const getEvents = (role, tasks, documents, projects) => {
  if (role === 'student') {
    const evts = [
      { id: 'e1', date: '2025-10-10', title: 'Literature Review Due',       type: 'deadline',   desc: 'Submit completed literature review to supervisor' },
      { id: 'e2', date: '2025-10-15', title: 'Methodology Chapter',         type: 'submission', desc: 'Upload methodology chapter draft on the portal' },
      { id: 'e3', date: '2025-10-20', title: 'Mid-Term Presentation',       type: 'milestone',  desc: 'Present progress to panel at 10:00 AM, Hall B' },
      { id: 'e4', date: '2025-10-22', title: 'Supervisor Meeting',          type: 'meeting',    desc: 'Weekly check-in with Dr. Sarah Johnson' },
      { id: 'e5', date: '2025-11-01', title: 'Core Algorithm Milestone',    type: 'task',       desc: 'Complete and document core algorithm implementation' },
      { id: 'e6', date: '2025-11-05', title: 'Supervisor Meeting',          type: 'meeting',    desc: 'Progress review and feedback session' },
      { id: 'e7', date: '2025-11-15', title: 'Data Collection Complete',    type: 'milestone',  desc: 'Finalise data collection and begin analysis' },
      { id: 'e8', date: '2025-11-20', title: 'Chapter 3 Submission',        type: 'submission', desc: 'Upload Chapter 3 draft for review' },
      { id: 'e9', date: '2025-12-01', title: 'Draft Final Report',          type: 'deadline',   desc: 'First complete draft of final report due' },
      { id: 'e10',date: '2025-12-10', title: 'Final Presentation',          type: 'milestone',  desc: 'Final project presentation to examination panel' },
      { id: 'e11',date: '2025-12-15', title: 'Project Submission Deadline', type: 'deadline',   desc: 'Hard deadline — all documents must be submitted' },
    ];
    // Also inject task deadlines
    tasks.forEach(t => {
      if (!evts.find(e => e.date === t.deadline)) {
        evts.push({ id: `t-${t.id}`, date: t.deadline, title: t.title, type: 'task', desc: `Priority: ${t.priority}` });
      }
    });
    return evts;
  }

  if (role === 'supervisor') {
    return [
      { id: 's1', date: '2025-10-08', title: 'John Doe — Submission Review',     type: 'submission', desc: 'Review Chapter 1 draft from John Doe' },
      { id: 's2', date: '2025-10-10', title: 'Jane Smith — Deadline',            type: 'deadline',   desc: 'Literature review deadline for Jane Smith' },
      { id: 's3', date: '2025-10-14', title: 'Group Meeting',                    type: 'meeting',    desc: 'Monthly group progress meeting — all students' },
      { id: 's4', date: '2025-10-20', title: 'Mid-Term Presentations',           type: 'milestone',  desc: 'All students present mid-term progress' },
      { id: 's5', date: '2025-10-22', title: 'Mike Wilson — Review',             type: 'submission', desc: 'Review IoT Agriculture proposal documents' },
      { id: 's6', date: '2025-11-01', title: 'Sarah Chen — Milestone Check',     type: 'task',       desc: 'Check AR platform milestone completion' },
      { id: 's7', date: '2025-11-05', title: 'Department Meeting',               type: 'meeting',    desc: 'Monthly department supervisor meeting' },
      { id: 's8', date: '2025-11-15', title: 'John Doe — Chapter 3 Review',      type: 'submission', desc: 'Review methodology and data chapters' },
      { id: 's9', date: '2025-11-22', title: 'Jane Smith — Progress Check',      type: 'task',       desc: 'Blockchain voting system milestone review' },
      { id: 's10',date: '2025-12-01', title: 'Draft Report Reviews Due',         type: 'deadline',   desc: 'Complete feedback on all student draft reports' },
      { id: 's11',date: '2025-12-10', title: 'Final Presentations',              type: 'milestone',  desc: 'All 4 students present final projects' },
      { id: 's12',date: '2025-12-15', title: 'Grading Deadline',                 type: 'deadline',   desc: 'Submit all final grades to department' },
    ];
  }

  // Admin
  return [
    { id: 'a1', date: '2025-10-01', title: 'Semester Check-in',               type: 'milestone',  desc: 'System-wide progress review' },
    { id: 'a2', date: '2025-10-15', title: 'Submission Phase Opens',           type: 'milestone',  desc: 'Mid-semester submissions begin' },
    { id: 'a3', date: '2025-10-20', title: 'Mid-Term Presentations',           type: 'milestone',  desc: 'Department-wide presentation day' },
    { id: 'a4', date: '2025-10-31', title: 'Progress Reports Due',             type: 'deadline',   desc: 'All supervisors to submit progress reports' },
    { id: 'a5', date: '2025-11-01', title: 'Supervisor Meeting',               type: 'meeting',    desc: 'All supervisors monthly coordination meeting' },
    { id: 'a6', date: '2025-11-15', title: 'Proposal Approval Deadline',       type: 'deadline',   desc: 'Final date for proposal approvals' },
    { id: 'a7', date: '2025-11-20', title: 'System Maintenance',               type: 'task',       desc: 'Scheduled portal downtime 2–4 AM' },
    { id: 'a8', date: '2025-12-01', title: 'Draft Report Reviews Begin',       type: 'milestone',  desc: 'Supervisors begin final draft reviews' },
    { id: 'a9', date: '2025-12-05', title: 'Admin Board Meeting',              type: 'meeting',    desc: 'Academic board final semester review' },
    { id: 'a10',date: '2025-12-10', title: 'Final Presentations Week',         type: 'milestone',  desc: 'All departments hold final presentations' },
    { id: 'a11',date: '2025-12-15', title: 'Project Submission Deadline',      type: 'deadline',   desc: 'Hard deadline — all projects must be submitted' },
    { id: 'a12',date: '2025-12-20', title: 'Grade Submission Deadline',        type: 'deadline',   desc: 'All grades submitted to academic registry' },
    ...projects.map((p, i) => ({
      id: `ap-${p.id}`,
      date: `2025-12-${pad(10 + i)}`,
      title: `${p.student} — Final Presentation`,
      type: 'milestone',
      desc: p.title,
    })),
  ];
};

// ── EventPill (small, shown on calendar cell) ──────────────────────────
const EventPill = ({ event, onClick }) => {
  const style = EVENT_STYLES[event.type] || EVENT_STYLES.task;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(event); }}
      className={`w-full text-left text-xs px-1.5 py-0.5 rounded font-medium truncate transition-opacity hover:opacity-80 ${style.bg} text-white`}
    >
      {event.title}
    </button>
  );
};

// ── Event detail modal ─────────────────────────────────────────────────
const EventModal = ({ event, onClose, darkMode }) => {
  if (!event) return null;
  const style = EVENT_STYLES[event.type] || EVENT_STYLES.task;
  const Icon = style.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        onClick={e => e.stopPropagation()}
        className={`relative z-10 w-full max-w-sm rounded-2xl shadow-2xl border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      >
        <button onClick={onClose} className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
          <X size={16} />
        </button>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${style.bg}`}>
          <Icon size={22} className="text-white" />
        </div>
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize mb-2 border ${style.light}`}>
          {event.type}
        </span>
        <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{event.title}</h3>
        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{event.desc}</p>
        <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <Clock size={13} />
          <span>{event.date}</span>
        </div>
      </div>
    </div>
  );
};

// ── Timeline view ──────────────────────────────────────────────────────
const TimelineView = ({ events, darkMode, onEventClick }) => {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const now = new Date().toISOString().split('T')[0];
  const upcoming = sorted.filter(e => e.date >= now);
  const past     = sorted.filter(e => e.date <  now);

  const Section = ({ title, items, faded }) => (
    <div>
      <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{title}</h4>
      <div className="relative pl-6 border-l-2 border-dashed space-y-4 mb-8" style={{ borderColor: faded ? '#6b728040' : '#6366f1' }}>
        {items.map((event, i) => {
          const style = EVENT_STYLES[event.type] || EVENT_STYLES.task;
          const Icon = style.icon;
          return (
            <button
              key={event.id}
              onClick={() => onEventClick(event)}
              className={`relative w-full text-left group transition-all ${faded ? 'opacity-50' : ''}`}
            >
              {/* Timeline dot */}
              <div className={`absolute -left-[1.65rem] top-3 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${style.dot} ${faded ? 'opacity-40' : ''}`} />
              <div className={`ml-2 p-3 rounded-xl border transition-all group-hover:shadow-md ${
                darkMode ? 'bg-gray-800 border-gray-700 group-hover:border-gray-600' : 'bg-white border-gray-100 group-hover:border-gray-200'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{event.title}</p>
                    <p className={`text-xs mt-0.5 truncate ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{event.desc}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 border ${style.light}`}>
                    {event.type}
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 mt-2 text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  <Clock size={11} />
                  <span>{event.date}</span>
                </div>
              </div>
            </button>
          );
        })}
        {items.length === 0 && (
          <p className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>No events</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      <Section title="Upcoming" items={upcoming} faded={false} />
      {past.length > 0 && <Section title="Past" items={past} faded={true} />}
    </div>
  );
};

// ── Main CalendarView component ────────────────────────────────────────
const CalendarView = ({ role, tasks = [], documents = [], projects = [], darkMode }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [view, setView]         = useState('month'); // 'month' | 'timeline'
  const [selected, setSelected] = useState(null);   // selected date string
  const [modalEvent, setModalEvent] = useState(null);

  const events = useMemo(
    () => getEvents(role, tasks, documents, projects),
    [role, tasks, documents, projects]
  );

  // Map date string → events[]
  const eventMap = useMemo(() => {
    const m = {};
    events.forEach(e => {
      if (!m[e.date]) m[e.date] = [];
      m[e.date].push(e);
    });
    return m;
  }, [events]);

  const { year, month } = viewDate;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => setViewDate(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  const nextMonth = () => setViewDate(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });

  const selectedEvents = selected ? (eventMap[selected] || []) : [];

  // Legend items
  const legend = Object.entries(EVENT_STYLES).map(([type, s]) => ({ type, dot: s.dot }));

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {role === 'student' ? 'My Calendar' : role === 'supervisor' ? 'Schedule' : 'Academic Timeline'}
          </h3>
          <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {events.length} events this semester
          </p>
        </div>
        {/* View toggle */}
        <div className={`flex rounded-xl border overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {[
            { key: 'month',    label: 'Month' },
            { key: 'timeline', label: 'Timeline' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                view === key
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : darkMode
                    ? 'bg-gray-800 text-gray-400 hover:text-white'
                    : 'bg-white text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === 'month' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Calendar grid ── */}
          <div className={`lg:col-span-2 rounded-2xl border shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {/* Month nav */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <button onClick={prevMonth} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <ChevronLeft size={18} />
              </button>
              <h4 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {MONTHS[month]} {year}
              </h4>
              <button onClick={nextMonth} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day headers */}
            <div className={`grid grid-cols-7 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              {DAYS.map(d => (
                <div key={d} className={`py-2 text-center text-xs font-bold ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{d}</div>
              ))}
            </div>

            {/* Date cells */}
            <div className="grid grid-cols-7">
              {/* Empty leading cells */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className={`min-h-[80px] border-b border-r ${darkMode ? 'border-gray-700/50' : 'border-gray-50'}`} />
              ))}
              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day  = i + 1;
                const key  = toKey(year, month, day);
                const evts = eventMap[key] || [];
                const isToday    = key === todayKey;
                const isSelected = key === selected;

                return (
                  <div
                    key={day}
                    onClick={() => setSelected(isSelected ? null : key)}
                    className={`min-h-[80px] p-1.5 border-b border-r cursor-pointer transition-colors ${
                      darkMode ? 'border-gray-700/50' : 'border-gray-50'
                    } ${isSelected
                        ? darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'
                        : darkMode ? 'hover:bg-gray-700/40' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold mb-1 ${
                      isToday
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow'
                        : isSelected
                          ? darkMode ? 'text-indigo-400' : 'text-indigo-600'
                          : darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {evts.slice(0, 2).map(e => (
                        <EventPill key={e.id} event={e} onClick={setModalEvent} />
                      ))}
                      {evts.length > 2 && (
                        <p className={`text-xs pl-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>+{evts.length - 2} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Side panel ── */}
          <div className="space-y-4">
            {/* Legend */}
            <div className={`rounded-xl border p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h4 className={`text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Event Types</h4>
              <div className="space-y-2">
                {legend.map(({ type, dot }) => (
                  <div key={type} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                    <span className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected day events */}
            <div className={`rounded-xl border p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h4 className={`text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {selected ? `Events on ${selected}` : 'Click a date to see events'}
              </h4>
              {selectedEvents.length > 0 ? (
                <div className="space-y-2">
                  {selectedEvents.map(event => {
                    const style = EVENT_STYLES[event.type] || EVENT_STYLES.task;
                    const Icon = style.icon;
                    return (
                      <button
                        key={event.id}
                        onClick={() => setModalEvent(event)}
                        className={`w-full text-left p-3 rounded-xl border transition-all hover:shadow-sm ${style.light}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={13} />
                          <span className="text-xs font-bold capitalize">{event.type}</span>
                        </div>
                        <p className="text-xs font-semibold">{event.title}</p>
                        <p className="text-xs mt-0.5 opacity-75 truncate">{event.desc}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  {selected ? 'No events on this date' : 'Select a highlighted date'}
                </p>
              )}
            </div>

            {/* Upcoming events (next 4) */}
            <div className={`rounded-xl border p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h4 className={`text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Coming Up</h4>
              <div className="space-y-2.5">
                {events
                  .filter(e => e.date >= todayKey)
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .slice(0, 4)
                  .map(event => {
                    const style = EVENT_STYLES[event.type] || EVENT_STYLES.task;
                    return (
                      <button
                        key={event.id}
                        onClick={() => setModalEvent(event)}
                        className="w-full text-left flex items-start gap-2.5 hover:opacity-80 transition-opacity"
                      >
                        <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-medium truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{event.title}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{event.date}</p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Timeline view ── */
        <div className={`rounded-2xl border shadow-sm p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <TimelineView events={events} darkMode={darkMode} onEventClick={setModalEvent} />
        </div>
      )}

      {/* ── Event detail modal ── */}
      <EventModal event={modalEvent} onClose={() => setModalEvent(null)} darkMode={darkMode} />
    </div>
  );
};

export default CalendarView;