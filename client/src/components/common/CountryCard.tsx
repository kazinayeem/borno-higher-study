import React from 'react';
import { Link } from 'react-router-dom';
import { Country } from '../../types/index.js';
import { MapPin, Coins, ArrowRight, GraduationCap } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext.js';

interface CountryCardProps {
  country: Country;
}

export const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  const { t, formatNumber } = useTranslation();

  return (
    <Link
      to={`/countries/${country.slug}`}
      className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col overflow-hidden"
    >
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl transition-transform group-hover:scale-105">
              {country.flagEmoji}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/40 group-hover:text-teal-800 dark:group-hover:text-teal-300 transition-colors tracking-wide">
              {country.code}
            </span>
          </div>

          <h3 className="font-heading font-medium text-lg text-brand-navy dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors tracking-tight">
            {country.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 font-normal">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {t('universities.city')}: {country.capitalCity}
          </p>

          <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
            {country.overview}
          </p>
        </div>

        {/* Financial & Visa Highlights */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-slate-400" />
              {t('visa.monthlyLivingCost')}:
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200 tabular-nums">
              ~{country.currencySymbol}{formatNumber(country.avgLivingCostMonthly)}/{t('common.month')}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              {t('universities.tuitionRange')}:
            </span>
            <span className="font-medium text-teal-800 dark:text-teal-300 tabular-nums">
              {country.currencySymbol}{formatNumber(country.avgTuitionMin)} – {formatNumber(country.avgTuitionMax)}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="bg-[#FAF9F8] dark:bg-slate-800/60 px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-teal-700 dark:text-teal-400 group-hover:text-teal-900 dark:group-hover:text-teal-300 transition-colors">
        <span>{t('universities.explorePrograms')}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
};

