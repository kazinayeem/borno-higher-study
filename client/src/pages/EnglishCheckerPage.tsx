import React, { useState } from 'react';
import { checkEnglishEligibility } from '../services/api.js';
import { COUNTRIES_DATA } from '../data/countriesData.js';
import { CheckCircle2, AlertCircle, HelpCircle, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead.js';

export const EnglishCheckerPage: React.FC = () => {
  const [testType, setTestType] = useState<'IELTS' | 'TOEFL' | 'PTE'>('IELTS');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');

  const [overallScore, setOverallScore] = useState('6.5');
  const [readingScore, setReadingScore] = useState('6.0');
  const [listeningScore, setListeningScore] = useState('6.5');
  const [speakingScore, setSpeakingScore] = useState('6.0');
  const [writingScore, setWritingScore] = useState('6.0');

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await checkEnglishEligibility({
        countrySlug: selectedCountry !== 'all' ? selectedCountry : undefined,
        degreeLevel: selectedDegree !== 'all' ? selectedDegree : undefined,
        testType,
        overallScore: Number(overallScore),
        readingScore: readingScore ? Number(readingScore) : undefined,
        listeningScore: listeningScore ? Number(listeningScore) : undefined,
        speakingScore: speakingScore ? Number(speakingScore) : undefined,
        writingScore: writingScore ? Number(writingScore) : undefined,
      });
      setResults(data);
    } catch (err: any) {
      alert(err.message || 'Evaluation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SeoHead
        title="IELTS, TOEFL & PTE Eligibility Checker | Borno Higher Study"
        description="Verify your IELTS, TOEFL iBT, or PTE Academic score against 380+ verified university degree programs. Check overall band score and minimum subscore criteria."
        canonicalPath="/english-checker"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Official Language Proficiency Validator</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy">
            English Test Eligibility Checker
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Verify whether your IELTS Academic, TOEFL iBT, or PTE Academic score meets program-specific admission criteria and subscore thresholds across 30 nations.
          </p>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleEvaluate}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6"
        >
          {/* Test Type Tabs */}
          <div className="flex border-b border-slate-200 gap-2">
            {(['IELTS', 'TOEFL', 'PTE'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTestType(t)}
                className={`px-6 py-2.5 font-bold text-sm border-b-2 transition-all ${
                  testType === t
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {t === 'IELTS' ? 'IELTS Academic' : t === 'TOEFL' ? 'TOEFL iBT' : 'PTE Academic'}
              </button>
            ))}
          </div>

          {/* Destination & Degree Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Target Destination</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">🌍 All 30 Destinations</option>
                {COUNTRIES_DATA.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.flagEmoji} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Degree Level</label>
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">🎓 Any Level</option>
                <option value="BACHELOR">Bachelor's Degree</option>
                <option value="MASTER">Master's Degree</option>
                <option value="PHD">Doctorate (PhD)</option>
              </select>
            </div>
          </div>

          {/* Scores Input Grid */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-sm text-slate-800 mb-3">Your Test Scores</h4>

            {testType === 'IELTS' ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-teal-800">Overall Score *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="4.0"
                    max="9.0"
                    value={overallScore}
                    onChange={(e) => setOverallScore(e.target.value)}
                    className="w-full px-3 py-2 bg-teal-50/50 border border-teal-300 rounded-xl text-sm font-bold text-center text-teal-900 focus:ring-1 focus:ring-teal-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Reading Band</label>
                  <input
                    type="number"
                    step="0.5"
                    min="4.0"
                    max="9.0"
                    value={readingScore}
                    onChange={(e) => setReadingScore(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-center text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Listening Band</label>
                  <input
                    type="number"
                    step="0.5"
                    min="4.0"
                    max="9.0"
                    value={listeningScore}
                    onChange={(e) => setListeningScore(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-center text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Speaking Band</label>
                  <input
                    type="number"
                    step="0.5"
                    min="4.0"
                    max="9.0"
                    value={speakingScore}
                    onChange={(e) => setSpeakingScore(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-center text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Writing Band</label>
                  <input
                    type="number"
                    step="0.5"
                    min="4.0"
                    max="9.0"
                    value={writingScore}
                    onChange={(e) => setWritingScore(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-center text-slate-800"
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-xs space-y-1">
                <label className="text-xs font-bold text-teal-800">
                  {testType === 'TOEFL' ? 'Total TOEFL iBT Score (0-120)' : 'PTE Academic Overall (10-90)'}
                </label>
                <input
                  type="number"
                  min={testType === 'TOEFL' ? '0' : '10'}
                  max={testType === 'TOEFL' ? '120' : '90'}
                  value={overallScore}
                  onChange={(e) => setOverallScore(e.target.value)}
                  className="w-full px-3 py-2 bg-teal-50/50 border border-teal-300 rounded-xl text-sm font-bold text-center text-teal-900 focus:ring-1 focus:ring-teal-500"
                  required
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Evaluating Requirements...' : 'Evaluate Test Score Across Programs'}
          </button>
        </form>

        {/* Results Overview */}
        {results && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-lg text-brand-navy">
                  Eligibility Summary for {results.summary.testType} {results.summary.testedScore}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluated {results.summary.totalProgramsEvaluated} programs against verified admissions criteria
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  ✔ {results.summary.meetsCount} Meets Criteria
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                  ✘ {results.summary.notMeetsCount} Does Not Meet
                </span>
              </div>
            </div>

            {/* List of program evaluations */}
            <div className="space-y-3">
              {results.evaluations.map((evalItem: any) => {
                const isPass = evalItem.status === 'MEETS_REQUIREMENT';
                return (
                  <div
                    key={evalItem.programId}
                    className={`p-5 rounded-2xl border shadow-xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      isPass
                        ? 'bg-white border-emerald-200/80 hover:border-emerald-300'
                        : 'bg-white border-slate-200 opacity-90'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isPass
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isPass ? 'Meets Recorded Requirement' : 'Does Not Meet Requirement'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {evalItem.countryName}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-brand-navy">{evalItem.programName}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {evalItem.universityName} • Required: {results.summary.testType} {evalItem.requiredScore}
                        {evalItem.requiredSubscore && ` (Subscore ${evalItem.requiredSubscore})`}
                      </p>

                      {evalItem.unmetReasons.length > 0 && (
                        <div className="mt-2 text-xs text-rose-700 bg-rose-50 p-2 rounded-lg space-y-0.5">
                          {evalItem.unmetReasons.map((r: string, idx: number) => (
                            <p key={idx}>• {r}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <a
                        href={evalItem.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Official Source Link</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
