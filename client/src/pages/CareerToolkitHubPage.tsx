import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  Search,
  Sparkles,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  GraduationCap,
  Briefcase,
  HelpCircle,
  FileCheck,
  Compass,
  Zap,
  Sliders,
  Filter
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PageIntro, StaggerGroup } from '../components/motion/index';
import {
  getCareerGuides,
  getCareerResearchRecords,
  getCVExamples,
  getBeforeAfterExamples
} from '../services/api';
import {
  CareerGuideItem,
  CVResearchRecordItem,
  CVExampleItem,
  BeforeAfterExampleItem
} from '../types/index';

export const CareerToolkitHubPage: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [guides, setGuides] = useState<CareerGuideItem[]>([]);
  const [researchRecords, setResearchRecords] = useState<CVResearchRecordItem[]>([]);
  const [examples, setExamples] = useState<CVExampleItem[]>([]);
  const [beforeAfters, setBeforeAfters] = useState<BeforeAfterExampleItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Research filters
  const [researchTypeFilter, setResearchTypeFilter] = useState('ALL');
  const [researchSearch, setResearchSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [guidesRes, researchRes, examplesRes, baRes] = await Promise.all([
          getCareerGuides(),
          getCareerResearchRecords({ cvType: researchTypeFilter !== 'ALL' ? researchTypeFilter : undefined, search: researchSearch || undefined }),
          getCVExamples(),
          getBeforeAfterExamples()
        ]);
        setGuides(guidesRes.guides || []);
        setResearchRecords(researchRes.records || []);
        setExamples(examplesRes.examples || []);
        setBeforeAfters(baRes.examples || []);
      } catch (err) {
        console.error('Failed to load Career Toolkit data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [researchTypeFilter, researchSearch]);

  const guideCards = [
    {
      slug: 'cv-writing-guide',
      title: isBn ? 'আন্তর্জাতিক সিভি তৈরির পূর্ণাঙ্গ গাইড' : 'Comprehensive International CV Guide',
      desc: isBn ? 'বিশ্ববিদ্যালয় ভর্তি ও স্কলারশিপের জন্য একাডেমিক সিভি আর্কিটেকচার।' : 'Foundational architecture, section hierarchy, and typography for global applications.',
      icon: FileText,
      tag: isBn ? 'মাস্টার গাইড' : 'Master Guide',
      color: 'teal'
    },
    {
      slug: 'europass-cv',
      title: isBn ? 'ইউরোপাস সিভি ও ইরাসমাস নির্দেশিকা' : 'Official Europass CV & Erasmus Guide',
      desc: isBn ? 'ইউরোপীয় ইউনিয়ন ও ইরাসমাস মুন্ডুস স্কলারশিপের স্ট্যান্ডার্ড ফ্রেমওয়ার্ক।' : 'EU standards, CEFR linguistic self-assessment, and when alternative formats excel.',
      icon: Compass,
      tag: 'European Union',
      color: 'blue'
    },
    {
      slug: 'academic-cv',
      title: isBn ? 'অ্যাকাডেমিক সিভি ও পাবলিকেশন গাইড' : 'Academic CV & Publications Guide',
      desc: isBn ? 'থিসিস, গবেষণার অভিজ্ঞতা, পেপার সাইটেশন ও পিএইচডি অ্যাপ্লিকেশনের নিয়মাবলী।' : 'Scholarly dossier structuring, peer-reviewed citations, and doctoral applications.',
      icon: GraduationCap,
      tag: 'MSc / PhD',
      color: 'emerald'
    },
    {
      slug: 'research-cv',
      title: isBn ? 'সায়েন্টিফিক ও রিসার্চ ল্যাব সিভি' : 'Scientific & Research Laboratory CV',
      desc: isBn ? 'ল্যাবরেটরি ইনস্ট্রুমেন্টেশন, কম্পিউটেশনাল টুলস ও মেথডোলজি উপস্থাপন।' : 'Lab instrumentation, wet-lab protocols, bioinformatics pipelines, and reproducibility.',
      icon: Layers,
      tag: 'STEM / Labs',
      color: 'cyan'
    },
    {
      slug: 'scholarship-cv',
      title: isBn ? 'মর্যাদাপূর্ণ স্কলারশিপ সিভি গাইড' : 'Prestigious Scholarship CV Guide',
      desc: isBn ? 'ইরাসমাস, কমনওয়েলথ, ডাড ও ফুলব্রাইট স্কলারশিপে গ্রহণযোগ্যতা অর্জনের কৌশল।' : 'Balancing academic distinction with civic leadership and sustainable development.',
      icon: Award,
      tag: 'Full Funding',
      color: 'amber'
    },
    {
      slug: 'student-resume',
      title: isBn ? 'স্টুডেন্ট ও এন্ট্রি-লেভেল রেজ্যিউমে' : 'Student & Entry-Level Resume Guide',
      desc: isBn ? 'সীমিত চাকরীর অভিজ্ঞতায় সেমিস্টার প্রজেক্ট দিয়ে ১ পৃষ্ঠার রেজ্যিউমে তৈরির পদ্ধতি।' : 'Translating academic coursework, capstone projects, and campus clubs into impact.',
      icon: Briefcase,
      tag: 'Undergraduate',
      color: 'indigo'
    },
    {
      slug: 'cover-letter',
      title: isBn ? 'অ্যাকাডেমিক কভার লেটার গাইড' : 'Academic Cover Letter Masterclass',
      desc: isBn ? '৪ প্যারাগ্রাফের আন্তর্জাতিক কভার লেটার ও রিসার্চ প্রপোজাল সংযোগ।' : 'Compelling 1-page cover letters connecting past credentials to faculty labs.',
      icon: BookOpen,
      tag: 'Applications',
      color: 'purple'
    },
    {
      slug: 'personal-statement',
      title: isBn ? 'স্টেটমেন্ট অব পারপাস (SOP) গাইড' : 'Statement of Purpose (SOP) Masterclass',
      desc: isBn ? 'ব্যক্তিগত অনুপ্রেরণা ও গবেষণার লক্ষ্য প্রমাণের প্রফেশনাল রচনা পদ্ধতি।' : 'Crafting an authentic, intellectually grounded narrative for admissions boards.',
      icon: Sparkles,
      tag: 'Essays / SOP',
      color: 'rose'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#080E1A] text-slate-900 dark:text-slate-100 pb-24 transition-colors">
      {/* Editorial Hero Header */}
      <div className="bg-[#0B192C] dark:bg-[#070D18] text-white pt-16 pb-20 border-b border-slate-800">
        <PageIntro className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-teal-400 text-xs font-semibold tracking-wide uppercase mb-4">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            {isBn ? 'আন্তর্জাতিক ক্যারিয়ার ও সিভি সেন্টার' : 'International Academic & Career Toolkit'}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold tracking-tight text-white mb-4 leading-tight">
            {isBn
              ? 'উচ্চশিক্ষা ও স্কলারশিপের জন্য বিশ্বমানের সিভি ও ক্যারিয়ার টুলকিট'
              : 'Empirical CV Writing, Europass Standards & Career Toolkit'}
          </h1>

          <p className="max-w-3xl text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            {isBn
              ? 'বিশ্বমানের বিশ্ববিদ্যালয় অ্যাডমিশন, ইরাসমাস ও ডাড স্কলারশিপ এবং আন্তর্জাতিক রিসার্চ পজিশনে আবেদনের জন্য তথ্যবহুল, সত্যনিষ্ঠ ও প্রভাবশালী সিভি তৈরি করুন। ৫০টি যাচাইকৃত বিশ্ববিদ্যালয় গাইড এবং ১২টি অরিজিনাল মডেল উদাহরণ দ্বারা সমৃদ্ধ।'
              : 'Empowering Bangladeshi and international scholars to build truthful, high-impact application documents for global university admission, Erasmus Mundus & DAAD fellowships, and scientific research laboratories.'}
          </p>

          {/* Quick Action Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/career-toolkit/cv-review"
              className="group p-5 rounded-2xl bg-gradient-to-br from-teal-500/10 to-teal-500/5 hover:from-teal-500/20 hover:to-teal-500/10 border border-teal-500/30 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 group-hover:scale-105 transition-transform">
                  <Zap className="w-5 h-5" />
                </span>
                <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-semibold text-white text-base mb-1">
                {isBn ? 'সিভি কোয়ালিটি চেকার' : 'Rule-Based CV Reviewer'}
              </h3>
              <p className="text-xs text-slate-300">
                {isBn ? 'প্যাসিভ ভার্ব, মিসিং তথ্য ও ফরম্যাট চেকিং' : 'Instant rule-based scoring, missing sections & feedback'}
              </p>
            </Link>

            <Link
              to="/career-toolkit/cv-builder"
              className="group p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 to-sky-500/5 hover:from-sky-500/20 hover:to-sky-500/10 border border-sky-500/30 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </span>
                <ArrowRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-semibold text-white text-base mb-1">
                {isBn ? 'ইন্টারেক্টিভ সিভি বিল্ডার' : 'Interactive CV Builder'}
              </h3>
              <p className="text-xs text-slate-300">
                {isBn ? '৪টি প্রিমিয়াম টেমপ্লেট ও লাইভ পিডিএফ প্রিভিউ' : '4 professional templates with private draft saving'}
              </p>
            </Link>

            <Link
              to="/career-toolkit/cv-checklist"
              className="group p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 hover:from-amber-500/20 hover:to-amber-500/10 border border-amber-500/30 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
                  <FileCheck className="w-5 h-5" />
                </span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-semibold text-white text-base mb-1">
                {isBn ? 'প্রি-সাবমিশন চেকলিস্ট' : 'Pre-Submission Checklist'}
              </h3>
              <p className="text-xs text-slate-300">
                {isBn ? 'আবেদনের পূর্বে ১০টি অপরিহার্য মানদণ্ড' : '10-point verified checklist with saved progress'}
              </p>
            </Link>

            <Link
              to="/career-toolkit/cv-examples"
              className="group p-5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-amber-500/15 text-amber-300 group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </span>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-semibold text-white text-base mb-1">
                {isBn ? '১২টি অরিজিনাল সিভি উদাহরণ' : '12 Original Sample CVs'}
              </h3>
              <p className="text-xs text-slate-300">
                {isBn ? 'সিএসই, ইঞ্জিনিয়ারিং ও লাইফ সায়েন্স স্যাম্পল' : 'Illustrative models with section rationale explanations'}
              </p>
            </Link>
          </div>
        </PageIntro>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 space-y-16">
        
        {/* Section 1: 8 Primary Guides Grid */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isBn ? 'বিশেষায়িত সিভি ও অ্যাপ্লিকেশন গাইডসমূহ' : 'Specialized Application & CV Guides'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {isBn ? 'বিভিন্ন উচ্চশিক্ষা ক্ষেত্র ও আন্তর্জাতিক মানদণ্ডের আলোকে রচিত বিশদ গাইডলাইন।' : 'Comprehensive editorial guides covering Europass, academic research, scholarships, and SOPs.'}
              </p>
            </div>
          </div>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guideCards.map((g) => {
              const Icon = g.icon;
              return (
                <Link
                  key={g.slug}
                  to={`/career-toolkit/${g.slug}`}
                  className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-500/50 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 transition-colors">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {g.tag}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-2">
                      {g.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {g.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                    <span>{isBn ? 'গাইড পড়ুন' : 'Read Full Guide'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </StaggerGroup>
        </section>

        {/* Section 2: Before & After Educational Showcase */}
        <section className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {isBn ? 'শিক্ষণীয় বিফোর ও আফটার উদাহরণ' : 'Before-and-After Learning Showcase'}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {isBn ? 'দুর্বল বক্তব্যকে কীভাবে শক্তিশালী অর্জনে রূপান্তর করবেন' : 'Transforming Passive Statements into Verified Impact'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isBn
                ? 'সিভিতে খালি প্রশংসা বা অস্পষ্ট দায়িত্ব না লিখে সুনির্দিষ্ট অ্যাকশন ভার্ব ও পরিমাপযোগ্য তথ্যের সাহায্যে বক্তব্য তুলে ধরুন।'
                : 'Study how real applicant statements are elevated by specifying technical scope, precise tools, and substantiated outcomes.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {beforeAfters.slice(0, 4).map((ba) => (
              <div
                key={ba.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isBn ? ba.categoryBn : ba.category}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isBn ? ba.contextBn : ba.context}
                  </span>
                </div>

                {/* Weak Version */}
                <div className="p-3.5 rounded-lg bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs">
                  <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold mb-1">
                    <span>✗ {isBn ? 'দুর্বল ও অস্পষ্ট ড্রাফট' : 'Weak & Passive Phrasing'}</span>
                  </div>
                  <p className="italic text-slate-700 dark:text-slate-300">"{ba.weakText}"</p>
                  <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
                    <strong>Critique:</strong> {ba.weakCritique}
                  </p>
                </div>

                {/* Improved Version */}
                <div className="p-3.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold mb-1">
                    <span>✓ {isBn ? 'উন্নত ও তথ্যবহুল রূপ' : 'Improved Illustrative Version'}</span>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">"{ba.improvedText}"</p>
                  <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                    <strong>Why it works:</strong> {ba.improvedExplanation}
                  </p>
                </div>

                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 pt-1">
                  💡 {ba.ruleOfThumb}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: The 52 Public CV-Example Research Repository */}
        <section className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4" />
                {isBn ? 'গবেষণা তথ্যশালা' : 'Public Research Archive'}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isBn
                  ? '৫২টি যাচাইকৃত পাবলিক সিভি ও রিজিউমি গবেষণা রেকর্ড'
                  : 'Archive of 52 Verified Public CV & Resume Records'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {isBn
                  ? 'হার্ভার্ড, এমআইটি, স্ট্যানফোর্ড, অক্সফোর্ড, ইউরোপাস, ওয়েসলিয়ান ও ইউসি রিভারসাইড ক্যারিয়ার সেন্টারের অফিশিয়াল রিসোর্স বিশ্লেষণ।'
                  : 'Documented analysis from official university career centres, graduate schools, Europass, and international fellowship boards.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={isBn ? 'ইনস্টিটিউট বা ফিল্ড খুঁজুন...' : 'Search institution or field...'}
                  value={researchSearch}
                  onChange={(e) => setResearchSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 w-52 sm:w-64"
                />
              </div>

              <select
                value={researchTypeFilter}
                onChange={(e) => setResearchTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ALL">{isBn ? 'সকল সিভি টাইপ' : 'All CV Types'}</option>
                <option value="ACADEMIC_CV">Academic CV</option>
                <option value="EUROPASS_CV">Europass CV</option>
                <option value="STUDENT_RESUME">Student Resume</option>
                <option value="RESEARCH_CV">Research CV</option>
                <option value="SCHOLARSHIP_CV">Scholarship CV</option>
                <option value="GRADUATE_CV">Graduate Application</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center justify-between">
            <span>
              {isBn ? `মোট প্রদর্শিত রেকর্ড: ${researchRecords.length}` : `Showing ${researchRecords.length} verified institutional records`}
            </span>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
              ✓ All citations verified from official university career websites
            </span>
          </div>

          {/* Research Records Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[640px] overflow-y-auto pr-2">
            {researchRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300">
                      {rec.cvType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {rec.dateAccessed}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1 line-clamp-2">
                    {rec.title}
                  </h4>

                  <p className="text-xs font-medium text-teal-600 dark:text-teal-400 mb-2">
                    {rec.sourceInstitution}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    <strong>Audience:</strong> {rec.intendedAudience}
                  </p>

                  <div className="text-xs bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 mb-3 space-y-1">
                    <div className="text-[11px] text-slate-700 dark:text-slate-300">
                      <strong>Best Practice:</strong> {rec.usefulPractices}
                    </div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400">
                      <strong>Limitation:</strong> {rec.potentialLimitations}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {rec.field}
                  </span>
                  <a
                    href={rec.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    <span>{isBn ? 'অফিশিয়াল সোর্স' : 'Source'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
