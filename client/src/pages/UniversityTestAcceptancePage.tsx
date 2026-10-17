import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Building2,
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
  HelpCircle,
  XCircle,
  Flag,
  Globe,
  Compass,
} from 'lucide-react';
import { getUniversityTestAcceptances, getCountries } from '../services/api';
import { SeoHead } from '../components/common/SeoHead';
import { TestReportCorrectionModal } from '../components/common/TestReportCorrectionModal';

export const UniversityTestAcceptancePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters
  const [countrySlug, setCountrySlug] = useState(searchParams.get('countrySlug') || 'ALL');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [academicLevel, setAcademicLevel] = useState(searchParams.get('academicLevel') || 'ALL');
  const [testFormatCode, setTestFormatCode] = useState(searchParams.get('testFormatCode') || 'ALL');
  const [deliveryFormat, setDeliveryFormat] = useState(searchParams.get('deliveryFormat') || 'ALL');
  const [status, setStatus] = useState(searchParams.get('status') || 'ALL');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedPolicyForModal, setSelectedPolicyForModal] = useState<any | null>(null);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    loadPolicies();
  }, [countrySlug, academicLevel, testFormatCode, deliveryFormat, status, page]);

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
      const res = await getUniversityTestAcceptances({
        countrySlug,
        search: search.trim() || undefined,
        academicLevel,
        testFormatCode,
        deliveryFormat,
        status,
        page,
        limit: 12,
      });

      setPolicies(res.policies || []);
      setPagination(res.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 });
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
    setCountrySlug('ALL');
    setSearch('');
    setAcademicLevel('ALL');
    setTestFormatCode('ALL');
    setDeliveryFormat('ALL');
    setStatus('ALL');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50/70 pb-20">
      <SeoHead
        title="University English Requirements 2026: IELTS, PTE & TOEFL Acceptance Rules"
        description="Verify official English language acceptance policies for UK, US, Canada, Australia and European universities. View required overall and component scores for undergraduate, master's and PhD admissions."
        canonicalPath="/university-test-acceptance"
        ogType="website"
      />

      {/* Header Banner */}
      <div className="bg-navy-950 text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-4">
            <Building2 className="w-3.5 h-3.5" />
            University-Specific Admissions Language Policy Engine
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Global University English Acceptance Directory
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            Check verified English proficiency entry requirements across world universities. View minimum overall and component band
            scores (Listening, Reading, Writing, Speaking) and confirmed test-centre vs. online delivery acceptance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Filters Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-5 sm:p-6 mb-8">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search university by name (e.g. Oxford, Cambridge, Imperial, Edinburgh)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm rounded-2xl border border-gray-300 pl-11 pr-24 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Search
              </button>
            </div>

            {/* Dropdowns Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              {/* Country */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Destination Country</label>
                <select
                  value={countrySlug}
                  onChange={(e) => {
                    setCountrySlug(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ALL">All Countries</option>
                  <option value="united-kingdom">United Kingdom (15+ Flagships)</option>
                  {countries
                    .filter((c) => c.slug !== 'united-kingdom')
                    .map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Academic Level */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Study Level</label>
                <select
                  value={academicLevel}
                  onChange={(e) => {
                    setAcademicLevel(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ALL">All Academic Levels</option>
                  <option value="UNDERGRADUATE">Undergraduate (Bachelor's)</option>
                  <option value="POSTGRADUATE_TAUGHT">Postgraduate Taught (Master's)</option>
                  <option value="POSTGRADUATE_RESEARCH">Postgraduate Research (PhD)</option>
                  <option value="FOUNDATION">Foundation / Pathway</option>
                </select>
              </div>

              {/* Test Exam */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">English Test Exam</label>
                <select
                  value={testFormatCode}
                  onChange={(e) => {
                    setTestFormatCode(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ALL">All Test Formats</option>
                  <option value="IELTS_ACADEMIC">IELTS Academic</option>
                  <option value="IELTS_UKVI_ACADEMIC">IELTS for UKVI</option>
                  <option value="PTE_ACADEMIC">PTE Academic</option>
                  <option value="PTE_ACADEMIC_ONLINE">PTE Academic Online</option>
                  <option value="TOEFL_IBT">TOEFL iBT (Test Centre)</option>
                  <option value="TOEFL_HOME_EDITION">TOEFL Home Edition</option>
                </select>
              </div>

              {/* Delivery Format */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Delivery Format</label>
                <select
                  value={deliveryFormat}
                  onChange={(e) => {
                    setDeliveryFormat(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ALL">All Delivery Modes</option>
                  <option value="TEST_CENTRE">🏢 Test Centre Only</option>
                  <option value="ONLINE">💻 At-Home Online Only</option>
                </select>
              </div>

              {/* Acceptance Status */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Acceptance Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACCEPTED">✅ Confirmed Accepted</option>
                  <option value="ACCEPTED_WITH_CONDITIONS">⚠️ Conditional Acceptance</option>
                  <option value="NOT_ACCEPTED">❌ Not Accepted</option>
                  <option value="UNDER_REVIEW">🔍 Under Review</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500">
                Found <strong>{pagination.total}</strong> verified university acceptance rules
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition"
              >
                Reset All Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-medium">Querying university acceptance database...</p>
          </div>
        ) : policies.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 mb-1">No acceptance policies matched your filter</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
              Try broadening your search term or setting delivery format to "All Delivery Modes".
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {policies.map((p) => {
              const isAccepted = p.status === 'ACCEPTED';
              const isConditional = p.status === 'ACCEPTED_WITH_CONDITIONS';
              const isRejected = p.status === 'NOT_ACCEPTED';

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  {/* Left: University & Program Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-bold text-base sm:text-lg text-navy-950 hover:text-teal-700 transition">
                        <Link to={`/universities/${p.university.slug}`}>{p.university.name}</Link>
                      </span>

                      {p.university.country && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-semibold text-gray-600">
                          <span>{p.university.country.flagEmoji}</span>
                          <span>{p.university.country.name}</span>
                        </span>
                      )}

                      {p.policyTier && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                          {p.policyTier}
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-bold uppercase">
                        {p.academicLevel.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 mb-3 flex items-center gap-3">
                      <span>
                        City: <strong>{p.university.cityName || 'Main Campus'}</strong>
                      </span>
                      {p.university.qsRanking && (
                        <span>
                          QS Rank: <strong>#{p.university.qsRanking}</strong>
                        </span>
                      )}
                      <span>
                        Policy Period: <strong>{p.policyPeriod}</strong>
                      </span>
                    </div>

                    {/* Test & Score Highlights */}
                    <div className="flex flex-wrap items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold block">
                          Test Format
                        </span>
                        <span className="text-xs font-bold text-navy-900 flex items-center gap-1">
                          {p.testName}
                          <span className="text-[10px] font-normal text-gray-500">
                            ({p.deliveryFormat === 'ONLINE' ? 'At-Home Online' : 'Test Centre'})
                          </span>
                        </span>
                      </div>

                      <div className="border-l border-gray-200 pl-3">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold block">
                          Status
                        </span>
                        {isAccepted && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                          </span>
                        )}
                        {isConditional && (
                          <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Conditional
                          </span>
                        )}
                        {isRejected && (
                          <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Not Accepted
                          </span>
                        )}
                      </div>

                      {p.minOverallScore !== null && p.minOverallScore !== undefined && (
                        <div className="border-l border-gray-200 pl-3">
                          <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold block">
                            Min Overall Score
                          </span>
                          <span className="text-sm font-black text-navy-950">
                            {p.minOverallScore}
                            {p.testName.includes('IELTS') ? ' / 9.0' : p.testName.includes('PTE') ? ' / 90' : ' / 120'}
                          </span>
                        </div>
                      )}

                      {/* Component Scores */}
                      {p.componentScores && (
                        <div className="border-l border-gray-200 pl-3">
                          <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold block">
                            Min Components (L / R / W / S)
                          </span>
                          <span className="text-xs font-bold text-gray-800">
                            L: {p.componentScores.listening ?? '-'} | R: {p.componentScores.reading ?? '-'} | W:{' '}
                            {p.componentScores.writing ?? '-'} | S: {p.componentScores.speaking ?? '-'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Warning / Conditional Notice */}
                    {p.warningNotice && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-900">Admissions Policy Note: </strong>
                          {p.warningNotice}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="shrink-0 flex flex-col sm:items-end gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <a
                      href={p.officialPolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-950 text-white shadow-sm transition w-full sm:w-auto"
                    >
                      Official Policy Page
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => setSelectedPolicyForModal(p)}
                      className="text-[11px] font-semibold text-gray-500 hover:text-navy-950 underline transition"
                    >
                      Report policy correction
                    </button>

                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                      <Clock className="w-3 h-3 text-teal-600" />
                      <span>Verified: {new Date(p.lastVerifiedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Server-Side Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between bg-white rounded-2xl border border-gray-200 p-4">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <span className="text-xs font-semibold text-gray-600">
              Page <strong>{page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} policies)
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
              disabled={page >= pagination.totalPages}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {selectedPolicyForModal && (
        <TestReportCorrectionModal
          isOpen={!!selectedPolicyForModal}
          onClose={() => setSelectedPolicyForModal(null)}
          targetType="UNIVERSITY_POLICY"
          policyId={selectedPolicyForModal.id}
          itemTitle={`${selectedPolicyForModal.university.name} — ${selectedPolicyForModal.testName}`}
          currentValueSnippet={`Status: ${selectedPolicyForModal.status}, Min Overall: ${selectedPolicyForModal.minOverallScore}`}
          onSuccess={() => loadPolicies()}
        />
      )}
    </div>
  );
};
