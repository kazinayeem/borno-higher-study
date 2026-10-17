import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SeoHead } from '../components/common/SeoHead';
import { getCareerRoadmapsDirectory } from '../services/api';
import { CareerRoadmapItem } from '../types';

export const CareerRoadmapsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [roadmaps, setRoadmaps] = useState<CareerRoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('DE');
  const [openStages, setOpenStages] = useState<Record<string, boolean>>({
    STAGE_A: true,
    STAGE_B: true,
    STAGE_C: true,
    STAGE_D: true,
    STAGE_E: true,
    STAGE_F: true,
  });

  useEffect(() => {
    async function loadRoadmaps() {
      try {
        setLoading(true);
        setError(null);
        const res = await getCareerRoadmapsDirectory();
        setRoadmaps(res.data);
        if (res.data.length > 0) {
          setSelectedCountryCode(res.data[0].country?.code || 'DE');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load career roadmaps');
      } finally {
        setLoading(false);
      }
    }
    loadRoadmaps();
  }, []);

  const currentRoadmap = roadmaps.find(
    (r) => r.country?.code.toUpperCase() === selectedCountryCode.toUpperCase()
  ) || roadmaps[0];

  const toggleStage = (stageCode: string) => {
    setOpenStages((prev) => ({ ...prev, [stageCode]: !prev[stageCode] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-28">
      <SeoHead
        title={isBn ? 'দেশভিত্তিক ৬-ধাপের ক্যারিয়ার ও স্টাডি রোডম্যাপ | বর্ণ' : '6-Stage Study-to-Work Career Roadmaps by Country | Borno'}
        description="Actionable 6-stage career roadmap from pre-arrival country selection, first semester registrations, student work compliance to graduate routes and career transition."
        canonicalPath="/country-work-guide/career-roadmaps"
      />

      {/* Top Banner / Breadcrumbs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs
            items={[
              { label: isBn ? 'হোম' : 'Home', href: '/' },
              { label: isBn ? 'কাজের ও ক্যারিয়ার গাইড' : 'Work & Career Guide', href: '/country-work-guide' },
              { label: isBn ? 'ক্যারিয়ার রোডম্যাপ' : 'Career Roadmaps' },
            ]}
          />
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-b from-amber-950 via-slate-900 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-4">
            <Compass className="w-4 h-4 text-amber-400" />
            Practical 6-Stage Planning Framework
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Country-Specific Study-to-Career Roadmaps
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            From pre-arrival language requirements to post-graduation residence transitions: practical steps tailored to national employment markets and labor laws.
          </p>
        </div>
      </section>

      {/* Country Selector Pills */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Important Planning Notice:</strong> These roadmaps represent an organized framework based on current statutory regulations and labor market practices. They do not constitute formal legal immigration advice or a guarantee of employment.
          </div>
        </div>

        {/* Country Pills */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 py-2">
          {roadmaps.map((r) => {
            const isSelected = r.country?.code.toUpperCase() === selectedCountryCode.toUpperCase();
            return (
              <button
                key={r.id}
                onClick={() => setSelectedCountryCode(r.country?.code || '')}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/25'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-primary-400'
                }`}
              >
                <span role="img" aria-label={r.country?.name}>{r.country?.flagEmoji}</span>
                {r.country?.name}
              </button>
            );
          })}
        </div>

        {/* Roadmap Display */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-500">Loading career roadmap...</p>
          </div>
        ) : !currentRoadmap ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No roadmap currently available.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-2xl" role="img" aria-label={currentRoadmap.country?.name}>
                    {currentRoadmap.country?.flagEmoji}
                  </span>
                  {currentRoadmap.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {currentRoadmap.summary}
                </p>
              </div>

              <Link
                to={`/country-work-guide/${currentRoadmap.country?.code.toLowerCase()}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
              >
                View Country Work Profile <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Stages Stack */}
            <div className="space-y-4">
              {currentRoadmap.steps.map((step) => {
                const isOpen = openStages[step.stageCode] ?? true;
                return (
                  <div
                    key={step.id}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleStage(step.stageCode)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-200 dark:border-amber-800/60 shrink-0">
                          {step.stepOrder}
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                            {step.stageTitle}
                          </h4>
                          <span className="text-[11px] text-primary-600 dark:text-primary-400 font-semibold">
                            {step.timelineDescription}
                          </span>
                        </div>
                      </div>

                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                        <div className="space-y-2 pt-4">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Key Concrete Actions:
                          </span>
                          {step.actionItems.map((action, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                              <span className="leading-relaxed">{action}</span>
                            </div>
                          ))}
                        </div>

                        {step.criticalRules && (
                          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300">
                            <strong>Critical Legal Warning:</strong> {step.criticalRules}
                          </div>
                        )}

                        {step.keyResources && step.keyResources.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                              Official Portals & Tools:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {step.keyResources.map((res, i) => (
                                <a
                                  key={i}
                                  href={res.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary-600 dark:text-primary-400 text-xs font-medium hover:underline"
                                >
                                  {res.label} <ExternalLink className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
