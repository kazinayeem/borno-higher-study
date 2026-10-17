import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Scale,
  Languages,
  DollarSign,
  Clock,
  Briefcase,
  TrendingUp,
  FileCheck,
  Plus,
  X,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { getCountryWorkComparison, getCountryWorkGuideOverview } from '../services/api';
import { CountryWorkProfileDetail, GlobalWorkGuideOverviewItem } from '../types';

export const CountryWorkComparePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [comparisonProfiles, setComparisonProfiles] = useState<CountryWorkProfileDetail[]>([]);
  const [allCountries, setAllCountries] = useState<GlobalWorkGuideOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  // Initialize selected codes from query string or default to DE, GB, CA, AU
  useEffect(() => {
    const countriesParam = searchParams.get('countries');
    if (countriesParam) {
      setSelectedCodes(countriesParam.split(',').map((c) => c.trim().toUpperCase()));
    } else {
      setSelectedCodes(['DE', 'GB', 'CA', 'AU']);
    }
  }, [searchParams]);

  // Load all countries for the add selector
  useEffect(() => {
    async function loadAll() {
      try {
        const res = await getCountryWorkGuideOverview({});
        setAllCountries(res.data);
      } catch (err) {
        console.error('Failed to load countries list', err);
      }
    }
    loadAll();
  }, []);

  // Fetch profiles whenever selectedCodes changes
  useEffect(() => {
    async function fetchComparison() {
      if (selectedCodes.length === 0) {
        setComparisonProfiles([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await getCountryWorkComparison(selectedCodes);
        setComparisonProfiles(res.comparison);
      } catch (err) {
        console.error('Failed to load comparison profiles', err);
      } finally {
        setLoading(false);
      }
    }
    fetchComparison();
  }, [selectedCodes]);

  const addCountry = (code: string) => {
    if (!selectedCodes.includes(code) && selectedCodes.length < 5) {
      const updated = [...selectedCodes, code];
      setSelectedCodes(updated);
      setSearchParams({ countries: updated.join(',') });
    }
    setShowAddDropdown(false);
  };

  const removeCountry = (code: string) => {
    const updated = selectedCodes.filter((c) => c !== code);
    setSelectedCodes(updated);
    setSearchParams({ countries: updated.join(',') });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-28">
      <SeoHead
        title={isBn ? 'পাশাপাশি দেশভিত্তিক কাজের গাইড তুলনা | বর্ণ' : 'Side-by-Side Country Work Guide Comparison | Borno'}
        description="Compare statutory minimum wages, student work hours, post-graduation visa durations, and official languages across international study destinations."
        canonicalPath="/country-work-guide/compare"
      />

      {/* Top Banner / Breadcrumbs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs
            items={[
              { label: isBn ? 'হোম' : 'Home', href: '/' },
              { label: isBn ? 'কাজের ও ক্যারিয়ার গাইড' : 'Work & Career Guide', href: '/country-work-guide' },
              { label: isBn ? 'পাশাপাশি তুলনা' : 'Side-by-Side Comparison' },
            ]}
          />
        </div>
      </div>

      {/* Header */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-3">
              <Scale className="w-3.5 h-3.5" />
              Multi-Destination Regulatory Matrix
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Side-by-Side Destination Comparison
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Compare verified language requirements, statutory hourly wages, legal working hours, graduate routes, and in-demand occupations across destinations.
            </p>
          </div>

          {/* Add Country Control */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowAddDropdown(!showAddDropdown)}
              disabled={selectedCodes.length >= 5}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-md shadow-primary-500/20 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Country ({selectedCodes.length}/5)
            </button>

            {showAddDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 max-h-72 overflow-y-auto">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 block">
                  Select destination to add:
                </span>
                {allCountries
                  .filter((c) => !selectedCodes.includes(c.code))
                  .map((c) => (
                    <button
                      key={c.code}
                      onClick={() => addCountry(c.code)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span role="img" aria-label={c.name}>{c.flagEmoji}</span>
                        {c.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{c.code}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assembling verified comparison matrix...
            </p>
          </div>
        ) : comparisonProfiles.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Scale className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              No Countries Selected for Comparison
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Add at least two countries from the button above to view their side-by-side regulatory breakdown.
            </p>
            <button
              onClick={() => setSelectedCodes(['DE', 'GB', 'CA', 'AU'])}
              className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-semibold"
            >
              Load Default Peers (DE, GB, CA, AU)
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 1. Desktop Side-by-Side Table (Hidden on Mobile) */}
            <div className="hidden md:block overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                {/* Table Header: Country Flags and Names */}
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                    <th className="p-4 w-48 font-bold text-slate-500 uppercase tracking-wider text-[11px] sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 border-r border-slate-200 dark:border-slate-700">
                      Comparison Metric
                    </th>
                    {comparisonProfiles.map((p) => (
                      <th key={p.code} className="p-4 min-w-[220px] max-w-[280px]">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-3xl" role="img" aria-label={p.name}>
                              {p.flagEmoji}
                            </span>
                            <div>
                              <Link
                                to={`/country-work-guide/${p.code.toLowerCase()}`}
                                className="font-bold text-sm text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1"
                              >
                                {p.name}
                              </Link>
                              <span className="text-[11px] text-slate-400">
                                {p.currencyCode} ({p.currencySymbol}) • {p.code}
                              </span>
                            </div>
                          </div>
                          {selectedCodes.length > 1 && (
                            <button
                              onClick={() => removeCountry(p.code)}
                              className="text-slate-400 hover:text-rose-500 p-1"
                              title="Remove country"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {/* Row: Official Languages */}
                  <tr>
                    <td className="p-4 font-bold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-800">
                      Official Languages
                    </td>
                    {comparisonProfiles.map((p) => (
                      <td key={p.code} className="p-4 align-top">
                        <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                          {p.countryLanguages.filter((l) => l.isOfficial).map((l) => l.languageName).join(', ') || 'English/Native'}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          Widely spoken: {p.countryLanguages.filter((l) => l.isWidelySpoken).map((l) => l.languageName).join(', ') || 'N/A'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Higher Education Medium */}
                  <tr>
                    <td className="p-4 font-bold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-800">
                      Higher Ed Instruction
                    </td>
                    {comparisonProfiles.map((p) => (
                      <td key={p.code} className="p-4 align-top text-[11px] text-slate-600 dark:text-slate-400">
                        {p.countryLanguages[0]?.higherEdUsage || 'Multiple English & domestic instruction tracks.'}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Minimum Hourly Wage */}
                  <tr className="bg-emerald-50/40 dark:bg-emerald-950/20">
                    <td className="p-4 font-bold text-emerald-900 dark:text-emerald-300 sticky left-0 bg-emerald-50/80 dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-800">
                      Minimum Hourly Wage
                    </td>
                    {comparisonProfiles.map((p) => {
                      const wage = p.minimumWagePolicies[0];
                      const primaryRate = wage?.rates?.[0];
                      return (
                        <td key={p.code} className="p-4 align-top">
                          {wage?.hasStatutoryMinimum && primaryRate ? (
                            <div>
                              <span className="font-extrabold text-sm text-emerald-700 dark:text-emerald-300 block">
                                {primaryRate.currencySymbol}{primaryRate.amount} {primaryRate.currencyCode} / hr
                              </span>
                              {primaryRate.estimatedBdtHourly && (
                                <span className="text-[11px] text-slate-500 block">
                                  ~৳{primaryRate.estimatedBdtHourly} / hr estimate
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                Statutory effective {new Date(primaryRate.effectiveDate).toLocaleDateString()}
                              </span>
                            </div>
                          ) : wage?.policyType === 'NO_STATUTORY_MINIMUM' ? (
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                                No National Statutory Wage
                              </span>
                              <span className="text-[11px] text-slate-500 block">
                                Regulated via industry collective bargaining (Kollektivavtal/TES)
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">Policy verification in progress</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Student Work Term Time */}
                  <tr className="bg-blue-50/40 dark:bg-blue-950/20">
                    <td className="p-4 font-bold text-blue-900 dark:text-blue-300 sticky left-0 bg-blue-50/80 dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-800">
                      Student Work (Term Time)
                    </td>
                    {comparisonProfiles.map((p) => {
                      const sw = p.studentWorkPolicies[0];
                      return (
                        <td key={p.code} className="p-4 align-top">
                          <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                            {sw?.termTimeRuleText || 'Per visa condition'}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                            {sw?.offCampusRules || 'Check individual permit'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Student Work Breaks */}
                  <tr>
                    <td className="p-4 font-bold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-800">
                      During Official Breaks
                    </td>
                    {comparisonProfiles.map((p) => {
                      const sw = p.studentWorkPolicies[0];
                      return (
                        <td key={p.code} className="p-4 align-top text-[11px] text-slate-600 dark:text-slate-400">
                          {sw?.holidayRuleText || 'Unrestricted during scheduled course breaks.'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Self-Employment / Freelancing */}
                  <tr>
                    <td className="p-4 font-bold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-800">
                      Self-Employment / Freelancing
                    </td>
                    {comparisonProfiles.map((p) => {
                      const sw = p.studentWorkPolicies[0];
                      return (
                        <td key={p.code} className="p-4 align-top">
                          <span className={`font-bold block text-xs ${sw?.selfEmploymentAllowed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {sw?.selfEmploymentAllowed ? 'Permitted (with tax registration)' : 'Strictly Prohibited'}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                            {sw?.selfEmploymentRules || 'Unauthorized business activity violates student status.'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Post-Study Work Permit */}
                  <tr className="bg-purple-50/40 dark:bg-purple-950/20">
                    <td className="p-4 font-bold text-purple-900 dark:text-purple-300 sticky left-0 bg-purple-50/80 dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-800">
                      Post-Study Work Route
                    </td>
                    {comparisonProfiles.map((p) => {
                      const route = p.postStudyWorkRoutes[0];
                      return (
                        <td key={p.code} className="p-4 align-top">
                          {route ? (
                            <div>
                              <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
                                {route.routeName}
                              </span>
                              <span className="font-semibold text-purple-700 dark:text-purple-300 block text-xs mt-0.5">
                                Up to {route.durationMonthsMax} Months ({route.durationNotes})
                              </span>
                              <span className="text-[11px] text-slate-500 block mt-1">
                                Job offer: <strong>{route.jobOfferRequired ? 'Required' : 'Not required (Open)'}</strong>
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">Eligible graduate permits</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Permanent Residence Pathway */}
                  <tr>
                    <td className="p-4 font-bold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-800">
                      PR Transition Pathway
                    </td>
                    {comparisonProfiles.map((p) => {
                      const route = p.postStudyWorkRoutes[0];
                      return (
                        <td key={p.code} className="p-4 align-top text-[11px] text-slate-600 dark:text-slate-400">
                          {route?.prPathwayDetails || 'Work experience can count towards skilled migration.'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Top In-Demand Sectors */}
                  <tr>
                    <td className="p-4 font-bold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-800">
                      Top Shortage Sectors
                    </td>
                    {comparisonProfiles.map((p) => (
                      <td key={p.code} className="p-4 align-top text-[11px]">
                        <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300">
                          {p.careerSectors.slice(0, 3).map((s) => (
                            <li key={s.id} className="truncate">
                              {s.name}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Row: Full Profile Link */}
                  <tr>
                    <td className="p-4 sticky left-0 bg-white dark:bg-slate-900 z-10 border-r border-slate-200 dark:border-slate-800"></td>
                    {comparisonProfiles.map((p) => (
                      <td key={p.code} className="p-4">
                        <Link
                          to={`/country-work-guide/${p.code.toLowerCase()}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-sm transition-colors"
                        >
                          View {p.name} Profile <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2. Mobile Stacked Country Panels (Shown on Mobile, Hidden on Desktop) */}
            <div className="md:hidden space-y-6">
              {comparisonProfiles.map((p) => {
                const wage = p.minimumWagePolicies[0];
                const primaryRate = wage?.rates?.[0];
                const sw = p.studentWorkPolicies[0];
                const route = p.postStudyWorkRoutes[0];

                return (
                  <div
                    key={p.code}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl" role="img" aria-label={p.name}>
                          {p.flagEmoji}
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {p.name}
                          </h3>
                          <span className="text-xs text-slate-500">
                            {p.currencyCode} ({p.currencySymbol}) • {p.code}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCountry(p.code)}
                        className="text-xs text-slate-400 hover:text-rose-500 p-1"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Metrics Stack */}
                    <div className="space-y-3 text-xs">
                      {/* Language */}
                      <div>
                        <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                          Official Language:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {p.countryLanguages.filter((l) => l.isOfficial).map((l) => l.languageName).join(', ') || 'English/Native'}
                        </span>
                      </div>

                      {/* Minimum Wage */}
                      <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                        <span className="font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider block text-[10px]">
                          Minimum Hourly Wage:
                        </span>
                        {wage?.hasStatutoryMinimum && primaryRate ? (
                          <div className="mt-0.5">
                            <span className="font-extrabold text-sm text-emerald-700 dark:text-emerald-300">
                              {primaryRate.currencySymbol}{primaryRate.amount} {primaryRate.currencyCode} / hr
                            </span>
                            {primaryRate.estimatedBdtHourly && (
                              <span className="text-slate-500 block text-[11px]">
                                ~৳{primaryRate.estimatedBdtHourly} / hr estimate
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-600 dark:text-slate-400">
                            CBA Negotiated (No Statutory Minimum)
                          </span>
                        )}
                      </div>

                      {/* Student Work */}
                      <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60">
                        <span className="font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider block text-[10px]">
                          Student Work (Term Time Limit):
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                          {sw?.termTimeRuleText || 'Per visa conditions'}
                        </span>
                        <span className="text-slate-500 block text-[11px] mt-0.5">
                          Self-Employment: {sw?.selfEmploymentAllowed ? 'Permitted' : 'Strictly Prohibited'}
                        </span>
                      </div>

                      {/* Post-Study */}
                      <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60">
                        <span className="font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider block text-[10px]">
                          Post-Study Work Route:
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white block mt-0.5">
                          {route?.routeName || 'Graduate Route'}
                        </span>
                        <span className="text-purple-700 dark:text-purple-300 font-semibold block text-[11px]">
                          Up to {route?.durationMonthsMax} Months ({route?.durationNotes})
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        to={`/country-work-guide/${p.code.toLowerCase()}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-xs shadow-sm"
                      >
                        View {p.name} Complete Profile <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
