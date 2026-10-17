import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProgramById } from '../services/api.js';
import { ProgramItem, Country, Scholarship } from '../types/index.js';
import { ScholarshipCard } from '../components/common/ScholarshipCard.js';
import {
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  ShieldCheck,
  ExternalLink,
  Coins,
  CheckCircle2,
  ArrowLeft,
  FileCheck,
} from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';

export const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<{
    program: ProgramItem;
    country?: Country;
    scholarships: Scholarship[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProgramById(id)
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading || !data?.program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const { program, country, scholarships } = data;
  const rate = country ? country.exchangeRateToBdt : 1;
  const tuitionInBdt = Math.round(program.annualTuitionLocal * rate);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SeoHead
        title={`${program.name} — ${program.universityName || 'Degree Program'}`}
        description={`Verified syllabus and admission requirements for ${program.name} (${program.degreeLevel}) at ${program.universityName || 'university'}. Annual tuition ${program.annualTuitionLocal} ${program.currencyCode}, IELTS ${program.ieltsOverall}, and intake dates.`}
        canonicalPath={`/courses/${program.id}`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: program.name,
          description: program.prerequisites,
          provider: {
            '@type': 'CollegeOrUniversity',
            name: program.universityName || 'University',
          },
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Courses', href: '/courses' },
            { label: program.name },
          ]}
        />


        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
              {program.degreeLevel} Degree
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {program.subjectCategory}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Syllabus
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-navy leading-tight">
            {program.name}
          </h1>

          <p className="text-sm text-slate-600 mt-2">
            Offered by <Link to={`/universities/${program.universitySlug}`} className="font-bold text-teal-700 hover:underline">{program.universityName}</Link> • {program.cityName}, {program.countryName}
          </p>

          {/* Quick Metrics */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500 block">Annual Tuition</span>
              <p className="text-lg font-extrabold text-brand-navy mt-1">
                {program.currencyCode} {program.annualTuitionLocal.toLocaleString()}
              </p>
              <p className="text-xs font-semibold text-teal-700 mt-0.5">
                ~{tuitionInBdt.toLocaleString()} BDT / year
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500 block">Duration & Credits</span>
              <p className="text-lg font-extrabold text-slate-800 mt-1">
                {program.durationMonths} Months
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {program.creditsEcts} ECTS Credits ({program.language})
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500 block">Upcoming Application Deadline</span>
              <p className="text-lg font-extrabold text-slate-800 mt-1">
                {program.applicationDeadline}
              </p>
              <p className="text-xs text-amber-600 font-semibold mt-0.5">
                {program.intakeSeason}
              </p>
            </div>
          </div>

          {/* Official Button */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={program.programUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-2"
            >
              <span>View Official Curriculum & Modules</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              to={`/calculator`}
              className="px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition-colors"
            >
              Estimate Total Study Budget in BDT
            </Link>
          </div>
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-3">
            <h3 className="font-bold text-lg text-brand-navy flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-teal-600" />
              Academic Prerequisites
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {program.prerequisites}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-3">
            <h3 className="font-bold text-lg text-brand-navy flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              English Language Requirements
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700">
              <p>• <strong>IELTS Academic:</strong> Minimum overall score of <strong>{program.ieltsOverall}</strong> (no individual component below {program.ieltsSubscoreMin}).</p>
              <p>• <strong>TOEFL iBT:</strong> Minimum score of <strong>{program.toeflOverall}</strong>.</p>
              <p>• <strong>PTE Academic:</strong> Minimum score of <strong>{program.pteOverall}</strong>.</p>
            </div>
            <div className="pt-2">
              <Link to="/english-checker" className="text-xs font-bold text-teal-700 hover:underline">
                Evaluate your score with our test checker →
              </Link>
            </div>
          </div>
        </div>

        {/* Scholarships */}
        {scholarships.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold text-brand-navy">
              Eligible Scholarships for this University
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scholarships.map((sch) => (
                <ScholarshipCard key={sch.id} scholarship={sch} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
