import React, { useState } from 'react';
import { FileText, Eye, EyeOff, ChevronDown } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState('student');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [localShowPassword, setLocalShowPassword] = useState(false);

  const roleOptions = [
    { value: 'student', label: 'Student', icon: '🎓', color: 'from-blue-500 to-indigo-600' },
    { value: 'supervisor', label: 'Supervisor', icon: '👨‍🏫', color: 'from-purple-500 to-pink-600' },
    { value: 'admin', label: 'Administrator', icon: '⚙️', color: 'from-orange-500 to-red-600' }
  ];

  const selectedRole = roleOptions.find(r => r.value === loginRole);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(loginEmail, loginPassword, loginRole);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                  <FileText size={32} />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-center mb-2">FYP Manager</h1>
              <p className="text-indigo-100 text-center text-sm">Final Year Project Management System</p>
            </div>
          </div>
          
          <div className="p-8 bg-white/95 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Your Role</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="w-full px-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl flex items-center justify-between hover:border-indigo-400 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{selectedRole.icon}</span>
                      <span className="font-semibold text-gray-800">{selectedRole.label}</span>
                    </div>
                    <ChevronDown className={`transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} size={20} />
                  </button>
                  
                  {isRoleDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                      {roleOptions.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => {
                            setLoginRole(role.value);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-4 flex items-center space-x-3 hover:bg-gradient-to-r ${role.color} hover:text-white transition-all duration-200 ${
                            loginRole === role.value ? `bg-gradient-to-r ${role.color} text-white` : 'text-gray-800'
                          }`}
                        >
                          <span className="text-2xl">{role.icon}</span>
                          <span className="font-semibold">{role.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="your.email@university.edu"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={localShowPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setLocalShowPassword(!localShowPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {localShowPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 transform"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold hover:underline transition-all">
                Forgot password?
              </a>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <p className="text-xs text-gray-600 text-center">
                <span className="font-semibold">Demo Mode:</span> Use any email/password to sign in
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;