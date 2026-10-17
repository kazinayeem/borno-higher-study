import React, { useState, useEffect } from 'react';
import {
  Globe,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Check,
  X,
  Building2,
  GraduationCap,
  Sparkles,
  Info
} from 'lucide-react';
import {
  getCoverageDashboard,
  getPaginatedRegistry,
  getCandidatesQueue,
  reviewCandidate,
  triggerIngestion,
  getIngestionBatches
} from '../../services/api.js';

export const AdminCountryCoverageManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'countries' | 'registry' | 'candidates' | 'batches'>('countries');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1. Coverage Dashboard Data
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [countryFilter, setCountryFilter] = useState<string>('ALL');
  const [countrySearch, setCountrySearch] = useState<string>('');

  // 2. Paginated Registry Data
  const [registryInstitutions, setRegistryInstitutions] = useState<any[]>([]);
  const [registryTotal, setRegistryTotal] = useState(0);
  const [registryPage, setRegistryPage] = useState(1);
  const [registryLimit] = useState(20);
  const [registryTotalPages, setRegistryTotalPages] = useState(1);
  const [registrySearch, setRegistrySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAccreditation, setSelectedAccreditation] = useState('all');

  // 3. Candidate Review Queue
  const [candidates, setCandidates] = useState<any[]>([]);
  const [candidateTotal, setCandidateTotal] = useState(0);
  const [candidatePage, setCandidatePage] = useState(1);
  const [candidateStatusFilter, setCandidateStatusFilter] = useState('ALL');
  const [reviewModalCandidate, setReviewModalCandidate] = useState<any | null>(null);
  const [reviewAction, setReviewAction] = useState<'APPROVE' | 'REJECT' | 'RESOLVE_DUPLICATE'>('APPROVE');
  const [reviewNotes, setReviewNotes] = useState('');

  // 4. Ingestion Batches
  const [batches, setBatches] = useState<any[]>([]);
  const [isIngesting, setIsIngesting] = useState(false);

  // Load Dashboard
  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getCoverageDashboard();
      setDashboardData(data);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load country coverage statistics.' });
    } finally {
      setLoading(false);
    }
  };

  // Load Paginated Registry
  const loadRegistry = async () => {
    try {
      setLoading(true);
      const res = await getPaginatedRegistry({
        page: registryPage,
        limit: registryLimit,
        search: registrySearch,
        country: selectedCountry,
        institutionType: selectedType,
        accreditationStatus: selectedAccreditation,
      });
      setRegistryInstitutions(res.institutions || []);
      setRegistryTotal(res.total || 0);
      setRegistryTotalPages(res.totalPages || 1);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load Candidate Queue
  const loadCandidates = async () => {
    try {
      setLoading(true);
      const res = await getCandidatesQueue({
        page: candidatePage,
        limit: 20,
        status: candidateStatusFilter,
      });
      setCandidates(res.candidates || []);
      setCandidateTotal(res.total || 0);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load Batches
  const loadBatches = async () => {
    try {
      const res = await getIngestionBatches();
      setBatches(res || []);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'countries') loadDashboard();
    if (activeSubTab === 'registry') loadRegistry();
    if (activeSubTab === 'candidates') loadCandidates();
    if (activeSubTab === 'batches') loadBatches();
  }, [activeSubTab]);

  useEffect(() => {
    if (activeSubTab === 'registry') {
      const timer = setTimeout(() => {
        loadRegistry();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [registryPage, registrySearch, selectedCountry, selectedType, selectedAccreditation]);

  useEffect(() => {
    if (activeSubTab === 'candidates') {
      loadCandidates();
    }
  }, [candidatePage, candidateStatusFilter]);

  // Trigger Ingestion
  const handleTriggerIngestion = async (countrySlug?: string) => {
    try {
      setIsIngesting(true);
      setMessage({ type: 'success', text: countrySlug ? `Starting ingestion for ${countrySlug}...` : 'Starting global institution registry ingestion...' });
      const res = await triggerIngestion(countrySlug);
      setMessage({ type: 'success', text: `Ingestion completed! Discovered ${res.summary.discoveredCount}, Imported ${res.summary.importedCount}, Duplicates: ${res.summary.duplicateCount}.` });
      await loadDashboard();
      if (activeSubTab === 'registry') await loadRegistry();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Ingestion failed' });
    } finally {
      setIsIngesting(false);
    }
  };

  // Handle Candidate Review
  const submitCandidateReview = async () => {
    if (!reviewModalCandidate) return;
    try {
      setLoading(true);
      await reviewCandidate(reviewModalCandidate.id, reviewAction, reviewNotes);
      setMessage({ type: 'success', text: `Candidate successfully updated with action: ${reviewAction}.` });
      setReviewModalCandidate(null);
      setReviewNotes('');
      await loadCandidates();
      await loadDashboard();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to review candidate.' });
    } finally {
      setLoading(false);
    }
  };

  const filteredCountries = (dashboardData?.countries || []).filter((c: any) => {
    const matchesFilter =
      countryFilter === 'ALL' ||
      (countryFilter === 'TARGET_MET' && c.coverageStatus === 'TARGET_MET') ||
      (countryFilter === 'EXHAUSTIVE_COVERAGE' && c.coverageStatus === 'EXHAUSTIVE_COVERAGE') ||
      (countryFilter === 'IN_PROGRESS' && c.coverageStatus === 'IN_PROGRESS');

    const matchesSearch =
      !countrySearch ||
      c.countryName.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.countrySlug.toLowerCase().includes(countrySearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            message.type === 'success' ? 'bg-teal-50 text-teal-900 border border-teal-200' : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-semibold text-xs ml-4 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Header & KPI Summary Cards */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-teal-100 text-teal-800 rounded-lg">
                <Globe className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Global Institution Coverage & Ingestion Engine
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Minimum 100 verified institutions per country target, with exhaustive coverage for national education directories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTriggerIngestion()}
              disabled={isIngesting}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isIngesting ? 'animate-spin' : ''}`} />
              {isIngesting ? 'Ingesting Registries...' : 'Run Global Ingestion'}
            </button>
          </div>
        </div>

        {/* Overview Metric Pills */}
        {dashboardData?.overview && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Total Verified
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {dashboardData.overview.totalVerifiedInstitutions}
              </span>
              <span className="text-[11px] text-teal-700 font-medium">In Live Directory</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                Target Met (100+)
              </span>
              <span className="text-2xl font-black text-emerald-950 mt-1 block">
                {dashboardData.overview.countriesWithTargetMet} Countries
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">US, UK, DE, CA, AU, IN</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
                Exhaustive National
              </span>
              <span className="text-2xl font-black text-blue-950 mt-1 block">
                {dashboardData.overview.countriesWithExhaustiveCoverage} Countries
              </span>
              <span className="text-[11px] text-blue-700 font-medium">100% Verified Ministries</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">
                Review Queue
              </span>
              <span className="text-2xl font-black text-amber-950 mt-1 block">
                {dashboardData.overview.candidatesNeedingReview} Candidates
              </span>
              <span className="text-[11px] text-amber-700 font-medium">Pending Decision</span>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5">
              <span className="text-xs font-semibold text-purple-800 uppercase tracking-wider block">
                Duplicates Blocked
              </span>
              <span className="text-2xl font-black text-purple-950 mt-1 block">
                {dashboardData.overview.duplicateCandidatesDetected} Detected
              </span>
              <span className="text-[11px] text-purple-700 font-medium">Campuses & Aliases</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Official Sources
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {dashboardData.overview.totalOfficialSources}
              </span>
              <span className="text-[11px] text-slate-600 font-medium">Gov & Registrar Portals</span>
            </div>
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2">
        <button
          onClick={() => setActiveSubTab('countries')}
          className={`py-3 px-5 text-sm font-semibold rounded-t-lg transition border-b-2 flex items-center gap-2 ${
            activeSubTab === 'countries'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Globe className="w-4 h-4" />
          Country Target Status
        </button>

        <button
          onClick={() => setActiveSubTab('registry')}
          className={`py-3 px-5 text-sm font-semibold rounded-t-lg transition border-b-2 flex items-center gap-2 ${
            activeSubTab === 'registry'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Institution Registry ({registryTotal > 0 ? registryTotal : 'Explore'})
        </button>

        <button
          onClick={() => setActiveSubTab('candidates')}
          className={`py-3 px-5 text-sm font-semibold rounded-t-lg transition border-b-2 flex items-center gap-2 ${
            activeSubTab === 'candidates'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Review Queue & Duplicates ({candidateTotal})
        </button>

        <button
          onClick={() => setActiveSubTab('batches')}
          className={`py-3 px-5 text-sm font-semibold rounded-t-lg transition border-b-2 flex items-center gap-2 ${
            activeSubTab === 'batches'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          Ingestion History & Reports
        </button>
      </div>

      {/* ========================================================= */}
      {/* SUBTAB 1: COUNTRY COVERAGE DASHBOARD TABLE               */}
      {/* ========================================================= */}
      {activeSubTab === 'countries' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder="Search countries..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500 uppercase">Filter:</span>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ALL">All Countries</option>
                <option value="TARGET_MET">Target Met (100+ Verified)</option>
                <option value="EXHAUSTIVE_COVERAGE">Exhaustive National (&lt;100 Total)</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Country</th>
                  <th className="py-3.5 px-4">Verified vs Target</th>
                  <th className="py-3.5 px-4">Candidates</th>
                  <th className="py-3.5 px-4">Duplicates Detected</th>
                  <th className="py-3.5 px-4">Official Sources</th>
                  <th className="py-3.5 px-4">Coverage Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCountries.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌐</span>
                        <span>{c.countryName}</span>
                        <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {c.countryCode}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{c.verifiedCount}</span>
                        <span className="text-slate-600">/</span>
                        <span className="font-medium text-slate-600">{c.targetCount}</span>
                      </div>
                      <span className="text-[11px] text-slate-600 block mt-0.5">
                        {c.isTargetCapped
                          ? `${c.verifiedCount} verified — fewer than 100 available nationwide`
                          : `${c.verifiedCount} verified of 100+ target`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {c.unverifiedCandidateCount} candidate{c.unverifiedCandidateCount === 1 ? '' : 's'}
                        </span>
                        {c.needsReviewCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            {c.needsReviewCount} review
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {c.duplicateCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> {c.duplicateCount} blocked
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600">0 duplicates</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        {c.officialSourceCount} Portals
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {c.coverageStatus === 'TARGET_MET' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Target Met (100+)
                        </span>
                      )}
                      {c.coverageStatus === 'EXHAUSTIVE_COVERAGE' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Exhaustive Coverage (&lt;100)
                        </span>
                      )}
                      {c.coverageStatus === 'IN_PROGRESS' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3.5 h-3.5" /> In Progress
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleTriggerIngestion(c.countrySlug)}
                        disabled={isIngesting}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1.5 rounded-lg transition disabled:opacity-50"
                      >
                        Re-ingest
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 2: PAGINATED INSTITUTION REGISTRY EXPLORER         */}
      {/* ========================================================= */}
      {activeSubTab === 'registry' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4">
          {/* Server-Side Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={registrySearch}
                onChange={(e) => {
                  setRegistrySearch(e.target.value);
                  setRegistryPage(1);
                }}
                placeholder="Search institution name, city..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setRegistryPage(1);
                }}
                className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Countries</option>
                <option value="united-states">United States</option>
                <option value="united-kingdom">United Kingdom</option>
                <option value="germany">Germany</option>
                <option value="canada">Canada</option>
                <option value="australia">Australia</option>
                <option value="india">India</option>
                <option value="finland">Finland</option>
                <option value="ireland">Ireland</option>
                <option value="netherlands">Netherlands</option>
                <option value="sweden">Sweden</option>
                <option value="lithuania">Lithuania</option>
                <option value="estonia">Estonia</option>
                <option value="denmark">Denmark</option>
                <option value="norway">Norway</option>
                <option value="new-zealand">New Zealand</option>
                <option value="singapore">Singapore</option>
              </select>
            </div>

            <div>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setRegistryPage(1);
                }}
                className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Institution Types</option>
                <option value="UNIVERSITY">University</option>
                <option value="COLLEGE">College</option>
                <option value="BUSINESS_SCHOOL">Business School</option>
                <option value="UAS">University of Applied Sciences (UAS)</option>
                <option value="INSTITUTE_OF_TECHNOLOGY">Institute of Technology</option>
                <option value="COMMUNITY_COLLEGE">Community College</option>
                <option value="PATHWAY_PROVIDER">Pathway & Foundation Provider</option>
                <option value="VOCATIONAL">Vocational & TAFE</option>
                <option value="RESEARCH_INSTITUTE">Research Institute</option>
              </select>
            </div>

            <div>
              <select
                value={selectedAccreditation}
                onChange={(e) => {
                  setSelectedAccreditation(e.target.value);
                  setRegistryPage(1);
                }}
                className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Accreditation Statuses</option>
                <option value="STATE_ACCREDITED">State Accredited</option>
                <option value="RECOGNIZED">Recognized</option>
                <option value="MINISTRY_APPROVED">Ministry Approved</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Institution Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Country & City</th>
                  <th className="py-3 px-4">Accreditation Body</th>
                  <th className="py-3 px-4">Source Registry</th>
                  <th className="py-3 px-4">Portal Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {registryInstitutions.map((inst: any) => (
                  <tr key={inst.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{inst.name}</div>
                      <div className="text-[11px] text-slate-600 font-mono">slug: {inst.slug}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                        {inst.institutionType}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-xs font-medium text-slate-900">{inst.country?.name}</div>
                      <div className="text-[11px] text-slate-600">{inst.cityName}</div>
                    </td>

                    <td className="py-3 px-4 text-xs">
                      <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {inst.accreditationBody || 'Ministry of Education'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-xs font-mono text-slate-600">
                      {inst.sourceRegistry || 'Official Education Registry'}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={inst.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 font-medium underline"
                        >
                          Website <ExternalLink className="w-3 h-3" />
                        </a>
                        {inst.admissionsUrl && inst.admissionsUrl !== inst.websiteUrl && (
                          <a
                            href={inst.admissionsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 font-medium underline"
                          >
                            Admissions <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-600">
              Showing {(registryPage - 1) * registryLimit + 1} to{' '}
              {Math.min(registryPage * registryLimit, registryTotal)} of {registryTotal} verified institutions
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={registryPage <= 1}
                onClick={() => setRegistryPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 disabled:opacity-50 inline-flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <span className="text-xs font-semibold text-slate-700 px-2">
                Page {registryPage} of {registryTotalPages}
              </span>

              <button
                disabled={registryPage >= registryTotalPages}
                onClick={() => setRegistryPage((p) => p + 1)}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 disabled:opacity-50 inline-flex items-center gap-1"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 3: CANDIDATE REVIEW QUEUE & DEDUPLICATION          */}
      {/* ========================================================= */}
      {activeSubTab === 'candidates' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Candidate Institutions Review & Deduplication
              </h3>
              <p className="text-xs text-slate-600">
                Institutions flagged by crawlers or registries with uncertain accreditation or potential duplicate branch campuses.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={candidateStatusFilter}
                onChange={(e) => setCandidateStatusFilter(e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEEDS_REVIEW">Needs Review</option>
                <option value="DUPLICATE">Duplicate Candidates</option>
                <option value="UNVERIFIED">Unverified</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {candidates.map((cand: any) => (
              <div
                key={cand.id}
                className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{cand.name}</span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        cand.candidateStatus === 'NEEDS_REVIEW'
                          ? 'bg-amber-100 text-amber-800'
                          : cand.candidateStatus === 'DUPLICATE'
                          ? 'bg-purple-100 text-purple-800'
                          : cand.candidateStatus === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {cand.candidateStatus}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      <strong>Country:</strong> {cand.countryName} ({cand.cityName || 'N/A'})
                    </span>
                    <span>
                      <strong>Type:</strong> {cand.institutionType}
                    </span>
                    <span>
                      <strong>Source:</strong> {cand.sourceRegistry}
                    </span>
                    <a
                      href={cand.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-700 underline flex items-center gap-1 font-medium"
                    >
                      {cand.websiteUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {cand.duplicateReason && (
                    <div className="text-xs bg-purple-50 text-purple-900 border border-purple-200 p-2 rounded-lg mt-2 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                      <span>
                        <strong>Duplicate Detection Flag:</strong> {cand.duplicateReason}
                      </span>
                    </div>
                  )}

                  {cand.reviewNotes && (
                    <div className="text-xs bg-slate-100 text-slate-700 p-2 rounded-lg mt-1">
                      <strong>Audit Note:</strong> {cand.reviewNotes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setReviewModalCandidate(cand);
                      setReviewAction('APPROVE');
                      setReviewNotes('Approved into live verified directory after accreditation check.');
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => {
                      setReviewModalCandidate(cand);
                      setReviewAction('RESOLVE_DUPLICATE');
                      setReviewNotes('Confirmed duplicate / sub-branch of existing institution.');
                    }}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs rounded-lg transition"
                  >
                    Resolve Duplicate
                  </button>

                  <button
                    onClick={() => {
                      setReviewModalCandidate(cand);
                      setReviewAction('REJECT');
                      setReviewNotes('Candidate does not meet state degree-awarding recognition criteria.');
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-lg transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}

            {candidates.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">
                No candidate institutions currently pending review in this status.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBTAB 4: INGESTION BATCH HISTORY & AUDIT LOGS            */}
      {/* ========================================================= */}
      {activeSubTab === 'batches' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Ingestion Execution Batches & Audit Trail
            </h3>
            <p className="text-xs text-slate-600">
              Verifiable log of every automated and manual registry collection run.
            </p>
          </div>

          <div className="space-y-3">
            {batches.map((b: any) => (
              <div
                key={b.id}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{b.sourceRegistry}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {b.status}
                    </span>
                    <span className="text-xs font-mono text-slate-600">Batch ID: {b.id.slice(0, 8)}...</span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 mt-2">
                    <span>
                      <strong>Discovered:</strong> {b.discoveredCount}
                    </span>
                    <span>
                      <strong>Imported:</strong> {b.importedCount}
                    </span>
                    <span>
                      <strong>Verified:</strong> {b.verifiedCount}
                    </span>
                    <span>
                      <strong>Duplicates Prevented:</strong> {b.duplicateCount}
                    </span>
                    <span>
                      <strong>Timestamp:</strong> {new Date(b.startedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600">
                  {b.completedAt ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed in{' '}
                      {(
                        (new Date(b.completedAt).getTime() - new Date(b.startedAt).getTime()) /
                        1000
                      ).toFixed(2)}
                      s
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 animate-spin" /> In Progress
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Review Modal */}
      {reviewModalCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Confirm Candidate Review Action
              </h3>
              <button
                onClick={() => setReviewModalCandidate(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <strong>Candidate:</strong> {reviewModalCandidate.name}
              </p>
              <p>
                <strong>Action:</strong>{' '}
                <span className="font-bold uppercase text-teal-700">{reviewAction}</span>
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Super Admin Decision Rationale / Audit Note:
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter audit notes..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setReviewModalCandidate(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={submitCandidateReview}
                disabled={loading}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Decision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
