import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Globe,
  Briefcase,
  DollarSign,
  Clock,
  Compass,
  FileCheck,
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
  Calendar,
  Award,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  UserCheck,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { getCountryWorkProfile } from '../services/api';
import { CountryWorkProfileDetail } from '../types';
import { PolicyCorrectionModal } from '../components/common/PolicyCorrectionModal';

export const CountryWorkProfilePage: React.FC = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [profile, setProfile] = useState<CountryWorkProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LANGUAGES' | 'WAGES' | 'STUDENT_WORK' | 'POST_STUDY' | 'SECTORS' | 'ROADMAP' | 'SOURCES'>('OVERVIEW');
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  const [correctionTarget, setCorrectionTarget] = useState<'MINIMUM_WAGE' | 'STUDENT_WORK' | 'POST_STUDY_WORK' | 'LANGUAGE' | 'CAREER'>('STUDENT_WORK');

  useEffect(() => {
    async function loadProfile() {
      if (!countryCode) return;
      try {
        setLoading(true);
        setError(null);
        const res = await getCountryWorkProfile(countryCode);
        setProfile(res.profile);
      } catch (err: any) {
        setError(err.message || 'Failed to load country work profile');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [countryCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isBn ? 'যাচাইকৃত দেশের কাজের তথ্য লোড হচ্ছে...' : 'Loading verified country regulatory profile...'}
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-lg">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {isBn ? 'প্রোফাইল পাওয়া যায়নি' : 'Country Profile Not Found'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            {error || 'The requested destination does not have published work guide data yet.'}
          </p>
          <Link
            to="/country-work-guide"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors"
          >
            ← Return to Work Guide Directory
          </Link>
        </div>
      </div>
    );
  }

  const primaryWagePolicy = profile.minimumWagePolicies[0] || null;
  const primaryStudentWork = profile.studentWorkPolicies[0] || null;
  const primaryPostStudyRoute = profile.postStudyWorkRoutes[0] || null;
  const primaryRoadmap = profile.careerRoadmaps[0] || null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-28">
      <SeoHead
        title={`${profile.name} — Languages, Minimum Wages, Student Work & Career Roadmap | Borno`}
        description={`Comprehensive verified guide for international students in ${profile.name}: official languages, statutory minimum wages, legal student work limits, post-study work routes, and 6-stage roadmap.`}
        canonicalPath={`/country-work-guide/${profile.code.toLowerCase()}`}
      />

      {/* Top Banner / Breadcrumbs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs
            items={[
              { label: isBn ? 'হোম' : 'Home', href: '/' },
              { label: isBn ? 'কাজের ও ক্যারিয়ার গাইড' : 'Work & Career Guide', href: '/country-work-guide' },
              { label: profile.name },
            ]}
          />
        </div>
      </div>

      {/* Country Header */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-6">
              <span className="text-5xl sm:text-6xl" role="img" aria-label={profile.name}>
                {profile.flagEmoji}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-300 text-xs font-semibold">
                    ISO: {profile.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
                    {profile.continent} • {profile.region}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Official Data
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                  {profile.name} — Work, Wages & Post-Study Career Guide
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {profile.overview}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap md:flex-col items-center sm:items-end gap-3 shrink-0">
              <Link
                to={`/country-work-guide/compare?countries=${profile.code},GB,CA,DE`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all"
              >
                <Scale className="w-4 h-4 text-primary-400" />
                Compare with Global Peers
              </Link>
              <button
                onClick={() => {
                  setCorrectionTarget('STUDENT_WORK');
                  setIsCorrectionOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Report Policy Update
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Capital City</span>
              <span className="text-sm font-bold text-white">{profile.capitalCity}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Local Currency</span>
              <span className="text-sm font-bold text-white">
                {profile.currencyCode} ({profile.currencySymbol}) ≈ ৳{profile.exchangeRateToBdt}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Avg Living Cost</span>
              <span className="text-sm font-bold text-white">
                {profile.currencySymbol}{profile.avgLivingCostMonthly}/month
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Last Policy Audit</span>
              <span className="text-sm font-bold text-white">
                {new Date(profile.lastVerifiedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto no-scrollbar gap-2 py-3">
            {[
              { id: 'OVERVIEW', label: 'Summary Overview', icon: Globe },
              { id: 'LANGUAGES', label: 'Languages', icon: Languages },
              { id: 'WAGES', label: 'Minimum Wages', icon: DollarSign },
              { id: 'STUDENT_WORK', label: 'Student Work Rules', icon: Clock },
              { id: 'POST_STUDY', label: 'Graduate Visas', icon: Briefcase },
              { id: 'SECTORS', label: 'Career Sectors', icon: TrendingUp },
              { id: 'ROADMAP', label: '6-Stage Roadmap', icon: Compass },
              { id: 'SOURCES', label: 'Official Sources', icon: FileCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tab Contents */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Box 1: Language */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Languages className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Language Ecosystem</h4>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {profile.countryLanguages.filter((l) => l.isOfficial).map((l) => l.languageName).join(', ') || 'Official English/Native'}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {profile.countryLanguages[0]?.higherEdUsage || 'Multiple English & domestic instruction tracks.'}
                </p>
              </div>

              {/* Box 2: Wage */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Statutory Minimum Wage</h4>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {primaryWagePolicy?.hasStatutoryMinimum && primaryWagePolicy.rates?.[0] ? (
                    <>
                      {primaryWagePolicy.rates[0].currencySymbol}{primaryWagePolicy.rates[0].amount}/hr
                      <span className="text-xs font-normal text-slate-400 ml-1.5">
                        (~৳{primaryWagePolicy.rates[0].estimatedBdtHourly || 'N/A'})
                      </span>
                    </>
                  ) : (
                    'CBA Negotiated / No Stat. Min'
                  )}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {primaryWagePolicy?.overview || 'Regulated by collective bargaining agreements.'}
                </p>
              </div>

              {/* Box 3: Student Work */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Work Allowance</h4>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {primaryStudentWork?.termTimeRuleText || 'Per visa condition'}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {primaryStudentWork?.holidayRuleText || 'Full-time work during scheduled semester breaks.'}
                </p>
              </div>

              {/* Box 4: Post-Study */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Post-Study Work Route</h4>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white truncate">
                  {primaryPostStudyRoute?.routeName || 'Graduate Route'}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {primaryPostStudyRoute?.durationNotes || 'Open work rights post-graduation.'}
                </p>
              </div>
            </div>

            {/* In-Demand Sectors Banner */}
            {profile.careerSectors.length > 0 && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Verified High-Demand Employment Sectors
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Based on official national labour ministry shortage lists and skilled occupation databases
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('SECTORS')}
                    className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                  >
                    View All Occupations →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.careerSectors.map((sector) => (
                    <div
                      key={sector.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {sector.name}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                          {sector.demandStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {sector.overview}
                      </p>
                      {sector.averageSalaryMin && sector.averageSalaryMax && (
                        <p className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Typical Salary Range: {sector.salaryCurrency} {sector.averageSalaryMin.toLocaleString()} – {sector.averageSalaryMax.toLocaleString()} / year
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 1. LANGUAGES TAB */}
        {activeTab === 'LANGUAGES' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Languages className="w-5 h-5 text-primary-500" />
                Language Landscape & Workplace Requirements
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Clear distinction between official statutory languages, common university instructional media, and local employment market language proficiencies.
              </p>

              <div className="space-y-5">
                {profile.countryLanguages.map((lang) => (
                  <div
                    key={lang.id}
                    className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900 dark:text-white">
                          {lang.languageName} ({lang.languageCode.toUpperCase()})
                        </span>
                        {lang.isOfficial && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[11px] font-semibold border border-blue-200 dark:border-blue-800">
                            Official National Language
                          </span>
                        )}
                        {lang.isWidelySpoken && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-300 text-[11px] font-medium">
                            Widely Spoken
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Higher Education Usage:
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {lang.higherEdUsage}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Job Market & Industry Usage:
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {lang.jobMarketUsage}
                        </p>
                      </div>
                    </div>

                    {lang.usages && lang.usages.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                          Specific Contexts & Recommended Proficiency:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {lang.usages.map((u) => (
                            <div key={u.id} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  {u.contextType.replace(/_/g, ' ')}:
                                </span>{' '}
                                {u.proficiencyRequired && (
                                  <span className="px-1.5 py-0.2 rounded bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-[10px] font-bold mr-1">
                                    {u.proficiencyRequired}
                                  </span>
                                )}
                                {u.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. WAGES TAB */}
        {activeTab === 'WAGES' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                Minimum Hourly Wage & Applicable Wage Rules
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Official statutory rates, governing bodies, legal wage units, and regional/provincial variations. Converted figures are strictly estimates.
              </p>

              {primaryWagePolicy ? (
                <div className="space-y-5">
                  {/* Overview Card */}
                  <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Policy Framework: {primaryWagePolicy.policyType.replace(/_/g, ' ')}
                      </span>
                      {primaryWagePolicy.governingBody && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Governing Body: <strong className="text-slate-700 dark:text-slate-300">{primaryWagePolicy.governingBody}</strong>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                      {primaryWagePolicy.overview}
                    </p>
                    {primaryWagePolicy.collectiveBargainingNote && (
                      <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-800 dark:text-blue-300">
                        <strong>Collective Bargaining Context:</strong> {primaryWagePolicy.collectiveBargainingNote}
                      </div>
                    )}
                  </div>

                  {/* Rates Table */}
                  {primaryWagePolicy.rates && primaryWagePolicy.rates.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                          <tr>
                            <th className="p-3">Jurisdiction / Scope</th>
                            <th className="p-3">Statutory Amount</th>
                            <th className="p-3">Legal Unit</th>
                            <th className="p-3">Effective Date</th>
                            <th className="p-3">BDT Converted Estimate</th>
                            <th className="p-3">Applicable Scope / Exceptions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                          {primaryWagePolicy.rates.map((rate) => (
                            <tr key={rate.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="p-3 font-semibold text-slate-900 dark:text-white">
                                {rate.jurisdiction?.name || 'Federal / National'}
                              </td>
                              <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                                {rate.currencySymbol}{rate.amount} {rate.currencyCode}
                              </td>
                              <td className="p-3">{rate.rateUnit}</td>
                              <td className="p-3">{new Date(rate.effectiveDate).toLocaleDateString()}</td>
                              <td className="p-3 font-semibold">
                                {rate.estimatedBdtHourly ? `৳${rate.estimatedBdtHourly} / hour` : '—'}
                              </td>
                              <td className="p-3 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
                                {rate.apprenticeException || rate.industryExceptions || rate.rateNotes || 'General adult worker statutory rate.'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {primaryWagePolicy.sourceUrl && (
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                      <span>Verified via official government statutory gazette.</span>
                      <a
                        href={primaryWagePolicy.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        Official Minimum Wage Authority <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No statutory minimum wage database record published for this jurisdiction.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. STUDENT WORK TAB */}
        {activeTab === 'STUDENT_WORK' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                International Student Legal Employment Policy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Preserved official statutory limits during study semesters and scheduled breaks, on-campus and off-campus provisions, and self-employment rules.
              </p>

              {primaryStudentWork ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Term Time */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                        During Term Time (Official Statutory Unit)
                      </span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white block mb-1">
                        {primaryStudentWork.termTimeRuleText}
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {primaryStudentWork.offCampusRules}
                      </p>
                    </div>

                    {/* Scheduled Breaks */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                        During Scheduled Academic Recesses
                      </span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white block mb-1">
                        {primaryStudentWork.holidayRuleText}
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Applies during official published institutional vacations between semesters.
                      </p>
                    </div>
                  </div>

                  {/* On vs Off Campus & Self Employment */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        On-Campus Employment:
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {primaryStudentWork.onCampusRules}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        Self-Employment & Freelancing:
                      </span>
                      <p className={`font-semibold mb-1 ${primaryStudentWork.selfEmploymentAllowed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {primaryStudentWork.selfEmploymentAllowed ? 'Permitted with registration' : 'Strictly Prohibited'}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {primaryStudentWork.selfEmploymentRules || 'Not permitted on student immigration status.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        Internships & Assistantships:
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {primaryStudentWork.internshipRules || 'Curricular internships may have separate guidelines.'}
                      </p>
                    </div>
                  </div>

                  {/* Precedence Notice */}
                  {primaryStudentWork.visaConditionPrecedenceNote && (
                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
                      <strong>Legal Notice:</strong> {primaryStudentWork.visaConditionPrecedenceNote}
                    </div>
                  )}

                  {/* Required Authorizations */}
                  {primaryStudentWork.authorizations && primaryStudentWork.authorizations.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                        Statutory Registrations Prior to Employment
                      </h4>
                      <div className="space-y-2">
                        {primaryStudentWork.authorizations.map((auth) => (
                          <div
                            key={auth.id}
                            className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4 text-xs"
                          >
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">
                                {auth.authorizationType.replace(/_/g, ' ')} ({auth.authorityName})
                              </span>
                              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                                {auth.procedureDescription}
                              </p>
                            </div>
                            {auth.officialFormUrl && (
                              <a
                                href={auth.officialFormUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary-600 dark:text-primary-400 hover:underline shrink-0 font-semibold"
                              >
                                Portal ↗
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No verified student work policy on record.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. POST STUDY WORK TAB */}
        {activeTab === 'POST_STUDY' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-500" />
                Post-Study Work Permits & Graduate Pathways
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Verified durations, sponsorship requirements, application deadlines, and long-term permanent residence transitions.
              </p>

              {profile.postStudyWorkRoutes.map((route) => (
                <div
                  key={route.id}
                  className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {route.routeName}
                        {route.routeCode && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                            {route.routeCode}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Duration: <strong>{route.durationMonthsMin} to {route.durationMonthsMax} Months</strong> ({route.durationNotes})
                      </p>
                    </div>

                    <a
                      href={route.governmentApplicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition-colors shadow-sm"
                    >
                      Government Application Portal <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {route.policyChangeNotice && (
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
                      <strong>Policy Update Notice:</strong> {route.policyChangeNotice}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                      <span className="text-slate-400 block mb-0.5">Job Offer Required:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {route.jobOfferRequired ? 'Yes (Mandatory)' : 'No (Open Route)'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                      <span className="text-slate-400 block mb-0.5">Employer Sponsorship:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {route.employerSponsorshipRequired ? 'Required' : 'Unsponsored'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                      <span className="text-slate-400 block mb-0.5">Self-Employment Allowed:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {route.selfEmploymentAllowed ? 'Yes' : 'No'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                      <span className="text-slate-400 block mb-0.5">Application Deadline:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {route.applicationDeadlineDescription}
                      </span>
                    </div>
                  </div>

                  {route.prPathwayDetails && (
                    <div className="p-3.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                        Permanent Residence (PR) & Long-Term Pathway Details:
                      </span>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {route.prPathwayDetails}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CAREER SECTORS TAB */}
        {activeTab === 'SECTORS' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                Researched Employment Sectors & In-Demand Occupations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Verified high-demand roles, entry-level qualifications, licensing requirements, and starting salaries from public employment databases.
              </p>

              <div className="space-y-6">
                {profile.careerSectors.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {sec.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Shortage Status: <strong className="text-emerald-600 dark:text-emerald-400">{sec.demandStatus.replace(/_/g, ' ')}</strong>
                        </p>
                      </div>
                      {sec.officialPortalUrl && (
                        <a
                          href={sec.officialPortalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                        >
                          {sec.officialPortalName || 'Official Employment Portal'} ↗
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {sec.overview}
                    </p>

                    {/* Occupations List */}
                    {sec.occupations && sec.occupations.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Key Occupations in this Sector:
                        </span>
                        {sec.occupations.map((occ) => (
                          <div
                            key={occ.id}
                            className="p-3.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">
                                {occ.title}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                Outlook: {occ.jobOutlook}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                              <div>
                                <strong>Entry Qualification:</strong> {occ.entryQualification}
                              </div>
                              <div>
                                <strong>Language Requirement:</strong> {occ.languageProficiency}
                              </div>
                              {occ.typicalStartingSalary && (
                                <div>
                                  <strong>Starting Salary:</strong> {sec.salaryCurrency || profile.currencySymbol} {occ.typicalStartingSalary.toLocaleString()} ({occ.salarySource || 'Reported'})
                                </div>
                              )}
                              {occ.isRegulated && (
                                <div className="text-amber-700 dark:text-amber-300">
                                  <strong>Regulated Profession:</strong> {occ.licensingRequirements || 'Licensing exam required'}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. ROADMAP TAB */}
        {activeTab === 'ROADMAP' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-500" />
                6-Stage Practical Study-to-Work Career Roadmap
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Tailored timeline framework from pre-arrival planning to post-graduation permanent residence. This is a planning framework, not legal advice.
              </p>

              {primaryRoadmap ? (
                <div className="space-y-6">
                  {primaryRoadmap.steps.map((step) => (
                    <div
                      key={step.id}
                      className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-base font-bold text-slate-900 dark:text-white">
                          {step.stageTitle}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-semibold">
                          {step.timelineDescription}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {step.actionItems.map((action, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 shrink-0 mt-0.5" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>

                      {step.criticalRules && (
                        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300">
                          <strong>Critical Legal Warning:</strong> {step.criticalRules}
                        </div>
                      )}

                      {step.keyResources && step.keyResources.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-2 text-xs">
                          {step.keyResources.map((res, i) => (
                            <a
                              key={i}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              {res.label} ↗
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  Roadmap data being compiled for this jurisdiction.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 7. SOURCES TAB */}
        {activeTab === 'SOURCES' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-500" />
                Authoritative Government Sources & Verification Dates
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                All regulatory data is extracted from primary government gazettes, labor ministries, and immigration departments.
              </p>

              <div className="space-y-3">
                {profile.officialSources.map((src) => (
                  <div
                    key={src.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {src.sourceTitle}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                          {src.status}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400">
                        Authority: <strong className="text-slate-700 dark:text-slate-300">{src.authorityName}</strong> • Category: {src.category} • Retrieved: {new Date(src.retrievalDate).toLocaleDateString()}
                      </p>
                    </div>

                    <a
                      href={src.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-primary-600 dark:text-primary-400 font-semibold hover:underline shrink-0"
                    >
                      Visit Official Source <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Propose Correction Modal */}
      <PolicyCorrectionModal
        isOpen={isCorrectionOpen}
        onClose={() => setIsCorrectionOpen(false)}
        countryId={profile.id}
        countryName={profile.name}
        entityType={correctionTarget}
      />
    </div>
  );
};
