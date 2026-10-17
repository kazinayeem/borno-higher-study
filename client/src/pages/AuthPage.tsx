import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Logo } from '../components/common/Logo.js';
import { Lock, Mail, User, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead.js';


export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (demoType: 'student' | 'admin') => {
    if (demoType === 'student') {
      setEmail('student@borno.edu');
      setPassword('Student2025!');
      setName('Rahim Chowdhury');
      setIsLogin(true);
    } else {
      setEmail('admin@borno.edu');
      setPassword('BornoAdmin2025!');
      setName('Borno Administrator');
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SeoHead
        title="Sign In / Register | Borno Higher Study"
        description="Sign in or register for your Borno Higher Study account."
        canonicalPath="/auth"
        noIndex={true}
      />
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Logo className="justify-center" />
          <h2 className="mt-4 text-2xl font-extrabold text-brand-navy">
            {isLogin ? 'Sign in to your Borno account' : 'Create your free student account'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {isLogin
              ? 'Access saved universities, cost estimates, and personalized checklists'
              : 'Join thousands of international scholars discovering global universities'}
          </p>
        </div>

        {/* Demo Quick Fill Helper */}
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs space-y-2">
          <p className="font-bold text-teal-900 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-teal-700" />
            <span>Instant Demo Accounts (One-Click Fill):</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('student')}
              className="flex-1 py-1.5 px-2 bg-white rounded-lg border border-teal-300 font-semibold text-teal-800 hover:bg-teal-100 transition-colors"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('admin')}
              className="flex-1 py-1.5 px-2 bg-brand-navy text-white rounded-lg font-semibold hover:bg-brand-navy-light transition-colors"
            >
              Demo Super Admin
            </button>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahim Chowdhury"
                    required={!isLogin}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : isLogin ? 'Sign In to Account' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="pt-2 text-center text-xs text-slate-500">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="font-bold text-teal-600 hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="font-bold text-teal-600 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
