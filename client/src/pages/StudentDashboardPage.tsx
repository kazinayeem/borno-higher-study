import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { useSaved } from '../context/SavedContext.js';
import {
  User,
  GraduationCap,
  Bookmark,
  Calendar,
  Sparkles,
  Calculator,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { savedUniversityIds, savedScholarshipIds } = useSaved();

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-brand-navy via-brand-navy-light to-teal-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Student Profile Portal</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Welcome back, {user?.name || 'Aspiring Scholar'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Track your saved universities, test requirements, scholarship deadlines, and customized study-abroad timeline all in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/advisor"
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Advisor</span>
            </Link>
            <Link
              to="/planner"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>View Planner</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/saved"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card hover:border-teal-400 transition-all"
          >
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Saved Universities
            </span>
            <p className="text-3xl font-extrabold text-brand-navy mt-1">
              {savedUniversityIds.length}
            </p>
            <p className="text-xs text-teal-600 font-semibold mt-1">View institutions →</p>
          </Link>

          <Link
            to="/saved"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card hover:border-teal-400 transition-all"
          >
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Saved Scholarships
            </span>
            <p className="text-3xl font-extrabold text-brand-navy mt-1">
              {savedScholarshipIds.length}
            </p>
            <p className="text-xs text-teal-600 font-semibold mt-1">View funding deadlines →</p>
          </Link>

          <Link
            to="/planner"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card hover:border-teal-400 transition-all"
          >
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Application Intake
            </span>
            <p className="text-xl font-bold text-brand-navy mt-2">Autumn 2025</p>
            <p className="text-xs text-slate-500 mt-1">Target intake season</p>
          </Link>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Target Discipline
            </span>
            <p className="text-xl font-bold text-brand-navy mt-2">Computer Science</p>
            <p className="text-xs text-slate-500 mt-1">Master's Degree (MSc)</p>
          </div>
        </div>

        {/* Quick Launchpad to Core Tools */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <h3 className="font-extrabold text-xl text-brand-navy">
            Study Abroad Interactive Toolkit
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/calculator"
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-teal-500 hover:bg-teal-50/20 transition-all flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800">
                <Calculator className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-brand-navy">Tuition & Living Calculator</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Convert university costs and living expenses into BDT.
                </p>
              </div>
            </Link>

            <Link
              to="/english-checker"
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-teal-500 hover:bg-teal-50/20 transition-all flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-brand-navy">English Eligibility Checker</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify IELTS/TOEFL scores against verified course requirements.
                </p>
              </div>
            </Link>

            <Link
              to="/compare"
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-teal-500 hover:bg-teal-50/20 transition-all flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                <GraduationCap className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-brand-navy">University Comparison</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compare rankings, tuition ranges, and work rights side by side.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
