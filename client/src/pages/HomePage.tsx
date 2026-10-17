import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { UNIVERSITIES_DATA } from '../data/universitiesData.js';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData.js';
import { CountryCard } from '../components/common/CountryCard.js';
import { UniversityCard } from '../components/common/UniversityCard.js';
import { ScholarshipCard } from '../components/common/ScholarshipCard.js';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  GraduationCap,
  Globe,
  Coins,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCountry !== 'all') params.set('country', selectedCountry);
    if (selectedDegree !== 'all') params.set('level', selectedDegree);
    if (selectedSubject !== 'all') params.set('subject', selectedSubject);
    navigate(`/universities?${params.toString()}`);
  };

  const featuredCountries = COUNTRIES_DATA.slice(0, 6);
  const featuredUniversities = UNIVERSITIES_DATA.slice(0, 4);
  const openScholarships = SCHOLARSHIPS_DATA.slice(0, 3);

  // Top CS & IT programs
  const topPrograms = UNIVERSITIES_DATA.flatMap((u) =>
    u.programs
      .filter((p) => p.subjectCategory === 'Computing and Technology')
      .map((p) => ({ ...p, universityName: u.name, countryName: u.countryName }))
  ).slice(0, 4);

  // FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = [
    {
      q: 'How does Borno Higher Study verify university and scholarship information?',
      a: 'Every tuition fee, admission requirement, deadline, and scholarship criteria on our platform is cross-referenced directly against official university admissions portals, institutional syllabi, and government education ministries. We display verification dates and official source links for total transparency.',
    },
    {
      q: 'Can Bangladeshi students apply for scholarships listed here?',
      a: 'Yes! We explicitly tag every scholarship with Bangladeshi eligibility. Key opportunities like the Hungarian Stipendium Hungaricum, German DAAD EPOS, Swedish Institute SISGP, and UK Chevening welcome Bangladeshi applicants.',
    },
    {
      q: 'How accurate is the Tuition and Living Cost Calculator?',
      a: 'Our calculator strictly distinguishes verified institutional tuition rates from estimated living expenses and user assumptions. It converts figures into BDT in real time so you can plan realistic financial proof for visa applications.',
    },
    {
      q: 'Does Borno Study Advisor generate hallucinations or unverified colleges?',
      a: 'Never. The Borno Study Advisor uses a strict grounded retrieval architecture (RAG). It only answers questions using verified database records and official sources, providing clickable citations and noting when data needs individual institutional confirmation.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-brand-navy text-white pt-20 pb-28">
        {/* Subtle decorative glow and grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(13,148,136,0.3),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-900/60 border border-teal-500/30 text-teal-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Covering 30 International Study Destinations • Verified 2025/2026 Data</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Your Global Education Journey Starts Here.
            </h1>

            <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Discover universities, compare tuition fees, find scholarships, and plan your future with a smarter study-abroad platform.
            </p>

            {/* Natural-Language Search Box */}
            <form
              onSubmit={handleHeroSearch}
              className="mt-8 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-white/20 text-slate-800"
            >
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
                  <Search className="w-5 h-5 text-teal-600 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Computer Science Master's programs in Germany…"
                    className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-hidden text-sm sm:text-base font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Explore Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Filter Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200/80 text-xs">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:ring-1 focus:ring-teal-500"
                >
                  <option value="all">🌍 All 30 Countries</option>
                  {COUNTRIES_DATA.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.flagEmoji} {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:ring-1 focus:ring-teal-500"
                >
                  <option value="all">🎓 Any Degree Level</option>
                  <option value="BACHELOR">Bachelor's Degree</option>
                  <option value="MASTER">Master's Degree (MSc)</option>
                  <option value="PHD">Doctoral (PhD)</option>
                </select>

                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:ring-1 focus:ring-teal-500"
                >
                  <option value="all">💻 Any Subject Category</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>
            </form>

            {/* Quick Metrics Bar */}
            <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-white/5 rounded-xl backdrop-blur-xs border border-white/10">
                <p className="text-2xl font-extrabold text-teal-400">30</p>
                <p className="text-xs text-slate-300 font-medium">Study Destinations</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl backdrop-blur-xs border border-white/10">
                <p className="text-2xl font-extrabold text-teal-400">100%</p>
                <p className="text-xs text-slate-300 font-medium">Verified Official Records</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl backdrop-blur-xs border border-white/10">
                <p className="text-2xl font-extrabold text-teal-400">BDT</p>
                <p className="text-xs text-slate-300 font-medium">Real-time Currency Conversion</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl backdrop-blur-xs border border-white/10">
                <p className="text-2xl font-extrabold text-amber-400">Grounded AI</p>
                <p className="text-xs text-slate-300 font-medium">Zero Hallucination Advisor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR STUDY DESTINATIONS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
              Explore Destinations
            </span>
            <h2 className="text-3xl font-extrabold text-brand-navy mt-1">
              Popular Study Destinations
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Detailed visa requirements, monthly living budgets, and popular universities across 30 nations.
            </p>
          </div>
          <Link
            to="/countries"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800"
          >
            <span>View All 30 Countries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCountries.map((c) => (
            <CountryCard key={c.slug} country={c as any} />
          ))}
        </div>
      </section>

      {/* 3. FEATURED UNIVERSITIES */}
      <section className="py-20 bg-slate-100/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                Academic Excellence
              </span>
              <h2 className="text-3xl font-extrabold text-brand-navy mt-1">
                Featured Verified Universities
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Public and prestigious institutions with international admissions URLs and accurate tuition fees.
              </p>
            </div>
            <Link
              to="/universities"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800"
            >
              <span>Explore All Universities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredUniversities.map((u) => (
              <UniversityCard key={u.id} university={u as any} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. TOP COMPUTER SCIENCE & IT PROGRAMS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
              Tech & Computing Directory
            </span>
            <h2 className="text-3xl font-extrabold text-brand-navy mt-1">
              Top Computer Science & IT Programs
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Master's degrees in AI, Software Engineering, and Cybersecurity with verified entry criteria.
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800"
          >
            <span>Browse Full Course Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card hover:border-teal-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
                    {prog.subject}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {prog.durationMonths} Months ({prog.creditsEcts} ECTS)
                  </span>
                </div>
                <h4 className="text-lg font-bold text-brand-navy">{prog.name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {prog.universityName} • {prog.countryName}
                </p>
                <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                  {prog.prerequisites}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Annual Tuition</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {prog.currencyCode} {prog.annualTuitionLocal.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Min IELTS Score</span>
                  <span className="font-bold text-teal-700 text-sm">
                    {prog.ieltsOverall} (subscore {prog.ieltsSubscoreMin})
                  </span>
                </div>
                <Link
                  to={`/courses/${prog.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-navy text-white font-semibold hover:bg-brand-navy-light transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. VERIFIED SCHOLARSHIPS WITH UPCOMING DEADLINES */}
      <section className="py-20 bg-slate-100/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Funding Opportunities
              </span>
              <h2 className="text-3xl font-extrabold text-brand-navy mt-1">
                Scholarships Open to International Students
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Government awards, tuition waivers, and fully funded fellowships eligible for Bangladeshi applicants.
              </p>
            </div>
            <Link
              to="/scholarships"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800"
            >
              <span>Explore All Scholarships</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {openScholarships.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s as any} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. TUITION COMPARISON & LIVING COST CALCULATOR PREVIEW */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-navy via-brand-navy-light to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-widest flex items-center gap-1.5">
                <Coins className="w-4 h-4" />
                <span>Financial Transparency</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Calculate Real Study Costs in Bangladeshi Taka (BDT)
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Study abroad financial planning shouldn’t be a guessing game. Select your destination country, university program, and duration to see verified tuition, estimated living expenses, and scholarship reductions converted into BDT.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/calculator"
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
                >
                  <span>Launch Cost Calculator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/compare"
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all inline-flex items-center gap-2"
                >
                  <span>Compare 4 Universities</span>
                </Link>
              </div>
            </div>

            {/* Visual Calculator Card Mock */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <span className="font-semibold text-slate-300">Cost Calculation Preview</span>
                <span className="bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full font-bold">Live Rate: 1 EUR = ~130.5 BDT</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Finland Master's Tuition (Annual):</span>
                  <span className="font-bold text-white">€15,000 (~1,957,500 BDT)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Living Expenses (24 Months @ €800):</span>
                  <span className="font-bold text-white">€19,200 (~2,505,600 BDT)</span>
                </div>
                <div className="flex justify-between text-teal-300 font-semibold">
                  <span>Finland Scholarship First-Year Waiver:</span>
                  <span>- €15,000 (- 1,957,500 BDT)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-300 block">Net Estimated Investment</span>
                  <span className="text-xl font-extrabold text-amber-400">€19,200</span>
                </div>
                <span className="text-sm font-bold text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                  ~2,505,600 BDT
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ENGLISH TEST CHECKER TEASER */}
      <section className="py-20 bg-slate-100/60 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                Score Eligibility Checker
              </span>
              <h2 className="text-3xl font-extrabold text-brand-navy">
                Check Where Your IELTS, TOEFL, or PTE Score Meets Requirements
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Language test criteria differ drastically by faculty, degree, and nation. Don’t risk application rejections over a 0.5 subscore discrepancy. Enter your overall score and individual reading, writing, listening, and speaking bands to instantly verify eligibility.
              </p>
              <div className="pt-2">
                <Link
                  to="/english-checker"
                  className="px-6 py-3.5 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
                >
                  <span>Test My Score Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-800 text-sm">Sample Evaluation: IELTS 6.5 Overall</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  <span>Aalto University — MSc Computer Science (Req: 6.5)</span>
                  <span className="font-bold">✔ Meets Criteria</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  <span>TUM Munich — MSc Informatics (Req: 6.5)</span>
                  <span className="font-bold">✔ Meets Criteria</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200/60">
                  <span>TU Delft — MSc Computer Science (Req: 7.0)</span>
                  <span className="font-bold">✘ Unmet (Needs 7.0)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. AI STUDY ADVISOR INTRODUCTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Interactive AI Guidance</span>
          </span>
          <h2 className="text-3xl font-extrabold text-brand-navy">
            Meet the Borno Study Advisor
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            An intelligent advisor built specifically for international students. Grounded exclusively in verified university datasets, tuition schedules, and official visa policies.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-8 sm:p-10 max-w-4xl mx-auto">
          <div className="space-y-4 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                You
              </div>
              <div className="bg-slate-100 p-3.5 rounded-2xl rounded-tl-none text-slate-800 font-medium">
                Find Master's programs in Computer Science in Finland under €16,000 tuition with scholarship options for Bangladeshi students.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-xs shrink-0">
                AI
              </div>
              <div className="bg-teal-50/70 border border-teal-200/60 p-4 rounded-2xl rounded-tl-none space-y-2">
                <p className="font-semibold text-teal-900">
                  Based on verified records for Finland:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                  <li><strong>Aalto University:</strong> MSc in Computer Science (Tuition: €15,000/year). Eligible for Finland Scholarship covering 100% first-year tuition + €5,000 grant.</li>
                  <li><strong>University of Oulu / Tampere University:</strong> CS degrees ranging €10,000 – €12,000 with 50-100% merit waivers.</li>
                  <li><strong>Living Expenses:</strong> Officially verified at ~€800/month (~104,400 BDT) for Finnish student residence permits.</li>
                </ul>
                <div className="pt-2 flex items-center gap-2 text-[11px] text-teal-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>3 Official University Citations Provided</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/advisor"
              className="px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Ask Borno Study Advisor Anything</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. STEP-BY-STEP STUDY-ABROAD GUIDE */}
      <section className="py-20 bg-slate-100/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
              Structured Roadmap
            </span>
            <h2 className="text-3xl font-extrabold text-brand-navy mt-1">
              Step-by-Step Study Abroad Guide
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Follow our proven milestone framework from destination discovery to visa approval.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm mb-4">
                1
              </span>
              <h4 className="text-base font-bold text-brand-navy">Discover & Filter</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Compare tuition fees, cost of living in BDT, and post-study work visa rights across 30 nations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm mb-4">
                2
              </span>
              <h4 className="text-base font-bold text-brand-navy">Verify Eligibility</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Check IELTS/TOEFL requirements, subject credit prerequisites, and document requirements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm mb-4">
                3
              </span>
              <h4 className="text-base font-bold text-brand-navy">Apply for Scholarships</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Submit applications for government and university funding before verified deadlines.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm mb-4">
                4
              </span>
              <h4 className="text-base font-bold text-brand-navy">Visa & Departure</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Organize financial bank statements, health insurance, and official student residence permits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
            Common Questions
          </span>
          <h2 className="text-3xl font-extrabold text-brand-navy mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left font-bold text-brand-navy flex items-center justify-between text-sm sm:text-base hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-teal-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
