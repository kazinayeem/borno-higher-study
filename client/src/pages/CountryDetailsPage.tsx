import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCountryBySlug } from '../services/api.js';
import { Country, University, Scholarship } from '../types/index.js';
import { UniversityCard } from '../components/common/UniversityCard.js';
import { ScholarshipCard } from '../components/common/ScholarshipCard.js';
import {
  MapPin,
  Coins,
  GraduationCap,
  Calendar,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  ArrowLeft,
} from 'lucide-react';

import { SeoHead } from '../components/common/SeoHead.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';
import { COUNTRIES_DATA } from '../data/countriesData.js';

export const CountryDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<{
    country: Country;
    universities: University[];
    scholarships: Scholarship[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getCountryBySlug(slug)
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug]);

  if (loading || !data?.country) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const { country, universities, scholarships } = data;
  const livingCostBdt = Math.round(country.avgLivingCostMonthly * country.exchangeRateToBdt);
  const relatedCountries = COUNTRIES_DATA.filter((c) => c.continent === country.continent && c.slug !== country.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <SeoHead
        title={`Study in ${country.name} — Universities, Tuition & Living Costs`}
        description={`Comprehensive guide to higher education in ${country.name}. Discover recognized universities, tuition fees in ${country.currencyCode} & BDT, post-study work visa rights, and scholarships.`}
        canonicalPath={`/countries/${country.slug}`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Country',
          name: country.name,
          description: country.overview,
          currenciesAccepted: country.currencyCode,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Countries', href: '/countries' },
            { label: country.name },
          ]}
        />


        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-8 sm:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-6xl filter drop-shadow-sm">{country.flagEmoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
                    Study in {country.name}
                  </h1>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                    {country.currencyCode} ({country.currencySymbol})
                  </span>
                </div>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Capital: <strong>{country.capitalCity}</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>Major Student Hubs: {country.majorCities.join(', ')}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={country.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-bold hover:bg-brand-navy-light transition-colors"
              >
                <span>Official National Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={country.visaGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors"
              >
                <span>Government Visa Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Overview text */}
          <div className="mt-6 text-sm text-slate-700 leading-relaxed max-w-4xl">
            {country.overview}
          </div>

          {/* Key Metric Blocks */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-500" />
                Monthly Living Costs
              </span>
              <p className="text-lg font-bold text-slate-800 mt-1">
                ~{country.currencySymbol}{country.avgLivingCostMonthly}
              </p>
              <p className="text-xs text-teal-700 font-semibold mt-0.5">
                ~{livingCostBdt.toLocaleString()} BDT / month
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                Annual Tuition Band
              </span>
              <p className="text-lg font-bold text-slate-800 mt-1">
                {country.currencySymbol}{country.avgTuitionMin.toLocaleString()} – {country.avgTuitionMax.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Varies by program</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-600" />
                Typical Application Window
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-1 leading-snug">
                {country.applicationPeriod}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Post-Study Work Visa
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-1 leading-snug">
                {country.postStudyWorkVisa}
              </p>
            </div>
          </div>
        </div>

        {/* Admission & English Criteria Detail Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-3">
            <h3 className="font-bold text-lg text-brand-navy flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              General Admission Requirements
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {country.generalAdmissionReqs}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-3">
            <h3 className="font-bold text-lg text-brand-navy flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              English Proficiency Expectation
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {country.englishReqSummary}
            </p>
            <div className="pt-2">
              <Link
                to="/english-checker"
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                Test your score with our English Eligibility Checker →
              </Link>
            </div>
          </div>
        </div>

        {/* Verified Universities in this Country */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-brand-navy">
              Universities in {country.name} ({universities.length})
            </h2>
            <span className="text-xs text-slate-500">Verified official records</span>
          </div>

          {universities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {universities.map((uni) => (
                <UniversityCard key={uni.id} university={uni} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <p className="text-sm text-slate-600">
                Additional universities in {country.name} are currently in the verification queue.
              </p>
            </div>
          )}
        </div>

        {/* Scholarships in this Country */}
        {scholarships.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold text-brand-navy">
              Scholarships & Funding for {country.name} ({scholarships.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scholarships.map((sch) => (
                <ScholarshipCard key={sch.id} scholarship={sch} />
              ))}
            </div>
          </div>
        )}

        {/* Verification Timestamp */}
        <div className="pt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Last verified against official ministry records: {new Date(country.lastVerifiedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
