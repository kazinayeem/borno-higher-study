import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { UNIVERSITIES_DATA } from '../data/universitiesData.js';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData.js';
import { SUBJECTS_DATA } from '../data/subjectsData.js';
import { CountryCard } from '../components/common/CountryCard.js';
import { UniversityCard } from '../components/common/UniversityCard.js';
import { ScholarshipCard } from '../components/common/ScholarshipCard.js';
import { SeoHead } from '../components/common/SeoHead.js';
import {
  Search,
  Sparkles,
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
  Cpu,
  Database,
  Code,
  Award,
  Zap,
  TrendingDown,
  ExternalLink,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [scholarshipOnly, setScholarshipOnly] = useState(false);

  // Search examples
  const exampleSearches = [
    { label: "Computer Science Master's in Germany", query: "Computer Science", country: "germany", level: "MASTER" },
    { label: "Fully funded PhD opportunities", query: "PhD", country: "all", level: "PHD" },
    { label: "Bachelor's programs in Finland", query: "Bachelor", country: "finland", level: "BACHELOR" },
    { label: "Universities within my tuition budget", query: "", country: "all", level: "all" },
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

  // Section Data
  const popularDestinations = COUNTRIES_DATA.filter((c) => c.isFeatured).slice(0, 6);
  const featuredSubjects = SUBJECTS_DATA.slice(0, 8);
  const recommendedUniversities = UNIVERSITIES_DATA.slice(0, 6);
  const governmentScholarships = SCHOLARSHIPS_DATA.slice(0, 4);
  const affordableDestinations = COUNTRIES_DATA.filter((c) => c.avgTuitionMin <= 5000).slice(0, 4);

  // 11. FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = [
    {
      q: 'How does Borno Higher Study verify university and scholarship information?',
      a: 'Every tuition fee, entry requirement, deadline, and scholarship criterion is cross-referenced directly against official university portals, institutional syllabi, and government ministries of education (such as the UNESCO-associated IAU World Higher Education Database). We display verification timestamps and direct source links for every record.',
    },
    {
      q: 'Are these scholarships open to international and Bangladeshi students?',
      a: 'Yes. We explicitly tag every opportunity with applicant eligibility. Flagship government schemes—such as DAAD (Germany), Stipendium Hungaricum (Hungary), Swedish Institute SISGP (Sweden), Chevening & Commonwealth (UK), MEXT (Japan), and GKS (Korea)—have dedicated tracks for developing nations and Bangladeshi applicants.',
    },
    {
      q: 'How accurate is the Tuition and Living Cost Calculator?',
      a: 'Our calculator strictly separates official university-published tuition rates from national living expense benchmarks. It converts all figures into local currency and Bangladeshi Taka (BDT) using live benchmark exchange rates so you can prepare accurate financial documentation for visa interviews.',
    },
    {
      q: 'Does the Borno Study Advisor fabricate colleges or rankings?',
      a: 'Never. Borno Study Advisor uses a strict grounded retrieval-augmented generation (RAG) architecture. It searches our verified university database, returns deterministic matches, provides clickable source citations, and clearly identifies estimates from verified minimum entry criteria.',
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
        sameAs: [
          'https://twitter.com/bornostudy',
          'https://linkedin.com/company/borno-higher-study',
        ],
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
    <div className="min-h-screen bg-white">
      <SeoHead
        title="Borno Higher Study — Global Education Intelligence Platform"
        description="Explore universities worldwide, compare degree programs, discover government scholarships, check English test requirements, and plan your international education journey."
        canonicalPath="/"
        structuredData={schemaOrgData}
      />

      {/* HERO SECTION */}
      <section className="relative bg-white pt-12 pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>100+ Verified Universities • 20 World Government Scholarships • Real BDT Conversion</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-brand-navy tracking-tight leading-tight">
              Find Your University. <br className="hidden sm:inline" />
              <span className="text-teal-700">Fund Your Future.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Explore universities worldwide, compare degree programs, discover scholarships, and plan your international education journey in one place.
            </p>

            {/* Global Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              className="mt-8 bg-white rounded-2xl p-3 shadow-card border border-slate-200 text-slate-800 text-left space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search university name, degree program, or city…"
                    className="w-full bg-transparent border-none text-slate-900 placeholder-slate-400 focus:outline-hidden text-sm sm:text-base font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Search Catalog</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </button>
              </div>

              {/* Quick Filters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-xs">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-teal-500"
                >
                  <option value="all">🌍 All Destinations</option>
                  {COUNTRIES_DATA.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.flagEmoji} {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-teal-500"
                >
                  <option value="all">🎓 Any Degree Level</option>
                  <option value="BACHELOR">Bachelor's Degree</option>
                  <option value="MASTER">Master's Degree</option>
                  <option value="PHD">Doctoral (PhD)</option>
                </select>

                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-teal-500"
                >
                  <option value="all">💻 Any Subject</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Engineering and Technology">Engineering</option>
                  <option value="Business Administration">Business</option>
                </select>

                <label className="flex items-center gap-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={scholarshipOnly}
                    onChange={(e) => setScholarshipOnly(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 h-3.5 w-3.5"
                  />
                  <span className="truncate">Scholarship Only</span>
                </label>
              </div>
            </form>

            {/* Example Searches */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Example searches:</span>
              {exampleSearches.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyExample(ex)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-lg transition-colors font-medium border border-slate-200/60"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 1. POPULAR STUDY DESTINATIONS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Global Country Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
              Popular Study Destinations
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Transparently curated based on verified English-medium degrees, international quotas, and post-study visa rights.
            </p>
          </div>
          <Link
            to="/countries"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((c) => (
            <CountryCard key={c.slug} country={c as any} />
          ))}
        </div>
      </section>

      {/* 2. EXPLORE DEGREES BY SUBJECT */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Searchable Subject Taxonomy</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
                Explore Degrees by Academic Field
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Hierarchical subject classification across Computing & IT, Engineering, Sciences, Business, and Health.
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredSubjects.map((sub) => (
              <Link
                key={sub.id}
                to={`/courses?subject=${encodeURIComponent(sub.name)}`}
                className="group bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-card transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
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
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>100+ Verified Milestone</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
              Recommended Universities Worldwide
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Accredited institutions with published tuition fees, international admission portals, and verified degree programs.
            </p>
          </div>
          <Link
            to="/universities"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>Explore 130+ Universities</span>
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
      <section className="py-16 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-600" />
                <span>World Scholarships</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
                Government & Multilateral Scholarships
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Official funding opportunities from national governments covering tuition, monthly stipends, and travel.
              </p>
            </div>
            <Link
              to="/scholarships"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              <span>View All 20 World Scholarships</span>
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
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
            <TrendingDown className="w-4 h-4" />
            <span>Budget Transparency</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-1">
            Affordable Study Destinations
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Countries offering low annual tuition or subsidized higher education with verified living cost benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {affordableDestinations.map((c) => (
            <Link
              key={c.slug}
              to={`/countries/${c.slug}`}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{c.flagEmoji}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                    {c.continent}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{c.capitalCity}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tuition starts:</span>
                  <strong className="text-slate-800">{c.avgTuitionMin} {c.currencyCode}/yr</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Living est.:</span>
                  <strong className="text-slate-800">~{c.avgLivingCostMonthly} {c.currencyCode}/mo</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. TUITION & LIVING COST CALCULATOR TEASER */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                <Calculator className="w-3.5 h-3.5 text-teal-600" />
                <span>Financial Planning Tool</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                Tuition & Total Study Cost Calculator
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Estimate full-degree tuition, accommodation, food, insurance, and scholarship deductions with real-time conversion to <strong>Bangladeshi Taka (BDT)</strong>.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/calculator"
                  className="px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-2"
                >
                  <span>Launch Cost Calculator</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </Link>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-700">Sample Master's Program (2 Years in Finland)</span>
                <span className="text-teal-700 font-bold">€ EUR / BDT</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Annual Tuition (15,000 €/yr × 2):</span>
                <span className="font-semibold text-slate-800">€30,000 (~3,915,000 BDT)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Living Expenses (800 €/mo × 24):</span>
                <span className="font-semibold text-slate-800">€19,200 (~2,505,600 BDT)</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Scholarship Waiver (50% Tuition):</span>
                <span>- €15,000 (- 1,957,500 BDT)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-brand-navy">
                <span>Estimated Net Total:</span>
                <span className="text-teal-800">€34,200 (~4,463,100 BDT)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. IELTS, TOEFL & PTE ELIGIBILITY CHECKER TEASER */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1 bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-700">English Test Evaluation Engine</span>
              <span className="text-teal-700 font-bold">380+ Programs</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">IELTS Academic 6.5 (Subscore 6.0)</p>
                  <p className="text-[11px] text-slate-500">Evaluated across all BSc and MSc catalog</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  91% Eligible
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Subscore Band Check</p>
                  <p className="text-[11px] text-slate-500">Writing, Reading, Listening & Speaking</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-bold">
                  Checked Instantly
                </span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Language Requirement Matcher</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
              IELTS, TOEFL & PTE Eligibility Checker
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Verify your test scores against exact university and degree requirements. Get instant feedback on overall score requirements and individual minimum band thresholds.
            </p>
            <div className="pt-2">
              <Link
                to="/english-checker"
                className="px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-2"
              >
                <span>Check My Test Scores</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. UNIVERSITY COMPARISON TEASER */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>Side-by-Side Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
            Compare Up to 4 Universities Side-by-Side
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Directly compare tuition fees, IELTS requirements, acceptance rates, world rankings, and campus facilities across different destination countries.
          </p>
          <div className="pt-2">
            <Link
              to="/compare"
              className="px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-2"
            >
              <span>Open University Comparison</span>
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. AI STUDY ADVISOR */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-navy rounded-2xl p-8 sm:p-12 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Grounded AI Study Abroad Advisor</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Need Personalized University Guidance?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed font-normal">
              Ask questions about Master's admissions in Finland, DAAD scholarship eligibility, tuition waivers in Germany, or living budgets. Our advisor searches verified database records with zero hallucinations.
            </p>
          </div>

          <Link
            to="/advisor"
            className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0 inline-flex items-center gap-2"
          >
            <span>Consult AI Study Advisor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 10. APPLICATION PLANNING GUIDE */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-teal-700 text-xs font-bold uppercase tracking-wider">
              Step-by-Step Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
              How to Plan Your Study-Abroad Application
            </h2>
            <p className="text-slate-600 text-sm">
              Follow a proven five-stage timeline from initial program discovery to visa issuance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: "01", title: "Destination & Program", desc: "Select countries with post-study visa rights matching your career goals." },
              { step: "02", title: "English Proficiency", desc: "Take IELTS, TOEFL, or PTE with required overall & band scores." },
              { step: "03", title: "Funding & Scholarships", desc: "Apply for government scholarships 6-12 months ahead of intake." },
              { step: "04", title: "University Admissions", desc: "Submit verified transcripts, motivation letters, and academic references." },
              { step: "05", title: "Student Visa & Arrival", desc: "Prepare financial proof, arrange student housing, and obtain visa." }
            ].map((st) => (
              <div key={st.step} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-extrabold text-teal-700">{st.step}</span>
                <h3 className="text-sm font-bold text-slate-900">{st.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              <span>Open Interactive Application Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-teal-700 text-xs font-bold uppercase tracking-wider">
            Clear Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to know about verified university data, scholarships, and admissions accuracy.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-teal-700"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'transform rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 12. FOOTER - Handled by persistent Layout Footer in App.tsx */}
    </div>
  );
};
