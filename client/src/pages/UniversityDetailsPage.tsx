import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUniversityBySlug } from '../services/api.js';
import { University, Country, Scholarship } from '../types/index.js';
import { ScholarshipCard } from '../components/common/ScholarshipCard.js';
import { useSaved } from '../context/SavedContext.js';
import { useCompare } from '../context/CompareContext.js';
import {
  MapPin,
  Globe,
  Award,
  ShieldCheck,
  Bookmark,
  Scale,
  ExternalLink,
  Mail,
  GraduationCap,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';

export const UniversityDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<{
    university: University;
    country?: Country;
    scholarships: Scholarship[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const { isUniversitySaved, toggleSaveUniversity } = useSaved();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getUniversityBySlug(slug)
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug]);

  if (loading || !data?.university) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const { university, country, scholarships } = data;
  const isSaved = isUniversitySaved(university.id);
  const isCompared = isInCompare(university.slug);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SeoHead
        title={`${university.name} — Programs, Tuition Fees & Admissions`}
        description={`Explore verified degrees, annual tuition fees, English test requirements, and official international admissions for ${university.name} in ${university.cityName}, ${university.countryName}.`}
        canonicalPath={`/universities/${university.slug}`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollegeOrUniversity',
          name: university.name,
          url: university.websiteUrl,
          address: {
            '@type': 'PostalAddress',
            addressLocality: university.cityName,
            addressCountry: university.countryName,
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Universities', href: '/universities' },
            { label: university.name },
          ]}
        />


        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {university.type} Institution
                </span>
                {university.qsRanking && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    QS World Ranking: #{university.qsRanking}
                  </span>
                )}
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Record
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
                {university.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {university.cityName}, {university.countryName}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  {university.internationalOfficeEmail}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => (isCompared ? removeFromCompare(university.slug) : addToCompare(university.slug))}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isCompared
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-slate-700 hover:bg-amber-50 border-slate-200'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>{isCompared ? 'In Compare Tray' : 'Compare University'}</span>
              </button>

              <button
                onClick={() => toggleSaveUniversity(university.id)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isSaved
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-slate-700 hover:bg-teal-50 border-slate-200'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isSaved ? 'Saved to Bookmarks' : 'Save Bookmark'}</span>
              </button>

              <a
                href={university.admissionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <span>Official Admissions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="mt-6 text-sm text-slate-700 leading-relaxed max-w-4xl">
            {university.description}
          </div>

          {/* Campuses & Country Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <strong className="text-slate-800">Campuses:</strong>
              <span className="text-slate-600">{university.campuses.join(' • ')}</span>
            </div>

            {country && (
              <Link
                to={`/countries/${country.slug}`}
                className="font-bold text-teal-700 hover:underline flex items-center gap-1"
              >
                <span>Explore student living guide for {country.name}</span>
                <span>→</span>
              </Link>
            )}
          </div>
        </div>

        {/* Verified Course Catalog */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">
                Verified Degree Programs ({university.programs.length})
              </h2>
              <p className="text-xs text-slate-500">
                Official curriculum requirements, English criteria, and tuition figures
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {university.programs.map((prog) => (
              <div
                key={prog.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                      {prog.degreeLevel} • {prog.subject}
                    </span>
                    <span className="text-xs text-slate-500">
                      {prog.durationMonths} Months ({prog.creditsEcts} ECTS)
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-navy">{prog.name}</h3>

                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <p>
                      <strong className="text-slate-800">Prerequisites:</strong> {prog.prerequisites}
                    </p>
                    <p>
                      <strong className="text-slate-800">English Standard:</strong> IELTS {prog.ieltsOverall} (subscores {prog.ieltsSubscoreMin}) • TOEFL {prog.toeflOverall} • PTE {prog.pteOverall}
                    </p>
                    <p>
                      <strong className="text-slate-800">Application Deadline:</strong> {prog.applicationDeadline} ({prog.intakeSeason})
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Annual Tuition</span>
                    <span className="font-extrabold text-brand-navy text-sm">
                      {prog.currencyCode} {prog.annualTuitionLocal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/calculator`}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Calculate in BDT
                    </Link>
                    <a
                      href={prog.programUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold inline-flex items-center gap-1"
                    >
                      <span>Curriculum</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Scholarships */}
        {scholarships.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold text-brand-navy">
              Available Scholarships & Tuition Waivers ({scholarships.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scholarships.map((sch) => (
                <ScholarshipCard key={sch.id} scholarship={sch} />
              ))}
            </div>
          </div>
        )}

        {/* Verification Footer */}
        <div className="pt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Information authenticated against official institutional sources on: {new Date(university.lastVerifiedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
