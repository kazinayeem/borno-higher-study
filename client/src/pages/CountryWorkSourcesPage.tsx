import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  ShieldCheck,
  ExternalLink,
  Search,
  Filter,
  Info,
  Calendar,
  Building2,
  CheckCircle2,
  Scale,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { getCountryWorkSources } from '../services/api';
import { CountryOfficialSourceItem } from '../types';

export const CountryWorkSourcesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [sources, setSources] = useState<CountryOfficialSourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    async function loadSources() {
      try {
        setLoading(true);
        setError(null);
        const res = await getCountryWorkSources({
          category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
        });
        setSources(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load official sources');
      } finally {
        setLoading(false);
      }
    }
    loadSources();
  }, [categoryFilter]);

  const filtered = sources.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.authorityName.toLowerCase().includes(q) ||
      s.sourceTitle.toLowerCase().includes(q) ||
      s.country?.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-28">
      <SeoHead
        title={isBn ? 'সরকারি তথ্য উৎস ও নীতিগত যাচাইকরণ মেথডোলজি | বর্ণ' : 'Official Government Sources & Policy Verification Methodology | Borno'}
        description="Comprehensive directory of official government labor ministries, immigration departments, and gazettes supporting the Borno Country Work Guide."
        canonicalPath="/country-work-guide/sources"
      />

      {/* Top Banner / Breadcrumbs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs
            items={[
              { label: isBn ? 'হোম' : 'Home', href: '/' },
              { label: isBn ? 'কাজের ও ক্যারিয়ার গাইড' : 'Work & Career Guide', href: '/country-work-guide' },
              { label: isBn ? 'তথ্যসূত্র ও মেথডোলজি' : 'Data Sources & Methodology' },
            ]}
          />
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-b from-cyan-950 via-slate-900 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Verified Government Gazettes & Portals
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Authoritative Sources & Data Verification Protocol
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Every legal work limit, minimum wage rate, and graduate visa policy published on Borno Higher Study links directly to primary government ministries and statutory gazettes.
          </p>
        </div>
      </section>

      {/* Methodology Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary-500" />
            Our Four Pillars of Policy Verification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                1. Primary Legislation Only
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                Data is harvested directly from statutory acts (e.g. MiLoG, FLSA, Fair Work Act) and government gazettes, never secondary commercial blogs.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                2. Legal Unit Preservation
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                Official limits are retained in their lawful periods (e.g. Australia 48h/fortnight, Germany 140 days) without arbitrary simplification.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                3. Historical Revisions
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                When wage rates or student hours update, previous values are preserved in the database audit log with effective start and end dates.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                4. Peer Correction Loop
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                Students and scholars can submit discrepancy reports backed by official URLs for rapid Super Admin review.
              </p>
            </div>
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
              placeholder="Search by authority, title, or country..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="ALL">All Authority Categories</option>
              <option value="IMMIGRATION">Immigration Departments</option>
              <option value="LABOUR_MINISTRY">Labor Ministries</option>
              <option value="MINIMUM_WAGE">Minimum Wage Authorities</option>
              <option value="EDUCATION_AUTHORITY">Higher Education Agencies</option>
            </select>
          </div>
        </div>

        {/* Sources Directory Table */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-500">Loading verified source records...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No source records matching your filter.
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                  <tr>
                    <th className="p-4">Jurisdiction</th>
                    <th className="p-4">Governing Authority</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Official Document / Gazette</th>
                    <th className="p-4">Retrieved</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Direct Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        <span className="mr-1.5" role="img" aria-label={s.country?.name}>
                          {s.country?.flagEmoji}
                        </span>
                        {s.country?.name}
                      </td>
                      <td className="p-4 font-medium text-slate-900 dark:text-white">
                        {s.authorityName}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
                          {s.category.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs truncate" title={s.sourceTitle}>
                        {s.sourceTitle}
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-500">
                        {new Date(s.retrievalDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <a
                          href={s.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                        >
                          Visit Authority <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
