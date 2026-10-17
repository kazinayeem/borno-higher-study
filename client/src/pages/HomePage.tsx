import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { UNIVERSITIES_DATA } from '../data/universitiesData.js';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData.js';
import { SUBJECTS_DATA } from '../data/subjectsData.js';
import { CountryCard } from '../components/common/CountryCard.js';
import { UniversityCard } from '../components/common/UniversityCard.js';
import { ScholarshipCard } from '../components/common/ScholarshipCard.js';
import { SeoHead } from '../components/common/SeoHead.js';
import { getBlogArticles } from '../services/api.js';
import { ArticleItem } from '../types/index.js';
import { useTranslation } from '../context/LanguageContext.js';
import { gsap, isReducedMotion, MOTION_DURATIONS, MOTION_EASE } from '../utils/motion.js';
import { RevealOnScroll, StaggerGroup, SmoothAccordion } from '../components/motion/index.js';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Globe,
  Coins,
  Calendar,
  Layers,
  ChevronDown,
  BookOpen,
  Scale,
  Calculator,
  Compass,
  Award,
  TrendingDown,
  ExternalLink,
  Clock,
  FileText,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t, formatNumber, isBengali } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [editorialArticles, setEditorialArticles] = useState<ArticleItem[]>([]);
  const heroContainerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroContainerRef.current || isReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: MOTION_EASE.editorial } });
      tl.fromTo('.hero-anim-badge', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: MOTION_DURATIONS.standard })
        .fromTo('.hero-anim-title', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: MOTION_DURATIONS.entrance }, '-=0.2')
        .fromTo('.hero-anim-sub', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: MOTION_DURATIONS.standard }, '-=0.25')
        .fromTo('.hero-anim-form', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: MOTION_DURATIONS.entrance }, '-=0.2')
        .fromTo('.hero-anim-stats', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: MOTION_DURATIONS.standard }, '-=0.15');
    }, heroContainerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadEditorialArticles() {
      try {
        const res = await getBlogArticles({ limit: 3, featured: true });
        if (isMounted && res?.articles?.length) {
          setEditorialArticles(res.articles);
        }
      } catch (e) {
        // Fallback gracefully handled
      }
    }
    loadEditorialArticles();
    return () => {
      isMounted = false;
    };
  }, []);

  // Search examples
  const exampleSearches = [
    { label: "Computer Science Master's in Germany", query: "Computer Science", country: "germany", level: "MASTER" },
    { label: "DAAD & Fully Funded Fellowships", query: "Scholarship", country: "all", level: "all" },
    { label: "Bachelor's Programs in Finland", query: "Bachelor", country: "finland", level: "BACHELOR" },
    { label: "Subsidized Public Tuition in Europe", query: "", country: "all", level: "all" },
  ];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCountry !== 'all') params.set('country', selectedCountry);
    if (selectedDegree !== 'all') params.set('level', selectedDegree);
    if (selectedSubject !== 'all') params.set('subject', selectedSubject);
    if (scholarshipOnly) params.set('hasScholarship', 'true');
    navigate(`/universities?${params.toString()}`);
  };

  const applyExample = (ex: typeof exampleSearches[0]) => {
    setSearchQuery(ex.query);
    setSelectedCountry(ex.country);
    setSelectedDegree(ex.level);
    const params = new URLSearchParams();
    if (ex.query) params.set('search', ex.query);
    if (ex.country !== 'all') params.set('country', ex.country);
    if (ex.level !== 'all') params.set('level', ex.level);
    navigate(`/universities?${params.toString()}`);
  };

  // Curated registry slices
  const popularDestinations = COUNTRIES_DATA.filter((c) => c.isFeatured).slice(0, 6);
  const featuredSubjects = SUBJECTS_DATA.slice(0, 8);
  const recommendedUniversities = UNIVERSITIES_DATA.slice(0, 6);
  const governmentScholarships = SCHOLARSHIPS_DATA.slice(0, 4);
  const affordableDestinations = COUNTRIES_DATA.filter((c) => c.avgTuitionMin <= 5000).slice(0, 4);

  // FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = [
    {
      q: 'How does Borno Higher Study verify university and scholarship data?',
      a: 'Every tuition rate, admission prerequisite, deadline, and funding criteria is verified against official institutional syllabi, embassy portals, and statutory education registries (such as the UNESCO-associated IAU World Higher Education Database). We cite primary sources and record verification dates for every registry entry.',
    },
    {
      q: 'Which scholarships accept applicants from developing nations and Bangladesh?',
      a: 'We evaluate eligibility by citizenship. Prominent government programs—including the German Academic Exchange Service (DAAD), Stipendium Hungaricum, the Swedish Institute (SISGP), UK Chevening and Commonwealth, Japanese MEXT, and Korean Global Korea Scholarship (GKS)—maintain designated quotas and bilateral agreements for international applicants.',
    },
    {
      q: 'How are living costs and currency conversions calculated?',
      a: 'Our database distinguishes between published institutional tuition and official national living allowances required for student visas. We convert rates into Bangladeshi Taka (BDT) and US Dollars (USD) using current benchmark exchange rates to support verifiable bank solvency declarations.',
    },
    {
      q: 'What is Medium of Instruction (MOI) acceptance, and when can it replace IELTS?',
      a: 'A Medium of Instruction certificate confirms that your previous degree was taught entirely in English. Some universities in Germany, Sweden, Malaysia, and Poland accept an official institutional MOI letter in place of standard IELTS or TOEFL exams, subject to faculty discretion and national visa regulations.',
    },
  ];

  // Schema.org Structured Data
  const schemaOrgData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://borno.edu/#website',
        url: 'https://borno.edu',
        name: 'Borno Higher Study',
        description: 'Global Education Intelligence Platform — Discover universities, degree programs, scholarships, and plan applications.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://borno.edu/universities?search={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://borno.edu/#organization',
        name: 'Borno Higher Study',
        url: 'https://borno.edu',
        logo: 'https://borno.edu/logo-icon.svg',
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://borno.edu/#faq',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B132B] text-slate-800 dark:text-slate-100 transition-colors">
      <SeoHead
        title="Borno Higher Study — Independent Higher Education Research & University Directory"
        description="Authoritative directory of accredited international universities, degree requirements, government scholarships, and post-study visa regulations across 42 countries."
        canonicalPath="/"
        structuredData={schemaOrgData}
      />

      {/* EDITORIAL HERO SECTION */}
      <section ref={heroContainerRef} className="relative bg-[#FAF9F8] dark:bg-[#0F172A] border-b border-slate-200/80 dark:border-slate-800 pt-12 sm:pt-16 pb-14 sm:pb-16 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-5">
            {/* 1. Subtle Editorial Eyebrow Label (No Pill Badge) */}
            <div className="hero-anim-badge inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400"></span>
              <span>{isBengali ? 'আপনার বৈশ্বিক উচ্চশিক্ষা ও ক্যারিয়ার যাত্রা' : 'Your global education journey'}</span>
            </div>

            {/* 2. Main Heading: "Find Your University. Fund Your Future." */}
            <h1 className="hero-anim-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-brand-navy dark:text-white tracking-tight leading-[1.14]">
              {isBengali ? (
                <span>{t('home.heroTitle')}</span>
              ) : (
                <>
                  Find Your University.{' '}
                  <span className="text-teal-700 dark:text-teal-400">Fund Your Future.</span>
                </>
              )}
            </h1>

            {/* 3. Short Explanatory Description */}
            <p className="hero-anim-sub text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              {t('home.heroSubtitle')}
            </p>

            {/* 4. Login Actions (Student Login & Super Admin Login) */}
            <div className="pt-1 sm:pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/student/login"
                className="px-5 py-2.5 rounded-lg bg-[#0B192C] dark:bg-teal-700 hover:bg-slate-800 dark:hover:bg-teal-600 text-white font-medium text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 h-11"
              >
                <GraduationCap className="w-4 h-4 text-teal-400" />
                <span>{isBengali ? 'স্টুডেন্ট পোর্টাল' : 'Student Portal'}</span>
              </Link>
              <Link
                to="/super-admin/login"
                className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm transition-colors flex items-center gap-2 h-11"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>{isBengali ? 'সুপার অ্যাডমিন পোর্টাল' : 'Super Admin Portal'}</span>
              </Link>
            </div>

            {/* 5. Search Panel */}
            <form
              onSubmit={handleHeroSearch}
              className="hero-anim-form mt-6 bg-white dark:bg-slate-900 rounded-xl p-3 sm:p-4 shadow-card border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-left space-y-3"
            >
              {/* Primary Row: Search Input + Search Catalog Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50/80 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-700 h-11">
                  <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <label htmlFor="hero-search-input" className="sr-only">Search universities, destinations, or scholarships</label>
                  <input
                    id="hero-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('home.searchPlaceholder')}
                    className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden text-xs sm:text-sm font-normal min-w-0"
                    aria-label="Search universities and programs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#0B192C] dark:bg-teal-700 hover:bg-slate-800 dark:hover:bg-teal-600 text-white font-medium text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0 h-11"
                >
                  <span>{t('home.searchButton')}</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </button>
              </div>

              {/* Secondary Row: Structured Responsive Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex flex-col gap-1">
                  <label htmlFor="hero-country-select" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {t('universities.country')}
                  </label>
                  <select
                    id="hero-country-select"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 font-medium focus:ring-1 focus:ring-teal-600 focus:border-teal-600 h-9"
                    aria-label="Select Destination Country"
                  >
                    <option value="all">{isBengali ? 'সকল গন্তব্য দেশ (৪২টি)' : 'All 42 Destinations'}</option>
                    {COUNTRIES_DATA.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.flagEmoji} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="hero-degree-select" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {isBengali ? 'ডিগ্রির স্তর' : 'Degree Level'}
                  </label>
                  <select
                    id="hero-degree-select"
                    value={selectedDegree}
                    onChange={(e) => setSelectedDegree(e.target.value)}
                    className="w-full bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 font-medium focus:ring-1 focus:ring-teal-600 focus:border-teal-600 h-9"
                    aria-label="Select Degree Level"
                  >
                    <option value="all">{isBengali ? 'সকল ডিগ্রির স্তর' : 'All Degree Levels'}</option>
                    <option value="BACHELOR">Bachelor's Degree</option>
                    <option value="MASTER">Master's Degree</option>
                    <option value="PHD">Doctoral (PhD)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="hero-subject-select" className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {isBengali ? 'অধ্যয়নের বিষয়' : 'Academic Discipline'}
                  </label>
                  <select
                    id="hero-subject-select"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 font-medium focus:ring-1 focus:ring-teal-600 focus:border-teal-600 h-9"
                    aria-label="Select Academic Subject"
                  >
                    <option value="all">{isBengali ? 'সকল বিষয়সমূহ' : 'All Disciplines'}</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Engineering and Technology">Engineering</option>
                    <option value="Business Administration">Business</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 px-2.5 bg-slate-50/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer text-slate-700 dark:text-slate-200 font-medium h-9">
                    <input
                      type="checkbox"
                      checked={scholarshipOnly}
                      onChange={(e) => setScholarshipOnly(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500 h-3.5 w-3.5"
                    />
                    <span className="truncate text-xs">{isBengali ? 'শুধু স্কলারশিপ প্রোগ্রাম' : 'Scholarships Only'}</span>
                  </label>
                </div>
              </div>
            </form>

            {/* 6. Example Searches */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-normal">{isBengali ? 'জনপ্রিয় অনুসন্ধান:' : 'Frequent Searches:'}</span>
              {exampleSearches.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyExample(ex)}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors font-medium border border-slate-200/80 dark:border-slate-700 text-xs shadow-2xs"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Subtle, Quiet Trust Section (Thin Dividers, Text-Based Stats) */}
          <div className="hero-anim-stats mt-10 pt-6 border-t border-slate-200/70 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy dark:text-white tabular-nums">{formatNumber(948)}+</div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{isBengali ? 'যাচাইকৃত বিশ্ববিদ্যালয়' : 'Verified Universities'}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">IAU WHED accredited registries</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy dark:text-white tabular-nums">{formatNumber(42)}</div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{isBengali ? 'অধ্যয়ন গন্তব্য দেশ' : 'Study Destinations'}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Visa rules &amp; living cost benchmarks</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy dark:text-white tabular-nums">{formatNumber(20)}+</div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{isBengali ? 'সরকারি স্কলারশিপ' : 'Government Scholarships'}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">DAAD, MEXT, Chevening, SISGP, GKS</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy dark:text-white tabular-nums">{formatNumber(103)}</div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{isBengali ? 'সম্পাদকীয় ও গবেষণা নির্দেশিকা' : 'Peer-Reviewed Guides'}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Independent credential roadmaps</p>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL COUNTRY DIRECTORY (Natural, seamless transition after Hero) */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>{isBengali ? 'গন্তব্য ডিরেক্টরি' : 'Destination Intelligence'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy dark:text-white tracking-tight mt-1">
              {isBengali ? 'বিশ্বের শীর্ষ অধ্যয়ন গন্তব্যসমূহ' : 'Global Country Directory'}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              {isBengali
                ? '৪২টি দেশের জাতীয় ভিসা নীতিমালা, জীবনযাত্রার প্রকৃত ব্যয় এবং পড়াশোনা-পরবর্তী কাজের অধিকার সংক্রান্ত তথ্য।'
                : 'Explore national admission prerequisites, post-study work authorization, and statutory living allowances across 42 study destinations.'}
            </p>
          </div>
          <Link
            to="/countries"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 shrink-0"
          >
            <span>{isBengali ? 'সকল গন্তব্য দেখুন' : 'View All Destinations'} ({formatNumber(42)})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((c) => (
            <CountryCard key={c.slug} country={c as any} />
          ))}
        </div>
      </section>


      {/* 2. EXPLORE DEGREES BY SUBJECT */}
      <section className="py-16 bg-[#FAFAF9] dark:bg-[#0F172A] border-y border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>{t('navigation.programs')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy dark:text-white tracking-tight mt-1">
                {t('home.exploreByFieldTitle')}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                {t('home.exploreByFieldSubtitle')}
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300"
            >
              <span>{t('navigation.programs')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredSubjects.map((sub) => (
              <Link
                key={sub.id}
                to={`/courses?subject=${encodeURIComponent(sub.name)}`}
                className="group bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-teal-600 dark:hover:border-teal-500 hover:shadow-card transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:bg-[#0B192C] dark:group-hover:bg-teal-700 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-heading font-semibold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-snug">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {sub.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. RECOMMENDED UNIVERSITIES */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>{t('common.verified')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy dark:text-white tracking-tight mt-1">
              {t('home.recommendedUniversitiesTitle')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              {t('home.recommendedUniversitiesSubtitle')}
            </p>
          </div>
          <Link
            to="/universities"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300"
          >
            <span>{t('home.exploreUniversities')} ({formatNumber(940)}+)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedUniversities.map((uni) => (
            <UniversityCard key={uni.id} university={uni} />
          ))}
        </div>
      </section>

      {/* 4. GOVERNMENT SCHOLARSHIP OPPORTUNITIES */}
      <section className="py-16 bg-[#FAFAF9] dark:bg-[#0F172A] border-y border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{t('scholarships.fullyFunded')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy dark:text-white tracking-tight mt-1">
                {t('home.governmentScholarshipsTitle')}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                {t('home.governmentScholarshipsSubtitle')}
              </p>
            </div>
            <Link
              to="/scholarships"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300"
            >
              <span>{t('home.exploreScholarships')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {governmentScholarships.map((sch) => (
              <ScholarshipCard key={sch.id} scholarship={sch} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. AFFORDABLE STUDY DESTINATIONS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <TrendingDown className="w-4 h-4" />
            <span>{t('home.financialTransparency')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy dark:text-white tracking-tight mt-1">
            {t('home.lowTuitionDestinationsTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            {t('home.lowTuitionDestinationsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {affordableDestinations.map((c) => (
            <Link
              key={c.slug}
              to={`/countries/${c.slug}`}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-teal-600 dark:hover:border-teal-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{c.flagEmoji}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50">
                    {c.continent}
                  </span>
                </div>
                <h3 className="text-base font-heading font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{c.capitalCity}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>{t('universities.tuitionRange')}:</span>
                  <strong className="text-slate-800 dark:text-slate-100 tabular-nums">{formatNumber(c.avgTuitionMin)} {c.currencyCode}/{t('common.year')}</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>{t('visa.monthlyLivingCost')}:</span>
                  <strong className="text-slate-800 dark:text-slate-100 tabular-nums">~{formatNumber(c.avgLivingCostMonthly)} {c.currencyCode}/{t('common.month')}</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. TUITION & LIVING COST CALCULATOR TEASER */}
      <section className="py-16 bg-[#FAFAF9] dark:bg-[#0F172A] border-y border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800/50">
                <Calculator className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{t('navigation.costCalculator')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy dark:text-white tracking-tight">
                {t('home.calculatorTeaserTitle')}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {t('home.calculatorTeaserSubtitle')}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/calculator"
                  className="px-6 py-3 rounded-xl bg-brand-navy dark:bg-teal-700 hover:bg-slate-800 dark:hover:bg-teal-600 text-white text-xs font-semibold shadow-2xs transition-colors inline-flex items-center gap-2"
                >
                  <span>{t('navigation.costCalculator')}</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </Link>
              </div>
            </div>

            <div className="bg-[#FAFAF9] dark:bg-slate-800/60 rounded-xl p-6 border border-slate-200/80 dark:border-slate-700 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Sample Master's Program (2 Years in Finland)</span>
                <span className="text-teal-700 dark:text-teal-400 font-semibold tabular-nums">€ EUR / BDT</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Annual Tuition (15,000 €/yr × 2):</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100 tabular-nums">€30,000 (~3,915,000 BDT)</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Living Expenses (800 €/mo × 24):</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100 tabular-nums">€19,200 (~2,505,600 BDT)</span>
              </div>
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                <span>Scholarship Waiver (50% Tuition):</span>
                <span className="tabular-nums">- €15,000 (- 1,957,500 BDT)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-semibold text-brand-navy dark:text-white">
                <span>Estimated Net Total:</span>
                <span className="text-teal-800 dark:text-teal-300 tabular-nums font-bold">€34,200 (~4,463,100 BDT)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. IELTS, TOEFL, PTE & MOI VERIFICATION TEASER */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1 bg-[#FAFAF9] dark:bg-slate-800/60 rounded-xl p-6 border border-slate-200/80 dark:border-slate-700 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Standardized Language Evaluation</span>
              <span className="text-teal-700 dark:text-teal-400 font-semibold">{t('common.verified')} Matrix</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">IELTS Academic 6.5 (Minimum 6.0 Subscores)</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Evaluated across BSc and MSc degree catalog</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 font-semibold tabular-nums">
                  91% Eligible
                </span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{t('navigation.moiAcceptance')}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Official institutional waiver policies</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50 font-semibold">
                  Country-Specific
                </span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800/50">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{t('navigation.englishTests')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy dark:text-white tracking-tight">
              {t('home.languageProficiencyTitle')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {t('home.languageProficiencySubtitle')}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/english-checker"
                className="px-6 py-3 rounded-xl bg-brand-navy dark:bg-teal-700 hover:bg-slate-800 dark:hover:bg-teal-600 text-white text-xs font-semibold shadow-2xs transition-colors inline-flex items-center gap-2"
              >
                <span>{t('navigation.englishTests')}</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </Link>
              <Link
                to="/moi-acceptance"
                className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors inline-flex items-center gap-2"
              >
                <span>{t('navigation.moiAcceptance')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. APPLICATION TIMELINE & ROADMAP */}
      <section className="py-16 bg-[#FAFAF9] dark:bg-[#0F172A] border-y border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-teal-700 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider">
              {t('home.roadmapBadge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy dark:text-white tracking-tight">
              {t('home.roadmapTitle')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {t('home.roadmapSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: "01", title: t('home.roadmapStep1Title'), desc: t('home.roadmapStep1Desc') },
              { step: "02", title: t('home.roadmapStep2Title'), desc: t('home.roadmapStep2Desc') },
              { step: "03", title: t('home.roadmapStep3Title'), desc: t('home.roadmapStep3Desc') },
              { step: "04", title: t('home.roadmapStep4Title'), desc: t('home.roadmapStep4Desc') },
              { step: "05", title: t('home.roadmapStep5Title'), desc: t('home.roadmapStep5Desc') }
            ].map((st) => (
              <div key={st.step} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 tabular-nums">{st.step}</span>
                <h3 className="text-sm font-heading font-semibold text-slate-900 dark:text-white">{st.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300"
            >
              <span>{t('navigation.applicationPlanner')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-teal-700 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider">
            {t('home.faqBadge')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-brand-navy dark:text-white tracking-tight">
            {t('home.faqTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            {t('home.faqSubtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white text-sm sm:text-base hover:text-teal-700 dark:hover:text-teal-400"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'transform rotate-180 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  />
                </button>
                <SmoothAccordion isOpen={isOpen}>
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                </SmoothAccordion>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};


