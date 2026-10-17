import React from 'react';
import { EnglishCoachingCenter } from '../../types/index.js';
import {
  MapPin,
  Clock,
  Coins,
  CheckCircle2,
  Phone,
  Globe,
  ExternalLink,
  ShieldCheck,
  Star,
  Users,
  Laptop,
} from 'lucide-react';

interface CoachingCenterCardProps {
  center: EnglishCoachingCenter;
}

export const CoachingCenterCard: React.FC<CoachingCenterCardProps> = ({ center }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-300 p-5 sm:p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Header & Verification */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60">
                <MapPin className="w-3 h-3 text-teal-600" />
                {center.city} • {center.area}
              </span>
              {center.modes.map((mode) => (
                <span
                  key={mode}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                >
                  <Laptop className="w-3 h-3 text-slate-500" />
                  {mode.charAt(0) + mode.slice(1).toLowerCase()}
                </span>
              ))}
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
              {center.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{center.address}</p>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{center.rating}</span>
            <span className="text-[10px] text-slate-400 font-normal">({center.reviewCount})</span>
          </div>
        </div>

        {/* Exams Offered Badges */}
        <div>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
            Tests Prepared
          </p>
          <div className="flex flex-wrap gap-1.5">
            {center.testsOffered.map((test) => (
              <span
                key={test}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-white tracking-wide"
              >
                {test === 'SPOKEN_ENGLISH' ? 'Spoken English' : test}
              </span>
            ))}
          </div>
        </div>

        {/* Key Metrics: Duration & Verified Fee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-2.5 border-y border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Course Duration</p>
              <p className="font-semibold text-slate-800 mt-0.5 leading-snug">{center.courseDuration}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Coins className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Verified Fee</p>
              <p className="font-bold text-teal-800 mt-0.5 leading-snug">{center.feeRange}</p>
            </div>
          </div>
        </div>

        {/* Practice Facilities / Highlights */}
        <div>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
            Practice Facilities & Features
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {center.features.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Authorized Student Review Snippet */}
        {center.studentReviewSnippet && (
          <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 italic border border-slate-100 flex items-start gap-2">
            <span className="text-teal-600 font-heading font-bold text-lg leading-none">“</span>
            <p className="leading-snug not-italic text-slate-600">
              {center.studentReviewSnippet}
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions & Contact Details */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified: {center.lastVerifiedAt}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={`tel:${center.contactPhone}`}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-slate-600" />
            <span>Call</span>
          </a>

          {center.websiteUrl && (
            <a
              href={center.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-teal-700 transition-colors shadow-xs"
            >
              <span>Visit Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
