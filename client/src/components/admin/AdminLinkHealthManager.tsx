import React, { useState, useEffect } from 'react';
import {
  Link2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Wrench,
  XCircle,
  Clock,
  Check,
  X,
  Edit2,
  FileSpreadsheet,
  Globe,
  Database,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import {
  getLinkHealthStats,
  getLinkHealthRecords,
  triggerLinkHealthScan,
  applyLinkRepair,
  autoRepairBatch,
  rejectLinkRepair,
  retryLinkVerification,
  updateCandidateUrl,
  getLinkHealthHistory,
  LinkAuditRecordItem,
  LinkHealthStats
} from '../../services/api.js';

export const AdminLinkHealthManager: React.FC = () => {
  const [stats, setStats] = useState<LinkHealthStats | null>(null);
  const [records, setRecords] = useState<LinkAuditRecordItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [autoRepairing, setAutoRepairing] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDestType, setSelectedDestType] = useState<string>('ALL');
  const [selectedRepairStatus, setSelectedRepairStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Edit Candidate Modal
  const [editingRecord, setEditingRecord] = useState<LinkAuditRecordItem | null>(null);
  const [candidateInput, setCandidateInput] = useState<string>('');

  const loadStatsAndRecords = async () => {
    setLoading(true);
    try {
      const [sData, rData] = await Promise.all([
        getLinkHealthStats(),
        getLinkHealthRecords({
          category: selectedCategory,
          status: selectedStatus,
          repairStatus: selectedRepairStatus,
          destinationType: selectedDestType,
          search: searchQuery,
          page,
          limit: 20
        })
      ]);
      setStats(sData);
      setRecords(rData.records);
      setTotal(rData.total);
      setTotalPages(rData.totalPages);
    } catch (err: any) {
      console.error('Failed to load link health data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatsAndRecords();
  }, [selectedStatus, selectedCategory, selectedDestType, selectedRepairStatus, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadStatsAndRecords();
  };

  const handleRunScan = async () => {
    setScanning(true);
    setActionMessage(null);
    try {
      const res = await triggerLinkHealthScan('MANUAL_SUPER_ADMIN');
      setActionMessage(`Audit complete: ${res.summary.totalLinks} links inspected in ${res.summary.durationSeconds}s. Found ${res.summary.redirectCount} redirects.`);
      await loadStatsAndRecords();
    } catch (err: any) {
      setActionMessage(`Scan failed: ${err.message}`);
    } finally {
      setScanning(false);
    }
  };

  const handleAutoRepair = async () => {
    setAutoRepairing(true);
    setActionMessage(null);
    try {
      const res = await autoRepairBatch();
      setActionMessage(`Automated batch repair applied to ${res.repairedCount} database records successfully.`);
      await loadStatsAndRecords();
    } catch (err: any) {
      setActionMessage(`Auto-repair failed: ${err.message}`);
    } finally {
      setAutoRepairing(false);
    }
  };

  const handleApplySingleRepair = async (record: LinkAuditRecordItem) => {
    try {
      await applyLinkRepair(record.id, record.suggestedReplacement);
      setActionMessage(`Repaired "${record.entityName || record.originalUrl}" in database.`);
      await loadStatsAndRecords();
    } catch (err: any) {
      setActionMessage(`Repair failed: ${err.message}`);
    }
  };

  const handleRejectSingleRepair = async (record: LinkAuditRecordItem) => {
    try {
      await rejectLinkRepair(record.id, 'Super Admin flagged as false positive or preferred original URL');
      setActionMessage(`Repair proposal rejected for "${record.entityName || record.originalUrl}".`);
      await loadStatsAndRecords();
    } catch (err: any) {
      setActionMessage(`Rejection failed: ${err.message}`);
    }
  };

  const handleRetrySingle = async (record: LinkAuditRecordItem) => {
    try {
      await retryLinkVerification(record.id);
      setActionMessage(`Re-verified "${record.entityName || record.originalUrl}".`);
      await loadStatsAndRecords();
    } catch (err: any) {
      setActionMessage(`Retry failed: ${err.message}`);
    }
  };

  const handleSaveCandidate = async () => {
    if (!editingRecord || !candidateInput.trim()) return;
    try {
      await updateCandidateUrl(editingRecord.id, candidateInput.trim());
      setActionMessage(`Candidate URL updated. Ready for review or approval.`);
      setEditingRecord(null);
      setCandidateInput('');
      await loadStatsAndRecords();
    } catch (err: any) {
      setActionMessage(`Failed to update candidate: ${err.message}`);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/admin/link-health/export-csv', '_blank');
  };

  const handleOpenHistory = async () => {
    try {
      const list = await getLinkHealthHistory();
      setHistoryList(list);
      setHistoryOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WORKING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Working (200 OK)
          </span>
        );
      case 'WORKING_REDIRECT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <RefreshCw className="w-3 h-3 text-blue-600" />
            Redirect (Resolved)
          </span>
        );
      case 'BROKEN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Broken (404/410)
          </span>
        );
      case 'ACCESS_RESTRICTED':
      case 'REQUIRES_BROWSER_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            Protected (Cloudflare/403)
          </span>
        );
      case 'TIMEOUT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <Clock className="w-3 h-3 text-slate-500" />
            Timeout (&gt;5s)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">
            <AlertTriangle className="w-3 h-3 text-slate-400" />
            {status}
          </span>
        );
    }
  };

  const getRepairBadge = (repairStatus: string) => {
    switch (repairStatus) {
      case 'REPAIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <Check className="w-3 h-3 text-teal-600" />
            Repaired in DB
          </span>
        );
      case 'PROPOSED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="w-3 h-3 text-purple-600" />
            Proposed Repair
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <X className="w-3 h-3 text-slate-400" />
            Rejected
          </span>
        );
      case 'MANUAL_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Needs Review
          </span>
        );
      default:
        return <span className="text-[11px] text-slate-400">None</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 inline-flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5 text-teal-600" />
              Website Reliability & URL Integrity
            </span>
            {stats?.lastScanAt && (
              <span className="text-xs text-slate-500 font-medium">
                Last scan: {new Date(stats.lastScanAt).toLocaleString()}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">
            Link Health & Automated Repair Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal">
            Continuous verification, redirect resolution, and safe database link repairs across 3,100+ institutional endpoints, official scholarship portals, and application routes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleRunScan}
            disabled={scanning}
            className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Auditing Links...' : 'Scan All Links'}</span>
          </button>

          <button
            type="button"
            onClick={handleAutoRepair}
            disabled={autoRepairing || !stats || (stats.redirectCount === 0 && records.filter(r => r.repairStatus === 'PROPOSED').length === 0)}
            className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-2xs transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Wrench className={`w-3.5 h-3.5 ${autoRepairing ? 'animate-spin' : ''}`} />
            <span>{autoRepairing ? 'Repairing DB...' : 'Auto-Repair Batch'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-2xs transition-colors inline-flex items-center gap-1.5"
            title="Download full CSV report for compliance"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleOpenHistory}
            className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
            title="View scan execution logs"
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Logs</span>
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs sm:text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button type="button" onClick={() => setActionMessage(null)} className="text-teal-700 hover:text-teal-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Discovered</span>
          <p className="text-2xl font-bold font-heading text-slate-900 mt-1 tabular-nums">
            {stats ? stats.totalLinks.toLocaleString() : '—'}
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">DB models & routes</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Verified Working</span>
          <p className="text-2xl font-bold font-heading text-emerald-700 mt-1 tabular-nums">
            {stats ? stats.workingCount.toLocaleString() : '—'}
          </p>
          <span className="text-[10px] text-emerald-600 mt-0.5 block">200 OK endpoints</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">Redirects</span>
          <p className="text-2xl font-bold font-heading text-blue-700 mt-1 tabular-nums">
            {stats ? stats.redirectCount.toLocaleString() : '—'}
          </p>
          <span className="text-[10px] text-blue-500 mt-0.5 block">301/302 resolved</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">Broken (404)</span>
          <p className="text-2xl font-bold font-heading text-rose-700 mt-1 tabular-nums">
            {stats ? stats.brokenCount.toLocaleString() : '0'}
          </p>
          <span className="text-[10px] text-rose-500 mt-0.5 block">Needs immediate fix</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">Requires Review</span>
          <p className="text-2xl font-bold font-heading text-amber-700 mt-1 tabular-nums">
            {stats ? stats.reviewCount.toLocaleString() : '0'}
          </p>
          <span className="text-[10px] text-amber-600 mt-0.5 block">Cloudflare / timeouts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">Repaired in DB</span>
          <p className="text-2xl font-bold font-heading text-teal-800 mt-1 tabular-nums">
            {stats ? stats.repairedCount.toLocaleString() : '0'}
          </p>
          <span className="text-[10px] text-teal-600 mt-0.5 block">Saved & verified</span>
        </div>
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by URL, institution name, or source location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="WORKING">Working (200 OK)</option>
              <option value="WORKING_REDIRECT">Redirects</option>
              <option value="BROKEN">Broken (404/410)</option>
              <option value="ACCESS_RESTRICTED">Protected (403)</option>
              <option value="TIMEOUT">Timeouts</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white"
            >
              <option value="ALL">All Categories</option>
              <option value="UNIVERSITY">Universities (5,000+)</option>
              <option value="ADMISSIONS">Admissions (5,000+)</option>
              <option value="SCHOLARSHIP">Scholarships (20)</option>
              <option value="VISA">Visa Intelligence (57)</option>
              <option value="RESEARCH_DOI">Research DOIs (8)</option>
              <option value="ACADEMIC">Academic Requirements (22)</option>
              <option value="PORTAL">Country Portals (42)</option>
              <option value="NAVIGATION">Internal Routes (49)</option>
              <option value="CITATION">Citations (1,091)</option>
            </select>

            {/* Repair Status Filter */}
            <select
              value={selectedRepairStatus}
              onChange={(e) => { setSelectedRepairStatus(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white"
            >
              <option value="ALL">All Repairs</option>
              <option value="PROPOSED">Proposed Repairs</option>
              <option value="REPAIRED">Repaired in DB</option>
              <option value="REJECTED">Rejected</option>
              <option value="MANUAL_REVIEW">Manual Review</option>
            </select>

            {/* Destination Type Filter */}
            <select
              value={selectedDestType}
              onChange={(e) => { setSelectedDestType(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white"
            >
              <option value="ALL">Internal & External</option>
              <option value="INTERNAL">Internal Routes Only</option>
              <option value="EXTERNAL">External Websites Only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong className="text-slate-800">{records.length}</strong> of{' '}
            <strong className="text-slate-800">{total}</strong> audited records
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="font-semibold text-slate-700">
              Page {page} of {totalPages || 1}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 4. Audited Links Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Entity & Source Context</th>
                <th className="py-3.5 px-4">Original URL & Category</th>
                <th className="py-3.5 px-4">Status & Code</th>
                <th className="py-3.5 px-4">Repair Status & Candidate</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-600" />
                    <span>Loading audited link records...</span>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-semibold text-slate-800">No matching links found</p>
                    <p className="text-xs text-slate-400 mt-1">Adjust your filters or trigger a full scan above.</p>
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Entity & Source */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900 max-w-xs truncate" title={r.entityName || r.originalUrl}>
                        {r.entityName || 'Platform General'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
                        <Database className="w-3 h-3 text-slate-400" />
                        <span className="font-mono text-[10px] text-slate-600 truncate max-w-[200px]" title={r.sourceLocation}>
                          {r.sourceLocation}
                        </span>
                      </div>
                      {r.pageContext && (
                        <p className="text-[10px] text-teal-700 mt-0.5">
                          Context: {r.pageContext}
                        </p>
                      )}
                    </td>

                    {/* Original URL & Category */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={r.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[11px] text-slate-700 hover:text-teal-800 hover:underline max-w-[260px] truncate block"
                          title={r.originalUrl}
                        >
                          {r.originalUrl}
                        </a>
                        <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                          {r.category}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                          r.destinationType === 'INTERNAL' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-500'
                        }`}>
                          {r.destinationType}
                        </span>
                      </div>
                    </td>

                    {/* Status & Code */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(r.status)}
                      {r.httpStatus && (
                        <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">
                          HTTP {r.httpStatus} ({r.responseTimeMs || 0}ms)
                        </span>
                      )}
                      {r.redirectDestination && (
                        <div className="text-[10px] text-blue-600 mt-1 max-w-[200px] truncate" title={r.redirectDestination}>
                          ↳ {r.redirectDestination}
                        </div>
                      )}
                      {r.errorMessage && (
                        <p className="text-[10px] text-rose-600 mt-0.5 max-w-[180px] truncate" title={r.errorMessage}>
                          {r.errorMessage}
                        </p>
                      )}
                    </td>

                    {/* Repair Status & Candidate */}
                    <td className="py-3.5 px-4">
                      <div>
                        {getRepairBadge(r.repairStatus)}
                        {r.repairedUrl ? (
                          <div className="mt-1">
                            <span className="text-[10px] text-slate-500 block">Active in DB:</span>
                            <span className="font-mono text-[10px] text-teal-800 font-semibold block max-w-[220px] truncate" title={r.repairedUrl}>
                              {r.repairedUrl}
                            </span>
                          </div>
                        ) : r.suggestedReplacement ? (
                          <div className="mt-1">
                            <span className="text-[10px] text-slate-500 block">Proposed Target:</span>
                            <span className="font-mono text-[10px] text-purple-700 font-semibold block max-w-[220px] truncate" title={r.suggestedReplacement}>
                              {r.suggestedReplacement}
                            </span>
                          </div>
                        ) : null}
                        {r.repairReason && (
                          <p className="text-[10px] text-slate-400 mt-0.5 max-w-[200px] truncate" title={r.repairReason}>
                            {r.repairReason}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.repairStatus === 'PROPOSED' && (
                          <button
                            type="button"
                            onClick={() => handleApplySingleRepair(r)}
                            className="px-2.5 py-1 rounded-md bg-teal-700 hover:bg-teal-800 text-white font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs"
                            title="Apply proposed repair to database"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        )}

                        {r.repairStatus === 'PROPOSED' && (
                          <button
                            type="button"
                            onClick={() => handleRejectSingleRepair(r)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Reject proposed repair"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setEditingRecord(r);
                            setCandidateInput(r.suggestedReplacement || r.repairedUrl || r.originalUrl);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                          title="Edit candidate destination URL"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRetrySingle(r)}
                          className="p-1 rounded-md text-slate-400 hover:text-teal-700 hover:bg-slate-100"
                          title="Re-verify this link now"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Edit Candidate URL Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Edit Candidate Replacement URL
              </h3>
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Entity:</span>
                <span className="font-semibold text-slate-900">{editingRecord.entityName || 'Platform General'}</span>
              </div>

              <div>
                <span className="text-slate-500 block">Original URL:</span>
                <code className="text-slate-700 bg-slate-50 px-2 py-1 rounded block mt-0.5 break-all">
                  {editingRecord.originalUrl}
                </code>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  Verified Replacement Destination:
                </label>
                <input
                  type="url"
                  value={candidateInput}
                  onChange={(e) => setCandidateInput(e.target.value)}
                  placeholder="https://official-domain.edu/admissions"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-teal-700 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Must be an official institutional URL. This will be queued for approval or immediate repair.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCandidate}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-2xs"
              >
                Save Candidate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Scan History Drawer / Modal */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-700" />
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  Link Health Audit Execution History
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 text-xs">
              {historyList.length === 0 ? (
                <p className="text-slate-400 text-center py-6">No scan history recorded yet.</p>
              ) : (
                historyList.map((h) => (
                  <div key={h.id} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {new Date(h.createdAt).toLocaleString()}
                        </span>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                          {h.scanTrigger}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{h.notes}</p>
                    </div>
                    <div className="text-right tabular-nums">
                      <span className="font-bold text-slate-800 block text-xs">
                        {h.totalLinks} links in {h.durationSeconds}s
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        {h.workingCount} ok · {h.redirectCount} redirects · {h.brokenCount} broken
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="px-4 py-2 rounded-xl bg-brand-navy text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
