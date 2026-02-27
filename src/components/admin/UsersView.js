import React, { useState } from 'react';
import {
  Users, Search, Filter, Plus, Edit2, Trash2, X, Check,
  ChevronDown, Mail, Phone, BookOpen, Award, MoreVertical,
  UserCheck, UserX, Download, Upload, Eye, Shield
} from 'lucide-react';

const INITIAL_USERS = [
  // Students
  { id: 1, name: 'John Doe', email: 'john.doe@babcock.edu.ng', role: 'student', department: 'Computer Science', status: 'active', matric: 'BU/21/CS/001', supervisor: 'Dr. Sarah Johnson', projectTitle: 'AI-Powered Healthcare Diagnosis System', progress: 65, phone: '+234 801 234 5678', enrolledYear: 2021 },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@babcock.edu.ng', role: 'student', department: 'Computer Science', status: 'active', matric: 'BU/21/CS/002', supervisor: 'Dr. Sarah Johnson', projectTitle: 'Blockchain-Based Voting System', progress: 45, phone: '+234 802 345 6789', enrolledYear: 2021 },
  { id: 3, name: 'Mike Wilson', email: 'mike.wilson@babcock.edu.ng', role: 'student', department: 'Engineering', status: 'active', matric: 'BU/21/ENG/001', supervisor: 'Prof. Michael Brown', projectTitle: 'IoT Smart Agriculture Platform', progress: 20, phone: '+234 803 456 7890', enrolledYear: 2021 },
  { id: 4, name: 'Sarah Lee', email: 'sarah.lee@babcock.edu.ng', role: 'student', department: 'Computer Science', status: 'active', matric: 'BU/21/CS/003', supervisor: 'Dr. Emily Davis', projectTitle: 'Mobile Banking App', progress: 80, phone: '+234 804 567 8901', enrolledYear: 2021 },
  { id: 5, name: 'Alex Kim', email: 'alex.kim@babcock.edu.ng', role: 'student', department: 'Engineering', status: 'inactive', matric: 'BU/21/ENG/002', supervisor: 'Prof. Michael Brown', projectTitle: 'Smart Traffic System', progress: 50, phone: '+234 805 678 9012', enrolledYear: 2021 },
  { id: 6, name: 'Chioma Okafor', email: 'chioma.okafor@babcock.edu.ng', role: 'student', department: 'Information Systems', status: 'active', matric: 'BU/21/IS/001', supervisor: 'Dr. Sarah Johnson', projectTitle: 'E-Learning Platform with AR', progress: 55, phone: '+234 806 789 0123', enrolledYear: 2021 },
  { id: 7, name: 'Emeka Nwosu', email: 'emeka.nwosu@babcock.edu.ng', role: 'student', department: 'Computer Science', status: 'active', matric: 'BU/21/CS/004', supervisor: 'Dr. Emily Davis', projectTitle: 'Cybersecurity Threat Detection', progress: 35, phone: '+234 807 890 1234', enrolledYear: 2021 },
  { id: 8, name: 'Fatima Abdullahi', email: 'fatima.abdullahi@babcock.edu.ng', role: 'student', department: 'Information Systems', status: 'suspended', matric: 'BU/21/IS/002', supervisor: 'Prof. Michael Brown', projectTitle: 'Supply Chain Analytics', progress: 10, phone: '+234 808 901 2345', enrolledYear: 2021 },

  // Supervisors
  { id: 9, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@babcock.edu.ng', role: 'supervisor', department: 'Computer Science', status: 'active', staffId: 'BU/STAFF/CS/011', studentsCount: 3, specialisation: 'AI & Machine Learning', phone: '+234 809 012 3456', joinedYear: 2015 },
  { id: 10, name: 'Prof. Michael Brown', email: 'michael.brown@babcock.edu.ng', role: 'supervisor', department: 'Engineering', status: 'active', staffId: 'BU/STAFF/ENG/007', studentsCount: 3, specialisation: 'IoT & Embedded Systems', phone: '+234 810 123 4567', joinedYear: 2012 },
  { id: 11, name: 'Dr. Emily Davis', email: 'emily.davis@babcock.edu.ng', role: 'supervisor', department: 'Computer Science', status: 'active', staffId: 'BU/STAFF/CS/015', studentsCount: 2, specialisation: 'Software Engineering', phone: '+234 811 234 5678', joinedYear: 2018 },
  { id: 12, name: 'Dr. Adebayo Ogundimu', email: 'adebayo.ogundimu@babcock.edu.ng', role: 'supervisor', department: 'Information Systems', status: 'active', staffId: 'BU/STAFF/IS/004', studentsCount: 1, specialisation: 'Data Analytics', phone: '+234 812 345 6789', joinedYear: 2016 },
  { id: 13, name: 'Prof. Ngozi Eze', email: 'ngozi.eze@babcock.edu.ng', role: 'supervisor', department: 'Engineering', status: 'inactive', staffId: 'BU/STAFF/ENG/003', studentsCount: 0, specialisation: 'Robotics & Automation', phone: '+234 813 456 7890', joinedYear: 2010 },
];

const DEPARTMENTS = ['All Departments', 'Computer Science', 'Engineering', 'Information Systems'];
const ROLES = ['All Roles', 'student', 'supervisor'];
const STATUSES = ['All Statuses', 'active', 'inactive', 'suspended'];

const statusConfig = {
  active: { label: 'Active', bg: 'bg-green-100', text: 'text-green-700', darkBg: 'dark:bg-green-900/30', darkText: 'dark:text-green-400' },
  inactive: { label: 'Inactive', bg: 'bg-gray-100', text: 'text-gray-600', darkBg: 'dark:bg-gray-700', darkText: 'dark:text-gray-400' },
  suspended: { label: 'Suspended', bg: 'bg-red-100', text: 'text-red-700', darkBg: 'dark:bg-red-900/30', darkText: 'dark:text-red-400' },
};

const avatarColors = [
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-amber-500 to-orange-500',
  'from-teal-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-blue-500 to-indigo-500',
];

const getAvatarColor = (id) => avatarColors[id % avatarColors.length];
const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

// ── Add/Edit Modal ────────────────────────────────────────────────────────────
const UserModal = ({ user, onClose, onSave, darkMode }) => {
  const isEdit = !!user?.id;
  const [form, setForm] = useState(user || {
    name: '', email: '', phone: '', role: 'student', department: 'Computer Science', status: 'active',
    matric: '', supervisor: '', projectTitle: '', staffId: '', specialisation: '', enrolledYear: new Date().getFullYear(), studentsCount: 0,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const bg = darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900';
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
    darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
  }`;
  const labelCls = `block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl ${bg} max-h-[90vh] overflow-y-auto`}>
        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className="text-lg font-bold">{isEdit ? 'Edit User' : 'Add New User'}</h2>
          <button onClick={onClose} className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Role selector */}
          <div>
            <label className={labelCls}>Role</label>
            <div className="flex gap-3">
              {['student', 'supervisor'].map(r => (
                <button key={r} onClick={() => set('role', r)}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-semibold capitalize transition ${
                    form.role === r
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : darkMode ? 'border-gray-600 text-gray-400 hover:border-gray-500' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Full Name</label><input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. John Doe" /></div>
            <div><label className={labelCls}>Email</label><input className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} placeholder="user@babcock.edu.ng" /></div>
            <div><label className={labelCls}>Phone</label><input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+234 800 000 0000" /></div>
            <div>
              <label className={labelCls}>Department</label>
              <select className={inputCls} value={form.department} onChange={e => set('department', e.target.value)}>
                {DEPARTMENTS.slice(1).map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.slice(1).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {form.role === 'student' ? (
              <>
                <div><label className={labelCls}>Matric Number</label><input className={inputCls} value={form.matric} onChange={e => set('matric', e.target.value)} placeholder="BU/21/CS/001" /></div>
                <div><label className={labelCls}>Assigned Supervisor</label><input className={inputCls} value={form.supervisor} onChange={e => set('supervisor', e.target.value)} placeholder="Dr. Name" /></div>
                <div className="col-span-2"><label className={labelCls}>Project Title</label><input className={inputCls} value={form.projectTitle} onChange={e => set('projectTitle', e.target.value)} placeholder="Project title" /></div>
              </>
            ) : (
              <>
                <div><label className={labelCls}>Staff ID</label><input className={inputCls} value={form.staffId} onChange={e => set('staffId', e.target.value)} placeholder="BU/STAFF/CS/001" /></div>
                <div className="col-span-2"><label className={labelCls}>Specialisation</label><input className={inputCls} value={form.specialisation} onChange={e => set('specialisation', e.target.value)} placeholder="e.g. AI & Machine Learning" /></div>
              </>
            )}
          </div>
        </div>
        <div className={`flex justify-end gap-3 p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button onClick={onClose} className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>Cancel</button>
          <button onClick={() => onSave(form)} className="px-6 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition">
            {isEdit ? 'Save Changes' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Detail Drawer ─────────────────────────────────────────────────────────────
const UserDrawer = ({ user, onClose, onEdit, onToggleStatus, darkMode }) => {
  if (!user) return null;
  const st = statusConfig[user.status];
  const bg = darkMode ? 'bg-gray-800' : 'bg-white';
  const sub = darkMode ? 'text-gray-400' : 'text-gray-500';
  const divider = darkMode ? 'border-gray-700' : 'border-gray-200';
  const card = darkMode ? 'bg-gray-700/50' : 'bg-gray-50';

  const Field = ({ label, value }) => (
    <div>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${sub}`}>{label}</p>
      <p className="text-sm font-medium">{value || '—'}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md h-full ${bg} shadow-2xl flex flex-col overflow-y-auto`}>
        {/* Header */}
        <div className={`p-6 border-b ${divider}`}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}><X size={18} /></button>
            <div className="flex gap-2">
              <button onClick={() => onEdit(user)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition">
                <Edit2 size={14} /> Edit
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getAvatarColor(user.id)} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
              {getInitials(user.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className={`text-sm ${sub} capitalize`}>{user.role} · {user.department}</p>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>{st.label}</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className={`p-6 border-b ${divider} space-y-4`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500">Contact Information</h3>
          <div className={`rounded-xl p-4 space-y-3 ${card}`}>
            <div className="flex items-center gap-3">
              <Mail size={15} className={sub} />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={15} className={sub} />
              <span className="text-sm">{user.phone}</span>
            </div>
          </div>
        </div>

        {/* Role-specific info */}
        <div className="p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500">Academic Details</h3>
          <div className={`rounded-xl p-4 grid grid-cols-2 gap-4 ${card}`}>
            {user.role === 'student' ? (
              <>
                <Field label="Matric No." value={user.matric} />
                <Field label="Enrolled" value={user.enrolledYear} />
                <div className="col-span-2"><Field label="Supervisor" value={user.supervisor} /></div>
                <div className="col-span-2"><Field label="Project" value={user.projectTitle} /></div>
                <div className="col-span-2">
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${sub}`}>Progress</p>
                  <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all" style={{ width: `${user.progress}%` }} />
                  </div>
                  <p className="text-sm font-semibold mt-1">{user.progress}%</p>
                </div>
              </>
            ) : (
              <>
                <Field label="Staff ID" value={user.staffId} />
                <Field label="Joined" value={user.joinedYear} />
                <div className="col-span-2"><Field label="Specialisation" value={user.specialisation} /></div>
                <div className="col-span-2">
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${sub}`}>Students Supervised</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>{user.studentsCount}</div>
                    <span className={`text-sm ${sub}`}>active student{user.studentsCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={`mt-auto p-6 border-t ${divider} space-y-2`}>
          <button
            onClick={() => onToggleStatus(user)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition ${
              user.status === 'active'
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {user.status === 'active' ? <><UserX size={16} /> Deactivate Account</> : <><UserCheck size={16} /> Activate Account</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main UsersView ────────────────────────────────────────────────────────────
const UsersView = ({ darkMode }) => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalUser, setModalUser] = useState(null); // null=closed, {}=add, {...}=edit
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const bg = darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputCls = `px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
    darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
  }`;
  const sub = darkMode ? 'text-gray-400' : 'text-gray-500';
  const hover = darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50';

  const filtered = users
    .filter(u => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.matric || '').toLowerCase().includes(q) || (u.staffId || '').toLowerCase().includes(q);
      const matchRole = roleFilter === 'All Roles' || u.role === roleFilter;
      const matchDept = deptFilter === 'All Departments' || u.department === deptFilter;
      const matchStatus = statusFilter === 'All Statuses' || u.status === statusFilter;
      return matchSearch && matchRole && matchDept && matchStatus;
    })
    .sort((a, b) => {
      let av = a[sortBy] || '', bv = b[sortBy] || '';
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const students = users.filter(u => u.role === 'student');
  const supervisors = users.filter(u => u.role === 'supervisor');
  const activeCount = users.filter(u => u.status === 'active').length;

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const handleSave = (form) => {
    if (form.id) {
      setUsers(us => us.map(u => u.id === form.id ? { ...u, ...form } : u));
    } else {
      setUsers(us => [...us, { ...form, id: Date.now(), progress: 0, studentsCount: 0 }]);
    }
    setModalUser(null);
  };

  const handleToggleStatus = (user) => {
    const next = user.status === 'active' ? 'inactive' : 'active';
    setUsers(us => us.map(u => u.id === user.id ? { ...u, status: next } : u));
    setSelectedUser(u => u ? { ...u, status: next } : null);
  };

  const handleDelete = (id) => {
    setUsers(us => us.filter(u => u.id !== id));
    setSelectedUser(null);
  };

  const SortIcon = ({ col }) => (
    <span className={`ml-1 text-xs ${sortBy === col ? 'text-indigo-400' : sub}`}>
      {sortBy === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  const Th = ({ col, label, cls = '' }) => (
    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none ${sub} ${cls}`} onClick={() => handleSort(col)}>
      {label}<SortIcon col={col} />
    </th>
  );

  return (
    <div className={`min-h-screen ${bg}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">User Management</h1>
        <p className={`text-sm ${sub}`}>Manage students, supervisors, and their accounts</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'from-indigo-500 to-purple-500' },
          { label: 'Students', value: students.length, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
          { label: 'Supervisors', value: supervisors.length, icon: Award, color: 'from-amber-500 to-orange-500' },
          { label: 'Active', value: activeCount, icon: UserCheck, color: 'from-green-500 to-emerald-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`rounded-2xl border p-4 flex items-center gap-4 ${card}`}>
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
              <Icon size={20} />
            </div>
            <div>
              <p className={`text-xs font-semibold ${sub}`}>{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={`rounded-2xl border p-4 mb-4 ${card}`}>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${sub}`} />
            <input
              className={`${inputCls} pl-9 w-full`}
              placeholder="Search by name, email, matric…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${
              showFilters
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter size={15} /> Filters {showFilters && <X size={13} />}
          </button>

          <button
            onClick={() => setModalUser({})}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition ml-auto"
          >
            <Plus size={15} /> Add User
          </button>
        </div>

        {/* Filter row */}
        {showFilters && (
          <div className={`flex flex-wrap gap-3 mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {[
              { label: 'Role', options: ROLES, value: roleFilter, set: setRoleFilter },
              { label: 'Department', options: DEPARTMENTS, value: deptFilter, set: setDeptFilter },
              { label: 'Status', options: STATUSES, value: statusFilter, set: setStatusFilter },
            ].map(({ label, options, value, set }) => (
              <div key={label} className="flex items-center gap-2">
                <label className={`text-xs font-semibold ${sub}`}>{label}:</label>
                <select className={`${inputCls} py-1.5`} value={value} onChange={e => set(e.target.value)}>
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <button
              onClick={() => { setRoleFilter('All Roles'); setDeptFilter('All Departments'); setStatusFilter('All Statuses'); setSearch(''); }}
              className={`text-xs font-semibold text-indigo-500 hover:text-indigo-600 ml-auto`}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results count */}
      <p className={`text-xs font-semibold mb-3 ${sub}`}>
        Showing <span className="text-indigo-500">{filtered.length}</span> of {users.length} users
      </p>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden ${card}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
              <tr>
                <Th col="name" label="User" />
                <Th col="role" label="Role" />
                <Th col="department" label="Department" />
                <Th col="status" label="Status" />
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>ID / Matric</th>
                <th className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${sub}`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`py-16 text-center ${sub}`}>
                    <Users size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No users found</p>
                    <p className="text-xs mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : filtered.map(user => {
                const st = statusConfig[user.status];
                return (
                  <tr
                    key={user.id}
                    className={`${hover} cursor-pointer transition-colors`}
                    onClick={() => setSelectedUser(user)}
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarColor(user.id)} flex items-center justify-center text-white text-xs font-bold shadow`}>
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className={`text-xs ${sub}`}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        user.role === 'supervisor'
                          ? darkMode ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-50 text-amber-700'
                          : darkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {user.role === 'supervisor' ? <Award size={11} /> : <BookOpen size={11} />}
                        {user.role}
                      </span>
                    </td>
                    {/* Dept */}
                    <td className={`px-4 py-3 text-sm ${sub}`}>{user.department}</td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>{st.label}</span>
                    </td>
                    {/* ID */}
                    <td className={`px-4 py-3 text-xs font-mono ${sub}`}>{user.matric || user.staffId || '—'}</td>
                    {/* Actions */}
                    <td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setSelectedUser(user)} className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition`} title="View"><Eye size={14} /></button>
                        <button onClick={() => setModalUser(user)} className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition`} title="Edit"><Edit2 size={14} /></button>
                        <button onClick={() => handleToggleStatus(user)} className={`p-1.5 rounded-lg transition ${user.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`} title={user.status === 'active' ? 'Deactivate' : 'Activate'}>
                          {user.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modalUser !== null && (
        <UserModal
          user={modalUser?.id ? modalUser : null}
          onClose={() => setModalUser(null)}
          onSave={handleSave}
          darkMode={darkMode}
        />
      )}
      {selectedUser && (
        <UserDrawer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onEdit={u => { setSelectedUser(null); setModalUser(u); }}
          onToggleStatus={handleToggleStatus}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default UsersView;