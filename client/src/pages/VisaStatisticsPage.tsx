import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar,
  Globe2,
  Users,
  GraduationCap,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { getVisaStatistics, getCountries } from '../services/api';
import { SeoHead } from '../components/common/SeoHead';
import { VisaStatisticsItem } from '../types/index';
import { VisaReportCorrectionModal } from '../components/common/VisaReportCorrectionModal';

export const VisaStatisticsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters
  const [countryCode, setCountryCode] = useState(searchParams.get('country') || 'ALL');
  const [applicantNationality, setApplicantNationality] = useState(searchParams.get('nationality') || 'BANGLADESH');
  const [reportingPeriodType, setReportingPeriodType] = useState(searchParams.get('periodType') || 'ALL');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<VisaStatisticsItem[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [countries, setCountries] = useState<any[]>([]);

  // Reporting correction modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<VisaStatisticsItem | null>(null);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [countryCode, applicantNationality, reportingPeriodType, page]);

  const loadCountries = async () => {
    try {
      const res = await getCountries();
      setCountries(res.countries || []);
    } catch {
      // Fallback
    }
  };

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 12,
      };
      if (countryCode !== 'ALL') params.countryCode = countryCode;
      if (applicantNationality !== 'ALL') params.applicantNationality = applicantNationality;
      if (reportingPeriodType !== 'ALL') params.reportingPeriodType = reportingPeriodType;
      if (search.trim()) params.search = search.trim();

      const res = await getVisaStatistics(params);
      setStatistics(res.statistics || []);
      setPagination({
        total: res.total,
        page: res.page,
        limit: res.limit,
        totalPages: res.totalPages,
      });
    } catch (err) {
      console.error('Failed to load visa statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadStatistics();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <SeoHead
        title="Official Country-by-Country Student Visa Statistics | Borno Higher Study"
        description="Verify authentic international student visa approval and refusal rates by country and nationality. Strict mathematical compatibility based on national immigration releases."
        canonicalPath="/visa-statistics"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 text-white pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-navy-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Strict Mathematical Compatibility Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white max-w-3xl">
            Official Country-by-Country Student Visa Statistics
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Data sourced directly from national immigration departments (UK Home Office, US State Dept, Canada IRCC, Australia Home Affairs). We strictly separate Bangladeshi applicant figures from worldwide averages and never mix student visas with tourist categories.
          </p>

          {/* Neutrality & Compatibility Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300">
              <span className="font-bold text-teal-300 block mb-0.5">Compatible Denominators</span>
              Approval Rate = Approved ÷ Decided × 100. Withdrawals and void applications are not conflated.
            </div>
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300">
              <span className="font-bold text-teal-300 block mb-0.5">Strict Nationality Segregation</span>
              Bangladeshi statistics are separated from worldwide totals to avoid skewed global benchmarks.
            </div>
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300">
              <span className="font-bold text-teal-300 block mb-0.5">No Fabricated Numbers</span>
              Where governments do not publish nationality breakdowns, data is explicitly marked Unavailable.
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Country Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Country</label>
              <select
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ALL">All Destination Countries</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Applicant Nationality */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Applicant Nationality</label>
              <select
                value={applicantNationality}
                onChange={(e) => {
                  setApplicantNationality(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="BANGLADESH">Bangladeshi Applicants</option>
                <option value="WORLDWIDE_ALL">Worldwide / All Nationalities</option>
                <option value="ALL">Show Both</option>
              </select>
            </div>

            {/* Reporting Period Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Period Format</label>
              <select
                value={reportingPeriodType}
                onChange={(e) => {
                  setReportingPeriodType(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ALL">All Reporting Formats</option>
                <option value="CALENDAR_YEAR">Calendar Year</option>
                <option value="FINANCIAL_YEAR">Financial Year</option>
                <option value="QUARTERLY">Quarterly Releases</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Keyword Search</label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Higher Education, Subclass 500..."
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Showing {statistics.length} of {pagination.total} official statistics records</span>
          <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
            Never conflating visitor with student visas
          </span>
        </div>

        {/* Statistics Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-56 bg-slate-200/60 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : statistics.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80">
            <BarChart3 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-700">No matching statistics found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your filter options or selecting &apos;Show Both&apos; for applicant nationality.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statistics.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Country & Tags */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-base text-navy-950">
                        <Link
                          to={`/visa-intelligence/country/${s.countryCode}`}
                          className="hover:text-teal-600 transition-colors"
                        >
                          {s.countryName}
                        </Link>
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-700">{s.visaCategory}</span>
                        <span>•</span>
                        <span>{s.educationLevel}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      s.dataStatus === 'OFFICIAL'
                        ? 'bg-emerald-100 text-emerald-800'
                        : s.dataStatus === 'UNAVAILABLE'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {s.dataStatus}
                    </span>
                  </div>

                  {/* Nationality & Location Pill */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600 mb-3">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>Nationality: <strong className="text-slate-800">{s.applicantNationality}</strong></span>
                    <span>({s.applicationLocation})</span>
                  </div>

                  {/* Rate Numbers */}
                  {s.dataStatus === 'UNAVAILABLE' ? (
                    <div className="my-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <p className="text-xs font-semibold text-slate-700">
                        Official statistics not available for this reporting period
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Government authorities do not publish standalone nationality figures.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 my-2.5">
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

                  {/* Period & Mathematical Basis */}
                  <div className="space-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span>Reporting Period:</span>
                      <span className="font-semibold text-slate-700">{s.reportingPeriod} ({s.reportingPeriodType})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Decided Applications:</span>
                      <span className="font-medium text-slate-700">
                        {s.applicationsDecided ? s.applicationsDecided.toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    {s.calculationBasis && (
                      <div className="text-[10px] text-slate-400 italic pt-0.5">
                        Basis: {s.calculationBasis}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Attribution & Action */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href={s.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-teal-600 flex items-center gap-1 text-[11px] truncate max-w-[170px]"
                    title={`Source: ${s.publisher}`}
                  >
                    <span className="truncate">{s.publisher}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedStat(s);
                        setModalOpen(true);
                      }}
                      className="text-[11px] text-slate-400 hover:text-amber-600 transition-colors"
                    >
                      Report issue
                    </button>
                    <Link
                      to={`/visa-intelligence/country/${s.countryCode}`}
                      className="font-semibold text-teal-600 hover:text-teal-700 text-xs"
                    >
                      Country profile →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-600 px-3">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {selectedStat && (
        <VisaReportCorrectionModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedStat(null);
          }}
          targetType="STATISTICS"
          countryName={selectedStat.countryName}
          itemTitle={`${selectedStat.countryName} - ${selectedStat.reportingPeriod} (${selectedStat.applicantNationality})`}
          statisticsId={selectedStat.id}
        />
      )}
    </div>
  );
};
