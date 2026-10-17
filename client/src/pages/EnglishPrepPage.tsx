import React, { useState, useMemo } from 'react';
import { SeoHead } from '../components/common/SeoHead.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { CoachingCenterCard } from '../components/prep/CoachingCenterCard.js';
import { PracticeResourceCard } from '../components/prep/PracticeResourceCard.js';
import {
  ENGLISH_COACHING_CENTERS,
  OFFICIAL_PRACTICE_RESOURCES,
  EXAM_SCORE_MAPPINGS,
  TEST_BOOKING_GUIDE,
} from '../data/englishPrepData.js';
import {
  Search,
  BookOpen,
  GraduationCap,
  Sparkles,
  MapPin,
  Laptop,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const EnglishPrepPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coaching' | 'resources' | 'scoring' | 'guide'>('coaching');

  // Coaching center filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');

  // Practice resources filter
  const [resourceExam, setResourceExam] = useState<string>('all');

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Districts list
  const districts = ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Cumilla'];

  // Filtered coaching centers
  const filteredCenters = useMemo(() => {
    return ENGLISH_COACHING_CENTERS.filter((center) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = center.name.toLowerCase().includes(q);
        const matchesArea = center.area.toLowerCase().includes(q);
        const matchesCity = center.city.toLowerCase().includes(q);
        const matchesAddress = center.address.toLowerCase().includes(q);
        if (!matchesName && !matchesArea && !matchesCity && !matchesAddress) return false;
      }

      // Exam type
      if (selectedExam !== 'all') {
        if (!center.testsOffered.includes(selectedExam as any)) return false;
      }

      // District
      if (selectedDistrict !== 'all') {
        if (
          center.district.toLowerCase() !== selectedDistrict.toLowerCase() &&
          center.city.toLowerCase() !== selectedDistrict.toLowerCase()
        ) {
          return false;
        }
      }

      // Mode
      if (selectedMode !== 'all') {
        if (!center.modes.includes(selectedMode as any)) return false;
      }

      return true;
    });
  }, [searchQuery, selectedExam, selectedDistrict, selectedMode]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    if (resourceExam === 'all') return OFFICIAL_PRACTICE_RESOURCES;
    return OFFICIAL_PRACTICE_RESOURCES.filter(
      (r) => r.examType === resourceExam || r.examType === 'ALL'
    );
  }, [resourceExam]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedExam('all');
    setSelectedDistrict('all');
    setSelectedMode('all');
  };

  const hasActiveFilters =
    searchQuery !== '' || selectedExam !== 'all' || selectedDistrict !== 'all' || selectedMode !== 'all';

  const faqs = [
    {
      q: 'Which test should I take: IELTS, TOEFL, or PTE Academic?',
      a: 'All three tests are widely accepted across the UK, USA, Canada, Australia, and European universities. IELTS is the most popular in Bangladesh and universally accepted across the UK and Commonwealth. TOEFL iBT is preferred by North American research institutions. PTE Academic is 100% computerized with faster score delivery (often within 48 hours). Always confirm the specific university course requirement on Borno Higher Study.',
    },
    {
      q: 'How much does it cost to register for IELTS / TOEFL in Bangladesh?',
      a: 'Official exam registration fees are set in foreign currency and fluctuate with the BDT exchange rate. As of early 2025, British Council and IDP IELTS registration ranges from BDT 22,500 to BDT 24,500. TOEFL iBT is approximately $205 USD (payable via international card). PTE Academic is approximately BDT 23,000.',
    },
    {
      q: 'Can I prepare for IELTS using only free official resources?',
      a: 'Yes! Authentic official portals—such as British Council IELTS Ready, IDP Masterclass, and IELTS.org sample test papers—provide genuine past examination questions and official band descriptors. Coaching centers are recommended if you need disciplined routine, structured essay marking, or one-on-one speaking interview drills.',
    },
    {
      q: 'How does Borno Higher Study verify coaching center information?',
      a: 'Every coaching center in our directory is verified against published course schedules, registered branch addresses, physical facilities, and official test center affiliations. We display verification dates and strictly avoid fabricated fees or unconfirmed partnership claims.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SeoHead
        title="IELTS, TOEFL & PTE Preparation Hub in Bangladesh | Borno Higher Study"
        description="Discover verified English test coaching centers in Dhaka, Chattogram, Sylhet and access 100% official free practice tests from British Council, IDP, ETS, and Pearson."
        canonicalPath="/test-prep"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'English Test Preparation' },
          ]}
        />

        {/* Page Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Verified Bangladesh Directory • Official Practice Tests • Zero Sponsored Bias</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            IELTS, TOEFL & PTE <br className="hidden sm:inline" />
            <span className="text-teal-700">Preparation Hub</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Find verified English test preparation centers across Dhaka, Chattogram, Sylhet, Rajshahi,
            Khulna, and Cumilla, or access authentic, 100% free practice materials directly from the
            British Council, IDP, ETS, and Pearson.
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('coaching')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === 'coaching'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Coaching Centers ({ENGLISH_COACHING_CENTERS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === 'resources'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Official Free Practice ({OFFICIAL_PRACTICE_RESOURCES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('scoring')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === 'scoring'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Score Equivalence & CEFR</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Booking Guide & FAQs</span>
            </button>
          </div>
        </div>

        {/* TAB 1: COACHING CENTERS DIRECTORY */}
        {activeTab === 'coaching' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by center name, area (e.g. Dhanmondi, Banani, GEC, Zindabazar)..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* District Filter */}
                <div className="w-full sm:w-48 shrink-0">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Districts / Cities</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mode Filter */}
                <div className="w-full sm:w-44 shrink-0">
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Learning Modes</option>
                    <option value="OFFLINE">Offline (In-Person)</option>
                    <option value="ONLINE">Online Classes</option>
                    <option value="HYBRID">Hybrid (Both)</option>
                  </select>
                </div>
              </div>

              {/* Exam Type Pills */}
              <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400">Exam Focus:</span>
                {[
                  { label: 'All Exams', value: 'all' },
                  { label: 'IELTS', value: 'IELTS' },
                  { label: 'TOEFL', value: 'TOEFL' },
                  { label: 'PTE Academic', value: 'PTE' },
                  { label: 'Spoken English', value: 'SPOKEN_ENGLISH' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setSelectedExam(item.value)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedExam === item.value
                        ? 'bg-teal-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold ml-auto"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>

            {/* Results Count & Disclaimer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
              <p>
                Showing <strong className="text-slate-800">{filteredCenters.length}</strong> verified preparation institutions in Bangladesh
              </p>
              <p className="italic text-slate-400">
                * Course fees and schedules are verified directly from authorized institute prospectuses.
              </p>
            </div>

            {/* Centers Grid */}
            {filteredCenters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCenters.map((center) => (
                  <CoachingCenterCard key={center.id} center={center} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Coaching Centers Found"
                description="We couldn't find any centers matching your selected exam, district, or mode filters. Try broadening your criteria or reset all filters."
                actionText="Reset Filters"
                onReset={resetFilters}
              />
            )}
          </div>
        )}

        {/* TAB 2: OFFICIAL FREE PRACTICE RESOURCES */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Filter by Test:</span>
                {['all', 'IELTS', 'TOEFL', 'PTE'].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setResourceExam(ex)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      resourceExam === ex
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {ex === 'all' ? 'All Providers' : ex}
                  </button>
                ))}
              </div>

              <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Official Authors & Testing Organizations</span>
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((res) => (
                <PracticeResourceCard key={res.id} resource={res} />
              ))}
            </div>

            {/* Safe Usage Notice */}
            <div className="bg-slate-100 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <p>
                <strong>Important Notice:</strong> Borno Higher Study links directly to official test creators
                (British Council, IDP, ETS, Pearson, and Cambridge). We never scrape, duplicate, or charge for
                materials that are published for free by examination authorities. All external portals open in a safe
                new tab.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: SCORE EQUIVALENCE & CEFR */}
        {activeTab === 'scoring' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
              <div className="max-w-2xl space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Official Score Equivalence & CEFR Benchmark
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  How IELTS bands map to TOEFL iBT scores, Pearson PTE Academic points, and Common European
                  Framework of Reference (CEFR) language tiers for international university admissions.
                </p>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">CEFR Level</th>
                      <th className="py-3 px-4">IELTS Band</th>
                      <th className="py-3 px-4">TOEFL iBT</th>
                      <th className="py-3 px-4">PTE Academic</th>
                      <th className="py-3 px-4">Typical Admission Hurdle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {EXAM_SCORE_MAPPINGS.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${row.badgeColor}`}
                          >
                            {row.cefrLevel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{row.ieltsBand}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{row.toeflScore}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{row.pteScore}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-600 leading-snug">
                          {row.typicalRequirement}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Subscore Advisory */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-700" />
                  Crucial Tip for Bangladeshi Applicants:
                </p>
                <p className="leading-relaxed">
                  Most international universities enforce <strong>subscore minimums</strong> in addition to the overall
                  band (e.g. <em>IELTS 6.5 with no band less than 6.0</em>). You can verify exact program requirements
                  using our{' '}
                  <a href="/english-checker" className="underline font-bold text-amber-950">
                    IELTS & TOEFL Eligibility Checker
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKING GUIDE & FAQS */}
        {activeTab === 'guide' && (
          <div className="space-y-8">
            {/* 4-Step Booking Guide */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Official Exam Registration Guide in Bangladesh
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TEST_BOOKING_GUIDE.map((step) => (
                  <div key={step.stepNumber} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2">
                    <span className="text-3xl font-extrabold text-teal-600 font-mono">
                      {step.stepNumber}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{step.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Frequently Asked Questions
              </h2>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:bg-slate-50 transition-colors text-xs sm:text-sm"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          openFaq === idx ? 'rotate-180 text-teal-600' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
