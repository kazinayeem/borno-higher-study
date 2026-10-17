import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Compass,
  BarChart3,
  MapPin,
  Bell,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
  ArrowRight,
  Globe2,
  CheckCircle2,
  FileText,
  Clock,
  Building2,
  Users,
  ChevronLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead';
import { getCountryVisaIntelligence } from '../services/api';
import { VisaStatisticsItem, VisaApplicationCentreItem, OfficialSocialUpdateItem, Country } from '../types/index';
import { VisaReportCorrectionModal } from '../components/common/VisaReportCorrectionModal';

export const CountryVisaDetailPage: React.FC = () => {
  const { countryCode } = useParams<{ countryCode: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [statistics, setStatistics] = useState<VisaStatisticsItem[]>([]);
  const [centres, setCentres] = useState<VisaApplicationCentreItem[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [updates, setUpdates] = useState<OfficialSocialUpdateItem[]>([]);
  const [outdatedCount, setOutdatedCount] = useState(0);

  // Reporting modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<{
    targetType: 'STATISTICS' | 'CENTRE' | 'POLICY' | 'INDIA_TRAVEL';
    countryName: string;
    itemTitle?: string;
    statisticsId?: string;
    centreId?: string;
  } | null>(null);

  useEffect(() => {
    if (countryCode) {
      loadCountryData(countryCode);
    }
  }, [countryCode]);

  const loadCountryData = async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCountryVisaIntelligence(code);
      setCountry(res.country);
      setStatistics(res.statistics || []);
      setCentres(res.applicationCentres || []);
      setPolicies(res.policies || []);
      setRules(res.applicantRules || []);
      setUpdates(res.socialUpdates || []);
      setOutdatedCount(res.outdatedSourcesCount || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load country visa intelligence');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading verified visa intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl max-w-md w-full text-center border border-slate-200">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-navy-950">Record Not Found</h2>
          <p className="text-xs text-slate-600 mt-1 mb-4">{error || 'Country visa intelligence record is missing.'}</p>
          <Link
            to="/visa-intelligence"
            className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold"
          >
            Return to Visa Intelligence Hub
          </Link>
        </div>
      </div>
    );
  }

  // Derive Bangladesh specific statistics vs Worldwide
  const bdStats = statistics.find((s) => s.applicantNationality === 'BANGLADESH');
  const wwStats = statistics.find((s) => s.applicantNationality === 'WORLDWIDE_ALL');

  // Derive primary India travel determination from centres or rules
  const primaryCentre = centres[0];
  const mustTravelIndia = primaryCentre?.mustTravelToIndia || 'UNKNOWN';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <SeoHead
        title={`${country.name} Student Visa Intelligence & Bangladesh Requirements | Borno Higher Study`}
        description={`Verified official student visa intelligence for ${country.name}: authentic approval rates for Bangladeshi students, Dhaka/Sylhet application centre details, and India-travel determination.`}
        canonicalPath={`/visa-intelligence/country/${country.code}`}
      />

      {/* Header */}
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-navy-700/50">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/visa-intelligence"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Visa Intelligence Hub</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{country.flagEmoji}</span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {country.name} Student Visa Intelligence
                  </h1>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Official Country Code: <span className="font-mono text-teal-300">{country.code}</span> • Currency: {country.currencyCode}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {country.officialPortalUrl && (
                <a
                  href={country.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span>Government Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {country.visaGuideUrl && (
                <a
                  href={country.visaGuideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span>Immigration Guide</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Freshness / Outdated Warning if applicable */}
        {outdatedCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Freshness Advisory: </span>
              Some data sources for {country.name} were verified more than 180 days ago. While the historical figures remain preserved, an administrator review job has been scheduled to check for newer official publications.
            </div>
          </div>
        )}

        {/* Section 1: Prominent India Travel Determination */}
        <section className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-6 ${
          mustTravelIndia === 'NO'
            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
            : mustTravelIndia === 'YES'
            ? 'bg-red-50/90 border-red-200 text-red-950'
            : 'bg-amber-50/90 border-amber-200 text-amber-950'
        }`}>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Bangladesh Applicant Jurisdiction Determination</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">
                Must the applicant travel to India for {country.name}?
              </h2>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                mustTravelIndia === 'NO'
                  ? 'bg-emerald-600 text-white'
                  : mustTravelIndia === 'YES'
                  ? 'bg-red-600 text-white'
                  : 'bg-amber-500 text-white'
              }`}>
                {mustTravelIndia === 'NO'
                  ? 'NO — Confirmed Local Route in Bangladesh'
                  : mustTravelIndia === 'YES'
                  ? 'YES — Mandatory Travel to New Delhi'
                  : 'POSSIBLY — Conditional on Category & Quotas'}
              </span>
            </div>

            {primaryCentre?.indiaTravelReason && (
              <p className="text-xs sm:text-sm mt-2 leading-relaxed">
                <strong>Legal Rationale: </strong> {primaryCentre.indiaTravelReason}
              </p>
            )}

            {primaryCentre?.officialEmbassyHandling && (
              <p className="text-xs text-slate-600 mt-1">
                Competent Diplomatic Mission: <strong>{primaryCentre.officialEmbassyHandling}</strong> ({primaryCentre.embassyCity})
              </p>
            )}
          </div>

          <button
            onClick={() => {
              setModalTarget({
                targetType: 'INDIA_TRAVEL',
                countryName: country.name,
                itemTitle: `${country.name} India Travel Requirement`,
                centreId: primaryCentre?.id,
              });
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-navy-950 rounded-xl text-xs font-semibold shrink-0 shadow-sm transition-all"
          >
            Report Policy Correction
          </button>
        </section>

        {/* Section 2: Student Visa Statistics Comparison (Bangladesh vs Worldwide) */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Government Certified Outcome Rates</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                Student Visa Statistical Breakdown
              </h2>
            </div>
            <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              Formula: Approved ÷ Decided × 100
            </span>
          </div>

          {statistics.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl">
              <p className="text-sm font-semibold text-slate-600">
                Official statistics not available for this reporting period
              </p>
              <p className="text-xs text-slate-400 mt-1">
                The national immigration service does not publish standalone student visa data for this jurisdiction.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bangladeshi Applicants Card */}
              {bdStats ? (
                <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-teal-600" />
                        <h3 className="font-bold text-sm text-navy-950">Bangladeshi Applicants</h3>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        bdStats.dataStatus === 'OFFICIAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {bdStats.dataStatus}
                      </span>
                    </div>

                    {bdStats.dataStatus === 'UNAVAILABLE' ? (
                      <div className="p-4 bg-white rounded-xl text-center border border-slate-200 text-xs text-slate-600">
                        Official statistics not available for Bangladeshi nationals in this period.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 my-2">
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] uppercase font-bold text-emerald-800">Approval Rate</span>
                          <p className="text-2xl font-black text-emerald-600">{bdStats.approvalRate}%</p>
                          <span className="text-[10px] text-slate-500">{bdStats.applicationsApproved?.toLocaleString()} approved</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] uppercase font-bold text-red-800">Refusal Rate</span>
                          <p className="text-2xl font-black text-red-600">{bdStats.refusalRate}%</p>
                          <span className="text-[10px] text-slate-500">{bdStats.applicationsRefused?.toLocaleString()} refused</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1 text-[11px] text-slate-500">
                      <div className="flex justify-between">
                        <span>Visa Category:</span>
                        <span className="font-medium text-slate-700">{bdStats.visaCategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reporting Period:</span>
                        <span className="font-medium text-slate-700">{bdStats.reportingPeriod} ({bdStats.reportingPeriodType})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Decided:</span>
                        <span className="font-medium text-slate-700">{bdStats.applicationsDecided?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <a
                      href={bdStats.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-teal-600 flex items-center gap-1 text-[11px]"
                    >
                      <span>Source: {bdStats.publisher}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => {
                        setModalTarget({
                          targetType: 'STATISTICS',
                          countryName: country.name,
                          itemTitle: `${country.name} Bangladesh Statistics`,
                          statisticsId: bdStats.id,
                        });
                        setModalOpen(true);
                      }}
                      className="text-[11px] text-slate-400 hover:text-amber-600"
                    >
                      Report error
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center flex flex-col justify-center">
                  <p className="text-xs font-semibold text-slate-600">
                    Official statistics not available for this reporting period
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    No discrete Bangladesh applicant records released by {country.name} immigration.
                  </p>
                </div>
              )}

              {/* Worldwide Applicants Card */}
              {wwStats ? (
                <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Globe2 className="w-4 h-4 text-blue-600" />
                        <h3 className="font-bold text-sm text-navy-950">Worldwide / Global Total</h3>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {wwStats.dataStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-2">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-emerald-800">Global Approval</span>
                        <p className="text-2xl font-black text-emerald-600">{wwStats.approvalRate}%</p>
                        <span className="text-[10px] text-slate-500">{wwStats.applicationsApproved?.toLocaleString()} approved</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-red-800">Global Refusal</span>
                        <p className="text-2xl font-black text-red-600">{wwStats.refusalRate}%</p>
                        <span className="text-[10px] text-slate-500">{wwStats.applicationsRefused?.toLocaleString()} refused</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1 text-[11px] text-slate-500">
                      <div className="flex justify-between">
                        <span>Visa Category:</span>
                        <span className="font-medium text-slate-700">{wwStats.visaCategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reporting Period:</span>
                        <span className="font-medium text-slate-700">{wwStats.reportingPeriod} ({wwStats.reportingPeriodType})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Decided:</span>
                        <span className="font-medium text-slate-700">{wwStats.applicationsDecided?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <a
                      href={wwStats.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-teal-600 flex items-center gap-1 text-[11px]"
                    >
                      <span>Source: {wwStats.publisher}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => {
                        setModalTarget({
                          targetType: 'STATISTICS',
                          countryName: country.name,
                          itemTitle: `${country.name} Worldwide Statistics`,
                          statisticsId: wwStats.id,
                        });
                        setModalOpen(true);
                      }}
                      className="text-[11px] text-slate-400 hover:text-amber-600"
                    >
                      Report error
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center flex flex-col justify-center">
                  <p className="text-xs font-semibold text-slate-600">
                    Official worldwide statistics not available
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Section 3: Application Centres Handling This Country */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-navy-950 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              <span>Application Centres &amp; Biometrics Facilities</span>
            </h2>
            <Link
              to="/visa-application-centres"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              Compare all centres →
            </Link>
          </div>

          {centres.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
              <p className="text-xs text-slate-500">No application centres currently registered for this country.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {centres.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-navy-950">{c.centreName}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.address}, {c.city}, {c.country}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      {c.serviceProvider}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl">
                    <div>• Appointment: <strong>{c.requiresAppointment ? 'Required' : 'Walk-in'}</strong></div>
                    <div>• Biometrics: <strong>{c.requiresBiometrics ? 'Mandatory' : 'Exempt'}</strong></div>
                    <div>• Interview: <strong>{c.requiresInterview ? 'Yes' : 'No'}</strong></div>
                    <div>• In-Person Passport: <strong>{c.inPersonPassportSubmission ? 'Yes' : 'No'}</strong></div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    {c.appointmentUrl ? (
                      <a
                        href={c.appointmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 text-[11px]"
                      >
                        <span>Book Appointment Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Appointment via Mission</span>
                    )}

                    <button
                      onClick={() => {
                        setModalTarget({
                          targetType: 'CENTRE',
                          countryName: country.name,
                          itemTitle: c.centreName,
                          centreId: c.id,
                        });
                        setModalOpen(true);
                      }}
                      className="text-[11px] text-slate-400 hover:text-amber-600"
                    >
                      Report issue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 4: Official Social Updates for This Country */}
        {updates.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-navy-950 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Official Diplomatic Announcements</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {updates.map((u) => (
                <div key={u.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {u.platform} • {u.topic}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(u.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-navy-950">{u.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{u.summary}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">{u.publisher}</span>
                    <a
                      href={u.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                    >
                      <span>Read bulletin</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Report Modal */}
      {modalTarget && (
        <VisaReportCorrectionModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setModalTarget(null);
          }}
          targetType={modalTarget.targetType}
          countryName={modalTarget.countryName}
          itemTitle={modalTarget.itemTitle}
          statisticsId={modalTarget.statisticsId}
          centreId={modalTarget.centreId}
        />
      )}
    </div>
  );
};
