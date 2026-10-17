import React from 'react';
import { PracticeResource } from '../../types/index.js';
import {
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';

interface PracticeResourceCardProps {
  resource: PracticeResource;
}

export const PracticeResourceCard: React.FC<PracticeResourceCardProps> = ({ resource }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-300 p-5 sm:p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                {resource.badgeText}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                {resource.examType}
              </span>
              {resource.accountRequired ? (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Free Account Required
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  No Account Needed
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
              {resource.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Provided by {resource.provider}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          {resource.description}
        </p>

        {/* Skills Covered Pills */}
        <div>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
            Skills Tested & Practiced
          </p>
          <div className="flex flex-wrap gap-1.5">
            {resource.skillsCovered.map((skill) => (
              <span
                key={skill}
                className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Free Features Checklist */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2">
          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            100% Free Resources Included:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {resource.freeFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Optional Paid Tiers Note */}
        {resource.paidFeatures && resource.paidFeatures.length > 0 && (
          <div className="text-[11px] text-slate-500 flex items-start gap-1.5 bg-white p-2 rounded-lg border border-slate-100">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700">Optional Paid Features: </span>
              {resource.paidFeatures.join(' • ')}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400 font-medium">
          Official External Portal
        </span>

        <a
          href={resource.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-xs"
        >
          <span>Open Official Practice</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
