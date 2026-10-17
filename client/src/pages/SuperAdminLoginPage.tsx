import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { SeoHead } from '../components/common/SeoHead.js';
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertTriangle,
  ArrowRight,
  GraduationCap,
  KeyRound,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { Logo } from '../components/common/Logo.js';

export const SuperAdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { superAdminLogin, isAuthenticated, isAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDevCredentials, setShowDevCredentials] = useState(false);

  // If already authenticated as admin, redirect to admin dashboard
  React.useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/super-admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await superAdminLogin(email, password);
      navigate('/super-admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Super Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDevCredentials = () => {
    setEmail('superadmin@borno.edu');
    setPassword('SuperAdmin@Borno2026!');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <SeoHead
        title="Super Admin Login — Borno Higher Study"
        description="Restricted platform governance and administrative authentication portal."
        canonicalPath="/super-admin/login"
        noIndex={true}
      />

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex justify-center mb-4">
          <Logo />
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-800 text-teal-400 border border-teal-500/30 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Restricted Governance Portal</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-semibold text-white tracking-tight">
          Super Admin Login
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Authenticate to manage global institutions, application intakes, verification reports, and system settings.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-700/80">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Administrator Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@borno.edu"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-mono"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Governance Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate as Super Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Development credentials helper */}
          <div className="mt-6 pt-5 border-t border-slate-700/80">
            <button
              type="button"
              onClick={() => setShowDevCredentials(!showDevCredentials)}
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1.5 mx-auto font-medium"
            >
              <KeyRound className="w-3.5 h-3.5" />
              {showDevCredentials ? 'Hide Local Test Credentials' : 'Show Local Dev Credentials'}
            </button>

            {showDevCredentials && (
              <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 space-y-1.5 font-mono">
                <div>
                  <span className="text-slate-500">Email:</span> superadmin@borno.edu
                </div>
                <div>
                  <span className="text-slate-500">Pass:</span> SuperAdmin@Borno2026!
                </div>
                <button
                  type="button"
                  onClick={fillDevCredentials}
                  className="mt-2 text-xs text-teal-400 hover:underline font-sans font-semibold block"
                >
                  Click to auto-fill development credentials →
                </button>
              </div>
            )}
          </div>

          {/* Redirect to student portal */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Not a platform administrator?{' '}
              <Link to="/student/login" className="text-teal-400 hover:underline font-semibold inline-flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                Go to Student Portal
              </Link>
            </p>
          </div>
        </div>

        {/* Security Audit Notice */}
        <div className="mt-4 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          <span>All administrative access and database mutations are cryptographically logged.</span>
        </div>
      </div>
    </div>
  );
};
