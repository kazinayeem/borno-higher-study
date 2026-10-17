import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData.js';
import { Scholarship } from '../types/index.js';
import {
  Award,
  Globe,
  Calendar,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Coins,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';

export const ScholarshipDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);

  useEffect(() => {
    if (id) {
      const found = SCHOLARSHIPS_DATA.find((s) => s.id === id);
      if (found) setScholarship(found as any);
    }
  }, [id]);

  if (!scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-semibold">Scholarship record not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SeoHead
        title={`${scholarship.name} — Eligibility, Coverage & Application`}
        description={`Comprehensive details for ${scholarship.name} offered by ${scholarship.provider}. Covers ${scholarship.isFullyFunded ? '100% tuition and living expenses' : `${scholarship.coveragePercent}% tuition`}. Application deadlines and official portal.`}
        canonicalPath={`/scholarships/${scholarship.id}`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'FinancialAid',
          name: scholarship.name,
          description: scholarship.description,
          provider: {
            '@type': 'Organization',
            name: scholarship.provider,
          },
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Scholarships', href: '/scholarships' },
            { label: scholarship.name },
          ]}
        />


        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-8 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {scholarship.isFullyFunded ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-white shadow-xs">
                🌟 Fully Funded Award
              </span>
            ) : (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                {scholarship.coveragePercent}% Tuition Coverage
              </span>
            )}
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {scholarship.type.replace('_', ' ')}
            </span>
            {scholarship.openToBangladesh && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Open to Bangladesh
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-navy leading-tight">
            {scholarship.name}
          </h1>

          <p className="text-sm text-slate-600">
            Offered by <strong className="text-slate-800">{scholarship.provider}</strong> • Destination: <strong className="text-slate-800">{scholarship.countryName}</strong>
          </p>

          <p className="text-sm text-slate-700 leading-relaxed">
            {scholarship.description}
          </p>

          {/* Funding Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500 block">Tuition Coverage</span>
              <p className="text-lg font-bold text-teal-700 mt-1">
                {scholarship.coveragePercent}%
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {scholarship.coveragePercent === 100 ? '100% Tuition Exemption' : 'Partial Tuition Waiver'}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500 block">Monthly Living Stipend</span>
              <p className="text-lg font-bold text-slate-800 mt-1">
                {scholarship.stipendMonthlyLocal > 0
                  ? `${scholarship.currencyCode} ${scholarship.stipendMonthlyLocal.toLocaleString()}/mo`
                  : 'Tuition-only'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Direct living allowance</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500 block">Application Deadline</span>
              <p className="text-sm font-bold text-slate-800 mt-1">
                {scholarship.deadlineText}
              </p>
              <p className="text-xs text-amber-600 font-semibold mt-0.5">Annual cycle</p>
            </div>
          </div>

          {/* Official Button */}
          <div className="pt-2">
            <a
              href={scholarship.officialApplicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
            >
              <span>Apply via Official Scholarship Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Eligibility Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-3">
            <h3 className="font-bold text-lg text-brand-navy flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              Academic Criteria & Eligibility
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {scholarship.academicRequirements}
            </p>
            <div className="pt-2 text-xs text-slate-500">
              <strong>Eligible Degree Levels:</strong> {scholarship.degreeLevels.join(', ')}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-3">
            <h3 className="font-bold text-lg text-brand-navy flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              Language & Nationality Criteria
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {scholarship.languageRequirements}
            </p>
            <div className="pt-2 text-xs text-slate-500">
              <strong>Eligible Nationalities:</strong> {scholarship.eligibleNationalities.join(', ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
