import React from 'react';
import { Link } from 'react-router-dom';
import { University } from '../../types/index.js';
import { useSaved } from '../../context/SavedContext.js';
import { useCompare } from '../../context/CompareContext.js';
import {
  MapPin,
  GraduationCap,
  Bookmark,
  Scale,
  ShieldCheck,
  ExternalLink,
  Award,
  ArrowRight,
} from 'lucide-react';

interface UniversityCardProps {
  university: University;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ university }) => {
  const { isUniversitySaved, toggleSaveUniversity } = useSaved();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const saved = isUniversitySaved(university.id);
  const compared = isInCompare(university.slug);

  const minTuition = university.programs.length > 0
    ? Math.min(...university.programs.map((p) => p.annualTuitionLocal))
    : 0;
  const currency = university.programs[0]?.currencyCode || 'EUR';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-teal-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      <div className="p-6">
        {/* Top Badges & Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white">
              {(university as any).institutionType
                ? (university as any).institutionType.replace(/_/g, ' ')
                : university.type}
            </span>
            {(university as any).accreditationBody && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {(university as any).accreditationBody.split('/')[0].trim()}
              </span>
            )}
            {university.qsRanking && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-600" />
                QS #{university.qsRanking}
              </span>
            )}
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1 border border-emerald-200/60">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Verified
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Compare Toggle */}
            <button
              onClick={() => (compared ? removeFromCompare(university.slug) : addToCompare(university.slug))}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                compared
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 border-slate-200'
              }`}
              title={compared ? 'Remove from comparison' : 'Add to compare tray'}
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Save Bookmark */}
            <button
              onClick={() => toggleSaveUniversity(university.id)}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                saved
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'text-slate-400 hover:text-teal-600 hover:bg-teal-50 border-slate-200'
              }`}
              title={saved ? 'Remove from saved' : 'Save university'}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Location */}
        <Link to={`/universities/${university.slug}`} className="block">
          <h3 className="text-xl font-bold text-brand-navy group-hover:text-teal-600 transition-colors leading-snug">
            {university.name}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          {university.cityName}, {university.countryName}
        </p>

        <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {university.description}
        </p>

        {/* Featured Programs preview */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Verified Programs ({university.programs.length})
          </p>
          <div className="space-y-1.5">
            {university.programs.slice(0, 2).map((prog) => (
              <div key={prog.id} className="text-xs flex items-center justify-between text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                <span className="font-medium truncate max-w-[200px]">{prog.name}</span>
                <span className="text-[11px] font-semibold text-teal-700 shrink-0">
                  {prog.currencyCode} {prog.annualTuitionLocal.toLocaleString()}/yr
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer with link */}
      <div className="bg-slate-50/80 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block">Tuition Starting From</span>
          <span className="text-sm font-bold text-brand-navy">
            {currency} {minTuition.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ yr</span>
          </span>
        </div>

        <Link
          to={`/universities/${university.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800"
        >
          <span>View University</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
