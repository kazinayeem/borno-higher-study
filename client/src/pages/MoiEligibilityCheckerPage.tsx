import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Building2,
  GraduationCap,
  Calendar,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { checkMoiEligibility, getCountries, getMoiPolicies } from '../services/api';
import { SeoHead } from '../components/common/SeoHead';

export const MoiEligibilityCheckerPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  // Form State
  const [targetCountry, setTargetCountry] = useState('United Kingdom');
  const [selectedUniversityId, setSelectedUniversityId] = useState('');
  const [completedQualification, setCompletedQualification] = useState("4-Year Bachelor's Degree");
  const [awardingInstitution, setAwardingInstitution] = useState('');
  const [allTaughtInEnglish, setAllTaughtInEnglish] = useState<boolean | null>(null);
  const [graduationYear, setGraduationYear] = useState<number>(new Date().getFullYear() - 1);
  const [canProvideMoiLetter, setCanProvideMoiLetter] = useState<boolean | null>(null);
  const [hasAdditionalCourseReqs, setHasAdditionalCourseReqs] = useState<boolean | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingInitial(true);
      const [countriesRes, policiesRes] = await Promise.all([
        getCountries(),
        getMoiPolicies({ limit: 50 }),
      ]);
      setCountries(countriesRes.countries || []);
      setPolicies(policiesRes.policies || []);
      if (policiesRes.policies && policiesRes.policies.length > 0) {
        setSelectedUniversityId(policiesRes.policies[0].universityId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInitial(false);
    }
  };

  // Filter universities available in the chosen country
  const filteredUniversities = policies.filter(
    (p) => !targetCountry || p.country.toLowerCase().includes(targetCountry.toLowerCase())
  );

  const handleEvaluate = async () => {
    if (!selectedUniversityId) return;

    try {
      setEvaluating(true);
      const evalRes = await checkMoiEligibility({
        country: targetCountry,
        universityId: selectedUniversityId,
        completedQualification,
        awardingInstitution: awardingInstitution.trim() || 'Recognized University',
        allTaughtInEnglish: allTaughtInEnglish === true,
        graduationYear: Number(graduationYear) || new Date().getFullYear(),
        canProvideMoiLetter: canProvideMoiLetter === true,
        hasAdditionalCourseReqs: hasAdditionalCourseReqs === true,
      });
      setResult(evalRes);
      setStep(4);
    } catch (err: any) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setAwardingInstitution('');
    setAllTaughtInEnglish(null);
    setCanProvideMoiLetter(null);
    setHasAdditionalCourseReqs(null);
  };

  const getOutcomeVisuals = (outcome: string) => {
    switch (outcome) {
      case 'POTENTIALLY_ELIGIBLE':
        return {
          icon: <CheckCircle2 className="w-12 h-12 text-emerald-500" />,
          bgColor: 'bg-emerald-50 border-emerald-200',
          textColor: 'text-emerald-950',
          badgeText: 'Potentially Eligible',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'CONDITIONAL_OR_ADDITIONAL_EVIDENCE':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-amber-500" />,
          bgColor: 'bg-amber-50 border-amber-200',
          textColor: 'text-amber-950',
          badgeText: 'Additional Evidence May Be Required',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'SEPARATE_TEST_NECESSARY':
        return {
          icon: <XCircle className="w-12 h-12 text-red-500" />,
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-950',
          badgeText: 'Formal English Test Necessary',
          badgeColor: 'bg-red-100 text-red-800 border-red-300',
        };
      default:
        return {
          icon: <HelpCircle className="w-12 h-12 text-indigo-500" />,
          bgColor: 'bg-indigo-50 border-indigo-200',
          textColor: 'text-indigo-950',
          badgeText: 'Contact University Admissions',
          badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-20">
      <SeoHead
        title="MOI & English Waiver Eligibility Checker | Borno Higher Study"
        description="Check whether your completed degree qualifies for a Medium of Instruction (MOI) English test waiver at top international universities."
        canonicalPath="/moi-eligibility-checker"
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white pt-12 pb-16 px-4 border-b border-navy-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Interactive Assessment Engine</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            MOI & English Waiver Eligibility Checker
          </h1>
          <p className="mt-3 text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            Answer a few quick questions about your completed qualification and target university to determine if you may be eligible for an English proficiency waiver.
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center space-x-3 mt-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center space-x-2 ${
                  step === s
                    ? 'text-teal-400 font-bold'
                    : step > s
                    ? 'text-emerald-400'
                    : 'text-gray-500'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                    step === s
                      ? 'bg-teal-500 text-white border-teal-400 shadow-md shadow-teal-500/20'
                      : step > s
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : 'bg-white/10 text-gray-400 border-white/10'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
                <span className="text-xs hidden sm:inline">
                  {s === 1 ? 'Target Destination' : s === 2 ? 'Your Qualification' : 'Language & Documents'}
                </span>
                {s < 3 && <span className="text-gray-600 sm:inline mx-1">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-3xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          {/* STEP 1: Target Country and University */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-navy-950 flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  <span>Step 1: Choose Your Destination & University</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Select the country and institution you wish to apply to.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    1. Study Destination Country
                  </label>
                  <select
                    value={targetCountry}
                    onChange={(e) => {
                      setTargetCountry(e.target.value);
                      const matching = policies.filter((p) =>
                        p.country.toLowerCase().includes(e.target.value.toLowerCase())
                      );
                      if (matching.length > 0) setSelectedUniversityId(matching[0].universityId);
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    2. Target University or College
                  </label>
                  <select
                    value={selectedUniversityId}
                    onChange={(e) => setSelectedUniversityId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    {filteredUniversities.map((p) => (
                      <option key={p.id} value={p.universityId}>
                        {p.university?.name} ({p.qualificationLevel.replace(/_/g, ' ')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  disabled={!selectedUniversityId}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md disabled:opacity-50"
                >
                  <span>Continue to Qualification</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Qualification Details */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-navy-950 flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-teal-600" />
                  <span>Step 2: Tell Us About Your Qualification</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  University exemption criteria often depend on degree duration, recency, and awarding institution.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Completed Qualification Level
                  </label>
                  <select
                    value={completedQualification}
                    onChange={(e) => setCompletedQualification(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="4-Year Bachelor's Degree">4-Year Bachelor's Degree</option>
                    <option value="3-Year Bachelor's Degree">3-Year Bachelor's Degree</option>
                    <option value="Master's Degree (Postgraduate)">Master's Degree (Postgraduate)</option>
                    <option value="2-Year Associate / Diploma">2-Year Associate Degree / Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Awarding Institution Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BUET, University of Dhaka, North South University, BRAC University, etc."
                    value={awardingInstitution}
                    onChange={(e) => setAwardingInstitution(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Some institutions (like Aston) have a pre-approved list of recognized Bangladeshi universities.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Year of Graduation / Degree Completion
                  </label>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min={2000}
                      max={new Date().getFullYear()}
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(Number(e.target.value))}
                      className="w-40 px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <span className="text-xs text-gray-500">
                      (~{new Date().getFullYear() - graduationYear} years ago)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={!awardingInstitution.trim()}
                  onClick={() => setStep(3)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md disabled:opacity-50"
                >
                  <span>Continue to Language & Documents</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Language & Documentation */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-navy-950 flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-teal-600" />
                  <span>Step 3: Instruction Medium & Documentation</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Exemption policies require official institutional proof and 100% English medium delivery.
                </p>
              </div>

              <div className="space-y-6">
                {/* Q1: 100% English instruction */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Was your entire degree course delivered and examined 100% in English?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAllTaughtInEnglish(true)}
                      className={`p-3.5 rounded-xl border text-sm font-medium text-left transition-all ${
                        allTaughtInEnglish === true
                          ? 'border-teal-500 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">Yes, 100% English</div>
                      <div className="text-xs text-gray-500 mt-0.5">All lectures, coursework & exams</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllTaughtInEnglish(false)}
                      className={`p-3.5 rounded-xl border text-sm font-medium text-left transition-all ${
                        allTaughtInEnglish === false
                          ? 'border-red-500 bg-red-50/50 text-red-900 ring-2 ring-red-500'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">No / Bilingual</div>
                      <div className="text-xs text-gray-500 mt-0.5">Taught in Bengali or dual languages</div>
                    </button>
                  </div>
                </div>

                {/* Q2: Official MOI letter */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Can your university issue an official MOI letter signed by the Registrar?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCanProvideMoiLetter(true)}
                      className={`p-3.5 rounded-xl border text-sm font-medium text-left transition-all ${
                        canProvideMoiLetter === true
                          ? 'border-teal-500 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">Yes, Official Letter Available</div>
                      <div className="text-xs text-gray-500 mt-0.5">On official letterhead with seal</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCanProvideMoiLetter(false)}
                      className={`p-3.5 rounded-xl border text-sm font-medium text-left transition-all ${
                        canProvideMoiLetter === false
                          ? 'border-amber-500 bg-amber-50/50 text-amber-900 ring-2 ring-amber-500'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">No / Not Available</div>
                      <div className="text-xs text-gray-500 mt-0.5">University cannot provide official letter</div>
                    </button>
                  </div>
                </div>

                {/* Q3: Course additional requirement */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Does your target course publish higher or mandatory departmental test requirements?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setHasAdditionalCourseReqs(false)}
                      className={`p-3.5 rounded-xl border text-sm font-medium text-left transition-all ${
                        hasAdditionalCourseReqs === false
                          ? 'border-teal-500 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">No Specific Department Test</div>
                      <div className="text-xs text-gray-500 mt-0.5">Standard university policy applies</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasAdditionalCourseReqs(true)}
                      className={`p-3.5 rounded-xl border text-sm font-medium text-left transition-all ${
                        hasAdditionalCourseReqs === true
                          ? 'border-amber-500 bg-amber-50/50 text-amber-900 ring-2 ring-amber-500'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">Yes / Specialized Course</div>
                      <div className="text-xs text-gray-500 mt-0.5">e.g. Clinical, Law, or MBA requirement</div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={allTaughtInEnglish === null || canProvideMoiLetter === null || evaluating}
                  onClick={handleEvaluate}
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-teal-900/20 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{evaluating ? 'Assessing Policy...' : 'Evaluate Eligibility'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Assessment Results */}
          {step === 4 && result && (
            <div className="space-y-6 animate-fade-in">
              {(() => {
                const visual = getOutcomeVisuals(result.outcome);
                return (
                  <div className={`p-6 rounded-2xl border ${visual.bgColor} space-y-4`}>
                    <div className="flex items-center space-x-4">
                      {visual.icon}
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-1 ${visual.badgeColor}`}>
                          {visual.badgeText}
                        </span>
                        <h3 className={`text-xl font-bold ${visual.textColor}`}>
                          {result.summaryTitle}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Target Institution: <span className="font-semibold text-gray-700">{result.targetUniversityName}</span>
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-800 leading-relaxed bg-white/70 p-4 rounded-xl border border-gray-200/50">
                      {result.explanation}
                    </p>

                    {/* Applicable conditions list */}
                    {result.applicableConditions && result.applicableConditions.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                          Key Conditions &amp; Submission Rules:
                        </div>
                        <ul className="space-y-1.5 text-xs text-gray-700">
                          {result.applicableConditions.map((cond: string, idx: number) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-teal-600 font-bold">•</span>
                              <span>{cond}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Crucial Visa Separation Callout */}
                    <div className="bg-amber-100/70 border border-amber-300/80 rounded-xl p-3.5 flex items-start space-x-2.5 text-xs text-amber-950">
                      <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Essential Visa Independence Rule: </span>
                        {result.visaSeparationNotice}
                      </div>
                    </div>

                    {/* Official Policy Link & Disclaimer */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      {result.officialPolicyUrl && (
                        <a
                          href={result.officialPolicyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                        >
                          <span>Review Official Admissions Policy</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-1" />
                        </a>
                      )}
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-medium transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                        <span>Check Another University</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-500 italic pt-2 border-t border-gray-200/50">
                      Disclaimer: {result.disclaimer}
                    </p>
                  </div>
                );
              })()}

              <div className="text-center pt-2">
                <Link
                  to="/moi-acceptance"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline inline-flex items-center space-x-1"
                >
                  <span>Explore All Universities in the MOI Directory</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
