import React, { useState, useEffect } from 'react';
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
  ShieldAlert,
  Sparkles,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { getEnglishAdvisorRecommendation, getUniversities, getCountries } from '../services/api';
import { SeoHead } from '../components/common/SeoHead';

export const EnglishTestAdvisorPage: React.FC = () => {
  const [step, setStep] = useState(1);

  // Form State
  const [targetCountry, setTargetCountry] = useState('united-kingdom');
  const [qualificationLevel, setQualificationLevel] = useState('UNDERGRADUATE');
  const [shortlistedUniIds, setShortlistedUniIds] = useState<string[]>([]);
  const [deliveryPreference, setDeliveryPreference] = useState<'TEST_CENTRE' | 'ONLINE' | 'NO_PREFERENCE'>('TEST_CENTRE');
  const [existingTest, setExistingTest] = useState('NONE');
  const [existingScore, setExistingScore] = useState<number | undefined>(undefined);
  const [budgetBdt, setBudgetBdt] = useState<number | undefined>(30000);

  // Available options
  const [availableUniversities, setAvailableUniversities] = useState<any[]>([]);
  const [loadingUnis, setLoadingUnis] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<any | null>(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    loadShortlistOptions();
  }, [targetCountry]);

  const loadShortlistOptions = async () => {
    try {
      setLoadingUnis(true);
      const res = await getUniversities({ country: targetCountry === 'united-kingdom' ? 'United Kingdom' : undefined });
      setAvailableUniversities(res.universities || []);
    } catch {
      //
    } finally {
      setLoadingUnis(false);
    }
  };

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
      const res = await getEnglishAdvisorRecommendation({
        targetCountry,
        qualificationLevel,
        shortlistedUniIds,
        deliveryPreference,
        existingTest: existingTest === 'NONE' ? undefined : existingTest,
        existingScore,
        budgetBdt,
      });
      setRecommendationResult(res);
      setStep(4); // Move to results step
    } catch (e) {
      console.error(e);
    } finally {
      setCalculating(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setRecommendationResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-20">
      <SeoHead
        title="English Test Advisor Wizard: Find the Right Exam for Your University Shortlist"
        description="Interactive admissions advisor checking IELTS, PTE, and TOEFL acceptance across your shortlisted universities. Evaluates test-centre vs online policies, Bangladesh fees, and UKVI SELT visa rules."
        canonicalPath="/english-test-advisor"
        ogType="website"
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-navy-950 to-navy-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-4">
            <Compass className="w-3.5 h-3.5" />
            Admissions Rules Alignment Engine
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            English Test Recommendation Wizard
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Answer a few quick questions about your study destination, shortlisted universities, and delivery preferences.
            Our algorithm checks verified admissions policies to recommend your best test path.
          </p>

          {/* Stepper Progress */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8 max-w-md mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === i
                      ? 'bg-teal-500 text-navy-950 ring-4 ring-teal-500/20'
                      : step > i
                      ? 'bg-teal-700 text-white'
                      : 'bg-navy-800 text-gray-400 border border-navy-700'
                  }`}
                >
                  {step > i ? '✓' : i}
                </div>
                {i < 4 && <div className={`w-6 sm:w-12 h-0.5 ${step > i ? 'bg-teal-600' : 'bg-navy-800'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200/80 p-6 sm:p-10 overflow-hidden">
          {/* Step 1: Destination & Level */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-navy-950 mb-1">Step 1: Destination Country & Study Level</h2>
                <p className="text-xs text-gray-500">Select where and what degree you plan to study.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Target Study Destination</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { slug: 'united-kingdom', name: 'United Kingdom', flag: '🇬🇧' },
                    { slug: 'united-states', name: 'United States', flag: '🇺🇸' },
                    { slug: 'canada', name: 'Canada', flag: '🇨🇦' },
                    { slug: 'australia', name: 'Australia', flag: '🇦🇺' },
                    { slug: 'germany', name: 'Germany', flag: '🇩🇪' },
                    { slug: 'finland', name: 'Finland', flag: '🇫🇮' },
                  ].map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => setTargetCountry(c.slug)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                        targetCountry === c.slug
                          ? 'border-teal-500 bg-teal-50/50 text-navy-950 font-bold shadow-sm ring-2 ring-teal-500/20'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="text-xl">{c.flag}</span>
                      <span className="text-xs">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Qualification Level</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { value: 'UNDERGRADUATE', label: "Undergraduate (Bachelor's Degree)" },
                    { value: 'POSTGRADUATE_TAUGHT', label: "Postgraduate Taught (Master's Degree)" },
                    { value: 'POSTGRADUATE_RESEARCH', label: "Postgraduate Research (PhD / Doctorate)" },
                    { value: 'FOUNDATION', label: "Foundation / Pre-sessional (Below Degree)" },
                  ].map((lvl) => (
                    <button
                      key={lvl.value}
                      type="button"
                      onClick={() => setQualificationLevel(lvl.value)}
                      className={`p-3 rounded-2xl border text-left transition ${
                        qualificationLevel === lvl.value
                          ? 'border-teal-500 bg-teal-50/50 text-navy-950 font-bold shadow-sm ring-2 ring-teal-500/20'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-navy-900 hover:bg-navy-950 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition"
                >
                  Continue to Shortlist <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Shortlisted Universities */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-navy-950 mb-1">Step 2: Shortlisted Universities</h2>
                <p className="text-xs text-gray-500">
                  Select one or more universities you are targeting. We will check their specific language policies for
                  conflicts.
                </p>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 border border-gray-200 rounded-2xl p-3">
                {loadingUnis ? (
                  <div className="text-center py-8 text-xs text-gray-500">Loading university catalog...</div>
                ) : availableUniversities.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-500">
                    No universities found for selected country.
                  </div>
                ) : (
                  availableUniversities.slice(0, 30).map((u) => {
                    const isSelected = shortlistedUniIds.includes(u.id);
                    return (
                      <div
                        key={u.id}
                        onClick={() => toggleSelectUni(u.id)}
                        className={`p-3 rounded-xl border cursor-pointer text-xs flex items-center justify-between transition ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50 text-navy-950 font-bold'
                            : 'border-gray-100 hover:border-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-gray-400'}`} />
                          <span>{u.name}</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border text-xs ${
                            isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-gray-300'
                          }`}
                        >
                          {isSelected && '✓'}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="text-xs text-gray-500 italic">
                Selected: <strong>{shortlistedUniIds.length}</strong> university(ies). You can also proceed with 0 to view
                broad country-level recommendations.
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-navy-900 hover:bg-navy-950 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition"
                >
                  Continue to Preferences <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Delivery Preference, Existing Score & Budget */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-navy-950 mb-1">Step 3: Delivery Format & Test Budget</h2>
                <p className="text-xs text-gray-500">Tailor recommendations to your circumstances.</p>
              </div>

              {/* Delivery Preference */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Test Delivery Preference</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { value: 'TEST_CENTRE', label: '🏢 Physical Test Centre', desc: 'Required by top universities & visas' },
                    { value: 'ONLINE', label: '💻 At-Home Online Test', desc: 'Take from home with webcam' },
                    { value: 'NO_PREFERENCE', label: '⚡ No Preference', desc: 'Whichever satisfies my shortlist' },
                  ].map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setDeliveryPreference(p.value as any)}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        deliveryPreference === p.value
                          ? 'border-teal-500 bg-teal-50/50 text-navy-950 font-bold shadow-sm ring-2 ring-teal-500/20'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="block font-bold mb-0.5">{p.label}</span>
                      <span className="text-[11px] text-gray-500 block font-normal">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Approximate Budget */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Approximate Exam Budget: <strong>BDT {budgetBdt?.toLocaleString()}</strong>
                </label>
                <input
                  type="range"
                  min="20000"
                  max="35000"
                  step="1000"
                  value={budgetBdt}
                  onChange={(e) => setBudgetBdt(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                  <span>BDT 20,000</span>
                  <span>BDT 27,000 (IELTS/PTE Standard)</span>
                  <span>BDT 35,000</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="button"
                  disabled={calculating}
                  onClick={handleGenerateRecommendation}
                  className="px-7 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-600/20 transition disabled:opacity-50"
                >
                  {calculating ? (
                    'Evaluating Shortlist Rules...'
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Generate Recommendation
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Results & Conflict Analysis */}
          {step === 4 && recommendationResult && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Shortlist Analysis Completed
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-navy-950">Your Recommended English Test Plan</h2>
              </div>

              {/* Conflict Alerts */}
              {recommendationResult.conflictAlerts?.length > 0 && (
                <div className="space-y-2">
                  {recommendationResult.conflictAlerts.map((alert: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs leading-relaxed flex items-start gap-3 shadow-sm"
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-amber-900 mb-0.5">Shortlist Policy Warning</strong>
                        {alert}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Primary Recommendation Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-navy-950 to-navy-900 text-white border border-navy-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-teal-500 text-navy-950 px-4 py-1.5 rounded-bl-2xl text-[11px] font-black uppercase tracking-wider">
                  Top Recommended
                </div>

                <div className="mb-4">
                  <span className="text-xs text-teal-300 font-bold uppercase tracking-wider block mb-1">
                    Primary Match ({recommendationResult.recommendation.primary.acceptanceRateAcrossShortlist}% Acceptance)
                  </span>
                  <h3 className="text-2xl font-black text-white">{recommendationResult.recommendation.primary.name}</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs">
                  <div className="p-3 bg-navy-850/80 rounded-xl border border-navy-800">
                    <span className="text-[10px] text-gray-400 block mb-0.5">Delivery</span>
                    <span className="font-bold text-white">
                      {recommendationResult.recommendation.primary.deliveryMode === 'ONLINE' ? 'At-Home Online' : 'Test Centre'}
                    </span>
                  </div>
                  <div className="p-3 bg-navy-850/80 rounded-xl border border-navy-800">
                    <span className="text-[10px] text-gray-400 block mb-0.5">Duration</span>
                    <span className="font-bold text-white">{recommendationResult.recommendation.primary.durationMinutes} mins</span>
                  </div>
                  <div className="p-3 bg-navy-850/80 rounded-xl border border-navy-800">
                    <span className="text-[10px] text-gray-400 block mb-0.5">Turnaround</span>
                    <span className="font-bold text-white">{recommendationResult.recommendation.primary.resultTurnaround}</span>
                  </div>
                  <div className="p-3 bg-navy-850/80 rounded-xl border border-navy-800">
                    <span className="text-[10px] text-gray-400 block mb-0.5">Est. Fee</span>
                    <span className="font-bold text-teal-300">
                      BDT {recommendationResult.recommendation.primary.estimatedFeeBdt?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 mb-4 leading-relaxed">
                  {recommendationResult.recommendation.primary.rationale}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-navy-800">
                  <span className="text-xs text-gray-400">
                    {recommendationResult.recommendation.primary.shortlistMatchDescription}
                  </span>
                  <a
                    href={recommendationResult.recommendation.primary.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs flex items-center gap-1.5 transition shadow"
                  >
                    Book Official Test <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Secondary Alternative Card */}
              {recommendationResult.recommendation.alternative && (
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
                  <span className="font-bold text-gray-700 block mb-1">
                    Viable Alternative:{' '}
                    <strong className="text-navy-950">
                      {recommendationResult.recommendation.alternative.name}
                    </strong>
                  </span>
                  <p className="text-gray-600 mb-3">{recommendationResult.recommendation.alternative.rationale}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">
                      Estimated Fee: BDT {recommendationResult.recommendation.alternative.estimatedFeeBdt?.toLocaleString()}
                    </span>
                    <Link
                      to={`/university-test-acceptance?testFormatCode=${recommendationResult.recommendation.alternative.code}`}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline"
                    >
                      Compare University Acceptance →
                    </Link>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-4 rounded-xl bg-gray-100 text-[11px] text-gray-600 leading-relaxed">
                <strong>Disclaimer: </strong>
                {recommendationResult.disclaimer}
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> Start Over
                </button>

                <Link
                  to="/university-test-acceptance"
                  className="px-6 py-2.5 bg-navy-900 hover:bg-navy-950 text-white rounded-xl text-xs font-bold transition"
                >
                  Browse University Database
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
