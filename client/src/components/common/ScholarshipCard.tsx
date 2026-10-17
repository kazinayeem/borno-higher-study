import React from 'react';
import { Link } from 'react-router-dom';
import { Scholarship } from '../../types/index.js';
import { useSaved } from '../../context/SavedContext.js';
import {
  Award,
  Globe,
  Calendar,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const { isScholarshipSaved, toggleSaveScholarship } = useSaved();
  const saved = isScholarshipSaved(scholarship.id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-teal-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div className="p-6">
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {scholarship.isFullyFunded ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-white shadow-xs">
                🌟 Fully Funded
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                {scholarship.coveragePercent}% Tuition Waiver
              </span>
            )}

            {scholarship.openToBangladesh && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                Open to Bangladesh
              </span>
            )}
          </div>

          <button
            onClick={() => toggleSaveScholarship(scholarship.id)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              saved
                ? 'bg-teal-600 text-white border-teal-600'
                : 'text-slate-400 hover:text-teal-600 hover:bg-teal-50 border-slate-200'
            }`}
            title={saved ? 'Remove from saved' : 'Save scholarship'}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <Link to={`/scholarships/${scholarship.id}`} className="block">
          <h3 className="text-xl font-bold text-brand-navy group-hover:text-teal-600 transition-colors leading-snug">
            {scholarship.name}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 mt-1">
          Offered by: <strong className="text-slate-700">{scholarship.provider}</strong>
        </p>

        <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {scholarship.description}
        </p>

        {/* Key Attributes */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400 block">Host Destination</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              {scholarship.countryName}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block">Application Deadline</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              {scholarship.deadlineText}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="bg-slate-50/80 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/scholarships/${scholarship.id}`}
          className="text-xs font-bold text-teal-700 hover:text-teal-800"
        >
          View Full Eligibility
        </Link>

        <a
          href={scholarship.officialApplicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-navy text-white hover:bg-brand-navy-light transition-colors"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
