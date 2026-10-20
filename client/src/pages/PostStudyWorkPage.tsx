import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Info,
  ArrowRight,
  GraduationCap,
  Calendar,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { getPostStudyWorkDirectory } from '../services/api';
import { PostStudyWorkRouteItem } from '../types';

export const PostStudyWorkPage: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [routes, setRoutes] = useState<PostStudyWorkRouteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [jobOfferFilter, setJobOfferFilter] = useState('ALL');
  const [prFilter, setPrFilter] = useState('ALL');

  useEffect(() => {
    async function loadRoutes() {
      try {
        setLoading(true);
        setError(null);
        const res = await getPostStudyWorkDirectory({
          jobOfferRequired: jobOfferFilter !== 'ALL' ? jobOfferFilter === 'REQUIRED' : undefined,
          leadsToPR: prFilter !== 'ALL' ? prFilter === 'LEADS_TO_PR' : undefined,
        });
        setRoutes(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load post-study work routes');
      } finally {
        setLoading(false);
      }
    }
    loadRoutes();
  }, [jobOfferFilter, prFilter]);

  const filtered = routes.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.country?.name.toLowerCase().includes(q) ||
      r.country?.code.toLowerCase().includes(q) ||
      r.routeName.toLowerCase().includes(q) ||
      r.durationNotes.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-28">
      <SeoHead
        title={isBn ? 'পোস্ট-স্টাডি ওয়ার্ক পারমিট ও গ্র্যাজুয়েট ভিসা ডাটাবেস | বর্ণ' : 'Post-Study Work Permits & Graduate Visa Pathways Worldwide | Borno'}
        description="Comprehensive official guide to post-study work routes, permit durations, job offer criteria, application deadlines, and permanent residency pathways."
        canonicalPath="/country-work-guide/post-study-work"
      />

      {/* Top Banner / Breadcrumbs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs
            items={[
              { label: isBn ? 'হোম' : 'Home', href: '/' },
              { label: isBn ? 'কাজের ও ক্যারিয়ার গাইড' : 'Work & Career Guide', href: '/country-work-guide' },
              { label: isBn ? 'পোস্ট-স্টাডি ওয়ার্ক পারমিট' : 'Post-Study Work Permits' },
            ]}
          />
        </div>
      </div>

      {/* Header */}
      <section className="bg-[#0B192C] border-b border-slate-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-4">
            <Briefcase className="w-4 h-4 text-teal-400" />
            Verified Post-Graduation Career Pathways
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Global Post-Study Work Permits & Graduate Visas
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Statutory permissions, maximum durations, employer sponsorship rules, and transparent pathways to permanent residency across leading study destinations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Legal Transparency Notice:</strong> A post-study work permit never guarantees employment, permanent residency, citizenship, or automatic approval of a future visa. Each permit has strict deadlines and eligibility requirements governed by national immigration law.
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by country, permit name, or qualification..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={jobOfferFilter}
              onChange={(e) => setJobOfferFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="ALL">All Sponsorship / Job Offer Types</option>
              <option value="NOT_REQUIRED">No Job Offer Required (Open)</option>
              <option value="REQUIRED">Job Offer Mandatory</option>
            </select>

            <select
              value={prFilter}
              onChange={(e) => setPrFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="ALL">All Residence Pathways</option>
              <option value="LEADS_TO_PR">Leads to Permanent Residence</option>
            </select>
          </div>
        </div>

        {/* Routes Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-500">Loading post-study work routes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No graduate routes found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((route) => (
              <div
                key={route.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl" role="img" aria-label={route.country?.name}>
                      {route.country?.flagEmoji}
                    </span>
                    <div>
                      <Link
                        to={`/country-work-guide/${route.country?.code.toLowerCase()}`}
                        className="text-base font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1.5"
                      >
                        {route.country?.name}
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {route.country?.code}
                        </span>
                      </Link>
                      <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mt-0.5">
                        {route.routeName}
                      </h4>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    Up to {route.durationMonthsMax} Mo.
                  </span>
                </div>

                {/* Duration & Notes Box */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Permitted Duration & Conditions
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white block mb-1">
                    {route.durationMonthsMin} to {route.durationMonthsMax} Months
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {route.durationNotes}
                  </p>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block mb-0.5">Job Offer Required:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {route.jobOfferRequired ? 'Yes (Mandatory)' : 'No (Open Work Rights)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block mb-0.5">PR Pathway:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {route.leadsToPermanentResidence ? 'Eligible Experience' : 'Non-Immigrant Stream'}
                    </span>
                  </div>
                </div>

                {route.policyChangeNotice && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
                    <strong>Recent Notice:</strong> {route.policyChangeNotice}
                  </div>
                )}

                {/* Footer Link */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                  <a
                    href={route.governmentApplicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Official Government Application <ExternalLink className="w-3 h-3" />
                  </a>

                  <Link
                    to={`/country-work-guide/${route.country?.code.toLowerCase()}`}
                    className="font-semibold text-slate-600 dark:text-slate-300 hover:underline flex items-center gap-1"
                  >
                    Country Profile <ArrowRight className="w-3.5 h-3.5" />
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
