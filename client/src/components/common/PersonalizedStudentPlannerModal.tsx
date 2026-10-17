import React, { useState } from 'react';
import { X, Sparkles, Compass, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, DollarSign, Clock, GraduationCap } from 'lucide-react';
import { generateStudentPlan } from '../../services/api';
import { StudentPlannerRecommendation } from '../../types';
import { Link } from 'react-router-dom';

interface PersonalizedStudentPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PersonalizedStudentPlannerModal: React.FC<PersonalizedStudentPlannerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [degreeLevel, setDegreeLevel] = useState<'BACHELORS' | 'MASTERS' | 'DOCTORATE'>('MASTERS');
  const [subjectArea, setSubjectArea] = useState('Computer Science & Information Technology');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [budget, setBudget] = useState(15000);
  const [priority, setPriority] = useState<'POST_STUDY_DURATION' | 'MINIMUM_WAGE' | 'MAX_WORK_HOURS' | 'PR_PATHWAY' | 'LOW_TUITION'>('POST_STUDY_DURATION');
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<StudentPlannerRecommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await generateStudentPlan({
        degreeLevel,
        subjectArea,
        preferredStudyLanguage: preferredLanguage,
        annualTuitionBudgetUsd: budget,
        priority,
      });
      setResults(res.recommendations);
    } catch (err: any) {
      setError(err.message || 'Failed to generate study-to-work recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-primary-500/25">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              Personalized Study-to-Work Planner
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Transparent country matching based on verified statutory policies, wages & post-study permits
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="space-y-5 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Target Degree Level
              </label>
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="BACHELORS">Bachelor's Degree (Undergraduate)</option>
                <option value="MASTERS">Master's Degree (Postgraduate)</option>
                <option value="DOCTORATE">Doctoral Degree (PhD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Primary Field of Study
              </label>
              <select
                value={subjectArea}
                onChange={(e) => setSubjectArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="Computer Science & Information Technology">Computer Science & Software IT</option>
                <option value="Artificial Intelligence & Data Science">AI, Machine Learning & Data Analytics</option>
                <option value="Mechanical & Mechatronics Engineering">Mechanical & Industrial Engineering</option>
                <option value="Renewable Energy & Electrical Engineering">Electrical & Clean Energy Engineering</option>
                <option value="Finance & Business Analytics">Finance, FinTech & Business Analytics</option>
                <option value="Biotechnology & Healthcare">Healthcare, Nursing & BioTech</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Preferred Instruction Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="English">English (International Programs)</option>
                <option value="German">German (Deutsch B2/C1)</option>
                <option value="French">French (Français)</option>
                <option value="Swedish">Swedish (Svenska)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Key Strategic Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="POST_STUDY_DURATION">Maximum Post-Study Work Duration</option>
                <option value="MINIMUM_WAGE">High Statutory Hourly Wage</option>
                <option value="MAX_WORK_HOURS">Highest Legal Student Work Hours</option>
                <option value="PR_PATHWAY">Direct Permanent Residency Pathways</option>
                <option value="LOW_TUITION">Low or Nominal Tuition Fees</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Independent calculation based solely on statutory immigration & labor data.
            </span>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>Computing verified matches...</>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Strategic Roadmap
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-sm text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results View */}
        {results && (
          <div className="mt-8 space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Matched Destinations Ranked by Policy Fit
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Found {results.length} verified destinations
              </span>
            </div>

            <div className="space-y-4">
              {results.slice(0, 4).map((rec) => (
                <div
                  key={rec.country.code}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl" role="img" aria-label={rec.country.name}>
                        {rec.country.flagEmoji}
                      </span>
                      <div>
                        <h5 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {rec.country.name}
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {rec.country.code}
                          </span>
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {rec.country.continent} • Currency: {rec.country.currencyCode} ({rec.country.currencySymbol})
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-sm font-bold border border-emerald-200 dark:border-emerald-800/60">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        {rec.matchScore}% Match
                      </div>
                    </div>
                  </div>

                  {/* Verified Facts */}
                  <div className="space-y-1.5 mb-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Verified Policy Highlights:
                    </span>
                    {rec.verifiedFacts.map((fact, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{fact}</span>
                      </div>
                    ))}
                  </div>

                  {/* Critical Cautions */}
                  {rec.criticalCautions.length > 0 && (
                    <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-xl space-y-1 mb-3">
                      <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider block">
                        Compliance Cautions:
                      </span>
                      {rec.criticalCautions.map((caution, idx) => (
                        <p key={idx} className="text-xs text-amber-800 dark:text-amber-300">
                          • {caution}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <span className="text-xs text-slate-400">
                      Never assume permitted work hours = guaranteed income.
                    </span>
                    <Link
                      to={`/country-work-guide/${rec.country.code.toLowerCase()}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700"
                    >
                      View Complete Profile & Roadmap
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
