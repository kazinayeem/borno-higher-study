import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { SeoHead } from '../components/common/SeoHead.js';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';
import { Logo } from '../components/common/Logo.js';

export const StudentLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { studentLogin, register, requestPasswordReset, resetPassword, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT' | 'RESET_CONFIRM'>('LOGIN');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [showDevCredentials, setShowDevCredentials] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/student/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await studentLogin(email, password);
      navigate('/student/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Student login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/student/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Account registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await requestPasswordReset(email);
      setSuccessMsg(res.message);
      if (res.devResetCode) {
        setDevCode(res.devResetCode);
        setResetCode(res.devResetCode);
      }
      setMode('RESET_CONFIRM');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to request password reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(email, resetCode, newPassword);
      setSuccessMsg(res.message);
      setMode('LOGIN');
      setPassword(newPassword);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDevStudentCredentials = () => {
    setEmail('student@borno.edu');
    setPassword('StudentDemo@Borno2026!');
  };

  const fillDevContributorCredentials = () => {
    setEmail('contributor@borno.edu');
    setPassword('ContributorDemo@Borno2026!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <SeoHead
        title="Student Portal Login — Borno Higher Study"
        description="Access your international application planner, saved bookmarks, confidential document reviews, and study circles."
        canonicalPath="/student/login"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex justify-center mb-4">
          <Logo />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60 text-xs font-semibold mb-3">
          <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
          <span>Student & Contributor Portal</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-serif tracking-tight">
          {mode === 'LOGIN' && 'Sign in to Your Student Account'}
          {mode === 'REGISTER' && 'Create Your Student Account'}
          {mode === 'FORGOT' && 'Reset Your Password'}
          {mode === 'RESET_CONFIRM' && 'Enter Verification Code & New Password'}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Plan study abroad timelines, save verified deadlines, and organize your applications.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-2xl border border-slate-200">
          {/* Tabs for Login vs Register */}
          {(mode === 'LOGIN' || mode === 'REGISTER') && (
            <div className="flex border-b border-slate-200 mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('LOGIN');
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
                  mode === 'LOGIN'
                    ? 'border-teal-600 text-teal-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('REGISTER');
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
                  mode === 'REGISTER'
                    ? 'border-teal-600 text-teal-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Feedback banners */}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Mode 1: Student Login Form */}
          {mode === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@borno.edu"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('FORGOT');
                      setError(null);
                    }}
                    className="text-xs text-teal-700 hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In to Student Portal'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Mode 2: Student Registration Form */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahim Chowdhury"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password (min. 8 characters)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Complete Free Registration'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Mode 3: Forgot Password Request */}
          {mode === 'FORGOT' && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <p className="text-xs text-slate-600">
                Enter your registered student email. We will generate a secure 6-digit verification code to reset your password.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Account Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@borno.edu"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('LOGIN')}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                >
                  {loading ? 'Generating Code...' : 'Send Reset Code'}
                </button>
              </div>
            </form>
          )}

          {/* Mode 4: Reset Password Confirm */}
          {mode === 'RESET_CONFIRM' && (
            <form onSubmit={handleConfirmReset} className="space-y-4">
              {devCode && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-mono">
                  <span className="font-bold">Development Reset Code:</span> {devCode}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono tracking-widest text-center focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Secure Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm"
              >
                {loading ? 'Updating Password...' : 'Save New Password & Sign In'}
              </button>
            </form>
          )}

          {/* Demo Credentials Helper */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowDevCredentials(!showDevCredentials)}
              className="text-xs text-teal-700 hover:text-teal-800 flex items-center gap-1.5 mx-auto font-medium"
            >
              <KeyRound className="w-3.5 h-3.5" />
              {showDevCredentials ? 'Hide Demo Accounts' : 'Show Local Demo Accounts'}
            </button>

            {showDevCredentials && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-slate-800">Demo Student:</strong> student@borno.edu
                  </div>
                  <button
                    type="button"
                    onClick={fillDevStudentCredentials}
                    className="text-teal-700 underline font-semibold text-[11px]"
                  >
                    Auto-fill
                  </button>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                  <div>
                    <strong className="text-slate-800">Approved Contributor:</strong> contributor@borno.edu
                  </div>
                  <button
                    type="button"
                    onClick={fillDevContributorCredentials}
                    className="text-teal-700 underline font-semibold text-[11px]"
                  >
                    Auto-fill
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Super Admin link */}
          <div className="mt-6 text-center pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Are you a platform governance administrator?{' '}
              <Link to="/super-admin/login" className="text-navy-900 hover:underline font-bold inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Super Admin Login →
              </Link>
            </p>
          </div>
        </div>

        {/* Security & privacy footer */}
        <div className="mt-4 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          <span>Passwords are encrypted using bcrypt salted hashes. Plaintext is never stored.</span>
        </div>
      </div>
    </div>
  );
};
