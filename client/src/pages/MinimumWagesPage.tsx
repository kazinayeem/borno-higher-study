import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Info,
  ArrowRight,
  Scale,
  Building2,
  Calendar,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { getMinimumWagesDirectory } from '../services/api';
import { MinimumWagePolicyItem } from '../types';

export const MinimumWagesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [policies, setPolicies] = useState<MinimumWagePolicyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [policyTypeFilter, setPolicyTypeFilter] = useState('ALL');

  useEffect(() => {
    async function loadWages() {
      try {
        setLoading(true);
        setError(null);
        const res = await getMinimumWagesDirectory({
          policyType: policyTypeFilter !== 'ALL' ? policyTypeFilter : undefined,
        });
        setPolicies(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load minimum wage directory');
      } finally {
        setLoading(false);
      }
    }
    loadWages();
  }, [policyTypeFilter]);

  const filtered = policies.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.country?.name.toLowerCase().includes(q) ||
      p.country?.code.toLowerCase().includes(q) ||
      p.overview.toLowerCase().includes(q) ||
      p.governingBody?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-28">
      <SeoHead
        title={isBn ? 'বৈশ্বিক সংবিধিবদ্ধ ন্যূনতম মজুরি ও রেট ডাটাবেস | বর্ণ' : 'Global Statutory Minimum Wages & Hourly Rates Directory | Borno'}
        description="Verified statutory hourly minimum wages across international study destinations, regional variations, collective bargaining agreements, and BDT converted estimates."
        canonicalPath="/country-work-guide/minimum-wages"
      />

      {/* Top Banner / Breadcrumbs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs
            items={[
              { label: isBn ? 'হোম' : 'Home', href: '/' },
              { label: isBn ? 'কাজের ও ক্যারিয়ার গাইড' : 'Work & Career Guide', href: '/country-work-guide' },
              { label: isBn ? 'ন্যূনতম মজুরি ডাটাবেস' : 'Minimum Wages' },
            ]}
          />
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-4">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Verified Statutory Labor Standards
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Global Statutory Minimum Wage Directory
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Preserving legally defined wage periods (hourly, daily, monthly) and distinguishing national statutory floors from Nordic collective bargaining agreements.
          </p>
        </div>
      </section>

      {/* Filters & Methodological Notice */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Conversion & Valuation Principle:</strong> Converted BDT figures are transparent mathematical estimates based on real-time central exchange matrices. Countries without a statutory national minimum wage (e.g. Sweden, Finland, Norway, Denmark, Italy) rely on legally enforceable union collective agreements (Kollektivavtal/TES) rather than a single statutory rate.
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
              placeholder="Search by country, commission, or jurisdiction..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={policyTypeFilter}
              onChange={(e) => setPolicyTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="ALL">All Wage Policy Types</option>
              <option value="STATUTORY_NATIONAL">Statutory National Minimum</option>
              <option value="REGIONAL_PROVINCIAL">Regional / Provincial Minimum</option>
              <option value="NO_STATUTORY_MINIMUM">No Statutory Minimum (CBA)</option>
            </select>
          </div>
        </div>

        {/* Policies Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-500">Loading statutory wage data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No wage policies found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item) => {
              const primaryRate = item.rates?.[0];
              return (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4"
                >
                  {/* Card Header */}
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
                        <span className="text-xs text-slate-500">
                          {item.governingBody || 'Labor Ministry'}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {item.policyType.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Primary Wage Display */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Statutory Wage Floor (Original Currency)
                    </span>
                    {item.hasStatutoryMinimum && primaryRate ? (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                            {primaryRate.currencySymbol}{primaryRate.amount} {primaryRate.currencyCode}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            / {primaryRate.rateUnit.toLowerCase()}
                          </span>
                        </div>
                        {primaryRate.estimatedBdtHourly && (
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">
                            BDT Estimated Equivalent: ~৳{primaryRate.estimatedBdtHourly} / hour
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 block mt-1">
                          Effective date: {new Date(primaryRate.effectiveDate).toLocaleDateString()}
                        </span>
                      </div>
                    ) : item.policyType === 'NO_STATUTORY_MINIMUM' ? (
                      <div>
                        <span className="text-base font-bold text-slate-800 dark:text-slate-200 block">
                          No National Statutory Wage Floor
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          Regulated across industries by binding collective agreements (Kollektivavtal/TES).
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Policy verification in progress.</span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.overview}
                  </p>

                  {/* Regional Rates Notice if multiple */}
                  {item.rates && item.rates.length > 1 && (
                    <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-300">
                      <strong>Includes {item.rates.length} Regional / Provincial Rates:</strong>{' '}
                      {item.rates.map((r) => r.jurisdiction?.name || 'Federal').join(', ')}.
                    </div>
                  )}

                  {/* Footer Link */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                    {item.sourceUrl ? (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-primary-600 flex items-center gap-1"
                      >
                        Official Authority <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">Verified Policy</span>
                    )}

                    <Link
                      to={`/country-work-guide/${item.country?.code.toLowerCase()}`}
                      className="font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                    >
                      View Full Wage Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
