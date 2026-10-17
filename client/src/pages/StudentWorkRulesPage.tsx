import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Info,
  ArrowRight,
  Building2,
  Calendar,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { getStudentWorkRulesDirectory } from '../services/api';
import { StudentWorkPolicyItem } from '../types';

export const StudentWorkRulesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [policies, setPolicies] = useState<StudentWorkPolicyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selfEmploymentFilter, setSelfEmploymentFilter] = useState('ALL');

  useEffect(() => {
    async function loadPolicies() {
      try {
        setLoading(true);
        setError(null);
        const res = await getStudentWorkRulesDirectory({
          eligibilityStatus: statusFilter !== 'ALL' ? statusFilter : undefined,
          selfEmployment: selfEmploymentFilter !== 'ALL' ? selfEmploymentFilter === 'ALLOWED' : undefined,
        });
        setPolicies(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load student work policies');
      } finally {
        setLoading(false);
      }
    }
    loadPolicies();
  }, [statusFilter, selfEmploymentFilter]);

  const filtered = policies.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.country?.name.toLowerCase().includes(q) ||
      p.country?.code.toLowerCase().includes(q) ||
      p.termTimeRuleText.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-28">
      <SeoHead
        title={isBn ? 'আন্তর্জাতিক শিক্ষার্থীদের কাজের নিয়মাবলী ও বৈধ ঘণ্টা | বর্ণ' : 'International Student Work Rules & Legal Hours Worldwide | Borno'}
        description="Comprehensive official database of student work hour limits during academic terms and scheduled breaks, self-employment restrictions, and legal rules."
        canonicalPath="/country-work-guide/student-work-rules"
      />

      {/* Top Banner / Breadcrumbs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs
            items={[
              { label: isBn ? 'হোম' : 'Home', href: '/' },
              { label: isBn ? 'কাজের ও ক্যারিয়ার গাইড' : 'Work & Career Guide', href: '/country-work-guide' },
              { label: isBn ? 'শিক্ষার্থীদের কাজের নিয়মাবলী' : 'Student Work Rules' },
            ]}
          />
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
            <Clock className="w-4 h-4 text-blue-400" />
            Preserved Statutory Work-Hour Database
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            International Student Employment Regulations
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Preserving official statutory legal units (e.g. 48 hours/fortnight in Australia, 140 full days in Germany, 24 hours/week in Canada) and verified self-employment limits.
          </p>
        </div>
      </section>

      {/* Filters & Notice */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Legal Notice on Units & Status:</strong> A rule of 48 hours per fortnight must never be simplified to a weekly cap. Work permissions apply only to eligible study visas, and the conditions printed on your individual residence permit card always take legal precedence.
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by country name, code, or rule..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="ALL">All Eligibility Statuses</option>
              <option value="PERMITTED_UNDER_CONDITIONS">Permitted with Conditions</option>
              <option value="RESTRICTED_EMPLOYMENT">Restricted to Specific Types</option>
              <option value="PERMIT_REQUIRED">Work Authorization Required</option>
            </select>

            <select
              value={selfEmploymentFilter}
              onChange={(e) => setSelfEmploymentFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="ALL">All Freelancing Permissions</option>
              <option value="ALLOWED">Self-Employment Allowed</option>
              <option value="FORBIDDEN">Strictly Prohibited</option>
            </select>
          </div>
        </div>

        {/* Policy Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-500">Loading student work policies...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No policies found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl" role="img" aria-label={item.country?.name}>
                      {item.country?.flagEmoji}
                    </span>
                    <div>
                      <Link
                        to={`/country-work-guide/${item.country?.code.toLowerCase()}`}
                        className="text-base font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1.5"
                      >
                        {item.country?.name}
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.country?.code}
                        </span>
                      </Link>
                      <span className="text-xs font-medium text-slate-500">
                        {item.country?.continent}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {item.eligibilityStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Term Time Box */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Term-Time Work Allowance (Official Legal Unit)
                  </span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white block mb-1">
                    {item.termTimeRuleText}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {item.offCampusRules}
                  </p>
                </div>

                {/* Grid: Recesses & Self-Employment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Academic Breaks & Holidays:
                    </span>
                    <p className="text-slate-600 dark:text-slate-400">
                      {item.holidayRuleText}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Self-Employment & Freelancing:
                    </span>
                    <p className={`font-semibold mb-1 ${item.selfEmploymentAllowed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {item.selfEmploymentAllowed ? 'Permitted with tax registration' : 'Strictly Prohibited'}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      {item.selfEmploymentRules || 'Not authorized under standard student status.'}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                  {item.sourceUrl ? (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-primary-600 flex items-center gap-1"
                    >
                      Official Government Source <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-400">Verified Policy</span>
                  )}

                  <Link
                    to={`/country-work-guide/${item.country?.code.toLowerCase()}`}
                    className="font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                  >
                    View Full Country Guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
