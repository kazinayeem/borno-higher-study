import React from 'react';
import { Link } from 'react-router-dom';
import { Scholarship } from '../../types/index.js';
import { useSaved } from '../../context/SavedContext.js';
import { useTranslation } from '../../context/LanguageContext.js';
import {
  Globe,
  Calendar,
  Bookmark,
  ExternalLink,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const { isScholarshipSaved, toggleSaveScholarship } = useSaved();
  const { t, formatNumber } = useTranslation();
  const saved = isScholarshipSaved(scholarship.id);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div className="p-6">
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {scholarship.isFullyFunded ? (
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded bg-[#FDFBF7] dark:bg-amber-950/20 text-[#8C6D23] dark:text-amber-300 border border-[#E8DCBA] dark:border-amber-800/40 tracking-wide">
                {t('scholarships.fullyFunded')}
              </span>
            ) : (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/50 tabular-nums">
                {formatNumber(scholarship.coveragePercent)}% {t('scholarships.tuitionWaiver')}
              </span>
            )}

            {scholarship.openToBangladesh && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/50 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                {t('scholarships.openToBangladesh')}
              </span>
            )}
          </div>

          <button
            onClick={() => toggleSaveScholarship(scholarship.id)}
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

        {/* Title */}
        <Link to={`/scholarships/${scholarship.id}`} className="block">
          <h3 className="font-heading font-medium text-lg text-brand-navy dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors leading-snug tracking-tight">
            {scholarship.name}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">
          {t('scholarships.provider')}: <strong className="text-slate-700 dark:text-slate-200 font-medium">{scholarship.provider}</strong>
        </p>

        <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
          {scholarship.description}
        </p>

        {/* Key Attributes */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400 dark:text-slate-400 block text-[11px]">{t('scholarships.hostCountry')}</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
              <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              {scholarship.countryName}
            </span>
          </div>

          <div>
            <span className="text-slate-400 dark:text-slate-400 block text-[11px]">{t('scholarships.deadline')}</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {scholarship.deadlineText}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="bg-[#FAF9F8] dark:bg-slate-800/60 px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Link
          to={`/scholarships/${scholarship.id}`}
          className="text-xs font-medium text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 transition-colors inline-flex items-center gap-1"
        >
          <span>{t('universities.viewDetails')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {scholarship.officialApplicationUrl && (
          <a
            href={scholarship.officialApplicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-[#0B192C] dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            <span>{t('common.officialCatalog')}</span>
            <ExternalLink className="w-3 h-3 text-teal-400" />
          </a>
        )}
      </div>
    </div>
  );
};

