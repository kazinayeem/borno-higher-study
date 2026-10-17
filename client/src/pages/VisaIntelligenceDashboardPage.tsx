import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Sparkles,
  Plane,
  Building
} from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead';
import { getVisaStatistics, getVisaUpdates, searchVisaIntelligence } from '../services/api';
import { VisaStatisticsItem, OfficialSocialUpdateItem } from '../types/index';
import { VisaReportCorrectionModal } from '../components/common/VisaReportCorrectionModal';

export const VisaIntelligenceDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<VisaStatisticsItem[]>([]);
  const [updates, setUpdates] = useState<OfficialSocialUpdateItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Live search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<string>('ALL');
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Reporting correction modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<{
    targetType: 'STATISTICS' | 'CENTRE' | 'POLICY' | 'INDIA_TRAVEL';
    countryName: string;
    itemTitle?: string;
    statisticsId?: string;
  } | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, updatesRes] = await Promise.all([
        getVisaStatistics({ limit: 8, applicantNationality: 'BANGLADESH' }),
        getVisaUpdates({ limit: 4 }),
      ]);
      setStats(statsRes.statistics || []);
      setUpdates(updatesRes.updates || []);
    } catch (err) {
      console.error('Error loading visa dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      setIsSearching(true);
      setSearchError(null);
      const categoryParam = searchCategory === 'ALL' ? undefined : searchCategory;
      const res = await searchVisaIntelligence(searchQuery.trim(), categoryParam);
      setSearchResults(res.results || []);
    } catch (err: any) {
      setSearchError(err.message || 'Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-slate-800">
      <SeoHead
        title="Student Visa Intelligence & Bangladesh Centre Finder — Borno Higher Study"
        description="Comprehensive official student visa intelligence for Bangladeshi students: authentic approval rates, Home Office & State Dept statistics, Bangladesh VFS & Embassy finder, India-travel requirements, and official embassy announcements."
        canonicalPath="/visa-intelligence"
      />

      {/* Hero Section */}
      <section className="bg-[#0B192C] text-white pt-14 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-teal-400 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>Official Government Intelligence • Updated 2024–2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold tracking-tight text-white max-w-4xl leading-tight">
            Global Visa Intelligence &amp; Bangladesh Application Centre Finder
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Authentic international student visa statistics published by national immigration departments, verified local submission locations in Dhaka &amp; Sylhet, and clear determination of whether you must travel to India.
          </p>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <Link
              to="/visa-statistics"
              className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-teal-500 rounded-xl p-5 transition-all duration-200 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-slate-700 text-teal-300 rounded-lg">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-300 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-base font-bold text-white mt-3">Country-by-Country Statistics</h3>
              <p className="text-xs text-slate-300 mt-1">
                Official approval &amp; refusal rates strictly segmented by applicant nationality and reporting period.
              </p>
            </Link>

            <Link
              to="/visa-application-centres"
              className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 rounded-xl p-5 transition-all duration-200 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-slate-700 text-amber-300 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-base font-bold text-white mt-3">Bangladesh Application Centre Finder</h3>
              <p className="text-xs text-slate-300 mt-1">
                Dhaka &amp; Sylhet VFS centres, embassy jurisdictions, and definitive &quot;Must travel to India?&quot; verification.
              </p>
            </Link>

            <Link
              to="/visa-updates"
              className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-teal-400 rounded-xl p-5 transition-all duration-200 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-slate-700 text-teal-300 rounded-lg">
                  <Bell className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-300 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-base font-bold text-white mt-3">Consular Policy &amp; Social Feeds</h3>
              <p className="text-xs text-slate-300 mt-1">
                Verified announcements from official immigration Twitter/X feeds and consular bulletins.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Live Search Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                <Search className="w-3.5 h-3.5" />
                <span>Live Government &amp; Policy Search</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                Search Official Visa Rules &amp; Directives
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Query latest refusal rates, financial thresholds, MOI waivers, biometric mandates, and university policy changes.
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. UK student visa refusal rate Bangladesh, Germany blocked account, Sweden biometrics Dhaka..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ALL">All Categories</option>
                <option value="STATISTICS">Statistics &amp; Rates</option>
                <option value="POLICY">Visa Policies</option>
                <option value="FINANCIAL">Financial &amp; Funds</option>
                <option value="CENTRE">Centres &amp; Biometrics</option>
              </select>

              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-sm font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-slate-500 pt-1">
              <span className="font-medium text-slate-700">Popular queries:</span>
              <button
                type="button"
                onClick={() => setSearchQuery('UK student visa refusal rate Bangladesh')}
                className="hover:text-teal-600 hover:underline"
              >
                UK refusal rate BD
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchQuery('Germany student visa appointment Dhaka')}
                className="hover:text-teal-600 hover:underline"
              >
                Germany wait time Dhaka
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchQuery('Lithuania student visa India travel')}
                className="hover:text-teal-600 hover:underline"
              >
                Lithuania India travel
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchQuery('Canada study permit financial requirements 2024')}
                className="hover:text-teal-600 hover:underline"
              >
                Canada GIC funds
              </button>
            </div>
          </form>

          {/* Search Results Display */}
          {searchError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{searchError}</span>
            </div>
          )}

          {searchResults !== null && (
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Found {searchResults.length} verified search results</span>
                <span className="text-[11px] bg-slate-100 px-2.5 py-1 rounded-full">
                  Official domains prioritized • Rate limited
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl">
                  <p className="text-sm font-medium text-slate-600">No matching official records found.</p>
                  <p className="text-xs text-slate-400 mt-1">Try broadening your keywords or select another category filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-2xl transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.isOfficialDomain
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {item.isOfficialDomain ? 'Official Government Domain' : 'Verified Publisher'}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">{item.domain}</span>
                        </div>
                        <h4 className="text-sm font-bold text-navy-950 hover:text-teal-600 transition-colors">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1">
                            <span>{item.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                          </a>
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                          {item.snippet}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/60 text-[11px] text-slate-500">
                        <span>Publisher: {item.publisher}</span>
                        {item.destinationCountryCode && (
                          <Link
                            to={`/visa-intelligence/country/${item.destinationCountryCode}`}
                            className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
                          >
                            View country profile →
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Disclaimer / Neutrality Banner */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-950 space-y-1">
            <p className="font-bold">
              Neutral Statistical Presentation &amp; Official Calculation Bases
            </p>
            <p className="text-amber-900 leading-relaxed">
              Borno Higher Study presents official government statistics with strict mathematical compatibility (Approval Rate = Approved ÷ Decided × 100). We strictly avoid subjective classifications such as &quot;easy visa&quot; or &quot;guaranteed visa&quot; destinations. Past approval rates represent macroeconomic volume and do not predict an individual applicant&apos;s outcome.
            </p>
          </div>
        </div>

        {/* Featured Country Visa Rates for Bangladeshi Students */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Bangladeshi Applicant Rates</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                Official Student Visa Approval Rates
              </h2>
            </div>
            <Link
              to="/visa-statistics"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              <span>Explore all countries &amp; worldwide rates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-44 bg-slate-200/60 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Country & Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-bold text-base text-navy-950">
                          <Link
                            to={`/visa-intelligence/country/${s.countryCode}`}
                            className="hover:text-teal-600 transition-colors"
                          >
                            {s.countryName}
                          </Link>
                        </h3>
                        <p className="text-[11px] text-slate-500">{s.visaCategory}</p>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.dataStatus === 'OFFICIAL'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.dataStatus === 'UNAVAILABLE'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.dataStatus}
                      </span>
                    </div>

                    {/* Stats Rates Display */}
                    {s.dataStatus === 'UNAVAILABLE' ? (
                      <div className="my-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                        <p className="text-xs font-semibold text-slate-600">
                          Official statistics not available for this reporting period
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Government does not publish nationality-level breakdown.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 my-3">
                        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                          <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Approval Rate</span>
                          <p className="text-2xl font-black text-emerald-700 mt-0.5">
                            {s.approvalRate !== null ? `${s.approvalRate}%` : 'N/A'}
                          </p>
                          <span className="text-[10px] text-emerald-800/80">
                            {s.applicationsApproved?.toLocaleString() || 0} approved
                          </span>
                        </div>

                        <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl">
                          <span className="text-[10px] uppercase font-bold text-red-800 tracking-wider">Refusal Rate</span>
                          <p className="text-2xl font-black text-red-700 mt-0.5">
                            {s.refusalRate !== null ? `${s.refusalRate}%` : 'N/A'}
                          </p>
                          <span className="text-[10px] text-red-800/80">
                            {s.applicationsRefused?.toLocaleString() || 0} refused
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Metadata summary */}
                    <div className="space-y-1 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <div className="flex justify-between">
                        <span>Reporting Period:</span>
                        <span className="font-medium text-slate-700">{s.reportingPeriod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Decided Volume:</span>
                        <span className="font-medium text-slate-700">
                          {s.applicationsDecided ? s.applicationsDecided.toLocaleString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <a
                      href={s.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-teal-600 flex items-center gap-1 text-[11px]"
                    >
                      <span>{s.publisher}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setModalTarget({
                            targetType: 'STATISTICS',
                            countryName: s.countryName,
                            itemTitle: `${s.countryName} Student Visa Statistics`,
                            statisticsId: s.id,
                          });
                          setModalOpen(true);
                        }}
                        className="text-[11px] text-slate-400 hover:text-amber-600 transition-colors"
                      >
                        Report error
                      </button>
                      <Link
                        to={`/visa-intelligence/country/${s.countryCode}`}
                        className="font-semibold text-teal-600 hover:text-teal-700"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bangladesh Application Centres & India-Travel Preview */}
        <section className="bg-gradient-to-r from-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>Bangladesh Application Centre &amp; Jurisdiction Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Must You Travel to India for Your Student Visa?
            </h2>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Don&apos;t rely on rumors. We clarify whether biometrics, interviews, and passport submissions can be completed in Dhaka &amp; Sylhet (e.g., UK, USA, Canada, Germany, Sweden) or if official diplomatic policies require attendance in New Delhi (e.g., Lithuania, Portugal).
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/visa-application-centres"
                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold rounded-xl text-xs sm:text-sm transition-all"
              >
                Launch Centre &amp; India Travel Finder
              </Link>
              <Link
                to="/visa-application-centres"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all border border-white/10"
              >
                View All Bangladesh Centres
              </Link>
            </div>
          </div>
        </section>

        {/* Latest Verified Social Updates */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
                <Bell className="w-3.5 h-3.5" />
                <span>Official Embassy Bulletins</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
                Authorized Diplomatic &amp; Visa Updates
              </h2>
            </div>
            <Link
              to="/visa-updates"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              <span>View all updates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {updates.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {u.platform} • {u.topic}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(u.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-navy-950 mb-1.5">
                    {u.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {u.summary}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{u.publisher}</span>
                  </div>
                  <a
                    href={u.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 text-[11px]"
                  >
                    <span>Read official post</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Report Correction Modal */}
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
        />
      )}
    </div>
  );
};
