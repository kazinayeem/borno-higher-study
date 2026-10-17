import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Building2,
  DollarSign,
  Clock,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Search,
  Check,
  Info,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { getEnglishAdvisorRecommendation, getUniversities } from '../services/api';
import { SeoHead } from '../components/common/SeoHead';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';

interface TargetCountryOption {
  slug: string;
  name: string;
  nameBn: string;
  flag: string;
  dbQueryName?: string;
}

const TARGET_COUNTRIES: TargetCountryOption[] = [
  { slug: 'united-kingdom', name: 'United Kingdom', nameBn: 'যুক্তরাজ্য', flag: '🇬🇧', dbQueryName: 'United Kingdom' },
  { slug: 'united-states', name: 'United States', nameBn: 'যুক্তরাষ্ট্র', flag: '🇺🇸', dbQueryName: 'United States' },
  { slug: 'canada', name: 'Canada', nameBn: 'কানাডা', flag: '🇨🇦', dbQueryName: 'Canada' },
  { slug: 'australia', name: 'Australia', nameBn: 'অস্ট্রেলিয়া', flag: '🇦🇺', dbQueryName: 'Australia' },
  { slug: 'germany', name: 'Germany', nameBn: 'জার্মানি', flag: '🇩🇪', dbQueryName: 'Germany' },
  { slug: 'finland', name: 'Finland', nameBn: 'ফিনল্যান্ড', flag: '🇫🇮', dbQueryName: 'Finland' },
  { slug: 'sweden', name: 'Sweden', nameBn: 'সুইডেন', flag: '🇸🇪', dbQueryName: 'Sweden' },
  { slug: 'ireland', name: 'Ireland', nameBn: 'আয়ারল্যান্ড', flag: '🇮🇪', dbQueryName: 'Ireland' },
  { slug: 'netherlands', name: 'Netherlands', nameBn: 'নেদারল্যান্ডস', flag: '🇳🇱', dbQueryName: 'Netherlands' },
];

export const EnglishTestAdvisorPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [step, setStep] = useState(1);

  // Form State
  const [targetCountry, setTargetCountry] = useState('united-kingdom');
  const [qualificationLevel, setQualificationLevel] = useState('UNDERGRADUATE');
  const [shortlistedUniIds, setShortlistedUniIds] = useState<string[]>([]);
  const [deliveryPreference, setDeliveryPreference] = useState<'TEST_CENTRE' | 'ONLINE' | 'NO_PREFERENCE'>('TEST_CENTRE');
  const [existingTest, setExistingTest] = useState('NONE');
  const [existingScore, setExistingScore] = useState<number | undefined>(undefined);
  const [budgetBdt, setBudgetBdt] = useState<number>(30000);

  // Available options & Filtering
  const [availableUniversities, setAvailableUniversities] = useState<any[]>([]);
  const [uniSearchQuery, setUniSearchQuery] = useState('');
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<any | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);

  const selectedCountryObj = useMemo(
    () => TARGET_COUNTRIES.find((c) => c.slug === targetCountry) || TARGET_COUNTRIES[0],
    [targetCountry]
  );

  useEffect(() => {
    loadShortlistOptions();
  }, [targetCountry]);

  const loadShortlistOptions = async () => {
    try {
      setLoadingUnis(true);
      const queryName = selectedCountryObj.dbQueryName || selectedCountryObj.name;
      const res = await getUniversities({ country: queryName });
      setAvailableUniversities(res.universities || []);
    } catch {
      setAvailableUniversities([]);
    } finally {
      setLoadingUnis(false);
    }
  };

  const filteredUniversities = useMemo(() => {
    if (!uniSearchQuery.trim()) return availableUniversities;
    const q = uniSearchQuery.toLowerCase();
    return availableUniversities.filter(
      (u) => u.name?.toLowerCase().includes(q) || u.cityName?.toLowerCase().includes(q)
    );
  }, [availableUniversities, uniSearchQuery]);

  const toggleSelectUni = (id: string) => {
    if (shortlistedUniIds.includes(id)) {
      setShortlistedUniIds(shortlistedUniIds.filter((item) => item !== id));
    } else {
      setShortlistedUniIds([...shortlistedUniIds, id]);
    }
  };

  const handleGenerateRecommendation = async () => {
    try {
      setCalculating(true);
      setCalcError(null);
      const res = await getEnglishAdvisorRecommendation({
        targetCountry,
        qualificationLevel,
        shortlistedUniIds,
        deliveryPreference,
        existingTest: existingTest === 'NONE' ? undefined : existingTest,
        existingScore: existingScore ? Number(existingScore) : undefined,
        budgetBdt,
      });
      setRecommendationResult(res);
      setStep(4);
      // Smooth scroll to top of card on results
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (e: any) {
      console.error(e);
      setCalcError(e.message || (isBn ? 'রিকমেন্ডেশন প্রস্তুত করতে সমস্যা হয়েছে' : 'Failed to generate recommendation. Please try again.'));
    } finally {
      setCalculating(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setRecommendationResult(null);
    setShortlistedUniIds([]);
    setDeliveryPreference('TEST_CENTRE');
    setBudgetBdt(30000);
    setExistingTest('NONE');
    setExistingScore(undefined);
    setCalcError(null);
  };

  // Stepper definition
  const stepsMeta = [
    { num: 1, title: isBn ? 'গন্তব্য ও লেভেল' : 'Destination', desc: isBn ? 'দেশ ও ডিগ্রির ধাপ' : 'Country & Level' },
    { num: 2, title: isBn ? 'শর্টলিস্ট' : 'Shortlist', desc: isBn ? 'নির্বাচিত প্রতিষ্ঠান' : 'Target Universities' },
    { num: 3, title: isBn ? 'ফরম্যাট ও বাজেট' : 'Preferences', desc: isBn ? 'পরীক্ষার ধরন ও খরচ' : 'Delivery & Budget' },
    { num: 4, title: isBn ? 'ফলাফল ও পরামর্শ' : 'Results', desc: isBn ? 'সেরা টেস্ট সুপারিশ' : 'Recommendation' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors pb-24">
      <SeoHead
        title={
          isBn
            ? 'ইংরেজি টেস্ট রিকমেন্ডেশন উইজার্ড: বিশ্ববিদ্যালয় শর্টলিস্ট ও ভিসা গাইড | বর্ণ'
            : 'English Test Recommendation Wizard: Admissions & Visa Alignment | Borno'
        }
        description="Interactive admissions advisor evaluating IELTS Academic, PTE Academic, and TOEFL iBT acceptance across shortlisted international universities, Bangladesh registration fees, and visa rules."
        canonicalPath="/english-test-advisor"
        ogType="website"
      />

      {/* Top Breadcrumb Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: isBn ? 'ইংরেজি টেস্ট নির্দেশিকা' : 'English Tests', href: '/english-tests' },
            { label: isBn ? 'টেস্ট অ্যাডভাইজর উইজার্ড' : 'Recommendation Wizard' },
          ]}
        />
      </div>

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-2 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-3 shadow-2xs">
          <Compass className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>{isBn ? 'ভর্তি নীতি ও ভিসা সামঞ্জস্য ইঞ্জিন' : 'Admissions Rules Alignment Engine'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#0F172A] dark:text-white tracking-tight mb-3">
          {isBn ? 'ইংরেজি টেস্ট রিকমেন্ডেশন উইজার্ড' : 'English Test Recommendation Wizard'}
        </h1>

        <p className="text-sm sm:text-base text-[#475569] dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {isBn
            ? 'আপনার গন্তব্য দেশ, পছন্দের বিশ্ববিদ্যালয় এবং পরীক্ষার ফরম্যাট নির্বাচন করুন। আমাদের অ্যালগরিদম অফিসিয়াল ভর্তি নীতিমালা ও কনস্যুলার শর্তাবলী যাচাই করে সেরা পরীক্ষার পরামর্শ দেবে।'
            : 'Answer a few quick questions about your study destination, shortlisted universities, and delivery preferences. Our algorithm checks verified admissions policies to recommend your best test path.'}
        </p>

        {/* Accessible Stepper Progress Indicator */}
        <nav aria-label="Wizard Steps" className="mt-8 max-w-2xl mx-auto">
          <ol className="grid grid-cols-4 items-center">
            {stepsMeta.map((s, idx) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              const isUpcoming = step < s.num;

              return (
                <li key={s.num} className="relative flex flex-col items-center">
                  {/* Connecting Line */}
                  {idx > 0 && (
                    <div
                      aria-hidden="true"
                      className={`absolute top-4 -left-1/2 w-full h-0.5 z-0 transition-colors ${
                        step >= s.num ? 'bg-[#0D9488]' : 'bg-[#CBD5E1] dark:bg-slate-700'
                      }`}
                    />
                  )}

                  {/* Step Circle */}
                  <div
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all shadow-xs ${
                      isCompleted
                        ? 'bg-[#0F9488] text-white ring-2 ring-teal-600/30'
                        : isCurrent
                        ? 'bg-[#0D9488] text-white ring-4 ring-teal-100 dark:ring-teal-900/60'
                        : 'bg-white dark:bg-slate-800 text-[#475569] dark:text-slate-300 border-2 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 text-white stroke-[2.5]" /> : s.num}
                  </div>

                  {/* Step Label (Visible on all screens) */}
                  <div className="mt-2 text-center">
                    <span
                      className={`block text-[11px] sm:text-xs font-semibold leading-tight ${
                        isCurrent
                          ? 'text-[#0D9488] dark:text-teal-300 font-bold'
                          : isCompleted
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-[#475569] dark:text-slate-400'
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {s.desc}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </header>

      {/* Main Wizard Card Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E2E8F0] dark:border-slate-800 shadow-card p-6 sm:p-8 md:p-10 transition-colors">
          {/* STEP 1: Destination & Study Level */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  {isBn ? 'ধাপ ১/৪' : 'Step 1 of 4'}
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#0F172A] dark:text-white mt-1">
                  {isBn ? 'গন্তব্য দেশ ও উচ্চশিক্ষার স্তর নির্ধারণ' : 'Destination Country & Study Level'}
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 mt-1">
                  {isBn
                    ? 'আপনি কোন দেশে এবং কোন ডিগ্রির জন্য আবেদন করতে চান তা নির্বাচন করুন।'
                    : 'Select where you plan to study and the academic qualification level you are pursuing.'}
                </p>
              </div>

              {/* Target Country Grid */}
              <div>
                <label className="block text-xs font-bold text-[#334155] dark:text-slate-200 mb-2.5 uppercase tracking-wider">
                  {isBn ? '১. টার্গেট গন্তব্য দেশ' : '1. Target Study Destination'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TARGET_COUNTRIES.map((c) => {
                    const isSelected = targetCountry === c.slug;
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => {
                          setTargetCountry(c.slug);
                          setShortlistedUniIds([]); // Reset shortlist on country switch
                        }}
                        className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition focus:outline-none focus:ring-2 focus:ring-[#0F9488] ${
                          isSelected
                            ? 'border-[#0D9488] bg-[#F0FDFA] dark:bg-teal-950/40 text-[#0F172A] dark:text-white font-bold ring-2 ring-teal-500/20 shadow-xs'
                            : 'border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-800/80 text-[#334155] dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50'
                        }`}
                      >
                        <span className="text-2xl shrink-0" role="img" aria-label={c.name}>
                          {c.flag}
                        </span>
                        <div className="min-w-0">
                          <span className="text-xs font-semibold block truncate">
                            {isBn ? c.nameBn : c.name}
                          </span>
                          <span className="text-[10px] text-[#475569] dark:text-slate-400 block truncate">
                            {isSelected ? (isBn ? '✓ নির্বাচিত' : '✓ Selected') : isBn ? 'বাছাই করুন' : 'Tap to select'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Qualification Level */}
              <div>
                <label className="block text-xs font-bold text-[#334155] dark:text-slate-200 mb-2.5 uppercase tracking-wider">
                  {isBn ? '২. ডিগ্রির ধাপ (Qualification Level)' : '2. Qualification Level'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    {
                      value: 'UNDERGRADUATE',
                      title: isBn ? 'স্নাতক (Undergraduate / Bachelor)' : "Undergraduate (Bachelor's Degree)",
                      desc: isBn ? 'এইচএসসি বা সমমানের পরবর্তী ৩-৪ বছরের ডিগ্রি' : 'First tertiary degree (BSc, BA, BEng)',
                    },
                    {
                      value: 'POSTGRADUATE_TAUGHT',
                      title: isBn ? 'স্নাতকোত্তর টট (Master’s Taught)' : "Postgraduate Taught (Master's Degree)",
                      desc: isBn ? 'ক্লাসরুম ও কোর্সওয়ার্ক ভিত্তিক ১-২ বছরের ডিগ্রি' : 'Coursework-based masters (MSc, MA, MBA)',
                    },
                    {
                      value: 'POSTGRADUATE_RESEARCH',
                      title: isBn ? 'গবেষণা / পিএইচডি (PhD / Research)' : 'Postgraduate Research (PhD / Doctorate)',
                      desc: isBn ? 'গবেষণামূলক ও ডক্টরাল থিসিস ডিগ্রি' : 'Doctoral and research degree pathways',
                    },
                    {
                      value: 'FOUNDATION',
                      title: isBn ? 'ফাউন্ডেশন / প্রি-সেশনাল' : 'Foundation / Pre-sessional (Below Degree)',
                      desc: isBn ? 'ডিগ্রির পূর্ববর্তী প্রস্তুতিমূলক কোর্স (SELT আবশ্যক)' : 'Preparatory pathway courses often requiring SELT',
                    },
                  ].map((lvl) => {
                    const isSelected = qualificationLevel === lvl.value;
                    return (
                      <button
                        key={lvl.value}
                        type="button"
                        onClick={() => setQualificationLevel(lvl.value)}
                        className={`p-3.5 rounded-2xl border text-left transition focus:outline-none focus:ring-2 focus:ring-[#0F9488] ${
                          isSelected
                            ? 'border-[#0D9488] bg-[#F0FDFA] dark:bg-teal-950/40 text-[#0F172A] dark:text-white font-bold ring-2 ring-teal-500/20 shadow-xs'
                            : 'border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-800/80 text-[#334155] dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50'
                        }`}
                      >
                        <span className="block font-bold text-xs text-[#0F172A] dark:text-white mb-0.5">
                          {lvl.title}
                        </span>
                        <span className="text-[11px] text-[#475569] dark:text-slate-400 block font-normal">
                          {lvl.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-[#0F9488] hover:bg-[#0D766E] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition"
                >
                  <span>{isBn ? 'পরবর্তী: বিশ্ববিদ্যালয় শর্টলিস্ট' : 'Continue to Shortlist'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: University Shortlist Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  {isBn ? 'ধাপ ২/৪' : 'Step 2 of 4'}
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#0F172A] dark:text-white mt-1">
                  {isBn ? 'টার্গেট বিশ্ববিদ্যালয় শর্টলিস্ট' : 'Shortlisted Universities'}
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 mt-1">
                  {isBn
                    ? `${selectedCountryObj.nameBn}-র যে বিশ্ববিদ্যালয়গুলোতে আবেদন করতে চান সেগুলো নির্বাচন করুন। আমাদের ইঞ্জিন পলিসি দ্বন্দ্ব শনাক্ত করবে।`
                    : `Select one or more institutions in ${selectedCountryObj.name}. We will evaluate their verified English score cutoffs and test format restrictions.`}
                </p>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={uniSearchQuery}
                  onChange={(e) => setUniSearchQuery(e.target.value)}
                  placeholder={
                    isBn
                      ? 'বিশ্ববিদ্যালয়ের নাম বা শহর লিখে খুঁজুন...'
                      : 'Search universities by name or city in ' + selectedCountryObj.name + '...'
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F9488]"
                />
              </div>

              {/* University List Box */}
              <div className="max-h-72 overflow-y-auto space-y-2 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-3 bg-slate-50/50 dark:bg-slate-900/50">
                {loadingUnis ? (
                  <div className="text-center py-10 space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-teal-600 mx-auto" />
                    <p className="text-xs text-[#475569] dark:text-slate-400 font-medium">
                      {isBn ? 'প্রতিষ্ঠান তালিকা লোড হচ্ছে...' : 'Loading verified university catalog...'}
                    </p>
                  </div>
                ) : filteredUniversities.length === 0 ? (
                  <div className="text-center py-10 text-xs text-[#475569] dark:text-slate-400 space-y-2">
                    <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p>
                      {uniSearchQuery
                        ? isBn
                          ? 'কোনো প্রতিষ্ঠান পাওয়া যায়নি।'
                          : 'No matching institutions found for your search.'
                        : isBn
                        ? 'নির্বাচিত দেশের জন্য কোনো প্রতিষ্ঠান পাওয়া যায়নি।'
                        : 'No universities currently listed for this destination.'}
                    </p>
                  </div>
                ) : (
                  filteredUniversities.slice(0, 40).map((u) => {
                    const isSelected = shortlistedUniIds.includes(u.id);
                    return (
                      <div
                        key={u.id}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            toggleSelectUni(u.id);
                          }
                        }}
                        onClick={() => toggleSelectUni(u.id)}
                        className={`p-3 rounded-xl border cursor-pointer text-xs flex items-center justify-between transition focus:outline-none focus:ring-2 focus:ring-[#0F9488] ${
                          isSelected
                            ? 'border-[#0D9488] bg-[#F0FDFA] dark:bg-teal-950/40 text-[#0F172A] dark:text-white font-semibold'
                            : 'border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-800 text-[#334155] dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <Building2
                            className={`w-4 h-4 shrink-0 ${
                              isSelected ? 'text-[#0D9488]' : 'text-slate-400'
                            }`}
                          />
                          <div className="truncate">
                            <span className="font-semibold block truncate">{u.name}</span>
                            {u.cityName && (
                              <span className="text-[10px] text-[#475569] dark:text-slate-400">
                                {u.cityName}
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border text-xs shrink-0 transition ${
                            isSelected
                              ? 'bg-[#0D9488] border-[#0D9488] text-white font-bold'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Selection Counter & Guidance */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E2E8F0] dark:border-slate-700 flex items-start gap-2.5 text-xs text-[#475569] dark:text-slate-300">
                <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span>
                    {isBn ? 'নির্বাচিত প্রতিষ্ঠান: ' : 'Selected Institutions: '}
                    <strong className="text-[#0F172A] dark:text-white font-bold">
                      {shortlistedUniIds.length}
                    </strong>
                    {isBn ? ' টি' : ''}.{' '}
                  </span>
                  <span>
                    {isBn
                      ? 'আপনি কোনো নির্দিষ্ট প্রতিষ্ঠান ছাড়া পুরো দেশের সার্বিক রিকমেন্ডেশন দেখতে চাইলে সরাসরি এগিয়ে যেতে পারেন।'
                      : 'You may also proceed with 0 selected institutions to see comprehensive country-wide test recommendations.'}
                  </span>
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[#334155] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isBn ? 'পূর্ববর্তী' : 'Back'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-[#0F9488] hover:bg-[#0D766E] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition"
                >
                  <span>{isBn ? 'পরবর্তী: পরীক্ষার ফরম্যাট ও বাজেট' : 'Continue to Preferences'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Delivery Format, Existing Score & Budget */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  {isBn ? 'ধাপ ৩/৪' : 'Step 3 of 4'}
                </span>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#0F172A] dark:text-white mt-1">
                  {isBn ? 'টেস্ট ফরম্যাট ও রেজিস্ট্রেশন বাজেট' : 'Delivery Format & Test Budget'}
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 mt-1">
                  {isBn
                    ? 'আপনার পরীক্ষার পছন্দের ধরন ও প্রস্তুতি বাজেট অনুযায়ী সুপারিশ কাস্টমাইজ করুন।'
                    : 'Tailor recommendations based on test delivery preference and your maximum exam budget in BDT.'}
                </p>
              </div>

              {/* Delivery Preference */}
              <div>
                <label className="block text-xs font-bold text-[#334155] dark:text-slate-200 mb-2.5 uppercase tracking-wider">
                  {isBn ? '১. পরীক্ষার ডেলিভারি ফরম্যাট' : '1. Test Delivery Preference'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    {
                      value: 'TEST_CENTRE',
                      badge: '🏢',
                      title: isBn ? 'ফিজিক্যাল টেস্ট সেন্টার' : 'Physical Test Centre',
                      desc: isBn
                        ? 'শীর্ষ বিশ্ববিদ্যালয় ও সরকারি স্টুডেন্ট ভিসার জন্য বাধ্যতামূলক'
                        : 'Required by top universities, professional degrees & statutory student visas',
                    },
                    {
                      value: 'ONLINE',
                      badge: '💻',
                      title: isBn ? 'অনলাইন হোম টেস্ট' : 'At-Home Online Test',
                      desc: isBn
                        ? 'ওয়েবক্যাম ও দূরবর্তী নজরদারিতে বাসা থেকে পরীক্ষা (ভিসা সীমাবদ্ধতা দ্রষ্টব্য)'
                        : 'Taken from home with webcam and proctoring. Note: restricted by certain visas',
                    },
                    {
                      value: 'NO_PREFERENCE',
                      badge: '⚡',
                      title: isBn ? 'যেকোনো উপযুক্ত ফরম্যাট' : 'No Preference',
                      desc: isBn
                        ? 'যেটি শর্টলিস্টের শর্ত পূরণ করে এবং তুলনামূলক সাশ্রয়ী'
                        : 'Whichever valid format satisfies my university shortlist at optimal cost',
                    },
                  ].map((p) => {
                    const isSelected = deliveryPreference === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setDeliveryPreference(p.value as any)}
                        className={`p-4 rounded-2xl border text-left transition focus:outline-none focus:ring-2 focus:ring-[#0F9488] ${
                          isSelected
                            ? 'border-[#0D9488] bg-[#F0FDFA] dark:bg-teal-950/40 text-[#0F172A] dark:text-white ring-2 ring-teal-500/20 shadow-xs'
                            : 'border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-800/80 text-[#334155] dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xl block mb-2" role="img" aria-hidden="true">
                          {p.badge}
                        </span>
                        <span className="block font-bold text-xs text-[#0F172A] dark:text-white mb-1">
                          {p.title}
                        </span>
                        <span className="text-[11px] text-[#475569] dark:text-slate-400 block font-normal leading-relaxed">
                          {p.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget Slider */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="budget-slider"
                      className="block text-xs font-bold text-[#334155] dark:text-slate-200 uppercase tracking-wider"
                    >
                      {isBn ? '২. সর্বোচ্চ রেজিস্ট্রেশন বাজেট' : '2. Approximate Exam Budget'}
                    </label>
                    <span className="text-[11px] text-[#475569] dark:text-slate-400">
                      {isBn ? 'বাংলাদেশে অফিশিয়াল পরীক্ষার ফি অনুযায়ী' : 'Official registration fees across test centers in Bangladesh'}
                    </span>
                  </div>

                  <span className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-[#0D9488] dark:text-teal-300 font-mono font-bold text-sm shadow-2xs">
                    BDT {budgetBdt?.toLocaleString()}
                  </span>
                </div>

                <input
                  id="budget-slider"
                  type="range"
                  min="20000"
                  max="35000"
                  step="1000"
                  value={budgetBdt}
                  onChange={(e) => setBudgetBdt(Number(e.target.value))}
                  className="w-full h-2.5 bg-[#CBD5E1] dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0D9488] focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                />

                <div className="flex justify-between text-[11px] font-medium text-[#475569] dark:text-slate-400 pt-1">
                  <span>BDT 20,000 (Min)</span>
                  <span className="hidden sm:inline">BDT 27,000 (IELTS/PTE Standard)</span>
                  <span>BDT 35,000 (Max)</span>
                </div>
              </div>

              {/* Optional: Existing Test Taken */}
              <div>
                <label className="block text-xs font-bold text-[#334155] dark:text-slate-200 mb-2 uppercase tracking-wider">
                  {isBn ? '৩. পূর্ববর্তী কোনো টেস্ট স্কোর আছে কি? (ঐচ্ছিক)' : '3. Existing English Test Score (Optional)'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  {[
                    { id: 'NONE', label: isBn ? 'নেই (নতুন)' : 'None (First time)' },
                    { id: 'IELTS', label: 'IELTS Academic' },
                    { id: 'PTE', label: 'PTE Academic' },
                    { id: 'TOEFL', label: 'TOEFL iBT' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setExistingTest(item.id)}
                      className={`p-2.5 rounded-xl border text-center transition font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#0F9488] ${
                        existingTest === item.id
                          ? 'border-[#0D9488] bg-[#F0FDFA] dark:bg-teal-950/40 text-[#0F172A] dark:text-white ring-1 ring-teal-500/20'
                          : 'border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-800 text-[#334155] dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {existingTest !== 'NONE' && (
                  <div className="mt-3">
                    <label className="block text-[11px] font-semibold text-[#334155] dark:text-slate-300 mb-1">
                      {isBn ? 'আপনার বর্তমান স্কোর লিখুন:' : 'Enter your overall score:'}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="120"
                      value={existingScore ?? ''}
                      onChange={(e) => setExistingScore(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder={
                        existingTest === 'IELTS' ? 'e.g. 6.5' : existingTest === 'PTE' ? 'e.g. 65' : 'e.g. 90'
                      }
                      className="w-full sm:w-48 px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0F9488]"
                    />
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {calcError && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{calcError}</span>
                </div>
              )}

              {/* Step 3 Actions */}
              <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[#334155] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{isBn ? 'পূর্ববর্তী' : 'Back'}</span>
                </button>

                <button
                  type="button"
                  disabled={calculating}
                  onClick={handleGenerateRecommendation}
                  className="px-7 py-3 bg-[#0F9488] hover:bg-[#0D766E] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {calculating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>{isBn ? 'ভর্তি নীতি বিশ্লেষণ হচ্ছে...' : 'Evaluating Shortlist Rules...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-teal-200" />
                      <span>{isBn ? 'পরামর্শ ও বিশ্লেষণ দেখুন' : 'Generate Recommendation'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Results & Conflict Analysis */}
          {step === 4 && recommendationResult && (
            <div className="space-y-6">
              {/* Header Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{isBn ? 'শর্টলিস্ট বিশ্লেষণ সম্পন্ন' : 'Shortlist Analysis Completed'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#0F172A] dark:text-white">
                    {isBn ? 'আপনার জন্য সুপারিশকৃত ইংরেজি টেস্ট প্ল্যান' : 'Your Recommended English Test Plan'}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#334155] dark:text-slate-200 transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isBn ? 'নতুন মূল্যায়ন' : 'Start Over'}</span>
                </button>
              </div>

              {/* Conflict Alerts (if any) */}
              {recommendationResult.conflictAlerts?.length > 0 && (
                <div className="space-y-2.5">
                  {recommendationResult.conflictAlerts.map((alert: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/70 text-amber-950 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-3 shadow-xs"
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-amber-900 dark:text-amber-200 font-bold mb-0.5">
                          {isBn ? '⚠️ শর্টলিস্ট নীতি সতর্কতা' : 'Shortlist Policy Warning'}
                        </strong>
                        <span>{alert}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Primary Recommendation Card (High-Contrast Rich Surface) */}
              {recommendationResult.recommendation?.primary && (
                <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
                  {/* Decorative Background Accent */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs text-teal-300 font-bold uppercase tracking-wider block">
                      {isBn ? 'সর্বোচ্চ সুপারিশকৃত টেস্ট' : 'Primary Recommended Match'}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-teal-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-xs">
                      {recommendationResult.recommendation.primary.acceptanceRateAcrossShortlist}% {isBn ? 'গ্রহণযোগ্যতা' : 'Acceptance'}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mb-4">
                    {recommendationResult.recommendation.primary.name}
                  </h3>

                  {/* Stat Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 text-xs">
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 block mb-0.5">
                        {isBn ? 'ডেলিভারি মোড' : 'Delivery Mode'}
                      </span>
                      <span className="font-bold text-white">
                        {recommendationResult.recommendation.primary.deliveryMode === 'ONLINE'
                          ? isBn
                            ? 'অনলাইন হোম'
                            : 'At-Home Online'
                          : isBn
                          ? 'টেস্ট সেন্টার'
                          : 'Test Centre'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 block mb-0.5">
                        {isBn ? 'পরীক্ষার সময়কাল' : 'Duration'}
                      </span>
                      <span className="font-bold text-white">
                        {recommendationResult.recommendation.primary.durationMinutes} mins
                      </span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 block mb-0.5">
                        {isBn ? 'ফলাফল প্রকাশের সময়' : 'Turnaround'}
                      </span>
                      <span className="font-bold text-white">
                        {recommendationResult.recommendation.primary.resultTurnaround}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 block mb-0.5">
                        {isBn ? 'আনুমানিক ফি (বাংলাদেশ)' : 'Est. Fee (BDT)'}
                      </span>
                      <span className="font-bold text-teal-300">
                        BDT {recommendationResult.recommendation.primary.estimatedFeeBdt?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 mb-5 leading-relaxed bg-slate-850/60 p-4 rounded-xl border border-slate-800">
                    {recommendationResult.recommendation.primary.rationale}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                    <span className="text-xs text-slate-300">
                      {recommendationResult.recommendation.primary.shortlistMatchDescription}
                    </span>

                    {recommendationResult.recommendation.primary.bookingUrl && (
                      <a
                        href={recommendationResult.recommendation.primary.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition"
                      >
                        <span>{isBn ? 'অফিশিয়াল টেস্ট বুকিং' : 'Book Official Test'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Secondary Alternative Card */}
              {recommendationResult.recommendation?.alternative && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[#E2E8F0] dark:border-slate-700 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                      {isBn ? 'বিকল্প টেস্ট অপশন' : 'Viable Alternative Option'}
                    </span>
                    <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400">
                      BDT {recommendationResult.recommendation.alternative.estimatedFeeBdt?.toLocaleString()}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#0F172A] dark:text-white">
                    {recommendationResult.recommendation.alternative.name}
                  </h4>

                  <p className="text-[#475569] dark:text-slate-300 leading-relaxed">
                    {recommendationResult.recommendation.alternative.rationale}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] text-[#475569] dark:text-slate-400">
                      {recommendationResult.recommendation.alternative.deliveryMode === 'ONLINE'
                        ? 'At-Home Online'
                        : 'Physical Test Centre'}
                    </span>
                    <Link
                      to={`/university-test-acceptance?testFormatCode=${recommendationResult.recommendation.alternative.code}`}
                      className="text-xs font-semibold text-[#0D9488] dark:text-teal-400 hover:underline"
                    >
                      {isBn ? 'বিশ্ববিদ্যালয় গ্রহণযোগ্যতা যাচাই করুন →' : 'Compare University Acceptance →'}
                    </Link>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-[11px] text-[#475569] dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-800 dark:text-slate-200">
                  {isBn ? 'সতর্কতামূলক নির্দেশনা: ' : 'Official Disclaimer: '}
                </strong>
                <span>{recommendationResult.disclaimer}</span>
              </div>

              {/* Step 4 Navigation Actions */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[#334155] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                  <span>{isBn ? 'নতুন মূল্যায়ন শুরু করুন' : 'Start Over with Different Criteria'}</span>
                </button>

                <div className="flex gap-2">
                  <Link
                    to="/university-test-acceptance"
                    className="px-5 py-2.5 bg-[#0F9488] hover:bg-[#0D766E] text-white rounded-xl text-xs sm:text-sm font-bold transition text-center shadow-sm"
                  >
                    {isBn ? 'বিশ্ববিদ্যালয় ডেটাবেজ ব্রাউজ করুন' : 'Browse University Policies'}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
