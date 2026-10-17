import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { InformationReportItem } from '../../types/index.js';
import {
  Flag,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  Send,
  Eye,
  Search,
  Filter,
  Check,
  X,
  History,
} from 'lucide-react';

export const AdminReportsManager: React.FC = () => {
  const { token, user } = useAuth();

  const [reports, setReports] = useState<InformationReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected report for review modal
  const [selectedReport, setSelectedReport] = useState<InformationReportItem | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'APPROVE' | 'REJECT' | 'REQUEST_MORE_INFO' | 'MARK_DISPUTED'>('APPROVE');
  const [adminFeedback, setAdminFeedback] = useState('');
  const [correctedValue, setCorrectedValue] = useState('');
  const [sourceEvidenceUrl, setSourceEvidenceUrl] = useState('');
  const [confirmedSafePublish, setConfirmedSafePublish] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchReportsQueue = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const query = new URLSearchParams();
      if (statusFilter !== 'all') query.append('status', statusFilter);
      if (categoryFilter !== 'all') query.append('category', categoryFilter);

      const res = await fetch(`/api/admin/reports/queue?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load admin reports queue.');
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error loading reports queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsQueue();
  }, [token, statusFilter, categoryFilter]);

  const openReviewModal = (
    report: InformationReportItem,
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_MORE_INFO' | 'MARK_DISPUTED'
  ) => {
    setSelectedReport(report);
    setReviewDecision(decision);
    setCorrectedValue(report.proposedCorrection || report.currentValue || '');
    setSourceEvidenceUrl(report.officialEvidenceUrl || '');
    setAdminFeedback('');
    setConfirmedSafePublish(false);
  };

  const handleExecuteDecision = async () => {
    if (!selectedReport || !token) return;

    if (reviewDecision === 'APPROVE' && !confirmedSafePublish) {
      alert('Please confirm that this factual change has been verified against official institution publications.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await fetch(`/api/admin/reports/${selectedReport.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          decision: reviewDecision,
          adminFeedback,
          correctedValue: reviewDecision === 'APPROVE' ? correctedValue : undefined,
          sourceEvidenceUrl: reviewDecision === 'APPROVE' ? sourceEvidenceUrl : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review decision.');

      setToastMessage(data.message || 'Decision applied successfully.');
      setSelectedReport(null);
      fetchReportsQueue();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (priorityFilter === 'high' && r.priority !== 'HIGH') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEntity = r.entityName.toLowerCase().includes(q);
      const matchNumber = r.reportNumber.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      return matchEntity || matchNumber || matchDesc;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs text-emerald-700 underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Reports ({reports.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PENDING_REVIEW')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'PENDING_REVIEW'
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Pending Review
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('RESUBMITTED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'RESUBMITTED'
                  ? 'bg-sky-700 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Resubmitted
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('MORE_INFO_REQUESTED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'MORE_INFO_REQUESTED'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Awaiting Evidence
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('APPROVED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'APPROVED'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Approved
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('REJECTED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'REJECTED'
                  ? 'bg-rose-700 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Rejected
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setPriorityFilter(priorityFilter === 'high' ? 'all' : 'high')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                priorityFilter === 'high'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              High Priority Only
            </button>

            <div className="relative">
              <input
                type="text"
                placeholder="Search queue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Queue List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Loading factual review queue...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm">
          {error}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="py-16 px-4 text-center bg-white rounded-2xl border border-slate-200">
          <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">Review queue is clear</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            All submitted community reports for this filter have been processed and resolved.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`bg-white rounded-2xl border p-6 transition-all ${
                report.priority === 'HIGH'
                  ? 'border-rose-200 shadow-xs'
                  : 'border-slate-200/90 shadow-xs'
              }`}
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-navy-950 bg-slate-100 px-2 py-0.5 rounded">
                    {report.reportNumber}
                  </span>
                  {report.priority === 'HIGH' && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-rose-600" /> High Priority
                    </span>
                  )}
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800">
                    {report.entityType}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Field: {report.fieldBelievedIncorrect}
                  </span>
                  <span className="text-xs text-slate-400">
                    Submitted: {new Date(report.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>

                <div className="text-xs font-bold">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      report.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : report.status === 'MORE_INFO_REQUESTED'
                        ? 'bg-amber-100 text-amber-800'
                        : report.status === 'RESUBMITTED'
                        ? 'bg-sky-100 text-sky-800'
                        : report.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-3">
                <h3 className="text-base font-bold text-navy-950 font-serif">
                  {report.entityName}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>Student description:</strong> {report.description}
                </p>
              </div>

              {/* Diff View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 block font-semibold">Current Public Value</span>
                  <p className="text-slate-800 font-mono mt-1 break-words">
                    {report.currentValue || 'None recorded'}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <span className="text-emerald-800 block font-semibold">Proposed Value</span>
                  <p className="text-emerald-950 font-mono font-bold mt-1 break-words">
                    {report.proposedCorrection || 'Factual error reported without replacement value'}
                  </p>
                </div>
              </div>

              {/* Evidence & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <a
                    href={report.officialEvidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:text-teal-800 font-bold inline-flex items-center gap-1 underline underline-offset-2"
                  >
                    Review Official Evidence URL <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {report.status !== 'APPROVED' && (
                    <>
                      <button
                        type="button"
                        onClick={() => openReviewModal(report, 'APPROVE')}
                        className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold inline-flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve & Update Data
                      </button>

                      <button
                        type="button"
                        onClick={() => openReviewModal(report, 'REQUEST_MORE_INFO')}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-semibold transition-colors"
                      >
                        Request Evidence
                      </button>

                      <button
                        type="button"
                        onClick={() => openReviewModal(report, 'MARK_DISPUTED')}
                        className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 font-semibold transition-colors"
                        title="Display 'Information Under Review' warning banner publicly"
                      >
                        Mark Disputed
                      </button>

                      <button
                        type="button"
                        onClick={() => openReviewModal(report, 'REJECT')}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold transition-colors"
                      >
                        <X className="w-3.5 h-3.5 inline mr-1" /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review & Safe Publication Confirmation Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-teal-50 text-teal-700">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-navy-950 font-serif">
                  {reviewDecision === 'APPROVE' && 'Confirm & Publish Public Correction'}
                  {reviewDecision === 'REQUEST_MORE_INFO' && 'Request Additional Evidence'}
                  {reviewDecision === 'MARK_DISPUTED' && 'Mark Public Record as Disputed'}
                  {reviewDecision === 'REJECT' && 'Reject Community Report'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div>
                <strong>Entity:</strong> {selectedReport.entityName} ({selectedReport.entityType})
              </div>
              <div>
                <strong>Report #:</strong> {selectedReport.reportNumber} • <strong>Field:</strong>{' '}
                {selectedReport.fieldBelievedIncorrect}
              </div>
            </div>

            {/* Decision Specific Fields */}
            {reviewDecision === 'APPROVE' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Final Verified Value to Publish:
                  </label>
                  <input
                    type="text"
                    value={correctedValue}
                    onChange={(e) => setCorrectedValue(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs focus:ring-1 focus:ring-teal-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Will update the live database record transactionally and write to immutable revision history.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Official Evidence URL (Permanent Attribution):
                  </label>
                  <input
                    type="url"
                    value={sourceEvidenceUrl}
                    onChange={(e) => setSourceEvidenceUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                {/* Explicit confirmation checkbox required by Safe Publication Rule */}
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmedSafePublish}
                      onChange={(e) => setConfirmedSafePublish(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-600"
                    />
                    <span className="text-xs text-teal-950 font-semibold">
                      I have verified this evidence directly against the institution's official portal. I understand this will update public student data immediately.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {reviewDecision !== 'APPROVE' && (
              <div className="space-y-3 text-xs">
                <label className="block text-slate-700 font-bold">
                  {reviewDecision === 'REQUEST_MORE_INFO'
                    ? 'Instructions / Missing Information for Student:'
                    : 'Decision Rationale:'}
                </label>
                <textarea
                  rows={3}
                  value={adminFeedback}
                  onChange={(e) => setAdminFeedback(e.target.value)}
                  placeholder="Explain the reason for this decision..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-600 focus:outline-none"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submittingReview}
                onClick={handleExecuteDecision}
                className={`px-5 py-2 rounded-xl text-white text-xs font-bold transition-colors ${
                  reviewDecision === 'APPROVE'
                    ? 'bg-teal-600 hover:bg-teal-700'
                    : reviewDecision === 'REJECT'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-navy-900 hover:bg-navy-800'
                }`}
              >
                {submittingReview ? 'Processing...' : 'Confirm Decision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
