import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Globe,
  Briefcase,
  DollarSign,
  Clock,
  Compass,
  FileCheck,
  Search,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Languages,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageIntro, StaggerGroup } from '../components/motion/index';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { getCountryWorkGuideOverview } from '../services/api';
import { GlobalWorkGuideOverviewItem } from '../types';
import { PersonalizedStudentPlannerModal } from '../components/common/PersonalizedStudentPlannerModal';

export const CountryWorkGuideHubPage: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();

  const [countries, setCountries] = useState<GlobalWorkGuideOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [continent, setContinent] = useState('ALL');
  const [policyType, setPolicyType] = useState('ALL');

  // Selected for comparison
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  useEffect(() => {
    async function loadOverview() {
      try {
        setLoading(true);
        setError(null);
        const res = await getCountryWorkGuideOverview({
          search: search.trim() || undefined,
          continent: continent !== 'ALL' ? continent : undefined,
          policyType: policyType !== 'ALL' ? policyType : undefined,
        });
        setCountries(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load country work guide overview');
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadOverview, 200);
    return () => clearTimeout(timer);
  }, [search, continent, policyType]);

  const toggleSelectCountry = (code: string) => {
    setSelectedCountries((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, code];
    });
  };

  const handleCompareClick = () => {
    if (selectedCountries.length > 0) {
      navigate(`/country-work-guide/compare?countries=${selectedCountries.join(',')}`);
    } else {
      navigate('/country-work-guide/compare');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-28">
      <SeoHead
        title={isBn ? 'বৈশ্বিক কাজের গাইড, ন্যূনতম মজুরি ও ক্যারিয়ার রোডম্যাপ | বর্ণ' : 'Global Country Work Guide, Minimum Wages & Post-Study Career Roadmaps | Borno'}
        description={isBn ? 'বিশ্বের প্রধান শিক্ষাগন্তব্যসমূহের সরকারি ভাষা, সংবিধিবদ্ধ ন্যূনতম মজুরি, শিক্ষার্থীর কাজের ঘণ্টা ও পোস্ট-স্টাডি ভিসার তথ্য।' : 'Explore verified statutory minimum wages, student work hour limits, post-graduation work permits, and actionable 6-stage career roadmaps.'}
        canonicalPath="/country-work-guide"
      />

      {/* Top Banner / Breadcrumbs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs
            items={[
              { label: isBn ? 'হোম' : 'Home', href: '/' },
              { label: isBn ? 'কাজের ও ক্যারিয়ার গাইড' : 'Work & Career Guide' },
            ]}
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-slate-900 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/15 border border-primary-400/30 text-primary-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4 text-primary-400" />
            {isBn ? 'যাচাইকৃত সরকারি রেগুলেটরি আর্কাইভ' : 'Verified Statutory Labour & Immigration Archive'}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            {t('countryWorkGuide.hubTitle')}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t('countryWorkGuide.hubSubtitle')}
          </p>

          {/* Action Row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsPlannerOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              {t('countryWorkGuide.studentPlanner')}
            </button>
            <button
              onClick={handleCompareClick}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all"
            >
              <Scale className="w-4 h-4" />
              {t('countryWorkGuide.compareCountries')}
            </button>
          </div>
        </div>
      </section>

      {/* 6 Key Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Card 1 */}
          <Link
            to="/country-work-guide/student-work-rules"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              {t('countryWorkGuide.studentWorkRules')}
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {isBn ? 'ক্লাস ও ছুটির সময় কাজের ঘণ্টা, অন ও অফ ক্যাম্পাস নিয়মাবলী এবং সেলফ-এমপ্লয়মেন্ট বিধিনিষেধ।' : 'Term-time allowances, official units (e.g. 48h/fortnight, 140 days), breaks & freelancing rules.'}
            </p>
          </Link>

          {/* Card 2 */}
          <Link
            to="/country-work-guide/minimum-wages"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              {t('countryWorkGuide.minimumWages')}
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {isBn ? 'সংবিধিবদ্ধ জাতীয় ও প্রাদেশিক ন্যূনতম মজুরি, বিডিটি আনুমানিক সমতুল্য ও নর্ডিক ইউনিয়ন চুক্তি।' : 'Statutory national & regional hourly rates, BDT converted estimates, and collective agreements.'}
            </p>
          </Link>

          {/* Card 3 */}
          <Link
            to="/country-work-guide/post-study-work"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              {t('countryWorkGuide.postStudyWork')}
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {isBn ? 'গ্র্যাজুয়েট রুট, PGWP, সাবক্লাস ৪৮৫ এবং স্থায়ী বসবাসের সুযোগসমূহ।' : 'Graduate Route, PGWP, Subclass 485, Jobseeker permits, and pathways to permanent residency.'}
            </p>
          </Link>

          {/* Card 4 */}
          <Link
            to="/country-work-guide/career-roadmaps"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              {t('countryWorkGuide.careerRoadmaps')}
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {isBn ? 'দেশ নির্বাচনের পূর্ব থেকে গ্র্যাজুয়েশন পর্যন্ত ৬-ধাপের বাস্তবমুখী কর্মপরিকল্পনা।' : 'Comprehensive Stages A to F covering pre-arrival preparation, Werkstudent roles, and transitions.'}
            </p>
          </Link>

          {/* Card 5 */}
          <Link
            to="/country-work-guide/compare"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              {t('countryWorkGuide.compareCountries')}
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {isBn ? 'একাধিক দেশের ভাষা, কাজের সুযোগ, মজুরি ও বিধিনিষেধ পাশাপাশি তুলনা করুন।' : 'Multi-destination matrix comparing languages, wages, student hours, and post-study visas side-by-side.'}
            </p>
          </Link>

          {/* Card 6 */}
          <Link
            to="/country-work-guide/sources"
            className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
              {t('countryWorkGuide.officialSources')}
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {isBn ? 'সরকারি শ্রম মন্ত্রণালয়, অভিবাসন গেজেট ও যাচাইকরণের তারিখভিত্তিক আর্কাইভ।' : 'Direct government gazettes, labor ministry links, retrieval timestamps, and verification protocols.'}
            </p>
          </Link>
        </div>
      </section>

      {/* Transparency Alert */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3.5">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            <span className="font-bold block mb-0.5">{isBn ? 'রেগুলেটরি সতর্কতা ও স্বচ্ছতা নীতি:' : 'Regulatory Transparency Notice:'}</span>
            {t('countryWorkGuide.disclaimerNotice')}
          </div>
        </div>
      </section>

      {/* Main Country Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Filters Header */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('countryWorkGuide.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={continent}
                onChange={(e) => setContinent(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="ALL">{isBn ? 'সকল মহাদেশ' : 'All Continents'}</option>
                <option value="Europe">Europe</option>
                <option value="North America">North America</option>
                <option value="Asia">Asia</option>
                <option value="Oceania">Oceania</option>
              </select>

              <select
                value={policyType}
                onChange={(e) => setPolicyType(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="ALL">{isBn ? 'সকল মজুরি নীতিমালা' : 'All Wage Policies'}</option>
                <option value="STATUTORY_NATIONAL">Statutory National Minimum</option>
                <option value="REGIONAL_PROVINCIAL">Regional / Provincial Minimum</option>
                <option value="NO_STATUTORY_MINIMUM">No Statutory Wage (CBA Regulated)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Table / Cards */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isBn ? 'যাচাইকৃত দেশভিত্তিক তথ্য লোড হচ্ছে...' : 'Loading verified regulatory country data...'}
            </p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-rose-500 text-sm">
            {error}
          </div>
        ) : countries.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {isBn ? 'কোনো ফলাফল পাওয়া যায়নি।' : 'No matching countries found for the selected criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {countries.map((item) => {
              const isSelected = selectedCountries.includes(item.code);
              return (
                <div
                  key={item.id}
                  className={`relative p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-md'
                      : 'border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl" role="img" aria-label={item.name}>
                          {item.flagEmoji}
                        </span>
                        <div>
                          <Link
                            to={`/country-work-guide/${item.code.toLowerCase()}`}
                            className="text-base font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1.5"
                          >
                            {item.name}
                            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {item.code}
                            </span>
                          </Link>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {item.capitalCity} • {item.continent}
                          </p>
                        </div>
                      </div>

                      {/* Select for Compare Checkbox */}
                      <button
                        onClick={() => toggleSelectCountry(item.code)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                          isSelected
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-primary-400'
                        }`}
                      >
                        {isSelected ? 'Selected' : '+ Compare'}
                      </button>
                    </div>

                    {/* Quick Badges Grid */}
                    <div className="space-y-2 py-3 border-y border-slate-100 dark:border-slate-800/80 text-xs">
                      {/* Language */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Languages className="w-3.5 h-3.5 text-slate-400" />
                          {t('countryWorkGuide.officialLanguage')}:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[170px]">
                          {item.officialLanguages.length > 0 ? item.officialLanguages.join(', ') : 'Verified upon visa grant'}
                        </span>
                      </div>

                      {/* Minimum Wage */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                          {t('countryWorkGuide.minimumWage')}:
                        </span>
                        <span className="font-semibold text-right">
                          {item.wagePolicy?.hasStatutoryMinimum && item.wagePolicy?.primaryRate ? (
                            <span className="text-emerald-700 dark:text-emerald-300">
                              {item.wagePolicy.primaryRate.currencySymbol}
                              {item.wagePolicy.primaryRate.amount}/hr
                              {item.wagePolicy.primaryRate.estimatedBdtHourly ? (
                                <span className="text-[11px] text-slate-500 font-normal ml-1">
                                  (~৳{item.wagePolicy.primaryRate.estimatedBdtHourly})
                                </span>
                              ) : null}
                            </span>
                          ) : item.wagePolicy?.policyType === 'NO_STATUTORY_MINIMUM' ? (
                            <span className="text-slate-600 dark:text-slate-400 font-normal">
                              CBA Regulated (No Stat. Min)
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">Policy details inside</span>
                          )}
                        </span>
                      </div>

                      {/* Student Work */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          {t('countryWorkGuide.studentWorkAllowance')}:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[170px]">
                          {item.studentWork?.termTimeRuleText || 'Per visa condition'}
                        </span>
                      </div>

                      {/* Post-Study */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-purple-500" />
                          {t('countryWorkGuide.postStudyDuration')}:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                          {item.postStudyWork ? `Up to ${item.postStudyWork.durationMonthsMax} Months` : 'Eligible streams'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      {item.officialSourceCount} official sources
                    </span>
                    <Link
                      to={`/country-work-guide/${item.code.toLowerCase()}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      {isBn ? 'বিস্তারিত প্রোফাইল' : 'Full Profile & Roadmap'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Floating Compare Action Bar */}
      {selectedCountries.length > 0 && (
        <div className="fixed bottom-6 inset-x-0 z-40 max-w-xl mx-auto px-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary-400 shrink-0" />
              <div>
                <p className="text-xs font-bold">
                  {selectedCountries.length} {isBn ? 'টি দেশ নির্বাচিত' : 'Countries Selected'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {selectedCountries.join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedCountries([])}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                Clear
              </button>
              <button
                onClick={handleCompareClick}
                className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold shadow-md shadow-primary-500/30 transition-colors"
              >
                Compare Matrix →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Planner Modal */}
      <PersonalizedStudentPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
      />
    </div>
  );
};
