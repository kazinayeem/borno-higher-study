import React from 'react';
import { Link } from 'react-router-dom';
import { University } from '../../types/index.js';
import { useSaved } from '../../context/SavedContext.js';
import { useCompare } from '../../context/CompareContext.js';
import { useTranslation } from '../../context/LanguageContext.js';
import {
  MapPin,
  Bookmark,
  Scale,
  ShieldCheck,
  Award,
  ArrowRight,
} from 'lucide-react';

interface UniversityCardProps {
  university: University;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ university }) => {
  const { isUniversitySaved, toggleSaveUniversity } = useSaved();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const { t, formatNumber } = useTranslation();

  const saved = isUniversitySaved(university.id);
  const compared = isInCompare(university.slug);

  const minTuition = university.programs.length > 0
    ? Math.min(...university.programs.map((p) => p.annualTuitionLocal))
    : 0;
  const currency = university.programs[0]?.currencyCode || 'EUR';

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between overflow-hidden relative">
      <div className="p-6">
        {/* Top Badges & Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-900 dark:bg-slate-800 text-white tracking-wide uppercase">
              {(university as any).institutionType
                ? (university as any).institutionType.replace(/_/g, ' ')
                : university.type}
            </span>
            {(university as any).accreditationBody && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/50">
                {(university as any).accreditationBody.split('/')[0].trim()}
              </span>
            )}
            {university.qsRanking && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#FDFBF7] dark:bg-amber-950/20 text-[#8C6D23] dark:text-amber-300 border border-[#E8DCBA] dark:border-amber-800/40 flex items-center gap-1 tabular-nums">
                <Award className="w-3 h-3 text-[#A8862A] dark:text-amber-400" />
                QS #{formatNumber(university.qsRanking)}
              </span>
            )}
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center gap-1 border border-emerald-200/70 dark:border-emerald-800/50">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              {t('common.verified')}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Compare Toggle */}
            <button
              onClick={() => (compared ? removeFromCompare(university.slug) : addToCompare(university.slug))}
              className={`p-1.5 rounded-lg border text-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-600 ${
                compared
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'text-slate-400 hover:text-amber-700 hover:bg-amber-50/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
              title={compared ? t('universities.removeFromCompare') : t('universities.addToCompare')}
              aria-label={compared ? t('universities.removeFromCompare') : t('universities.addToCompare')}
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Save Bookmark */}
            <button
              onClick={() => toggleSaveUniversity(university.id)}
              className={`p-1.5 rounded-lg border text-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-600 ${
                saved
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'text-slate-400 hover:text-teal-700 hover:bg-teal-50/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
              title={saved ? t('universities.saved') : t('universities.save')}
              aria-label={saved ? t('universities.saved') : t('universities.save')}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Location */}
        <Link to={`/universities/${university.slug}`} className="block">
          <h3 className="font-heading font-medium text-lg text-brand-navy dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-snug tracking-tight">
            {university.name}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1.5 font-normal">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {university.cityName}, {university.countryName}
        </p>

        <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
          {university.description}
        </p>

        {/* Featured Programs preview */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2">
            {t('navigation.programs')} ({formatNumber(university.programs.length)})
          </p>
          <div className="space-y-1.5">
            {university.programs.slice(0, 2).map((prog) => (
              <div key={prog.id} className="text-xs flex items-center justify-between text-slate-700 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-100 dark:border-slate-700">
                <span className="font-medium truncate max-w-[200px]">{prog.name}</span>
                <span className="text-[11px] font-semibold text-teal-800 dark:text-teal-300 shrink-0 tabular-nums">
                  {prog.currencyCode} {formatNumber(prog.annualTuitionLocal)}/{t('common.year')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer with link */}
      <div className="bg-[#FAF9F8] dark:bg-slate-800/60 px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t('universities.tuitionRange')}</span>
          <span className="text-sm font-semibold text-brand-navy dark:text-white tabular-nums">
            {currency} {formatNumber(minTuition)} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ {t('common.year')}</span>
          </span>
        </div>

        <Link
          to={`/universities/${university.slug}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 transition-colors"
        >
          <span>{t('universities.viewDetails')}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

