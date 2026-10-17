import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  Globe,
  GraduationCap,
  Info,
  HelpCircle,
  Flag,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { getMoiPolicies, getCountries } from '../services/api';
import { SeoHead } from '../components/common/SeoHead';
import { MoiReportCorrectionModal } from '../components/common/MoiReportCorrectionModal';

export const MoiDirectoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Filters
  const [country, setCountry] = useState(searchParams.get('country') || 'ALL');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [qualificationLevel, setQualificationLevel] = useState(searchParams.get('qualificationLevel') || 'ALL');
  const [acceptanceStatus, setAcceptanceStatus] = useState(searchParams.get('acceptanceStatus') || 'ALL');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [stats, setStats] = useState<any>({});
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedPolicyForModal, setSelectedPolicyForModal] = useState<any | null>(null);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    loadPolicies();
  }, [country, qualificationLevel, acceptanceStatus, page]);

  const loadCountries = async () => {
    try {
      const res = await getCountries();
      setCountries(res.countries || []);
    } catch {
      // Fallback
    }
  };

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const res = await getMoiPolicies({
        country: country !== 'ALL' ? country : undefined,
        search: search.trim() || undefined,
        qualificationLevel: qualificationLevel !== 'ALL' ? qualificationLevel : undefined,
        acceptanceStatus: acceptanceStatus !== 'ALL' ? acceptanceStatus : undefined,
        page,
        limit: 10,
      });

      setPolicies(res.policies || []);
      setPagination(res.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
      setStats(res.stats || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadPolicies();
  };

  const handleResetFilters = () => {
    setCountry('ALL');
    setSearch('');
    setQualificationLevel('ALL');
    setAcceptanceStatus('ALL');
    setPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED_FOR_SPECIFIED_COURSES':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Accepted for specified courses
          </span>
        );
      case 'ACCEPTED_WITH_CONDITIONS':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Accepted with conditions
          </span>
        );
      case 'ACCEPTED_ONLY_FOR_SELECTED_INSTITUTIONS':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <GraduationCap className="w-3.5 h-3.5 mr-1" />
            Accepted only for selected institutions
          </span>
        );
      case 'NOT_ACCEPTED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            MOI not accepted (Exam required)
          </span>
        );
      case 'POLICY_REQUIRES_DIRECT_CONFIRMATION':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            Requires direct confirmation
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Official policy not yet verified
          </span>
        );
    }
  };

  const getSeparateTestBadge = (req: string) => {
    switch (req) {
      case 'NO_TEST_REQUIRED':
        return <span className="text-xs font-medium text-emerald-700">No test required</span>;
      case 'SEPARATE_TEST_REQUIRED':
        return <span className="text-xs font-semibold text-red-700">Formal test strictly mandatory</span>;
      case 'DEPENDS_ON_COURSE':
        return <span className="text-xs font-medium text-amber-700">Course / Department dependent</span>;
      default:
        return <span className="text-xs font-medium text-teal-700">Conditional on evidence & visa</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-20">
      <SeoHead
        title="Medium of Instruction (MOI) & English Waiver Directory | Borno Higher Study"
        description="Comprehensive verified directory of university Medium of Instruction (MOI) acceptance, country exemptions, graduation validity windows, and visa distinctions."
        canonicalPath="/moi-acceptance"
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white pt-12 pb-16 px-4 border-b border-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-300 text-xs font-medium mb-3">
                <FileText className="w-3.5 h-3.5" />
                <span>Verified Admissions Policies & Official Waivers</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Medium of Instruction (MOI) Acceptance Directory
              </h1>
              <p className="mt-3 text-base md:text-lg text-gray-300 max-w-3xl">
                A Medium of Instruction (MOI) certificate is an official document issued by your awarding university confirming that your degree was taught and examined in English. Discover verified university policies, course-level restrictions, and critical visa boundaries.
              </p>
            </div>

            {/* Quick Interactive Tool Link */}
            <div className="shrink-0">
              <Link
                to="/moi-eligibility-checker"
                className="inline-flex items-center space-x-2.5 px-6 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-900/30 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Check Your MOI Eligibility</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Neutrality & Visa Separation Callout */}
          <div className="mt-8 bg-navy-900/80 border border-amber-500/30 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs md:text-sm text-gray-300">
                <span className="font-semibold text-amber-300">Crucial Regulatory Distinction: </span>
                Never assume that an MOI letter accepted by a university automatically satisfies immigration or visa requirements. National immigration authorities (e.g. UK Home Office, Irish ISD, Canadian IRCC) enforce independent rules and may require an approved SELT or standard test.
              </div>
            </div>
            <div className="shrink-0 flex items-center space-x-2 text-xs font-semibold text-teal-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Primary Source Backed</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-xl md:text-2xl font-bold text-teal-400">{pagination.total || 0}</div>
              <div className="text-xs text-gray-400">Verified Policies</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-xl md:text-2xl font-bold text-emerald-400">{stats.acceptedWithConditions || 0}</div>
              <div className="text-xs text-gray-400">Accepted with Conditions</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-xl md:text-2xl font-bold text-purple-400">{stats.acceptedSelectedInstitutions || 0}</div>
              <div className="text-xs text-gray-400">Selected Institutions</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-xl md:text-2xl font-bold text-red-400">{stats.notAccepted || 0}</div>
              <div className="text-xs text-gray-400">Explicitly Not Accepted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Filter Toolbar */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        {/* Filter Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 mb-8">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by university name, department, or country (e.g., Aston, Alberta, Ottawa, McGill, Maynooth)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-28 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Search
              </button>
            </div>

            {/* Select Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Country */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Destination Country
                </label>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="ALL">All Countries</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Germany">Germany</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Qualification Level */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Qualification Level
                </label>
                <select
                  value={qualificationLevel}
                  onChange={(e) => {
                    setQualificationLevel(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="ALL">All Levels</option>
                  <option value="UNDERGRADUATE">Undergraduate / Bachelor's</option>
                  <option value="POSTGRADUATE_TAUGHT">Postgraduate / Master's (Taught)</option>
                  <option value="POSTGRADUATE_RESEARCH">Postgraduate (Research / PhD)</option>
                </select>
              </div>

              {/* Acceptance Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  MOI Acceptance Status
                </label>
                <select
                  value={acceptanceStatus}
                  onChange={(e) => {
                    setAcceptanceStatus(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACCEPTED_FOR_SPECIFIED_COURSES">Accepted for specified courses</option>
                  <option value="ACCEPTED_WITH_CONDITIONS">Accepted with conditions</option>
                  <option value="ACCEPTED_ONLY_FOR_SELECTED_INSTITUTIONS">Selected institutions only</option>
                  <option value="NOT_ACCEPTED">MOI not accepted</option>
                  <option value="POLICY_REQUIRES_DIRECT_CONFIRMATION">Requires direct confirmation</option>
                </select>
              </div>

              {/* Reset */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent mb-3" />
            <p className="text-sm text-gray-500">Searching verified MOI admissions policies...</p>
          </div>
        ) : policies.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy-950">No MOI policies found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              No universities matched your current filters. Try resetting the filters or searching for specific universities.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-semibold hover:bg-navy-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {policies.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 relative overflow-hidden"
              >
                {/* Outdated Warning Badge */}
                {p.isOutdated && (
                  <div className="bg-amber-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg absolute top-0 right-0 tracking-wider uppercase">
                    Review Required (&gt; 180 Days)
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Column: Identity & Status */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
                      <span className="flex items-center text-navy-900 font-semibold">
                        <Globe className="w-3.5 h-3.5 mr-1 text-teal-600" />
                        {p.country}
                      </span>
                      <span>•</span>
                      <span className="text-gray-600">{p.qualificationLevel.replace(/_/g, ' ')}</span>
                      {p.departmentName && (
                        <>
                          <span>•</span>
                          <span className="text-gray-500 truncate max-w-xs">{p.departmentName}</span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-navy-950">
                        {p.university?.name}
                      </h3>
                      {getStatusBadge(p.acceptanceStatus)}
                    </div>

                    {/* Excerpt */}
                    {p.sourceExcerpt && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200/60 leading-relaxed italic">
                        "{p.sourceExcerpt}"
                      </p>
                    )}

                    {/* Mandatory Conditions List */}
                    {p.conditions && p.conditions.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-xs font-semibold text-navy-900 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                          <span>Required Criteria for Exemption:</span>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600 pl-5 list-disc">
                          {p.conditions.map((c: any) => (
                            <li key={c.id}>
                              <span className="font-medium text-gray-800">{c.title}: </span>
                              {c.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Eligible Institutions note if applicable */}
                    {p.eligibleInstitutions && (
                      <div className="text-xs text-purple-900 bg-purple-50 p-2.5 rounded-lg border border-purple-200">
                        <span className="font-semibold">Vetted Institutions: </span>
                        {p.eligibleInstitutions}
                      </div>
                    )}

                    {/* Critical Visa Notice */}
                    <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-start space-x-2 text-xs text-amber-900">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-amber-950">Visa Independence: </span>
                        {p.visaSeparateRequirementNote}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Key Metrics & Actions */}
                  <div className="lg:w-80 shrink-0 bg-gray-50 rounded-xl p-4 border border-gray-200/60 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-gray-500">Degree Duration:</span>
                        <span className="font-semibold text-navy-950">
                          {p.minDegreeDurationYears ? `${p.minDegreeDurationYears}+ Years` : 'Standard Degree'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-gray-500">Graduation Validity:</span>
                        <span className="font-semibold text-navy-950">
                          {p.graduationValidityYears ? `Within ${p.graduationValidityYears} Years` : 'No Expiry Stated'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-gray-500">Official Transcripts:</span>
                        <span className="font-semibold text-navy-950">
                          {p.transcriptsRequired ? 'Strictly Required' : 'Optional'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-gray-500">Separate Test:</span>
                        {getSeparateTestBadge(p.separateTestRequired)}
                      </div>
                      <div className="flex justify-between items-center pt-1 text-[11px] text-gray-500">
                        <span>Last Verified:</span>
                        <span>{new Date(p.lastVerifiedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <a
                        href={p.officialPolicyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                      >
                        <span>Official Policy Page</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => setSelectedPolicyForModal(p)}
                        className="w-full inline-flex items-center justify-center space-x-1.5 py-1.5 px-3 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Flag className="w-3.5 h-3.5 text-gray-400" />
                        <span>Report Incorrect Info</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6">
                <div className="text-xs text-gray-500">
                  Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total policies)
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-medium px-2 text-navy-950">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    className="p-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-white disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Community Report Modal */}
      {selectedPolicyForModal && (
        <MoiReportCorrectionModal
          isOpen={!!selectedPolicyForModal}
          onClose={() => setSelectedPolicyForModal(null)}
          policyId={selectedPolicyForModal.id}
          universityName={selectedPolicyForModal.university?.name || 'Selected University'}
          currentPolicySnippet={selectedPolicyForModal.sourceExcerpt || selectedPolicyForModal.acceptanceStatus}
          onSuccess={() => {
            loadPolicies();
          }}
        />
      )}
    </div>
  );
};
