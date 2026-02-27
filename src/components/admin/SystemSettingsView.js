import React, { useState } from 'react';
import {
  Settings, Bell, Shield, BookOpen, Save, RotateCcw,
  CheckCircle, Globe, Clock, Mail, AlertTriangle, Lock,
  Eye, EyeOff, ToggleLeft, ToggleRight, ChevronRight, Info
} from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'academic', label: 'Academic', icon: BookOpen },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

// ── Reusable field components ─────────────────────────────────────────────────
const Toggle = ({ value, onChange, darkMode }) => (
  <button
    onClick={() => onChange(!value)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-indigo-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
  >
    <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const SettingRow = ({ label, description, children, darkMode }) => (
  <div className={`flex items-center justify-between py-4 border-b last:border-0 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
    <div className="flex-1 mr-8">
      <p className="text-sm font-semibold">{label}</p>
      {description && <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>}
    </div>
    {children}
  </div>
);

const SectionTitle = ({ children, darkMode }) => (
  <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{children}</h3>
);

// ── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, onDone }) => {
  React.useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl animate-pulse">
      <CheckCircle size={18} className="text-green-400" />
      <span className="text-sm font-medium">{msg}</span>
    </div>
  );
};

// ── GeneralSettings ───────────────────────────────────────────────────────────
const GeneralSettings = ({ darkMode }) => {
  const [s, setS] = useState({
    universityName: 'Babcock University',
    systemName: 'FYP Management System',
    academicYear: '2024/2025',
    timezone: 'Africa/Lagos',
    dateFormat: 'DD/MM/YYYY',
    language: 'English',
    maintenanceMode: false,
    allowRegistration: true,
    maxFileSize: '10',
    allowedFileTypes: 'pdf, docx, doc, pptx, xlsx',
  });
  const [toast, setToast] = useState(false);

  const set = (k, v) => setS(p => ({ ...p, [k]: v }));
  const inp = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
    darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-200 text-gray-900'
  }`;
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  return (
    <div className="space-y-6">
      {toast && <Toast msg="Settings saved successfully!" onDone={() => setToast(false)} />}

      {/* Institution */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <SectionTitle darkMode={darkMode}>Institution</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>University Name</label>
            <input className={inp} value={s.universityName} onChange={e => set('universityName', e.target.value)} />
          </div>
          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>System Name</label>
            <input className={inp} value={s.systemName} onChange={e => set('systemName', e.target.value)} />
          </div>
          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Academic Year</label>
            <input className={inp} value={s.academicYear} onChange={e => set('academicYear', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Localisation */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <SectionTitle darkMode={darkMode}>Localisation</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Timezone</label>
            <select className={inp} value={s.timezone} onChange={e => set('timezone', e.target.value)}>
              {['Africa/Lagos', 'UTC', 'Europe/London', 'America/New_York'].map(tz => <option key={tz}>{tz}</option>)}
            </select>
          </div>
          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date Format</label>
            <select className={inp} value={s.dateFormat} onChange={e => set('dateFormat', e.target.value)}>
              {['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Language</label>
            <select className={inp} value={s.language} onChange={e => set('language', e.target.value)}>
              {['English', 'French', 'Arabic'].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* System */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <SectionTitle darkMode={darkMode}>System</SectionTitle>
        <SettingRow label="Maintenance Mode" description="Prevent non-admin logins during maintenance" darkMode={darkMode}>
          <Toggle value={s.maintenanceMode} onChange={v => set('maintenanceMode', v)} darkMode={darkMode} />
        </SettingRow>
        <SettingRow label="Allow New Registrations" description="Let new students and supervisors register" darkMode={darkMode}>
          <Toggle value={s.allowRegistration} onChange={v => set('allowRegistration', v)} darkMode={darkMode} />
        </SettingRow>
        <SettingRow label="Max Upload File Size" description="Maximum size per uploaded file" darkMode={darkMode}>
          <div className="flex items-center gap-2">
            <input className={`${inp} w-20 text-center`} value={s.maxFileSize} onChange={e => set('maxFileSize', e.target.value)} />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>MB</span>
          </div>
        </SettingRow>
        <SettingRow label="Allowed File Types" description="Comma-separated list of accepted extensions" darkMode={darkMode}>
          <input className={`${inp} w-64`} value={s.allowedFileTypes} onChange={e => set('allowedFileTypes', e.target.value)} />
        </SettingRow>
      </div>

      <div className="flex justify-end gap-3">
        <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <RotateCcw size={14} /> Reset
        </button>
        <button onClick={() => setToast(true)} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition">
          <Save size={14} /> Save Changes
        </button>
      </div>
    </div>
  );
};

// ── AcademicSettings ──────────────────────────────────────────────────────────
const AcademicSettings = ({ darkMode }) => {
  const [s, setS] = useState({
    proposalDeadline: '2025-09-30',
    chapter1Deadline: '2025-10-31',
    chapter2Deadline: '2025-11-15',
    draftDeadline: '2025-11-30',
    finalDeadline: '2025-12-15',
    defenseStart: '2026-01-10',
    defenseEnd: '2026-01-20',
    maxStudentsPerSupervisor: 5,
    allowSupervisorChange: false,
    autoAssignSupervisor: false,
    requireProposalApproval: true,
    gradeWeights: { proposal: 10, chapters: 50, presentation: 20, viva: 20 },
    passGrade: 50,
    departments: 'Computer Science, Engineering, Information Systems',
  });
  const [toast, setToast] = useState(false);
  const set = (k, v) => setS(p => ({ ...p, [k]: v }));
  const inp = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
    darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-200 text-gray-900'
  }`;
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  const totalWeight = Object.values(s.gradeWeights).reduce((a, b) => a + Number(b), 0);

  return (
    <div className="space-y-6">
      {toast && <Toast msg="Academic settings saved!" onDone={() => setToast(false)} />}

      {/* Deadlines */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <SectionTitle darkMode={darkMode}>Academic Calendar</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'proposalDeadline', label: 'Proposal Submission Deadline' },
            { key: 'chapter1Deadline', label: 'Chapter 1 Deadline' },
            { key: 'chapter2Deadline', label: 'Chapter 2 Deadline' },
            { key: 'draftDeadline', label: 'Full Draft Deadline' },
            { key: 'finalDeadline', label: 'Final Submission Deadline' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</label>
              <input type="date" className={inp} value={s[key]} onChange={e => set(key, e.target.value)} />
            </div>
          ))}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Defence Period</label>
            <div className="flex items-center gap-2">
              <input type="date" className={inp} value={s.defenseStart} onChange={e => set('defenseStart', e.target.value)} />
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`}>to</span>
              <input type="date" className={inp} value={s.defenseEnd} onChange={e => set('defenseEnd', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Supervision rules */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <SectionTitle darkMode={darkMode}>Supervision Rules</SectionTitle>
        <SettingRow label="Max Students per Supervisor" description="Hard limit on supervisor capacity" darkMode={darkMode}>
          <div className="flex items-center gap-2">
            <button onClick={() => set('maxStudentsPerSupervisor', Math.max(1, s.maxStudentsPerSupervisor - 1))} className={`w-8 h-8 rounded-lg text-lg font-bold flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>−</button>
            <span className="w-8 text-center text-sm font-bold">{s.maxStudentsPerSupervisor}</span>
            <button onClick={() => set('maxStudentsPerSupervisor', s.maxStudentsPerSupervisor + 1)} className={`w-8 h-8 rounded-lg text-lg font-bold flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>+</button>
          </div>
        </SettingRow>
        <SettingRow label="Allow Supervisor Changes" description="Students can request a different supervisor" darkMode={darkMode}>
          <Toggle value={s.allowSupervisorChange} onChange={v => set('allowSupervisorChange', v)} darkMode={darkMode} />
        </SettingRow>
        <SettingRow label="Auto-assign Supervisors" description="Automatically assign based on department and capacity" darkMode={darkMode}>
          <Toggle value={s.autoAssignSupervisor} onChange={v => set('autoAssignSupervisor', v)} darkMode={darkMode} />
        </SettingRow>
        <SettingRow label="Require Proposal Approval" description="Projects can only proceed after proposal is approved" darkMode={darkMode}>
          <Toggle value={s.requireProposalApproval} onChange={v => set('requireProposalApproval', v)} darkMode={darkMode} />
        </SettingRow>
      </div>

      {/* Grading */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <SectionTitle darkMode={darkMode}>Grading Weights</SectionTitle>
        <div className="space-y-3 mb-4">
          {Object.entries(s.gradeWeights).map(([key, val]) => (
            <div key={key} className="flex items-center gap-4">
              <label className="text-sm font-medium capitalize w-36">{key === 'chapters' ? 'Chapters (1–3)' : key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <div className={`flex-1 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${val}%` }} />
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number" min={0} max={100}
                  className={`w-16 px-2 py-1 text-center rounded-lg border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-200'}`}
                  value={val}
                  onChange={e => set('gradeWeights', { ...s.gradeWeights, [key]: Number(e.target.value) })}
                />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>%</span>
              </div>
            </div>
          ))}
        </div>
        <div className={`flex items-center gap-2 text-sm p-3 rounded-xl ${totalWeight !== 100 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
          {totalWeight !== 100 ? <AlertTriangle size={15} /> : <CheckCircle size={15} />}
          <span className="font-semibold">Total: {totalWeight}%</span>
          {totalWeight !== 100 && <span className="text-xs">— weights must sum to 100%</span>}
        </div>
        <div className="mt-4">
          <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pass Grade (%)</label>
          <div className="flex items-center gap-3">
            <input type="number" min={0} max={100} className={`${inp} w-24`} value={s.passGrade} onChange={e => set('passGrade', Number(e.target.value))} />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Students below this are flagged for review</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <RotateCcw size={14} /> Reset
        </button>
        <button onClick={() => setToast(true)} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition">
          <Save size={14} /> Save Changes
        </button>
      </div>
    </div>
  );
};

// ── NotificationSettings ──────────────────────────────────────────────────────
const NotificationSettings = ({ darkMode }) => {
  const [s, setS] = useState({
    emailDeadlineReminder: true,
    emailSubmissionAlert: true,
    emailFeedbackNotif: true,
    emailWeeklyDigest: false,
    emailSystemUpdates: true,
    smsDeadlineReminder: false,
    smsUrgentAlerts: false,
    inAppAll: true,
    reminderDaysBefore: 3,
    emailSender: 'noreply@babcock.edu.ng',
    emailFooter: 'Babcock University FYP Management System',
    digestDay: 'Monday',
  });
  const [toast, setToast] = useState(false);
  const set = (k, v) => setS(p => ({ ...p, [k]: v }));
  const inp = `px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
    darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-200 text-gray-900'
  }`;
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  return (
    <div className="space-y-6">
      {toast && <Toast msg="Notification preferences saved!" onDone={() => setToast(false)} />}

      {/* Email */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <SectionTitle darkMode={darkMode}>Email Notifications</SectionTitle>
        {[
          { key: 'emailDeadlineReminder', label: 'Deadline Reminders', desc: 'Remind students before upcoming deadlines' },
          { key: 'emailSubmissionAlert', label: 'Submission Alerts', desc: 'Notify supervisors when a document is submitted' },
          { key: 'emailFeedbackNotif', label: 'Feedback Notifications', desc: 'Notify students when feedback is given' },
          { key: 'emailWeeklyDigest', label: 'Weekly Digest', desc: 'Send a weekly summary to all users' },
          { key: 'emailSystemUpdates', label: 'System Updates', desc: 'System-wide announcements and maintenance notices' },
        ].map(({ key, label, desc }) => (
          <SettingRow key={key} label={label} description={desc} darkMode={darkMode}>
            <Toggle value={s[key]} onChange={v => set(key, v)} darkMode={darkMode} />
          </SettingRow>
        ))}
      </div>

      {/* SMS */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <SectionTitle darkMode={darkMode}>SMS Notifications</SectionTitle>
        <div className={`flex items-center gap-2 text-xs p-3 rounded-xl mb-4 ${darkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
          <Info size={14} /> SMS requires an external gateway (e.g. Termii). Configure API key in Security settings.
        </div>
        <SettingRow label="Deadline Reminders via SMS" desc="Text students 24h before key deadlines" darkMode={darkMode}>
          <Toggle value={s.smsDeadlineReminder} onChange={v => set('smsDeadlineReminder', v)} darkMode={darkMode} />
        </SettingRow>
        <SettingRow label="Urgent Alerts via SMS" desc="Critical system alerts and final deadline warnings" darkMode={darkMode}>
          <Toggle value={s.smsUrgentAlerts} onChange={v => set('smsUrgentAlerts', v)} darkMode={darkMode} />
        </SettingRow>
      </div>

      {/* In-app */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <SectionTitle darkMode={darkMode}>In-App Notifications</SectionTitle>
        <SettingRow label="Enable In-App Notifications" description="Show notification badges and the notification panel" darkMode={darkMode}>
          <Toggle value={s.inAppAll} onChange={v => set('inAppAll', v)} darkMode={darkMode} />
        </SettingRow>
      </div>

      {/* Config */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <SectionTitle darkMode={darkMode}>Email Configuration</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sender Email Address</label>
            <input className={`${inp} w-full`} value={s.emailSender} onChange={e => set('emailSender', e.target.value)} />
          </div>
          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reminder Days Before Deadline</label>
            <div className="flex items-center gap-2">
              <input type="number" min={1} max={14} className={`${inp} w-20 text-center`} value={s.reminderDaysBefore} onChange={e => set('reminderDaysBefore', Number(e.target.value))} />
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>days</span>
            </div>
          </div>
          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Weekly Digest Day</label>
            <select className={`${inp} w-full`} value={s.digestDay} onChange={e => set('digestDay', e.target.value)}>
              {['Monday','Tuesday','Wednesday','Thursday','Friday'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email Footer Text</label>
            <input className={`${inp} w-full`} value={s.emailFooter} onChange={e => set('emailFooter', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <RotateCcw size={14} /> Reset
        </button>
        <button onClick={() => setToast(true)} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition">
          <Save size={14} /> Save Changes
        </button>
      </div>
    </div>
  );
};

// ── SecuritySettings ──────────────────────────────────────────────────────────
const SecuritySettings = ({ darkMode }) => {
  const [s, setS] = useState({
    requireStrongPasswords: true,
    minPasswordLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    allowMultipleSessions: false,
    auditLogging: true,
    ipWhitelist: '',
    apiKey: 'sk-babcock-fyp-••••••••••••••••',
    smsApiKey: '',
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [toast, setToast] = useState(false);
  const set = (k, v) => setS(p => ({ ...p, [k]: v }));
  const inp = `px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
    darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-200 text-gray-900'
  }`;
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  const auditLog = [
    { action: 'User login', user: 'Admin User', time: '2 mins ago', type: 'info' },
    { action: 'Project status changed', user: 'Dr. Sarah Johnson', time: '15 mins ago', type: 'info' },
    { action: 'Failed login attempt', user: 'unknown@mail.com', time: '1 hour ago', type: 'warn' },
    { action: 'New user registered', user: 'System', time: '3 hours ago', type: 'info' },
    { action: 'System settings updated', user: 'Admin User', time: '1 day ago', type: 'info' },
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast msg="Security settings saved!" onDone={() => setToast(false)} />}

      {/* Password */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <SectionTitle darkMode={darkMode}>Password Policy</SectionTitle>
        <SettingRow label="Require Strong Passwords" description="Enforce uppercase, numbers, and special characters" darkMode={darkMode}>
          <Toggle value={s.requireStrongPasswords} onChange={v => set('requireStrongPasswords', v)} darkMode={darkMode} />
        </SettingRow>
        <SettingRow label="Minimum Password Length" description="Minimum number of characters required" darkMode={darkMode}>
          <div className="flex items-center gap-2">
            <button onClick={() => set('minPasswordLength', Math.max(6, s.minPasswordLength - 1))} className={`w-8 h-8 rounded-lg text-lg font-bold flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>−</button>
            <span className="w-8 text-center text-sm font-bold">{s.minPasswordLength}</span>
            <button onClick={() => set('minPasswordLength', Math.min(24, s.minPasswordLength + 1))} className={`w-8 h-8 rounded-lg text-lg font-bold flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>+</button>
          </div>
        </SettingRow>
      </div>

      {/* Session */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <SectionTitle darkMode={darkMode}>Session & Access</SectionTitle>
        <SettingRow label="Session Timeout" description="Auto-logout after inactivity" darkMode={darkMode}>
          <div className="flex items-center gap-2">
            <select className={`${inp}`} value={s.sessionTimeout} onChange={e => set('sessionTimeout', Number(e.target.value))}>
              {[15, 30, 60, 120, 240].map(m => <option key={m} value={m}>{m} mins</option>)}
            </select>
          </div>
        </SettingRow>
        <SettingRow label="Max Failed Login Attempts" description="Lock account after this many consecutive failures" darkMode={darkMode}>
          <div className="flex items-center gap-2">
            <button onClick={() => set('maxLoginAttempts', Math.max(3, s.maxLoginAttempts - 1))} className={`w-8 h-8 rounded-lg text-lg font-bold flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>−</button>
            <span className="w-8 text-center text-sm font-bold">{s.maxLoginAttempts}</span>
            <button onClick={() => set('maxLoginAttempts', Math.min(10, s.maxLoginAttempts + 1))} className={`w-8 h-8 rounded-lg text-lg font-bold flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>+</button>
          </div>
        </SettingRow>
        <SettingRow label="Two-Factor Authentication" description="Require 2FA for all admin accounts" darkMode={darkMode}>
          <Toggle value={s.twoFactorAuth} onChange={v => set('twoFactorAuth', v)} darkMode={darkMode} />
        </SettingRow>
        <SettingRow label="Allow Multiple Sessions" description="Users can be logged in on multiple devices" darkMode={darkMode}>
          <Toggle value={s.allowMultipleSessions} onChange={v => set('allowMultipleSessions', v)} darkMode={darkMode} />
        </SettingRow>
        <SettingRow label="Audit Logging" description="Record all user actions for security review" darkMode={darkMode}>
          <Toggle value={s.auditLogging} onChange={v => set('auditLogging', v)} darkMode={darkMode} />
        </SettingRow>
      </div>

      {/* API keys */}
      <div className={`rounded-2xl border p-6 ${card}`}>
        <SectionTitle darkMode={darkMode}>API Keys</SectionTitle>
        <div className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>System API Key</label>
            <div className="flex gap-2">
              <input type={showApiKey ? 'text' : 'password'} className={`${inp} flex-1`} value={s.apiKey} readOnly />
              <button onClick={() => setShowApiKey(v => !v)} className={`px-3 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                {showApiKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>SMS Gateway API Key (Termii)</label>
            <input className={`${inp} w-full`} placeholder="Enter your Termii API key" value={s.smsApiKey} onChange={e => set('smsApiKey', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Audit log */}
      {s.auditLogging && (
        <div className={`rounded-2xl border p-6 ${card}`}>
          <SectionTitle darkMode={darkMode}>Recent Audit Log</SectionTitle>
          <div className="space-y-2">
            {auditLog.map((log, i) => (
              <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${log.type === 'warn' ? 'bg-amber-500' : 'bg-green-500'}`} />
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>by {log.user}</p>
                  </div>
                </div>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <RotateCcw size={14} /> Reset
        </button>
        <button onClick={() => setToast(true)} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition">
          <Save size={14} /> Save Changes
        </button>
      </div>
    </div>
  );
};

// ── Main SystemSettingsView ───────────────────────────────────────────────────
const SystemSettingsView = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState('general');
  const bg = darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';
  const sub = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen ${bg}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">System Settings</h1>
        <p className={`text-sm ${sub}`}>Configure system-wide preferences for the FYP Management System</p>
      </div>

      <div className="flex gap-6">
        {/* Tab sidebar */}
        <div className="flex-shrink-0 w-52">
          <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition border-b last:border-0 ${
                  darkMode ? 'border-gray-700' : 'border-gray-100'
                } ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab !== tab.id && <ChevronRight size={14} className="ml-auto opacity-40" />}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'general' && <GeneralSettings darkMode={darkMode} />}
          {activeTab === 'academic' && <AcademicSettings darkMode={darkMode} />}
          {activeTab === 'notifications' && <NotificationSettings darkMode={darkMode} />}
          {activeTab === 'security' && <SecuritySettings darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsView;